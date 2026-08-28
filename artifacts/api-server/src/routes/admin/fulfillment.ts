import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable } from "@workspace/db";
import { eq, inArray, desc, count } from "drizzle-orm";
import { generatePackingSlipHtml, generateMultiPackingSlipHtml } from "../../lib/packingSlip";
import { firstString } from "../../lib/query";
import { hasSecureAdminSession } from "./auth";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (!hasSecureAdminSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

const READY_STATUSES = ["paid", "payment_received"] as const;

/**
 * GET /api/admin/fulfillment
 * Returns orders that need picking/packing (status: paid | payment_received),
 * oldest first, with line items included.
 */
router.get("/admin/fulfillment", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const tab    = firstString(req.query.tab) ?? "ready";
  const limit  = Math.min(parseInt(firstString(req.query.limit)  ?? "50", 10), 100);
  const offset = parseInt(firstString(req.query.offset) ?? "0", 10);

  let statusFilter: string[];
  if (tab === "processing") {
    statusFilter = ["processing"];
  } else if (tab === "shipped") {
    statusFilter = ["shipped"];
  } else {
    statusFilter = [...READY_STATUSES];
  }

  try {
    const where = inArray(ordersTable.status, statusFilter);

    const [orders, totalRow] = await Promise.all([
      db
        .select()
        .from(ordersTable)
        .where(where)
        .orderBy(desc(ordersTable.createdAt))
        .limit(limit)
        .offset(offset),
      db.select({ cnt: count() }).from(ordersTable).where(where),
    ]);

    // Fetch items for all returned orders in one query
    const orderIds = orders.map(o => o.id);
    const allItems = orderIds.length > 0
      ? await db.select().from(orderItemsTable).where(inArray(orderItemsTable.orderId, orderIds))
      : [];

    const itemsByOrder = new Map<number, typeof allItems>();
    for (const item of allItems) {
      const list = itemsByOrder.get(item.orderId) ?? [];
      list.push(item);
      itemsByOrder.set(item.orderId, list);
    }

    const result = orders.map(o => ({
      id:             o.id,
      orderNumber:    o.orderNumber,
      status:         o.status,
      customerName:   o.customerName,
      customerEmail:  o.customerEmail,
      phone:          o.phone          ?? null,
      address1:       o.address1       ?? null,
      address2:       o.address2       ?? null,
      city:           o.city           ?? null,
      county:         o.county         ?? null,
      postcode:       o.postcode       ?? null,
      country:        o.country        ?? null,
      shippingMethod: o.shippingMethod ?? null,
      carrierName:    o.carrierName    ?? null,
      trackingNumber: o.trackingNumber ?? null,
      trackingUrl:    o.trackingUrl    ?? null,
      subtotalGbp:    parseFloat(String(o.subtotalGbp)),
      shippingCostGbp:parseFloat(String(o.shippingCostGbp)),
      totalGbp:       parseFloat(String(o.totalGbp)),
      notes:          o.notes          ?? null,
      createdAt:      o.createdAt.toISOString(),
      items: (itemsByOrder.get(o.id) ?? []).map(i => ({
        id:              i.id,
        productName:     i.productName,
        productCategory: i.productCategory ?? null,
        quantity:        i.quantity,
        priceGbp:        parseFloat(String(i.priceGbp)),
      })),
    }));

    res.status(200).json({ orders: result, total: Number(totalRow[0]?.cnt ?? 0) });
  } catch (err) {
    req.log.error({ err }, "Failed to list fulfillment orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/admin/orders/:id/packing-slip
 * Returns a printable HTML packing slip for a single order.
 */
router.get("/admin/orders/:id/packing-slip", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid order ID" }); return; }

  try {
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));
    if (!order) { res.status(404).json({ error: "Order not found" }); return; }

    const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, id));

    const html = generatePackingSlipHtml(order, items);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (err) {
    req.log.error({ err }, "Failed to generate packing slip");
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/admin/fulfillment/packing-slips
 * Body: { ids: number[] }
 * Returns a single printable HTML document containing all requested orders.
 */
router.post("/admin/fulfillment/packing-slips", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;

  const { ids } = req.body as { ids: unknown };
  if (!Array.isArray(ids) || ids.length === 0 || ids.some(id => typeof id !== "number")) {
    res.status(400).json({ error: "ids must be a non-empty array of numbers" });
    return;
  }

  try {
    const orders = await db
      .select()
      .from(ordersTable)
      .where(inArray(ordersTable.id, ids as number[]));

    const allItems = await db
      .select()
      .from(orderItemsTable)
      .where(inArray(orderItemsTable.orderId, ids as number[]));

    const itemsByOrder = new Map<number, typeof allItems>();
    for (const item of allItems) {
      const list = itemsByOrder.get(item.orderId) ?? [];
      list.push(item);
      itemsByOrder.set(item.orderId, list);
    }

    // Preserve requested order
    const sorted = (ids as number[])
      .map(id => orders.find(o => o.id === id))
      .filter(Boolean) as typeof orders;

    const html = generateMultiPackingSlipHtml(
      sorted.map(o => ({ order: o, items: itemsByOrder.get(o.id) ?? [] }))
    );

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).send(html);
  } catch (err) {
    req.log.error({ err }, "Failed to generate bulk packing slips");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
