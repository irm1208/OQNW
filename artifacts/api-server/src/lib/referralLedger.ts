export type SpendableReward = { id: number; remaining: number };
export type ReferralBeneficiaryRole = "referrer" | "referred";

export function buildReferralRewardDrafts(input: {
  qualifyingOrderId: number;
  referrerCustomerId: number;
  referredCustomerId: number;
  held: boolean;
  reason: string;
  now: Date;
}) {
  const shared = {
    referrerCustomerId: input.referrerCustomerId,
    referredCustomerId: input.referredCustomerId,
    qualifyingOrderId: input.qualifyingOrderId,
    status: input.held ? "held" : "pending",
    amountGbp: "25.00",
    remainingAmountGbp: "25.00",
    statusReason: input.held ? input.reason : null,
    heldAt: input.held ? input.now : null,
  };
  return ([
    {
      ...shared,
      beneficiaryCustomerId: input.referrerCustomerId,
      beneficiaryRole: "referrer" as const,
    },
    {
      ...shared,
      beneficiaryCustomerId: input.referredCustomerId,
      beneficiaryRole: "referred" as const,
    },
  ]);
}

export function allocateReferralCredit(rewards: SpendableReward[], requested: number) {
  let outstanding = Math.round(requested * 100) / 100;
  const allocations: { rewardId: number; amount: number; remaining: number; redeemed: boolean }[] = [];
  for (const reward of rewards) {
    if (outstanding <= 0) break;
    const amount = Math.min(reward.remaining, outstanding);
    if (amount <= 0) continue;
    const remaining = Math.round((reward.remaining - amount) * 100) / 100;
    allocations.push({ rewardId: reward.id, amount, remaining, redeemed: remaining === 0 });
    outstanding = Math.round((outstanding - amount) * 100) / 100;
  }
  return { allocations, insufficient: outstanding > 0, outstanding };
}

export function releaseStatus(orderShipped: boolean, balance: number, remaining: number) {
  const status = orderShipped ? "earned" as const : "pending" as const;
  return { status, balanceDelta: status === "earned" ? remaining : 0, exceedsCap: status === "earned" && balance + remaining > 50 };
}