import { useEffect } from "react";

export const SITE_NAME = "OmniQure Peptide Research Institute";
export const SITE_URL = "https://omniqure.com";
const DEFAULT_TITLE = "OmniQure Peptide Research Institute — Independently Verified Research Peptides";
const DEFAULT_DESCRIPTION =
  "Buy high-purity research peptides independently verified to 99%+. BPC-157, TB-500, Semaglutide, Tirzepatide, Epithalon and 100+ peptides. Worldwide shipping. For research use only.";
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

function upsertJsonLd(id: string, data: object) {
  let el = document.querySelector<HTMLScriptElement>(`script[data-seo="${id}"]`);
  if (!el) {
    el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-seo", id);
    document.head.appendChild(el);
  }
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
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SEOProps {
  title?: string | null;
  description?: string | null;
  keywords?: string | null;
  ogType?: string;
  canonicalPath?: string | null;
  ogImage?: string | null;
  noSiteSuffix?: boolean;
  product?: ProductJsonLd | null;
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
  product,
  breadcrumbs,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title
      ? noSiteSuffix
        ? title
        : `${title} | ${SITE_NAME}`
      : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;
    const img = ogImage ?? DEFAULT_OG_IMAGE;
    const canonicalHref = canonicalPath ? `${SITE_URL}${canonicalPath}` : null;

    document.title = fullTitle;

    // Standard
    upsertMeta("name", "description", desc);
    upsertMeta("name", "robots", "index, follow");
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

    // Twitter / X Cards — summary_large_image shows a rich preview
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", img);
    upsertMeta("name", "twitter:image:alt", fullTitle);

    if (canonicalHref) upsertCanonical(canonicalHref);

    // JSON-LD: Product structured data (Google Rich Results, Bing, Pinterest)
    if (product) {
      const priceStr = product.price != null ? product.price.toFixed(2) : undefined;
      upsertJsonLd("product", {
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
        offers: priceStr
          ? {
              "@type": "Offer",
              url: `${SITE_URL}/product/${product.productId}`,
              priceCurrency: "GBP",
              price: priceStr,
              availability: `https://schema.org/${product.availability}`,
              seller: {
                "@type": "Organization",
                name: SITE_NAME,
              },
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
      });
    } else {
      removeJsonLd("product");
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
      removeJsonLd("breadcrumb");
    };
  }, [title, description, keywords, ogType, canonicalPath, ogImage, noSiteSuffix, product, breadcrumbs]);
}
