export type PopularEntry = {
  id: string;
};

export const popularProductIds: PopularEntry[] = [
  { id: "3" },
  { id: "4" },
  { id: "71" },
  { id: "72" },
  { id: "7" },
  { id: "15" },
  { id: "17" },
  { id: "43" },
  { id: "44" },
  { id: "31" },
  { id: "32" },
  { id: "11" },
  { id: "19" },
  { id: "20" },
  { id: "64" },
  { id: "62" },
  { id: "56" },
  { id: "76" },
  { id: "66" },
  { id: "65" },
  { id: "49" },
  { id: "75" },
  { id: "30" },
  { id: "54" },
  { id: "38" },
  { id: "81" },
  { id: "1" },
  { id: "48" },
];

// "SELLING FAST" — consistently highest-volume compounds
export const sellingFastIds = new Set([
  "3",  // BPC-157 5mg
  "7",  // BPC-157 + TB-500 Blend 10mg
  "71", // TB-500 5mg
  "31", // Ipamorelin 5mg
  "76", // Tirzepatide 10mg
  "85", // CJC-1295 No DAC + Ipamorelin 5mg
]);

// "HOT BUY" — trending / high research interest / strong value
export const hotBuyIds = new Set([
  "56", // Retatrutide 10mg — newest triple agonist
  "15", // Epithalon 10mg — longevity research
  "43", // MOTS-C 10mg — mitochondrial health
  "83", // 5-Amino-1Q 50mg — NAD+ research
  "66", // SS-31 10mg — mitochondria-targeted
  "48", // N-Acetyl Semax Amidate 10mg — nootropic
  "17", // GHK-Cu 50mg — skin & repair research
  "9",  // Cagrilintide 5mg — emerging metabolic compound
]);
