import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { requiredSecret } from "../lib/securityConfig";
import { db } from "@workspace/db";
import { newsletterSubscribersTable, ordersTable, orderItemsTable, emailLogsTable } from "@workspace/db";
import { eq, and, gte, lte } from "drizzle-orm";
import { sendNewsletterBroadcast, sendReorderReminder } from "../lib/email";
import { logger } from "../lib/logger";

const router = Router();

const SITE_URL = process.env.SITE_URL ?? "https://omniqure.com";
const UNSUB_SECRET = requiredSecret("SESSION_SECRET", "omniqure-unsubscribe-development-only");

function isAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

function makeUnsubToken(email: string): string {
  return crypto.createHmac("sha256", UNSUB_SECRET).update(email.toLowerCase()).digest("hex").slice(0, 24);
}

function makeUnsubUrl(email: string): string {
  const token = makeUnsubToken(email);
  return `${SITE_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}&token=${token}`;
}

// POST /newsletter/subscribe
router.post("/newsletter/subscribe", async (req: Request, res: Response): Promise<void> => {
  const { email, firstName, source } = req.body as { email?: unknown; firstName?: unknown; source?: unknown };
  if (typeof email !== "string" || !email.includes("@")) {
    res.status(400).json({ error: "A valid email address is required" });
    return;
  }
  const cleanEmail = email.toLowerCase().trim();
  const cleanFirst = typeof firstName === "string" ? firstName.trim().slice(0, 100) : null;
  const cleanSource = typeof source === "string" ? source.trim().slice(0, 50) : "website";

  try {
    await db
      .insert(newsletterSubscribersTable)
      .values({
        email: cleanEmail,
        firstName: cleanFirst,
        isActive: true,
        source: cleanSource,
      })
      .onConflictDoUpdate({
        target: newsletterSubscribersTable.email,
        set: { isActive: true, firstName: cleanFirst ?? undefined, unsubscribedAt: null },
      });

    logger.info({ email: cleanEmail }, "Newsletter subscribe");
    res.json({ success: true, message: "You're subscribed! Welcome to the OmniQure newsletter." });
  } catch (err) {
    logger.error({ err }, "Newsletter subscribe error");
    res.status(500).json({ error: "Failed to subscribe. Please try again." });
  }
});

// GET /newsletter/unsubscribe?email=...&token=...
router.get("/newsletter/unsubscribe", async (req: Request, res: Response): Promise<void> => {
  const { email, token } = req.query as { email?: string; token?: string };
  if (!email || !token) {
    res.status(400).send("Invalid unsubscribe link.");
    return;
  }
  const expected = makeUnsubToken(email);
  if (token !== expected) {
    res.status(403).send("Invalid or expired unsubscribe link.");
    return;
  }
  try {
    await db
      .update(newsletterSubscribersTable)
      .set({ isActive: false, unsubscribedAt: new Date() })
      .where(eq(newsletterSubscribersTable.email, email.toLowerCase()));

    res.send(`<!DOCTYPE html><html><head><title>Unsubscribed</title><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
    <body style="font-family:Arial,sans-serif;text-align:center;padding:60px 20px;background:#f5f8fc;">
    <h1 style="color:#0f172a;font-size:24px;">You've been unsubscribed</h1>
    <p style="color:#64748b;font-size:15px;">You'll no longer receive newsletter emails from OmniQure.</p>
    <a href="${SITE_URL}" style="display:inline-block;margin-top:20px;background:#1240A0;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;">Return to site</a>
    </body></html>`);
  } catch (err) {
    logger.error({ err }, "Newsletter unsubscribe error");
    res.status(500).send("Something went wrong. Please try again.");
  }
});

// GET /admin/newsletter/subscribers
router.get("/admin/newsletter/subscribers", async (req: Request, res: Response): Promise<void> => {
  if (!isAdmin(req, res)) return;
  try {
    const rows = await db
      .select()
      .from(newsletterSubscribersTable)
      .orderBy(newsletterSubscribersTable.subscribedAt);
    res.json({
      total: rows.length,
      active: rows.filter(r => r.isActive).length,
      subscribers: rows.map(r => ({
        id: r.id,
        email: r.email,
        firstName: r.firstName,
        isActive: r.isActive,
        source: r.source,
        subscribedAt: r.subscribedAt.toISOString(),
        unsubscribedAt: r.unsubscribedAt?.toISOString() ?? null,
      })),
    });
  } catch (err) {
    logger.error({ err }, "Failed to list newsletter subscribers");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/newsletter/broadcast
router.post("/admin/newsletter/broadcast", async (req: Request, res: Response): Promise<void> => {
  if (!isAdmin(req, res)) return;
  const { subject, htmlBody } = req.body as { subject?: unknown; htmlBody?: unknown };
  if (typeof subject !== "string" || !subject.trim()) {
    res.status(400).json({ error: "subject is required" });
    return;
  }
  if (typeof htmlBody !== "string" || !htmlBody.trim()) {
    res.status(400).json({ error: "htmlBody is required" });
    return;
  }

  try {
    const activeSubscribers = await db
      .select({ email: newsletterSubscribersTable.email, firstName: newsletterSubscribersTable.firstName })
      .from(newsletterSubscribersTable)
      .where(and(eq(newsletterSubscribersTable.isActive, true)));

    if (activeSubscribers.length === 0) {
      res.json({ sent: 0, message: "No active subscribers." });
      return;
    }

    const results = await sendNewsletterBroadcast({
      subject: subject.trim(),
      htmlBody: htmlBody.trim(),
      subscribers: activeSubscribers.map(s => ({ email: s.email, firstName: s.firstName ?? undefined, unsubscribeUrl: makeUnsubUrl(s.email) })),
    });

    logger.info({ sent: results.sent, failed: results.failed, subject }, "Newsletter broadcast sent");
    res.json({ sent: results.sent, failed: results.failed, total: activeSubscribers.length });
  } catch (err) {
    logger.error({ err }, "Newsletter broadcast error");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /admin/newsletter/reorder-reminders
// Finds orders 28-32 days old and sends reorder reminder emails to those customers
router.post("/admin/newsletter/reorder-reminders", async (req: Request, res: Response): Promise<void> => {
  if (!isAdmin(req, res)) return;
  try {
    const now = new Date();
    const from = new Date(now.getTime() - 32 * 24 * 60 * 60 * 1000);
    const to   = new Date(now.getTime() - 28 * 24 * 60 * 60 * 1000);

    const candidates = await db
      .select({
        orderId:       ordersTable.id,
        orderNumber:   ordersTable.orderNumber,
        customerEmail: ordersTable.customerEmail,
        customerName:  ordersTable.customerName,
        createdAt:     ordersTable.createdAt,
      })
      .from(ordersTable)
      .where(and(gte(ordersTable.createdAt, from), lte(ordersTable.createdAt, to)));

    if (candidates.length === 0) {
      res.json({ sent: 0, skipped: 0, message: "No orders in the 28-32 day window." });
      return;
    }

    const alreadySent = await db
      .select({ orderNumber: emailLogsTable.orderNumber })
      .from(emailLogsTable)
      .where(and(eq(emailLogsTable.type, "reorder_reminder"), eq(emailLogsTable.status, "sent")));

    const alreadySentSet = new Set(alreadySent.map(r => r.orderNumber).filter(Boolean));

    let sent = 0;
    let skipped = 0;

    for (const order of candidates) {
      if (alreadySentSet.has(order.orderNumber)) { skipped++; continue; }

      const items = await db
        .select({ productName: orderItemsTable.productName, productId: orderItemsTable.productId })
        .from(orderItemsTable)
        .where(eq(orderItemsTable.orderId, order.orderId));

      await sendReorderReminder({
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        orderNumber: order.orderNumber,
        items: items.map(i => ({ productName: i.productName, productId: i.productId })),
      });
      sent++;
    }

    logger.info({ sent, skipped }, "Reorder reminders dispatched");
    res.json({ sent, skipped, total: candidates.length });
  } catch (err) {
    logger.error({ err }, "Reorder reminder batch failed");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
