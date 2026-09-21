/**
 * Real Janoshik test results for OmniQure products.
 * Each entry keyed by DB product ID maps to the most recent verified test.
 *
 * Fields
 *  purity     – verified purity %, e.g. 99.892 (undefined for blend/mass-only products)
 *  actualMass – mass found by the lab in mg
 *  lot        – batch identifier shown with the report
 *  received   – "DD Mon YYYY" sample-received date
 *  analysis   – "DD Mon YYYY" analysis-conducted date
 *  taskNumber – Janoshik task number (links to verify.janoshik.com)
 *  verifyKey  – unique key appended to the verify URL
 */

export interface JanoshikResult {
  purity?: number;
  actualMass: number;
  lot: string;
  received: string;
  analysis: string;
  taskNumber?: string;
  verifyKey?: string;
  /** Full Janoshik verification URL */
  verifyUrl?: string;
  /** Path to the report image served from /janoshik/<taskNumber>.png */
  image?: string;
  /** Downloadable certificate PDF served from /janoshik/<taskNumber>.pdf */
  certificatePdf?: string;
}

export const janoshikData: Record<string, JanoshikResult> = {
  // ── AOD-9604 ──────────────────────────────────────────────────────────────
  "1":  { purity: 99.714, actualMass:  5.21, lot: "A05-0513",          received: "03 Jun 2026", analysis: "04 Jun 2026" },
  "2":  { purity: 99.714, actualMass:  5.21, lot: "A05-0513",          received: "03 Jun 2026", analysis: "04 Jun 2026" },

  // ── BPC-157 ───────────────────────────────────────────────────────────────
  "3":  { purity: 99.804, actualMass:  6.01, lot: "BP05-0326",         received: "12 Apr 2026", analysis: "13 Apr 2026" },
  "4":  { purity: 99.892, actualMass: 11.95, lot: "BP1070Q",           received: "22 Jun 2026", analysis: "29 Jun 2026", taskNumber: "208600", verifyKey: "DSDYDF1TRWRC", verifyUrl: "https://verify.janoshik.com/tests/208600-BPC157_10mg_OmniQure_DSDYDF1TRWRC", image: "/janoshik/208600.png" },
  "5":  { purity: 99.203, actualMass: 23.01, lot: "BP20-0418",         received: "03 May 2026", analysis: "04 May 2026" },
  "6":  { purity: 99.827, actualMass: 46.46, lot: "BP40-0605",         received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── BPC-157 + TB-500 Blend ────────────────────────────────────────────────
  "7":  { actualMass: 23.44, lot: "BPTB040Q",              received: "03 Jul 2026", analysis: "13 Jul 2026", taskNumber: "208601", verifyKey: "3N3R5JF1157F", verifyUrl: "https://verify.janoshik.com/tests/208601-BPC157_TB500_TB4_Blend_1010_OmniQure_3N3R5JF1157F", image: "/janoshik/208601.png" },
  "8":  { actualMass: 23.44, lot: "BPTB040Q",              received: "03 Jul 2026", analysis: "13 Jul 2026", taskNumber: "208601", verifyKey: "3N3R5JF1157F", verifyUrl: "https://verify.janoshik.com/tests/208601-BPC157_TB500_TB4_Blend_1010_OmniQure_3N3R5JF1157F", image: "/janoshik/208601.png" },

  // ── Cagrilintide ──────────────────────────────────────────────────────────
  "9":  { purity: 99.907, actualMass:  5.59, lot: "CAG5-0328",         received: "12 Apr 2026", analysis: "13 Apr 2026" },
  "10": { purity: 99.952, actualMass: 10.05, lot: "OQCAG10",           received: "17 Jul 2026", analysis: "24 Jul 2026", taskNumber: "200664", verifyKey: "XHPSD9IE65XR", verifyUrl: "https://verify.janoshik.com/tests/200664-Cag_10_XHPSD9IE65XR", image: "/janoshik/200664.png" },

  // ── CJC-1295 No DAC ───────────────────────────────────────────────────────
  "11": { purity: 98.882, actualMass:  6.08, lot: "CJD5-0320",         received: "08 Apr 2026", analysis: "09 Apr 2026" },
  "12": { purity: 99.880, actualMass: 10.54, lot: "CJND10-0523",       received: "07 Jun 2026", analysis: "08 Jun 2026" },

  // ── DSIP ──────────────────────────────────────────────────────────────────
  "13": { purity: 99.657, actualMass:  6.12, lot: "DS5-0607",          received: "30 Jun 2026", analysis: "01 Jul 2026" },
  "14": { purity: 99.633, actualMass: 12.25, lot: "DS10-0526",         received: "14 Jun 2026", analysis: "15 Jun 2026" },

  // ── Epithalon ─────────────────────────────────────────────────────────────
  "15": { purity: 98.828, actualMass: 11.01, lot: "EP10-0602",         received: "21 Jun 2026", analysis: "22 Jun 2026" },
  "16": { purity: 99.492, actualMass: 64.46, lot: "EP50-0516",         received: "04 Jun 2026", analysis: "05 Jun 2026" },

  // ── GHK-Cu ────────────────────────────────────────────────────────────────
  "17": { purity: 99.714, actualMass:  55.81, lot: "HK50-0505",        received: "25 May 2026", analysis: "26 May 2026" },
  "18": { purity: 99.912, actualMass: 108.95, lot: "GH48730Q",         received: "22 Jun 2026", analysis: "30 Jun 2026", taskNumber: "208608", verifyKey: "PYKSNGJUCS1Y", verifyUrl: "https://verify.janoshik.com/tests/208608-GHKCU_100mg_OmniQure_PYKSNGJUCS1Y", image: "/janoshik/208608.png" },

  // ── GHRP-2 ────────────────────────────────────────────────────────────────
  "19": { purity: 99.216, actualMass:  5.59, lot: "G205-0406",         received: "22 Apr 2026", analysis: "23 Apr 2026" },
  "20": { purity: 99.216, actualMass: 11.16, lot: "G210-0406",         received: "22 Apr 2026", analysis: "23 Apr 2026" },

  // ── GHRP-6 ────────────────────────────────────────────────────────────────
  "21": { purity: 99.521, actualMass:  5.25, lot: "G605-0406",         received: "23 Apr 2026", analysis: "24 Apr 2026" },

  // ── GLOW BLEND ────────────────────────────────────────────────────────────
  "22": { actualMass: 86.25, lot: "GLO70-0531",             received: "15 Jun 2026", analysis: "16 Jun 2026" },

  // ── IGF-1 LR3 ─────────────────────────────────────────────────────────────
  "30": { purity: 98.021, actualMass:  1.20, lot: "IG1-0408",          received: "22 Apr 2026", analysis: "23 Apr 2026" },

  // ── Ipamorelin ────────────────────────────────────────────────────────────
  "32": { purity: 99.892, actualMass: 11.98, lot: "IP10-0611",         received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── KPV ───────────────────────────────────────────────────────────────────
  "31": { purity: 99.484, actualMass: 12.39, lot: "KP4850Q",           received: "15 Jun 2026", analysis: "01 Jul 2026", taskNumber: "208604", verifyKey: "LYIZTLMNR54K", verifyUrl: "https://verify.janoshik.com/tests/208604-KPV_10mg_OmniQure_LYIZTLMNR54K", image: "/janoshik/208604.png" },

  // ── Melanotan 2 10mg ──────────────────────────────────────────────────────
  "34": { purity: 99.887, actualMass: 11.12, lot: "MT28470Q",          received: "03 Jul 2026", analysis: "13 Jul 2026", taskNumber: "208605", verifyKey: "CUHNDPBS5IUD", verifyUrl: "https://verify.janoshik.com/tests/208605-Melanotan_2_10mg_OmniQure_CUHNDPBS5IUD", image: "/janoshik/208605.png" },

  // ── KLOW BLEND ────────────────────────────────────────────────────────────
  "35": { actualMass: 90.35, lot: "KL080-0611",             received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── KPV ───────────────────────────────────────────────────────────────────
  "37": { purity: 99.484, actualMass: 12.39, lot: "KP10-0607",         received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── LL-37 ─────────────────────────────────────────────────────────────────
  "38": { purity: 99.600, actualMass:  5.42, lot: "LL5-0612",          received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── Melanotan 1 ───────────────────────────────────────────────────────────
  "39": { purity: 99.813, actualMass: 10.52, lot: "MT110-0526",        received: "14 Jun 2026", analysis: "15 Jun 2026" },

  // ── Melanotan 2 ───────────────────────────────────────────────────────────
  "40": { purity: 99.575, actualMass: 11.08, lot: "MT210-0524",        received: "14 Jun 2026", analysis: "15 Jun 2026" },
  "41": { purity: 99.575, actualMass: 11.08, lot: "MT210-0524B",       received: "14 Jun 2026", analysis: "15 Jun 2026" },
  "42": { purity: 99.575, actualMass: 11.08, lot: "MT210-0524C",       received: "14 Jun 2026", analysis: "15 Jun 2026" },

  // ── MOTS-C ────────────────────────────────────────────────────────────────
  "43": { purity: 98.969, actualMass: 11.22, lot: "M010-0602",         received: "21 Jun 2026", analysis: "22 Jun 2026" },
  "44": { purity: 99.143, actualMass: 23.37, lot: "M020-0614",         received: "30 Jun 2026", analysis: "01 Jul 2026" },
  "45": { purity: 99.224, actualMass: 48.71, lot: "M040-0612",         received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── N-Acetyl Epithalon Amidate ────────────────────────────────────────────
  "46": { purity: 99.464, actualMass:  5.52, lot: "EP05-0324",         received: "09 Apr 2026", analysis: "10 Apr 2026" },

  // ── N-Acetyl Selank Amidate ───────────────────────────────────────────────
  "47": { purity: 99.511, actualMass: 11.94, lot: "NASK10-0604",       received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── N-Acetyl Semax Amidate ────────────────────────────────────────────────
  "48": { purity: 98.875, actualMass: 11.72, lot: "NASX10-0528",       received: "15 Jun 2026", analysis: "16 Jun 2026" },

  // ── NAD+ ──────────────────────────────────────────────────────────────────
  "49": { actualMass: 512.17, lot: "NA500-0616",            received: "09 Jul 2026", analysis: "10 Jul 2026" },

  // ── P21 ───────────────────────────────────────────────────────────────────
  "52": { purity: 99.003, actualMass: 12.50, lot: "P210-0508",         received: "27 May 2026", analysis: "28 May 2026" },

  // ── Selank 10mg ───────────────────────────────────────────────────────────
  "53": { purity: 99.161, actualMass: 10.55, lot: "SK8470Q",           received: "03 Jul 2026", analysis: "13 Jul 2026", taskNumber: "208610", verifyKey: "FSSTD9WMADJH", verifyUrl: "https://verify.janoshik.com/tests/208610-Selank_10mg_OmniQure_FSSTD9WMADJH", image: "/janoshik/208610.png" },

  // ── Semax 10mg ────────────────────────────────────────────────────────────
  "55": { purity: 99.138, actualMass: 11.32, lot: "SX8470Q",           received: "03 Jul 2026", analysis: "13 Jul 2026", taskNumber: "208609", verifyKey: "I42F8EHHKVHG", verifyUrl: "https://verify.janoshik.com/tests/208609-Semax_10mg_OmniQure_I42F8EHHKVHG", image: "/janoshik/208609.png" },

  // ── Retatrutide ───────────────────────────────────────────────────────────
  "56": { purity: 99.729, actualMass: 12.33, lot: "RE10-0608",         received: "30 Jun 2026", analysis: "01 Jul 2026" },
  "57": { purity: 99.704, actualMass: 24.25, lot: "RE20-0613",         received: "01 Jul 2026", analysis: "02 Jul 2026" },
  "58": { purity: 99.787, actualMass: 34.23, lot: "RE30-0610",         received: "30 Jun 2026", analysis: "01 Jul 2026" },
  "59": { purity: 99.714, actualMass: 50.93, lot: "RT40PQ",            received: "22 Jul 2026", analysis: "25 Jul 2026", taskNumber: "203231", verifyKey: "XY2IAQ58G5EY", verifyUrl: "https://verify.janoshik.com/tests/203231-Retatrutide_40mg_XY2IAQ58G5EY", image: "/janoshik/203231.png" },
  "60": { purity: 99.822, actualMass: 54.93, lot: "RE50-0323",         received: "09 Apr 2026", analysis: "10 Apr 2026" },
  "61": { purity: 99.852, actualMass: 66.53, lot: "RE60-0327",         received: "12 Apr 2026", analysis: "13 Apr 2026" },

  // ── TB-500 10mg ───────────────────────────────────────────────────────────
  "62": { purity: 99.119, actualMass: 11.77, lot: "TB48780Q",          received: "15 Jun 2026", analysis: "01 Jul 2026", taskNumber: "208613", verifyKey: "A9RR18DUH522", verifyUrl: "https://verify.janoshik.com/tests/208613-TB500_TB4_10mg_OmniQure_A9RR18DUH522", image: "/janoshik/208613.png" },

  // ── Semax ─────────────────────────────────────────────────────────────────
  "64": { purity: 99.020, actualMass: 11.92, lot: "SX10-0526",         received: "14 Jun 2026", analysis: "15 Jun 2026" },

  // ── Sermorelin ────────────────────────────────────────────────────────────
  "65": { purity: 98.775, actualMass:  5.39, lot: "SR5-0530",          received: "15 Jun 2026", analysis: "16 Jun 2026" },

  // ── SS-31 (Elamipretide) ──────────────────────────────────────────────────
  "66": { purity: 99.832, actualMass: 10.73, lot: "SS10-0524",         received: "14 Jun 2026", analysis: "15 Jun 2026" },
  "67": { purity: 99.830, actualMass: 31.89, lot: "SS30-0509",         received: "27 May 2026", analysis: "28 May 2026" },
  "68": { purity: 99.786, actualMass: 51.89, lot: "SS50-0605",         received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── TB-500 ────────────────────────────────────────────────────────────────
  "71": { purity: 99.766, actualMass:  5.98, lot: "TB405-0404",        received: "22 Apr 2026", analysis: "23 Apr 2026" },
  "73": { purity: 99.312, actualMass: 22.67, lot: "TB20-0605",         received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── Tesamorelin 20mg ──────────────────────────────────────────────────────
  "72": { purity: 99.358, actualMass: 23.57, lot: "TS3450Q",           received: "15 Jun 2026", analysis: "01 Jul 2026", taskNumber: "208612", verifyKey: "NJDR19MRS3WC", verifyUrl: "https://verify.janoshik.com/tests/208612-Tesamorelin_20mh_OmniQure_NJDR19MRS3WC", image: "/janoshik/208612.png" },

  // ── CJC-1295 No DAC + Ipamorelin Blend ───────────────────────────────────
  "74": { actualMass: 23.21, lot: "CJIPA0450Q",             received: "24 Jun 2026", analysis: "01 Jul 2026", taskNumber: "208602", verifyKey: "UM1G6NTFHJCB", verifyUrl: "https://verify.janoshik.com/tests/208602-CJC1295_No_DAC_Ipamorelin_Blend_1010_OmniQure_UM1G6NTFHJCB", image: "/janoshik/208602.png" },

  // ── Thymosin Alpha-1 ──────────────────────────────────────────────────────
  "75": { purity: 99.839, actualMass: 12.11, lot: "TA110-0522",        received: "14 Jun 2026", analysis: "15 Jun 2026" },

  // ── Tirzepatide ───────────────────────────────────────────────────────────
  "76": { purity: 99.707, actualMass: 12.35, lot: "ZE10-0530",         received: "21 Jun 2026", analysis: "22 Jun 2026" },
  "77": { purity: 99.836, actualMass: 17.82, lot: "ZE15-0612",         received: "01 Jul 2026", analysis: "02 Jul 2026" },
  "78": { purity: 99.924, actualMass: 37.99, lot: "TZ9390Q",           received: "24 Jun 2026", analysis: "02 Jul 2026", taskNumber: "208603", verifyKey: "V3ZBG39CVZPW", verifyUrl: "https://verify.janoshik.com/tests/208603-Tirzepatide_30mg_V3ZBG39CVZPW", image: "/janoshik/208603.png" },
  "79": { purity: 99.924, actualMass: 37.99, lot: "ZE30-0611",         received: "01 Jul 2026", analysis: "02 Jul 2026" },
  "80": { purity: 99.765, actualMass: 67.59, lot: "ZE60-0528",         received: "16 Jun 2026", analysis: "17 Jun 2026" },

  // ── VIP ───────────────────────────────────────────────────────────────────
  "81": { purity: 99.138, actualMass: 11.52, lot: "VIP10-0513",        received: "01 Jun 2026", analysis: "02 Jun 2026" },

  // ── Tesamorelin ───────────────────────────────────────────────────────────
  "82": { purity: 99.358, actualMass: 23.57, lot: "TE20-0606",         received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── 5-Amino-1Q ────────────────────────────────────────────────────────────
  "83": { purity: 99.287, actualMass: 53.21, lot: "AQ50-0508",         received: "07 May 2026", analysis: "08 May 2026" },

  // ── ARA-290 ───────────────────────────────────────────────────────────────
  "84": { purity: 99.342, actualMass: 19.75, lot: "ARA16-0613",        received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── CJC-1295 No DAC + Ipamorelin Blend ───────────────────────────────────
  "85": { actualMass: 22.85, lot: "C/I1010-0613",           received: "30 Jun 2026", analysis: "01 Jul 2026" },

  // ── Newly published September 2026 reports ───────────────────────────────
  "report-234989": { purity: 99.851, actualMass: 10.94, lot: "KIS090Q", received: "15 Sep 2026", analysis: "15 Sep 2026", taskNumber: "234989", verifyKey: "IIBBDYNKAP1Z", verifyUrl: "https://verify.janoshik.com/tests/234989-Kisspeptin_10mg_OmniQure_IIBBDYNKAP1Z", image: "/janoshik/234989.png", certificatePdf: "/janoshik/234989.pdf" },
  "report-234990": { actualMass: 993.81, lot: "NDO90Q", received: "15 Sep 2026", analysis: "15 Sep 2026", taskNumber: "234990", verifyKey: "52TERHWRSPJZ", verifyUrl: "https://verify.janoshik.com/tests/234990-NAD_1000mg_OmniQure_52TERHWRSPJZ", image: "/janoshik/234990.png", certificatePdf: "/janoshik/234990.pdf" },
  "report-234991": { actualMass: 96.33, lot: "KLO90Q", received: "15 Sep 2026", analysis: "15 Sep 2026", taskNumber: "234991", verifyKey: "PZ1MU4KS2U4J", verifyUrl: "https://verify.janoshik.com/tests/234991-KLOW_OmniQure_PZ1MU4KS2U4J", image: "/janoshik/234991.png", certificatePdf: "/janoshik/234991.pdf" },
  "report-234992": { purity: 99.700, actualMass: 12.00, lot: "TA090Q", received: "15 Sep 2026", analysis: "15 Sep 2026", taskNumber: "234992", verifyKey: "B4Y47TDR6YCG", verifyUrl: "https://verify.janoshik.com/tests/234992-Thymosin_Alpha1_10mg_OmniQure_B4Y47TDR6YCG", image: "/janoshik/234992.png", certificatePdf: "/janoshik/234992.pdf" },
  "report-234993": { purity: 99.221, actualMass: 11.08, lot: "MT090Q", received: "15 Sep 2026", analysis: "15 Sep 2026", taskNumber: "234993", verifyKey: "2KFAVDKNHLKG", verifyUrl: "https://verify.janoshik.com/tests/234993-MOTSC_10mg_OmniQure_2KFAVDKNHLKG", image: "/janoshik/234993.png", certificatePdf: "/janoshik/234993.pdf" },
  "report-235090": { purity: 99.798, actualMass: 10.32, lot: "MT1090Q", received: "15 Sep 2026", analysis: "15 Sep 2026", taskNumber: "235090", verifyKey: "AUEJK7GU6QXH", verifyUrl: "https://verify.janoshik.com/tests/235090-Melanotan_1_10mg_OmniQure_AUEJK7GU6QXH", image: "/janoshik/235090.png", certificatePdf: "/janoshik/235090.pdf" },
};

/**
 * Published report lookup for storefront products.
 *
 * Product IDs are not stable across catalogue imports, so product-page
 * verification must be matched by slug. Only entries with a real task number,
 * verification URL, and report image are included here.
 */
export const janoshikDataBySlug: Record<string, JanoshikResult> = {
  "bpc-157-10mg": janoshikData["4"],
  "tb-500-10mg": janoshikData["62"],
  "tesamorelin-20mg": janoshikData["72"],
  "semax-10mg": janoshikData["55"],
  "selank-10mg": janoshikData["53"],
  "ghk-cu-100mg": janoshikData["18"],
  "melanotan-2-10mg": janoshikData["34"],
  "kpv-10mg": janoshikData["31"],
  "cjc-1295-no-dac-ipamorelin-5mg": janoshikData["74"],
  "bpc-157-tb-500-blend-10mg": janoshikData["7"],
  "bpc-157-tb-500-blend-20mg": janoshikData["7"],
  "tirzepatide-30mg": janoshikData["78"],
  "cagrilintide-10mg": janoshikData["10"],
  "retatrutide-40mg": janoshikData["59"],
  "kisspeptin-10-10mg": janoshikData["report-234989"],
  "nad-plus-1000mg": janoshikData["report-234990"],
  "klow-blend-80mg": janoshikData["report-234991"],
  "thymosin-alpha-1-10mg": janoshikData["report-234992"],
  "mots-c-10mg": janoshikData["report-234993"],
  "melanotan-1-10mg": janoshikData["report-235090"],
};
