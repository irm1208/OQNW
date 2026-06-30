import { useState } from "react";
import { ShoppingCart, Minus, Plus, ShieldCheck, Zap, FlaskConical, Activity, Dna, Battery, Microscope, ChevronDown } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useSEO } from "@/hooks/useSEO";
import { Link } from "wouter";
import type { Product } from "@/data/products";

const SIZES = [
  {
    label: "500mg",
    ref: "NAD-500MG",
    price: 85.00,
    id: "nad-plus-500mg",
    name: "NAD+ 500mg",
    slug: "nad-plus-500mg",
    category: "Cellular Health",
    image: "/products/49.jpg",
  },
] as const;

const FEATURES = [
  { icon: Battery,     label: "Cellular Energy",          detail: "Cofactor in ATP synthesis pathways" },
  { icon: Dna,         label: "DNA Repair Support",       detail: "PARP enzyme substrate for genomic stability" },
  { icon: ShieldCheck, label: "99%+ HPLC Verified",       detail: "Independently tested for purity & identity" },
  { icon: FlaskConical, label: "Research Grade",          detail: "For in vitro laboratory use only" },
];

const SCIENCE = [
  {
    icon: Battery,
    title: "Mitochondrial Bioenergetics",
    body: "NAD⁺ (nicotinamide adenine dinucleotide) is an essential redox cofactor in the electron transport chain. It accepts hydride ions (H⁻) from NADH-generating reactions — glycolysis, the TCA cycle, and fatty acid oxidation — shuttling electrons to Complex I of the mitochondrial respiratory chain. This process drives the proton gradient that powers ATP synthase, making NAD⁺ central to cellular energy production.",
  },
  {
    icon: Dna,
    title: "PARP Activation & DNA Repair",
    body: "Poly(ADP-ribose) polymerases (PARPs) consume NAD⁺ as a substrate to synthesise poly(ADP-ribose) chains at sites of DNA strand breaks, facilitating recruitment of repair enzymes. Cells with adequate NAD⁺ availability show enhanced base excision repair capacity and improved genomic stability under genotoxic stress conditions — a key area of longevity research.",
  },
  {
    icon: Activity,
    title: "Sirtuin Deacetylase Activity",
    body: "Sirtuins (SIRT1–SIRT7) are NAD⁺-dependent protein deacetylases and ADP-ribosyl transferases. By consuming NAD⁺, sirtuins deacetylate target proteins including histones, p53, FOXO transcription factors, and PGC-1α — regulating gene expression programmes linked to mitochondrial biogenesis, stress resistance, inflammation, and metabolic adaptation. NAD⁺ availability directly gates sirtuin activity.",
  },
  {
    icon: Microscope,
    title: "Research Applications",
    body: "Preclinical studies have investigated NAD⁺ supplementation across models of neurodegeneration (Alzheimer's, Parkinson's), metabolic syndrome, cardiac ischaemia-reperfusion injury, and ageing. In rodent models, systemic NAD⁺ augmentation has been associated with improved mitochondrial function, enhanced muscle endurance, and reduced markers of senescence. OmniQure NAD⁺ is supplied for such in vitro and ex vivo research applications.",
  },
];

type FAQItem = { q: string; a: string };
const FAQS: FAQItem[] = [
  {
    q: "What is the difference between NAD+ and NADH?",
    a: "NAD⁺ is the oxidised form and acts as an electron acceptor in catabolic reactions (glycolysis, TCA cycle), becoming NADH when it gains a hydride ion. NADH then donates electrons to the mitochondrial electron transport chain, regenerating NAD⁺. Cellular NAD⁺/NADH ratio reflects the cell's redox and metabolic state. Research peptides that modulate this ratio include MOTS-C and SS-31.",
  },
  {
    q: "How should NAD+ be reconstituted for research?",
    a: "NAD⁺ powder is typically dissolved in sterile phosphate-buffered saline (PBS, pH 7.4) or sterile water. Due to the sensitivity of the nicotinamide ring to alkaline hydrolysis, solutions should be prepared fresh and kept at pH 6–7. Avoid prolonged storage of reconstituted solutions — prepare aliquots and freeze at −20 °C for short-term or −80 °C for longer-term storage.",
  },
  {
    q: "Does NAD+ degrade at room temperature?",
    a: "Yes. Lyophilised NAD⁺ powder is stable at −20 °C for 12–24 months but degrades significantly faster at room temperature (weeks to months depending on humidity). Once reconstituted, solutions should be used within 24 hours or aliquoted and frozen. The glycosidic bond linking nicotinamide to ribose is susceptible to both acid and base hydrolysis.",
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
    description: "Research-grade NAD+ (nicotinamide adenine dinucleotide) 500mg. 99%+ HPLC verified. Studied for mitochondrial bioenergetics, sirtuin activation, PARP-mediated DNA repair, and cellular longevity research.",
    keywords: "NAD+ research, nicotinamide adenine dinucleotide, NAD supplement research, sirtuin activator, PARP substrate, mitochondrial research, cellular energy research",
  });

  const [selectedIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const selected = SIZES[selectedIdx];

  function handleAdd() {
    const product: Product = {
      id: selected.id,
      name: selected.name,
      slug: selected.slug,
      price: selected.price,
      image: selected.image,
      category: selected.category,
    };
    for (let i = 0; i < qty; i++) addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${qty} × ${selected.name}`,
    });
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Image ── */}
          <div
            className="flex items-center justify-center rounded-3xl"
            style={{
              background: "#fff",
              border: "1.5px solid #E2E8F0",
              boxShadow: "0 8px 40px rgba(15,23,42,0.08)",
              padding: "40px",
              minHeight: "420px",
            }}
          >
            <img
              src={selected.image}
              alt={selected.name}
              style={{
                maxWidth: "100%",
                maxHeight: "360px",
                objectFit: "contain",
                borderRadius: "12px",
              }}
            />
          </div>

          {/* ── Info ── */}
          <div>
            {/* Badge */}
            <div className="flex flex-wrap gap-2 mb-4">
              <div style={{ backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "6px", padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: "5px" }}>
                <Zap size={10} style={{ color: "#059669" }} />
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#059669", letterSpacing: "0.08em", textTransform: "uppercase" }}>Cellular Health</span>
              </div>
              <div style={{ backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "6px", padding: "4px 12px", display: "inline-flex", alignItems: "center" }}>
                <span style={{ fontSize: "10px", fontWeight: 800, color: "#1D4ED8", letterSpacing: "0.08em", textTransform: "uppercase" }}>99%+ HPLC Verified</span>
              </div>
            </div>

            <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "4px" }}>
              NAD<sup style={{ fontSize: "0.55em", verticalAlign: "super" }}>+</sup>
            </h1>
            <p style={{ fontSize: "14px", color: "#64748B", fontWeight: 500, marginBottom: "6px" }}>Nicotinamide Adenine Dinucleotide</p>

            {/* REF */}
            <p style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 600, marginBottom: "20px" }}>
              REF&nbsp;
              <span style={{ border: "1.5px solid #CBD5E1", borderRadius: "4px", padding: "1px 6px", fontSize: "12px", color: "#475569", fontWeight: 700 }}>
                {selected.ref}
              </span>
            </p>

            {/* Spec chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "22px" }}>
              {[
                { label: "MW", val: "663.43 g/mol" },
                { label: "Form", val: "Lyophilised Powder" },
                { label: "Purity", val: "≥99% HPLC" },
                { label: "Storage", val: "−20 °C (dry)" },
              ].map(chip => (
                <div key={chip.label} style={{ background: "#F1F5F9", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "4px 10px", fontSize: "12px" }}>
                  <span style={{ color: "#94A3B8", fontWeight: 600 }}>{chip.label}: </span>
                  <span style={{ color: "#1E293B", fontWeight: 700 }}>{chip.val}</span>
                </div>
              ))}
            </div>

            {/* Size — single variant display */}
            <div style={{ marginBottom: "22px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                Size
              </p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                border: "2px solid #059669", borderRadius: "10px",
                padding: "10px 20px", background: "#ECFDF5",
              }}>
                <span style={{ fontSize: "15px", fontWeight: 800, color: "#059669" }}>500mg</span>
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "38px", fontWeight: 900, color: "#0D2565", lineHeight: 1 }}>
                £{selected.price.toFixed(2)}
              </span>
              <span style={{ fontSize: "13px", color: "#94A3B8", marginLeft: "8px" }}>per vial</span>
            </div>

            {/* Qty + Add */}
            <div style={{ marginBottom: "28px", display: "flex", gap: "12px", alignItems: "center" }}>
              <div style={{
                display: "flex", alignItems: "center",
                border: "1.5px solid #E2E8F0", borderRadius: "10px",
                overflow: "hidden", backgroundColor: "#fff",
              }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "#475569" }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: "32px", textAlign: "center", fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "#475569" }}
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={handleAdd}
                style={{
                  flex: 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
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
                <div
                  key={label}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "10px",
                    backgroundColor: "#fff", border: "1px solid #E8EDF5",
                    borderRadius: "10px", padding: "12px 14px",
                  }}
                >
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
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
              What is NAD⁺?
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.80)", lineHeight: 1.75, maxWidth: "540px" }}>
              Nicotinamide adenine dinucleotide (NAD⁺) is a redox cofactor present in every living cell. It is the primary electron carrier in metabolic pathways and a critical substrate for sirtuins and PARP enzymes — making it a central molecule in research into cellular energy, DNA repair, and longevity biology.
            </p>
          </div>
          <div style={{ display: "flex", gap: "32px", flexShrink: 0 }}>
            {[
              { num: "663",   label: "g/mol (MW)" },
              { num: "99%+",  label: "HPLC Purity" },
              { num: "SIRT",  label: "Substrate" },
            ].map(stat => (
              <div key={stat.num} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "22px", fontWeight: 900, color: "#FDE68A", lineHeight: 1 }}>{stat.num}</p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.60)", marginTop: "4px", fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Science sections ── */}
        <div className="mt-16">
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: "#0F172A", marginBottom: "6px", fontFamily: "'Arimo', Arial, sans-serif" }}>
            Research Overview
          </h2>
          <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "32px", lineHeight: 1.7 }}>
            NAD⁺ occupies a central position in cellular metabolism. The following sections summarise the key research pathways relevant to in vitro NAD⁺ studies.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {SCIENCE.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                style={{
                  background: "#fff",
                  border: "1.5px solid #E2E8F0",
                  borderRadius: "16px",
                  padding: "24px",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                }}
              >
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

        {/* ── Storage strip ── */}
        <div
          className="mt-12 rounded-2xl"
          style={{ background: "#F1F5F9", border: "1.5px solid #E2E8F0", padding: "28px 32px" }}
        >
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1E293B", marginBottom: "16px" }}>Storage & Handling</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            {[
              { label: "Dry powder",    val: "−20 °C, up to 24 months",   note: "Sealed, desiccated" },
              { label: "Reconstituted", val: "−20 °C, up to 4 weeks",     note: "Aliquot; avoid repeat freeze/thaw" },
              { label: "Solvent",       val: "Sterile PBS or H₂O (pH 6–7)", note: "Prepare fresh where possible" },
              { label: "Light",         val: "Protect from UV",            note: "Amber vial recommended" },
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

        {/* ── Related products nudge ── */}
        <div className="mt-14 rounded-2xl" style={{ background: "#fff", border: "1.5px solid #E2E8F0", padding: "28px 32px" }}>
          <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#1E293B", marginBottom: "6px" }}>Often Researched Alongside NAD⁺</h3>
          <p style={{ fontSize: "13px", color: "#64748B", marginBottom: "16px" }}>Compounds that share mechanistic overlap in mitochondrial and longevity research.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              { name: "MOTS-C", href: "/all-peptides" },
              { name: "SS-31", href: "/all-peptides" },
              { name: "Epithalon", href: "/all-peptides" },
              { name: "5-Amino-1MQ", href: "/all-peptides" },
              { name: "GHK-Cu", href: "/all-peptides" },
            ].map(p => (
              <Link
                key={p.name}
                href={p.href}
                style={{
                  padding: "8px 16px", borderRadius: "8px",
                  border: "1.5px solid #CBD5E1", background: "#F8FAFC",
                  fontSize: "13px", fontWeight: 600, color: "#1E293B",
                  textDecoration: "none", transition: "border-color 0.15s",
                }}
              >
                {p.name}
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
