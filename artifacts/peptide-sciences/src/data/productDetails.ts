export type ProductDetail = {
  id: string;
  description: string;
  sequence?: string;
  molecularWeight?: string;
  casNumber?: string;
  formula?: string;
  purity?: string;
  storage?: string;
  appearance?: string;
  solubility?: string;
  halfLife?: string;
  researchAreas?: string[];
  alsoKnownAs?: string;
};

export const productDetails: Record<string, ProductDetail> = {
  "10": {
    id: "10",
    description: `BPC-157 (Body Protection Compound 157) is a synthetic pentadecapeptide composed of 15 amino acids. It is a partial sequence of body protection compound (BPC) that was discovered in and isolated from human gastric juice. It is stable in human gastric juice, and it has been observed to have a variety of healing properties in clinical research trials. Researchers have studied the peptide for its potential regenerative effects on tendons, muscles, the nervous system, and gastrointestinal tract in preclinical models.`,
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    molecularWeight: "1419.556 g/mol",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    purity: "99% by HPLC",
    storage: "Lyophilized peptide should be stored at -20°C. Upon reconstitution, store at 4°C for short-term (up to 4 weeks) or at -20°C for long-term. Avoid repeated freeze-thaw cycles.",
    appearance: "White powder",
    solubility: "Soluble in sterile water (1 mg/mL)",
    halfLife: "Approximately 4 hours (in vivo)",
    researchAreas: ["Gastrointestinal Research", "Musculoskeletal Research", "Wound Healing", "Neuroprotection"],
    alsoKnownAs: "Body Protection Compound-157, PL-10, PLD-116, Bepecin, Booly"
  },
  "11": {
    id: "11",
    description: `BPC-157 10mg provides a larger quantity of Body Protection Compound 157 for extended research protocols. This synthetic pentadecapeptide demonstrates significant stability in both acidic and alkaline environments, making it an attractive compound for gastrointestinal and systemic research applications in preclinical models.`,
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    molecularWeight: "1419.556 g/mol",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Reconstituted solution: 4°C for up to 4 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    researchAreas: ["Gastrointestinal Research", "Musculoskeletal Research", "Wound Healing"],
    alsoKnownAs: "Body Protection Compound-157"
  },
  "143": {
    id: "143",
    description: `TB-500 is a synthetic version of the naturally occurring peptide Thymosin Beta-4 (Tβ4). It is present in virtually all human cells and plays a critical role in building and regulating actin, a cell-building protein essential for movement and metabolism. Research has explored TB-500's potential in tissue repair, wound healing, cardiac muscle repair, and reducing inflammation in preclinical models.`,
    sequence: "Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Ala-Glu-Ser",
    molecularWeight: "4963.5 g/mol",
    casNumber: "77591-33-4",
    formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
    purity: "99% by HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C for up to 3 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 30 minutes (plasma)",
    researchAreas: ["Tissue Regeneration", "Cardiac Research", "Anti-Inflammatory Research", "Wound Healing"],
    alsoKnownAs: "Thymosin Beta-4, TB4, Tβ4"
  },
  "144": {
    id: "144",
    description: `TB-500 5mg - Thymosin Beta-4 is a naturally occurring 43 amino acid peptide present in high concentrations in blood platelets, wound fluid, and other tissues. As one of the most abundant and versatile peptides in the body, Tβ4 plays an active role in the protection, regeneration, and remodeling of injured or damaged tissues.`,
    sequence: "Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Ala-Glu-Ser",
    molecularWeight: "4963.5 g/mol",
    casNumber: "77591-33-4",
    formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
    purity: "99% by HPLC",
    storage: "Store at -20°C prior to reconstitution.",
    appearance: "White lyophilized powder",
    researchAreas: ["Tissue Regeneration", "Wound Healing", "Anti-Inflammatory Research"],
    alsoKnownAs: "Thymosin Beta-4, Tβ4"
  },
  "75": {
    id: "75",
    description: `Ipamorelin is a pentapeptide (Aib-His-D-2-Nal-D-Phe-Lys-NH2) and a ghrelin mimetic. It is a growth hormone (GH) secretagogue and is among the most selective GH secretagogues studied, demonstrating minimal side effects. Research has focused on its potential to stimulate pituitary GH release without significantly affecting cortisol or prolactin levels.`,
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH₂",
    molecularWeight: "711.868 g/mol",
    casNumber: "170851-70-4",
    formula: "C₃₈H₄₉N₉O₅",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Reconstituted: refrigerate at 4°C and use within 30 days.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water at 1 mg/mL",
    halfLife: "Approximately 2 hours",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Anti-Aging Research"],
    alsoKnownAs: "NNC 26-0161"
  },
  "76": {
    id: "76",
    description: `Ipamorelin 5mg - A selective growth hormone secretagogue that stimulates the pituitary gland to produce and release growth hormone. Ipamorelin is known for its selectivity — it does not significantly stimulate the release of ACTH, cortisol, or prolactin, making it a preferred compound for growth hormone research.`,
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH₂",
    molecularWeight: "711.868 g/mol",
    casNumber: "170851-70-4",
    formula: "C₃₈H₄₉N₉O₅",
    purity: "99% by HPLC",
    storage: "Store lyophilized at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Metabolic Research"],
    alsoKnownAs: "NNC 26-0161"
  },
  "126": {
    id: "126",
    description: `Semaglutide is a glucagon-like peptide-1 (GLP-1) receptor agonist. It is a long-acting synthetic analogue of the human incretin hormone GLP-1, modified to resist degradation by the dipeptidyl peptidase-4 (DPP-4) enzyme. Research has extensively studied its effects on glycemic control and weight reduction in preclinical and clinical settings.`,
    sequence: "His-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys(N-ε-(N-(2-(2-(2-(2-(2-(2-((2-(2-(3-carboxypropanoyl)amino)ethoxy)ethoxy)acetyl)amino)ethoxy)ethoxy)acetyl)[Glu]γGlu-C18 diacid))-Arg-Gly",
    molecularWeight: "4113.58 g/mol",
    casNumber: "910463-68-2",
    formula: "C₁₈₇H₂₉₁N₄₅O₅₉",
    purity: "99% by HPLC",
    storage: "Store lyophilized at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white powder",
    solubility: "Soluble in water (pH 7.4 buffer recommended)",
    halfLife: "Approximately 7 days (subcutaneous)",
    researchAreas: ["Metabolic Research", "Obesity Research", "Cardiovascular Research", "Diabetes Research"],
    alsoKnownAs: "Ozempic (brand), Wegovy (brand), NNC 0113-0217"
  },
  "160": {
    id: "160",
    description: `Tirzepatide is a novel dual glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist. Research has demonstrated its effects on both GIP and GLP-1 receptors simultaneously, providing a dual mechanism of action. Studies in animal models and clinical trials have demonstrated significant glycemic control and weight reduction outcomes.`,
    molecularWeight: "4813.5 g/mol",
    casNumber: "2023788-19-2",
    formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white lyophilized powder",
    halfLife: "Approximately 5 days",
    researchAreas: ["Metabolic Research", "Obesity Research", "Diabetes Research", "Cardiovascular Research"],
    alsoKnownAs: "LY3298176, Mounjaro (brand), Zepbound (brand)"
  },
  "44": {
    id: "44",
    description: `GHK-Cu (Copper Peptide GHK-Cu) is a naturally occurring copper complex of the tripeptide glycyl-L-histidyl-L-lysine. It was originally identified in human plasma. GHK-Cu has a wide range of research applications including wound healing, anti-inflammatory effects, antioxidant activity, tissue regeneration, and collagen synthesis stimulation. Research suggests it promotes tissue remodeling and regeneration.`,
    sequence: "Gly-His-Lys",
    molecularWeight: "340.38 g/mol (free peptide), 403.92 g/mol (Cu²⁺ complex)",
    casNumber: "89030-95-5",
    formula: "C₁₄H₂₄CuN₆O₄",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Stable for 2 years when stored properly.",
    appearance: "Blue powder (copper complex)",
    solubility: "Soluble in water",
    researchAreas: ["Wound Healing", "Anti-Aging Research", "Collagen Research", "Anti-Inflammatory Research", "Cosmetic Research"],
    alsoKnownAs: "Copper Peptide, Tripeptide-1 Copper, GHK"
  },
  "84": {
    id: "84",
    description: `Melanotan-1 (MT-1) is a synthetic analogue of alpha-melanocyte-stimulating hormone (α-MSH). It acts on melanocortin receptors (MC1R-MC5R) and has been studied for its effects on skin pigmentation and photoprotection. Research has also explored its potential for sexual dysfunction, obesity, and inflammatory conditions.`,
    sequence: "Ac-Ser-Tyr-Ser-Met-Glu-His-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH₂",
    molecularWeight: "1646.9 g/mol",
    casNumber: "75921-69-6",
    formula: "C₇₈H₁₁₁N₂₁O₁₉S",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Keep away from light.",
    appearance: "White lyophilized powder",
    halfLife: "1-2 hours (intravenous); longer with subcutaneous",
    researchAreas: ["Dermatology Research", "Photoprotection Research", "Melanogenesis Research"],
    alsoKnownAs: "Afamelanotide, CUV1647, NDP-α-MSH, MT-1"
  },
  "85": {
    id: "85",
    description: `Melanotan II (MT-2) is a synthetic analogue of the naturally occurring melanocortin peptide alpha-melanocyte-stimulating hormone (α-MSH). It is a non-selective melanocortin receptor agonist with high affinity for MC1R, MC3R, MC4R, and MC5R. Research has explored its effects on skin tanning, sexual function, energy homeostasis, and appetite suppression.`,
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH₂",
    molecularWeight: "1024.2 g/mol",
    casNumber: "121062-08-6",
    formula: "C₅₀H₆₉N₁₅O₉",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Protect from light.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes (intravenous)",
    researchAreas: ["Melanogenesis Research", "Sexual Function Research", "Energy Metabolism Research"],
    alsoKnownAs: "MT-II, Melanotan-II"
  },
  "22": {
    id: "22",
    description: `CJC-1295 No DAC (also known as Modified GRF 1-29 or Mod-GRF 1-29) is a synthetic analogue of the endogenous growth hormone releasing hormone (GHRH). It is a 29 amino acid peptide that stimulates growth hormone and IGF-1 secretion. Unlike CJC-1295 with DAC, the No DAC version has a shorter half-life more closely mimicking natural pulsatile GH release.`,
    sequence: "Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-NH₂",
    molecularWeight: "3367.97 g/mol",
    casNumber: "863288-34-0",
    formula: "C₁₄₉H₂₄₆N₄₄O₄₂S",
    purity: "99% by HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes (intravenous)",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research"],
    alsoKnownAs: "Modified GRF 1-29, Mod-GRF 1-29, CJC-1295 without DAC, Sermorelin analogue"
  },
  "33": {
    id: "33",
    description: `Epithalon (also spelled Epitalon) is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) based on the natural peptide Epithalamin, which is produced by the pineal gland. Research has studied Epithalon extensively for its potential anti-aging properties, particularly its ability to stimulate telomerase activity and lengthen telomeres, which may extend cell lifespan. Studies have also explored its effects on circadian rhythm regulation, immune function, and antioxidant activity.`,
    sequence: "Ala-Glu-Asp-Gly",
    molecularWeight: "390.35 g/mol",
    casNumber: "307297-39-8",
    formula: "C₁₄H₂₂N₄O₉",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Stable for 2 years when properly stored.",
    appearance: "White lyophilized powder",
    solubility: "Freely soluble in water",
    researchAreas: ["Anti-Aging Research", "Telomere Research", "Immune System Research", "Circadian Rhythm Research"],
    alsoKnownAs: "Epitalon, Epithalamin synthetic analogue, Tetrapeptide Glu-Asp-Gly-Ala"
  },
  "68": {
    id: "68",
    description: `HGH Fragment 176-191 is a modified form of amino acids 176-191 of the Growth Hormone polypeptide. It has been studied for its potential fat-burning properties. Research suggests that the fragment may mimic the effects of HGH on fat metabolism without causing insulin resistance or other effects associated with full-length GH.`,
    sequence: "Tyr-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Glu-Gly-Ser-Cys-Gly-Phe",
    molecularWeight: "1817.12 g/mol",
    casNumber: "66004-57-7",
    formula: "C₇₈H₁₂₅N₂₃O₂₃S₂",
    purity: "99% by HPLC",
    storage: "Store lyophilized at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Metabolic Research", "Lipid Metabolism Research", "Obesity Research"],
    alsoKnownAs: "HGH Frag, AOD 9604 (modified)"
  },
  "54": {
    id: "54",
    description: `GHRP-2 (Growth Hormone Releasing Peptide-2) is a synthetic hexapeptide growth hormone secretagogue. It stimulates the secretion of endogenous growth hormone from the pituitary gland. Research has studied GHRP-2 for its ability to increase GH levels, improve lean body composition, and stimulate appetite in animal models.`,
    sequence: "D-Ala-D-β-Nal-Ala-Trp-D-Phe-Lys-NH₂",
    molecularWeight: "817.93 g/mol",
    casNumber: "158861-67-7",
    formula: "C₄₅H₅₅N₉O₆",
    purity: "99% by HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White powder",
    halfLife: "Approximately 15-60 minutes",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Appetite Research"],
    alsoKnownAs: "Pralmorelin, KP-102"
  },
  "60": {
    id: "60",
    description: `GHRP-6 (Growth Hormone Releasing Peptide-6) is a synthetic hexapeptide that stimulates growth hormone release from the pituitary gland. It is one of the first GHRPs synthesized and has been extensively studied for its growth hormone-releasing effects and appetite-stimulating properties. GHRP-6 acts through ghrelin receptors (GHS-R).`,
    sequence: "His-D-Trp-Ala-Trp-D-Phe-Lys-NH₂",
    molecularWeight: "873.01 g/mol",
    casNumber: "87616-84-0",
    formula: "C₄₆H₅₆N₁₂O₆",
    purity: "99% by HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    halfLife: "15-60 minutes",
    researchAreas: ["Growth Hormone Research", "Appetite Research", "Metabolic Research"],
    alsoKnownAs: "His-D-Trp-Ala-Trp-D-Phe-Lys"
  },
  "134": {
    id: "134",
    description: `Sermorelin is a synthetic peptide analogue of the endogenous growth hormone releasing hormone (GHRH). It consists of the first 29 amino acids of the 44-amino acid GHRH molecule. Research has demonstrated that Sermorelin effectively stimulates the pituitary gland to produce and secrete growth hormone in a natural, pulsatile manner.`,
    sequence: "Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-NH₂",
    molecularWeight: "3357.93 g/mol",
    casNumber: "86168-78-7",
    formula: "C₁₄₉H₂₄₆N₄₄O₄₂S",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    halfLife: "11-12 minutes (intravenous)",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Endocrine Research"],
    alsoKnownAs: "GHRH(1-29)-NH₂, GRF(1-29), Geref"
  },
  "155": {
    id: "155",
    description: `Thymosin Alpha-1 (Tα1) is a naturally occurring 28-amino acid peptide originally isolated from thymic tissue. It plays a fundamental role in immune regulation. Research has shown that Tα1 has immunomodulatory effects, stimulating both innate and adaptive immune responses. It has been studied extensively for its potential in treating chronic viral infections, cancer, and immune deficiency conditions.`,
    sequence: "Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn",
    molecularWeight: "3108.3 g/mol",
    casNumber: "62304-98-7",
    formula: "C₁₃₂H₂₁₄N₃₄O₅₈",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water",
    researchAreas: ["Immune System Research", "Antiviral Research", "Cancer Research", "Anti-Aging Research"],
    alsoKnownAs: "Tα1, Thymalfasin, Zadaxin"
  },
  "99": {
    id: "99",
    description: `NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in all living cells, playing a critical role in energy metabolism and maintaining proper cell function. Research has explored NAD+ and its precursors for their potential to support cellular energy production, DNA repair, and activation of sirtuins (proteins linked to longevity). NAD+ levels decline naturally with age.`,
    molecularWeight: "663.43 g/mol",
    casNumber: "53-84-9",
    formula: "C₂₁H₂₇N₇O₁₄P₂",
    purity: "99% by HPLC",
    storage: "Store at -20°C, protected from light and moisture.",
    appearance: "White crystalline powder",
    solubility: "Highly soluble in water",
    researchAreas: ["Longevity Research", "Metabolic Research", "DNA Repair Research", "Neuroprotection"],
    alsoKnownAs: "Nicotinamide Adenine Dinucleotide, β-NAD, Coenzyme I"
  },
  "119": {
    id: "119",
    description: `PT-141 (Bremelanotide) is a synthetic peptide analogue of alpha-melanocyte-stimulating hormone (α-MSH). Unlike other sexual dysfunction treatments that work through the vascular system, PT-141 acts through melanocortin receptors in the nervous system. Research has focused on its potential effects on sexual arousal and function in both male and female animal models.`,
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH",
    molecularWeight: "1025.2 g/mol",
    casNumber: "189691-06-3",
    formula: "C₅₀H₆₈N₁₄O₁₀",
    purity: "99% by HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 2.7 hours",
    researchAreas: ["Sexual Function Research", "Melanocortin Research", "Neurological Research"],
    alsoKnownAs: "Bremelanotide, PL-6983"
  },
  "94": {
    id: "94",
    description: `MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA Type-c) is a mitochondria-derived peptide encoded within the mitochondrial genome. Research has identified it as a regulator of metabolic homeostasis. Studies have demonstrated its potential in improving insulin sensitivity, reducing fat accumulation, increasing exercise capacity, and supporting longevity pathways.`,
    sequence: "MRWQEMGYIFYPRKLR",
    molecularWeight: "2173.5 g/mol",
    casNumber: "1627580-64-6",
    formula: "C₁₀₄H₁₅₃N₂₇O₂₆S",
    purity: "99% by HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Metabolic Research", "Longevity Research", "Exercise Research", "Insulin Sensitivity Research"],
    alsoKnownAs: "Mitochondria-Derived Peptide"
  },
  "150": {
    id: "150",
    description: `Tesamorelin is a synthetic analogue of growth hormone releasing hormone (GHRH). It is a 44-amino acid peptide with a trans-3-hexenoic acid group attached at the N-terminus. Research has studied it for its ability to stimulate the pulsatile release of growth hormone from the pituitary gland and its effects on visceral adipose tissue reduction.`,
    sequence: "Trans-3-hexenoic acid-Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln-Gln-Gly-Glu-Ser-Asn-Gln-Glu-Arg-Gly-Ala-Arg-Ala-Arg-Leu-NH₂",
    molecularWeight: "5135.9 g/mol",
    casNumber: "218949-48-5",
    formula: "C₂₂₁H₃₆₆N₆₄O₆₆S₁",
    purity: "99% by HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 21 days.",
    appearance: "White lyophilized powder",
    halfLife: "26-38 minutes (intravenous)",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Adipose Tissue Research"],
    alsoKnownAs: "Egrifta (brand), TH9507"
  },
};

export function getProductDetail(id: string): ProductDetail {
  return productDetails[id] || {
    id,
    description: "This research peptide is produced to the highest standards of purity and quality. Our peptides are synthesized in the USA using pharmaceutical-grade raw materials and undergo strict quality control including HPLC analysis. For research purposes only.",
    purity: "99% by HPLC",
    storage: "Store lyophilized at -20°C. After reconstitution, store at 4°C and use within 2-4 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Research Use Only"],
  };
}
