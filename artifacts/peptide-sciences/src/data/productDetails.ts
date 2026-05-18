export type ProductDetail = {
  id: string;
  description: string;
  longDescription?: string;
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
  refNumber?: string;
};

export const productDetails: Record<string, ProductDetail> = {

  "1": {
    id: "1",
    refNumber: "490-05-AO",
    casNumber: "221231-10-3",
    formula: "C₄₅H₆₉N₉O₁₀",
    molecularWeight: "908.1 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "AOD9604, hGH Fragment 176-191",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 30 minutes",
    researchAreas: ["Obesity Research", "Fat Metabolism", "Metabolic Disorders", "Body Composition"],
    description: `AOD-9604 is a synthetic peptide analogue of the C-terminal fragment of human growth hormone (hGH), specifically residues 176–191. It is investigated for its ability to stimulate lipolysis and inhibit lipogenesis without exhibiting the growth-promoting or insulin-desensitizing effects of full-length hGH.`,
    longDescription: `What is AOD-9604?

AOD-9604 (Anti-Obesity Drug 9604) is a modified form of amino acids 176–191 at the C-terminus of human growth hormone. It was developed with the goal of isolating the fat-metabolizing properties of hGH from its anabolic and diabetogenic effects. The peptide retains the ability to activate β3-adrenergic receptors in adipose tissue, triggering the breakdown of stored fats (lipolysis) while simultaneously reducing fat synthesis (lipogenesis).

AOD-9604 Structure

AOD-9604 has the molecular formula C₄₅H₆₉N₉O₁₀ and a molecular weight of 908.1 g/mol. Its sequence corresponds to residues 176–191 of human growth hormone, with an additional tyrosine residue at the N-terminus to enhance stability. Unlike full-length hGH, AOD-9604 does not bind to the GH receptor and therefore does not stimulate IGF-1 release or exert significant anabolic effects.

AOD-9604 Research

Preclinical studies in obese rodents demonstrated that AOD-9604 administration resulted in significant reductions in body fat, particularly visceral adipose tissue. Research has investigated its mechanism of action via β3-adrenergic receptor signaling, which promotes thermogenesis and lipolytic activity in white and brown adipose tissue. Studies also indicate that AOD-9604 has no significant effects on glucose metabolism, insulin sensitivity, or bone density at investigated doses.

In vitro studies have explored AOD-9604's potential role in cartilage regeneration and repair, with researchers noting possible applications in musculoskeletal research beyond its primary metabolic focus. The compound has a favorable safety profile in investigated models, with no observed mitogenic activity or cancer-promoting effects.`
  },

  "2": {
    id: "2",
    refNumber: "490-10-AO",
    casNumber: "221231-10-3",
    formula: "C₄₅H₆₉N₉O₁₀",
    molecularWeight: "908.1 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "AOD9604, hGH Fragment 176-191",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 30 minutes",
    researchAreas: ["Obesity Research", "Fat Metabolism", "Metabolic Disorders", "Body Composition"],
    description: `AOD-9604 10mg is a synthetic peptide analogue of the C-terminal fragment of human growth hormone (hGH), residues 176–191. Investigated for stimulating lipolysis and inhibiting lipogenesis without the growth-promoting or insulin-desensitizing effects of full-length hGH.`,
    longDescription: `What is AOD-9604?

AOD-9604 (Anti-Obesity Drug 9604) is a modified form of amino acids 176–191 at the C-terminus of human growth hormone. It was developed with the goal of isolating the fat-metabolizing properties of hGH from its anabolic and diabetogenic effects. The peptide retains the ability to activate β3-adrenergic receptors in adipose tissue, triggering the breakdown of stored fats (lipolysis) while simultaneously reducing fat synthesis (lipogenesis).

AOD-9604 Research

Preclinical studies in obese rodents demonstrated that AOD-9604 administration resulted in significant reductions in body fat, particularly visceral adipose tissue. Studies also indicate that AOD-9604 has no significant effects on glucose metabolism, insulin sensitivity, or bone density. In vitro studies have explored cartilage regeneration applications. The compound has a favorable safety profile with no observed mitogenic activity.`
  },

  "3": {
    id: "3",
    refNumber: "157-05-BP",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    molecularWeight: "1419.56 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Body Protection Compound-157, BPC157, Bepecin, PL 14736",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or 0.9% saline",
    halfLife: "Unknown in humans; stable in gastric juice",
    researchAreas: ["Gastrointestinal Research", "Wound Healing", "Musculoskeletal Research", "Neuroprotection", "Angiogenesis"],
    description: `BPC-157 is a synthetic pentadecapeptide derived from a partial sequence of the human Body Protection Compound found in gastric juice. It has been extensively studied in preclinical models for its regenerative, cytoprotective, and angiogenic properties across multiple organ systems.`,
    longDescription: `What is BPC-157?

BPC-157, or Body Protection Compound 157, is a 15-amino acid peptide derived from a protective protein found in human gastric juice. First isolated and characterized at the University of Zagreb, this peptide has been studied in numerous animal models for its remarkable cytoprotective and regenerative properties. Unlike many research peptides, BPC-157 is stable in human gastric juice and can be administered via multiple routes.

BPC-157 Structure

BPC-157 is a 15-amino acid peptide with the sequence Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val. Its molecular formula is C₆₂H₉₈N₁₆O₂₂ with a molecular weight of 1419.56 g/mol. The proline-rich region of the sequence confers structural rigidity and resistance to enzymatic digestion, which may account for its stability in biological fluids.

BPC-157 Research

Research in rodent models has demonstrated BPC-157's ability to accelerate healing of tendons, ligaments, muscles, and bone. Studies have shown upregulation of growth hormone receptors in tendon fibroblasts and enhanced expression of VEGF and other angiogenic factors, promoting new blood vessel formation in injured tissue.

Gastrointestinal research has documented protective effects against various forms of gastrointestinal damage, including ethanol-induced lesions, NSAID-induced damage, and inflammatory bowel disease models. The peptide appears to stimulate the release of growth factors from gastric mucosa and modulate nitric oxide synthase activity.

Neurological research has investigated BPC-157's effects in models of traumatic brain injury, spinal cord damage, and neurotoxicity. Researchers have observed improved motor function recovery and reduced neuroinflammation in treated subjects. The peptide may interact with dopaminergic and serotonergic systems, which has prompted research into anxiety and depression models as well.`
  },

  "4": {
    id: "4",
    refNumber: "157-10-BP",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    molecularWeight: "1419.56 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Body Protection Compound-157, BPC157, Bepecin, PL 14736",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or 0.9% saline",
    halfLife: "Unknown in humans; stable in gastric juice",
    researchAreas: ["Gastrointestinal Research", "Wound Healing", "Musculoskeletal Research", "Neuroprotection", "Angiogenesis"],
    description: `BPC-157 10mg is a synthetic pentadecapeptide extensively studied in preclinical models for its regenerative, cytoprotective, and angiogenic properties across multiple organ systems including gastrointestinal, musculoskeletal, and neural tissues.`,
    longDescription: `What is BPC-157?

BPC-157, or Body Protection Compound 157, is a 15-amino acid peptide derived from a protective protein found in human gastric juice. First isolated and characterized at the University of Zagreb, this peptide has been studied in numerous animal models for its remarkable cytoprotective and regenerative properties.

BPC-157 Research

Research in rodent models has demonstrated BPC-157's ability to accelerate healing of tendons, ligaments, muscles, and bone. Studies have shown upregulation of growth hormone receptors in tendon fibroblasts and enhanced expression of VEGF and other angiogenic factors, promoting new blood vessel formation in injured tissue. Gastrointestinal research has documented protective effects against various forms of GI damage, and neurological research has investigated its effects in models of traumatic brain injury and spinal cord damage.`
  },

  "5": {
    id: "5",
    refNumber: "157-20-BP",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    molecularWeight: "1419.56 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Body Protection Compound-157, BPC157, Bepecin",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or 0.9% saline",
    researchAreas: ["Gastrointestinal Research", "Wound Healing", "Musculoskeletal Research", "Neuroprotection"],
    description: `BPC-157 20mg is a large-format vial of the synthetic pentadecapeptide extensively studied for its regenerative, cytoprotective, and angiogenic properties. Suitable for extended research protocols.`,
    longDescription: `What is BPC-157?

BPC-157, or Body Protection Compound 157, is a 15-amino acid peptide derived from a protective protein found in human gastric juice. The 20mg vial format is intended for research protocols requiring larger quantities or longer study durations.

BPC-157 Research

Preclinical research has consistently shown BPC-157's ability to accelerate tissue repair across multiple organ systems. Studies document enhanced healing of tendons, ligaments, and muscles, upregulation of VEGF and angiogenic factors, gastrointestinal cytoprotection, and neuroprotective effects in injury models. The peptide's stability in biological fluids and multi-route administration potential make it a versatile research compound.`
  },

  "6": {
    id: "6",
    refNumber: "157-40-BP",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    molecularWeight: "1419.56 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Body Protection Compound-157, BPC157",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or 0.9% saline",
    researchAreas: ["Gastrointestinal Research", "Wound Healing", "Musculoskeletal Research", "Neuroprotection"],
    description: `BPC-157 40mg is an extra-large format vial of the cytoprotective pentadecapeptide, designed for high-volume research applications. Identical compound to smaller vials with the same purity and scientific properties.`,
    longDescription: `What is BPC-157?

BPC-157 40mg provides a high-quantity format of Body Protection Compound 157 for extensive research protocols. The 40mg vial is ideal for studies requiring multiple dosing cohorts or longer treatment durations. All chemical properties, purity standards, and research profiles are identical to smaller vial sizes, with the same lyophilized powder format ensuring long-term stability when stored correctly.`
  },

  "7": {
    id: "7",
    refNumber: "157-10-BT",
    casNumber: "137525-51-0 / 77591-33-4",
    molecularWeight: "1419.56 g/mol / 4963.44 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "BPC-157 TB-500 Stack, BPC/TB Blend",
    storage: "Store lyophilized blend at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    researchAreas: ["Tissue Repair", "Wound Healing", "Musculoskeletal Recovery", "Anti-Inflammatory Research"],
    description: `The BPC-157 + TB-500 Blend 10mg combines BPC-157 (5mg) and TB-500 (5mg) in a single vial for research into synergistic tissue repair mechanisms. Each component contributes complementary regenerative pathways.`,
    longDescription: `What is the BPC-157 + TB-500 Blend?

This blend combines BPC-157 (Body Protection Compound 157, 5mg) and TB-500 (a synthetic analogue of Thymosin Beta-4, 5mg) in a single lyophilized preparation. Both peptides have been independently studied for their tissue-repair properties, and preclinical research suggests the combination may produce additive or synergistic effects.

Research Background

BPC-157 promotes angiogenesis, upregulates growth hormone receptors in fibroblasts, and exhibits cytoprotective properties in gastrointestinal, musculoskeletal, and neural tissues. TB-500 (Thymosin Beta-4 fragment) binds G-actin, regulating cellular migration, differentiation, and wound healing. Together, they represent complementary pathways: BPC-157 primarily promotes new blood vessel formation and tissue cytoprotection, while TB-500 facilitates cell migration and reorganization of the extracellular matrix.

Preclinical studies in models of tendon injury, muscle damage, and wound healing have investigated the combined administration of these peptides, with researchers observing potentially enhanced recovery rates compared to either peptide alone.`
  },

  "8": {
    id: "8",
    refNumber: "157-20-BT",
    casNumber: "137525-51-0 / 77591-33-4",
    molecularWeight: "1419.56 g/mol / 4963.44 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "BPC-157 TB-500 Stack, BPC/TB Blend",
    storage: "Store lyophilized blend at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    researchAreas: ["Tissue Repair", "Wound Healing", "Musculoskeletal Recovery", "Anti-Inflammatory Research"],
    description: `The BPC-157 + TB-500 Blend 20mg combines BPC-157 (10mg) and TB-500 (10mg) in a single vial for research into synergistic tissue repair mechanisms. The larger format supports extended research protocols.`,
    longDescription: `What is the BPC-157 + TB-500 Blend?

This 20mg blend combines BPC-157 (Body Protection Compound 157, 10mg) and TB-500 (a synthetic analogue of Thymosin Beta-4, 10mg) in a single lyophilized preparation. Both peptides have been independently studied for their tissue-repair properties, and preclinical research suggests the combination may produce additive or synergistic effects.

Research Background

BPC-157 promotes angiogenesis, upregulates growth hormone receptors in fibroblasts, and exhibits cytoprotective properties in gastrointestinal, musculoskeletal, and neural tissues. TB-500 (Thymosin Beta-4 fragment) binds G-actin, regulating cellular migration, differentiation, and wound healing. Together, they represent complementary pathways: BPC-157 primarily promotes new blood vessel formation and tissue cytoprotection, while TB-500 facilitates cell migration and reorganization of the extracellular matrix.

Preclinical studies in models of tendon injury, muscle damage, and wound healing have investigated the combined administration of these peptides, with researchers observing potentially enhanced recovery rates compared to either peptide alone. The 20mg format supports multi-cohort or longer-duration studies.`
  },

  "9": {
    id: "9",
    refNumber: "465-05-CA",
    casNumber: "2215032-39-0",
    formula: "C₂₉H₄₀N₄O₇",
    molecularWeight: "560.65 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "AM833, NN9838",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 7 days",
    researchAreas: ["Obesity Research", "Weight Management", "Metabolic Research", "Appetite Regulation"],
    description: `Cagrilintide 5mg is a long-acting amylin analogue investigated for its role in appetite suppression, gastric emptying modulation, and weight management. Research explores its potential synergy with GLP-1 receptor agonists in metabolic disorder models.`,
    longDescription: `What is Cagrilintide?

Cagrilintide (AM833, NN9838) is a long-acting amylin analogue developed for research into obesity and metabolic disorders. Amylin is a peptide hormone co-secreted with insulin from pancreatic beta cells that plays a key role in regulating satiety, gastric emptying, and postprandial glucagon secretion. Cagrilintide is engineered with fatty acid modifications to extend its half-life to approximately 7 days, enabling once-weekly dosing in research models.

Cagrilintide Research

Research in preclinical and clinical models has demonstrated significant weight reduction with cagrilintide administration. The peptide acts on amylin receptors in the hypothalamus, particularly in the area postrema, to reduce food intake and slow gastric emptying. Studies combining cagrilintide with semaglutide (a GLP-1 receptor agonist) have shown enhanced weight loss outcomes compared to either agent alone, suggesting complementary mechanisms of appetite regulation.

Metabolic research has also investigated cagrilintide's effects on blood glucose regulation, lipid profiles, and cardiovascular risk markers. The compound is notable for not causing the hypoglycemia associated with some other anti-obesity research compounds.`
  },

  "10": {
    id: "10",
    refNumber: "465-10-CA",
    casNumber: "2215032-39-0",
    formula: "C₂₉H₄₀N₄O₇",
    molecularWeight: "560.65 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "AM833, NN9838",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 7 days",
    researchAreas: ["Obesity Research", "Weight Management", "Metabolic Research", "Appetite Regulation"],
    description: `Cagrilintide 10mg is a long-acting amylin analogue investigated for appetite suppression, gastric emptying modulation, and synergistic weight management when combined with GLP-1 receptor agonists.`,
    longDescription: `What is Cagrilintide?

Cagrilintide is a long-acting amylin analogue with a half-life of approximately 7 days. Research has demonstrated significant weight reduction through amylin receptor activity in the hypothalamus, reducing food intake and slowing gastric emptying. When combined with GLP-1 agonists such as semaglutide, research models show enhanced weight loss outcomes, suggesting complementary appetite regulation mechanisms. Metabolic studies also show favorable effects on blood glucose, lipids, and cardiovascular markers.`
  },

  "11": {
    id: "11",
    refNumber: "295-05-CJ",
    casNumber: "863288-34-0",
    formula: "C₁₅₂H₂₅₂N₄₄O₄₂",
    molecularWeight: "3367.93 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Modified GRF 1-29, Mod GRF 1-29, CJC-1295 without DAC",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 30 minutes",
    researchAreas: ["Growth Hormone Research", "Muscle Mass Research", "Fat Metabolism", "Anti-Aging Research"],
    description: `CJC-1295 No DAC (Modified GRF 1-29) is a tetra-substituted analogue of GHRH(1-29) that stimulates pulsatile growth hormone release from the anterior pituitary without the prolonged plasma binding associated with the DAC version. It produces physiologically natural GH pulses.`,
    longDescription: `What is CJC-1295 No DAC?

CJC-1295 without DAC (Drug Affinity Complex), also known as Modified GRF 1-29, is a synthetic analogue of the first 29 amino acids of growth hormone-releasing hormone (GHRH). Four amino acid substitutions have been incorporated to increase stability and receptor affinity while maintaining the natural pulsatile pattern of GH release. Unlike CJC-1295 with DAC, this version does not covalently bind to albumin, resulting in a shorter half-life of approximately 30 minutes.

CJC-1295 No DAC Research

Research demonstrates that CJC-1295 No DAC stimulates the pituitary somatotrophs to release GH in pulses that more closely mimic physiological patterns. This pulsatile release is considered important for avoiding receptor downregulation and maintaining sensitivity. Studies combining CJC-1295 No DAC with GHRPs (such as Ipamorelin or GHRP-2) have consistently shown synergistic effects on GH secretion, with the combination producing substantially greater GH release than either peptide alone.

Preclinical studies have documented effects on lean body mass preservation, fat oxidation, and IGF-1 levels. Research also explores potential anti-aging applications, as age-related GH decline is associated with changes in body composition, bone density, and metabolic function.`
  },

  "12": {
    id: "12",
    refNumber: "295-10-CJ",
    casNumber: "863288-34-0",
    formula: "C₁₅₂H₂₅₂N₄₄O₄₂",
    molecularWeight: "3367.93 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Modified GRF 1-29, Mod GRF 1-29, CJC-1295 without DAC",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes",
    researchAreas: ["Growth Hormone Research", "Muscle Mass Research", "Fat Metabolism", "Anti-Aging Research"],
    description: `CJC-1295 No DAC 10mg stimulates pulsatile growth hormone release from the anterior pituitary. The larger vial format supports extended research protocols investigating GH secretion, body composition, and metabolism.`,
    longDescription: `What is CJC-1295 No DAC?

CJC-1295 without DAC (Modified GRF 1-29) is a tetra-substituted analogue of GHRH(1-29) that produces physiologically natural pulsatile GH release. The 10mg format supports longer research protocols. Studies show synergistic GH secretion when combined with GHRPs, along with documented effects on lean mass, fat oxidation, and IGF-1 levels. Its short half-life of ~30 minutes enables natural pulsatile GH patterns, considered important for receptor sensitivity maintenance.`
  },

  "13": {
    id: "13",
    refNumber: "701-05-DS",
    casNumber: "62568-57-4",
    formula: "C₃₅H₄₈N₁₀O₁₅",
    molecularWeight: "848.82 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Delta Sleep-Inducing Peptide, DSIP",
    sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 30–60 minutes",
    researchAreas: ["Sleep Research", "Stress Response", "Neuroendocrine Research", "Pain Research", "Antioxidant Research"],
    description: `DSIP (Delta Sleep-Inducing Peptide) is a neuromodulatory peptide originally isolated from rabbit brain. Research explores its roles in sleep regulation, stress response modulation, hormonal axis activity, and antioxidant properties.`,
    longDescription: `What is DSIP?

Delta Sleep-Inducing Peptide (DSIP) is a neuropeptide first isolated in 1977 from the cerebral venous blood of rabbits during electrically induced sleep. The peptide consists of 9 amino acids and is found naturally in the hypothalamus, pituitary gland, and peripheral tissues. Research has expanded well beyond its original sleep-related discovery to encompass a broad range of neuroendocrine and cytoprotective functions.

DSIP Research

Sleep research has documented that DSIP administration can modulate sleep patterns in animal models, increasing slow-wave (delta) sleep and reducing sleep fragmentation. The mechanisms appear to involve interactions with GABA receptors and modulation of CRH and ACTH release.

Stress response research has demonstrated DSIP's ability to attenuate stress-induced physiological changes, including normalization of elevated corticosterone levels and reduction of anxiety-like behaviors in rodent models. This stress-buffering effect may be mediated through hypothalamic-pituitary-adrenal (HPA) axis modulation.

Antioxidant research has shown DSIP may protect cells from oxidative stress, with investigators reporting reduced lipid peroxidation and increased activity of antioxidant enzymes in treated tissues. Pain research has also explored analgesic properties in animal models of chronic pain states.`
  },

  "14": {
    id: "14",
    refNumber: "701-10-DS",
    casNumber: "62568-57-4",
    formula: "C₃₅H₄₈N₁₀O₁₅",
    molecularWeight: "848.82 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Delta Sleep-Inducing Peptide, DSIP",
    sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Sleep Research", "Stress Response", "Neuroendocrine Research", "Pain Research"],
    description: `DSIP 10mg (Delta Sleep-Inducing Peptide) is a neuromodulatory neuropeptide studied for sleep regulation, HPA axis modulation, stress response, and antioxidant cytoprotection in preclinical models.`,
    longDescription: `What is DSIP?

DSIP (Delta Sleep-Inducing Peptide) is a 9-amino acid neuropeptide with established roles in sleep regulation, stress modulation, and neuroendocrine function. The 10mg format supports extended research protocols. Research has documented modulation of slow-wave sleep, HPA axis normalization under stress conditions, antioxidant enzyme activation, and analgesic properties in animal models. Its broad distribution across central and peripheral tissues reflects diverse physiological roles beyond sleep induction.`
  },

  "15": {
    id: "15",
    refNumber: "741-10-EP",
    casNumber: "307297-39-8",
    formula: "C₁₄H₂₂N₄O₉",
    molecularWeight: "394.35 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Epitalon, Epithalamin, Epithalone",
    sequence: "Ala-Glu-Asp-Gly",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Unknown",
    researchAreas: ["Longevity Research", "Telomere Biology", "Epigenetic Research", "Pineal Gland Research", "Anti-Aging"],
    description: `Epithalon (Epitalon) is a synthetic tetrapeptide derived from Epithalamin, a natural polypeptide of the pineal gland. It is one of the most studied bioregulator peptides and is investigated for its effects on telomerase activation, telomere elongation, and longevity-associated cellular mechanisms.`,
    longDescription: `What is Epithalon?

Epithalon (also written Epitalon) is a synthetic tetrapeptide with the sequence Ala-Glu-Asp-Gly. It was developed by Professor Vladimir Khavinson at the St. Petersburg Institute of Bioregulation and Gerontology as a synthetic analogue of Epithalamin, a natural peptide extract from the pineal gland of young animals. Epithalon represents one of the most extensively studied bioregulator peptides in the Russian gerontological research tradition.

Epithalon Research

Telomere research has attracted substantial interest in Epithalon. Studies by Khavinson and colleagues documented that Epithalon administration to aged animals and in vitro to human fetal fibroblasts resulted in statistically significant elongation of telomeres and activation of telomerase (hTERT), the enzyme responsible for maintaining telomere length. Shorter telomeres are a hallmark of cellular aging and are associated with increased disease risk and mortality.

Research on the pineal gland has investigated Epithalon's role in melatonin regulation. Animal studies show that Epithalon can restore age-related decreases in melatonin production by the pineal gland, with potential downstream effects on circadian rhythm entrainment, antioxidant defense, and immune modulation.

Long-term survival studies in rodents and fruit flies administered Epithalon have documented increased mean and maximum lifespan. Investigators also reported reduced incidence of age-related spontaneous tumors in some animal models. These findings have generated interest in Epithalon as a candidate for aging and longevity research, though extensive research remains ongoing.`
  },

  "16": {
    id: "16",
    refNumber: "741-40-EP",
    casNumber: "307297-39-8",
    formula: "C₁₄H₂₂N₄O₉",
    molecularWeight: "394.35 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Epitalon, Epithalamin, Epithalone",
    sequence: "Ala-Glu-Asp-Gly",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Longevity Research", "Telomere Biology", "Pineal Gland Research", "Anti-Aging"],
    description: `Epithalon 40mg is a large-format vial of the synthetic tetrapeptide (Ala-Glu-Asp-Gly) studied for telomerase activation, telomere elongation, pineal gland function, and longevity-associated mechanisms.`,
    longDescription: `What is Epithalon?

Epithalon is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) derived from Epithalamin, a pineal gland peptide. The 40mg vial format is designed for extended research protocols or multi-cohort studies. Research documents activation of telomerase (hTERT), telomere elongation in aged cells, restoration of age-related melatonin decline, increased lifespan in animal models, and reduced tumor incidence in some studies. It remains one of the most researched bioregulator peptides in gerontological science.`
  },

  "17": {
    id: "17",
    refNumber: "895-50-GH",
    casNumber: "89030-95-5",
    formula: "C₁₄H₂₃CuN₆O₄",
    molecularWeight: "340.84 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Copper Peptide, GHK, Glycyl-L-Histidyl-L-Lysine Copper",
    sequence: "Gly-His-Lys",
    storage: "Store at -20°C protected from light. Stable for extended periods when dry.",
    appearance: "Blue-green powder (due to copper coordination)",
    solubility: "Freely soluble in water",
    halfLife: "Short in plasma; long-acting effects observed",
    researchAreas: ["Wound Healing", "Skin Research", "Hair Follicle Research", "Antioxidant Research", "Anti-Inflammatory Research"],
    description: `GHK-Cu is a naturally occurring copper peptide tripeptide (Gly-His-Lys) that coordinates with copper(II) ions. It is found in human plasma, saliva, and urine and is extensively researched for wound healing, tissue remodeling, skin regeneration, and antioxidant defense.`,
    longDescription: `What is GHK-Cu?

GHK-Cu (Glycyl-L-Histidyl-L-Lysine Copper) is a naturally occurring tripeptide that binds copper(II) ions with high affinity. It was first isolated from human plasma albumin by Loren Pickart in 1973. GHK-Cu concentrations in plasma are approximately 200 ng/mL in healthy young adults but decline significantly with age, which has stimulated interest in its role in aging and tissue maintenance.

GHK-Cu Structure

The tripeptide Gly-His-Lys coordinates with a single copper(II) ion through its histidine imidazole nitrogen, the N-terminal amine, and the glycine peptide backbone. This copper coordination complex is the biologically active form and drives GHK-Cu's ability to regulate gene expression. Gene array studies have shown GHK-Cu modulates over 4,000 human genes, including those involved in inflammation, DNA repair, collagen synthesis, and nervous system function.

GHK-Cu Research

Wound healing research has documented that GHK-Cu promotes fibroblast proliferation, collagen and glycosaminoglycan synthesis, and neovascularization in wound models. Studies show enhanced healing rates in animal models of skin wounds, diabetic ulcers, and bone repair.

Skin research has investigated GHK-Cu's ability to stimulate production of collagen, elastin, and decorin, while simultaneously reducing the expression of matrix metalloproteinases (MMPs) that degrade the extracellular matrix. This dual action — building matrix components while reducing their breakdown — suggests potential in skin aging research.

Hair follicle research has shown GHK-Cu may increase follicle size, prolong the anagen (growth) phase of the hair cycle, and stimulate hair growth in animal models of alopecia.

Antioxidant and anti-inflammatory research has demonstrated GHK-Cu's ability to reduce oxidative stress markers, inhibit ferritin-mediated iron release, and suppress the expression of inflammatory cytokines including TNF-α and IL-6.`
  },

  "18": {
    id: "18",
    refNumber: "895-100-GH",
    casNumber: "89030-95-5",
    formula: "C₁₄H₂₃CuN₆O₄",
    molecularWeight: "340.84 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Copper Peptide, GHK, Glycyl-L-Histidyl-L-Lysine Copper",
    sequence: "Gly-His-Lys",
    storage: "Store at -20°C protected from light. Stable for extended periods when dry.",
    appearance: "Blue-green powder (due to copper coordination)",
    solubility: "Freely soluble in water",
    researchAreas: ["Wound Healing", "Skin Research", "Hair Follicle Research", "Antioxidant Research"],
    description: `GHK-Cu 100mg is a large-format vial of the naturally occurring copper tripeptide, extensively researched for wound healing, skin regeneration, tissue remodeling, hair follicle stimulation, and antioxidant gene expression modulation.`,
    longDescription: `What is GHK-Cu?

GHK-Cu is a naturally occurring copper peptide complex (Gly-His-Lys-Cu²⁺) found in human plasma, saliva, and urine. Its plasma concentrations decline significantly with age. The 100mg format provides a substantial research supply for extended experiments or multi-cohort studies. Research consistently documents GHK-Cu's ability to modulate over 4,000 genes, promote wound healing, stimulate collagen and elastin production, support hair follicle health, and reduce inflammatory and oxidative stress markers.`
  },

  "19": {
    id: "19",
    refNumber: "502-05-G2",
    casNumber: "158861-67-7",
    formula: "C₄₅H₆₇N₁₃O₆",
    molecularWeight: "818.01 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Growth Hormone-Releasing Peptide-2, Pralmorelin",
    sequence: "D-Ala-D-β-Nal-Ala-Trp-D-Phe-Lys-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 30 minutes",
    researchAreas: ["Growth Hormone Research", "Pituitary Research", "Body Composition", "Appetite Research"],
    description: `GHRP-2 (Growth Hormone-Releasing Peptide-2) is a synthetic hexapeptide ghrelin mimetic that stimulates GH secretion through the ghrelin/GHS-R1a receptor. It is among the most potent GHRPs studied, producing substantial GH pulses when administered alone and synergistic effects when combined with GHRH analogues.`,
    longDescription: `What is GHRP-2?

GHRP-2 (Growth Hormone-Releasing Peptide-2) is a synthetic hexapeptide that acts as a potent agonist of the ghrelin receptor (GHS-R1a). It was developed as part of a series of GH secretagogues designed to stimulate pituitary GH release through a mechanism distinct from GHRH. GHRP-2 is considered one of the most efficacious GHRPs in terms of GH secretory capacity per dose.

GHRP-2 Research

Research consistently demonstrates that GHRP-2 produces large GH pulses following administration. When co-administered with GHRH analogues (such as CJC-1295 no DAC or Sermorelin), synergistic increases in GH secretion are observed — substantially exceeding what either peptide achieves alone. This synergy is attributed to complementary mechanisms: GHRH increases cAMP and stimulates somatotroph activity, while GHRP-2 suppresses somatostatin tone and further amplifies cAMP signaling.

Unlike GHRP-6, GHRP-2 produces relatively modest increases in appetite (ghrelin-like appetite stimulation), making it useful in research models where appetite effects need to be minimized. Studies have investigated GHRP-2's effects on lean body mass, fat metabolism, IGF-1 levels, sleep quality, and immune function.

Research also explores anti-inflammatory properties, with investigators documenting that GHRP-2 can reduce levels of TNF-α and other inflammatory markers in cell culture and animal studies, potentially through a direct cytoprotective mechanism independent of its GH-releasing activity.`
  },

  "20": {
    id: "20",
    refNumber: "502-10-G2",
    casNumber: "158861-67-7",
    formula: "C₄₅H₆₇N₁₃O₆",
    molecularWeight: "818.01 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Growth Hormone-Releasing Peptide-2, Pralmorelin",
    sequence: "D-Ala-D-β-Nal-Ala-Trp-D-Phe-Lys-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes",
    researchAreas: ["Growth Hormone Research", "Pituitary Research", "Body Composition", "Anti-Inflammatory Research"],
    description: `GHRP-2 10mg is a synthetic hexapeptide ghrelin mimetic that stimulates potent GH secretion via GHS-R1a. The 10mg format supports extended research into growth hormone secretion dynamics, body composition, and synergistic GHRH/GHRP combinations.`,
    longDescription: `What is GHRP-2?

GHRP-2 is a synthetic hexapeptide GHS-R1a agonist and one of the most potent GHRPs studied. The 10mg format provides sufficient material for extended research protocols. Research consistently shows large GH pulses, synergistic secretion with GHRH analogues, anti-inflammatory properties independent of GH effects, and favorable body composition effects in animal models. GHRP-2 produces modest appetite stimulation compared to GHRP-6, making it preferred when minimizing ghrelin-like appetite effects is desired.`
  },

  "21": {
    id: "21",
    refNumber: "506-05-G6",
    casNumber: "87616-84-0",
    formula: "C₄₆H₅₆N₁₂O₆",
    molecularWeight: "873.00 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Growth Hormone-Releasing Peptide-6",
    sequence: "His-D-Trp-Ala-Trp-D-Phe-Lys-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 30 minutes",
    researchAreas: ["Growth Hormone Research", "Appetite Research", "Body Composition", "Cardioprotective Research"],
    description: `GHRP-6 is a synthetic hexapeptide ghrelin mimetic that stimulates GH release via the GHS-R1a receptor. Distinguished by its strong appetite-stimulating (orexigenic) effect, GHRP-6 is investigated in growth hormone secretion, appetite regulation, and cardioprotective research.`,
    longDescription: `What is GHRP-6?

GHRP-6 (Growth Hormone-Releasing Peptide-6) is a synthetic hexapeptide that acts as a potent agonist of the ghrelin receptor (GHS-R1a). It was one of the first synthetic GH secretagogues to be studied and remains a key reference compound in GH secretagogue research. GHRP-6 is distinguished from other GHRPs by its pronounced orexigenic (appetite-stimulating) activity, which makes it valuable in research models exploring appetite regulation and weight gain mechanisms.

GHRP-6 Research

Growth hormone research demonstrates that GHRP-6 produces robust GH pulses through a ghrelin-mimetic mechanism. When combined with GHRH or GHRH analogues, synergistic GH release is observed. Research has documented that this GH release is mediated through both suppression of somatostatin tone and direct stimulation of somatotroph cells.

Appetite and ghrelin research uses GHRP-6 as a tool to study orexigenic signaling in the hypothalamus, given its strong activation of appetite-related neural circuits in addition to pituitary stimulation. This property makes GHRP-6 valuable in research into cachexia, anorexia, and disorders of appetite regulation.

Cardioprotective research has explored GHRP-6's protective effects in models of myocardial ischemia-reperfusion injury, with investigators reporting reduced infarct size and improved cardiac function parameters, potentially through anti-apoptotic and anti-inflammatory mechanisms independent of GH release.`
  },

  "22": {
    id: "22",
    refNumber: "268-70-GL",
    molecularWeight: "Multiple components",
    purity: "98%+ HPLC (each component)",
    alsoKnownAs: "GLOW Blend, BPC-TB-GHK Blend",
    storage: "Store lyophilized blend at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Tissue Repair", "Wound Healing", "Skin Research", "Anti-Inflammatory Research", "Angiogenesis"],
    description: `The GLOW BLEND 70mg combines BPC-157 (20mg), TB-500 (20mg), and GHK-Cu (30mg) in a single research vial. This triple combination targets complementary tissue repair, angiogenesis, and extracellular matrix remodeling pathways for synergistic research applications.`,
    longDescription: `What is the GLOW BLEND?

The GLOW BLEND is a proprietary combination of three well-researched peptides: BPC-157 (Body Protection Compound 157), TB-500 (Thymosin Beta-4 analogue), and GHK-Cu (Glycyl-L-Histidyl-L-Lysine Copper). Each component has been independently studied for tissue repair and regeneration, and their combination is investigated for potentially synergistic effects.

Component Overview

BPC-157 (20mg): A 15-amino acid cytoprotective peptide studied for tendon and ligament healing, GI protection, and angiogenesis via VEGF upregulation.

TB-500 (20mg): A synthetic analogue of Thymosin Beta-4, studied for cell migration, actin regulation, and wound healing via fibronectin and laminin receptor signaling.

GHK-Cu (30mg): A copper tripeptide that modulates over 4,000 genes related to wound healing, collagen synthesis, and antioxidant defense.

Research Rationale

The combination of these three peptides targets distinct but complementary pathways: BPC-157 promotes vascularization and receptor upregulation; TB-500 facilitates cellular migration and matrix reorganization; and GHK-Cu supports the genetic programs underlying tissue remodeling, anti-inflammation, and extracellular matrix maintenance. Researchers use multi-peptide blends to investigate whether combination approaches produce additive or synergistic tissue repair outcomes.`
  },

  "23": {
    id: "23",
    refNumber: "173-02-GO",
    casNumber: "33515-09-2",
    formula: "C₅₅H₇₅N₁₇O₁₃",
    molecularWeight: "1182.30 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "GnRH, Luteinizing Hormone-Releasing Hormone (LHRH), Gonadorelin Acetate",
    sequence: "pGlu-His-Trp-Ser-Tyr-Gly-Leu-Arg-Pro-Gly-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 2–4 minutes (endogenous), longer for synthetic",
    researchAreas: ["Reproductive Research", "Hormonal Research", "Fertility Research", "Hypothalamic-Pituitary Research"],
    description: `Gonadorelin is a synthetic form of gonadotropin-releasing hormone (GnRH), the hypothalamic peptide that controls the release of luteinizing hormone (LH) and follicle-stimulating hormone (FSH) from the anterior pituitary. It is investigated in reproductive biology, hormonal axis research, and fertility-related studies.`,
    longDescription: `What is Gonadorelin?

Gonadorelin is a synthetic decapeptide identical to endogenous gonadotropin-releasing hormone (GnRH), also known as luteinizing hormone-releasing hormone (LHRH). Secreted in pulses from the hypothalamic arcuate nucleus, GnRH acts on pituitary gonadotroph cells to stimulate the release of LH and FSH, which in turn regulate gonadal steroidogenesis and gametogenesis.

Gonadorelin Research

Reproductive research uses gonadorelin to study hypothalamic-pituitary-gonadal (HPG) axis function in male and female animal models. Pulsatile administration of gonadorelin mimics physiological GnRH release and stimulates gonadotropin secretion, while continuous administration induces receptor desensitization and gonadotropin suppression — a property exploited in therapeutic contexts.

Research in male models investigates the role of pulsatile LH stimulation in testosterone production, testicular function, and spermatogenesis. In female models, gonadorelin is used to study follicular development, ovulation induction, and luteal phase support. The peptide serves as an important research tool for understanding reproductive endocrinology and developing fertility-related interventions.`
  },

  "25": {
    id: "25",
    refNumber: "560-05-HX",
    casNumber: "140703-51-1",
    formula: "C₄₇H₅₈N₁₂O₆",
    molecularWeight: "887.05 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Growth Hormone-Releasing Hexapeptide",
    sequence: "His-D-2-MeTrp-Ala-Trp-D-Phe-Lys-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 60 minutes",
    researchAreas: ["Growth Hormone Research", "Cardiac Research", "Anti-Inflammatory Research", "Body Composition"],
    description: `Hexarelin is a synthetic hexapeptide GH secretagogue and GHS-R1a agonist. It is among the most potent GHRPs in terms of GH release capacity and is also investigated for direct cardioprotective and anti-inflammatory effects independent of GH secretion.`,
    longDescription: `What is Hexarelin?

Hexarelin is a synthetic hexapeptide GH secretagogue that acts as a potent agonist of the ghrelin receptor (GHS-R1a). It differs from other GHRPs in that it also binds to the CD36 scavenger receptor, which may underlie some of its direct cardiac and anti-inflammatory effects that appear independent of GH release.

Hexarelin Research

Growth hormone research documents that Hexarelin is among the most potent GHRPs for stimulating GH secretion on a per-mole basis. Synergistic GH release is observed when combined with GHRH analogues. However, repeated administration leads to more pronounced tachyphylaxis (reduced response) compared to GHRP-2, which is an important consideration in research protocol design.

Cardiac research has generated particular interest in Hexarelin. Studies in animal models of cardiomyopathy and ischemia-reperfusion injury have documented protective effects including reduced apoptosis, improved contractile function, and decreased fibrosis. These effects appear to be mediated at least in part through CD36 receptor binding rather than exclusively through GH release, suggesting direct myocardial protective mechanisms.

Anti-inflammatory research has investigated Hexarelin's ability to reduce pro-inflammatory cytokine expression, with investigators reporting reductions in TNF-α, IL-1β, and NF-κB signaling in treated tissues.`
  },

  "26": {
    id: "26",
    refNumber: "HGH-10-SO",
    casNumber: "12629-01-5",
    formula: "C₉₉₀H₁₅₂₈N₂₆₂O₃₀₀S₇",
    molecularWeight: "22124 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Human Growth Hormone, HGH, rHGH, Somatotropin",
    storage: "Store lyophilized at -20°C. After reconstitution, store at 4°C for up to 30 days.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in bacteriostatic water or sterile water",
    halfLife: "Approximately 3–4 hours",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Body Composition", "IGF-1 Research", "Anti-Aging"],
    description: `Somatropin HGH 10 IU is recombinant human growth hormone (191 amino acids), identical in sequence to pituitary-derived hGH. It is investigated for GH deficiency models, body composition, IGF-1 axis research, metabolic effects, and aging-related studies.`,
    longDescription: `What is Somatropin (HGH)?

Somatropin is recombinant human growth hormone, a 191-amino acid single-chain polypeptide that is identical in sequence to natural pituitary-derived hGH. Produced via recombinant DNA technology in bacterial or mammalian expression systems, somatropin is used extensively in research as the reference compound for studying growth hormone biology, its metabolic effects, and downstream IGF-1 signaling.

Somatropin Research

Growth hormone axis research uses somatropin to investigate GH receptor signaling, downstream JAK-STAT pathway activation, and IGF-1 production in the liver. Animal models of GH deficiency are commonly treated with somatropin to study the hormonal, metabolic, and structural effects of GH restoration.

Body composition research documents that somatropin administration promotes lipolysis, nitrogen retention, and lean mass preservation in animal models. Researchers have investigated these effects in models of aging, malnutrition, and muscle wasting disorders.

Metabolic research explores somatropin's complex effects on glucose homeostasis, including both insulin-sensitizing effects (via IGF-1) and insulin-antagonizing effects (direct GH receptor signaling). These opposing actions make GH an important research subject in insulin resistance and metabolic syndrome studies.

Anti-aging research investigates the age-related decline in GH and IGF-1 ("somatopause") and the effects of GH restoration on aging biomarkers, body composition, bone density, and quality-of-life parameters in aged animal models.`
  },

  "27": {
    id: "27",
    refNumber: "HGH-15-SO",
    casNumber: "12629-01-5",
    formula: "C₉₉₀H₁₅₂₈N₂₆₂O₃₀₀S₇",
    molecularWeight: "22124 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Human Growth Hormone, HGH, rHGH, Somatotropin",
    storage: "Store lyophilized at -20°C. After reconstitution, store at 4°C for up to 30 days.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 3–4 hours",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Body Composition", "IGF-1 Research"],
    description: `Somatropin HGH 15 IU is recombinant human growth hormone identical in sequence to pituitary hGH. Investigated in GH axis research, body composition studies, metabolic effects, and IGF-1 signaling experiments.`,
    longDescription: `What is Somatropin (HGH)?

Somatropin HGH 15 IU is recombinant human growth hormone (191 amino acids) for research use. The 15 IU format provides a mid-range quantity for research protocols. Studies use somatropin to investigate GH receptor signaling, IGF-1 production, body composition effects (lipolysis, nitrogen retention), metabolic modulation of glucose homeostasis, and the effects of GH restoration in aged or GH-deficient animal models.`
  },

  "28": {
    id: "28",
    refNumber: "HGH-24-SO",
    casNumber: "12629-01-5",
    formula: "C₉₉₀H₁₅₂₈N₂₆₂O₃₀₀S₇",
    molecularWeight: "22124 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Human Growth Hormone, HGH, rHGH, Somatotropin",
    storage: "Store lyophilized at -20°C. After reconstitution, store at 4°C for up to 30 days.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 3–4 hours",
    researchAreas: ["Growth Hormone Research", "Body Composition", "Anti-Aging Research", "Metabolic Research"],
    description: `Somatropin HGH 24 IU is recombinant human growth hormone for extended research protocols in GH biology, IGF-1 axis studies, body composition, and metabolic modulation.`,
    longDescription: `What is Somatropin (HGH)?

Somatropin HGH 24 IU provides a larger quantity of recombinant human growth hormone for extended research. Applications include GH receptor biology, downstream JAK-STAT and PI3K/Akt pathway investigation, IGF-1 liver production studies, body composition in GH-deficient models, anti-aging biomarker research, and metabolic studies on glucose and lipid homeostasis.`
  },

  "29": {
    id: "29",
    refNumber: "HGH-36-SO",
    casNumber: "12629-01-5",
    formula: "C₉₉₀H₁₅₂₈N₂₆₂O₃₀₀S₇",
    molecularWeight: "22124 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Human Growth Hormone, HGH, rHGH, Somatotropin",
    storage: "Store lyophilized at -20°C. After reconstitution, store at 4°C for up to 30 days.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 3–4 hours",
    researchAreas: ["Growth Hormone Research", "Body Composition", "Anti-Aging Research", "IGF-1 Research"],
    description: `Somatropin HGH 36 IU is a high-quantity format of recombinant human growth hormone for large-scale or long-duration research investigations into GH axis biology, body composition, aging, and metabolic function.`,
    longDescription: `What is Somatropin (HGH)?

Somatropin HGH 36 IU is recombinant human growth hormone identical to pituitary-derived hGH. The 36 IU vial is designed for high-demand research applications requiring large quantities of material. Research applications span the full spectrum of GH biology: receptor signaling, IGF-1 axis, body composition in deficiency and aging models, metabolic effects on glucose and lipid homeostasis, and investigations into the somatopause and its relationship to aging-associated changes.`
  },

  "30": {
    id: "30",
    refNumber: "LR3-01-IG",
    casNumber: "946870-92-4",
    formula: "C₄₀₀H₆₂₅N₁₁₁O₁₁₅S₉",
    molecularWeight: "9117.5 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Long R3 IGF-1, Insulin-like Growth Factor-1 Long R3, IGF-1 LR3",
    storage: "Store lyophilized at -20°C. After reconstitution, store at 4°C for up to 1 week.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in dilute acetic acid (0.1% AA), then dilute with neutral buffer",
    halfLife: "Approximately 20–30 hours",
    researchAreas: ["Muscle Research", "Anabolic Research", "Receptor Biology", "Metabolic Research", "Cellular Proliferation"],
    description: `IGF-1 LR3 (Long R3 IGF-1) is a recombinant analogue of insulin-like growth factor-1 with an N-terminal 13-amino acid extension and an Arg→Leu substitution at position 3. These modifications greatly reduce binding to IGF-binding proteins, extending half-life and enhancing potency compared to native IGF-1.`,
    longDescription: `What is IGF-1 LR3?

IGF-1 LR3 (Long R3 Insulin-like Growth Factor-1) is a synthetic analogue of human IGF-1 designed to have enhanced biological activity. The "Long R3" designation refers to two key modifications: (1) an additional 13-amino acid extension at the N-terminus, and (2) substitution of Arg at position 3 with Leu (R3L). Together, these changes dramatically reduce IGF-1 LR3's affinity for IGF-binding proteins (IGFBPs), which normally sequester IGF-1 and limit its bioavailability. The result is a dramatically longer half-life (~20–30 hours versus ~12–15 minutes for native IGF-1) and approximately 3-fold greater potency at the IGF-1 receptor.

IGF-1 LR3 Research

Muscle biology research uses IGF-1 LR3 to investigate the mechanistic pathways by which IGF-1 receptor activation promotes myoblast proliferation, differentiation, and hypertrophy. Studies have documented activation of the PI3K/Akt/mTOR pathway, which drives protein synthesis and muscle mass accrual, and suppression of FoxO3a-mediated atrophy programs.

Metabolic research explores IGF-1 LR3's insulin-like effects on glucose uptake, given that the IGF-1 receptor shares significant structural homology with the insulin receptor. Researchers must carefully distinguish IGF-1 receptor-mediated effects from insulin receptor cross-reactivity.

Cellular proliferation research investigates IGF-1 LR3 in vitro as a potent mitogen for numerous cell types including fibroblasts, osteoblasts, and chondrocytes, with applications in tissue engineering and regenerative biology research.`
  },

  "31": {
    id: "31",
    refNumber: "170-05-IP",
    casNumber: "170851-70-4",
    formula: "C₃₈H₄₉N₉O₅",
    molecularWeight: "711.87 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "NNC 26-0161, Ipamorelin Acetate",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 2 hours",
    researchAreas: ["Growth Hormone Research", "Body Composition", "Bone Research", "Anti-Aging Research"],
    description: `Ipamorelin is a selective pentapeptide GH secretagogue and GHS-R1a agonist. It is distinguished by its high selectivity — producing GH release with minimal effects on cortisol, prolactin, or ACTH — making it a valuable tool for clean GH stimulation research.`,
    longDescription: `What is Ipamorelin?

Ipamorelin is a synthetic pentapeptide growth hormone secretagogue that acts as a selective agonist of the ghrelin receptor (GHS-R1a). Developed by Novo Nordisk in the 1990s, Ipamorelin is notable for its selectivity profile: unlike GHRP-2 and GHRP-6, it produces minimal stimulation of cortisol, prolactin, and ACTH secretion, allowing researchers to study isolated GH effects without significant HPA axis interference.

Ipamorelin Research

Growth hormone research demonstrates that Ipamorelin stimulates pulsatile GH release in a dose-dependent manner. When combined with CJC-1295 No DAC or Sermorelin, synergistic GH pulses are produced. The selectivity of Ipamorelin for GH over other pituitary hormones has made it a preferred tool for research requiring minimal endocrine side effects.

Body composition research in rodent models has documented that Ipamorelin administration results in increased lean mass and reduced fat mass, with effects mediated through elevated GH and downstream IGF-1. Bone research has investigated increases in bone mineral density and osteoblast activity in animal models, suggesting potential applications in osteoporosis research.

Anti-aging research uses Ipamorelin to study restoration of age-related GH decline (somatopause), with investigators documenting improvements in body composition, sleep quality parameters, and metabolic markers in aged animals.`
  },

  "32": {
    id: "32",
    refNumber: "170-10-IP",
    casNumber: "170851-70-4",
    formula: "C₃₈H₄₉N₉O₅",
    molecularWeight: "711.87 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "NNC 26-0161, Ipamorelin Acetate",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 2 hours",
    researchAreas: ["Growth Hormone Research", "Body Composition", "Bone Research", "Anti-Aging Research"],
    description: `Ipamorelin 10mg is a selective pentapeptide GHS-R1a agonist that stimulates GH release with high selectivity and minimal effects on cortisol, prolactin, or ACTH. Ideal for clean GH stimulation research protocols.`,
    longDescription: `What is Ipamorelin?

Ipamorelin is a selective pentapeptide GH secretagogue with a unique selectivity profile among GHRPs. The 10mg format provides material for extended research protocols. Studies consistently document selective GH release with minimal HPA axis interference, synergistic effects with GHRH analogues, body composition improvements in animal models, bone mineral density effects, and potential anti-aging applications in aged animal models.`
  },

  "33": {
    id: "33",
    refNumber: "394-05-KP",
    casNumber: "388138-21-4",
    formula: "C₆₃H₈₃N₁₇O₁₄",
    molecularWeight: "1302.4 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "KP-10, Kisspeptin 10, Metastin 45-54",
    sequence: "Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Reproductive Research", "HPG Axis Research", "Hormonal Research"],
    description: `Kisspeptin-10 5mg (KP-10) is the C-terminal decapeptide of kisspeptin-54 and a potent KISS1R agonist. Investigated for GnRH stimulation, LH release, and hypothalamic-pituitary-gonadal axis regulation.`,
    longDescription: `What is Kisspeptin-10?

Kisspeptin-10 (KP-10) is the active C-terminal decapeptide fragment of kisspeptin-54. The 5mg format is suitable for in vitro studies and shorter in vivo protocols. Research demonstrates potent stimulation of GnRH neuron firing, reliable LH pulse induction, and investigation of HPG axis regulation, puberty onset mechanisms, and sex steroid feedback. Anti-metastatic properties in cancer models have also been investigated.`
  },

  "34": {
    id: "34",
    refNumber: "394-10-KP",
    casNumber: "388138-21-4",
    formula: "C₆₃H₈₃N₁₇O₁₄",
    molecularWeight: "1302.4 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "KP-10, Kisspeptin 10, Metastin 45-54",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Reproductive Research", "HPG Axis Research", "Hormonal Research"],
    description: `Kisspeptin-10 10mg is the C-terminal decapeptide of kisspeptin-54, a potent KISS1R agonist used in reproductive biology, GnRH regulation, and HPG axis research.`,
    longDescription: `What is Kisspeptin-10?

Kisspeptin-10 is the essential regulator of GnRH neuron activity and the HPG axis. This 10mg format supports extended in vivo research protocols requiring sustained peptide supply. The research applications are identical to other Kisspeptin-10 vials: GnRH stimulation, LH pulse induction, reproductive axis investigation, puberty research, and anti-metastatic cancer biology.`
  },

  "35": {
    id: "35",
    refNumber: "342-80-KB",
    molecularWeight: "Multiple components",
    purity: "98%+ HPLC (each component)",
    alsoKnownAs: "KLOW Blend, BPC-TB-KPV-GHK Blend",
    storage: "Store lyophilized blend at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Tissue Repair", "Anti-Inflammatory Research", "Wound Healing", "Skin Research", "Gut Health"],
    description: `The KLOW BLEND 80mg combines BPC-157 (10mg), TB-500 (10mg), KPV (10mg), and GHK-Cu (50mg) in a single research vial targeting tissue repair, anti-inflammatory, and skin regeneration pathways through four complementary mechanisms.`,
    longDescription: `What is the KLOW BLEND?

The KLOW BLEND is a four-peptide combination designed for research into comprehensive tissue repair, anti-inflammatory, and regenerative mechanisms. Each component contributes distinct but complementary biological activities.

Component Overview

BPC-157 (10mg): Body Protection Compound 157 — cytoprotective peptide studied for tendon/ligament healing, GI protection, and angiogenesis via VEGF upregulation.

TB-500 (10mg): Thymosin Beta-4 analogue — studied for actin regulation, cell migration, wound closure, and extracellular matrix reorganization.

KPV (10mg): Tripeptide (Lys-Pro-Val) derived from α-MSH — studied for anti-inflammatory, anti-fibrotic, and gut epithelial barrier protection properties via MC1R activation.

GHK-Cu (50mg): Copper tripeptide — studied for gene expression modulation (4000+ genes), collagen synthesis, antioxidant defense, and skin regeneration.

Research Rationale

The combination targets multiple complementary pathways: structural repair (BPC-157, TB-500), inflammation suppression (KPV, GHK-Cu), and matrix remodeling (GHK-Cu, BPC-157). Researchers investigating multi-modal tissue repair strategies may find this combination useful for studying whether synergistic outcomes can be achieved compared to single-peptide approaches.`
  },

  "37": {
    id: "37",
    refNumber: "654-10-KP",
    casNumber: "112965-21-6",
    formula: "C₁₇H₃₂N₆O₄",
    molecularWeight: "384.48 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Ac-KPV-NH₂, Lysine-Proline-Valine, α-MSH(11-13)",
    sequence: "Lys-Pro-Val",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Freely soluble in water",
    researchAreas: ["Anti-Inflammatory Research", "Gut Health Research", "IBD Research", "Wound Healing", "Fibrosis Research"],
    description: `KPV (Lys-Pro-Val) is a C-terminal tripeptide of α-melanocyte-stimulating hormone (α-MSH) that retains the anti-inflammatory and immunomodulatory properties of the parent hormone. It acts via MC1R and intracellular pathways to suppress NF-κB signaling and reduce pro-inflammatory cytokine production.`,
    longDescription: `What is KPV?

KPV is the C-terminal tripeptide (Lys-Pro-Val) of alpha-melanocyte-stimulating hormone (α-MSH), an endogenous neuropeptide with potent anti-inflammatory and immunomodulatory properties. This small tripeptide retains the core biological activities of α-MSH, including the ability to suppress pro-inflammatory cytokine production, while being significantly smaller and potentially more accessible to tissues.

KPV Research

Anti-inflammatory research has demonstrated that KPV suppresses NF-κB nuclear translocation in macrophages, dendritic cells, and epithelial cells, reducing production of TNF-α, IL-1β, IL-6, and other pro-inflammatory mediators. The mechanism involves both MC1R (melanocortin receptor 1) activation and direct intracellular signaling through inhibition of IκB kinase.

Gut health research has shown KPV's potential in inflammatory bowel disease (IBD) models. Studies in murine colitis models report reduced intestinal inflammation, improved epithelial barrier integrity, and decreased mucosal damage with KPV administration. The peptide appears to act both luminally (in the gut lumen) and systemically.

Wound healing research has documented KPV's ability to reduce inflammation in wound beds while promoting healing, with investigators reporting accelerated re-epithelialization and reduced scar formation in animal models.

Fibrosis research has investigated KPV's anti-fibrotic potential, with studies showing reduced collagen deposition and myofibroblast activation in models of lung and liver fibrosis.`
  },

  "38": {
    id: "38",
    refNumber: "115-05-LL",
    casNumber: "154947-66-7",
    formula: "C₂₀₅H₃₄₀N₆₀O₅₃",
    molecularWeight: "4493.3 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "CAP-18, Cathelicidin, Human Cathelicidin LL-37, hCAP18/LL-37",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Minutes in plasma",
    researchAreas: ["Antimicrobial Research", "Immune Research", "Wound Healing", "Angiogenesis", "Antiviral Research"],
    description: `LL-37 is the only human cathelicidin antimicrobial peptide, derived from the C-terminus of the precursor protein hCAP18. It exhibits broad-spectrum antimicrobial activity, immunomodulatory properties, and roles in wound healing, angiogenesis, and innate immune defense.`,
    longDescription: `What is LL-37?

LL-37 is the sole cathelicidin antimicrobial peptide identified in humans, generated by protease cleavage of the precursor protein hCAP18. Produced primarily by neutrophils, macrophages, mast cells, and epithelial cells at sites of infection or inflammation, LL-37 represents a key component of the innate immune defense system. Its name derives from its 37-amino acid length and the two leucine (L) residues at its N-terminus.

LL-37 Structure

LL-37 adopts an amphipathic alpha-helical conformation when interacting with bacterial membranes. This structure allows it to insert into and disrupt the lipid bilayer of bacteria, causing membrane permeabilization and cell death. The amphipathic helix also mediates LL-37's interactions with host cell receptors, including FPRL1 (formyl peptide receptor-like 1) and various Toll-like receptor pathways.

LL-37 Research

Antimicrobial research has documented LL-37's broad-spectrum activity against gram-positive and gram-negative bacteria, fungi, and some enveloped viruses. Its membrane-disrupting mechanism means it retains activity against many antibiotic-resistant organisms, generating significant interest in antimicrobial resistance research.

Immunomodulatory research has established that LL-37 modulates both innate and adaptive immune responses. It acts as a chemoattractant for neutrophils, monocytes, and T cells, and modulates dendritic cell maturation and function. Research has investigated its roles in inflammation resolution and immune tolerance.

Wound healing research has documented angiogenic properties (stimulating VEGF and FGF-2 production), keratinocyte migration, and re-epithelialization in wound models. Angiogenesis research has shown that LL-37 promotes new blood vessel formation through endothelial cell activation.`
  },

  "39": {
    id: "39",
    refNumber: "01-55-MT",
    casNumber: "75921-69-6",
    formula: "C₇₈H₁₁₁N₂₁O₁₉",
    molecularWeight: "1646.87 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Afamelanotide, MT-I, Melanotan I, NDP-α-MSH",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 60 minutes (free peptide) to 22 days (depot formulation)",
    researchAreas: ["Melanogenesis Research", "Skin Photoprotection", "Pigmentation Research", "MC1R Biology"],
    description: `Melanotan 1 (MT-1, Afamelanotide) is a synthetic analogue of α-MSH with enhanced receptor affinity. It activates melanocortin receptors (MC1R and MC4R) to stimulate melanogenesis, and is investigated for photoprotection, pigmentation biology, and erythropoietic protoporphyria research.`,
    longDescription: `What is Melanotan 1?

Melanotan 1 (MT-1), also known as Afamelanotide, is a synthetic linear analogue of alpha-melanocyte-stimulating hormone (α-MSH). It contains the NDP modification (Nle⁴, D-Phe⁷) that significantly increases its receptor binding affinity and proteolytic stability compared to native α-MSH. MT-1 primarily activates MC1R, the main receptor on melanocytes that drives eumelanin production and skin pigmentation.

Melanotan 1 Research

Melanogenesis research has documented that MT-1 activates MC1R on melanocytes, triggering a cAMP-mediated signaling cascade that upregulates the transcription factor MITF (Microphthalmia-associated transcription factor). MITF drives expression of melanogenic enzymes including tyrosinase, TRP-1, and TRP-2, resulting in increased eumelanin production and darkening of the skin.

Photoprotection research has investigated MT-1 as a means of enhancing natural UV protection. Eumelanin, produced in response to MT-1, is a more effective UV absorber and antioxidant than phaeomelanin, and research has explored whether MT-1-induced melanogenesis can reduce UV-induced DNA damage and skin cancer risk.

Erythropoietic protoporphyria (EPP) research has explored MT-1 (as afamelanotide) to increase photoprotection in this rare photosensitivity disorder, with clinical studies demonstrating increased sun exposure tolerance without pain in affected patients.`
  },

  "40": {
    id: "40",
    refNumber: "01-59-MT",
    casNumber: "121062-08-6",
    formula: "C₅₀H₆₉N₁₅O₉",
    molecularWeight: "1024.20 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "MT-II, Melanotan II, MTII",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 1 hour",
    researchAreas: ["Melanogenesis Research", "Sexual Function Research", "Appetite Research", "MC Receptor Biology"],
    description: `Melanotan 2 (MT-2) is a cyclic synthetic analogue of α-MSH with broad melanocortin receptor activity (MC1R, MC3R, MC4R, MC5R). It is investigated for melanogenesis, sexual arousal mechanisms, appetite suppression, and melanocortin receptor biology.`,
    longDescription: `What is Melanotan 2?

Melanotan 2 (MT-2) is a cyclic synthetic heptapeptide analogue of α-MSH. Its cyclic structure (formed by a lactam bridge between Asp⁵ and Lys¹⁰ of the parent α-MSH sequence) and NDP modification confer greater proteolytic stability and receptor affinity than native α-MSH. Unlike Melanotan 1, MT-2 activates not only MC1R but also MC3R, MC4R, and MC5R, resulting in a broader biological profile.

Melanotan 2 Research

Melanogenesis research documents robust activation of MC1R on melanocytes, driving eumelanin synthesis and skin darkening. The mechanism is identical to MT-1 but with potentially different kinetics and receptor selectivity profiles.

Sexual function research has investigated MT-2's role in mediating penile erection in male animal models via MC4R activation in the CNS. Studies in rodents and primates demonstrate that central MC4R agonism triggers autonomic pathways leading to erectile response, independent of direct peripheral vascular effects.

Appetite research explores MC4R-mediated anorexigenic signaling in the hypothalamus, with MT-2 reducing food intake in animal models. This has prompted investigation of the melanocortin system as a target for obesity research.

MC receptor biology research uses MT-2 as a tool to understand the differential roles of MC3R, MC4R, and MC5R in energy homeostasis, immune modulation, and inflammatory signaling.`
  },

  "43": {
    id: "43",
    refNumber: "85-345-MT",
    casNumber: "1627580-64-6",
    formula: "C₁₀₁H₁₅₂N₂₈O₂₂S₂",
    molecularWeight: "2174.64 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Mitochondrial Open Reading Frame of the 12S rRNA-c, MOTS-c",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    researchAreas: ["Mitochondrial Research", "Metabolic Research", "Longevity Research", "Exercise Physiology", "Insulin Sensitivity"],
    description: `MOTS-C is a 16-amino acid mitochondria-derived peptide encoded within the 12S ribosomal RNA gene of mitochondrial DNA. It acts as a mitochondrial signal to the nucleus, regulating metabolic homeostasis, insulin sensitivity, and stress responses.`,
    longDescription: `What is MOTS-C?

MOTS-C (Mitochondrial Open Reading Frame of the 12S rRNA-c) is a 16-amino acid peptide encoded within the 12S rRNA gene of mitochondrial DNA. Its discovery established a new class of biologically active mitochondria-derived peptides (MDPs), demonstrating that mitochondria can communicate physiological signals to the rest of the cell and even to other organs. MOTS-C levels in circulation decline with age, paralleling the decline in mitochondrial function.

MOTS-C Research

Metabolic research has established MOTS-C as a regulator of glucose and lipid homeostasis. Studies show that MOTS-C activates AMPK in skeletal muscle and other tissues, promoting fatty acid oxidation and glucose uptake. In mouse models of diet-induced obesity, MOTS-C administration reduces adiposity, improves insulin sensitivity, and prevents metabolic syndrome.

Exercise physiology research documents that MOTS-C levels increase in skeletal muscle following exercise, suggesting it may mediate some of exercise's metabolic benefits. Studies have investigated MOTS-C as a potential exercise mimetic, with researchers noting improvements in exercise capacity and muscle metabolism in treated animal models.

Longevity research has investigated MOTS-C's role in aging, with studies in mouse models showing that MOTS-C administration extends median lifespan when treatment begins in middle age. Investigators propose that MOTS-C acts as a mitohormesis signal, helping cells adapt to mitochondrial stress in ways that promote long-term health and longevity.

Insulin sensitivity research has demonstrated that MOTS-C activates the AMPK-AICAR pathway and promotes GLUT4 translocation, improving glucose uptake in insulin-resistant cellular and animal models.`
  },

  "44": {
    id: "44",
    refNumber: "85-345-MT",
    casNumber: "1627580-64-6",
    formula: "C₁₀₁H₁₅₂N₂₈O₂₂S₂",
    molecularWeight: "2174.64 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "MOTS-c, Mitochondrial Open Reading Frame of the 12S rRNA-c",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Mitochondrial Research", "Metabolic Research", "Longevity Research", "Exercise Physiology"],
    description: `MOTS-C 20mg is a mitochondria-derived peptide (MDP) that signals between mitochondria and the nucleus to regulate metabolic homeostasis, AMPK activation, insulin sensitivity, and longevity-associated pathways.`,
    longDescription: `What is MOTS-C?

MOTS-C is encoded within mitochondrial DNA and acts as a metabolic regulator signal from mitochondria to the nucleus and other organs. The 20mg format supports extended research protocols. Studies document AMPK activation, improved insulin sensitivity, anti-obesity effects in diet-induced obesity models, exercise performance enhancement, and lifespan extension in aged mouse models. MOTS-C levels decline with age, making it an important subject in longevity and mitochondrial biology research.`
  },

  "45": {
    id: "45",
    refNumber: "85-345-MT",
    casNumber: "1627580-64-6",
    formula: "C₁₀₁H₁₅₂N₂₈O₂₂S₂",
    molecularWeight: "2174.64 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "MOTS-c, Mitochondrial Open Reading Frame of the 12S rRNA-c",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Mitochondrial Research", "Metabolic Research", "Longevity Research", "Exercise Physiology"],
    description: `MOTS-C 40mg is a large-format vial of the mitochondria-derived peptide for high-volume research into AMPK activation, metabolic homeostasis, insulin sensitivity, exercise physiology, and longevity mechanisms.`,
    longDescription: `What is MOTS-C?

MOTS-C 40mg provides the largest available format of this mitochondria-derived peptide for extensive research programs. MOTS-C regulates metabolic homeostasis through AMPK activation and mitochondrial retrograde signaling. Research consistently documents improvements in insulin sensitivity, body composition, exercise capacity, and markers of cellular stress resistance. Its age-dependent decline makes it a key research subject in mitochondrial biology and aging science.`
  },

  "46": {
    id: "46",
    refNumber: "960-05-NA",
    casNumber: "307297-39-8",
    formula: "C₁₄H₂₂N₄O₉",
    molecularWeight: "394.35 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "NA-Epithalon, N-Acetyl-Epitalon Amidate, Acetyl Epitalon Amide",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Longevity Research", "Telomere Biology", "Anti-Aging Research", "Pineal Research"],
    description: `N-Acetyl Epithalon Amidate is a modified form of Epithalon (Ala-Glu-Asp-Gly) with N-terminal acetylation and C-terminal amidation to enhance stability and lipophilicity. Investigated for telomerase activation, telomere maintenance, and longevity-associated mechanisms.`,
    longDescription: `What is N-Acetyl Epithalon Amidate?

N-Acetyl Epithalon Amidate is a chemically modified analogue of Epithalon (Ala-Glu-Asp-Gly). The N-terminal acetyl group and C-terminal amide modification increase the peptide's proteolytic stability, reduce charge, and may enhance membrane permeability compared to unmodified Epithalon. These structural changes are intended to improve bioavailability while preserving the core biological activity of the parent peptide.

Research Profile

Research investigating N-Acetyl Epithalon Amidate draws from the substantial literature on Epithalon itself, which includes telomerase (hTERT) activation, telomere elongation in aged cells, restoration of age-related melatonin decline, and longevity-associated outcomes in animal models. The amidate form is hypothesized to provide these benefits with potentially improved pharmacokinetics due to its enhanced structural stability.`
  },

  "47": {
    id: "47",
    refNumber: "77-65-NA",
    casNumber: "2212313-10-6",
    formula: "C₃₅H₅₉N₁₁O₁₁",
    molecularWeight: "793.92 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "N-Acetyl Selank Amidate, NA-Selank, Tuftsin analogue",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Nootropic Research", "Anxiety Research", "Cognitive Research", "Immune Research"],
    description: `N-Acetyl Selank Amidate is a modified form of Selank (an analogue of the immunomodulatory peptide Tuftsin) with N-acetyl and C-terminal amide modifications for enhanced stability. Investigated for anxiolytic, cognitive, and immunomodulatory properties.`,
    longDescription: `What is N-Acetyl Selank Amidate?

N-Acetyl Selank Amidate is a modified derivative of Selank, which is itself an analogue of the endogenous Tuftsin tetrapeptide (Thr-Lys-Pro-Arg). The acetyl and amidate modifications are designed to increase proteolytic stability and potentially enhance BBB (blood-brain barrier) permeability compared to unmodified Selank. Research draws from the broader literature on Selank and Tuftsin biology.

Research Profile

Anxiety research documents Selank's anxiolytic properties in rodent models, with investigators reporting reduced anxiety-like behaviors comparable to benzodiazepine reference compounds but without significant sedation or dependence in animal studies. The mechanism may involve modulation of GABA receptors and enkephalin-degrading enzyme inhibition.

Cognitive research has documented improvements in learning, memory consolidation, and attention in animal models. Investigators propose modulation of BDNF levels and dopaminergic/serotonergic neurotransmitter balance as potential mechanisms.

Immune research examines Selank's immunomodulatory roots from Tuftsin biology, including effects on macrophage activity, NK cell function, and cytokine balance, with the N-acetyl amidate form investigated for potentially enhanced stability in these contexts.`
  },

  "48": {
    id: "48",
    refNumber: "96-34-NA",
    casNumber: "2920938-90-3",
    formula: "C₃₉H₅₃N₉O₁₁S",
    molecularWeight: "855.97 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "N-Acetyl Semax Amidate, NA-Semax, Acetyl Semax NH2",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Nootropic Research", "Cognitive Enhancement Research", "Neuroprotective Research", "BDNF Research"],
    description: `N-Acetyl Semax Amidate is a double-modified form of Semax (Met-Glu-His-Phe-Pro-Gly-Pro) with N-acetyl and C-amide modifications for maximum stability and potency. Investigated for cognitive enhancement, BDNF upregulation, neuroprotection, and anxiolytic effects.`,
    longDescription: `What is N-Acetyl Semax Amidate?

N-Acetyl Semax Amidate (also written NA-Semax or Semax NH2) is a double-modified derivative of Semax, which is itself an ACTH(4-7) analogue developed at the Institute of Molecular Genetics in Moscow. Semax has the sequence Met-Glu-His-Phe-Pro-Gly-Pro. The N-terminal acetyl group and C-terminal amide protect the peptide against aminopeptidase and carboxypeptidase degradation respectively, extending its half-life and potentially increasing potency compared to unmodified Semax.

N-Acetyl Semax Amidate Research

Cognitive research has investigated Semax and its derivatives for improvements in learning, memory formation, and mental performance in animal models. Studies report enhanced spatial learning in maze tasks, improved attention and working memory, and increased synaptic plasticity markers.

BDNF research is a central focus of Semax investigation, with multiple studies documenting that Semax increases BDNF (Brain-Derived Neurotrophic Factor) mRNA and protein expression in the brain. BDNF is essential for neuronal survival, synaptic plasticity, and cognitive function, making BDNF upregulation a compelling mechanism for cognitive enhancement and neuroprotection.

Neuroprotective research has shown Semax reduces neuronal damage in models of stroke, hypoxia, and excitotoxicity, with investigators attributing effects to anti-inflammatory actions, reduced oxidative stress, and trophic factor upregulation.`
  },

  "49": {
    id: "49",
    refNumber: "38-33-ND",
    casNumber: "53-84-9",
    formula: "C₂₁H₂₇N₇O₁₄P₂",
    molecularWeight: "663.43 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Nicotinamide Adenine Dinucleotide, NAD, Coenzyme I",
    storage: "Store at -20°C, protected from light and moisture. Avoid repeated freeze-thaw cycles.",
    appearance: "White to off-white powder",
    solubility: "Freely soluble in water",
    halfLife: "Short in plasma; cellular uptake occurs via connexin hemichannels and CD38 pathways",
    researchAreas: ["Cellular Energy Research", "Aging Research", "Sirtuins Research", "Metabolic Research", "DNA Repair Research"],
    description: `NAD+ (Nicotinamide Adenine Dinucleotide) is an essential coenzyme found in all living cells, serving as a central mediator of energy metabolism and as a substrate for enzymes including sirtuins and PARP. NAD+ levels decline with age, generating strong research interest in its supplementation and biological roles.`,
    longDescription: `What is NAD+?

NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in all living cells and one of the most important molecules in cellular biology. It exists in two forms: NAD+ (oxidized) and NADH (reduced), and cycles between these states as it participates in hundreds of metabolic reactions. Beyond its classical role in energy metabolism, NAD+ serves as a substrate for several enzyme classes critical for cell signaling, DNA repair, and gene regulation.

NAD+ Research

Sirtuins research is a primary driver of NAD+ investigation. Sirtuins (SIRT1-7) are NAD+-dependent deacylases that regulate numerous aspects of cellular physiology including DNA repair, metabolism, inflammation, and lifespan. Research in multiple model organisms has linked sirtuin activity to longevity, and since sirtuins require NAD+ as a substrate (not just a cofactor), maintaining NAD+ levels is hypothesized to support sirtuin-mediated longevity pathways.

DNA repair research has documented that PARP enzymes (Poly(ADP-Ribose) Polymerases), which consume large amounts of NAD+ during DNA damage repair, are essential for genomic stability. The competition between PARP and sirtuins for NAD+ creates a functional link between DNA damage, NAD+ depletion, and sirtuin activity.

Aging research consistently documents that NAD+ levels in tissues decline with age, and this decline has been proposed as a driver of age-associated metabolic dysfunction. Research with NAD+ precursors (NMN, NR) and direct NAD+ supplementation in animal models has shown improvements in mitochondrial function, metabolic markers, and several aging-related parameters.`
  },

  "50": {
    id: "50",
    refNumber: "01-54-OX",
    casNumber: "50-56-6",
    formula: "C₄₃H₆₆N₁₂O₁₂S₂",
    molecularWeight: "1007.19 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "OT, Oxytocin acetate",
    sequence: "Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 1–6 minutes in plasma",
    researchAreas: ["Social Behavior Research", "Reproductive Research", "Anxiety Research", "Pain Research", "Cardiovascular Research"],
    description: `Oxytocin is a nine-amino acid neuropeptide produced in the hypothalamus and released by the posterior pituitary. It is investigated for roles in social bonding, reproductive function, anxiety modulation, pain perception, and cardiovascular regulation.`,
    longDescription: `What is Oxytocin?

Oxytocin is a cyclic nonapeptide synthesized in hypothalamic paraventricular and supraoptic nuclei. It is released both peripherally (into the bloodstream via the posterior pituitary) and centrally (as a neuromodulator throughout the brain). Oxytocin has been called the "bonding hormone" due to its established roles in social behavior and pair bonding, but its biological functions extend far beyond social neuroscience.

Oxytocin Research

Social behavior research has extensively documented oxytocin's role in affiliative behaviors, social recognition, trust, and parental bonding. Studies in rodents and non-human primates show that central oxytocin signaling promotes approach behaviors, reduces social fear, and facilitates recognition of familiar individuals.

Reproductive research investigates oxytocin's classic roles in uterine contraction during labor, milk ejection during lactation, and sperm motility. Research also examines oxytocin's role in pair bonding in monogamous species through its interactions with dopaminergic reward circuits.

Anxiety research has documented anxiolytic effects of central oxytocin in numerous animal paradigms, with proposed mechanisms including modulation of amygdala reactivity, HPA axis dampening, and inhibitory interneuron regulation.

Pain research explores oxytocin's analgesic properties, with investigators documenting reduced pain responses in animal models following central or peripheral oxytocin administration, potentially through opioid and serotonergic pathway interactions.`
  },

  "51": {
    id: "51",
    refNumber: "01-54-OX",
    casNumber: "50-56-6",
    formula: "C₄₃H₆₆N₁₂O₁₂S₂",
    molecularWeight: "1007.19 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "OT, Oxytocin acetate",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Social Behavior Research", "Reproductive Research", "Anxiety Research", "Pain Research"],
    description: `Oxytocin 10mg is a larger format vial of the nine-amino acid neuropeptide investigated for social bonding, reproductive biology, anxiety modulation, pain perception, and cardiovascular regulation.`,
    longDescription: `What is Oxytocin?

Oxytocin 10mg provides an extended supply of the neuropeptide for longer research protocols. Oxytocin's research applications span social behavior and bonding, reproductive physiology (labor, lactation, pair bonding), anxiety modulation via amygdala signaling, pain research, and cardiovascular effects including blood pressure regulation and cardioprotection in ischemia models.`
  },

  "52": {
    id: "52",
    refNumber: "21-09-PS",
    casNumber: "N/A",
    formula: "C₃₀H₅₄N₆O₅",
    molecularWeight: "578.3 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "CDKN1A peptide, CAP20, P021 peptide",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Cognitive Research", "Alzheimer's Research", "Neuroprotection", "Tau Protein Research", "Cell Cycle Research"],
    description: `P21 is a cyclin-dependent kinase inhibitor-derived peptide investigated for neuroprotective and cognitive-enhancing properties. Research explores its effects on tau phosphorylation, synaptic plasticity, BDNF expression, and neurodegeneration models.`,
    longDescription: `What is P21?

P21 (also referenced as CDKN1A or CAP20 peptide) is a peptide derived from the p21 cell cycle protein, which is encoded by the CDKN1A gene. In the context of neuroscience research, P21 and its analogue P021 have been investigated as potential neuroprotective agents, particularly in the context of Alzheimer's disease pathology.

P21 Research

Alzheimer's research has investigated P21/P021 for its ability to reduce aberrant tau phosphorylation. Hyperphosphorylated tau forms the neurofibrillary tangles characteristic of Alzheimer's disease, and research suggests that certain peptide-based interventions targeting the CDK5/p25 pathway may reduce pathological tau modification.

BDNF research documents that P021 increases BDNF expression in neuronal cultures and animal models, with investigators observing improvements in synaptic plasticity and cognitive performance in transgenic Alzheimer's mouse models. BDNF upregulation is associated with improved learning, memory, and neuronal survival.

Cognitive research has used P21 peptides as research tools to investigate links between cell cycle regulation, trophic factor signaling, and cognitive function, providing insights into the intersection of aging biology and neurodegenerative disease.`
  },

  "53": {
    id: "53",
    refNumber: "01-33-PR",
    casNumber: "1801959-12-5",
    formula: "C₃₅H₅₅N₁₁O₉",
    molecularWeight: "773.89 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "PE-22-28, Spadin analogue",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Antidepressant Research", "Cognitive Research", "TREK-1 Channel Research", "Neuroplasticity Research"],
    description: `PE-22-28 is a synthetic hexapeptide analogue of spadin, designed as a selective antagonist of the TREK-1 potassium channel. It is investigated for rapid antidepressant effects, cognitive enhancement, and neuroplasticity in preclinical models.`,
    longDescription: `What is PE-22-28?

PE-22-28 is a synthetic optimized analogue of spadin, a shorter peptide derived from the propeptide of neurotensin receptor 3 (NTS3/sortilin). Spadin was identified as the first endogenous antagonist of the TREK-1 (TWIK-related potassium channel 1) two-pore domain potassium channel. TREK-1 plays a role in neuronal excitability and is implicated in depression, pain, and anesthesia.

PE-22-28 Research

Antidepressant research demonstrates rapid antidepressant-like effects of PE-22-28 in rodent models, with onset of effects within hours rather than the weeks typically required for classical antidepressants. The mechanism involves TREK-1 channel blockade, which increases neuronal excitability and promotes hippocampal neurogenesis — a key feature of effective antidepressant action.

Cognitive research has documented improvements in memory and learning in animal models, potentially through enhanced hippocampal synaptic plasticity and BDNF upregulation following TREK-1 antagonism.

TREK-1 channel research uses PE-22-28 as a selective research tool to investigate the role of this two-pore domain channel in mood regulation, nociception, and neurological function, providing insights into new classes of potential neuropsychiatric research targets.`
  },

  "54": {
    id: "54",
    refNumber: "23-59-MG",
    casNumber: "108174-48-7",
    formula: "C₁₂₁H₂₀₀N₄₂O₃₉",
    molecularWeight: "8637.7 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Pegylated Mechano Growth Factor, PEGylated MGF, PEG-MGF",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Significantly extended vs. unPEGylated MGF (days vs. minutes)",
    researchAreas: ["Muscle Research", "Satellite Cell Research", "Tissue Repair", "Cardiac Research"],
    description: `PEG MGF (Pegylated Mechano Growth Factor) is a PEGylated analogue of the IGF-1 splice variant MGF, designed to extend half-life from minutes to days. Investigated for muscle satellite cell activation, myofiber repair, and cardiac muscle research.`,
    longDescription: `What is PEG MGF?

PEG MGF (Pegylated Mechano Growth Factor) is a modified analogue of Mechano Growth Factor (MGF), which is a splice variant of IGF-1 produced in muscle tissue in response to mechanical stress or damage. The native MGF has an extremely short half-life of approximately 5–7 minutes in blood due to rapid enzymatic degradation. PEGylation (attachment of polyethylene glycol) dramatically extends the half-life to days, making systemic research protocols feasible.

PEG MGF Research

Muscle satellite cell research has documented that MGF signals to quiescent muscle satellite cells (muscle stem cells) to activate, proliferate, and differentiate into new myofibers following muscle damage. Research suggests MGF is one of the primary local repair signals following mechanical stress or injury, with PEG MGF allowing investigation of this process via systemic administration.

Muscle repair research has shown that PEG MGF promotes myoblast proliferation and fusion, accelerating recovery from muscle injury in animal models. Investigators have compared PEG MGF with IGF-1 and noted distinct downstream signaling profiles and cell population specificity.

Cardiac research has investigated MGF's role in cardiomyocyte protection and repair, with studies suggesting that MGF signaling in the heart may promote myocardial repair following ischemic injury, providing a potential research avenue in cardiac regenerative biology.`
  },

  "56": {
    id: "56",
    refNumber: "44-54-RT",
    casNumber: "2381089-83-2",
    formula: "C₂₂₃H₃₄₃F₃N₄₆O₇₀",
    molecularWeight: "4731.33 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3437943, Retatrutide",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 6 days (fatty acid modification)",
    researchAreas: ["Obesity Research", "Weight Management", "Metabolic Research", "GLP-1 Research", "GIP Research", "Glucagon Research"],
    description: `Retatrutide (LY3437943) is a triple agonist of GLP-1, GIP, and glucagon receptors under investigation for obesity, weight management, and metabolic disorder research. Its triple-receptor activity may produce greater weight reduction than dual or single agonists.`,
    longDescription: `What is Retatrutide?

Retatrutide (LY3437943) is a synthetic peptide triple agonist that simultaneously activates three G protein-coupled receptors: the glucagon-like peptide-1 receptor (GLP-1R), the glucose-dependent insulinotropic polypeptide receptor (GIPR), and the glucagon receptor (GCGR). This triple mechanism is designed to capitalize on the complementary metabolic effects of each receptor system to achieve superior weight loss and metabolic improvement compared to single or dual agonists.

Retatrutide Research

Obesity research has investigated Retatrutide in phase 2 clinical trials, with results showing substantial percentage body weight reduction in subjects with obesity. The combination of GLP-1R agonism (appetite suppression and glucose control), GIPR agonism (complementary appetite and lipid effects), and GCGR agonism (thermogenesis, increased energy expenditure, and hepatic fat mobilization) is proposed to explain superior weight loss outcomes.

Metabolic research investigates the differential contributions of each receptor pathway to glucose homeostasis, lipid metabolism, and energy balance. The glucagon component increases hepatic glucose output, which the GLP-1 and GIP components counteract through insulin secretion enhancement, creating a complex interplay that researchers are actively characterizing.

Weight management research positions Retatrutide as potentially the most potent GLP-1 class agent studied, with clinical data suggesting weight reduction exceeding that of semaglutide or tirzepatide (dual agonist) alone.`
  },

  "57": {
    id: "57",
    refNumber: "44-54-RT",
    casNumber: "2381089-83-2",
    formula: "C₂₂₃H₃₄₃F₃N₄₆O₇₀",
    molecularWeight: "4731.33 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3437943",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    halfLife: "Approximately 6 days",
    researchAreas: ["Obesity Research", "Weight Management", "Metabolic Research", "Triple Agonist Research"],
    description: `Retatrutide 20mg is a larger vial of the triple GLP-1/GIP/glucagon receptor agonist for extended metabolic, obesity, and weight management research protocols.`,
    longDescription: `What is Retatrutide?

Retatrutide (LY3437943) is a triple receptor agonist of GLP-1R, GIPR, and GCGR, with fatty acid modification enabling weekly dosing research. The 20mg format supports extended study protocols. Research documents exceptional weight loss potential through combined appetite suppression, enhanced insulin secretion, thermogenesis, and hepatic fat mobilization, positioning it among the most investigated next-generation metabolic peptides.`
  },

  "58": {
    id: "58",
    refNumber: "44-54-RT",
    casNumber: "2381089-83-2",
    formula: "C₂₂₃H₃₄₃F₃N₄₆O₇₀",
    molecularWeight: "4731.33 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3437943",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    researchAreas: ["Obesity Research", "Weight Management", "Metabolic Research"],
    description: `Retatrutide 30mg is a triple GLP-1/GIP/glucagon receptor agonist vial supporting high-volume obesity and metabolic research programs.`,
    longDescription: `What is Retatrutide?

Retatrutide 30mg provides a high-quantity format of this triple receptor agonist. Research in obesity, metabolic disorders, and weight management benefits from larger quantities for multi-cohort studies. All properties are identical to smaller vials: GLP-1R, GIPR, and GCGR triple agonism with ~6-day half-life enabling weekly research dosing protocols.`
  },

  "59": {
    id: "59",
    refNumber: "44-54-RT",
    casNumber: "2381089-83-2",
    formula: "C₂₂₃H₃₄₃F₃N₄₆O₇₀",
    molecularWeight: "4731.33 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3437943",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    researchAreas: ["Obesity Research", "Weight Management", "Metabolic Research"],
    description: `Retatrutide 40mg is a high-quantity vial of the triple GLP-1/GIP/glucagon receptor agonist for large-scale or multi-cohort obesity and metabolic research.`,
    longDescription: `What is Retatrutide?

Retatrutide 40mg supports large-scale research requiring substantial peptide quantities. This triple agonist (GLP-1R, GIPR, GCGR) has demonstrated remarkable weight loss potential in clinical investigations, making it one of the most actively researched metabolic peptides. The 40mg format accommodates extended or large-cohort study designs.`
  },

  "60": {
    id: "60",
    refNumber: "44-54-RT",
    casNumber: "2381089-83-2",
    formula: "C₂₂₃H₃₄₃F₃N₄₆O₇₀",
    molecularWeight: "4731.33 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3437943",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    researchAreas: ["Obesity Research", "Weight Management", "Metabolic Research"],
    description: `Retatrutide 50mg is a research-scale quantity of the triple GLP-1/GIP/glucagon agonist supporting comprehensive metabolic and obesity research programs.`,
    longDescription: `What is Retatrutide?

Retatrutide 50mg provides substantial research material for the triple GLP-1R/GIPR/GCGR agonist. Research investigations consistently position retatrutide among the most potent next-generation metabolic peptides due to its combined appetite suppression, enhanced insulin secretion, thermogenesis, and hepatic fat mobilization pathways.`
  },

  "61": {
    id: "61",
    refNumber: "44-54-RT",
    casNumber: "2381089-83-2",
    formula: "C₂₂₃H₃₄₃F₃N₄₆O₇₀",
    molecularWeight: "4731.33 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3437943",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    researchAreas: ["Obesity Research", "Weight Management", "Metabolic Research"],
    description: `Retatrutide 60mg is the largest available vial of this triple GLP-1/GIP/glucagon receptor agonist for high-demand obesity and metabolic research programs.`,
    longDescription: `What is Retatrutide?

Retatrutide 60mg provides the largest available quantity per vial of this triple receptor agonist. Designed for high-volume or long-duration research programs, this format ensures uninterrupted supply for comprehensive metabolic, obesity, and weight management studies. Triple agonist activity at GLP-1R, GIPR, and GCGR delivers complementary metabolic mechanisms in a single compound.`
  },

  "62": {
    id: "62",
    refNumber: "77-54-NA",
    casNumber: "129954-34-3",
    formula: "C₃₃H₅₇N₁₁O₁₉",
    molecularWeight: "751.87 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Selank, TP-7, Threonine-Lysine-Proline-Arginine-Proline-Glycine-Proline, Tuftsin analogue",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 3 minutes (plasma); intranasal administration extends effective duration",
    researchAreas: ["Anxiolytic Research", "Cognitive Research", "Nootropic Research", "Immune Research", "Depression Research"],
    description: `Selank is a synthetic heptapeptide analogue of Tuftsin (Thr-Lys-Pro-Arg) with an additional Pro-Gly-Pro C-terminal extension for enhanced stability. Investigated for anxiolytic, nootropic, and immunomodulatory properties in preclinical models.`,
    longDescription: `What is Selank?

Selank (TP-7) is a synthetic heptapeptide developed at the Institute of Molecular Genetics of the Russian Academy of Sciences. It is based on the sequence of Tuftsin (Thr-Lys-Pro-Arg), an endogenous immunomodulatory tetrapeptide derived from IgG, with a C-terminal extension (Pro-Gly-Pro) that increases metabolic stability. Selank has been extensively studied in Russian preclinical research for anxiolytic, nootropic, and immunomodulatory properties.

Selank Research

Anxiolytic research documents Selank's ability to reduce anxiety-like behaviors in rodent models including the open field, elevated plus maze, and Vogel conflict tests. Unlike benzodiazepines, Selank does not appear to impair cognitive function, cause sedation, or produce dependence in animal studies. The mechanism may involve GABA receptor modulation and inhibition of enkephalin-degrading enzymes.

Cognitive and nootropic research has demonstrated improvements in learning consolidation, working memory, and attention in animal models. Investigators propose that Selank influences BDNF levels and dopaminergic/serotonergic neurotransmitter balance as contributing mechanisms.

Immune research examines Selank's Tuftsin-derived immunomodulatory properties, including effects on cytokine balance (reducing IL-6, increasing IL-2 in some models), macrophage activity, and NK cell function.

Depression research has explored antidepressant-like properties in animal models, with some investigators noting overlapping mechanisms between Selank's effects and those of classical antidepressants, without the typical side effect profiles.`
  },

  "63": {
    id: "63",
    refNumber: "268-59-SS",
    molecularWeight: "813.92 g/mol / 751.87 g/mol",
    purity: "98%+ HPLC (each component)",
    alsoKnownAs: "Semax-Selank Blend, Cognitive Blend",
    storage: "Store lyophilized blend at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Nootropic Research", "Cognitive Research", "Anxiety Research", "Neuroprotection"],
    description: `The Semax + Selank Blend 20mg combines Semax (10mg) and Selank (10mg) in a single vial for research into synergistic nootropic, anxiolytic, and neuroprotective effects. Both peptides modulate BDNF and neurotransmitter systems through distinct but complementary mechanisms.`,
    longDescription: `What is the Semax + Selank Blend?

This blend combines Semax (an ACTH(4-7) analogue with BDNF-upregulating and cognitive-enhancing properties) and Selank (a Tuftsin analogue with anxiolytic and immunomodulatory properties) in equal quantities (10mg each). The combination is investigated for potentially synergistic effects on cognitive function, mood regulation, and neuroprotection.

Research Rationale

Semax primarily acts through BDNF upregulation and neuroprotective mechanisms, enhancing cognitive performance and providing protection against neurological stress. Selank primarily targets anxiety reduction through GABAergic and enkephalinergic pathways while also improving cognition through neurotransmitter modulation. The combination may address both the performance-enhancing (Semax) and anxiety-reducing (Selank) dimensions simultaneously, providing a research tool for studying these overlapping neural systems.

Researchers investigating nootropic combinations, stress resilience, and neuroprotection may find this dual-peptide preparation useful for elucidating whether the two peptides interact synergistically, additively, or independently across various behavioral and neurochemical endpoints.`
  },

  "64": {
    id: "64",
    refNumber: "66-05-SM",
    casNumber: "80714-61-0",
    formula: "C₃₇H₅₁N₉O₁₀S",
    molecularWeight: "813.92 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "ACTH(4-7)-PGP, Semax, Met-Glu-His-Phe-Pro-Gly-Pro",
    sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 7 minutes in plasma; effects persist longer",
    researchAreas: ["Cognitive Research", "BDNF Research", "Neuroprotective Research", "Stroke Research", "Anxiety Research"],
    description: `Semax is a synthetic heptapeptide ACTH(4-7) analogue developed at the Institute of Molecular Genetics (Russia). It is investigated for cognitive enhancement, BDNF upregulation, neuroprotection in ischemia/stroke models, and anxiolytic effects.`,
    longDescription: `What is Semax?

Semax is a synthetic heptapeptide with the sequence Met-Glu-His-Phe-Pro-Gly-Pro, derived from residues 4–7 of adrenocorticotropic hormone (ACTH) with a C-terminal Pro-Gly-Pro extension that enhances stability. Originally developed at the Institute of Molecular Genetics of the Russian Academy of Sciences, Semax has been the subject of substantial research in cognitive function, neuroprotection, and neurological disorders.

Semax Research

BDNF research is central to understanding Semax's mechanisms. Multiple studies have documented that Semax administration increases BDNF mRNA and protein levels in hippocampus and other brain regions. Given BDNF's essential roles in neuronal survival, synaptic plasticity, and memory formation, this upregulation is proposed as a primary mechanism for Semax's cognitive and neuroprotective effects.

Cognitive research demonstrates improvements in spatial learning, attention, working memory, and information processing speed in animal models. Researchers have used Semax to investigate the relationship between ACTH fragment signaling, neurotrophic factor upregulation, and learning performance.

Stroke and ischemia research has documented neuroprotective effects of Semax in models of focal and global cerebral ischemia, with investigators reporting reduced infarct volume, improved neurological scores, and enhanced recovery. Anti-inflammatory and anti-apoptotic mechanisms have been proposed.

Anxiety research has documented anxiolytic-like effects in some rodent models, potentially through modulation of serotonergic and dopaminergic neurotransmitter systems in limbic areas.`
  },

  "65": {
    id: "65",
    refNumber: "03-09-SR",
    casNumber: "86168-78-7",
    formula: "C₁₄₉H₂₄₆N₄₄O₄₂S",
    molecularWeight: "3357.93 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "GHRH(1-29)NH₂, GRF(1-29)NH₂, Somatorelin",
    sequence: "Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 2–10 minutes (highly susceptible to DPP-IV cleavage)",
    researchAreas: ["Growth Hormone Research", "Pituitary Research", "GH Deficiency Research", "Body Composition", "Anti-Aging Research"],
    description: `Sermorelin (GHRH 1-29) is a synthetic analogue of the first 29 amino acids of endogenous growth hormone-releasing hormone (GHRH). It stimulates pituitary somatotrophs to produce and secrete GH in a physiological, pulsatile manner.`,
    longDescription: `What is Sermorelin?

Sermorelin (GHRH 1-29) is a synthetic 29-amino acid peptide comprising the biologically active N-terminal fragment of human growth hormone-releasing hormone (GHRH). GHRH is a hypothalamic peptide that acts on pituitary somatotrophs via a specific G protein-coupled receptor to stimulate the synthesis and pulsatile secretion of growth hormone. Sermorelin contains the full receptor-binding domain of GHRH and elicits equivalent GH secretion to the full-length 44-amino acid GHRH at comparable doses.

Sermorelin Research

Growth hormone research documents that Sermorelin stimulates pituitary GH secretion via a natural physiological pathway — the hypothalamic-pituitary axis — rather than bypassing it with exogenous GH administration. This approach preserves normal feedback mechanisms, including GH-induced inhibition of further GHRH release and stimulation of somatostatin. Research has investigated whether this preserved feedback regulation offers advantages over direct GH administration in terms of maintaining pituitary function and producing more physiological GH patterns.

Pituitary research uses Sermorelin to assess pituitary somatotroph reserve capacity. A blunted GH response to Sermorelin challenge indicates impaired pituitary function, providing a diagnostic tool in GH deficiency research models.

Body composition and anti-aging research has investigated Sermorelin's effects on lean mass, fat distribution, bone density, and markers of biological aging in animal models, drawing comparisons with direct GH administration.`
  },

  "66": {
    id: "66",
    refNumber: "05-51-MS",
    casNumber: "736992-21-5",
    formula: "C₃₂H₄₉N₉O₅",
    molecularWeight: "639.8 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Szeto-Schiller 31, D-Arg-Dmt-Lys-Phe-NH₂, Elamipretide",
    sequence: "D-Arg-Dmt-Lys-Phe-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 2 hours",
    researchAreas: ["Mitochondrial Research", "Cardioprotective Research", "Oxidative Stress Research", "Aging Research", "Renal Research"],
    description: `SS-31 (Szeto-Schiller 31, Elamipretide) is a mitochondria-targeted antioxidant tetrapeptide that localizes to the inner mitochondrial membrane and specifically interacts with cardiolipin. It is investigated for protecting mitochondrial function, reducing oxidative stress, and improving cellular bioenergetics in disease models.`,
    longDescription: `What is SS-31?

SS-31 (D-Arg-Dmt-Lys-Phe-NH₂), also known as Szeto-Schiller 31 or Elamipretide, is a cell-permeable tetrapeptide that was designed to selectively concentrate in the inner mitochondrial membrane (IMM). Its alternating aromatic/cationic structure drives uptake into mitochondria against the large negative membrane potential. Once localized to the IMM, SS-31 interacts directly with cardiolipin — a unique phospholipid essential for optimal electron transport chain (ETC) function and mitochondrial membrane integrity.

SS-31 Research

Mitochondrial research has established that SS-31's interaction with cardiolipin helps maintain the lipid's structural role in organizing ETC complexes into supercomplexes, which are critical for efficient electron transfer and reduced reactive oxygen species (ROS) leakage. Studies show SS-31 reduces mitochondrial ROS production and improves membrane potential without acting as a conventional antioxidant that scavenges free radicals.

Cardioprotective research has demonstrated that SS-31 reduces myocardial infarct size in ischemia-reperfusion models, improves cardiac function in heart failure models, and protects against doxorubicin-induced cardiomyopathy. The mechanism involves preservation of cardiolipin structure and ETC Complex I function.

Aging research has documented that SS-31 improves mitochondrial function in aged tissues, restoring bioenergetics toward more youthful parameters in skeletal muscle, heart, and kidney. Studies show improvements in exercise tolerance and physical performance in aged mouse models.

Renal research has investigated SS-31 in acute kidney injury models (cisplatin, ischemia-reperfusion), with investigators reporting reduced tubular cell death, preserved renal function, and reduced fibrosis.`
  },

  "67": {
    id: "67",
    refNumber: "05-51-MS",
    casNumber: "736992-21-5",
    formula: "C₃₂H₄₉N₉O₅",
    molecularWeight: "639.8 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Szeto-Schiller 31, Elamipretide, D-Arg-Dmt-Lys-Phe-NH₂",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Mitochondrial Research", "Cardioprotective Research", "Oxidative Stress Research", "Aging Research"],
    description: `SS-31 30mg is a larger-format vial of the mitochondria-targeted antioxidant tetrapeptide Elamipretide, designed for extended research protocols into mitochondrial cardiolipin interactions, ETC function, and cardioprotection.`,
    longDescription: `What is SS-31?

SS-31 (Elamipretide) is a cell-permeable tetrapeptide that localizes to the inner mitochondrial membrane via cardiolipin binding. The 30mg format supports extended research programs. Studies document reduction of mitochondrial ROS, preservation of ETC complex supercomplexes, cardioprotection in ischemia-reperfusion models, improved exercise tolerance in aged animals, and renal protection in acute kidney injury models.`
  },

  "68": {
    id: "68",
    refNumber: "05-51-MS",
    casNumber: "736992-21-5",
    formula: "C₃₂H₄₉N₉O₅",
    molecularWeight: "639.8 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Szeto-Schiller 31, Elamipretide",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Mitochondrial Research", "Cardioprotective Research", "Aging Research"],
    description: `SS-31 50mg is the largest available format of the mitochondria-targeted antioxidant tetrapeptide Elamipretide, for high-volume research into mitochondrial bioenergetics, cardioprotection, and aging.`,
    longDescription: `What is SS-31?

SS-31 50mg provides a high-volume supply of Elamipretide for comprehensive research programs. The cardiolipin-targeting tetrapeptide is among the most studied mitochondria-targeted therapeutics in preclinical research, with established efficacy in mitochondrial dysfunction models across cardiac, renal, muscular, and aging biology.`
  },

  "69": {
    id: "69",
    refNumber: "07-29-TB",
    casNumber: "476014-70-7",
    formula: "C₃₆H₆₆N₁₀O₁₃",
    molecularWeight: "846.97 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "TB-500 Fragment, Thymosin Beta-4 Fragment (17-23), Ac-LKKTETQ",
    sequence: "Ac-Leu-Lys-Lys-Thr-Glu-Thr-Gln",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    researchAreas: ["Wound Healing", "Hair Growth Research", "Anti-Inflammatory Research", "Tissue Repair"],
    description: `TB-500 Fragment (17-23) is the heptapeptide fragment of Thymosin Beta-4 containing the actin-binding motif (Ac-LKKTETQ). It is investigated for tissue repair, hair growth stimulation, and anti-inflammatory effects, and is smaller and more affordable to synthesize than full-length TB-500.`,
    longDescription: `What is TB-500 Fragment (17-23)?

TB-500 Fragment (17-23) corresponds to amino acids 17–23 of Thymosin Beta-4 (Tβ4), the sequence Ac-Leu-Lys-Lys-Thr-Glu-Thr-Gln. This region contains the LKKTF motif (here LKKTET) that mediates actin sequestration — the primary known mechanism of Thymosin Beta-4 biological activity. By binding G-actin monomers, this fragment may influence actin dynamics, cell migration, and wound healing similarly to full-length Tβ4, but at a fraction of the molecular weight and synthesis cost.

TB-500 Fragment Research

Wound healing research has investigated this fragment for promoting cell migration, angiogenesis, and re-epithelialization. Studies have documented upregulation of integrin receptors and metalloproteinases in wound healing models.

Hair growth research has shown that Thymosin Beta-4 and its active fragment can stimulate hair follicle progenitor cell migration and promote anagen (growth) phase initiation in hair follicle models, suggesting potential applications in alopecia research.

Anti-inflammatory research has documented reduced expression of pro-inflammatory cytokines in tissue models treated with Thymosin Beta-4 fragments, potentially through NF-κB modulation.`
  },

  "71": {
    id: "71",
    refNumber: "07-52-TB",
    casNumber: "77591-33-4",
    formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
    molecularWeight: "4963 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Thymosin Beta-4, Tβ4, TB4",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 6–8 hours",
    researchAreas: ["Wound Healing", "Cardiac Research", "Neurological Research", "Anti-Inflammatory Research", "Hair Growth Research"],
    description: `TB-500 (Thymosin Beta-4, 43 amino acids) is a naturally occurring peptide found in virtually all tissues and cell types. It acts as an actin-sequestering molecule and pleiotropic tissue repair factor, investigated for wound healing, cardiac regeneration, neuroprotection, and anti-inflammatory effects.`,
    longDescription: `What is TB-500 (Thymosin Beta-4)?

TB-500 is a synthetic analogue of Thymosin Beta-4 (Tβ4), a 43-amino acid protein originally isolated from thymic tissue. Thymosin Beta-4 is one of the most abundant intracellular peptides in mammals and is found in virtually all cell types except red blood cells. Its primary molecular function is to bind G-actin monomers and regulate actin polymerization dynamics, which underpins its roles in cell migration, tissue repair, and development.

TB-500 Research

Wound healing research has extensively documented Tβ4's ability to promote cell migration, angiogenesis, and re-epithelialization. The peptide upregulates integrin expression on cell surfaces, facilitating attachment to extracellular matrix components. Studies in animal models of skin wounds, corneal injury, and diabetic ulcers show significantly accelerated healing with Tβ4 treatment.

Cardiac research has generated substantial interest in Tβ4. Studies in mouse models of myocardial infarction show that Tβ4 pretreatment promotes survival of cardiomyocytes, stimulates epicardial progenitor cell migration, and enhances neovascularization in the infarcted zone. Tβ4 has been investigated as a potential approach to promoting cardiac repair after ischemic injury.

Neurological research documents neuroprotective effects of Tβ4 in models of spinal cord injury, traumatic brain injury, and stroke, with investigators reporting improved functional recovery and reduced inflammation.

Anti-inflammatory research shows Tβ4 reduces NF-κB activation and inflammatory cytokine production, potentially through downregulation of IKKβ activity.`
  },

  "72": {
    id: "72",
    refNumber: "07-52-TB",
    casNumber: "77591-33-4",
    formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
    molecularWeight: "4963 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Thymosin Beta-4, Tβ4, TB4",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 6–8 hours",
    researchAreas: ["Wound Healing", "Cardiac Research", "Neurological Research", "Anti-Inflammatory Research"],
    description: `TB-500 10mg (Thymosin Beta-4) is a mid-range quantity of the naturally occurring 43-amino acid actin-sequestering peptide for wound healing, cardiac repair, neuroprotection, and anti-inflammatory research.`,
    longDescription: `What is TB-500?

TB-500 (Thymosin Beta-4) 10mg provides a standard research quantity of this pleiotropic tissue repair peptide. Applications include wound healing acceleration, cardiac regeneration research in ischemia models, neurological protection studies, hair follicle activation, and anti-inflammatory signaling investigation. The peptide acts primarily through actin sequestration and integrin-mediated cell migration pathways.`
  },

  "73": {
    id: "73",
    refNumber: "07-52-TB",
    casNumber: "77591-33-4",
    formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
    molecularWeight: "4963 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "Thymosin Beta-4, Tβ4, TB4",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Wound Healing", "Cardiac Research", "Neurological Research", "Anti-Inflammatory Research"],
    description: `TB-500 20mg (Thymosin Beta-4) is a large-format vial of the 43-amino acid actin-sequestering peptide for extended or multi-cohort research into tissue repair, cardiac regeneration, and neuroprotection.`,
    longDescription: `What is TB-500?

TB-500 20mg provides a large research supply of Thymosin Beta-4 for high-volume or extended protocols. All scientific properties are identical to smaller vials: 43-amino acid actin-sequestering peptide promoting wound healing, cardiac repair, neuroprotection, hair follicle growth, and anti-inflammatory signaling through multiple molecular mechanisms.`
  },

  "74": {
    id: "74",
    refNumber: "568-9-TS",
    casNumber: "901758-09-6 / 170851-70-4",
    molecularWeight: "5195.9 g/mol / 711.87 g/mol",
    purity: "98%+ HPLC (each component)",
    alsoKnownAs: "Tesamorelin-Ipamorelin Blend, GH Stack Blend",
    storage: "Store lyophilized blend at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Body Composition", "Lipodystrophy Research", "Metabolic Research"],
    description: `The Tesamorelin + Ipamorelin Blend 8mg combines Tesamorelin (6mg, a GHRH analogue) with Ipamorelin (2mg, a selective GHS-R1a agonist) for research into synergistic GH secretion, visceral fat reduction, and body composition modulation.`,
    longDescription: `What is the Tesamorelin + Ipamorelin Blend?

This blend combines Tesamorelin (a stabilized GHRH analogue) with Ipamorelin (a selective GHRP and GHS-R1a agonist) to stimulate GH secretion through dual complementary mechanisms. Tesamorelin acts via the GHRH receptor to stimulate pituitary somatotrophs, while Ipamorelin amplifies GH release through the ghrelin receptor with minimal effects on cortisol or prolactin.

Component Overview

Tesamorelin (6mg): A stabilized analogue of GHRH(1-44) with trans-3-hexenoic acid modification for enhanced stability, investigated for visceral fat reduction, lipodystrophy research, and GH axis restoration.

Ipamorelin (2mg): A selective pentapeptide GHS-R1a agonist with high GH selectivity and minimal HPA axis effects, used to amplify pituitary GH release when combined with GHRH analogues.

Research Rationale

The combination of a GHRH analogue with a GHRP produces synergistic GH secretion greater than either peptide alone. Research has documented that GHRH analogues increase cAMP and prime somatotrophs, while GHRPs reduce somatostatin tone and further amplify GH pulse amplitude. Together they create the conditions for maximal pulsatile GH output while maintaining the selectivity advantages of Ipamorelin.`
  },

  "75": {
    id: "75",
    refNumber: "62-304-TA",
    casNumber: "62304-98-7",
    formula: "C₁₂₉H₂₁₅N₃₃O₅₅",
    molecularWeight: "3108.31 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "TA-1, Thymalfasin, Zadaxin",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 2 hours",
    researchAreas: ["Immune Research", "Antiviral Research", "Cancer Research (adjuvant)", "Vaccine Adjuvant Research", "Autoimmune Research"],
    description: `Thymosin Alpha-1 (TA-1) is a 28-amino acid peptide originally isolated from thymic tissue. It is an immunomodulatory peptide that enhances T cell maturation, NK cell activity, and dendritic cell function, investigated for antiviral, anti-tumor, and immunostimulatory applications.`,
    longDescription: `What is Thymosin Alpha-1?

Thymosin Alpha-1 (TA-1) is a naturally occurring 28-amino acid peptide first isolated from thymosin fraction 5 of bovine thymic tissue by Allan Goldstein in the 1970s. It plays a key role in the maturation and differentiation of T lymphocytes, particularly in thymus-independent T cell development. TA-1 is one of the most clinically investigated thymic peptides, with approved uses in several countries for antiviral therapy and cancer immunotherapy support.

Thymosin Alpha-1 Research

Immune research has established that TA-1 acts on multiple aspects of adaptive and innate immunity. It promotes the maturation of T helper cells (CD4+), cytotoxic T lymphocytes (CD8+), and natural killer cells. Research has documented that TA-1 enhances the production of Th1 cytokines (IFN-γ, IL-2) while reducing immunosuppressive Th2 cytokines in some contexts.

Antiviral research has investigated TA-1 in hepatitis B, hepatitis C, and influenza models, with investigators reporting enhanced clearance of viral infections through augmented CD8+ T cell responses and increased interferon production.

Cancer research has explored TA-1 as an immunotherapy adjuvant, potentially enhancing the anti-tumor immune response by promoting T cell and NK cell activation. Studies in combination with cancer vaccines and standard chemotherapy have been conducted.

Vaccine adjuvant research investigates TA-1's ability to enhance antibody titers and cellular immunity following vaccination, with applications in immunocompromised populations and immunogenicity improvement research.`
  },

  "76": {
    id: "76",
    refNumber: "20-23-TZ",
    casNumber: "2023788-19-2",
    formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
    molecularWeight: "4813.53 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3298176, Tirzepatide",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 5 days (fatty acid conjugation)",
    researchAreas: ["Obesity Research", "Type 2 Diabetes Research", "Metabolic Research", "GLP-1 Research", "GIP Research"],
    description: `Tirzepatide (LY3298176) is a dual GIP/GLP-1 receptor agonist with a fatty acid-modified structure enabling weekly dosing. Investigated for type 2 diabetes glycemic control, obesity, and metabolic disorder research, it demonstrates superior weight loss compared to selective GLP-1 agonists.`,
    longDescription: `What is Tirzepatide?

Tirzepatide (LY3298176) is a synthetic 39-amino acid peptide that acts as a dual agonist of the glucose-dependent insulinotropic polypeptide receptor (GIPR) and the glucagon-like peptide-1 receptor (GLP-1R). It is based on a native GIP sequence with modifications including substitution of selected amino acids with Aib (alpha-aminoisobutyric acid) for stability and a C18 fatty diacid attached via a linker to lysine-26 for albumin binding and extended half-life.

Tirzepatide Research

Glycemic research documents that Tirzepatide produces robust reductions in HbA1c through dual incretin receptor activation. GLP-1R agonism enhances glucose-stimulated insulin secretion, suppresses glucagon, and slows gastric emptying. GIPR agonism contributes additional insulinotropic effects and may reduce lipotoxicity in peripheral tissues. The combination produces glucose lowering exceeding GLP-1R agonism alone.

Obesity research has positioned Tirzepatide as among the most effective pharmacological weight loss agents studied. Phase 3 clinical trials have shown mean weight reductions of 15–22% of body weight, substantially exceeding selective GLP-1 agonists. Proposed mechanisms include GIPR-mediated enhancement of GLP-1R appetite suppression, direct GIPR effects on adipose tissue, and possible central appetite circuit modulation.

Metabolic research investigates Tirzepatide's effects on liver fat content (NAFLD/NASH models), lipid profiles, cardiovascular risk markers, and insulin resistance, finding improvements across multiple metabolic parameters beyond glycemic control.`
  },

  "77": {
    id: "77",
    refNumber: "20-23-TZ",
    casNumber: "2023788-19-2",
    formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
    molecularWeight: "4813.53 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3298176, Tirzepatide",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    halfLife: "Approximately 5 days",
    researchAreas: ["Obesity Research", "Type 2 Diabetes Research", "Metabolic Research"],
    description: `Tirzepatide 15mg is a dual GIP/GLP-1 receptor agonist for extended obesity, diabetes, and metabolic research protocols. Identical compound to 10mg vial with larger quantity for multi-dosing or longer study designs.`,
    longDescription: `What is Tirzepatide?

Tirzepatide 15mg provides an extended supply of this dual GIP/GLP-1 receptor agonist. Research applications are identical to smaller vials: glycemic control via dual incretin activation, exceptional weight reduction in obesity models (15–22% body weight in clinical studies), liver fat reduction, metabolic marker improvement, and investigation of GIPR versus GLP-1R contribution to observed effects.`
  },

  "78": {
    id: "78",
    refNumber: "20-23-TZ",
    casNumber: "2023788-19-2",
    formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
    molecularWeight: "4813.53 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3298176",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    researchAreas: ["Obesity Research", "Type 2 Diabetes Research", "Metabolic Research"],
    description: `Tirzepatide 30mg is a high-quantity vial of the dual GIP/GLP-1 receptor agonist for extensive obesity and metabolic research programs.`,
    longDescription: `What is Tirzepatide?

Tirzepatide 30mg supports large-scale or multi-cohort research requiring substantial material supply. As a dual GIP/GLP-1 receptor agonist, tirzepatide represents a new class of incretin-based research compounds. Its exceptional weight loss profile and metabolic benefits make it one of the most actively studied metabolic peptides in current research.`
  },

  "79": {
    id: "79",
    refNumber: "20-23-TZ",
    casNumber: "2023788-19-2",
    formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
    molecularWeight: "4813.53 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3298176",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    researchAreas: ["Obesity Research", "Type 2 Diabetes Research", "Metabolic Research"],
    description: `Tirzepatide 45mg is a high-volume vial of the dual GIP/GLP-1 receptor agonist for large-scale metabolic and obesity research investigations.`,
    longDescription: `What is Tirzepatide?

Tirzepatide 45mg provides high-volume supply of this dual incretin receptor agonist. All scientific properties are identical to other Tirzepatide vials. The 45mg format accommodates large animal study cohorts, extended dosing protocols, or parallel experimental conditions in obesity, type 2 diabetes, and metabolic research.`
  },

  "80": {
    id: "80",
    refNumber: "20-23-TZ",
    casNumber: "2023788-19-2",
    formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
    molecularWeight: "4813.53 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "LY3298176",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 4 weeks.",
    researchAreas: ["Obesity Research", "Type 2 Diabetes Research", "Metabolic Research"],
    description: `Tirzepatide 60mg is the largest available vial of the dual GIP/GLP-1 receptor agonist for maximum-scale obesity and metabolic disorder research programs.`,
    longDescription: `What is Tirzepatide?

Tirzepatide 60mg provides the largest available quantity per vial of this dual incretin receptor agonist. It is designed for research programs requiring the highest quantities — large cohort studies, extended duration protocols, or parallel experimental designs. Tirzepatide's dual receptor mechanism delivers superior weight loss and metabolic improvements compared to selective GLP-1 agonists, making it one of the most important current research tools in obesity and metabolic medicine research.`
  },

  "81": {
    id: "81",
    refNumber: "37-221-VI",
    casNumber: "37221-79-7",
    formula: "C₁₄₇H₂₃₇N₄₃S",
    molecularWeight: "3326.8 g/mol",
    purity: "98%+ HPLC",
    alsoKnownAs: "VIP, Vasoactive Intestinal Polypeptide",
    storage: "Store lyophilized peptide at -20°C. After reconstitution, store at 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 1 minute in plasma",
    researchAreas: ["Neuropeptide Research", "Inflammatory Bowel Research", "Pulmonary Research", "Immune Modulation", "Cardiovascular Research"],
    description: `VIP (Vasoactive Intestinal Peptide) is a 28-amino acid neuropeptide with potent vasodilatory, anti-inflammatory, and immunomodulatory properties. It is distributed throughout the central and peripheral nervous systems and investigated for roles in GI motility, pulmonary function, immune regulation, and circadian rhythm.`,
    longDescription: `What is VIP?

VIP (Vasoactive Intestinal Peptide) is a 28-amino acid neuropeptide and member of the secretin/glucagon superfamily. It was first isolated from porcine intestine in 1970 and subsequently found to be widely distributed throughout the central nervous system, peripheral nervous system, and immune tissues. VIP signals through two G protein-coupled receptors, VPAC1 and VPAC2, which are expressed broadly across multiple tissue types.

VIP Research

Gastrointestinal research has established VIP as a key enteric neurotransmitter that promotes smooth muscle relaxation, regulates intestinal secretion, and modulates gut immune function. Studies investigate VIP's role in inflammatory bowel disease (IBD), where it appears to exert anti-inflammatory effects and may protect against intestinal epithelial damage.

Pulmonary research investigates VIP as a potent bronchodilator and pulmonary vasodilator. Studies in models of pulmonary arterial hypertension (PAH) document that VIP reduces pulmonary vascular resistance and may inhibit smooth muscle proliferation, supporting research into pulmonary hypertension pathophysiology.

Immune modulation research has established VIP as a neuropeptide with significant immunosuppressive and anti-inflammatory properties. VIP inhibits the production of pro-inflammatory cytokines (TNF-α, IL-6, IL-12) from macrophages and dendritic cells, promotes regulatory T cell (Treg) generation, and may dampen autoimmune responses.

Circadian rhythm research investigates VIP's role in the suprachiasmatic nucleus (SCN) as a key coupling factor that synchronizes individual circadian oscillators across the SCN neuronal population, coordinating biological time-keeping.`
  }
};
