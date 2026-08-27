import { createHash, createHmac, timingSafeEqual } from "node:crypto";

export type CatalogPrice = {
  slug: string;
  priceGbp: number | null;
};

export type StoredCatalogPrice = {
  slug: string;
  name: string;
  priceGbp: string | null;
};

export type CatalogPriceChange = {
  slug: string;
  name: string;
  productionPriceGbp: number | null;
  cataloguePriceGbp: number | null;
};

export type CatalogPricePreview = {
  sourceCount: number;
  productionCount: number;
  matchedCount: number;
  unchangedCount: number;
  changes: CatalogPriceChange[];
  sourceOnlySlugs: string[];
  productionOnlySlugs: string[];
};

export class CatalogPriceInputError extends Error {}

const MAX_ROWS = 1_000;
const MAX_PRICE_GBP = 99_999_999.99;

function normalizePrice(value: unknown, label: string): number | null {
  if (value === null) return null;
  if (
    typeof value !== "number" ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > MAX_PRICE_GBP ||
    Math.abs(value * 100 - Math.round(value * 100)) > 1e-7
  ) {
    throw new CatalogPriceInputError(`${label} must be null or a non-negative GBP amount with at most two decimal places`);
  }
  return Number(value.toFixed(2));
}

function normalizeSlug(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new CatalogPriceInputError(`${label} must be a non-empty string`);
  }
  return value.trim();
}

function rejectDuplicateSlugs(rows: Array<{ slug: string }>): void {
  const seen = new Set<string>();
  for (const row of rows) {
    if (seen.has(row.slug)) {
      throw new CatalogPriceInputError(`Duplicate slug: ${row.slug}`);
    }
    seen.add(row.slug);
  }
}

export function parseCataloguePrices(value: unknown): CatalogPrice[] {
  if (!Array.isArray(value) || value.length > MAX_ROWS) {
    throw new CatalogPriceInputError(`prices must be an array containing at most ${MAX_ROWS} rows`);
  }
  const rows = value.map((row, index) => {
    if (!row || typeof row !== "object") {
      throw new CatalogPriceInputError(`prices[${index}] must be an object`);
    }
    const candidate = row as Record<string, unknown>;
    return {
      slug: normalizeSlug(candidate.slug, `prices[${index}].slug`),
      priceGbp: normalizePrice(candidate.priceGbp, `prices[${index}].priceGbp`),
    };
  });
  rejectDuplicateSlugs(rows);
  return rows;
}

export function parseApprovedPriceChanges(value: unknown): CatalogPriceChange[] {
  if (!Array.isArray(value) || value.length > MAX_ROWS) {
    throw new CatalogPriceInputError(`changes must be an array containing at most ${MAX_ROWS} rows`);
  }
  const rows = value.map((row, index) => {
    if (!row || typeof row !== "object") {
      throw new CatalogPriceInputError(`changes[${index}] must be an object`);
    }
    const candidate = row as Record<string, unknown>;
    const productionPriceGbp = normalizePrice(
      candidate.productionPriceGbp,
      `changes[${index}].productionPriceGbp`,
    );
    const cataloguePriceGbp = normalizePrice(
      candidate.cataloguePriceGbp,
      `changes[${index}].cataloguePriceGbp`,
    );
    if (productionPriceGbp === cataloguePriceGbp) {
      throw new CatalogPriceInputError(`changes[${index}] does not change the price`);
    }
    return {
      slug: normalizeSlug(candidate.slug, `changes[${index}].slug`),
      name: normalizeSlug(candidate.name, `changes[${index}].name`),
      productionPriceGbp,
      cataloguePriceGbp,
    };
  });
  rejectDuplicateSlugs(rows);
  return rows.sort((a, b) => a.slug.localeCompare(b.slug));
}

function priceSyncDiffDigest(changes: CatalogPriceChange[]): string {
  const canonical = changes
    .map(({ slug, productionPriceGbp, cataloguePriceGbp }) => ({
      slug,
      productionPriceGbp,
      cataloguePriceGbp,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

export function createPriceSyncConfirmationToken(
  changes: CatalogPriceChange[],
  secret: string,
  expiresAt: number,
): string {
  const digest = priceSyncDiffDigest(changes);
  const payload = `catalog-price-sync:${expiresAt}:${digest}`;
  const signature = createHmac("sha256", secret).update(payload).digest("base64url");
  return `${expiresAt}.${digest}.${signature}`;
}

export function verifyPriceSyncConfirmationToken(
  token: unknown,
  changes: CatalogPriceChange[],
  secret: string,
  now = Date.now(),
): boolean {
  if (typeof token !== "string") return false;
  const [expires, digest, signature] = token.split(".");
  if (!/^\d+$/.test(expires) || !/^[a-f0-9]{64}$/.test(digest) || !signature) return false;
  const expiresAt = Number(expires);
  if (!Number.isSafeInteger(expiresAt) || expiresAt < now) return false;
  const expectedDigest = priceSyncDiffDigest(changes);
  if (digest !== expectedDigest) return false;
  const payload = `catalog-price-sync:${expiresAt}:${digest}`;
  const expected = createHmac("sha256", secret).update(payload).digest("base64url");
  return signature.length === expected.length &&
    timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function buildCatalogPricePreview(
  cataloguePrices: CatalogPrice[],
  productionPrices: StoredCatalogPrice[],
): CatalogPricePreview {
  const sourceBySlug = new Map(cataloguePrices.map((row) => [row.slug, row]));
  const productionBySlug = new Map(productionPrices.map((row) => [row.slug, row]));
  const changes: CatalogPriceChange[] = [];
  let matchedCount = 0;
  let unchangedCount = 0;

  for (const source of cataloguePrices) {
    const production = productionBySlug.get(source.slug);
    if (!production) continue;
    matchedCount += 1;
    const productionPriceGbp = production.priceGbp === null ? null : Number(production.priceGbp);
    if (productionPriceGbp === source.priceGbp) {
      unchangedCount += 1;
      continue;
    }
    changes.push({
      slug: source.slug,
      name: production.name,
      productionPriceGbp,
      cataloguePriceGbp: source.priceGbp,
    });
  }

  changes.sort((a, b) => a.slug.localeCompare(b.slug));
  const sourceOnlySlugs = cataloguePrices
    .filter((row) => !productionBySlug.has(row.slug))
    .map((row) => row.slug)
    .sort();
  const productionOnlySlugs = productionPrices
    .filter((row) => !sourceBySlug.has(row.slug))
    .map((row) => row.slug)
    .sort();

  return {
    sourceCount: cataloguePrices.length,
    productionCount: productionPrices.length,
    matchedCount,
    unchangedCount,
    changes,
    sourceOnlySlugs,
    productionOnlySlugs,
  };
}