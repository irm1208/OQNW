import assert from "node:assert/strict";
import test from "node:test";
import { createCheckoutQuoteInputKey } from "./checkoutQuoteInputKey";

const baseInput = {
  items: [{ productId: 12, productSlug: "bpc-157", quantity: 1, priceGbp: 21 }],
  shipping: "standard",
  country: "United Kingdom",
  discountCode: null,
  loyaltyPointsToRedeem: 0,
  redeemFreePeptide: true,
  referralCreditGbp: 25,
  paymentCurrency: "GBP" as const,
  paymentMethod: "wallid" as const,
};

test("a changed referral credit balance invalidates the active checkout quote key", () => {
  const original = createCheckoutQuoteInputKey(baseInput);
  const changedBalance = createCheckoutQuoteInputKey({
    ...baseInput,
    referralCreditGbp: 50,
  });

  assert.notEqual(changedBalance, original);
});