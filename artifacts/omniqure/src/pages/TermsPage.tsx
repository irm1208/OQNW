import { Link } from "wouter";
import { Shield, ChevronRight } from "lucide-react";

const LAST_UPDATED = "1 May 2025";
const COMPANY = "OmniQure Peptide Research Institute";
const COMPANY_SHORT = "OmniQure";
const EMAIL = "legal@omniqure.com";

interface SectionProps {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, number, title, children }: SectionProps) {
  return (
    <section id={id} className="mb-10">
      <div className="flex items-baseline gap-3 mb-3">
        <span
          className="font-bold flex-shrink-0"
          style={{ fontSize: "13px", color: "#1B5CB5", minWidth: "24px" }}
        >
          {number}.
        </span>
        <h2 className="font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
          {title}
        </h2>
      </div>
      <div className="pl-9 space-y-3 text-sm leading-relaxed" style={{ color: "#374151", lineHeight: "1.85" }}>
        {children}
      </div>
    </section>
  );
}

const toc = [
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "ruo", label: "Research Use Only" },
  { id: "eligibility", label: "Eligibility" },
  { id: "products", label: "Products & Descriptions" },
  { id: "orders", label: "Orders & Payment" },
  { id: "pricing", label: "Pricing & Availability" },
  { id: "shipping", label: "Shipping & Delivery" },
  { id: "returns", label: "Returns & Refunds" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "ip", label: "Intellectual Property" },
  { id: "privacy", label: "Privacy & Data" },
  { id: "governing", label: "Governing Law" },
  { id: "changes", label: "Changes to Terms" },
  { id: "contact", label: "Contact" },
];

export default function TermsPage() {
  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", padding: "40px 0 32px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center gap-2 text-xs mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
            <ChevronRight size={12} />
            <span style={{ color: "rgba(255,255,255,0.8)" }}>Terms & Conditions</span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl flex items-center justify-center" style={{ width: "40px", height: "40px", backgroundColor: "rgba(255,255,255,0.12)" }}>
              <Shield size={20} style={{ color: "#93C5FD" }} />
            </div>
            <h1 className="font-bold text-white" style={{ fontSize: "clamp(22px, 4vw, 32px)" }}>
              Terms & Conditions
            </h1>
          </div>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
            Last updated: {LAST_UPDATED} · {COMPANY}
          </p>
        </div>
      </div>

      {/* RUO Banner */}
      <div style={{ backgroundColor: "#FEF2F2", borderBottom: "1px solid #FECACA" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-start gap-2">
          <span style={{ fontSize: "15px", flexShrink: 0 }}>⚠️</span>
          <p className="text-xs leading-relaxed font-medium" style={{ color: "#B91C1C" }}>
            <strong>Important:</strong> All products sold by {COMPANY_SHORT} are strictly for in-vitro laboratory research use only. They are not medicines, drugs, food supplements, or approved for human or veterinary use. By purchasing, you confirm you are 18 or over and a qualified researcher.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-10">
        <div className="flex gap-10">
          {/* Table of Contents — desktop sticky */}
          <aside className="hidden lg:block" style={{ width: "220px", flexShrink: 0 }}>
            <div className="sticky top-24">
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#94A3B8" }}>Contents</p>
              <nav className="space-y-1">
                {toc.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2 text-xs py-1 transition-colors hover:text-blue-600"
                    style={{ color: "#64748B", textDecoration: "none" }}
                  >
                    <span style={{ color: "#BFDBFE", fontSize: "11px", fontWeight: 700, minWidth: "18px" }}>{i + 1}.</span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div
              className="rounded-2xl p-6 md:p-8 mb-6"
              style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 16px rgba(15,23,42,0.05)" }}
            >
              <p className="text-sm leading-relaxed mb-4" style={{ color: "#475569", lineHeight: "1.85" }}>
                These Terms and Conditions ("Terms") govern your use of the {COMPANY} website and your purchase of products from us. Please read them carefully before placing an order. By accessing our website or placing an order, you agree to be bound by these Terms.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
                These Terms constitute a legally binding agreement between you and {COMPANY} (trading as "{COMPANY_SHORT}").
              </p>
            </div>

            <Section id="acceptance" number="1" title="Acceptance of Terms">
              <p>By accessing this website, creating an account, or placing an order, you confirm that you have read, understood, and agree to be bound by these Terms in full. If you do not agree, you must not use this website or purchase from us.</p>
              <p>We reserve the right to update these Terms at any time. Continued use of the website following any changes constitutes acceptance of the revised Terms. The date of the most recent revision appears at the top of this page.</p>
            </Section>

            <Section id="ruo" number="2" title="Research Use Only — Critical Notice">
              <div className="rounded-xl p-4" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
                <p className="font-bold mb-2" style={{ color: "#B91C1C" }}>All products are sold strictly for in-vitro laboratory research use only.</p>
                <ul className="space-y-1.5 text-sm" style={{ color: "#7F1D1D" }}>
                  {[
                    "Products are NOT approved by the FDA, MHRA, EMA, or any other regulatory authority for human or veterinary use.",
                    "Products are NOT intended to diagnose, treat, cure, or prevent any disease or medical condition.",
                    "Products must NOT be administered to humans or animals under any circumstances.",
                    "Products are NOT food supplements, medicines, or veterinary preparations.",
                    "Any misuse of products is strictly prohibited and solely the responsibility of the purchaser.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span style={{ flexShrink: 0 }}>•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p>By purchasing any product from {COMPANY_SHORT}, you confirm that you fully understand and accept these restrictions. {COMPANY_SHORT} accepts no liability whatsoever for any harm, loss, or legal consequence arising from misuse of its products.</p>
            </Section>

            <Section id="eligibility" number="3" title="Eligibility to Purchase">
              <p>To purchase from {COMPANY_SHORT}, you must:</p>
              <ul className="space-y-1 pl-4">
                {[
                  "Be at least 18 years of age;",
                  "Be a qualified researcher, scientist, or academic professional with legitimate research purposes;",
                  "Be purchasing for bona fide in-vitro laboratory research only;",
                  "Comply with all applicable laws and regulations in your jurisdiction regarding the purchase, possession, and use of research chemicals;",
                  "Not be located in a jurisdiction where the purchase or possession of these products is prohibited.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ flexShrink: 0, color: "#1B5CB5" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p>{COMPANY_SHORT} reserves the right to refuse any order at its sole discretion, including where there is reasonable suspicion that these eligibility requirements are not met.</p>
            </Section>

            <Section id="products" number="4" title="Products & Descriptions">
              <p>We make every effort to ensure that product descriptions, specifications, images, and technical data are accurate. However, we do not warrant that descriptions are error-free, complete, or current. Technical data including purity percentages, molecular weights, and sequence information is provided for research reference purposes only.</p>
              <p>Certificate of Analysis (COA) documents are generated based on batch testing data. Actual lot-specific COAs are available upon request for qualified researchers. Purity figures stated represent independent analysis results from representative batch testing.</p>
              <p>Product images are representative and may differ from the actual product received. All peptides are supplied as lyophilised (freeze-dried) powder in sealed vials unless otherwise stated.</p>
              <p>We reserve the right to withdraw any product from sale at any time without notice.</p>
            </Section>

            <Section id="orders" number="5" title="Orders & Payment">
              <p>All orders placed through our website constitute an offer to purchase. We reserve the right to accept or reject any order. An order is accepted only when we dispatch the goods and send a dispatch confirmation email.</p>
              <p>Payment is required in full at the time of ordering. We accept major credit and debit cards, as well as cryptocurrency payments. All card transactions are processed through PCI-DSS compliant payment processors. We do not store card details.</p>
              <p>Prices are displayed in your selected currency. Where currency conversion tools are provided, these are indicative only. The final charge will be at the prevailing rate applied by your card issuer or payment provider.</p>
              <p>We reserve the right to cancel an order and issue a full refund at any time, for any reason, including suspected fraud, export restriction issues, or stock availability.</p>
            </Section>

            <Section id="pricing" number="6" title="Pricing & Availability">
              <p>All prices are displayed inclusive of any applicable taxes where stated. Prices are subject to change without notice. The price applicable to your order is the price displayed at the time you place the order.</p>
              <p>Stock availability is updated regularly but cannot be guaranteed in real time. In the event that a product you have ordered is out of stock, we will contact you to offer a refund, substitute product, or backorder arrangement.</p>
              <p>Promotional pricing, discount codes, and bundle offers may be subject to additional terms and may be withdrawn at any time.</p>
            </Section>

            <Section id="shipping" number="7" title="Shipping & Delivery">
              <p>Please refer to our full <Link href="/shipping" style={{ color: "#1B5CB5", textDecoration: "none", fontWeight: 600 }}>Shipping Policy</Link> for complete information on delivery timescales, carriers, packaging, and international shipping.</p>
              <p>Risk of loss and title for products passes to you upon dispatch. {COMPANY_SHORT} is not responsible for delays, losses, or damages arising from carrier handling once products have left our facility.</p>
              <p>It is your responsibility to ensure that importation of research chemicals is permitted in your jurisdiction. We accept no liability for products seized, delayed, or destroyed by customs authorities.</p>
            </Section>

            <Section id="returns" number="8" title="Returns & Refunds">
              <p>Due to the nature of research chemicals and the strict storage and handling requirements involved, we are generally unable to accept returns of opened or dispatched products. This does not affect your statutory rights under UK consumer law where applicable.</p>
              <p>If you receive a product that is:</p>
              <ul className="space-y-1 pl-4">
                {[
                  "Visibly damaged upon arrival;",
                  "Materially different from the product ordered;",
                  "Missing from your order;",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ flexShrink: 0, color: "#1B5CB5" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p>Please contact us at <a href={`mailto:${EMAIL}`} style={{ color: "#1B5CB5" }}>{EMAIL}</a> within 48 hours of receipt with photographic evidence. We will investigate and, where appropriate, offer a replacement or refund at our discretion.</p>
              <p>Refunds, where approved, will be issued to the original payment method within 5–10 business days.</p>
            </Section>

            <Section id="liability" number="9" title="Limitation of Liability">
              <p>{COMPANY_SHORT}'s total liability to you in connection with any order shall not exceed the price paid for the relevant products.</p>
              <p>To the fullest extent permitted by law, {COMPANY_SHORT} excludes all liability for:</p>
              <ul className="space-y-1 pl-4">
                {[
                  "Any indirect, consequential, or special loss or damage;",
                  "Loss of profit, revenue, data, or business;",
                  "Any harm, injury, or legal consequence resulting from misuse or unauthorised use of our products;",
                  "Actions taken by regulatory or law enforcement authorities in relation to your purchase or use of products;",
                  "Any reliance on information provided on this website for purposes other than legitimate research.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ flexShrink: 0, color: "#1B5CB5" }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p>Nothing in these Terms limits our liability for death or personal injury caused by our negligence, or for fraud or fraudulent misrepresentation, or any other liability that cannot be excluded by law.</p>
            </Section>

            <Section id="ip" number="10" title="Intellectual Property">
              <p>All content on this website, including text, graphics, logos, images, product descriptions, and COA documents, is the property of {COMPANY} or its licensors and is protected by copyright and other intellectual property laws.</p>
              <p>You may not reproduce, distribute, modify, or republish any content from this website without our prior written consent. You may download or print content for personal, non-commercial research reference purposes only.</p>
            </Section>

            <Section id="privacy" number="11" title="Privacy & Data Protection">
              <p>Your use of this website and our processing of your personal data are governed by our <Link href="/privacy" style={{ color: "#1B5CB5", textDecoration: "none", fontWeight: 600 }}>Privacy Policy</Link>, which forms part of these Terms.</p>
              <p>We comply with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018. By using this website, you consent to the processing of your personal data as described in our Privacy Policy.</p>
            </Section>

            <Section id="referral" number="12" title="Refer a Friend Programme">
              <p>OmniQure operates a Refer a Friend programme under which existing registered customers ("Referrers") and the new customers they refer ("Referred Customers") may each earn £25 account credit when the Referred Customer places their first order using the Referrer's unique referral link.</p>
              <p><strong>Eligibility.</strong> The Referred Customer must be a genuinely new customer who has never previously held an account or placed an order with OmniQure. The Referred Customer must register and place their first order using the Referrer's link. The Referrer must hold an active, verified account in good standing.</p>
              <p><strong>Reward mechanics.</strong> Upon the Referred Customer's first order being fully paid and not subsequently refunded, cancelled, or charged back, £25 (or local currency equivalent) account credit is added automatically to both the Referrer's and the Referred Customer's accounts. Credit is applied automatically at checkout against a future order, up to the order's value, and has no standalone cash value. Each account may hold a maximum unredeemed credit balance of £50 (or local currency equivalent) at any time; credit earned beyond this cap is not issued. Credit is non-transferable and does not expire while the account remains active.</p>
              <p><strong>Referred Customer discount.</strong> The Referred Customer automatically receives 10% off their first order, and Bundle & Save free-item tiers apply in addition, on every order with no exceptions: orders of 3-4 items receive a free 10ml bacteriostatic water; orders of 5-9 items receive the cheapest peptide in the cart free instead; and orders of 10 or more items receive the 2 cheapest peptides free instead. These tiers are mutually exclusive and do not stack — each order receives the reward for its own tier only.</p>
              <p><strong>Prohibited conduct.</strong> The following are strictly prohibited and constitute fraud:</p>
              <ul style={{ paddingLeft: "20px", lineHeight: 2 }}>
                <li>Self-referral — referring yourself using a different email address, name, or any other account.</li>
                <li>Creating fake, duplicate, or third-party accounts solely to generate referral credit.</li>
                <li>Any coordinated scheme to abuse the referral programme, including instructing others to create accounts with the intention of immediate refund or cancellation.</li>
              </ul>
              <p><strong>Fraud detection.</strong> Referred accounts are automatically verified against existing accounts using email address, billing address, delivery address, payment method, IP address, and device fingerprint. OmniQure reserves the right to apply additional manual review at any time.</p>
              <p><strong>Consequences of misuse.</strong> Where OmniQure determines, in its sole discretion, that the referral programme has been abused, we reserve the right to: immediately void all associated credit; permanently terminate all accounts involved; cancel any pending orders without refund; claw back the value of any credit already redeemed; and refer the matter to relevant authorities where fraud is suspected. OmniQure's decisions regarding programme eligibility, fraud, and enforcement are final.</p>
              <p>OmniQure reserves the right to amend, suspend, or terminate the Refer a Friend programme at any time without prior notice.</p>
            </Section>

            <Section id="governing" number="13" title="Governing Law & Disputes">
              <p>These Terms and any dispute or claim arising out of or in connection with them shall be governed by and construed in accordance with the laws of England and Wales.</p>
              <p>Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales. If you are a consumer based in another jurisdiction, this does not affect any mandatory consumer rights you may have under local law.</p>
              <p>We aim to resolve any complaints or disputes informally and in good faith. If you have a complaint, please contact us first at <a href={`mailto:${EMAIL}`} style={{ color: "#1B5CB5" }}>{EMAIL}</a>.</p>
            </Section>

            <Section id="changes" number="14" title="Changes to These Terms">
              <p>We reserve the right to modify these Terms at any time. Any changes will be posted on this page with an updated revision date. Where changes are material, we will endeavour to notify registered customers by email.</p>
              <p>Your continued use of the website or placement of an order following any changes constitutes acceptance of the revised Terms.</p>
            </Section>

            <Section id="contact" number="15" title="Contact Us">
              <div className="rounded-xl p-4" style={{ backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}>
                <p className="font-semibold mb-2" style={{ color: "#1240A0" }}>{COMPANY}</p>
                <p><strong>Legal enquiries:</strong> <a href={`mailto:${EMAIL}`} style={{ color: "#1B5CB5" }}>{EMAIL}</a></p>
                <p><strong>General enquiries:</strong> <a href="mailto:research@omniqure.com" style={{ color: "#1B5CB5" }}>research@omniqure.com</a></p>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
