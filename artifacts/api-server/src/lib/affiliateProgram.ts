export interface AffiliateTierRule {
  id: number;
  name: string;
  slug: string;
  minimumSalesGbp: number;
  commissionRatePercent: number;
  rewardCreditGbp: number;
  isActive: boolean;
}

export interface AffiliateTierProgress {
  currentTier: AffiliateTierRule | null;
  nextTier: AffiliateTierRule | null;
  rollingSalesGbp: number;
  salesToNextTierGbp: number;
  progressPercent: number;
}

const money = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

export function affiliateTierProgress(
  tiers: readonly AffiliateTierRule[],
  rollingSalesGbp: number,
): AffiliateTierProgress {
  const sales = Math.max(0, money(rollingSalesGbp));
  const active = tiers
    .filter(tier => tier.isActive)
    .slice()
    .sort((a, b) => a.minimumSalesGbp - b.minimumSalesGbp || a.id - b.id);
  const currentTier = active.filter(tier => tier.minimumSalesGbp <= sales).at(-1) ?? null;
  const nextTier = active.find(tier => tier.minimumSalesGbp > sales) ?? null;
  if (!currentTier) {
    return {
      currentTier: null,
      nextTier,
      rollingSalesGbp: sales,
      salesToNextTierGbp: nextTier ? money(nextTier.minimumSalesGbp - sales) : 0,
      progressPercent: 0,
    };
  }
  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      rollingSalesGbp: sales,
      salesToNextTierGbp: 0,
      progressPercent: 100,
    };
  }
  const range = nextTier.minimumSalesGbp - currentTier.minimumSalesGbp;
  const progressPercent = range <= 0
    ? 100
    : Math.min(100, Math.max(0, Math.round(((sales - currentTier.minimumSalesGbp) / range) * 100)));
  return {
    currentTier,
    nextTier,
    rollingSalesGbp: sales,
    salesToNextTierGbp: money(nextTier.minimumSalesGbp - sales),
    progressPercent,
  };
}

export function calculateAffiliateCommission(eligibleSalesGbp: number, commissionRatePercent: number): number {
  if (!Number.isFinite(eligibleSalesGbp) || eligibleSalesGbp < 0) throw new Error("Eligible sales must be 0 or greater");
  if (!Number.isFinite(commissionRatePercent) || commissionRatePercent < 0 || commissionRatePercent > 100) {
    throw new Error("Commission rate must be between 0 and 100");
  }
  return money(eligibleSalesGbp * commissionRatePercent / 100);
}

export function calculateAffiliateEligibleSales(input: {
  subtotalGbp: number;
  bundleDiscountGbp: number;
  discountAmountGbp: number;
  loyaltyDiscountGbp: number;
  creditDiscountGbp: number;
}): number {
  return Math.max(0, money(
    input.subtotalGbp
    - input.bundleDiscountGbp
    - input.discountAmountGbp
    - input.loyaltyDiscountGbp
    - input.creditDiscountGbp,
  ));
}

export function newlyEarnedRewardCredits(
  previousSettledSalesGbp: number,
  settledSalesGbp: number,
  thresholdGbp: number,
  maximumCredits: number,
): number {
  if (thresholdGbp <= 0 || maximumCredits <= 0) return 0;
  const previousMilestones = Math.floor(Math.max(0, previousSettledSalesGbp) / thresholdGbp);
  const currentMilestones = Math.floor(Math.max(0, settledSalesGbp) / thresholdGbp);
  return Math.min(maximumCredits, Math.max(0, currentMilestones - previousMilestones));
}