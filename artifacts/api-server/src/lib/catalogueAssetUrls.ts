const PROTECTED_PREFIX = "/api/catalogue-assets";
const CATALOGUE_ASSET_VERSION = "2026-09-21-bac-water-10ml";

export function toCanonicalCatalogueImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) return imageUrl;
  let canonical = imageUrl;
  while (canonical.startsWith(PROTECTED_PREFIX)) {
    canonical = canonical.slice(PROTECTED_PREFIX.length);
  }
  return canonical.startsWith("/") ? canonical : `/${canonical}`;
}

export function toPublicCatalogueImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl || /^https?:\/\//i.test(imageUrl)) return imageUrl;
  const canonical = toCanonicalCatalogueImageUrl(imageUrl);
  if (!canonical) return canonical;
  const separator = canonical.includes("?") ? "&" : "?";
  return `${PROTECTED_PREFIX}${canonical}${separator}v=${CATALOGUE_ASSET_VERSION}`;
}