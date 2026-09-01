import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { ordersTable, customersTable } from "@workspace/db";
import { sql, count, sum, avg, gte, inArray, and } from "drizzle-orm";

const router = Router();

// Only count revenue from orders where payment has been confirmed and cleared.
// Hardcoded as a SQL literal — these statuses are fixed constants, not user input.
const PAID_STATUSES = ["payment_received", "paid", "processing", "shipped", "delivered"] as const;
const PAID_STATUS_SQL = sql.raw(
  `status IN ('payment_received', 'paid', 'processing', 'shipped', 'delivered')`
);
const PAID_STATUS_SQL_O = sql.raw(
  `o.status IN ('payment_received', 'paid', 'processing', 'shipped', 'delivered')`
);

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function parsePeriod(raw: unknown): number {
  const n = Number(raw);
  return [7, 30, 90, 365].includes(n) ? n : 30;
}

router.get("/admin/dashboard", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalRevenueRow] = await db
      .select({ total: sum(ordersTable.totalGbp) })
      .from(ordersTable)
      .where(inArray(ordersTable.status, PAID_STATUSES));

    const [totalOrdersRow] = await db
      .select({ total: count() })
      .from(ordersTable);

    const [totalCustomersRow] = await db
      .select({ total: count() })
      .from(customersTable);

    const [avgOrderRow] = await db
      .select({ avg: avg(ordersTable.totalGbp) })
      .from(ordersTable)
      .where(inArray(ordersTable.status, PAID_STATUSES));

    const statusCounts = await db
      .select({ status: ordersTable.status, cnt: count() })
      .from(ordersTable)
      .groupBy(ordersTable.status);

    const lowStockResult = await db.execute(sql`
      SELECT COUNT(*) AS cnt FROM products_inventory
      WHERE stock_level <= low_stock_threshold
    `);
    const lowStockRow = lowStockResult.rows[0] as { cnt: string } | undefined;

    const [revenueTodayRow] = await db
      .select({ total: sum(ordersTable.totalGbp) })
      .from(ordersTable)
      .where(and(gte(ordersTable.createdAt, todayStart), inArray(ordersTable.status, PAID_STATUSES)));

    const [ordersTodayRow] = await db
      .select({ total: count() })
      .from(ordersTable)
      .where(gte(ordersTable.createdAt, todayStart));

    const getCount = (status: string) =>
      statusCounts.find((s) => s.status === status)?.cnt ?? 0;

    res.status(200).json({
      totalRevenue: parseFloat(String(totalRevenueRow?.total ?? "0")),
      totalOrders: Number(totalOrdersRow?.total ?? 0),
      totalCustomers: Number(totalCustomersRow?.total ?? 0),
      avgOrderValue: parseFloat(String(avgOrderRow?.avg ?? "0")),
      pendingOrders: Number(getCount("pending")),
      processingOrders: Number(getCount("processing")),
      shippedOrders: Number(getCount("shipped")),
      lowStockCount: Number(lowStockRow?.cnt ?? 0),
      revenueToday: parseFloat(String(revenueTodayRow?.total ?? "0")),
      ordersToday: Number(ordersTodayRow?.total ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch dashboard stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/dashboard/revenue", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const period = parsePeriod(req.query.period);
  try {
    const rows = await db.execute(sql`
      SELECT
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS date,
        COALESCE(SUM(total_gbp), 0)::float AS revenue,
        COUNT(*)::int AS orders
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${period}
        AND ${PAID_STATUS_SQL}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date ASC
    `);
    res.status(200).json(rows.rows ?? rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch revenue chart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/dashboard/top-products", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const rows = await db.execute(sql`
      SELECT
        oi.product_id AS "productId",
        MAX(oi.product_name) AS "productName",
        SUM(oi.quantity)::int AS "totalSold",
        SUM(oi.quantity * oi.price_gbp::numeric)::float AS "totalRevenue"
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE ${PAID_STATUS_SQL_O}
      GROUP BY oi.product_id
      ORDER BY "totalSold" DESC
      LIMIT 10
    `);
    res.status(200).json(rows.rows ?? rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch top products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/dashboard/new-customers", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const period = parsePeriod(req.query.period);
  try {
    const rows = await db.execute(sql`
      SELECT
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS date,
        COUNT(*)::int AS "newCustomers"
      FROM customers
      WHERE created_at >= NOW() - INTERVAL '1 day' * ${period}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date ASC
    `);
    res.status(200).json(rows.rows ?? rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch new customers chart");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/dashboard/order-status", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const rows = await db
      .select({ status: ordersTable.status, count: count() })
      .from(ordersTable)
      .groupBy(ordersTable.status)
      .orderBy(ordersTable.status);
    res.status(200).json(rows.map((r) => ({ status: r.status, count: Number(r.count) })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch order status breakdown");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/dashboard/revenue-by-category", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const rows = await db.execute(sql`
      SELECT
        oi.product_category AS category,
        SUM(oi.quantity * oi.price_gbp::numeric)::float AS revenue,
        COUNT(DISTINCT oi.order_id)::int AS orders
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE ${PAID_STATUS_SQL_O}
      GROUP BY oi.product_category
      ORDER BY revenue DESC
    `);
    res.status(200).json(rows.rows ?? rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch revenue by category");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
