import { db } from "@workspace/db";
import { productReviewsTable, productsCatalogTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const REVIEWER_NAMES = [
  "James T.", "Sarah M.", "David K.", "Emma R.", "Michael B.",
  "Laura H.", "Tom W.", "Rachel S.", "Chris N.", "Olivia P.",
  "Andrew F.", "Jessica L.", "Ryan O.", "Natalie C.", "Ben A.",
  "Sophia G.", "Luke D.", "Hannah V.", "Mark E.", "Claire J.",
  "Daniel Y.", "Amy Z.", "Sam Q.", "Zoe X.", "Patrick U.",
  "Fiona I.", "George C.", "Alice B.", "Harry M.", "Mia W.",
  "Joshua T.", "Eleanor K.", "Aaron S.", "Isla R.", "Jake F.",
  "Chloe P.", "Liam N.", "Grace H.", "Owen D.", "Amber L.",
  "Ethan V.", "Lily A.", "Connor G.", "Phoebe E.", "Rory J.",
  "Evelyn Q.", "Sean Z.", "Imogen Y.", "Callum X.", "Ruby U.",
  "Aidan W.", "Freya T.", "Declan S.", "Poppy R.", "Finn Q.",
  "Harriet P.", "Niall O.", "Daisy N.", "Ruairidh M.", "Willow L.",
  "Tristan K.", "Penelope J.", "Kieran I.", "Scarlett H.", "Alistair G.",
  "Matilda F.", "Reuben E.", "Arabella D.", "Cormac C.", "Violet B.",
  "Barnaby A.", "Cordelia Z.", "Magnus Y.", "Celestine X.", "Leander W.",
  "Persephone V.", "Stellan U.", "Rosalind T.", "Emrys S.", "Calliope R.",
];

type ReviewTemplate = { title: string; body: string; rating: number };

const TEMPLATES_BY_CATEGORY: Record<string, ReviewTemplate[]> = {
  "Healing Peptides": [
    { rating: 5, title: "Outstanding purity, dissolved perfectly", body: "Ordered for in-vitro tissue repair research. purity data matches exactly what was stated. Dissolved cleanly in sterile water with no particulates. Very impressed." },
    { rating: 5, title: "Excellent for musculoskeletal studies", body: "Used in our lab's tendon repair model. Purity verified independently at 98.7% — well within spec. Will be reordering." },
    { rating: 4, title: "Very good quality material", body: "Product quality is excellent. The lyophilised cake was intact and reconstituted perfectly. Content itself is top tier — very clean profile on our in-house testing." },
    { rating: 5, title: "Best source I've found for this compound", body: "Tried three other suppliers before this one. This is the only one that provided the full lab report, not just a purity number. The data integrity here is on another level." },
    { rating: 5, title: "Independent verification confirmed purity", body: "Ran our own testing — results came within 0.4% of stated purity. That level of consistency is rare in this space. Repeat customer from here on." },
    { rating: 4, title: "Solid research grade material", body: "Good product for gastrointestinal research protocols. Reconstitution was smooth and aliquots have remained stable at -20°C for 8 weeks so far." },
    { rating: 5, title: "Consistently high quality batch to batch", body: "On my fourth order now and each batch shows consistent purity. That reproducibility matters enormously for research. Will keep ordering." },
    { rating: 4, title: "Good value for the quality", body: "Pricing is fair for the documentation provided. full lab report included, which is increasingly rare. Minor note only that the website checkout could be smoother." },
    { rating: 5, title: "Arrived in perfect condition", body: "Shipped with appropriate cold packaging — arrived perfectly. Lyophilised cake was pristine. Reconstituted to a clear solution with no visible aggregation." },
    { rating: 5, title: "Excellent for gastrointestinal research", body: "Clean material with no visible particulates on reconstitution. Our cytoprotection assay gave results consistent with published literature. Very satisfied." },
    { rating: 4, title: "Great purity, clean dissolution", body: "Dissolved easily in sterile saline. No clouding or aggregation. Our tissue repair model results are replicable batch to batch. Good supplier." },
    { rating: 5, title: "Top quality for regenerative research", body: "Used in multiple wound healing models. Purity is consistently above 98.5% on our verification. The lyophilised powder reconstitutes quickly and cleanly." },
  ],
  "Growth Peptides": [
    { rating: 5, title: "Impressive purity documentation", body: "Ordered for GH secretagogue receptor binding studies. full lab report provided with peak analysis. The data quality here is what separates this supplier from competitors." },
    { rating: 4, title: "Good product for GH axis research", body: "Peptide dissolved readily in sterile water and showed expected activity in our cell-based assay. Documentation complete. Product arrived in good condition." },
    { rating: 5, title: "Reliable and well documented", body: "Fourth order this year. Every batch has come with fresh lot-specific documentation. Purity has been above 99% every time — impressive consistency." },
    { rating: 5, title: "Excellent for pulsatile GH research", body: "Used in rat pituitary cell studies. Very clean material — no degradation peaks visible in testing. Highly recommended." },
    { rating: 5, title: "Cleanest GHRP I've sourced in two years", body: "Tried several vendors for this compound. This batch is notably cleaner. The purity profile has minimal secondary peaks. Our in-vitro GH release assay confirms bioactivity." },
    { rating: 4, title: "Well within spec", body: "Independent verification put purity at 98.9%. Reconstitution clean. Lyophilised cake was intact on arrival and dissolved without issue." },
    { rating: 5, title: "Great for IGF-1 pathway studies", body: "Used alongside IGF-1 LR3 for downstream signalling research. Both compounds excellent. Consistent lot-to-lot quality is what keeps me coming back." },
    { rating: 4, title: "Solid product, will reorder", body: "Good purity, complete documentation, reasonable pricing. Nothing to complain about on the product side. Product itself is great." },
    { rating: 5, title: "Research grade — genuinely", body: "I've been burned by substandard material before. The documentation here is the real deal — our own testing results were independently verifiable." },
    { rating: 4, title: "Clean material for secretagogue studies", body: "Purity is where it should be for serious research use. The lyophilised form is stable and dissolves well. Good batch." },
    { rating: 5, title: "Excellent for pituitary studies", body: "Used for rat pituitary cell work. Compound purity is excellent and our GH secretion assay results are clean and reproducible. Very happy." },
    { rating: 5, title: "Consistent batch quality", body: "Third order of this compound. Each batch has come with consistent purity data and clean analytical profiles. That reproducibility is critical for longitudinal work." },
  ],
  "Weight Management": [
    { rating: 5, title: "Excellent purity for metabolic research", body: "Ordered for GLP-1 receptor pharmacology studies. independent testing confirmed purity within spec. Reconstitution clean with no particulates." },
    { rating: 5, title: "Top tier GLP-1/GIP agonist material", body: "Running receptor binding assays with this compound. Activity correlates well with published Ki values. Analytical documentation is excellent." },
    { rating: 4, title: "Great quality product", body: "Purity checks out and dissolution is straightforward in the supplied buffer. Aliquots have been stable at -80°C for our metabolic model." },
    { rating: 5, title: "Best source for this compound class", body: "Tried two other suppliers. This material is considerably cleaner based on our in-house testing. The data is accurate and detailed." },
    { rating: 5, title: "Consistent batch quality", body: "Second order of this compound. Purity numbers are very close to the previous batch — good quality control. Essential for longitudinal research protocols." },
    { rating: 4, title: "Well documented and clean", body: "full lab report provided. No degradation peaks. Performing exactly as expected in our long-term obesity model." },
    { rating: 5, title: "Excellent for adiposity research", body: "Used in our metabolic syndrome study. Compound purity and activity are both exceptional. More detail than any other supplier I've used at this price point." },
    { rating: 4, title: "Reliable supplier for this compound class", body: "Have now ordered three different GLP-1 related peptides. All three have been excellent. Packaging is solid for international orders." },
    { rating: 5, title: "detailed purity data included — valuable", body: "A detailed lab report provided with each lot is something most suppliers don't bother with. For pharmacology research, that level of detail is invaluable." },
    { rating: 4, title: "Good purity, clean dissolution", body: "Reconstituted cleanly in PBS. No visible particulates. Our receptor binding assay gave clean results consistent with published literature." },
    { rating: 5, title: "Excellent for GIP/GLP research", body: "Running dual receptor studies. Compound is clean and well-characterised. Results in our cell-based assay are highly reproducible. Very satisfied." },
    { rating: 5, title: "High purity verified independently", body: "We Ran independent testing in-house and got 98.7% — consistent with what was stated. That accuracy is rare. Will continue ordering." },
  ],
  "Nootropics": [
    { rating: 5, title: "Excellent purity for CNS research", body: "Ordered for BDNF pathway studies. independent testing shows a very clean profile. Reconstituted cleanly in sterile saline." },
    { rating: 4, title: "Good anxiolytic peptide, solid documentation", body: "Used in rodent anxiety models. Compound performs as expected based on literature. Documentation is solid and product arrived in excellent condition." },
    { rating: 5, title: "Best source I've found for nootropic peptides", body: "Tried several other suppliers. Products here consistently come with better documentation and higher verified purity. Worth the price point." },
    { rating: 5, title: "Impressive analytical documentation", body: "The documentation includes independent testing retention time, purity %, and area under curve. That level of detail is what research requires." },
    { rating: 5, title: "Reliable for neuropeptide research", body: "Running long-term cognitive studies and need consistent material. This supplier has been reliable batch to batch. The lot numbers tie to individual analytical data." },
    { rating: 4, title: "Well within spec", body: "in-house testing matched the stated value within acceptable limits. Clean dissolution, no visible aggregation. Good value for documentation provided." },
    { rating: 5, title: "Excellent for TREK-1 channel research", body: "Compound is clean and dissolved perfectly. Patch-clamp recordings show expected pharmacological profile. Happy with purity and activity." },
    { rating: 5, title: "Ideal for cognitive research protocols", body: "Clean material, verified purity, and detailed analytical documentation. Everything we need for a well-controlled study. Will reorder." },
    { rating: 4, title: "Good batch, replicable results", body: "Third order of this compound. Results in our cognition model are consistent batch to batch. That's what you need when running longitudinal work." },
  ],
  "Longevity Peptides": [
    { rating: 5, title: "Exceptional purity for telomere research", body: "Ordered for telomerase activity assays. Purity 99.2% by in-house testing — matches stated value exactly. This is what research-grade means." },
    { rating: 5, title: "Detailed documentation — very impressive", body: "Documentation includes a full lab report with peak analysis. No other supplier I've used provides this level of detail as standard." },
    { rating: 4, title: "Good quality, well packaged", body: "Arrived well packaged. Lyophilised cake intact. Reconstitution smooth. Product is excellent — very pleased." },
    { rating: 5, title: "Consistently high quality", body: "Third order this year. Each batch shows purity consistently above 99%. For longitudinal research that reproducibility is critical. Outstanding." },
    { rating: 5, title: "Perfect for pineal peptide research", body: "Purity and purity documentation are exactly what we need for antioxidant and longevity pathway studies. Clean material, well documented." },
    { rating: 4, title: "Solid choice for this compound class", body: "Detailed purity documentation as standard for a tetrapeptide is reassuring. Purity also within spec. Good supplier for longevity research." },
    { rating: 5, title: "Excellent for life extension research", body: "Using in our ageing biology study. Compound performance in cell-based assays matches literature values. Documentation is comprehensive and accurate." },
    { rating: 5, title: "Very clean material", body: "Reconstituted cleanly with no aggregation. Stable in aliquots at -80°C. Results in our senescence model are consistent with expected pharmacology." },
  ],
  "Skin & Repair": [
    { rating: 5, title: "Excellent GHK-Cu — characteristic colour present", body: "The characteristic blue colour of lyophilised GHK-Cu was present — a good first indicator. independent testing confirmed 99.1% purity. Dissolved cleanly in sterile water." },
    { rating: 5, title: "Outstanding for collagen research", body: "Using in fibroblast cell culture studies. Activity in our collagen synthesis assay is exactly as literature predicts. Documentation is exemplary." },
    { rating: 4, title: "High quality copper peptide", body: "Good dissolution and expected colour profile. independent testing matches what was stated. Solid product for skin biology research." },
    { rating: 5, title: "Excellent for wound healing research", body: "One of the cleaner copper peptide preparations I've used. Colour is uniform and dissolution is clean with no aggregates. Very pleased." },
    { rating: 4, title: "Very good product, comprehensive data", body: "full lab report provided with peak analysis. Purity is on-spec. In vitro wound model is performing well." },
    { rating: 5, title: "Consistent and reliable", body: "Second order of GHK-Cu. Batch quality is consistent with the first — purity 99%+, clean dissolution, detailed lot data." },
    { rating: 5, title: "Excellent for dermal biology studies", body: "Using in our fibroblast migration assay. Compound purity is verified and results are consistent with published literature. Will keep ordering." },
    { rating: 4, title: "Clean blue powder, good dissolution", body: "The characteristic colour was present and the compound dissolved cleanly. Our keratinocyte assay results are in line with expected pharmacology." },
  ],
  "Hormonal Peptides": [
    { rating: 5, title: "Excellent purity for reproductive research", body: "Ordered for GnRH receptor studies. Full purity documentation provided. Purity confirmed independently. Clean material." },
    { rating: 4, title: "Good quality hormonal peptide", body: "Purity is within spec based on our independent testing analysis. Reconstitution was clean in sterile water. Documentation more comprehensive than most suppliers." },
    { rating: 5, title: "Reliable for neuroendocrine research", body: "Using for pituitary LH/FSH stimulation studies. Compound purity and activity are both excellent. Detailed purity documentation is a real differentiator." },
    { rating: 5, title: "Best supplier for this compound class", body: "After trying three other vendors, this one offers the most comprehensive documentation and most consistent purity. Invaluable for research." },
    { rating: 4, title: "Well documented and clean", body: "purity profile is clean with minimal secondary peaks. Good quality material." },
    { rating: 5, title: "Excellent for KISS1 pathway research", body: "Running hypothalamic GnRH studies. Kisspeptin-10 is consistently clean batch to batch. Detailed lot-specific purity data is exactly what we need." },
    { rating: 5, title: "Very high purity", body: "In-house verification confirmed 99%+ purity — consistent with stated value. Clean dissolution and stable in aliquots. Excellent." },
  ],
  "Research Peptides": [
    { rating: 5, title: "Comprehensive documentation — exactly what research requires", body: "The full lab report provides everything needed for publication-quality provenance. Compound quality matches. Excellent." },
    { rating: 4, title: "Good product, solid supplier", body: "Purity is within stated spec. Reconstitution clean and straightforward. Documentation more comprehensive than any other supplier at this price point." },
    { rating: 5, title: "Excellent for receptor pharmacology", body: "Using in binding assay studies. Compound purity directly affects assay signal-to-noise. Clean, reproducible results here. Highly recommended." },
    { rating: 5, title: "Best source for research peptides in the UK", body: "Fast UK dispatch, comprehensive documentation, verified purity. This is what every research peptide supplier should aspire to." },
    { rating: 4, title: "Reliable and well priced", body: "Good value for the level of analytical documentation provided. Compound performs as expected in our assays." },
    { rating: 5, title: "Purity verified independently", body: "Ran independent testing in-house — got 98.8%, versus 99.1% stated. That variance is well within measurement error and shows the data is accurate. Will reorder." },
    { rating: 5, title: "Excellent for in vitro studies", body: "Clean material, thorough documentation, and reliable supply. Consistent batch quality is a real bonus for longitudinal research." },
    { rating: 4, title: "Clean profile, good batch", body: "No degradation peaks in testing. Reconstituted cleanly with no visible aggregates. Assay results were reproducible. Good supplier." },
    { rating: 5, title: "Ideal for pharmacology research", body: "The level of analytical data provided here is what you need for serious research use. Compound quality is also excellent. Recommended." },
  ],
  "Cellular Health": [
    { rating: 5, title: "Excellent for mitochondrial research", body: "Ordered for mitochondrial membrane potential assays. Purity and documentation are both excellent — independent testing shows a very clean profile." },
    { rating: 5, title: "Outstanding for metabolic studies", body: "The lot-specific documentation is exactly what our ethics board requires for provenance. Compound quality also excellent." },
    { rating: 4, title: "Good quality mitochondrial peptide", body: "Purity matches stated value. Reconstitution clean in aqueous buffer. Aliquots stable at -80°C. Solid product." },
    { rating: 5, title: "Best source for this compound class", body: "Compared three suppliers for purity and documentation. This is clearly the best option — full lab reports included as standard is rare and valuable." },
    { rating: 5, title: "Reliable for NAD+ pathway research", body: "Using in SIRT1/SIRT3 activity assays. Material purity is excellent and consistent batch to batch. Supports our internal quality standards." },
    { rating: 4, title: "Solid choice for cellular biology research", body: "Clean material, good documentation, reasonable pricing. Cell viability assays are performing well with this batch." },
    { rating: 5, title: "Verified purity across multiple batches", body: "Four separate orders, four clean purity profiles, four accurate data sheets. Lot-to-lot consistency makes this my go-to supplier for this compound." },
    { rating: 5, title: "Excellent for mitophagy studies", body: "Compound is clean and well characterised. Results in our mitochondrial function assay are consistent with published literature. Very pleased." },
    { rating: 4, title: "Good stability, clean reconstitution", body: "Lyophilised powder reconstitutes quickly in water. Stable over several weeks at -20°C. Purity is on-spec. Good choice for cellular research." },
  ],
  "Anti-Inflammatory": [
    { rating: 5, title: "Excellent for inflammatory pathway research", body: "Used in NF-κB signalling studies. Purity and documentation are first rate. Clean reconstitution in PBS." },
    { rating: 4, title: "Good anti-inflammatory peptide", body: "purity data accurate based on our verification. Compound dissolves cleanly and performs as expected in our inflammation assay." },
    { rating: 5, title: "Cleanest batch I've sourced for this compound", body: "Tried two other suppliers. This batch is demonstrably cleaner — our independent testing shows a much cleaner profile. Detailed documentation also stands out." },
    { rating: 5, title: "Excellent for gut biology research", body: "Using in intestinal epithelial cell studies. Compound quality is exceptional and consistent. Detailed purity documentation as standard is a huge differentiator." },
    { rating: 4, title: "Solid cytokine modulation research material", body: "Good purity and clean documentation. TNF-α and IL-6 assays are running well with this material." },
    { rating: 5, title: "High purity, clean dissolution", body: "Dissolved readily in sterile PBS. No cloudiness or aggregation. Our NF-κB reporter assay gave clean results. Excellent." },
    { rating: 4, title: "Good value for this compound class", body: "Purity is within spec and the analytical data is provided. Results in our inflammation model are reproducible. Happy with this." },
  ],
  "Immune Support": [
    { rating: 5, title: "Excellent for immunomodulation research", body: "Ordered for T-cell activation studies. Purity confirmed at 99%+ by in-house testing. One of the best documented peptides I've sourced." },
    { rating: 4, title: "Good immunological research peptide", body: "Clean material with comprehensive documentation. Activity in our NK cell assay is consistent with published data." },
    { rating: 5, title: "Reliable for antimicrobial research", body: "Using LL-37 in pathogen studies. Compound purity is excellent and activity against our test organisms is as expected from literature." },
    { rating: 5, title: "Excellent purity verified independently", body: "Three other suppliers could not match this purity level. Batch came at 99.1% by our independent testing, consistent with stated value." },
    { rating: 4, title: "Excellent for thymic peptide research", body: "Thymosin Alpha-1 purity is above spec. Documentation includes a full lab report as expected. An excellent product and supplier." },
    { rating: 5, title: "Consistently good batches", body: "Three orders of Thymosin Alpha-1 over six months. Each lot has been above 99% purity with consistent purity documentation. Outstanding quality control." },
    { rating: 5, title: "Best peptide for innate immunity research", body: "Clean material, comprehensive documentation, and good batch stability. Our macrophage activation assay results are highly reproducible." },
    { rating: 4, title: "Solid product for immunology work", body: "Purity is within spec and the compound is stable in our standard storage conditions. Documentation is thorough. Good supplier." },
  ],
  "Peptide Blends": [
    { rating: 5, title: "Excellent blend, comprehensive documentation", body: "Each component is documented separately with individual independent testing traces — exactly the level of detail you need for a blend." },
    { rating: 4, title: "Good synergistic research blend", body: "Blend composition matches what's stated. Both peptides dissolve cleanly together. Documentation is comprehensive. Product quality is excellent." },
    { rating: 5, title: "Excellent blend for tissue repair research", body: "Using in our tissue repair model. Having both components documented individually in the data sheet is invaluable. Activity is exactly as literature predicts." },
    { rating: 5, title: "Excellent for combined pathway studies", body: "Individual component documentation makes this suitable for our quality-assured research environment. Both peptides confirmed independently." },
    { rating: 4, title: "Clean dissolution, good activity", body: "Both components dissolved together without aggregation. Activity in our GH secretion assay is as expected. Good value for a well-documented blend." },
    { rating: 5, title: "Perfect for synergistic receptor research", body: "Running dual pathway studies and needed both compounds documented separately. That's provided as standard here. Compound quality is excellent." },
    { rating: 5, title: "Clean, well-characterised blend", body: "Both components verified independently. The blend reconstitutes cleanly and our assay results are consistent with published literature. Very pleased." },
    { rating: 4, title: "Good blend quality", body: "Both components at stated purity. Dissolution clean and rapid. Our in vitro model is performing well with this batch. Will reorder." },
  ],
  "Growth Hormone": [
    { rating: 5, title: "Excellent for GH axis research", body: "Purity documentation includes a full lab report — everything needed for research provenance. Compound reconstitutes cleanly and performs well in our bioassay." },
    { rating: 4, title: "Good quality recombinant peptide", body: "Purity is within spec based on our verification. Documentation comprehensive. Performs as expected in our STAT5 phosphorylation assay." },
    { rating: 5, title: "Best HGH source for research use", body: "Analytical data accompanying this compound is the most comprehensive I've seen from any supplier. full lab reports included. Compound activity is excellent." },
    { rating: 5, title: "Consistent and well documented", body: "Second order of this compound. Batch quality is very consistent — same purity range, same documentation detail. Consistency is essential for our studies." },
    { rating: 4, title: "Comprehensive documentation for GHRH research", body: "All analytical data required is included. JAK2/STAT5 assay is performing as expected. Good supplier for GH-related research compounds." },
    { rating: 5, title: "Reliable lot-to-lot quality", body: "Using Tesamorelin for pituitary axis studies. Three orders in — all above 99% purity, all with the same comprehensive documentation." },
    { rating: 5, title: "Very high purity, clean reconstitution", body: "Lyophilised cake was pristine on arrival. Reconstituted quickly and completely. Our receptor binding assay confirms expected pharmacological activity." },
    { rating: 4, title: "Good choice for GH secretion studies", body: "Purity is within spec and the compound performs predictably in our in vitro assay. Documentation is thorough. Good supplier." },
  ],
  "Cognitive Peptides": [
    { rating: 5, title: "Excellent for neurotrophic research", body: "Using P21 in our neurogenesis model. Compound purity is exceptional and activity in our CNTF receptor assay matches published data." },
    { rating: 4, title: "Good CNTF-derived peptide", body: "Purity verified in-house — matches the stated value. Reconstitution clean in PBS. Neurite outgrowth assay is showing the expected response." },
    { rating: 5, title: "Excellent for antidepressant research", body: "Running TREK-1 channel studies with PE-22-28. Compound purity is excellent and patch-clamp data shows the expected pharmacological profile." },
    { rating: 5, title: "Best source for these research compounds", body: "Detailed lab report with each lot, and accurate lot data. For cognitive peptide research this level of documentation is invaluable." },
    { rating: 4, title: "Well within spec for neuroscience research", body: "Data is accurate based on our verification. Compound performs as expected. Good documentation is what makes this suitable for ethics-approved protocols." },
    { rating: 5, title: "Excellent for neurotrophin studies", body: "Clean material and well-characterised analytically. Our BDNF assay results are consistent with published literature. Very pleased with quality." },
    { rating: 4, title: "Good purity, stable aliquots", body: "Dissolved cleanly in sterile water and remained stable in aliquots at -80°C for four weeks. Purity on-spec. Good choice for cognitive research." },
  ],
};

const DEFAULT_TEMPLATES: ReviewTemplate[] = [
  { rating: 5, title: "Excellent quality and documentation", body: "Purity confirmed by in-house testing — matches the stated value exactly. Reconstitution was clean with no visible particulates. Detailed documentation as standard is a real differentiator." },
  { rating: 5, title: "Best research peptide supplier I've used", body: "Third order. Consistent purity batch to batch, comprehensive documentation, and reliable supply. Earned a long-term customer." },
  { rating: 4, title: "Good product, comprehensive data", body: "Purity within spec, full purity documentation provided. Compound dissolved cleanly and performed as expected in our assay." },
  { rating: 5, title: "Excellent for in vitro research", body: "Clean material, thorough analytical documentation, and reliable supply. Has set the standard for what a research peptide supplier should look like." },
  { rating: 4, title: "Reliable and well documented", body: "Good purity, detailed lot-specific data. Our research protocols require this level of documentation and it delivers consistently." },
  { rating: 5, title: "Independently verified purity", body: "Ran our own testing analysis and got 98.9% — consistent with the 99.1% stated. That accuracy in documentation is rare and appreciated." },
  { rating: 4, title: "Solid choice for research use", body: "All the analytical data you need is provided. Compound quality is good and consistent across orders. Good supplier for research-grade material." },
  { rating: 5, title: "Very high purity, clean reconstitution", body: "Lyophilised cake was intact on arrival. Dissolved rapidly and completely in sterile water. No visible aggregation. Excellent batch." },
  { rating: 4, title: "Good product, stable storage", body: "Aliquots have remained stable at -20°C for six weeks. Purity is within spec. Results in our assay are reproducible. Will reorder." },
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed + 1.7) * 10000;
  return x - Math.floor(x);
}

function seededInt(seed: number, min: number, max: number): number {
  return Math.floor(seededRandom(seed) * (max - min + 1)) + min;
}

function pickTemplate(productId: number, reviewIdx: number, category: string): ReviewTemplate {
  const pool = TEMPLATES_BY_CATEGORY[category] ?? DEFAULT_TEMPLATES;
  const idx = seededInt(productId * 97 + reviewIdx * 37, 0, pool.length - 1);
  return pool[idx];
}

function pickName(productId: number, reviewIdx: number): string {
  const idx = seededInt(productId * 53 + reviewIdx * 19, 0, REVIEWER_NAMES.length - 1);
  return REVIEWER_NAMES[idx];
}

function randomDate(productId: number, reviewIdx: number): Date {
  const now = new Date();
  const daysAgo = seededInt(productId * 23 + reviewIdx * 11, 3, 365);
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  return d;
}

function getPopularityRange(name: string): { min: number; max: number } {
  const n = name.toLowerCase();

  // Tier 1 — very popular compounds (14–20 reviews)
  if (
    n.includes("bpc-157") ||
    n.includes("tb-500") ||
    n.includes("tirzepatide") ||
    n.includes("retatrutide") ||
    n.includes("ipamorelin") ||
    n.includes("cjc-1295") ||
    n.includes("melanotan 2") ||
    n.includes("sermorelin") ||
    n.includes("tesamorelin") ||
    n.includes("ghrp-2") ||
    n.includes("ghrp-6") ||
    n.includes("selank") ||
    n.includes("semax") ||
    n.includes("thymosin alpha") ||
    n.includes("ghk-cu") ||
    n.includes("epithalon")
  ) {
    return { min: 14, max: 20 };
  }

  // Tier 2 — moderately popular (7–13 reviews)
  if (
    n.includes("aod-9604") ||
    n.includes("hexarelin") ||
    n.includes("kisspeptin") ||
    n.includes("oxytocin") ||
    n.includes("gonadorelin") ||
    n.includes("igf-1") ||
    n.includes("mots-c") ||
    n.includes("kpv") ||
    n.includes("ll-37") ||
    n.includes("nad+") ||
    n.includes("cagrilintide") ||
    n.includes("melanotan 1") ||
    n.includes("5-amino") ||
    n.includes("blend") ||
    n.includes("n-acetyl")
  ) {
    return { min: 7, max: 13 };
  }

  // Tier 3 — niche / less-known compounds (3–6 reviews)
  return { min: 3, max: 6 };
}

export async function seedReviews(): Promise<{ seeded: boolean; reason?: string; count?: number }> {
  try {
    const products = await db
      .select({ id: productsCatalogTable.id, name: productsCatalogTable.name, category: productsCatalogTable.category })
      .from(productsCatalogTable)
      .where(eq(productsCatalogTable.isPublished, true));

    if (products.length === 0) {
      return { seeded: false, reason: "no published products found" };
    }

    const existingRows = await db
      .select({ productId: productReviewsTable.productId })
      .from(productReviewsTable)
      .where(eq(productReviewsTable.isApproved, true));

    const coveredProductIds = new Set(existingRows.map((r) => r.productId));

    const rows: typeof productReviewsTable.$inferInsert[] = [];

    products.forEach((product, productIdx) => {
      if (coveredProductIds.has(product.id)) return;

      const { min, max } = getPopularityRange(product.name ?? "");
      const numReviews = seededInt(product.id * 41 + productIdx * 7, min, max);
      const category = product.category ?? "Research Peptides";

      for (let r = 0; r < numReviews; r++) {
        const template = pickTemplate(product.id, r, category);
        const customerName = pickName(product.id, r);
        const createdAt = randomDate(product.id, r);
        const customerId = 90001 + productIdx * 20 + r;

        rows.push({
          productId: product.id,
          customerId,
          customerName,
          rating: template.rating,
          title: template.title,
          body: template.body,
          isApproved: true,
          createdAt,
        });
      }
    });

    if (rows.length === 0) {
      return { seeded: false, reason: "all products already have reviews" };
    }

    const BATCH = 100;
    for (let i = 0; i < rows.length; i += BATCH) {
      await db
        .insert(productReviewsTable)
        .values(rows.slice(i, i + BATCH))
        .onConflictDoNothing();
    }

    return { seeded: true, count: rows.length };
  } catch (err) {
    console.error("Failed to seed reviews:", err);
    return { seeded: false, reason: String(err) };
  }
}
