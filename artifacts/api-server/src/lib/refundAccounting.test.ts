import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyConfirmedRefund,
  minorToMoney,
  moneyToMinor,
  remainingRefundableMinor,
  normalizeRefundSelection,
  resolveStoredRefundItems,
  reservedRefundQuantities,
} from "./refundAccounting";

test("refund amounts use exact minor-unit accounting", () => {
  assert.equal(moneyToMinor(12.34), 1234);
  assert.equal(moneyToMinor("0.01"), 1);
  assert.equal(moneyToMinor(0), null);
  assert.equal(moneyToMinor(Number.NaN), null);
  assert.equal(minorToMoney(1234), "12.34");
});

test("item selections reject duplicates and invalid quantities", () => {
  assert.equal(normalizeRefundSelection([{ orderItemId: 1, quantity: 1 }, { orderItemId: 1, quantity: 1 }]), null);
  assert.equal(normalizeRefundSelection([{ orderItemId: 1, quantity: 1.5 }]), null);
  assert.deepEqual(normalizeRefundSelection([{ orderItemId: 1, quantity: 2 }]), [{ orderItemId: 1, quantity: 2 }]);
});

test("pending and confirmed reserve stock while cancelled releases it", () => {
  const lines = [{ id: 1, productId: 10, productName: "A", quantity: 3 }];
  const refunds = [
    { status: "pending", restoreInventory: true, lineItemsJson: '[{"orderItemId":1,"productId":10,"quantity":1}]' },
    { status: "confirmed", restoreInventory: true, lineItemsJson: '[{"orderItemId":1,"productId":10,"quantity":1}]' },
    { status: "cancelled", restoreInventory: true, lineItemsJson: '[{"orderItemId":1,"productId":10,"quantity":3}]' },
  ];
  assert.equal(reservedRefundQuantities(lines, refunds).quantities.get(1), 2);
});

test("partial repeated returns cannot reserve more than a purchased line", () => {
  const lines = [{ id: 1, productId: 10, productName: "A", quantity: 2 }];
  const reservations = reservedRefundQuantities(lines, [
    { status: "confirmed", restoreInventory: true, lineItemsJson: '[{"orderItemId":1,"productId":10,"quantity":1}]' },
    { status: "pending", restoreInventory: true, lineItemsJson: '[{"orderItemId":1,"productId":10,"quantity":1}]' },
  ]);
  assert.equal(lines[0].quantity - (reservations.quantities.get(1) ?? 0), 0);
});

test("ambiguous legacy product-only history blocks duplicate product lines", () => {
  const result = reservedRefundQuantities(
    [{ id: 1, productId: 10, productName: "A", quantity: 1 }, { id: 2, productId: 10, productName: "A free", quantity: 1 }],
    [{ status: "confirmed", restoreInventory: true, lineItemsJson: '[{"productId":10,"quantity":1}]' }],
  );
  assert.equal(result.conflict, true);
});

test("stored duplicate entries are aggregated before enforcing the purchased cap", () => {
  const result = resolveStoredRefundItems(
    [{ id: 1, productId: 10, productName: "A", quantity: 3 }],
    '[{"orderItemId":1,"productId":10,"quantity":2},{"orderItemId":1,"productId":10,"quantity":2}]',
  );
  assert.equal(result.conflict, false);
  assert.equal(result.items[0].quantity, 4);
});

test("unambiguous legacy product entries resolve to the canonical order line", () => {
  assert.deepEqual(
    resolveStoredRefundItems(
      [{ id: 7, productId: 10, productName: "Canonical name", quantity: 2 }],
      '[{"productId":10,"productName":"Untrusted name","quantity":1}]',
    ),
    {
      conflict: false,
      items: [{ orderItemId: 7, productId: 10, productName: "Canonical name", quantity: 1 }],
    },
  );
});

test("pending refunds reserve the remaining refundable balance", () => {
  assert.equal(remainingRefundableMinor(10_000, 2_000, 3_000), 5_000);
  assert.equal(remainingRefundableMinor(10_000, 8_000, 3_000), 0);
});

test("confirmed refund classification is monotonic", () => {
  assert.equal(classifyConfirmedRefund(10_000, 2_000, 3_000), "partial");
  assert.equal(classifyConfirmedRefund(10_000, 2_000, 8_000), "full");
});