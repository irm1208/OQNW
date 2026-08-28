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
import { eq, ilike, and, desc, count, or, inArray, isNull, isNotNull, notInArray } from "drizzle-orm";
import { sendOrderConfirmation, sendShippingNotification, sendDeliveryConfirmation } from "../../lib/email";
import { firstString } from "../../lib/query";
import {
  DISPATCHABLE_ORDER_STATUSES,
  DISPATCHED_ORDER_STATUSES,
  isAllowedAdminStatusTransition,
  validateDispatchDetails,
} from "../../lib/tracking";
import { hasSecureAdminSession } from "./auth";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (!hasSecureAdminSession(req)) {
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
    carrierName: o.carrierName ?? null,
    trackingNumber: o.trackingNumber ?? null,
    trackingUrl: o.trackingUrl ?? null,
    notes: o.notes ?? null,
    country: o.country ?? null,
    city: o.city ?? null,
    phone: o.phone ?? null,
    address1: o.address1 ?? null,
    postcode: o.postcode ?? null,
    refundedAmountGbp: parseFloat(String(o.refundedAmountGbp ?? 0)),
    refundStatus: o.refundStatus ?? "none",
    fraudScore: o.fraudScore ?? 0,
    fraudFlags: o.fraudFlags ?? [],
    fraudReviewed: o.fraudReviewed ?? false,
    fraudReviewNote: o.fraudReviewNote ?? null,
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

const VALID_STATUSES = ["pending", "awaiting_payment", "paid", "payment_received", "processing", "shipped", "delivered", "cancelled"];

// POST /api/admin/orders/bulk-update — update status on multiple orders at once
router.post("/admin/orders/bulk-update", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { ids, status } = req.body as { ids: unknown; status: unknown };
  if (
    !Array.isArray(ids) ||
    ids.length === 0 ||
    ids.some((id) => typeof id !== "number") ||
    typeof status !== "string" ||
    !VALID_STATUSES.includes(status) ||
    status === "shipped" ||
    status === "delivered"
  ) {
    res.status(400).json({ error: "Invalid payload. Orders must be dispatched individually with tracking details." });
    return;
  }
  try {
    const updated = await db
      .update(ordersTable)
      .set({ status: status as typeof ordersTable.$inferSelect["status"], updatedAt: new Date() })
      .where(and(
        inArray(ordersTable.id, ids as number[]),
        notInArray(ordersTable.status, [...DISPATCHED_ORDER_STATUSES]),
      ))
      .returning({ id: ordersTable.id });
    res.status(200).json({ updated: updated.length });
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

// POST /api/admin/orders/:id/send-confirmation — resend order confirmation email
router.post("/admin/orders/:id/send-confirmation", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid order ID" }); return; }
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }
    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    await sendOrderConfirmation({
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
    });
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to resend order confirmation");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/admin/orders/:id/send-delivery — send delivery confirmation email
router.post("/admin/orders/:id/send-delivery", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid order ID" }); return; }
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }
    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));
    await sendDeliveryConfirmation({
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
    });
    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send delivery confirmation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/orders/:id/send-tracking", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid order ID" }); return; }
  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }
    if (!DISPATCHED_ORDER_STATUSES.includes(order.status as never)) {
      res.status(409).json({ error: "Shipping notifications can only be resent after dispatch" });
      return;
    }
    const dispatch = validateDispatchDetails(order);
    if (!dispatch.ok) {
      res.status(409).json({ error: "Complete valid tracking details before resending the notification" });
      return;
    }
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
      carrierName: order.carrierName ?? null,
      trackingNumber: order.trackingNumber ?? null,
      trackingUrl: order.trackingUrl ?? null,
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

router.post("/admin/orders/:id/dispatch", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }
  const dispatch = validateDispatchDetails(req.body);
  if (!dispatch.ok) {
    res.status(400).json({ error: dispatch.error });
    return;
  }

  try {
    const [updated] = await db
      .update(ordersTable)
      .set({
        status: "shipped",
        carrierName: dispatch.value.carrierName,
        trackingNumber: dispatch.value.trackingNumber,
        trackingUrl: dispatch.value.trackingUrl,
        dispatchedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(
        eq(ordersTable.id, id),
        inArray(ordersTable.status, [...DISPATCHABLE_ORDER_STATUSES]),
        isNull(ordersTable.dispatchedAt),
      ))
      .returning();

    if (!updated) {
      const [current] = await db
        .select({ status: ordersTable.status })
        .from(ordersTable)
        .where(eq(ordersTable.id, id))
        .limit(1);
      if (!current) {
        res.status(404).json({ error: "Order not found" });
      } else if (current.status === "shipped" || current.status === "delivered") {
        res.status(409).json({ error: "This order has already been dispatched" });
      } else {
        res.status(409).json({ error: "This order is not ready to dispatch" });
      }
      return;
    }

    const items = await db
      .select()
      .from(orderItemsTable)
      .where(eq(orderItemsTable.orderId, updated.id));
    let emailSent = true;
    let warning: string | null = null;
    try {
      await sendShippingNotification({
        orderNumber: updated.orderNumber,
        customerName: updated.customerName,
        customerEmail: updated.customerEmail,
        items: items.map((item) => ({
          productName: item.productName,
          productCategory: item.productCategory ?? "",
          quantity: item.quantity,
          priceGbp: Number(item.priceGbp),
        })),
        subtotalGbp: Number(updated.subtotalGbp),
        shippingCostGbp: Number(updated.shippingCostGbp),
        totalGbp: Number(updated.totalGbp),
        shippingMethod: updated.shippingMethod,
        carrierName: updated.carrierName,
        trackingNumber: updated.trackingNumber,
        trackingUrl: updated.trackingUrl,
        address1: updated.address1,
        address2: updated.address2,
        city: updated.city,
        postcode: updated.postcode,
        country: updated.country,
      });
    } catch (emailError) {
      emailSent = false;
      warning = "Order dispatched, but the customer email could not be sent. Use Resend Emails to try again.";
      req.log.error(
        { emailError, orderNumber: updated.orderNumber },
        "Dispatch persisted but shipping notification failed",
      );
    }

    res.status(emailSent ? 200 : 202).json({
      order: orderToResponse(updated),
      emailSent,
      warning,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to dispatch order");
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
    const { status, carrierName, trackingNumber, trackingUrl, notes } = bodyParsed.data;
    if (status === "shipped") {
      res.status(400).json({ error: "Use the dispatch action to mark an order shipped" });
      return;
    }
    if (
      previousOrder &&
      status !== undefined &&
      !isAllowedAdminStatusTransition(previousOrder.status, status)
    ) {
      res.status(409).json({ error: `Order status cannot move from ${previousOrder.status} to ${status}` });
      return;
    }
    if (status !== undefined) updates.status = status;
    if (carrierName !== undefined || trackingNumber !== undefined || trackingUrl !== undefined) {
      const tracking = validateDispatchDetails({
        carrierName: carrierName ?? previousOrder?.carrierName,
        trackingNumber: trackingNumber ?? previousOrder?.trackingNumber,
        trackingUrl: trackingUrl ?? previousOrder?.trackingUrl,
      });
      if (!tracking.ok) {
        res.status(400).json({ error: tracking.error });
        return;
      }
      updates.carrierName = tracking.value.carrierName;
      updates.trackingNumber = tracking.value.trackingNumber;
      updates.trackingUrl = tracking.value.trackingUrl;
    }
    if (notes !== undefined) updates.notes = notes;
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: "No changes supplied" });
      return;
    }

    const updateWhere = status === "delivered"
      ? and(
          eq(ordersTable.id, paramsParsed.data.id),
          eq(ordersTable.status, "shipped"),
          isNotNull(ordersTable.dispatchedAt),
        )
      : eq(ordersTable.id, paramsParsed.data.id);
    const [updated] = await db
      .update(ordersTable)
      .set(updates)
      .where(updateWhere)
      .returning();

    if (!updated) {
      if (previousOrder) {
        res.status(409).json({ error: "Order status changed before this update could be applied" });
      } else {
        res.status(404).json({ error: "Order not found" });
      }
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

      if (status === "payment_received") {
        sendOrderConfirmation(emailData).catch(() => {});
      } else if (status === "processing" && previousOrder.status === "awaiting_payment") {
        sendOrderConfirmation(emailData).catch(() => {});
      } else if (status === "delivered") {
        sendDeliveryConfirmation(emailData).catch(() => {});
      }
    }
  } catch (err) {
    req.log.error({ err }, "Failed to update order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
