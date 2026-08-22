import { Router } from "express";
import type { Request, Response } from "express";
import {
  cryptoPaymentAttemptsTable,
  cryptoPaymentAuditsTable,
  db,
  ordersTable,
} from "@workspace/db";
import { desc, eq, inArray } from "drizzle-orm";
import { recordCryptoPaymentVerification } from "../crypto-payments";
import { hasSecureAdminSession } from "./auth";

const router = Router();

function requireAdmin(req: Request, res: Response): boolean {
  if (!hasSecureAdminSession(req)) {
    res.status(401).json({ error: "Not authenticated" });
    return false;
  }
  return true;
}

function auditToResponse(audit: typeof cryptoPaymentAuditsTable.$inferSelect) {
  return {
    id: audit.id,
    orderId: audit.orderId,
    attemptId: audit.attemptId,
    txHash: audit.txHash,
    currency: audit.currency,
    network: audit.network,
    expectedWallet: audit.expectedWallet,
    expectedAmount: String(audit.expectedAmount),
    observedAmount: audit.observedAmount ? String(audit.observedAmount) : null,
    confirmations: audit.confirmations,
    result: audit.result,
    reason: audit.reason,
    evidence: audit.evidence,
    checkedAt: audit.checkedAt.toISOString(),
  };
}

router.get("/admin/crypto/audits", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 200);
    const audits = await db
      .select()
      .from(cryptoPaymentAuditsTable)
      .orderBy(desc(cryptoPaymentAuditsTable.checkedAt))
      .limit(limit);
    const orderIds = [...new Set(audits.map((audit) => audit.orderId))];
    const orders = orderIds.length
      ? await db.select({ id: ordersTable.id, orderNumber: ordersTable.orderNumber, customerEmail: ordersTable.customerEmail }).from(ordersTable).where(inArray(ordersTable.id, orderIds))
      : [];
    const orderById = new Map(orders.map((order) => [order.id, order]));
    res.json({
      audits: audits.map((audit) => ({
        ...auditToResponse(audit),
        orderNumber: orderById.get(audit.orderId)?.orderNumber ?? null,
        customerEmail: orderById.get(audit.orderId)?.customerEmail ?? null,
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list crypto payment audits");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/crypto/audits/:id", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    res.status(400).json({ error: "Invalid audit ID" });
    return;
  }
  const [audit] = await db.select().from(cryptoPaymentAuditsTable).where(eq(cryptoPaymentAuditsTable.id, id)).limit(1);
  if (!audit) {
    res.status(404).json({ error: "Audit not found" });
    return;
  }
  res.json(auditToResponse(audit));
});

router.post("/admin/crypto/audits/:attemptId/check", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const attemptId = Number(req.params.attemptId);
  if (!Number.isInteger(attemptId)) {
    res.status(400).json({ error: "Invalid payment attempt" });
    return;
  }
  try {
    const [attempt] = await db.select().from(cryptoPaymentAttemptsTable).where(eq(cryptoPaymentAttemptsTable.id, attemptId)).limit(1);
    if (!attempt) {
      res.status(404).json({ error: "Payment attempt not found" });
      return;
    }
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, attempt.orderId)).limit(1);
    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    const result = await recordCryptoPaymentVerification(order, attempt.id, attempt.txHash, false);
    res.json({ status: result.status, reason: result.reason, observedAmount: result.observedAmount ?? null, confirmations: result.confirmations ?? null });
  } catch (err) {
    req.log.error({ err }, "Failed to audit crypto payment");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/crypto/audits/check-batch", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const attemptIds = Array.isArray(req.body?.attemptIds)
    ? req.body.attemptIds.filter((id: unknown): id is number => Number.isInteger(id)).slice(0, 50)
    : [];
  if (attemptIds.length === 0) {
    res.status(400).json({ error: "Select one or more payment attempts to check." });
    return;
  }
  try {
    const attempts = await db
      .select()
      .from(cryptoPaymentAttemptsTable)
      .where(inArray(cryptoPaymentAttemptsTable.id, attemptIds));
    const results: Array<{ attemptId: number; status: string; reason: string }> = [];
    for (const attempt of attempts) {
      const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, attempt.orderId)).limit(1);
      if (!order) continue;
      const result = await recordCryptoPaymentVerification(order, attempt.id, attempt.txHash, false);
      results.push({ attemptId: attempt.id, status: result.status, reason: result.reason });
    }
    res.json({ checked: results.length, results });
  } catch (err) {
    req.log.error({ err }, "Failed to batch audit crypto payments");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/admin/crypto/wallet-history", async (req: Request, res: Response): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  try {
    const attempts = await db
      .select({
        walletAddress: cryptoPaymentAttemptsTable.walletAddress,
        currency: cryptoPaymentAttemptsTable.currency,
        network: cryptoPaymentAttemptsTable.network,
        firstUsedAt: cryptoPaymentAttemptsTable.submittedAt,
      })
      .from(cryptoPaymentAttemptsTable)
      .orderBy(desc(cryptoPaymentAttemptsTable.submittedAt))
      .limit(500);
    const seen = new Set<string>();
    const wallets = attempts.filter((attempt) => {
      const key = `${attempt.network}:${attempt.currency}:${attempt.walletAddress}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    res.json({ wallets: wallets.map((wallet) => ({ ...wallet, firstUsedAt: wallet.firstUsedAt.toISOString() })) });
  } catch (err) {
    req.log.error({ err }, "Failed to list crypto wallet history");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;