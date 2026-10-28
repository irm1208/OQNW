import { useState, useMemo, useRef } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { BookOpen, Search, X, ExternalLink, Tag } from "lucide-react";
import PageHero from "@/components/PageHero";

type GlossaryEntry = {
  term: string;
  definition: string;
  category: "chemistry" | "pharmacology" | "pathway" | "research" | "administration" | "peptide";
  related?: string[];
  seeAlso?: { label: string; href: string };
};

const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  chemistry:      { label: "Chemistry",      color: "#4E68C2", bg: "#EFF2EF" },
  pharmacology:   { label: "Pharmacology",   color: "#5E5690", bg: "#F1F0F7" },
  pathway:        { label: "Pathway",        color: "#4F6B52", bg: "#EFF2EF" },
  research:       { label: "Research",       color: "#85683A", bg: "#F8F4EF" },
  administration: { label: "Administration", color: "#4C7376", bg: "#F8F4EF" },
  peptide:        { label: "Peptide Class",  color: "#9C4A44", bg: "#F8F2F3" },
};

const GLOSSARY: GlossaryEntry[] = [
  // A
  {
    term: "Amino Acid",
    category: "chemistry",
    definition: "The fundamental building block of peptides and proteins. An amino acid consists of a central carbon atom bonded to an amino group (–NH₂), a carboxyl group (–COOH), a hydrogen atom, and a variable side chain (R group) that determines its unique properties. There are 20 standard amino acids encoded in the human genome. Peptides are chains of amino acids linked by peptide bonds.",
    related: ["Peptide Bond", "Peptide", "Sequence"],
  },
  {
    term: "Amylin",
    category: "peptide",
    definition: "A 37-amino acid peptide hormone co-secreted with insulin from pancreatic beta cells. Amylin suppresses glucagon secretion, slows gastric emptying, and promotes satiety — complementing insulin's role in glucose regulation. Research analogues have been engineered as versions of amylin with extended half-lives for metabolic research.",
    related: ["GLP-1", "Satiety"],
  },
  {
    term: "Angiogenesis",
    category: "pathway",
    definition: "The physiological process by which new blood vessels form from pre-existing vasculature. In peptide research, angiogenesis is a key outcome measure for compounds like BPC-157, which promotes VEGF expression (vascular endothelial growth factor) and accelerates vascular network formation at injury sites — contributing to its wound healing and tissue repair properties.",
    related: ["VEGF", "BPC-157", "Wound Healing"],
  },
  {
    term: "Antagonist",
    category: "pharmacology",
    definition: "A molecule that binds to a receptor and blocks or dampens its activity, preventing the natural ligand (agonist) from producing its effect. In peptide research, antagonists are used to establish the mechanistic role of specific receptor pathways — for example, blocking GLP-1 receptors to confirm the pathway responsible for appetite suppression.",
    related: ["Agonist", "Receptor", "Ligand"],
  },
  {
    term: "Agonist",
    category: "pharmacology",
    definition: "A molecule that binds to a receptor and activates it, producing a biological response. Most research peptides function as agonists — for example, Ipamorelin is a ghrelin receptor agonist that stimulates growth hormone release. Partial agonists produce a submaximal response; full agonists produce the maximum receptor-mediated effect.",
    related: ["Receptor", "Antagonist", "EC50"],
  },

  // B
  {
    term: "Bacteriostatic Water (BAC Water)",
    category: "administration",
    definition: "Sterile water containing 0.9% benzyl alcohol, used as a reconstitution solvent for lyophilised research peptides. The benzyl alcohol inhibits bacterial growth, extending the shelf life of a reconstituted peptide solution to approximately 4 weeks when refrigerated at 4°C. Most research peptides are compatible with BAC water; some (e.g. BPC-157) are also soluble in saline.",
    related: ["Reconstitution", "Lyophilisation", "Sterile Water"],
    seeAlso: { label: "Reconstitution Calculator", href: "/calculator" },
  },
  {
    term: "Bioavailability",
    category: "pharmacology",
    definition: "The fraction of an administered dose of a compound that reaches systemic circulation in an unchanged, active form. Intravenous administration achieves 100% bioavailability; subcutaneous and intramuscular routes typically achieve 80–95% for most peptides. Oral bioavailability is very low for most peptides due to enzymatic degradation in the GI tract — hence most research peptides are administered parenterally.",
    related: ["Pharmacokinetics", "Half-Life", "Subcutaneous"],
  },
  {
    term: "BDNF (Brain-Derived Neurotrophic Factor)",
    category: "pathway",
    definition: "A neurotrophin protein that supports the survival of existing neurons and encourages the growth and differentiation of new neurons and synapses. BDNF plays a critical role in learning, memory, and neuroplasticity. Research peptides such as Semax and P21 are studied specifically for their ability to upregulate BDNF expression in the brain — Semax has been shown to increase hippocampal BDNF by up to 800% in rodent models.",
    related: ["Semax", "Neuroplasticity", "NGF", "Nootropic"],
  },

  // C
  {
    term: "CAS Number",
    category: "chemistry",
    definition: "A Chemical Abstracts Service Registry Number — a unique numerical identifier assigned to every chemical substance by the American Chemical Society's Chemical Abstracts Service (CAS). CAS numbers allow unambiguous identification of compounds regardless of trade name or synonym. For example, BPC-157 has the CAS number 137525-51-0.",
    related: ["Molecular Weight", "Formula"],
  },
  {
    term: "Cyclic Peptide",
    category: "chemistry",
    definition: "A peptide in which the N-terminus and C-terminus are joined together (head-to-tail cyclisation), or two side chains are linked, forming a closed ring structure. Cyclic peptides are generally more resistant to enzymatic degradation than linear peptides and may have enhanced receptor selectivity. Melanotan 2 is an example of a cyclic α-MSH analogue with greater potency and metabolic stability than its linear parent.",
    related: ["Peptide Bond", "Enzymatic Degradation", "Melanotan 2"],
  },
  {
    term: "Cytoprotection",
    category: "pathway",
    definition: "The ability of a compound to protect cells from damage or death caused by chemical, mechanical, or biological stressors. BPC-157 is one of the most extensively studied cytoprotective peptides — it protects gastric mucosa, hepatic cells, and neural tissue against a range of insults including NSAID damage, ethanol, and ischaemic injury. Cytoprotection is typically mediated through anti-oxidant, anti-inflammatory, and anti-apoptotic pathways.",
    related: ["BPC-157", "Apoptosis", "Angiogenesis"],
  },

  // D
  {
    term: "Degradation (Enzymatic)",
    category: "pharmacology",
    definition: "The breakdown of a peptide by proteolytic enzymes (proteases and peptidases) present in the bloodstream, gastrointestinal tract, and tissues. Most naturally-occurring peptides have very short half-lives due to rapid enzymatic degradation. Pharmaceutical modifications — such as PEGylation, N-acetylation, amidation, or cyclisation — are employed to increase resistance to degradation and extend the effective half-life of research compounds.",
    related: ["Half-Life", "PEGylation", "Amidation", "N-Acetylation"],
  },
  {
    term: "Dose-Response Relationship",
    category: "pharmacology",
    definition: "The relationship between the dose (concentration) of a compound and the magnitude of the biological effect it produces. A typical dose-response curve is sigmoidal: at low doses little effect is observed; as dose increases, effect grows; at high doses a plateau (maximum response, Emax) is reached. The EC50 is the dose producing 50% of maximum effect. Understanding the dose-response relationship is fundamental to preclinical protocol design.",
    related: ["EC50", "Emax", "Pharmacodynamics"],
  },

  // E
  {
    term: "EC50",
    category: "pharmacology",
    definition: "The half-maximal effective concentration — the dose or concentration of a compound that produces 50% of its maximum possible effect. EC50 is used to quantify the potency of receptor agonists; a lower EC50 indicates a more potent compound. It is determined from dose-response curves generated in cell-based or animal assays.",
    related: ["Dose-Response", "Agonist", "Pharmacodynamics"],
  },
  {
    term: "Emax",
    category: "pharmacology",
    definition: "The maximum effect (efficacy) achievable by a compound at saturating concentrations. Full agonists produce the same Emax as the natural ligand; partial agonists produce a lower Emax regardless of dose. Emax is distinct from potency (EC50) — a compound can be very potent (low EC50) but have limited efficacy (low Emax), or vice versa.",
    related: ["EC50", "Agonist", "Efficacy"],
  },

  // F
  {
    term: "Formula (Molecular)",
    category: "chemistry",
    definition: "A notation that indicates the number and types of atoms in a molecule. For example, BPC-157 has the molecular formula C₆₂H₉₈N₁₆O₂₂ — 62 carbon atoms, 98 hydrogen atoms, 16 nitrogen atoms, and 22 oxygen atoms. Molecular formulas appear on all product pages and COAs.",
    related: ["Molecular Weight", "CAS Number"],
  },
  {
    term: "Freeze-Drying",
    category: "chemistry",
    definition: "See Lyophilisation.",
    related: ["Lyophilisation", "Reconstitution"],
  },

  // G
  {
    term: "GH (Growth Hormone)",
    category: "pathway",
    definition: "A 191-amino acid polypeptide hormone secreted by the anterior pituitary gland in response to GHRH stimulation. GH promotes protein synthesis, stimulates IGF-1 production by the liver, and regulates metabolism. GH is naturally released in pulses — predominantly during sleep. Research peptides including GHRH analogues (Sermorelin, CJC-1295) and GH secretagogues (Ipamorelin, GHRP-2/6) are studied for their ability to stimulate endogenous GH secretion.",
    related: ["GHRH", "GHS", "IGF-1", "Ipamorelin", "Sermorelin"],
  },
  {
    term: "GHRH (Growth Hormone Releasing Hormone)",
    category: "pathway",
    definition: "A 44-amino acid hypothalamic hormone that stimulates the pituitary gland to synthesise and secrete growth hormone. GHRH acts on specific receptors in the pituitary (GHRH-R) and is the primary driver of pulsatile GH release. Research peptides such as CJC-1295 No DAC, Sermorelin, and Tesamorelin are synthetic GHRH analogues that mimic or prolong endogenous GHRH activity.",
    related: ["GH", "CJC-1295 No DAC", "Sermorelin", "Tesamorelin"],
  },
  {
    term: "GHS (Growth Hormone Secretagogue)",
    category: "peptide",
    definition: "A class of compounds that stimulate growth hormone release independently of the GHRH pathway, primarily through the ghrelin receptor (GHSR-1a). GHS peptides include Ipamorelin, GHRP-2, GHRP-6, and Hexarelin. Unlike GHRH analogues, GHS peptides activate a complementary pituitary pathway — combining the two produces a synergistic GH pulse significantly greater than either alone.",
    related: ["Ghrelin", "GHRH", "Ipamorelin", "GHRP-2"],
  },
  {
    term: "Ghrelin",
    category: "pathway",
    definition: "An endogenous peptide hormone produced in the stomach, often called the 'hunger hormone'. Ghrelin binds to the GHSR-1a receptor in the pituitary and hypothalamus, stimulating appetite and growth hormone release. GH secretagogue research peptides (GHRP-2, GHRP-6, Ipamorelin, Hexarelin) are synthetic ghrelin mimetics that activate the GHSR-1a receptor to stimulate GH secretion.",
    related: ["GHS", "GHSR-1a", "Ipamorelin", "Appetite"],
  },
  {
    term: "GLP-1 (Glucagon-Like Peptide-1)",
    category: "pathway",
    definition: "An incretin hormone secreted by intestinal L-cells in response to food intake. GLP-1 stimulates insulin secretion, suppresses glucagon, slows gastric emptying, and promotes satiety — all of which contribute to post-meal glucose control. GLP-1 receptor agonists are among the most studied compounds in metabolic and obesity research.",
    related: ["GIP", "Incretin"],
  },
  {
    term: "GIP (Glucose-Dependent Insulinotropic Polypeptide)",
    category: "pathway",
    definition: "An incretin hormone secreted by intestinal K-cells that stimulates insulin secretion after carbohydrate and fat ingestion. GIP also promotes fat storage and has effects on bone metabolism. Dual and triple receptor agonists that include GIP receptor activity alongside GLP-1 (and in some cases, glucagon receptor) agonism demonstrate superior metabolic outcomes vs. GLP-1 alone.",
    related: ["GLP-1", "Incretin"],
  },

  // H
  {
    term: "Half-Life",
    category: "pharmacology",
    definition: "The time required for the plasma concentration (or total amount in the body) of a compound to decrease by 50% after administration. Half-life is a key pharmacokinetic parameter that determines dosing frequency and duration of action. Short half-life peptides (e.g. CJC-1295 No DAC: ~30 min) require more frequent dosing; long half-life compounds can be administered weekly. Half-life values on product pages are sourced from published preclinical pharmacokinetic studies.",
    related: ["Pharmacokinetics", "Bioavailability", "Elimination"],
  },
  {
    term: "Independent Purity Testing",
    category: "research",
    definition: "Third-party laboratory analysis used to determine peptide purity. A sample is analysed and the relative abundance of each component in the mixture is measured; purity is expressed as the percentage of the target peptide relative to all detected components. All OmniQure peptides are tested to ≥99% purity by independent laboratories.",
    related: ["Purity"],
    seeAlso: { label: "Janoshik Reports", href: "/lab-reports" },
  },
  {
    term: "HPG Axis (Hypothalamic-Pituitary-Gonadal)",
    category: "pathway",
    definition: "A cascade of hormonal signalling between the hypothalamus, pituitary gland, and gonads that regulates reproductive function and sex hormone production. The hypothalamus releases GnRH → pituitary releases LH and FSH → gonads produce testosterone, oestrogen, and progesterone. Research peptides such as Gonadorelin and Kisspeptin-10 are studied for their effects on this axis.",
    related: ["GnRH", "Gonadorelin", "Kisspeptin-10", "LH", "FSH"],
  },

  // I
  {
    term: "IC50",
    category: "pharmacology",
    definition: "The half-maximal inhibitory concentration — the concentration of a compound that inhibits a biological process by 50%. IC50 is the antagonist equivalent of EC50 and is used to quantify the potency of inhibitors. A lower IC50 indicates a more potent inhibitor. IC50 values are determined from inhibition curves generated in enzyme or cell-based assays.",
    related: ["EC50", "Antagonist", "Pharmacodynamics"],
  },
  {
    term: "IGF-1 (Insulin-Like Growth Factor 1)",
    category: "pathway",
    definition: "A peptide hormone produced primarily by the liver in response to GH stimulation. IGF-1 mediates many of GH's anabolic effects including muscle protein synthesis, bone growth, and cell proliferation. IGF-1 LR3 is a long-acting research analogue with reduced IGF-binding protein affinity and a half-life of ~20–30 hours vs. ~15 minutes for native IGF-1.",
    related: ["GH", "IGF-1 LR3", "Anabolism", "GH Axis"],
  },
  {
    term: "Incretin",
    category: "pathway",
    definition: "A class of metabolic hormones secreted by the gut in response to food intake that stimulate insulin secretion in a glucose-dependent manner. The main incretins are GLP-1 and GIP. Incretin mimetics (receptor agonists) form the basis of the most advanced metabolic disease research compounds studied today.",
    related: ["GLP-1", "GIP"],
  },
  {
    term: "In-Vitro",
    category: "research",
    definition: "Latin for 'in glass'. Research conducted in a controlled environment outside of a living organism — typically in cell cultures, test tubes, or Petri dishes. In-vitro experiments allow researchers to study cellular and molecular mechanisms in isolation. All OmniQure peptides are sold for in-vitro research use. In-vitro findings must be replicated in in-vivo models before drawing broader conclusions.",
    related: ["In-Vivo", "Preclinical", "Cell Culture"],
  },
  {
    term: "In-Vivo",
    category: "research",
    definition: "Latin for 'within the living'. Research conducted within a living organism (animal models). In-vivo studies examine how compounds behave within complex biological systems including metabolism, pharmacokinetics, immune responses, and whole-organ effects. Preclinical in-vivo research typically uses rodent models before any consideration of human trials.",
    related: ["In-Vitro", "Preclinical", "Animal Model"],
  },

  // L
  {
    term: "Ligand",
    category: "pharmacology",
    definition: "Any molecule that binds to a specific receptor or protein. Ligands can be agonists (activating), antagonists (blocking), or modulators. Endogenous ligands are produced naturally by the body (e.g. ghrelin binding to GHSR-1a); exogenous ligands include research peptides designed to mimic or block these interactions. Ligand-receptor binding affinity is often expressed as the Kd (dissociation constant).",
    related: ["Receptor", "Agonist", "Antagonist", "Binding Affinity"],
  },
  {
    term: "Lyophilisation",
    category: "chemistry",
    definition: "A preservation process (also called freeze-drying) that removes water from a compound while it is in a frozen state under vacuum. The ice sublimes directly from solid to vapour without passing through a liquid phase. Lyophilised peptides form a stable powder that can be stored at -20°C for 1–2 years without significant degradation. Before use in research, the powder must be reconstituted by adding an appropriate sterile solvent.",
    related: ["Reconstitution", "Storage", "Bacteriostatic Water"],
  },

  // M
  {
    term: "Mechanism of Action (MoA)",
    category: "pharmacology",
    definition: "The specific biochemical or molecular interaction through which a compound produces its biological effect. For example, Ipamorelin's mechanism of action is agonism at the GHSR-1a (ghrelin) receptor in the pituitary, leading to GH secretion. Understanding MoA allows researchers to predict compound behaviour, identify potential interactions, and design more targeted protocols.",
    related: ["Receptor", "Agonist", "Pathway"],
  },
  {
    term: "Mitochondria-Derived Peptide (MDP)",
    category: "peptide",
    definition: "A class of bioactive peptides encoded within the mitochondrial genome rather than the nuclear genome. MOTS-C and Humanin are the best-characterised MDPs. MOTS-C is encoded in the 12S rRNA region of the mitochondrial genome and acts as a metabolic regulator — activating AMPK, improving insulin sensitivity, and acting as an exercise mimetic in animal models.",
    related: ["MOTS-C", "AMPK", "Mitochondria", "Humanin"],
  },
  {
    term: "Molecular Weight (MW)",
    category: "chemistry",
    definition: "The sum of the atomic masses of all atoms in a molecule, expressed in daltons (Da) or grams per mole (g/mol). Molecular weight is a fundamental physical property that determines the mass of peptide needed to achieve a given molar concentration when preparing research solutions. Larger peptides have higher molecular weights — for example, TB-500 (Thymosin Beta-4 fragment) has an MW of approximately 4,963 g/mol.",
    related: ["Formula", "Dalton"],
  },

  // N
  {
    term: "N-Acetylation",
    category: "chemistry",
    definition: "A chemical modification in which an acetyl group (CH₃CO–) is added to the N-terminus (beginning) of a peptide chain. N-acetylation increases resistance to aminopeptidase enzymes that degrade peptides from their N-terminus, extending half-life and improving stability. N-Acetyl Semax Amidate and N-Acetyl Selank Amidate are examples of N-terminally modified research peptides with enhanced bioavailability.",
    related: ["Amidation", "Enzymatic Degradation", "Half-Life"],
  },
  {
    term: "NGF (Nerve Growth Factor)",
    category: "pathway",
    definition: "A neurotrophic factor that promotes the growth, survival, and maintenance of neurons — particularly sympathetic and sensory neurons. NGF binds to TrkA receptors and p75 neurotrophin receptors. Research peptides like Semax are studied for their ability to upregulate both BDNF and NGF, suggesting broad neuroprotective and neuroplasticity-promoting potential.",
    related: ["BDNF", "Neurotrophin", "Semax", "Neuroplasticity"],
  },
  {
    term: "Neuroprotection",
    category: "pathway",
    definition: "The mechanisms and strategies that protect neurons from injury, degeneration, or apoptosis. In peptide research, neuroprotection is studied for compounds that reduce oxidative stress, neuroinflammation, and excitotoxicity in neural tissues. BPC-157, Semax, SS-31, and Selank are examples of peptides with documented neuroprotective effects in preclinical models of traumatic brain injury, ischaemia, and neurodegeneration.",
    related: ["BDNF", "Oxidative Stress", "Apoptosis", "Semax", "BPC-157"],
  },

  // P
  {
    term: "PEGylation",
    category: "chemistry",
    definition: "The process of attaching polyethylene glycol (PEG) polymer chains to a peptide or protein. PEGylation increases molecular size (reducing renal clearance), shields the peptide from enzymatic degradation, and reduces immunogenicity — all of which extend the compound's effective half-life. PEG MGF (PEGylated Mechano Growth Factor) is an example where PEGylation converts a peptide with a half-life of minutes to one active for hours.",
    related: ["Half-Life", "Enzymatic Degradation", "PEG MGF"],
  },
  {
    term: "Peptide",
    category: "chemistry",
    definition: "A short chain of amino acids (typically 2–50 residues) linked by peptide bonds. Peptides are smaller than proteins (which are generally >50 amino acids) and are the subject of extensive research for their roles as hormones, neurotransmitters, signalling molecules, and pharmacological agents. Research peptides are synthetically produced versions of endogenous peptides, or novel sequences engineered for specific receptor interactions.",
    related: ["Amino Acid", "Peptide Bond", "Protein", "Sequence"],
  },
  {
    term: "Peptide Bond",
    category: "chemistry",
    definition: "The covalent chemical bond that links two amino acids together in a peptide chain. It forms between the carboxyl group (–COOH) of one amino acid and the amino group (–NH₂) of the next, releasing a water molecule. The peptide bond is planar and relatively rigid, giving the peptide backbone a characteristic structure that influences three-dimensional folding and receptor interactions.",
    related: ["Amino Acid", "Peptide", "Sequence"],
  },
  {
    term: "Pharmacodynamics (PD)",
    category: "pharmacology",
    definition: "The study of what a drug or compound does to the body — including its mechanism of action, receptor binding, dose-response relationships, and physiological effects. Pharmacodynamics answers the question 'what does the compound do?' In contrast, pharmacokinetics describes what the body does to the compound (absorption, distribution, metabolism, elimination).",
    related: ["Pharmacokinetics", "Mechanism of Action", "Dose-Response"],
  },
  {
    term: "Pharmacokinetics (PK)",
    category: "pharmacology",
    definition: "The study of what the body does to a compound — encompassing Absorption, Distribution, Metabolism, and Elimination (ADME). Key pharmacokinetic parameters include: bioavailability (fraction absorbed), half-life (elimination rate), volume of distribution (tissue spread), and clearance (elimination rate from the body). PK data informs dosing frequency, route of administration, and protocol design.",
    related: ["Half-Life", "Bioavailability", "ADME", "Pharmacodynamics"],
  },
  {
    term: "Preclinical Research",
    category: "research",
    definition: "Research conducted before clinical (human) trials, typically in cell models (in-vitro) and animal models (in-vivo). Preclinical studies establish proof-of-concept, dose-response relationships, pharmacokinetics, and preliminary safety data. All compounds sold by OmniQure are for preclinical research use only. Preclinical findings do not guarantee the same effects in humans.",
    related: ["In-Vitro", "In-Vivo", "Animal Model", "Clinical Trial"],
  },
  {
    term: "Purity",
    category: "chemistry",
    definition: "A measure of the proportion of a sample that consists of the target compound, expressed as a percentage. OmniQure peptides are verified to ≥99% purity by independent laboratory testing, meaning at least 99% of the material in each vial is the intended peptide, with ≤1% consisting of impurities (truncated sequences, oxidation products, residual solvents, or other related substances).",
    related: ["Independent Purity Testing", "Impurity"],
    seeAlso: { label: "Janoshik Reports", href: "/lab-reports" },
  },

  // R
  {
    term: "Receptor",
    category: "pharmacology",
    definition: "A protein molecule (usually on the cell surface or within the cell) that receives specific chemical signals (ligands) and initiates a cellular response. Receptors have high specificity for their ligands — like a lock and key. Research peptides are designed to interact with specific receptors, such as the GHSR-1a (ghrelin receptor) for GH secretagogues, or the GLP-1R for incretin mimetics. Receptor subtype selectivity is a key parameter in peptide design and research.",
    related: ["Agonist", "Antagonist", "Ligand", "Signal Transduction"],
  },
  {
    term: "Reconstitution",
    category: "administration",
    definition: "The process of dissolving a lyophilised (freeze-dried) peptide powder in a suitable sterile solvent to prepare a solution for research use. Common reconstitution solvents include bacteriostatic water, sterile water, and 0.9% saline. The amount of solvent added determines the concentration of the resulting solution. Reconstituted peptides are typically stored at 4°C and used within 2–4 weeks.",
    related: ["Lyophilisation", "Bacteriostatic Water", "Concentration"],
    seeAlso: { label: "Reconstitution Calculator", href: "/calculator" },
  },

  // S
  {
    term: "Satiety",
    category: "pathway",
    definition: "The feeling of fullness and suppression of appetite following food intake. Satiety is regulated by multiple peptide hormones including GLP-1, GIP, amylin, and peptide YY — all of which signal to the hypothalamus to reduce food intake. Research peptides targeting these pathways produce significant reductions in food intake and body weight in animal models.",
    related: ["GLP-1", "Amylin", "Hypothalamus"],
  },
  {
    term: "Sequence",
    category: "chemistry",
    definition: "The specific order of amino acids in a peptide chain, written in single-letter or three-letter amino acid code from N-terminus to C-terminus. The sequence determines the peptide's three-dimensional structure, receptor binding specificity, and biological activity. For example, BPC-157's sequence is Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val (15 amino acids).",
    related: ["Amino Acid", "Peptide Bond"],
  },
  {
    term: "Signal Transduction",
    category: "pathway",
    definition: "The process by which a cell converts an extracellular signal (e.g. a peptide hormone binding to a receptor) into an intracellular response. Signal transduction typically involves a cascade of molecular events — receptor activation → second messengers (cAMP, calcium) → kinase activation → gene expression changes → physiological response. Understanding signal transduction pathways helps researchers predict downstream effects of peptide receptor activation.",
    related: ["Receptor", "Agonist", "Mechanism of Action"],
  },
  {
    term: "Sirtuin (SIRT)",
    category: "pathway",
    definition: "A family of NAD+-dependent protein deacetylases (SIRT1–SIRT7) that regulate diverse biological processes including gene expression, metabolism, DNA repair, apoptosis, and ageing. Sirtuins are activated by elevated NAD+ levels and are a primary target of longevity research. Compounds that increase cellular NAD+ (such as NAD+ and 5-Amino-1MQ) are studied for their potential to activate sirtuins and promote metabolic and longevity-related benefits.",
    related: ["NAD+", "5-Amino-1MQ", "AMPK", "Longevity"],
  },
  {
    term: "Subcutaneous (SC)",
    category: "administration",
    definition: "Referring to the fatty tissue layer beneath the skin (the hypodermis). Subcutaneous injection delivers a compound into this layer, from which it is absorbed gradually into the bloodstream. SC is the most common route of administration used in preclinical peptide research for compounds requiring systemic absorption. It provides high bioavailability (typically 80–95%) and predictable pharmacokinetics. Insulin is a well-known example of a compound administered subcutaneously.",
    related: ["Bioavailability", "Intramuscular", "Pharmacokinetics"],
  },
  {
    term: "Synergy",
    category: "pharmacology",
    definition: "A pharmacological interaction where the combined effect of two or more compounds is greater than the sum of their individual effects. In peptide research, synergy is a key rationale for Research Stacks — for example, CJC-1295 No DAC + Ipamorelin produce a GH pulse 3–5× greater than either compound alone due to their complementary GHRH and ghrelin receptor mechanisms. Synergy is established in preclinical research before being incorporated into research protocol recommendations.",
    related: ["Research Stacks", "Mechanism of Action", "Receptor"],
    seeAlso: { label: "Research Stacks", href: "/stacks" },
  },

  // T
  {
    term: "Telomerase",
    category: "pathway",
    definition: "An enzyme that lengthens telomeres by adding DNA sequence repeats (TTAGGG in humans) to the chromosome ends. Telomerase activity declines with age, contributing to telomere shortening and cellular senescence. Epithalon is the most studied research peptide for telomerase activation — it has been shown to activate telomerase and extend telomere length in ageing cell lines, making it a key compound in longevity and cellular ageing research.",
    related: ["Telomere", "Epithalon", "Cellular Senescence", "Longevity"],
  },
  {
    term: "Telomere",
    category: "pathway",
    definition: "Protective caps at the ends of chromosomes, composed of repetitive DNA sequences (TTAGGG in humans). Telomeres shorten with each cell division; when they become critically short, cells enter senescence or apoptosis. Telomere length is considered a marker of biological ageing. Research peptides like Epithalon are studied for their potential to activate telomerase and reverse or slow telomere shortening in cell models.",
    related: ["Telomerase", "Epithalon", "Cellular Senescence"],
  },

  // V
  {
    term: "VEGF (Vascular Endothelial Growth Factor)",
    category: "pathway",
    definition: "A signalling protein that stimulates the formation of new blood vessels (angiogenesis) and increases vascular permeability. VEGF is a primary driver of wound healing and tissue repair through its promotion of new capillary formation at injury sites. BPC-157 is extensively studied for its ability to upregulate VEGF expression in preclinical wound healing and tissue repair models.",
    related: ["Angiogenesis", "BPC-157", "Wound Healing", "VEGFR"],
  },
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function GlossaryPage() {
  useSEO({
    title: "Peptide Research Glossary",
    description: "Comprehensive A–Z glossary of peptide research terminology — amino acids, pharmacokinetics, purity testing, half-life, GHRH, GLP-1, receptors, reconstitution, and more. OmniQure.",
    canonicalPath: "/glossary",
  });

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const letterRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return GLOSSARY.filter(e => {
      const catOk = activeCategory === "all" || e.category === activeCategory;
      if (!q) return catOk;
      return catOk && (
        e.term.toLowerCase().includes(q) ||
        e.definition.toLowerCase().includes(q) ||
        (e.related ?? []).some(r => r.toLowerCase().includes(q))
      );
    });
  }, [search, activeCategory]);

  const grouped = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    for (const entry of filtered) {
      const letter = entry.term[0].toUpperCase();
      const existing = map.get(letter) ?? [];
      existing.push(entry);
      map.set(letter, existing);
    }
    return map;
  }, [filtered]);

  const availableLetters = useMemo(() => new Set(grouped.keys()), [grouped]);

  const scrollTo = (letter: string) => {
    letterRefs.current[letter]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const categoryKeys = ["all", "chemistry", "pharmacology", "pathway", "research", "administration", "peptide"];
  const categoryCounts = useMemo(() => {
    const c: Record<string, number> = { all: GLOSSARY.length };
    for (const e of GLOSSARY) c[e.category] = (c[e.category] ?? 0) + 1;
    return c;
  }, []);

  const secondaryBtn: React.CSSProperties = {
    padding: "9px 20px", background: "#fff", color: "var(--ink)",
    border: "1px solid var(--hairline)", borderRadius: "999px",
    fontSize: "12px", fontWeight: 500, cursor: "pointer",
  };

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>

      <PageHero image={{ key: "hdr-glossary", alt: "OmniQure insert card explaining what is printed on the vial label", fit: "center" }}
        crumbs={[{ label: "Glossary" }]}
        eyebrow="Research Glossary"
        icon={BookOpen}
        title="Peptide Research Terminology"
        aside={
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {[
              { val: GLOSSARY.length, label: "Terms" },
              { val: Object.keys(CATEGORY_META).length, label: "Categories" },
              { val: availableLetters.size, label: "Letters" },
            ].map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontSize: "28px", fontWeight: 600, color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.02em" }}>{val}</div>
                <div style={{ fontSize: "10px", color: "var(--graphite)", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}</div>
              </div>
            ))}
          </div>
        }
      >
        <p style={{ margin: 0 }}>
          A comprehensive A–Z reference of chemistry, pharmacology, and research terms used across peptide science.
        </p>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: "460px", marginTop: "20px" }}>
          <Search size={15} aria-hidden="true" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--graphite)" }} />
          <input
            type="text"
            aria-label="Search glossary"
            placeholder="Search terms or definitions…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", height: "44px", padding: "0 40px 0 42px",
              borderRadius: "999px", border: "1px solid var(--hairline)",
              background: "#fff", fontSize: "13px",
              outline: "none", boxSizing: "border-box", color: "var(--ink)",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search"
              style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--graphite)", display: "flex" }}>
              <X size={13} />
            </button>
          )}
        </div>
      </PageHero>

      {/* Category filter bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--hairline)", overflowX: "auto" }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12" style={{ display: "flex", gap: "2px" }}>
          {categoryKeys.map(key => {
            const meta = key === "all" ? { label: "All Terms", color: "var(--ink)", bg: "#F2F0EB" } : CATEGORY_META[key];
            const active = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => { setActiveCategory(key); setSearch(""); }}
                aria-pressed={active}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "13px 14px", border: "none", cursor: "pointer",
                  background: "transparent", whiteSpace: "nowrap",
                  fontSize: "12px", fontWeight: active ? 600 : 500,
                  color: active ? "var(--ink)" : "var(--graphite)",
                  borderBottom: active ? "2px solid var(--ink)" : "2px solid transparent",
                  transition: "all 0.12s",
                }}
              >
                <Tag size={11} style={{ color: active ? meta.color : "var(--graphite)", opacity: active ? 1 : 0.6 }} />
                {meta.label}
                <span style={{
                  background: "#F2F0EB",
                  color: "var(--graphite)",
                  fontSize: "9px", fontWeight: 600, padding: "1px 6px", borderRadius: "999px",
                }}>{categoryCounts[key] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12" style={{ paddingTop: "32px", paddingBottom: "64px", display: "flex", gap: "28px", alignItems: "flex-start" }}>

        {/* A-Z sidebar */}
        {!search && (
          <nav aria-label="Jump to letter" style={{ width: "40px", flexShrink: 0, position: "sticky", top: "20px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {ALPHABET.map(letter => {
                const available = availableLetters.has(letter);
                return (
                  <button
                    key={letter}
                    onClick={() => available && scrollTo(letter)}
                    disabled={!available}
                    style={{
                      width: "32px", height: "26px", border: "none", borderRadius: "999px",
                      fontSize: "12px", fontWeight: available ? 600 : 400,
                      background: "transparent",
                      color: available ? "var(--ink)" : "rgba(74,85,104,0.3)",
                      cursor: available ? "pointer" : "default",
                      transition: "all 0.1s",
                    }}
                    onMouseOver={e => { if (available) e.currentTarget.style.background = "#F2F0EB"; }}
                    onMouseOut={e => { e.currentTarget.style.background = "transparent"; }}
                  >{letter}</button>
                );
              })}
            </div>
          </nav>
        )}

        {/* Main glossary */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <BookOpen size={40} color="var(--graphite)" style={{ marginBottom: "12px", opacity: 0.35, display: "inline-block" }} />
              <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--ink)", marginBottom: "6px" }}>No terms found</div>
              <div style={{ fontSize: "13px", color: "var(--graphite)", marginBottom: "16px" }}>Try a different search term</div>
              <button onClick={() => { setSearch(""); setActiveCategory("all"); }}
                style={{ padding: "9px 20px", background: "var(--ink)", color: "#fff", border: "none", borderRadius: "999px", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>
                Show all terms
              </button>
            </div>
          ) : (
            <>
              {/* Results info */}
              <div style={{ fontSize: "12px", color: "var(--graphite)", marginBottom: "20px" }}>
                {search
                  ? <><strong style={{ color: "var(--ink)", fontWeight: 600 }}>{filtered.length}</strong> term{filtered.length !== 1 ? "s" : ""} matching "<strong style={{ color: "var(--ink)", fontWeight: 600 }}>{search}</strong>"</>
                  : <><strong style={{ color: "var(--ink)", fontWeight: 600 }}>{filtered.length}</strong> term{filtered.length !== 1 ? "s" : ""} in this glossary</>
                }
              </div>

              {/* Alphabetical groups */}
              {Array.from(grouped.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([letter, entries]) => (
                <div
                  key={letter}
                  ref={el => { letterRefs.current[letter] = el; }}
                  style={{ marginBottom: "36px", scrollMarginTop: "20px" }}
                >
                  {/* Letter heading */}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "14px" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em", margin: 0, lineHeight: 1, minWidth: "20px" }}>{letter}</h2>
                    <div style={{ height: "1px", flex: 1, background: "var(--hairline)" }} />
                  </div>

                  {/* Entries */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {entries.sort((a, b) => a.term.localeCompare(b.term)).map(entry => {
                      const cat = CATEGORY_META[entry.category];
                      return (
                        <div
                          key={entry.term}
                          style={{
                            background: "#fff", border: "1px solid rgba(11,18,32,0.09)",
                            borderRadius: 16, padding: "18px 20px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <h3 style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)", margin: 0, letterSpacing: "-0.01em" }}>
                                {entry.term}
                              </h3>
                              <span style={{
                                background: cat.bg, color: cat.color,
                                fontSize: "9px", fontWeight: 600, padding: "2px 8px",
                                borderRadius: "999px", letterSpacing: "0.06em",
                                whiteSpace: "nowrap",
                              }}>{cat.label.toUpperCase()}</span>
                            </div>
                            {entry.seeAlso && (
                              <Link href={entry.seeAlso.href}>
                                <span style={{
                                  display: "inline-flex", alignItems: "center", gap: "4px",
                                  fontSize: "11px", color: "var(--cobalt)", fontWeight: 500,
                                  cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                                }}>
                                  {entry.seeAlso.label} <ExternalLink size={10} />
                                </span>
                              </Link>
                            )}
                          </div>

                          <p style={{ fontSize: "13px", color: "var(--graphite)", margin: "0 0 10px", lineHeight: "1.7" }}>
                            {entry.definition}
                          </p>

                          {entry.related && entry.related.length > 0 && (
                            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.1em" }}>SEE ALSO:</span>
                              {entry.related.map(rel => (
                                <span
                                  key={rel}
                                  onClick={() => setSearch(rel)}
                                  style={{
                                    background: "#fff", color: "var(--graphite)", border: "1px solid var(--hairline)",
                                    fontSize: "10px", fontWeight: 500, padding: "2px 9px",
                                    borderRadius: "999px", cursor: "pointer",
                                    transition: "all 0.1s",
                                  }}
                                  onMouseOver={e => { e.currentTarget.style.background = "#F2F0EB"; e.currentTarget.style.color = "var(--ink)"; }}
                                  onMouseOut={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = "var(--graphite)"; }}
                                >{rel}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* CTA footer */}
          <div style={{
            marginTop: "40px",
            background: "#F2F0EB", border: "1px solid var(--hairline)",
            borderRadius: 16, padding: "28px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "18px",
          }}>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em", marginBottom: "4px" }}>Ready to explore the research?</div>
              <div style={{ fontSize: "13px", color: "var(--graphite)" }}>Browse protocols, stacks, and product data</div>
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Link href="/protocols">
                <button style={{ ...secondaryBtn, background: "var(--ink)", color: "#fff", border: "1px solid var(--ink)" }}>
                  Protocols Reference
                </button>
              </Link>
              <Link href="/stacks">
                <button style={secondaryBtn}>
                  Research Stacks
                </button>
              </Link>
              <Link href="/faq">
                <button style={secondaryBtn}>
                  FAQ
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
