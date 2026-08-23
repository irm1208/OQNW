import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { returnsTable, ordersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  process.env.ADMIN_PASSWORD ??
  "omniqure-cust-session-fallback-secret";
const COOKIE_NAME = "customer_session";

function getCustomerId(req: Request): number | null {
  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!token) return null;
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  if (sig !== expected) return null;
  const id = parseInt(payload, 10);
  return isNaN(id) ? null : id;
}

const RETURNABLE_STATUSES = ["shipped", "delivered"];
const ACTIVE_RETURN_STATUSES = ["requested", "approved"];

// GET /returns — list returns for the authenticated customer
router.get("/returns", async (req: Request, res: Response): Promise<void> => {
  const customerId = getCustomerId(req);
  if (!customerId) { res.status(401).json({ error: "Not authenticated" }); return; }

  try {
    // Get all order IDs belonging to this customer
    const customerOrders = await db
      .select({ id: ordersTable.id })
      .from(ordersTable)
      .where(eq(ordersTable.customerId, customerId));

    if (customerOrders.length === 0) {
      res.json({ returns: [] });
      return;
    }

    const orderIds = customerOrders.map((o) => o.id);
    const { inArray } = await import("drizzle-orm");

    const returns = await db
      .select()
      .from(returnsTable)
      .where(inArray(returnsTable.orderId, orderIds))
      .orderBy(desc(returnsTable.createdAt));

    res.json({
      returns: returns.map((r) => ({
        id: r.id,
        orderId: r.orderId,
        orderNumber: r.orderNumber,
        reason: r.reason,
        status: r.status,
        refundAmountGbp: r.refundAmountGbp !== null ? parseFloat(String(r.refundAmountGbp)) : null,
        adminNotes: r.adminNotes ?? null,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list customer returns");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /returns — customer submits a return request
router.post("/returns", async (req: Request, res: Response): Promise<void> => {
  const customerId = getCustomerId(req);
  if (!customerId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const { orderNumber, reason } = req.body as { orderNumber?: unknown; reason?: unknown };

  if (typeof orderNumber !== "string" || !orderNumber.trim()) {
    res.status(400).json({ error: "orderNumber is required" });
    return;
  }
  if (typeof reason !== "string" || reason.trim().length < 10) {
    res.status(400).json({ error: "Please provide a reason (at least 10 characters)" });
    return;
  }

  try {
    // Verify the order belongs to this customer
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(and(eq(ordersTable.orderNumber, orderNumber.trim()), eq(ordersTable.customerId, customerId)))
      .limit(1);

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    if (!RETURNABLE_STATUSES.includes(order.status)) {
      res.status(400).json({ error: `Returns can only be requested for shipped or delivered orders (current status: ${order.status})` });
      return;
    }

    // Check for existing active return
    const [existingReturn] = await db
      .select({ id: returnsTable.id, status: returnsTable.status })
      .from(returnsTable)
      .where(eq(returnsTable.orderId, order.id))
      .limit(1);

    if (existingReturn && ACTIVE_RETURN_STATUSES.includes(existingReturn.status)) {
      res.status(409).json({ error: "A return request for this order is already in progress" });
      return;
    }

    const [created] = await db.insert(returnsTable).values({
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      reason: reason.trim(),
      status: "requested",
    }).returning();

    req.log.info({ returnId: created.id, orderNumber: order.orderNumber }, "Customer submitted return request");
    res.status(201).json({
      id: created.id,
      orderId: created.orderId,
      orderNumber: created.orderNumber,
      reason: created.reason,
      status: created.status,
      refundAmountGbp: null,
      adminNotes: null,
      createdAt: created.createdAt.toISOString(),
      updatedAt: created.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit return request");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
