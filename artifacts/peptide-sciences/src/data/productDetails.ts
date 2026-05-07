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
  capsuleCount?: string;
  capsuleDose?: string;
};

export const productDetails: Record<string, ProductDetail> = {

  /* ─────────────────────────────────────────────────────────────────────────
     PEPTIDE CAPSULES
  ───────────────────────────────────────────────────────────────────────── */

  "1": {
    id: "1",
    refNumber: "260-005-CP",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "50mg per capsule",
    casNumber: "42464-96-0",
    formula: "C₁₀H₁₁N₂",
    molecularWeight: "159.21 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Keep in a cool, dry place away from light and moisture.",
    appearance: "White to off-white crystalline powder",
    solubility: "Soluble in DMSO and ethanol",
    researchAreas: ["Obesity Research", "Metabolic Research", "Muscle Regeneration", "Longevity Research", "Cancer Research"],
    alsoKnownAs: "5-amino-1-methylquinolinium, NNMT Inhibitor",
    description: `5-amino-1MQ is a small, membrane-permeable molecule that selectively inhibits the enzyme nicotinamide N-methyltransferase (NNMT). NNMT is a key regulator of cellular energy metabolism predominantly active in adipose (fat) tissue. By blocking NNMT, 5-amino-1MQ stimulates increases in NAD+ levels and activates the longevity-associated gene SIRT1, driving significant metabolic effects without altering food intake.`,
    longDescription: `What is 5-Amino-1MQ?

5-amino-1MQ (5-amino-1-methylquinolinium) is a small molecule analogue of methylquinolinium compounds that acts as a selective inhibitor of the enzyme nicotinamide N-methyltransferase (NNMT). NNMT is a cytosolic enzyme that catalyzes the methylation of nicotinamide and other pyridines using S-adenosylmethionine (SAM) as the methyl donor. High NNMT activity has been associated with obesity, type 2 diabetes, and a range of metabolic disorders. By inhibiting NNMT, 5-amino-1MQ shifts cellular metabolism in ways that favor energy expenditure over energy storage.

5-Amino-1MQ Structure

5-amino-1MQ is a quinolinium-based small molecule with the molecular formula C₁₀H₁₁N₂ and a molecular weight of 159.21 g/mol. Its membrane permeability is a key structural advantage — unlike many enzyme inhibitors that cannot cross cell membranes, 5-amino-1MQ readily enters cells and accesses NNMT in the cytosol. This property, combined with its selectivity for NNMT over related enzymes, makes it an attractive research tool. The compound is classified as a competitive inhibitor of NNMT with respect to nicotinamide.

5-Amino-1MQ Research

Research in diet-induced obese mice demonstrates that treatment with 5-amino-1MQ results in a 7% reduction in body mass over 10 days without any changes in food intake. Treated mice showed a 30% reduction in fat mass alongside normalized plasma cholesterol levels comparable to lean mice. These effects are attributed to an increase in NAD+ levels downstream of NNMT inhibition, which activates SIRT1 (sirtuin-1) — a key regulator of metabolism, insulin sensitivity, and cellular aging.

In adipose tissue, NNMT inhibition by 5-amino-1MQ increases GLUT4 expression and activity. GLUT4 is the primary glucose transporter in fat and muscle cells, and its upregulation improves insulin sensitivity and glucose uptake. Mice engineered to overexpress GLUT4 in fat tissue show resistance to diet-induced obesity and diabetes, supporting the hypothesis that 5-amino-1MQ's effects are mediated at least in part through GLUT4.

Research in aged mice (24 months old) treated with NNMT inhibitors has demonstrated substantial stem cell activation in muscle tissue following injury. Treated mice show myofibers approximately 2-fold larger in cross-section and 70% greater contractile force compared to controls — suggesting potential in age-related muscle wasting and regeneration research. There is also evidence linking elevated NNMT to muscle wasting disorders such as Duchenne Muscular Dystrophy (DMD), where NNMT inhibition may help by restoring NAD+ levels and reducing inflammation and fibrosis.

Separately, there is significant interest in the connection between NNMT and cancer. Elevated NNMT expression has been documented in gastric, pancreatic, renal cell, and bladder cancers. Mice lacking the NNMT gene show resistance to developing these cancers, suggesting a potential causal role. Whether 5-amino-1MQ can reduce cancer aggressiveness through NNMT inhibition remains an active area of preclinical investigation.`
  },

  "17": {
    id: "17",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "500mcg per capsule",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    molecularWeight: "1419.56 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Keep capsules in a cool, dry place away from light.",
    appearance: "Encapsulated white powder",
    researchAreas: ["Gastrointestinal Research", "Gut Health Research", "Musculoskeletal Research", "Wound Healing"],
    alsoKnownAs: "BPC-157 Arginate, Stable BPC-157, Oral BPC-157",
    description: `BPC 157 60 Capsules delivers 500mcg of BPC-157 per capsule in an orally stable arginate salt formulation. Unlike standard lyophilized BPC-157, the arginate form is designed for oral administration, allowing research into gastrointestinal and systemic effects via the enteral route. Each bottle provides 60 capsules for a 60-dose research supply.`,
    longDescription: `What is BPC-157 (Oral Capsules)?

BPC-157, or Body Protection Compound 157, is a synthetic pentadecapeptide derived from a sequence found in human gastric juice. The oral capsule formulation uses BPC-157 arginate, a salt form that demonstrates greater stability in the acidic gastric environment compared to the standard free-acid form. This makes the capsule formulation ideal for researching BPC-157's effects via the gastrointestinal route.

BPC-157 Structure

BPC-157 is a 15-amino acid peptide with the sequence Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val. Its unusual proline-rich region confers structural rigidity and resistance to enzymatic digestion. The arginate salt formulation further enhances stability in acidic environments, enabling the peptide to survive gastric transit for intestinal absorption.

BPC-157 Capsule Research

Research in rodent models has demonstrated that orally administered BPC-157 can exert both local gastrointestinal effects and systemic effects. In models of inflammatory bowel disease, gastric ulcers, and intestinal fistulas, oral BPC-157 has shown significant healing and anti-inflammatory effects on the gut lining. Research also suggests that orally administered BPC-157 may exert systemic effects on tendon healing, bone repair, and neurological function through unknown mechanisms, possibly involving the enteric nervous system and gut-brain axis.`
  },

  "31": {
    id: "31",
    casNumber: "1227792-79-1",
    formula: "C₂₁H₃₅N₅O₆",
    molecularWeight: "453.54 g/mol",
    purity: "99% HPLC",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "5mg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place away from light.",
    appearance: "White to off-white powder",
    solubility: "Soluble in water",
    researchAreas: ["Cognitive Research", "Neuroprotection", "Alzheimer's Research", "Memory Research", "Synaptogenesis Research"],
    alsoKnownAs: "Dihexa, PNB-0408, N-hexanoic-Tyr-Ile-(6) aminohexanoic amide",
    description: `Dihexa is a potent hepatocyte growth factor (HGF) potentiator derived from angiotensin IV. It was developed at Washington State University and has been studied for its remarkable ability to facilitate synaptogenesis — the formation of new synaptic connections between neurons. Research in rodent models suggests Dihexa may be significantly more potent than BDNF in promoting new neural connections.`,
    longDescription: `What is Dihexa?

Dihexa (N-hexanoic-Tyr-Ile-(6) aminohexanoic amide) is a small peptide originally derived from angiotensin IV through an iterative drug design process at Washington State University. It belongs to a class of compounds that potentiate the activity of hepatocyte growth factor (HGF) and its receptor c-Met. HGF/c-Met signaling is critically involved in neuroplasticity, synaptic formation, and cognitive function. Dihexa was specifically designed for oral bioavailability and blood-brain barrier penetration — challenges that limit many neuropeptide candidates.

Dihexa Structure

Dihexa has the molecular formula C₂₁H₃₅N₅O₆ and a molecular weight of 453.54 g/mol. As a small peptidomimetic, it retains the key pharmacophore of angiotensin IV (specifically the C-terminal portion) while incorporating structural modifications that enhance metabolic stability and CNS penetration. Unlike large peptides, Dihexa's relatively small molecular size allows it to cross the blood-brain barrier through passive diffusion.

Dihexa Research

The most striking finding from Dihexa research is its exceptional potency in promoting synaptogenesis. In studies published from Washington State University, Dihexa was found to be approximately seven orders of magnitude (10 million times) more potent than BDNF (brain-derived neurotrophic factor) in inducing new synaptic connections in hippocampal slice cultures. This extraordinary potency, combined with oral bioavailability, distinguishes Dihexa from most neuroprotective compounds.

In animal models of cognitive impairment, including those mimicking Alzheimer's-like pathology, Dihexa has been shown to significantly improve spatial learning and memory. Aged rats and rats with pharmacologically induced cognitive deficits demonstrate improved performance on Morris water maze tests and other cognitive assessments following Dihexa treatment. The compound appears to promote synaptic density specifically in the hippocampus — the brain region most critical for learning and memory formation.

Research has also explored Dihexa's potential in Parkinson's disease models, where HGF signaling has been implicated in dopaminergic neuron survival. The ability of Dihexa to enhance HGF/c-Met signaling suggests potential neuroprotective applications across multiple neurodegenerative conditions. Studies continue to investigate the full scope of Dihexa's effects on neural plasticity, axonal growth, and cognitive resilience.`
  },

  "35": {
    id: "35",
    casNumber: "307297-39-8",
    formula: "C₁₄H₂₂N₄O₉",
    molecularWeight: "390.35 g/mol",
    purity: "99% HPLC",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "3mg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place.",
    appearance: "White to off-white powder",
    sequence: "Ala-Glu-Asp-Gly",
    researchAreas: ["Anti-Aging Research", "Telomere Research", "Immune System Research", "Longevity Research", "Pineal Research"],
    alsoKnownAs: "Epitalon, Epithalon, Epithalamin synthetic analogue",
    description: `Epitalon Capsules contain 3mg of Epithalon (Ala-Glu-Asp-Gly) per capsule in a convenient oral form. Epithalon is a synthetic tetrapeptide analogue of Epithalamin, a natural peptide secreted by the pineal gland. It has been extensively studied by Professor Vladimir Khavinson and colleagues for its telomere-lengthening and anti-aging properties in both animal and human studies spanning several decades.`,
    longDescription: `What is Epitalon?

Epitalon (also written as Epithalon) is a synthetic tetrapeptide with the sequence Ala-Glu-Asp-Gly. It is based on the naturally occurring peptide Epithalamin, which is produced by the pineal gland and is believed to play a role in the regulation of aging, circadian rhythms, and immune function. The synthetic tetrapeptide was developed by Professor Vladimir Khavinson at the Institute of Bioregulation and Gerontology in St. Petersburg, Russia, where it has been the subject of extensive research since the 1980s.

Epitalon Structure

Epitalon is a simple tetrapeptide (four amino acids) with molecular formula C₁₄H₂₂N₄O₉ and molecular weight 390.35 g/mol. Its small size contributes to good bioavailability and makes it amenable to both injectable and oral research formulations. The peptide is freely soluble in water and exhibits high stability under physiological conditions.

Epitalon Research

The most significant finding from Epitalon research is its ability to stimulate telomerase activity and elongate telomeres. Telomeres are protective caps at the ends of chromosomes that shorten with each cell division — a process strongly linked to cellular aging. Research in human somatic cells has demonstrated that Epitalon can activate telomerase, the enzyme responsible for maintaining telomere length, potentially extending cellular lifespan.

Long-term studies in mice have demonstrated lifespan extension of approximately 12-16% with Epitalon treatment, along with reductions in the incidence of age-related pathologies. In rhesus monkeys, Epithalamin (the natural precursor) improved markers of biological aging including antioxidant activity, lipid peroxidation, and immune function.

Human studies conducted over several decades in Russia have investigated Epitalon as a bioregulator, examining its effects on melatonin secretion, circadian rhythm normalization, and various aging biomarkers. Epitalon has also demonstrated antioxidant properties, reducing oxidative damage to DNA and lipids. Research has explored its potential in retinal degeneration, with studies in rats showing protective effects against light-induced retinal damage. The immunomodulatory effects of Epitalon have also been investigated, with data suggesting it can restore thymic hormone production and enhance T-cell function in aged subjects.`
  },

  "42": {
    id: "42",
    casNumber: "49557-75-7",
    formula: "C₁₄H₂₃CuN₆O₄",
    molecularWeight: "403.9 g/mol",
    purity: "99% HPLC",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "2mg per capsule",
    storage: "Store at -20°C. Keep away from light and moisture.",
    appearance: "Blue-green powder (copper complex)",
    solubility: "Soluble in water",
    sequence: "Gly-His-Lys (Cu²⁺ complex)",
    researchAreas: ["Anti-Aging Research", "Skin Health Research", "Wound Healing", "Collagen Research", "Anti-Inflammatory Research"],
    alsoKnownAs: "Copper Tripeptide-1, GHK-Cu, Tripeptide-1 Copper",
    description: `GHK-Cu (2mg × 60 Capsules) delivers the copper tripeptide complex in a convenient oral capsule format. GHK-Cu (glycyl-L-histidyl-L-lysine copper complex) is a naturally occurring peptide found in human plasma, saliva, and urine that plays an important role in wound healing, tissue regeneration, and collagen synthesis. Research has explored its systemic effects when delivered via oral or injectable routes.`,
    longDescription: `What is GHK-Cu?

GHK-Cu is a naturally occurring copper complex of the tripeptide Gly-His-Lys, first identified in human plasma by Loren Pickart in 1973. It was initially discovered as a factor in plasma that stimulated growth of human hepatocytes. Subsequent research revealed that GHK-Cu is present throughout the body — in plasma, saliva, and urine — and plays multiple roles in tissue maintenance and repair. Plasma concentrations decline significantly with age (from approximately 200 ng/mL at age 20 to 80 ng/mL at age 60), leading to interest in GHK-Cu as an anti-aging research compound.

GHK-Cu Structure

GHK-Cu consists of the tripeptide glycyl-L-histidyl-L-lysine (Gly-His-Lys) complexed with a copper (Cu²⁺) ion. The copper binding occurs primarily through the histidine imidazole nitrogen and the two terminal amino groups, forming a stable square planar complex. The copper is essential for many of GHK-Cu's biological activities, as it participates directly in enzymatic reactions involved in collagen synthesis and tissue remodeling. The molecular formula is C₁₄H₂₃CuN₆O₄ with MW 403.9 g/mol.

GHK-Cu Research

GHK-Cu has been studied extensively for its effects on skin biology and wound healing. Research has demonstrated that GHK-Cu stimulates collagen synthesis in fibroblasts, increases production of decorin (a proteoglycan important for collagen fiber organization), and promotes the formation of blood vessels (angiogenesis) — all critical processes for wound healing and skin regeneration. Studies in human volunteers have shown that topical GHK-Cu formulations improve skin density, firmness, and reduce fine lines.

At the molecular level, GHK-Cu modulates gene expression broadly. Microarray studies have revealed that GHK-Cu can alter the expression of over 4,000 human genes, including genes involved in tissue remodeling, inflammation, nerve regeneration, antioxidant defense, and DNA repair. Notably, GHK-Cu appears to reset genes in aged tissues toward a younger expression profile — it downregulates genes associated with inflammation and cancer progression while upregulating genes involved in tissue repair and regeneration.

Research has also explored systemic effects of GHK-Cu beyond the skin, including neuroprotective properties, effects on hair follicle stimulation, and potential anti-cancer activity through its ability to reset gene expression patterns associated with aggressive cancers. Animal studies have demonstrated improved wound healing, bone regeneration, and nerve repair with GHK-Cu treatment.`
  },

  "63": {
    id: "63",
    capsuleCount: "60 CAPSULES",
    storage: "Store at -20°C. Keep in a cool, dry place.",
    appearance: "Encapsulated blend",
    researchAreas: ["Gut Health Research", "Anti-Inflammatory Research", "Gastrointestinal Research", "Microbiome Research", "IBD Research"],
    alsoKnownAs: "Gut Inflammation Research Capsules, BPC-157/KPV/PEA/Tributyrin Blend",
    description: `Gut Inflammation (60 Capsules) contains a synergistic blend of four research compounds: Stable BPC-157 Arginate (500mcg), KPV (500mcg), PEA/Palmitoylethanolamide (400mg), and Tributyrin (400mg). This comprehensive formula targets multiple pathways of gastrointestinal inflammation and repair, making it a versatile tool for gut health research.`,
    longDescription: `What is the Gut Inflammation Research Blend?

The Gut Inflammation capsule formula combines four complementary research compounds each targeting different aspects of gastrointestinal inflammation and mucosal integrity. The blend is designed to provide comprehensive gut health support through multiple mechanisms simultaneously — gastrointestinal mucosal repair (BPC-157), immune regulation (KPV), endocannabinoid-mediated anti-inflammation (PEA), and short-chain fatty acid provision (Tributyrin).

Component Overview and Research

BPC-157 Arginate (500mcg per capsule): BPC-157 is derived from a sequence in human gastric juice and has demonstrated remarkable gastrointestinal healing properties in animal research. The arginate salt form provides superior stability in the acidic gastric environment compared to standard BPC-157. Studies in rodent models of Crohn's disease, ulcerative colitis, and intestinal permeability ("leaky gut") have shown that BPC-157 promotes epithelial healing, reduces inflammatory cytokines, and restores gut motility. Research also suggests BPC-157 promotes angiogenesis in injured gut tissue, accelerating mucosal repair.

KPV (500mcg per capsule): KPV (Lys-Pro-Val) is a tripeptide fragment of alpha-melanocyte-stimulating hormone (α-MSH) corresponding to its C-terminal amino acids. Unlike α-MSH itself, KPV is a small, stable tripeptide that exerts potent anti-inflammatory effects specifically in the gastrointestinal tract. Research in mouse models of experimental colitis has demonstrated that oral and intracolonic KPV significantly reduces inflammatory markers including TNF-α, IL-6, and NF-κB activity. KPV acts through melanocortin receptor 1 (MC1R) on immune cells within the gut to suppress inflammatory signaling cascades.

PEA — Palmitoylethanolamide (400mg per capsule): PEA is a naturally occurring fatty acid amide produced by the body in response to inflammation and pain. It acts on the PPAR-α nuclear receptor, endocannabinoid receptors, and mast cells to reduce neuroinflammation and intestinal inflammation. Clinical research has explored PEA for irritable bowel syndrome (IBS) and inflammatory bowel disease (IBD), with studies suggesting it reduces intestinal permeability and visceral hypersensitivity.

Tributyrin (400mg per capsule): Tributyrin is a triglyceride prodrug of butyrate, a short-chain fatty acid (SCFA) that is the primary energy source for colonocytes (colon cells). Butyrate is produced naturally in the colon through bacterial fermentation of dietary fiber. Research shows that butyrate strengthens the intestinal barrier through multiple mechanisms: it upregulates tight junction proteins (claudin-1, occludin), promotes regulatory T-cell (Treg) differentiation to reduce intestinal inflammation, and inhibits histone deacetylases (HDACs) — a mechanism with significant anti-inflammatory implications. Tributyrin provides a more stable, better-tolerated form of butyrate supplementation compared to butyrate salts.`
  },

  "87": {
    id: "87",
    casNumber: "61-73-4",
    formula: "C₁₆H₁₈ClN₃S",
    molecularWeight: "319.85 g/mol",
    purity: "99% HPLC",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "10mg per capsule",
    storage: "Store at room temperature (15–25°C). Keep away from light and moisture.",
    appearance: "Dark green to blue-black crystalline powder",
    solubility: "Soluble in water",
    halfLife: "Approximately 5–6.5 hours",
    researchAreas: ["Mitochondrial Research", "Neuroprotection Research", "Antimicrobial Research", "Antioxidant Research", "Cognitive Research"],
    alsoKnownAs: "MB, Methylthioninium chloride, Urolene Blue, Swiss Blue",
    description: `Methylene Blue is one of the oldest and most versatile research compounds in pharmacology. At low doses (nanomolar to low micromolar concentrations), it acts as an alternative electron carrier in the mitochondrial electron transport chain, potentially improving cellular energy production. Research has explored its remarkable properties as a neuroprotective, antimicrobial, antioxidant, and cognitive-enhancing agent.`,
    longDescription: `What is Methylene Blue?

Methylene Blue (MB, methylthioninium chloride) was first synthesized in 1876 by Heinrich Caro at BASF and became one of the first synthetic drugs used in medicine. It is a thiazine dye with a distinctive deep blue color that turns colorless upon reduction. As one of the most extensively studied compounds in pharmacology, MB has been used as an antimalarial, antidote for methemoglobinemia, and urinary tract antiseptic. Contemporary research focuses on its mitochondria-targeting and neuroprotective properties.

Methylene Blue Structure

MB has the molecular formula C₁₆H₁₈ClN₃S and MW 319.85 g/mol. Its phenothiazine core, with dimethylamine groups at positions 3 and 7, gives it potent redox activity. MB can cycle between its oxidized (blue) and reduced (leucomethylene blue, colorless) forms, enabling it to function as an electron shuttle. This redox cycling at the mitochondrial level is believed to underlie many of its biological effects.

Methylene Blue Research

The most compelling contemporary research on MB centers on its mitochondrial effects. At low concentrations (nanomolar range), MB acts as an alternative electron carrier in the mitochondrial electron transport chain (ETC). In aged or damaged mitochondria where Complexes I-IV are impaired, MB bypasses the blockage by accepting electrons from NADH and donating them to cytochrome c, effectively rescuing ATP production. This mechanism has been demonstrated in cell culture and animal models of neurodegenerative disease.

Cognitive research has shown that MB can enhance memory consolidation and spatial learning in rodents. Studies using a variety of memory paradigms — including fear conditioning, Morris water maze, and object recognition tasks — have consistently shown MB-treated animals outperform controls. At the cellular level, MB increases cytochrome oxidase activity and mitochondrial membrane potential, improving neuronal energy status. Human studies in older adults have suggested potential improvements in memory performance.

MB has demonstrated potent neuroprotective effects in models of Alzheimer's disease, Parkinson's disease, and traumatic brain injury. In tau pathology models relevant to Alzheimer's research, MB has been shown to reduce tau aggregation and improve clearance of tau oligomers. In Parkinson's models, MB protects dopaminergic neurons from oxidative stress-induced death. Its ability to promote mitochondrial biogenesis through PGC-1α activation may underlie broad neuroprotective effects.

The antimicrobial and antifungal properties of MB are well established in the literature, with research demonstrating activity against a range of bacteria, fungi, and parasites — particularly when activated by light (photodynamic therapy). At the concentrations typically used in research capsule formulations (1–10mg), MB has a favorable safety profile with minimal reported adverse effects.`
  },

  "89": {
    id: "89",
    casNumber: "159634-47-6",
    formula: "C₂₇H₃₆N₄O₅S",
    molecularWeight: "528.66 g/mol",
    purity: "99% HPLC",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "12.5mg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place away from light.",
    appearance: "White to off-white crystalline powder",
    solubility: "Soluble in DMSO and ethanol",
    halfLife: "Approximately 24 hours (oral)",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research", "Body Composition Research", "Sleep Research"],
    alsoKnownAs: "Ibutamoren, L-163,191, MK-0677, Nutrobal",
    description: `MK-677 (Ibutamoren) is a potent, orally active, selective agonist of the ghrelin receptor (growth hormone secretagogue receptor, GHSR). Unlike peptide-based GH secretagogues that require injection, MK-677 is a non-peptide small molecule with oral bioavailability. Research has demonstrated its ability to significantly increase GH pulse amplitude and IGF-1 levels following oral administration, with a sustained duration of action of approximately 24 hours.`,
    longDescription: `What is MK-677 (Ibutamoren)?

MK-677, also known as Ibutamoren or Nutrobal, is a non-peptide, orally active growth hormone secretagogue originally developed by Merck & Co. It selectively mimics the action of the endogenous hormone ghrelin at the growth hormone secretagogue receptor (GHSR-1a) in the pituitary gland and hypothalamus. Unlike injectable GH secretagogue peptides such as GHRP-2, GHRP-6, or Ipamorelin, MK-677's non-peptide structure confers oral bioavailability — a major practical advantage for research applications.

MK-677 Structure

MK-677 has the molecular formula C₂₇H₃₆N₄O₅S and MW 528.66 g/mol. It is a spiroindoline compound with a unique three-dimensional structure that fits into the ghrelin receptor's binding pocket with high affinity and selectivity. Its lipophilicity and molecular architecture allow passage through the gastrointestinal mucosa and resistance to hepatic first-pass metabolism, achieving adequate plasma concentrations via the oral route.

MK-677 Research

Multiple human clinical studies have established that oral MK-677 reliably increases GH pulse amplitude (without significantly altering pulse frequency) and elevates serum IGF-1 concentrations in a dose-dependent manner. A seminal study in healthy elderly subjects found that MK-677 (25mg/day for 12 months) significantly increased GH and IGF-1 levels to those of young adults, accompanied by increases in lean body mass and decreases in fat mass.

Research in growth hormone-deficient children and adults has demonstrated MK-677's ability to partially restore GH/IGF-1 axis activity. Studies in elderly men and women have shown improvements in nitrogen retention (a marker of anabolic activity), lean body mass, and bone mineral density with prolonged treatment. A notable clinical study found that 2 years of MK-677 treatment in elderly subjects increased bone mineral density and improved markers of bone turnover.

Sleep architecture research has shown that MK-677 increases the duration of Stage IV sleep (slow-wave sleep), the sleep stage during which GH release is greatest. This suggests MK-677 may improve not only GH levels but also sleep quality in research settings. The compound also stimulates appetite through its ghrelin-mimetic activity, making it relevant to cachexia and wasting disease research as well as to basic metabolic studies.`
  },

  "101": {
    id: "101",
    casNumber: "1094-61-7",
    formula: "C₁₁H₁₅N₂O₈P",
    molecularWeight: "334.21 g/mol",
    purity: "99% HPLC",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "500mg per capsule",
    storage: "Store at -20°C, protected from light and moisture.",
    appearance: "White to off-white crystalline powder",
    solubility: "Highly soluble in water",
    halfLife: "Not established (precursor kinetics vary)",
    researchAreas: ["Longevity Research", "NAD+ Metabolism", "Anti-Aging Research", "Metabolic Research", "DNA Repair Research"],
    alsoKnownAs: "NMN, β-NMN, Nicotinamide Mononucleotide",
    description: `NMN (Nicotinamide Mononucleotide) is a direct biochemical precursor to NAD+ (Nicotinamide Adenine Dinucleotide). NMN is converted to NAD+ through the Preiss-Handler pathway, making it an efficient way to replenish cellular NAD+ levels. Research led by Dr. David Sinclair at Harvard Medical School and others has generated substantial interest in NMN as a longevity-related research compound.`,
    longDescription: `What is NMN?

Nicotinamide Mononucleotide (NMN) is a naturally occurring nucleotide derived from niacin (vitamin B3). It is a direct precursor to NAD+ in mammalian cells, converted to NAD+ via the enzyme NMNAT (nicotinamide mononucleotide adenylyltransferase). NMN exists naturally in small amounts in certain foods (edamame, broccoli, avocado, cabbage), but dietary sources provide insufficient quantities to meaningfully raise tissue NAD+ levels. Research has focused on exogenous NMN supplementation as a method to restore declining NAD+ in aging.

NMN Structure

NMN has the molecular formula C₁₁H₁₅N₂O₈P and MW 334.21 g/mol. It consists of a nicotinamide group linked to a ribose-5-phosphate moiety. While early research suggested NMN might require conversion to NR (nicotinamide riboside) before cellular uptake, subsequent studies have identified a specific NMN transporter (Slc12a8) that enables direct cellular uptake without prior conversion, particularly in the intestine and skeletal muscle.

NMN Research

Landmark studies from Dr. Shinichiro Imai's laboratory at Washington University demonstrated that intraperitoneal or oral NMN administration in aged mice effectively raises NAD+ levels in multiple tissues including liver, muscle, and brain. These studies showed that aged mice receiving NMN for extended periods exhibit improved energy metabolism, physical performance, eye function, insulin sensitivity, and body weight compared to controls. Crucially, NMN appeared to reverse multiple aspects of physiological aging in these animal models.

Research in aged mice has demonstrated that NMN supplementation activates sirtuins (SIRT1, SIRT3) — NAD+-dependent deacetylases with critical roles in metabolism, DNA repair, and longevity. NMN also activates PARP1, an enzyme involved in DNA damage repair that becomes increasingly important as DNA damage accumulates with age. The compound has shown promise in mouse models of multiple age-related conditions including type 2 diabetes, Alzheimer's disease, heart failure, and vascular dysfunction.

Human clinical trials have begun to emerge. A study published in Cell Metabolism (2021) demonstrated that oral NMN (300mg/day) in healthy older men increased skeletal muscle NAD+ levels, improved insulin sensitivity in skeletal muscle, and enhanced expression of genes related to muscle remodeling. Additional human trials are ongoing investigating NMN's effects on aging biomarkers, cognitive function, and metabolic health.`
  },

  "103": {
    id: "103",
    casNumber: "2550050-44-3",
    formula: "C₂₄H₂₂F₃N₅O₂S",
    molecularWeight: "505.52 g/mol",
    purity: "99% HPLC",
    capsuleCount: "90 CAPSULES",
    capsuleDose: "6mg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place.",
    appearance: "White to off-white crystalline powder",
    solubility: "Soluble in DMSO",
    halfLife: "Approximately 12–17 hours (oral)",
    researchAreas: ["Metabolic Research", "Obesity Research", "Diabetes Research", "GLP-1 Research"],
    alsoKnownAs: "LY3502970, Eli Lilly GLP-1 oral",
    description: `Orforglipron (6mg × 90 Capsules) is a non-peptide, orally bioavailable GLP-1 receptor agonist developed by Eli Lilly. Unlike peptide-based GLP-1 RAs (semaglutide, tirzepatide) that require subcutaneous injection, Orforglipron is a small molecule that can be taken orally without food restrictions. Phase 2 and Phase 3 clinical trials have demonstrated significant weight loss and glycemic improvements.`,
    longDescription: `What is Orforglipron?

Orforglipron (LY3502970) is a novel, non-peptide, small molecule GLP-1 receptor agonist developed by Eli Lilly and Company. GLP-1 (glucagon-like peptide-1) is an incretin hormone secreted by intestinal L-cells in response to food intake. It stimulates glucose-dependent insulin secretion, suppresses glucagon, slows gastric emptying, and reduces appetite — all effects that contribute to weight loss and glycemic control. Orforglipron achieves these same effects by directly activating the GLP-1 receptor but through a small molecule mechanism rather than a peptide one.

Orforglipron Structure

Orforglipron's non-peptide structure with molecular formula C₂₄H₂₂F₃N₅O₂S and MW 505.52 g/mol confers critical advantages over peptide GLP-1 agonists. Peptide compounds are rapidly degraded by gastrointestinal enzymes and cannot survive oral administration without protective formulation strategies. Orforglipron, as a small molecule, is inherently stable against GI proteases and achieves consistent oral bioavailability independent of the fasting state — unlike oral semaglutide, which must be taken on an empty stomach with limited water.

Orforglipron Research

Phase 2 clinical data published in the New England Journal of Medicine (2023) demonstrated that Orforglipron at doses up to 36mg daily produced average weight losses of approximately 9–14.7% body weight over 26 weeks in obese adults without diabetes — comparable to injectable GLP-1 RAs. In participants with type 2 diabetes, the 12mg and 24mg doses significantly reduced HbA1c and body weight compared to placebo.

Phase 3 trials (ATTAIN program) are assessing Orforglipron across multiple populations including obesity with and without type 2 diabetes, and cardiovascular risk reduction. The oral administration advantage addresses a key barrier to GLP-1 RA adoption, as injection aversion affects a significant proportion of patients. Phase 3 interim data has confirmed that the efficacy and tolerability profile established in Phase 2 extends to larger, more diverse populations, with Eli Lilly advancing toward regulatory submission.`
  },

  "104": {
    id: "104",
    casNumber: "2550050-44-3",
    formula: "C₂₄H₂₂F₃N₅O₂S",
    molecularWeight: "505.52 g/mol",
    purity: "99% HPLC",
    capsuleCount: "90 CAPSULES",
    capsuleDose: "12mg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place.",
    appearance: "White to off-white crystalline powder",
    halfLife: "Approximately 12–17 hours (oral)",
    researchAreas: ["Metabolic Research", "Obesity Research", "Diabetes Research", "GLP-1 Research"],
    alsoKnownAs: "LY3502970, Eli Lilly GLP-1 oral",
    description: `Orforglipron (12mg × 90 Capsules) provides a higher-dose formulation of the oral GLP-1 receptor agonist for advanced research protocols. The 12mg dose corresponds to a dose range that demonstrated the greatest efficacy in Phase 2 clinical trials, producing mean body weight reductions of approximately 12–15% in participants with obesity at 26 weeks.`,
    longDescription: `What is Orforglipron 12mg?

The 12mg dose of Orforglipron represents the higher end of the dose range studied in Phase 2 clinical trials. In the GZGI trial published in the New England Journal of Medicine (2023), participants receiving 12mg daily Orforglipron over 26 weeks achieved average body weight reductions of approximately 12.6% compared to placebo. Participants with type 2 diabetes receiving 12mg showed HbA1c reductions of approximately 1.5 percentage points — clinically meaningful improvements in glycemic control.

Orforglipron Structure and Mechanism

As with the 6mg formulation, Orforglipron 12mg delivers the same non-peptide GLP-1 receptor agonist molecule (C₂₄H₂₂F₃N₅O₂S, MW 505.52 g/mol) at twice the daily dose per capsule. The higher dose amplifies GLP-1 receptor activation, producing greater reductions in appetite, gastric emptying, and glucagon secretion. The mechanism of action is identical to injectable GLP-1 RAs but delivered without the need for subcutaneous injection or complex oral formulation requirements.

Clinical Research

The dose-response relationship for Orforglipron shows progressive weight loss with increasing doses up to 45mg, where gastrointestinal side effects become dose-limiting. The 12mg dose represents an important point in this dose-response curve — providing substantial efficacy while maintaining a tolerability profile similar to lower doses. Phase 3 trial data is expected to confirm that 12mg Orforglipron produces durable weight loss and metabolic improvements comparable to injectable GLP-1 therapies, potentially establishing oral GLP-1 agonism as the preferred first-line option for obesity pharmacotherapy.`
  },

  "105": {
    id: "105",
    casNumber: "Not publicly disclosed",
    formula: "Proprietary peptide",
    purity: "99% HPLC",
    capsuleCount: "30 CAPSULES",
    capsuleDose: "100mg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place away from light.",
    appearance: "Encapsulated powder",
    researchAreas: ["Anti-Aging Research", "Cellular Senescence Research", "Skin Longevity Research", "Longevity Research"],
    alsoKnownAs: "OS-01 peptide, OneSkin peptide",
    description: `OS-01 is a longevity peptide developed by OneSkin Technologies through a machine-learning-assisted screening of thousands of peptide candidates. Research published in npj Aging (2021) demonstrated that OS-01 reduces senescent cell burden in human skin samples, with effects on reducing markers of cellular aging. The capsule formulation targets systemic delivery of the peptide for whole-body longevity research.`,
    longDescription: `What is OS-01?

OS-01 is a proprietary peptide identified by OneSkin Technologies using a machine-learning platform that screened large libraries of peptides for their ability to reduce cellular senescence. Cellular senescence — the state in which cells permanently stop dividing and secrete harmful inflammatory compounds (the senescence-associated secretory phenotype or SASP) — is a key driver of tissue aging and age-related disease. The development of OS-01 represents an approach to targeting senescence through peptide bioactives rather than small-molecule senolytics.

OS-01 Structure and Mechanism

The precise sequence and structure of OS-01 are proprietary to OneSkin Technologies. However, published research indicates that OS-01 modulates the mTOR pathway — a central regulator of cell growth, metabolism, and senescence. By reducing mTOR activity, OS-01 appears to decrease the accumulation of senescent cells and reduce SASP factor secretion. The compound was identified from a library of over 1,000 peptide candidates based on its efficacy in validated senescence assays.

OS-01 Research

The foundational research on OS-01 was published in npj Aging in 2021. In this study, researchers demonstrated that OS-01 treatment of ex vivo human skin samples (skin maintained alive outside the body) reduced levels of multiple senescence markers including p21, p16, and SA-β-Gal staining. OS-01 also reduced levels of SASP factors including IL-6 and IL-8, suggesting it may dampen the pro-inflammatory secretome of senescent cells. Crucially, OS-01 achieved these effects without inducing apoptosis in normal (non-senescent) cells, a key safety consideration.

Additional in vitro research has demonstrated OS-01's ability to reduce oxidative stress markers, improve mitochondrial membrane potential, and enhance autophagy — cellular cleaning mechanisms that decline with age. The company has also published data from a clinical trial of a topical OS-01 formulation showing improvements in skin aging parameters including skin thickness, elasticity, and reduction in UV-induced DNA damage markers. The oral capsule formulation is being investigated for systemic effects on aging biomarkers throughout the body.`
  },

  "120": {
    id: "120",
    capsuleCount: "60 CAPSULES",
    casNumber: "137525-51-0 / 77591-33-4",
    formula: "BPC-157 Arginate + TB-4 Fragment blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Keep in a cool, dry place.",
    appearance: "Encapsulated blend",
    researchAreas: ["Musculoskeletal Research", "Tissue Regeneration", "Wound Healing", "Recovery Research", "Anti-Inflammatory Research"],
    alsoKnownAs: "BPC-157/TB4 Fragment Capsules, Repair and Recovery Blend",
    description: `Repair and Recovery (60 Capsules) contains a synergistic blend of BPC-157 Arginate (500mcg) and Thymosin Beta-4 Fragment 17-23 (2.5mg) per capsule. This oral formulation combines the gastrointestinal-stable arginate form of BPC-157 with the active fragment of Thymosin Beta-4, targeting tissue repair through complementary peptide mechanisms.`,
    longDescription: `What is the Repair and Recovery Blend?

The Repair and Recovery capsule formula combines two well-researched tissue repair peptides in a convenient oral format. BPC-157 Arginate provides GI-stable BPC-157 for systemic delivery, while Thymosin Beta-4 Fragment (TB-4 Fragment 17-23) delivers the most bioactive portion of the full-length TB-500 peptide. Together, these compounds address multiple aspects of tissue injury and recovery.

BPC-157 Arginate Research

BPC-157 (Body Protection Compound 157) is a 15-amino acid peptide derived from a protective protein found in human gastric juice. The arginate salt form was developed specifically for oral administration, providing stability in the acidic gastric environment. Animal research has shown BPC-157 promotes healing of tendons, ligaments, muscles, bones, and gut tissue. It appears to work through multiple mechanisms including upregulation of growth hormone receptor expression, promotion of angiogenesis (new blood vessel formation), and modulation of the nitric oxide system.

Thymosin Beta-4 Fragment (17-23) Research

The TB-4 Fragment 17-23 encompasses the actin-binding domain of full-length Thymosin Beta-4, which is responsible for many of its biological activities. This peptide sequence (Ac-SDKPDMA-OH based on the full TB-4 sequence) promotes cell migration, blood vessel formation, and tissue repair. Research has demonstrated that the fragment retains significant wound-healing and anti-inflammatory properties of the parent peptide, with studies showing accelerated repair in models of muscle injury, cardiac damage, and skin wounds. The oral delivery through the capsule format investigates systemic tissue repair effects via the enteral route.`
  },

  "137": {
    id: "137",
    casNumber: "2120943-68-0",
    formula: "C₂₅H₂₃F₃N₂O₄S",
    molecularWeight: "508.52 g/mol",
    purity: "99% HPLC",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "250mcg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place away from light.",
    appearance: "White to pale yellow crystalline powder",
    solubility: "Soluble in DMSO",
    researchAreas: ["Exercise Research", "Metabolic Research", "Endurance Research", "Mitochondrial Research", "ERR Research"],
    alsoKnownAs: "SLU-PP-332, ERRα/γ agonist, exercise mimetic",
    description: `SLU-PP-332 (250mcg × 60 Capsules) is a potent small molecule agonist of estrogen-related receptors alpha (ERRα) and gamma (ERRγ), which are master regulators of mitochondrial biogenesis and oxidative metabolism. Research in animal models has demonstrated remarkable exercise-mimetic effects, with SLU-PP-332 significantly improving physical endurance through enhanced mitochondrial function without requiring exercise training.`,
    longDescription: `What is SLU-PP-332?

SLU-PP-332 is a small molecule ERR (Estrogen-Related Receptor) agonist developed at Saint Louis University (hence "SLU"). ERRα and ERRγ are nuclear receptors that regulate the expression of genes involved in mitochondrial biogenesis, fatty acid oxidation, and oxidative phosphorylation — collectively the pathways that determine aerobic energy capacity. Unlike estrogen receptors, ERRs are "orphan" receptors with no known endogenous hormone ligand, making them targets for synthetic agonist development. SLU-PP-332 was designed to activate these receptors and has been validated as a potent ERRα/γ dual agonist.

SLU-PP-332 Structure

SLU-PP-332 has molecular formula C₂₅H₂₃F₃N₂O₄S and MW 508.52 g/mol. It is a non-steroidal small molecule with good oral bioavailability. The compound was identified through structure-activity relationship studies aimed at finding ligands that could activate ERR-mediated transcriptional programs. Its fluorine-containing groups and sulfone moiety contribute to metabolic stability and receptor binding affinity.

SLU-PP-332 Research

A landmark study published in Journal of Pharmacology and Experimental Therapeutics demonstrated that SLU-PP-332 administration in mice significantly increased running endurance. Mice treated with SLU-PP-332 ran dramatically longer on treadmills compared to untreated controls, with effects attributed to transcriptional upregulation of oxidative phosphorylation genes and increased mitochondrial density in skeletal muscle. Gene expression analysis showed SLU-PP-332 activated a transcriptional program resembling that induced by endurance training.

Research has also demonstrated that SLU-PP-332 activates ERR target genes in the heart, potentially offering cardioprotective effects in heart failure models. ERRα and ERRγ are highly expressed in the heart and are essential for maintaining cardiac energy metabolism. Studies in cardiac disease models showed that ERR activation can partially restore impaired cardiac metabolism.

Metabolic research has examined SLU-PP-332's potential in obesity and metabolic syndrome, showing effects on adipose tissue metabolism, hepatic lipid handling, and whole-body energy expenditure. The compound's ability to simultaneously target multiple tissue types through the ERR pathway makes it a versatile research tool for metabolic and exercise physiology studies.`
  },

  "138": {
    id: "138",
    casNumber: "2120943-68-0",
    formula: "C₂₅H₂₃F₃N₂O₄S",
    molecularWeight: "508.52 g/mol",
    purity: "99% HPLC",
    capsuleCount: "30 CAPSULES",
    capsuleDose: "1000mcg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place away from light.",
    appearance: "White to pale yellow crystalline powder",
    researchAreas: ["Exercise Research", "Metabolic Research", "Endurance Research", "Mitochondrial Research", "ERR Research"],
    alsoKnownAs: "SLU-PP-332, ERRα/γ agonist, high-dose exercise mimetic",
    description: `SLU-PP-332 (1000mcg × 30 Capsules) provides a higher-dose formulation of the ERRα/γ agonist for advanced research protocols requiring higher compound concentrations. At 1mg per capsule, this formulation is suitable for dose-escalation studies and research into dose-dependent effects on mitochondrial biogenesis, endurance capacity, and metabolic adaptations.`,
    longDescription: `What is SLU-PP-332 (1000mcg)?

The 1000mcg (1mg) per capsule formulation of SLU-PP-332 represents the highest commercially available research dose of this ERR agonist. In dose-response research, higher doses of ERR agonists tend to produce more robust transcriptional activation of mitochondrial biogenesis pathways, including upregulation of PGC-1α, TFAM (mitochondrial transcription factor A), and oxidative phosphorylation subunit genes. This formulation supports research into maximum ERR pathway activation and its phenotypic consequences.

Research at Higher Doses

Dose-escalation studies with ERR agonists in preclinical models have generally shown linear increases in target gene expression up to saturating doses. At 1mg per dose, SLU-PP-332 research can explore the upper end of the dose-response curve, potentially revealing ceiling effects and the full scope of ERR-mediated metabolic reprogramming. Research has demonstrated that higher-dose ERR activation produces more pronounced increases in exercise capacity, mitochondrial density, and fatty acid oxidation enzymes.

The 1000mcg formulation is also relevant for exploring the temporal dynamics of ERR activation. Studies have examined how the duration of ERR pathway activation influences the stability and magnitude of metabolic adaptations, with some research suggesting that sustained ERR activation over weeks produces progressive improvements in oxidative capacity that partially persist even after compound withdrawal — analogous to training adaptations.`
  },

  "151": {
    id: "151",
    casNumber: "402856-42-2",
    formula: "C₁₇H₂₃ClN₂O",
    molecularWeight: "310.84 g/mol",
    purity: "99% HPLC",
    capsuleCount: "30 CAPSULES",
    capsuleDose: "500mcg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place away from light.",
    appearance: "White to off-white crystalline powder",
    solubility: "Soluble in water",
    halfLife: "Approximately 8–10 hours (oral)",
    researchAreas: ["Metabolic Research", "Obesity Research", "Appetite Research", "Neurological Research"],
    alsoKnownAs: "NN2321, Tesofensina",
    description: `Tesofensine is a triple monoamine reuptake inhibitor (TMRI) that simultaneously blocks the reuptake of serotonin, norepinephrine, and dopamine. Originally developed for Parkinson's and Alzheimer's disease, it was discovered to produce remarkable weight loss in clinical trials — exceeding other approved anti-obesity agents at equivalent doses. Research has focused on its potential as a treatment for severe obesity refractory to other interventions.`,
    longDescription: `What is Tesofensine?

Tesofensine (NN2321) is a phenyltropane compound originally synthesized and tested in clinical trials for the treatment of Parkinson's disease and Alzheimer's disease by Neurosearch A/S. Though it failed to demonstrate efficacy for these neurological conditions, it produced substantial and unexpected weight loss as a secondary finding — leading to a complete pivot toward obesity research. It inhibits the reuptake transporters for serotonin (SERT), norepinephrine (NET), and dopamine (DAT) simultaneously, giving it a pharmacological profile similar to but distinct from existing ADHD medications and antidepressants.

Tesofensine Structure

Tesofensine has molecular formula C₁₇H₂₃ClN₂O and MW 310.84 g/mol. Its phenyltropane scaffold resembles cocaine and other classical monoamine reuptake inhibitors but has a distinct binding profile weighted toward all three monoamine transporters. The compound has good oral bioavailability and a prolonged half-life (8–10 hours) supporting once-daily dosing, which is favorable for clinical research applications.

Tesofensine Research

The pivotal clinical trial of Tesofensine for obesity — the TIPO-1 trial published in The Lancet (2008) — demonstrated extraordinary weight loss results. In 24 weeks, participants receiving Tesofensine 0.5mg daily lost an average of 12.8% body weight compared to 2.2% for placebo — a net reduction approximately double that of orlistat, rimonabant, or sibutramine at the time. The weight loss was primarily attributed to appetite reduction, with Tesofensine-treated subjects reporting decreased hunger and increased satiety.

Mechanistically, Tesofensine's weight-loss effects appear to stem primarily from its dopaminergic activity in the hypothalamus — reducing activity in hypothalamic circuits that drive food intake — combined with noradrenergic effects that increase energy expenditure. Serotonergic activity may contribute additional satiety signaling. Unlike pure dopaminergic compounds, the triple reuptake inhibitor profile may reduce the abuse potential and cardiovascular risks associated with single-mechanism stimulants.

Ongoing research has explored Tesofensine's potential as a combination therapy with GLP-1 receptor agonists, leveraging complementary mechanisms. Studies in animal models suggest synergistic weight loss when Tesofensine is combined with GLP-1 pathway activation. Research continues into optimal dosing strategies and its applicability in populations unresponsive to existing obesity pharmacotherapy.`
  },

  "157": {
    id: "157",
    casNumber: "Not publicly disclosed",
    formula: "Fragment of TB-500 sequence",
    molecularWeight: "Approximately 750 g/mol",
    purity: "99% HPLC",
    capsuleCount: "60 CAPSULES",
    capsuleDose: "500mcg per capsule",
    storage: "Store at -20°C. Keep in a cool, dry place.",
    appearance: "Encapsulated white powder",
    sequence: "Ac-SDKPDM (residues 17-23 of Thymosin Beta-4)",
    researchAreas: ["Tissue Regeneration", "Anti-Inflammatory Research", "Wound Healing", "Recovery Research"],
    alsoKnownAs: "TB-4 Fragment, TB-500 Fragment, Thymosin Beta-4 Fragment 17-23",
    description: `Thymosin Beta-4 Fragment 500mcg (60 Capsules) delivers the most bioactive fragment of the 43-amino acid Thymosin Beta-4 peptide in a convenient oral capsule form. The 17-23 fragment contains the actin-binding domain that is responsible for many of TB-500's biological activities, including cell migration promotion, angiogenesis, and anti-inflammatory effects, in a much smaller and more stable peptide format.`,
    longDescription: `What is the Thymosin Beta-4 Fragment?

Thymosin Beta-4 Fragment refers to a specific short peptide segment derived from the 43-amino acid full-length Thymosin Beta-4 peptide (also sold commercially as TB-500). Research by David Goldstein and colleagues identified a key 4-amino acid sequence within Thymosin Beta-4 — LKKTETQ (positions 17-23) or variations thereof — that accounts for much of the peptide's biological activity, particularly its ability to promote cell migration and tissue repair. The fragment has been the subject of significant research as a more accessible, potentially orally deliverable form of the active TB-4 core.

Thymosin Beta-4 Fragment Structure

The fragment encompasses residues 17-23 of the full-length Thymosin Beta-4 sequence. This region forms a helical structure that interacts with G-actin (monomeric actin) and prevents its polymerization, thereby affecting the cellular actin network in ways that promote cell motility. The relatively small size of the fragment (approximately 750 Da) compared to full-length TB-4 (4963 Da) offers potential advantages in terms of stability, production, and potentially oral bioavailability research.

Thymosin Beta-4 Fragment Research

In vitro studies have demonstrated that the actin-binding fragment of Thymosin Beta-4 retains the ability to stimulate cell migration in wound healing assays. The fragment appears to promote corneal healing, endothelial repair, and myocardial cell protection — effects attributed to its role in promoting actin-dependent cell motility and survival signaling.

Animal research has explored the fragment's effects in models of myocardial infarction, where TB-4 has shown cardioprotective and regenerative effects. Studies have also examined the fragment's anti-inflammatory properties, finding reductions in inflammatory cytokine expression similar to (though generally less potent than) the full-length TB-4 peptide. The convenient capsule format enables systematic research into oral delivery kinetics and systemic tissue effects of the active TB-4 core sequence.`
  },

  "174": {
    id: "174",
    casNumber: "Multiple: 42464-96-0, 1094-61-7",
    formula: "5-Amino-1MQ + NMN + additional components",
    purity: "99% HPLC",
    capsuleCount: "60 CAPSULES",
    storage: "Store at -20°C. Keep in a cool, dry place.",
    appearance: "Encapsulated blend",
    researchAreas: ["Longevity Research", "Metabolic Research", "Obesity Research", "Performance Research", "Anti-Aging Research"],
    alsoKnownAs: "Longevity & Performance Capsules, 5-Amino-1MQ/NMN Blend",
    description: `Longevity, Performance & Obesity Research (60 Capsules) is a comprehensive research blend combining 5-Amino-1MQ and NMN (Nicotinamide Mononucleotide) plus additional longevity-supporting compounds. This synergistic formula is designed for research into the combined effects of NNMT inhibition and NAD+ precursor supplementation on metabolic function, body composition, and longevity pathways.`,
    longDescription: `What is the Longevity, Performance & Obesity Research Blend?

This comprehensive capsule blend combines two of the most researched metabolic and longevity compounds — 5-Amino-1MQ and NMN — along with additional supporting compounds. The rationale for combining these specific agents is rooted in their complementary mechanisms: 5-Amino-1MQ raises NAD+ by inhibiting NNMT (which consumes NAD+ methylation products), while NMN raises NAD+ by providing additional substrate for NAD+ synthesis. Together, they may produce additive or synergistic increases in cellular NAD+ levels with downstream benefits on sirtuin activation and metabolic function.

5-Amino-1MQ Component

5-amino-1MQ is a selective NNMT (nicotinamide N-methyltransferase) inhibitor. NNMT converts NAD+ metabolites into methylated nicotinamide, depleting the pool of SAM (S-adenosylmethionine) used for epigenetic methylation and reducing the availability of NAD+ precursors. By blocking NNMT, 5-amino-1MQ not only preserves NAD+ precursor availability but also shifts the methyl donor balance toward epigenetic maintenance. Research in obese mice shows NNMT inhibition reduces body weight, fat mass, and plasma cholesterol without altering food intake.

NMN Component

NMN (Nicotinamide Mononucleotide) is a direct precursor to NAD+ in the Preiss-Handler pathway. It is converted to NAD+ by the ubiquitous NMNAT enzymes within cells. By providing additional substrate for NAD+ synthesis, NMN replenishes the declining NAD+ pool that characterizes aging. NAD+ is required for activity of sirtuins (SIRT1-7), which regulate metabolism, DNA repair, inflammation, and longevity — making NAD+ repletion a foundational strategy in longevity research.

Synergistic Research Implications

The combination of NNMT inhibition (5-amino-1MQ) and NAD+ precursor provision (NMN) addresses NAD+ maintenance from two complementary angles: reducing NAD+ consumption and increasing NAD+ production. This dual approach may be more effective than either compound alone in maintaining elevated NAD+ levels across tissues. Research using this combination framework is investigating effects on body composition, energy metabolism, cognitive function, and aging biomarkers in preclinical models.`
  },

  /* ─────────────────────────────────────────────────────────────────────────
     PURCHASE PEPTIDES — METABOLIC / GLP-1
  ───────────────────────────────────────────────────────────────────────── */

  "3": {
    id: "3",
    casNumber: "1365196-68-4",
    formula: "Peptidomimetic conjugate",
    molecularWeight: "Approximately 3.5 kDa",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Obesity Research", "Adipose Tissue Research", "Anti-Angiogenic Research", "Metabolic Research"],
    alsoKnownAs: "FTPP, Adipotide, Proapoptotic peptide",
    description: `Adipotide (FTPP — Fat-Targeting Proapoptotic Peptide) is a peptidomimetic compound designed to selectively target and destroy the blood vessels that supply white adipose tissue. By binding to prohibitin on the surface of adipose vasculature and delivering a proapoptotic signal (the KLAKLAK sequence), Adipotide induces apoptosis in blood vessels feeding fat deposits, leading to reduction of fat mass.`,
    longDescription: `What is Adipotide?

Adipotide, also known as FTPP (Fat-Targeting Proapoptotic Peptide), is a chimeric peptidomimetic compound developed at MD Anderson Cancer Center by researchers led by Dr. Renata Pasqualini and Dr. Wadih Arap. It was designed using a phage display methodology that identified peptides selectively binding to the vasculature of white adipose tissue. The CKGGRAKDC sequence targets prohibitin on adipose endothelial cells, while a fused KLAKLAK sequence provides the proapoptotic signal that destroys these blood vessels.

Adipotide Structure

Adipotide is a chimeric peptide consisting of two functional domains: an adipose vasculature-targeting domain (CKGGRAKDC) linked to a proapoptotic domain (KLAKLAK). The CKGGRAKDC sequence was identified through in vivo phage display screening in obese patients and binds specifically to prohibitin expressed on the luminal surface of endothelial cells in adipose tissue vasculature. The D-amino acid version of KLAKLAK (D(KLAKLAK)₂) is a mitochondria-disrupting sequence that, once internalized, causes mitochondrial membrane disruption and apoptosis.

Adipotide Research

Preclinical studies in mice demonstrated that Adipotide treatment produces significant and selective reduction in white adipose tissue mass. Obese mice treated with Adipotide showed substantial fat loss within weeks, with preserved lean mass — a desirable selectivity profile that distinguishes Adipotide from non-selective weight loss interventions.

A pivotal primate study published in Science Translational Medicine demonstrated that Adipotide treatment in obese rhesus monkeys produced meaningful weight loss accompanied by improvements in insulin sensitivity. Treated monkeys lost approximately 11% body weight over 4 weeks, with specific reductions in visceral fat and improvements in metabolic markers. The compound demonstrated a favorable safety profile in these studies, with kidney toxicity (renal tubular vacuolation) identified as the primary dose-limiting concern requiring careful dose selection. Research continues to explore optimal dosing strategies and long-term efficacy profiles.`
  },

  "6": {
    id: "6",
    casNumber: "2627-69-2",
    formula: "C₉H₁₄N₄O₈P",
    molecularWeight: "338.21 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C, protected from light and moisture.",
    appearance: "White crystalline powder",
    solubility: "Soluble in water",
    halfLife: "Approximately 4–6 hours",
    researchAreas: ["Metabolic Research", "AMPK Research", "Endurance Research", "Mitochondrial Research", "Cancer Research"],
    alsoKnownAs: "AICAR, AICA-riboside, Acadesine, ZMP precursor",
    description: `AICAR (5-Aminoimidazole-4-carboxamide ribonucleotide) is a cell-permeable activator of AMP-activated protein kinase (AMPK), a key enzyme that senses cellular energy status. By activating AMPK, AICAR mimics effects of low cellular energy (exercise) and has been studied for its ability to increase fatty acid oxidation, improve insulin sensitivity, and enhance mitochondrial biogenesis.`,
    longDescription: `What is AICAR?

AICAR (5-aminoimidazole-4-carboxamide-1-β-D-ribofuranoside) is a nucleoside analog that, upon entering cells, is phosphorylated to ZMP (AICAR monophosphate) — an AMP analog that activates AMPK (AMP-activated protein kinase). AMPK is a master metabolic regulator activated during low-energy states such as exercise, fasting, and caloric restriction. It promotes catabolic pathways (fatty acid oxidation, glucose uptake) and suppresses anabolic pathways (lipid synthesis, gluconeogenesis). Because AICAR activates AMPK without requiring actual energy depletion, it serves as a pharmacological tool to study AMPK-dependent metabolism.

AICAR Structure

AICAR has the molecular formula C₉H₁₄N₄O₈P and MW 338.21 g/mol. It is a water-soluble riboside that efficiently penetrates cell membranes through nucleoside transporters. Inside the cell, it is phosphorylated by adenosine kinase to ZMP, which accumulates because it cannot be further metabolized efficiently. ZMP binds to the allosteric regulatory site of AMPK (the same site as AMP) to activate this kinase.

AICAR Research

The most dramatic demonstration of AICAR's exercise-mimetic properties came from research by Evans et al. at the Salk Institute (2008), which showed that AICAR treatment alone (without exercise) produced adaptations in skeletal muscle gene expression resembling those of exercise training. Sedentary mice receiving AICAR for 4 weeks showed approximately 44% improvement in running endurance compared to untreated controls — a finding that generated enormous scientific and public interest. The researchers termed AICAR an "exercise in a bottle" compound.

At the molecular level, AICAR activates AMPK, which phosphorylates PGC-1α (peroxisome proliferator-activated receptor gamma coactivator-1 alpha) — the master regulator of mitochondrial biogenesis. This drives upregulation of genes for oxidative phosphorylation, mitochondrial electron transport chain components, and fatty acid oxidation enzymes. AICAR also increases GLUT4 translocation to the cell surface, enhancing glucose uptake independently of insulin.

Metabolic research has explored AICAR's potential in diabetes and obesity. Studies in insulin-resistant animal models have shown AICAR treatment improves insulin sensitivity, reduces hepatic glucose production, and promotes fatty acid oxidation. Cancer research has also investigated AICAR, as AMPK activation can suppress mTOR signaling and potentially inhibit tumor growth in certain cancer types.`
  },

  "7": {
    id: "7",
    casNumber: "221231-10-3",
    formula: "C₇₈H₁₂₅N₂₃O₂₃S₂",
    molecularWeight: "1817.12 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 30 minutes",
    sequence: "Tyr-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Glu-Gly-Ser-Cys-Gly-Phe-COOH (modified C-terminal)",
    researchAreas: ["Metabolic Research", "Obesity Research", "Fat Metabolism Research", "Lipolysis Research"],
    alsoKnownAs: "AOD-9604, HGH Fragment 177-191 (modified), Anti-Obesity Drug 9604",
    description: `AOD9604 is a synthetic analogue of the C-terminal fragment of human growth hormone (hGH), specifically designed to retain the lipolytic (fat-burning) properties of hGH without the growth-promoting effects or the risk of hyperglycemia. The name stands for Anti-Obesity Drug 9604. Research demonstrates that AOD9604 stimulates fat metabolism and inhibits lipogenesis through mechanisms independent of IGF-1.`,
    longDescription: `What is AOD9604?

AOD9604 (Anti-Obesity Drug 9604) is a synthetic peptide that represents a modified form of the C-terminal fragment (residues 177-191) of human growth hormone (hGH). It was developed by Metabolic Pharmaceuticals in Australia through a systematic study of hGH fragments, seeking to isolate the portion responsible for fat metabolism while discarding the portion responsible for growth and IGF-1 stimulation. The compound achieved regulatory classification as a food ingredient by the US FDA in 2014, reflecting its safety profile.

AOD9604 Structure

AOD9604 corresponds to amino acids 177-191 of the hGH sequence with a modification at the N-terminus (tyrosine replaces the hGH residue at position 177, forming a cyclic disulfide between Cys-182 and Cys-189 as in the native hGH sequence). This modification improves stability while preserving the lipolytic pharmacophore. The molecular formula is C₇₈H₁₂₅N₂₃O₂₃S₂ with MW 1817.12 g/mol.

AOD9604 Research

Research in obese mice demonstrated that AOD9604 reduces body fat accumulation without significantly affecting body weight gain in lean mice, suggesting selectivity for adipose tissue. Studies have shown AOD9604 stimulates lipolysis (fat breakdown) and inhibits lipogenesis (fat creation) in isolated fat cells at concentrations similar to full-length hGH. Crucially, AOD9604 achieves these effects without activating the IGF-1R signaling axis, avoiding hGH's growth-promoting and potentially diabetogenic effects.

Animal studies have shown that both subcutaneous and oral administration of AOD9604 produces anti-obesity effects. Chronic oral administration in obese rodent models reduced adiposity without affecting food intake, insulin levels, or blood glucose — a safety profile that distinguishes it from full-length hGH. The compound appears to work through β3-adrenergic receptor-like signaling in adipose tissue, promoting fat mobilization. Clinical studies in obese subjects demonstrated that oral AOD9604 was safe and well-tolerated, though results on weight loss were modest, highlighting challenges of translating animal findings to human clinical outcomes.`
  },

  "8": {
    id: "8",
    casNumber: "1268865-02-0",
    formula: "Cyclic peptide",
    molecularWeight: "Approximately 2.6 kDa",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Neuropathy Research", "Pain Research", "Diabetic Research", "Anti-Inflammatory Research", "Retinal Research"],
    alsoKnownAs: "Cibinetide, ARA290, Innate Repair Receptor agonist",
    description: `ARA-290 (Cibinetide) is a synthetic 11-amino acid cyclic peptide derived from a non-hematopoietic region of erythropoietin (EPO). Unlike EPO itself, ARA-290 does not stimulate red blood cell production but selectively activates the innate repair receptor (IRR) — a heterodimer of the EPO receptor and the common beta receptor. It has been studied for neuroprotection, pain relief, and anti-inflammatory effects in diabetic peripheral neuropathy and sarcoidosis.`,
    longDescription: `What is ARA-290?

ARA-290 (Cibinetide) is a peptide designed to capture the tissue-protective properties of erythropoietin (EPO) while avoiding its erythropoietic (blood cell stimulating) effects. EPO was long known to have non-hematopoietic effects including neuroprotection and tissue repair, but clinical use of EPO for these purposes was limited by the risk of dangerous polycythemia. Researchers identified that these tissue-protective effects are mediated through a distinct receptor complex — the innate repair receptor (IRR) — and designed ARA-290 as a selective IRR agonist with no activity at the standard EPO receptor dimer responsible for red blood cell production.

ARA-290 Structure and Mechanism

ARA-290 is an 11-amino acid cyclic peptide corresponding to a helix B surface peptide of erythropoietin. The cyclic structure confers stability and selectivity for the IRR over the homodimeric EPO receptor. ARA-290 activates the IRR — a heterodimer of EpoR and the common β-receptor (βcR) — which is expressed in neurons, macrophages, and other non-hematopoietic tissues.

ARA-290 Research

The most significant clinical research on ARA-290 has been conducted in diabetic peripheral neuropathy (DPN). In a randomized controlled trial published in Diabetes, ARA-290 treatment significantly reduced small fiber neuropathy symptoms (pain, numbness, autonomic dysfunction) and increased corneal nerve fiber density compared to placebo — a structural endpoint indicating nerve regeneration. The compound appears to promote peripheral nerve repair and reduce neuroinflammation in a dose-dependent manner.

Additional research has investigated ARA-290 in sarcoidosis-associated small fiber neuropathy, where it again demonstrated significant reductions in neuropathic pain and autonomic symptoms. Studies in animal models have explored ARA-290's anti-inflammatory effects through IRR-mediated modulation of macrophage phenotype from pro-inflammatory (M1) to anti-inflammatory (M2), with implications for inflammatory and autoimmune conditions. Research has also shown ARA-290 promotes retinal repair in models of diabetic retinopathy, suggesting IRR-mediated tissue protection extends to multiple organ systems.`
  },

  "9": {
    id: "9",
    casNumber: "1937681-48-7",
    formula: "C₂₅H₃₉N₇O₉S",
    molecularWeight: "645.69 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Cardiovascular Research", "Cardiac Fibrosis Research", "Anti-Fibrotic Research", "Relaxin Research"],
    alsoKnownAs: "B7-33, Single-chain relaxin-2 analogue",
    description: `B7-33 is a single-chain peptide analogue of relaxin-2, designed to selectively activate the RXFP1 (relaxin family peptide receptor 1) while avoiding the dual-chain production complexity of native relaxin-2. Research has demonstrated anti-fibrotic effects in the heart, lungs, and kidneys, with potential applications in cardiac fibrosis, heart failure, and organ fibrosis conditions.`,
    longDescription: `What is B7-33?

B7-33 is a truncated, single-chain peptide analog of human relaxin-2, developed by researchers at Florey Institute of Neuroscience and Mental Health in Australia. Native relaxin-2 is a two-chain insulin-like peptide with potent anti-fibrotic and vasodilatory properties mediated through RXFP1 receptors. However, its two-chain structure makes production difficult and costly, and it has a short half-life limiting clinical utility. B7-33 was engineered as a minimized, single-chain version that retains RXFP1 agonism and biological activity with simpler production characteristics.

B7-33 Structure

B7-33 corresponds to residues 7-33 of the B-chain of human relaxin-2, with modifications to enhance receptor binding and stability. Unlike native relaxin-2, which requires both A and B chains to fold correctly around a connecting peptide, B7-33 self-folds as a single chain while maintaining the key RXFP1-binding pharmacophore. The compound has MW approximately 645.69 g/mol.

B7-33 Research

The primary focus of B7-33 research has been cardiac and organ fibrosis. Studies in mouse models of cardiac fibrosis — a major contributor to heart failure — have shown that B7-33 treatment significantly reduces collagen deposition and fibrotic remodeling in the heart. The compound appears to inhibit the TGF-β/Smad2 pathway, a central driver of fibrosis, while promoting matrix metalloproteinase activity to break down established collagen deposits.

Research has expanded to lung fibrosis (idiopathic pulmonary fibrosis models), renal fibrosis, and hepatic fibrosis, consistently showing anti-fibrotic effects through RXFP1-mediated signaling. Unlike conventional anti-fibrotic approaches, B7-33 also demonstrates vasodilatory and anti-inflammatory properties, addressing multiple pathological mechanisms simultaneously. Studies in models of heart failure have shown B7-33 can improve cardiac function measures including ejection fraction and ventricular compliance, suggesting potential in preserved ejection fraction heart failure where effective treatments are limited.`
  },

  "19": {
    id: "19",
    casNumber: "2381090-52-2",
    formula: "C₁₈₃H₂₈₁N₄₇O₅₈",
    molecularWeight: "4089.5 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white lyophilized powder",
    halfLife: "Approximately 7 days (subcutaneous)",
    researchAreas: ["Obesity Research", "Metabolic Research", "Cardiovascular Research", "Amylin Research"],
    alsoKnownAs: "AM833, IcoSema (in combination with semaglutide)",
    description: `Cagrilintide is a long-acting amylin receptor agonist developed by Novo Nordisk. Amylin is a pancreatic hormone co-secreted with insulin that regulates food intake, gastric emptying, and postprandial glucagon secretion. Cagrilintide mimics amylin's anorectic and metabolic effects with once-weekly dosing, and has been studied both as a monotherapy and in combination with semaglutide (as "CagriSema") for synergistic weight loss.`,
    longDescription: `What is Cagrilintide?

Cagrilintide (AM833) is a synthetic, long-acting analogue of the human pancreatic hormone amylin (also known as islet amyloid polypeptide, IAPP). Amylin is a 37-amino acid peptide co-secreted with insulin from pancreatic β-cells in response to food intake. It plays important physiological roles in regulating postprandial metabolism including reducing food intake, slowing gastric emptying, and suppressing glucagon secretion. Cagrilintide was engineered with fatty acid modifications and sequence substitutions to extend its half-life from minutes (native amylin) to approximately 7 days, enabling once-weekly subcutaneous dosing.

Cagrilintide Structure

Cagrilintide shares the core structure of native amylin (37 amino acids) with key modifications: specific amino acid substitutions to reduce amyloidogenicity (a problem with native amylin that causes pancreatic amyloid deposits) and addition of a C18 fatty acid chain for albumin binding — the same albumin-binding strategy used to extend the half-life of semaglutide and insulin degludec. These modifications yield a molecule with MW approximately 4089.5 g/mol and approximately 7-day half-life in the subcutaneous compartment.

Cagrilintide Research

Phase 2 clinical research has demonstrated that Cagrilintide as monotherapy produces dose-dependent weight loss in obese subjects, with the highest dose (4.5mg once weekly) producing approximately 10.8% body weight reduction at 26 weeks — comparable to semaglutide at similar time points. Mechanistically, Cagrilintide reduces food intake through amylin receptor-mediated effects in the area postrema and nucleus accumbens, brain regions involved in satiety and reward signaling.

The most compelling research involves CagriSema — the combination of Cagrilintide and semaglutide. Phase 2b data showed that CagriSema produced approximately 17.1% body weight reduction at 32 weeks, exceeding either agent alone and suggesting synergistic effects through complementary mechanisms (GLP-1 receptor agonism plus amylin receptor agonism). Phase 3 trials (REDEFINE) have confirmed continued superiority of the combination, with some analyses showing weight loss exceeding 22% in high-dose groups — positioning CagriSema as a potentially transformative pharmacotherapy for obesity.`
  },

  "32": {
    id: "32",
    casNumber: "62568-57-4",
    formula: "C₃₅H₄₈N₁₀O₁₅",
    molecularWeight: "849.82 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water",
    halfLife: "Approximately 30–40 minutes (intravenous)",
    sequence: "Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu",
    researchAreas: ["Sleep Research", "Neuroprotection", "Stress Research", "Immune Research", "Circadian Research"],
    alsoKnownAs: "Delta Sleep-Inducing Peptide, DSIP",
    description: `DSIP (Delta Sleep-Inducing Peptide) is a naturally occurring neuropeptide first isolated from the cerebral venous blood of rabbits in a state of sleep by Monnier and colleagues in 1977. It is named for its ability to induce delta-wave (slow-wave) sleep patterns when administered centrally. Research has explored its effects on sleep architecture, stress response, pain modulation, and immune function.`,
    longDescription: `What is DSIP?

Delta Sleep-Inducing Peptide (DSIP) is a nonapeptide (9 amino acids: Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu) that was originally isolated from rabbit thalamic venous blood by Marcel Monnier's group at the University of Basel in 1974. It was named for its initial demonstration of inducing delta wave sleep when infused into recipient rabbits. DSIP is found naturally in the brain, pituitary, and other tissues, and appears to be regulated by circadian rhythms, being highest during sleep periods.

DSIP Structure

DSIP is a 9-amino acid neuropeptide with the sequence Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu. Its molecular formula is C₃₅H₄₈N₁₀O₁₅ with MW 849.82 g/mol. The peptide is notable for its ability to cross the blood-brain barrier despite its relatively hydrophilic character — a property that has been attributed to its specific interaction with transport proteins. DSIP can exist in multiple forms including cyclic and linear configurations.

DSIP Research

Early research in rabbits established DSIP's sleep-inducing effects, but subsequent studies in rodents and humans have yielded complex and sometimes inconsistent results. Some human studies demonstrated that exogenous DSIP administration improved sleep quality and reduced insomnia, while others showed limited effects — partly attributed to differences in formulation and delivery route.

Beyond sleep, research has expanded to explore DSIP's effects on the hypothalamic-pituitary-adrenal (HPA) axis and stress response. Studies have shown DSIP can normalize disrupted HPA axis activity, potentially making it relevant to stress-related conditions. Animal research has demonstrated analgesic (pain-reducing) properties, with DSIP reducing pain sensitivity in various pain models through unknown mechanisms possibly involving opioid receptor interactions. Immunomodulatory effects have also been documented, with DSIP influencing natural killer cell activity and cytokine production. Research in cancer models has explored potential anti-tumor properties, and studies of opioid withdrawal have shown DSIP may attenuate some withdrawal symptoms.`
  },

  "39": {
    id: "39",
    casNumber: "1247951-53-6",
    formula: "Cyclic peptide",
    molecularWeight: "Approximately 4.0 kDa",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Senescence Research", "Cancer Research", "Anti-Aging Research", "Apoptosis Research"],
    alsoKnownAs: "FOXO4-DRI, Proxofim, APO866 related",
    description: `FOXO4-DRI (Proxofim) is a D-amino acid retro-inverso peptide designed to selectively induce apoptosis in senescent cells. Cellular senescence — a state of permanent cell cycle arrest — is a driver of aging and age-related disease. FOXO4-DRI disrupts the interaction between FOXO4 and p53 in senescent cells, releasing p53 from its nuclear sequestration to trigger apoptosis specifically in senescent (but not healthy) cells.`,
    longDescription: `What is FOXO4-DRI?

FOXO4-DRI (also known as Proxofim) is a D-retro-inverso (DRI) peptide therapeutic designed as a senolytic — a compound that selectively eliminates senescent cells from tissues. Cellular senescence is a fundamental biological process in which cells permanently exit the cell cycle in response to damage, oncogenic signals, or telomere shortening. While senescence serves an initial tumor-suppressive role, the accumulation of senescent cells with age drives chronic inflammation, tissue dysfunction, and organ aging through the senescence-associated secretory phenotype (SASP). FOXO4-DRI targets a specific anti-apoptotic mechanism unique to senescent cells.

FOXO4-DRI Structure and Mechanism

In senescent cells, the transcription factor FOXO4 becomes constitutively activated and forms a critical pro-survival complex with p53 in the cell nucleus. This FOXO4-p53 interaction prevents p53 from executing its apoptotic program in senescent cells — essentially making them resistant to death signals. FOXO4-DRI is a 32-amino acid peptide (using D-amino acids for protease resistance, in reversed sequence for cell penetration) corresponding to the p53-binding domain of FOXO4. By competing with endogenous FOXO4 for p53 binding, FOXO4-DRI releases p53, which then translocates to the mitochondria and triggers apoptosis — but only in cells where FOXO4 is actively protecting them (i.e., senescent cells).

FOXO4-DRI Research

The landmark study published in Cell (2017) by Judith Campisi's group and collaborators demonstrated that FOXO4-DRI selectively induced apoptosis in senescent cells in culture and in aged mice, with minimal effect on non-senescent cells. Aged mice treated with FOXO4-DRI showed remarkable improvements in multiple aging phenotypes: restored fitness (running speed, grip strength), improved fur density (reversing alopecia), improved kidney function, and improved physical fitness. Importantly, these effects occurred without apparent toxicity in young or healthy animals, confirming the senescence selectivity of the approach.

Subsequent research has explored FOXO4-DRI in models of chemotherapy-induced senescence, radiation-induced senescence, and organ fibrosis. The compound has shown promise in reducing SASP-driven inflammation and improving tissue function across multiple aging-related research contexts. Research continues to investigate delivery optimization, dosing schedules, and combination with other longevity interventions.`
  },

  "47": {
    id: "47",
    casNumber: "72957-37-0",
    formula: "C₁₃H₂₁N₅O₅",
    molecularWeight: "327.34 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water",
    sequence: "Gly-His-Lys",
    researchAreas: ["Wound Healing", "Hair Research", "Skin Health Research", "Collagen Research"],
    alsoKnownAs: "GHK, Tripeptide-1 (copper-free form), Glycyl-L-Histidyl-L-Lysine",
    description: `GHK Basic 50mg is the copper-free form of the tripeptide Gly-His-Lys (GHK), without the copper ion complexation. While GHK-Cu (copper complex) is more biologically active in wound healing and collagen synthesis, the free tripeptide GHK itself still shows biological activity and is studied independently. GHK naturally occurs in blood plasma and has high affinity for copper ions, making it an important component of copper transport systems in tissue.`,
    longDescription: `What is GHK Basic?

GHK (Glycyl-L-Histidyl-L-Lysine) is the free tripeptide precursor to the GHK-Cu copper complex. GHK was first identified in 1973 by Loren Pickart as a liver cell growth-stimulating factor present in human plasma albumin. The peptide has extremely high affinity for copper (II) ions (Cu²⁺) with a binding constant in the femtomolar range, making it one of the most effective biological copper chelators known. In tissue, GHK functions as part of the copper transport system, facilitating delivery of copper ions to enzymes that require copper for catalytic activity.

GHK Structure

GHK has the sequence Gly-His-Lys with molecular formula C₁₃H₂₁N₅O₅ and MW 327.34 g/mol. The histidine imidazole group and the terminal amino and carboxyl groups of the tripeptide form a stable coordination complex with Cu²⁺. In biological contexts, GHK exists in equilibrium between its copper-free and copper-bound forms, with the copper-bound form (GHK-Cu) being responsible for most known biological activities.

GHK Research

While most research has focused on the GHK-Cu copper complex, GHK itself has demonstrated biological activity in some research contexts. Studies have shown GHK can promote hair follicle growth, potentially through its role in copper delivery to hair follicle enzymes including superoxide dismutase (SOD) and lysyl oxidase. Research in skin biology has examined whether GHK's copper-chelating activity can reduce copper-dependent oxidative stress in aged skin.

The free tripeptide also serves as an important research tool for studying structure-activity relationships — comparing the biological effects of GHK with and without copper to isolate which activities are copper-dependent versus peptide-sequence-dependent. Studies have shown that the peptide backbone of GHK, independent of copper, can influence gene expression related to collagen synthesis, though less potently than the copper complex.`
  },

  "49": {
    id: "49",
    casNumber: "9034-39-3",
    formula: "C₂₁₅H₃₅₈N₇₂O₆₆S",
    molecularWeight: "5040.5 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water",
    halfLife: "Approximately 7 minutes (intravenous)",
    sequence: "Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln-Gln-Gly-Glu-Ser-Asn-Gln-Glu-Arg-Gly-Ala-Arg-Ala-Arg-Leu-NH₂",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research", "Pituitary Research"],
    alsoKnownAs: "Growth Hormone Releasing Hormone, GHRH(1-44)-NH₂, Somatoliberin",
    description: `GHRH (Growth Hormone Releasing Hormone) 5mg is the full-length, 44-amino acid endogenous hypothalamic peptide that stimulates growth hormone synthesis and secretion from the pituitary gland. Unlike synthetic GHRH analogues (Sermorelin, CJC-1295), native GHRH(1-44) is the natural signal for pulsatile GH release. It is used in research as the gold standard reference for GH secretagogue activity.`,
    longDescription: `What is GHRH?

Growth Hormone Releasing Hormone (GHRH) is a 44-amino acid peptide produced and secreted by neuroendocrine neurons in the arcuate nucleus of the hypothalamus. It is the primary physiological stimulus for growth hormone (GH) synthesis and secretion from somatotroph cells in the anterior pituitary gland. GHRH acts through specific GHRH receptors (GHRHR) on pituitary somatotrophs, activating adenylyl cyclase and increasing intracellular cAMP — ultimately triggering GH gene transcription and secretory granule exocytosis.

GHRH Structure

Native GHRH is a 44-amino acid peptide (GHRH(1-44)-NH₂) with an amidated C-terminus. The first 29 amino acids (GHRH(1-29)) contain the full receptor-binding activity and are sufficient for GH stimulation — which is the basis for synthetic analogues like Sermorelin (GHRH(1-29)-NH₂) and CJC-1295. The full-length 44-amino acid form has MW approximately 5040.5 g/mol. Native GHRH has a very short half-life in plasma (approximately 7 minutes due to dipeptidyl peptidase IV cleavage), which is why longer-acting synthetic analogues were developed for clinical applications.

GHRH Research

As the endogenous GH secretagogue, GHRH serves as the reference compound for all growth hormone research. Studies using GHRH have established our fundamental understanding of pulsatile GH release — the pattern of GH secretion that occurs multiple times per day in humans, with the largest pulse during slow-wave sleep. Research has explored how GHRH pulse frequency and amplitude change across the lifespan, with age-related declines in GHRH signaling contributing to the somatopause — the progressive decline in GH/IGF-1 with aging.

Clinical research has employed GHRH stimulation tests as a diagnostic tool for GH deficiency and pituitary dysfunction. GHRH infusion in GH-deficient subjects helps distinguish hypothalamic from pituitary causes of GH deficiency. Basic science research using GHRH continues to illuminate the neuroendocrine regulation of growth, metabolism, and body composition, informing the development of next-generation GH secretagogue therapies.`
  },

  "62": {
    id: "62",
    casNumber: "33515-09-2",
    formula: "C₅₅H₇₅N₁₇O₁₃",
    molecularWeight: "1182.31 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water",
    halfLife: "Approximately 2–4 minutes (intravenous)",
    sequence: "Glu-His-Trp-Ser-Tyr-Gly-Leu-Arg-Pro-Gly-NH₂",
    researchAreas: ["Reproductive Research", "Hormonal Research", "LH/FSH Research", "Endocrinology Research"],
    alsoKnownAs: "GnRH, LHRH, Gonadorelin acetate, Luteinizing Hormone Releasing Hormone",
    description: `Gonadorelin is the synthetic form of endogenous gonadotropin-releasing hormone (GnRH), a decapeptide produced by the hypothalamus that stimulates the pituitary to release luteinizing hormone (LH) and follicle-stimulating hormone (FSH). These gonadotropins regulate reproductive function in both males and females. Gonadorelin is used in research for studying the HPG (hypothalamic-pituitary-gonadal) axis and reproductive endocrinology.`,
    longDescription: `What is Gonadorelin?

Gonadorelin is the INN (International Nonproprietary Name) for synthetic GnRH (Gonadotropin-Releasing Hormone), also known as LHRH (Luteinizing Hormone-Releasing Hormone). It is a decapeptide (10 amino acids: Glu-His-Trp-Ser-Tyr-Gly-Leu-Arg-Pro-Gly-NH₂) synthesized by neurons in the hypothalamus and secreted into the hypophyseal portal circulation in a pulsatile manner. Gonadorelin acts on GnRH receptors in the anterior pituitary to stimulate the synthesis and secretion of both LH (luteinizing hormone) and FSH (follicle-stimulating hormone).

Gonadorelin Structure

Gonadorelin is a decapeptide with MW 1182.31 g/mol. Its sequence is identical to endogenous GnRH. The C-terminal amidation (Gly-NH₂) is essential for biological activity. The native peptide has a very short half-life (2–4 minutes) due to rapid enzymatic degradation, which underlies the development of long-acting GnRH analogues (e.g., leuprolide, nafarelin) for clinical applications. The pulsatile administration of Gonadorelin stimulates gonadotropin release, while continuous administration paradoxically suppresses it through receptor downregulation.

Gonadorelin Research

Gonadorelin serves as the reference compound for HPG axis research. Studies have established that pulsatile GnRH administration (mimicking the natural hypothalamic secretion pattern) is required for sustained LH and FSH release and reproductive function. Continuous GnRH exposure, in contrast, desensitizes pituitary GnRH receptors and suppresses gonadotropin secretion — the basis for GnRH agonist therapy in conditions like prostate cancer, endometriosis, and precocious puberty.

Research applications include: characterizing pituitary GnRH receptor density and sensitivity, studying HPG axis dysfunction in hypothalamic amenorrhea and hypogonadotropic hypogonadism, and investigating how feedback hormones (estrogen, testosterone, inhibin) regulate GnRH receptor expression. Gonadorelin stimulation tests are used to assess pituitary gonadotroph reserve. Research has also explored Gonadorelin's neuroprotective properties, as GnRH receptors are expressed in brain regions beyond the pituitary.`
  },

  "66": {
    id: "66",
    casNumber: "140703-51-1",
    formula: "C₅₀H₆₉N₁₅O₉",
    molecularWeight: "1051.18 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes",
    sequence: "His-D-2-Nal-D-Phe-Lys-NH₂ (modified cyclic structure)",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research", "Body Composition Research"],
    alsoKnownAs: "Examorelin, MK-0771",
    description: `Hexarelin is a synthetic hexapeptide growth hormone secretagogue and ghrelin mimetic. It is among the most potent GH secretagogues in the GHRP class, demonstrating superior GH-releasing potency compared to GHRP-2 and GHRP-6 in head-to-head comparisons. Research has explored its effects on GH release, cardiovascular function, and cardiac protection — notably showing cardioprotective effects through GHS-R1a receptors expressed in cardiac tissue.`,
    longDescription: `What is Hexarelin?

Hexarelin (Examorelin) is a synthetic six-amino acid peptide that acts as a potent agonist of the growth hormone secretagogue receptor (GHS-R1a, also known as the ghrelin receptor). It was developed by Europeptides in France and has been one of the most extensively studied GHRP compounds. Hexarelin demonstrates the highest GH-releasing potency among the classical GHRP compounds, surpassing GHRP-2, GHRP-6, and Ipamorelin in head-to-head comparisons in animal and human studies.

Hexarelin Structure

Hexarelin (His-D-2-Nal-D-Phe-Lys-NH₂) is structurally related to GHRP-6 but has modifications that enhance its receptor binding affinity and GH-releasing potency. Molecular formula C₅₀H₆₉N₁₅O₉ with MW 1051.18 g/mol. The D-amino acids (D-2-naphthylalanine, D-phenylalanine) in the sequence confer resistance to enzymatic degradation and enhance receptor binding.

Hexarelin Research

Studies in humans have confirmed that Hexarelin is among the most potent stimulators of GH secretion in the GHRP class, producing higher peak GH levels than equivalent doses of GHRP-2 or GHRP-6. Research in both young and elderly subjects has demonstrated dose-dependent GH release, with the compound effectively restoring age-related decline in GH pulsatility.

A particularly significant aspect of Hexarelin research involves its cardiac effects. Studies have shown that the heart expresses GHS-R1a receptors, and Hexarelin administration produces cardioprotective effects in models of ischemia-reperfusion injury. Research demonstrated that Hexarelin protects cardiac myocytes from apoptosis following ischemic injury and improves cardiac function recovery. Importantly, some cardioprotective effects appear to be independent of the GH axis, suggesting direct GHS-R1a-mediated cardiac protection. Studies in animals with heart failure showed improved left ventricular function with Hexarelin treatment, positioning it as an interesting research compound for cardiac physiology studies beyond GH research.`
  },

  "67": {
    id: "67",
    casNumber: "140703-51-1",
    formula: "C₅₀H₆₉N₁₅O₉",
    molecularWeight: "1051.18 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes",
    sequence: "His-D-2-Nal-D-Phe-Lys-NH₂",
    researchAreas: ["Growth Hormone Research", "Cardiovascular Research", "Anti-Aging Research", "Metabolic Research"],
    alsoKnownAs: "Examorelin, MK-0771",
    description: `Hexarelin 5mg provides a larger research quantity of this highly potent growth hormone secretagogue peptide. Hexarelin demonstrates superior GH-releasing potency among GHRP compounds and shows unique cardioprotective properties through GHS-R1a receptors expressed in cardiac tissue — making it valuable for both GH axis and cardiac physiology research.`,
    longDescription: `Hexarelin 5mg is the same compound as Hexarelin 2mg, providing a larger research quantity for extended studies. Please refer to the Hexarelin 2mg product description for the full overview, structure, and research sections, which apply equally to this formulation. The 5mg quantity supports multi-dose protocols and longitudinal research designs requiring larger compound quantities.`
  },

  "69": {
    id: "69",
    casNumber: "146954-29-2",
    formula: "C₈₀H₁₁₂N₂₄O₂₂S₂",
    molecularWeight: "1895.02 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    sequence: "MAPRGFSCLLLLTSGIQGAPAAGEDRHSDLAILLGRFEE (21 amino acids in active form varies by species)",
    researchAreas: ["Longevity Research", "Neuroprotection Research", "Mitochondrial Research", "Metabolic Research", "Cardioprotection"],
    alsoKnownAs: "Humanin, HN, Mitochondria-Derived Peptide (MDP)",
    description: `Humanin is a 21-amino acid mitochondrial-derived peptide (MDP) encoded within the 16S rRNA region of the mitochondrial genome — an unusual location for a protein-coding sequence. It was originally identified in a screen for factors that could rescue neurons from Alzheimer's disease-associated degeneration. Research has revealed it as a cytoprotective peptide with roles in cell survival, insulin sensitivity, and longevity.`,
    longDescription: `What is Humanin?

Humanin (HN) is a 21-amino acid peptide encoded within the mitochondrial genome, specifically within the 16S rRNA region. It was discovered in 2001 by Nishimoto and colleagues while screening a cDNA library derived from brain tissue of an Alzheimer's disease patient, looking for factors that could rescue neurons from Alzheimer's-associated cell death. Its mitochondrial origin was surprising, as protein-coding sequences in mitochondrial DNA are exceedingly rare. Humanin is now recognized as the founding member of a class of small peptides called mitochondria-derived peptides (MDPs) or mitochondrial microproteins.

Humanin Structure

Humanin is a 21-amino acid peptide (rat sequence) or 24-amino acid peptide (human sequence) with MW approximately 1895 g/mol. The peptide is found both intracellularly (where it interacts with mitochondrial proteins) and extracellularly (as a secreted peptide with systemic hormonal effects). An S14G substitution (Gly-Humanin or HNG) substantially increases its potency. Humanin circulates in human blood and cerebrospinal fluid, with levels declining with age.

Humanin Research

The original characterization showed Humanin could rescue neurons from β-amyloid (Aβ) peptide toxicity, presenilin-2 mutations, and other Alzheimer's disease-associated insults. The neuroprotective mechanism involves Humanin acting through two receptor systems: the gp130/CNTFR/WSX-1 tripartite receptor complex on the cell surface (activating JAK-STAT signaling) and intracellularly through interaction with IGFBP-3, Bax, and other apoptotic regulators.

Aging research has demonstrated that Humanin levels decrease with age in multiple tissues and that this decline correlates with increased age-related disease burden. In animal models, Humanin administration extends lifespan and healthspan in C. elegans and improves multiple aging parameters in mice. Studies have shown Humanin improves insulin sensitivity, reduces atherosclerotic plaque formation, and protects against diet-induced obesity. Cardiac research has demonstrated cardioprotective effects in ischemia-reperfusion models, with Humanin reducing infarct size and improving cardiac function recovery. Research continues to investigate Humanin as a potential therapeutic agent for aging and age-related diseases.`
  },

  "70": {
    id: "70",
    casNumber: "112603-39-1",
    formula: "C₃₉H₆₂N₈O₁₀",
    molecularWeight: "822.96 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 20–30 minutes",
    researchAreas: ["Muscle Research", "Anabolic Research", "Recovery Research", "IGF-1 Research"],
    alsoKnownAs: "IGF-1 DES(1-3), des(1-3) IGF-1, Truncated IGF-1",
    description: `IGF-1 DES (des[1-3]-IGF-1) is a truncated form of IGF-1 (Insulin-like Growth Factor-1) missing the first three N-terminal amino acids (Gly-Pro-Glu). This truncation significantly reduces its affinity for IGF-binding proteins (IGFBPs), which normally sequester approximately 99% of circulating IGF-1. As a result, IGF-1 DES may have greater bioavailability at target tissues compared to full-length IGF-1. Research has explored its potent anabolic effects in muscle and bone tissue.`,
    longDescription: `What is IGF-1 DES?

IGF-1 DES (des(1-3) IGF-1, also called Brain IGF-1) is a naturally occurring truncated variant of IGF-1 found in high concentrations in the brain, gut, and colostrum. It lacks the first three N-terminal amino acids (Gly-Pro-Glu) of full-length IGF-1, a modification that is generated by proteolytic cleavage. This truncation has a dramatic effect on binding protein affinity — while full-length IGF-1 binds tightly to IGF-binding proteins (IGFBPs 1–6), IGF-1 DES has approximately 10-fold lower affinity for these binding proteins.

IGF-1 DES Structure

IGF-1 DES is a 67-amino acid (vs 70 for full-length) single-chain polypeptide with three intramolecular disulfide bonds essential for its tertiary structure. Its receptor binding affinity for the IGF-1R is comparable to or slightly greater than full-length IGF-1. The critical difference lies in reduced IGFBP binding, which means less IGF-1 DES is sequestered by binding proteins in the circulation, potentially making more of the molecule available for receptor binding at target tissues.

IGF-1 DES Research

In vitro studies have demonstrated that IGF-1 DES is approximately 10-fold more potent than full-length IGF-1 in promoting protein synthesis and cell proliferation in myoblasts (muscle precursor cells) — an effect attributed to its reduced IGFBP binding and consequent higher free concentration available to receptors. Animal studies have shown that local injection of IGF-1 DES into muscle produces significant increases in muscle fiber hypertrophy.

Research has also explored IGF-1 DES in bone biology, finding it promotes osteoblast proliferation and bone formation with high potency. Studies in gastrointestinal research have investigated IGF-1 DES's role in intestinal epithelial healing, where it naturally concentrates at high levels. The compound's neurological role has been studied in the context of brain development and neuroprotection, where DES-IGF-1 may function as a locally acting paracrine factor distinct from the endocrine role of circulating full-length IGF-1.`
  },

  "71": {
    id: "71",
    casNumber: "946870-92-4",
    formula: "C₄₀₀H₆₂₅N₁₁₁O₁₁₅S₉",
    molecularWeight: "9117.49 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 20 hours (intravenous); longer subcutaneous",
    researchAreas: ["Muscle Research", "Body Composition Research", "Anabolic Research", "Growth Factor Research", "Cancer Research"],
    alsoKnownAs: "Long-Arg3-IGF-1, R3 IGF-1 Receptor Grade",
    description: `IGF-1 LR3 (Receptor Grade) is a highly purified, recombinant form of Long-Arg3-IGF-1, an 83-amino acid analogue of IGF-1 with superior stability and a substantially extended half-life compared to native IGF-1. The Arg3 substitution and N-terminal extension reduce IGFBP binding, making more IGF-1 LR3 available for receptor activation. The "Receptor Grade" designation indicates the highest available purity standard for receptor binding research.`,
    longDescription: `What is IGF-1 LR3 (Receptor Grade)?

IGF-1 LR3 (Long-Arg3 IGF-1) is a recombinant analogue of human IGF-1 engineered for enhanced research utility. It was originally developed by GroPep Bioreagents as a research tool to overcome the limitations of native IGF-1 in cell culture and in vivo research. The modifications — a 13-amino acid N-terminal extension and an Arg3 substitution (replacing glutamate-3 with arginine) — dramatically reduce binding to IGF-binding proteins (IGFBPs) while preserving potent IGF-1R binding and activation.

IGF-1 LR3 Structure

IGF-1 LR3 is an 83-amino acid polypeptide (vs 70 for native IGF-1) with the sequence E-A-E-A-S-N-A-S-T-G-N-A-P-[IGF-1 R3 sequence]. The N-terminal extension and Arg3 substitution together reduce IGFBP-3 binding affinity by approximately 1000-fold compared to native IGF-1. The receptor grade formulation undergoes additional purification steps to ensure >99% purity and maximal receptor binding activity, making it the preferred choice for receptor binding studies and cell culture work requiring maximum consistency.

IGF-1 LR3 Research

The primary advantage of IGF-1 LR3 in research contexts is its prolonged half-life (approximately 20 hours vs. 10–12 minutes for native IGF-1) due to reduced IGFBP sequestration, and its superior cell culture performance. In cell biology research, IGF-1 LR3 provides more consistent and potent IGF-1R stimulation than native IGF-1 because IGFBP proteins in serum cannot neutralize it. This makes it valuable for studying IGF-1R signaling, PI3K/Akt/mTOR pathway activation, and downstream anabolic effects.

Animal research using IGF-1 LR3 has demonstrated potent effects on muscle hypertrophy, fat mass reduction, and bone density. Studies injecting IGF-1 LR3 into muscle have shown significant local hypertrophic effects. The compound is also used in cancer research to study IGF-1R-dependent tumor growth and IGF-1R inhibitor efficacy, as many tumors overexpress IGF-1R and may be partly driven by IGF-1 signaling.`
  },

  "72": {
    id: "72",
    casNumber: "946870-92-4",
    formula: "C₄₀₀H₆₂₅N₁₁₁O₁₁₅S₉",
    molecularWeight: "9117.49 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 20 hours",
    researchAreas: ["Muscle Research", "Body Composition Research", "Anabolic Research", "Growth Factor Research"],
    alsoKnownAs: "Long-Arg3-IGF-1, R3 IGF-1",
    description: `IGF-1 LR3 1mg is the standard (non-receptor grade) formulation of Long-Arg3-IGF-1, an 83-amino acid analogue of human IGF-1 with dramatically reduced IGFBP binding affinity and extended half-life. This formulation provides cost-effective access to the compound for general research purposes where the highest purity receptor-grade specification is not required.`,
    longDescription: `IGF-1 LR3 is identical in molecular structure to the Receptor Grade version. Please refer to the IGF-1 LR3 Receptor Grade product description for the full overview, structure, and research sections. The standard 1mg formulation is appropriate for in vitro cell culture work, signaling pathway studies, and in vivo research applications where receptor-grade specification is not required.`
  },

  "77": {
    id: "77",
    casNumber: "170851-70-4",
    formula: "C₃₈H₄₉N₉O₅",
    molecularWeight: "711.868 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH₂",
    halfLife: "Approximately 2 hours",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Anti-Aging Research"],
    alsoKnownAs: "NNC 26-0161",
    description: `Ipamorelin 10mg provides an extended research quantity of this highly selective growth hormone secretagogue pentapeptide. At 10mg per vial, this quantity supports long-duration research protocols or multi-subject studies. Ipamorelin's outstanding selectivity for GH release without significant ACTH, cortisol, or prolactin stimulation makes it the cleanest GHRP for isolated GH axis research.`,
    longDescription: `Ipamorelin 10mg is the same compound as smaller vial sizes, providing a greater quantity for extended research. The research-relevant information for Ipamorelin applies equally to this formulation. Ipamorelin selectively stimulates GH release through the ghrelin receptor without the off-target cortisol, ACTH, or prolactin elevations seen with GHRP-2 and GHRP-6, making it the preferred GHRP for clean GH secretagogue studies.

Key Ipamorelin Research Points

Research in rats, dogs, and humans consistently shows that Ipamorelin produces dose-dependent GH release comparable to GHRP-6 in terms of peak GH levels, but without the significant cortisol and ACTH elevations. This selectivity appears to stem from Ipamorelin's specific binding mode at the ghrelin receptor, which activates GH secretion pathways without triggering the broader hypothalamic-pituitary-adrenal axis stimulation seen with less selective GHRPs.

Long-term studies with Ipamorelin in rats have demonstrated sustained GH and IGF-1 elevations over months of treatment, with beneficial effects on body composition including increased lean mass and decreased fat mass. Chronic Ipamorelin use does not appear to desensitize the GH axis as aggressively as some other secretagogues, supporting its use in extended research protocols.`
  },

  "78": {
    id: "78",
    casNumber: "68581-28-2",
    formula: "C₅₈H₈₃N₁₃O₁₂",
    molecularWeight: "1302.37 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    sequence: "Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH₂",
    halfLife: "Approximately 30–60 minutes",
    researchAreas: ["Reproductive Research", "Hormonal Research", "Hypothalamic Research", "Fertility Research", "Testosterone Research"],
    alsoKnownAs: "Kisspeptin-10, metastin(45-54), KP-10",
    description: `Kisspeptin-10 is the 10-amino acid C-terminal active fragment of the full kisspeptin peptide (metastin/kisspeptin-54). Kisspeptins are neuropeptides encoded by the KISS1 gene that act on the GPR54 receptor (also known as KISS1R) and play critical roles in the regulation of the hypothalamic-pituitary-gonadal axis. Research has established Kisspeptin-10 as a potent stimulator of GnRH release, making it central to reproductive neuroendocrinology research.`,
    longDescription: `What is Kisspeptin-10?

Kisspeptin-10 (KP-10) is the minimal bioactive fragment of the kisspeptin family of neuropeptides, corresponding to the C-terminal 10 amino acids (residues 45-54) of the full 54-amino acid kisspeptin (metastin/kisspeptin-54). Kisspeptins were first identified as suppressors of metastasis (hence "metastin") but were subsequently found to play fundamental roles in reproductive endocrinology. The discovery that kisspeptin neurons in the hypothalamus directly control GnRH secretion revolutionized our understanding of reproductive neuroendocrinology.

Kisspeptin-10 Structure

KP-10 has the sequence Tyr-Asn-Trp-Asn-Ser-Phe-Gly-Leu-Arg-Phe-NH₂ with MW 1302.37 g/mol. The C-terminal Arg-Phe-NH₂ motif is essential for receptor binding — it is shared with other RF-amide peptides including neuropeptide FF and RFRP-3. The amidated C-terminus is required for full biological activity. KP-10 binds KISS1R (GPR54) with high affinity, triggering Gq-protein-mediated signaling and activation of hypothalamic GnRH neurons.

Kisspeptin-10 Research

The most fundamental research finding is that Kisspeptin-10 is an extraordinarily potent stimulator of GnRH pulse generation. Direct infusion of KP-10 into the mediobasal hypothalamus triggers GnRH pulse initiation in sheep, rats, and primates. Human studies have demonstrated that peripheral or central administration of Kisspeptin-10 produces robust LH surges through GnRH-dependent mechanisms — confirming the essential role of KISS1R signaling in human reproductive neuroendocrinology.

Research has established that kisspeptin neurons serve as the critical link through which sex steroids (estrogen, testosterone) regulate GnRH secretion. Kisspeptin neurons in the arcuate nucleus (KNDy neurons, co-expressing kisspeptin, neurokinin B, and dynorphin) generate the GnRH pulse rhythm, while kisspeptin neurons in the anteroventral periventricular nucleus mediate the estrogen-positive feedback required for the LH surge triggering ovulation. These findings have profound implications for understanding and treating infertility, hypothalamic amenorrhea, and other reproductive disorders.`
  },

  "79": {
    id: "79",
    casNumber: "4485-52-3",
    formula: "C₁₅H₂₈N₄O₅",
    molecularWeight: "344.41 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water",
    sequence: "Lys-Pro-Val",
    researchAreas: ["Anti-Inflammatory Research", "Gut Health Research", "IBD Research", "Melanocortin Research", "Skin Research"],
    alsoKnownAs: "Ac-KPV-NH₂, alpha-MSH(11-13), KPV tripeptide",
    description: `KPV (Lys-Pro-Val) is the C-terminal tripeptide fragment of alpha-melanocyte-stimulating hormone (α-MSH), specifically the residues 11-13. Despite its small size, KPV retains significant anti-inflammatory activity of the parent α-MSH molecule. Research has demonstrated potent anti-inflammatory effects in the gastrointestinal tract, with studies in experimental colitis models showing substantial reduction in inflammatory markers and mucosal damage.`,
    longDescription: `What is KPV?

KPV (Lys-Pro-Val) is the C-terminal tripeptide fragment (positions 11-13) of alpha-melanocyte-stimulating hormone (α-MSH). α-MSH is a 13-amino acid peptide derived from POMC (proopiomelanocortin) with potent anti-inflammatory properties mediated through melanocortin receptors. Studies by investigators including Dr. Anna Catania established that the C-terminal tripeptide KPV retains significant portions of α-MSH's anti-inflammatory activity — a remarkable finding given that α-MSH is 13 amino acids and KPV is only 3. This makes KPV an important research tool for studying melanocortin-mediated anti-inflammation.

KPV Structure

KPV (Lys-Pro-Val) is an extremely small tripeptide with MW 344.41 g/mol. Despite its minimal structure, it is recognized by melanocortin receptor 1 (MC1R) and may act through additional mechanisms not requiring receptor binding. The N-terminus is often acetylated (Ac-KPV) and the C-terminus amidated (KPV-NH₂) to improve stability and bioactivity, matching the corresponding positions in the full-length α-MSH sequence.

KPV Research

The most extensively researched application of KPV is in gut inflammation, particularly inflammatory bowel disease (IBD). Studies in mouse models of experimental colitis (DSS-induced and TNBS-induced) have consistently demonstrated that KPV administration — whether by injection, oral gavage, or direct intracolonic delivery — significantly reduces clinical signs of colitis, mucosal damage, and inflammatory cytokine production. KPV reduces expression of TNF-α, IL-1β, IL-6, and NFκB activity in intestinal tissue, paralleling the anti-inflammatory mechanism of α-MSH.

Research has shown that KPV can be formulated for oral delivery and partially survives gastrointestinal transit to exert local effects on the intestinal mucosa. This has led to significant interest in encapsulated and nanoparticle-formulated KPV for IBD research. Studies have also explored KPV's anti-inflammatory effects in skin, where it may reduce UV-induced inflammation, and in the nervous system, where melanocortin signaling has broad anti-inflammatory roles. KPV's small size is a significant advantage for drug development, as it can potentially penetrate mucus layers and reach inflamed intestinal epithelium more efficiently than larger peptides.`
  },

  "81": {
    id: "81",
    casNumber: "2243-47-2",
    formula: "C₂₀₅H₃₄₀N₆₀O₅₃S₅",
    molecularWeight: "4494 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Antimicrobial Research", "Immune Research", "Wound Healing", "Anti-Cancer Research", "Skin Research"],
    alsoKnownAs: "CAP-18, Cathelicidin, Human Cathelicidin Antimicrobial Peptide, hCAP-18",
    description: `LL-37 is the only known human cathelicidin antimicrobial peptide (AMP), a 37-amino acid helical peptide derived from the C-terminal portion of the cathelicidin precursor protein hCAP-18. LL-37 is produced primarily by neutrophils, keratinocytes, and epithelial cells as part of the innate immune response. Research has documented its broad-spectrum antimicrobial activity, immunomodulatory effects, wound healing promotion, and emerging cancer research applications.`,
    longDescription: `What is LL-37?

LL-37 is the human cathelicidin antimicrobial peptide, processed from the C-terminus of hCAP-18 (human cationic antimicrobial protein-18) by serine proteases. It is named for its 37-amino acid sequence beginning with two leucines (LL). LL-37 is produced primarily by neutrophils (stored in granules and released at sites of infection), keratinocytes (stimulated by vitamin D), epithelial cells of the gut and respiratory tract, and monocytes/macrophages. It represents the body's primary endogenous antibiotic at mucosal surfaces.

LL-37 Structure

LL-37 has a strongly cationic, amphipathic helical structure that is characteristic of antimicrobial peptides. In aqueous solution, LL-37 is largely unstructured, but upon membrane interaction, it adopts an α-helical conformation. The peptide has a high net positive charge (+6) at physiological pH, enabling electrostatic interaction with the negatively charged bacterial membranes. Its amphipathicity — with hydrophobic residues on one face and charged residues on the other — enables membrane insertion and disruption.

LL-37 Research

Antimicrobial research has demonstrated LL-37's broad-spectrum activity against Gram-positive bacteria, Gram-negative bacteria, fungi, and enveloped viruses. It disrupts bacterial membranes through mechanisms distinct from conventional antibiotics, making bacteria resistant to it less likely to emerge. Significantly, research has shown that LL-37 can synergize with conventional antibiotics and can disrupt biofilms — bacterial communities that are notoriously resistant to antibiotics — making it relevant to research in chronic and antibiotic-resistant infections.

Immunomodulatory research has revealed that LL-37 is much more than an antimicrobial — it is a multifunctional immunomodulator. LL-37 activates formyl peptide receptor 2 (FPR2/ALX) on neutrophils, monocytes, and dendritic cells, promoting chemotaxis and directing immune responses. It modulates macrophage function, promotes dendritic cell maturation, and influences T cell responses. In wound healing research, LL-37 has been shown to promote keratinocyte migration and proliferation, angiogenesis, and re-epithelialization through multiple receptor-mediated pathways.

Cancer research has revealed an intriguing dual role for LL-37 — it shows both anti-tumor effects (inducing apoptosis in certain cancer cell lines) and potentially pro-tumor effects in other contexts (acting as a growth factor for some cancers through EGFR and other receptor systems). This complex biology makes LL-37 a valuable research tool for understanding the intersection of innate immunity, inflammation, and tumor biology.`
  },

  "88": {
    id: "88",
    casNumber: "Not publicly available (recombinant protein)",
    formula: "Recombinant peptide fragment",
    molecularWeight: "Approximately 2867 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Muscle Research", "IGF-1 Research", "Anabolic Research", "Body Composition Research", "Exercise Research"],
    alsoKnownAs: "IGF-1 Ec, Mechano Growth Factor (MGF), Ec peptide",
    description: `MGF (Mechano-Growth Factor) is a splice variant of IGF-1 produced in response to mechanical stimulation of muscle and other tissues. The "Ec" designation refers to the unique C-terminal extension (E domain) of this splice variant. Research has shown that MGF plays a key role in local tissue repair and hypertrophy signaling following exercise or injury, acting through mechanisms partially distinct from systemic IGF-1.`,
    longDescription: `What is MGF (Mechano-Growth Factor)?

Mechano-Growth Factor (MGF) is one of several splice variants of the IGF-1 gene. In response to muscle damage (from exercise, injury, or other mechanical stimuli), a proportion of IGF-1 pre-mRNA in muscle tissue undergoes alternative splicing to include exon 5, generating the MGF variant with a unique 49-base pair insertion in the E domain. This generates a peptide with a distinct C-terminal extension (the Ec peptide) that has different binding protein interactions and receptor pharmacology compared to systemic (liver-derived) IGF-1 Ea.

MGF Structure

The unique feature of MGF is the Ec peptide — the C-terminal E domain encoded by the alternatively spliced exon. This region has been identified as having independent biological activity distinct from the IGF-1 receptor-binding domain of the parent molecule. Studies have shown the Ec peptide alone can activate muscle satellite cells (stem cells responsible for muscle repair and growth). MGF is initially produced as a full-length propeptide that is cleaved to release the mature IGF-1 domain plus the Ec peptide.

MGF Research

Research using local injection of MGF (or the Ec peptide) into muscle has demonstrated significant hypertrophic effects in muscle fibers without the systemic effects of full-length IGF-1. Studies in aged rats showed that a single injection of MGF gene could produce a 25% increase in muscle fiber cross-sectional area — a remarkable response suggesting MGF is a potent local muscle growth signal. The compound appears to work by activating quiescent satellite cells (muscle stem cells) to proliferate and differentiate, replenishing the satellite cell pool while providing new myonuclei for muscle fiber hypertrophy.

Exercise physiology research has established that local MGF mRNA expression increases within hours of resistance exercise in human skeletal muscle, preceding the later increase in systemic IGF-1 (the Ea variant). This temporal pattern suggests MGF serves as an early, acute signal for muscle satellite cell activation, while systemic IGF-1 provides sustained anabolic support. Research continues to investigate MGF's role in aging muscle, where satellite cell activation becomes impaired, and whether MGF administration can restore age-related declines in muscle regenerative capacity.`
  },

  "94": {
    id: "94",
    casNumber: "1627580-64-6",
    formula: "C₁₀₄H₁₅₃N₂₇O₂₆S",
    molecularWeight: "2173.5 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C.",
    appearance: "White lyophilized powder",
    sequence: "MRWQEMGYIFYPRKLR",
    researchAreas: ["Metabolic Research", "Longevity Research", "Exercise Research", "Insulin Sensitivity Research", "AMPK Research"],
    alsoKnownAs: "Mitochondria-Derived Peptide, MDP",
    description: `MOTS-c 5mg is a mitochondria-derived peptide (MDP) encoded within the 12S rRNA region of the mitochondrial genome. It acts as a metabolic regulator that promotes insulin sensitivity, reduces adiposity, and enhances exercise capacity. Research has identified MOTS-c as a mitochondrial signal molecule that communicates to the nucleus to coordinate metabolic adaptations — a process termed "mitochondrial retrograde signaling."`,
    longDescription: `What is MOTS-c?

MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA Type-c) is a 16-amino acid peptide (MRWQEMGYIFYPRKLR) encoded within the 12S rRNA gene of human mitochondrial DNA — one of only two protein-coding sequences known within mitochondrial rRNA genes. It was discovered by Chang et al. at the University of Southern California in 2015. MOTS-c is secreted from cells in response to metabolic stress and exercise, acting in an endocrine fashion to regulate energy metabolism systemically.

MOTS-c Structure

MOTS-c is a 16-amino acid peptide with MW 2173.5 g/mol. Its short sequence contains several basic amino acids (Arg, Lys) that contribute to membrane-penetrating properties. Research has shown that MOTS-c can enter cells and translocate to the nucleus, where it modulates gene expression — a remarkable property for a peptide of its size that blurs the distinction between extracellular signaling molecules and intracellular regulators.

MOTS-c Research

The defining characteristic of MOTS-c research is its potent metabolic regulatory effects. Studies in obese mice have shown that MOTS-c administration reduces diet-induced obesity, improves insulin sensitivity, and normalizes blood glucose — effects mediated through AMPK activation and suppression of the folate cycle in skeletal muscle. Mechanistically, MOTS-c enters cells and inhibits AICAR transformylase, an enzyme in the folate cycle, leading to ZMP accumulation and subsequent AMPK activation.

Exercise research has demonstrated that MOTS-c levels increase in plasma following exercise in both rodents and humans. In older mice, exogenous MOTS-c administration partially restores the exercise adaptation capacity that declines with aging — increasing oxidative metabolism, improving mitochondrial function, and enhancing physical performance. The finding that MOTS-c is a mitochondrial-encoded exercise-responsive factor has opened new areas of research into mitochondrial-nuclear communication during exercise.

Aging research has shown that circulating MOTS-c levels decline with age in both rodents and humans. Supplementation with exogenous MOTS-c in aged mice appears to partially rescue age-related metabolic dysfunction and even extend lifespan in C. elegans. Research is ongoing into MOTS-c's role in longevity and its potential as a therapeutic target for age-related metabolic disease.`
  },

  "95": {
    id: "95",
    casNumber: "1627580-64-6",
    formula: "C₁₀₄H₁₅₃N₂₇O₂₆S",
    molecularWeight: "2173.5 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C.",
    appearance: "White lyophilized powder",
    sequence: "MRWQEMGYIFYPRKLR",
    researchAreas: ["Metabolic Research", "Longevity Research", "Exercise Research", "Insulin Sensitivity Research"],
    alsoKnownAs: "Mitochondria-Derived Peptide, MDP",
    description: `MOTS-c 10mg provides a larger research quantity of the mitochondria-derived peptide for extended research protocols. The 10mg vial supports multi-dose studies examining MOTS-c's metabolic, exercise-mimetic, and longevity-related effects. Please refer to the MOTS-c 5mg product for the comprehensive overview, structure, and research sections.`,
    longDescription: `MOTS-c 10mg contains the same compound as MOTS-c 5mg, providing twice the quantity for extended research. Refer to the MOTS-c 5mg product description for full scientific content covering what MOTS-c is, its structure as a mitochondrial-encoded peptide, and its research findings in metabolic regulation, exercise physiology, and aging.`
  },

  "97": {
    id: "97",
    casNumber: "1180968-14-2",
    formula: "C₅₀H₈₅N₁₅O₁₆S",
    molecularWeight: "1181.36 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Ac-Thr-Lys-Pro-Arg-Pro-Gly-Pro-NH₂ (N-acetyl, C-amide)",
    halfLife: "Extended compared to standard Selank",
    researchAreas: ["Anxiolytic Research", "Cognitive Research", "Nootropic Research", "Immunomodulation", "Neuroprotection"],
    alsoKnownAs: "N-Acetyl Selank Amidate, Selank NA, Modified Selank",
    description: `N-Acetyl Selank Amidate is a modified form of Selank with N-terminal acetylation and C-terminal amidation, modifications that significantly enhance metabolic stability and potentially prolong biological activity compared to standard Selank. Selank is a synthetic heptapeptide analogue of the endogenous neuropeptide tuftsin (Thr-Lys-Pro-Arg) with additional amino acids that enhance its stability and CNS activity. Research has documented anxiolytic, cognitive-enhancing, and immunomodulatory effects.`,
    longDescription: `What is N-Acetyl Selank Amidate?

N-Acetyl Selank Amidate is a chemically modified version of Selank designed for enhanced stability and bioavailability. Selank itself (Thr-Lys-Pro-Arg-Pro-Gly-Pro) was developed at the Institute of Molecular Genetics of the Russian Academy of Sciences as an analogue of the immunomodulatory peptide tuftsin (Thr-Lys-Pro-Arg), with the addition of Pro-Gly-Pro tripeptide to enhance CNS penetration and stability. The amidate form (N-terminal acetylation + C-terminal amidation) further protects the peptide from exopeptidase degradation, extending its half-life.

N-Acetyl Selank Amidate Structure

The N-terminal acetylation and C-terminal amidation block the terminal amino and carboxyl groups that are targets for aminopeptidase and carboxypeptidase enzymes. These modifications are widely used in peptide drug design to extend biological half-life. The compound has MW 1181.36 g/mol and sequence Ac-Thr-Lys-Pro-Arg-Pro-Gly-Pro-NH₂.

N-Acetyl Selank Amidate Research

Selank research (which underlies studies of the amidate modification) has focused on three primary areas: anxiolytic effects, cognitive enhancement, and immunomodulation. In animal models, Selank consistently reduces anxiety-related behaviors in elevated plus-maze, open field, and other anxiety paradigms. Unlike benzodiazepines, Selank's anxiolytic effect is not accompanied by sedation, motor impairment, or dependence potential — important advantages for research applications.

Cognitive research has shown Selank enhances memory consolidation and learning in rodent models. Studies have found increased expression of BDNF in the hippocampus following Selank treatment, a potential mechanism for its nootropic effects. Russian clinical studies have explored Selank's use in anxiety disorders, with reports of benefits in generalized anxiety and phobias. The N-acetyl amidate modification is hypothesized to enhance all these effects through extended duration of action, allowing greater receptor engagement over time.`
  },

  "98": {
    id: "98",
    casNumber: "1083160-57-3",
    formula: "C₃₇H₅₇N₁₁O₁₀S₂",
    molecularWeight: "880.04 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Ac-Met-Glu-His-Phe-Pro-Gly-Pro-NH₂",
    halfLife: "Extended compared to standard Semax",
    researchAreas: ["Nootropic Research", "Neuroprotection", "Cognitive Research", "BDNF Research", "Stroke Research"],
    alsoKnownAs: "N-Acetyl Semax Amidate, NA Semax, Modified Semax",
    description: `N-Acetyl Semax Amidate is an enhanced version of Semax (a synthetic analogue of the ACTH fragment 4-7) with N-terminal acetylation and C-terminal amidation for improved stability. Semax was developed in Russia and has been used clinically there for cognitive enhancement, neuroprotection following stroke, and various neurological conditions. The amidate modification extends its half-life and may enhance its CNS effects compared to standard Semax.`,
    longDescription: `What is N-Acetyl Semax Amidate?

Semax is a synthetic heptapeptide (Met-Glu-His-Phe-Pro-Gly-Pro) derived from the 4-7 fragment of adrenocorticotropic hormone (ACTH). It was developed at the Institute of Molecular Genetics of the Russian Academy of Sciences in the 1980s and has received regulatory approval in Russia for use as a nootropic and neuroprotectant. The N-Acetyl Amidate modification adds N-terminal acetylation and C-terminal amidation, protecting the peptide from exopeptidase degradation and extending its biological half-life significantly.

N-Acetyl Semax Amidate Structure

The compound is Ac-Met-Glu-His-Phe-Pro-Gly-Pro-NH₂ with MW 880.04 g/mol. The acetyl and amide modifications were chosen specifically to resist the exopeptidases that rapidly degrade the unmodified Semax sequence in plasma and tissue. These modifications are hypothesized to allow the modified Semax to maintain sufficient concentrations at CNS targets for extended periods following administration.

N-Acetyl Semax Amidate Research

The foundational research on Semax has demonstrated remarkable neuroprotective and cognitive-enhancing effects in animal models. Semax significantly elevates BDNF (Brain-Derived Neurotrophic Factor) expression in multiple brain regions, including the hippocampus and frontal cortex. BDNF is critical for neuronal survival, synaptic plasticity, and memory formation — making BDNF elevation a plausible mechanism for Semax's reported cognitive benefits.

Russian clinical research has employed Semax in the acute phase of ischemic stroke, reporting reduced neurological deficit and improved functional outcomes in treated patients. Animal models of ischemic brain injury have shown Semax reduces infarct size, promotes neurogenesis in the hippocampal dentate gyrus, and accelerates recovery of motor and cognitive function. Research has also shown Semax influences dopaminergic and serotonergic neurotransmitter systems, modulates opioid receptor expression, and has anti-inflammatory effects in the brain — a multiplex mechanism of action that may explain its broad reported effects.

Studies directly comparing modified and unmodified Semax have suggested the N-acetyl amidate form produces longer-lasting and potentially more potent effects at equivalent doses, justifying the preference for the modified form in research designed to maximize CNS exposure.`
  },

  "99": {
    id: "99",
    casNumber: "53-84-9",
    formula: "C₂₁H₂₇N₇O₁₄P₂",
    molecularWeight: "663.43 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C, protected from light and moisture.",
    appearance: "White crystalline powder",
    solubility: "Highly soluble in water",
    researchAreas: ["Longevity Research", "Metabolic Research", "DNA Repair Research", "Neuroprotection"],
    alsoKnownAs: "Nicotinamide Adenine Dinucleotide, β-NAD, Coenzyme I",
    description: `NAD+ 100mg is a research-quantity formulation of Nicotinamide Adenine Dinucleotide, a fundamental coenzyme involved in hundreds of cellular reactions. NAD+ serves as an electron carrier in oxidative phosphorylation and as a substrate for key regulatory enzymes including sirtuins and PARPs. Research has established that NAD+ levels decline with age and that restoring them has significant effects on cellular health, metabolism, and longevity pathways.`,
    longDescription: `What is NAD+?

NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme found in every living cell, acting as the central hub of cellular metabolism. It exists in two interconvertible forms: the oxidized form (NAD+) and the reduced form (NADH). NAD+ functions both as an electron carrier in metabolic reactions (accepting electrons to become NADH) and as a substrate that is consumed by regulatory enzymes including sirtuins (SIRT1-7), PARPs (poly-ADP-ribose polymerases), and cyclic ADP-ribose synthases (CD38, CD157).

NAD+ Structure

NAD+ consists of two nucleotides — adenosine monophosphate (AMP) and nicotinamide mononucleotide (NMN) — joined by a pyrophosphate bond. Its molecular formula is C₂₁H₂₇N₇O₁₄P₂ with MW 663.43 g/mol. The nicotinamide ring is the reactive site that accepts electrons in metabolic reactions. As a hydrophilic large molecule, NAD+ does not readily cross cell membranes; cells rely on membrane transporters or precursor salvage pathways (through NMN, NR, or nicotinamide) to replenish intracellular NAD+.

NAD+ Research

The landmark discovery that NAD+ levels decline with aging — published by David Sinclair's laboratory and others — transformed understanding of the aging process and sparked enormous research interest. Studies have shown 40-60% decreases in NAD+ levels in multiple tissues of aged mice and humans compared to young adults, and this decline correlates with increased susceptibility to age-related diseases.

Research in model organisms has demonstrated that restoring NAD+ levels (through NAD+ precursors or by inhibiting NAD+ consumption) extends lifespan and improves multiple aspects of healthspan. In C. elegans, NMN supplementation extends mean lifespan. In mice, NAD+ repletion through NMN or NR improves muscle function, vascular function, cognitive performance, and metabolic health in aged animals. The mechanisms involve activation of sirtuins (particularly SIRT1 and SIRT3), which regulate mitochondrial function, antioxidant defense, DNA repair, and inflammatory signaling.

PARP research has revealed another critical role for NAD+: as the substrate for DNA damage repair enzymes. Following DNA damage, PARPs consume NAD+ at high rates to catalyze ADP-ribosylation of DNA repair proteins. In aged or diseased tissues with chronic DNA damage, excessive PARP activation can deplete NAD+ and create a vicious cycle of metabolic dysfunction. Research using NAD+ repletion to break this cycle has shown promising results in models of neurodegeneration, cardiac damage, and metabolic disease.`
  },

  "100": {
    id: "100",
    casNumber: "53-84-9",
    formula: "C₂₁H₂₇N₇O₁₄P₂",
    molecularWeight: "663.43 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C, protected from light and moisture.",
    appearance: "White crystalline powder",
    solubility: "Highly soluble in water",
    researchAreas: ["Longevity Research", "Metabolic Research", "DNA Repair Research", "Neuroprotection", "Anti-Aging Research"],
    alsoKnownAs: "Nicotinamide Adenine Dinucleotide, β-NAD, Coenzyme I",
    description: `NAD+ 750mg provides a high-concentration formulation of Nicotinamide Adenine Dinucleotide for extended research programs. At 750mg per vial, this quantity supports multiple-dose protocols investigating NAD+'s effects on aging biomarkers, metabolic function, and cellular energy production. For full scientific content on NAD+, please see the NAD+ 100mg product description.`,
    longDescription: `NAD+ 750mg is the same compound as NAD+ 100mg, provided in a higher quantity for extended research. All scientific information — what NAD+ is, its cellular roles, and research findings — applies equally to both formulations. The 750mg vial supports longer-duration studies and multi-dose research protocols examining NAD+'s effects on aging biomarkers, mitochondrial function, sirtuin activation, and DNA repair capacity.`
  },

  "107": {
    id: "107",
    casNumber: "50-56-6",
    formula: "C₄₃H₆₆N₁₂O₁₂S₂",
    molecularWeight: "1007.19 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water",
    halfLife: "Approximately 1–6 minutes (intravenous); longer with intranasal",
    sequence: "Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH₂",
    researchAreas: ["Behavioral Research", "Social Bonding Research", "Anxiety Research", "Autism Research", "Reproductive Research"],
    alsoKnownAs: "OT, Ocytocin, Syntocinon, Pitocin",
    description: `Oxytocin is a 9-amino acid neuropeptide produced in the hypothalamus and released from the posterior pituitary. It plays critical roles in reproduction (inducing labor, facilitating breastfeeding) and in social behavior, earning the popular designation "love hormone" or "bonding hormone." Research has extensively studied oxytocin's effects on social cognition, anxiety, trust, and its potential therapeutic applications in autism spectrum disorder and social phobias.`,
    longDescription: `What is Oxytocin?

Oxytocin is a cyclic nonapeptide (Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH₂) synthesized by magnocellular neurons in the supraoptic and paraventricular nuclei of the hypothalamus. It is stored in and released from the posterior pituitary gland (neurohypophysis), but is also produced by neurons throughout the brain that act as neuromodulators influencing behavior and emotion. Oxytocin is structurally related to vasopressin (ADH) and acts on specific oxytocin receptors (OTRs) widely distributed in the uterus, mammary glands, heart, and brain.

Oxytocin Structure

Oxytocin has MW 1007.19 g/mol and a distinctive disulfide bond between Cys-1 and Cys-6 that creates the cyclic portion of its structure. This disulfide bridge is essential for receptor binding. The C-terminal glycinamide (Gly-NH₂) is also required for full biological activity. The structure is highly conserved across mammals, with the same sequence found in humans, rats, mice, and most other mammalian species.

Oxytocin Research

Reproductive and maternal behavior research established oxytocin's roles in parturition (uterine contractions), lactation (milk let-down), and mother-infant bonding. Oxytocin is released during childbirth and breastfeeding, and research in animal models shows that blocking oxytocin signaling impairs maternal bonding behaviors, while exogenous oxytocin promotes them.

Social neuroscience research has generated enormous interest in oxytocin's role in human social behavior. Nasal spray studies in humans have shown that intranasal oxytocin administration increases trust, reduces fear of social rejection, improves recognition of social cues, and enhances empathy in controlled laboratory settings. These findings led to investigation of oxytocin as a potential treatment for autism spectrum disorder (ASD), social anxiety disorder, and schizophrenia. Clinical trials have produced mixed results, with some studies showing improvement in social cognition in ASD while others show limited effects — highlighting the complexity of oxytocin's context-dependent biology.

Research has also explored oxytocin's role in cardiovascular function (with OTRs expressed in the heart playing roles in cardiac contractility and cardioprotection), pain modulation (oxytocin exerts analgesic effects in the spinal cord), and stress/HPA axis regulation (oxytocin suppresses cortisol responses to psychosocial stress).`
  },

  "112": {
    id: "112",
    casNumber: "Not publicly available",
    formula: "Cyclic peptide",
    molecularWeight: "Approximately 2.7 kDa",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Neuroprotection Research", "Depression Research", "Cognitive Research", "TrkB Research", "Antidepressant Research"],
    alsoKnownAs: "PE-22-28, BDNF loop region mimetic, Spadin analogue",
    description: `PE-22-28 is a synthetic peptide fragment of PREP (Prolyl Endopeptidase) with antidepressant and neuroprotective properties. Research has demonstrated that PE-22-28 activates TrkB receptors (the receptor for BDNF) and produces rapid-acting antidepressant effects in animal models comparable to ketamine, without ketamine's dissociative side effects. It represents an emerging approach to fast-acting antidepressant research through BDNF/TrkB pathway activation.`,
    longDescription: `What is PE-22-28?

PE-22-28 is a derivative of Spadin, a peptide identified as an endogenous antidepressant compound derived from the propeptide of the TREK-1 potassium channel (sortilin propeptide). PE-22-28 represents an optimized version with enhanced receptor specificity and pharmacological activity. Research has focused on its ability to activate TrkB (Tropomyosin receptor kinase B) — the receptor for BDNF (Brain-Derived Neurotrophic Factor) — and produce rapid antidepressant effects through neuroplasticity mechanisms.

PE-22-28 Structure and Mechanism

PE-22-28 is a cyclic peptide designed to mimic a loop region of BDNF that interacts with TrkB. By directly activating TrkB without the need for BDNF itself, PE-22-28 triggers downstream signaling through PI3K/Akt and MAPK/ERK pathways — the same pathways activated by BDNF that drive synaptic plasticity, neurogenesis, and neuroprotection.

PE-22-28 Research

Animal studies have demonstrated that PE-22-28 produces significant antidepressant effects in standard behavioral tests including the forced swim test, tail suspension test, and learned helplessness paradigms. Notably, the antidepressant effects appear within hours of administration — comparable to the rapid-acting antidepressant ketamine — in contrast to conventional antidepressants that require weeks. This rapid onset suggests PE-22-28 works through synaptic plasticity mechanisms rather than the slow monoaminergic system changes associated with traditional antidepressants.

Cognitive research in rodents has shown PE-22-28 improves performance in memory tasks, with effects attributed to BDNF-TrkB signaling enhancement in the hippocampus. Neuroprotection studies have demonstrated PE-22-28 can protect neurons from various insults including oxidative stress, excitotoxicity, and amyloid toxicity. Research is ongoing into PE-22-28's potential in treating treatment-resistant depression, neurodegenerative disease, and other conditions involving impaired BDNF signaling.`
  },

  "113": {
    id: "113",
    casNumber: "Not publicly available (PEGylated peptide)",
    formula: "PEGylated recombinant peptide",
    molecularWeight: "Approximately 25–30 kDa (with PEG)",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Muscle Research", "Body Composition Research", "Anabolic Research", "Exercise Research"],
    alsoKnownAs: "PEGylated Mechano-Growth Factor, Pegylated MGF",
    description: `PEG MGF (PEGylated Mechano-Growth Factor) is a modified form of IGF-1 Ec (Mechano-Growth Factor) with polyethylene glycol (PEG) attached to stabilize the peptide and significantly extend its half-life. Standard MGF has a very short half-life in blood (minutes), limiting systemic delivery. PEGylation extends the half-life to several days, allowing peripheral administration while maintaining the muscle-specific hypertrophic and regenerative properties of the native peptide.`,
    longDescription: `What is PEG MGF?

PEG MGF (Pegylated Mechano-Growth Factor) addresses the primary limitation of native MGF — its rapid degradation in systemic circulation (half-life of minutes) — by covalent attachment of polyethylene glycol (PEG) chains to the peptide. PEGylation is a well-established pharmaceutical technique that improves peptide stability, reduces immunogenicity, and extends half-life by increasing molecular size (reducing renal clearance) and creating a hydrophilic shell that protects the peptide from proteolytic enzymes. PEG-modified biologics including PEG-interferon and PEG-G-CSF have established clinical precedent for this approach.

PEG MGF Structure and Properties

The PEG chain is attached at a specific site on the MGF sequence (typically on the Ec peptide region) chosen to preserve receptor binding while maximizing stability. The PEG modification increases the effective molecular weight to approximately 25–30 kDa, dramatically reducing renal filtration rate and enzymatic access. This extends the half-life from minutes (native MGF) to approximately 4–5 days, enabling systemic delivery and maintaining meaningful plasma concentrations for days following a single injection.

PEG MGF Research

The key advantage demonstrated in research is that PEG MGF can be delivered peripherally (subcutaneous or intramuscular injection) and still reach muscle tissue and activate satellite cells — unlike native MGF, which must be injected directly into the muscle for systemic delivery to have local effects. Studies in rodents have demonstrated that PEG MGF administration activates satellite cells, increases muscle fiber cross-sectional area, and improves grip strength and exercise performance.

Research comparing PEG MGF to native MGF and to full-length IGF-1 has shown that PEG MGF produces more sustained muscle anabolic effects due to its extended half-life, while retaining the unique satellite cell-activating mechanism of the MGF Ec domain. Research continues into optimal dosing frequency, combination with other anabolic peptides, and its potential in muscle wasting diseases and age-related sarcopenia.`
  },

  "116": {
    id: "116",
    casNumber: "Not publicly available",
    formula: "Synthetic peptide",
    molecularWeight: "Approximately 3.2 kDa",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Cancer Research", "Apoptosis Research", "Tumor Research", "Membrane Research"],
    alsoKnownAs: "PNC-27, Pro-Apoptotic Peptide, MDM-2 binding peptide",
    description: `PNC-27 is a synthetic peptide designed to selectively induce apoptosis in cancer cells while sparing normal cells. It contains an HDM-2 (human homolog of MDM-2) binding domain that allows it to interact with HDM-2 expressed in cancer cell membranes — a location unique to tumor cells — triggering membrane disruption and rapid cell death. Research has demonstrated selective cytotoxicity against a wide range of cancer cell types.`,
    longDescription: `What is PNC-27?

PNC-27 is a 32-amino acid peptide that exploits the aberrant membrane localization of HDM-2 (the human homologue of MDM-2) in cancer cells to deliver a highly selective cytotoxic effect. In normal cells, MDM-2 is located intracellularly where it regulates p53 activity. In many cancer cell types, HDM-2 aberrantly traffics to the plasma membrane — a cancer-specific localization that PNC-27 targets. The peptide contains a leader sequence that drives it to lipid bilayers, plus an MDM-2-binding domain based on the p53 transactivation domain, enabling it to bind and aggregate HDM-2 in cancer cell membranes.

PNC-27 Structure and Mechanism

PNC-27 includes a 19-amino acid membrane-targeting sequence (derived from a leader peptide) fused to a p53-derived sequence (residues 17-26) known to bind MDM-2. When PNC-27 encounters cells expressing membrane-localized HDM-2 (cancer cells), it binds to HDM-2 and aggregates, forming pores in the cancer cell membrane that lead to rapid necrosis/necroptosis. In normal cells without membrane HDM-2, PNC-27 cannot dock and is not cytotoxic.

PNC-27 Research

In vitro research has demonstrated PNC-27 selectivity across a remarkable breadth of cancer cell types including pancreatic, breast, melanoma, leukemia, and multiple other cancer cell lines — all of which express membrane-localized HDM-2. Normal cells from the same tissue types (e.g., normal pancreatic cells alongside pancreatic cancer cells) are not killed, confirming the membrane-HDM-2-dependent mechanism. Cell death occurs rapidly (within hours) and through membrane disruption rather than the slower apoptotic pathways, making it distinct from most anticancer agents.

In vivo research in mouse xenograft models of pancreatic cancer has demonstrated tumor growth inhibition with PNC-27 treatment, with histological confirmation of membrane disruption in tumor tissue but not surrounding normal tissue. Research is exploring optimal delivery routes, dosing schedules, and combinations with chemotherapy or immunotherapy. The selectivity mechanism based on cancer-specific membrane localization of HDM-2 represents an innovative approach to targeted cancer cell killing with a favorable theoretical safety profile.`
  },

  "119": {
    id: "119",
    casNumber: "189691-06-3",
    formula: "C₅₀H₆₈N₁₄O₁₀",
    molecularWeight: "1025.2 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 2.7 hours",
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH",
    researchAreas: ["Sexual Function Research", "Melanocortin Research", "Neurological Research"],
    alsoKnownAs: "Bremelanotide, PL-6983",
    description: `PT-141 10mg (Bremelanotide) is the standard research vial of the synthetic melanocortin peptide. PT-141 acts centrally through melanocortin receptors in the brain rather than through the vascular system, distinguishing it mechanistically from PDE5 inhibitors like sildenafil. Research has demonstrated its ability to activate sexual arousal pathways through MC3R and MC4R in the hypothalamus and limbic system.`,
    longDescription: `What is PT-141 (Bremelanotide)?

PT-141 (Bremelanotide) is a cyclic heptapeptide analogue of alpha-melanocyte-stimulating hormone (α-MSH), specifically related to Melanotan II but with a hydroxyl group replacing the terminal amide. PT-141 was developed by Palatin Technologies as a drug candidate for hypoactive sexual desire disorder (HSDD). Unlike all previous treatments for sexual dysfunction, which work through the peripheral vascular system (e.g., PDE5 inhibitors increasing penile blood flow), PT-141 works centrally by activating melanocortin receptors in the brain, particularly in the hypothalamus and limbic system.

PT-141 Structure

PT-141 has the cyclic structure Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH with MW 1025.2 g/mol. It is the acid form of Melanotan II (which has a C-terminal amide). The cyclic structure provides stability against enzymatic degradation. PT-141 is a non-selective melanocortin receptor agonist with activity at MC1R, MC3R, MC4R, and MC5R, with its effects on sexual function attributed primarily to MC3R and MC4R activation in the brain.

PT-141 Research

Animal research in male and female rodents established PT-141's ability to increase sexual motivation and arousal behaviors through central melanocortin receptor activation. The compound increases male mounting behavior and female solicitation behaviors without requiring the genital vascular effects of traditional ED treatments. Studies in non-human primates confirmed the centrally mediated mechanism.

Human clinical research confirmed PT-141 effectiveness in both male and female subjects. In men with erectile dysfunction (including those unresponsive to PDE5 inhibitors), PT-141 produced erections through what appears to be a neurological mechanism, with onset of action approximately 30–60 minutes. In women with HSDD, PT-141 increased genital blood flow, sensitivity, and self-reported sexual desire. The FDA approved Bremelanotide (Vyleesi) in 2019 for HSDD in premenopausal women — one of only two FDA-approved drugs for female sexual dysfunction. Research continues into its applications in male sexual dysfunction, compulsive sexual behavior, and as a tool for studying central arousal mechanisms.`
  },

  "121": {
    id: "121",
    casNumber: "2381090-51-1",
    formula: "C₂₂₂H₃₄₈N₅₆O₆₆S₂",
    molecularWeight: "4813.5 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white lyophilized powder",
    halfLife: "Approximately 6 days (subcutaneous)",
    researchAreas: ["Metabolic Research", "Obesity Research", "Diabetes Research", "Cardiovascular Research", "Triple Receptor Agonism"],
    alsoKnownAs: "LY3437943",
    description: `Retatrutide 6mg is a novel triple receptor agonist (triagonist) simultaneously targeting GIP, GLP-1, and glucagon receptors. This triple mechanism of action is unprecedented in clinical development and distinguishes Retatrutide from dual agonists (tirzepatide) and single agonists (semaglutide). Phase 2 trials have demonstrated extraordinary weight loss outcomes, with some groups losing over 24% body weight at 48 weeks — the highest reported with any pharmacological intervention.`,
    longDescription: `What is Retatrutide?

Retatrutide (LY3437943) is a peptide developed by Eli Lilly that represents the next generation beyond dual agonists like tirzepatide. By simultaneously activating three receptors — GIP receptor (GIPR), GLP-1 receptor (GLP-1R), and glucagon receptor (GCGR) — Retatrutide engages three complementary pathways for weight reduction and metabolic improvement. Glucagon co-agonism adds additional energy expenditure and hepatic fat reduction on top of the appetite suppression and insulin secretion effects of GIP and GLP-1.

Retatrutide Structure

Retatrutide is a 35-amino acid peptide designed to maximally activate all three incretin and glucagon receptors. Its sequence incorporates structural elements that allow potent binding to each receptor: GLP-1-like residues for GLP-1R activation, GIP-like residues for GIPR activation, and a C-terminal extension that provides glucagon receptor activity. A fatty acid chain (similar to semaglutide's linker) provides albumin binding for the extended ~6-day half-life.

Retatrutide Research

Phase 2 data published in the New England Journal of Medicine (2023) showed that Retatrutide at 12mg once weekly produced mean body weight reductions of approximately 22.8% at 48 weeks in obese subjects — substantially exceeding the 15-17% seen with tirzepatide and 15% with semaglutide in comparable trial populations. Participants who complied with the dosing regimen showed even higher weight loss in some analyses, approaching 25%.

Beyond weight loss, Retatrutide substantially improved metabolic parameters including fasting glucose, insulin sensitivity, triglycerides, and blood pressure. The glucagon receptor agonism component appears to increase hepatic fat clearance, with preliminary data suggesting NASH (non-alcoholic steatohepatitis) benefit. Phase 3 trials are ongoing across multiple indications including obesity (TRIUMPH-1), type 2 diabetes (TRIUMPH-2), and MASH (metabolic dysfunction-associated steatohepatitis), with results expected to establish the full therapeutic profile of this breakthrough compound.`
  },

  "122": {
    id: "122",
    casNumber: "2381090-51-1",
    formula: "C₂₂₂H₃₄₈N₅₆O₆₆S₂",
    molecularWeight: "4813.5 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white lyophilized powder",
    halfLife: "Approximately 6 days (subcutaneous)",
    researchAreas: ["Metabolic Research", "Obesity Research", "Diabetes Research", "Cardiovascular Research"],
    alsoKnownAs: "LY3437943",
    description: `Retatrutide 12mg provides a larger research quantity of the triple GIP/GLP-1/glucagon receptor agonist. This vial size supports extended research programs and high-dose studies. The 12mg vial is consistent with the dose range showing the greatest weight loss in Phase 2 trials. Please refer to Retatrutide 6mg for the full scientific overview and research summary.`,
    longDescription: `Retatrutide 12mg is the same compound as Retatrutide 6mg, provided in double the quantity for extended or multi-dose research. Please refer to the Retatrutide 6mg product for the comprehensive overview of what Retatrutide is, its triple receptor mechanism targeting GIP, GLP-1, and glucagon receptors, and the landmark Phase 2 NEJM data showing up to 22.8% body weight reduction at 48 weeks.`
  },

  "123": {
    id: "123",
    casNumber: "2381090-51-1",
    formula: "C₂₂₂H₃₄₈N₅₆O₆₆S₂",
    molecularWeight: "4813.5 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white lyophilized powder",
    halfLife: "Approximately 6 days (subcutaneous)",
    researchAreas: ["Metabolic Research", "Obesity Research", "Diabetes Research", "Cardiovascular Research", "MASH Research"],
    alsoKnownAs: "LY3437943",
    description: `Retatrutide 16mg is the highest research quantity vial of the groundbreaking triple GIP/GLP-1/glucagon receptor agonist. This quantity supports comprehensive multi-dose studies and high-dose pharmacology research. Phase 3 TRIUMPH trials are evaluating Retatrutide across obesity, type 2 diabetes, and MASH populations, with results anticipated to confirm the exceptional efficacy seen in Phase 2.`,
    longDescription: `Retatrutide 16mg provides the largest single vial quantity of Retatrutide for comprehensive research programs. The scientific content for this compound is identical to Retatrutide 6mg. Please refer to the Retatrutide 6mg product description for the full overview of Retatrutide's triple GIP/GLP-1/glucagon receptor mechanism, its molecular structure, and the Phase 2 clinical data demonstrating exceptional weight loss and metabolic improvements.`
  },

  "125": {
    id: "125",
    casNumber: "129954-34-3",
    formula: "C₃₃H₅₇N₁₁O₉",
    molecularWeight: "751.87 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Thr-Lys-Pro-Arg-Pro-Gly-Pro (+ Gly-Val-Ser sequence)",
    halfLife: "Approximately 4–6 minutes (intravenous); extended with intranasal",
    researchAreas: ["Anxiolytic Research", "Cognitive Research", "Nootropic Research", "Immunomodulation", "Antiviral Research"],
    alsoKnownAs: "Selanк, TP-7, Tuftsin-Gly-Pro-Arg",
    description: `Selank is a synthetic heptapeptide anxiolytic and nootropic developed at the Institute of Molecular Genetics of the Russian Academy of Sciences. It is an analogue of tuftsin (Thr-Lys-Pro-Arg) with a stabilizing Pro-Gly-Pro tripeptide added. Selank has been approved for therapeutic use in Russia and Ukraine as an anxiolytic with a favorable side effect profile compared to benzodiazepines — producing anxiety reduction without sedation, dependence, or cognitive impairment.`,
    longDescription: `What is Selank?

Selank (Thr-Lys-Pro-Arg-Pro-Gly-Pro) was developed at the Institute of Molecular Genetics, Russian Academy of Sciences, by Professor Natalia Myasoedov's group. It is based on the immunomodulatory peptide tuftsin (Thr-Lys-Pro-Arg) — a tetrapeptide produced by spleen cells that enhances immune function — with the addition of the C-terminal Pro-Gly-Pro sequence to enhance CNS penetration and extend half-life. Selank is registered as a drug in Russia ("Selanк") and has been used clinically for anxiety disorders. It is also available as a nasal spray in Russia.

Selank Structure

Selank has the sequence Thr-Lys-Pro-Arg-Pro-Gly-Pro with MW 751.87 g/mol. Its primary route of administration in research is intranasal, as this bypasses first-pass metabolism and allows direct access to the CNS through olfactory pathways. Selank is relatively stable compared to the parent tuftsin, with a half-life in plasma of approximately 4–6 minutes but with a longer duration of CNS effects attributed to slower clearance from brain tissue.

Selank Research

Anxiolytic research has consistently demonstrated that Selank reduces anxiety in rodent behavioral models (elevated plus-maze, open field, light-dark box) at doses that do not impair motor function, cognition, or consciousness — in contrast to benzodiazepines. Electroencephalographic studies show Selank produces neurophysiological changes different from benzodiazepines, potentially through a mechanism involving enkephalin-degrading enzyme inhibition and endogenous opioid system modulation.

Cognitive research has shown that Selank enhances memory consolidation and retrieval in rodent models, and may increase BDNF expression in brain tissue. Gene expression studies have identified effects on serotonin transporter expression and dopamine system components. Human clinical research in Russia has explored Selank in anxiety disorders, phobias, and neurasthenia, with reports suggesting effective anxiety reduction with minimal side effects.

Immunological research has shown Selank modulates cytokine production (particularly increasing IL-2 and reducing IL-6) and enhances natural killer cell activity. Antiviral research has demonstrated that Selank shows activity against several RNA viruses in cell culture. The combination of anxiolytic, nootropic, and immunomodulatory effects makes Selank a unique and versatile research compound.`
  },

  "129": {
    id: "129",
    casNumber: "80714-61-0",
    formula: "C₃₇H₅₁N₉O₁₀S₁",
    molecularWeight: "825.92 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Met-Glu-His-Phe-Pro-Gly-Pro",
    halfLife: "Approximately 2–5 minutes without modification",
    researchAreas: ["Nootropic Research", "Neuroprotection", "Cognitive Research", "BDNF Research", "Stroke Research"],
    alsoKnownAs: "Semax, ACTH(4-7)-PGP, Heptapeptide Semax",
    description: `Semax 30mg is a synthetic analogue of the ACTH fragment 4-7, with an additional Pro-Gly-Pro tripeptide added for stability enhancement. It is a registered pharmaceutical in Russia where it has been used clinically for cognitive enhancement, neuroprotection following stroke, and treatment of attention deficit. Research has demonstrated strong BDNF-upregulating, neuroprotective, and cognitive-enhancing properties in animal models and clinical settings.`,
    longDescription: `What is Semax?

Semax (Met-Glu-His-Phe-Pro-Gly-Pro) is a synthetic heptapeptide derived from the N-terminal fragment of adrenocorticotropic hormone (ACTH). The core sequence (Met-Glu-His-Phe or ACTH 4-7) corresponds to the behaviorally active fragment of ACTH that influences cognitive function and memory. The appended Pro-Gly-Pro tripeptide was added by researchers at the Institute of Molecular Genetics to enhance metabolic stability and CNS penetration. Semax was registered as a pharmaceutical in Russia in 1994.

Semax Structure

Semax has MW 825.92 g/mol with the sequence Met-Glu-His-Phe-Pro-Gly-Pro. In Russia, it is primarily administered intranasally in a 0.1% solution. Intranasal delivery bypasses the blood-brain barrier and enables direct CNS entry through olfactory pathways. The Pro-Gly-Pro extension confers resistance to some but not all proteolytic enzymes, contributing to its activity following intranasal administration.

Semax Research

The most extensively documented effect of Semax is its ability to increase BDNF (Brain-Derived Neurotrophic Factor) expression in the hippocampus and frontal cortex. BDNF is the primary driver of neuroplasticity, synaptic strengthening, and neuronal survival. Research in rodents shows that Semax consistently elevates hippocampal BDNF mRNA and protein, consistent with its observed improvements in spatial learning and memory tasks.

Neuroprotection research has demonstrated Semax's efficacy in models of ischemic stroke, with studies showing reduced infarct size, decreased neuroinflammation, and improved behavioral recovery. Russian clinical trials employing Semax in acute ischemic stroke patients reported improvements in neurological deficit scores and activities of daily living compared to controls. Research has also shown Semax reduces expression of pro-inflammatory genes in brain tissue following ischemia.

Cognitive enhancement research in healthy subjects has been explored in Russian studies, with reports of improved memory, attention, and information processing speed. Semax appears to influence dopaminergic and serotonergic neurotransmission through mechanisms that may involve opiate receptor modulation, contributing to its mood-improving and attention-enhancing effects. Research in ADHD and attention-deficit conditions has shown promising results, though large-scale Western clinical trials are limited.`
  },

  "140": {
    id: "140",
    casNumber: "1191854-89-3",
    formula: "C₅₃H₈₆N₂₁O₁₅S₅",
    molecularWeight: "1440.65 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    sequence: "Ac-D-Arg-dimethylTyr-Lys-Phe-NH₂ (cyclic, all D-amino acids variant)",
    halfLife: "Approximately 2–3 hours",
    researchAreas: ["Mitochondrial Research", "Cardioprotection", "Neuroprotection", "Oxidative Stress Research", "Aging Research"],
    alsoKnownAs: "Szeto-Schiller peptide 31, Elamipretide, Bendavia, MTP-131",
    description: `SS-31 (Szeto-Schiller peptide 31, also known as Elamipretide or Bendavia) is a cell-permeable, mitochondria-targeted antioxidant peptide. It selectively concentrates in the inner mitochondrial membrane where it interacts with cardiolipin — a phospholipid essential for the structural organization and function of the electron transport chain. Research has demonstrated its remarkable cardioprotective effects and potential in aging, heart failure, and neurodegenerative disease.`,
    longDescription: `What is SS-31 (Elamipretide)?

SS-31 (Szeto-Schiller peptide 31) was developed by Drs. Hazel Szeto and Peter Schiller using the "aromatic-cationic peptide" design principle — incorporating alternating aromatic (Phe, dimethylTyr) and basic (Arg, Lys) amino acids in a sequence that facilitates uptake into mitochondria. SS-31 is also known as Elamipretide (its INN name), and the trademark Bendavia under which it has been clinically developed by Stealth BioTherapeutics. It is the most extensively studied of the Szeto-Schiller peptide family.

SS-31 Structure and Targeting Mechanism

SS-31 (Ac-D-Arg-Dmt-Lys-Phe-NH₂) has MW 1440.65 g/mol and contains a dimethyltyrosine (Dmt) residue that provides both electron-scavenging activity and membrane partitioning properties. The alternating arrangement of cationic and aromatic amino acids creates an amphiphilic peptide that naturally concentrates in the inner mitochondrial membrane (IMM). In the IMM, SS-31 selectively interacts with cardiolipin — a unique phospholipid exclusively located in the IMM that is essential for the structural integrity of respiratory chain supercomplexes. By interacting with cardiolipin, SS-31 stabilizes the electron transport chain, reduces electron leak, and decreases superoxide production.

SS-31 Research

Cardioprotection research has been the primary focus of SS-31 clinical development. Multiple animal studies have demonstrated that SS-31 reduces myocardial infarct size by 40–60% when administered at reperfusion in ischemia-reperfusion injury models. The compound has been studied in clinical trials for cardiac surgery, where ischemia-reperfusion injury is a significant complication. Phase 2 trials in patients undergoing coronary artery bypass grafting showed renal protective effects with SS-31 treatment.

Heart failure research has generated exciting data showing that SS-31 can improve cardiac structure and function in established heart failure models. In aging mice with heart failure with preserved ejection fraction (HFpEF) — the most common and least treatable form of heart failure — SS-31 treatment significantly improved diastolic function, exercise capacity, and mitochondrial structure. Studies have demonstrated SS-31 reverses the disorganization of mitochondrial cristae (the inner membrane folds where the electron transport chain is located) that occurs in aging and heart failure, improving electron transport chain efficiency.

Aging research has shown that SS-31 treatment in old mice restores mitochondrial membrane potential, reduces ROS production, and improves skeletal muscle function and exercise capacity to levels approaching young mice. Studies in models of Alzheimer's disease, Parkinson's disease, and ALS have demonstrated neuroprotective effects through mitochondrial stabilization.`
  },

  "143": {
    id: "143",
    casNumber: "77591-33-4",
    formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
    molecularWeight: "4963.5 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C for up to 3 weeks.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water or bacteriostatic water",
    halfLife: "Approximately 30 minutes (plasma)",
    sequence: "Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Ala-Glu-Ser",
    researchAreas: ["Tissue Regeneration", "Cardiac Research", "Anti-Inflammatory Research", "Wound Healing", "Musculoskeletal Research"],
    alsoKnownAs: "Thymosin Beta-4, TB4, Tβ4, Thymosin β4",
    description: `TB-500 (Thymosin Beta-4) 2mg is the entry-level research vial of this naturally occurring 43-amino acid peptide present throughout the body. TB-500 regulates actin polymerization, promotes cell migration and tissue repair, and has demonstrated remarkable healing properties in heart tissue, tendons, ligaments, skin, and eyes in preclinical models. It is one of the most versatile tissue-repair peptides studied.`,
    longDescription: `What is TB-500 (Thymosin Beta-4)?

TB-500 is the synthetic version of Thymosin Beta-4 (Tβ4), a naturally occurring 43-amino acid peptide encoded by the TMSB4X gene and found in virtually all mammalian cells. It is one of the most abundant intracellular proteins, present at concentrations of 200–600 μM in platelets and high concentrations in wound fluid. Tβ4 was originally isolated from calf thymus in 1981 by Dr. Elsebet Leof. Its primary biological role is sequestration of G-actin (monomeric actin), regulating the dynamics of the actin cytoskeleton and thereby influencing cell migration, shape, division, and differentiation.

TB-500 Structure

TB-500 is a 43-amino acid acetylated peptide with N-terminal acetylation (Ac-Ser) and the sequence ending at -Glu-Ser. Molecular formula C₂₁₂H₃₅₀N₅₆O₇₈S, MW 4963.5 g/mol. The central tetrapeptide Lys-Thr-Thr-Glu (β4 peptide, the "actin binding domain") is the critical functional region — this short sequence alone can promote actin-dependent cell migration. Tβ4 also contains regions that bind laminin-5, promote angiogenesis, and modulate inflammatory responses.

TB-500 Research

Cardiac research has produced some of the most striking TB-500 findings. Studies in mice with experimentally induced myocardial infarction showed that systemic Tβ4 administration promotes epicardial stem cell (epicardial progenitor cell) reactivation and differentiation into new cardiomyocytes. Treated mice showed improved cardiac function, reduced fibrosis, and partial regeneration of infarcted myocardium — a remarkable finding given the limited regenerative capacity of adult heart tissue. The mechanism involves Tβ4 activation of Wnt pathway signaling in epicardial progenitor cells.

Tendon and ligament research in rodent models has demonstrated accelerated healing of surgically induced tendon injuries with Tβ4 treatment. Research in models of eye injury, including corneal wounds and retinal degeneration, has shown Tβ4 promotes wound healing and may protect photoreceptors. Skin wound healing research consistently shows faster and more complete wound closure with Tβ4 treatment. The breadth of TB-500's tissue repair effects reflects its fundamental role in regulating the actin cytoskeleton — a universal mechanism shared across all cell types.`
  },

  "144": {
    id: "144",
    casNumber: "77591-33-4",
    formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
    molecularWeight: "4963.5 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C prior to reconstitution.",
    appearance: "White lyophilized powder",
    sequence: "Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser-Lys-Leu-Lys-Lys-Thr-Glu-Thr-Gln-Glu-Lys-Asn-Pro-Leu-Pro-Ser-Lys-Glu-Thr-Ile-Glu-Gln-Glu-Lys-Gln-Ala-Ala-Glu-Ser",
    researchAreas: ["Tissue Regeneration", "Wound Healing", "Anti-Inflammatory Research", "Musculoskeletal Research"],
    alsoKnownAs: "Thymosin Beta-4, Tβ4",
    description: `TB-500 5mg provides a mid-range research quantity of Thymosin Beta-4, one of the most versatile tissue repair peptides in research. This vial size supports short research protocols and dose-finding studies. For the full scientific overview, structure, and research summary of TB-500, please see the TB-500 2mg product description.`,
    longDescription: `TB-500 5mg is the same compound as TB-500 2mg. Please refer to the TB-500 2mg product description for the comprehensive overview of TB-500's identity as synthetic Thymosin Beta-4, its 43-amino acid structure and actin-binding function, and its extensive research findings in cardiac regeneration, tendon healing, wound repair, and anti-inflammatory activity.`
  },

  "145": {
    id: "145",
    casNumber: "77591-33-4",
    formula: "C₂₁₂H₃₅₀N₅₆O₇₈S",
    molecularWeight: "4963.5 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 3 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Tissue Regeneration", "Wound Healing", "Anti-Inflammatory Research", "Cardiac Research"],
    alsoKnownAs: "Thymosin Beta-4, Tβ4",
    description: `TB-500 10mg is the highest single-vial research quantity of Thymosin Beta-4, supporting extended research programs and multi-dose studies. This quantity is particularly suitable for animal studies requiring multiple doses or for researchers comparing different dosing regimens. Full scientific content is available in the TB-500 2mg product description.`,
    longDescription: `TB-500 10mg provides the largest quantity of synthetic Thymosin Beta-4 for comprehensive research. Please refer to the TB-500 2mg product description for all scientific content covering the full overview, structure, and research findings of TB-500/Thymosin Beta-4.`
  },

  "146": {
    id: "146",
    casNumber: "Not publicly disclosed",
    formula: "Fragment of TB-500 sequence",
    molecularWeight: "Approximately 750 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 3 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Tissue Regeneration", "Anti-Inflammatory Research", "Wound Healing", "Cell Migration Research"],
    alsoKnownAs: "TB-4 Fragment 17-23, Ac-SDKPDMA, TB-500 Frag",
    description: `TB-500 Fragment (17-23) 10mg is a specific short peptide fragment derived from the full-length Thymosin Beta-4 sequence, corresponding to residues 17-23. Research has identified this region as the actin-binding domain and proposed that this minimal sequence retains key bioactivities of full-length TB-500, including promotion of cell migration and anti-inflammatory effects.`,
    longDescription: `What is TB-500 Fragment (17-23)?

The TB-500 Fragment (17-23) represents a key functional subregion of the full 43-amino acid Thymosin Beta-4 peptide. Research by Dr. Hynda Kleinman's group identified the tetrapeptide Lys-Thr-Thr-Glu within Thymosin Beta-4 as the minimal sequence required for promotion of cell migration — a key biological activity of the full peptide. The 17-23 fragment (which includes this and additional flanking residues: approximately Ser-Asp-Lys-Pro-Asp-Met-Ala) has been studied as both a research tool and potential therapeutic candidate.

TB-500 Fragment (17-23) Structure

The fragment contains 7 amino acids from positions 17-23 of the TB-4 sequence, with a molecular weight approximately 750 g/mol. This small size is a significant advantage for production, stability, and potentially penetration into tissues. Studies comparing the full TB-4 sequence with truncated versions have helped define the minimal structure required for actin binding versus other biological activities (angiogenesis promotion, anti-inflammatory effects, cardiac cell survival).

TB-500 Fragment Research

In vitro cell migration assays have demonstrated that the 17-23 fragment retains the ability to promote cell motility in corneal epithelial cells, endothelial cells, and skin fibroblasts — activities critical for wound healing. Research comparing the fragment to the full peptide has generally found somewhat reduced but real activity, supporting the hypothesis that this region is the functional core of TB-500's cell migration-promoting activity.

Animal wound healing studies have shown that topical or local injection of TB-4 fragments can accelerate wound closure. The smaller fragment size compared to full-length TB-500 may offer advantages for tissue penetration and stability. Research continues to map the complete structure-activity relationships of TB-500, and the 17-23 fragment serves as a valuable tool in this process.`
  },

  "150": {
    id: "150",
    casNumber: "218949-48-5",
    formula: "C₂₂₁H₃₆₆N₆₄O₆₆S₁",
    molecularWeight: "5135.9 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 21 days.",
    appearance: "White lyophilized powder",
    halfLife: "26–38 minutes (intravenous); longer subcutaneous",
    sequence: "Trans-3-hexenoic acid-Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln-Gln-Gly-Glu-Ser-Asn-Gln-Glu-Arg-Gly-Ala-Arg-Ala-Arg-Leu-NH₂",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Adipose Tissue Research", "HIV Research", "Body Composition Research"],
    alsoKnownAs: "Egrifta (brand), TH9507",
    description: `Tesamorelin 5mg is a synthetic growth hormone releasing hormone (GHRH) analogue consisting of the full 44-amino acid GHRH sequence with a trans-3-hexenoic acid group conjugated at the N-terminus. This modification dramatically improves stability while preserving receptor binding. The FDA approved tesamorelin (Egrifta) for HIV-associated lipodystrophy, making it one of the few research peptides that has achieved regulatory approval.`,
    longDescription: `What is Tesamorelin?

Tesamorelin (TH9507) is a synthetic GHRH analogue developed by Theratechnologies Inc. Unlike earlier GHRH analogues (Sermorelin, CJC-1295 No DAC) that used the truncated GHRH(1-29) sequence, Tesamorelin uses the complete 44-amino acid GHRH sequence. The key modification is a trans-3-hexenoic acid group conjugated to the N-terminus — a modification that protects the peptide from degradation by dipeptidyl peptidase IV (DPP-IV), the enzyme that rapidly cleaves native GHRH at the Tyr-Ala bond. This extends the half-life from minutes (native GHRH) to approximately 26–38 minutes with intravenous administration and longer with subcutaneous injection.

Tesamorelin Structure

Tesamorelin has MW 5135.9 g/mol — the largest of the synthetic GHRH analogues due to use of the full-length 44-amino acid GHRH sequence. The trans-3-hexenoic acid modification at position 1 blocks DPP-IV cleavage, the primary mechanism of native GHRH inactivation. This structural solution elegantly preserves GHRH receptor binding while addressing the key pharmacokinetic limitation.

Tesamorelin Research

The FDA approved Tesamorelin (Egrifta) in 2010 for the treatment of HIV-associated lipodystrophy — specifically excess visceral abdominal fat accumulation in HIV-infected patients on antiretroviral therapy. This approval was based on Phase 3 randomized controlled trials showing that Tesamorelin 2mg daily significantly reduced visceral adipose tissue (measured by CT scan) compared to placebo, along with improvements in lipid parameters.

Growth hormone research has established that Tesamorelin produces sustained stimulation of GH release in a pulsatile pattern. Unlike exogenous GH administration, Tesamorelin preserves the physiological pulsatility of GH secretion and does not suppress the endogenous GH axis — considered an advantage for long-term use. Studies in HIV patients showed 15–20% reductions in visceral fat area over 6 months, significantly better than placebo. Research in non-HIV populations with similar metabolic profiles (abdominal obesity, metabolic syndrome) has demonstrated comparable effects on visceral fat reduction and metabolic parameters.`
  },

  "154": {
    id: "154",
    casNumber: "87129-39-3",
    formula: "Thymus-derived peptide complex",
    molecularWeight: "Varies (mixture of small peptides)",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Immune Research", "Anti-Aging Research", "Thymus Research", "Lymphocyte Research", "Longevity Research"],
    alsoKnownAs: "Thymulin, Facteur Thymique Serique (FTS), Thymus Bioregulator",
    description: `Thymalin is a thymus-derived polypeptide preparation used as an immunomodulatory research compound. It is derived from bovine thymus tissue and contains a complex mixture of thymic peptides. Research primarily from Russia and Eastern Europe has studied Thymalin's effects on immune function restoration, particularly in elderly subjects and those with immune deficiency conditions.`,
    longDescription: `What is Thymalin?

Thymalin is a polypeptide preparation derived from bovine thymus gland using a biochemical extraction process. Unlike pure synthetic peptides, Thymalin is a complex mixture of thymic biologically active peptides including thymulin, thymosin alpha-1, thymopoietin, and other thymic hormones. It was developed by Soviet researchers in the 1970s and has been used clinically in Russia as an immunomodulatory agent. The thymus gland produces numerous peptide hormones that regulate T-lymphocyte development, differentiation, and function — and Thymalin is designed to capture this biological activity.

Thymalin Research

The most significant research on Thymalin has come from the St. Petersburg Institute of Bioregulation and Gerontology, where Prof. Vladimir Khavinson and colleagues have conducted extensive studies over decades. Their research shows that Thymalin administration can restore immune function in elderly subjects, improving T-lymphocyte count and function, natural killer cell activity, and cytokine production toward a more youthful profile.

Longevity research using Thymalin has produced striking results. Long-term studies in elderly subjects (average age 60–74) given annual courses of Thymalin treatment showed significantly reduced mortality and morbidity over 6 years of follow-up compared to controls — with approximately 2-fold reduction in mortality reported. These findings, while requiring replication with modern clinical trial standards, have generated substantial interest in thymic peptides as longevity-promoting interventions. Animal studies have shown lifespan extension with Thymalin and related thymic peptide preparations. Research suggests the mechanism involves restoration of age-related thymic involution's downstream immunological consequences.`
  },

  "155": {
    id: "155",
    casNumber: "62304-98-7",
    formula: "C₁₃₂H₂₁₄N₃₄O₅₈",
    molecularWeight: "3108.3 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water",
    sequence: "Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn",
    researchAreas: ["Immune System Research", "Antiviral Research", "Cancer Research", "Anti-Aging Research", "Autoimmune Research"],
    alsoKnownAs: "Tα1, Thymalfasin, Zadaxin",
    description: `Thymosin Alpha-1 (Tα1) 3mg is a naturally occurring 28-amino acid peptide originally isolated from thymic tissue. It is an immunomodulatory peptide that stimulates both innate and adaptive immune responses. The synthetic version (Thymalfasin, sold as Zadaxin) has been used clinically in Asia and other markets for hepatitis B, hepatitis C, certain cancers, and as an immune adjuvant. Research has established its broad immunostimulatory properties.`,
    longDescription: `What is Thymosin Alpha-1?

Thymosin Alpha-1 (Tα1) is a naturally occurring 28-amino acid acetylated peptide originally isolated from thymic tissue by Dr. Allan Goldstein's group at the National Cancer Institute in the 1970s. It was identified as a component of Thymosin Fraction 5 — a thymic extract with immune-restoring properties. Tα1 is the most biologically potent peptide isolated from the thymic extracts and was the first peptide of its class to undergo clinical development. The synthetic version (Thymalfasin, branded as Zadaxin) is approved or registered in multiple countries including China, Italy, and Singapore for hepatitis B, hepatitis C, immune deficiency, and as a vaccine adjuvant.

Thymosin Alpha-1 Structure

Tα1 is an N-terminally acetylated 28-amino acid peptide (Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn) with MW 3108.3 g/mol. The N-terminal acetylation is essential for biological activity. Unlike most immunomodulatory agents, Tα1 does not activate broad inflammatory pathways but specifically modulates T-cell development and function.

Thymosin Alpha-1 Research

Clinical research in hepatitis has demonstrated Tα1's antiviral effects. Studies in chronic hepatitis B patients showed improved rates of HBeAg seroconversion (a marker of immune control) with Tα1 compared to placebo. In hepatitis C, combination studies with interferon showed improved response rates. The mechanism involves Tα1 directly stimulating dendritic cell maturation and enhancing antigen-specific T-cell responses — effectively improving the immune system's ability to clear viral infections.

Cancer research has explored Tα1 as an adjuvant to improve responses to chemotherapy and radiotherapy. Studies have shown Tα1 can partially restore the immune function suppressed by cancer treatment, potentially improving outcomes. Research in non-small cell lung cancer, hepatocellular carcinoma, and melanoma has investigated Tα1 both alone and in combination with conventional treatments. Autoimmune research has paradoxically shown benefits in some autoimmune conditions, attributed to Tα1's ability to promote regulatory T-cell development and tolerance mechanisms. Research during the COVID-19 pandemic explored Tα1 for modulating cytokine storm, based on its known immune-normalizing properties.`
  },

  "156": {
    id: "156",
    casNumber: "62304-98-7",
    formula: "C₁₃₂H₂₁₄N₃₄O₅₈",
    molecularWeight: "3108.3 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    researchAreas: ["Immune System Research", "Antiviral Research", "Cancer Research", "Anti-Aging Research"],
    alsoKnownAs: "Tα1, Thymalfasin, Zadaxin",
    description: `Thymosin Alpha-1 10mg provides an extended research quantity of this important immunomodulatory thymic peptide. The 10mg vial supports multi-dose research protocols and studies examining dose-response relationships. For full scientific content on Thymosin Alpha-1, please refer to the Thymosin Alpha-1 3mg product description.`,
    longDescription: `Thymosin Alpha-1 10mg is the same compound as the 3mg vial. Please refer to the Thymosin Alpha-1 3mg product description for the comprehensive overview, structure information, and detailed research findings covering hepatitis treatment, cancer immunology, autoimmune research, and the compound's mechanism of action through T-cell development and dendritic cell modulation.`
  },

  "158": {
    id: "158",
    casNumber: "24305-27-9",
    formula: "C₁₆H₂₂N₄O₄",
    molecularWeight: "338.38 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water",
    halfLife: "Approximately 5 minutes (intravenous)",
    sequence: "Glu-His-Pro-NH₂",
    researchAreas: ["Thyroid Research", "Mood Research", "Cognitive Research", "Neurological Research", "Energy Research"],
    alsoKnownAs: "TRH, Thyrotropin-Releasing Hormone, Protirelin, Lopremone",
    description: `Thyrotropin TRH (Thyrotropin-Releasing Hormone) 20mg is a synthetic form of the endogenous tripeptide (Glu-His-Pro-NH₂) produced by the hypothalamus. TRH stimulates the pituitary to release thyroid-stimulating hormone (TSH) and prolactin. Beyond its endocrine role, TRH has been studied for antidepressant effects, analeptic properties (awakening from anesthesia), neuroprotection, and cognitive enhancement — roles independent of its thyroid axis actions.`,
    longDescription: `What is TRH (Thyrotropin-Releasing Hormone)?

Thyrotropin-Releasing Hormone (TRH, Protirelin) is a tripeptide (pyroglutamyl-histidyl-prolinamide) produced by neurons in the hypothalamus and released into the hypophyseal portal blood to stimulate TSH and prolactin secretion from the anterior pituitary. It was the first hypothalamic releasing hormone characterized chemically (Roger Guillemin and Andrew Schally, Nobel Prize 1977). TRH is also produced throughout the brain and spinal cord as a neurotransmitter, where it exerts effects independent of the thyroid axis.

TRH Structure

TRH is a uniquely modified tripeptide — the N-terminal glutamate is cyclized to pyroglutamate, and the C-terminal proline is amidated. These modifications protect the tripeptide from exopeptidase degradation and are essential for receptor binding. The molecular formula is C₁₆H₂₂N₄O₄ with MW 338.38 g/mol. Despite its very short half-life in plasma (approximately 5 minutes due to rapid enzymatic inactivation), TRH has been extensively studied both as a diagnostic tool and for its CNS effects.

TRH Research

Beyond its HPT axis regulation, TRH has generated significant research interest for its CNS effects. Clinical research has documented antidepressant effects of TRH when administered intravenously or intrathecally, with rapid-onset improvements in mood in depressed patients — paralleling other rapidly acting antidepressants like ketamine. The mechanism may involve TRH's actions as a neuromodulator in the limbic system, where TRH receptors are highly expressed.

Analeptic research has shown TRH can reverse central nervous system depression from various causes including barbiturates, opioids, and alcohol in animal models — effects independent of thyroid axis activation. Spinal cord injury research has investigated TRH as a neuroprotective agent, with some studies showing improved functional recovery when TRH is administered shortly after injury. Research has also explored TRH's effects on arousal, attention, and memory, with potential relevance to Alzheimer's disease where TRH-producing neurons are lost.`
  },

  "159": {
    id: "159",
    casNumber: "24305-27-9",
    formula: "C₁₆H₂₂N₄O₄",
    molecularWeight: "338.38 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Glu-His-Pro-NH₂",
    researchAreas: ["Thyroid Research", "Mood Research", "Cognitive Research", "Neuroprotection"],
    alsoKnownAs: "TRH, Thyrotropin-Releasing Hormone, Protirelin",
    description: `Thyrotropin TRH 50mg provides a larger research quantity of this important hypothalamic tripeptide for extended protocols. TRH's dual role as a pituitary regulatory hormone and a CNS neuromodulator makes it a valuable research tool for thyroid axis studies, mood disorder research, and neuroprotection investigations.`,
    longDescription: `Thyrotropin TRH 50mg is the same compound as TRH 20mg, providing a larger quantity for extended research. Please refer to the TRH 20mg product for the full scientific content covering TRH's identity as a hypothalamic tripeptide (Glu-His-Pro-NH₂), its regulatory role in the HPT axis, and its CNS research applications including antidepressant effects, analeptic properties, and neuroprotection in spinal cord injury models.`
  },

  "160": {
    id: "160",
    casNumber: "2023788-19-2",
    formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
    molecularWeight: "4813.5 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white lyophilized powder",
    halfLife: "Approximately 5 days",
    researchAreas: ["Metabolic Research", "Obesity Research", "Diabetes Research", "Cardiovascular Research", "MASH Research"],
    alsoKnownAs: "LY3298176, Mounjaro (brand), Zepbound (brand), GIP/GLP-1 dual agonist",
    description: `Tirzepatide 5mg is the entry-level research vial of the dual GIP/GLP-1 receptor agonist developed by Eli Lilly. Tirzepatide simultaneously activates both GIP and GLP-1 receptors, providing a dual incretin mechanism of action that surpasses the weight loss and glycemic efficacy of single GLP-1 agonists. It received FDA approval as Mounjaro (for type 2 diabetes, 2022) and Zepbound (for obesity, 2023).`,
    longDescription: `What is Tirzepatide?

Tirzepatide (LY3298176) is a first-in-class dual glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist developed by Eli Lilly. It was designed as a "twincretin" — a single peptide molecule with dual agonist activity at both incretin receptors. GIP is secreted from duodenal K-cells and GLP-1 from intestinal L-cells in response to food. Both hormones augment insulin secretion in a glucose-dependent manner, but they have distinct and complementary effects: GLP-1 primarily reduces appetite and slows gastric emptying, while GIP may reduce appetite while also potentially improving insulin secretion and reducing fat storage through direct adipocyte GIP receptor signaling.

Tirzepatide Structure

Tirzepatide is a 39-amino acid peptide based on the native GIP sequence with modifications to incorporate GLP-1 receptor binding capacity. A C18 fatty diacid is attached through a hydrophilic linker to lysine at position 20, enabling albumin binding and extending the half-life to approximately 5 days — suitable for once-weekly subcutaneous administration. Tirzepatide's molecular formula is C₂₂₅H₃₄₈N₄₈O₆₈ with MW 4813.5 g/mol.

Tirzepatide Research

The SURPASS Phase 3 clinical trial program established Tirzepatide's exceptional efficacy in type 2 diabetes. SURPASS-2 demonstrated that Tirzepatide 15mg reduced HbA1c by 2.46 percentage points and body weight by 12.9% over 40 weeks, significantly outperforming semaglutide 1mg. The SURMOUNT trial program for obesity showed even more dramatic results: SURMOUNT-1 demonstrated that Tirzepatide 15mg produced mean body weight reduction of 22.5% over 72 weeks in obese adults — substantially exceeding the 15% seen with semaglutide in similar populations.

MASH (metabolic dysfunction-associated steatohepatitis) research has emerged as a major focus. The SYNERGY-NASH trial demonstrated histological improvement in liver disease with tirzepatide, leading to FDA approval for MASH with fibrosis in 2024 — the second approved treatment for this condition (after resmetirom). Research continues into tirzepatide's cardiovascular protective effects (SURPASS-CVOT), effects in heart failure with preserved ejection fraction (HFpEF), and potential applications in sleep apnea, polycystic ovary syndrome, and other metabolic conditions.`
  },

  "161": {
    id: "161",
    casNumber: "2023788-19-2",
    formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
    molecularWeight: "4813.5 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white lyophilized powder",
    halfLife: "Approximately 5 days",
    researchAreas: ["Metabolic Research", "Obesity Research", "Diabetes Research", "Cardiovascular Research"],
    alsoKnownAs: "LY3298176, Mounjaro (brand), Zepbound (brand)",
    description: `Tirzepatide 10mg provides a mid-range research quantity of the dual GIP/GLP-1 receptor agonist. This vial size supports multi-dose protocols and study designs requiring the 10mg equivalent dose level — which demonstrated HbA1c reductions of approximately 2.34% and body weight reductions of approximately 19.5% in the SURMOUNT-1 trial. For full scientific content, see Tirzepatide 5mg.`,
    longDescription: `Tirzepatide 10mg is the same compound as Tirzepatide 5mg and 15mg. Please refer to the Tirzepatide 5mg product for the complete scientific overview, structural details, and Phase 3 SURPASS and SURMOUNT clinical trial data demonstrating tirzepatide's exceptional dual GIP/GLP-1 efficacy.`
  },

  "162": {
    id: "162",
    casNumber: "2023788-19-2",
    formula: "C₂₂₅H₃₄₈N₄₈O₆₈",
    molecularWeight: "4813.5 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white lyophilized powder",
    halfLife: "Approximately 5 days",
    researchAreas: ["Metabolic Research", "Obesity Research", "Diabetes Research", "Cardiovascular Research", "MASH Research"],
    alsoKnownAs: "LY3298176, Mounjaro (brand), Zepbound (brand)",
    description: `Tirzepatide 15mg is the highest approved dose of the dual GIP/GLP-1 receptor agonist and the dose that demonstrated the greatest weight loss in clinical trials — approximately 22.5% body weight reduction over 72 weeks in the SURMOUNT-1 trial. This large vial provides the quantity for extended research protocols.`,
    longDescription: `Tirzepatide 15mg provides the largest single vial quantity of Tirzepatide. The 15mg dose is the highest FDA-approved dose and demonstrated the greatest efficacy in both the SURPASS (diabetes) and SURMOUNT (obesity) clinical trial programs. Please refer to the Tirzepatide 5mg product for the complete scientific overview of tirzepatide's dual GIP/GLP-1 mechanism, molecular structure, and clinical research data.`
  },

  "168": {
    id: "168",
    casNumber: "37221-79-7",
    formula: "C₁₄₇H₂₄₅N₄₃O₄₆",
    molecularWeight: "3326.64 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 1 minute (intravenous)",
    researchAreas: ["Pulmonary Research", "Neuroprotection", "Anti-Inflammatory Research", "Intestinal Research", "Immune Research"],
    alsoKnownAs: "VIP, Vasoactive Intestinal Peptide, Vasoactive Intestinal Polypeptide",
    description: `VIP (Vasoactive Intestinal Peptide) is a 28-amino acid neuropeptide widely distributed throughout the nervous system, gut, and lung. It acts through VPAC1 and VPAC2 receptors to produce vasodilation, bronchodilation, immunomodulation, and anti-inflammatory effects. Research has explored VIP in pulmonary hypertension, inflammatory bowel disease, neuroprotection, and autoimmune conditions.`,
    longDescription: `What is VIP?

Vasoactive Intestinal Peptide (VIP) was first isolated from porcine small intestine by Said and Mutt in 1970 and is a member of the glucagon/secretin superfamily of peptides. It is a 28-amino acid neuropeptide found throughout the nervous system — particularly in the autonomic nervous system innervating smooth muscle, glands, and immune cells. VIP is also produced by immune cells themselves and plays major roles in immune regulation. It acts through two receptors: VPAC1 (expressed broadly in lung, small intestine, brain, liver) and VPAC2 (expressed in smooth muscle, brain, and pancreas).

VIP Structure

VIP is a 28-amino acid peptide with MW 3326.64 g/mol. Its N-terminal region (particularly His-Ser-Asp) is essential for receptor binding and is shared with related peptides (PACAP, secretin, glucagon). The peptide adopts an alpha-helical conformation upon receptor binding. VIP is rapidly degraded in plasma by multiple proteases, contributing to its very short half-life of approximately 1 minute when given intravenously — necessitating continuous infusion or alternative delivery strategies in research settings.

VIP Research

Pulmonary research has explored VIP in pulmonary arterial hypertension (PAH). Studies discovered that VIP deficiency is associated with PAH and that VIP is a potent vasodilator and anti-proliferative agent in pulmonary vasculature. A Phase 1/2 clinical trial of inhaled VIP in PAH patients showed improvements in pulmonary vascular resistance and exercise capacity. Research continues into VIP's vasodilatory, anti-remodeling, and anti-inflammatory effects in the pulmonary circulation.

Immune research has established VIP as a major immunomodulatory neuropeptide. VIP promotes a Th2 immune phenotype, inhibits pro-inflammatory cytokine production (TNF-α, IL-1β, IL-6, IL-12), and promotes regulatory T cell (Treg) development. Studies have shown therapeutic effects in animal models of multiple sclerosis, rheumatoid arthritis, inflammatory bowel disease, and sepsis. Neuroprotection research has demonstrated VIP supports neuronal survival, promotes neurotrophic factor production, and reduces excitotoxicity and neuroinflammation in models of Alzheimer's and Parkinson's disease. Research is ongoing into VIP analogues with improved stability for clinical applications in these diverse areas.`
  },

  "169": {
    id: "169",
    casNumber: "70-18-8",
    formula: "C₁₀H₁₇N₃O₆S",
    molecularWeight: "307.32 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C, protected from light and moisture.",
    appearance: "White crystalline powder",
    solubility: "Highly soluble in water",
    halfLife: "Approximately 10 minutes (intravenous)",
    sequence: "Gly-Cys-Glu (γ-glutamyl-cysteinyl-glycine)",
    researchAreas: ["Antioxidant Research", "Detoxification Research", "Immune Research", "Anti-Aging Research", "Liver Research"],
    alsoKnownAs: "GSH, γ-L-Glutamyl-L-cysteinylglycine, Reduced Glutathione",
    description: `Glutathione 600mg is the reduced, biologically active form of glutathione — the most abundant intracellular antioxidant in mammalian cells. Glutathione (GSH) is a tripeptide (γ-Glu-Cys-Gly) that serves as the primary cellular defense against oxidative stress and is essential for xenobiotic detoxification. Research has studied intravenous glutathione for liver disease, Parkinson's disease, chemotherapy toxicity reduction, and general antioxidant therapy.`,
    longDescription: `What is Glutathione?

Glutathione (GSH, γ-L-glutamyl-L-cysteinyl-glycine) is the most abundant small molecule antioxidant in mammalian cells, present at millimolar concentrations (1–10 mM) in most cell types. It is a tripeptide synthesized de novo in cells from its constituent amino acids (glutamate, cysteine, glycine) by two sequential enzymatic reactions (γ-glutamylcysteine synthetase and glutathione synthetase). Glutathione exists in a dynamic equilibrium between its reduced (GSH) and oxidized (GSSG) forms, with the GSH/GSSG ratio serving as a key indicator of cellular redox status. Optimal function of virtually all major cellular systems depends on maintaining adequate GSH levels.

Glutathione Structure

Glutathione's unique structural feature is its gamma-peptide bond — the glutamyl residue is linked through its gamma-carboxyl group (rather than the usual alpha-carboxyl) to cysteine. This unusual linkage protects glutathione from cleavage by most cellular peptidases, allowing it to accumulate at millimolar concentrations. The thiol (-SH) group of cysteine is the reactive center, enabling glutathione to neutralize reactive oxygen species (ROS) and conjugate to electrophilic xenobiotics. MW 307.32 g/mol.

Glutathione Research

Antioxidant and liver research have been primary areas of investigation. Intravenous glutathione has been studied for non-alcoholic fatty liver disease (NAFLD) and liver conditions associated with elevated oxidative stress. Research in patients with NAFLD has shown that intravenous glutathione supplementation can reduce liver enzymes (ALT, AST) and improve liver steatosis — effects attributed to reduced hepatocyte oxidative stress.

Neurological research has focused on glutathione's potential in Parkinson's disease (PD), where post-mortem studies reveal markedly decreased GSH in the substantia nigra of PD patients. Pilot clinical studies of intravenous glutathione in PD patients reported subjective and objective improvements in motor function. Research in cancer patients has explored whether glutathione can reduce chemotherapy-induced peripheral neuropathy, with some studies showing protective effects against cisplatin and oxaliplatin toxicity.

Immune research has established that T-lymphocyte function is strongly dependent on intracellular glutathione levels — GSH-depleted T-cells show impaired proliferation and cytokine production. Studies have shown that maintaining adequate glutathione in immune cells through supplementation improves responses to infection in in vitro and animal models. Skin whitening research has also generated interest, as glutathione inhibits melanin synthesis by tyrosinase — a well-documented effect exploited in dermatology research.`
  },

  "171": {
    id: "171",
    casNumber: "Not publicly available",
    formula: "Synthetic peptide",
    molecularWeight: "Approximately 0.6 kDa",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Neuroprotection", "Cognitive Research", "Alzheimer's Research", "tau Research", "BDNF Research"],
    alsoKnownAs: "P021, CNTF-derived peptide, Cognitively active peptide",
    description: `P21 (P021) is a small peptide fragment derived from the ciliary neurotrophic factor (CNTF) interface with gp130. Research has demonstrated that P21 can penetrate the blood-brain barrier and activate BDNF-TrkB signaling, reduce tau hyperphosphorylation, and improve cognitive function in animal models of Alzheimer's disease — suggesting potential utility for research into neurodegenerative conditions.`,
    longDescription: `What is P21?

P21 (also written as P021) is a tetrapeptide derived from a region of ciliary neurotrophic factor (CNTF) that interacts with the gp130 receptor subunit. It was developed by researchers at the Litwin-Zucker Research Center for the Study of Alzheimer's Disease. The peptide was identified through a screening process aimed at finding small molecules that could activate BDNF signaling and protect neurons from the pathological features of Alzheimer's disease, particularly tau hyperphosphorylation and amyloid toxicity.

P21 Structure and Mechanism

P21 is a tetrapeptide with MW approximately 0.6 kDa. Its small size allows blood-brain barrier penetration following systemic administration. The compound appears to activate TrkB receptors (the high-affinity BDNF receptor), possibly through a mechanism involving the p75NTR receptor and signaling crosstalk. P21 also appears to activate CNTF-related signaling pathways that independently support neuronal survival.

P21 Research

The primary focus of P21 research has been Alzheimer's disease pathology. Studies in tau-transgenic mice (a model of tau-related neurodegeneration) demonstrated that P21 administration significantly reduced tau hyperphosphorylation in the brain — one of the hallmarks of Alzheimer's disease and other tauopathies. Treated mice showed preservation of hippocampal neurons and improved cognitive performance in spatial memory tasks.

Research has also examined P21's effects on amyloid pathology, finding reductions in amyloid beta production in some model systems. The compound appears to increase adult neurogenesis in the hippocampus — consistent with BDNF-TrkB signaling activation, which is a known driver of new neuron formation in this brain region. Behavioral studies have consistently shown cognitive improvements in aged or cognitively impaired rodents treated with P21, including improvements in spatial navigation, object recognition, and fear conditioning. Research is at an early stage and continues to characterize the mechanisms and potential of this compound.`
  },

  /* ─────────────────────────────────────────────────────────────────────────
     GROWTH HORMONE PEPTIDES
  ───────────────────────────────────────────────────────────────────────── */

  "22": {
    id: "22",
    casNumber: "863288-34-0",
    formula: "C₁₄₉H₂₄₆N₄₄O₄₂S",
    molecularWeight: "3367.97 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes",
    sequence: "Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-NH₂",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research", "Body Composition Research"],
    alsoKnownAs: "Modified GRF 1-29, Mod-GRF 1-29, CJC-1295 without DAC, Sermorelin analogue",
    description: `CJC-1295 No DAC 2mg (Modified GRF 1-29) is a synthetic analogue of the first 29 amino acids of growth hormone releasing hormone. The key modification (D-Ala substitution at position 2) protects the peptide from DPP-IV cleavage, extending its half-life compared to native GHRH. Unlike CJC-1295 with DAC (which has a very long half-life through albumin binding), the No DAC version more closely mimics the natural pulsatile pattern of GH release.`,
    longDescription: `What is CJC-1295 No DAC?

CJC-1295 No DAC, also known as Modified GRF (1-29) or Mod-GRF 1-29, is a synthetic peptide comprising the first 29 amino acids of growth hormone releasing hormone with four key amino acid substitutions that enhance stability. These are: D-Ala at position 2 (protects from DPP-IV cleavage), Gln at position 8, Ala at position 15, and Leu at position 27 — substitutions that were identified through systematic structure-activity optimization. The compound was one of the precursors in the CJC peptide family but differs critically from CJC-1295 DAC in that it lacks the Drug Affinity Complex (DAC) modification that provides albumin binding.

CJC-1295 No DAC Structure

The 29-amino acid peptide has MW 3367.97 g/mol. Its D-Ala substitution at position 2 is the most critical modification — this is the primary site of DPP-IV proteolytic attack on native GHRH(1-29) (Sermorelin). By replacing the natural Ala with D-Ala, the D-configuration amino acid is not recognized by DPP-IV, extending the half-life from approximately 7 minutes (Sermorelin) to approximately 30 minutes. The other substitutions further enhance stability and receptor binding.

CJC-1295 No DAC Research

Research comparing CJC-1295 No DAC to Sermorelin and native GHRH shows superior GH stimulation due to enhanced stability. Studies have demonstrated that CJC-1295 No DAC produces robust GH pulses when administered. The approximately 30-minute half-life is viewed favorably by researchers studying pulsatile GH secretion, as it more closely approximates natural GHRH activity compared to CJC-1295 with DAC (which produces a sustained, non-pulsatile GH elevation over days). The compound is frequently combined with GHRPs (Ipamorelin, GHRP-2, GHRP-6) for synergistic GH stimulation, as GHRH analogues and GHRPs act through complementary receptor systems (GHRHR and GHS-R respectively) to produce additive or greater GH release.`
  },

  "23": {
    id: "23",
    casNumber: "863288-34-0",
    formula: "C₁₄₉H₂₄₆N₄₄O₄₂S",
    molecularWeight: "3367.97 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research"],
    alsoKnownAs: "Modified GRF 1-29, Mod-GRF 1-29, CJC-1295 without DAC",
    description: `CJC-1295 No DAC 5mg provides a larger research quantity of Modified GRF 1-29 for extended protocols. This vial supports research requiring multiple administrations or comparison dosing groups. For complete scientific information on the compound, refer to the CJC-1295 No DAC 2mg product description.`,
    longDescription: `CJC-1295 No DAC 5mg is the same compound as the 2mg vial, provided in a larger quantity. Please refer to the CJC-1295 No DAC 2mg product description for the full scientific content covering its identity as a Modified GRF 1-29, its stabilizing D-Ala substitution, and its research applications in growth hormone secretagogue studies and anti-aging research.`
  },

  "27": {
    id: "27",
    casNumber: "863288-34-0 / 170851-70-4",
    formula: "CJC-1295 No DAC + Ipamorelin blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research", "Body Composition Research"],
    alsoKnownAs: "CJC-1295/Ipamorelin Blend, Mod-GRF 1-29 + Ipamorelin",
    description: `CJC1295/Ipamorelin 10mg Blend combines Modified GRF 1-29 (CJC-1295 No DAC) and Ipamorelin in a single vial. This dual-agent combination targets two complementary GH secretagogue receptor systems simultaneously: CJC-1295 No DAC acts on GHRH receptors while Ipamorelin acts on ghrelin receptors (GHS-R). Research demonstrates synergistic GH release exceeding either agent alone, with Ipamorelin's high selectivity ensuring minimal off-target hormonal stimulation.`,
    longDescription: `What is the CJC-1295/Ipamorelin Blend?

The CJC-1295 (No DAC)/Ipamorelin blend exploits the synergistic relationship between two classes of GH secretagogues that act through distinct receptor systems. GHRH analogues (CJC-1295 No DAC) act on the GHRH receptor (GHRHR) on pituitary somatotrophs, activating the adenylyl cyclase/cAMP pathway to increase GH synthesis and secretion. GHRPs/ghrelin mimetics (Ipamorelin) act on the GHS-R1a receptor, activating the PLC/PKC pathway and also disinhibiting somatostatin (the GH-inhibitory hormone) release. Together, the two mechanisms produce additive or synergistic GH release.

Research Foundation for Combined Use

The rationale for combining GHRH analogues with GHRPs comes from fundamental neuroendocrinology. In vivo studies have consistently shown that co-administration of GHRH and GHRP compounds produces GH release substantially greater than either compound alone. The combination replicates and amplifies the natural dual-signal control of GH release: hypothalamic GHRH provides the "go" signal while reduction in somatostatin (achieved by GHRPs) removes the "stop" signal, together producing maximum pituitary GH output.

Ipamorelin's Role in the Blend

Ipamorelin is specifically chosen for this blend because of its outstanding selectivity. Among GHRPs, Ipamorelin produces minimal stimulation of ACTH/cortisol, prolactin, or other pituitary hormones — effects that confound research with less selective agents like GHRP-2 and GHRP-6. This selectivity means that the combination blend's effects on GH release can be attributed cleanly to the GH secretagogue mechanism without secondary hormonal perturbations, making it a clean tool for growth hormone axis research.`
  },

  "33": {
    id: "33",
    casNumber: "307297-39-8",
    formula: "C₁₄H₂₂N₄O₉",
    molecularWeight: "390.35 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Stable for 2 years when stored properly.",
    appearance: "White lyophilized powder",
    solubility: "Freely soluble in water",
    sequence: "Ala-Glu-Asp-Gly",
    researchAreas: ["Anti-Aging Research", "Telomere Research", "Immune System Research", "Circadian Rhythm Research", "Longevity Research"],
    alsoKnownAs: "Epitalon, Epithalamin synthetic analogue",
    description: `Epithalon (Epitalon) 20mg is the 20mg lyophilized vial of the synthetic tetrapeptide Ala-Glu-Asp-Gly. This is the injectable research vial format of the compound studied by Professor Vladimir Khavinson for its telomere-lengthening and anti-aging properties. Research spanning decades has demonstrated Epithalon's ability to stimulate telomerase activity and extend cellular lifespan in model organisms.`,
    longDescription: `What is Epithalon?

Epithalon (also Epitalon) is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) modeled after Epithalamin, a natural peptide produced by the pineal gland. Extensive research — primarily from Professor Vladimir Khavinson's group at the Institute of Bioregulation and Gerontology in St. Petersburg — has established Epithalon as one of the most studied longevity peptides. Research demonstrates its ability to activate telomerase, extend telomeres, and produce anti-aging effects across multiple species.

Epithalon Structure

Epithalon is a simple tetrapeptide with MW 390.35 g/mol, freely soluble in water. Its molecular simplicity belies its profound biological effects. The sequence Ala-Glu-Asp-Gly is derived from the pineal gland protein Epithalamin and acts as a bioregulator — a term used by Khavinson's group for short peptides that regulate gene expression toward a more youthful pattern.

Epithalon Research

The most significant research finding is Epithalon's ability to activate telomerase. In studies using human fetal fibroblasts, Epithalon treatment increased telomerase activity and allowed cells to exceed the Hayflick limit (the normal limit on cell divisions imposed by telomere shortening), demonstrating an extension of cellular replicative capacity. These are among the first demonstrations that a natural-sequence peptide can extend cellular lifespan in human cells.

Long-term animal studies have demonstrated lifespan extension of 12–16% in mice treated with Epithalon or the parent Epithalamin compound. Studies in rats have shown reductions in tumor incidence, improved estrous cycle function in aged females, and preservation of a more youthful pattern of physiological parameters including melatonin secretion, antioxidant enzyme activity, and immune function. A study in rhesus monkeys showed that long-term Epithalamin treatment produced favorable effects on multiple aging biomarkers. Human studies from Russia suggest clinical benefits in elderly subjects, with reported improvements in immune function, melatonin levels, cardiovascular parameters, and quality of life — though large-scale Western-standard clinical trials are lacking.`
  },

  "34": {
    id: "34",
    casNumber: "307297-39-8",
    formula: "C₁₄H₂₂N₄O₉",
    molecularWeight: "390.35 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Ala-Glu-Asp-Gly",
    researchAreas: ["Anti-Aging Research", "Telomere Research", "Longevity Research", "Immune Research"],
    alsoKnownAs: "Epitalon, Epithalamin synthetic analogue",
    description: `Epithalon (Epitalon) 50mg provides the largest lyophilized vial format of this telomere-lengthening tetrapeptide, supporting extended research programs and higher-dose studies. For full scientific content on Epithalon, please refer to the Epithalon 20mg product description.`,
    longDescription: `Epithalon 50mg is the same compound as Epithalon 20mg, provided in a larger quantity for extended research. Please refer to the Epithalon 20mg product description for the comprehensive overview of Epithalon's identity as a synthetic tetrapeptide (Ala-Glu-Asp-Gly), its telomerase-activating mechanism, and its research findings in lifespan extension, immune function, and anti-aging biomarkers.`
  },

  "44": {
    id: "44",
    casNumber: "89030-95-5",
    formula: "C₁₄H₂₄CuN₆O₄",
    molecularWeight: "340.38 g/mol (free peptide), 403.9 g/mol (Cu²⁺ complex)",
    purity: "99% HPLC",
    storage: "Store at -20°C. Stable for 2 years when stored properly.",
    appearance: "Blue powder (copper complex)",
    solubility: "Soluble in water",
    sequence: "Gly-His-Lys",
    researchAreas: ["Wound Healing", "Anti-Aging Research", "Collagen Research", "Anti-Inflammatory Research", "Cosmetic Research"],
    alsoKnownAs: "Copper Peptide, Tripeptide-1 Copper, GHK",
    description: `GHK-Cu 50mg Copper Peptide is the standard injectable research vial of the copper tripeptide complex. GHK-Cu (glycyl-L-histidyl-L-lysine copper) naturally occurs in human plasma and plays roles in wound healing, collagen synthesis, and tissue maintenance. Research by Loren Pickart and others has established GHK-Cu as a multifunctional peptide that modulates gene expression across thousands of genes related to tissue repair, inflammation, and aging.`,
    longDescription: `What is GHK-Cu 50mg?

GHK-Cu 50mg is the injectable lyophilized vial form of the copper tripeptide complex. For a comprehensive overview of GHK-Cu's discovery, structure, and research findings, please refer to the GHK-Cu Capsules (2mg × 60) product description.

Additional Research Highlights

The injectable form of GHK-Cu has been used in numerous research studies examining wound healing, hair follicle activation, bone regeneration, and nerve repair. Injection studies produce more controlled pharmacokinetic profiles than topical application, enabling dose-response characterization. Research has shown that systemic GHK-Cu administration produces different effects than topical application — with systemic delivery potentially affecting multiple organ systems, while topical delivery is primarily confined to skin, scalp, and subcutaneous tissue.

Key research findings with injectable GHK-Cu include: promotion of new blood vessel formation (angiogenesis) around wounds, stimulation of nerve sprouting in peripheral nerve injury models, activation of hair follicle growth cycles in skin biology research, and broadly anti-inflammatory effects through downregulation of NF-κB target genes. The 50mg vial provides researchers with a large quantity for multi-animal, multi-dose studies.`
  },

  "54": {
    id: "54",
    casNumber: "158861-67-7",
    formula: "C₄₅H₅₅N₉O₆",
    molecularWeight: "817.93 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White powder",
    halfLife: "Approximately 15–60 minutes",
    sequence: "D-Ala-D-β-Nal-Ala-Trp-D-Phe-Lys-NH₂",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Appetite Research", "Anti-Aging Research"],
    alsoKnownAs: "Pralmorelin, KP-102, GHRP-2",
    description: `GHRP-2 5mg (Growth Hormone Releasing Peptide-2) is a synthetic hexapeptide GHS-R1a agonist and one of the most potent GH secretagogues in the GHRP class. It stimulates robust GH release and also increases appetite through ghrelin receptor activation. Research has studied GHRP-2 extensively for GH axis stimulation, body composition, and appetite regulation, but unlike Ipamorelin, GHRP-2 does produce some stimulation of cortisol and ACTH alongside GH.`,
    longDescription: `What is GHRP-2?

GHRP-2 (Growth Hormone Releasing Peptide-2, Pralmorelin) is a synthetic hexapeptide that acts as a potent agonist at the growth hormone secretagogue receptor type 1a (GHS-R1a). It was developed following the identification of the enkephalin peptide domain responsible for GH release and represents a second-generation improvement over GHRP-1. GHRP-2 produces potent GH release through dual mechanisms: direct pituitary GHS-R1a activation and hypothalamic GHRH release augmentation.

GHRP-2 Structure

GHRP-2 (D-Ala-D-β-Nal-Ala-Trp-D-Phe-Lys-NH₂) has MW 817.93 g/mol. The multiple D-amino acids in the sequence confer resistance to proteolytic degradation, extending the half-life to 15–60 minutes. The D-naphthylalanine (D-β-Nal) and D-phenylalanine residues are critical for high-affinity GHS-R1a binding. GHRP-2 binds GHS-R1a with higher affinity than GHRP-6, contributing to its greater GH-releasing potency.

GHRP-2 Research

Studies across multiple species (rats, dogs, humans) have confirmed that GHRP-2 is among the most potent GH secretagogues available. Peak GH levels following GHRP-2 administration consistently exceed those produced by equivalent doses of GHRP-6 or Ipamorelin in head-to-head comparisons. However, unlike Ipamorelin, GHRP-2 also produces significant stimulation of ACTH and cortisol — effects mediated by GHS-R1a expressed on corticotroph cells and through hypothalamic CRH release.

Research has characterized the acute GH response to GHRP-2 in detail, showing dose-dependent GH pulses with desensitization following repeated doses at short intervals. When combined with GHRH analogues (CJC-1295 No DAC, Sermorelin), GHRP-2 produces synergistic GH release substantially exceeding either agent alone. Long-term studies in GH-deficient patients using GHRP-2 have demonstrated sustained increases in IGF-1 levels and improvements in body composition. Appetite research has characterized the orexigenic (appetite-stimulating) effects through ghrelin receptor-mediated hypothalamic signaling, relevant to cachexia and wasting disease research.`
  },

  "55": {
    id: "55",
    casNumber: "158861-67-7",
    formula: "C₄₅H₅₅N₉O₆",
    molecularWeight: "817.93 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White powder",
    halfLife: "Approximately 15–60 minutes",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Appetite Research"],
    alsoKnownAs: "Pralmorelin, KP-102",
    description: `GHRP-2 10mg provides a larger research quantity of this potent GH secretagogue for extended protocols or higher-dose studies. GHRP-2 consistently ranks among the most potent GHRPs for GH release, though it produces some cortisol and ACTH stimulation alongside GH. For complete scientific content, see the GHRP-2 5mg description.`,
    longDescription: `GHRP-2 10mg is the same compound as GHRP-2 5mg. Please refer to the GHRP-2 5mg product for the complete scientific overview, structure information, and research summary.`
  },

  "60": {
    id: "60",
    casNumber: "87616-84-0",
    formula: "C₄₆H₅₆N₁₂O₆",
    molecularWeight: "873.01 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    halfLife: "15–60 minutes",
    sequence: "His-D-Trp-Ala-Trp-D-Phe-Lys-NH₂",
    researchAreas: ["Growth Hormone Research", "Appetite Research", "Metabolic Research", "Gastrointestinal Research"],
    alsoKnownAs: "His-D-Trp-Ala-Trp-D-Phe-Lys",
    description: `GHRP-6 5mg is a synthetic hexapeptide growth hormone secretagogue and one of the first GHRPs characterized. It acts through GHS-R1a to stimulate robust GH release and produces significant appetite stimulation — one of the most pronounced orexigenic effects among the GHRP class. Research has studied GHRP-6 for GH stimulation, appetite regulation, gastroprotection, and its effects on the gut-brain axis.`,
    longDescription: `What is GHRP-6?

GHRP-6 (Growth Hormone Releasing Peptide-6) was one of the earliest synthetic GHRPs developed and characterized. It emerged from enkephalin analogue screening programs searching for GH-releasing compounds and was one of the first hexapeptide GHRPs shown to potently stimulate GH secretion in animals and humans. GHRP-6 acts primarily through the GHS-R1a receptor (now known to be the ghrelin receptor) to stimulate GH release from the anterior pituitary.

GHRP-6 Structure

GHRP-6 has the sequence His-D-Trp-Ala-Trp-D-Phe-Lys-NH₂ with MW 873.01 g/mol. The D-Trp at position 2 and D-Phe at position 5 are critical for GHS-R1a binding and confer resistance to enzymatic degradation. Compared to GHRP-2, GHRP-6 has slightly lower GH-releasing potency but produces a more pronounced appetite-stimulating effect — differences attributed to distinct binding modes at the GHS-R1a.

GHRP-6 Research

Research has established that GHRP-6 produces dose-dependent GH release in rats, dogs, and humans, with peak GH levels occurring 15–60 minutes after injection. The compound also stimulates ACTH and cortisol release, though less markedly than GHRP-2. The appetite-stimulating effects of GHRP-6 are more pronounced than other GHRPs and have been extensively studied in appetite regulation research, with the compound increasing food intake in rodent models through both central (hypothalamic NPY upregulation) and peripheral mechanisms.

Gastroprotective research has revealed a fascinating aspect of GHRP-6 beyond GH secretagogue activity: studies have shown that GHRP-6 has potent gastroprotective effects against experimentally induced gastric ulcers, potentially through GHS-R1a-mediated signaling in stomach tissue. This gastric protective effect parallels some of BPC-157's gastrointestinal actions and has stimulated research into GHS-R1a-mediated gut protection. GHRP-6 is frequently used in combination with CJC-1295 No DAC for synergistic GH stimulation research.`
  },

  "61": {
    id: "61",
    casNumber: "87616-84-0",
    formula: "C₄₆H₅₆N₁₂O₆",
    molecularWeight: "873.01 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Appetite Research", "Metabolic Research"],
    alsoKnownAs: "His-D-Trp-Ala-Trp-D-Phe-Lys",
    description: `GHRP-6 10mg provides a larger research quantity of the original growth hormone releasing peptide with pronounced appetite-stimulating properties. For complete scientific content, please refer to the GHRP-6 5mg product description.`,
    longDescription: `GHRP-6 10mg is the same compound as GHRP-6 5mg in a larger quantity. Please refer to the GHRP-6 5mg product for the complete overview, structure, and research summary.`
  },

  "68": {
    id: "68",
    casNumber: "66004-57-7",
    formula: "C₇₈H₁₂₅N₂₃O₂₃S₂",
    molecularWeight: "1817.12 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Tyr-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Glu-Gly-Ser-Cys-Gly-Phe",
    researchAreas: ["Metabolic Research", "Lipid Metabolism Research", "Obesity Research", "Lipolysis Research"],
    alsoKnownAs: "HGH Frag, AOD-9604 (different modification), hGH 176-191",
    description: `hGH Fragment 176-191 6mg is a 16-amino acid fragment derived from the C-terminal region of human growth hormone (positions 176-191). It was identified as the portion of hGH responsible for fat metabolism, specifically lipolysis (fat breakdown) and inhibition of lipogenesis (fat formation). Unlike full-length hGH, Fragment 176-191 does not stimulate IGF-1 production or promote cell growth, potentially separating the fat-burning effect from growth-promoting effects.`,
    longDescription: `What is hGH Fragment 176-191?

hGH Fragment 176-191 is a 16-amino acid peptide corresponding to the C-terminal residues 176-191 of the 191-amino acid human growth hormone molecule. It was identified through systematic fragment studies aimed at isolating the portion of hGH responsible for its lipolytic (fat-burning) activity. Researchers at Metabolic Pharmaceuticals (Australia) demonstrated that this specific fragment retained the fat-burning properties of full-length hGH without stimulating IGF-1 production or insulin resistance.

hGH Fragment 176-191 Structure

The fragment spans amino acids 176-191 of hGH: Tyr-Leu-Arg-Ile-Val-Gln-Cys-Arg-Ser-Val-Glu-Gly-Ser-Cys-Gly-Phe, containing a disulfide bond between Cys-182 and Cys-189. This intramolecular disulfide bridge is also present in the native hGH and is required for the anti-obesity activity of the fragment. MW 1817.12 g/mol. The fragment lacks the N-terminal region of hGH that is responsible for GHR binding, somatogenic effects, and IGF-1 stimulation.

hGH Fragment 176-191 Research

Studies in obese and lean rodents demonstrated that hGH Fragment 176-191 reduces body fat accumulation and stimulates lipolysis in isolated adipocytes at concentrations similar to those of full-length hGH. Importantly, the fragment shows no activity at the traditional GHR (growth hormone receptor) and does not significantly affect blood glucose, IGF-1 levels, or tissue growth — properties that distinguish it from full-length hGH. This selectivity led to the hypothesis of a distinct "lipolytic receptor" in fat tissue that recognizes the 176-191 region.

Research has shown that both intraperitoneal and oral administration of hGH Fragment 176-191 can produce fat-reducing effects in obese rodents, though the oral efficacy is substantially lower than parenteral. The compound appears to increase beta-3 adrenergic receptor expression and fatty acid oxidation in adipose tissue. Clinical studies in humans were conducted, showing modest but measurable effects on fat mass. Research on the precise receptor mediating the fragment's effects continues, with some evidence suggesting involvement of β-adrenergic receptors and β3-ARs in fat tissue.`
  },

  "75": {
    id: "75",
    casNumber: "170851-70-4",
    formula: "C₃₈H₄₉N₉O₅",
    molecularWeight: "711.868 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: refrigerate at 4°C and use within 30 days.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water at 1 mg/mL",
    halfLife: "Approximately 2 hours",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH₂",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Anti-Aging Research", "Sleep Research"],
    alsoKnownAs: "NNC 26-0161",
    description: `Ipamorelin 2mg is the entry-level research vial of the most selective GHRP peptide. Ipamorelin (Aib-His-D-2-Nal-D-Phe-Lys-NH₂) is a pentapeptide and ghrelin mimetic that selectively stimulates GH release without significantly affecting cortisol, ACTH, or prolactin levels — making it the cleanest research tool for isolated GH axis studies among the GHRP class.`,
    longDescription: `What is Ipamorelin?

Ipamorelin (NNC 26-0161) is a synthetic pentapeptide developed by Novo Nordisk as a growth hormone secretagogue. It was identified through a systematic optimization program aimed at finding the most selective GHRP-class compound. The result is a peptide with exceptional GH-release selectivity — stimulating somatotroph GH secretion with minimal effects on other pituitary axes, including the corticotroph (ACTH/cortisol) and lactotroph (prolactin) axes that are significantly stimulated by GHRP-2 and GHRP-6.

Ipamorelin Structure

Ipamorelin has the sequence Aib-His-D-2-Nal-D-Phe-Lys-NH₂ with MW 711.87 g/mol. The α-aminoisobutyric acid (Aib) at position 1 is a non-natural, achiral amino acid that replaces the His found in GHRP-6 at this position, contributing to metabolic stability and altered receptor binding kinetics. The D-2-naphthylalanine (D-2-Nal) is a bulky hydrophobic D-amino acid that provides both proteolytic resistance and is critical for GHS-R1a binding.

Ipamorelin Research

The defining research finding for Ipamorelin is its extraordinary selectivity. Studies comparing Ipamorelin to GHRP-2 and GHRP-6 at GH-releasing doses consistently show that Ipamorelin does not significantly elevate cortisol, ACTH, aldosterone, or prolactin — a uniquely clean pharmacological profile. This selectivity is attributed to Ipamorelin's specific binding mode at GHS-R1a, which activates GH-releasing pathways without the broader signaling cascade that other GHRPs trigger.

Long-term Ipamorelin studies in rats over 6 months showed sustained GH and IGF-1 elevation, with improvements in bone mineral density and body composition (increased lean mass, decreased fat mass) without development of receptor desensitization comparable to that seen with other GHRPs. Sleep research has shown Ipamorelin increases slow-wave sleep GH pulses, consistent with its GHS-R1a mechanism in the hypothalamus. The 2mg vial is suitable for dose-finding studies and short-term research protocols.`
  },

  "76": {
    id: "76",
    casNumber: "170851-70-4",
    formula: "C₃₈H₄₉N₉O₅",
    molecularWeight: "711.868 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Aib-His-D-2-Nal-D-Phe-Lys-NH₂",
    researchAreas: ["Growth Hormone Research", "Metabolic Research"],
    alsoKnownAs: "NNC 26-0161",
    description: `Ipamorelin 5mg provides a mid-range research quantity of this highly selective growth hormone secretagogue pentapeptide. This vial size supports extended single-study protocols or dose-comparison research. Full scientific content is available in the Ipamorelin 2mg product description.`,
    longDescription: `Ipamorelin 5mg contains the same compound as Ipamorelin 2mg. Please refer to the Ipamorelin 2mg product description for the comprehensive overview, structure details, and research summary.`
  },

  "84": {
    id: "84",
    casNumber: "75921-69-6",
    formula: "C₇₈H₁₁₁N₂₁O₁₉S",
    molecularWeight: "1646.9 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Keep away from light.",
    appearance: "White lyophilized powder",
    halfLife: "1–2 hours (intravenous); longer subcutaneous",
    sequence: "Ac-Ser-Tyr-Ser-Met-Glu-His-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH₂",
    researchAreas: ["Dermatology Research", "Photoprotection Research", "Melanogenesis Research", "Sexual Function Research", "Anti-Inflammatory Research"],
    alsoKnownAs: "Afamelanotide, CUV1647, NDP-α-MSH, MT-1",
    description: `Melanotan 1 (10mg) is a synthetic analogue of alpha-melanocyte-stimulating hormone (α-MSH). Afamelanotide has achieved FDA/EMA approval for erythropoietic protoporphyria (EPP) — a genetic photosensitivity disease — making it one of the few melanocortin research peptides with clinical validation. Research has studied its effects on skin pigmentation, photoprotection, inflammation, and sexual function through melanocortin receptor activation.`,
    longDescription: `What is Melanotan 1?

Melanotan 1 (Afamelanotide, CUV1647) is a synthetic analogue of α-melanocyte-stimulating hormone (α-MSH) with a specific modification: replacement of the methionine at position 4 with norleucine and a D-phenylalanine at position 7. These substitutions — making it [Nle4, D-Phe7]-α-MSH or NDP-MSH — produce a peptide with substantially higher potency, longer half-life, and greater stability than native α-MSH. Afamelanotide has been approved by the EMA and FDA as Scenesse® for the management of phototoxic reactions in adult patients with erythropoietic protoporphyria (EPP).

Melanotan 1 Structure

Melanotan 1 has the 13-amino acid sequence Ac-Ser-Tyr-Ser-Nle-Glu-His-D-Phe-Arg-Trp-Gly-Lys-Pro-Val-NH₂ with MW 1646.9 g/mol. The D-Phe substitution at position 7 is particularly important — it creates a rigid beta-turn conformation at the core hexapeptide (His-D-Phe-Arg-Trp) that is the minimal bioactive sequence for melanocortin receptor activation. The N-terminal acetylation and C-terminal amidation are retained from native α-MSH and contribute to stability.

Melanotan 1 Research

The approved clinical use for Afamelanotide is for EPP — a condition where patients cannot tolerate sunlight due to extreme photosensitivity from accumulated protoporphyrin IX. Clinical trials demonstrated that subcutaneous implants of Afamelanotide (16mg) significantly increased the time patients could tolerate sunlight and improved quality of life, presumably through melanin induction that screens UV radiation. This is the primary validated clinical use.

Beyond EPP, research has explored Melanotan 1 for general photoprotection (potentially reducing UV-induced DNA damage in normal individuals), inflammatory skin conditions (since melanocortin receptors are expressed on immune cells and can suppress inflammation), and sexual dysfunction (through MC4R activation in the CNS). Research in sexual dysfunction models showed Melanotan 1 produced some pro-sexual effects similar to Melanotan 2, though with lower potency at MC4R. Anti-inflammatory research has demonstrated that α-MSH analogues reduce inflammation in models of IBD, arthritis, and neuroinflammation through peripheral MC1R and central MC4R/MC3R activation.`
  },

  "85": {
    id: "85",
    casNumber: "121062-08-6",
    formula: "C₅₀H₆₉N₁₅O₉",
    molecularWeight: "1024.2 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Protect from light.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes (intravenous)",
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH₂",
    researchAreas: ["Melanogenesis Research", "Sexual Function Research", "Energy Metabolism Research", "Appetite Research"],
    alsoKnownAs: "MT-II, Melanotan-II",
    description: `Melanotan 2 (10mg) is a synthetic cyclic analogue of α-MSH with potent and broad melanocortin receptor agonism across MC1R, MC3R, MC4R, and MC5R. Unlike Melanotan 1 (linear, selective for MC1R-MC3R), Melanotan 2's cyclic structure enables strong MC4R activation — the receptor responsible for sexual function and appetite suppression in the CNS. Research has studied MT-2 for tanning, sexual arousal, appetite suppression, and metabolic effects.`,
    longDescription: `What is Melanotan 2?

Melanotan 2 (MT-2) was developed at the University of Arizona by Victor Hruby and Mac Hadley through a systematic effort to create a "super-tanning" agent — a melanocortin peptide that would produce skin darkening without UV exposure, potentially reducing skin cancer risk. By cyclizing the α-MSH sequence and incorporating D-amino acids, they created MT-2 with dramatically improved potency and metabolic stability compared to native α-MSH. The unexpected discovery of MT-2's sexual function effects during early clinical trials launched a major research program into its CNS melanocortin activities.

Melanotan 2 Structure

MT-2 is a cyclic heptapeptide (Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH₂) with MW 1024.2 g/mol. The cyclization through a lactam bond between Asp and Lys creates a rigid ring structure incorporating the His-D-Phe-Arg-Trp pharmacophore — the minimal sequence required for melanocortin receptor activation. This cyclic structure confers exceptional metabolic stability (half-life in plasma measured in hours rather than minutes), though the half-life for central effects appears longer.

Melanotan 2 Research

Tanning research established that MT-2 produces significant skin darkening through MC1R activation in melanocytes, stimulating eumelanin production. Clinical studies showed dose-dependent increases in skin melanin content with MT-2 administration. Importantly, the induced pigmentation appeared to provide some degree of UV protection in skin physiology research.

Sexual function research revealed MT-2's potent pro-erectile and pro-arousal effects. The compound's strong MC4R agonism in hypothalamic and limbic brain regions produces sexual arousal and erection through central nervous mechanisms completely distinct from peripheral vascular agents. This research directly led to the development of PT-141 (Bremelanotide, now approved as Vyleesi) — the carboxy acid form of MT-2 — as a sexual dysfunction drug.

Metabolic and appetite research has shown MT-2 reduces food intake and body weight in rodent models through MC4R-mediated appetite suppression in the arcuate nucleus. Research continues into MT-2's effects on energy expenditure, brown adipose tissue thermogenesis, and its potential as a template for next-generation metabolic peptide drugs.`
  },

  "86": {
    id: "86",
    casNumber: "121062-08-6",
    formula: "C₅₀H₆₉N₁₅O₉",
    molecularWeight: "1024.2 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Protect from light.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 30 minutes",
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-NH₂",
    researchAreas: ["Melanogenesis Research", "Sexual Function Research", "Energy Metabolism Research"],
    alsoKnownAs: "MT-II, Melanotan-II",
    description: `Melanotan 2 (3mg × 10 Vials = 30mg total) provides ten individual 3mg vials of MT-2 for convenience in research protocols requiring smaller, individual doses. This multi-vial format minimizes freeze-thaw cycles after initial reconstitution. Each 3mg vial can be reconstituted independently for individual dosing experiments. For complete scientific information, see Melanotan 2 10mg.`,
    longDescription: `Melanotan 2 (3mg × 10 Vials) is the same compound as the 10mg single vial, presented in a multi-vial format for research convenience. The 10 × 3mg format provides flexibility for dosing studies where fresh reconstitution per dose is preferred. Please refer to the Melanotan 2 10mg product description for the complete overview of MT-2's cyclic structure, melanocortin receptor mechanism, and research findings in tanning, sexual function, and metabolic regulation.`
  },

  "94": {
    id: "94",
    casNumber: "1627580-64-6",
    formula: "C₁₀₄H₁₅₃N₂₇O₂₆S",
    molecularWeight: "2173.5 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C.",
    appearance: "White lyophilized powder",
    sequence: "MRWQEMGYIFYPRKLR",
    researchAreas: ["Metabolic Research", "Longevity Research", "Exercise Research", "Insulin Sensitivity Research", "AMPK Research"],
    alsoKnownAs: "Mitochondria-Derived Peptide, MDP",
    description: `MOTS-c 5mg is a mitochondria-encoded peptide that regulates metabolic homeostasis. It is one of only two known protein-coding sequences within mitochondrial rRNA genes and functions as a retrograde mitochondrial signal to the nucleus, coordinating metabolic adaptations. Research demonstrates MOTS-c improves insulin sensitivity, reduces fat accumulation, and enhances exercise capacity through AMPK activation.`,
    longDescription: `What is MOTS-c?

MOTS-c (Mitochondrial Open Reading Frame of the 12S rRNA Type-c) is a 16-amino acid peptide encoded within the 12S rRNA gene of human mitochondrial DNA. It was discovered by Chang et al. at USC in 2015 and represents a new class of mitochondria-derived peptides (MDPs) that function as systemic metabolic regulators. MOTS-c is secreted from mitochondria and cells in response to metabolic stress, acting both locally within cells (translocating to the nucleus to regulate gene expression) and systemically as a circulating hormonal signal.

MOTS-c Structure

MOTS-c is a 16-amino acid peptide (MRWQEMGYIFYPRKLR) with MW 2173.5 g/mol. Its sequence is notable for containing multiple tryptophan, phenylalanine, and basic (arginine, lysine) residues. The positively charged residues facilitate cellular uptake and nuclear entry. MOTS-c levels in plasma measurably decline with aging, consistent with it playing a role in maintaining metabolic health.

MOTS-c Research

The most significant mechanistic finding is that MOTS-c inhibits the folate cycle enzyme AICAR transformylase in the one-carbon metabolism pathway within cells. This inhibition leads to accumulation of ZMP (AICAR monophosphate), which activates AMPK — the key metabolic energy sensor enzyme. AMPK activation drives increased fatty acid oxidation, glucose uptake, and mitochondrial biogenesis while suppressing energy-consuming anabolic pathways.

Metabolic research in obese mice showed MOTS-c administration significantly reduces diet-induced weight gain, visceral fat accumulation, and insulin resistance. Exercise research demonstrated MOTS-c levels rise in response to physical activity in both rodents and humans, and that exogenous MOTS-c can partially substitute for exercise training effects in sedentary animals. Studies in aged mice showed MOTS-c partially restores the metabolic fitness that declines with aging, including skeletal muscle oxidative capacity and systemic insulin sensitivity.

Recent research has expanded to exploring MOTS-c's role in longevity. Studies in C. elegans and mice have shown that MOTS-c treatment extends lifespan and healthspan. The finding that human centenarians have specific genetic variants in the MOTS-c-encoding region of mitochondrial DNA suggests MOTS-c may be a longevity-associated factor in human populations.`
  },

  "118": {
    id: "118",
    casNumber: "189691-06-3",
    formula: "C₅₀H₆₈N₁₄O₁₀",
    molecularWeight: "1025.2 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    halfLife: "Approximately 2.7 hours",
    sequence: "Ac-Nle-cyclo[Asp-His-D-Phe-Arg-Trp-Lys]-OH",
    researchAreas: ["Sexual Function Research", "Melanocortin Research", "Neurological Research"],
    alsoKnownAs: "Bremelanotide, PL-6983",
    description: `PT-141 (3mg × 10 Vials = 30mg total) provides ten individual 3mg vials of Bremelanotide for research protocols requiring separate dose vials. This format minimizes repeated freeze-thaw cycles of the same reconstituted solution, which can degrade peptide integrity. Each vial provides a single 3mg dose for research purposes. For complete scientific content, refer to PT-141 10mg.`,
    longDescription: `PT-141 (3mg × 10 Vials) is the same compound as PT-141 10mg in a multi-vial format. Please refer to the PT-141 10mg product description for the complete scientific overview of Bremelanotide's cyclic melanocortin structure, its centrally acting MC3R/MC4R mechanism for sexual arousal, and research findings including FDA approval as Vyleesi for HSDD.`
  },

  "126": {
    id: "126",
    casNumber: "910463-68-2",
    formula: "C₁₈₇H₂₉₁N₄₅O₅₉",
    molecularWeight: "4113.58 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white powder",
    solubility: "Soluble in water (pH 7.4 buffer recommended)",
    halfLife: "Approximately 7 days (subcutaneous)",
    sequence: "His-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu-Gly-Gln-Ala-Ala-Lys(Nε-fatty acid linker)-Arg-Gly",
    researchAreas: ["Metabolic Research", "Obesity Research", "Cardiovascular Research", "Diabetes Research", "Neuroprotection"],
    alsoKnownAs: "Ozempic (brand, diabetes), Wegovy (brand, obesity), NNC 0113-0217",
    description: `Semaglutide 3mg is the entry-level research vial of the premier GLP-1 receptor agonist. Semaglutide is a 34-amino acid synthetic GLP-1 analogue with an Aib substitution at position 2 (DPP-IV protection), a C18 fatty diacid chain for albumin binding (extending half-life to ~7 days), and multiple other sequence modifications. It received FDA approval as Ozempic (diabetes), Wegovy (obesity), and Rybelsus (oral), establishing it as one of the most impactful drugs developed in recent decades.`,
    longDescription: `What is Semaglutide?

Semaglutide (NNC 0113-0217) is a 34-amino acid GLP-1 receptor agonist developed by Novo Nordisk through systematic optimization of the native GLP-1(7-36)amide sequence. The name reflects its similarity to GLP-1 (semaglutide = GLP-1 "similar" + "glutide" suffix for GLP-1 analogues). GLP-1 is a 30-amino acid incretin hormone secreted by intestinal L-cells in response to nutrients, exerting critical roles in insulin secretion stimulation, glucagon suppression, gastric emptying delay, and appetite reduction. Native GLP-1 has a half-life of only ~2 minutes due to DPP-IV degradation; semaglutide's modifications extend this to ~7 days.

Semaglutide Structure

Semaglutide's molecular formula is C₁₈₇H₂₉₁N₄₅O₅₉ with MW 4113.58 g/mol. Key structural features: (1) Aib (α-aminoisobutyric acid) substitution at position 2, which completely blocks DPP-IV cleavage at the Ala²-Glu³ bond; (2) Arg⁴ → Gly substitution; (3) Lys²⁶ modified with a fatty diacid linker (C18) attached through a hydrophilic octadienoyl-γGlu-2×OEG linker, enabling non-covalent albumin binding for 7-day half-life. These modifications resulted in a peptide that can be administered once weekly while maintaining full GLP-1 receptor agonist activity.

Semaglutide Research

The SUSTAIN clinical trial program (7 Phase 3 trials in type 2 diabetes) established semaglutide's superior HbA1c reduction versus all comparators including insulin glargine, exenatide, canagliflozin, sitagliptin, and placebo. SUSTAIN-6, a cardiovascular outcomes trial, demonstrated 26% reduction in major adverse cardiovascular events (MACE) in high-risk patients with T2DM — establishing cardiovascular protection and earning an FDA cardiovascular outcomes label.

The STEP obesity trial program demonstrated extraordinary weight loss. STEP-1 showed 14.9% mean body weight reduction at 68 weeks with semaglutide 2.4mg (the high-dose obesity formulation) — the highest weight loss demonstrated by any approved pharmacotherapy at the time. STEP-4 showed continued weight regain upon withdrawal, demonstrating the requirement for ongoing treatment.

Emerging research has expanded semaglutide's potential indications dramatically. SELECT trial demonstrated 20% reduction in MACE in obese patients without diabetes — a cardiovascular benefit independent of diabetes treatment, establishing obesity itself as a treatable cardiovascular risk factor. Research in Alzheimer's disease, Parkinson's disease, and non-alcoholic steatohepatitis is ongoing, with preliminary evidence suggesting neuroprotective and liver-protective effects potentially mediated through GLP-1 receptors in the brain and liver.`
  },

  "127": {
    id: "127",
    casNumber: "910463-68-2",
    formula: "C₁₈₇H₂₉₁N₄₅O₅₉",
    molecularWeight: "4113.58 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white powder",
    halfLife: "Approximately 7 days",
    researchAreas: ["Metabolic Research", "Obesity Research", "Cardiovascular Research", "Diabetes Research"],
    alsoKnownAs: "Ozempic (brand), Wegovy (brand), NNC 0113-0217",
    description: `Semaglutide 6mg provides a mid-range research quantity of the premier GLP-1 receptor agonist. This vial size supports studies requiring multiple doses or longer protocols. For full scientific content on semaglutide's mechanism, structure, and extensive clinical trial data, please refer to the Semaglutide 3mg product description.`,
    longDescription: `Semaglutide 6mg is the same compound as Semaglutide 3mg, provided in double the quantity. Please refer to the Semaglutide 3mg product description for the comprehensive overview covering semaglutide's GLP-1 receptor agonist mechanism, molecular structure with fatty acid albumin binding, SUSTAIN and STEP trial data, and emerging research in neuroprotection and cardiovascular protection.`
  },

  "128": {
    id: "128",
    casNumber: "910463-68-2",
    formula: "C₁₈₇H₂₉₁N₄₅O₅₉",
    molecularWeight: "4113.58 g/mol",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C. Reconstituted: 4°C, use within 28 days.",
    appearance: "White to off-white powder",
    halfLife: "Approximately 7 days",
    researchAreas: ["Metabolic Research", "Obesity Research", "Cardiovascular Research", "Diabetes Research", "Neuroprotection"],
    alsoKnownAs: "Ozempic (brand), Wegovy (brand), NNC 0113-0217",
    description: `Semaglutide 10mg provides the largest single-vial research quantity of this premier GLP-1 receptor agonist. This quantity supports extended research programs, multi-subject studies, or high-dose pharmacology investigations. The 10mg vial is particularly relevant for research exploring dose-response relationships or extended dosing regimens.`,
    longDescription: `Semaglutide 10mg is the same compound as Semaglutide 3mg and 6mg, provided in the largest available research quantity. Please refer to the Semaglutide 3mg product for the complete scientific overview.`
  },

  "134": {
    id: "134",
    casNumber: "86168-78-7",
    formula: "C₁₄₉H₂₄₆N₄₄O₄₂S",
    molecularWeight: "3357.93 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    halfLife: "11–12 minutes (intravenous)",
    sequence: "Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-NH₂",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Endocrine Research", "Pituitary Research"],
    alsoKnownAs: "GHRH(1-29)-NH₂, GRF(1-29), Geref, Gonadorelin analogue",
    description: `Sermorelin 2mg is a synthetic analogue of GHRH comprising the first 29 amino acids of the 44-amino acid GHRH molecule. It was the first GHRH analogue to achieve FDA approval (Geref, 1997) for diagnosis of GH deficiency in children. Research has established Sermorelin as a safe, effective tool for stimulating physiological, pulsatile GH release from the pituitary with a mechanism that preserves normal GH axis feedback regulation.`,
    longDescription: `What is Sermorelin?

Sermorelin (GHRH(1-29)-NH₂) is a synthetic polypeptide representing the first 29 amino acids of the naturally occurring 44-amino acid GHRH. Research demonstrated that the first 29 amino acids contain the complete receptor-binding domain of GHRH — residues 30-44 are dispensable for biological activity. Sermorelin was developed by Geref (Serono Laboratories) and received FDA approval in 1997 for the diagnosis of GH deficiency in children and for treatment of idiopathic GH deficiency. While Geref was voluntarily withdrawn from the US market in 2008, Sermorelin remains widely used in research.

Sermorelin Structure

Sermorelin (GHRH(1-29)-NH₂) has MW 3357.93 g/mol. Its C-terminal amidation (NH₂) is essential for receptor binding. The compound has a very short plasma half-life of approximately 11-12 minutes due to DPP-IV cleavage at the Tyr-Ala bond (positions 1-2) and aminopeptidase activity. This short half-life is the primary reason modified analogues (CJC-1295 No DAC, Tesamorelin) were developed, though the short half-life also means Sermorelin produces physiologically pulsatile GH stimulation rather than sustained elevation.

Sermorelin Research

Clinical research established Sermorelin's utility as both a diagnostic and therapeutic agent for GH deficiency. Diagnostic studies used Sermorelin stimulation tests to assess pituitary somatotroph reserve — a reduced GH response to Sermorelin stimulation indicates pituitary-level GH deficiency. Therapeutic studies in GH-deficient children showed that daily Sermorelin injections could increase growth velocity, though less consistently than direct GH therapy.

Anti-aging and adult research has explored Sermorelin's ability to restore age-related decline in GH/IGF-1 levels. Unlike exogenous GH administration, Sermorelin works by stimulating the pituitary's own GH production — preserving normal feedback regulation and pulsatile secretion patterns. Research suggests this physiological approach may provide metabolic and body composition benefits (lean mass increase, fat mass decrease, bone density improvement) while maintaining the safety advantages of working within the body's normal regulatory framework. Studies in elderly subjects have shown Sermorelin normalizes GH/IGF-1 to levels comparable to younger adults.`
  },

  "135": {
    id: "135",
    casNumber: "86168-78-7",
    formula: "C₁₄₉H₂₄₆N₄₄O₄₂S",
    molecularWeight: "3357.93 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Endocrine Research"],
    alsoKnownAs: "GHRH(1-29)-NH₂, GRF(1-29)",
    description: `Sermorelin 5mg provides a mid-range research quantity of the GHRH(1-29) analogue. This vial size supports multi-dose research protocols and studies requiring longer treatment periods. For complete scientific content, please refer to the Sermorelin 2mg product description.`,
    longDescription: `Sermorelin 5mg is the same compound as Sermorelin 2mg. Please refer to the Sermorelin 2mg product for the comprehensive overview, structural details, and research summary.`
  },

  "136": {
    id: "136",
    casNumber: "86168-78-7",
    formula: "C₁₄₉H₂₄₆N₄₄O₄₂S",
    molecularWeight: "3357.93 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research"],
    alsoKnownAs: "GHRH(1-29)-NH₂, GRF(1-29)",
    description: `Sermorelin 15mg is the largest single-vial research quantity of the GHRH(1-29) analogue, suitable for extended multi-dose protocols or multi-subject studies. For complete scientific content, please refer to the Sermorelin 2mg product description.`,
    longDescription: `Sermorelin 15mg is the same compound as Sermorelin 2mg. Please refer to the Sermorelin 2mg product for the comprehensive overview.`
  },

  "148": {
    id: "148",
    casNumber: "218949-48-5 / 170851-70-4",
    formula: "Tesamorelin + Ipamorelin blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 21 days.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Body Composition Research", "Anti-Aging Research", "Metabolic Research", "Adipose Research"],
    alsoKnownAs: "Tesamorelin/Ipamorelin Blend",
    description: `Tesamorelin/Ipamorelin 8mg Blend combines two complementary GH secretagogues — Tesamorelin (GHRH analogue) and Ipamorelin (GHRP/ghrelin mimetic) — in a single vial. This combination provides synergistic GH release through dual receptor pathway activation: Tesamorelin stimulates GHRHR on pituitary somatotrophs while Ipamorelin stimulates GHS-R1a, producing additive GH pulses greater than either compound alone.`,
    longDescription: `What is the Tesamorelin/Ipamorelin Blend?

This blend combines Tesamorelin — the FDA-approved full-length GHRH analogue with trans-3-hexenoic acid N-terminal modification — and Ipamorelin — the most selective GHRP pentapeptide — to maximize GH release through complementary receptor mechanisms. The rationale mirrors that of GHRH+GHRP combination research: GHRH pathway activation (through GHRHR) synergizes with ghrelin pathway activation (through GHS-R1a) to produce substantially greater GH release than either alone.

Tesamorelin's Role

Tesamorelin is specifically chosen because it is the most clinically validated GHRH analogue, with FDA approval for HIV-associated lipodystrophy. Its full 44-amino acid GHRH sequence provides complete receptor engagement, while the N-terminal trans-3-hexenoic acid modification protects from DPP-IV inactivation. Research has shown Tesamorelin produces physiologically pulsatile GH stimulation and specifically promotes visceral fat reduction.

Ipamorelin's Role

Ipamorelin adds selective GHS-R1a stimulation without the confounding cortisol, ACTH, or prolactin elevations seen with GHRP-2 or GHRP-6. This selectivity ensures the combination's effects on GH can be cleanly attributed to GH secretagogue mechanisms rather than secondary hormonal changes. The combination produces synergistic GH release particularly for visceral fat reduction and body composition improvement research.`
  },

  "149": {
    id: "149",
    casNumber: "218949-48-5",
    formula: "C₂₂₁H₃₆₆N₆₄O₆₆S₁",
    molecularWeight: "5135.9 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 21 days.",
    appearance: "White lyophilized powder",
    halfLife: "26–38 minutes (intravenous)",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Adipose Tissue Research"],
    alsoKnownAs: "Egrifta (brand), TH9507",
    description: `Tesamorelin 2mg (10 Vial Kit) provides ten individual 2mg vials of Tesamorelin for research protocols benefiting from separate pre-weighed vials. This format is convenient for studies administering single 2mg doses of Tesamorelin across multiple time points or subjects. For full scientific content, refer to Tesamorelin 5mg.`,
    longDescription: `Tesamorelin 2mg × 10 Vials contains the same compound as Tesamorelin 5mg, presented as ten smaller vials. Please refer to the Tesamorelin 5mg product description for the comprehensive overview of Tesamorelin as a full-length GHRH analogue with trans-3-hexenoic acid N-terminal modification, its FDA-approved application for HIV lipodystrophy, and its research findings in GH stimulation and visceral fat reduction.`
  },

  "150": {
    id: "150",
    casNumber: "218949-48-5",
    formula: "C₂₂₁H₃₆₆N₆₄O₆₆S₁",
    molecularWeight: "5135.9 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C, use within 21 days.",
    appearance: "White lyophilized powder",
    halfLife: "26–38 minutes (intravenous)",
    sequence: "Trans-3-hexenoic acid-Tyr-Ala-Asp-Ala-Ile-Phe-Thr-Asn-Ser-Tyr-Arg-Lys-Val-Leu-Gly-Gln-Leu-Ser-Ala-Arg-Lys-Leu-Leu-Gln-Asp-Ile-Met-Ser-Arg-Gln-Gln-Gly-Glu-Ser-Asn-Gln-Glu-Arg-Gly-Ala-Arg-Ala-Arg-Leu-NH₂",
    researchAreas: ["Growth Hormone Research", "Metabolic Research", "Adipose Tissue Research", "HIV Research"],
    alsoKnownAs: "Egrifta (brand), TH9507",
    description: `Tesamorelin 5mg is the standard single vial of the full-length FDA-approved GHRH analogue. Tesamorelin is unique among GHRH analogues in using the complete 44-amino acid GHRH sequence (rather than the truncated 29-amino acid Sermorelin), protected by a trans-3-hexenoic acid N-terminal modification against DPP-IV cleavage. FDA approval for HIV-associated lipodystrophy provides extensive clinical validation data.`,
    longDescription: `What is Tesamorelin?

Tesamorelin (TH9507, Egrifta) is a GHRH analogue developed by Theratechnologies Inc. that uniquely employs the complete 44-amino acid GHRH sequence rather than the truncated 29-amino acid version used in Sermorelin and CJC-1295. The N-terminal modification with trans-3-hexenoic acid conjugated to Tyr-1 specifically blocks DPP-IV cleavage at the critical Tyr-Ala bond while preserving GHRHR binding. FDA approval (2010) for HIV-associated lipodystrophy provides a rigorous clinical validation dataset.

Tesamorelin Structure

MW 5135.9 g/mol. The full 44-amino acid GHRH sequence provides maximal engagement of the GHRH receptor binding interface. While Sermorelin's 29-amino acid sequence captures the receptor binding domain, residues 30-44 of GHRH appear to contribute to receptor activation efficiency and potentially to signaling characteristics. The trans-3-hexenoic acid modification is unique to Tesamorelin among approved GHRH analogues.

Tesamorelin Research

Phase 3 clinical trials for HIV-associated lipodystrophy demonstrated 15-20% reductions in visceral adipose tissue (VAT) measured by CT scan over 26 weeks, with improvements in lipid parameters (reduced triglycerides, improved HDL). These results led to FDA approval under Egrifta. The VAT reduction is clinically significant because HIV-associated visceral fat accumulation is associated with increased cardiovascular risk.

Studies specifically examining the dose-response relationship for Tesamorelin and the duration of fat reduction effects have clarified that continued treatment is required to maintain benefits — fat returns toward baseline upon discontinuation. Research has examined combination approaches with other metabolic agents to determine whether Tesamorelin's visceral fat reduction effects can be sustained or enhanced. Studies in non-HIV obese populations have also shown similar visceral fat reduction benefits, suggesting the mechanism (GH stimulation driving lipolysis in visceral adipose tissue) is generalizable.`
  },

  "155": {
    id: "155",
    casNumber: "62304-98-7",
    formula: "C₁₃₂H₂₁₄N₃₄O₅₈",
    molecularWeight: "3108.3 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 14 days.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in water",
    sequence: "Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn",
    researchAreas: ["Immune System Research", "Antiviral Research", "Cancer Research", "Anti-Aging Research", "Autoimmune Research"],
    alsoKnownAs: "Tα1, Thymalfasin, Zadaxin",
    description: `Thymosin Alpha-1 3mg is the standard research vial of the naturally occurring 28-amino acid immunomodulatory thymic peptide. Thymalfasin (Zadaxin) is approved or registered in over 37 countries for hepatitis B, hepatitis C, and as a vaccine adjuvant. Research has established it as a broad immunostimulatory agent that enhances both innate and adaptive immune responses through thymic peptide mechanisms.`,
    longDescription: `What is Thymosin Alpha-1?

Thymosin Alpha-1 (Tα1) is a 28-amino acid acetylated peptide originally isolated from bovine thymic tissue by Allan Goldstein's group at the NCI. It has been identified as the biologically most potent component of Thymosin Fraction 5 — a complex thymic extract initially studied for immune-restorative properties. Tα1 is now produced as a pure synthetic peptide (Thymalfasin) and is used clinically as Zadaxin in multiple countries for viral hepatitis and immune modulation.

Thymosin Alpha-1 Structure and Mechanism

Tα1 is N-terminally acetylated, with sequence Ac-Ser-Asp-Ala-Ala-Val-Asp-Thr-Ser-Ser-Glu-Ile-Thr-Thr-Lys-Asp-Leu-Lys-Glu-Lys-Lys-Glu-Val-Val-Glu-Glu-Ala-Glu-Asn. MW 3108.3 g/mol. The N-acetylation is essential for biological activity. Tα1 acts through multiple mechanisms: it promotes dendritic cell maturation and function (critical for initiating adaptive immune responses), stimulates Th1 lymphocyte differentiation, enhances natural killer cell cytotoxicity, and increases surface expression of MHC class I and II molecules on immune and target cells — improving immune surveillance.

Clinical and Research Findings

For hepatitis B: studies in China and international trials showed Tα1 significantly improved HBeAg seroconversion rates (a marker of anti-viral immune control). For hepatitis C: combination with interferon improved sustained virological response rates compared to interferon alone. In immunocompromised patients (transplant recipients, HIV patients, elderly), Tα1 has demonstrated restoration of immune function toward more normal levels.

Cancer immunotherapy research has explored Tα1 as an adjuvant to chemotherapy, improving post-treatment immune recovery. Research during the COVID-19 pandemic reported that Tα1 improved clinical outcomes in severe COVID-19 patients in Chinese hospitals — attributed to its known ability to modulate the inflammatory response while enhancing anti-viral immunity. Anti-aging research has documented restoration of age-related immune decline (immunosenescence) with Tα1, including improved T-cell repertoire diversity and thymic function markers.`
  },

  /* ─────────────────────────────────────────────────────────────────────────
     BPC-157 FAMILY
  ───────────────────────────────────────────────────────────────────────── */

  "10": {
    id: "10",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    molecularWeight: "1419.56 g/mol",
    purity: "99% HPLC",
    storage: "Lyophilized: -20°C. Reconstituted: 4°C for up to 4 weeks. Avoid repeated freeze-thaw cycles.",
    appearance: "White lyophilized powder",
    solubility: "Soluble in sterile water (1 mg/mL)",
    halfLife: "Approximately 4 hours (in vivo)",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    researchAreas: ["Gastrointestinal Research", "Musculoskeletal Research", "Wound Healing", "Neuroprotection", "Anti-Inflammatory Research"],
    alsoKnownAs: "Body Protection Compound-157, PL-10, PLD-116, Bepecin, Stable Gastric Pentadecapeptide BPC-157",
    description: `BPC-157 5mg is the entry-level research vial of Body Protection Compound 157, the most studied gastric protective pentadecapeptide. BPC-157 is a 15-amino acid synthetic peptide derived from a sequence in human gastric juice (BPC — Body Protection Compound). Research across hundreds of published animal studies has documented its extraordinary healing properties in tendons, ligaments, muscles, bones, nerves, the gut, and the heart — making it one of the most versatile research peptides available.`,
    longDescription: `What is BPC-157?

BPC-157 (Body Protection Compound 157, PL-10) is a pentadecapeptide (15 amino acids) discovered through systematic research into the cytoprotective properties of human gastric juice. The sequence Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val was identified as the most biologically active fragment in gastric juice and named BPC-157 based on its discovery order. Dr. Predrag Sikiric and colleagues at the University of Zagreb have been the primary researchers publishing on BPC-157 for over three decades, with over 200 published papers spanning multiple organ systems and pathological conditions.

BPC-157 Structure

BPC-157 is a proline-rich peptide with three consecutive proline residues (Pro-Pro-Pro at positions 3-4-5), an unusual structural feature that confers rigidity and resistance to enzymatic digestion. This structural stability is a key property — BPC-157 is remarkably stable in human gastric juice, bile, and tissue homogenates, which is consistent with its biological origin in gastric protective fluid. The molecular formula is C₆₂H₉₈N₁₆O₂₂ with MW 1419.56 g/mol.

BPC-157 Research

Gastrointestinal research has established BPC-157's potent effects on gut healing. Studies in models of gastric ulcers, duodenal ulcers, inflammatory bowel disease, intestinal fistulas, and short bowel syndrome have consistently shown BPC-157 accelerates healing, reduces inflammation, and restores mucosal integrity. The compound appears to work through multiple mechanisms including upregulation of VEGF expression (promoting angiogenesis), modulation of the NO-system, and influence on the endocannabinoid and CXCR4 signaling systems.

Musculoskeletal research has documented BPC-157's ability to accelerate tendon healing — perhaps its most extensively studied property. Studies in rats with surgically transected Achilles tendons showed dramatically faster regeneration with BPC-157 treatment, with treated animals restoring functional tendon strength weeks ahead of controls. Similar benefits have been documented for ligament healing (medial collateral ligament transection models), muscle healing, and bone fracture repair. The proposed mechanism involves upregulation of growth hormone receptor expression in healing tissue, amplifying local GH signaling.

Neurological research has shown BPC-157 protects against neurotoxicity, promotes peripheral nerve regeneration, and exerts effects on the dopaminergic and serotonergic systems that are relevant to psychiatric research. BPC-157 has been found to reverse dyskinesias (abnormal movements) induced by neuroleptics in animal models — findings relevant to Parkinson's disease and antipsychotic-induced movement disorder research. Cardiac research has shown BPC-157 protects the heart from ischemia-reperfusion injury and may promote healing following myocardial infarction. The breadth of BPC-157's effects across multiple organ systems is a defining characteristic that continues to motivate research into its underlying mechanisms.`
  },

  "11": {
    id: "11",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    molecularWeight: "1419.56 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 4 weeks.",
    appearance: "White lyophilized powder",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    researchAreas: ["Gastrointestinal Research", "Musculoskeletal Research", "Wound Healing"],
    alsoKnownAs: "Body Protection Compound-157, PL-10",
    description: `BPC-157 10mg provides double the research quantity of Body Protection Compound 157 for extended protocols. This vial size is suited for multi-dose animal studies or research protocols requiring longer treatment periods. For complete scientific content on BPC-157's structure and research findings, see the BPC-157 5mg product description.`,
    longDescription: `BPC-157 10mg is the same compound as BPC-157 5mg, provided in a larger quantity. Please refer to BPC-157 5mg for the comprehensive overview of its 15-amino acid structure, proline-rich sequence from gastric juice, and extensive research findings in gastrointestinal healing, tendon repair, musculoskeletal regeneration, neuroprotection, and cardiac protection.`
  },

  "12": {
    id: "12",
    casNumber: "137525-51-0",
    formula: "C₆₂H₉₈N₁₆O₂₂",
    molecularWeight: "1419.56 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 4 weeks.",
    appearance: "White lyophilized powder",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    researchAreas: ["Gastrointestinal Research", "Musculoskeletal Research", "Wound Healing", "Neuroprotection"],
    alsoKnownAs: "Body Protection Compound-157, PL-10",
    description: `BPC-157 15mg is the largest single-vial research quantity of Body Protection Compound 157, suitable for comprehensive multi-dose research programs or head-to-head dose-comparison studies. For complete scientific content, see the BPC-157 5mg product description.`,
    longDescription: `BPC-157 15mg is the same compound as BPC-157 5mg in the largest available research quantity. Please refer to BPC-157 5mg for the full scientific overview.`
  },

  "13": {
    id: "13",
    casNumber: "137525-51-0 / 77591-33-4",
    formula: "BPC-157 + TB-500 blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 3 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Musculoskeletal Research", "Wound Healing", "Tissue Regeneration", "Gastrointestinal Research", "Anti-Inflammatory Research"],
    alsoKnownAs: "BPC-157 + Thymosin Beta-4 Blend",
    description: `BPC-157/TB-500 10mg Blend combines Body Protection Compound 157 and Thymosin Beta-4 in a single vial for research investigating the synergistic tissue repair potential of these two complementary peptides. BPC-157 provides gastrointestinal, tendon, and musculoskeletal healing properties, while TB-500 provides actin-dependent cell migration promotion and cardiac/systemic tissue repair signaling.`,
    longDescription: `What is the BPC-157/TB-500 Blend?

The combination of BPC-157 and TB-500 (Thymosin Beta-4) represents one of the most popular peptide blend formulations in tissue repair research. The rationale for combining these specific peptides is based on their complementary mechanisms and broad tissue repair activity profiles: BPC-157 primarily acts through nitric oxide synthesis modulation, VEGF upregulation, and GH receptor sensitization, while TB-500 acts through actin-cytoskeleton regulation, cell migration promotion, and epicardial progenitor cell activation. Together, they may provide more comprehensive tissue repair coverage than either compound alone.

BPC-157 Component Research

BPC-157 has demonstrated efficacy across virtually every tissue type studied: gastrointestinal mucosa, tendons, ligaments, muscles, bone, peripheral nerves, and heart. The key mechanisms identified include: (1) promoting angiogenesis through VEGF upregulation; (2) enhancing growth hormone receptor expression in healing tissue; (3) modulating the nitric oxide system to regulate inflammatory responses; and (4) influencing neurotransmitter systems relevant to neurological protection.

TB-500 (Thymosin Beta-4) Component Research

TB-500's repair mechanisms complement BPC-157's. TB-500 promotes cell migration essential for wound closure and tissue regeneration, stimulates epicardial progenitor cells for cardiac repair, promotes blood vessel formation through separate VEGF-independent pathways, and reduces inflammation through actin-cytoskeleton-dependent anti-inflammatory mechanisms. Research in cardiac injury models specifically shows TB-500 can promote new cardiomyocyte formation — an effect not documented for BPC-157 alone.

Synergy Research

While direct combination studies of BPC-157 and TB-500 in animal models are limited in published literature, the compounds are theorized to complement each other through non-overlapping mechanisms: BPC-157's nitric oxide/VEGF pathway activation combined with TB-500's actin-cytoskeleton-mediated cell migration promotion may produce faster and more complete tissue healing than either compound achieves independently.`
  },

  "14": {
    id: "14",
    casNumber: "137525-51-0 / 77591-33-4",
    formula: "BPC-157 + TB-500 blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 3 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Musculoskeletal Research", "Wound Healing", "Tissue Regeneration", "Anti-Inflammatory Research"],
    alsoKnownAs: "BPC-157 + Thymosin Beta-4 Blend",
    description: `BPC-157/TB-500 20mg Blend provides double the research quantity of the synergistic BPC-157 and Thymosin Beta-4 combination. This vial size supports extended research programs requiring multiple doses. For complete scientific content on the blend rationale and individual compound research, see the BPC-157/TB-500 10mg Blend product.`,
    longDescription: `BPC-157/TB-500 20mg is the same compound blend as BPC-157/TB-500 10mg in a larger quantity. Please refer to the 10mg Blend product for the comprehensive scientific overview.`
  },

  "15": {
    id: "15",
    casNumber: "137525-51-0 / 77591-33-4 / 89030-95-5",
    formula: "BPC-157 + TB-500 + GHK-Cu blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 3 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Tissue Regeneration", "Anti-Aging Research", "Wound Healing", "Cosmetic Research", "Collagen Research"],
    alsoKnownAs: "Glow Blend 30mg, BPC-157/TB-500/GHK-Cu Triple Blend",
    description: `BPC-157/TB-500/GHK-Cu 30mg Glow Blend is a premium tri-peptide combination adding GHK-Cu (Copper Peptide) to the proven BPC-157/TB-500 platform. GHK-Cu contributes potent collagen synthesis stimulation, gene expression modulation, and antioxidant effects that complement the tissue repair and regeneration properties of BPC-157 and TB-500 — making this a comprehensive anti-aging and tissue repair research blend.`,
    longDescription: `What is the BPC-157/TB-500/GHK-Cu Glow Blend?

The Glow Blend adds GHK-Cu to the established BPC-157/TB-500 tissue repair platform, creating a three-component formula that addresses tissue repair (BPC-157, TB-500) and tissue renewal/anti-aging (GHK-Cu) simultaneously. The three compounds are chosen for complementary, non-overlapping mechanisms that together provide comprehensive tissue optimization for research purposes.

GHK-Cu Addition

GHK-Cu (Glycyl-L-Histidyl-L-Lysine Copper complex) uniquely contributes: (1) potent collagen and elastin synthesis stimulation in fibroblasts; (2) broad gene expression modulation — studies show GHK-Cu alters expression of over 4,000 human genes involved in tissue remodeling, inflammation, and repair; (3) antioxidant effects through catalase and superoxide dismutase upregulation; and (4) activation of hair follicle stem cells.

The "Glow" designation refers to the combination's comprehensive effects on skin biology and appearance: BPC-157's angiogenesis promotion improves skin blood supply, TB-500's cell migration enhancement accelerates skin repair, and GHK-Cu's collagen synthesis stimulation and gene expression modulation improve skin structure, reduce inflammatory signals, and potentially reverse aspects of skin aging at the cellular level.`
  },

  "16": {
    id: "16",
    casNumber: "137525-51-0 / 77591-33-4 / 89030-95-5",
    formula: "BPC-157 + TB-500 + GHK-Cu blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C for up to 3 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Tissue Regeneration", "Anti-Aging Research", "Wound Healing", "Cosmetic Research"],
    alsoKnownAs: "Glow Blend 60mg, BPC-157/TB-500/GHK-Cu Triple Blend",
    description: `BPC-157/TB-500/GHK-Cu 60mg Glow Blend is the double-strength version of the tri-peptide Glow Blend for extended research programs. This quantity provides sufficient compound for comprehensive longitudinal studies examining the combined effects of three complementary tissue repair and anti-aging peptides.`,
    longDescription: `BPC-157/TB-500/GHK-Cu 60mg is the same blend as the 30mg Glow Blend in a larger quantity. Please refer to the 30mg Glow Blend product for the complete scientific overview.`
  },

  /* ─────────────────────────────────────────────────────────────────────────
     BIOREGULATORS (Khavinson Peptides)
  ───────────────────────────────────────────────────────────────────────── */

  "18": {
    id: "18",
    casNumber: "Not publicly disclosed",
    formula: "Tetrapeptide",
    molecularWeight: "Approximately 450–550 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Bronchial Research", "Respiratory Research", "Lung Health", "Bioregulator Research"],
    alsoKnownAs: "Bronchial Bioregulator Peptide, Khavinson Bioregulator",
    description: `Bronchogen 20mg is a bioregulator tetrapeptide developed by Professor Vladimir Khavinson's group at the Institute of Bioregulation and Gerontology, St. Petersburg. Bioregulators are short peptides (2-4 amino acids) derived from specific organs or tissues that are proposed to regulate gene expression in those specific tissues, normalizing biological functions that decline with age.`,
    longDescription: `What are Bioregulators?

Bronchogen belongs to a family of short peptide bioregulators developed through research spanning several decades at the Institute of Bioregulation and Gerontology in St. Petersburg, Russia. Bioregulators (or cytomedines in the Russian terminology) are short peptides (typically 2-4 amino acids) isolated from specific organs or tissues. The theory underlying bioregulator research, developed by Professors Khavinson and Morozov, proposes that these short peptides can penetrate cells, bind to specific DNA sequences, and regulate gene expression in tissue-specific ways — normalizing functions that become dysregulated with aging.

Bronchogen Specifically

Bronchogen is the lung/bronchial bioregulator peptide. It is reportedly derived from or modeled after peptide sequences found in lung/bronchial tissue. Research by Khavinson's group and Russian medical institutions has investigated Bronchogen for its effects on lung tissue biology, bronchial epithelial function, and lung health outcomes. Studies have proposed that Bronchogen can help normalize age-related decline in bronchial mucosal function and potentially reduce susceptibility to respiratory infections.

Bioregulator Research Framework

The bioregulator research program has produced a series of peptide bioregulators, each targeting a specific tissue:
• Bronchogen (lung/bronchial) — this product
• Cardiogen (cardiac) • Cortagen (brain cortex) • Chonluten (lung)
• Epithalon (pineal/anti-aging) • Livagen (liver/immune)
• Pancragen (pancreas) • Pinealon (brain/pineal)
• Vesugen (vascular) • Vilon (immune)

Long-term human studies conducted by Khavinson's group on combined bioregulator programs have reported improvements in various health indicators in elderly subjects, though these studies lack the rigor of modern randomized controlled trials. The bioregulator framework represents an ongoing area of European research into short peptide regulation of aging.`
  },

  "20": {
    id: "20",
    casNumber: "Not publicly disclosed",
    formula: "Tetrapeptide",
    molecularWeight: "Approximately 450–550 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Cardiac Research", "Cardiovascular Research", "Bioregulator Research", "Heart Health"],
    alsoKnownAs: "Cardiac Bioregulator Peptide, Khavinson Cardiac Peptide",
    description: `Cardiogen 20mg is the cardiac bioregulator tetrapeptide developed as part of Professor Khavinson's bioregulator research program. It is proposed to specifically regulate gene expression in cardiac tissue, with research investigating its potential effects on heart function, cardiac cell biology, and age-related cardiac decline.`,
    longDescription: `Cardiogen is the cardiac-specific bioregulator in Khavinson's bioregulator peptide series. Like all bioregulators in this series, it is a short tetrapeptide proposed to penetrate cell membranes and interact with DNA to regulate tissue-specific gene expression. Research from the St. Petersburg Institute of Bioregulation has investigated Cardiogen's effects on cardiac cell cultures and animal models, with proposed benefits for cardiomyocyte function and heart aging. For a more complete overview of the bioregulator research framework, please refer to the Bronchogen 20mg product description.`
  },

  "21": {
    id: "21",
    casNumber: "Not publicly disclosed",
    formula: "Tripeptide",
    molecularWeight: "Approximately 380–420 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Cartilage Research", "Joint Health Research", "Bioregulator Research", "Musculoskeletal Research"],
    alsoKnownAs: "Cartilage Bioregulator Peptide, Khavinson Joint Peptide",
    description: `Cartalax 20mg is a bioregulator peptide targeting cartilage and connective tissue as part of the Khavinson bioregulator series. Research has investigated its potential effects on cartilage cell biology and age-related joint tissue decline. Like all bioregulators in this series, it is proposed to act through tissue-specific gene expression modulation.`,
    longDescription: `Cartalax is the cartilage/connective tissue bioregulator in Khavinson's research series. For a complete overview of the bioregulator research framework, mechanisms, and supporting research, please refer to the Bronchogen 20mg product description. Cartalax specifically targets cartilage tissue biology, with research from Russian institutions exploring its effects on chondrocyte function and joint health parameters.`
  },

  "28": {
    id: "28",
    casNumber: "Not publicly disclosed",
    formula: "Tripeptide",
    molecularWeight: "Approximately 380–420 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Lung Research", "Respiratory Research", "Mucosal Research", "Bioregulator Research"],
    alsoKnownAs: "Lung Bioregulator, Khavinson Lung Peptide",
    description: `Chonluten 20mg is the lung mucosal bioregulator peptide in the Khavinson bioregulator series, targeting bronchial/lung epithelial tissue biology. Research has investigated its effects on mucosal cell function and respiratory tissue health as part of the comprehensive bioregulator research program.`,
    longDescription: `Chonluten is the lung/mucosa bioregulator in Khavinson's series. For a complete overview of bioregulator research, see the Bronchogen 20mg product description.`
  },

  "29": {
    id: "29",
    casNumber: "Not publicly disclosed",
    formula: "Tetrapeptide",
    molecularWeight: "Approximately 450–550 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Brain Research", "Cortex Research", "Neuroprotection", "Cognitive Research", "Bioregulator Research"],
    alsoKnownAs: "Brain Cortex Bioregulator, Khavinson Cortical Peptide",
    description: `Cortagen 20mg is the cerebral cortex bioregulator peptide targeting brain cortical cell biology. It is proposed to regulate gene expression in cortical neurons and glial cells, with research investigating potential effects on cognitive function and neuroprotection in aging models.`,
    longDescription: `Cortagen is the cerebral cortex bioregulator in Khavinson's bioregulator series. It targets brain cortex tissue biology with proposed gene regulatory effects on cortical neurons. For the complete bioregulator research framework, see Bronchogen 20mg. Research from St. Petersburg has explored Cortagen's effects on cortical cell cultures and cognitive parameters in aging animal models.`
  },

  "80": {
    id: "80",
    casNumber: "Not publicly disclosed",
    formula: "Tetrapeptide",
    molecularWeight: "Approximately 450–550 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Liver Research", "Immune Research", "Bioregulator Research", "Digestive Health"],
    alsoKnownAs: "Liver Bioregulator, Hepatic Bioregulator Peptide",
    description: `Livagen 20mg is the liver and immune system bioregulator in Khavinson's peptide series. Research has investigated its effects on liver cell biology and immune function, with proposed applications in liver health maintenance and immune system regulation in aging subjects.`,
    longDescription: `Livagen is the liver/immune bioregulator in Khavinson's series. For a complete overview of the bioregulator research framework, see Bronchogen 20mg.`
  },

  "96": {
    id: "96",
    casNumber: "1400634-39-0",
    formula: "C₁₆H₂₄N₄O₁₀",
    molecularWeight: "420.38 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Ac-Ala-Glu-Asp-Gly-NH₂",
    researchAreas: ["Anti-Aging Research", "Telomere Research", "Longevity Research", "Immune Research"],
    alsoKnownAs: "N-Acetyl Epitalon Amidate, Epithalon modified, Enhanced Epitalon",
    description: `N-Acetyl Epithalon Amidate 20mg is a chemically enhanced version of Epithalon (Ala-Glu-Asp-Gly) with N-terminal acetylation and C-terminal amidation. These modifications significantly increase metabolic stability by blocking exopeptidase degradation, potentially extending the biological half-life of the compound compared to unmodified Epithalon.`,
    longDescription: `What is N-Acetyl Epithalon Amidate?

N-Acetyl Epithalon Amidate is a modified form of the tetrapeptide Epithalon (Ala-Glu-Asp-Gly) with N-terminal acetylation and C-terminal amidation. These terminal protecting groups prevent cleavage by aminopeptidases and carboxypeptidases respectively, resulting in substantially greater stability in biological fluids. MW approximately 420.38 g/mol with sequence Ac-Ala-Glu-Asp-Gly-NH₂.

Modified vs. Standard Epithalon

The amidate modification is hypothesized to allow longer-lasting exposure of target cells to the active tetrapeptide, potentially producing more sustained telomerase activation and anti-aging gene expression effects compared to unmodified Epithalon. Studies directly comparing modified and unmodified Epithalon activity are limited in published literature, but the pharmaceutical principle that terminal protection extends peptide half-life is well established and applied broadly in peptide drug development.

Research Context

All of Epithalon's documented research effects — telomerase activation, telomere elongation, lifespan extension in mice, and immunomodulation — apply conceptually to the amidate modified form. The modification is designed to preserve these effects while extending duration of action. For the full overview of Epithalon's research findings, see the Epithalon 20mg and Epitalon Capsules product descriptions.`
  },

  "106": {
    id: "106",
    casNumber: "Not publicly disclosed",
    formula: "Tetrapeptide",
    molecularWeight: "Approximately 450–550 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Liver Research", "Bioregulator Research", "Reproductive Research"],
    alsoKnownAs: "Liver Bioregulator, Hepatic/Reproductive Peptide",
    description: `Ovagen 20mg is a bioregulator peptide targeting liver tissue with potential secondary effects on reproductive health. It is part of Khavinson's bioregulator research series, with studies investigating its effects on liver cell biology and related physiological parameters.`,
    longDescription: `Ovagen is a liver/reproductive bioregulator in Khavinson's series. For a complete overview of the bioregulator research framework, see Bronchogen 20mg.`
  },

  "111": {
    id: "111",
    casNumber: "Not publicly disclosed",
    formula: "Tetrapeptide",
    molecularWeight: "Approximately 450–550 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Pancreatic Research", "Metabolic Research", "Bioregulator Research", "Endocrine Research"],
    alsoKnownAs: "Pancreatic Bioregulator Peptide, Khavinson Pancreas Peptide",
    description: `Pancragen 20mg is the pancreatic bioregulator in Khavinson's research series, targeting pancreatic tissue biology. Research has investigated its effects on pancreatic cell function, insulin secretion, and pancreatic health maintenance as part of the comprehensive bioregulator research program.`,
    longDescription: `Pancragen is the pancreatic bioregulator in Khavinson's series. For a complete overview, see Bronchogen 20mg.`
  },

  "115": {
    id: "115",
    casNumber: "Not publicly disclosed",
    formula: "Tripeptide",
    molecularWeight: "Approximately 380–420 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Glu-Asp-Arg (proposed sequence)",
    researchAreas: ["Brain Research", "Pineal Research", "Sleep Research", "Anti-Aging Research", "Bioregulator Research"],
    alsoKnownAs: "Pineal Bioregulator, Brain Bioregulator",
    description: `Pinealon 20mg is the brain/pineal bioregulator in Khavinson's research series. The pineal gland is the source of melatonin and is considered a master regulator of circadian rhythms and aging. Pinealon is proposed to regulate gene expression in pineal gland and brain cells, with research investigating effects on melatonin secretion, circadian rhythm normalization, and brain aging.`,
    longDescription: `Pinealon is the pineal/brain bioregulator in Khavinson's series, targeting cells of the pineal gland and broader brain tissue. The proposed active tripeptide (Glu-Asp-Arg) is hypothesized to promote melatonin synthesis and secretion, normalize circadian rhythms disrupted in aging, and support neuronal health through gene expression modulation. For the complete bioregulator research framework, see Bronchogen 20mg.`
  },

  "117": {
    id: "117",
    casNumber: "Not publicly disclosed",
    formula: "Tetrapeptide",
    molecularWeight: "Approximately 450–550 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Prostate Research", "Urological Research", "Bioregulator Research"],
    alsoKnownAs: "Prostate Bioregulator Peptide, Khavinson Prostate Peptide",
    description: `Prostamax 20mg is the prostate bioregulator in Khavinson's research series, targeting prostate tissue biology. Research has investigated its effects on prostate cell function and age-related prostate health decline as part of the broader bioregulator research program.`,
    longDescription: `Prostamax is the prostate bioregulator in Khavinson's series. For a complete overview of the bioregulator research framework, see Bronchogen 20mg.`
  },

  "152": {
    id: "152",
    casNumber: "Not publicly disclosed",
    formula: "Tetrapeptide",
    molecularWeight: "Approximately 450–550 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Testicular Research", "Reproductive Research", "Hormonal Research", "Bioregulator Research"],
    alsoKnownAs: "Testicular Bioregulator, Khavinson Testosterone Peptide",
    description: `Testagen 20mg is the testicular bioregulator in Khavinson's research series, targeting testicular tissue biology. Research has investigated its effects on testosterone production, testicular cell function, and reproductive hormone health in aging males.`,
    longDescription: `Testagen is the testicular bioregulator in Khavinson's series. For a complete overview, see Bronchogen 20mg.`
  },

  "153": {
    id: "153",
    casNumber: "Not publicly disclosed",
    formula: "Tetrapeptide",
    molecularWeight: "Approximately 450–550 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Thymus Research", "Immune Research", "Anti-Aging Research", "Bioregulator Research"],
    alsoKnownAs: "Thymus Bioregulator, Khavinson Thymic Peptide",
    description: `Thymagen 20mg is the thymus bioregulator in Khavinson's research series, targeting thymic tissue biology. As the thymus involutes with age (thymic involution), loss of thymic function is a major driver of immunosenescence. Thymagen is proposed to support thymic biology and potentially slow age-related immune decline.`,
    longDescription: `Thymagen is the thymus bioregulator in Khavinson's series. For a complete overview of the bioregulator research framework and rationale, see Bronchogen 20mg.`
  },

  "164": {
    id: "164",
    casNumber: "Not publicly disclosed",
    formula: "Tripeptide",
    molecularWeight: "Approximately 380–420 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Bladder Research", "Urological Research", "Bioregulator Research"],
    alsoKnownAs: "Bladder Bioregulator, Khavinson Bladder Peptide",
    description: `Vesilute 20mg is the bladder/urinary bioregulator in Khavinson's research series. Research has investigated its effects on bladder tissue biology and urological health parameters in aging subjects as part of the comprehensive bioregulator research program.`,
    longDescription: `Vesilute is the bladder bioregulator in Khavinson's series. For a complete overview, see Bronchogen 20mg.`
  },

  "165": {
    id: "165",
    casNumber: "Not publicly disclosed",
    formula: "Tripeptide",
    molecularWeight: "Approximately 380–420 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Vascular Research", "Cardiovascular Research", "Endothelial Research", "Bioregulator Research"],
    alsoKnownAs: "Vascular Bioregulator, Khavinson Vascular Peptide",
    description: `Vesugen 20mg is the vascular bioregulator in Khavinson's research series, targeting blood vessel endothelial and smooth muscle cell biology. Research has explored its potential effects on vascular health, endothelial function, and age-related vascular decline as part of the bioregulator research program.`,
    longDescription: `Vesugen is the vascular bioregulator in Khavinson's series. For a complete overview, see Bronchogen 20mg.`
  },

  "167": {
    id: "167",
    casNumber: "Not publicly disclosed",
    formula: "Dipeptide",
    molecularWeight: "Approximately 230–270 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Lys-Glu (proposed)",
    researchAreas: ["Immune Research", "Thymus Research", "Anti-Aging Research", "Bioregulator Research"],
    alsoKnownAs: "Immune Bioregulator, Khavinson Immune Peptide",
    description: `Vilon 20mg is the immune system bioregulator in Khavinson's research series, proposed to be a Lys-Glu dipeptide. Unlike most bioregulators in the series (which are tetrapeptides), Vilon's minimal dipeptide structure makes it particularly interesting. Research has investigated its immunomodulatory effects and potential anti-aging properties related to immune function restoration.`,
    longDescription: `Vilon is proposed to be a dipeptide (Lys-Glu) immune bioregulator in Khavinson's series. For a complete overview of the bioregulator research framework, see Bronchogen 20mg. Vilon's proposed immunomodulatory activity includes effects on T-lymphocyte function and natural killer cell activity, consistent with the thymic peptide character of many immune bioregulators studied by Khavinson and colleagues.`
  },

  /* ─────────────────────────────────────────────────────────────────────────
     COSMETIC / TOPICAL PEPTIDES
  ───────────────────────────────────────────────────────────────────────── */

  "2": {
    id: "2",
    casNumber: "616204-22-9",
    formula: "C₃₄H₆₀N₁₄O₁₂S",
    molecularWeight: "888.98 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Ac-Glu-Glu-Met-Gln-Arg-Arg-NH₂",
    researchAreas: ["Anti-Aging Research", "Cosmetic Research", "Wrinkle Research", "Neurotransmitter Research"],
    alsoKnownAs: "Argireline, Acetyl Hexapeptide-3, Acetyl Hexapeptide-8",
    description: `Acetyl Hexapeptide-3 (Argireline) 200mg Topical is a synthetic hexapeptide developed as a topical alternative to botulinum toxin for facial wrinkle reduction. Argireline mimics the N-terminal end of SNAP-25 (synaptosomal-associated protein 25), a key component of the SNARE complex involved in neurotransmitter release at the neuromuscular junction. By competing with SNAP-25, it inhibits excessive muscle contraction that leads to expression lines and wrinkles.`,
    longDescription: `What is Acetyl Hexapeptide-3 (Argireline)?

Argireline (Ac-Glu-Glu-Met-Gln-Arg-Arg-NH₂) was developed by Lipotec SA (now part of Lubrizol) as a topically applicable peptide that addresses facial wrinkle formation through a mechanism similar to — but distinct from — botulinum toxin (Botox). Unlike Botox, which cleaves SNAP-25 to permanently block neurotransmitter release until nerve sprouting occurs (weeks), Argireline competes reversibly with SNAP-25 for binding in the SNARE complex, moderating (not eliminating) acetylcholine release at facial neuromuscular junctions.

Argireline Structure and Mechanism

Argireline has MW 888.98 g/mol. The sequence Ac-Glu-Glu-Met-Gln-Arg-Arg-NH₂ mimics the N-terminal domain of SNAP-25 (residues 12-17). SNAP-25, along with syntaxin and VAMP/synaptobrevin, forms the SNARE complex that docks secretory vesicles with the plasma membrane to enable neurotransmitter exocytosis. By competing for the SNAP-25 binding interface in the SNARE complex, Argireline partially disrupts vesicle fusion efficiency and reduces the amplitude of acetylcholine release at neuromuscular synapses.

Argireline Research

Cell culture studies have demonstrated Argireline reduces catecholamine release in cellular models of neurosecretion. Research in isolated neuromuscular preparations has shown concentration-dependent inhibition of evoked acetylcholine release. Importantly, these effects are reversible upon washout.

Clinical research in human volunteers has demonstrated topical Argireline (10%) reduces wrinkle depth in areas of high muscle activity (periorbital, forehead) over 4–8 weeks of application. A split-face study design comparing Argireline cream to control cream showed approximately 30% reduction in wrinkle depth with active treatment, measured by silicone replica analysis and profilometry. The compound has achieved wide adoption in cosmetic formulations, with research continuing into optimal delivery systems, concentration optimization, and combination with other anti-aging ingredients.`
  },

  "4": {
    id: "4",
    casNumber: "72957-37-0",
    formula: "C₁₃H₂₁N₅O₅",
    molecularWeight: "327.34 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Ala-His-Lys",
    researchAreas: ["Hair Growth Research", "Skin Research", "Copper Research", "Cosmetic Research"],
    alsoKnownAs: "Tripeptide-3, AHK, Ala-His-Lys",
    description: `AHK (Tripeptide-3) 200mg Topical is a copper-chelating tripeptide with the sequence Ala-His-Lys, structurally similar to GHK but with alanine replacing glycine. Research has shown AHK promotes hair follicle stimulation and may support hair growth through similar mechanisms to GHK, including facilitating copper delivery to hair follicle enzymes and modulating growth factors relevant to hair cycling.`,
    longDescription: `What is AHK (Tripeptide-3)?

AHK (Ala-His-Lys, Tripeptide-3) is a synthetic tripeptide with structural similarity to the well-studied GHK tripeptide (Gly-His-Lys). Like GHK, AHK contains a histidine-lysine motif with high affinity for copper (II) ions. The substitution of alanine for glycine at the N-terminus gives AHK distinct properties from GHK, including different receptor interactions and potentially different biological activities in skin and hair follicle cells.

AHK Structure

AHK has the sequence Ala-His-Lys with MW 327.34 g/mol. The imidazole group of histidine and the terminal amino groups coordinate Cu²⁺ in a square planar complex similar to GHK-Cu. As a copper-binding tripeptide, AHK participates in copper transport mechanisms and can deliver Cu²⁺ to copper-dependent enzymes including lysyl oxidase (essential for collagen crosslinking) and superoxide dismutase (antioxidant enzyme).

AHK Research

Research on AHK has focused primarily on its effects in hair follicle biology. Studies have demonstrated that AHK can extend the anagen (growth) phase of the hair cycle in follicle organ culture models. Hair follicle research suggests AHK may promote keratinocyte proliferation and delay the anagen-to-catagen transition (the transition from growth to resting phase), which is a critical determinant of hair density and growth rate.

Research comparing AHK to GHK and other hair follicle-active peptides has positioned AHK as a complementary ingredient in hair care formulations, with potential for greater hair follicle-specific activity compared to GHK. Skin research has also explored AHK for collagen synthesis stimulation, with in vitro studies suggesting similar fibroblast-activating properties to GHK-Cu. The topical formulation allows direct delivery to hair follicles and skin dermis without systemic exposure.`
  },

  "5": {
    id: "5",
    casNumber: "Not publicly available (complex)",
    formula: "C₁₃H₂₀CuN₅O₅ (approximate)",
    molecularWeight: "Approximately 389 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "Blue-green powder",
    sequence: "Ala-His-Lys (Cu²⁺ complex)",
    researchAreas: ["Hair Growth Research", "Skin Regeneration", "Copper Research", "Anti-Aging Cosmetic Research"],
    alsoKnownAs: "AHK Copper Complex, Tripeptide-3 Copper",
    description: `AHK-Cu 200mg Topical is the copper complex form of the AHK (Ala-His-Lys) tripeptide, analogous to GHK-Cu but with the alanine-containing tripeptide. The copper complex form is the biologically active version for copper-delivery research applications, potentially offering similar advantages over the free tripeptide as GHK-Cu offers over GHK.`,
    longDescription: `AHK-Cu is the copper-complexed form of AHK (Ala-His-Lys), analogous to the well-studied GHK-Cu copper tripeptide. Like GHK-Cu, the copper complex is the biologically active form for many of the peptide's proposed activities, including hair follicle stimulation and skin regeneration. The blue-green color is characteristic of Cu²⁺-coordinated peptides. Research on AHK-Cu is less extensive than for GHK-Cu, but the structural similarity and known copper-delivery mechanism suggest overlapping biological activities in copper-dependent enzymatic processes relevant to skin and hair biology. For the broader research context of copper tripeptides, see GHK-Cu 50mg and GHK-Cu Capsules product descriptions.`
  },

  "30": {
    id: "30",
    casNumber: "Not publicly available",
    formula: "Decapeptide",
    molecularWeight: "Approximately 1.2 kDa",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Skin Lightening Research", "Hyperpigmentation Research", "Melanin Research", "Cosmetic Research"],
    alsoKnownAs: "Decapeptide-12, Lumixyl peptide",
    description: `Decapeptide-12 200mg Topical is a synthetic 10-amino acid peptide developed for skin brightening and hyperpigmentation research. It acts as a competitive inhibitor of tyrosinase — the key enzyme in melanin biosynthesis — reducing melanin production in melanocytes. Research has demonstrated it can reduce hyperpigmented lesions and improve skin tone evenness with a favorable safety profile compared to other tyrosinase inhibitors.`,
    longDescription: `What is Decapeptide-12?

Decapeptide-12 (also known as the Lumixyl peptide) is a synthetic 10-amino acid peptide developed by researchers at Stanford University as a tyrosinase inhibitor for skin brightening applications. It was designed to address hyperpigmentation disorders such as melasma, post-inflammatory hyperpigmentation, and lentigines (age spots) through inhibition of melanin synthesis, without the irritation and photosensitivity associated with classic inhibitors like hydroquinone.

Decapeptide-12 Mechanism

The peptide competitively inhibits tyrosinase — the copper-containing enzyme responsible for the first two rate-limiting steps in melanin biosynthesis (conversion of tyrosine to DOPA and DOPA to dopaquinone). By occupying the tyrosinase active site, Decapeptide-12 reduces melanin production in a concentration-dependent manner. The peptide structure allows penetration into skin epidermis to reach melanocytes where tyrosinase is most active.

Research

Clinical research has demonstrated that topical Decapeptide-12 significantly reduces hyperpigmentation in subjects with melasma and post-inflammatory hyperpigmentation over 12-16 weeks of application, with efficacy comparable to 4% hydroquinone in some studies. Importantly, Decapeptide-12 shows excellent tolerability with minimal irritation, skin barrier disruption, or mutagenic potential — significant safety advantages over conventional hydroquinone therapy. In vitro research has confirmed its tyrosinase inhibition mechanism and demonstrated selective effects on hyperpigmented melanocytes compared to normally pigmented melanocytes.`
  },

  "43": {
    id: "43",
    casNumber: "89030-95-5",
    formula: "C₁₄H₂₄CuN₆O₄",
    molecularWeight: "403.9 g/mol (Cu²⁺ complex)",
    purity: "99% HPLC",
    storage: "Store at -20°C. Keep away from light and moisture.",
    appearance: "Blue-green topical solution/powder",
    researchAreas: ["Skin Research", "Anti-Aging Research", "Collagen Research", "Wound Healing", "Cosmetic Research"],
    alsoKnownAs: "Copper Tripeptide-1, GHK-Cu (topical)",
    description: `GHK-Cu 1gram (Copper Peptide) 1000mg Topical is the largest available research quantity of the copper tripeptide complex for topical research applications. This quantity supports extended topical formulation research, large-scale cell culture studies, or comprehensive in vivo skin research programs. For complete scientific content on GHK-Cu, see the GHK-Cu Capsules product description.`,
    longDescription: `GHK-Cu 1gram (1000mg) is the same compound as GHK-Cu 50mg and GHK-Cu Capsules, provided in the largest available topical research quantity. Please refer to the GHK-Cu Capsules (2mg × 60) product for the comprehensive overview of GHK-Cu's origin, structure, mechanism, and extensive research findings in skin biology, wound healing, gene expression modulation, and anti-aging.`
  },

  "45": {
    id: "45",
    casNumber: "89030-95-5",
    formula: "C₁₄H₂₄CuN₆O₄",
    molecularWeight: "403.9 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "Blue-green powder",
    researchAreas: ["Skin Research", "Anti-Aging Research", "Collagen Research", "Wound Healing"],
    alsoKnownAs: "Copper Tripeptide-1 (topical)",
    description: `GHK-Cu 200mg (Copper Peptide) Topical provides a research quantity of the copper tripeptide complex in a topical formulation format. This size is suitable for extended skin research studies or formulation development. For complete scientific content, see the GHK-Cu Capsules product description.`,
    longDescription: `GHK-Cu 200mg Topical is the same compound as other GHK-Cu formulations. Please refer to the GHK-Cu Capsules (2mg × 60) product for the comprehensive scientific overview.`
  },

  "46": {
    id: "46",
    casNumber: "89030-95-5",
    formula: "C₁₄H₂₄CuN₆O₄",
    molecularWeight: "403.9 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "Blue-green powder",
    researchAreas: ["Skin Research", "Anti-Aging Research", "Collagen Research"],
    alsoKnownAs: "Copper Tripeptide-1 (topical)",
    description: `GHK-Cu 500mg (Copper Peptide) Topical provides an extended research quantity for comprehensive topical research programs. For complete scientific content, see the GHK-Cu Capsules product description.`,
    longDescription: `GHK-Cu 500mg Topical is the same compound as other GHK-Cu formulations. Please refer to the GHK-Cu Capsules (2mg × 60) product for the comprehensive scientific overview.`
  },

  "48": {
    id: "48",
    casNumber: "72957-37-0",
    formula: "C₁₃H₂₁N₅O₅",
    molecularWeight: "327.34 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Gly-His-Lys (copper-free)",
    researchAreas: ["Skin Research", "Collagen Research", "Hair Research", "Cosmetic Research"],
    alsoKnownAs: "GHK (free), Tripeptide-1 (copper-free)",
    description: `GHK Basic 200mg (Tripeptide-1) Topical is the copper-free GHK tripeptide in a topical research quantity. It can be used as a copper chelator and carrier in formulation research or as a control/comparison compound versus GHK-Cu in studies examining copper-dependent versus copper-independent activities of the GHK tripeptide.`,
    longDescription: `GHK Basic 200mg Topical contains the free (copper-free) GHK tripeptide in a large quantity for topical research. For scientific content on GHK Basic's structure and copper-binding properties, see GHK Basic 50mg. For GHK-Cu's copper complex research, see GHK-Cu Capsules.`
  },

  "82": {
    id: "82",
    casNumber: "132698-36-3",
    formula: "C₆₄H₉₄N₁₄O₁₃",
    molecularWeight: "1248.51 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Pal-Lys-Thr-Thr-Lys-Ser-NH₂ (palmitoylated pentapeptide)",
    researchAreas: ["Anti-Aging Research", "Collagen Research", "Skin Firmness Research", "Cosmetic Research"],
    alsoKnownAs: "Palmitoyl Pentapeptide-3, Palmitoyl Pentapeptide-4",
    description: `Matrixyl 200mg (Palmitoyl Pentapeptide-3) Topical contains the breakthrough collagen-stimulating cosmetic peptide originally developed by Sederma. Matrixyl is a palmitoylated pentapeptide (Pal-Lys-Thr-Thr-Lys-Ser) that mimics the N-terminal sequence of procollagen I, signaling to fibroblasts to upregulate new collagen synthesis. Research has validated its ability to reduce wrinkle depth and increase skin firmness.`,
    longDescription: `What is Matrixyl (Palmitoyl Pentapeptide-3)?

Matrixyl (Pal-KTTKS, Palmitoyl Pentapeptide-3/4) was developed by Sederma as the first commercially successful peptide ingredient for anti-aging skincare formulations. The active sequence KTTKS (Lys-Thr-Thr-Lys-Ser) corresponds to the N-terminal propeptide sequence of type I procollagen — a signal sequence released during collagen synthesis that acts as a matrikine (a matrix-derived signaling peptide) to stimulate new collagen production. The palmitoyl modification provides the lipophilicity needed for skin penetration through the stratum corneum.

Matrixyl Structure and Mechanism

The KTTKS sequence is recognized by fibroblast receptors (including α₂β₁ integrin) and directly stimulates fibroblast synthesis of collagen I, collagen IV, fibronectin, and hyaluronic acid — the key structural components of the dermal matrix. The palmitoyl (16-carbon fatty acid) group is attached to the lysine N-terminus through an amide bond, forming Pal-KTTKS with MW approximately 802 g/mol. This lipophilic modification enables penetration through the lipid-rich stratum corneum barrier without requiring specialized delivery systems.

Matrixyl Research

Clinical research published in peer-reviewed journals and conducted by Sederma has demonstrated that topical Matrixyl (0.005% concentration) significantly reduces wrinkle depth, increases skin density, and improves skin tone and firmness over 12 weeks compared to vehicle control. Split-face studies have shown approximately 30-40% reduction in wrinkle depth measured by optical profilometry in areas of high facial mobility. In vitro research confirms dose-dependent stimulation of fibroblast collagen synthesis. Matrixyl has established a substantial safety record through decades of cosmetic use, with no reported sensitization or systemic effects in research studies.`
  },

  "83": {
    id: "83",
    casNumber: "Not publicly available",
    formula: "Tetrapeptide derivative",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Skin Lightening Research", "Melanin Research", "Cosmetic Research", "Tyrosinase Research"],
    alsoKnownAs: "Melanostatin DM, DM5, Nonapeptide derivative",
    description: `Melanostatin DM 200mg Topical is a peptide inhibitor of alpha-MSH's stimulation of melanogenesis, developed for skin brightening research. Unlike direct tyrosinase inhibitors, Melanostatin DM works upstream by blocking alpha-MSH receptor signaling (MC1R) in melanocytes, reducing cAMP production and consequently decreasing tyrosinase activity and melanin synthesis.`,
    longDescription: `What is Melanostatin DM?

Melanostatin DM (also called Mel-DM or DM5) is a synthetic peptide that acts as a competitive antagonist at the melanocortin 1 receptor (MC1R) in melanocytes. Alpha-MSH (alpha-melanocyte-stimulating hormone) activates MC1R to trigger the cAMP/PKA signaling cascade that upregulates tyrosinase activity and increases melanin production. Melanostatin DM competitively blocks alpha-MSH binding to MC1R, reducing downstream melanogenic signaling without directly inhibiting tyrosinase.

Melanostatin DM Mechanism

By acting as an MC1R antagonist, Melanostatin DM reduces the hormonal stimulation component of melanin production — the component responsible for UV-induced tanning and hormonally driven hyperpigmentation (such as melasma). This makes it particularly interesting for research into hormonally driven pigmentation disorders and for developing combination approaches where MC1R antagonism complements direct tyrosinase inhibition.

Research

Cell culture studies have demonstrated Melanostatin DM reduces melanin synthesis in cultured melanocytes stimulated with alpha-MSH, with effects correlating with reduced cAMP levels and tyrosinase activity. Clinical research has shown cosmetic formulations containing Melanostatin DM can lighten hyperpigmented lesions over 8-12 weeks of application. The compound is used in cosmetic research to study MC1R-mediated pigmentation control and as an ingredient in combination brightening formulations.`
  },

  "102": {
    id: "102",
    casNumber: "Not publicly available",
    formula: "Nonapeptide",
    molecularWeight: "Approximately 1.1 kDa",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Skin Lightening Research", "Tyrosinase Research", "Melanin Research", "Cosmetic Research"],
    alsoKnownAs: "Nonapeptide-1, Melanostatine-5, Melanostatin",
    description: `Nonapeptide-1 200mg Topical is a 9-amino acid peptide that inhibits melanin synthesis through direct competition with alpha-MSH for MC1R binding. Research has demonstrated its ability to reduce hyperpigmentation and even skin tone in cell culture and clinical settings, with a safety profile favorable for cosmetic research applications.`,
    longDescription: `Nonapeptide-1 (Melanostatine-5) shares a similar mechanism to Melanostatin DM as an MC1R antagonist peptide. It is a 9-amino acid peptide that competitively blocks alpha-MSH binding at MC1R on melanocyte surfaces, reducing the hormonal signal that drives tyrosinase activation and melanin production. Research in melanocyte cell cultures has demonstrated dose-dependent reductions in melanin content with Nonapeptide-1 treatment. Clinical studies have shown that topical formulations containing Nonapeptide-1 reduce melanic index scores and hyperpigmented lesion size over extended use. The compound is used in combination with other brightening ingredients including kojic acid, niacinamide, and arbutin in cosmetic research formulations.`
  },

  "108": {
    id: "108",
    casNumber: "Not publicly available",
    formula: "Palmitoylated tripeptide",
    molecularWeight: "Approximately 0.8 kDa",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Pal-Ala-His-Lys",
    researchAreas: ["Hair Growth Research", "Skin Research", "Cosmetic Research"],
    alsoKnownAs: "Palmitoyl-AHK, Palmitoyl Tripeptide-AHK",
    description: `Pal-AHK 200mg Topical is the palmitoylated form of the AHK (Ala-His-Lys) tripeptide, providing enhanced skin penetration through the stratum corneum compared to the free tripeptide. The palmitoyl modification is the same strategy used in Matrixyl (Pal-KTTKS) to improve topical delivery. Research into Pal-AHK focuses on hair follicle stimulation and skin rejuvenation.`,
    longDescription: `Pal-AHK is the palmitoyl-conjugated version of the AHK (Ala-His-Lys, Tripeptide-3) copper-chelating peptide. The 16-carbon palmitoyl group attached to the N-terminal alanine dramatically increases lipophilicity, enabling effective penetration through the stratum corneum — the primary barrier to topical peptide delivery. Once in the epidermis and dermis, the palmitoyl group may be cleaved to release the free AHK tripeptide for biological activity. Research into Pal-AHK focuses on hair follicle biology and skin regeneration, building on the known activities of AHK and GHK-Cu in these systems.`
  },

  "109": {
    id: "109",
    casNumber: "147732-56-7",
    formula: "C₃₂H₅₄N₄O₈",
    molecularWeight: "626.79 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Pal-Gly-His-Lys (palmitoyl tripeptide-1)",
    researchAreas: ["Anti-Aging Research", "Collagen Research", "Skin Repair Research", "Cosmetic Research"],
    alsoKnownAs: "Palmitoyl Tripeptide-1, Pal-GHK, Biopeptide-CL",
    description: `Pal-GHK 200mg (Palmitoyl Tripeptide-1) Topical is the palmitoylated form of the GHK (Gly-His-Lys) tripeptide, combining the copper-chelating and collagen-stimulating properties of GHK with enhanced skin penetration from the palmitoyl modification. Research has demonstrated Pal-GHK stimulates collagen synthesis and supports skin repair through fibroblast activation, serving as both a collagen stimulator and a copper delivery vehicle.`,
    longDescription: `Pal-GHK (Palmitoyl Tripeptide-1) is the palmitoyl-conjugated form of GHK (Gly-His-Lys). The palmitoyl group (Pal = hexadecanoyl) enables efficient penetration through the stratum corneum to reach dermal fibroblasts, where it can stimulate collagen production and facilitate copper delivery to copper-dependent enzymes. Pal-GHK is commonly included in premium anti-aging cosmetic formulations and has been studied for its effects on skin matrix protein synthesis including collagen I, III, and IV, fibronectin, and laminin. Research comparing Pal-GHK to GHK-Cu for topical applications has generally found that the palmitoyl modification provides better stratum corneum penetration, while the copper complex provides stronger collagen stimulation — suggesting combination approaches may be optimal.`
  },

  "110": {
    id: "110",
    casNumber: "Not publicly available",
    formula: "Palmitoylated dipeptide",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Anti-Aging Research", "Skin Firmness Research", "Cosmetic Research", "Collagen Research"],
    alsoKnownAs: "Palmitoyl Dipeptide-5, Palmitoyl Dipeptide-6",
    description: `Palmitoyl Dipeptide-6 200mg Topical is a palmitoylated dipeptide developed for skin firmness and anti-aging research. Research has investigated its effects on extracellular matrix protein synthesis and skin structural integrity, particularly regarding its ability to stimulate production of laminin-5 and other basement membrane components important for skin adhesion and structure.`,
    longDescription: `Palmitoyl Dipeptide-6 is a synthetic dipeptide with a palmitoyl group for topical delivery, developed for skin anti-aging applications. Its mechanism involves stimulation of basement membrane proteins including laminin-5, which connects the dermis to the epidermis and maintains skin structural integrity. Age-related loss of laminin-5 contributes to skin sagging and thinning. Research in keratinocyte and fibroblast cultures has shown Palmitoyl Dipeptide-6 can upregulate laminin-5 production. Clinical studies have investigated topical formulations containing the dipeptide for skin firmness and texture improvements over 8-12 weeks of use.`
  },

  "114": {
    id: "114",
    casNumber: "Not publicly available",
    formula: "Pentapeptide derivative",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Anti-Wrinkle Research", "Neurotransmitter Research", "Cosmetic Research", "Expression Line Research"],
    alsoKnownAs: "Leuphasyl, Pentapeptide-18",
    description: `Pentapeptide-18 (Leuphasyl) 200mg Topical is an enkephalin analogue pentapeptide that reduces muscular contractions at the neuromuscular junction through a mechanism involving opioid receptors rather than the SNARE complex targeted by Argireline. Research suggests Leuphasyl enhances enkephalin's inhibitory effect on acetylcholine release, with combined use with Argireline showing potential synergistic wrinkle reduction.`,
    longDescription: `What is Pentapeptide-18 (Leuphasyl)?

Leuphasyl (Pentapeptide-18) is a synthetic pentapeptide modeled on enkephalin — an endogenous opioid neuropeptide that inhibits nociception and modulates neurotransmitter release. At neuromuscular junctions, enkephalins act on presynaptic opioid receptors to reduce acetylcholine release, thereby reducing muscular contraction. Leuphasyl mimics this enkephalin-mediated inhibition, potentially providing a complementary mechanism to Argireline (which acts on the SNARE complex) for reducing expression-line wrinkle formation.

Research

Cell culture and neuromuscular models have demonstrated Leuphasyl reduces calcium-dependent neurotransmitter release through opioid receptor-mediated inhibition. Clinical studies have explored Leuphasyl both alone and in combination with Argireline. A notably cited study showed that a combination of 5% Argireline + 5% Leuphasyl produced greater wrinkle reduction (up to 49.6% wrinkle depth reduction) than either compound at higher concentrations alone, suggesting synergistic effects through complementary mechanisms. These findings have made the Leuphasyl/Argireline combination popular in research-grade cosmetic formulations.`
  },

  "124": {
    id: "124",
    casNumber: "Not publicly available",
    formula: "Palmitoylated tetrapeptide",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Pal-Gly-Gln-Pro-Arg",
    researchAreas: ["Anti-Aging Research", "Anti-Inflammatory Research", "Skin Repair Research", "Collagen Research"],
    alsoKnownAs: "Palmitoyl Tetrapeptide-7, Rigin, Palmitoyl Tetrapeptide-3",
    description: `Rigin 200mg (Palmitoyl Tetrapeptide-7) Topical is an anti-inflammatory peptide developed for skin anti-aging applications. It suppresses production of excess interleukin-6 (IL-6), a pro-inflammatory cytokine that is chronically elevated in aged skin and contributes to skin matrix breakdown. By reducing this inflammatory driver, Rigin targets the inflammatory component of skin aging.`,
    longDescription: `What is Rigin (Palmitoyl Tetrapeptide-7)?

Rigin (Palmitoyl Tetrapeptide-7, Pal-GQPR) is a synthetic palmitoyl tetrapeptide developed by Sederma specifically for its anti-inflammatory effects on skin. Unlike most anti-aging peptides that stimulate collagen synthesis or inhibit neuromuscular activity, Rigin works by suppressing the production of excess IL-6 (Interleukin-6) — a pro-inflammatory cytokine chronically elevated in aged skin. IL-6 drives matrix metalloproteinase (MMP) production, collagen degradation, and chronic low-grade inflammation that characterizes skin aging ("inflammaging").

Rigin Mechanism and Research

The sequence GQPR (Gly-Gln-Pro-Arg) was identified as having IL-6 suppressing activity in skin cells. By reducing IL-6 production from keratinocytes and fibroblasts, Rigin attenuates the inflammatory cascade that promotes collagen breakdown in aged skin. Research shows Rigin reduces IL-6, IL-1β, and prostaglandin E2 production in stimulated skin cell cultures. Clinical studies have shown reduced signs of skin aging with Rigin treatment including improvements in skin elasticity, firmness, and surface smoothness, with anti-inflammatory effects confirmed by reduced expression of inflammatory markers.

Rigin is frequently combined with Matrixyl or other collagen-stimulating peptides in research formulations, addressing both the anabolic (collagen stimulation) and anti-catabolic (anti-inflammatory) aspects of skin aging simultaneously.`
  },

  "139": {
    id: "139",
    casNumber: "868844-74-0",
    formula: "C₃₇H₅₈N₁₀O₁₀",
    molecularWeight: "791.92 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH₂ (octapeptide)",
    researchAreas: ["Anti-Wrinkle Research", "Neurotransmitter Research", "Cosmetic Research", "Expression Line Research"],
    alsoKnownAs: "Acetyl Octapeptide-3, Argireline + 2 additional residues",
    description: `SNAP-8 200mg Topical is an 8-amino acid N-terminal SNAP-25 analogue that extends Argireline (6-mer) with two additional amino acids for potentially greater SNARE complex competitive inhibition. Research has suggested SNAP-8 may produce greater wrinkle reduction than Argireline at equivalent concentrations due to its longer SNAP-25 mimetic sequence and higher affinity for SNARE complex binding sites.`,
    longDescription: `What is SNAP-8?

SNAP-8 (Acetyl Octapeptide-3) is an octapeptide analogue of Argireline (Acetyl Hexapeptide-3) with two additional C-terminal amino acids extending the SNAP-25 mimetic sequence. While Argireline corresponds to residues 12-17 of SNAP-25, SNAP-8 extends this to residues 12-19, potentially providing a longer competitive inhibitor of SNARE complex formation. Both peptides work through the same fundamental mechanism — competitive inhibition of SNAP-25 function in neurotransmitter vesicle fusion — but SNAP-8 may have higher affinity for the SNARE complex due to additional contact points.

SNAP-8 Research

In vitro research comparing SNAP-8 to Argireline has suggested that SNAP-8 produces somewhat greater inhibition of catecholamine release at equivalent concentrations, consistent with a higher-affinity SNARE complex interaction. Clinical research has investigated SNAP-8 at 10% concentration in facial creams, with studies reporting wrinkle depth reductions of up to 63% in the eye contour area over 28 days — exceeding results from Argireline studies at similar concentrations. While these results require independent validation, the mechanistic rationale for superior SNAP-25 mimicry is supported by the additional amino acids in SNAP-8's sequence.`
  },

  "141": {
    id: "141",
    casNumber: "Not publicly available",
    formula: "Tripeptide derivative",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Anti-Wrinkle Research", "Neurotransmitter Research", "Snake Venom Mimetic Research", "Cosmetic Research"],
    alsoKnownAs: "Syn-Ake, Dipeptide Diaminobutyroyl Benzylamide Diacetate, snake venom peptide mimic",
    description: `Syn-AKE 200mg Topical is a synthetic tripeptide analogue that mimics the neuromuscular blocking activity of Waglerin-1 from the venom of the Temple Viper (Tropidolaemus wagleri). Like Waglerin-1, Syn-AKE inhibits muscular contraction by blocking the nicotinic acetylcholine receptor (nAChR) at the neuromuscular junction, reducing expression-line wrinkle formation through a mechanism distinct from Argireline and SNAP-8.`,
    longDescription: `What is Syn-AKE?

Syn-AKE is a synthetic tripeptide analogue of Waglerin-1, a 22-amino acid peptide found in the venom of the Temple Viper (Tropidolaemus wagleri). Waglerin-1 causes temporary muscular paralysis by selectively blocking the epsilon subunit of nicotinic acetylcholine receptors (nAChR) at neuromuscular junctions. Syn-AKE replicates the key pharmacophore of Waglerin-1 in a minimized, stable tripeptide format, providing the neuromuscular blocking effect in a cosmetically applicable compound without the toxicity risks of venom-derived compounds.

Syn-AKE Mechanism

Unlike Argireline (which inhibits neurotransmitter release through SNARE complex interference) and Leuphasyl (which modulates opioid receptor-mediated presynaptic inhibition), Syn-AKE acts postsynaptically by blocking nAChR. This means Syn-AKE, Argireline, and Leuphasyl can theoretically be combined for additive anti-wrinkle effects through completely independent mechanisms — a significant research advantage.

Research

In vitro research has confirmed Syn-AKE blocks nAChR-mediated muscle fiber depolarization. Clinical studies using 4% Syn-AKE cream applied to the forehead for 28 days showed significant reductions in wrinkle depth compared to placebo (approximately 52% reduction in maximum wrinkle depth). Combination formulation research has explored Syn-AKE with other neuromuscular-modulating peptides and collagen-stimulating ingredients for comprehensive anti-wrinkle approaches. Its unique postsynaptic mechanism makes it a valuable tool for skin neurobiology research.`
  },

  "142": {
    id: "142",
    casNumber: "Not publicly available",
    formula: "Palmitoylated tripeptide",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Pal-Val-Gly-Val-Ala-Pro-Gly (collagen I domain sequence)",
    researchAreas: ["Anti-Aging Research", "Collagen Research", "Skin Firmness Research", "Cosmetic Research"],
    alsoKnownAs: "Syn-Coll, Palmitoyl Tripeptide-5",
    description: `Syn-Coll 200mg (Palmitoyl Tripeptide-5) Topical is a collagen-stimulating palmitoyl tripeptide that mimics thrombospondin-1's collagen type I synthesis-activating activity via the TGF-β pathway. Unlike GHK-based peptides that directly stimulate fibroblast collagen production, Syn-Coll activates an upstream signaling pathway through TGF-β for collagen type I induction.`,
    longDescription: `What is Syn-Coll (Palmitoyl Tripeptide-5)?

Syn-Coll (Palmitoyl Tripeptide-5) is a synthetic palmitoyl tripeptide with sequence Pal-Lys-Val-Lys (or similar), designed to mimic the collagen-stimulating activity of thrombospondin-1. Thrombospondin-1 is a glycoprotein that activates TGF-β (transforming growth factor beta) — the primary cytokine that promotes collagen synthesis in fibroblasts. Syn-Coll's peptide sequence mimics the TGF-β-activating domain of thrombospondin-1, providing an indirect collagen stimulation mechanism that bypasses direct receptor activation.

Syn-Coll Research

The TGF-β activation mechanism makes Syn-Coll distinct from most collagen-stimulating cosmetic ingredients. While GHK-Cu and Matrixyl directly stimulate fibroblast collagen production, Syn-Coll works through an upstream regulatory pathway, potentially offering better coordination with the body's own collagen regulatory networks. Research has demonstrated increased type I collagen production in fibroblast cultures treated with Syn-Coll. Clinical studies with Syn-Coll-containing formulations have shown improvements in skin smoothness and wrinkle depth over 12-week treatment periods. Research combining Syn-Coll with SNARE-targeting peptides (Argireline, SNAP-8) is exploring comprehensive anti-aging approaches that simultaneously address wrinkle formation and collagen matrix rebuilding.`
  },

  "163": {
    id: "163",
    casNumber: "Not publicly available",
    formula: "Tripeptide",
    molecularWeight: "Approximately 300 g/mol",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    sequence: "Gly-Pro-Hyp (Glycine-Proline-Hydroxyproline)",
    researchAreas: ["Collagen Research", "Skin Firmness Research", "Cosmetic Research", "Anti-Aging Research"],
    alsoKnownAs: "Collagen Tripeptide, Tripeptide-29, GPO",
    description: `Tripeptide-29 200mg (Collagen Peptide) Topical contains the repeating structural unit of collagen (Gly-Pro-Hyp), applied topically for skin research. This collagen tripeptide provides the building blocks for collagen fibril formation, potentially signaling to fibroblasts to increase collagen synthesis through matrikine mechanisms similar to other collagen-derived peptides.`,
    longDescription: `What is Tripeptide-29 (Collagen Peptide)?

Tripeptide-29 (Gly-Pro-Hyp) represents the repeating amino acid sequence that forms the collagen triple helix structure. Collagen molecules are composed of three polypeptide chains wound around each other in a triple helix, with the repeating sequence Gly-X-Y (where X is often proline and Y is often hydroxyproline). The Gly-Pro-Hyp sequence has the highest triple helix stability of any collagen tripeptide combination and is found abundantly in all collagen subtypes.

Collagen Tripeptide Research

Research on collagen tripeptides has explored two mechanisms of action: (1) as direct substrates for collagen synthesis (providing the amino acid building blocks), and (2) as matrikines that signal fibroblasts to increase collagen production through receptor-mediated pathways. Studies have shown that collagen-derived peptides including Gly-Pro-Hyp sequences can penetrate skin and reach fibroblasts, where they may stimulate de novo collagen synthesis beyond simple substrate provision.

Research has demonstrated that topical collagen tripeptide formulations can increase skin moisture retention, reduce trans-epidermal water loss, and improve skin elasticity over 4-8 weeks of regular application. Fibroblast culture studies show increased collagen and elastin production following collagen peptide treatment, consistent with matrikine signaling. The compound is used in cosmetic research to study collagen peptide signaling and as an ingredient in comprehensive anti-aging formulations.`
  },

  "166": {
    id: "166",
    casNumber: "Not publicly available",
    formula: "Pentapeptide derivative",
    purity: "99% HPLC",
    storage: "Store at -20°C.",
    appearance: "White lyophilized powder",
    researchAreas: ["Anti-Wrinkle Research", "Neurotransmitter Research", "Snake Venom Mimetic Research", "Cosmetic Research"],
    alsoKnownAs: "Pentapeptide-3V, Vialox, Syn-AKE related",
    description: `Vialox 200mg (Pentapeptide-3V) Topical is a pentapeptide that inhibits sodium channel activity at the neuromuscular junction, reducing muscle contraction associated with expression line formation. This mechanism — blocking sodium channel-dependent action potentials — complements the nAChR-blocking mechanism of Syn-AKE and the SNARE-targeting mechanism of Argireline/SNAP-8.`,
    longDescription: `What is Vialox (Pentapeptide-3V)?

Vialox (Pentapeptide-3V) is a synthetic pentapeptide that reduces facial muscle contraction through a mechanism involving inhibition of voltage-gated sodium channels — specifically those at the neuromuscular junction responsible for action potential propagation. By reducing sodium channel-mediated depolarization, Vialox reduces the efficiency of neuromuscular transmission and consequently decreases the amplitude of muscle contraction responsible for forming expression lines.

Vialox Research

In vitro research on isolated muscle preparations has demonstrated Vialox's sodium channel-blocking activity. Clinical studies have explored Vialox in topical formulations, with reported reductions in wrinkle depth in areas of high muscular activity (forehead, periorbital). The sodium channel-inhibiting mechanism is distinct from all other muscle-targeting cosmetic peptides (Argireline, SNAP-8, Leuphasyl, Syn-AKE), making Vialox potentially additive with these compounds in combination research formulations. Studies continue to characterize the precise receptor pharmacology and optimal formulation parameters for Vialox's topical anti-wrinkle applications.`
  },

  /* ─────────────────────────────────────────────────────────────────────────
     BLEND PRODUCTS
  ───────────────────────────────────────────────────────────────────────── */

  "24": {
    id: "24",
    casNumber: "863288-34-0 / 158861-67-7",
    formula: "CJC-1295 No DAC + GHRP-2 blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research", "Body Composition Research"],
    alsoKnownAs: "CJC-1295/GHRP-2 Blend",
    description: `CJC1295/GHRP-2 10mg Blend combines Modified GRF 1-29 (CJC-1295 No DAC) and GHRP-2 for synergistic GH release. GHRP-2 is among the most potent GH secretagogues in the GHRP class, providing strong GHS-R1a stimulation to complement CJC-1295 No DAC's GHRHR activation. The combination produces robust GH pulses through dual receptor pathway stimulation.`,
    longDescription: `The CJC-1295/GHRP-2 blend exploits the complementary GH-releasing mechanisms of GHRH receptor agonism (CJC-1295 No DAC) and GHS-R1a agonism (GHRP-2). GHRP-2 is selected for this blend because of its superior GH-releasing potency among GHRPs, though it produces some cortisol and ACTH stimulation alongside GH. For researchers specifically studying GH secretion magnitude rather than selectivity, GHRP-2 provides the highest GH response in combination with GHRH analogues. Please refer to individual component descriptions (CJC-1295 No DAC and GHRP-2) for detailed scientific information.`
  },

  "25": {
    id: "25",
    casNumber: "863288-34-0 / 87616-84-0",
    formula: "CJC-1295 No DAC + GHRP-6 blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Appetite Research", "Anti-Aging Research"],
    alsoKnownAs: "CJC-1295/GHRP-6 Blend",
    description: `CJC1295/GHRP-6 10mg Blend combines Modified GRF 1-29 with GHRP-6 for synergistic GH stimulation and appetite research. GHRP-6 is notable for its particularly pronounced appetite-stimulating effects through hypothalamic NPY upregulation, making this blend valuable for combined GH secretagogue and appetite regulation research.`,
    longDescription: `The CJC-1295/GHRP-6 blend provides complementary GHRH receptor and GHS-R1a stimulation similar to other GHRH/GHRP combination blends. GHRP-6's distinctive strong appetite stimulation through ghrelin receptor-mediated hypothalamic orexigenic signaling makes this blend particularly relevant for research combining GH secretion with appetite and food intake regulation. Please refer to individual component descriptions for detailed scientific information.`
  },

  "26": {
    id: "26",
    casNumber: "863288-34-0 / 140703-51-1",
    formula: "CJC-1295 No DAC + Hexarelin blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Cardiovascular Research", "Anti-Aging Research"],
    alsoKnownAs: "CJC-1295/Hexarelin Blend",
    description: `CJC1295/Hexarelin 10mg Blend combines Modified GRF 1-29 with Hexarelin — the most potent GH secretagogue in the GHRP class — for maximum GH stimulation research. Hexarelin also provides unique cardioprotective effects through direct GHS-R1a cardiac receptor activation, making this blend relevant for both GH research and cardiac physiology studies.`,
    longDescription: `The CJC-1295/Hexarelin blend leverages Hexarelin's exceptional GH-releasing potency (highest among GHRPs) in combination with CJC-1295 No DAC's GHRHR activation for maximum synergistic GH release. Research with Hexarelin-containing combinations explores not only GH secretion but also the unique cardioprotective properties of GHS-R1a activation in cardiac tissue. Please refer to individual component descriptions for detailed scientific information.`
  },

  "90": {
    id: "90",
    casNumber: "863288-34-0 / 158861-67-7",
    formula: "ModGRF + GHRP-2 blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research"],
    alsoKnownAs: "Mod GRF 1-29 / GHRP-2 Blend",
    description: `ModGRF/GHRP-2 10mg Blend is equivalent to the CJC-1295/GHRP-2 blend — Modified GRF 1-29 combined with GHRP-2 for dual-pathway GH stimulation. For complete scientific content, see CJC1295/GHRP-2 10mg Blend and individual component descriptions.`,
    longDescription: `ModGRF/GHRP-2 Blend contains the same compounds as CJC1295/GHRP-2 Blend. Please refer to that product and the individual component descriptions for complete scientific information.`
  },

  "91": {
    id: "91",
    casNumber: "863288-34-0 / 87616-84-0",
    formula: "ModGRF + GHRP-6 blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Appetite Research", "Anti-Aging Research"],
    alsoKnownAs: "Mod GRF 1-29 / GHRP-6 Blend",
    description: `ModGRF/GHRP-6 10mg Blend combines Modified GRF 1-29 and GHRP-6 for dual-pathway GH stimulation with added appetite-stimulating research potential. For complete scientific content, see individual component descriptions.`,
    longDescription: `ModGRF/GHRP-6 Blend contains the same compounds as CJC1295/GHRP-6 Blend. Please refer to that product and the individual component descriptions for complete scientific information.`
  },

  "92": {
    id: "92",
    casNumber: "863288-34-0 / 140703-51-1",
    formula: "ModGRF + Hexarelin blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Cardiovascular Research", "Anti-Aging Research"],
    alsoKnownAs: "Mod GRF 1-29 / Hexarelin Blend",
    description: `ModGRF/Hexarelin 10mg Blend combines Modified GRF 1-29 and Hexarelin for maximum GH stimulation research. Hexarelin's cardiac protective properties through GHS-R1a make this blend valuable for combined GH and cardiac physiology studies.`,
    longDescription: `ModGRF/Hexarelin Blend contains the same compounds as CJC1295/Hexarelin Blend. Please refer to that product and individual component descriptions.`
  },

  "93": {
    id: "93",
    casNumber: "863288-34-0 / 170851-70-4",
    formula: "ModGRF + Ipamorelin blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research"],
    alsoKnownAs: "Mod GRF 1-29 / Ipamorelin Blend",
    description: `ModGRF/Ipamorelin 10mg Blend is equivalent to CJC1295/Ipamorelin 10mg Blend — the most popular GHRH/GHRP research combination. Modified GRF 1-29 combined with the highly selective Ipamorelin provides synergistic, clean GH release without confounding cortisol or prolactin elevations.`,
    longDescription: `ModGRF/Ipamorelin Blend contains the same compounds as CJC1295/Ipamorelin Blend. Please refer to that product and individual component descriptions for complete scientific information.`
  },

  "130": {
    id: "130",
    casNumber: "86168-78-7 / 158861-67-7",
    formula: "Sermorelin + GHRP-2 blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research"],
    alsoKnownAs: "Sermorelin/GHRP-2 Blend",
    description: `Sermorelin/GHRP-2 10mg Blend combines the FDA-approved GHRH analogue Sermorelin with the highly potent GHRP-2 for synergistic dual-pathway GH stimulation. This blend benefits from Sermorelin's regulatory approval precedent and GHRP-2's exceptional GH-releasing potency.`,
    longDescription: `Sermorelin/GHRP-2 Blend provides complementary GHRHR (Sermorelin) and GHS-R1a (GHRP-2) stimulation for synergistic GH release. Please refer to individual component descriptions for Sermorelin 2mg and GHRP-2 5mg for complete scientific information on each compound.`
  },

  "131": {
    id: "131",
    casNumber: "86168-78-7 / 87616-84-0",
    formula: "Sermorelin + GHRP-6 blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Appetite Research", "Anti-Aging Research"],
    alsoKnownAs: "Sermorelin/GHRP-6 Blend",
    description: `Sermorelin/GHRP-6 10mg Blend combines Sermorelin and GHRP-6 for synergistic GH release with GHRP-6's characteristic appetite-stimulating orexigenic effects. For complete scientific content, see individual component descriptions.`,
    longDescription: `Sermorelin/GHRP-6 Blend provides synergistic GHRHR + GHS-R1a stimulation. Please refer to Sermorelin 2mg and GHRP-6 5mg product descriptions for full scientific content.`
  },

  "132": {
    id: "132",
    casNumber: "86168-78-7 / 87616-84-0 / 158861-67-7",
    formula: "Sermorelin + GHRP-6 + GHRP-2 triple blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research"],
    alsoKnownAs: "Sermorelin/GHRP-6/GHRP-2 Triple Blend",
    description: `Sermorelin/GHRP-6/GHRP-2 9mg Triple Blend provides the broadest GH secretagogue combination, adding both major GHRP compounds to Sermorelin for maximally comprehensive GH axis stimulation research.`,
    longDescription: `This triple-component blend combines Sermorelin (GHRHR agonist), GHRP-6 (GHS-R1a agonist with appetite effects), and GHRP-2 (GHS-R1a agonist with high GH potency). The three compounds together provide: (1) GHRH receptor pathway activation via Sermorelin; (2) GHS-R1a pathway activation with appetite research potential via GHRP-6; (3) maximum GH-releasing potency via GHRP-2. Please refer to individual component descriptions for detailed scientific information.`
  },

  "133": {
    id: "133",
    casNumber: "86168-78-7 / 170851-70-4",
    formula: "Sermorelin + Ipamorelin blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research"],
    alsoKnownAs: "Sermorelin/Ipamorelin Blend",
    description: `Sermorelin/Ipamorelin 10mg Blend combines Sermorelin's physiologically-mimicking GHRH receptor activation with Ipamorelin's highly selective GHS-R1a stimulation. This represents the cleanest dual-pathway GH secretagogue research blend, maintaining Sermorelin's pulsatile GH release pattern while Ipamorelin adds GHS-R1a pathway activation without cortisol or prolactin interference.`,
    longDescription: `Sermorelin/Ipamorelin Blend provides dual-pathway GH stimulation with exceptional selectivity — Sermorelin activates GHRHR for pulsatile GH release, while Ipamorelin's unique selectivity adds GHS-R1a stimulation without the ACTH/cortisol or prolactin side effects of GHRP-2 or GHRP-6. This combination is ideal for research specifically studying GH axis biology without confounding steroidogenic effects. Please refer to Sermorelin 2mg and Ipamorelin 2mg for complete scientific information.`
  },

  "147": {
    id: "147",
    casNumber: "218949-48-5 / 863288-34-0 / 170851-70-4",
    formula: "Tesamorelin + CJC-1295 No DAC + Ipamorelin blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 21 days.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Body Composition Research", "Adipose Research"],
    alsoKnownAs: "Triple GHRH/GHRP Blend",
    description: `Tesamorelin/CJC-1295/Ipamorelin 12mg Blend combines three distinct GH secretagogue compounds — the FDA-approved Tesamorelin (full GHRH) plus Modified GRF 1-29 (CJC-1295 No DAC) plus Ipamorelin — for comprehensive triple-component GH secretagogue research. This triple GHRH-GHRH analogue-GHRP approach provides sustained GHRHR pathway coverage combined with selective GHS-R1a stimulation.`,
    longDescription: `Tesamorelin/CJC-1295/Ipamorelin Triple Blend combines two GHRH-pathway agonists (Tesamorelin and CJC-1295 No DAC) with one GHS-R1a agonist (Ipamorelin). Including both Tesamorelin (full 44-AA GHRH sequence) and CJC-1295 No DAC (first 29 AA with modifications) provides comprehensive GHRHR engagement. Ipamorelin adds the GHS-R1a pathway with its characteristic selectivity. This blend is particularly relevant for visceral fat research (where Tesamorelin has FDA-validated efficacy) combined with the sustained GH stimulation from all three components. Please refer to individual component descriptions for complete scientific information.`
  },

  "172": {
    id: "172",
    casNumber: "863288-34-0 / 170851-70-4 / 158861-67-7",
    formula: "CJC-1295 + Ipamorelin + GHRP-2 blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 2 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Growth Hormone Research", "Anti-Aging Research", "Metabolic Research", "Body Composition Research"],
    alsoKnownAs: "Triple GH Secretagogue Blend",
    description: `CJC1295/Ipamorelin/GHRP-2 Blend is a triple-component GH secretagogue combination adding GHRP-2's high-potency GHS-R1a stimulation to the clean CJC-1295/Ipamorelin research platform. This provides maximum GH pulse amplitude (from GHRP-2) while maintaining the selective GHRH receptor activation from CJC-1295 No DAC and Ipamorelin's selective GHS-R1a contribution.`,
    longDescription: `CJC1295/Ipamorelin/GHRP-2 Triple Blend combines three complementary GH secretagogue mechanisms: GHRHR activation (CJC-1295 No DAC), selective GHS-R1a activation (Ipamorelin), and high-potency GHS-R1a activation (GHRP-2). The addition of GHRP-2 to the clean CJC-1295/Ipamorelin platform adds greater GH release amplitude at the cost of some cortisol and ACTH co-stimulation that GHRP-2 produces. Please refer to individual component descriptions for detailed scientific information.`
  },

  "173": {
    id: "173",
    casNumber: "137525-51-0 / 77591-33-4 / 4485-52-3 / 89030-95-5",
    formula: "BPC-157 + TB-500 + KPV + GHK-Cu blend",
    purity: "99% HPLC",
    storage: "Store at -20°C. Reconstituted: 4°C, use within 3 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Tissue Regeneration", "Anti-Inflammatory Research", "Wound Healing", "Gut Health Research", "Anti-Aging Research"],
    alsoKnownAs: "Klow Blend, Quad Peptide Blend",
    description: `BPC-157/TB-500/KPV/GHK-Cu 80mg Klow Blend is a comprehensive four-peptide research combination targeting tissue repair, inflammation, gut health, and anti-aging through four complementary mechanisms. BPC-157 provides gastrointestinal and musculoskeletal healing, TB-500 provides systemic tissue repair through actin regulation, KPV provides targeted anti-inflammatory signaling through melanocortin pathways, and GHK-Cu provides gene expression modulation and collagen synthesis promotion.`,
    longDescription: `What is the Klow Blend?

The Klow Blend is a four-component peptide research formulation designed to provide synergistic tissue repair and anti-aging research coverage. Each component contributes distinct and complementary mechanisms:

BPC-157 Component: Gastrointestinal healing, tendon and musculoskeletal repair through nitric oxide modulation and VEGF upregulation, GH receptor sensitization. Research across 200+ published studies supports multi-organ healing effects.

TB-500 (Thymosin Beta-4) Component: Actin cytoskeleton regulation promoting cell migration essential for wound closure and tissue regeneration, cardiac progenitor cell activation, angiogenesis independent of VEGF, and anti-inflammatory effects through actin-dependent mechanisms.

KPV Component: Direct anti-inflammatory effects through MC1R activation, reducing TNF-α, IL-1β, IL-6, and NF-κB activity specifically in intestinal and systemic immune contexts. KPV provides the targeted immune modulation component that complements BPC-157's structural repair effects.

GHK-Cu Component: Broad gene expression modulation (4,000+ human genes), collagen synthesis stimulation in fibroblasts, antioxidant effects, and anti-cancer gene expression regulation. GHK-Cu provides the anti-aging and tissue renewal dimension of the blend, complementing the acute repair focus of BPC-157 and TB-500.

The 80mg total blend provides sufficient compound for extended research protocols examining the combined effects of these four complementary tissue repair and anti-aging peptides.`
  },

};

export function getProductDetail(id: string): ProductDetail {
  return productDetails[id] || {
    id,
    description: "This research compound is produced to the highest standards of purity and quality. Our products are synthesized in the USA using pharmaceutical-grade raw materials and undergo strict quality control including HPLC analysis. For research purposes only.",
    purity: "99% HPLC",
    storage: "Store lyophilized at -20°C. After reconstitution, store at 4°C and use within 2–4 weeks.",
    appearance: "White lyophilized powder",
    researchAreas: ["Research Use Only"],
  };
}
