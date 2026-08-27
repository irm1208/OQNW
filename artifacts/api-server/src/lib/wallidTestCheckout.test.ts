import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { adminTestPaymentClaimsTable, db } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  createWallidTestCheckoutToken,
  verifyWallidTestCheckoutToken,
} from "./wallidTestCheckout";
import { claimWallidTestCheckoutSession } from "./wallidTestCheckoutClaims";

const secret = "wallid-test-checkout-test-secret";

test("Wallid test checkout tokens are signed and expire after their short lifetime", () => {
  const now = Date.UTC(2026, 7, 25, 12, 0, 0);
  const { token } = createWallidTestCheckoutToken(secret, now);

  const verified = verifyWallidTestCheckoutToken(token, secret, now + 1_000);
  assert.ok(verified);
  assert.equal(verified.expiresAt, now + 15 * 60 * 1_000);

  assert.equal(verifyWallidTestCheckoutToken(`${token}x`, secret, now + 1_000), null);
  assert.equal(verifyWallidTestCheckoutToken(token, "wrong-secret", now + 1_000), null);
  assert.equal(verifyWallidTestCheckoutToken(token, secret, now + 15 * 60 * 1_000), null);
});

test("Wallid test checkout claims are atomic and survive independent callers", async () => {
  const sessionId = `wallid-test-${randomBytes(20).toString("hex")}`;
  const expiresAt = Date.now() + 60_000;

  try {
    const claims = await Promise.all(
      Array.from({ length: 8 }, () =>
        claimWallidTestCheckoutSession(sessionId, expiresAt),
      ),
    );
    assert.equal(claims.filter(Boolean).length, 1);

    assert.equal(
      await claimWallidTestCheckoutSession(sessionId, expiresAt),
      false,
    );
  } finally {
    await db
      .delete(adminTestPaymentClaimsTable)
      .where(eq(adminTestPaymentClaimsTable.sessionId, sessionId));
  }
});

test("Expired Wallid test checkout sessions cannot be claimed", async () => {
  assert.equal(
    await claimWallidTestCheckoutSession(
      `wallid-expired-${randomBytes(20).toString("hex")}`,
      Date.now() - 1,
    ),
    false,
  );
});
