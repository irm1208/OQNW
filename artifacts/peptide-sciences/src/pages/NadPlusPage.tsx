import { useState } from "react";
import {
  ShoppingCart, Minus, Plus, ShieldCheck, Zap, FlaskConical,
  Activity, Dna, Battery, Microscope, ChevronDown, CheckCircle2,
  AlertTriangle, BookOpen, Layers, Info
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";
import type { Product } from "@/data/products";

const PRODUCT = {
  id: "nad-plus-500mg",
  name: "NAD+ 500mg",
  slug: "nad-plus-500mg",
  price: 85.00,
  image: "/products/49.jpg",
  category: "Cellular Health",
  ref: "38-33-ND",
} as const;

// ── Data from productDetails id "49" ──────────────────────────────
const SPECS = [
  { label: "CAS Number",       value: "53-84-9" },
  { label: "Formula",          value: "C₂₁H₂₇N₇O₁₄P₂" },
  { label: "Molecular Weight", value: "663.43 g/mol" },
  { label: "Also Known As",    value: "Nicotinamide Adenine Dinucleotide, NAD, Coenzyme I" },
  { label: "Appearance",       value: "White to off-white powder" },
  { label: "Solubility",       value: "Freely soluble in water" },
  { label: "Purity",           value: "99%+ HPLC" },
  { label: "Half-Life",        value: "Short in plasma; cellular uptake via connexin hemichannels and CD38 pathways" },
  { label: "Storage",          value: "−20 °C, protected from light and moisture. Avoid repeated freeze-thaw cycles." },
];

const RESEARCH_AREAS = [
  "Cellular Energy Research",
  "Aging Research",
  "Sirtuins Research",
  "Metabolic Research",
  "DNA Repair Research",
];

// ── Data from peptideExtras "NAD+" ────────────────────────────────
const USES = [
  "Cellular energy metabolism and mitochondrial function research",
  "Sirtuin activation and longevity pathway studies",
  "DNA repair mechanism investigation",
  "Neurodegeneration and ageing models",
];

const BENEFITS = [
  "Essential coenzyme in redox reactions and cellular energy production (ATP synthesis)",
  "Activates sirtuins (SIRT1–7) to regulate gene expression, metabolism, and stress responses",
  "Supports PARP-mediated DNA repair pathways in genomic integrity research",
  "Investigated for neuroprotection in models of Alzheimer's, Parkinson's, and ALS",
  "Declines with age — supplementation restores youthful metabolic parameters in aged animal models",
];

const RESEARCH_NOTES = [
  "Generally well-tolerated at research doses in preclinical animal studies",
  "Transient flushing similar to niacin at high doses in some models",
  "May modulate PARP activity — relevant consideration in DNA damage repair research",
  "Potential interactions with sirtuins may affect immune regulation in longer protocols",
];

const FEATURES = [
  { icon: Battery,     label: "Cellular Energy",          detail: "Cofactor in ATP synthesis pathways" },
  { icon: Dna,         label: "DNA Repair Support",       detail: "PARP enzyme substrate for genomic stability" },
  { icon: ShieldCheck, label: "99%+ HPLC Verified",       detail: "Independently tested for purity & identity" },
  { icon: FlaskConical, label: "Research Grade",          detail: "For in vitro laboratory use only" },
];

type FAQItem = { q: string; a: string };
const FAQS: FAQItem[] = [
  {
    q: "What is the difference between NAD+ and NADH?",
    a: "NAD⁺ is the oxidised form and acts as an electron acceptor in catabolic reactions (glycolysis, TCA cycle), becoming NADH when it gains a hydride ion. NADH then donates electrons to the mitochondrial electron transport chain, regenerating NAD⁺. The cellular NAD⁺/NADH ratio reflects the cell's redox and metabolic state.",
  },
  {
    q: "How should NAD+ be reconstituted for research?",
    a: "NAD⁺ powder is typically dissolved in sterile phosphate-buffered saline (PBS, pH 7.4) or sterile water. Due to the sensitivity of the nicotinamide ring to alkaline hydrolysis, solutions should be prepared fresh and kept at pH 6–7. Avoid prolonged storage of reconstituted solutions — prepare aliquots and freeze at −20 °C for short-term or −80 °C for longer-term storage.",
  },
  {
    q: "Does NAD+ degrade at room temperature?",
    a: "Yes. Lyophilised NAD⁺ powder is stable at −20 °C for 12–24 months but degrades significantly faster at room temperature. Once reconstituted, solutions should be used within 24 hours or aliquoted and frozen. The glycosidic bond linking nicotinamide to ribose is susceptible to both acid and base hydrolysis.",
  },
  {
    q: "How does NAD+ relate to sirtuins?",
    a: "Sirtuins (SIRT1–7) are NAD⁺-dependent protein deacylases — they consume NAD⁺ as a substrate during each catalytic cycle. This means sirtuin activity is directly gated by intracellular NAD⁺ availability. As NAD⁺ levels decline with age, sirtuin activity decreases, impairing their roles in DNA repair, metabolic regulation, and stress resistance.",
  },
  {
    q: "What is the relationship between NAD+ and PARP enzymes?",
    a: "PARP enzymes (Poly(ADP-Ribose) Polymerases) consume large amounts of NAD⁺ during DNA damage repair, using it to synthesise poly(ADP-ribose) chains at break sites. Heavy DNA damage can cause PARP hyperactivation that depletes cellular NAD⁺, which in turn suppresses sirtuin activity — creating a mechanistic link between genotoxic stress, NAD⁺ depletion, and accelerated cellular ageing.",
  },
  {
    q: "What is the purity of OmniQure NAD+?",
    a: "OmniQure NAD⁺ is manufactured to ≥99% purity as verified by HPLC. Each batch is independently tested and identity-confirmed by mass spectrometry. The molecular weight is 663.43 g/mol (free acid form). Certificate of Analysis data is available on the product listing.",
  },
];

function FAQAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {FAQS.map((item, i) => (
        <div key={i} style={{ border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
          <button
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 18px", background: open === i ? "#F0F9FF" : "#fff", cursor: "pointer", border: "none", textAlign: "left", gap: "12px" }}
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "#1E293B" }}>{item.q}</span>
            <ChevronDown size={15} style={{ color: "#64748B", flexShrink: 0, transform: open === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </button>
          {open === i && (
            <div style={{ padding: "14px 18px 16px", borderTop: "1px solid #E8EDF5", background: "#F8FAFF" }}>
              <p style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.75 }}>{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function NadPlusPage() {
  useSEO({
    title: "NAD+ 500mg | Cellular Energy & DNA Repair Research | OmniQure",
    description: "Research-grade NAD+ (nicotinamide adenine dinucleotide) 500mg. 99%+ HPLC verified. CAS 53-84-9. Studied for mitochondrial bioenergetics, sirtuin activation, PARP-mediated DNA repair, and cellular longevity research.",
    keywords: "NAD+ research, nicotinamide adenine dinucleotide, CAS 53-84-9, sirtuin activator, PARP substrate, mitochondrial research, cellular energy research, aging research",
  });

  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"description" | "specs" | "research">("description");

  function handleAdd() {
    const product: Product = {
      id: PRODUCT.id,
      name: PRODUCT.name,
      slug: PRODUCT.slug,
      price: PRODUCT.price,
      image: PRODUCT.image,
      category: PRODUCT.category,
    };
    for (let i = 0; i < qty; i++) addToCart(product, 1);
    toast({ title: "Added to cart", description: `${qty} × ${PRODUCT.name}` });
  }

  return (
    <div style={{ backgroundColor: "#F7FAFF", minHeight: "100vh" }}>

      {/* ── Hero / product section ── */}
      <div className="max-w-[1100px] mx-auto px-4 py-12 lg:py-16">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 mb-8 text-xs text-gray-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/all-peptides" className="hover:text-blue-600 transition-colors">All Peptides</Link>
          <span>/</span>
          <span className="text-gray-600 font-medium">NAD+</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── Image ── */}
          <div
            className="flex items-center justify-center rounded-3xl lg:sticky lg:top-8"
            style={{
              background: "#fff",
              border: "1.5px solid #E2E8F0",
              boxShadow: "0 8px 40px rgba(15,23,42,0.08)",
              padding: "40px",
              minHeight: "420px",
            }}
          >
            <img
              src={PRODUCT.image}
              alt={PRODUCT.name}
              style={{ maxWidth: "100%", maxHeight: "360px", objectFit: "contain", borderRadius: "12px" }}
            />
          </div>

          {/* ── Info ── */}
          <div>
            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "6px", padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Zap size={10} style={{ color: "#059669" }} />
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase" }}>Cellular Health</span>
              </div>
              <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "6px", padding: "4px 12px", display: "inline-flex" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#1D4ED8", letterSpacing: "0.08em", textTransform: "uppercase" }}>99%+ HPLC Verified</span>
              </div>
              <div style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: "6px", padding: "4px 12px", display: "inline-flex" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#C2410C", letterSpacing: "0.08em", textTransform: "uppercase" }}>CAS 53-84-9</span>
              </div>
            </div>

            <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "4px" }}>
              NAD<sup style={{ fontSize: "0.55em", verticalAlign: "super" }}>+</sup>
            </h1>
            <p style={{ fontSize: "14px", color: "#64748B", fontWeight: 500, marginBottom: "4px" }}>
              Nicotinamide Adenine Dinucleotide
            </p>
            <p style={{ fontSize: "12.5px", color: "#94A3B8", marginBottom: "16px" }}>
              Also known as: NAD, Coenzyme I
            </p>

            {/* REF */}
            <p style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 600, marginBottom: "18px" }}>
              REF&nbsp;
              <span style={{ border: "1.5px solid #CBD5E1", borderRadius: "4px", padding: "1px 6px", fontSize: "12px", color: "#475569", fontWeight: 700 }}>
                {PRODUCT.ref}
              </span>
            </p>

            {/* Research area tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
              {RESEARCH_AREAS.map(area => (
                <span key={area} style={{ fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "4px", background: "#F1F5F9", border: "1px solid #E2E8F0", color: "#475569" }}>
                  {area}
                </span>
              ))}
            </div>

            {/* Quick specs row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "22px" }}>
              {[
                { label: "MW", val: "663.43 g/mol" },
                { label: "Form", val: "Lyophilised Powder" },
                { label: "Purity", val: "≥99% HPLC" },
                { label: "Storage", val: "−20 °C" },
                { label: "Solubility", val: "Water-soluble" },
              ].map(chip => (
                <div key={chip.label} style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "4px 10px", fontSize: "12px" }}>
                  <span style={{ color: "#94A3B8", fontWeight: 600 }}>{chip.label}: </span>
                  <span style={{ color: "#1E293B", fontWeight: 700 }}>{chip.val}</span>
                </div>
              ))}
            </div>

            {/* Size */}
            <div style={{ marginBottom: "22px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Size</p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", border: "2px solid #059669", borderRadius: "10px", padding: "10px 20px", background: "#ECFDF5" }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#059669" }}>500mg</span>
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "38px", fontWeight: 900, color: "#0D2565", lineHeight: 1 }}>
                £{PRODUCT.price.toFixed(2)}
              </span>
              <span style={{ fontSize: "13px", color: "#94A3B8", marginLeft: "8px" }}>per vial</span>
            </div>

            {/* Qty + Add */}
            <div style={{ marginBottom: "28px", display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E2E8F0", borderRadius: "10px", overflow: "hidden", backgroundColor: "#fff" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: "32px", textAlign: "center", fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "#475569" }}>
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  background: "linear-gradient(90deg, #0D2565 0%, #1240A0 100%)",
                  color: "#fff", border: "none", borderRadius: "10px",
                  padding: "14px 24px", fontSize: "15px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(13,37,101,0.3)",
                }}
              >
                <ShoppingCart size={17} />
                Add to Cart
              </button>
            </div>

            {/* Feature pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {FEATURES.map(({ icon: Icon, label, detail }) => (
                <div key={label} style={{ display: "flex", alignItems: "flex-start", gap: "10px", backgroundColor: "#fff", border: "1px solid #E8EDF5", borderRadius: "10px", padding: "12px 14px" }}>
                  <Icon size={16} style={{ color: "#1240A0", marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>{label}</p>
                    <p style={{ fontSize: "11px", color: "#64748B", marginTop: "1px" }}>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Info strip ── */}
        <div
          className="mt-14 rounded-2xl"
          style={{
            background: "linear-gradient(90deg, #064E3B 0%, #059669 50%, #10B981 100%)",
            padding: "36px 40px",
            display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>What is NAD⁺?</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.80)", lineHeight: 1.75, maxWidth: "560px" }}>
              NAD⁺ (Nicotinamide Adenine Dinucleotide) is an essential coenzyme found in all living cells, serving as a central mediator of energy metabolism and as a substrate for enzymes including sirtuins and PARP. NAD⁺ levels decline with age, generating strong research interest in its supplementation and biological roles.
            </p>
          </div>
          <div style={{ display: "flex", gap: "32px", flexShrink: 0 }}>
            {[
              { num: "663",  label: "g/mol (MW)" },
              { num: "99%+", label: "HPLC Purity" },
              { num: "SIRT", label: "Substrate" },
            ].map(stat => (
              <div key={stat.num} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "22px", fontWeight: 900, color: "#FDE68A", lineHeight: 1 }}>{stat.num}</p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.60)", marginTop: "4px", fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tabbed content ── */}
        <div className="mt-14">
          {/* Tab bar */}
          <div style={{ display: "flex", gap: "4px", borderBottom: "2px solid #E2E8F0", marginBottom: "28px" }}>
            {(["description", "specs", "research"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 22px", fontSize: "13.5px", fontWeight: 700,
                  border: "none", background: "none", cursor: "pointer",
                  color: activeTab === tab ? "#1240A0" : "#64748B",
                  borderBottom: activeTab === tab ? "2px solid #1240A0" : "2px solid transparent",
                  marginBottom: "-2px", textTransform: "capitalize",
                }}
              >
                {tab === "description" ? "Research Overview" : tab === "specs" ? "Specifications" : "Uses & Benefits"}
              </button>
            ))}
          </div>

          {/* Description tab */}
          {activeTab === "description" && (
            <div className="space-y-8">
              {/* Long description sections */}
              <div>
                <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "12px", fontFamily: "'Arimo', Arial, sans-serif" }}>
                  NAD⁺ (Nicotinamide Adenine Dinucleotide)
                </h2>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: 1.85 }}>
                  NAD⁺ is a coenzyme found in all living cells and one of the most important molecules in cellular biology. It exists in two forms: NAD⁺ (oxidised) and NADH (reduced), and cycles between these states as it participates in hundreds of metabolic reactions. Beyond its classical role in energy metabolism, NAD⁺ serves as a substrate for several enzyme classes critical for cell signalling, DNA repair, and gene regulation.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Activity,
                    title: "Sirtuins Research",
                    body: "Sirtuins (SIRT1–7) are NAD⁺-dependent deacylases that regulate numerous aspects of cellular physiology including DNA repair, metabolism, inflammation, and lifespan. Research in multiple model organisms has linked sirtuin activity to longevity, and since sirtuins require NAD⁺ as a substrate (not just a cofactor), maintaining NAD⁺ levels is hypothesised to support sirtuin-mediated longevity pathways.",
                  },
                  {
                    icon: Dna,
                    title: "DNA Repair Research",
                    body: "PARP enzymes (Poly(ADP-Ribose) Polymerases), which consume large amounts of NAD⁺ during DNA damage repair, are essential for genomic stability. The competition between PARP and sirtuins for NAD⁺ creates a functional link between DNA damage, NAD⁺ depletion, and sirtuin activity — a mechanism with direct relevance to longevity and cancer biology research.",
                  },
                  {
                    icon: Battery,
                    title: "Aging Research",
                    body: "NAD⁺ levels in tissues decline consistently with age, and this decline has been proposed as a driver of age-associated metabolic dysfunction. Research with NAD⁺ precursors (NMN, NR) and direct NAD⁺ supplementation in animal models has shown improvements in mitochondrial function, metabolic markers, and several ageing-related parameters.",
                  },
                  {
                    icon: Microscope,
                    title: "Mitochondrial Bioenergetics",
                    body: "NAD⁺ is the primary electron acceptor in the metabolic pathways that generate ATP — glycolysis, the TCA cycle, and fatty acid β-oxidation all produce NADH that feeds the mitochondrial electron transport chain at Complex I. This direct role in ATP synthesis makes NAD⁺ availability a key determinant of mitochondrial efficiency and cellular energy status.",
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <div key={title} style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: "16px", padding: "24px", boxShadow: "0 2px 12px rgba(15,23,42,0.04)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                      <div style={{ padding: "8px", background: "#ECFDF5", borderRadius: "8px", display: "flex" }}>
                        <Icon size={18} style={{ color: "#059669" }} />
                      </div>
                      <h3 style={{ fontSize: "14px", fontWeight: 800, color: "#1E293B" }}>{title}</h3>
                    </div>
                    <p style={{ fontSize: "13.5px", color: "#475569", lineHeight: 1.75 }}>{body}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specs tab */}
          {activeTab === "specs" && (
            <div>
              <div style={{ background: "#fff", border: "1.5px solid #E2E8F0", borderRadius: "16px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0" }}>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "11px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", width: "35%" }}>Property</th>
                      <th style={{ textAlign: "left", padding: "12px 20px", fontSize: "11px", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SPECS.map((s, i) => (
                      <tr key={s.label} style={{ borderBottom: i < SPECS.length - 1 ? "1px solid #F1F5F9" : "none", background: i % 2 === 0 ? "#fff" : "#F8FAFC" }}>
                        <td style={{ padding: "13px 20px", fontSize: "13px", fontWeight: 700, color: "#64748B" }}>{s.label}</td>
                        <td style={{ padding: "13px 20px", fontSize: "13px", color: "#1E293B", fontWeight: 500 }}>{s.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ marginTop: "16px", padding: "14px 18px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                <Info size={15} style={{ color: "#D97706", marginTop: "1px", flexShrink: 0 }} />
                <p style={{ fontSize: "12.5px", color: "#92400E", lineHeight: 1.6 }}>
                  All specifications are for research reference. Certificate of Analysis (COA), HPLC chromatogram, and ESI-MS data are available on the product listing page.
                </p>
              </div>
            </div>
          )}

          {/* Research tab */}
          {activeTab === "research" && (
            <div className="space-y-8">
              {/* Uses */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FlaskConical size={16} style={{ color: "#1240A0" }} /> Research Applications
                </h3>
                <div style={{ display: "grid", sm: "grid-cols-2", gap: "10px" }} className="grid sm:grid-cols-2">
                  {USES.map(use => (
                    <div key={use} style={{ display: "flex", gap: "10px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "12px 16px", alignItems: "flex-start" }}>
                      <CheckCircle2 size={15} style={{ color: "#059669", marginTop: "1px", flexShrink: 0 }} />
                      <p style={{ fontSize: "13.5px", color: "#1E293B" }}>{use}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Layers size={16} style={{ color: "#059669" }} /> Key Research Properties
                </h3>
                <div className="space-y-3">
                  {BENEFITS.map(b => (
                    <div key={b} style={{ display: "flex", gap: "10px", background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "10px", padding: "12px 16px", alignItems: "flex-start" }}>
                      <CheckCircle2 size={15} style={{ color: "#059669", marginTop: "1px", flexShrink: 0 }} />
                      <p style={{ fontSize: "13.5px", color: "#065F46" }}>{b}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Research considerations */}
              <div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <AlertTriangle size={16} style={{ color: "#D97706" }} /> Research Considerations
                </h3>
                <div className="space-y-3">
                  {RESEARCH_NOTES.map(n => (
                    <div key={n} style={{ display: "flex", gap: "10px", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "12px 16px", alignItems: "flex-start" }}>
                      <AlertTriangle size={15} style={{ color: "#D97706", marginTop: "1px", flexShrink: 0 }} />
                      <p style={{ fontSize: "13.5px", color: "#78350F" }}>{n}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Research stack ── */}
        <div className="mt-14 rounded-2xl" style={{ background: "#fff", border: "1.5px solid #E2E8F0", padding: "28px 32px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1E293B", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={16} style={{ color: "#1240A0" }} /> Featured Research Stack
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>
            NAD⁺ is a core component of the Cellular Longevity stack alongside Epithalon and MOTS-C.
          </p>
          <div style={{ background: "#F8FAFF", border: "1px solid #DBEAFE", borderRadius: "12px", padding: "18px 22px" }}>
            <p style={{ fontSize: "14px", fontWeight: 800, color: "#1240A0", marginBottom: "6px" }}>
              Epithalon + MOTS-C + NAD⁺ — Cellular Longevity Stack
            </p>
            <p style={{ fontSize: "13px", color: "#475569", lineHeight: 1.7, marginBottom: "10px" }}>
              Epithalon is a tetrapeptide studied for its ability to activate telomerase and extend telomere length in ageing cell lines. MOTS-C is a mitochondria-derived peptide that regulates metabolic homeostasis and mitochondrial biogenesis. Combined with NAD⁺, this stack represents a leading peptide combination for cellular longevity research — addressing telomere maintenance, mitochondrial decline, and energetic substrate availability in a single protocol.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {["Telomere Biology", "Mitochondrial Biogenesis", "NAD⁺ Metabolism", "Sirtuin Activation", "Ageing Research"].map(tag => (
                <span key={tag} style={{ fontSize: "11px", fontWeight: 600, padding: "3px 9px", borderRadius: "4px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#1D4ED8" }}>{tag}</span>
              ))}
            </div>
          </div>
          <Link href="/stacks" style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "14px", fontSize: "13px", fontWeight: 600, color: "#1240A0", textDecoration: "none" }}>
            View all research stacks →
          </Link>
        </div>

        {/* ── Storage strip ── */}
        <div className="mt-8 rounded-2xl" style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", padding: "28px 32px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1E293B", marginBottom: "16px" }}>Storage & Handling</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "14px" }}>
            {[
              { label: "Dry powder",    val: "−20 °C, up to 24 months",      note: "Sealed, desiccated, from light" },
              { label: "Reconstituted", val: "−20 °C, aliquot for storage",  note: "Use within 24 h or freeze" },
              { label: "Solvent",       val: "Sterile PBS or H₂O (pH 6–7)",  note: "Prepare fresh; avoid alkaline pH" },
              { label: "Light",         val: "Protect from UV",              note: "Amber vial recommended" },
            ].map(s => (
              <div key={s.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "14px 16px" }}>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>{s.label}</p>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>{s.val}</p>
                <p style={{ fontSize: "11.5px", color: "#64748B", marginTop: "2px" }}>{s.note}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "12px", color: "#94A3B8", marginTop: "14px" }}>
            See the <Link href="/storage-guide" style={{ color: "#1B5CB5", fontWeight: 600 }}>full Storage & Handling Guide</Link> for reconstitution protocols and freeze/thaw cycle guidance.
          </p>
        </div>

        {/* ── FAQ ── */}
        <div className="mt-14">
          <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#0F172A", marginBottom: "20px", fontFamily: "'Arimo', Arial, sans-serif" }}>
            Frequently Asked Questions
          </h2>
          <FAQAccordion />
        </div>

        {/* ── Related products ── */}
        <div className="mt-14 rounded-2xl" style={{ background: "#fff", border: "1.5px solid #E2E8F0", padding: "28px 32px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1E293B", marginBottom: "4px", display: "flex", alignItems: "center", gap: "8px" }}>
            <BookOpen size={16} style={{ color: "#1240A0" }} /> Often Researched Alongside NAD⁺
          </h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>Compounds sharing mechanistic overlap in mitochondrial and longevity research.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {["MOTS-C", "SS-31", "Epithalon", "5-Amino-1MQ", "GHK-Cu", "Thymosin Alpha-1"].map(p => (
              <Link
                key={p}
                href="/all-peptides"
                style={{ padding: "8px 16px", borderRadius: "8px", border: "1.5px solid #CBD5E1", background: "#F8FAFC", fontSize: "13px", fontWeight: 600, color: "#1E293B", textDecoration: "none" }}
              >
                {p}
              </Link>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <p className="text-center mt-10" style={{ fontSize: "11.5px", color: "#94A3B8", lineHeight: 1.7 }}>
          <strong style={{ color: "#64748B" }}>Research Use Only.</strong>{" "}
          This product is intended solely for laboratory and in vitro research purposes. Not for human or veterinary use.
          OmniQure Peptide Research Institute accepts no liability for misuse of this product.
        </p>
      </div>
    </div>
  );
}
