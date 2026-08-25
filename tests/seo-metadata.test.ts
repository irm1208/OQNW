import assert from "node:assert/strict";
import test from "node:test";
import {
  DEFAULT_SITE_DESCRIPTION,
  SITE_NAME,
  formatSearchTitle,
  getBlogSeoMetadata,
  getProductSeoMetadata,
  getPublicBlogPath,
  getPublicProductPath,
} from "../lib/api-client-react/src/seo-metadata.ts";

test("product metadata uses saved overrides when present", () => {
  const metadata = getProductSeoMetadata({
    name: "BPC-157 5mg",
    category: "Healing Peptides",
    description: "A product description.",
    purity: "99%+",
    seoTitle: "Custom product title",
    seoDescription: "Custom product description.",
  });

  assert.deepEqual(metadata, {
    title: "Custom product title",
    description: "Custom product description.",
    titleIsFallback: false,
    descriptionIsFallback: false,
  });
  assert.equal(formatSearchTitle(metadata.title), `Custom product title | ${SITE_NAME}`);
});

test("product metadata fallback follows the storefront contract", () => {
  const metadata = getProductSeoMetadata({
    name: "BPC-157 5mg",
    category: "Healing Peptides",
    description: "BPC-157 is a synthetic peptide studied for tissue repair. Further detail is not used.",
    purity: "99%+",
    seoTitle: null,
    seoDescription: null,
  });

  assert.deepEqual(metadata, {
    title: "BPC-157 5mg",
    description: `BPC-157 is a synthetic peptide studied for tissue repair. 99%+ verified purity. For research use only — ${SITE_NAME}.`,
    titleIsFallback: true,
    descriptionIsFallback: true,
  });
});

test("blog metadata uses its excerpt and default site description as fallbacks", () => {
  const excerptFallback = getBlogSeoMetadata({
    title: "Research article",
    excerpt: "A concise article excerpt.",
    seoTitle: "",
    seoDescription: "",
  });
  assert.equal(excerptFallback.title, "Research article");
  assert.equal(excerptFallback.description, "A concise article excerpt.");

  const siteFallback = getBlogSeoMetadata({
    title: "Research article",
    excerpt: null,
    seoTitle: null,
    seoDescription: null,
  });
  assert.equal(siteFallback.description, DEFAULT_SITE_DESCRIPTION);
});

test("public preview paths use storefront product and blog routes", () => {
  assert.equal(getPublicProductPath("bpc-157 5mg"), "/product/bpc-157%205mg");
  assert.equal(getPublicBlogPath("research & news"), "/blog/research%20%26%20news");
});