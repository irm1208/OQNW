import { Router } from "express";
import type { Request, Response } from "express";
import { db } from "@workspace/db";
import { storeSettingsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
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
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT pg_advisory_xact_lock(731905241)`);
    const [existing] = await tx
      .select()
      .from(storeSettingsTable)
      .orderBy(storeSettingsTable.id)
      .limit(1);
    if (existing) return existing;
    const [created] = await tx.insert(storeSettingsTable).values({}).returning();
    if (!created) throw new Error("Store settings could not be initialized");
    return created;
  });
}

type SettingsUpdates = Partial<typeof storeSettingsTable.$inferInsert>;

function optionalText(value: unknown, label: string, maxLength: number): string | null {
  if (value === null) return null;
  if (typeof value !== "string") throw new Error(`${label} must be text`);
  const cleaned = value.trim();
  if (!cleaned) return null;
  if (cleaned.length > maxLength || /[\u0000-\u001f\u007f]/.test(cleaned)) {
    throw new Error(`${label} is invalid or too long`);
  }
  return cleaned;
}

function requiredText(value: unknown, label: string, maxLength: number): string {
  const cleaned = optionalText(value, label, maxLength);
  if (!cleaned) throw new Error(`${label} cannot be empty`);
  return cleaned;
}

function parseSettingsUpdates(value: unknown): SettingsUpdates {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Request body must be an object");
  }
  const body = value as Record<string, unknown>;
  const keys = Object.keys(body);
  const unknown = keys.filter((key) => !EDITABLE_FIELDS.includes(key as typeof EDITABLE_FIELDS[number]));
  if (unknown.length > 0) throw new Error(`Unsupported settings: ${unknown.join(", ")}`);
  if (keys.length === 0) throw new Error("At least one setting is required");

  const updates: SettingsUpdates = {};
  if ("storeName" in body) updates.storeName = requiredText(body.storeName, "Store name", 120);
  if ("supportEmail" in body) {
    updates.supportEmail = optionalText(body.supportEmail, "Support email", 254);
    if (updates.supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updates.supportEmail)) {
      throw new Error("Support email must be a valid email address");
    }
  }
  if ("supportPhone" in body) {
    updates.supportPhone = optionalText(body.supportPhone, "Support phone", 40);
    if (updates.supportPhone && !/^[+()0-9.\-\s]+$/.test(updates.supportPhone)) {
      throw new Error("Support phone contains invalid characters");
    }
  }
  if ("currency" in body) {
    updates.currency = requiredText(body.currency, "Currency", 3).toUpperCase();
    if (!/^[A-Z]{3}$/.test(updates.currency)) throw new Error("Currency must be a three-letter code");
  }
  if ("orderPrefix" in body) {
    updates.orderPrefix = requiredText(body.orderPrefix, "Order prefix", 12).toUpperCase();
    if (!/^[A-Z0-9-]+$/.test(updates.orderPrefix)) {
      throw new Error("Order prefix may contain only letters, numbers, and hyphens");
    }
  }
  const optionalFields = [
    ["addressLine1", "Address line 1", 200],
    ["addressLine2", "Address line 2", 200],
    ["city", "City", 100],
    ["postcode", "Postcode", 20],
    ["country", "Country", 100],
    ["announcementBanner", "Announcement banner", 500],
  ] as const;
  for (const [field, label, maxLength] of optionalFields) {
    if (field in body) updates[field] = optionalText(body[field], label, maxLength);
  }
  for (const field of ["maintenanceMode", "cryptoPaymentsEnabled"] as const) {
    if (field in body) {
      if (typeof body[field] !== "boolean") throw new Error(`${field} must be true or false`);
      updates[field] = body[field];
    }
  }
  if ("cryptoPaymentRoutes" in body) {
    if (typeof body.cryptoPaymentRoutes !== "string" || body.cryptoPaymentRoutes.length > 20_000) {
      throw new Error("Crypto payment routes must be valid JSON");
    }
    try {
      updates.cryptoPaymentRoutes = serializeCryptoRoutes(JSON.parse(body.cryptoPaymentRoutes));
    } catch {
      throw new Error("Crypto payment routes must be valid JSON");
    }
  }
  return updates;
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
    let updates: SettingsUpdates;
    try {
      updates = parseSettingsUpdates(req.body);
    } catch (err) {
      res.status(400).json({ error: err instanceof Error ? err.message : "Invalid settings" });
      return;
    }
    const [updated] = await db
      .update(storeSettingsTable)
      .set(updates)
      .where(eq(storeSettingsTable.id, current.id))
      .returning();
    if (!updated) {
      res.status(409).json({ error: "Store settings changed concurrently; reload and try again" });
      return;
    }
    res.json(settingsToResponse(updated));
  } catch (err) {
    req.log.error({ err }, "Failed to update store settings");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
