import { Router } from "express";
import type { Request, Response } from "express";
import {
  cryptoPaymentAttemptsTable,
  cryptoPaymentAuditsTable,
  db,
  orderItemsTable,
  ordersTable,
} from "@workspace/db";
import { and, eq, or } from "drizzle-orm";
import {
  cryptoRouteFromSnapshot,
  getPublicCryptoPaymentOptions,
  isRateLockExpired,
  normalizeTransactionHash,
  prepareCryptoPayment,
  type CryptoPaymentStatus,
  verifyCryptoPayment,
} from "../lib/crypto-payments";
import { sendOrderConfirmation } from "../lib/email";
import { logger } from "../lib/logger";

const router = Router();

function hasPaymentAccess(order: typeof ordersTable.$inferSelect, token: unknown): boolean {
  return typeof token === "string" &&
    Boolean(order.cryptoPaymentAccessToken) &&
    token.length >= 24 &&
    token === order.cryptoPaymentAccessToken;
}

async function getOrder(ref: string) {
  const id = Number(ref);
  const where = Number.isInteger(id) && id > 0
    ? eq(ordersTable.id, id)
    : eq(ordersTable.orderNumber, ref.trim().toUpperCase());
  return db.select().from(ordersTable).where(where).limit(1).then((rows) => rows[0] ?? null);
}

function requestParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function paymentDetails(order: typeof ordersTable.$inferSelect) {
  if (
    !order.cryptoCurrency ||
    !order.cryptoNetwork ||
    !order.cryptoWalletAddress ||
    !order.cryptoExpectedAmount ||
    !order.cryptoRateUsd ||
    !order.cryptoRateExpiresAt
  ) {
    return null;
  }
  return {
    currency: order.cryptoCurrency,
    network: order.cryptoNetwork,
    walletAddress: order.cryptoWalletAddress,
    expectedAmount: String(order.cryptoExpectedAmount),
    rateUsd: Number(order.cryptoRateUsd),
    rateExpiresAt: order.cryptoRateExpiresAt.toISOString(),
    confirmationsRequired: order.cryptoNetwork === "bitcoin" ? 1 : 3,
    status: order.cryptoPaymentStatus,
    txHash: order.cryptoTxHash,
    observedAmount: order.cryptoObservedAmount ? String(order.cryptoObservedAmount) : null,
    confirmations: order.cryptoConfirmations,
    reason: order.cryptoPaymentReason,
    confirmedAt: order.cryptoConfirmedAt?.toISOString() ?? null,
    lastCheckedAt: order.cryptoLastCheckedAt?.toISOString() ?? null,
  };
}

export async function recordCryptoPaymentVerification(
  order: typeof ordersTable.$inferSelect,
  attemptId: number,
  txHash: string,
  applyOrderStatus: boolean,
) {
  const route = cryptoRouteFromSnapshot(order.cryptoRouteSnapshot);
  if (!route || !order.cryptoExpectedAmount) {
    return { status: "manual_review" as const, reason: "The configured payment route is no longer available.", evidence: {} };
  }
  let result = await verifyCryptoPayment(route, txHash, String(order.cryptoExpectedAmount));
  if (
    result.status === "confirmed" &&
    (!result.occurredAt || !order.cryptoRateLockedAt || new Date(result.occurredAt).getTime() < order.cryptoRateLockedAt.getTime())
  ) {
    result = {
      ...result,
      status: "manual_review",
      reason: "The transaction timestamp could not be proven to be after this order's rate lock.",
      evidence: { ...result.evidence, rateLockedAt: order.cryptoRateLockedAt?.toISOString() ?? null },
    };
  }
  const now = new Date();
  const status = result.status as CryptoPaymentStatus;

  await db
    .update(cryptoPaymentAttemptsTable)
    .set({
      status,
      reason: result.reason,
      observedAmount: result.observedAmount ?? null,
      confirmations: result.confirmations ?? null,
      evidence: result.evidence,
      lastCheckedAt: now,
      confirmedAt: result.status === "confirmed" ? now : null,
    })
    .where(eq(cryptoPaymentAttemptsTable.id, attemptId));

  await db.insert(cryptoPaymentAuditsTable).values({
    orderId: order.id,
    attemptId,
    txHash,
    currency: route.currency,
    network: route.network,
    expectedWallet: route.walletAddress,
    expectedAmount: String(order.cryptoExpectedAmount),
    observedAmount: result.observedAmount ?? null,
    confirmations: result.confirmations ?? null,
    result: result.status,
    reason: result.reason,
    evidence: result.evidence,
  });

  if (applyOrderStatus) {
    const updatedOrders = await db
      .update(ordersTable)
      .set({
        cryptoPaymentStatus: result.status,
        cryptoTxHash: txHash,
        cryptoObservedAmount: result.observedAmount ?? null,
        cryptoConfirmations: result.confirmations ?? null,
        cryptoPaymentReason: result.reason,
        cryptoLastCheckedAt: now,
        cryptoConfirmedAt: result.status === "confirmed" ? now : null,
        status: result.status === "confirmed" ? "payment_received" : "awaiting_payment",
      })
      .where(and(eq(ordersTable.id, order.id), eq(ordersTable.status, "awaiting_payment")))
      .returning();
    if (result.status === "confirmed" && updatedOrders.length > 0) {
      const items = await db.select().from(orderItemsTable).where(eq(orderItemsTable.orderId, order.id));
      sendOrderConfirmation({
        orderNumber: order.orderNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        items: items.map((item) => ({
          productName: item.productName,
          productCategory: item.productCategory,
          quantity: item.quantity,
          priceGbp: Number(item.priceGbp),
        })),
        subtotalGbp: Number(order.subtotalGbp),
        shippingCostGbp: Number(order.shippingCostGbp),
        totalGbp: Number(order.totalGbp),
        shippingMethod: order.shippingMethod,
        trackingNumber: order.trackingNumber,
        address1: order.address1,
        address2: order.address2,
        city: order.city,
        postcode: order.postcode,
        country: order.country,
      }).catch((err) => logger.error({ err, orderNumber: order.orderNumber }, "Failed to send crypto order confirmation email"));
    }
  }
  return result;
}

router.get("/crypto/payment-options", async (_req: Request, res: Response): Promise<void> => {
  try {
    res.json({ routes: await getPublicCryptoPaymentOptions() });
  } catch {
    res.status(503).json({ error: "Crypto payment options are temporarily unavailable" });
  }
});

router.get("/orders/:ref/crypto-payment", async (req: Request, res: Response): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  const order = await getOrder(requestParam(req.params.ref));
  if (!order || !hasPaymentAccess(order, req.query.token)) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }
  const details = paymentDetails(order);
  if (!details) {
    res.status(404).json({ error: "Crypto payment not found" });
    return;
  }
  const items = await db
    .select({
      productName: orderItemsTable.productName,
      quantity: orderItemsTable.quantity,
    })
    .from(orderItemsTable)
    .where(eq(orderItemsTable.orderId, order.id));

  res.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    ...details,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      totalGbp: Number(order.totalGbp),
      shippingMethod: order.shippingMethod,
      createdAt: order.createdAt.toISOString(),
      items,
    },
  });
});

router.post("/orders/:ref/lock-usdt-rate", async (req: Request, res: Response): Promise<void> => {
  const order = await getOrder(requestParam(req.params.ref));
  if (!order || !hasPaymentAccess(order, req.body?.paymentToken)) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }
  if (order.status !== "awaiting_payment") {
    res.status(409).json({ error: "This order can no longer accept a new crypto rate." });
    return;
  }
  if (order.cryptoTxHash || order.cryptoPaymentStatus === "pending") {
    res.status(409).json({ error: "A transaction has already been submitted for this order. Its original rate and payment details are preserved while we verify it." });
    return;
  }
  const prepared = await prepareCryptoPayment(Number(order.totalGbp), req.body?.currency, req.body?.network);
  if (!prepared) {
    res.status(400).json({ error: "This crypto route is unavailable or its live rate could not be locked." });
    return;
  }
  const expiresAt = new Date(prepared.details.rateExpiresAt);
  await db
    .update(ordersTable)
    .set({
      cryptoPaymentStatus: "rate_locked",
      cryptoCurrency: prepared.details.currency,
      cryptoNetwork: prepared.details.network,
      cryptoWalletAddress: prepared.details.walletAddress,
        cryptoRouteSnapshot: prepared.route,
      cryptoExpectedAmount: prepared.details.expectedAmount,
      cryptoRateUsd: String(prepared.details.rateUsd),
      cryptoRateLockedAt: new Date(),
      cryptoRateExpiresAt: expiresAt,
      cryptoTxHash: null,
      cryptoObservedAmount: null,
      cryptoConfirmations: null,
      cryptoPaymentReason: null,
    })
    .where(eq(ordersTable.id, order.id));
  res.json({ orderId: order.id, orderNumber: order.orderNumber, ...prepared.details, status: "rate_locked" });
});

router.post("/orders/:ref/crypto-payment/check", async (req: Request, res: Response): Promise<void> => {
  const order = await getOrder(requestParam(req.params.ref));
  if (!order || !hasPaymentAccess(order, req.body?.paymentToken)) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }
  if (order.status !== "awaiting_payment" || order.cryptoPaymentStatus !== "pending" || !order.cryptoTxHash) {
    res.status(409).json({ error: "There is no pending crypto transaction to check for this order." });
    return;
  }
  const attempt = await db
    .select()
    .from(cryptoPaymentAttemptsTable)
    .where(and(
      eq(cryptoPaymentAttemptsTable.orderId, order.id),
      eq(cryptoPaymentAttemptsTable.txHash, order.cryptoTxHash),
    ))
    .limit(1)
    .then((rows) => rows[0] ?? null);
  if (!attempt) {
    res.status(409).json({ error: "The submitted transaction record could not be found. Please contact support." });
    return;
  }
  const result = await recordCryptoPaymentVerification(order, attempt.id, order.cryptoTxHash, true);
  res.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: result.status,
    reason: result.reason,
    observedAmount: result.observedAmount ?? null,
    confirmations: result.confirmations ?? null,
  });
});

router.post("/orders/:ref/pay", async (req: Request, res: Response): Promise<void> => {
  const order = await getOrder(requestParam(req.params.ref));
  if (!order || !hasPaymentAccess(order, req.body?.paymentToken)) {
    res.status(404).json({ error: "Payment not found" });
    return;
  }
  if (!order.cryptoCurrency || !order.cryptoNetwork || !order.cryptoExpectedAmount || !order.cryptoWalletAddress) {
    res.status(409).json({ error: "No crypto payment route is locked for this order." });
    return;
  }
  if (isRateLockExpired(order.cryptoRateExpiresAt)) {
    res.status(409).json({ error: "This crypto rate lock has expired. Lock a fresh rate before submitting payment." });
    return;
  }
  if (order.status !== "awaiting_payment" || !["rate_locked", "pending"].includes(order.cryptoPaymentStatus)) {
    res.status(409).json({ error: "This crypto payment is no longer accepting transaction submissions." });
    return;
  }
  const route = cryptoRouteFromSnapshot(order.cryptoRouteSnapshot);
  if (!route) {
    res.status(409).json({ error: "The selected crypto route is no longer available. Please contact support." });
    return;
  }
  const txHash = normalizeTransactionHash(route.network, req.body?.txHash);
  if (!txHash) {
    res.status(400).json({ error: "Enter a valid transaction hash for the selected network." });
    return;
  }

  const existing = await db
    .select()
    .from(cryptoPaymentAttemptsTable)
    .where(eq(cryptoPaymentAttemptsTable.txHash, txHash))
    .limit(1)
    .then((rows) => rows[0] ?? null);
  if (existing && existing.orderId !== order.id) {
    res.status(409).json({ error: "This transaction hash is already linked to another order." });
    return;
  }
  if (existing && existing.orderId === order.id) {
    const refreshed = await getOrder(String(order.id));
    res.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      status: refreshed?.cryptoPaymentStatus ?? existing.status,
      reason: refreshed?.cryptoPaymentReason ?? existing.reason,
      observedAmount: refreshed?.cryptoObservedAmount ? String(refreshed.cryptoObservedAmount) : existing.observedAmount ? String(existing.observedAmount) : null,
      confirmations: refreshed?.cryptoConfirmations ?? existing.confirmations,
      idempotent: true,
    });
    return;
  }

  const inserted = await db
    .insert(cryptoPaymentAttemptsTable)
    .values({
      orderId: order.id,
      txHash,
      currency: route.currency,
      network: route.network,
      walletAddress: route.walletAddress,
      expectedAmount: String(order.cryptoExpectedAmount),
      status: "pending",
    })
    .onConflictDoNothing({ target: cryptoPaymentAttemptsTable.txHash })
    .returning();
  const attempt = inserted[0];
  if (!attempt) {
    const conflict = await db.select().from(cryptoPaymentAttemptsTable)
      .where(eq(cryptoPaymentAttemptsTable.txHash, txHash)).limit(1)
      .then((rows) => rows[0] ?? null);
    if (conflict?.orderId !== order.id) {
      res.status(409).json({ error: "This transaction hash is already linked to another order." });
      return;
    }
    res.json({ orderId: order.id, orderNumber: order.orderNumber, status: conflict.status, reason: conflict.reason, idempotent: true });
    return;
  }
  const result = await recordCryptoPaymentVerification(order, attempt.id, txHash, true);
  res.json({
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: result.status,
    reason: result.reason,
    observedAmount: result.observedAmount ?? null,
    confirmations: result.confirmations ?? null,
  });
});

export async function reconcilePendingCryptoPayments(): Promise<number> {
  const pendingOrders = await db
    .select()
    .from(ordersTable)
    .where(
      and(
        eq(ordersTable.status, "awaiting_payment"),
        or(eq(ordersTable.cryptoPaymentStatus, "pending"), eq(ordersTable.cryptoPaymentStatus, "rate_locked")),
      ),
    )
    .limit(100);

  let checked = 0;
  for (const order of pendingOrders) {
    if (!order.cryptoTxHash) continue;
    const attempt = await db
      .select()
      .from(cryptoPaymentAttemptsTable)
      .where(and(eq(cryptoPaymentAttemptsTable.orderId, order.id), eq(cryptoPaymentAttemptsTable.txHash, order.cryptoTxHash)))
      .limit(1)
      .then((rows) => rows[0] ?? null);
    if (!attempt) continue;
    await recordCryptoPaymentVerification(order, attempt.id, order.cryptoTxHash, true);
    checked += 1;
  }
  return checked;
}

export default router;