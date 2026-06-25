import { db } from "@workspace/db";
import { productReviewsTable, productsCatalogTable } from "@workspace/db";
import { eq, inArray, sql } from "drizzle-orm";

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
    { rating: 5, title: "Outstanding purity and fast dispatch", body: "Ordered for in-vitro tissue repair research. HPLC data matches exactly what's on the COA. Dissolved cleanly in sterile water with no particulates. Shipping was faster than expected." },
    { rating: 5, title: "Excellent product for musculoskeletal studies", body: "Used in our lab's tendon repair model. Purity verified independently at 98.7% — well within spec. COA was comprehensive. Will continue ordering from OmniQure." },
    { rating: 4, title: "Very good quality, minor packaging note", body: "Product quality is excellent. The lyophilised cake was intact and reconstituted perfectly. Docking slightly for packaging — the vial insert card was missing. Content itself is top tier." },
    { rating: 5, title: "Best source I've found for this compound", body: "Tried three other suppliers before OmniQure. This is the only one that provided mass spec data alongside HPLC. The data integrity here is on another level." },
    { rating: 5, title: "COA matches independent verification", body: "We ran our own HPLC verification — results came within 0.4% of stated purity. That level of consistency is rare in this space. Repeat customer from here on." },
    { rating: 4, title: "Solid research grade material", body: "Good product for gastrointestinal research protocols. Reconstitution was smooth and the aliquots have remained stable at -20°C for 8 weeks so far." },
    { rating: 3, title: "Product good, dispatch could be quicker", body: "Quality of the peptide itself is fine — purity checks out. Dispatch took longer than advertised during the holiday period. Will order again but plan further ahead." },
    { rating: 5, title: "Consistently high quality batch to batch", body: "On my fourth order now and each batch COA shows consistent purity. That reproducibility matters for research. Excellent supplier." },
    { rating: 4, title: "Good value for the quality", body: "Pricing is fair for the documentation provided. Mass spec and HPLC both included, which is increasingly rare. Minor deduction only because the website checkout could be smoother." },
    { rating: 5, title: "Arrived well packaged and cold", body: "Shipped with appropriate cold packaging — arrived perfectly. Lyophilised cake was pristine. Reconstituted to a clear solution with no visible aggregation." },
  ],
  "Growth Peptides": [
    { rating: 5, title: "Impressive purity documentation", body: "Ordered for GH secretagogue receptor binding studies. Full HPLC chromatogram, ESI-MS data, and COA all provided. The data quality here is what separates OmniQure from competitors." },
    { rating: 4, title: "Good product for GH axis research", body: "Peptide dissolved readily in sterile water and showed expected activity in our cell-based assay. Documentation complete. Slight delay in shipping but product arrived in good condition." },
    { rating: 5, title: "Reliable and well documented", body: "Fourth order from OmniQure this year. Every batch has come with a fresh COA dated to the production run. Purity has been above 99% every time." },
    { rating: 5, title: "Excellent for pulsatile GH research", body: "Used in rat pituitary cell studies. Very clean material — no degradation peaks visible on HPLC. The mass spec confirms correct molecular weight. Highly recommended." },
    { rating: 3, title: "Good peptide, average packaging", body: "The peptide quality is there — purity is acceptable. Packaging was a bit basic compared to other suppliers at this price point. Would prefer more cushioning for international shipping." },
    { rating: 5, title: "Best GHRP I've sourced in two years", body: "Tried several vendors for this compound. OmniQure's batch is notably cleaner. The HPLC profile has minimal secondary peaks. Our in-vitro GH release assay confirms bioactivity." },
    { rating: 4, title: "Well within spec", body: "Independent verification put purity at 98.9% — spot on with the COA. Reconstitution clean. Would only improve with slightly faster dispatch." },
    { rating: 5, title: "Great for IGF-1 pathway studies", body: "Used alongside IGF-1 LR3 for downstream signalling research. Both compounds from OmniQure — both excellent. Consistent lot-to-lot quality is what keeps me coming back." },
    { rating: 4, title: "Solid supplier, will reorder", body: "Good purity, complete documentation, reasonable pricing. Nothing to complain about on the product side. Site could be easier to navigate but product itself is great." },
    { rating: 5, title: "Research grade — genuinely", body: "I've been burned by substandard material before. OmniQure's documentation is the real deal — the HPLC and ESI-MS data were independently verifiable. Grateful to have found them." },
  ],
  "Weight Management": [
    { rating: 5, title: "Excellent purity for metabolic research", body: "Ordered for GLP-1 receptor pharmacology studies. ESI-MS confirmed correct molecular weight within 0.3 Da. COA comprehensive. Reconstitution clean with no particulates." },
    { rating: 5, title: "Top tier GLP-1/GIP agonist material", body: "Running receptor binding assays with this compound. Activity correlates well with published Ki values. Documentation including HPLC chromatogram is excellent." },
    { rating: 4, title: "Great quality product", body: "The peptide itself is excellent — purity checks out and dissolution is straightforward in the supplied buffer. Minor deduction for shipping time which was slightly longer than expected." },
    { rating: 5, title: "Best source for this compound", body: "Tried two other suppliers. OmniQure's material is considerably cleaner based on our in-house HPLC analysis. The COA data is accurate and detailed. Will not go elsewhere." },
    { rating: 3, title: "Good product, website could be better", body: "Material quality is solid — purity is what's stated. The website ordering experience and communication around shipping could be improved. Product itself deserves five stars." },
    { rating: 5, title: "Consistent batch quality", body: "Second order of this compound. COA numbers are very close to the previous batch — good quality control. That consistency is essential for longitudinal research protocols." },
    { rating: 4, title: "Well documented and clean", body: "Full HPLC and mass spec provided. No degradation peaks. Aliquoted and stored at -80°C for our long-term obesity model — performing exactly as expected." },
    { rating: 5, title: "Excellent for adiposity research", body: "Used in our metabolic syndrome study. Compound purity and activity are both exceptional. The COA includes more detail than any other supplier I've used." },
    { rating: 4, title: "Reliable supplier for this compound class", body: "Have now ordered three different GLP-1 related peptides from OmniQure. All three have been excellent. Minor points off only for packaging — could be more robust for international shipment." },
    { rating: 5, title: "Mass spec data included — rare and valuable", body: "The ESI-MS data provided with each lot is something most suppliers don't bother with. For pharmacology research, that confirmation of molecular weight is invaluable." },
  ],
  "Nootropics": [
    { rating: 5, title: "Excellent purity for CNS research", body: "Ordered for BDNF pathway studies. HPLC shows a very clean profile. ESI-MS confirms correct mass. Reconstituted cleanly in sterile saline." },
    { rating: 4, title: "Good anxiolytic peptide, solid documentation", body: "Used in rodent anxiety models. Compound performs as expected based on literature. Documentation is solid. Slight delay in dispatch but product arrived in excellent condition." },
    { rating: 5, title: "Best source I've found for nootropic peptides", body: "Tried several other suppliers. OmniQure's products consistently come with better documentation and higher verified purity. Worth the slightly higher price point." },
    { rating: 5, title: "Impressed with the COA detail", body: "The COA includes HPLC retention time, purity %, area under curve, and ESI-MS data. That level of documentation is what research requires. Highly recommended." },
    { rating: 3, title: "Quality good but dispatch slow", body: "Product is fine — purity is on-spec and reconstitution was clean. Took 8 days to dispatch which was longer than the 3-5 days advertised. Product itself is good." },
    { rating: 5, title: "Reliable for neuropeptide research", body: "Running long-term cognitive studies and need consistent material. OmniQure has been reliable batch to batch. The lot numbers tie to individual COAs which is exactly what we need." },
    { rating: 4, title: "Well within spec", body: "Our HPLC analysis matched the COA within acceptable limits. Clean dissolution, no visible aggregation. Good value for the documentation provided." },
    { rating: 5, title: "Excellent for TREK-1 channel research", body: "Compound is clean and dissolved perfectly. Our patch-clamp recordings show expected pharmacological profile. Happy with purity and activity." },
  ],
  "Longevity Peptides": [
    { rating: 5, title: "Exceptional purity for telomere research", body: "Ordered for telomerase activity assays. Purity 99.2% by our in-house HPLC — matches COA exactly. This is what research-grade means. Excellent supplier." },
    { rating: 5, title: "Detailed documentation — very impressive", body: "The COA provided includes HPLC chromatogram with peak analysis and ESI-MS spectrum. No other supplier I've used provides this level of detail as standard." },
    { rating: 4, title: "Good quality, fast delivery", body: "Arrived well within the estimated timeframe. Lyophilised cake intact. Reconstitution smooth. Minor dock for the website which is a bit hard to navigate, but product is excellent." },
    { rating: 5, title: "Consistently high quality", body: "Third order this year. Each batch COA shows purity consistently above 99%. For longitudinal research that reproducibility is critical. Outstanding supplier." },
    { rating: 3, title: "Good product, packaging improved needed", body: "Previous order was better packaged — this one had less bubble wrap around the vial. Peptide quality is still excellent though. Just a note for future orders." },
    { rating: 5, title: "Perfect for pineal peptide research", body: "The purity and mass spec data are exactly what we need for our antioxidant and longevity pathway studies. Clean material, well documented. Will continue ordering." },
    { rating: 4, title: "Solid choice for this compound class", body: "OmniQure stands out for providing ESI-MS data as standard. For a tetrapeptide, correct mass confirmation is reassuring. Purity also within spec. Good supplier." },
    { rating: 5, title: "Excellent for life extension research", body: "Using in our ageing biology study. Compound performance in cell-based assays matches literature values. COA data is comprehensive and accurate." },
  ],
  "Skin & Repair": [
    { rating: 5, title: "Best GHK-Cu I've sourced", body: "The characteristic blue colour of lyophilised GHK-Cu was present — a good first indicator. HPLC confirmed 99.1% purity. Dissolved cleanly in sterile water. Excellent batch." },
    { rating: 5, title: "Outstanding for collagen research", body: "Using in fibroblast cell culture studies. Activity in our collagen synthesis assay is exactly as literature predicts. Documentation is exemplary — HPLC and mass spec both included." },
    { rating: 4, title: "High quality copper peptide", body: "Good dissolution and expected colour profile for GHK-Cu. HPLC matches COA. Minor deduction only because shipping notification was delayed, but product arrived fine." },
    { rating: 5, title: "Excellent for wound healing research", body: "This is one of the cleaner copper peptide preparations I've used. The blue colour is uniform and dissolution is clean with no aggregates. COA comprehensive and accurate." },
    { rating: 4, title: "Very good product, comprehensive COA", body: "Full HPLC chromatogram and ESI-MS data provided. Purity is on-spec. Our in vitro wound model is performing well. Would recommend for skin biology research." },
    { rating: 5, title: "Consistent and reliable", body: "Second order of GHK-Cu from OmniQure. Batch quality is consistent with the first — purity 99%+, clean dissolution, detailed COA. They've earned a long-term customer." },
    { rating: 3, title: "Good peptide, slightly slow shipping", body: "The compound quality is good — independent purity check confirms the COA. Dispatch took a few days longer than expected. Product quality itself is five stars." },
  ],
  "Hormonal Peptides": [
    { rating: 5, title: "Excellent purity for reproductive research", body: "Ordered for GnRH receptor studies. Full mass spec and HPLC documentation provided. Purity confirmed independently. Clean material with fast shipping." },
    { rating: 4, title: "Good quality hormonal peptide", body: "Purity is within spec based on our HPLC analysis. Reconstitution was clean in sterile water. Documentation provided is more comprehensive than most suppliers. Good choice." },
    { rating: 5, title: "Reliable for neuroendocrine research", body: "Using for pituitary LH/FSH stimulation studies. Compound purity and activity are both excellent. The mass spec confirmation is a real differentiator versus other vendors." },
    { rating: 5, title: "Best supplier for this compound class", body: "After trying three other vendors, OmniQure offers the most comprehensive documentation and the most consistent purity. The COA with lot-specific data is invaluable." },
    { rating: 4, title: "Well documented and clean", body: "HPLC profile is clean with minimal secondary peaks. ESI-MS confirms correct molecular weight. Minor points off only for packaging which could be slightly more robust." },
    { rating: 5, title: "Excellent for KISS1 pathway research", body: "Running hypothalamic GnRH studies. Kisspeptin-10 from OmniQure is consistently clean batch to batch. The detailed COA with both HPLC and MS data is exactly what we need." },
  ],
  "Research Peptides": [
    { rating: 5, title: "Comprehensive documentation — exactly what research requires", body: "The HPLC chromatogram, ESI-MS spectrum, and COA together provide everything needed for publication-quality provenance. Compound quality matches the documentation. Excellent." },
    { rating: 4, title: "Good product, solid supplier", body: "Purity is within stated spec. Reconstitution clean and straightforward. Documentation more comprehensive than any other supplier I've used at this price point." },
    { rating: 5, title: "Excellent for receptor pharmacology", body: "Using in binding assay studies. The compound purity directly affects assay signal-to-noise. OmniQure's material gives clean, reproducible results. Highly recommended." },
    { rating: 3, title: "Good compound, average communication", body: "Product quality is fine — purity is on-spec. Had one unanswered query about storage conditions. Product itself deserves more stars but customer service needs improvement." },
    { rating: 5, title: "Best source for research peptides in the UK", body: "Fast UK dispatch, comprehensive COA, verified purity. This is what every research peptide supplier should aspire to. Very impressed with the documentation quality." },
    { rating: 4, title: "Reliable and well priced", body: "Good value for the level of analytical documentation provided. Compound performs as expected in our assays. Minor dock for slight delay in shipping notification." },
    { rating: 5, title: "Purity verified independently", body: "We ran HPLC in-house — result was 98.8%, versus 99.1% on the COA. That small variance is well within measurement error and shows the COA data is accurate. Will reorder." },
    { rating: 5, title: "Excellent for in vitro studies", body: "Clean material, thorough documentation, and reliable shipping. Three criteria for a good peptide supplier and OmniQure ticks all three. Consistent batch quality is a bonus." },
  ],
  "Cellular Health": [
    { rating: 5, title: "Excellent for mitochondrial research", body: "Ordered for mitochondrial membrane potential assays. Purity and documentation are both excellent — HPLC shows a clean profile and ESI-MS confirms correct molecular weight." },
    { rating: 5, title: "Outstanding documentation for metabolic studies", body: "The lot-specific COA with HPLC chromatogram is exactly what our ethics board requires for provenance documentation. Compound quality also excellent. Will continue ordering." },
    { rating: 4, title: "Good quality mitochondrial peptide", body: "Purity matches COA. Reconstitution clean in aqueous buffer. Aliquots have been stable at -80°C. Minor deduction for slightly slow dispatch but product quality is excellent." },
    { rating: 5, title: "Best source for this compound class", body: "Compared three suppliers for purity and documentation. OmniQure is clearly the best option — ESI-MS data included as standard is rare and valuable for research use." },
    { rating: 5, title: "Reliable for NAD+ pathway research", body: "Using in SIRT1/SIRT3 activity assays. Material purity is excellent and consistent batch to batch. The full analytical documentation supports our internal quality standards." },
    { rating: 3, title: "Good peptide, occasional shipping delays", body: "Product quality is consistently good — purity on-spec, documentation comprehensive. However, I have experienced delayed shipping on two of four orders. Product itself is excellent." },
    { rating: 4, title: "Solid choice for cellular biology research", body: "Clean material, good documentation, reasonable pricing. Our cell viability assays are performing well with this batch. Would only improve with slightly faster dispatch." },
    { rating: 5, title: "Verified purity across multiple batches", body: "Four separate orders, four clean HPLC profiles, four accurate COAs. That lot-to-lot consistency is what makes OmniQure my go-to supplier for this compound." },
  ],
  "Anti-Inflammatory": [
    { rating: 5, title: "Excellent for inflammatory pathway research", body: "Used in NF-κB signalling studies. Purity and documentation are both first rate. ESI-MS confirms correct tripeptide mass. Clean reconstitution in PBS." },
    { rating: 4, title: "Good anti-inflammatory peptide", body: "COA and HPLC data both provided and accurate based on our verification. Compound dissolves cleanly and performs as expected in our inflammation assay." },
    { rating: 5, title: "Best source for KPV", body: "Tried two other suppliers. This batch is demonstrably cleaner — our HPLC shows a much cleaner profile. The detailed documentation also sets OmniQure apart." },
    { rating: 5, title: "Excellent for gut biology research", body: "Using in intestinal epithelial cell studies. Compound quality is exceptional and consistent. The mass spec data as standard is a huge differentiator." },
    { rating: 3, title: "Good product, slow dispatch this order", body: "Compound quality is fine as always. This order dispatched 6 days after purchase, which was slower than my previous experiences. Product itself continues to be excellent." },
    { rating: 4, title: "Solid cytokine modulation research material", body: "Good purity and clean documentation. Our TNF-α and IL-6 assays are running well with this material. Packaging could be slightly improved for international orders." },
  ],
  "Immune Support": [
    { rating: 5, title: "Excellent for immunomodulation research", body: "Ordered for T-cell activation studies. Purity confirmed at 99%+ by in-house HPLC. Mass spec data included in COA. One of the best documented peptides I've sourced." },
    { rating: 4, title: "Good immunological research peptide", body: "Clean material with comprehensive documentation. Activity in our NK cell assay is consistent with published data. Minor note — could include storage guidance on vial label." },
    { rating: 5, title: "Reliable for antimicrobial research", body: "Using LL-37 in pathogen studies. Compound purity is excellent and activity against our test organisms is as expected from literature. Will continue ordering from OmniQure." },
    { rating: 5, title: "Best cathelicidin source I've found", body: "Three other suppliers could not match this purity level. OmniQure's batch came at 99.1% by our HPLC, consistent with their COA. The ESI-MS data is also accurate." },
    { rating: 3, title: "Good compound quality, website improvements needed", body: "The peptide itself is excellent — purity spot on, documentation comprehensive. The website order tracking could be improved. Will continue ordering despite this." },
    { rating: 4, title: "Excellent for thymic peptide research", body: "Thymosin Alpha-1 purity is above spec. Documentation includes HPLC and mass spec as expected. Slight delay in shipping but otherwise an excellent product and supplier." },
    { rating: 5, title: "Consistently good batches", body: "Three orders of Thymosin Alpha-1 over six months. Each lot has been above 99% purity with consistent ESI-MS data. Outstanding quality control for a research supplier." },
  ],
  "Peptide Blends": [
    { rating: 5, title: "Excellent blend, comprehensive documentation", body: "The COA documents each component separately with individual HPLC traces — exactly the level of detail you need for a blend. Both components confirmed by mass spec. Excellent." },
    { rating: 4, title: "Good synergistic research blend", body: "The blend composition matches what's stated. Both peptides dissolve cleanly together. Documentation is comprehensive. Slight dock for shipping time but product quality is excellent." },
    { rating: 5, title: "Best sourced blend for research use", body: "Using in our tissue repair model. Having both components documented individually in the COA is invaluable. Activity in our assay system is exactly as literature predicts." },
    { rating: 5, title: "Excellent for combined pathway studies", body: "The individual component documentation makes this blend suitable for our quality-assured research environment. Both peptides confirmed by HPLC and ESI-MS. Excellent." },
    { rating: 3, title: "Good blend quality, communication could improve", body: "Product quality is solid — both components verified. Had difficulty getting a response to a technical query. The blend itself deserves five stars though." },
    { rating: 4, title: "Clean dissolution, good activity", body: "Both components dissolved together without aggregation — a good sign of purity. Activity in our GH secretion assay is as expected. Good value for a well-documented blend." },
    { rating: 5, title: "Perfect for synergistic receptor research", body: "Running dual pathway studies and needed both compounds documented separately. OmniQure provides that as standard. Compound quality is also excellent. Ideal supplier." },
  ],
  "Growth Hormone": [
    { rating: 5, title: "Excellent for GH axis research", body: "Purity documentation includes HPLC, ESI-MS, and COA — everything needed for research provenance. The compound itself reconstitutes cleanly and performs well in our bioassay." },
    { rating: 4, title: "Good quality recombinant peptide", body: "Purity is within spec based on our verification. Documentation comprehensive. The compound performs as expected in our STAT5 phosphorylation assay. Will reorder." },
    { rating: 5, title: "Best HGH source for research use", body: "The analytical data accompanying this compound is the most comprehensive I've seen from any supplier. ESI-MS and HPLC both included. Compound activity is also excellent." },
    { rating: 5, title: "Consistent and well documented", body: "Second order of Somatropin from OmniQure. Batch quality is very consistent — same purity range, same COA detail level. That consistency is essential for our studies." },
    { rating: 3, title: "Good compound, slight delivery delay", body: "Product quality is excellent as usual. This order was slightly delayed — took a week longer than estimated. No issues with the compound itself, which is top quality." },
    { rating: 4, title: "Comprehensive documentation for GHRH research", body: "COA includes all analytical data required. Our JAK2/STAT5 assay is performing as expected with this material. Good supplier for GH-related research compounds." },
    { rating: 5, title: "Reliable lot-to-lot quality", body: "Using Tesamorelin for pituitary axis studies. Three orders in — all above 99% purity, all with the same comprehensive documentation. Excellent research supplier." },
  ],
  "Cognitive Peptides": [
    { rating: 5, title: "Excellent for neurotrophic research", body: "Using P21 in our neurogenesis model. Compound purity is exceptional and activity in our CNTF receptor assay matches published data. Documentation is comprehensive." },
    { rating: 4, title: "Good CNTF-derived peptide", body: "Purity verified in-house — matches the COA. Reconstitution clean in PBS. Our neurite outgrowth assay is showing the expected response. Good research supplier." },
    { rating: 5, title: "Excellent for antidepressant research", body: "Running TREK-1 channel studies with PE-22-28. Compound purity is excellent and our patch-clamp data shows the expected pharmacological profile. Highly recommended." },
    { rating: 5, title: "Best source for these research compounds", body: "ESI-MS data as standard, HPLC chromatogram with each lot, and accurate COA. For cognitive peptide research this level of documentation is invaluable. Will not go elsewhere." },
    { rating: 3, title: "Good product, slow this time", body: "Compound quality is fine — purity within spec and reconstitution clean. Dispatch was slower than usual this order. Product itself continues to be excellent." },
    { rating: 4, title: "Well within spec for neuroscience research", body: "COA data is accurate based on our verification. Compound performs as expected. Good documentation is what makes this suitable for our ethics-approved protocols." },
  ],
};

const DEFAULT_TEMPLATES: ReviewTemplate[] = [
  { rating: 5, title: "Excellent quality and documentation", body: "Purity confirmed by in-house HPLC — matches the COA exactly. Reconstitution was clean with no visible particulates. ESI-MS data as standard is a real differentiator. Highly recommended." },
  { rating: 5, title: "Best research peptide supplier I've used", body: "Third order from OmniQure. Consistent purity batch to batch, comprehensive documentation, and reliable shipping. They've earned a long-term customer." },
  { rating: 4, title: "Good product, comprehensive COA", body: "Purity within spec, HPLC and mass spec both provided. Compound dissolved cleanly and performed as expected. Minor dock for dispatch speed." },
  { rating: 5, title: "Excellent for in vitro research", body: "Clean material, thorough analytical documentation, and reliable shipping. OmniQure has set the standard for what a research peptide supplier should look like." },
  { rating: 4, title: "Reliable and well documented", body: "Good purity, detailed COA, and accurate lot-specific data. Our research protocols require this level of documentation and OmniQure delivers consistently." },
  { rating: 3, title: "Good quality, shipping could improve", body: "Product quality is excellent — purity is on-spec and documentation is comprehensive. Dispatch took longer than advertised this time. Compound itself is great." },
  { rating: 5, title: "Independently verified purity", body: "We ran our own HPLC analysis and got 98.9% — consistent with the 99.1% stated on the COA. That accuracy in documentation is rare and appreciated." },
  { rating: 4, title: "Solid choice for research use", body: "All the analytical data you need is provided. Compound quality is good and has been consistent across two orders. Good supplier for research-grade material." },
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

export async function seedReviews(): Promise<{ seeded: boolean; reason?: string; count?: number }> {
  try {
    const products = await db
      .select({ id: productsCatalogTable.id, category: productsCatalogTable.category })
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

      const numReviews = seededInt(product.id * 41 + productIdx * 7, 3, 20);
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
