import assert from "node:assert/strict";
import test from "node:test";
import {
  isAutomatedAgent,
  isKnownSafeAgent,
  resourceKindForPath,
  shouldStartTemporaryBlock,
} from "./publicTrafficProtection";
import {
  toCanonicalCatalogueImageUrl,
  toPublicCatalogueImageUrl,
} from "./catalogueAssetUrls";

test("classifies only public extraction routes", () => {
  assert.equal(resourceKindForPath("/api/products"), "catalogue");
  assert.equal(resourceKindForPath("/api/products/bpc-157-5mg"), "catalogue");
  assert.equal(resourceKindForPath("/api/products/3/related"), "catalogue");
  assert.equal(resourceKindForPath("/api/products/3/reviews"), "reviews");
  assert.equal(resourceKindForPath("/api/blog/posts?limit=12"), "blog");
  assert.equal(resourceKindForPath("/api/blog/posts/purity-testing"), "blog");
  assert.equal(resourceKindForPath("/sitemap.xml"), "sitemap");
  assert.equal(resourceKindForPath("/products/3.jpg?v=2"), "image");
  assert.equal(resourceKindForPath("/api/catalogue-assets/products/3.jpg"), "image");

  assert.equal(resourceKindForPath("/api/orders/quote"), null);
  assert.equal(resourceKindForPath("/api/orders"), null);
  assert.equal(resourceKindForPath("/api/address-verification"), null);
  assert.equal(resourceKindForPath("/api/account/me"), null);
  assert.equal(resourceKindForPath("/assets/app.js"), null);
});

test("known search and accessibility agents are exempt", () => {
  assert.equal(isKnownSafeAgent("Mozilla/5.0 (compatible; Googlebot/2.1)"), true);
  assert.equal(isKnownSafeAgent("Mozilla/5.0 AppleWebKit Lighthouse"), true);
  assert.equal(isKnownSafeAgent("axe-core accessibility scanner"), true);
  assert.equal(isKnownSafeAgent("NVDA screen reader"), true);
  assert.equal(isKnownSafeAgent("Mozilla/5.0 Chrome/140 Safari/537.36"), false);
});

test("ordinary browsers and obvious automation are distinguished", () => {
  assert.equal(isAutomatedAgent("Mozilla/5.0 Chrome/140 Safari/537.36"), false);
  assert.equal(isAutomatedAgent("Mozilla/5.0 Firefox/142.0"), false);
  assert.equal(isAutomatedAgent("curl/8.14.1"), true);
  assert.equal(isAutomatedAgent("python-requests/2.32"), true);
  assert.equal(isAutomatedAgent(""), true);
});

test("admin image round trips stay canonical and public URLs are prefixed once", () => {
  assert.equal(toCanonicalCatalogueImageUrl("/products/1.jpg"), "/products/1.jpg");
  assert.equal(
    toCanonicalCatalogueImageUrl("/api/catalogue-assets/products/1.jpg"),
    "/products/1.jpg",
  );
  assert.equal(
    toPublicCatalogueImageUrl("/api/catalogue-assets/products/1.jpg"),
    "/api/catalogue-assets/products/1.jpg?v=2026-09-20-cards",
  );
});

test("expired temporary blocks can be renewed", () => {
  const now = Date.now();
  assert.equal(shouldStartTemporaryBlock(null, now), true);
  assert.equal(shouldStartTemporaryBlock(new Date(now + 1_000), now), false);
  assert.equal(shouldStartTemporaryBlock(new Date(now - 1), now), true);
});