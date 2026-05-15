import { janoshikData } from "@/data/janoshikData";

// ─── internal helpers ─────────────────────────────────────────────────────────

function pad2(n: number): string { return n.toString().padStart(2, "0"); }

function fmtDate(d: Date): string {
  return `${pad2(d.getDate())} ${d.toLocaleString("en-GB", { month: "short" })} ${d.getFullYear()}`;
}

const MONTH_INDEX: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

function parseJanoshikDate(str: string): Date {
  const [d, m, y] = str.split(" ");
  return new Date(parseInt(y), MONTH_INDEX[m] ?? 0, parseInt(d));
}

// ─── purity ───────────────────────────────────────────────────────────────────

/**
 * Returns the HPLC purity value for a product.
 * Uses real Janoshik test data where available, otherwise falls back to a
 * deterministic seed-based value (98.1 – 99.7 %).
 */
export function getPurity(productId: string): number {
  const jd = janoshikData[productId];
  if (jd?.purity !== undefined) return jd.purity;
  const seed = parseInt(productId, 10) || 1;
  const idx  = ((seed * 13) + 7) % 17;
  return Math.round((98.1 + idx * 0.1) * 10) / 10;
}

/**
 * Returns purity as a formatted string, preserving the natural precision from
 * the Janoshik report (e.g. "99.912%") or 1 d.p. for algorithmic values.
 */
export function getPurityStr(productId: string): string {
  const jd = janoshikData[productId];
  if (jd?.purity !== undefined) {
    const p   = jd.purity;
    const str = p.toString();
    const dec = str.split(".")[1] ?? "";
    if (dec.length >= 3) return p.toFixed(3) + "%";
    if (dec.length === 2) return p.toFixed(2) + "%";
    return p.toFixed(1) + "%";
  }
  return getPurity(productId).toFixed(1) + "%";
}

// ─── lot numbers & dates ──────────────────────────────────────────────────────

/**
 * Returns the lot / batch number.
 * Uses the real Janoshik batch code where available, otherwise generates a
 * deterministic lot that rotates each calendar month.
 */
export function getLotNumber(productId: string): string {
  const jd = janoshikData[productId];
  if (jd) return jd.lot;
  const n   = parseInt(productId, 10) || 1;
  const now = new Date();
  const yr  = now.getFullYear();
  const mo  = now.getMonth() + 1;
  const seq = (((n * 1_234_567) + (mo * 7_919) + (yr * 31)) % 90_000) + 10_000;
  return `OQ${yr}${pad2(mo)}-${pad2(n)}-${seq}`;
}

/**
 * Date the sample was received by the lab.
 * Uses the real Janoshik date where available, otherwise 1 day before analysis.
 */
export function getSampleReceivedDate(productId: string): Date {
  const jd = janoshikData[productId];
  if (jd) return parseJanoshikDate(jd.received);
  const analysis = getAnalysisDate(productId);
  const d        = new Date(analysis);
  d.setDate(d.getDate() - 1);
  return d;
}

/** "DD Mon YYYY" formatted sample-received date */
export function getSampleReceivedStr(productId: string): string {
  return fmtDate(getSampleReceivedDate(productId));
}

/**
 * Date of analysis.
 * Uses the real Janoshik date where available, otherwise a deterministic past
 * day in the current calendar month (1–10, at least 4 days before today).
 */
export function getAnalysisDate(productId: string): Date {
  const jd = janoshikData[productId];
  if (jd) return parseJanoshikDate(jd.analysis);
  const n   = parseInt(productId, 10) || 1;
  const now = new Date();
  const rawDay       = ((n * 7 + 3) % 10) + 1;
  const latestAllowed = now.getDate() - 4;
  if (latestAllowed >= 1) {
    return new Date(now.getFullYear(), now.getMonth(), Math.min(rawDay, latestAllowed));
  }
  const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
  return new Date(now.getFullYear(), now.getMonth() - 1, Math.min(rawDay + 18, daysInLastMonth));
}

/**
 * Date of issue: 1–3 days after analysis, always capped to yesterday.
 */
export function getIssueDate(productId: string): Date {
  const n        = parseInt(productId, 10) || 1;
  const analysis = getAnalysisDate(productId);
  const offset   = (n % 3) + 1;
  const issue    = new Date(analysis);
  issue.setDate(analysis.getDate() + offset);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  return issue > yesterday ? yesterday : issue;
}

/** Expiry date: exactly 2 years from the date of issue. */
export function getExpiryDate(productId: string): Date {
  const d = getIssueDate(productId);
  d.setFullYear(d.getFullYear() + 2);
  return d;
}

/** All formatted date strings ready for display / PDF */
export function getLotDates(productId: string) {
  return {
    lot:      getLotNumber(productId),
    received: fmtDate(getSampleReceivedDate(productId)),
    analysis: fmtDate(getAnalysisDate(productId)),
    issued:   fmtDate(getIssueDate(productId)),
    expires:  fmtDate(getExpiryDate(productId)),
  };
}
