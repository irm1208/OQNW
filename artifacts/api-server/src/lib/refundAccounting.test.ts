import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyConfirmedRefund,
  minorToMoney,
  moneyToMinor,
  remainingRefundableMinor,
} from "./refundAccounting";

test("refund amounts use exact minor-unit accounting", () => {
  assert.equal(moneyToMinor(12.34), 1234);
  assert.equal(moneyToMinor("0.01"), 1);
  assert.equal(moneyToMinor(0), null);
  assert.equal(moneyToMinor(Number.NaN), null);
  assert.equal(minorToMoney(1234), "12.34");
});

test("pending refunds reserve the remaining refundable balance", () => {
  assert.equal(remainingRefundableMinor(10_000, 2_000, 3_000), 5_000);
  assert.equal(remainingRefundableMinor(10_000, 8_000, 3_000), 0);
});

test("confirmed refund classification is monotonic", () => {
  assert.equal(classifyConfirmedRefund(10_000, 2_000, 3_000), "partial");
  assert.equal(classifyConfirmedRefund(10_000, 2_000, 8_000), "full");
});