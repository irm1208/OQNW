import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateCryptoTestPaymentTotal,
  createCryptoTestCheckoutToken,
  verifyCryptoTestCheckoutToken,
} from "./cryptoTestCheckout";

const secret = "crypto-test-checkout-test-secret";

test("Crypto test checkout pricing charges exactly £1 without changing the normal total", () => {
  assert.deepEqual(calculateCryptoTestPaymentTotal(42.987), {
    totalGbp: 1,
    adjustmentGbp: 41.99,
  });
  assert.deepEqual(calculateCryptoTestPaymentTotal(1), {
    totalGbp: 1,
    adjustmentGbp: 0,
  });
  assert.equal(calculateCryptoTestPaymentTotal(0.99), null);
  assert.equal(calculateCryptoTestPaymentTotal(Number.NaN), null);
});

test("Crypto test checkout tokens are signed and expire after their short lifetime", () => {
  const now = Date.UTC(2026, 7, 26, 12, 0, 0);
  const { token } = createCryptoTestCheckoutToken(secret, now);

  const verified = verifyCryptoTestCheckoutToken(token, secret, now + 1_000);
  assert.ok(verified);
  assert.equal(verified.expiresAt, now + 15 * 60 * 1_000);

  assert.equal(verifyCryptoTestCheckoutToken(`${token}x`, secret, now + 1_000), null);
  assert.equal(verifyCryptoTestCheckoutToken(token, "wrong-secret", now + 1_000), null);
  assert.equal(verifyCryptoTestCheckoutToken(token, secret, now + 15 * 60 * 1_000), null);
});
