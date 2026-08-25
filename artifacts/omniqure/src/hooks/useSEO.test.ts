import assert from "node:assert/strict";
import test from "node:test";
import {
  createArticleJsonLd,
  createProductJsonLd,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
  resolveSeoMetadata,
} from "./useSEO";

test("configured product metadata emits canonical, Open Graph, and GBP offer values", () => {
  const metadata = resolveSeoMetadata({
    title: "BPC-157 10mg Research Peptide",
    description: "Configured product search description.",
    ogImage: "/product-images/bpc-157.png",
    canonicalPath: "/product/bpc-157-10mg",
  });

  assert.deepEqual(metadata, {
    title: `BPC-157 10mg Research Peptide | ${SITE_NAME}`,
    description: "Configured product search description.",
    image: "/product-images/bpc-157.png",
    canonicalHref: `${SITE_URL}/product/bpc-157-10mg`,
  });

  const product = createProductJsonLd({
    name: "BPC-157 10mg",
    description: metadata.description,
    image: "/product-images/bpc-157.png",
    price: 29.99,
    productId: "bpc-157-10mg",
    category: "Recovery",
    purity: "99%",
    availability: "InStock",
    currency: "GBP",
    aggregateRating: { ratingValue: 4.8, reviewCount: 12 },
  });

  assert.equal(product["@type"], "Product");
  assert.equal(product.description, "Configured product search description.");
  assert.deepEqual(product.offers, {
    "@type": "Offer",
    url: `${SITE_URL}/product/bpc-157-10mg`,
    priceCurrency: "GBP",
    price: "29.99",
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: SITE_NAME },
  });
  assert.deepEqual(product.aggregateRating, {
    "@type": "AggregateRating",
    ratingValue: 4.8,
    reviewCount: 12,
  });
});

test("configured article metadata emits a canonical Open Graph URL and falls back safely", () => {
  const metadata = resolveSeoMetadata({
    title: "Configured Article Search Title",
    description: "Configured article search description.",
    canonicalPath: "/blog/purity-testing-explained",
  });
  const article = createArticleJsonLd({
    headline: "Purity Testing Explained",
    description: metadata.description,
    url: "/blog/purity-testing-explained",
    author: "OmniQure Team",
  });

  assert.equal(metadata.title, `Configured Article Search Title | ${SITE_NAME}`);
  assert.equal(metadata.canonicalHref, `${SITE_URL}/blog/purity-testing-explained`);
  assert.equal(article["@type"], "Article");
  assert.equal(article.description, "Configured article search description.");
  assert.equal(article.url, metadata.canonicalHref);
  assert.deepEqual(article.mainEntityOfPage, {
    "@type": "WebPage",
    "@id": metadata.canonicalHref,
  });

  assert.deepEqual(resolveSeoMetadata({}), {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    image: `${SITE_URL}/opengraph.jpg`,
    canonicalHref: null,
  });
});