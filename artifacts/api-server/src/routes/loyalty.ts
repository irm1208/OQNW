import { Router } from "express";
import type { Request, Response } from "express";
import crypto from "crypto";
import { requiredSecret } from "../lib/securityConfig";
import { db } from "@workspace/db";
import { loyaltyTransactionsTable } from "@workspace/db";
import { eq, sql, desc } from "drizzle-orm";
import { logger } from "../lib/logger";

const router = Router();

const SESSION_SECRET = requiredSecret("SESSION_SECRET", "omniqure-cust-session-development-only");

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

function getCustomerId(req: Request): number | null {
  const token = req.cookies?.customer_session;
  return token ? verifyCustomerSession(token) : null;
}

function isAdmin(req: Request, res: Response): boolean {
  if (req.cookies?.admin_session !== "authenticated") {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

const TIERS = [
  { name: "Bronze", min: 0,    max: 499,      color: "#CD7F32", emoji: "🥉" },
  { name: "Silver", min: 500,  max: 1999,     color: "#9CA3AF", emoji: "🥈" },
  { name: "Gold",   min: 2000, max: Infinity, color: "#F59E0B", emoji: "🥇" },
];

function getTierInfo(lifetimeEarned: number) {
  const idx = TIERS.findIndex(t => lifetimeEarned >= t.min && lifetimeEarned <= t.max);
  const tier = TIERS[idx] ?? TIERS[0];
  const nextTier = TIERS[idx + 1] ?? null;
  return {
    tier,
    nextTier,
    pointsToNextTier: nextTier ? nextTier.min - lifetimeEarned : 0,
    progressPct: nextTier
      ? Math.min(100, Math.round(((lifetimeEarned - tier.min) / (nextTier.min - tier.min)) * 100))
      : 100,
  };
}

// GET /loyalty/balance — authenticated customer
router.get("/loyalty/balance", async (req: Request, res: Response): Promise<void> => {
  const customerId = getCustomerId(req);
  if (!customerId) { res.status(401).json({ error: "Not authenticated" }); return; }

  const transactions = await db
    .select()
    .from(loyaltyTransactionsTable)
    .where(eq(loyaltyTransactionsTable.customerId, customerId))
    .orderBy(desc(loyaltyTransactionsTable.createdAt))
    .limit(50);

  const balance = transactions.reduce((s, t) => s + t.points, 0);
  const lifetimeEarned = transactions
    .filter(t => t.type === "earned" && t.points > 0)
    .reduce((s, t) => s + t.points, 0);

  const { tier, nextTier, pointsToNextTier, progressPct } = getTierInfo(lifetimeEarned);

  res.json({
    balance,
    lifetimeEarned,
    tier: tier.name,
    tierColor: tier.color,
    tierEmoji: tier.emoji,
    nextTier: nextTier?.name ?? null,
    pointsToNextTier: nextTier ? pointsToNextTier : null,
    progressPct,
    gbpValue: +(balance / 100).toFixed(2),
    transactions: transactions.map(t => ({
      id: t.id,
      type: t.type,
      points: t.points,
      description: t.description,
      createdAt: t.createdAt,
    })),
  });
});

// GET /admin/loyalty/overview
router.get("/admin/loyalty/overview", async (req: Request, res: Response): Promise<void> => {
  if (!isAdmin(req, res)) return;

  const result = await db.execute(sql`
    SELECT
      c.id,
      c.email,
      c.first_name AS "firstName",
      c.last_name  AS "lastName",
      COALESCE(SUM(lt.points), 0)::int AS balance,
      COALESCE(SUM(CASE WHEN lt.type = 'earned' AND lt.points > 0 THEN lt.points ELSE 0 END), 0)::int AS "lifetimeEarned",
      COUNT(lt.id)::int AS "transactionCount"
    FROM customers c
    LEFT JOIN loyalty_transactions lt ON lt.customer_id = c.id
    GROUP BY c.id, c.email, c.first_name, c.last_name
    HAVING COUNT(lt.id) > 0
    ORDER BY balance DESC
    LIMIT 200
  `);

  const stats = await db.execute(sql`
    SELECT
      COALESCE(SUM(CASE WHEN points > 0 THEN points ELSE 0 END), 0)::int AS "totalEarned",
      COALESCE(SUM(CASE WHEN points < 0 THEN ABS(points) ELSE 0 END), 0)::int AS "totalRedeemed",
      COALESCE(SUM(points), 0)::int AS "totalOutstanding",
      COUNT(DISTINCT customer_id)::int AS "membersWithPoints"
    FROM loyalty_transactions
  `);

  res.json({ customers: result.rows, stats: stats.rows[0] ?? {} });
});

// POST /admin/loyalty/adjust
router.post("/admin/loyalty/adjust", async (req: Request, res: Response): Promise<void> => {
  if (!isAdmin(req, res)) return;
  const { customerId, points, reason } = req.body as { customerId?: unknown; points?: unknown; reason?: unknown };
  if (!customerId || typeof points !== "number" || !reason || typeof reason !== "string") {
    res.status(400).json({ error: "customerId, points (number), and reason are required" });
    return;
  }
  await db.insert(loyaltyTransactionsTable).values({
    customerId: Number(customerId),
    type: "adjusted",
    points: Math.round(points as number),
    description: `Admin adjustment: ${reason}`,
  });
  logger.info({ customerId, points, reason }, "Admin loyalty adjustment");
  res.json({ success: true });
});

export default router;
