import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db, orderItemsTable, ordersTable, wholesaleInvoicesTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { WALLID_WEBHOOK_SECRET } from "../lib/wallid";
import { sendOrderConfirmation } from "../lib/email";
import { logger } from "../lib/logger";

const router = Router();

interface RawRequest extends Request {
  rawBody?: Buffer;
}

interface WallidEvent {
  event_id:       string;
  api_payment_id: string;
  order_id:       string;
  status:         string;
  status_error?:  string;
  amount:         number;
  currency:       string;
  occurred_at:    string;
}

interface WallidWebhookBody {
  events: WallidEvent[];
}

/**
 * POST /wallid-webhook
 *
 * Wallid delivers payment status updates as a JSON array of events.
 *
 * WALLID_WEBHOOK_SECRET is required. Requests without a valid HMAC-SHA256
 * signature are rejected with 400 (fail-closed). Configure WALLID_WEBHOOK_SECRET
 * before enabling live webhook traffic in the Wallid dashboard.
 *
 * Each SUCCESS event is validated against the stored Wallid api_payment_id and
 * expected GBP amount before the order is marked paid.
 */
router.post("/wallid-webhook", async (req: RawRequest, res: Response): Promise<void> => {
  // ── Require webhook secret — fail closed if not configured ────────────────
  if (!WALLID_WEBHOOK_SECRET) {
    logger.error("WALLID_WEBHOOK_SECRET is not configured — rejecting Wallid webhook request");
    res.status(400).json({ error: "Webhook secret not configured" });
    return;
  }

  // ── Signature verification ─────────────────────────────────────────────────
  const tsHeader  = req.headers["x-webhook-timestamp"] as string | undefined;
  const sigHeader = req.headers["x-webhook-signature"] as string | undefined;

  if (!tsHeader || !sigHeader) {
    logger.warn("Wallid webhook rejected — missing X-Webhook-Timestamp or X-Webhook-Signature");
    res.status(400).json({ error: "Missing signature headers" });
    return;
  }

  // Replay protection: reject if timestamp is more than 5 minutes old
  const ts = parseInt(tsHeader, 10);
  if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) {
    logger.warn({ tsHeader }, "Wallid webhook rejected — stale or invalid timestamp");
    res.status(400).json({ error: "Stale timestamp" });
    return;
  }

  // Verify HMAC — signed message is "{timestamp}.{rawBody}"
  const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
  const message = `${tsHeader}.${rawBody.toString()}`;
  const expected = "sha256=" + crypto
    .createHmac("sha256", WALLID_WEBHOOK_SECRET)
    .update(message)
    .digest("hex");

  const received = sigHeader;
  let sigValid = false;
  try {
    if (expected.length === received.length) {
      sigValid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received));
    }
  } catch {
    sigValid = false;
  }

  if (!sigValid) {
    logger.warn({ received }, "Wallid webhook rejected — signature mismatch");
    res.status(400).json({ error: "Invalid signature" });
    return;
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: WallidWebhookBody;
  try {
    body = typeof req.body === "string"
      ? (JSON.parse(req.body) as WallidWebhookBody)
      : (req.body as WallidWebhookBody);
  } catch {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  const events: WallidEvent[] = Array.isArray(body?.events) ? body.events : [];
  logger.info({ eventCount: events.length }, "Wallid webhook received");

  // ── Process events ─────────────────────────────────────────────────────────
  for (const event of events) {
    const { order_id: orderNumber, status, api_payment_id, event_id, status_error } = event;

    if (!orderNumber) {
      logger.warn({ event }, "Wallid event missing order_id — skipping");
      continue;
    }

    if (status === "SUCCESS") {
      try {
        // ── Verify payment ID, amount, and currency before marking paid ────────
        const [order] = await db
          .select({
            id:                ordersTable.id,
            status:            ordersTable.status,
            notes:             ordersTable.notes,
            totalGbp:          ordersTable.totalGbp,
            paymentCurrency: ordersTable.paymentCurrency,
            paymentAmountMinor: ordersTable.paymentAmountMinor,
            orderNumber:      ordersTable.orderNumber,
            customerName:     ordersTable.customerName,
            customerEmail:    ordersTable.customerEmail,
            subtotalGbp:      ordersTable.subtotalGbp,
            shippingCostGbp:  ordersTable.shippingCostGbp,
            shippingMethod:   ordersTable.shippingMethod,
            trackingNumber:   ordersTable.trackingNumber,
            address1:         ordersTable.address1,
            address2:         ordersTable.address2,
            city:             ordersTable.city,
            postcode:         ordersTable.postcode,
            country:          ordersTable.country,
          })
          .from(ordersTable)
          .where(eq(ordersTable.orderNumber, orderNumber))
          .limit(1);

        if (!order) {
          logger.error({ orderNumber, event_id }, "Wallid webhook SUCCESS — order not found");
          // Respond 200 so Wallid doesn't retry for orders we don't recognise
          continue;
        }

        // The api_payment_id stored at checkout must match the event's ID
        const storedFragment = `Wallid payment id: ${api_payment_id}`;
        if (!order.notes || !order.notes.includes(storedFragment)) {
          logger.error(
            { orderNumber, api_payment_id, event_id, notes: order.notes },
            "Wallid webhook — api_payment_id mismatch, rejecting event",
          );
          res.status(400).json({ error: "Payment ID mismatch" });
          return;
        }

        // Amount and currency must match the server-owned quote used to create
        // the Wallid session. Legacy GBP orders predate these columns, so keep
        // their original GBP calculation as a narrow compatibility fallback.
        const expectedCurrency = order.paymentCurrency ?? "GBP";
        const expectedAmountMinor = order.paymentAmountMinor ??
          Math.round(parseFloat(String(order.totalGbp)) * 100);
        if (event.amount !== expectedAmountMinor || event.currency !== expectedCurrency) {
          logger.error(
            {
              orderNumber, event_id,
              expectedAmountMinor, actualAmount: event.amount,
              expectedCurrency, actualCurrency: event.currency,
            },
            "Wallid webhook — amount or currency mismatch, rejecting event",
          );
          res.status(400).json({ error: "Amount or currency mismatch" });
          return;
        }

        // Atomically claim the transition so concurrent duplicate deliveries
        // cannot both trigger confirmation side effects.
        const settled = await db
          .update(ordersTable)
          .set({ status: "paid", updatedAt: new Date() })
          .where(and(
            eq(ordersTable.id, order.id),
            eq(ordersTable.status, "awaiting_payment"),
          ))
          .returning({ id: ordersTable.id });

        if (settled.length === 0) {
          logger.info(
            { orderNumber, event_id, currentStatus: order.status },
            "Wallid webhook — order is already settled or has advanced, skipping",
          );
          continue;
        }

        await db
          .update(wholesaleInvoicesTable)
          .set({ paymentStatus: "paid", updatedAt: new Date() })
          .where(eq(wholesaleInvoicesTable.orderId, order.id));

        logger.info({ orderNumber, api_payment_id, event_id }, "Order marked paid via Wallid webhook");

        // Payment is now server-verified; email failures must not affect the
        // successful webhook response or cause Wallid to retry the event.
        try {
          const items = await db
            .select({
              productName: orderItemsTable.productName,
              productCategory: orderItemsTable.productCategory,
              quantity: orderItemsTable.quantity,
              priceGbp: orderItemsTable.priceGbp,
            })
            .from(orderItemsTable)
            .where(eq(orderItemsTable.orderId, order.id));

          await sendOrderConfirmation({
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            items: items.map(item => ({
              productName: item.productName,
              productCategory: item.productCategory,
              quantity: item.quantity,
              priceGbp: parseFloat(String(item.priceGbp)),
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
          });
        } catch (emailErr) {
          logger.error(
            { emailErr, orderNumber },
            "Failed to send order confirmation email after Wallid payment — order is still marked paid",
          );
        }
      } catch (err) {
        logger.error({ err, orderNumber, event_id }, "Failed to update order status from Wallid webhook");
        // Return 500 so Wallid retries
        res.status(500).json({ error: "DB update failed" });
        return;
      }
    } else if (status === "FAILED" || status === "EXPIRED") {
      logger.info({ orderNumber, status, status_error, event_id }, "Wallid payment not successful — no DB update");
    } else {
      logger.info({ orderNumber, status, event_id }, "Wallid webhook — intermediate status, no DB update");
    }
  }

  res.status(200).json({ received: true });
});

export default router;
