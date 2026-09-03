import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { refundsLogTable, ordersTable, orderItemsTable, productsInventoryTable, inventoryAuditLogTable } from "@workspace/db";
import { and, eq, desc, sql } from "drizzle-orm";
import { firstString } from "../../lib/query";
import { sendReturnStatusUpdate } from "../../lib/email";
import { wallidPaymentIdFromNotes } from "../../lib/wallidReconciliation";
import {
  classifyConfirmedRefund,
  minorToMoney,
  moneyToMinor,
  remainingRefundableMinor,
  normalizeRefundSelection,
  resolveStoredRefundItems,
  reservedRefundQuantities,
  type RefundLineItem,
  type RefundOrderLine,
} from "../../lib/refundAccounting";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function refundToResponse(r: typeof refundsLogTable.$inferSelect) {
  return {
    id: r.id,
    orderId: r.orderId,
    orderNumber: r.orderNumber,
    amountGbp: parseFloat(String(r.amountGbp)),
    currency: r.currency,
    type: r.type,
    status: r.status,
    wallidRefundReference: r.wallidRefundReference ?? null,
    reason: r.reason,
    notes: r.notes ?? null,
    restoreInventory: r.restoreInventory,
    lineItems: safeLineItems(r.lineItemsJson),
    confirmedAt: r.confirmedAt?.toISOString() ?? null,
    createdAt: r.createdAt.toISOString(),
  };
}

router.get("/admin/refunds", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const refunds = await db
      .select()
      .from(refundsLogTable)
      .orderBy(desc(refundsLogTable.createdAt));
    res.json(refunds.map(refundToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list refunds");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/orders/:id/refunds", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const orderId = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(orderId)) { res.status(400).json({ error: "Invalid order ID" }); return; }
  try {
    const refunds = await db
      .select()
      .from(refundsLogTable)
      .where(eq(refundsLogTable.orderId, orderId))
      .orderBy(desc(refundsLogTable.createdAt));
    res.json(refunds.map(refundToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list order refunds");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/orders/:id/refund", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const orderId = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(orderId)) { res.status(400).json({ error: "Invalid order ID" }); return; }

  const { amountGbp, reason, notes, lineItems } = req.body as {
    amountGbp: number;
    reason: string;
    notes?: string;
    lineItems?: unknown;
  };

  const requestedMinor = moneyToMinor(amountGbp);
  if (!requestedMinor || typeof reason !== "string" || !reason.trim()) {
    res.status(400).json({ error: "amountGbp and reason are required" });
    return;
  }
  const selection = normalizeRefundSelection(lineItems);
  if (!selection) {
    res.status(400).json({ error: "lineItems must be an array of unique { orderItemId, quantity } selections" });
    return;
  }

  try {
    const refund = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT id FROM orders WHERE id = ${orderId} FOR UPDATE`);
      const [order] = await tx.select().from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1);
      if (!order) throw new RefundRequestError(404, "Order not found");
      if (!wallidPaymentIdFromNotes(order.notes)) {
        throw new RefundRequestError(400, "This order does not have a Wallid payment reference");
      }
      await tx.execute(sql`SELECT id FROM refunds_log WHERE order_id = ${orderId} FOR UPDATE`);
      await tx.execute(sql`SELECT id FROM order_items WHERE order_id = ${orderId} FOR UPDATE`);
      const lines = await tx.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, orderId));
      const activeRefunds = await tx.select({
        status: refundsLogTable.status, restoreInventory: refundsLogTable.restoreInventory, lineItemsJson: refundsLogTable.lineItemsJson,
      }).from(refundsLogTable).where(eq(refundsLogTable.orderId, orderId));
      const reservations = reservedRefundQuantities(lines as RefundOrderLine[], activeRefunds);
       if (selection.length > 0 && reservations.conflict) {
         throw new RefundRequestError(409, "Historical refund inventory data requires manual review");
       }
      const canonical: RefundLineItem[] = selection.map((selected) => {
        const line = lines.find((candidate) => candidate.id === selected.orderItemId);
        if (!line || line.productId <= 0) throw new RefundRequestError(400, "Selected item is not a stock-restorable order line");
        const available = line.quantity - (reservations.quantities.get(line.id) ?? 0);
        if (selected.quantity > available) throw new RefundRequestError(400, "Selected quantity exceeds the quantity available to restore");
        return { orderItemId: line.id, productId: line.productId, productName: line.productName, quantity: selected.quantity };
      });

      const [pending] = await tx
        .select({ total: sql<string>`COALESCE(SUM(${refundsLogTable.amountGbp}), 0)` })
        .from(refundsLogTable)
        .where(and(eq(refundsLogTable.orderId, orderId), eq(refundsLogTable.status, "pending")));
      const orderTotalMinor = moneyToMinor(order.totalGbp) ?? 0;
      const confirmedMinor = Math.round(Number(order.refundedAmountGbp) * 100);
      const pendingMinor = Math.round(Number(pending?.total ?? 0) * 100);
      const remainingMinor = remainingRefundableMinor(orderTotalMinor, confirmedMinor, pendingMinor);
      if (requestedMinor > remainingMinor) {
        const currency = order.paymentCurrency === "EUR" ? "EUR" : "GBP";
        throw new RefundRequestError(
          400,
          `Refund amount exceeds the remaining refundable amount of ${currency} ${minorToMoney(remainingMinor)}`,
        );
      }

      const currency = order.paymentCurrency === "EUR" ? "EUR" : "GBP";
      const refundType = requestedMinor >= remainingMinor ? "full" : "partial";
      const [created] = await tx
        .insert(refundsLogTable)
        .values({
          orderId,
          orderNumber: order.orderNumber,
          amountGbp: minorToMoney(requestedMinor),
          currency,
          type: refundType,
          status: "pending",
          reason: reason.trim(),
          notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
          restoreInventory: canonical.length > 0,
          lineItemsJson: canonical.length ? JSON.stringify(canonical) : null,
        })
        .returning();
      return created;
    });
    res.status(201).json(refundToResponse(refund));
  } catch (err) {
    if (err instanceof RefundRequestError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    req.log.error({ err }, "Failed to create refund");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/refunds/:id/confirm", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const refundId = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(refundId)) { res.status(400).json({ error: "Invalid refund ID" }); return; }
  const wallidRefundReference = typeof req.body?.wallidRefundReference === "string"
    ? req.body.wallidRefundReference.trim()
    : "";
  if (wallidRefundReference.length < 4 || wallidRefundReference.length > 200) {
    res.status(400).json({ error: "A valid Wallid refund reference is required" });
    return;
  }

  try {
    const [refundLookup] = await db
      .select({ orderId: refundsLogTable.orderId })
      .from(refundsLogTable)
      .where(eq(refundsLogTable.id, refundId))
      .limit(1);
    if (!refundLookup) {
      res.status(404).json({ error: "Refund not found" });
      return;
    }
    const result = await db.transaction(async (tx) => {
      // Refund creation locks order → refund rows → order items. Confirmation
      // follows the same order to avoid deadlocks with a new pending request.
      await tx.execute(sql`SELECT id FROM orders WHERE id = ${refundLookup.orderId} FOR UPDATE`);
      await tx.execute(sql`SELECT id FROM refunds_log WHERE order_id = ${refundLookup.orderId} ORDER BY id FOR UPDATE`);
      const [refund] = await tx.select().from(refundsLogTable).where(eq(refundsLogTable.id, refundId)).limit(1);
      if (!refund) throw new RefundRequestError(404, "Refund not found");
      if (refund.status === "confirmed") {
        if (refund.wallidRefundReference === wallidRefundReference) {
          return { refund, order: null, replayed: true };
        }
        throw new RefundRequestError(409, "This refund has already been confirmed");
      }
      if (refund.status !== "pending") {
        throw new RefundRequestError(409, "Only pending refunds can be confirmed");
      }

      const [order] = await tx.select().from(ordersTable).where(eq(ordersTable.id, refund.orderId)).limit(1);
      if (!order) throw new RefundRequestError(404, "Order not found");
      await tx.execute(sql`SELECT id FROM order_items WHERE order_id = ${refund.orderId} ORDER BY id FOR UPDATE`);
      const lines = await tx.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, refund.orderId));
      let currentItems: RefundLineItem[] = [];
      if (refund.restoreInventory) {
        const otherConfirmed = await tx.select({
          status: refundsLogTable.status, restoreInventory: refundsLogTable.restoreInventory, lineItemsJson: refundsLogTable.lineItemsJson,
        }).from(refundsLogTable).where(and(eq(refundsLogTable.orderId, refund.orderId), eq(refundsLogTable.status, "confirmed")));
        const current = resolveStoredRefundItems(lines as RefundOrderLine[], refund.lineItemsJson);
        if (current.conflict || current.items.length === 0) {
          throw new RefundRequestError(409, "Refund inventory selection is invalid");
        }
        const prior = reservedRefundQuantities(lines as RefundOrderLine[], otherConfirmed);
        if (prior.conflict) throw new RefundRequestError(409, "Historical refund inventory data requires manual review");
        for (const item of current.items) {
          const line = lines.find((candidate) => candidate.id === item.orderItemId);
          if (!line || item.quantity + (prior.quantities.get(item.orderItemId) ?? 0) > line.quantity) {
            throw new RefundRequestError(409, "Refund inventory selection would exceed the purchased quantity");
          }
        }
        currentItems = current.items;
      }

      const orderTotalMinor = moneyToMinor(order.totalGbp) ?? 0;
      const confirmedBeforeMinor = Math.round(Number(order.refundedAmountGbp) * 100);
      const refundMinor = moneyToMinor(refund.amountGbp) ?? 0;
      if (confirmedBeforeMinor + refundMinor > orderTotalMinor) {
        throw new RefundRequestError(409, "Confirming this refund would exceed the order total");
      }
      const refundType = classifyConfirmedRefund(orderTotalMinor, confirmedBeforeMinor, refundMinor);
      const confirmedAt = new Date();

      const [confirmed] = await tx
        .update(refundsLogTable)
        .set({
          status: "confirmed",
          type: refundType,
          wallidRefundReference,
          confirmedAt,
        })
        .where(eq(refundsLogTable.id, refundId))
        .returning();

      await tx
        .update(ordersTable)
        .set({
          refundedAmountGbp: minorToMoney(confirmedBeforeMinor + refundMinor),
          refundStatus: refundType,
        })
        .where(eq(ordersTable.id, refund.orderId));

      if (refund.restoreInventory && currentItems.length > 0) {
        const productIds = [...new Set(currentItems.map((item) => item.productId))].sort((a, b) => a - b);
        for (const productId of productIds) {
          await tx.execute(sql`SELECT product_id FROM products_inventory WHERE product_id = ${productId} FOR UPDATE`);
        }
        for (const item of currentItems) {
          const [before] = await tx
            .select({ stockLevel: productsInventoryTable.stockLevel })
            .from(productsInventoryTable)
            .where(eq(productsInventoryTable.productId, item.productId))
            .limit(1);
          const quantityBefore = before?.stockLevel ?? 0;
          const [updatedInventory] = await tx
            .update(productsInventoryTable)
            .set({ stockLevel: sql`${productsInventoryTable.stockLevel} + ${item.quantity}` })
            .where(eq(productsInventoryTable.productId, item.productId))
            .returning({ stockLevel: productsInventoryTable.stockLevel });
          if (!updatedInventory) {
            throw new RefundRequestError(409, `Inventory record is missing for ${item.productName}`);
          }
          await tx.insert(inventoryAuditLogTable).values({
            productId: item.productId,
            productName: item.productName,
            changeType: "refund_restore",
            quantityBefore,
            quantityAfter: updatedInventory.stockLevel,
            quantityChange: item.quantity,
            reason: `Stock restored after confirmed refund #${refund.id} on order ${order.orderNumber}`,
            referenceId: `${order.orderNumber}:refund:${refund.id}`,
            referenceType: "refund",
          });
        }
      }

      return { refund: confirmed, order, replayed: false };
    });

    if (result.order && !result.replayed) {
      sendReturnStatusUpdate({
        customerEmail: result.order.customerEmail,
        customerName: result.order.customerName,
        orderNumber: result.order.orderNumber,
        status: "refunded",
        refundAmountGbp: Number(result.refund.amountGbp),
        currency: result.refund.currency === "EUR" ? "EUR" : "GBP",
      }).catch((emailError) => {
        req.log.error({ err: emailError, refundId }, "Confirmed refund email failed");
      });
    }
    res.status(200).json(refundToResponse(result.refund));
  } catch (err) {
    if (err instanceof RefundRequestError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    if ((err as { code?: string }).code === "23505") {
      res.status(409).json({ error: "That Wallid refund reference has already been used" });
      return;
    }
    req.log.error({ err, refundId }, "Failed to confirm refund");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/refunds/:id/cancel", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const refundId = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(refundId)) { res.status(400).json({ error: "Invalid refund ID" }); return; }

  try {
    const [cancelled] = await db
      .update(refundsLogTable)
      .set({ status: "cancelled" })
      .where(and(eq(refundsLogTable.id, refundId), eq(refundsLogTable.status, "pending")))
      .returning();
    if (!cancelled) {
      res.status(409).json({ error: "Only pending refunds can be cancelled" });
      return;
    }
    res.status(200).json(refundToResponse(cancelled));
  } catch (err) {
    req.log.error({ err, refundId }, "Failed to cancel refund");
    res.status(500).json({ error: "Internal server error" });
  }
});

class RefundRequestError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
  }
}

function safeLineItems(value: string | null): RefundLineItem[] | null {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return null;
    const items: RefundLineItem[] = [];
    for (const raw of parsed) {
      if (!raw || typeof raw !== "object") return null;
      const item = raw as Record<string, unknown>;
      if (Number.isInteger(item.orderItemId) && Number.isInteger(item.productId) &&
        typeof item.productName === "string" && Number.isInteger(item.quantity)) {
        items.push({
          orderItemId: Number(item.orderItemId),
          productId: Number(item.productId),
          productName: item.productName,
          quantity: Number(item.quantity),
        });
      } else return null;
    }
    return items;
  } catch { return null; }
}

export default router;
