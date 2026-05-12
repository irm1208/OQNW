import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { returnsTable, ordersTable } from "@workspace/db";
import { eq, desc, ilike, and, or, count } from "drizzle-orm";
import { sendReturnStatusUpdate } from "../../lib/email";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

const VALID_RETURN_STATUSES = ["requested", "approved", "refunded", "rejected"];

function returnToResponse(r: typeof returnsTable.$inferSelect) {
  return {
    id: r.id,
    orderId: r.orderId,
    orderNumber: r.orderNumber,
    customerName: r.customerName,
    customerEmail: r.customerEmail,
    reason: r.reason,
    status: r.status,
    refundAmountGbp: r.refundAmountGbp !== null ? parseFloat(String(r.refundAmountGbp)) : null,
    adminNotes: r.adminNotes ?? null,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  };
}

// GET /api/admin/returns — list all returns with optional search/status filter
router.get("/admin/returns", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const search = typeof req.query.search === "string" ? req.query.search : undefined;
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const offset = Number(req.query.offset) || 0;

  try {
    const conditions = [];
    if (status) conditions.push(eq(returnsTable.status, status));
    if (search) {
      conditions.push(
        or(
          ilike(returnsTable.orderNumber, `%${search}%`),
          ilike(returnsTable.customerName, `%${search}%`),
          ilike(returnsTable.customerEmail, `%${search}%`)
        )
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const [returns, totalRow] = await Promise.all([
      db.select().from(returnsTable).where(where).orderBy(desc(returnsTable.createdAt)).limit(limit).offset(offset),
      db.select({ cnt: count() }).from(returnsTable).where(where),
    ]);

    res.status(200).json({ returns: returns.map(returnToResponse), total: Number(totalRow[0]?.cnt ?? 0) });
  } catch (err) {
    req.log.error({ err }, "Failed to list returns");
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/admin/orders/:id/returns — returns for a specific order
router.get("/admin/orders/:id/returns", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const orderId = Number(req.params.id);
  if (!Number.isFinite(orderId)) { res.status(400).json({ error: "Invalid order ID" }); return; }
  try {
    const returns = await db.select().from(returnsTable).where(eq(returnsTable.orderId, orderId)).orderBy(desc(returnsTable.createdAt));
    res.status(200).json({ returns: returns.map(returnToResponse) });
  } catch (err) {
    req.log.error({ err }, "Failed to get order returns");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/orders/:id/returns — log a new return request
router.post("/admin/orders/:id/returns", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const orderId = Number(req.params.id);
  if (!Number.isFinite(orderId)) { res.status(400).json({ error: "Invalid order ID" }); return; }

  const { reason } = req.body as { reason?: string };
  if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
    res.status(400).json({ error: "reason is required" });
    return;
  }

  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId));
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    const [created] = await db.insert(returnsTable).values({
      orderId,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      reason: reason.trim(),
      status: "requested",
    }).returning();

    res.status(201).json(returnToResponse(created));
  } catch (err) {
    req.log.error({ err }, "Failed to create return");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /api/admin/returns/:id — update status, refund amount, admin notes
router.patch("/admin/returns/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const returnId = Number(req.params.id);
  if (!Number.isFinite(returnId)) { res.status(400).json({ error: "Invalid return ID" }); return; }

  const { status, refundAmountGbp, adminNotes } = req.body as {
    status?: string;
    refundAmountGbp?: number | null;
    adminNotes?: string | null;
  };

  if (status !== undefined && !VALID_RETURN_STATUSES.includes(status)) {
    res.status(400).json({ error: `status must be one of: ${VALID_RETURN_STATUSES.join(", ")}` });
    return;
  }

  try {
    const [existing] = await db.select().from(returnsTable).where(eq(returnsTable.id, returnId));
    if (!existing) { res.status(404).json({ error: "Return not found" }); return; }

    const updates: Partial<typeof returnsTable.$inferInsert> = { updatedAt: new Date() };
    if (status !== undefined) updates.status = status;
    if (refundAmountGbp !== undefined) updates.refundAmountGbp = refundAmountGbp !== null ? String(refundAmountGbp) : null;
    if (adminNotes !== undefined) updates.adminNotes = adminNotes ?? null;

    const [updated] = await db.update(returnsTable).set(updates).where(eq(returnsTable.id, returnId)).returning();

    // Fire status-change email if status changed to a terminal state
    if (status !== undefined && status !== existing.status && ["approved", "rejected", "refunded"].includes(status)) {
      sendReturnStatusUpdate({
        customerEmail: updated.customerEmail,
        customerName: updated.customerName,
        orderNumber: updated.orderNumber,
        status: status as "approved" | "rejected" | "refunded",
        refundAmountGbp: updated.refundAmountGbp !== null ? parseFloat(String(updated.refundAmountGbp)) : null,
        adminNotes: updated.adminNotes ?? null,
      }).catch(() => {});
    }

    res.status(200).json(returnToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update return");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
