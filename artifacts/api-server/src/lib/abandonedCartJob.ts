import { db } from "@workspace/db";
import { abandonedCartsTable } from "@workspace/db";
import { and, isNull, lte, gte, eq } from "drizzle-orm";
import { sendAbandonedCartEmail } from "./email";
import { logger } from "./logger";

const SITE_URL = process.env.SITE_URL ?? "https://omniqure.com";
const INTERVAL_MS = 15 * 60 * 1000;
const ABANDON_AFTER_MS = 60 * 60 * 1000;
const MAX_AGE_MS = 48 * 60 * 60 * 1000;

interface SavedCartItem {
  productId?: number;
  productName?: string;
  quantity?: number;
  priceGbp?: number;
}

async function runCheck(): Promise<void> {
  try {
    const now = new Date();
    const abandonedBefore = new Date(now.getTime() - ABANDON_AFTER_MS);
    const maxAgeBefore = new Date(now.getTime() - MAX_AGE_MS);

    const carts = await db
      .select()
      .from(abandonedCartsTable)
      .where(
        and(
          isNull(abandonedCartsTable.emailSentAt),
          isNull(abandonedCartsTable.convertedAt),
          lte(abandonedCartsTable.updatedAt, abandonedBefore),
          gte(abandonedCartsTable.updatedAt, maxAgeBefore)
        )
      );

    logger.info({ count: carts.length }, "Abandoned cart check");

    for (const cart of carts) {
      let items: SavedCartItem[] = [];
      try {
        items = JSON.parse(cart.itemsJson) as SavedCartItem[];
      } catch {
        continue;
      }

      const emailItems = items
        .filter((i) => i.productName && i.quantity && i.priceGbp)
        .map((i) => ({
          productName: i.productName!,
          quantity: i.quantity!,
          priceGbp: i.priceGbp!,
        }));

      if (emailItems.length === 0) continue;

      await sendAbandonedCartEmail({
        customerName: cart.customerName,
        customerEmail: cart.customerEmail,
        items: emailItems,
        cartUrl: `${SITE_URL}/cart`,
      });

      await db
        .update(abandonedCartsTable)
        .set({ emailSentAt: new Date() })
        .where(eq(abandonedCartsTable.customerId, cart.customerId));
    }
  } catch (err) {
    logger.error({ err }, "Abandoned cart job error");
  }
}

export function startAbandonedCartJob(): void {
  logger.info("Abandoned cart job started");
  void runCheck();
  setInterval(() => { void runCheck(); }, INTERVAL_MS);
}
