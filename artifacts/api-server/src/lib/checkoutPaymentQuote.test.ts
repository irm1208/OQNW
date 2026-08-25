import assert from "node:assert/strict";
import test from "node:test";
import {
  CheckoutPaymentQuoteReplayGuard,
  createCheckoutFingerprint,
  createCheckoutPaymentQuoteToken,
  verifyCheckoutPaymentQuoteToken,
} from "./checkoutPaymentQuote";
import { allocatePaymentLineAmounts } from "./payment-currency";

const secret = "checkout-payment-quote-test-secret";
const fingerprint = createCheckoutFingerprint({
  items: [
    { productId: 12, productSlug: "bpc-157", quantity: 2, priceGbp: 21 },
    { productId: 4, productSlug: "cjc-1295", quantity: 1, priceGbp: 35 },
  ],
  shippingMethod: "Standard",
  shippingCostGbp: 0,
  paymentCurrency: "EUR",
  discountCode: "WELCOME10",
  loyaltyPointsRedeemed: 200,
  referralCreditRedeemed: false,
  country: "United Kingdom",
});

test("checkout quote tokens preserve the exact quoted currency and amount", () => {
  const now = Date.UTC(2026, 7, 23, 12, 0, 0);
  const created = createCheckoutPaymentQuoteToken({
    currency: "EUR",
    amountMinor: 13431,
    totalGbpMinor: 11480,
    checkoutFingerprint: fingerprint,
    customerId: 8,
  }, secret, now);

  const verified = verifyCheckoutPaymentQuoteToken(created.token, secret, {
    currency: "EUR",
    totalGbpMinor: 11480,
    checkoutFingerprint: fingerprint,
    customerId: 8,
  }, now + 1_000);

  assert.deepEqual(verified, {
    currency: "EUR",
    amountMinor: 13431,
    totalGbpMinor: 11480,
    checkoutFingerprint: fingerprint,
    customerId: 8,
    expiresAt: now + 5 * 60 * 1000,
  });
});

test("checkout quote tokens reject cart, customer, amount, and expiry changes", () => {
  const now = Date.UTC(2026, 7, 23, 12, 0, 0);
  const { token } = createCheckoutPaymentQuoteToken({
    currency: "GBP",
    amountMinor: 10000,
    totalGbpMinor: 10000,
    checkoutFingerprint: fingerprint,
    customerId: null,
  }, secret, now);

  assert.equal(verifyCheckoutPaymentQuoteToken(token, secret, {
    currency: "GBP",
    totalGbpMinor: 10001,
    checkoutFingerprint: fingerprint,
    customerId: null,
  }, now + 1_000), null);
  assert.equal(verifyCheckoutPaymentQuoteToken(token, secret, {
    currency: "GBP",
    totalGbpMinor: 10000,
    checkoutFingerprint: `${fingerprint}changed`,
    customerId: null,
  }, now + 1_000), null);
  assert.equal(verifyCheckoutPaymentQuoteToken(token, secret, {
    currency: "GBP",
    totalGbpMinor: 10000,
    checkoutFingerprint: fingerprint,
    customerId: 8,
  }, now + 1_000), null);
  assert.equal(verifyCheckoutPaymentQuoteToken(token, secret, {
    currency: "GBP",
    totalGbpMinor: 10000,
    checkoutFingerprint: fingerprint,
    customerId: null,
  }, now + 5 * 60 * 1000), null);
});

test("checkout fingerprints change for every price-affecting checkout selection", () => {
  const createFingerprint = (overrides: Partial<Parameters<typeof createCheckoutFingerprint>[0]> = {}) =>
    createCheckoutFingerprint({
      items: [{ productId: 12, productSlug: "bpc-157", quantity: 6, priceGbp: 21 }],
      shippingMethod: "Standard",
      shippingCostGbp: 0,
      paymentCurrency: "GBP",
      discountCode: null,
      loyaltyPointsRedeemed: 0,
      referralCreditRedeemed: false,
      country: "United Kingdom",
      ...overrides,
    });

  const baseline = createFingerprint();
  assert.notEqual(createFingerprint({ shippingCostGbp: 4.99 }), baseline);
  assert.notEqual(createFingerprint({ discountCode: "WELCOME10" }), baseline);
  assert.notEqual(createFingerprint({ loyaltyPointsRedeemed: 200 }), baseline);
  assert.notEqual(createFingerprint({ referralCreditRedeemed: true }), baseline);
  assert.notEqual(createFingerprint({ paymentCurrency: "EUR" }), baseline);
  assert.notEqual(createFingerprint({ testPaymentSessionId: "test-session" }), baseline);
  assert.notEqual(createFingerprint({ items: [{ productId: 12, productSlug: "bpc-157", quantity: 5, priceGbp: 21 }] }), baseline);
});

test("Wallid payment lines retain the exact final total after reductions and rounding", () => {
  const finalEurMinor = 13431;
  const lineAmounts = allocatePaymentLineAmounts(finalEurMinor, [126, 42, 21]);

  assert.equal(lineAmounts.reduce((sum, amount) => sum + amount, 0), finalEurMinor);
  assert.ok(lineAmounts.every((amount) => Number.isInteger(amount) && amount >= 0));
  assert.deepEqual(allocatePaymentLineAmounts(finalEurMinor, [126]), [finalEurMinor]);
});

test("checkout quote replay guard allows one claim only until the quote expires", () => {
  const guard = new CheckoutPaymentQuoteReplayGuard();
  const now = 1_700_000_000_000;

  assert.equal(guard.consume("signed-token", now + 1_000, now), true);
  assert.equal(guard.consume("signed-token", now + 1_000, now), false);
  assert.equal(guard.consume("expired-token", now, now), false);
  assert.equal(guard.consume("new-token", now + 2_000, now + 1_001), true);
});