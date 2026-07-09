import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { FENA_WEBHOOK_SECRET } from "../lib/fena";
import { logger } from "../lib/logger";

const router = Router();

// Extend Request to include the rawBody buffer captured by express.json's verify callback
interface RawRequest extends Request {
  rawBody?: Buffer;
}

/**
 * Fena webhook — called by Fena when a payment settles.
 *
 * Security model:
 *  - If FENA_WEBHOOK_SECRET is configured:
 *      • Requests WITHOUT a signature header are rejected (401).
 *      • Requests with a signature header are HMAC-verified against the raw
 *        body bytes (not re-serialised JSON) to prevent normalisation attacks.
 *  - If FENA_WEBHOOK_SECRET is not configured the route accepts all POSTs
 *    and logs a warning so the operator knows the endpoint is unprotected.
 *
 * Paid detection: only explicit success status values are accepted — no
 * fallback that would treat a missing status as "paid".
 */
router.post("/fena-webhook", async (req: RawRequest, res: Response): Promise<void> => {
  if (FENA_WEBHOOK_SECRET) {
    const sigHeader =
      (req.headers["x-fena-signature"] as string | undefined) ||
      (req.headers["x-webhook-signature"] as string | undefined) ||
      (req.headers["fena-signature"] as string | undefined);

    // Reject requests that carry no signature when a secret is configured.
    if (!sigHeader) {
      logger.warn("Fena webhook rejected — no signature header present (FENA_WEBHOOK_SECRET is set)");
      res.status(401).json({ error: "Missing signature" });
      return;
    }

    // Verify HMAC against the raw body bytes captured before JSON parsing.
    const rawBody = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
    const expected = crypto
      .createHmac("sha256", FENA_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");
    const received = sigHeader.startsWith("sha256=") ? sigHeader.slice(7) : sigHeader;

    let valid = false;
    try {
      // timingSafeEqual requires equal-length buffers
      const exp = Buffer.from(expected, "hex");
      const rec = Buffer.from(received.padEnd(expected.length, "0"), "hex");
      valid = exp.length === rec.length && crypto.timingSafeEqual(exp, rec);
    } catch {
      valid = false;
    }

    if (!valid) {
      logger.warn({ received }, "Fena webhook rejected — signature mismatch");
      res.status(401).json({ error: "Invalid signature" });
      return;
    }
  } else {
    logger.warn("Fena webhook received with no FENA_WEBHOOK_SECRET configured — proceeding without signature verification");
  }

  let body: Record<string, unknown>;
  try {
    body = typeof req.body === "string" ? (JSON.parse(req.body) as Record<string, unknown>) : req.body;
  } catch {
    res.status(400).json({ error: "Invalid JSON" });
    return;
  }

  logger.info({ body }, "Fena webhook received");

  // Extract order reference — Fena may send it under different field names.
  const token = body["token"] as Record<string, unknown> | undefined;
  const orderNumber =
    (body["reference"] as string | undefined) ??
    (body["orderReference"] as string | undefined) ??
    (body["orderID"] as string | undefined) ??
    (token?.["orderID"] as string | undefined) ??
    (token?.["reference"] as string | undefined);

  if (!orderNumber) {
    logger.warn({ body }, "Fena webhook missing order reference — ignoring");
    res.status(200).json({ received: true });
    return;
  }

  // Only treat explicit success values as paid — never fall back on a missing status.
  const status =
    (body["status"] as string | undefined) ??
    (token?.["status"] as string | undefined) ??
    "";

  const PAID_STATUSES = new Set(["COMPLETED", "PAID", "SUCCESS", "AUTHORIZED"]);
  const isPaid = PAID_STATUSES.has(status.toUpperCase());

  if (!isPaid) {
    logger.info({ orderNumber, status }, "Fena webhook received — status not a paid state, no DB update");
    res.status(200).json({ received: true });
    return;
  }

  try {
    await db
      .update(ordersTable)
      .set({ status: "paid", updatedAt: new Date() })
      .where(eq(ordersTable.orderNumber, orderNumber));
    logger.info({ orderNumber, status }, "Order marked paid via Fena webhook");
  } catch (err) {
    logger.error({ err, orderNumber }, "Failed to update order status from Fena webhook");
    res.status(500).json({ error: "DB update failed" });
    return;
  }

  res.status(200).json({ received: true });
});

export default router;
