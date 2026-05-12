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
import { eq, ilike, and, desc, count, or } from "drizzle-orm";
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
