import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { storeSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { serializeCryptoRoutes } from "../../lib/crypto-payments";
import { hasSecureAdminSession } from "./auth";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (!hasSecureAdminSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

const EDITABLE_FIELDS = [
  "storeName", "supportEmail", "supportPhone", "currency", "orderPrefix",
  "addressLine1", "addressLine2", "city", "postcode", "country",
  "announcementBanner", "maintenanceMode",
  "cryptoPaymentsEnabled", "cryptoPaymentRoutes",
] as const;

function settingsToResponse(s: typeof storeSettingsTable.$inferSelect) {
  return {
    storeName: s.storeName,
    supportEmail: s.supportEmail ?? null,
    supportPhone: s.supportPhone ?? null,
    currency: s.currency,
    orderPrefix: s.orderPrefix,
    addressLine1: s.addressLine1 ?? null,
    addressLine2: s.addressLine2 ?? null,
    city: s.city ?? null,
    postcode: s.postcode ?? null,
    country: s.country ?? null,
    announcementBanner: s.announcementBanner ?? null,
    maintenanceMode: s.maintenanceMode,
    cryptoPaymentsEnabled: s.cryptoPaymentsEnabled,
    cryptoPaymentRoutes: s.cryptoPaymentRoutes,
    updatedAt: s.updatedAt.toISOString(),
  };
}

async function getOrCreateSettings() {
  const [existing] = await db.select().from(storeSettingsTable).limit(1);
  if (existing) return existing;
  const [created] = await db.insert(storeSettingsTable).values({}).returning();
  return created;
}

router.get("/admin/settings", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const settings = await getOrCreateSettings();
    res.json(settingsToResponse(settings));
  } catch (err) {
    req.log.error({ err }, "Failed to fetch store settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/admin/settings", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const current = await getOrCreateSettings();
    const body = req.body as Record<string, unknown>;
    const updates: Record<string, unknown> = {};
    for (const field of EDITABLE_FIELDS) {
      if (body[field] !== undefined) updates[field] = body[field];
    }
    if (typeof updates.storeName === "string" && !updates.storeName.trim()) {
      res.status(400).json({ error: "Store name cannot be empty" });
      return;
    }
    if (updates.cryptoPaymentsEnabled !== undefined && typeof updates.cryptoPaymentsEnabled !== "boolean") {
      res.status(400).json({ error: "Crypto payment setting must be true or false" });
      return;
    }
    if (updates.cryptoPaymentRoutes !== undefined) {
      if (typeof updates.cryptoPaymentRoutes !== "string") {
        res.status(400).json({ error: "Crypto payment routes must be valid JSON" });
        return;
      }
      try {
        updates.cryptoPaymentRoutes = serializeCryptoRoutes(JSON.parse(updates.cryptoPaymentRoutes));
      } catch {
        res.status(400).json({ error: "Crypto payment routes must be valid JSON" });
        return;
      }
    }
    const [updated] = await db
      .update(storeSettingsTable)
      .set(updates)
      .where(eq(storeSettingsTable.id, current.id))
      .returning();
    res.json(settingsToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update store settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
