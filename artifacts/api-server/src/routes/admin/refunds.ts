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
    lineItems: r.lineItemsJson ? JSON.parse(r.lineItemsJson) : null,
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

  const { amountGbp, reason, notes, restoreInventory, lineItems } = req.body as {
    amountGbp: number;
    reason: string;
    notes?: string;
    restoreInventory?: boolean;
    lineItems?: { productId: number; quantity: number; productName: string }[];
  };

  const requestedMinor = moneyToMinor(amountGbp);
  if (!requestedMinor || typeof reason !== "string" || !reason.trim()) {
    res.status(400).json({ error: "amountGbp and reason are required" });
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
          restoreInventory: restoreInventory ?? false,
          lineItemsJson: lineItems ? JSON.stringify(lineItems) : null,
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
    const result = await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT id FROM refunds_log WHERE id = ${refundId} FOR UPDATE`);

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

      await tx.execute(sql`SELECT id FROM orders WHERE id = ${refund.orderId} FOR UPDATE`);
      const [order] = await tx.select().from(ordersTable).where(eq(ordersTable.id, refund.orderId)).limit(1);
      if (!order) throw new RefundRequestError(404, "Order not found");

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

      const lineItems = refund.lineItemsJson
        ? JSON.parse(refund.lineItemsJson) as { productId: number; quantity: number; productName: string }[]
        : [];
      if (refund.restoreInventory && lineItems.length > 0) {
        for (const item of lineItems) {
          const [before] = await tx
            .select({ stockLevel: productsInventoryTable.stockLevel })
            .from(productsInventoryTable)
            .where(eq(productsInventoryTable.productId, item.productId))
            .limit(1);
          const quantityBefore = before?.stockLevel ?? 0;
          await tx
            .update(productsInventoryTable)
            .set({ stockLevel: sql`${productsInventoryTable.stockLevel} + ${item.quantity}` })
            .where(eq(productsInventoryTable.productId, item.productId));
          await tx.insert(inventoryAuditLogTable).values({
            productId: item.productId,
            productName: item.productName,
            changeType: "refund_restore",
            quantityBefore,
            quantityAfter: quantityBefore + item.quantity,
            quantityChange: item.quantity,
            reason: `Stock restored after confirmed refund on order ${order.orderNumber}`,
            referenceId: order.orderNumber,
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

export default router;
