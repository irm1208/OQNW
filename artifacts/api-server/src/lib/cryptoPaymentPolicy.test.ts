import assert from "node:assert/strict";
import test from "node:test";
import {
  CRYPTO_RATE_LOCK_MS,
  canAutoConfirmCryptoTransaction,
  cryptoRateLockExpiresAt,
  isCryptoTransactionSubmissionOpen,
  isRateLockExpired,
} from "./cryptoPaymentPolicy";

test("new crypto rate locks last exactly one hour", () => {
  const now = Date.UTC(2026, 7, 27, 12, 0, 0);
  const expiresAt = cryptoRateLockExpiresAt(now);

  assert.equal(CRYPTO_RATE_LOCK_MS, 60 * 60 * 1000);
  assert.equal(expiresAt.getTime(), now + 60 * 60 * 1000);
  assert.equal(isRateLockExpired(expiresAt, expiresAt.getTime() - 1), false);
  assert.equal(isRateLockExpired(expiresAt, expiresAt.getTime()), true);
});

test("an expired quote does not block a transaction already sent by the customer", () => {
  const now = Date.UTC(2026, 7, 27, 14, 0, 0);
  const expiredAt = new Date(now - 1);

  assert.equal(isRateLockExpired(expiredAt, now), true);
  assert.equal(isCryptoTransactionSubmissionOpen("awaiting_payment", "rate_locked"), true);
  assert.equal(isCryptoTransactionSubmissionOpen("awaiting_payment", "pending"), true);
});

test("terminal orders and payment states do not accept new transaction submissions", () => {
  assert.equal(isCryptoTransactionSubmissionOpen("payment_received", "confirmed"), false);
  assert.equal(isCryptoTransactionSubmissionOpen("awaiting_payment", "confirmed"), false);
  assert.equal(isCryptoTransactionSubmissionOpen("awaiting_payment", "manual_review"), false);
  assert.equal(isCryptoTransactionSubmissionOpen("cancelled", "rate_locked"), false);
});

test("a transaction submitted during the lock can confirm after the lock expires", () => {
  const lockedAt = new Date("2026-08-27T12:00:00.000Z");
  const expiresAt = new Date("2026-08-27T13:00:00.000Z");
  const submittedAt = new Date("2026-08-27T12:30:00.000Z");

  assert.equal(
    canAutoConfirmCryptoTransaction("2026-08-27T13:30:00.000Z", lockedAt, expiresAt, submittedAt),
    true,
  );
});

test("a late-submitted transaction must prove its on-chain time was within the lock", () => {
  const lockedAt = new Date("2026-08-27T12:00:00.000Z");
  const expiresAt = new Date("2026-08-27T13:00:00.000Z");
  const submittedAfterExpiry = new Date("2026-08-27T13:05:00.000Z");

  assert.equal(
    canAutoConfirmCryptoTransaction("2026-08-27T12:55:00.000Z", lockedAt, expiresAt, submittedAfterExpiry),
    true,
  );
  assert.equal(
    canAutoConfirmCryptoTransaction("2026-08-27T13:01:00.000Z", lockedAt, expiresAt, submittedAfterExpiry),
    false,
  );
});

test("pre-lock or unprovable transaction timing cannot auto-confirm", () => {
  const lockedAt = new Date("2026-08-27T12:00:00.000Z");
  const expiresAt = new Date("2026-08-27T13:00:00.000Z");
  const submittedAt = new Date("2026-08-27T12:30:00.000Z");

  assert.equal(
    canAutoConfirmCryptoTransaction("2026-08-27T11:59:59.999Z", lockedAt, expiresAt, submittedAt),
    false,
  );
  assert.equal(canAutoConfirmCryptoTransaction(undefined, lockedAt, expiresAt, submittedAt), false);
  assert.equal(canAutoConfirmCryptoTransaction("not-a-date", lockedAt, expiresAt, submittedAt), false);
  assert.equal(
    canAutoConfirmCryptoTransaction("2026-08-27T12:30:00.000Z", null, expiresAt, submittedAt),
    false,
  );
});