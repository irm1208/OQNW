import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable } from "@workspace/db";
import {
  ListAdminOrdersQueryParams,
  GetAdminOrderParams,
  UpdateAdminOrderParams,
  UpdateAdminOrderBody,
} from "@workspace/api-zod";
import { eq, ilike, and, desc, count, or, inArray } from "drizzle-orm";
import { sendOrderConfirmation, sendShippingNotification } from "../../lib/email";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function orderToResponse(o: typeof ordersTable.$inferSelect) {
  return {
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    customerEmail: o.customerEmail,
    customerName: o.customerName,
    customerId: o.customerId ?? null,
    subtotalGbp: parseFloat(String(o.subtotalGbp)),
    shippingCostGbp: parseFloat(String(o.shippingCostGbp)),
    totalGbp: parseFloat(String(o.totalGbp)),
    shippingMethod: o.shippingMethod ?? null,
    trackingNumber: o.trackingNumber ?? null,
    notes: o.notes ?? null,
    country: o.country ?? null,
    city: o.city ?? null,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

function escapeCsv(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsvRow(fields: unknown[]): string {
  return fields.map(escapeCsv).join(",");
}

// GET /api/admin/orders/export  — full CSV download (honours search/status filters)
router.get("/admin/orders/export", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const conditions = [];
    if (status) conditions.push(eq(ordersTable.status, status));
    if (search) {
      conditions.push(
        or(
          ilike(ordersTable.customerEmail, `%${search}%`),
          ilike(ordersTable.customerName, `%${search}%`),
          ilike(ordersTable.orderNumber, `%${search}%`)
        )
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const orders = await db
      .select()
      .from(ordersTable)
      .where(where)
      .orderBy(desc(ordersTable.createdAt));

    const header = toCsvRow([
      "Order Number", "Date", "Customer Name", "Customer Email",
      "Status", "Subtotal (£)", "Shipping (£)", "Total (£)",
      "Country", "City", "Postcode", "Address", "Tracking Number", "Notes",
    ]);

    const rows = orders.map((o) =>
      toCsvRow([
        o.orderNumber,
        new Date(o.createdAt).toLocaleDateString("en-GB"),
        o.customerName,
        o.customerEmail,
        o.status,
        parseFloat(String(o.subtotalGbp)).toFixed(2),
        parseFloat(String(o.shippingCostGbp)).toFixed(2),
        parseFloat(String(o.totalGbp)).toFixed(2),
        o.country ?? "",
        o.city ?? "",
        o.postcode ?? "",
        [o.address1, o.address2].filter(Boolean).join(", "),
        o.trackingNumber ?? "",
        o.notes ?? "",
      ])
    );

    const filename = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.status(200).send([header, ...rows].join("\r\n"));
  } catch (err) {
    req.log.error({ err }, "Failed to export orders CSV");
    res.status(500).json({ error: "Internal server error" });
  }
});

const VALID_STATUSES = ["pending", "processing", "shipped", "delivered", "cancelled"];

// POST /api/admin/orders/bulk-update — update status on multiple orders at once
router.post("/admin/orders/bulk-update", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { ids, status } = req.body as { ids: unknown; status: unknown };
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.some((id) => typeof id !== "number") ||
    typeof status !== "string" ||
    !VALID_STATUSES.includes(status)
  ) {
    res.status(400).json({ error: "Invalid payload: ids must be a non-empty number array and status must be valid" });
    return;
  }
  try {
    await db
      .update(ordersTable)
      .set({ status: status as typeof ordersTable.$inferSelect["status"], updatedAt: new Date() })
      .where(inArray(ordersTable.id, ids as number[]));
    res.status(200).json({ updated: ids.length });
  } catch (err) {
    req.log.error({ err }, "Failed to bulk-update orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/orders", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsed = ListAdminOrdersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { status, search, limit = 20, offset = 0 } = parsed.data;
  try {
    const conditions = [];
    if (status) conditions.push(eq(ordersTable.status, status));
    if (search) {
      conditions.push(
        or(
          ilike(ordersTable.customerEmail, `%${search}%`),
          ilike(ordersTable.customerName, `%${search}%`),
          ilike(ordersTable.orderNumber, `%${search}%`)
        )
      );
    }
    const where = conditions.length > 0 ? and(...conditions) : undefined;
    const [orders, totalRow] = await Promise.all([
      db
        .select()
        .from(ordersTable)
        .where(where)
        .orderBy(desc(ordersTable.createdAt))
        .limit(Number(limit))
        .offset(Number(offset)),
      db.select({ cnt: count() }).from(ordersTable).where(where),
    ]);
    res.status(200).json({
      orders: orders.map(orderToResponse),
      total: Number(totalRow[0]?.cnt ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/orders/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsed = GetAdminOrderParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }
  try {
    const [order] = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, parsed.data.id));
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, order.id));

    res.status(200).json({
      ...orderToResponse(order),
      address1: order.address1 ?? null,
      address2: order.address2 ?? null,
      county: order.county ?? null,
      postcode: order.postcode ?? null,
      phone: order.phone ?? null,
      items: items.map((item) => ({
        id: item.id,
        orderId: item.orderId,
        productId: item.productId,
        productName: item.productName,
        productCategory: item.productCategory,
        quantity: item.quantity,
        priceGbp: parseFloat(String(item.priceGbp)),
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/orders/:id/send-tracking", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid order ID" }); return; }
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }
    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    const emailData = {
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      items: items.map(i => ({
        productName: i.productName,
        productCategory: i.productCategory ?? "",
        quantity: i.quantity,
        priceGbp: parseFloat(String(i.priceGbp)),
      })),
      subtotalGbp: parseFloat(String(order.subtotalGbp)),
      shippingCostGbp: parseFloat(String(order.shippingCostGbp)),
      totalGbp: parseFloat(String(order.totalGbp)),
      shippingMethod: order.shippingMethod ?? null,
      trackingNumber: order.trackingNumber ?? null,
      address1: order.address1 ?? null,
      address2: order.address2 ?? null,
      city: order.city ?? null,
      postcode: order.postcode ?? null,
      country: order.country ?? null,
    };
    await sendShippingNotification(emailData);
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send tracking notification");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/orders/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const paramsParsed = UpdateAdminOrderParams.safeParse({ id: Number(req.params.id) });
  const bodyParsed = UpdateAdminOrderBody.safeParse(req.body);
  if (!paramsParsed.success || !bodyParsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }
  try {
    const previousOrder = await db
      .select()
      .from(ordersTable)
      .where(eq(ordersTable.id, paramsParsed.data.id))
      .then(rows => rows[0]);

    const updates: Partial<typeof ordersTable.$inferInsert> = {};
    const { status, trackingNumber, notes } = bodyParsed.data;
    if (status !== undefined) updates.status = status;
    if (trackingNumber !== undefined) updates.trackingNumber = trackingNumber;
    if (notes !== undefined) updates.notes = notes;

    const [updated] = await db
      .update(ordersTable)
      .set(updates)
      .where(eq(ordersTable.id, paramsParsed.data.id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.status(200).json(orderToResponse(updated));

    const statusChanged = previousOrder && status !== undefined && previousOrder.status !== status;
    if (statusChanged) {
      const items = await db
        .select()
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, updated.id));

      const emailData = {
        orderNumber: updated.orderNumber,
        customerName: updated.customerName,
        customerEmail: updated.customerEmail,
        items: items.map(i => ({
          productName: i.productName,
          productCategory: i.productCategory ?? "",
          quantity: i.quantity,
          priceGbp: parseFloat(String(i.priceGbp)),
        })),
        subtotalGbp: parseFloat(String(updated.subtotalGbp)),
        shippingCostGbp: parseFloat(String(updated.shippingCostGbp)),
        totalGbp: parseFloat(String(updated.totalGbp)),
        shippingMethod: updated.shippingMethod ?? null,
        trackingNumber: updated.trackingNumber ?? null,
        address1: updated.address1 ?? null,
        address2: updated.address2 ?? null,
        city: updated.city ?? null,
        postcode: updated.postcode ?? null,
        country: updated.country ?? null,
      };

      if (status === "processing") {
        sendOrderConfirmation(emailData).catch(() => {});
      } else if (status === "shipped") {
        sendShippingNotification(emailData).catch(() => {});
      }
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
