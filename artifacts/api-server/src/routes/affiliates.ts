import crypto from "crypto";
import { Router } from "express";
import type { Request, Response } from "express";
import { and, asc, desc, eq, inArray, ne, or, sql } from "drizzle-orm";
import {
  affiliateCommissionsTable,
  affiliatePartnersTable,
  affiliateProgramSettingsTable,
  affiliateRewardCreditsTable,
  affiliateTiersTable,
  customersTable,
  discountCodesTable,
  productsCatalogTable,
  db,
} from "@workspace/db";
import {
  AFFILIATE_ATTRIBUTION_COOKIE,
  createAffiliateAttributionToken,
} from "../lib/affiliateAttribution";
import { requireCustomerSession } from "../lib/customerSession";
import { affiliateTierProgress, type AffiliateTierRule } from "../lib/affiliateProgram";

const router = Router();

const money = (value: unknown) => Math.round(Number(value ?? 0) * 100) / 100;
const iso = (value: Date | null) => value?.toISOString() ?? null;

async function ensureAffiliateDefaults(): Promise<void> {
  await db.insert(affiliateProgramSettingsTable).values({ id: 1 }).onConflictDoNothing();
  await db.insert(affiliateTiersTable).values([
    { name: "Starter", slug: "starter", minimumSalesGbp: "0", commissionRatePercent: "5", rewardCreditGbp: "0", sortOrder: 0 },
    { name: "Growth", slug: "growth", minimumSalesGbp: "1000", commissionRatePercent: "8", rewardCreditGbp: "50", sortOrder: 1 },
    { name: "Elite", slug: "elite", minimumSalesGbp: "2500", commissionRatePercent: "10", rewardCreditGbp: "75", sortOrder: 2 },
  ]).onConflictDoNothing();
}

async function uniquePartnerCodes(name: string): Promise<{ trackingCode: string; discountCode: string }> {
  const prefix = name.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase() || "PARTNER";
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
    const trackingCode = `${prefix}-${suffix}`;
    const discountCode = `${prefix}${suffix.slice(0, 4)}`;
    const [existing] = await db.select({ id: affiliatePartnersTable.id }).from(affiliatePartnersTable)
      .where(or(
        eq(affiliatePartnersTable.trackingCode, trackingCode),
        eq(affiliatePartnersTable.discountCode, discountCode),
      )).limit(1);
    if (!existing) return { trackingCode, discountCode };
  }
  throw new Error("Could not generate unique affiliate codes");
}

function programResponse(
  settings: typeof affiliateProgramSettingsTable.$inferSelect,
  tiers: Array<typeof affiliateTiersTable.$inferSelect>,
) {
  return {
    attributionWindowDays: settings.attributionWindowDays,
    reviewHoldDays: settings.reviewHoldDays,
    customerDiscountPercent: money(settings.customerDiscountPercent),
    freeRewardThresholdGbp: money(settings.freeRewardThresholdGbp),
    freeRewardValueCapGbp: money(settings.freeRewardValueCapGbp),
    payoutThresholdGbp: money(settings.payoutThresholdGbp),
    tierWindowDays: settings.tierWindowDays,
    tiers: tiers.map(tier => ({
      id: tier.id,
      name: tier.name,
      slug: tier.slug,
      minimumSalesGbp: money(tier.minimumSalesGbp),
      commissionRatePercent: money(tier.commissionRatePercent),
      rewardCreditGbp: money(tier.rewardCreditGbp),
    })),
  };
}

router.get("/affiliates/program", async (req: Request, res: Response): Promise<void> => {
  try {
    await ensureAffiliateDefaults();
    const [settingsRows, tiers] = await Promise.all([
      db.select().from(affiliateProgramSettingsTable).where(eq(affiliateProgramSettingsTable.id, 1)).limit(1),
      db.select().from(affiliateTiersTable).where(eq(affiliateTiersTable.isActive, true))
        .orderBy(asc(affiliateTiersTable.minimumSalesGbp), asc(affiliateTiersTable.id)),
    ]);
    if (!settingsRows[0]) throw new Error("Affiliate settings missing");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.json({ program: programResponse(settingsRows[0], tiers) });
  } catch (err) {
    req.log.error({ err }, "Failed to load public affiliate program");
    res.status(500).json({ error: "Unable to load the affiliate program" });
  }
});

router.post("/affiliates/attribution", async (req: Request, res: Response): Promise<void> => {
  const trackingCode = typeof req.body?.trackingCode === "string"
    ? req.body.trackingCode.trim().toUpperCase()
    : "";
  if (!trackingCode || trackingCode.length > 64) {
    res.status(400).json({ error: "A valid affiliate tracking code is required" });
    return;
  }
  try {
    await ensureAffiliateDefaults();
    const [[partner], [settings]] = await Promise.all([
      db.select().from(affiliatePartnersTable).where(and(
        eq(affiliatePartnersTable.trackingCode, trackingCode),
        eq(affiliatePartnersTable.status, "approved"),
      )).limit(1),
      db.select().from(affiliateProgramSettingsTable).where(eq(affiliateProgramSettingsTable.id, 1)).limit(1),
    ]);
    if (!partner || !settings) {
      res.status(404).json({ error: "Affiliate link is not active" });
      return;
    }
    const clickedAt = new Date();
    res.cookie(
      AFFILIATE_ATTRIBUTION_COOKIE,
      createAffiliateAttributionToken(partner.id, partner.trackingCode, clickedAt),
      {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: settings.attributionWindowDays * 24 * 60 * 60 * 1000,
        path: "/",
      },
    );
    res.json({
      attributed: true,
      discountCode: partner.discountCode,
      discountPercent: money(partner.discountPercent),
      expiresAt: new Date(clickedAt.getTime() + settings.attributionWindowDays * 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to capture affiliate attribution");
    res.status(500).json({ error: "Unable to save affiliate attribution" });
  }
});

router.post("/affiliates/apply", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomerSession(req, res);
  if (!customerId) return;
  const channelUrl = typeof req.body?.channelUrl === "string" ? req.body.channelUrl.trim() : "";
  const audienceDescription = typeof req.body?.audienceDescription === "string" ? req.body.audienceDescription.trim() : "";
  const promotionPlan = typeof req.body?.promotionPlan === "string" ? req.body.promotionPlan.trim() : "";
  if (channelUrl.length > 300 || audienceDescription.length < 20 || audienceDescription.length > 1000 || promotionPlan.length < 20 || promotionPlan.length > 1500) {
    res.status(400).json({ error: "Please describe your audience and promotion plan in at least 20 characters" });
    return;
  }
  try {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, customerId)).limit(1);
    if (!customer) {
      res.status(401).json({ error: "Customer account not found" });
      return;
    }
    const [existing] = await db.select().from(affiliatePartnersTable).where(or(
      eq(affiliatePartnersTable.customerId, customerId),
      eq(affiliatePartnersTable.email, customer.email.toLowerCase()),
    )).limit(1);
    if (existing) {
      if (existing.customerId !== null && existing.customerId !== customerId) {
        res.status(409).json({ error: "An affiliate application already exists for this email" });
        return;
      }
      const [partner] = await db.update(affiliatePartnersTable).set({
        customerId,
        channelUrl: channelUrl || null,
        audienceDescription,
        promotionPlan,
        updatedAt: new Date(),
      }).where(eq(affiliatePartnersTable.id, existing.id)).returning();
      res.json({ partner: { id: partner.id, status: partner.status } });
      return;
    }
    await ensureAffiliateDefaults();
    const [settings] = await db.select().from(affiliateProgramSettingsTable)
      .where(eq(affiliateProgramSettingsTable.id, 1)).limit(1);
    if (!settings) throw new Error("Affiliate settings missing");
    const name = `${customer.firstName} ${customer.lastName}`.trim();
    const codes = await uniquePartnerCodes(name);
    const [partner] = await db.transaction(async tx => {
      const [created] = await tx.insert(affiliatePartnersTable).values({
        customerId,
        name,
        email: customer.email.toLowerCase(),
        trackingCode: codes.trackingCode,
        discountCode: codes.discountCode,
        discountPercent: settings.customerDiscountPercent,
        status: "pending",
        channelUrl: channelUrl || null,
        audienceDescription,
        promotionPlan,
      }).returning();
      await tx.insert(discountCodesTable).values({
        code: codes.discountCode,
        affiliatePartnerId: created.id,
        type: "percentage",
        value: settings.customerDiscountPercent,
        isActive: false,
      });
      return [created];
    });
    res.status(201).json({ partner: { id: partner.id, status: partner.status } });
  } catch (err) {
    req.log.error({ err }, "Failed to submit affiliate application");
    res.status(500).json({ error: "Unable to submit your affiliate application" });
  }
});

router.get("/affiliates/me", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomerSession(req, res);
  if (!customerId) return;
  try {
    await ensureAffiliateDefaults();
    const [[settings], tiers, [partner]] = await Promise.all([
      db.select().from(affiliateProgramSettingsTable).where(eq(affiliateProgramSettingsTable.id, 1)).limit(1),
      db.select().from(affiliateTiersTable).where(eq(affiliateTiersTable.isActive, true))
        .orderBy(asc(affiliateTiersTable.minimumSalesGbp), asc(affiliateTiersTable.id)),
      db.select().from(affiliatePartnersTable).where(eq(affiliatePartnersTable.customerId, customerId)).limit(1),
    ]);
    if (!settings) throw new Error("Affiliate settings missing");
    if (!partner) {
      res.json({ partner: null, program: programResponse(settings, tiers) });
      return;
    }
    if (partner.status !== "approved") {
      res.setHeader("Cache-Control", "no-store");
      res.json({
        partner: {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          status: partner.status,
          approvedAt: iso(partner.approvedAt),
          createdAt: partner.createdAt.toISOString(),
        },
        program: programResponse(settings, tiers),
      });
      return;
    }
    const [commissions, rewards, eligibleProducts] = await Promise.all([
      db.select({
        id: affiliateCommissionsTable.id,
        orderId: affiliateCommissionsTable.orderId,
        eligibleSalesGbp: affiliateCommissionsTable.eligibleSalesGbp,
        commissionRatePercent: affiliateCommissionsTable.commissionRatePercent,
        amountGbp: affiliateCommissionsTable.amountGbp,
        status: affiliateCommissionsTable.status,
        statusReason: affiliateCommissionsTable.statusReason,
        createdAt: affiliateCommissionsTable.createdAt,
        paidAt: affiliateCommissionsTable.paidAt,
      }).from(affiliateCommissionsTable).where(eq(affiliateCommissionsTable.partnerId, partner.id))
        .orderBy(desc(affiliateCommissionsTable.createdAt)).limit(100),
      db.select().from(affiliateRewardCreditsTable).where(eq(affiliateRewardCreditsTable.partnerId, partner.id))
        .orderBy(desc(affiliateRewardCreditsTable.createdAt)).limit(100),
      db.select({
        slug: productsCatalogTable.slug,
        name: productsCatalogTable.name,
        priceGbp: productsCatalogTable.priceGbp,
      }).from(productsCatalogTable).where(and(
        eq(productsCatalogTable.isPublished, true),
        ne(productsCatalogTable.category, "Accessories"),
        sql`${productsCatalogTable.priceGbp} IS NOT NULL`,
        sql`${productsCatalogTable.priceGbp} <= ${settings.freeRewardValueCapGbp}`,
      )).orderBy(asc(productsCatalogTable.name)),
    ]);
    const totals = commissions.reduce((acc, row) => {
      const amount = money(row.amountGbp);
      if (row.status === "paid") acc.paid += amount;
      else if (row.status === "approved") acc.approved += amount;
      else if (row.status === "pending" || row.status === "held") acc.pending += amount;
      return acc;
    }, { pending: 0, approved: 0, paid: 0 });
    const tierCutoff = new Date(Date.now() - settings.tierWindowDays * 24 * 60 * 60 * 1000);
    const rollingSalesGbp = commissions
      .filter(row => ["approved", "paid"].includes(row.status) && row.createdAt >= tierCutoff)
      .reduce((total, row) => total + money(row.eligibleSalesGbp), 0);
    const tierRules: AffiliateTierRule[] = tiers.map(tier => ({
      id: tier.id,
      name: tier.name,
      slug: tier.slug,
      minimumSalesGbp: money(tier.minimumSalesGbp),
      commissionRatePercent: money(tier.commissionRatePercent),
      rewardCreditGbp: money(tier.rewardCreditGbp),
      isActive: tier.isActive,
    }));
    res.setHeader("Cache-Control", "no-store");
    res.json({
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        status: partner.status,
        trackingCode: partner.trackingCode,
        discountCode: partner.discountCode,
        discountPercent: money(partner.discountPercent),
        channelUrl: partner.channelUrl,
        audienceDescription: partner.audienceDescription,
        promotionPlan: partner.promotionPlan,
        approvedAt: iso(partner.approvedAt),
        createdAt: partner.createdAt.toISOString(),
        trackingPath: `/?aff=${encodeURIComponent(partner.trackingCode)}`,
      },
      totals: {
        pendingGbp: money(totals.pending),
        approvedGbp: money(totals.approved),
        paidGbp: money(totals.paid),
        availableRewards: rewards.filter(reward => reward.status === "available").length,
      },
      tierProgress: affiliateTierProgress(tierRules, rollingSalesGbp),
      commissions: commissions.map(row => ({
        id: row.id,
        orderId: row.orderId,
        eligibleSalesGbp: money(row.eligibleSalesGbp),
        commissionRatePercent: money(row.commissionRatePercent),
        amountGbp: money(row.amountGbp),
        status: row.status,
        statusReason: row.statusReason,
        createdAt: row.createdAt.toISOString(),
        paidAt: iso(row.paidAt),
      })),
      rewards: rewards.map(row => ({
        id: row.id,
        qualifyingSalesGbp: money(row.qualifyingSalesGbp),
        creditValueGbp: money(row.creditValueGbp),
        status: row.status,
        productSlug: row.productSlug,
        claimedProductName: row.claimedProductName,
        statusReason: row.statusReason,
        availableAt: iso(row.availableAt),
        claimedAt: iso(row.claimedAt),
        fulfilledAt: iso(row.fulfilledAt),
        createdAt: row.createdAt.toISOString(),
      })),
      eligibleProducts: eligibleProducts.map(product => ({
        slug: product.slug,
        name: product.name,
        priceGbp: money(product.priceGbp),
      })),
      program: programResponse(settings, tiers),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to load affiliate dashboard");
    res.status(500).json({ error: "Unable to load your affiliate dashboard" });
  }
});

router.post("/affiliates/rewards/:id/claim", async (req: Request, res: Response): Promise<void> => {
  const customerId = requireCustomerSession(req, res);
  if (!customerId) return;
  const rewardId = Number.parseInt(Array.isArray(req.params.id) ? req.params.id[0] ?? "" : req.params.id, 10);
  const productSlug = typeof req.body?.productSlug === "string" ? req.body.productSlug.trim() : "";
  if (!Number.isInteger(rewardId) || rewardId < 1 || !productSlug) {
    res.status(400).json({ error: "Choose a valid reward and product" });
    return;
  }
  try {
    const [[partner], [settings], [product]] = await Promise.all([
      db.select({ id: affiliatePartnersTable.id, status: affiliatePartnersTable.status }).from(affiliatePartnersTable)
        .where(eq(affiliatePartnersTable.customerId, customerId)).limit(1),
      db.select().from(affiliateProgramSettingsTable).where(eq(affiliateProgramSettingsTable.id, 1)).limit(1),
      db.select().from(productsCatalogTable).where(and(
        eq(productsCatalogTable.slug, productSlug),
        eq(productsCatalogTable.isPublished, true),
        ne(productsCatalogTable.category, "Accessories"),
      )).limit(1),
    ]);
    if (!partner || partner.status !== "approved" || !settings || !product || product.priceGbp === null || money(product.priceGbp) > money(settings.freeRewardValueCapGbp)) {
      if (partner && partner.status !== "approved") {
        res.status(403).json({ error: "Affiliate rewards are available only after admin approval" });
        return;
      }
      res.status(400).json({ error: "This product is not eligible for an affiliate reward" });
      return;
    }
    const [claimed] = await db.update(affiliateRewardCreditsTable).set({
      status: "claimed",
      productSlug: product.slug,
      claimedProductName: product.name,
      claimedAt: new Date(),
      updatedAt: new Date(),
    }).where(and(
      eq(affiliateRewardCreditsTable.id, rewardId),
      eq(affiliateRewardCreditsTable.partnerId, partner.id),
      eq(affiliateRewardCreditsTable.status, "available"),
    )).returning({ id: affiliateRewardCreditsTable.id });
    if (!claimed) {
      res.status(409).json({ error: "This reward is no longer available" });
      return;
    }
    res.json({ claimed: true, rewardId: claimed.id, productName: product.name });
  } catch (err) {
    req.log.error({ err }, "Failed to claim affiliate reward");
    res.status(500).json({ error: "Unable to claim this reward" });
  }
});

export default router;