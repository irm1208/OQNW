import assert from "node:assert/strict";
import test from "node:test";
import {
  buildCatalogPricePreview,
  CatalogPriceInputError,
  createPriceSyncConfirmationToken,
  parseApprovedPriceChanges,
  parseCataloguePrices,
  verifyPriceSyncConfirmationToken,
} from "./catalogPriceSync";

test("buildCatalogPricePreview returns a slug-keyed price-only diff", () => {
  const preview = buildCatalogPricePreview(
    [
      { slug: "alpha", priceGbp: 12 },
      { slug: "beta", priceGbp: null },
      { slug: "development-only", priceGbp: 7.5 },
    ],
    [
      { slug: "alpha", name: "Alpha", priceGbp: "10.00" },
      { slug: "beta", name: "Beta", priceGbp: null },
      { slug: "production-only", name: "Production only", priceGbp: "4.99" },
    ],
  );

  assert.deepEqual(preview.changes, [
    {
      slug: "alpha",
      name: "Alpha",
      productionPriceGbp: 10,
      cataloguePriceGbp: 12,
    },
  ]);
  assert.equal(preview.matchedCount, 2);
  assert.equal(preview.unchangedCount, 1);
  assert.deepEqual(preview.sourceOnlySlugs, ["development-only"]);
  assert.deepEqual(preview.productionOnlySlugs, ["production-only"]);
});

test("confirmation token is signed, order-independent, and expires", () => {
  const changes = parseApprovedPriceChanges([
    { slug: "beta", name: "Beta", productionPriceGbp: 2, cataloguePriceGbp: 3 },
    { slug: "alpha", name: "Alpha", productionPriceGbp: 1, cataloguePriceGbp: 2 },
  ]);
  const secret = "test-only-secret";
  const expiresAt = 10_000;
  const token = createPriceSyncConfirmationToken(changes, secret, expiresAt);
  assert.equal(
    token,
    createPriceSyncConfirmationToken([...changes].reverse(), secret, expiresAt),
  );
  assert.equal(verifyPriceSyncConfirmationToken(token, changes, secret, 9_999), true);
  assert.equal(verifyPriceSyncConfirmationToken(token, changes, "wrong-secret", 9_999), false);
  assert.equal(verifyPriceSyncConfirmationToken(token, changes, secret, 10_001), false);
});

test("confirmation token rejects a tampered price diff", () => {
  const changes = parseApprovedPriceChanges([
    { slug: "alpha", name: "Alpha", productionPriceGbp: 1, cataloguePriceGbp: 2 },
  ]);
  const token = createPriceSyncConfirmationToken(changes, "test-only-secret", 10_000);
  const tampered = [{ ...changes[0], cataloguePriceGbp: 999 }];
  assert.equal(
    verifyPriceSyncConfirmationToken(token, tampered, "test-only-secret", 9_999),
    false,
  );
});

test("catalogue price input rejects duplicate slugs and sub-penny values", () => {
  assert.throws(
    () => parseCataloguePrices([
      { slug: "alpha", priceGbp: 1 },
      { slug: "alpha", priceGbp: 2 },
    ]),
    CatalogPriceInputError,
  );
  assert.throws(
    () => parseCataloguePrices([{ slug: "alpha", priceGbp: 1.001 }]),
    CatalogPriceInputError,
  );
});