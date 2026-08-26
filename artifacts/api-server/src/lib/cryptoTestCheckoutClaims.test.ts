import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import test from "node:test";
import { adminTestPaymentClaimsTable, db } from "@workspace/db";
import { eq } from "drizzle-orm";
import { claimCryptoTestCheckoutSession } from "./cryptoTestCheckoutClaims";

test("Crypto test checkout claims are atomic and survive independent callers", async () => {
  const sessionId = `test-${randomBytes(20).toString("hex")}`;
  const expiresAt = Date.now() + 60_000;

  try {
    const claims = await Promise.all(
      Array.from({ length: 8 }, () =>
        claimCryptoTestCheckoutSession(sessionId, expiresAt),
      ),
    );
    assert.equal(claims.filter(Boolean).length, 1);

    assert.equal(
      await claimCryptoTestCheckoutSession(sessionId, expiresAt),
      false,
    );
  } finally {
    await db
      .delete(adminTestPaymentClaimsTable)
      .where(eq(adminTestPaymentClaimsTable.sessionId, sessionId));
  }
});

test("Expired crypto test checkout sessions cannot be claimed", async () => {
  assert.equal(
    await claimCryptoTestCheckoutSession(
      `expired-${randomBytes(20).toString("hex")}`,
      Date.now() - 1,
    ),
    false,
  );
});