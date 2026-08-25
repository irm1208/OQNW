import { useEffect } from "react";

export const SITE_NAME = "OmniQure Peptide Research Institute";
export const SITE_URL = "https://omniqure.com";
export const DEFAULT_TITLE = "OmniQure Peptide Research Institute — Verified Research Peptides";
export const DEFAULT_DESCRIPTION =
  "Buy high-purity research peptides verified to 98%+. BPC-157, TB-500, Ipamorelin, CJC-1295, Epithalon and 100+ peptides. Worldwide shipping. For research use only.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph.jpg`;

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeCanonical() {
  document.querySelector('link[rel="canonical"]')?.remove();
}

function removeMeta(attr: "name" | "property", key: string) {
  document.querySelector(`meta[${attr}="${key}"]`)?.remove();
}

function upsertJsonLd(id: string, data: object) {
  let el = document.querySelector<HTMLScriptElement>(`script[data-seo="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo", id);
    document.head.appendChild(el);
  }
  el.id = `seo-jsonld-${id}`;
  el.textContent = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  document.querySelector(`script[data-seo="${id}"]`)?.remove();
}

export interface ProductJsonLd {
  name: string;
  description: string;
  image: string;
  price: number | null;
  productId: string;
  category: string;
  purity: string;
  availability: "InStock" | "OutOfStock" | "LimitedAvailability";
  currency?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  } | null;
}

export interface ArticleJsonLd {
  headline: string;
  description: string;
  url: string;
  image?: string | null;
  datePublished?: string | null;
  dateModified?: string | null;
  author?: string | null;
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export interface ResolvedSeoMetadata {
  title: string;
  description: string;
  image: string;
  canonicalHref: string | null;
}

export function resolveSeoMetadata({
  title,
  description,
  ogImage,
  canonicalPath,
  noSiteSuffix = false,
}: Pick<SEOProps, "title" | "description" | "ogImage" | "canonicalPath" | "noSiteSuffix">): ResolvedSeoMetadata {
  return {
    title: title
      ? noSiteSuffix
        ? title
        : `${title} | ${SITE_NAME}`
      : DEFAULT_TITLE,
    description: description ?? DEFAULT_DESCRIPTION,
    image: ogImage ?? DEFAULT_OG_IMAGE,
    canonicalHref: canonicalPath ? `${SITE_URL}${canonicalPath}` : null,
  };
}

export function createProductJsonLd(product: ProductJsonLd) {
  const price = product.price != null ? product.price.toFixed(2) : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/product/${product.productId}#product`,
    name: product.name,
    description: product.description,
    image: product.image.startsWith("http")
      ? product.image
      : `${SITE_URL}${product.image}`,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: SITE_NAME,
    },
    offers: price
      ? {
          "@type": "Offer",
          url: `${SITE_URL}/product/${product.productId}`,
          priceCurrency: product.currency ?? "GBP",
          price,
          availability: `https://schema.org/${product.availability}`,
          seller: {
            "@type": "Organization",
            name: SITE_NAME,
          },
        }
      : undefined,
    aggregateRating:
      product.aggregateRating && product.aggregateRating.reviewCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.aggregateRating.ratingValue,
            reviewCount: product.aggregateRating.reviewCount,
          }
        : undefined,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Purity",
        value: `${product.purity}`,
      },
      {
        "@type": "PropertyValue",
        name: "Research Use Only",
        value: "Yes",
      },
    ],
  };
}

export function createArticleJsonLd(article: ArticleJsonLd) {
  const articleUrl = article.url.startsWith("http")
    ? article.url
    : `${SITE_URL}${article.url}`;
  const articleImage = article.image
    ? article.image.startsWith("http")
      ? article.image
      : `${SITE_URL}${article.image}`
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.headline,
    description: article.description,
    url: articleUrl,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    image: articleImage,
    datePublished: article.datePublished ?? undefined,
    dateModified: article.dateModified ?? article.datePublished ?? undefined,
    author: {
      "@type": "Person",
      name: article.author || "OmniQure Research Team",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

interface SEOProps {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  ogType?: string;
  canonicalPath?: string | null;
  ogImage?: string | null;
  noSiteSuffix?: boolean;
  noIndex?: boolean;
  product?: ProductJsonLd | null;
  article?: ArticleJsonLd | null;
  breadcrumbs?: BreadcrumbItem[] | null;
}

export function useSEO({
  title,
  description,
  keywords,
  ogType = "website",
  canonicalPath,
  ogImage,
  noSiteSuffix = false,
  noIndex = false,
  product,
  article,
  breadcrumbs,
}: SEOProps) {
  useEffect(() => {
    const {
      title: fullTitle,
      description: desc,
      image: img,
      canonicalHref,
    } = resolveSeoMetadata({ title, description, ogImage, canonicalPath, noSiteSuffix });

    document.title = fullTitle;

    // Standard
    upsertMeta("name", "description", desc);
    upsertMeta("name", "robots", noIndex ? "noindex, nofollow" : "index, follow");
    if (keywords) upsertMeta("name", "keywords", keywords);

    // Open Graph — Facebook, LinkedIn, WhatsApp, Discord, Slack, iMessage
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:image", img);
    upsertMeta("property", "og:image:width", "1200");
    upsertMeta("property", "og:image:height", "630");
    upsertMeta("property", "og:image:alt", fullTitle);
    upsertMeta("property", "og:locale", "en");
    if (canonicalHref) upsertMeta("property", "og:url", canonicalHref);
    else removeMeta("property", "og:url");

    // Twitter / X Cards — summary_large_image shows a rich preview
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", img);
    upsertMeta("name", "twitter:image:alt", fullTitle);

    if (canonicalHref) upsertCanonical(canonicalHref);
    else removeCanonical();

    // JSON-LD: Product structured data (Google Rich Results, Bing, Pinterest)
    if (product) {
      upsertJsonLd("product", createProductJsonLd(product));
    } else {
      removeJsonLd("product");
    }

    // JSON-LD: Article structured data for research posts
    if (article) {
      upsertJsonLd("article", createArticleJsonLd(article));
    } else {
      removeJsonLd("article");
    }

    // JSON-LD: BreadcrumbList (Google Search results path display)
    if (breadcrumbs && breadcrumbs.length > 0) {
      upsertJsonLd("breadcrumb", {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: breadcrumbs.map((b, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: b.name,
          item: `${SITE_URL}${b.path}`,
        })),
      });
    } else {
      removeJsonLd("breadcrumb");
    }

    return () => {
      document.title = DEFAULT_TITLE;
      removeJsonLd("product");
      removeJsonLd("article");
      removeJsonLd("breadcrumb");
    };
  }, [title, description, keywords, ogType, canonicalPath, ogImage, noSiteSuffix, noIndex, product, article, breadcrumbs]);
}
