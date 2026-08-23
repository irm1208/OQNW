/**
 * Product slugs with a published, verifiable Janoshik report.
 *
 * Keep this list aligned with the product links on the storefront's
 * Lab Reports page. A generated COA or fallback purity value is not a
 * Janoshik report and must not qualify a product for publication.
 */
export const JANOSHIK_REPORTED_PRODUCT_SLUGS = [
  "bpc-157-10mg",
  "tb-500-10mg",
  "tesamorelin-20mg",
  "semax-10mg",
  "selank-10mg",
  "ghk-cu-100mg",
  "melanotan-2-10mg",
  "kpv-10mg",
  "cjc-1295-no-dac-ipamorelin-5mg",
  "bpc-157-tb-500-blend-10mg",
  "bpc-157-tb-500-blend-20mg",
  "tirzepatide-30mg",
  "cagrilintide-10mg",
  "retatrutide-40mg",
] as const;

const janoshikReportedProductSlugs = new Set<string>(JANOSHIK_REPORTED_PRODUCT_SLUGS);

export function hasJanoshikReport(slug: string): boolean {
  return janoshikReportedProductSlugs.has(slug);
}