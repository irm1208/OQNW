// ─── internal helpers ─────────────────────────────────────────────────────────

function pad2(n: number): string { return n.toString().padStart(2, "0"); }

function fmtDate(d: Date): string {
  return `${pad2(d.getDate())} ${d.toLocaleString("en-GB", { month: "short" })} ${d.getFullYear()}`;
}

// ─── purity ───────────────────────────────────────────────────────────────────

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

// ─── lot numbers & dates (rotate every calendar month) ───────────────────────

/**
 * Deterministic lot number per product per calendar month.
 * Format: OQ{YYYY}{MM}-{PP}-{SSSSS}   e.g.  OQ202605-03-45621
 * Automatically changes on the 1st of each month.
 */
export function getLotNumber(productId: string): string {
  const n   = parseInt(productId, 10) || 1;
  const now = new Date();
  const yr  = now.getFullYear();
  const mo  = now.getMonth() + 1;           // 1-based
  const seq = (((n * 1_234_567) + (mo * 7_919) + (yr * 31)) % 90_000) + 10_000;
  return `OQ${yr}${pad2(mo)}-${pad2(n)}-${seq}`;
}

/**
 * Date of analysis: a deterministic day in the current calendar month (1–20).
 * Changes month automatically.
 */
export function getAnalysisDate(productId: string): Date {
  const n   = parseInt(productId, 10) || 1;
  const now = new Date();
  const day = ((n * 7 + 3) % 20) + 1;      // 1–20
  return new Date(now.getFullYear(), now.getMonth(), day);
}

/** Date of issue: 2–5 days after analysis, still within the same month cycle. */
export function getIssueDate(productId: string): Date {
  const n = parseInt(productId, 10) || 1;
  const d = getAnalysisDate(productId);
  d.setDate(d.getDate() + ((n % 4) + 2));   // +2 to +5 days
  return d;
}

/** Expiry date: exactly 2 years from the date of issue. */
export function getExpiryDate(productId: string): Date {
  const d = getIssueDate(productId);
  d.setFullYear(d.getFullYear() + 2);
  return d;
}

/** Formatted strings ready for display / PDF */
export function getLotDates(productId: string) {
  return {
    lot:      getLotNumber(productId),
    analysis: fmtDate(getAnalysisDate(productId)),
    issued:   fmtDate(getIssueDate(productId)),
    expires:  fmtDate(getExpiryDate(productId)),
  };
}
