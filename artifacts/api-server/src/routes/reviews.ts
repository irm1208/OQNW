import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { productReviewsTable, customersTable, ordersTable, orderItemsTable } from "@workspace/db";
import { eq, and, desc, avg, count, sql } from "drizzle-orm";
import { firstString } from "../lib/query";

const router = Router();

const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  process.env.ADMIN_PASSWORD ??
  "omniqure-cust-session-fallback-secret";
const COOKIE_NAME = "customer_session";

function verifyCustomerSession(token: string): number | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("hex");
  if (sig !== expected) return null;
  const id = parseInt(payload, 10);
  return isNaN(id) ? null : id;
}

router.get("/products/:productId/reviews", async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(firstString(req.params.productId) ?? "", 10);
  if (isNaN(productId)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  try {
    const reviews = await db
      .select({
        id: productReviewsTable.id,
        customerId: productReviewsTable.customerId,
        customerName: productReviewsTable.customerName,
        rating: productReviewsTable.rating,
        title: productReviewsTable.title,
        body: productReviewsTable.body,
        createdAt: productReviewsTable.createdAt,
      })
      .from(productReviewsTable)
      .where(
        and(
          eq(productReviewsTable.productId, productId),
          eq(productReviewsTable.isApproved, true),
        ),
      )
      .orderBy(desc(productReviewsTable.createdAt));

    const [summary] = await db
      .select({
        avgRating: avg(productReviewsTable.rating),
        totalCount: count(productReviewsTable.id),
      })
      .from(productReviewsTable)
      .where(
        and(
          eq(productReviewsTable.productId, productId),
          eq(productReviewsTable.isApproved, true),
        ),
      );

    const breakdown = await db
      .select({
        rating: productReviewsTable.rating,
        cnt: count(productReviewsTable.id),
      })
      .from(productReviewsTable)
      .where(
        and(
          eq(productReviewsTable.productId, productId),
          eq(productReviewsTable.isApproved, true),
        ),
      )
      .groupBy(productReviewsTable.rating);

    // Check if the authenticated customer has already reviewed this product
    let myReview: { id: number; rating: number; title: string; body: string; isApproved: boolean } | null = null;
    const token = req.cookies?.[COOKIE_NAME] as string | undefined;
    if (token) {
      const customerId = verifyCustomerSession(token);
      if (customerId) {
        const [existing] = await db
          .select({
            id: productReviewsTable.id,
            rating: productReviewsTable.rating,
            title: productReviewsTable.title,
            body: productReviewsTable.body,
            isApproved: productReviewsTable.isApproved,
          })
          .from(productReviewsTable)
          .where(
            and(
              eq(productReviewsTable.productId, productId),
              eq(productReviewsTable.customerId, customerId),
            ),
          )
          .limit(1);
        if (existing) myReview = existing;
      }
    }

    // Check if authenticated customer has purchased this product
    let hasPurchased = false;
    if (token) {
      const customerId = verifyCustomerSession(token);
      if (customerId) {
        const [purchase] = await db
          .select({ id: orderItemsTable.id })
          .from(orderItemsTable)
          .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
          .where(
            and(
              eq(ordersTable.customerId, customerId),
              eq(orderItemsTable.productId, productId),
            ),
          )
          .limit(1);
        hasPurchased = !!purchase;
      }
    }

    const breakdownMap: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const row of breakdown) {
      breakdownMap[row.rating] = Number(row.cnt);
    }

    res.status(200).json({
      reviews,
      summary: {
        avgRating: summary?.avgRating ? parseFloat(Number(summary.avgRating).toFixed(1)) : null,
        totalCount: Number(summary?.totalCount ?? 0),
        breakdown: breakdownMap,
      },
      myReview,
      hasPurchased,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to fetch reviews");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/products/:productId/reviews", async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(firstString(req.params.productId) ?? "", 10);
  if (isNaN(productId)) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }

  const token = req.cookies?.[COOKIE_NAME] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const customerId = verifyCustomerSession(token);
  if (!customerId) {
    res.status(401).json({ error: "Invalid session" });
    return;
  }

  const { rating, title, body } = req.body as {
    rating: unknown;
    title: unknown;
    body: unknown;
  };

  if (
    typeof rating !== "number" ||
    rating < 1 ||
    rating > 5 ||
    !Number.isInteger(rating) ||
    typeof title !== "string" ||
    !title.trim() ||
    title.trim().length > 120 ||
    typeof body !== "string" ||
    !body.trim() ||
    body.trim().length > 2000
  ) {
    res.status(400).json({ error: "Invalid review data" });
    return;
  }

  try {
    const [purchase] = await db
      .select({ id: orderItemsTable.id })
      .from(orderItemsTable)
      .innerJoin(ordersTable, eq(orderItemsTable.orderId, ordersTable.id))
      .where(
        and(
          eq(ordersTable.customerId, customerId),
          eq(orderItemsTable.productId, productId),
        ),
      )
      .limit(1);

    if (!purchase) {
      res.status(403).json({ error: "You must purchase this product before leaving a review" });
      return;
    }

    const [existing] = await db
      .select({ id: productReviewsTable.id })
      .from(productReviewsTable)
      .where(
        and(
          eq(productReviewsTable.productId, productId),
          eq(productReviewsTable.customerId, customerId),
        ),
      )
      .limit(1);

    if (existing) {
      res.status(409).json({ error: "You have already reviewed this product" });
      return;
    }

    const [customer] = await db
      .select({ firstName: customersTable.firstName, lastName: customersTable.lastName })
      .from(customersTable)
      .where(eq(customersTable.id, customerId))
      .limit(1);

    const customerName = customer
      ? `${customer.firstName} ${customer.lastName.charAt(0)}.`
      : "Verified Researcher";

    const [review] = await db
      .insert(productReviewsTable)
      .values({
        productId,
        customerId,
        customerName,
        rating,
        title: title.trim(),
        body: body.trim(),
        isApproved: false,
      })
      .returning();

    req.log.info({ reviewId: review.id, productId, customerId }, "Review submitted");
    res.status(201).json({
      id: review.id,
      message: "Review submitted and pending approval",
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit review");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
