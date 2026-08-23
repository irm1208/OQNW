import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  verifyBtcPayWebhookSignature,
  type BtcPayWebhookEvent,
} from "../lib/btcpay";
import { sendOrderConfirmation } from "../lib/email";
import { logger } from "../lib/logger";

const router = Router();

router.post(
  "/btcpay-webhook",
  async (req: Request, res: Response): Promise<void> => {
    const signature =
      (req.headers["btcpay-sig"] as string) ||
      (req.headers["x-btcpay-signature"] as string) ||
      "";

    const rawBody =
      typeof req.body === "string"
        ? req.body
        : JSON.stringify(req.body);

    if (!verifyBtcPayWebhookSignature(rawBody, signature)) {
      logger.warn("BTCPay webhook signature mismatch — rejected");
      res.status(401).json({ error: "Invalid signature" });
      return;
    }

    let event: BtcPayWebhookEvent;
    try {
      event = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch {
      res.status(400).json({ error: "Invalid JSON" });
      return;
    }

    logger.info({ type: event.type, invoiceId: event.invoiceId }, "BTCPay webhook received");

    const settledTypes = ["InvoiceSettled", "InvoicePaymentSettled", "InvoiceComplete"];

    if (settledTypes.includes(event.type)) {
      const orderNumber = event.metadata?.orderId;
      if (orderNumber) {
        try {
          await db
            .update(ordersTable)
            .set({ status: "paid", updatedAt: new Date() })
            .where(eq(ordersTable.orderNumber, orderNumber));
          logger.info({ orderNumber, invoiceId: event.invoiceId }, "Order marked paid via BTCPay webhook");

          // Send order confirmation email (fire-and-forget)
          const [order] = await db
            .select()
            .from(ordersTable)
            .where(eq(ordersTable.orderNumber, orderNumber))
            .limit(1);
          const items = await db
            .select()
            .from(orderItemsTable)
            .where(eq(orderItemsTable.orderNumber, orderNumber));

          if (order) {
            sendOrderConfirmation({
              orderNumber: order.orderNumber,
              customerName: order.customerName,
              customerEmail: order.customerEmail,
              items: items.map(i => ({
                name: i.productName,
                variant: i.variantLabel ?? null,
                qty: i.quantity,
                unitPriceGbp: parseFloat(String(i.unitPriceGbp)),
                isFree: i.isFree ?? false,
              })),
              subtotalGbp: parseFloat(String(order.subtotalGbp)),
              shippingCostGbp: parseFloat(String(order.shippingCostGbp)),
              totalGbp: parseFloat(String(order.totalGbp)),
              shippingMethod: order.shippingMethod ?? null,
              trackingNumber: order.trackingNumber ?? null,
              address1: order.address1 ?? null,
              address2: order.address2 ?? null,
              city: order.city ?? null,
              postcode: order.postcode ?? null,
              country: order.country ?? null,
            }).catch(err => logger.error({ err, orderNumber }, "Failed to send BTC confirmation email"));
          }
        } catch (err) {
          logger.error({ err, orderNumber }, "Failed to update order status from BTCPay webhook");
          res.status(500).json({ error: "DB update failed" });
          return;
        }
      }
    }

    if (event.type === "InvoiceExpired") {
      const orderNumber = event.metadata?.orderId;
      if (orderNumber) {
        db.update(ordersTable)
          .set({ status: "cancelled", updatedAt: new Date() })
          .where(eq(ordersTable.orderNumber, orderNumber))
          .catch(() => {});
        logger.info({ orderNumber }, "Order cancelled — BTCPay invoice expired");
      }
    }

    res.status(200).json({ received: true });
  }
);

export default router;
