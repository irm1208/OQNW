export const CRYPTO_RATE_LOCK_MS = 60 * 60 * 1000;

export function cryptoRateLockExpiresAt(now = Date.now()): Date {
  return new Date(now + CRYPTO_RATE_LOCK_MS);
}

export function isRateLockExpired(value: Date | null, now = Date.now()): boolean {
  return !value || value.getTime() <= now;
}

export function isCryptoTransactionSubmissionOpen(
  orderStatus: string,
  paymentStatus: string,
): boolean {
  return orderStatus === "awaiting_payment" &&
    (paymentStatus === "rate_locked" || paymentStatus === "pending");
}

export function canAutoConfirmCryptoTransaction(
  occurredAt: string | undefined,
  rateLockedAt: Date | null,
  rateExpiresAt: Date | null,
  attemptSubmittedAt: Date | null,
): boolean {
  if (!occurredAt || !rateLockedAt || !rateExpiresAt || !attemptSubmittedAt) return false;
  const occurredAtMs = new Date(occurredAt).getTime();
  const lockedAtMs = rateLockedAt.getTime();
  const expiresAtMs = rateExpiresAt.getTime();
  const submittedAtMs = attemptSubmittedAt.getTime();
  if (
    !Number.isFinite(occurredAtMs) ||
    !Number.isFinite(lockedAtMs) ||
    !Number.isFinite(expiresAtMs) ||
    !Number.isFinite(submittedAtMs) ||
    occurredAtMs < lockedAtMs ||
    submittedAtMs < lockedAtMs
  ) {
    return false;
  }

  if (submittedAtMs < expiresAtMs) {
    return true;
  }

  return occurredAtMs < expiresAtMs;
}