import { db } from "@workspace/db";
import { subscriptionsTable, customersTable, ordersTable, orderItemsTable } from "@workspace/db";
import { and, eq, lte } from "drizzle-orm";
import { sendOrderConfirmation } from "./email";
import { logger } from "./logger";
import type { SubItem } from "../routes/subscriptions";

const INTERVAL_MS = 60 * 60 * 1000;

function generateOrderNumber(): string {
  return `OQ-SUB-${Math.floor(100000 + Math.random() * 900000)}`;
}

async function runCheck(): Promise<void> {
  try {
    const now = new Date();
    const dueSubs = await db
      .select()
      .from(subscriptionsTable)
      .where(
        and(
          eq(subscriptionsTable.status, "active"),
          lte(subscriptionsTable.nextRenewalAt, now)
        )
      );

    logger.info({ count: dueSubs.length }, "Subscription renewal check");

    for (const sub of dueSubs) {
      let items: SubItem[] = [];
      try { items = JSON.parse(sub.itemsJson) as SubItem[]; } catch { continue; }
      if (items.length === 0) continue;

      const [customer] = await db
        .select()
        .from(customersTable)
        .where(eq(customersTable.id, sub.customerId))
        .limit(1);
      if (!customer) continue;

      const discountFactor = 1 - sub.discountPct / 100;
      const subtotalGbp = items.reduce((s, i) => s + i.priceGbp * i.quantity * discountFactor, 0);
      const shippingCostGbp = subtotalGbp >= 100 ? 0 : 5.99;
      const totalGbp = subtotalGbp + shippingCostGbp;

      const orderNumber = generateOrderNumber();
      const [order] = await db
        .insert(ordersTable)
        .values({
          orderNumber,
          status: "processing",
          customerEmail: customer.email,
          customerName: `${customer.firstName} ${customer.lastName}`,
          customerId: customer.id,
          address1: customer.address1,
          address2: customer.address2 ?? null,
          city: customer.city,
          postcode: customer.postcode,
          country: customer.country,
          subtotalGbp: String(subtotalGbp.toFixed(2)),
          shippingCostGbp: String(shippingCostGbp.toFixed(2)),
          totalGbp: String(totalGbp.toFixed(2)),
          shippingMethod: "Standard",
          notes: `Subscription #${sub.id} renewal — ${sub.discountPct}% discount applied`,
        })
        .returning();

      await db.insert(orderItemsTable).values(
        items.map((i) => ({
          orderId: order.id,
          productId: i.productId,
          productName: i.productName,
          productCategory: "Subscription",
          quantity: i.quantity,
          priceGbp: String((i.priceGbp * discountFactor).toFixed(2)),
        }))
      );

      const nextRenewalAt = new Date(sub.nextRenewalAt.getTime() + sub.intervalDays * 24 * 60 * 60 * 1000);
      await db
        .update(subscriptionsTable)
        .set({ nextRenewalAt, updatedAt: new Date() })
        .where(eq(subscriptionsTable.id, sub.id));

      sendOrderConfirmation({
        orderNumber,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerEmail: customer.email,
        items: items.map((i) => ({
          productName: i.productName,
          productCategory: "Subscription",
          quantity: i.quantity,
          priceGbp: parseFloat((i.priceGbp * discountFactor).toFixed(2)),
        })),
        subtotalGbp,
        shippingCostGbp,
        totalGbp,
        shippingMethod: "Standard",
        trackingNumber: null,
        address1: customer.address1,
        address2: customer.address2 ?? null,
        city: customer.city,
        postcode: customer.postcode,
        country: customer.country,
      }).catch(() => {});

      logger.info({ subId: sub.id, orderNumber, customerId: sub.customerId }, "Subscription renewed");
    }
  } catch (err) {
    logger.error({ err }, "Subscription job error");
  }
}

export function startSubscriptionJob(): void {
  logger.info("Subscription renewal job started");
  void runCheck();
  setInterval(() => { void runCheck(); }, INTERVAL_MS);
}
