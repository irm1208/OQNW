export interface StackProduct {
  productId: string;
  role: string;
  suggestedDose: string;
  frequency: string;
  notes?: string;
}

export interface ResearchStack {
  id: string;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  badgeColor: string;
  icon: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  cycleLength: string;
  researchAreas: string[];
  rationale: string;
  products: StackProduct[];
  synergy: string;
  warnings: string[];
}

export const researchStacks: ResearchStack[] = [
  {
    id: "healing-recovery",
    name: "Healing & Recovery Stack",
    tagline: "The gold standard combination for tissue repair research",
    description:
      "BPC-157 and TB-500 are the two most researched peptides for regenerative applications. Together they demonstrate complementary mechanisms — BPC-157 promotes angiogenesis and collagen synthesis at the injury site, while TB-500 mobilises stem cells and reduces inflammation systemically. This pairing is cited in hundreds of preclinical models.",
    badge: "Most Popular",
    badgeColor: "#059669",
    icon: "🩹",
    difficulty: "Beginner",
    cycleLength: "8–12 weeks",
    researchAreas: ["Tendon Repair", "Muscle Recovery", "Wound Healing", "Gut Health"],
    rationale:
      "BPC-157 acts locally at the injury site, upregulating growth hormone receptors in fibroblasts and stimulating VEGF. TB-500 (Thymosin Beta-4) acts systemically, promoting cell migration and differentiation. Their mechanisms are non-overlapping, making this one of the most studied synergistic pairings in peptide research.",
    products: [
      {
        productId: "3",
        role: "Primary Healing Agent",
        suggestedDose: "250–500 mcg",
        frequency: "Daily",
        notes: "Local or systemic administration in research models. Stable in gastric juice.",
      },
      {
        productId: "71",
        role: "Systemic Recovery Support",
        suggestedDose: "2.0–2.5 mg",
        frequency: "Twice weekly (loading), weekly (maintenance)",
        notes: "High systemic distribution. Commonly studied alongside BPC-157 in musculoskeletal models.",
      },
    ],
    synergy:
      "BPC-157 targets local tissue repair pathways while TB-500 provides systemic stem cell mobilisation. Together they address both the injury site and the broader inflammatory environment, demonstrating superior outcomes in animal models compared to either peptide alone.",
    warnings: [
      "For in-vitro and preclinical research use only.",
      "Not for human or veterinary administration.",
      "Store lyophilised powder at -20°C. Reconstitute with bacteriostatic water.",
    ],
  },
  {
    id: "growth-hormone-optimisation",
    name: "GH Optimisation Stack",
    tagline: "Synergistic GHRH + GHS combination for growth hormone axis research",
    description:
      "CJC-1295 (No DAC) is a GHRH analogue that stimulates the pituitary's natural GH pulse, while Ipamorelin is a selective GHS (Growth Hormone Secretagogue) that amplifies that pulse without significantly affecting cortisol or prolactin. Their combination is the most studied protocol in GH secretagogue research.",
    badge: "Research Favourite",
    badgeColor: "#1B5CB5",
    icon: "📈",
    difficulty: "Intermediate",
    cycleLength: "12–16 weeks",
    researchAreas: ["Growth Hormone Axis", "Muscle Tissue", "Fat Metabolism", "IGF-1 Modulation"],
    rationale:
      "CJC-1295 No DAC mimics endogenous GHRH with a short half-life (~30 min), preserving pulsatile GH release patterns. Ipamorelin selectively stimulates GH release via ghrelin receptors. Combining them produces a synergistic GH pulse significantly greater than either alone — the dual mechanism is well-documented in rodent and primate models.",
    products: [
      {
        productId: "11",
        role: "GHRH Analogue (Pulse Initiator)",
        suggestedDose: "100–200 mcg",
        frequency: "Daily, 30 min before primary fast",
        notes: "Short half-life preserves natural pulsatile GH secretion patterns. Often co-administered with Ipamorelin.",
      },
      {
        productId: "31",
        role: "Selective GHS (Pulse Amplifier)",
        suggestedDose: "200–300 mcg",
        frequency: "Daily, co-administered with CJC-1295",
        notes: "Highly selective for GH release. Minimal effect on cortisol or prolactin in research models.",
      },
    ],
    synergy:
      "CJC-1295 No DAC triggers the pituitary to release GH while Ipamorelin amplifies the ghrelin-receptor pathway simultaneously. The two mechanisms produce a GH pulse 3–5× greater than saline controls in published research, with minimal blunting of natural feedback loops.",
    warnings: [
      "For in-vitro and preclinical research use only.",
      "Not for human or veterinary administration.",
      "Timing relative to food intake significantly affects GH pulse amplitude in research models.",
    ],
  },
  {
    id: "cognitive-nootropic",
    name: "Cognitive Enhancement Stack",
    tagline: "Anxiolytic + nootropic peptides with complementary CNS targets",
    description:
      "Semax is a synthetic heptapeptide derived from ACTH that upregulates BDNF and NGF expression in the CNS. Selank is a synthetic analogue of the endogenous peptide tuftsin, with strong anxiolytic and memory-enhancing properties. Together they represent the most studied nootropic peptide pairing in Russian clinical and preclinical research.",
    badge: "CNS Research",
    badgeColor: "#7C3AED",
    icon: "🧠",
    difficulty: "Intermediate",
    cycleLength: "4–8 weeks",
    researchAreas: ["BDNF Upregulation", "Anxiolysis", "Memory & Learning", "Neuroprotection"],
    rationale:
      "Semax acts on ACTH/MSH receptors and upregulates BDNF up to 800% in rodent models, making it the primary cognitive enhancer in this stack. Selank modulates the GABAergic system for anxiolysis and complements Semax by reducing stress-induced cognitive impairment — a key confounding factor in memory research.",
    products: [
      {
        productId: "64",
        role: "Primary Nootropic / BDNF Upregulator",
        suggestedDose: "200–300 mcg",
        frequency: "Daily",
        notes: "Intranasal delivery in rodent models shows rapid CNS uptake. N-Acetyl variant offers enhanced stability.",
      },
      {
        productId: "62",
        role: "Anxiolytic / Stress Modulator",
        suggestedDose: "200–300 mcg",
        frequency: "Daily, co-administered with Semax",
        notes: "Tuftsin analogue with GABAergic modulation. Reduces stress-related impairment to cognitive benchmarks.",
      },
    ],
    synergy:
      "Semax drives upregulation of neurotrophin pathways (BDNF, NGF) while Selank addresses the anxiolytic and immunomodulatory environment that stress creates — which otherwise blunts cognitive improvement. Together they address both the enhancement and the baseline cognitive disruption in research subjects.",
    warnings: [
      "For in-vitro and preclinical research use only.",
      "Not for human or veterinary administration.",
      "CNS-active peptides require careful dosing intervals in research protocols.",
    ],
  },
  {
    id: "longevity-cellular",
    name: "Longevity & Cellular Health Stack",
    tagline: "Telomere, mitochondrial, and NAD+ research combination",
    description:
      "Epithalon is a tetrapeptide studied for its ability to activate telomerase and extend telomere length in ageing cell lines. MOTS-C is a mitochondria-derived peptide (MDPs) that regulates metabolic homeostasis and mitochondrial biogenesis. Combined with NAD+, this stack represents the leading peptide combination for cellular longevity research.",
    badge: "Anti-Ageing Research",
    badgeColor: "#B45309",
    icon: "⏳",
    difficulty: "Advanced",
    cycleLength: "10–20 days (Epithalon), ongoing (MOTS-C + NAD+)",
    researchAreas: ["Telomere Biology", "Mitochondrial Function", "Metabolic Health", "Cellular Senescence"],
    rationale:
      "Epithalon acts at the telomerase level — a key mechanism in replicative senescence. MOTS-C targets mitochondrial biogenesis and metabolic efficiency, addressing the energy production decline seen in aged cells. NAD+ precursor support underpins both pathways, as telomere maintenance and mitochondrial function are both NAD+-dependent.",
    products: [
      {
        productId: "15",
        role: "Telomerase Activator",
        suggestedDose: "5–10 mg",
        frequency: "Daily for 10–20 day cycles",
        notes: "Short intensive cycles are the predominant model in published research. Pineal gland regulator in animal models.",
      },
      {
        productId: "43",
        role: "Mitochondria-Derived Peptide",
        suggestedDose: "5–10 mg",
        frequency: "Weekly",
        notes: "Encoded in mitochondrial 12S rRNA. Exercise-mimetic properties documented in metabolic models.",
      },
      {
        productId: "49",
        role: "NAD+ Precursor",
        suggestedDose: "250–500 mg",
        frequency: "Daily",
        notes: "Supports sirtuin activity and DNA repair pathways that underpin both Epithalon and MOTS-C mechanisms.",
      },
    ],
    synergy:
      "Epithalon addresses telomere shortening at the nuclear level; MOTS-C addresses mitochondrial decline; NAD+ provides the energetic substrate both processes depend upon. This three-pronged approach covers the three primary hallmarks of cellular ageing in a single research protocol.",
    warnings: [
      "For in-vitro and preclinical research use only.",
      "Not for human or veterinary administration.",
      "Advanced protocol — review all three compound profiles before designing research models.",
    ],
  },
  {
    id: "immune-defence",
    name: "Immune Defence Stack",
    tagline: "Innate and adaptive immune modulation research protocol",
    description:
      "Thymosin Alpha-1 is the most clinically studied immunomodulatory peptide, approved in multiple countries for hepatitis and cancer adjunct therapy. LL-37 is the only human cathelicidin, with broad-spectrum antimicrobial and immunomodulatory properties. Together they cover both adaptive (TA-1) and innate (LL-37) immune pathways.",
    badge: "Immune Research",
    badgeColor: "#0891B2",
    icon: "🛡️",
    difficulty: "Intermediate",
    cycleLength: "6–12 weeks",
    researchAreas: ["T-Cell Activation", "Innate Immunity", "Antimicrobial Defence", "Immunomodulation"],
    rationale:
      "Thymosin Alpha-1 enhances T-lymphocyte maturation and function, boosting adaptive immune responses. LL-37 (hCAP18) provides antimicrobial defence and activates dendritic cells, bridging innate and adaptive immunity. Their complementary pathways make this the most comprehensive immune research stack available.",
    products: [
      {
        productId: "75",
        role: "Adaptive Immune Modulator",
        suggestedDose: "1.6 mg",
        frequency: "Twice weekly",
        notes: "Most clinically researched immunomodulatory peptide. Approved in 37 countries for HBV/HCV and cancer contexts.",
      },
      {
        productId: "38",
        role: "Innate Immune Activator / Antimicrobial",
        suggestedDose: "100–500 mcg",
        frequency: "Daily to every other day",
        notes: "Human cathelicidin. Activates TLR4, promotes wound healing, and bridges innate to adaptive immune activation.",
      },
    ],
    synergy:
      "TA-1 drives T-cell differentiation and cytokine signalling in the adaptive immune system, while LL-37 provides first-line antimicrobial defence and activates pattern recognition pathways. Together they provide complementary coverage of both immune subsystems in a single research protocol.",
    warnings: [
      "For in-vitro and preclinical research use only.",
      "Not for human or veterinary administration.",
      "Immunomodulatory research requires careful baseline immune profiling of research subjects.",
    ],
  },
  {
    id: "weight-metabolic",
    name: "Metabolic & Weight Research Stack",
    tagline: "GLP-1/GIP dual agonism combined with lipolytic peptide research",
    description:
      "Tirzepatide (GLP-1/GIP dual agonist) is the most potent approved metabolic peptide, demonstrating up to 22% bodyweight reduction in clinical trials. AOD-9604 is a modified fragment of human growth hormone specifically studied for lipolytic activity. Together they represent complementary metabolic pathways — central appetite regulation combined with peripheral fat mobilisation.",
    badge: "Metabolic Research",
    badgeColor: "#DC2626",
    icon: "⚖️",
    difficulty: "Advanced",
    cycleLength: "16–24 weeks",
    researchAreas: ["GLP-1 Signalling", "Lipolysis", "Insulin Sensitivity", "Appetite Regulation"],
    rationale:
      "Tirzepatide acts centrally on GLP-1 and GIP receptors, reducing appetite signalling and improving insulin sensitivity. AOD-9604 (hGH 176-191) stimulates fat breakdown via beta-3 adrenergic receptors without affecting IGF-1 or glucose. Their mechanisms operate on different axes, making them a logical research pairing for metabolic studies.",
    products: [
      {
        productId: "76",
        role: "GLP-1 / GIP Dual Receptor Agonist",
        suggestedDose: "2.5–5 mg",
        frequency: "Weekly",
        notes: "Dose-escalation model (2.5 mg → 5 mg → 7.5 mg) used in published human trials. Most potent metabolic peptide in research.",
      },
      {
        productId: "1",
        role: "Lipolytic hGH Fragment",
        suggestedDose: "300–500 mcg",
        frequency: "Daily",
        notes: "Fragment 176-191 of hGH. Lipolytic activity without IGF-1 or glucose effects documented in rodent models.",
      },
    ],
    synergy:
      "Tirzepatide reduces caloric intake via central appetite suppression and improves insulin-mediated glucose disposal. AOD-9604 directly activates lipolytic pathways in adipose tissue peripherally. The combined approach targets fat from both input (appetite) and output (lipolysis) sides of the energy equation.",
    warnings: [
      "For in-vitro and preclinical research use only.",
      "Not for human or veterinary administration.",
      "Dual metabolic agents require careful monitoring of blood glucose parameters in research subjects.",
    ],
  },
  {
    id: "skin-repair",
    name: "Skin & Repair Stack",
    tagline: "Collagen synthesis, copper peptide, and wound repair research",
    description:
      "GHK-Cu (copper tripeptide-1) is one of the most researched peptides in dermatology, with documented effects on collagen synthesis, wound healing, and antioxidant defence. Combined with BPC-157's angiogenic and tissue repair properties, this stack covers both dermal matrix reconstruction and vascular support for optimal wound research models.",
    badge: "Skin Research",
    badgeColor: "#BE185D",
    icon: "✨",
    difficulty: "Beginner",
    cycleLength: "6–10 weeks",
    researchAreas: ["Collagen Synthesis", "Wound Healing", "Antioxidant Defence", "Angiogenesis"],
    rationale:
      "GHK-Cu stimulates collagen and elastin synthesis, inhibits matrix metalloproteinases that break down skin structure, and activates antioxidant systems. BPC-157 drives angiogenesis (new blood vessel formation) to the wound site, ensuring the collagen matrix being built has adequate vascular support. These are the two most evidence-backed peptides in dermal repair research.",
    products: [
      {
        productId: "17",
        role: "Copper Tripeptide / Collagen Stimulator",
        suggestedDose: "1–2 mg",
        frequency: "Daily",
        notes: "Water-soluble, high stability. Strong evidence base for dermal matrix remodelling in vitro and in vivo.",
      },
      {
        productId: "3",
        role: "Angiogenesis & Tissue Repair",
        suggestedDose: "200–300 mcg",
        frequency: "Daily",
        notes: "Promotes blood vessel growth to the repair site, supporting the collagen matrix rebuilt by GHK-Cu.",
      },
    ],
    synergy:
      "GHK-Cu rebuilds the extracellular matrix by stimulating collagen, elastin, and GAG synthesis while inhibiting matrix degradation enzymes. BPC-157 ensures the new matrix has adequate blood supply via angiogenesis. Together they address both the structural and vascular components of wound healing.",
    warnings: [
      "For in-vitro and preclinical research use only.",
      "Not for human or veterinary administration.",
      "GHK-Cu is a copper chelate — handle with standard metal chelate precautions in research settings.",
    ],
  },
];
