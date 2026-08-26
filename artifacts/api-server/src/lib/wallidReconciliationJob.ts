import { db, orderItemsTable, ordersTable } from "@workspace/db";
import { and, desc, eq, ilike } from "drizzle-orm";
import { sendOrderConfirmation } from "./email";
import { logger } from "./logger";
import { checkWallidPaymentStatus } from "./wallid";
import {
  validateSuccessfulWallidPayment,
  wallidPaymentIdFromNotes,
} from "./wallidReconciliation";

const INTERVAL_MS = 2 * 60 * 1000;
const BATCH_SIZE = 100;

let running = false;

export async function reconcilePendingWallidPayments(): Promise<{
  checked: number;
  settled: number;
}> {
  const pendingOrders = await db
    .select()
    .from(ordersTable)
    .where(and(
      eq(ordersTable.status, "awaiting_payment"),
      ilike(ordersTable.notes, "%Wallid payment id:%"),
    ))
    .orderBy(desc(ordersTable.createdAt))
    .limit(BATCH_SIZE);

  let checked = 0;
  let settled = 0;

  for (const order of pendingOrders) {
    if (!order.paymentCurrency || order.paymentAmountMinor === null) continue;

    const apiPaymentId = wallidPaymentIdFromNotes(order.notes);
    if (!apiPaymentId) continue;
    checked += 1;

    const providerStatus = await checkWallidPaymentStatus(apiPaymentId);
    const validation = validateSuccessfulWallidPayment(
      {
        apiPaymentId,
        orderNumber: order.orderNumber,
        amountMinor: order.paymentAmountMinor,
        currency: order.paymentCurrency,
      },
      providerStatus,
    );
    if (!validation.ok) {
      if (providerStatus?.status === "SUCCESS") {
        logger.error(
          { orderNumber: order.orderNumber, apiPaymentId, reason: validation.reason },
          "Wallid SUCCESS status failed scheduled reconciliation validation",
        );
      }
      continue;
    }

    const claimed = await db
      .update(ordersTable)
      .set({ status: "paid", updatedAt: new Date() })
      .where(and(
        eq(ordersTable.id, order.id),
        eq(ordersTable.status, "awaiting_payment"),
      ))
      .returning({ id: ordersTable.id });
    if (claimed.length === 0) continue;

    settled += 1;
    logger.info(
      { orderNumber: order.orderNumber, apiPaymentId },
      "Order marked paid via scheduled Wallid reconciliation",
    );

    try {
      const items = await db
        .select()
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, order.id));

      await sendOrderConfirmation({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: items.map((item) => ({
          productName: item.productName,
          productCategory: item.productCategory,
          quantity: item.quantity,
          priceGbp: Number(item.priceGbp),
        })),
        subtotalGbp: Number(order.subtotalGbp),
        shippingCostGbp: Number(order.shippingCostGbp),
        totalGbp: Number(order.totalGbp),
        shippingMethod: order.shippingMethod,
        trackingNumber: order.trackingNumber,
        address1: order.address1,
        address2: order.address2,
        city: order.city,
        postcode: order.postcode,
        country: order.country,
      });
    } catch (err) {
      logger.error(
        { err, orderNumber: order.orderNumber },
        "Failed to send confirmation after scheduled Wallid reconciliation",
      );
    }
  }

  return { checked, settled };
}

async function runCheck(): Promise<void> {
  if (running) return;
  running = true;
  try {
    const result = await reconcilePendingWallidPayments();
    if (result.checked > 0) {
      logger.info(result, "Wallid payment reconciliation completed");
    }
  } catch (err) {
    logger.error({ err }, "Wallid payment reconciliation failed");
  } finally {
    running = false;
  }
}

export function startWallidReconciliationJob(): void {
  logger.info("Wallid payment reconciliation job started");
  void runCheck();
  setInterval(() => { void runCheck(); }, INTERVAL_MS);
}