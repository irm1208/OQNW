import assert from "node:assert/strict";
import test from "node:test";
import { createCustomerSegmentSchema, customerSegmentRulesSchema } from "./customerSegments";

test("customer segment rules accept only the supported condition shapes", () => {
  const valid = customerSegmentRulesSchema.safeParse({
    matchMode: "all",
    conditions: [
      { field: "total_spend_gbp", operator: "gte", value: 25 },
      { field: "marketing_status", operator: "equals", value: "subscribed" },
      { field: "has_abandoned_cart", operator: "equals", value: true },
    ],
  });
  assert.equal(valid.success, true);
});

test("customer segment rules reject unknown fields, operators, and invalid bounds", () => {
  assert.equal(customerSegmentRulesSchema.safeParse({
    matchMode: "any",
    conditions: [{ field: "total_orders", operator: "gte", value: 1 }],
  }).success, false);
  assert.equal(customerSegmentRulesSchema.safeParse({
    matchMode: "all",
    conditions: [{ field: "total_orders", operator: "equals", value: 1 }],
  }).success, false);
  assert.equal(customerSegmentRulesSchema.safeParse({
    matchMode: "all",
    conditions: [{ field: "total_orders", operator: "gte", value: -1, extra: true }],
  }).success, false);
  assert.equal(createCustomerSegmentSchema.safeParse({
    name: "",
    rules: { matchMode: "all", conditions: [{ field: "is_affiliate", operator: "equals", value: true }] },
  }).success, false);
});