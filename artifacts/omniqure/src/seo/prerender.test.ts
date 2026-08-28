import assert from "node:assert/strict";
import test from "node:test";
import { injectSeoIntoHtml, routeFromHtmlUrl, seoForApiRecord, seoForReferral } from "./prerender";

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

test("referral signup links receive a branded social preview without exposing the referral code", () => {
  assert.deepEqual(routeFromHtmlUrl("/sign-up?ref=ABC123"), { kind: "referral" });
  assert.equal(routeFromHtmlUrl("/sign-up"), null);

  const html = injectSeoIntoHtml(
    shell,
    seoForReferral(),
  );

  assert.match(html, /<title>Join OmniQure — Get 10% Off Your First Order \| OmniQure Peptide Research Institute<\/title>/);
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(html, /property="og:type" content="website"/);
  assert.match(html, /property="og:title" content="Join OmniQure — Get 10% Off Your First Order \| OmniQure Peptide Research Institute"/);
  assert.match(html, /property="og:description" content="You've been invited to join OmniQure\. Create your research account to unlock 10% off your first order, and you and your friend can each earn £25 credit when the order ships\."/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /name="twitter:image" content="https:\/\/omniqure\.com\/opengraph\.jpg"/);
  assert.match(html, /rel="canonical" href="https:\/\/omniqure\.com\/sign-up"/);
  assert.match(html, /data-seo="referral">.*"@type":"WebPage"/);
  assert.doesNotMatch(html, /ABC123/);
});