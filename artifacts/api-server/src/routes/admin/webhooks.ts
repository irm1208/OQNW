import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { db } from "@workspace/db";
import { webhooksTable, webhookDeliveriesTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { firstString } from "../../lib/query";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (res.locals.adminAuthenticated !== true) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

const ALLOWED_EVENTS = ["order.created", "order.updated", "order.cancelled", "order.refunded"];

function webhookToResponse(w: typeof webhooksTable.$inferSelect) {
  return {
    id: w.id,
    url: w.url,
    events: w.events ?? [],
    description: w.description ?? null,
    isActive: w.isActive,
    createdAt: w.createdAt.toISOString(),
  };
}

router.get("/admin/webhooks", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const webhooks = await db.select().from(webhooksTable).orderBy(desc(webhooksTable.createdAt));
    res.json(webhooks.map(webhookToResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list webhooks");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/webhooks", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const { url, events, description } = req.body as { url: string; events: string[]; description?: string };
  if (!url || !Array.isArray(events) || events.length === 0) {
    res.status(400).json({ error: "url and at least one event are required" });
    return;
  }
  const invalidEvents = events.filter(e => !ALLOWED_EVENTS.includes(e));
  if (invalidEvents.length > 0) {
    res.status(400).json({ error: `Invalid events: ${invalidEvents.join(", ")}` });
    return;
  }
  try {
    const secret = crypto.randomBytes(32).toString("hex");
    const [created] = await db
      .insert(webhooksTable)
      .values({ url, events, secret, description: description ?? null })
      .returning();
    res.status(201).json({ ...webhookToResponse(created), secret });
  } catch (err) {
    req.log.error({ err }, "Failed to create webhook");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/webhooks/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  const { url, events, description, isActive } = req.body as Partial<{ url: string; events: string[]; description: string; isActive: boolean }>;
  const updates: Partial<typeof webhooksTable.$inferInsert> = {};
  if (url !== undefined) updates.url = url;
  if (events !== undefined) updates.events = events;
  if (description !== undefined) updates.description = description;
  if (isActive !== undefined) updates.isActive = isActive;
  try {
    const [updated] = await db.update(webhooksTable).set(updates).where(eq(webhooksTable.id, id)).returning();
    if (!updated) { res.status(404).json({ error: "Webhook not found" }); return; }
    res.json(webhookToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update webhook");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/admin/webhooks/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const [webhook] = await db.select().from(webhooksTable).where(eq(webhooksTable.id, id)).limit(1);
    if (!webhook) { res.status(404).json({ error: "Webhook not found" }); return; }
    if (webhook.isActive) { res.status(409).json({ error: "Disable the webhook before deleting it" }); return; }
    const [delivery] = await db.select({ id: webhookDeliveriesTable.id }).from(webhookDeliveriesTable).where(eq(webhookDeliveriesTable.webhookId, id)).limit(1);
    if (delivery) { res.status(409).json({ error: "Webhook has delivery logs and is retained for audit history" }); return; }
    const [deleted] = await db.delete(webhooksTable).where(eq(webhooksTable.id, id)).returning();
    if (!deleted) { res.status(404).json({ error: "Webhook not found" }); return; }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete webhook");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/webhooks/:id/deliveries", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = parseInt(firstString(req.params.id) ?? "", 10);
  if (isNaN(id)) { res.status(400).json({ error: "Invalid ID" }); return; }
  try {
    const deliveries = await db
      .select()
      .from(webhookDeliveriesTable)
      .where(eq(webhookDeliveriesTable.webhookId, id))
      .orderBy(desc(webhookDeliveriesTable.attemptedAt))
      .limit(50);
    res.json(deliveries.map(d => ({
      id: d.id,
      eventType: d.eventType,
      status: d.status,
      responseCode: d.responseCode ?? null,
      responseBody: d.responseBody ?? null,
      attemptedAt: d.attemptedAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch webhook deliveries");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
