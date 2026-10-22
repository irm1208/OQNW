import catalogueImageOverrides from "@/data/catalogueImageOverrides.json";
import catalogueVialImageOverrides from "@/data/catalogueVialImageOverrides.json";
import { studioImageForProduct } from "@/lib/studioImage";

type ImageMap = Record<string, string>;

const cardOverrides = catalogueImageOverrides as ImageMap;
const vialOverrides = catalogueVialImageOverrides as ImageMap;
const VIAL_ASSET_VERSION = "2026-10-21-single-vials";

export function versionVialAsset(image?: string): string | undefined {
  if (!image) return undefined;
  if (!/\/products\/studio\//i.test(image)) return image;
  const separator = image.includes("?") ? "&" : "?";
  return `${image}${separator}v=${VIAL_ASSET_VERSION}`;
}

function normalizeSlug(slug: string): string {
  return slug.toLowerCase().replace(/-1q(?=-|$)/g, "-1mq");
}

function baseSlug(slug: string): string {
  const normalized = normalizeSlug(slug);
  return normalized
    .replace(/-(?:\d+(?:\.\d+)?)(?:-plus-\d+(?:\.\d+)?)*(?:mg|mcg|iu)$/i, "")
    .replace(/-blend$/, "");
}

function strengthValue(slug: string): number {
  const normalized = normalizeSlug(slug);
  const match = normalized.match(/-(\d+(?:\.\d+)?)(?:-plus-(\d+(?:\.\d+)?))*?(?:mg|mcg|iu)$/i);
  if (!match) return Number.POSITIVE_INFINITY;
  return Number(match[1]);
}

function findLowestStrengthImage(slug: string, overrides: ImageMap): string | undefined {
  const base = baseSlug(slug);
  return Object.entries(overrides)
    .filter(([candidate]) => baseSlug(candidate) === base)
    .sort(([a], [b]) => strengthValue(a) - strengthValue(b) || a.localeCompare(b))
    .map(([, image]) => image)[0];
}

export function isSquareCatalogueImage(image?: string | null): boolean {
  // Only the supplied square set contains product cards. Reference assets are
  // standalone vial renders and belong in the first gallery slot.
  return !!image && /\/products\/catalogue\//i.test(image);
}

export function getCatalogueCardImage(slug: string, fallback?: string | null): string {
  const direct = cardOverrides[slug];
  if (isSquareCatalogueImage(direct)) return direct;
  const lowest = findLowestStrengthImage(slug, Object.fromEntries(
    Object.entries(cardOverrides).filter(([, image]) => isSquareCatalogueImage(image)),
  ));
  return lowest ?? fallback ?? "";
}

export function getVialImage(slug: string): string | undefined {
  return versionVialAsset(
    vialOverrides[slug]
      ?? findLowestStrengthImage(slug, vialOverrides),
  );
}

/** Resolve the standalone vial render used by grouped catalogue surfaces. */
export function getCatalogueVialImage(
  id: string | number,
  slug: string,
  fallback?: string | null,
  sourceImage?: string | null,
): string {
  const direct = getVialImage(slug);
  if (direct) return direct;

  if (sourceImage) {
    const fromSource = studioImageForProduct(id, sourceImage);
    if (fromSource !== sourceImage) return versionVialAsset(fromSource) ?? fromSource;
  }

  // Legacy catalogue products have numbered studio vial renders.
  if (/^\d+$/.test(String(id))) {
    return `/api/catalogue-assets/products/studio/${id}.webp?v=${VIAL_ASSET_VERSION}`;
  }

  return fallback ?? "";
}
