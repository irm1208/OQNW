import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  HelpCircle, Search, X, ChevronDown, ChevronUp,
  FlaskConical, Package, Truck, Banknote, Shield,
  Thermometer, Droplets, BookOpen, MessageCircle
} from "lucide-react";

type FAQCategory = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
};

type FAQItem = {
  q: string;
  a: string | React.ReactNode;
  category: string;
  tags?: string[];
};

const CATEGORIES: FAQCategory[] = [
  { id: "all",      label: "All Questions",   icon: <HelpCircle size={14} />,  color: "#475569" },
  { id: "products", label: "Products & Purity", icon: <FlaskConical size={14} />, color: "#1B5CB5" },
  { id: "research", label: "Research & Usage", icon: <BookOpen size={14} />,   color: "#059669" },
  { id: "storage",  label: "Storage & Handling", icon: <Thermometer size={14} />, color: "#7C3AED" },
  { id: "ordering", label: "Ordering & Payment", icon: <Banknote size={14} />, color: "#D97706" },
  { id: "shipping", label: "Shipping & Delivery", icon: <Truck size={14} />,   color: "#0891B2" },
  { id: "returns",  label: "Returns & Support",  icon: <Shield size={14} />,   color: "#DC2626" },
];

const CAT_COLOR: Record<string, string> = {
  products: "#1B5CB5",
  research: "#059669",
  storage:  "#7C3AED",
  ordering: "#D97706",
  shipping: "#0891B2",
  returns:  "#DC2626",
};

const FAQS: FAQItem[] = [
  // PRODUCTS & PURITY
  {
    category: "products",
    q: "What does '98%+ verified' mean?",
    a: "Each batch of our research peptides is tested to confirm that at least 99% of the sample is the target compound, with less than 1% consisting of related impurities, residual solvents, or degradation products. We publish the results on our Lab Results page so you can inspect the data directly.",
    tags: ["purity", "testing", "quality"],
  },
  {
    category: "products",
    q: "Where can I find independent verification reports?",
    a: "We publish available independent Janoshik reports on the Lab Reports page and on the relevant product pages. Each report links to the original Janoshik verification record.",
    tags: ["janoshik", "verification", "analysis", "lab"],
  },
  {
    category: "products",
    q: "Are your peptides tested for purity?",
    a: "Yes. All purity testing is conducted by accredited analytical laboratories. We publish the full results — including COAs — on every product page.",
    tags: ["testing", "purity"],
  },
  {
    category: "products",
    q: "What is the difference between a 5mg and 10mg vial of the same peptide?",
    a: "The peptide compound is identical — the only difference is the quantity of lyophilised (freeze-dried) powder in the vial. A 10mg vial simply contains twice the amount of peptide and is more economical for extended research protocols. Purity, sequence, and all chemical properties are the same across all vial sizes.",
    tags: ["vial size", "mg", "quantity"],
  },
  {
    category: "products",
    q: "What are peptide blends? Are they less pure?",
    a: "Peptide blends are pre-mixed vials containing two or more individual peptides lyophilised together — for example, the BPC-157 + TB-500 Blend or CJC-1295 + Ipamorelin. They are not less pure; each component is manufactured and tested to the same 98%+ standard before blending. Blends offer research convenience by eliminating the need to reconstitute and dose two separate vials in protocols where both compounds are used together.",
    tags: ["blend", "stack", "combination", "purity"],
  },
  {
    category: "products",
    q: "Are your products for human consumption?",
    a: "No. All products sold by OmniQure Peptide Research Institute are strictly for in-vitro and preclinical research purposes only. They are not intended for human or veterinary administration, and are not classified as medicines, food supplements, or health products. By purchasing, you confirm the products are for laboratory research use only.",
    tags: ["human use", "research only", "disclaimer"],
  },
  {
    category: "products",
    q: "Do you sell pharmaceutical-grade or GMP peptides?",
    a: "Our peptides are research-grade, manufactured in cGMP-compliant facilities, and verified for purity and identity. They are not licensed as pharmaceutical drugs and are not produced under the same regulatory framework as licensed medicines — they are supplied exclusively for scientific research.",
    tags: ["gmp", "pharmaceutical", "grade"],
  },

  // RESEARCH & USAGE
  {
    category: "research",
    q: "What is a research peptide?",
    a: "A research peptide is a synthetic amino acid chain (typically 2–50 amino acids) produced for use in laboratory and preclinical research. Researchers study these compounds in cell cultures (in-vitro) and animal models (in-vivo) to understand their biological mechanisms, pharmacokinetics, and potential applications. The data generated informs academic and pharmaceutical research.",
    tags: ["what is", "research peptide", "definition"],
  },
  {
    category: "research",
    q: "What is the Protocols page and how do I use it?",
    a: "The Protocols page is a research reference tool listing suggested dosing parameters, frequency, cycle lengths, storage conditions, and scientific background for each peptide in our catalogue. Data is drawn from published preclinical literature and our Research Stacks. It is intended as a starting reference for protocol design — not as clinical dosing guidance.",
    tags: ["protocols", "dosing", "reference"],
  },
  {
    category: "research",
    q: "What are Research Stacks?",
    a: "Research Stacks are curated multi-peptide combinations commonly studied together in preclinical research — for example, BPC-157 + TB-500 for tissue repair, or CJC-1295 + Ipamorelin for growth hormone axis research. Each stack page includes scientific rationale, synergy mechanisms, individual dosing parameters, and precautions. They are intended as research guidance, not prescriptions.",
    tags: ["stacks", "combination", "protocol"],
  },
  {
    category: "research",
    q: "How do I use the Reconstitution Calculator?",
    a: "The Reconstitution Calculator helps you determine how much bacteriostatic water (BAC water) to add to your lyophilised peptide vial to achieve a target concentration, and then calculates the volume to draw for a given dose. Enter your peptide quantity (e.g. 5mg), desired concentration, and target dose — the calculator returns the volumes needed. It is available at /calculator.",
    tags: ["calculator", "reconstitution", "concentration"],
  },
  {
    category: "research",
    q: "What does 'half-life' mean for peptides?",
    a: "Half-life refers to the time it takes for the concentration of a peptide in the bloodstream or tissue to reduce by 50% after administration. Short half-life peptides (e.g. CJC-1295 No DAC at ~30 min) require more frequent dosing intervals in research protocols. Longer half-life peptides (e.g. Melanotan 2 at several days) allow less frequent administration. Half-life data on our Protocols page is sourced from preclinical and published pharmacokinetic studies.",
    tags: ["half-life", "pharmacokinetics", "duration"],
  },
  {
    category: "research",
    q: "What does lyophilised / freeze-dried powder mean?",
    a: "Lyophilisation (freeze-drying) is a preservation process that removes water from the peptide under vacuum while frozen. This produces a stable, powdered form that remains active for extended periods at the correct storage temperature. Before use in research, the powder must be reconstituted by adding a suitable solvent (sterile water, bacteriostatic water, or saline, depending on the peptide).",
    tags: ["lyophilised", "freeze-dried", "powder", "reconstitution"],
  },
  {
    category: "research",
    q: "What is bacteriostatic water and why is it used?",
    a: "Bacteriostatic water (BAC water) is sterile water containing 0.9% benzyl alcohol, which inhibits bacterial growth and extends the shelf life of a reconstituted peptide solution to approximately 4 weeks when refrigerated at 4°C. It is the most commonly used reconstitution solvent for research peptides. Some peptides (e.g. BPC-157) are also soluble in 0.9% saline. Always check the individual product page for the recommended reconstitution solvent.",
    tags: ["bacteriostatic water", "bac water", "solvent", "reconstitution"],
  },

  // STORAGE & HANDLING
  {
    category: "storage",
    q: "How should I store lyophilised peptides?",
    a: "Lyophilised (unreconstituted) peptides should be stored at -20°C (standard freezer temperature) for long-term stability — typically 12–24 months when sealed. Avoid repeated freeze-thaw cycles. Keep vials away from light, moisture, and heat. Do not store in a frost-free freezer as the temperature cycling can degrade the peptide.",
    tags: ["storage", "freezer", "-20", "lyophilised"],
  },
  {
    category: "storage",
    q: "How long can I store a reconstituted peptide solution?",
    a: "After reconstitution with bacteriostatic water, most peptides are stable for 2–4 weeks when stored at 4°C (standard refrigerator temperature). Always check your specific peptide's product page for exact guidance — some compounds such as BPC-157 reconstituted in saline should be used within 2 weeks. Reconstituted solutions should never be refrozen.",
    tags: ["reconstituted", "storage", "stability", "refrigerator"],
  },
  {
    category: "storage",
    q: "Can I leave peptides at room temperature?",
    a: "Lyophilised peptides can typically tolerate short periods at room temperature (e.g. during transit), but should not be stored there long-term. Reconstituted solutions are particularly sensitive and should be refrigerated at 4°C at all times. Exposure to temperatures above 25°C for extended periods may accelerate degradation.",
    tags: ["room temperature", "heat", "stability"],
  },
  {
    category: "storage",
    q: "Do peptides arrive cold / temperature controlled?",
    a: "Orders are typically shipped at ambient temperature. Lyophilised peptides are stable for transport at room temperature for the durations involved in standard shipping. Our packaging is designed to protect the vials during transit. If you are concerned about a particularly sensitive compound, contact us before placing your order to discuss options.",
    tags: ["cold chain", "shipping temperature", "transit"],
  },
  {
    category: "storage",
    q: "How do I handle a peptide vial safely?",
    a: "When handling peptide vials: use a clean, sterile environment where possible; swirl gently rather than shaking when reconstituting (shaking can denature peptides); wipe vial tops with an alcohol swab before inserting a needle; draw liquid slowly to avoid introducing air bubbles; use an appropriate gauge needle for your reconstitution solvent. Always wear appropriate PPE (gloves, eye protection) when handling research compounds.",
    tags: ["handling", "vial", "technique", "safety"],
  },

  // ORDERING & PAYMENT
  {
    category: "ordering",
    q: "What payment methods do you accept?",
    a: "We accept bank transfer and cryptocurrency. Supported cryptocurrencies are Bitcoin (BTC), Ethereum (ETH), USDT, USDC, Litecoin (LTC), and Monero (XMR). Bank transfer details and wallet addresses are provided at checkout once your order is confirmed. We do not accept card payments.",
    tags: ["payment", "bank transfer", "bitcoin", "crypto", "ethereum", "usdt", "usdc", "litecoin", "monero"],
  },
  {
    category: "ordering",
    q: "Do I need to create an account to order?",
    a: "You can browse all products without an account. To complete a purchase you will need to register an account, which also enables order tracking, order history, and wishlist saving. Registration is quick and requires only a valid email address.",
    tags: ["account", "register", "guest checkout"],
  },
  {
    category: "ordering",
    q: "Is my payment information secure?",
    a: "Yes. We do not process or store card details of any kind. Bank transfer payments are handled through standard banking infrastructure — no sensitive financial data passes through our systems. Cryptocurrency payments are entirely non-custodial and verified on-chain. All data transmission between your browser and our servers is encrypted via SSL/TLS.",
    tags: ["security", "payment", "ssl", "pci"],
  },
  {
    category: "ordering",
    q: "Can I modify or cancel my order after placing it?",
    a: "Orders can be modified or cancelled within 1 hour of placement, provided they have not yet entered the dispatch process. Please contact our support team immediately via the Contact page with your order number. Once an order has been dispatched we are unable to intercept it.",
    tags: ["cancel", "modify", "order", "change"],
  },
  {
    category: "ordering",
    q: "Do you offer bulk or wholesale pricing?",
    a: "Yes. We offer volume discounts for larger orders and wholesale arrangements for qualified research institutions, academic laboratories, and pharmaceutical companies. Contact us via the Contact page with your requirements and institutional credentials and we will provide a custom quote.",
    tags: ["bulk", "wholesale", "discount", "institution"],
  },
  {
    category: "ordering",
    q: "How does the Refer a Friend programme work?",
    a: "Share your unique referral link (found in your account under 'Refer a Friend') with colleagues or fellow researchers. When someone registers and places their first order using your link, they automatically receive 10% off that order — and as soon as it ships, you and your friend both get £25 credit added to your accounts (up to £50 unredeemed balance each). Credit is applied automatically at checkout on your next order and never expires.",
    tags: ["refer", "referral", "credit", "reward", "friend"],
  },
  {
    category: "ordering",
    q: "Can a referred customer also use bundle discounts on their first order?",
    a: "Yes. The 10% referral discount is automatically applied to the referred customer's first order, and Bundle & Save free items apply on top with no exceptions — ordering 3-4 peptides gets a free BAC water, 5-9 gets a free peptide, and 10+ gets 2 free peptides. These tiers don't stack — each order gets the reward for its own tier.",
    tags: ["refer", "referral", "bundle", "discount", "first order", "stack"],
  },
  {
    category: "ordering",
    q: "Can I refer myself or create extra accounts to earn referral credit?",
    a: "No. Self-referral and fake-account creation are strictly prohibited. Referred accounts are automatically verified against existing accounts using email address, billing address, delivery address, payment method, IP address, and device signals. Any referral found to involve a duplicate or self-created account will be voided, all associated accounts permanently terminated, and any credit already redeemed may be clawed back. OmniQure's fraud decisions are final.",
    tags: ["refer", "referral", "self-referral", "fake account", "fraud", "abuse", "multiple accounts"],
  },

  // SHIPPING & DELIVERY
  {
    category: "shipping",
    q: "Where do you ship to?",
    a: "We ship worldwide to most countries. Some jurisdictions have specific import restrictions on research chemicals — it is the customer's responsibility to verify that importing these compounds is permitted in their country before ordering. We cannot be held responsible for packages detained or seized by customs in restricted jurisdictions.",
    tags: ["worldwide", "international", "countries", "shipping"],
  },
  {
    category: "shipping",
    q: "How long does shipping take?",
    a: "Domestic (UK) orders typically arrive within 2–4 business days. International orders are usually delivered within 5–14 business days depending on destination and customs clearance. Expedited shipping options may be available at checkout. All orders are processed within 1–2 business days of payment confirmation.",
    tags: ["delivery time", "shipping time", "days", "international"],
  },
  {
    category: "shipping",
    q: "Will I receive a tracking number?",
    a: "Yes. Once your order is dispatched you will receive a confirmation email containing your tracking number and a link to the courier's tracking portal. You can also view your tracking status from the Track Your Order page or via your account dashboard.",
    tags: ["tracking", "tracking number", "status"],
  },
  {
    category: "shipping",
    q: "My order shows as delivered but I haven't received it — what should I do?",
    a: "First check with neighbours or any safe-place location the courier may have used. If the package is genuinely missing after the courier confirms delivery, contact us within 7 days of the delivery date via the Contact page with your order number and we will investigate with the carrier and arrange a resolution.",
    tags: ["lost", "missing", "delivery", "not received"],
  },
  {
    category: "shipping",
    q: "Do you ship discreetly?",
    a: "Yes. All orders are dispatched in plain, unmarked packaging with no external branding or indication of the package contents. The sender name on shipping labels does not reference peptides or OmniQure.",
    tags: ["discreet", "packaging", "privacy", "plain"],
  },

  // RETURNS & SUPPORT
  {
    category: "returns",
    q: "What is your return policy?",
    a: "Due to the nature of research peptides (temperature-sensitive biological compounds), we cannot accept returns of opened vials. If your order arrives damaged, incorrect, or with a quality issue, contact us within 7 days of delivery with photos of the packaging and product — we will arrange a replacement or refund as appropriate. See our full policy on the Shipping Policy page.",
    tags: ["returns", "refund", "policy", "damaged"],
  },
  {
    category: "returns",
    q: "My vial arrived damaged — what should I do?",
    a: "Take clear photos of the outer packaging, inner packaging, and the damaged vial(s) and contact us via the Contact page within 7 days of delivery. Include your order number in your message. We will review the evidence and arrange a replacement at no additional cost if the damage occurred during transit.",
    tags: ["damaged", "broken", "vial", "transit"],
  },
  {
    category: "returns",
    q: "I received the wrong product — what should I do?",
    a: "We apologise for the fulfilment error. Contact us via the Contact page within 7 days of receipt with your order number and a photo of what you received. We will arrange for the correct item to be dispatched immediately at no cost, and arrange collection or disposal of the incorrect item.",
    tags: ["wrong product", "incorrect", "error"],
  },
  {
    category: "returns",
    q: "How do I contact customer support?",
    a: "You can reach our research support team via the Contact page, through the live chat widget on the bottom right of the screen, or by emailing us directly. We aim to respond to all enquiries within 1–2 business days. For urgent order issues, live chat is the fastest route.",
    tags: ["contact", "support", "email", "live chat"],
  },
  {
    category: "returns",
    q: "I have a research question about a specific peptide — can you help?",
    a: "Our team is happy to assist with general questions about peptide properties, reconstitution, storage, or to point you towards relevant published literature. We cannot provide personalised research protocol advice or anything that could be construed as medical guidance. Reach us via the Contact page or live chat.",
    tags: ["research question", "advice", "help", "science"],
  },
];

function AccordionItem({ item, isOpen, onToggle }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const catColor = CAT_COLOR[item.category] ?? "#475569";
  return (
    <div style={{
      background: "#fff",
      border: `1px solid ${isOpen ? catColor + "40" : "#E2E8F0"}`,
      borderRadius: "10px",
      overflow: "hidden",
      transition: "border-color 0.2s, box-shadow 0.2s",
      boxShadow: isOpen ? `0 2px 12px ${catColor}18` : "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <button
        onClick={onToggle}
        style={{
          width: "100%", textAlign: "left", padding: "16px 18px",
          background: isOpen ? catColor + "08" : "transparent",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px",
          transition: "background 0.15s",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: 1 }}>
          <div style={{
            width: "20px", height: "20px", borderRadius: "50%",
            background: isOpen ? catColor : catColor + "20",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginTop: "1px", transition: "background 0.15s",
          }}>
            <HelpCircle size={11} color={isOpen ? "#fff" : catColor} />
          </div>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#0D2565", lineHeight: "1.45", letterSpacing: "-0.01em" }}>
            {item.q}
          </span>
        </div>
        <div style={{ flexShrink: 0, marginTop: "2px" }}>
          {isOpen
            ? <ChevronUp size={16} color={catColor} />
            : <ChevronDown size={16} color="#94A3B8" />}
        </div>
      </button>
      {isOpen && (
        <div style={{
          padding: "0 18px 18px 48px",
          borderTop: `1px solid ${catColor}20`,
        }}>
          <p style={{ fontSize: "13px", color: "#374151", margin: "14px 0 0", lineHeight: "1.7" }}>
            {item.a}
          </p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  useSEO({
    title: "Frequently Asked Questions",
    description: "Common questions about OmniQure research peptides — purity, independent testing, storage, reconstitution, ordering, shipping, and returns. Research use only.",
    canonicalPath: "/faq",
  });

  useEffect(() => {
    let el = document.querySelector<HTMLScriptElement>('script[data-seo="faqpage"]');
    if (!el) {
      el = document.createElement("script");
      el.setAttribute("type", "application/ld+json");
      el.setAttribute("data-seo", "faqpage");
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map(item => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
    return () => { document.querySelector('script[data-seo="faqpage"]')?.remove(); };
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQS.filter((item, i) => {
      const catMatch = activeCategory === "all" || item.category === activeCategory;
      if (!q) return catMatch;
      const textMatch =
        item.q.toLowerCase().includes(q) ||
        (typeof item.a === "string" && item.a.toLowerCase().includes(q)) ||
        (item.tags ?? []).some(t => t.includes(q));
      return catMatch && textMatch;
    });
  }, [activeCategory, search]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: FAQS.length };
    for (const item of FAQS) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        padding: "52px 20px 48px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.12)", borderRadius: "20px",
            padding: "6px 16px", marginBottom: "18px",
          }}>
            <HelpCircle size={13} color="rgba(255,255,255,0.85)" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em" }}>HELP CENTRE</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Frequently Asked Questions
          </h1>
          <p style={{ fontSize: "clamp(13px, 2vw, 16px)", color: "rgba(255,255,255,0.75)", marginTop: 0, marginBottom: "28px", lineHeight: 1.6 }}>
            Everything you need to know about our research peptides, ordering, storage, and shipping.
          </p>

          {/* Search */}
          <div style={{ position: "relative", maxWidth: "460px", marginLeft: "auto", marginRight: "auto" }}>
            <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search questions…"
              value={search}
              onChange={e => { setSearch(e.target.value); setOpenId(null); }}
              style={{
                width: "100%", padding: "11px 40px 11px 40px",
                borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.95)", fontSize: "13px",
                outline: "none", boxSizing: "border-box", color: "#1E293B",
              }}
            />
            {search && (
              <button onClick={() => { setSearch(""); setOpenId(null); }}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: "2px" }}>
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category pill tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 20px", overflowX: "auto" }}>
        <div style={{ maxWidth: "960px", marginLeft: "auto", marginRight: "auto", display: "flex", gap: "2px" }}>
          {CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setOpenId(null); }}
                style={{
                  display: "flex", alignItems: "center", gap: "6px",
                  padding: "14px 16px", border: "none", cursor: "pointer",
                  background: "transparent", whiteSpace: "nowrap",
                  fontSize: "12px", fontWeight: active ? 700 : 500,
                  color: active ? cat.color : "#64748B",
                  borderBottom: active ? `2px solid ${cat.color}` : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ color: active ? cat.color : "#94A3B8" }}>{cat.icon}</span>
                {cat.label}
                <span style={{
                  background: active ? cat.color + "18" : "#F1F5F9",
                  color: active ? cat.color : "#94A3B8",
                  fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "10px",
                }}>{categoryCounts[cat.id] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "960px", marginLeft: "auto", marginRight: "auto", padding: "32px 20px 60px" }}>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <HelpCircle size={40} color="#CBD5E1" style={{ marginBottom: "12px" }} />
            <div style={{ fontSize: "16px", fontWeight: 700, color: "#475569", marginBottom: "6px" }}>No questions found</div>
            <div style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "16px" }}>Try a different search term or category</div>
            <button onClick={() => { setSearch(""); setActiveCategory("all"); }}
              style={{ padding: "8px 18px", background: "#1B5CB5", color: "#fff", border: "none", borderRadius: "6px", fontSize: "13px", fontWeight: 600, cursor: "pointer" }}>
              Show all questions
            </button>
          </div>
        ) : (
          <>
            {/* Results count */}
            <div style={{ fontSize: "12px", color: "#94A3B8", marginBottom: "20px" }}>
              {search
                ? <><strong style={{ color: "#374151" }}>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""} for "<strong style={{ color: "#1B5CB5" }}>{search}</strong>"</>
                : <><strong style={{ color: "#374151" }}>{filtered.length}</strong> question{filtered.length !== 1 ? "s" : ""}</>
              }
              {(search || activeCategory !== "all") && (
                <button onClick={() => { setSearch(""); setActiveCategory("all"); setOpenId(null); }}
                  style={{ marginLeft: "10px", background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: "12px", textDecoration: "underline" }}>
                  Clear
                </button>
              )}
            </div>

            {/* Grouped by category when showing all, flat list otherwise */}
            {activeCategory === "all" && !search ? (
              CATEGORIES.filter(c => c.id !== "all").map(cat => {
                const items = FAQS.filter(f => f.category === cat.id);
                if (!items.length) return null;
                return (
                  <div key={cat.id} style={{ marginBottom: "36px" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      marginBottom: "14px", paddingBottom: "10px",
                      borderBottom: "2px solid " + cat.color + "30",
                    }}>
                      <div style={{ color: cat.color }}>{cat.icon}</div>
                      <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#0D2565", margin: 0, letterSpacing: "-0.01em" }}>{cat.label}</h2>
                      <span style={{ background: cat.color + "15", color: cat.color, fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "10px" }}>
                        {items.length}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {items.map((item, idx) => {
                        const globalIdx = FAQS.indexOf(item);
                        return (
                          <AccordionItem
                            key={globalIdx}
                            item={item}
                            isOpen={openId === globalIdx}
                            onToggle={() => setOpenId(openId === globalIdx ? null : globalIdx)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {filtered.map((item) => {
                  const globalIdx = FAQS.indexOf(item);
                  return (
                    <AccordionItem
                      key={globalIdx}
                      item={item}
                      isOpen={openId === globalIdx}
                      onToggle={() => setOpenId(openId === globalIdx ? null : globalIdx)}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Still have questions CTA */}
        <div style={{
          marginTop: "48px",
          background: "linear-gradient(135deg, #0D2565 0%, #1B5CB5 100%)",
          borderRadius: "14px", padding: "32px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "10px",
              background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <MessageCircle size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "17px", fontWeight: 800, color: "#fff", marginBottom: "4px" }}>Still have a question?</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.5 }}>
                Our research support team is available via live chat or contact form. We respond within 1–2 business days.
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/contact">
              <button style={{
                padding: "10px 22px", background: "#fff", color: "#1B5CB5",
                border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: 700,
                cursor: "pointer", whiteSpace: "nowrap",
              }}>Contact Us</button>
            </Link>
            <Link href="/protocols">
              <button style={{
                padding: "10px 22px", background: "rgba(255,255,255,0.15)", color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap",
              }}>Protocols Reference</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
