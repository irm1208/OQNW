import { db } from "@workspace/db";
import { ordersTable, orderItemsTable } from "@workspace/db";
import { and, isNull, lte, eq } from "drizzle-orm";
import { sendReviewRequestEmail } from "./email";
import { logger } from "./logger";

const INTERVAL_MS = 60 * 60 * 1000;
const DELAY_AFTER_MS = 7 * 24 * 60 * 60 * 1000;

async function runCheck(): Promise<void> {
  try {
    const cutoff = new Date(Date.now() - DELAY_AFTER_MS);

    const orders = await db
      .select()
      .from(ordersTable)
      .where(
        and(
          eq(ordersTable.status, "delivered"),
          isNull(ordersTable.reviewRequestSentAt),
          lte(ordersTable.updatedAt, cutoff)
        )
      );

    logger.info({ count: orders.length }, "Review request job check");

    for (const order of orders) {
      const items = await db
        .select({ productId: orderItemsTable.productId, productName: orderItemsTable.productName })
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, order.id));

      if (items.length === 0) continue;

      await sendReviewRequestEmail({
        customerEmail: order.customerEmail,
        customerName: order.customerName,
        orderNumber: order.orderNumber,
        items: items.map((i) => ({
          productId: i.productId ?? 0,
          productName: i.productName,
        })),
      });

      await db
        .update(ordersTable)
        .set({ reviewRequestSentAt: new Date() })
        .where(eq(ordersTable.id, order.id));
    }
  } catch (err) {
    logger.error({ err }, "Review request job error");
  }
}

export function startReviewRequestJob(): void {
  logger.info("Review request job started");
  void runCheck();
  setInterval(() => { void runCheck(); }, INTERVAL_MS);
}
