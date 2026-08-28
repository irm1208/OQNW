import assert from "node:assert/strict";
import test from "node:test";
import { calculateShippingCostGbp } from "./shipping";

test("standard UK shipping is free below and above the old threshold", () => {
  assert.equal(calculateShippingCostGbp("Standard", 10, "United Kingdom"), 0);
  assert.equal(calculateShippingCostGbp("Standard", 100, "United Kingdom"), 0);
});

test("express UK shipping remains chargeable", () => {
  assert.equal(calculateShippingCostGbp("Next Day Weekday", 10, "United Kingdom"), 9.99);
  assert.equal(calculateShippingCostGbp("Next-Day Weekend", 100, "United Kingdom"), 14.99);
});

test("Channel Islands and each published international zone retain their listed rates", () => {
  assert.equal(calculateShippingCostGbp("Standard", 10, "Jersey"), 9.95);
  assert.equal(calculateShippingCostGbp("Standard", 10, "Guernsey"), 9.95);
  assert.equal(calculateShippingCostGbp("Standard", 10, "Germany"), 14.99);
  assert.equal(calculateShippingCostGbp("Standard", 10, "Czechia"), 17.99);
  assert.equal(calculateShippingCostGbp("Standard", 10, "United States"), 22.99);
  assert.equal(calculateShippingCostGbp("Standard", 10, "Australia"), 27.99);
  assert.equal(calculateShippingCostGbp("Standard", 10, "Japan"), 23.99);
  assert.equal(calculateShippingCostGbp("Standard", 10, "South Africa"), 29.99);
});