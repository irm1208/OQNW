import assert from "node:assert/strict";
import test from "node:test";
import {
  createWallidTestCheckoutToken,
  verifyWallidTestCheckoutToken,
  WallidTestCheckoutReplayGuard,
} from "./wallidTestCheckout";

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

test("Wallid test checkout sessions can be claimed once only", () => {
  const guard = new WallidTestCheckoutReplayGuard();
  const now = 1_700_000_000_000;

  assert.equal(guard.consume("test-session", now + 1_000, now), true);
  assert.equal(guard.consume("test-session", now + 1_000, now), false);
  assert.equal(guard.consume("expired-session", now, now), false);
  assert.equal(guard.consume("next-session", now + 2_000, now + 1_001), true);
});