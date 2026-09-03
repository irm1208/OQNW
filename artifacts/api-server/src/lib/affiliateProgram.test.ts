import assert from "node:assert/strict";
import test from "node:test";
import {
  affiliateTierProgress,
  calculateAffiliateCommission,
  calculateAffiliateEligibleSales,
  newlyEarnedRewardCredits,
  type AffiliateTierRule,
} from "./affiliateProgram";

const tiers: AffiliateTierRule[] = [
  { id: 1, name: "Starter", slug: "starter", minimumSalesGbp: 0, commissionRatePercent: 5, rewardCreditGbp: 0, isActive: true },
  { id: 2, name: "Growth", slug: "growth", minimumSalesGbp: 1000, commissionRatePercent: 8, rewardCreditGbp: 50, isActive: true },
  { id: 3, name: "Elite", slug: "elite", minimumSalesGbp: 2500, commissionRatePercent: 10, rewardCreditGbp: 75, isActive: true },
];

test("tier progress uses rolling sales and the highest eligible active tier", () => {
  const progress = affiliateTierProgress(tiers, 1600);
  assert.equal(progress.currentTier?.slug, "growth");
  assert.equal(progress.nextTier?.slug, "elite");
  assert.equal(progress.salesToNextTierGbp, 900);
  assert.equal(progress.progressPercent, 40);
});

test("elite tier remains complete without a next tier", () => {
  const progress = affiliateTierProgress(tiers, 3000);
  assert.equal(progress.currentTier?.slug, "elite");
  assert.equal(progress.nextTier, null);
  assert.equal(progress.progressPercent, 100);
});

test("commission is rounded to pennies", () => {
  assert.equal(calculateAffiliateCommission(123.45, 8), 9.88);
});

test("eligible sales exclude every merchandise discount but not shipping", () => {
  assert.equal(calculateAffiliateEligibleSales({
    subtotalGbp: 250,
    bundleDiscountGbp: 25,
    discountAmountGbp: 22.5,
    loyaltyDiscountGbp: 5,
    creditDiscountGbp: 20,
  }), 177.5);
});

test("reward credits are milestone based and capped", () => {
  assert.equal(newlyEarnedRewardCredits(900, 2100, 1000, 1), 1);
  assert.equal(newlyEarnedRewardCredits(0, 5000, 1000, 2), 2);
  assert.equal(newlyEarnedRewardCredits(1200, 1800, 1000, 2), 0);
});