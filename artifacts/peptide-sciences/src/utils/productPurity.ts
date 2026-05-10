/**
 * Deterministic per-product HPLC purity value (98.1 – 99.7 %).
 * Seeded from productId so the same product always gets the same reading
 * across the product page, HPLC chart, COA tab, and COA PDF.
 */
export function getPurity(productId: string): number {
  const seed = parseInt(productId, 10) || 1;
  // 17 possible values: 98.1, 98.2, … 99.7
  const idx = ((seed * 13) + 7) % 17;
  return Math.round((98.1 + idx * 0.1) * 10) / 10;
}

/** Returns the purity formatted as e.g. "98.7%" */
export function getPurityStr(productId: string): string {
  return getPurity(productId).toFixed(1) + "%";
}
