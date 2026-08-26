import assert from "node:assert/strict";
import test from "node:test";
import {
  validateSuccessfulWallidPayment,
  wallidPaymentIdFromNotes,
} from "./wallidReconciliation";

const expected = {
  apiPaymentId: "payment-123",
  orderNumber: "OQ-123456",
  amountMinor: 100,
  currency: "GBP",
};

const successfulStatus = {
  api_payment_id: expected.apiPaymentId,
  order_id: expected.orderNumber,
  status: "SUCCESS",
  amount: expected.amountMinor,
  currency: expected.currency,
};

test("extracts the Wallid payment ID from order notes", () => {
  assert.equal(
    wallidPaymentIdFromNotes(
      "WALLID £1 TEST CHECKOUT: normal total £27.99; Wallid payment id: payment-123",
    ),
    "payment-123",
  );
  assert.equal(wallidPaymentIdFromNotes("Customer requested delivery note"), null);
});

test("accepts only an exact successful Wallid payment match", () => {
  assert.deepEqual(validateSuccessfulWallidPayment(expected, successfulStatus), { ok: true });
  assert.deepEqual(
    validateSuccessfulWallidPayment(expected, { ...successfulStatus, amount: 101 }),
    { ok: false, reason: "amount_mismatch" },
  );
  assert.deepEqual(
    validateSuccessfulWallidPayment(expected, { ...successfulStatus, order_id: "OQ-654321" }),
    { ok: false, reason: "order_id_mismatch" },
  );
  assert.deepEqual(
    validateSuccessfulWallidPayment(expected, { ...successfulStatus, status: "PENDING" }),
    { ok: false, reason: "not_successful" },
  );
});