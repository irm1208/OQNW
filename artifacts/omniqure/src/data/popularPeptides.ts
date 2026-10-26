export type PopularEntry = {
  slug: string;
};

export const popularProductSlugs: PopularEntry[] = [
  { slug: "bpc-157-5mg" },
  { slug: "bpc-157-10mg" },
  { slug: "tb-500-5mg" },
  { slug: "tb-500-10mg" },
  { slug: "bpc-157-tb-500-blend-10mg" },
  { slug: "epithalon-10mg" },
  { slug: "ghk-cu-50mg" },
  { slug: "mots-c-10mg" },
  { slug: "mots-c-20mg" },
  { slug: "ipamorelin-5mg" },
  { slug: "ipamorelin-10mg" },
  { slug: "cjc-1295-no-dac-5mg" },
  { slug: "ghrp-2-5mg" },
  { slug: "ghrp-2-10mg" },
  { slug: "semax-10mg" },
  { slug: "selank-10mg" },
  { slug: "retatrutide-10mg" },
  { slug: "tirzepatide-10mg" },
  { slug: "ss-31-10mg" },
  { slug: "sermorelin-5mg" },
  { slug: "nad-plus-500mg" },
  { slug: "thymosin-alpha-1-10mg" },
  { slug: "igf-1-lr3-1mg" },
  { slug: "peg-mgf-2mg" },
  { slug: "ll-37-5mg" },
  { slug: "vip-10mg" },
  { slug: "aod-9604-5mg" },
  { slug: "n-acetyl-semax-amidate-10mg" },
];

// "SELLING FAST" — consistently highest-volume compounds
export const sellingFastSlugs = new Set([
  "bpc-157-5mg",                     // BPC-157 5mg
  "bpc-157-tb-500-blend-10mg",       // BPC-157 + TB-500 Blend 10mg
  "tb-500-5mg",                      // TB-500 5mg
  "ipamorelin-5mg",                  // Ipamorelin 5mg
  "tirzepatide-10mg",                // Tirzepatide 10mg
  "cjc-1295-no-dac-ipamorelin-5mg",  // CJC-1295 No DAC + Ipamorelin 5mg
]);

// "HOT BUY" — trending / high research interest / strong value
export const hotBuySlugs = new Set([
  "retatrutide-10mg",             // Retatrutide 10mg — newest triple agonist
  "epithalon-10mg",               // Epithalon 10mg — longevity research
  "mots-c-10mg",                  // MOTS-C 10mg — mitochondrial health
  "5-amino-1q-50mg",              // 5-Amino-1MQ 50mg — NAD+ research
  "ss-31-10mg",                   // SS-31 10mg — mitochondria-targeted
  "n-acetyl-semax-amidate-10mg",  // N-Acetyl Semax Amidate 10mg — nootropic
  "ghk-cu-50mg",                  // GHK-Cu 50mg — skin & repair research
  "cagrilintide-5mg",             // Cagrilintide 5mg — emerging metabolic compound
]);
