import { useEffect } from "react";

const SITE_NAME = "OmniQure Peptide Research Institute";
const DEFAULT_TITLE = "OmniQure Peptide Research Institute — HPLC-Verified Research Peptides";
const DEFAULT_DESCRIPTION =
  "Buy high-purity research peptides verified by HPLC to 99%+. BPC-157, TB-500, Semaglutide, Tirzepatide, Epithalon and 100+ peptides. Worldwide shipping. For research use only.";
const SITE_URL = "https://omniqure.co.uk";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(path: string) {
  let el = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", `${SITE_URL}${path}`);
}

interface SEOProps {
  title?: string | null;
  description?: string | null;
  ogType?: string;
  canonicalPath?: string | null;
  noSiteSuffix?: boolean;
}

export function useSEO({
  title,
  description,
  ogType = "website",
  canonicalPath,
  noSiteSuffix = false,
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title
      ? noSiteSuffix
        ? title
        : `${title} | ${SITE_NAME}`
      : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;

    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:type", ogType);
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("name", "twitter:card", "summary");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);

    if (canonicalPath) upsertCanonical(canonicalPath);

    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title, description, ogType, canonicalPath, noSiteSuffix]);
}
