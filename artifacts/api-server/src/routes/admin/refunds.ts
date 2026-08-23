import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { refundsLogTable, ordersTable, orderItemsTable, productsInventoryTable, inventoryAuditLogTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";
import { firstString } from "../../lib/query";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
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
    type: r.type,
    reason: r.reason,
    notes: r.notes ?? null,
    restoreInventory: r.restoreInventory,
    lineItems: r.lineItemsJson ? JSON.parse(r.lineItemsJson) : null,
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

  if (!amountGbp || amountGbp <= 0 || !reason) {
    res.status(400).json({ error: "amountGbp and reason are required" });
    return;
  }

  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1);
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    const orderTotal = parseFloat(String(order.totalGbp));
    const alreadyRefunded = parseFloat(String(order.refundedAmountGbp));
    const maxRefundable = orderTotal - alreadyRefunded;

    if (amountGbp > maxRefundable + 0.001) {
      res.status(400).json({
        error: `Refund amount £${amountGbp.toFixed(2)} exceeds maximum refundable amount £${maxRefundable.toFixed(2)}`
      });
      return;
    }

    const newRefundedTotal = Math.round((alreadyRefunded + amountGbp) * 100) / 100;
    const refundStatus = newRefundedTotal >= orderTotal - 0.001 ? "full" : "partial";

    const [refund] = await db
      .insert(refundsLogTable)
      .values({
        orderId,
        orderNumber: order.orderNumber,
        amountGbp: String(amountGbp),
        type: refundStatus,
        reason,
        notes: notes ?? null,
        restoreInventory: restoreInventory ?? false,
        lineItemsJson: lineItems ? JSON.stringify(lineItems) : null,
      })
      .returning();

    await db
      .update(ordersTable)
      .set({
        refundedAmountGbp: String(newRefundedTotal),
        refundStatus,
      })
      .where(eq(ordersTable.id, orderId));

    if (restoreInventory && lineItems && lineItems.length > 0) {
      for (const item of lineItems) {
        const [before] = await db
          .select({ stockLevel: productsInventoryTable.stockLevel })
          .from(productsInventoryTable)
          .where(eq(productsInventoryTable.productId, item.productId))
          .limit(1);
        const qBefore = before?.stockLevel ?? 0;
        await db
          .update(productsInventoryTable)
          .set({ stockLevel: sql`${productsInventoryTable.stockLevel} + ${item.quantity}` })
          .where(eq(productsInventoryTable.productId, item.productId));
        db.insert(inventoryAuditLogTable).values({
          productId: item.productId,
          productName: item.productName,
          changeType: "refund_restore",
          quantityBefore: qBefore,
          quantityAfter: qBefore + item.quantity,
          quantityChange: item.quantity,
          reason: `Stock restored via refund on order ${order.orderNumber}`,
          referenceId: order.orderNumber,
          referenceType: "refund",
        }).catch(() => {});
      }
    }

    res.status(201).json(refundToResponse(refund));
  } catch (err) {
    req.log.error({ err }, "Failed to create refund");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
