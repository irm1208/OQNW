import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db/schema";
import { eq, gte, and, desc } from "drizzle-orm";
import { firstString } from "../../lib/query";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

router.get("/admin/fraud", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const minScore = Math.max(1, parseInt(String(req.query.minScore ?? "20"), 10) || 20);
    const reviewedParam = req.query.reviewed;
    const limit = Math.min(parseInt(String(req.query.limit ?? "100"), 10) || 100, 500);
    const offset = parseInt(String(req.query.offset ?? "0"), 10) || 0;

    const baseCondition = gte(ordersTable.fraudScore, minScore);

    let whereCondition;
    if (reviewedParam === "true") {
      whereCondition = and(baseCondition, eq(ordersTable.fraudReviewed, true));
    } else if (reviewedParam === "false") {
      whereCondition = and(baseCondition, eq(ordersTable.fraudReviewed, false));
    } else {
      whereCondition = baseCondition;
    }

    const [orders, allFlagged] = await Promise.all([
      db
        .select({
          id: ordersTable.id,
          orderNumber: ordersTable.orderNumber,
          status: ordersTable.status,
          customerName: ordersTable.customerName,
          customerEmail: ordersTable.customerEmail,
          country: ordersTable.country,
          totalGbp: ordersTable.totalGbp,
          fraudScore: ordersTable.fraudScore,
          fraudFlags: ordersTable.fraudFlags,
          fraudReviewed: ordersTable.fraudReviewed,
          fraudReviewNote: ordersTable.fraudReviewNote,
          notes: ordersTable.notes,
          createdAt: ordersTable.createdAt,
        })
        .from(ordersTable)
        .where(whereCondition)
        .orderBy(desc(ordersTable.fraudScore), desc(ordersTable.createdAt))
        .limit(limit)
        .offset(offset),

      db
        .select({
          fraudScore: ordersTable.fraudScore,
          fraudReviewed: ordersTable.fraudReviewed,
        })
        .from(ordersTable)
        .where(gte(ordersTable.fraudScore, minScore)),
    ]);

    const stats = {
      total: allFlagged.length,
      highRisk: allFlagged.filter(o => (o.fraudScore ?? 0) >= 50).length,
      mediumRisk: allFlagged.filter(
        o => (o.fraudScore ?? 0) >= 25 && (o.fraudScore ?? 0) < 50,
      ).length,
      reviewed: allFlagged.filter(o => o.fraudReviewed).length,
    };

    res.json({
      orders: orders.map(o => ({
        ...o,
        totalGbp: parseFloat(String(o.totalGbp)),
        createdAt: o.createdAt?.toISOString() ?? new Date().toISOString(),
      })),
      stats,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch fraud queue");
    res.status(500).json({ error: "Failed to fetch fraud queue" });
  }
});

router.patch(
  "/admin/fraud/:id/review",
  async (req: Request, res: Response): Promise<void> => {
    if (!requireAdmin(req, res)) return;
    try {
      const id = parseInt(firstString(req.params.id) ?? "", 10);
      if (!id) {
        res.status(400).json({ error: "Invalid order ID" });
        return;
      }
      const { reviewed, note } = req.body as { reviewed?: boolean; note?: string };

      await db
        .update(ordersTable)
        .set({
          fraudReviewed: reviewed !== false,
          fraudReviewNote:
            typeof note === "string" ? note.trim() || null : null,
        })
        .where(eq(ordersTable.id, id));

      res.json({ ok: true });
    } catch (err) {
      req.log.error({ err }, "Failed to update fraud review");
      res.status(500).json({ error: "Failed to update fraud review" });
    }
  },
);

export default router;
