/**
 * Brand "range" colours — one per product family, used on caps, label stripes
 * and product cards (see the OmniQure brand kit, 03-colour). The product page
 * uses the family colour as its accent so each compound reads as part of a
 * family instead of every page looking identical.
 */
export const RANGE_COLOURS = {
  clay: "#B9836B",
  sage: "#94A895",
  sand: "#CDB894",
  lavender: "#9F96C2",
  rose: "#C9939A",
  tealGrey: "#7FA3A6",
} as const;

export type RangeName = keyof typeof RANGE_COLOURS;

/**
 * Category -> range colour. Mirrors the family mapping in the brand README:
 * repair/immune, metabolic, growth/hormone, cellular/cognitive, blends/research.
 */
const CATEGORY_RANGE: Record<string, RangeName> = {
  "Healing Peptides": "lavender",
  "Immune Support": "lavender",
  "Skin & Repair": "clay",
  "Weight Management": "sage",
  "Growth Peptides": "sand",
  "Growth Hormone": "sand",
  "Hormonal Peptides": "sand",
  "Cellular Health": "tealGrey",
  "Nootropics": "tealGrey",
  "Cognitive Peptides": "tealGrey",
  "Longevity Peptides": "tealGrey",
  "Research Peptides": "rose",
  "Peptide Blends": "rose",
  "Anti-Inflammatory": "rose",
};

export function rangeColourForCategory(category?: string | null): string {
  if (!category) return RANGE_COLOURS.lavender;
  const key = Object.keys(CATEGORY_RANGE).find(
    (name) => name.toLowerCase() === category.toLowerCase(),
  );
  return key ? RANGE_COLOURS[CATEGORY_RANGE[key]] : RANGE_COLOURS.lavender;
}

/** A soft tint of a range colour for backgrounds and highlight rows. */
export function tint(hex: string, alpha = 0.12): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
