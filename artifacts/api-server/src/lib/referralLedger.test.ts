import test from "node:test";
import assert from "node:assert/strict";
import { allocateReferralCredit, buildReferralRewardDrafts, releaseStatus } from "./referralLedger";

test("allocates referral credit oldest-first across partial buckets", () => {
  assert.deepEqual(allocateReferralCredit([{ id: 1, remaining: 10 }, { id: 2, remaining: 25 }], 20), {
    allocations: [{ rewardId: 1, amount: 10, remaining: 0, redeemed: true }, { rewardId: 2, amount: 10, remaining: 15, redeemed: false }],
    insufficient: false, outstanding: 0,
  });
});
test("marks full reward redemption and reports insufficient ledgers", () => {
  assert.equal(allocateReferralCredit([{ id: 1, remaining: 25 }], 25).allocations[0].redeemed, true);
  assert.equal(allocateReferralCredit([{ id: 1, remaining: 10 }], 25).insufficient, true);
});
test("release decision earns only shipped orders and protects cap", () => {
  assert.deepEqual(releaseStatus(false, 50, 25), { status: "pending", balanceDelta: 0, exceedsCap: false });
  assert.equal(releaseStatus(true, 30, 25).exceedsCap, true);
});

test("builds the same idempotent issuance identities for a qualifying order", () => {
  const input = {
    qualifyingOrderId: 901,
    referrerCustomerId: 11,
    referredCustomerId: 22,
    held: false,
    reason: "",
    now: new Date("2026-09-03T12:00:00Z"),
  };
  const first = buildReferralRewardDrafts(input);
  const replay = buildReferralRewardDrafts(input);
  assert.deepEqual(replay, first);
  assert.deepEqual(
    first.map(({ qualifyingOrderId, beneficiaryCustomerId, beneficiaryRole }) => ({
      qualifyingOrderId,
      beneficiaryCustomerId,
      beneficiaryRole,
    })),
    [
      { qualifyingOrderId: 901, beneficiaryCustomerId: 11, beneficiaryRole: "referrer" },
      { qualifyingOrderId: 901, beneficiaryCustomerId: 22, beneficiaryRole: "referred" },
    ],
  );
});