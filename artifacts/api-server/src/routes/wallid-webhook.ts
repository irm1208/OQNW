import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { ordersTable, orderItemsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { WALLID_WEBHOOK_SECRET } from "../lib/wallid";
import { logger } from "../lib/logger";
import { sendOrderConfirmation } from "../lib/email";

const router = Router();

// Extend Request to include the rawBody buffer captured by express.json's verify callback
interface RawRequest extends Request {
  rawBody?: Buffer;
}

/**
 * Wallid webhook — called by Wallid when a payment reaches a final status.
 *
 * Security model:
 *  - If WALLID_WEBHOOK_SECRET is configured:
 *      • Requests WITHOUT a signature header are rejected (401).
 *      • Signature is verified as:
 *          sha256=hex(HMAC-SHA256(key=secret, data="${timestamp}.${rawBody}"))
 *        where timestamp is from X-Webhook-Timestamp header.
 *      • Requests older than 5 minutes are rejected (replay protection).
 *  - If WALLID_WEBHOOK_SECRET is not configured the route accepts all POSTs
 *    and logs a warning so the operator knows the endpoint is unprotected.
 *
 * Paid detection: only explicit SUCCESS status is treated as paid.
 * FAILED and EXPIRED events are acknowledged but do not update the DB.
 *
 * Wallid delivers events as { events: [...] } — multiple events may be batched.
 */
router.post("/wallid-webhook", async (req: RawRequest, res: Response): Promise<void> => {
  if (WALLID_WEBHOOK_SECRET) {
    const sigHeader   = req.headers["x-webhook-signature"] as string | undefined;
    const tsHeader    = req.headers["x-webhook-timestamp"] as string | undefined;

    if (!sigHeader || !tsHeader) {
      logger.warn("Wallid webhook rejected — missing signature or timestamp header");
      res.status(401).json({ error: "Missing signature or timestamp header" });
      return;
    }

    // Replay-attack protection: reject requests older than 5 minutes
    const ts = parseInt(tsHeader, 10);
    if (!ts || Math.abs(Date.now() / 1000 - ts) > 300) {
      logger.warn({ ts }, "Wallid webhook rejected — timestamp too old or invalid");
      res.status(401).json({ error: "Timestamp too old" });
      return;
    }

    // Verify HMAC: message = "{timestamp}.{rawBody}"
    const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
    const message  = `${tsHeader}.${rawBody.toString()}`;
    const expected = "sha256=" + crypto
      .createHmac("sha256", WALLID_WEBHOOK_SECRET)
      .update(message)
      .digest("hex");

    // Constant-time comparison — lengths must match first
    if (expected.length !== sigHeader.length) {
      logger.warn("Wallid webhook rejected — signature length mismatch");
      res.status(401).json({ error: "Invalid signature" });
      return;
    }
    const valid = crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sigHeader));
    if (!valid) {
      logger.warn({ received: sigHeader }, "Wallid webhook rejected — signature mismatch");
      res.status(401).json({ error: "Invalid signature" });
      return;
    }
  } else {
    logger.warn(
      "Wallid webhook received with no WALLID_WEBHOOK_SECRET configured — proceeding without signature verification",
    );
  }

  let body: { events?: unknown[] };
  try {
    body = typeof req.body === "string"
      ? (JSON.parse(req.body) as { events?: unknown[] })
      : (req.body as { events?: unknown[] });
  } catch {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  logger.info({ body }, "Wallid webhook received");

  const events = Array.isArray(body.events) ? body.events : [];

  for (const rawEvent of events) {
    const event = rawEvent as {
      event_id?:       string;
      api_payment_id?: string;
      order_id?:       string;
      status?:         string;
      status_error?:   string;
    };

    const { order_id: orderId, status = "" } = event;

    if (!orderId) {
      logger.warn({ event }, "Wallid webhook event missing order_id — skipping");
      continue;
    }

    if (status.toUpperCase() !== "SUCCESS") {
      logger.info(
        { orderId, status },
        "Wallid webhook event — status not SUCCESS, no DB update",
      );
      continue;
    }

    try {
      const [updated] = await db
        .update(ordersTable)
        .set({ status: "paid", updatedAt: new Date() })
        .where(eq(ordersTable.orderNumber, orderId))
        .returning();

      logger.info({ orderId, status }, "Order marked paid via Wallid webhook");

      // Send the confirmation email now that payment is verified
      if (updated) {
        const items = await db
          .select({
            productName: orderItemsTable.productName,
            productCategory: orderItemsTable.productCategory,
            quantity: orderItemsTable.quantity,
            priceGbp: orderItemsTable.priceGbp,
          })
          .from(orderItemsTable)
          .where(eq(orderItemsTable.orderId, updated.id));

        sendOrderConfirmation({
          orderNumber: updated.orderNumber,
          customerName: updated.customerName,
          customerEmail: updated.customerEmail,
          items: items.map(i => ({
            productName: i.productName,
            productCategory: i.productCategory,
            quantity: i.quantity,
            priceGbp: parseFloat(String(i.priceGbp)),
          })),
          subtotalGbp: parseFloat(String(updated.subtotalGbp)),
          shippingCostGbp: parseFloat(String(updated.shippingCostGbp)),
          totalGbp: parseFloat(String(updated.totalGbp)),
          shippingMethod: updated.shippingMethod ?? null,
          trackingNumber: null,
          address1: updated.address1 ?? null,
          address2: updated.address2 ?? null,
          city: updated.city ?? null,
          postcode: updated.postcode ?? null,
          country: updated.country ?? null,
        }).catch((err) => {
          logger.error({ err, orderId }, "Failed to send order confirmation email after Wallid payment");
        });
      }
    } catch (err) {
      logger.error({ err, orderId }, "Failed to update order status from Wallid webhook");
      // Don't return 500 — process remaining events first, then respond
    }
  }

  res.status(200).json({ received: true });
});

export default router;
