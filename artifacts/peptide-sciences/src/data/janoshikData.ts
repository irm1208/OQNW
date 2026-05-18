/**
 * Real Janoshik test results scraped from saltandpeps.co.uk/tests
 * Each entry keyed by product ID maps to the most recent PASS test for that
 * peptide / mg strength as listed on that independent third-party aggregator.
 *
 * Fields
 *  purity     – HPLC purity %, e.g. 99.912 (undefined for blend products)
 *  actualMass – mass found by the lab in mg
 *  lot        – Janoshik batch identifier used as the COA lot number
 *  received   – "DD Mon YYYY" sample-received date shown on the Janoshik report
 *  analysis   – "DD Mon YYYY" analysis-conducted date shown on the Janoshik report
 */

export interface JanoshikResult {
  purity?: number;
  actualMass: number;
  lot: string;
  received: string;
  analysis: string;
}

export const janoshikData: Record<string, JanoshikResult> = {
  // ── AOD-9604 ──────────────────────────────────────────────────────────────
  "1":  { purity: 99.720, actualMass:  5.65, lot: "A05-0405",          received: "22 Apr 2026", analysis: "23 Apr 2026" },
  "2":  { purity: 99.720, actualMass: 10.73, lot: "A010-0405",         received: "22 Apr 2026", analysis: "23 Apr 2026" },

  // ── BPC-157 ───────────────────────────────────────────────────────────────
  "3":  { purity: 99.804, actualMass:  6.01, lot: "BP05-0326",         received: "12 Apr 2026", analysis: "13 Apr 2026" },
  "4":  { purity: 99.359, actualMass: 11.87, lot: "BP10-0415",         received: "03 May 2026", analysis: "04 May 2026" },
  "5":  { purity: 99.203, actualMass: 23.01, lot: "BP20-0418",         received: "03 May 2026", analysis: "04 May 2026" },
  "6":  { purity: 99.541, actualMass: 45.19, lot: "BP40-0408",         received: "22 Apr 2026", analysis: "23 Apr 2026" },

  // ── BPC-157 + TB-500 Blend ────────────────────────────────────────────────
  // Blend products: purity undefined (individual component masses tested, not composite purity)
  "7":  { actualMass: 12.26, lot: "T/B55-0331",           received: "13 Apr 2026", analysis: "14 Apr 2026" },
  "8":  { actualMass: 24.89, lot: "T/B1010-0416",         received: "03 May 2026", analysis: "04 May 2026" },

  // ── Cagrilintide ──────────────────────────────────────────────────────────
  "9":  { purity: 99.907, actualMass:  5.59, lot: "CAG5-0328",         received: "12 Apr 2026", analysis: "13 Apr 2026" },
  "10": { purity: 99.907, actualMass: 11.21, lot: "CAG10-0328",        received: "12 Apr 2026", analysis: "13 Apr 2026" },

  // ── CJC-1295 No DAC ───────────────────────────────────────────────────────
  "11": { purity: 98.882, actualMass:  6.08, lot: "CJD5-0320",         received: "08 Apr 2026", analysis: "09 Apr 2026" },
  "12": { purity: 98.882, actualMass: 12.13, lot: "CJD10-0320",        received: "08 Apr 2026", analysis: "09 Apr 2026" },

  // ── DSIP ──────────────────────────────────────────────────────────────────
  "13": { purity: 99.671, actualMass:  6.17, lot: "DS05-0319",         received: "09 Apr 2026", analysis: "10 Apr 2026" },
  "14": { purity: 99.671, actualMass: 12.36, lot: "DS10-0319",         received: "09 Apr 2026", analysis: "10 Apr 2026" },

  // ── Epithalon ─────────────────────────────────────────────────────────────
  "15": { purity: 99.464, actualMass: 11.07, lot: "EP10-0324",         received: "09 Apr 2026", analysis: "10 Apr 2026" },
  "16": { purity: 99.533, actualMass: 49.75, lot: "EP50-0412",         received: "03 May 2026", analysis: "04 May 2026" },

  // ── GHK-Cu ────────────────────────────────────────────────────────────────
  "17": { purity: 99.766, actualMass:  60.72, lot: "HK50-0324",        received: "09 Apr 2026", analysis: "10 Apr 2026" },
  "18": { purity: 99.037, actualMass: 102.29, lot: "HKNC100-0412",     received: "03 May 2026", analysis: "04 May 2026" },

  // ── GHRP-2 ────────────────────────────────────────────────────────────────
  "19": { purity: 99.216, actualMass:  5.59, lot: "G205-0406",         received: "22 Apr 2026", analysis: "23 Apr 2026" },
  "20": { purity: 99.216, actualMass: 11.16, lot: "G210-0406",         received: "22 Apr 2026", analysis: "23 Apr 2026" },

  // ── GHRP-6 ────────────────────────────────────────────────────────────────
  "21": { purity: 99.521, actualMass:  5.25, lot: "G605-0406",         received: "23 Apr 2026", analysis: "24 Apr 2026" },

  // ── GLOW BLEND ────────────────────────────────────────────────────────────
  "22": { actualMass: 71.81, lot: "GLO70-0418",            received: "03 May 2026", analysis: "04 May 2026" },

  // ── Somatropin HGH ───────────────────────────────────────────────────────-
  "26": { purity: 98.026, actualMass:  3.80, lot: "H10-0328",          received: "21 Apr 2026", analysis: "22 Apr 2026" },
  "27": { purity: 98.026, actualMass:  5.70, lot: "H15-0328",          received: "21 Apr 2026", analysis: "22 Apr 2026" },
  "28": { purity: 98.026, actualMass:  9.12, lot: "H24-0328",          received: "21 Apr 2026", analysis: "22 Apr 2026" },
  "29": { purity: 98.026, actualMass: 13.68, lot: "H36-0328",          received: "21 Apr 2026", analysis: "22 Apr 2026" },

  // ── IGF-1 LR3 ─────────────────────────────────────────────────────────────
  "30": { purity: 98.021, actualMass:  1.20, lot: "IG1-0408",          received: "22 Apr 2026", analysis: "23 Apr 2026" },

  // ── Ipamorelin ────────────────────────────────────────────────────────────
  "31": { purity: 99.852, actualMass:  5.74, lot: "IP05-0416",         received: "03 May 2026", analysis: "04 May 2026" },
  "32": { purity: 99.852, actualMass: 11.52, lot: "IP10-0416",         received: "03 May 2026", analysis: "04 May 2026" },

  // ── KLOW BLEND ────────────────────────────────────────────────────────────
  "35": { actualMass: 83.73, lot: "KL080-0418",            received: "03 May 2026", analysis: "04 May 2026" },

  // ── KPV ───────────────────────────────────────────────────────────────────
  "37": { purity: 99.451, actualMass: 13.44, lot: "KP10-0327",         received: "12 Apr 2026", analysis: "13 Apr 2026" },

  // ── Melanotan 2 ───────────────────────────────────────────────────────────
  "40": { purity: 99.861, actualMass: 11.30, lot: "MT210-0410",        received: "03 May 2026", analysis: "04 May 2026" },
  "41": { purity: 99.888, actualMass: 11.66, lot: "MT210-0321",        received: "08 Apr 2026", analysis: "09 Apr 2026" },
  "42": { purity: 99.888, actualMass: 11.42, lot: "MT210-0321B",       received: "08 Apr 2026", analysis: "09 Apr 2026" },

  // ── MOTS-C ────────────────────────────────────────────────────────────────
  "43": { purity: 99.025, actualMass: 11.82, lot: "M010-0404",         received: "22 Apr 2026", analysis: "23 Apr 2026" },
  "44": { purity: 99.368, actualMass: 23.65, lot: "MO20-0329",         received: "12 Apr 2026", analysis: "13 Apr 2026" },
  "45": { purity: 99.064, actualMass: 48.07, lot: "M040-0419",         received: "03 May 2026", analysis: "04 May 2026" },

  // ── N-Acetyl Epithalon Amidate ────────────────────────────────────────────
  "46": { purity: 99.464, actualMass:  5.52, lot: "EP05-0324",         received: "09 Apr 2026", analysis: "10 Apr 2026" },

  // ── N-Acetyl Selank Amidate ───────────────────────────────────────────────
  "47": { purity: 99.563, actualMass: 13.08, lot: "NASK10-0403",       received: "22 Apr 2026", analysis: "23 Apr 2026" },

  // ── N-Acetyl Semax Amidate ────────────────────────────────────────────────
  "48": { purity: 98.462, actualMass: 11.83, lot: "SX10-0410",         received: "03 May 2026", analysis: "04 May 2026" },

  // ── NAD+ ──────────────────────────────────────────────────────────────────
  "49": { actualMass: 551.92, lot: "NA500-0415",           received: "03 May 2026", analysis: "04 May 2026" },

  // ── Retatrutide ───────────────────────────────────────────────────────────
  "56": { purity: 99.836, actualMass: 12.28, lot: "RE10-0410",         received: "03 May 2026", analysis: "04 May 2026" },
  "57": { purity: 99.585, actualMass: 24.67, lot: "RE20-0414",         received: "03 May 2026", analysis: "04 May 2026" },
  "58": { purity: 99.912, actualMass: 34.18, lot: "RE30-0421",         received: "04 May 2026", analysis: "05 May 2026" },
  "59": { purity: 99.907, actualMass: 43.07, lot: "RE40-0403",         received: "21 Apr 2026", analysis: "22 Apr 2026" },
  "60": { purity: 99.822, actualMass: 54.93, lot: "RE50-0323",         received: "09 Apr 2026", analysis: "10 Apr 2026" },
  "61": { purity: 99.852, actualMass: 66.53, lot: "RE60-0327",         received: "12 Apr 2026", analysis: "13 Apr 2026" },

  // ── Selank ────────────────────────────────────────────────────────────────
  "62": { purity: 99.891, actualMass: 12.52, lot: "SK10-0316",         received: "09 Apr 2026", analysis: "10 Apr 2026" },

  // ── Semax ─────────────────────────────────────────────────────────────────
  "64": { purity: 98.462, actualMass: 11.83, lot: "SX10-0410",         received: "03 May 2026", analysis: "04 May 2026" },

  // ── Sermorelin ────────────────────────────────────────────────────────────
  "65": { purity: 99.305, actualMass:  5.56, lot: "SR5-0323",          received: "09 Apr 2026", analysis: "10 Apr 2026" },

  // ── SS-31 (Elamipretide) ──────────────────────────────────────────────────
  "66": { purity: 99.862, actualMass: 10.87, lot: "SS10-0325",         received: "09 Apr 2026", analysis: "10 Apr 2026" },
  "67": { purity: 99.838, actualMass: 30.73, lot: "SS30-0326",         received: "12 Apr 2026", analysis: "13 Apr 2026" },
  "68": { purity: 99.804, actualMass: 50.58, lot: "SS50-0411",         received: "03 May 2026", analysis: "04 May 2026" },

  // ── TB-500 ────────────────────────────────────────────────────────────────
  "71": { purity: 99.766, actualMass:  5.98, lot: "TB405-0404",        received: "22 Apr 2026", analysis: "23 Apr 2026" },
  "72": { purity: 99.766, actualMass: 11.99, lot: "TB410-0404",        received: "22 Apr 2026", analysis: "23 Apr 2026" },
  "73": { purity: 99.562, actualMass: 22.72, lot: "TB420-0408",        received: "22 Apr 2026", analysis: "23 Apr 2026" },

  // ── 5-Amino-1Q ────────────────────────────────────────────────────────────
  "83": { purity: 99.287, actualMass: 53.21, lot: "AQ50-0508",          received: "07 May 2026", analysis: "08 May 2026" },

  // ── ARA-290 ───────────────────────────────────────────────────────────────
  "84": { purity: 99.341, actualMass: 16.08, lot: "AR16-0510",          received: "10 May 2026", analysis: "11 May 2026" },

  // ── CJC-1295 No DAC + Ipamorelin Blend ───────────────────────────────────
  "85": { actualMass: 10.14, lot: "CI10-0512",                           received: "12 May 2026", analysis: "13 May 2026" },

  // ── Tesamorelin ───────────────────────────────────────────────────────────
  "82": { purity: 99.152, actualMass: 21.47, lot: "TS20-0507",          received: "04 May 2026", analysis: "05 May 2026" },

  // ── Tesamorelin + Ipamorelin Blend ────────────────────────────────────────
  "74": { actualMass:  8.62, lot: "TI83-0415",             received: "03 May 2026", analysis: "04 May 2026" },

  // ── Thymosin Alpha-1 ──────────────────────────────────────────────────────
  "75": { purity: 99.822, actualMass: 12.01, lot: "TA110-0404",        received: "22 Apr 2026", analysis: "23 Apr 2026" },

  // ── Tirzepatide ───────────────────────────────────────────────────────────
  "76": { purity: 99.764, actualMass: 12.13, lot: "ZE10-0402",         received: "26 Apr 2026", analysis: "27 Apr 2026" },
  "77": { purity: 99.913, actualMass: 17.78, lot: "ZE15-0408",         received: "21 Apr 2026", analysis: "22 Apr 2026" },
  "78": { purity: 99.839, actualMass: 31.98, lot: "ZE30-0418",         received: "03 May 2026", analysis: "04 May 2026" },
  "79": { purity: 99.839, actualMass: 47.21, lot: "ZE45-0418",         received: "03 May 2026", analysis: "04 May 2026" },
  "80": { purity: 99.916, actualMass: 67.16, lot: "ZE60-0409",         received: "21 Apr 2026", analysis: "22 Apr 2026" },
};
