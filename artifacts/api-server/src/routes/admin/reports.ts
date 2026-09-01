import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

const router = Router();

// Only count revenue from orders where payment has been confirmed and cleared.
// Hardcoded as a SQL literal — these statuses are fixed constants, not user input.
const PAID_STATUS_CLAUSE = sql.raw(
  `status IN ('payment_received', 'paid', 'processing', 'shipped', 'delivered')`
);
const PAID_STATUS_CLAUSE_O = sql.raw(
  `o.status IN ('payment_received', 'paid', 'processing', 'shipped', 'delivered')`
);

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function parseRange(req: Request): { from: Date; to: Date } {
  const now = new Date();
  const defFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const fromRaw = new Date(String(req.query.from));
  const toRaw = new Date(String(req.query.to));
  const from = isNaN(fromRaw.getTime()) ? defFrom : fromRaw;
  const to = isNaN(toRaw.getTime()) ? now : toRaw;
  to.setHours(23, 59, 59, 999);
  return { from, to };
}

router.get("/admin/reports/summary", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { from, to } = parseRange(req);
  try {
    const orderStats = await db.execute(sql`
      SELECT
        COALESCE(SUM(total_gbp), 0)::float AS revenue,
        COUNT(*)::int AS orders,
        COALESCE(AVG(total_gbp), 0)::float AS aov
      FROM orders
      WHERE created_at >= ${from.toISOString()} AND created_at <= ${to.toISOString()}
        AND ${PAID_STATUS_CLAUSE}
    `);
    const unitStats = await db.execute(sql`
      SELECT COALESCE(SUM(oi.quantity), 0)::int AS units
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.created_at >= ${from.toISOString()} AND o.created_at <= ${to.toISOString()}
        AND ${PAID_STATUS_CLAUSE_O}
    `);
    const customerStats = await db.execute(sql`
      SELECT COUNT(*)::int AS new_customers
      FROM customers
      WHERE created_at >= ${from.toISOString()} AND created_at <= ${to.toISOString()}
    `);
    const o = (orderStats.rows[0] ?? {}) as { revenue: number; orders: number; aov: number };
    const u = (unitStats.rows[0] ?? {}) as { units: number };
    const c = (customerStats.rows[0] ?? {}) as { new_customers: number };
    res.json({
      from: from.toISOString(),
      to: to.toISOString(),
      revenue: o.revenue ?? 0,
      orders: o.orders ?? 0,
      avgOrderValue: o.aov ?? 0,
      unitsSold: u.units ?? 0,
      newCustomers: c.new_customers ?? 0,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch report summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/reports/timeseries", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { from, to } = parseRange(req);
  try {
    const rows = await db.execute(sql`
      SELECT
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS date,
        COALESCE(SUM(total_gbp), 0)::float AS revenue,
        COUNT(*)::int AS orders
      FROM orders
      WHERE created_at >= ${from.toISOString()} AND created_at <= ${to.toISOString()}
        AND ${PAID_STATUS_CLAUSE}
      GROUP BY DATE_TRUNC('day', created_at)
      ORDER BY date ASC
    `);
    res.json(rows.rows ?? []);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch report timeseries");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/reports/top-products", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { from, to } = parseRange(req);
  try {
    const rows = await db.execute(sql`
      SELECT
        oi.product_id AS "productId",
        MAX(oi.product_name) AS "productName",
        SUM(oi.quantity)::int AS "unitsSold",
        SUM(oi.quantity * oi.price_gbp::numeric)::float AS "revenue"
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.created_at >= ${from.toISOString()} AND o.created_at <= ${to.toISOString()}
        AND ${PAID_STATUS_CLAUSE_O}
      GROUP BY oi.product_id
      ORDER BY "revenue" DESC
      LIMIT 20
    `);
    res.json(rows.rows ?? []);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch top products report");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/reports/by-category", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { from, to } = parseRange(req);
  try {
    const rows = await db.execute(sql`
      SELECT
        oi.product_category AS category,
        SUM(oi.quantity * oi.price_gbp::numeric)::float AS revenue,
        SUM(oi.quantity)::int AS "unitsSold",
        COUNT(DISTINCT oi.order_id)::int AS orders
      FROM order_items oi
      JOIN orders o ON o.id = oi.order_id
      WHERE o.created_at >= ${from.toISOString()} AND o.created_at <= ${to.toISOString()}
        AND ${PAID_STATUS_CLAUSE_O}
      GROUP BY oi.product_category
      ORDER BY revenue DESC
    `);
    res.json(rows.rows ?? []);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch category report");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
