import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { subscriptionsTable, customersTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

const SESSION_SECRET =
  process.env.SESSION_SECRET ??
  process.env.ADMIN_PASSWORD ??
  "omniqure-cust-session-fallback-secret";

function verifyCustomerSession(token: string): number | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  if (sig !== expected) return null;
  const id = parseInt(payload, 10);
  return isNaN(id) ? null : id;
}

function requireCustomer(req: Request, res: Response): number | null {
  const token = req.cookies?.customer_session as string | undefined;
  if (!token) { res.status(401).json({ error: "Not authenticated" }); return null; }
  const id = verifyCustomerSession(token);
  if (!id) { res.status(401).json({ error: "Invalid session" }); return null; }
  return id;
}

export interface SubItem {
  productId: number;
  productName: string;
  quantity: number;
  priceGbp: number;
}

function subToResponse(s: typeof subscriptionsTable.$inferSelect) {
  let items: SubItem[] = [];
  try { items = JSON.parse(s.itemsJson) as SubItem[]; } catch {}
  const subtotal = items.reduce((acc, i) => acc + i.priceGbp * i.quantity, 0);
  const discountedTotal = subtotal * (1 - s.discountPct / 100);
  return {
    id: s.id,
    items,
    intervalDays: s.intervalDays,
    nextRenewalAt: s.nextRenewalAt.toISOString(),
    discountPct: s.discountPct,
    status: s.status,
    subtotal: parseFloat(subtotal.toFixed(2)),
    discountedTotal: parseFloat(discountedTotal.toFixed(2)),
    createdAt: s.createdAt.toISOString(),
  };
}

// GET /subscriptions
router.get("/subscriptions", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomer(req, res);
  if (!customerId) return;
  try {
    const subs = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.customerId, customerId));
    res.json(subs.map(subToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list subscriptions");
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /subscriptions
router.post("/subscriptions", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomer(req, res);
  if (!customerId) return;

  const { items, intervalDays } = req.body as { items?: unknown; intervalDays?: unknown };
  if (!Array.isArray(items) || items.length === 0 || typeof intervalDays !== "number") {
    res.status(400).json({ error: "items (array) and intervalDays (number) are required" });
    return;
  }
  const validIntervals = [7, 14, 30, 60, 90];
  if (!validIntervals.includes(intervalDays)) {
    res.status(400).json({ error: "intervalDays must be 7, 14, 30, 60, or 90" });
    return;
  }

  const nextRenewalAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);

  try {
    const [sub] = await db
      .insert(subscriptionsTable)
      .values({
        customerId,
        itemsJson: JSON.stringify(items),
        intervalDays,
        nextRenewalAt,
        discountPct: 5,
        status: "active",
      })
      .returning();

    res.status(201).json(subToResponse(sub));
  } catch (err) {
    req.log.error({ err }, "Failed to create subscription");
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH /subscriptions/:id
router.patch("/subscriptions/:id", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomer(req, res);
  if (!customerId) return;
  const subId = parseInt(req.params.id as string, 10);
  if (isNaN(subId)) { res.status(400).json({ error: "Invalid subscription ID" }); return; }

  const { action, intervalDays } = req.body as { action?: string; intervalDays?: number };

  try {
    const [existing] = await db
      .select()
      .from(subscriptionsTable)
      .where(and(eq(subscriptionsTable.id, subId), eq(subscriptionsTable.customerId, customerId)))
      .limit(1);

    if (!existing) { res.status(404).json({ error: "Subscription not found" }); return; }

    const updates: Partial<typeof subscriptionsTable.$inferInsert> = {};

    if (action === "pause") {
      updates.status = "paused";
      updates.pausedAt = new Date();
    } else if (action === "resume") {
      updates.status = "active";
      updates.pausedAt = null;
    } else if (action === "cancel") {
      updates.status = "cancelled";
    } else if (typeof intervalDays === "number" && [7, 14, 30, 60, 90].includes(intervalDays)) {
      updates.intervalDays = intervalDays;
    } else {
      res.status(400).json({ error: "Invalid action or intervalDays" });
      return;
    }
    updates.updatedAt = new Date();

    const [updated] = await db
      .update(subscriptionsTable)
      .set(updates)
      .where(and(eq(subscriptionsTable.id, subId), eq(subscriptionsTable.customerId, customerId)))
      .returning();

    res.json(subToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update subscription");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
