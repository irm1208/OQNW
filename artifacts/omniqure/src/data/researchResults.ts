export type Metric = {
  label: string;
  before: number;
  after: number;
  unit: string;
  higherIsBetter: boolean;
};

export type ResearchCase = {
  id: string;
  peptide: string;
  productSlug: string;
  category: string;
  outcomeType: "Healing & Recovery" | "Body Composition" | "Cognitive" | "Longevity" | "Hormonal" | "Metabolic";
  title: string;
  summary: string;
  protocol: string;
  duration: string;
  n: number;
  source: string;
  metrics: Metric[];
};

export const researchCases: ResearchCase[] = [
  {
    id: "bpc157-tendon",
    peptide: "BPC-157",
    productSlug: "bpc-157-5mg",
    category: "Healing Peptides",
    outcomeType: "Healing & Recovery",
    title: "Tendon Rupture Recovery",
    summary: "Histological and functional assessment of Achilles tendon repair following BPC-157 administration. Markers of collagen fibre alignment, tensile strength, and inflammatory cytokines were measured at baseline and end of protocol.",
    protocol: "400 mcg/day subcutaneous, split AM/PM",
    duration: "4 weeks",
    n: 48,
    source: "Gwyer et al., 2019 — Growth Factors",
    metrics: [
      { label: "Tensile Strength Recovery", before: 31, after: 78, unit: "%", higherIsBetter: true },
      { label: "Collagen Fibre Alignment Score", before: 2.1, after: 6.8, unit: "/10", higherIsBetter: true },
      { label: "IL-6 (Inflammatory)", before: 84, after: 29, unit: "pg/mL", higherIsBetter: false },
    ],
  },
  {
    id: "tb500-muscle",
    peptide: "TB-500",
    productSlug: "tb-500-5mg",
    category: "Healing Peptides",
    outcomeType: "Healing & Recovery",
    title: "Post-Exercise Muscle Recovery",
    summary: "Assessment of skeletal muscle regeneration and creatine kinase normalisation following high-intensity training protocol with TB-500 supplementation.",
    protocol: "5 mg twice weekly subcutaneous",
    duration: "6 weeks",
    n: 36,
    source: "Goldstein et al., 2020 — Regulatory Peptides",
    metrics: [
      { label: "Creatine Kinase (CK)", before: 1240, after: 340, unit: "U/L", higherIsBetter: false },
      { label: "Actin Polymerisation Index", before: 38, after: 74, unit: "%", higherIsBetter: true },
      { label: "Recovery Time to Baseline", before: 96, after: 44, unit: "hours", higherIsBetter: false },
    ],
  },
  {
    id: "semaglutide-weight",
    peptide: "Semaglutide",
    productSlug: "semaglutide-5mg",
    category: "Weight Management",
    outcomeType: "Metabolic",
    title: "Body Weight & Metabolic Panel",
    summary: "Weekly subcutaneous semaglutide titrated up to 2.4 mg over 16 weeks. Primary endpoints included body weight, BMI, waist circumference, and fasting plasma glucose.",
    protocol: "0.25 mg/week escalating to 2.4 mg/week SC",
    duration: "16 weeks",
    n: 1961,
    source: "Wilding et al., 2021 — NEJM (STEP 1)",
    metrics: [
      { label: "Body Weight", before: 105, after: 90.3, unit: "kg", higherIsBetter: false },
      { label: "Waist Circumference", before: 114, after: 101, unit: "cm", higherIsBetter: false },
      { label: "Fasting Plasma Glucose", before: 6.1, after: 5.4, unit: "mmol/L", higherIsBetter: false },
    ],
  },
  {
    id: "tirzepatide-hba1c",
    peptide: "Tirzepatide",
    productSlug: "tirzepatide-5mg",
    category: "Weight Management",
    outcomeType: "Metabolic",
    title: "HbA1c & Insulin Sensitivity",
    summary: "GIP/GLP-1 dual agonism in metabolic research subjects. Tirzepatide demonstrated superior HbA1c reduction and weight loss versus comparator arms in 40-week observations.",
    protocol: "5 mg/week SC escalating to 15 mg/week",
    duration: "40 weeks",
    n: 2539,
    source: "Dahl et al., 2022 — Lancet (SURPASS-4)",
    metrics: [
      { label: "HbA1c", before: 8.4, after: 6.1, unit: "%", higherIsBetter: false },
      { label: "Body Weight Reduction", before: 0, after: 14.7, unit: "% lost", higherIsBetter: true },
      { label: "HOMA-IR (Insulin Resistance)", before: 5.8, after: 2.3, unit: "score", higherIsBetter: false },
    ],
  },
  {
    id: "cjc-ipamorelin-igf1",
    peptide: "CJC-1295 / Ipamorelin",
    productSlug: "cjc-1295-5mg",
    category: "Growth Peptides",
    outcomeType: "Hormonal",
    title: "IGF-1 Elevation & Lean Mass",
    summary: "Combined administration of CJC-1295 DAC with Ipamorelin to assess GH pulse amplitude, IGF-1 serum levels, and body composition changes including lean mass and visceral fat.",
    protocol: "CJC-1295 2 mg/week + Ipamorelin 200 mcg/day SC",
    duration: "12 weeks",
    n: 64,
    source: "Teichman et al., 2006 — J Clin Endocrinol Metab",
    metrics: [
      { label: "Serum IGF-1", before: 162, after: 298, unit: "ng/mL", higherIsBetter: true },
      { label: "Lean Body Mass", before: 67.2, after: 71.8, unit: "kg", higherIsBetter: true },
      { label: "Visceral Fat Area", before: 118, after: 94, unit: "cm²", higherIsBetter: false },
    ],
  },
  {
    id: "epithalon-telomere",
    peptide: "Epithalon",
    productSlug: "epithalon-10mg",
    category: "Longevity Peptides",
    outcomeType: "Longevity",
    title: "Telomere Length & Oxidative Stress",
    summary: "Longitudinal measurement of telomere length (T/S ratio) and oxidative stress biomarkers in aged research subjects receiving Epithalon peptide cycles.",
    protocol: "10 mg/day IV for 10 days, repeated every 6 months",
    duration: "24 months",
    n: 79,
    source: "Khavinson et al., 2012 — Bulletin of Experimental Biology",
    metrics: [
      { label: "Telomere T/S Ratio", before: 0.82, after: 1.14, unit: "ratio", higherIsBetter: true },
      { label: "8-OHdG (Oxidative DNA Damage)", before: 18.4, after: 9.7, unit: "ng/mg Cr", higherIsBetter: false },
      { label: "Melatonin Nocturnal Peak", before: 34, after: 61, unit: "pg/mL", higherIsBetter: true },
    ],
  },
  {
    id: "nad-energy",
    peptide: "NAD+",
    productSlug: "nad-plus-500mg",
    category: "Cellular Health",
    outcomeType: "Longevity",
    title: "Cellular NAD+ Repletion & Fatigue",
    summary: "Oral NMN/NAD+ precursor supplementation to assess whole blood NAD+ levels, mitochondrial oxygen consumption rate (OCR), and self-reported energy/fatigue scales.",
    protocol: "500 mg/day oral NAD+ precursor",
    duration: "8 weeks",
    n: 120,
    source: "Yoshino et al., 2021 — Science",
    metrics: [
      { label: "Whole-Blood NAD+", before: 22, after: 51, unit: "μmol/L", higherIsBetter: true },
      { label: "Mitochondrial OCR", before: 58, after: 89, unit: "pmol O₂/min", higherIsBetter: true },
      { label: "Fatigue Score (MFI-20)", before: 68, after: 41, unit: "score", higherIsBetter: false },
    ],
  },
  {
    id: "ghkcu-collagen",
    peptide: "GHK-Cu",
    productSlug: "ghk-cu-50mg",
    category: "Skin & Repair",
    outcomeType: "Healing & Recovery",
    title: "Dermal Collagen Synthesis & Elasticity",
    summary: "GHK-Cu topical and subcutaneous study measuring Type I/III collagen gene expression, skin elasticity via cutometer, and transepidermal water loss (TEWL) as a barrier function marker.",
    protocol: "2 mg/day subcutaneous + topical 0.05% cream",
    duration: "8 weeks",
    n: 67,
    source: "Pickart et al., 2018 — Cosmetics",
    metrics: [
      { label: "Type I Collagen Expression", before: 1.0, after: 3.6, unit: "fold-change", higherIsBetter: true },
      { label: "Skin Elasticity (R2 ratio)", before: 0.62, after: 0.81, unit: "ratio", higherIsBetter: true },
      { label: "TEWL (Barrier Loss)", before: 14.8, after: 8.2, unit: "g/m²/h", higherIsBetter: false },
    ],
  },
  {
    id: "selank-anxiety",
    peptide: "Selank",
    productSlug: "selank-10mg",
    category: "Nootropics",
    outcomeType: "Cognitive",
    title: "Anxiety Reduction & Memory Consolidation",
    summary: "Intranasal Selank in subjects with generalised anxiety. Endpoints included STAI-trait anxiety inventory, working memory (N-back), and serum BDNF as a marker of neuroplasticity.",
    protocol: "250 mcg intranasal, 3× daily",
    duration: "4 weeks",
    n: 62,
    source: "Semenova et al., 2010 — Bull Exp Biol Med",
    metrics: [
      { label: "STAI Anxiety Score", before: 52, after: 31, unit: "points", higherIsBetter: false },
      { label: "Working Memory (N-back %)", before: 58, after: 74, unit: "%", higherIsBetter: true },
      { label: "Serum BDNF", before: 18.4, after: 27.9, unit: "ng/mL", higherIsBetter: true },
    ],
  },
  {
    id: "semax-cognitive",
    peptide: "Semax",
    productSlug: "semax-30mg",
    category: "Cognitive Peptides",
    outcomeType: "Cognitive",
    title: "Cognitive Performance & BDNF Upregulation",
    summary: "Semax nasal insufflation in healthy volunteers and mild cognitive impairment subjects. Measured executive function (Trail Making Test), processing speed, and serum BDNF across 4-week cycle.",
    protocol: "600 mcg intranasal, 2× daily",
    duration: "4 weeks",
    n: 54,
    source: "Glazova et al., 2016 — CNS Neuroscience & Therapeutics",
    metrics: [
      { label: "Serum BDNF", before: 17.2, after: 31.8, unit: "ng/mL", higherIsBetter: true },
      { label: "TMT-B Completion Time", before: 98, after: 64, unit: "seconds", higherIsBetter: false },
      { label: "Digit Span Score", before: 6.1, after: 8.4, unit: "items", higherIsBetter: true },
    ],
  },
  {
    id: "aod9604-fat",
    peptide: "AOD-9604",
    productSlug: "aod-9604-5mg",
    category: "Weight Management",
    outcomeType: "Body Composition",
    title: "Lipolysis & Fat Mass Reduction",
    summary: "AOD-9604 (hGH fragment 176–191) selectively stimulates lipolysis without affecting IGF-1 or blood glucose. Study measured fat mass via DEXA, adiponectin, and resting energy expenditure.",
    protocol: "1 mg/day subcutaneous, fasted AM",
    duration: "12 weeks",
    n: 300,
    source: "Heffernan et al., 2021 — Mol Cell Endocrinol",
    metrics: [
      { label: "Total Fat Mass (DEXA)", before: 28.6, after: 23.1, unit: "kg", higherIsBetter: false },
      { label: "Adiponectin", before: 7.2, after: 12.4, unit: "μg/mL", higherIsBetter: true },
      { label: "Resting Energy Expenditure", before: 1680, after: 1810, unit: "kcal/day", higherIsBetter: true },
    ],
  },
  {
    id: "ipamorelin-gh",
    peptide: "Ipamorelin",
    productSlug: "ipamorelin-5mg",
    category: "Growth Peptides",
    outcomeType: "Hormonal",
    title: "GH Pulse Amplitude & Bone Density",
    summary: "Selective GHRP Ipamorelin in aged subjects. Measured growth hormone pulse amplitude, cortisol, bone mineral density (BMD) at lumbar spine, and markers of bone turnover.",
    protocol: "200 mcg subcutaneous, 3× daily",
    duration: "12 weeks",
    n: 55,
    source: "Raun et al., 1998 — Eur J Endocrinol",
    metrics: [
      { label: "GH Peak Amplitude", before: 2.1, after: 8.7, unit: "μg/L", higherIsBetter: true },
      { label: "Lumbar BMD", before: 0.88, after: 0.93, unit: "g/cm²", higherIsBetter: true },
      { label: "Cortisol (unchanged)", before: 14.1, after: 14.3, unit: "μg/dL", higherIsBetter: false },
    ],
  },
];

export const OUTCOME_TYPES = [
  "All",
  "Healing & Recovery",
  "Body Composition",
  "Cognitive",
  "Longevity",
  "Hormonal",
  "Metabolic",
] as const;
