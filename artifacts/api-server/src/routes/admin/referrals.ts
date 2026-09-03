import { Router } from "express";
import type { Request, Response } from "express";
import {
  db,
  adminAuditEventsTable,
  adminUsersTable,
  customersTable,
  ordersTable,
  referralRedemptionAllocationsTable,
  referralRewardsTable,
} from "@workspace/db";
import { and, asc, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";
import { firstString } from "../../lib/query";
import { getSecureAdminSession, hasSecureAdminSession } from "./auth";
import { requireOwner } from "./users";
import { getClientIp } from "../../lib/geoip";
import { releaseStatus } from "../../lib/referralLedger";

const router = Router();
const STATUSES = new Set(["all", "pending", "earned", "redeemed", "held", "voided", "legacy", "untracked"]);
const CAP = 50;
const money = (v: unknown) => Number.parseFloat(String(v ?? 0)) || 0;
const customer = (c: typeof customersTable.$inferSelect | undefined) => c ? {
  id: c.id, name: `${c.firstName} ${c.lastName}`.trim(), email: c.email,
  referralCode: c.referralCode, referralCreditGbp: money(c.referralCreditGbp),
} : null;

function requireAdmin(req: Request, res: Response) {
  if (!hasSecureAdminSession(req)) { res.status(401).json({ error: "Not authenticated" }); return false; }
  return true;
}

router.get("/admin/referrals", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const status = typeof req.query.status === "string" && STATUSES.has(req.query.status) ? req.query.status : "all";
  const search = typeof req.query.search === "string" ? req.query.search.trim().toLowerCase() : "";
  try {
    const [rewards, redemptions, customers, relationships] = await Promise.all([
      db.select().from(referralRewardsTable).orderBy(desc(referralRewardsTable.createdAt)),
      db.select().from(referralRedemptionAllocationsTable).orderBy(asc(referralRedemptionAllocationsTable.createdAt)),
      db.select().from(customersTable),
      db.select().from(customersTable).where(isNotNull(customersTable.referredBy)).orderBy(desc(customersTable.createdAt)),
    ]);
    const customerById = new Map(customers.map(c => [c.id, c]));
    const codeMap = new Map(customers.filter(c => c.referralCode).map(c => [c.referralCode!, c]));
    const rows = rewards.map(r => {
      const beneficiary = customer(customerById.get(r.beneficiaryCustomerId ?? -1));
      const referred = customer(customerById.get(r.referredCustomerId ?? -1));
      const referrer = customer(customerById.get(r.referrerCustomerId ?? -1));
      const qualifyingOrder = r.qualifyingOrderId ? undefined : null;
      return {
        id: r.id, status: r.status, beneficiaryRole: r.beneficiaryRole,
        amountGbp: money(r.amountGbp), remainingAmountGbp: money(r.remainingAmountGbp),
        historical: r.historical, statusReason: r.statusReason, lastAdminActor: r.lastAdminActor,
        createdAt: r.createdAt.toISOString(), updatedAt: r.updatedAt.toISOString(),
        beneficiary, referredCustomer: referred, referrer, qualifyingOrderId: r.qualifyingOrderId,
        referrerCustomerId: r.referrerCustomerId,
        earnedAt: r.earnedAt?.toISOString() ?? null, heldAt: r.heldAt?.toISOString() ?? null,
        voidedAt: r.voidedAt?.toISOString() ?? null, redeemedAt: r.redeemedAt?.toISOString() ?? null,
        qualifyingOrder,
      };
    });
    const orderIds = [...new Set([
      ...rows.map(r => r.qualifyingOrderId),
      ...redemptions.map(r => r.orderId),
    ].filter((id): id is number => id !== null))];
    const orderMap = new Map(orderIds.length ? (await db.select({ id: ordersTable.id, orderNumber: ordersTable.orderNumber, status: ordersTable.status, createdAt: ordersTable.createdAt }).from(ordersTable).where(inArray(ordersTable.id, orderIds))).map(o => [o.id, o]) : []);
    const redemptionsByReward = new Map<number, typeof redemptions>();
    for (const redemption of redemptions) {
      const existing = redemptionsByReward.get(redemption.rewardId) ?? [];
      existing.push(redemption);
      redemptionsByReward.set(redemption.rewardId, existing);
    }
    const ledgerRows = rows.map(r => ({
      ...r,
      qualifyingOrder: r.qualifyingOrderId ? orderMap.get(r.qualifyingOrderId) ?? null : null,
      redemptions: (redemptionsByReward.get(r.id) ?? []).map((redemption) => ({
        id: redemption.id,
        amountGbp: money(redemption.amountGbp),
        createdAt: redemption.createdAt.toISOString(),
        order: orderMap.get(redemption.orderId) ?? null,
      })),
    }));
    // Relationships without a ledger event remain visible, but are explicitly not rewards.
    const untracked = relationships.filter(c => !ledgerRows.some(r => r.referredCustomer?.id === c.id)).map(c => ({
      id: `untracked-${c.id}`, status: "untracked", beneficiaryRole: null, amountGbp: 0, remainingAmountGbp: 0,
      historical: false, statusReason: c.referralAbuseFlag ? "Customer is flagged for referral review" : "No ledger event has been created",
      lastAdminActor: null, createdAt: c.createdAt.toISOString(), updatedAt: c.updatedAt.toISOString(),
      beneficiary: null, referredCustomer: customer(c), qualifyingOrderId: null, qualifyingOrder: null,
      referrer: customer(codeMap.get(c.referredBy ?? "")),
    }));
    const all = [...ledgerRows, ...untracked].filter(r => (status === "all" || r.status === status) &&
      (!search || [r.beneficiary?.name, r.beneficiary?.email, r.referredCustomer?.name, r.referredCustomer?.email, r.statusReason].some(v => v?.toLowerCase().includes(search))));
    const byStatus = (s: string) => ledgerRows.filter(r => r.status === s).length;
    res.json({ stats: {
      total: ledgerRows.length, pending: byStatus("pending"), earned: byStatus("earned"), held: byStatus("held"),
      redeemed: byStatus("redeemed"), voided: byStatus("voided"), legacy: byStatus("legacy"), untracked: untracked.length,
      outstandingCreditGbp: customers.reduce((sum, c) => sum + money(c.referralCreditGbp), 0),
    }, referrals: all });
  } catch (err) { req.log.error({ err }, "Failed to list referral ledger"); res.status(500).json({ error: "Failed to list referrals" }); }
});

class RewardError extends Error { constructor(public code: number, message: string) { super(message); } }
router.post("/admin/referrals/:id/:action", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireOwner(req, res))) return;
  const id = Number.parseInt(firstString(req.params.id) ?? "", 10);
  const action = firstString(req.params.action);
  const reason = typeof req.body?.reason === "string" ? req.body.reason.trim() : "";
  if (!Number.isInteger(id) || !["hold", "release", "void"].includes(action ?? "") || !reason) {
    res.status(400).json({ error: "A valid reward action and non-empty reason are required" }); return;
  }
  const session = getSecureAdminSession(req);
  const actor = session?.email ?? "shared-admin";
  const [actorUser] = session?.email ? await db.select({ id: adminUsersTable.id }).from(adminUsersTable).where(eq(adminUsersTable.email, session.email)).limit(1) : [];
  try {
    const [lookup] = await db.select({ beneficiaryCustomerId: referralRewardsTable.beneficiaryCustomerId }).from(referralRewardsTable).where(eq(referralRewardsTable.id, id)).limit(1);
    if (!lookup) { res.status(404).json({ error: "Reward not found" }); return; }
    if (!lookup.beneficiaryCustomerId) { res.status(409).json({ error: "Reward has no beneficiary" }); return; }
    const reward = await db.transaction(async tx => {
      // Global order: customer rows first, then reward rows.
      await tx.execute(sql`SELECT id FROM customers WHERE id = ${lookup.beneficiaryCustomerId} FOR UPDATE`);
      await tx.execute(sql`SELECT id FROM referral_rewards WHERE id = ${id} FOR UPDATE`);
      const [current] = await tx.select().from(referralRewardsTable).where(eq(referralRewardsTable.id, id)).limit(1);
      if (!current) throw new RewardError(404, "Reward not found");
      if (current.historical) throw new RewardError(409, "Historical balance records cannot be administratively changed");
      if (!current.beneficiaryCustomerId) throw new RewardError(409, "Reward has no beneficiary");
      const [owner] = await tx.select().from(customersTable).where(eq(customersTable.id, current.beneficiaryCustomerId)).limit(1);
      if (!owner) throw new RewardError(409, "Reward beneficiary no longer exists");
      const remaining = money(current.remainingAmountGbp);
      let next: "pending" | "earned" | "held" | "voided";
      let delta = 0;
      if (action === "hold") {
        if (!["pending", "earned"].includes(current.status)) throw new RewardError(409, "Only pending or earned rewards can be held");
        next = "held"; delta = current.status === "earned" ? -remaining : 0;
      } else if (action === "void") {
        if (["voided", "redeemed"].includes(current.status)) throw new RewardError(409, "This reward can no longer be voided");
        next = "voided"; delta = current.status === "earned" ? -remaining : 0;
      } else {
        if (current.status !== "held") throw new RewardError(409, "Only held rewards can be released");
        const [order] = current.qualifyingOrderId ? await tx.select({ status: ordersTable.status }).from(ordersTable).where(eq(ordersTable.id, current.qualifyingOrderId)).limit(1) : [];
        const decision = releaseStatus(
          order?.status === "shipped" || order?.status === "delivered",
          money(owner.referralCreditGbp),
          remaining,
        );
        next = decision.status;
        delta = decision.balanceDelta;
        if (decision.exceedsCap) throw new RewardError(409, `Release would exceed the £${CAP} referral credit cap`);
      }
      const now = new Date();
      const [updated] = await tx.update(referralRewardsTable).set({
        status: next, statusReason: reason, lastAdminActor: actor, updatedAt: now,
        heldAt: action === "hold" ? now : action === "release" ? null : current.heldAt,
        voidedAt: action === "void" ? now : current.voidedAt,
        earnedAt: action === "release" && next === "earned" ? now : current.earnedAt,
      }).where(eq(referralRewardsTable.id, id)).returning();
      if (delta) await tx.update(customersTable).set({ referralCreditGbp: sql`${customersTable.referralCreditGbp} + ${delta}` }).where(eq(customersTable.id, owner.id));
      await tx.insert(adminAuditEventsTable).values({ eventType: `referral_reward_${action}`, adminUserId: actorUser?.id ?? null, email: session?.email ?? null, ip: getClientIp(req), userAgent: req.get("user-agent")?.slice(0, 500) ?? null, requestId: String(req.id), success: true, metadata: { rewardId: id, previousStatus: current.status, status: next, reason, balanceDeltaGbp: delta } });
      return updated;
    });
    res.json({ reward: { ...reward, amountGbp: money(reward.amountGbp), remainingAmountGbp: money(reward.remainingAmountGbp) } });
  } catch (err) {
    if (err instanceof RewardError) { res.status(err.code).json({ error: err.message }); return; }
    req.log.error({ err, id, action }, "Failed to update referral reward"); res.status(500).json({ error: "Failed to update referral reward" });
  }
});
export default router;