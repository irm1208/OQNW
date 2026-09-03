import crypto from "crypto";
import { Router } from "express";
import type { Request, Response } from "express";
import {
  adminAuditEventsTable,
  affiliateCommissionsTable,
  affiliatePartnersTable,
  affiliateProgramSettingsTable,
  affiliateRewardCreditsTable,
  affiliateTiersTable,
  customersTable,
  db,
  discountCodesTable,
  ordersTable,
} from "@workspace/db";
import { and, asc, desc, eq, gte, ilike, inArray, or, sql } from "drizzle-orm";
import { affiliateTierProgress, newlyEarnedRewardCredits, type AffiliateTierRule } from "../../lib/affiliateProgram";
import { getClientIp } from "../../lib/geoip";
import { firstString } from "../../lib/query";
import { getSecureAdminSession, hasSecureAdminSession } from "./auth";

const router = Router();
const money = (value: unknown) => Number.parseFloat(String(value ?? 0)) || 0;
const integer = (value: unknown) => Number.parseInt(String(value ?? ""), 10);
const PARTNER_STATUSES = new Set(["pending", "approved", "rejected", "suspended"]);
const COMMISSION_STATUSES = new Set(["all", "pending", "approved", "held", "voided", "paid"]);
const REWARD_STATUSES = new Set(["all", "pending", "available", "claimed", "fulfilled", "voided"]);

const DEFAULT_TIERS = [
  { name: "Starter", slug: "starter", minimumSalesGbp: "0", commissionRatePercent: "5", rewardCreditGbp: "0", sortOrder: 0 },
  { name: "Growth", slug: "growth", minimumSalesGbp: "1000", commissionRatePercent: "8", rewardCreditGbp: "50", sortOrder: 1 },
  { name: "Elite", slug: "elite", minimumSalesGbp: "2500", commissionRatePercent: "10", rewardCreditGbp: "75", sortOrder: 2 },
];

function requireAdmin(req: Request, res: Response): boolean {
  if (!hasSecureAdminSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function iso(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function settingsToResponse(settings: typeof affiliateProgramSettingsTable.$inferSelect) {
  return {
    id: settings.id,
    attributionWindowDays: settings.attributionWindowDays,
    reviewHoldDays: settings.reviewHoldDays,
    customerDiscountPercent: money(settings.customerDiscountPercent),
    freeRewardThresholdGbp: money(settings.freeRewardThresholdGbp),
    freeRewardValueCapGbp: money(settings.freeRewardValueCapGbp),
    maxFreeRewardsPerPeriod: settings.maxFreeRewardsPerPeriod,
    payoutThresholdGbp: money(settings.payoutThresholdGbp),
    tierWindowDays: settings.tierWindowDays,
    updatedAt: settings.updatedAt.toISOString(),
  };
}

function tierToResponse(tier: typeof affiliateTiersTable.$inferSelect) {
  return {
    id: tier.id,
    name: tier.name,
    slug: tier.slug,
    minimumSalesGbp: money(tier.minimumSalesGbp),
    commissionRatePercent: money(tier.commissionRatePercent),
    rewardCreditGbp: money(tier.rewardCreditGbp),
    isActive: tier.isActive,
    sortOrder: tier.sortOrder,
    createdAt: tier.createdAt.toISOString(),
    updatedAt: tier.updatedAt.toISOString(),
  };
}

async function ensureDefaults() {
  await db.insert(affiliateProgramSettingsTable).values({ id: 1 }).onConflictDoNothing();
  for (const tier of DEFAULT_TIERS) {
    await db.insert(affiliateTiersTable).values(tier).onConflictDoNothing({ target: affiliateTiersTable.slug });
  }
}

async function writeAudit(req: Request, eventType: string, metadata: Record<string, unknown>) {
  const session = getSecureAdminSession(req);
  await db.insert(adminAuditEventsTable).values({
    eventType,
    email: session?.email ?? null,
    ip: getClientIp(req),
    userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
    requestId: String(req.id),
    success: true,
    metadata,
  });
}

function generateCode(name: string, prefix: string): string {
  const normalized = name.replace(/[^a-z0-9]+/gi, "").slice(0, 10).toUpperCase() || "PARTNER";
  return `${prefix}${normalized}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
}

async function uniqueCodes(name: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const trackingCode = generateCode(name, "OQ-");
    const discountCode = generateCode(name, "OQ-");
    const [existingPartner, existingDiscount] = await Promise.all([
      db.select({ id: affiliatePartnersTable.id }).from(affiliatePartnersTable).where(
        or(eq(affiliatePartnersTable.trackingCode, trackingCode), eq(affiliatePartnersTable.discountCode, discountCode)),
      ).limit(1),
      db.select({ id: discountCodesTable.id }).from(discountCodesTable).where(eq(discountCodesTable.code, discountCode)).limit(1),
    ]);
    if (!existingPartner.length && !existingDiscount.length) return { trackingCode, discountCode };
  }
  throw new Error("Could not generate unique affiliate codes");
}

function parsePercent(value: unknown, label: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) throw new Error(`${label} must be between 0 and 100`);
  return Math.round(parsed * 100) / 100;
}

function parseMoney(value: unknown, label: string, allowZero = true): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || (allowZero ? parsed < 0 : parsed <= 0)) throw new Error(`${label} must be ${allowZero ? "0 or greater" : "greater than 0"}`);
  return Math.round(parsed * 100) / 100;
}

function partnerToResponse(partner: typeof affiliatePartnersTable.$inferSelect, customer?: typeof customersTable.$inferSelect | null) {
  return {
    id: partner.id,
    customerId: partner.customerId,
    name: partner.name,
    email: partner.email,
    trackingCode: partner.trackingCode,
    discountCode: partner.discountCode,
    discountPercent: money(partner.discountPercent),
    status: partner.status,
    channelUrl: partner.channelUrl,
    audienceDescription: partner.audienceDescription,
    promotionPlan: partner.promotionPlan,
    notes: partner.notes,
    approvedAt: iso(partner.approvedAt),
    suspendedAt: iso(partner.suspendedAt),
    createdAt: partner.createdAt.toISOString(),
    updatedAt: partner.updatedAt.toISOString(),
    customer: customer ? {
      id: customer.id,
      name: `${customer.firstName} ${customer.lastName}`.trim(),
      email: customer.email,
    } : null,
  };
}

router.get("/admin/affiliates/overview", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    await ensureDefaults();
    const [settings, tiers, partnerStats, commissionStats, rewardStats] = await Promise.all([
      db.select().from(affiliateProgramSettingsTable).where(eq(affiliateProgramSettingsTable.id, 1)).limit(1),
      db.select().from(affiliateTiersTable).orderBy(asc(affiliateTiersTable.sortOrder), asc(affiliateTiersTable.id)),
      db.select({ status: affiliatePartnersTable.status, count: sql<number>`count(*)` }).from(affiliatePartnersTable).groupBy(affiliatePartnersTable.status),
      db.select({ status: affiliateCommissionsTable.status, amountGbp: sql<string>`coalesce(sum(${affiliateCommissionsTable.amountGbp}), 0)`, count: sql<number>`count(*)` }).from(affiliateCommissionsTable).groupBy(affiliateCommissionsTable.status),
      db.select({ status: affiliateRewardCreditsTable.status, amountGbp: sql<string>`coalesce(sum(${affiliateRewardCreditsTable.creditValueGbp}), 0)`, count: sql<number>`count(*)` }).from(affiliateRewardCreditsTable).groupBy(affiliateRewardCreditsTable.status),
    ]);
    if (!settings[0]) {
      res.status(500).json({ error: "Affiliate settings could not be initialized" });
      return;
    }
    const partnerCounts: Record<string, number> = Object.fromEntries(partnerStats.map(row => [row.status, Number(row.count)]));
    const commissionTotals = Object.fromEntries(commissionStats.map(row => [row.status, { count: Number(row.count), amountGbp: money(row.amountGbp) }]));
    const rewardTotals = Object.fromEntries(rewardStats.map(row => [row.status, { count: Number(row.count), amountGbp: money(row.amountGbp) }]));
    res.setHeader("Cache-Control", "no-store");
    const totalPartners = Object.values(partnerCounts).reduce((sum, value) => sum + value, 0);
    res.json({
      settings: settingsToResponse(settings[0]),
      tiers: tiers.map(tierToResponse),
      stats: {
        totalPartners,
        activePartners: partnerCounts.approved ?? 0,
        pendingCommissionsGbp: commissionTotals.pending?.amountGbp ?? 0,
        approvedCommissionsGbp: commissionTotals.approved?.amountGbp ?? 0,
        paidCommissionsGbp: commissionTotals.paid?.amountGbp ?? 0,
        pendingRewards: rewardTotals.pending?.count ?? 0,
        availableRewards: rewardTotals.available?.count ?? 0,
        claimedRewards: rewardTotals.claimed?.count ?? 0,
        fulfilledRewards: rewardTotals.fulfilled?.count ?? 0,
        partners: {
          total: totalPartners,
          pending: partnerCounts.pending ?? 0,
          approved: partnerCounts.approved ?? 0,
          suspended: partnerCounts.suspended ?? 0,
        },
        commissions: commissionTotals,
        rewards: rewardTotals,
      },
    });
  } catch (err) {
    req.log.error({ err }, "Failed to load affiliate overview");
    res.status(500).json({ error: "Failed to load affiliate overview" });
  }
});

router.patch("/admin/affiliates/settings", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const body = req.body as Record<string, unknown>;
  try {
    const updates: Partial<typeof affiliateProgramSettingsTable.$inferInsert> = {};
    if (body.attributionWindowDays !== undefined) {
      const value = integer(body.attributionWindowDays);
      if (!Number.isInteger(value) || value < 1 || value > 365) throw new Error("Attribution window must be between 1 and 365 days");
      updates.attributionWindowDays = value;
    }
    if (body.reviewHoldDays !== undefined) {
      const value = integer(body.reviewHoldDays);
      if (!Number.isInteger(value) || value < 0 || value > 180) throw new Error("Review hold must be between 0 and 180 days");
      updates.reviewHoldDays = value;
    }
    if (body.customerDiscountPercent !== undefined) updates.customerDiscountPercent = String(parsePercent(body.customerDiscountPercent, "Customer discount"));
    if (body.freeRewardThresholdGbp !== undefined) updates.freeRewardThresholdGbp = String(parseMoney(body.freeRewardThresholdGbp, "Free reward threshold", false));
    if (body.freeRewardValueCapGbp !== undefined) updates.freeRewardValueCapGbp = String(parseMoney(body.freeRewardValueCapGbp, "Free reward cap", false));
    if (body.maxFreeRewardsPerPeriod !== undefined) {
      const value = integer(body.maxFreeRewardsPerPeriod);
      if (!Number.isInteger(value) || value < 1 || value > 20) throw new Error("Maximum free rewards must be between 1 and 20");
      updates.maxFreeRewardsPerPeriod = value;
    }
    if (body.payoutThresholdGbp !== undefined) updates.payoutThresholdGbp = String(parseMoney(body.payoutThresholdGbp, "Payout threshold", false));
    if (body.tierWindowDays !== undefined) {
      const value = integer(body.tierWindowDays);
      if (!Number.isInteger(value) || value < 30 || value > 365) throw new Error("Tier window must be between 30 and 365 days");
      updates.tierWindowDays = value;
    }
    if (!Object.keys(updates).length) {
      res.status(400).json({ error: "At least one setting is required" });
      return;
    }
    await ensureDefaults();
    const [updated] = await db.update(affiliateProgramSettingsTable).set(updates).where(eq(affiliateProgramSettingsTable.id, 1)).returning();
    await writeAudit(req, "affiliate_settings_updated", { fields: Object.keys(updates) });
    res.json({ settings: updated ? settingsToResponse(updated) : null });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid affiliate settings";
    if (message.includes("must be") || message.includes("required")) {
      res.status(400).json({ error: message });
      return;
    }
    req.log.error({ err }, "Failed to update affiliate settings");
    res.status(500).json({ error: "Failed to update affiliate settings" });
  }
});

router.post("/admin/affiliates/tiers", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const body = req.body as Record<string, unknown>;
  if (typeof body.name !== "string" || body.name.trim().length < 2 || typeof body.slug !== "string" || !/^[a-z0-9-]{2,30}$/.test(body.slug)) {
    res.status(400).json({ error: "Name and a lowercase slug are required" });
    return;
  }
  try {
    const [created] = await db.insert(affiliateTiersTable).values({
      name: body.name.trim(),
      slug: body.slug,
      minimumSalesGbp: String(parseMoney(body.minimumSalesGbp, "Minimum sales")),
      commissionRatePercent: String(parsePercent(body.commissionRatePercent, "Commission rate")),
      rewardCreditGbp: String(parseMoney(body.rewardCreditGbp ?? 0, "Reward credit")),
      isActive: body.isActive !== false,
      sortOrder: Number.isInteger(body.sortOrder) ? Number(body.sortOrder) : 0,
    }).returning();
    await writeAudit(req, "affiliate_tier_created", { tierId: created.id, slug: created.slug });
    res.status(201).json({ tier: tierToResponse(created) });
  } catch (err) {
    if ((err as { code?: string })?.code === "23505") {
      res.status(409).json({ error: "A tier with that slug already exists" });
      return;
    }
    req.log.error({ err }, "Failed to create affiliate tier");
    res.status(500).json({ error: "Failed to create affiliate tier" });
  }
});

router.patch("/admin/affiliates/tiers/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = integer(firstString(req.params.id));
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid tier ID" });
    return;
  }
  const body = req.body as Record<string, unknown>;
  try {
    const updates: Partial<typeof affiliateTiersTable.$inferInsert> = {};
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length < 2) throw new Error("Tier name is required");
      updates.name = body.name.trim();
    }
    if (body.slug !== undefined) {
      if (typeof body.slug !== "string" || !/^[a-z0-9-]{2,30}$/.test(body.slug)) throw new Error("Tier slug must be lowercase letters, numbers, or hyphens");
      updates.slug = body.slug;
    }
    if (body.minimumSalesGbp !== undefined) updates.minimumSalesGbp = String(parseMoney(body.minimumSalesGbp, "Minimum sales"));
    if (body.commissionRatePercent !== undefined) updates.commissionRatePercent = String(parsePercent(body.commissionRatePercent, "Commission rate"));
    if (body.rewardCreditGbp !== undefined) updates.rewardCreditGbp = String(parseMoney(body.rewardCreditGbp, "Reward credit"));
    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") throw new Error("Active status must be boolean");
      updates.isActive = body.isActive;
    }
    if (body.sortOrder !== undefined) {
      const value = integer(body.sortOrder);
      if (!Number.isInteger(value) || value < 0) throw new Error("Sort order must be a non-negative integer");
      updates.sortOrder = value;
    }
    if (!Object.keys(updates).length) {
      res.status(400).json({ error: "No tier changes supplied" });
      return;
    }
    const [updated] = await db.update(affiliateTiersTable).set(updates).where(eq(affiliateTiersTable.id, id)).returning();
    if (!updated) {
      res.status(404).json({ error: "Tier not found" });
      return;
    }
    await writeAudit(req, "affiliate_tier_updated", { tierId: id, fields: Object.keys(updates) });
    res.json({ tier: tierToResponse(updated) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid affiliate tier";
    if (message.includes("required") || message.includes("must be") || message.includes("No tier")) {
      res.status(400).json({ error: message });
      return;
    }
    if ((err as { code?: string })?.code === "23505") {
      res.status(409).json({ error: "A tier with that slug already exists" });
      return;
    }
    req.log.error({ err }, "Failed to update affiliate tier");
    res.status(500).json({ error: "Failed to update affiliate tier" });
  }
});

router.get("/admin/affiliates/partners", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const requestedStatus = typeof req.query.status === "string" ? req.query.status : "all";
  const status = PARTNER_STATUSES.has(requestedStatus) ? requestedStatus : "all";
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  try {
    await ensureDefaults();
    const conditions = [];
    if (status !== "all") conditions.push(eq(affiliatePartnersTable.status, status));
    if (search) conditions.push(or(
      ilike(affiliatePartnersTable.name, `%${search}%`),
      ilike(affiliatePartnersTable.email, `%${search}%`),
      ilike(affiliatePartnersTable.trackingCode, `%${search}%`),
    ));
    const [settingsRows, tierRows, rows] = await Promise.all([
      db.select().from(affiliateProgramSettingsTable).where(eq(affiliateProgramSettingsTable.id, 1)).limit(1),
      db.select().from(affiliateTiersTable).where(eq(affiliateTiersTable.isActive, true)).orderBy(asc(affiliateTiersTable.minimumSalesGbp)),
      db
        .select({ partner: affiliatePartnersTable, customer: customersTable })
        .from(affiliatePartnersTable)
        .leftJoin(customersTable, eq(affiliatePartnersTable.customerId, customersTable.id))
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(affiliatePartnersTable.createdAt))
        .limit(200),
    ]);
    const settings = settingsRows[0];
    const cutoff = new Date(Date.now() - (settings?.tierWindowDays ?? 90) * 24 * 60 * 60 * 1000);
    const salesRows = await db.select({
      partnerId: affiliateCommissionsTable.partnerId,
      settledSalesGbp: sql<string>`coalesce(sum(${affiliateCommissionsTable.eligibleSalesGbp}), 0)`,
    }).from(affiliateCommissionsTable).where(and(
      inArray(affiliateCommissionsTable.status, ["approved", "paid"]),
      gte(affiliateCommissionsTable.createdAt, cutoff),
    )).groupBy(affiliateCommissionsTable.partnerId);
    const salesByPartner = new Map(salesRows.map(row => [row.partnerId, money(row.settledSalesGbp)]));
    const tierRules: AffiliateTierRule[] = tierRows.map(tier => ({
      id: tier.id,
      name: tier.name,
      slug: tier.slug,
      minimumSalesGbp: money(tier.minimumSalesGbp),
      commissionRatePercent: money(tier.commissionRatePercent),
      rewardCreditGbp: money(tier.rewardCreditGbp),
      isActive: tier.isActive,
    }));
    res.json({ partners: rows.map(row => ({
      ...partnerToResponse(row.partner, row.customer),
      tierProgress: affiliateTierProgress(tierRules, salesByPartner.get(row.partner.id) ?? 0),
    })) });
  } catch (err) {
    req.log.error({ err }, "Failed to list affiliate partners");
    res.status(500).json({ error: "Failed to list affiliate partners" });
  }
});

router.post("/admin/affiliates/partners", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const body = req.body as Record<string, unknown>;
  if (typeof body.name !== "string" || body.name.trim().length < 2 || typeof body.email !== "string" || !body.email.includes("@")) {
    res.status(400).json({ error: "A valid name and email are required" });
    return;
  }
  const name = body.name.trim();
  const email = body.email.trim().toLowerCase();
  try {
    const existing = await db.select({ id: affiliatePartnersTable.id }).from(affiliatePartnersTable).where(eq(affiliatePartnersTable.email, email)).limit(1);
    if (existing.length) {
      res.status(409).json({ error: "An affiliate already exists for that email" });
      return;
    }
    const discountPercent = parsePercent(body.discountPercent ?? 10, "Discount percent");
    const customerId = body.customerId === undefined || body.customerId === null || body.customerId === "" ? null : integer(body.customerId);
    if (customerId !== null && !Number.isInteger(customerId)) throw new Error("Customer ID must be a number");
    const codes = await uniqueCodes(name);
    const created = await db.transaction(async tx => {
      if (customerId !== null) {
        const [customer] = await tx.select({ id: customersTable.id }).from(customersTable).where(eq(customersTable.id, customerId)).limit(1);
        if (!customer) throw new Error("Customer not found");
      }
      const [partner] = await tx.insert(affiliatePartnersTable).values({
        customerId,
        name,
        email,
        trackingCode: codes.trackingCode,
        discountCode: codes.discountCode,
        discountPercent: String(discountPercent),
        status: "pending",
        channelUrl: typeof body.channelUrl === "string" ? body.channelUrl.trim().slice(0, 300) || null : null,
        audienceDescription: typeof body.audienceDescription === "string" ? body.audienceDescription.trim().slice(0, 1000) || null : null,
        promotionPlan: typeof body.promotionPlan === "string" ? body.promotionPlan.trim().slice(0, 1500) || null : null,
        notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) || null : null,
      }).returning();
      await tx.insert(discountCodesTable).values({
        code: codes.discountCode,
        type: "percentage",
        value: String(discountPercent),
        affiliatePartnerId: partner.id,
        isActive: false,
      });
      const [customer] = customerId !== null
        ? await tx.select().from(customersTable).where(eq(customersTable.id, customerId)).limit(1)
        : [];
      return { partner, customer };
    });
    await writeAudit(req, "affiliate_partner_created", { partnerId: created.partner.id, status: created.partner.status });
    res.status(201).json({ partner: partnerToResponse(created.partner, created.customer) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "Customer not found" || message.includes("must be") || message.includes("Could not generate")) {
      res.status(400).json({ error: message });
      return;
    }
    if ((err as { code?: string })?.code === "23505") {
      res.status(409).json({ error: "Affiliate or discount code already exists" });
      return;
    }
    req.log.error({ err }, "Failed to create affiliate partner");
    res.status(500).json({ error: "Failed to create affiliate partner" });
  }
});

router.patch("/admin/affiliates/partners/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = integer(firstString(req.params.id));
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid partner ID" });
    return;
  }
  const body = req.body as Record<string, unknown>;
  try {
    const current = await db.select().from(affiliatePartnersTable).where(eq(affiliatePartnersTable.id, id)).limit(1);
    if (!current[0]) {
      res.status(404).json({ error: "Affiliate partner not found" });
      return;
    }
    const updates: Partial<typeof affiliatePartnersTable.$inferInsert> = {};
    if (body.name !== undefined) {
      if (typeof body.name !== "string" || body.name.trim().length < 2) throw new Error("Partner name is required");
      updates.name = body.name.trim();
    }
    if (body.email !== undefined) {
      if (typeof body.email !== "string" || !body.email.includes("@")) throw new Error("A valid partner email is required");
      updates.email = body.email.trim().toLowerCase();
    }
    if (body.discountPercent !== undefined) updates.discountPercent = String(parsePercent(body.discountPercent, "Discount percent"));
    if (body.channelUrl !== undefined) updates.channelUrl = typeof body.channelUrl === "string" ? body.channelUrl.trim().slice(0, 300) || null : null;
    if (body.audienceDescription !== undefined) updates.audienceDescription = typeof body.audienceDescription === "string" ? body.audienceDescription.trim().slice(0, 1000) || null : null;
    if (body.promotionPlan !== undefined) updates.promotionPlan = typeof body.promotionPlan === "string" ? body.promotionPlan.trim().slice(0, 1500) || null : null;
    if (body.notes !== undefined) updates.notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 1000) || null : null;
    const nextStatus = body.status;
    if (nextStatus !== undefined) {
      if (typeof nextStatus !== "string" || !PARTNER_STATUSES.has(nextStatus)) throw new Error("Invalid partner status");
      updates.status = nextStatus;
      updates.approvedAt = nextStatus === "approved" ? new Date() : current[0].approvedAt;
      updates.suspendedAt = nextStatus === "suspended" ? new Date() : nextStatus === "approved" ? null : current[0].suspendedAt;
    }
    if (!Object.keys(updates).length) {
      res.status(400).json({ error: "No partner changes supplied" });
      return;
    }
    const updated = await db.transaction(async tx => {
      const [partner] = await tx.update(affiliatePartnersTable).set(updates).where(eq(affiliatePartnersTable.id, id)).returning();
      if (!partner) throw new Error("Affiliate partner not found");
      if (updates.status !== undefined || updates.discountPercent !== undefined) {
        await tx.update(discountCodesTable).set({
          ...(updates.discountPercent !== undefined ? { value: String(updates.discountPercent) } : {}),
          ...(updates.status !== undefined ? { isActive: updates.status === "approved" } : {}),
        }).where(eq(discountCodesTable.affiliatePartnerId, id));
      }
      const [customer] = partner.customerId !== null
        ? await tx.select().from(customersTable).where(eq(customersTable.id, partner.customerId)).limit(1)
        : [];
      return { partner, customer };
    });
    await writeAudit(req, "affiliate_partner_updated", { partnerId: id, fields: Object.keys(updates), status: updated.partner.status });
    res.json({ partner: partnerToResponse(updated.partner, updated.customer) });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message.includes("required") || message.includes("Invalid") || message.includes("No partner")) {
      res.status(400).json({ error: message });
      return;
    }
    if ((err as { code?: string })?.code === "23505") {
      res.status(409).json({ error: "That email is already used by another affiliate" });
      return;
    }
    req.log.error({ err }, "Failed to update affiliate partner");
    res.status(500).json({ error: "Failed to update affiliate partner" });
  }
});

router.get("/admin/affiliates/commissions", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const requestedStatus = typeof req.query.status === "string" ? req.query.status : "all";
  const status = COMMISSION_STATUSES.has(requestedStatus) ? requestedStatus : "all";
  try {
    const rows = await db.select({
      commission: affiliateCommissionsTable,
      partner: affiliatePartnersTable,
      order: { orderNumber: ordersTable.orderNumber, status: ordersTable.status },
    }).from(affiliateCommissionsTable)
      .innerJoin(affiliatePartnersTable, eq(affiliateCommissionsTable.partnerId, affiliatePartnersTable.id))
      .leftJoin(ordersTable, eq(affiliateCommissionsTable.orderId, ordersTable.id))
      .where(status === "all" ? undefined : eq(affiliateCommissionsTable.status, status))
      .orderBy(desc(affiliateCommissionsTable.createdAt))
      .limit(200);
    res.json({ commissions: rows.map(row => ({
      id: row.commission.id,
      partnerId: row.commission.partnerId,
      partnerName: row.partner.name,
      partnerEmail: row.partner.email,
      orderId: row.commission.orderId,
      orderNumber: row.order?.orderNumber ?? null,
      orderStatus: row.order?.status ?? null,
      eligibleSalesGbp: money(row.commission.eligibleSalesGbp),
      commissionRatePercent: money(row.commission.commissionRatePercent),
      amountGbp: money(row.commission.amountGbp),
      status: row.commission.status,
      statusReason: row.commission.statusReason,
      periodKey: row.commission.periodKey,
      approvedAt: iso(row.commission.approvedAt),
      heldAt: iso(row.commission.heldAt),
      voidedAt: iso(row.commission.voidedAt),
      paidAt: iso(row.commission.paidAt),
      createdAt: row.commission.createdAt.toISOString(),
      dates: {
        createdAt: row.commission.createdAt.toISOString(),
        approvedAt: iso(row.commission.approvedAt),
        heldAt: iso(row.commission.heldAt),
        voidedAt: iso(row.commission.voidedAt),
        paidAt: iso(row.commission.paidAt),
      },
    })) });
  } catch (err) {
    req.log.error({ err }, "Failed to list affiliate commissions");
    res.status(500).json({ error: "Failed to list affiliate commissions" });
  }
});

router.post("/admin/affiliates/commissions/:id/:action", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = integer(firstString(req.params.id));
  const action = firstString(req.params.action);
  if (!Number.isInteger(id) || !action || !["approve", "hold", "void", "paid"].includes(action)) {
    res.status(400).json({ error: "Invalid commission action" });
    return;
  }
  const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 500) : "";
  if (!reason) {
    res.status(400).json({ error: "A reason is required" });
    return;
  }
  try {
    const updated = await db.transaction(async tx => {
      const [current] = await tx.select().from(affiliateCommissionsTable).where(eq(affiliateCommissionsTable.id, id)).limit(1);
      if (!current) throw new Error("Commission not found");
      const nextStatus = action === "approve" ? "approved" : action === "paid" ? "paid" : action;
      const allowed = action === "approve"
        ? ["pending", "held"].includes(current.status)
        : action === "hold"
          ? ["pending", "approved"].includes(current.status)
          : action === "paid"
            ? current.status === "approved"
            : !["voided", "paid"].includes(current.status);
      if (!allowed) throw new Error(`Cannot ${action} a ${current.status} commission`);
      const now = new Date();
      const session = getSecureAdminSession(req);
      const [result] = await tx.update(affiliateCommissionsTable).set({
        status: nextStatus,
        statusReason: reason,
        approvedAt: action === "approve" ? now : current.approvedAt,
        heldAt: action === "hold" ? now : action === "approve" ? null : current.heldAt,
        voidedAt: action === "void" ? now : current.voidedAt,
        paidAt: action === "paid" ? now : current.paidAt,
        updatedAt: now,
      }).where(eq(affiliateCommissionsTable.id, id)).returning();
      if (action === "approve") {
        const [settingsRows, tiers] = await Promise.all([
          tx.select().from(affiliateProgramSettingsTable).where(eq(affiliateProgramSettingsTable.id, 1)).limit(1),
          tx.select().from(affiliateTiersTable).where(eq(affiliateTiersTable.isActive, true))
            .orderBy(asc(affiliateTiersTable.minimumSalesGbp), asc(affiliateTiersTable.id)),
        ]);
        const settings = settingsRows[0];
        if (settings) {
          const periodCutoff = new Date(now.getTime() - settings.tierWindowDays * 24 * 60 * 60 * 1000);
          const [salesRows, existingRewards] = await Promise.all([
            tx.select({
              settledSalesGbp: sql<string>`coalesce(sum(${affiliateCommissionsTable.eligibleSalesGbp}), 0)`,
            }).from(affiliateCommissionsTable).where(and(
              eq(affiliateCommissionsTable.partnerId, current.partnerId),
              inArray(affiliateCommissionsTable.status, ["approved", "paid"]),
              gte(affiliateCommissionsTable.createdAt, periodCutoff),
            )),
            tx.select({ id: affiliateRewardCreditsTable.id }).from(affiliateRewardCreditsTable).where(and(
              eq(affiliateRewardCreditsTable.partnerId, current.partnerId),
              gte(affiliateRewardCreditsTable.createdAt, periodCutoff),
              sql`${affiliateRewardCreditsTable.status} <> 'voided'`,
            )),
          ]);
          const settledSales = money(salesRows[0]?.settledSalesGbp);
          const previousSettledSales = Math.max(0, settledSales - money(current.eligibleSalesGbp));
          const remainingRewardCapacity = Math.max(0, settings.maxFreeRewardsPerPeriod - existingRewards.length);
          const rewardsEarned = newlyEarnedRewardCredits(
            previousSettledSales,
            settledSales,
            money(settings.freeRewardThresholdGbp),
            remainingRewardCapacity,
          );
          const tierRules: AffiliateTierRule[] = tiers.map(tier => ({
            id: tier.id,
            name: tier.name,
            slug: tier.slug,
            minimumSalesGbp: money(tier.minimumSalesGbp),
            commissionRatePercent: money(tier.commissionRatePercent),
            rewardCreditGbp: money(tier.rewardCreditGbp),
            isActive: tier.isActive,
          }));
          const currentTier = affiliateTierProgress(tierRules, settledSales).currentTier;
          const creditValueGbp = Math.min(
            money(settings.freeRewardValueCapGbp),
            currentTier?.rewardCreditGbp || money(settings.freeRewardValueCapGbp),
          );
          if (rewardsEarned > 0 && creditValueGbp > 0) {
            const firstMilestone = Math.floor(previousSettledSales / money(settings.freeRewardThresholdGbp)) + 1;
            await tx.insert(affiliateRewardCreditsTable).values(
              Array.from({ length: rewardsEarned }, (_, index) => ({
                partnerId: current.partnerId,
                commissionId: current.id,
                qualifyingSalesGbp: ((firstMilestone + index) * money(settings.freeRewardThresholdGbp)).toFixed(2),
                creditValueGbp: creditValueGbp.toFixed(2),
                status: "pending",
              })),
            );
          }
        }
      } else if (action === "hold" || action === "void") {
        await tx.update(affiliateRewardCreditsTable).set({
          status: action === "void" ? "voided" : "pending",
          statusReason: `Commission ${action}: ${reason}`,
          voidedAt: action === "void" ? now : null,
          updatedAt: now,
        }).where(and(
          eq(affiliateRewardCreditsTable.commissionId, current.id),
          inArray(affiliateRewardCreditsTable.status, ["pending", "available"]),
        ));
      }
      await tx.insert(adminAuditEventsTable).values({
        eventType: `affiliate_commission_${action}`,
        email: session?.email ?? null,
        ip: getClientIp(req),
        userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
        requestId: String(req.id),
        success: true,
        metadata: { commissionId: id, previousStatus: current.status, status: nextStatus, reason },
      });
      return result;
    });
    res.json({ commission: { ...updated, amountGbp: money(updated.amountGbp), eligibleSalesGbp: money(updated.eligibleSalesGbp), commissionRatePercent: money(updated.commissionRatePercent) } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "Commission not found") {
      res.status(404).json({ error: message });
      return;
    }
    if (message.startsWith("Cannot")) {
      res.status(409).json({ error: message });
      return;
    }
    req.log.error({ err, id, action }, "Failed to update affiliate commission");
    res.status(500).json({ error: "Failed to update affiliate commission" });
  }
});

router.get("/admin/affiliates/rewards", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const requestedStatus = typeof req.query.status === "string" ? req.query.status : "all";
  const status = REWARD_STATUSES.has(requestedStatus) ? requestedStatus : "all";
  try {
    const rows = await db.select({ reward: affiliateRewardCreditsTable, partner: affiliatePartnersTable })
      .from(affiliateRewardCreditsTable)
      .innerJoin(affiliatePartnersTable, eq(affiliateRewardCreditsTable.partnerId, affiliatePartnersTable.id))
      .where(status === "all" ? undefined : eq(affiliateRewardCreditsTable.status, status))
      .orderBy(desc(affiliateRewardCreditsTable.createdAt))
      .limit(200);
    res.json({ rewards: rows.map(row => ({
      id: row.reward.id,
      partnerId: row.reward.partnerId,
      partnerName: row.partner.name,
      partnerEmail: row.partner.email,
      qualifyingSalesGbp: money(row.reward.qualifyingSalesGbp),
      creditValueGbp: money(row.reward.creditValueGbp),
      status: row.reward.status,
      productSlug: row.reward.productSlug,
      claimedProductName: row.reward.claimedProductName,
      statusReason: row.reward.statusReason,
      lastAdminActor: row.reward.lastAdminActor,
      availableAt: iso(row.reward.availableAt),
      claimedAt: iso(row.reward.claimedAt),
      fulfilledAt: iso(row.reward.fulfilledAt),
      voidedAt: iso(row.reward.voidedAt),
      createdAt: row.reward.createdAt.toISOString(),
      dates: {
        createdAt: row.reward.createdAt.toISOString(),
        approvedAt: iso(row.reward.availableAt),
        claimedAt: iso(row.reward.claimedAt),
        fulfilledAt: iso(row.reward.fulfilledAt),
        voidedAt: iso(row.reward.voidedAt),
      },
    })) });
  } catch (err) {
    req.log.error({ err }, "Failed to list affiliate rewards");
    res.status(500).json({ error: "Failed to list affiliate rewards" });
  }
});

router.post("/admin/affiliates/rewards/:id/:action", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = integer(firstString(req.params.id));
  const action = firstString(req.params.action);
  if (!Number.isInteger(id) || !action || !["approve", "fulfill", "void"].includes(action)) {
    res.status(400).json({ error: "Invalid reward action" });
    return;
  }
  const reason = typeof req.body?.reason === "string" ? req.body.reason.trim().slice(0, 500) : "";
  if (!reason) {
    res.status(400).json({ error: "A reason is required" });
    return;
  }
  try {
    const updated = await db.transaction(async tx => {
      const [current] = await tx.select().from(affiliateRewardCreditsTable).where(eq(affiliateRewardCreditsTable.id, id)).limit(1);
      if (!current) throw new Error("Reward not found");
      const allowed = action === "approve"
        ? current.status === "pending"
        : action === "fulfill"
          ? ["available", "claimed"].includes(current.status)
          : !["voided", "fulfilled"].includes(current.status);
      if (!allowed) throw new Error(`Cannot ${action} a ${current.status} reward`);
      const now = new Date();
      const session = getSecureAdminSession(req);
      const [result] = await tx.update(affiliateRewardCreditsTable).set({
        status: action === "approve" ? "available" : action === "fulfill" ? "fulfilled" : "voided",
        statusReason: reason,
        lastAdminActor: session?.email ?? null,
        availableAt: action === "approve" ? now : current.availableAt,
        fulfilledAt: action === "fulfill" ? now : current.fulfilledAt,
        voidedAt: action === "void" ? now : current.voidedAt,
        updatedAt: now,
      }).where(eq(affiliateRewardCreditsTable.id, id)).returning();
      await tx.insert(adminAuditEventsTable).values({
        eventType: `affiliate_reward_${action}`,
        email: session?.email ?? null,
        ip: getClientIp(req),
        userAgent: req.get("user-agent")?.slice(0, 500) ?? null,
        requestId: String(req.id),
        success: true,
        metadata: { rewardId: id, previousStatus: current.status, status: result.status, reason },
      });
      return result;
    });
    res.json({ reward: { ...updated, qualifyingSalesGbp: money(updated.qualifyingSalesGbp), creditValueGbp: money(updated.creditValueGbp) } });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "Reward not found") {
      res.status(404).json({ error: message });
      return;
    }
    if (message.startsWith("Cannot")) {
      res.status(409).json({ error: message });
      return;
    }
    req.log.error({ err, id, action }, "Failed to update affiliate reward");
    res.status(500).json({ error: "Failed to update affiliate reward" });
  }
});

export default router;