import { Lock, Check } from "lucide-react";
import PageHero from "@/components/PageHero";
import { useSEO } from "@/hooks/useSEO";

const LAST_UPDATED = "1 May 2025";
const COMPANY = "OmniQure";
const COMPANY_SHORT = "OmniQure";
const EMAIL_PRIVACY = "support@omniqure.com";
const EMAIL_GENERAL = "support@omniqure.com";

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
        <span className="font-medium flex-shrink-0" style={{ fontSize: "13px", color: "var(--cobalt)", minWidth: "24px" }}>{number}.</span>
        <h2 className="font-semibold" style={{ fontSize: "18px", letterSpacing: "-0.01em", color: "var(--ink)" }}>{title}</h2>
      </div>
      <div className="pl-9 space-y-3 text-sm leading-relaxed" style={{ color: "var(--graphite)", lineHeight: "1.85" }}>
        {children}
      </div>
    </section>
  );
}

const toc = [
  { id: "who-we-are", label: "Who We Are" },
  { id: "data-collected", label: "Data We Collect" },
  { id: "how-we-use", label: "How We Use Your Data" },
  { id: "legal-basis", label: "Legal Basis for Processing" },
  { id: "sharing", label: "Sharing Your Data" },
  { id: "cookies", label: "Cookies & Tracking" },
  { id: "retention", label: "Data Retention" },
  { id: "your-rights", label: "Your Rights" },
  { id: "security", label: "Security" },
  { id: "international", label: "International Transfers" },
  { id: "children", label: "Children's Privacy" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact & Complaints" },
];

export default function PrivacyPage() {
  useSEO({
    title: "Privacy Policy",
    description: "OmniQure privacy policy — how we collect, use, and protect your personal data in accordance with UK GDPR.",
    canonicalPath: "/privacy",
  });
  return (
    <div style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", backgroundColor: "#fff", minHeight: "100vh" }}>
      <PageHero crumbs={[{ label: "Privacy Policy" }]} eyebrow="Legal" icon={Lock} title="Privacy Policy">
        <p>Last updated: {LAST_UPDATED} · {COMPANY}</p>
      </PageHero>

      {/* GDPR badge */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid rgba(11,18,32,0.09)" }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-4 flex flex-wrap gap-2">
          {[
            "UK GDPR Compliant",
            "Data Protection Act 2018",
            "SSL Encrypted",
            "No Data Selling",
            "Right to Erasure",
          ].map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-1.5 rounded-full px-3 py-1"
              style={{ fontSize: "12px", fontWeight: 500, color: "var(--graphite)", border: "1px solid rgba(11,18,32,0.09)", backgroundColor: "#fff" }}
            >
              <Check size={12} aria-hidden="true" style={{ color: "var(--cobalt)" }} /> {badge}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-10">
        <div className="flex gap-10">
          {/* TOC */}
          <aside className="hidden lg:block" style={{ width: "220px", flexShrink: 0 }}>
            <div className="sticky top-24">
              <p className="uppercase mb-3" style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.18em", color: "var(--graphite)" }}>Contents</p>
              <nav className="space-y-1">
                {toc.map((item, i) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="flex items-center gap-2 text-xs py-1 transition-colors hover:text-[var(--ink)]"
                    style={{ color: "var(--graphite)", textDecoration: "none" }}
                  >
                    <span style={{ color: "rgba(74,85,104,0.45)", fontSize: "11px", fontWeight: 500, minWidth: "18px" }}>{i + 1}.</span>
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div
              className="p-6 md:p-8 mb-6"
              style={{ backgroundColor: "#fff", border: "1px solid rgba(11,18,32,0.09)", borderRadius: 16 }}
            >
              <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--graphite)", lineHeight: "1.85" }}>
                This Privacy Policy explains how {COMPANY} ("we", "us", "our") collects, uses, stores, and protects your personal data when you visit our website or purchase from us.
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--graphite)" }}>
                We are committed to protecting your privacy and handling your data in a transparent and lawful manner in accordance with applicable data protection regulations. Please read this policy carefully.
              </p>
            </div>

            <Section id="who-we-are" number="1" title="Who We Are">
              <p>{COMPANY} (trading as "{COMPANY_SHORT}") is the data controller responsible for your personal data.</p>
              <div className="rounded-xl p-4" style={{ backgroundColor: "#F2F0EB", border: "1px solid rgba(11,18,32,0.09)" }}>
                <p><strong>Data Controller:</strong> {COMPANY}</p>
                <p><strong>Privacy contact:</strong> <a href={`mailto:${EMAIL_PRIVACY}`} style={{ color: "var(--cobalt)" }}>{EMAIL_PRIVACY}</a></p>
              </div>
            </Section>

            <Section id="data-collected" number="2" title="Personal Data We Collect">
              <p>We collect the following categories of personal data:</p>
              <div className="space-y-3">
                {[
                  {
                    category: "Account & Identity Data",
                    items: ["Name", "Email address", "Password (hashed — never stored in plaintext)", "Account creation date"],
                  },
                  {
                    category: "Order & Transaction Data",
                    items: ["Billing and delivery address", "Order history and product details", "Payment method (card type and last 4 digits only — full card details are never stored by us)", "Invoice download records"],
                  },
                  {
                    category: "Technical & Usage Data",
                    items: ["IP address", "Browser type and version", "Device type", "Pages visited, time on site, referring URL", "Session data"],
                  },
                  {
                    category: "Communications Data",
                    items: ["Emails and messages sent to us", "Live chat transcripts", "Customer service correspondence"],
                  },
                  {
                    category: "Marketing Data",
                    items: ["Email marketing preferences and opt-in status", "Click and open rates on marketing emails (where consented)"],
                  },
                ].map((group) => (
                  <div key={group.category} className="rounded-xl p-4" style={{ backgroundColor: "#F2F0EB", border: "1px solid rgba(11,18,32,0.09)" }}>
                    <p className="font-semibold text-xs mb-2" style={{ color: "var(--ink)" }}>{group.category}</p>
                    <ul className="space-y-0.5">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs" style={{ color: "var(--graphite)" }}>
                          <span style={{ color: "rgba(74,85,104,0.45)", flexShrink: 0 }}>—</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p>We do not collect or process special categories of personal data (such as health data, biometric data, or genetic data) in the ordinary course of business.</p>
            </Section>

            <Section id="how-we-use" number="3" title="How We Use Your Data">
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(11,18,32,0.09)" }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: "#F2F0EB", borderBottom: "1px solid rgba(11,18,32,0.09)" }}>
                      {["Purpose", "Data Used", "Legal Basis"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium uppercase" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--graphite)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Process and fulfil your orders", "Identity, Order, Payment data", "Contract performance"],
                      ["Manage your account", "Identity, Account data", "Contract performance"],
                      ["Send order and dispatch confirmations", "Identity, Order, Contact data", "Contract performance"],
                      ["Provide customer support", "Identity, Order, Communications data", "Contract performance / Legitimate interests"],
                      ["Comply with legal obligations (e.g. tax, AML)", "Identity, Order, Financial data", "Legal obligation"],
                      ["Send marketing emails (where consented)", "Identity, Marketing preferences", "Consent"],
                      ["Analyse website usage and improve our services", "Technical, Usage data", "Legitimate interests"],
                      ["Detect and prevent fraud", "Identity, Order, Technical data", "Legitimate interests / Legal obligation"],
                      ["Verify purchaser eligibility (18+, researcher status)", "Identity, Order data", "Legal obligation / Legitimate interests"],
                    ].map((row, i) => (
                      <tr key={row[0]} style={{ borderBottom: i < 8 ? "1px solid rgba(11,18,32,0.06)" : "none" }}>
                        {row.map((cell, j) => (
                          <td key={j} className="px-4 py-3" style={{ color: j === 2 ? "var(--ink)" : "var(--graphite)", fontWeight: j === 2 ? 500 : 400 }}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>

            <Section id="legal-basis" number="4" title="Legal Basis for Processing">
              <p>We process your personal data under the following legal bases as defined in UK GDPR Article 6:</p>
              <ul className="space-y-2 pl-4">
                {[
                  { basis: "Contract performance", desc: "Processing necessary to fulfil your order and manage your account." },
                  { basis: "Legal obligation", desc: "Processing required to comply with UK tax law, anti-money laundering regulations, and our obligations as a seller of controlled research chemicals." },
                  { basis: "Legitimate interests", desc: "Processing for fraud prevention, website security, customer service, and improving our services — where these interests are not overridden by your rights." },
                  { basis: "Consent", desc: "Marketing emails and optional cookies. You may withdraw consent at any time." },
                ].map((item) => (
                  <li key={item.basis} className="flex items-start gap-2">
                    <span style={{ color: "rgba(74,85,104,0.45)", flexShrink: 0 }}>—</span>
                    <span><strong style={{ color: "var(--ink)" }}>{item.basis}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="sharing" number="5" title="Sharing Your Data">
              <p>We do not sell, rent, or trade your personal data to third parties. We share data only with the following categories of trusted third-party service providers, strictly for the purposes described:</p>
              <ul className="space-y-2 pl-4">
                {[
                  { party: "Payment processors", desc: "Stripe and similar PCI-DSS compliant providers for secure payment handling. They receive billing data only — never your full card number." },
                  { party: "Shipping carriers", desc: "Our delivery partners receive your name and address solely to fulfil and deliver your order." },
                  { party: "Email service providers", desc: "For sending order confirmations, dispatch notifications, and (where consented) marketing communications." },
                  { party: "Analytics providers", desc: "Aggregated and anonymised usage data may be processed by analytics tools (e.g. Google Analytics with IP anonymisation enabled) to improve our website." },
                  { party: "Live chat providers", desc: "Tawk.to or similar services may process chat transcripts to provide customer support functionality." },
                  { party: "Legal and regulatory authorities", desc: "Where required by law, court order, or regulatory request, we may disclose data to HMRC, law enforcement, or other authorities." },
                ].map((item) => (
                  <li key={item.party} className="flex items-start gap-2">
                    <span style={{ color: "rgba(74,85,104,0.45)", flexShrink: 0 }}>—</span>
                    <span><strong style={{ color: "var(--ink)" }}>{item.party}:</strong> {item.desc}</span>
                  </li>
                ))}
              </ul>
              <p>All third-party processors are contractually bound to process your data only on our instructions and in accordance with applicable data protection law.</p>
            </Section>

            <Section id="cookies" number="6" title="Cookies & Tracking Technologies">
              <p>We use cookies and similar technologies to operate our website, remember your preferences (such as currency selection), and understand how visitors use our site. Cookies we use include:</p>
              <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid rgba(11,18,32,0.09)" }}>
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ backgroundColor: "#F2F0EB", borderBottom: "1px solid rgba(11,18,32,0.09)" }}>
                      {["Type", "Purpose", "Basis"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-medium uppercase" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--graphite)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Essential", "Session management, cart, authentication — the site cannot function without these.", "Strictly necessary"],
                      ["Functional", "Remembering currency preference, recently viewed products.", "Legitimate interests"],
                      ["Analytics", "Aggregated visitor statistics to improve our website (IP anonymised).", "Consent"],
                      ["Marketing", "Retargeting and conversion tracking (only with explicit consent).", "Consent"],
                    ].map((row, i) => (
                      <tr key={row[0]} style={{ borderBottom: i < 3 ? "1px solid rgba(11,18,32,0.06)" : "none" }}>
                        <td className="px-4 py-3 font-semibold" style={{ color: "var(--ink)" }}>{row[0]}</td>
                        <td className="px-4 py-3" style={{ color: "var(--graphite)" }}>{row[1]}</td>
                        <td className="px-4 py-3 font-medium" style={{ color: "var(--ink)" }}>{row[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p>You can manage your cookie preferences through your browser settings at any time. Disabling certain cookies may affect website functionality.</p>
            </Section>

            <Section id="retention" number="7" title="Data Retention">
              <p>We retain your personal data only for as long as necessary for the purposes for which it was collected, or as required by law:</p>
              <ul className="space-y-2 pl-4">
                {[
                  { type: "Order and transaction records", period: "7 years (UK tax and accounting obligations)" },
                  { type: "Account data", period: "For the duration of your account, plus 2 years after closure" },
                  { type: "Marketing preferences", period: "Until you unsubscribe or withdraw consent" },
                  { type: "Customer service communications", period: "3 years from last contact" },
                  { type: "Technical and usage logs", period: "12 months" },
                ].map((item) => (
                  <li key={item.type} className="flex items-start gap-2">
                    <span style={{ color: "rgba(74,85,104,0.45)", flexShrink: 0 }}>—</span>
                    <span><strong style={{ color: "var(--ink)" }}>{item.type}:</strong> {item.period}</span>
                  </li>
                ))}
              </ul>
              <p>Once data is no longer required, it is securely deleted or anonymised.</p>
            </Section>

            <Section id="your-rights" number="8" title="Your Rights Under UK GDPR">
              <p>Under the UK GDPR, you have the following rights regarding your personal data:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { right: "Right of access", desc: "Request a copy of the personal data we hold about you (Subject Access Request)." },
                  { right: "Right to rectification", desc: "Request correction of inaccurate or incomplete data." },
                  { right: "Right to erasure", desc: "Request deletion of your data where there is no longer a legal basis for processing ('right to be forgotten')." },
                  { right: "Right to restriction", desc: "Request that we restrict processing of your data in certain circumstances." },
                  { right: "Right to portability", desc: "Receive your data in a structured, machine-readable format." },
                  { right: "Right to object", desc: "Object to processing based on legitimate interests, including direct marketing." },
                  { right: "Right to withdraw consent", desc: "Withdraw consent for marketing or non-essential cookies at any time without affecting prior processing." },
                  { right: "Rights re: automated decisions", desc: "Not be subject to solely automated decisions with significant legal effect." },
                ].map((item) => (
                  <div key={item.right} className="rounded-xl p-3" style={{ backgroundColor: "#fff", border: "1px solid rgba(11,18,32,0.09)" }}>
                    <p className="font-semibold text-xs mb-1" style={{ color: "var(--ink)" }}>{item.right}</p>
                    <p className="text-xs" style={{ color: "var(--graphite)" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
              <p>To exercise any of these rights, contact us at <a href={`mailto:${EMAIL_PRIVACY}`} style={{ color: "var(--cobalt)" }}>{EMAIL_PRIVACY}</a>. We will respond within 30 days. We may need to verify your identity before processing your request.</p>
            </Section>

            <Section id="security" number="9" title="Security">
              <p>We implement appropriate technical and organisational measures to protect your personal data against unauthorised access, loss, destruction, or alteration. These include:</p>
              <ul className="space-y-1 pl-4">
                {[
                  "SSL/TLS encryption for all data transmitted between your browser and our website",
                  "Hashed and salted password storage",
                  "PCI-DSS compliant payment processing (card data never stored on our servers)",
                  "Access controls limiting staff access to personal data on a need-to-know basis",
                  "Regular security assessments and software updates",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "var(--cobalt)", flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p>In the event of a personal data breach that is likely to result in a risk to your rights and freedoms, we will notify the ICO within 72 hours and inform affected individuals without undue delay where required by law.</p>
            </Section>

            <Section id="international" number="10" title="International Data Transfers">
              <p>Where we transfer personal data outside the UK (for example, to service providers in the USA or EU), we ensure appropriate safeguards are in place in accordance with UK GDPR, including:</p>
              <ul className="space-y-1 pl-4">
                {[
                  "Transfers to countries with an adequacy decision from the UK Secretary of State;",
                  "Standard Contractual Clauses (SCCs) approved for use with UK transfers;",
                  "The UK International Data Transfer Addendum (IDTA) where applicable.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span style={{ color: "rgba(74,85,104,0.45)", flexShrink: 0 }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="children" number="11" title="Children's Privacy">
              <p>Our website and products are not intended for individuals under the age of 18. We do not knowingly collect personal data from minors. If you believe we have inadvertently collected data from a person under 18, please contact us immediately at <a href={`mailto:${EMAIL_PRIVACY}`} style={{ color: "var(--cobalt)" }}>{EMAIL_PRIVACY}</a> and we will delete it promptly.</p>
            </Section>

            <Section id="changes" number="12" title="Changes to This Privacy Policy">
              <p>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. The date of the most recent revision appears at the top of this page. Where changes are material, we will notify registered users by email.</p>
              <p>We encourage you to review this policy periodically. Continued use of our website following any changes constitutes acceptance of the revised policy.</p>
            </Section>

            <Section id="contact" number="13" title="Contact & Complaints">
              <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: "#F2F0EB", border: "1px solid rgba(11,18,32,0.09)" }}>
                <p className="font-semibold mb-2" style={{ color: "var(--ink)" }}>{COMPANY} — Data Controller</p>
                <p><strong>Privacy enquiries:</strong> <a href={`mailto:${EMAIL_PRIVACY}`} style={{ color: "var(--cobalt)" }}>{EMAIL_PRIVACY}</a></p>
                <p><strong>General enquiries:</strong> <a href={`mailto:${EMAIL_GENERAL}`} style={{ color: "var(--cobalt)" }}>{EMAIL_GENERAL}</a></p>
              </div>
              <p>If you are unhappy with how we have handled your personal data and we have been unable to resolve your concern, you have the right to lodge a complaint with the <strong>Information Commissioner's Office (ICO)</strong>:</p>
              <div className="rounded-xl p-4" style={{ backgroundColor: "#F2F0EB", border: "1px solid rgba(11,18,32,0.09)" }}>
                <p className="font-semibold text-xs mb-1" style={{ color: "var(--ink)" }}>Information Commissioner's Office (ICO)</p>
                <p className="text-xs" style={{ color: "var(--graphite)" }}>Website: <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" style={{ color: "var(--cobalt)" }}>ico.org.uk</a></p>
                <p className="text-xs" style={{ color: "var(--graphite)" }}>Helpline: 0303 123 1113</p>
                <p className="text-xs" style={{ color: "var(--graphite)" }}>Address: Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}
