import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { productReviewsTable, loyaltyTransactionsTable } from "@workspace/db";
import { eq, desc, and, like, sql } from "drizzle-orm";
import { firstString } from "../../lib/query";

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

const router = Router();

router.get("/admin/reviews", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const status = firstString(req.query.status);
    const search = firstString(req.query.search);
    const page = firstString(req.query.page) ?? "1";
    const limit = firstString(req.query.limit) ?? "25";
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
    const offset = (pageNum - 1) * limitNum;

    const conditions = [];
    if (status === "pending") conditions.push(eq(productReviewsTable.isApproved, false));
    if (status === "approved") conditions.push(eq(productReviewsTable.isApproved, true));
    if (search) conditions.push(like(productReviewsTable.customerName, `%${search}%`));

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const reviews = await db
      .select()
      .from(productReviewsTable)
      .where(whereClause)
      .orderBy(desc(productReviewsTable.createdAt))
      .limit(limitNum)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`COUNT(*)::int` })
      .from(productReviewsTable)
      .where(whereClause);

    res.status(200).json({ reviews, total, page: pageNum, limit: limitNum });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch reviews");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/reviews/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid review ID" });
    return;
  }

  const { isApproved } = req.body as { isApproved: unknown };
  if (typeof isApproved !== "boolean") {
    res.status(400).json({ error: "isApproved must be a boolean" });
    return;
  }

  try {
    const [existing] = await db
      .select({ isApproved: productReviewsTable.isApproved, customerId: productReviewsTable.customerId, id: productReviewsTable.id })
      .from(productReviewsTable)
      .where(eq(productReviewsTable.id, id))
      .limit(1);

    if (!existing) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    const [updated] = await db
      .update(productReviewsTable)
      .set({ isApproved })
      .where(eq(productReviewsTable.id, id))
      .returning();

    // Award one-time bonus points the first time a review is approved
    if (isApproved && !existing.isApproved && existing.customerId) {
      const [alreadyAwarded] = await db
        .select({ id: loyaltyTransactionsTable.id })
        .from(loyaltyTransactionsTable)
        .where(eq(loyaltyTransactionsTable.description, `Bonus: review #${existing.id} approved`))
        .limit(1);
      if (!alreadyAwarded) {
        await db.insert(loyaltyTransactionsTable).values({
          customerId: existing.customerId,
          type: "earned",
          points: 50,
          description: `Bonus: review #${existing.id} approved`,
        }).catch((err) => req.log.error({ err }, "Failed to award review bonus points"));
      }
    }

    res.status(200).json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to update review");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/reviews/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid review ID" });
    return;
  }
  if (req.body?.confirmSpamDeletion !== true) {
    res.status(400).json({ error: "Permanent deletion requires explicit spam confirmation" });
    return;
  }

  try {
    const [review] = await db.select({ isApproved: productReviewsTable.isApproved })
      .from(productReviewsTable)
      .where(eq(productReviewsTable.id, id))
      .limit(1);
    if (!review) {
      res.status(404).json({ error: "Review not found" });
      return;
    }
    if (review.isApproved) {
      res.status(409).json({ error: "Hide an approved review before permanently deleting confirmed spam" });
      return;
    }
    const [deleted] = await db
      .delete(productReviewsTable)
      .where(eq(productReviewsTable.id, id))
      .returning({ id: productReviewsTable.id });

    if (!deleted) {
      res.status(404).json({ error: "Review not found" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete review");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
