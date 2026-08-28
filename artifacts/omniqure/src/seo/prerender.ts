// This file is also loaded by Vite's Node config loader. Import the shared
// source module directly because that loader externalizes workspace packages
// and Node cannot execute their TypeScript entrypoint on its own.
import {
  getBlogSeoMetadata,
  getProductSeoMetadata,
  SITE_NAME,
  SITE_URL,
} from "../../../../lib/api-client-react/src/seo-metadata";
import { REFERRAL_SHARE_DESCRIPTION, REFERRAL_SHARE_TITLE } from "./referral";

type ProductSeoRecord = {
  slug: string;
  name: string;
  category: string;
  priceGbp: number | null;
  imageUrl: string | null;
  description: string | null;
  purity: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
};

type BlogSeoRecord = {
  title: string;
  slug: string;
  excerpt: string | null;
  author: string;
  featuredImageUrl: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: string | null;
};

type SeoValues = {
  title: string;
  description: string;
  image: string;
  canonical: string;
  type: "website" | "article" | "product";
  robots?: "index, follow" | "noindex, nofollow";
  jsonLdId: "product" | "article" | "referral";
  jsonLd: object;
  breadcrumb: object;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function safeJson(value: object): string {
  // Prevent user-managed catalog/blog content from closing the JSON-LD script.
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function absoluteUrl(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

function replaceHeadTag(html: string, pattern: RegExp, replacement: string): string {
  return html.replace(pattern, replacement);
}

function metaTag(attr: "name" | "property", key: string, value: string): string {
  return `<meta ${attr}="${key}" content="${escapeHtml(value)}" data-prerender-seo="true" />`;
}

function makeProductSeo(product: ProductSeoRecord): SeoValues {
  const seo = getProductSeoMetadata({
    name: product.name,
    category: product.category,
    description: product.description,
    purity: product.purity,
    seoTitle: product.seoTitle,
    seoDescription: product.seoDescription,
  });
  const canonical = `${SITE_URL}/product/${encodeURIComponent(product.slug)}`;
  const image = absoluteUrl(product.imageUrl, `${SITE_URL}/opengraph.jpg`);

  return {
    title: `${seo.title} | ${SITE_NAME}`,
    description: seo.description,
    image,
    canonical,
    type: "product",
    jsonLdId: "product",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `${canonical}#product`,
      name: product.name,
      description: seo.description,
      image,
      category: product.category,
      brand: { "@type": "Brand", name: SITE_NAME },
      ...(product.priceGbp != null
        ? {
            offers: {
              "@type": "Offer",
              url: canonical,
              priceCurrency: "GBP",
              price: product.priceGbp.toFixed(2),
              availability: "https://schema.org/InStock",
              seller: { "@type": "Organization", name: SITE_NAME },
            },
          }
        : {}),
      additionalProperty: [
        { "@type": "PropertyValue", name: "Purity", value: product.purity || "98%+" },
        { "@type": "PropertyValue", name: "Research Use Only", value: "Yes" },
      ],
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "All Peptides", item: `${SITE_URL}/all-peptides` },
        {
          "@type": "ListItem",
          position: 3,
          name: product.category,
          item: `${SITE_URL}/all-peptides?category=${encodeURIComponent(product.category)}`,
        },
        { "@type": "ListItem", position: 4, name: product.name, item: canonical },
      ],
    },
  };
}

function makeBlogSeo(post: BlogSeoRecord): SeoValues {
  const seo = getBlogSeoMetadata({
    title: post.title,
    excerpt: post.excerpt,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
  });
  const canonical = `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`;
  const image = absoluteUrl(post.featuredImageUrl, `${SITE_URL}/opengraph.jpg`);

  return {
    title: `${seo.title} | ${SITE_NAME}`,
    description: seo.description,
    image,
    canonical,
    type: "article",
    jsonLdId: "article",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: seo.description,
      url: canonical,
      mainEntityOfPage: { "@type": "WebPage", "@id": canonical },
      ...(post.featuredImageUrl ? { image } : {}),
      ...(post.publishedAt ? { datePublished: post.publishedAt, dateModified: post.publishedAt } : {}),
      author: { "@type": "Person", name: post.author || "OmniQure Research Team" },
      publisher: { "@type": "Organization", name: SITE_NAME },
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: canonical },
      ],
    },
  };
}

function makeReferralSeo(): SeoValues {
  const canonical = `${SITE_URL}/sign-up`;
  const image = `${SITE_URL}/opengraph.jpg`;

  return {
    title: `${REFERRAL_SHARE_TITLE} | ${SITE_NAME}`,
    description: REFERRAL_SHARE_DESCRIPTION,
    image,
    canonical,
    type: "website",
    robots: "noindex, nofollow",
    jsonLdId: "referral",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${canonical}#referral`,
      name: REFERRAL_SHARE_TITLE,
      description: REFERRAL_SHARE_DESCRIPTION,
      url: canonical,
      image,
      isPartOf: { "@id": `${SITE_URL}/#website` },
    },
    breadcrumb: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Refer a Friend", item: `${SITE_URL}/refer-a-friend` },
        { "@type": "ListItem", position: 3, name: "Create Account", item: canonical },
      ],
    },
  };
}

type HtmlRoute =
  | { kind: "product" | "blog"; slug: string }
  | { kind: "referral" };

export function routeFromHtmlUrl(url: string): HtmlRoute | null {
  const parsedUrl = new URL(url, SITE_URL);
  const pathname = parsedUrl.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/sign-up" && parsedUrl.searchParams.get("ref")?.trim()) {
    return { kind: "referral" };
  }

  const match = pathname.match(/^\/(product|blog)\/([^/]+)$/);
  if (!match) return null;

  try {
    return {
      kind: match[1] === "product" ? "product" : "blog",
      slug: decodeURIComponent(match[2]),
    };
  } catch {
    return null;
  }
}

export function injectSeoIntoHtml(html: string, seo: SeoValues): string {
  const headTags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    metaTag("name", "description", seo.description),
    metaTag("name", "robots", seo.robots ?? "index, follow"),
    metaTag("property", "og:type", seo.type),
    metaTag("property", "og:site_name", SITE_NAME),
    metaTag("property", "og:title", seo.title),
    metaTag("property", "og:description", seo.description),
    metaTag("property", "og:image", seo.image),
    metaTag("property", "og:image:width", "1200"),
    metaTag("property", "og:image:height", "630"),
    metaTag("property", "og:image:alt", seo.title),
    metaTag("property", "og:url", seo.canonical),
    metaTag("property", "og:locale", "en"),
    metaTag("name", "twitter:card", "summary_large_image"),
    metaTag("name", "twitter:title", seo.title),
    metaTag("name", "twitter:description", seo.description),
    metaTag("name", "twitter:image", seo.image),
    metaTag("name", "twitter:image:alt", seo.title),
    `<link rel="canonical" href="${escapeHtml(seo.canonical)}" data-prerender-seo="true" />`,
    `<script type="application/ld+json" data-seo="${seo.jsonLdId}">${safeJson(seo.jsonLd)}</script>`,
    `<script type="application/ld+json" data-seo="breadcrumb">${safeJson(seo.breadcrumb)}</script>`,
  ].join("\n    ");

  let output = html;
  output = output.replace(/\s*<[^>]+data-prerender-seo="true"[^>]*>\s*/g, "\n");
  output = replaceHeadTag(output, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  output = replaceHeadTag(
    output,
    /<meta\s+name="description"[^>]*>/i,
    metaTag("name", "description", seo.description),
  );
  output = replaceHeadTag(output, /<link\s+rel="canonical"[^>]*>/i, `<link rel="canonical" href="${escapeHtml(seo.canonical)}" />`);

  // Replace the complete page-level SEO block while preserving the shell's
  // organization/site JSON-LD and unrelated PWA metadata.
  const firstTitle = output.indexOf("<title>");
  const headEnd = output.indexOf("</head>");
  if (firstTitle >= 0 && headEnd > firstTitle) {
    const existingHeadSeo = output.slice(firstTitle, headEnd);
    const withoutExisting = existingHeadSeo
      .replace(/<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*\/?>/gi, "")
      .replace(/<link\s+rel="canonical"[^>]*\/?>/gi, "")
      .replace(/<title>[\s\S]*?<\/title>/i, "");
    output = `${output.slice(0, firstTitle)}${withoutExisting}\n    ${headTags}${output.slice(headEnd)}`;
  }

  return output;
}

export function seoForApiRecord(
  kind: "product" | "blog",
  record: ProductSeoRecord | BlogSeoRecord,
): SeoValues {
  return kind === "product"
    ? makeProductSeo(record as ProductSeoRecord)
    : makeBlogSeo(record as BlogSeoRecord);
}

export function seoForReferral(): SeoValues {
  return makeReferralSeo();
}