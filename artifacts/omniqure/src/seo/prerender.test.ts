import assert from "node:assert/strict";
import test from "node:test";
import { injectSeoIntoHtml, routeFromHtmlUrl, seoForApiRecord } from "./prerender";

const shell = `<!doctype html><html><head>
  <title>Default title</title>
  <meta name="description" content="Default description" />
  <link rel="canonical" href="https://omniqure.com/" />
</head><body><div id="root"></div></body></html>`;

test("product routes receive their published title, social metadata, canonical URL, and JSON-LD", () => {
  const html = injectSeoIntoHtml(
    shell,
    seoForApiRecord("product", {
      slug: "bpc-157-10mg",
      name: "BPC-157 10mg",
      category: "Recovery",
      priceGbp: 29.99,
      imageUrl: "/products/bpc-157.png",
      description: "A research peptide.",
      purity: "99%",
      seoTitle: "BPC-157 Search Title",
      seoDescription: "Configured product description.",
    }),
  );

  assert.match(html, /<title>BPC-157 Search Title \| OmniQure Peptide Research Institute<\/title>/);
  assert.match(html, /property="og:url" content="https:\/\/omniqure\.com\/product\/bpc-157-10mg"/);
  assert.match(html, /rel="canonical" href="https:\/\/omniqure\.com\/product\/bpc-157-10mg"/);
  assert.match(html, /data-seo="product">.*"@type":"Product"/);
  assert.match(html, /data-seo="breadcrumb">.*"@type":"BreadcrumbList"/);
  assert.equal((html.match(/<title>/g) ?? []).length, 1);
});

test("blog routes preserve encoded slugs and use their configured article metadata", () => {
  assert.deepEqual(routeFromHtmlUrl("/blog/purity%20testing"), {
    kind: "blog",
    slug: "purity testing",
  });

  const html = injectSeoIntoHtml(
    shell,
    seoForApiRecord("blog", {
      slug: "purity-testing",
      title: "Purity Testing Explained",
      excerpt: "Learn how purity testing works.",
      author: "OmniQure Team",
      featuredImageUrl: null,
      seoTitle: "Purity Testing Search Title",
      seoDescription: "Configured article description.",
      publishedAt: "2026-08-01T00:00:00.000Z",
    }),
  );

  assert.match(html, /property="og:type" content="article"/);
  assert.match(html, /rel="canonical" href="https:\/\/omniqure\.com\/blog\/purity-testing"/);
  assert.match(html, /data-seo="article">.*"@type":"Article"/);
});