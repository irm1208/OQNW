const PROTECTED_PREFIX = "/api/catalogue-assets";

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
  return canonical ? `${PROTECTED_PREFIX}${canonical}` : canonical;
}