import assert from "node:assert/strict";
import test from "node:test";
import { standardShippingPriceGbpForCountry } from "./shipping";

test("checkout standard shipping matches every published destination zone", () => {
  assert.equal(standardShippingPriceGbpForCountry("United Kingdom"), 0);
  assert.equal(standardShippingPriceGbpForCountry("Jersey"), 9.95);
  assert.equal(standardShippingPriceGbpForCountry("Germany"), 14.99);
  assert.equal(standardShippingPriceGbpForCountry("Czechia"), 17.99);
  assert.equal(standardShippingPriceGbpForCountry("United States"), 22.99);
  assert.equal(standardShippingPriceGbpForCountry("Australia"), 27.99);
  assert.equal(standardShippingPriceGbpForCountry("Japan"), 23.99);
  assert.equal(standardShippingPriceGbpForCountry("South Africa"), 29.99);
});