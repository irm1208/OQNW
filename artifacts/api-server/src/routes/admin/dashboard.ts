import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable, customersTable } from "@workspace/db";
import { sql, count, sum, eq, gte } from "drizzle-orm";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

router.get("/admin/dashboard", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const [totalRevenueRow] = await db
      .select({ total: sum(ordersTable.totalGbp) })
      .from(ordersTable);

    const [totalOrdersRow] = await db
      .select({ total: count() })
      .from(ordersTable);

    const [totalCustomersRow] = await db
      .select({ total: count() })
      .from(customersTable);

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
      .where(gte(ordersTable.createdAt, todayStart));

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
  try {
    const rows = await db.execute(sql`
      SELECT
        TO_CHAR(DATE_TRUNC('day', created_at), 'YYYY-MM-DD') AS date,
        COALESCE(SUM(total_gbp), 0)::float AS revenue,
        COUNT(*)::int AS orders
      FROM orders
      WHERE created_at >= NOW() - INTERVAL '30 days'
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
        product_id AS "productId",
        MAX(product_name) AS "productName",
        SUM(quantity)::int AS "totalSold",
        SUM(quantity * price_gbp::numeric)::float AS "totalRevenue"
      FROM order_items
      GROUP BY product_id
      ORDER BY "totalSold" DESC
      LIMIT 10
    `);
    res.status(200).json(rows.rows ?? rows);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch top products");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
