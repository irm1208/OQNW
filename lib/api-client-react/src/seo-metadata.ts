export const SITE_NAME = "OmniQure Peptide Research Institute";
export const SITE_URL = "https://omniqure.com";
export const DEFAULT_SITE_TITLE = "OmniQure Peptide Research Institute — Verified Research Peptides";
export const DEFAULT_SITE_DESCRIPTION =
  "Buy high-purity research peptides verified to 98%+. BPC-157, TB-500, Ipamorelin, CJC-1295, Epithalon and 100+ peptides. Worldwide shipping. For research use only.";

type ResolvedMetadata = {
  title: string;
  description: string;
  titleIsFallback: boolean;
  descriptionIsFallback: boolean;
};

function normalise(value: string | null | undefined): string {
  return value?.trim() ?? "";
}

export function getProductSeoMetadata({
  name,
  category,
  description,
  purity,
  seoTitle,
  seoDescription,
}: {
  name: string | null | undefined;
  category: string | null | undefined;
  description: string | null | undefined;
  purity: string | null | undefined;
  seoTitle: string | null | undefined;
  seoDescription: string | null | undefined;
}): ResolvedMetadata {
  const fallbackTitle = normalise(name) || "Research Peptide";
  const descriptionSource = normalise(description);
  const purityText = normalise(purity) || "98%+";
  const fallbackDescription = descriptionSource
    ? `${descriptionSource.slice(0, 140).split(". ")[0]}. ${purityText} verified purity. For research use only — ${SITE_NAME}.`
    : `${fallbackTitle} — ${normalise(category) || "research"} research peptide. ${purityText} verified purity. For research use only.`;
  const customTitle = normalise(seoTitle);
  const customDescription = normalise(seoDescription);

  return {
    title: customTitle || fallbackTitle,
    description: customDescription || fallbackDescription,
    titleIsFallback: !customTitle,
    descriptionIsFallback: !customDescription,
  };
}

export function getBlogSeoMetadata({
  title,
  excerpt,
  seoTitle,
  seoDescription,
}: {
  title: string | null | undefined;
  excerpt: string | null | undefined;
  seoTitle: string | null | undefined;
  seoDescription: string | null | undefined;
}): ResolvedMetadata {
  const customTitle = normalise(seoTitle);
  const customDescription = normalise(seoDescription);

  return {
    title: customTitle || normalise(title) || "Research article",
    description: customDescription || normalise(excerpt) || DEFAULT_SITE_DESCRIPTION,
    titleIsFallback: !customTitle,
    descriptionIsFallback: !customDescription,
  };
}

export function formatSearchTitle(title: string): string {
  return `${title} | ${SITE_NAME}`;
}

export function getPublicProductPath(slug: string): string {
  return `/product/${encodeURIComponent(slug)}`;
}

export function getPublicBlogPath(slug: string): string {
  return `/blog/${encodeURIComponent(slug)}`;
}