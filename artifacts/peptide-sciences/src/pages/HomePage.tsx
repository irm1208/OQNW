import { useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  Shield, FlaskConical, Truck, Award,
  ChevronRight, ArrowRight, CheckCircle
} from "lucide-react";
import GroupedProductCard from "@/components/GroupedProductCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";

const RESEARCH_AREAS = [
  {
    n: "01", tag: "Recovery",
    title: "Tissue Repair & Recovery",
    peptides: "BPC-157 · TB-500",
    desc: "Studied for roles in accelerating tissue remodelling, tendon healing, and cellular repair cascades in controlled laboratory models.",
    img: "https://infomeddnews.com/wp-content/uploads/2022/05/Physiotherapy-696x464.jpg",
    accent: "#60A5FA",
  },
  {
    n: "02", tag: "Cognitive",
    title: "Brain & Cognitive Health",
    peptides: "Semax · Selank · P21",
    desc: "Investigated for neuroprotective mechanisms, BDNF upregulation, and synaptic plasticity in neurological research settings.",
    img: "https://media.istockphoto.com/id/97506007/photo/mri-scan-of-brain.jpg?s=612x612&w=0&k=20&c=C5ttWq3Fu7I93zx5jOkHlAZ1ILuHslWWRzNMTToOKHA=",
    accent: "#93C5FD",
  },
  {
    n: "03", tag: "Metabolic",
    title: "Weight & Metabolic Research",
    peptides: "Tirzepatide · Retatrutide · AOD-9604",
    desc: "GLP-1 receptor agonist research — investigated for appetite signalling, adipogenesis pathways, and lipid metabolism models.",
    img: "https://cehs.usu.edu/khs/images/labs/banners/body-composition-lab.jpg",
    accent: "#34D399",
  },
  {
    n: "04", tag: "Skin",
    title: "Skin & Collagen Biology",
    peptides: "GHK-Cu",
    desc: "Researched for collagen synthesis stimulation, oxidative stress modulation, and dermal fibroblast activity in skin biology studies.",
    img: "https://media.gettyimages.com/id/1024433198/photo/close-up-marco-shots-of-body-parts.jpg?s=612x612&w=0&k=20&c=zy5-5uHIAp7-9ZxrG998qhxv0CLC-cjAISGFb_BfrFQ=",
    accent: "#38BDF8",
  },
  {
    n: "05", tag: "Hormonal",
    title: "Growth Hormone Axis",
    peptides: "CJC-1295 · Ipamorelin · GHRP-6",
    desc: "Investigated for GHRH receptor binding, pulsatile GH secretion mimicry, and downstream IGF-1 pathway research.",
    img: "https://kin.uncg.edu/wp-content/uploads/2023/10/Exercise-and-Endocrinology-Lab-1024x576.jpg",
    accent: "#3B82F6",
  },
  {
    n: "06", tag: "Immune",
    title: "Immune Regulation",
    peptides: "Thymosin α-1 · KPV · LL-37",
    desc: "Studied for T-cell maturation pathways, cytokine modulation, and innate immune response interactions in controlled models.",
    img: "https://media.istockphoto.com/id/641212596/photo/white-blood-cells.jpg?s=612x612&w=0&k=20&c=H4jXuqjqaQdYKc1HjvNNbtVFRj9SdBYQWNe_pPmQtoY=",
    accent: "#93C5FD",
  },
  {
    n: "07", tag: "Longevity",
    title: "Longevity & Anti-Ageing",
    peptides: "Epithalon · SS-31 · MOTS-C",
    desc: "Investigated for telomerase activation, mitochondrial protection, and cellular senescence pathways in longevity research.",
    img: "https://images.presentationgo.com/2025/04/dna-strand-break-3d.jpg",
    accent: "#6EE7B7",
  },
  {
    n: "08", tag: "Cardiovascular",
    title: "Cardiovascular Research",
    peptides: "BPC-157 · TB-500 · VIP",
    desc: "Studied for angiogenesis pathway interactions, cardiac cell protection mechanisms, and vascular tone regulation in laboratory models.",
    img: "https://media.istockphoto.com/id/1266227507/photo/human-heart-with-blood-vessels.jpg?s=612x612&w=0&k=20&c=sj63aWFsM6Z6Qovl5jUcQoOR4qG6otKN5hFCi0n9JGY=",
    accent: "#1B5CB5",
  },
];

function ResearchAreaCard({ n, tag, title, peptides, desc, img, accent, featured = false }: {
  n: string; tag: string; title: string; peptides: string; desc: string;
  img: string; accent: string; featured?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const cardHeight = featured ? "100%" : 220;
  return (
    <div
      className={featured ? "" : "research-card"}
      style={{
        position: "relative", overflow: "hidden",
        height: featured ? "100%" : cardHeight,
        minHeight: featured ? 400 : undefined,
        background: "#071A4A", cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo */}
      <img
        src={img} alt={title}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover",
          filter: `saturate(${hovered ? 0.55 : 0.35}) brightness(${hovered ? 0.7 : 0.55})`,
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.7s ease, filter 0.5s ease",
        }}
      />
      {/* Gradient overlay — stronger at bottom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(0deg, rgba(4,10,20,0.96) 0%, rgba(4,10,20,0.55) 45%, rgba(4,10,20,0.15) 100%)",
      }} />
      {/* Left accent bar — slides in on hover */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: 3, height: hovered ? "100%" : 0,
        background: `linear-gradient(180deg, ${accent}, ${accent}66)`,
        transition: "height 0.45s cubic-bezier(0.16,1,0.3,1)",
      }} />

      {/* Top: tag chip */}
      <div style={{ position: "absolute", top: 18, left: 18, zIndex: 2 }}>
        <span style={{
          display: "inline-block", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#FFFFFF",
          background: `${accent}33`,
          border: `1px solid ${accent}55`,
          padding: "3px 10px",
          backdropFilter: "blur(4px)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.3s, transform 0.35s",
        }}>{tag}</span>
      </div>

      {/* Bottom content */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: featured ? "28px 32px" : "22px 24px",
      }}>
        <span style={{
          display: "block", fontSize: 9, fontWeight: 700,
          color: accent, letterSpacing: "0.3em", textTransform: "uppercase",
          marginBottom: 8,
          opacity: hovered ? 0.9 : 0.55,
          transition: "opacity 0.3s",
        }}>{n}</span>

        <h3 style={{
          fontSize: featured ? 22 : 17, fontWeight: 800,
          color: "#FFFFFF", lineHeight: 1.2, margin: "0 0 0 0",
          letterSpacing: "-0.02em",
        }}>{title}</h3>

        {/* Peptides + desc — slide up on hover */}
        <div style={{
          maxHeight: hovered ? 120 : 0,
          overflow: "hidden",
          transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <p style={{
            fontSize: 11.5, color: "rgba(255,255,255,0.60)", lineHeight: 1.65,
            margin: "10px 0 8px",
          }}>{desc}</p>
          <p style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
            color: accent, margin: 0,
          }}>{peptides}</p>
        </div>
      </div>
    </div>
  );
}


const featuredIds = ["3", "7", "11", "43", "15", "31", "64", "71"];

const pillars = [
  {
    num: "01",
    icon: <FlaskConical size={24} />,
    title: "HPLC Verified Purity",
    body: "Every product tested via High-Performance Liquid Chromatography to confirm 99%+ purity before release.",
    color: "#1B5CB5",
    bg: "#EEF4FF",
  },
  {
    num: "02",
    icon: <Award size={24} />,
    title: "Full COA & MS Data",
    body: "Certificates of Analysis, HPLC chromatograms, and ESI-TOF mass spectra available for every product.",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    num: "03",
    icon: <Shield size={24} />,
    title: "Research Grade Only",
    body: "All peptides manufactured under strict research-grade conditions for in-vitro research applications only.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    num: "04",
    icon: <Truck size={24} />,
    title: "Fast UK Dispatch",
    body: "Orders placed before noon are dispatched same day in discreet, secure packaging to preserve integrity every step.",
    color: "#0E7490",
    bg: "#ECFEFF",
  },
];

/* ── Molecule decoration SVG ─────────────────────────── */
function MoleculeSVG() {
  return (
    <svg viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Connecting lines */}
      <line x1="170" y1="170" x2="80"  y2="90"  stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="260" y2="90"  stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="80"  y2="260" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="260" y2="260" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1="80"  y1="90"  x2="260" y2="90"  stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
      <line x1="80"  y1="260" x2="260" y2="260" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
      <line x1="170" y1="170" x2="170" y2="50"  stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="170" y2="290" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="50"  y2="170" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="290" y2="170" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

      {/* Outer nodes */}
      <circle cx="80"  cy="90"  r="14" fill="rgba(147,197,253,0.22)" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" />
      <circle cx="260" cy="90"  r="10" fill="rgba(165,243,252,0.18)" stroke="rgba(165,243,252,0.45)" strokeWidth="1.5" />
      <circle cx="80"  cy="260" r="10" fill="rgba(165,243,252,0.18)" stroke="rgba(165,243,252,0.45)" strokeWidth="1.5" />
      <circle cx="260" cy="260" r="14" fill="rgba(147,197,253,0.22)" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" />
      <circle cx="170" cy="50"  r="8"  fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)"  strokeWidth="1.5" />
      <circle cx="170" cy="290" r="8"  fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)"  strokeWidth="1.5" />
      <circle cx="50"  cy="170" r="8"  fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)"  strokeWidth="1.5" />
      <circle cx="290" cy="170" r="8"  fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)"  strokeWidth="1.5" />

      {/* Center node */}
      <circle cx="170" cy="170" r="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <circle cx="170" cy="170" r="16" fill="rgba(147,197,253,0.3)"  stroke="rgba(147,197,253,0.7)"  strokeWidth="2" />
      <circle cx="170" cy="170" r="6"  fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

export default function HomePage() {
  const { products } = useProducts();
  useSEO({
    title: "HPLC-Verified Research Peptides",
    description: "Buy high-purity research peptides verified by HPLC to 99%+. BPC-157, TB-500, Semaglutide, Tirzepatide, Epithalon and 100+ peptides. Worldwide shipping from OmniQure.",
    canonicalPath: "/",
  });

  const featuredGroups = (() => {
    const featuredProducts = featuredIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as typeof products;
    const allGroups = groupProducts(products);
    return featuredProducts
      .map(p => allGroups.find(g => g.baseName === parseName(p.name).baseName))
      .filter((g): g is NonNullable<typeof g> => g != null)
      .filter((g, i, arr) => arr.findIndex(x => x.baseName === g.baseName) === i);
  })();

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        className="hero-section"
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: "url('/hero-vials.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "unset",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {/* Bottom fade so text remains readable against the light product image */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(2,11,30,0.0) 0%, rgba(2,11,30,0.0) 35%, rgba(2,11,30,0.45) 60%, rgba(2,11,30,0.60) 100%)",
          pointerEvents: "none",
        }} />
        {/* Left-to-right overlay — full dark on mobile, fades right on desktop */}
        <div className="hero-overlay-lr" style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }} />
        {/* Subtle blue glow behind the logo (top-left) */}
        <div style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "800px",
          height: "560px",
          background: "radial-gradient(ellipse at 35% 38%, rgba(40,120,255,0.18) 0%, rgba(20,80,230,0.10) 30%, rgba(10,50,180,0.04) 55%, rgba(0,0,0,0.0) 75%)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }} />

        {/* Content — below the logo in the image */}
        <div className="hero-content max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ position: "relative", zIndex: 1 }}>

          <div className="hero-text text-white">

            <h1
              className="font-bold mb-5"
              style={{
                fontSize: "clamp(28px, 7vw, 62px)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              Research-Grade<br />
              Peptides.<br />
              <span className="gradient-text">Third Party Verified.</span>
            </h1>

            <p
              className="mb-7 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.78)", fontSize: "16px" }}
            >
              Built for researchers who don't cut corners.<br />
              Every compound is independently tested to 99%+ purity,<br />
              fully documented, and ready for the lab.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["99%+ HPLC Purity", "Full COA Included", "Third Party Tested"].map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#E2E8F0",
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "5px 12px",
                    borderRadius: "20px",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <CheckCircle size={12} style={{ color: "#34D399" }} />
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/all-peptides"
                className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{
                  backgroundColor: "#fff",
                  color: "#1240A0",
                  padding: "13px 26px",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                Browse All 81 Peptides <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── BUNDLE & SAVE STRIP ────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div className="max-w-[1280px] mx-auto px-4 py-4">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px", justifyContent: "space-between" }}>
            {/* Left label */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <div style={{ backgroundColor: "#34D399", borderRadius: "6px", padding: "3px 9px" }}>
                <span style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.1em", color: "#022c22", textTransform: "uppercase" }}>Bundle & Save</span>
              </div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.80)", fontWeight: 600 }}>The more you order, the more you save</span>
            </div>
            {/* Tiers + CTA */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", alignItems: "center" }}>
              {[
                { label: "3+ vials",  pct: "5%",  bg: "rgba(96,165,250,0.18)",  border: "rgba(96,165,250,0.40)",  pctColor: "#93C5FD" },
                { label: "7+ vials",  pct: "10%", bg: "rgba(52,211,153,0.18)",  border: "rgba(52,211,153,0.40)",  pctColor: "#6EE7B7" },
                { label: "11+ vials", pct: "15%", bg: "rgba(251,191,36,0.18)",  border: "rgba(251,191,36,0.40)",  pctColor: "#FDE68A" },
                { label: "15+ vials", pct: "20%", bg: "rgba(167,139,250,0.18)", border: "rgba(167,139,250,0.40)", pctColor: "#C4B5FD" },
              ].map(t => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: "8px", padding: "6px 13px" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{t.label}</span>
                  <span style={{ fontSize: "15px", fontWeight: 900, color: t.pctColor, lineHeight: 1 }}>{t.pct}</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>OFF</span>
                </div>
              ))}
              <Link
                href="/bundles"
                style={{ fontSize: "12.5px", fontWeight: 800, color: "#022c22", backgroundColor: "#34D399", padding: "7px 18px", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 2px 8px rgba(52,211,153,0.25)" }}
              >
                Build a Bundle →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", borderBottom: "1px solid #EEF2F7" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#EEF2F7]">
            {[
              { icon: <FlaskConical size={20} />, title: "99%+ HPLC Purity",    sub: "Guaranteed on every product",     color: "#1B5CB5", bg: "#EEF4FF" },
              { icon: <Award size={20} />,        title: "Full COA & MS Data",   sub: "Chromatogram + mass spectrum",    color: "#059669", bg: "#ECFDF5" },
              { icon: <Shield size={20} />,       title: "Research Grade",       sub: "For qualified researchers only",  color: "#7C3AED", bg: "#F5F3FF" },
              { icon: <Truck size={20} />,        title: "Free Shipping £100+",  sub: "Discreet packaging included",     color: "#0E7490", bg: "#ECFEFF" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 py-5 px-5"
              >
                <div
                  className="flex-shrink-0 rounded-xl flex items-center justify-center"
                  style={{ width: "44px", height: "44px", backgroundColor: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: "13px", color: "#0F172A" }}>{item.title}</p>
                  <p style={{ fontSize: "11.5px", color: "#64748B", marginTop: "1px" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PEPTIDES ─────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", padding: "68px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div style={{ width: "3px", height: "16px", background: "linear-gradient(180deg, #059669, #34D399)", borderRadius: "2px" }} />
                <p className="font-bold uppercase tracking-widest" style={{ fontSize: "11px", color: "#059669", letterSpacing: "0.1em" }}>
                  MOST RESEARCHED
                </p>
              </div>
              <h2 className="font-bold" style={{ fontSize: "30px", color: "#0F172A", letterSpacing: "-0.02em" }}>
                Featured Peptides
              </h2>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Our most popular research compounds, all HPLC verified
              </p>
            </div>
            <Link
              href="/popular-peptides"
              className="hidden sm:flex items-center gap-1.5 font-semibold"
              style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
            >
              View popular collection <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {featuredGroups.slice(0, 4).map(group => (
              <GroupedProductCard key={group.baseName} group={group} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OMNIQURE ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", padding: "68px 0", borderTop: "1px solid #E2E8F0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-2">
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #7C3AED, #A78BFA)", borderRadius: "2px" }} />
              <p className="font-bold uppercase tracking-widest" style={{ fontSize: "11px", color: "#7C3AED", letterSpacing: "0.1em" }}>
                OUR COMMITMENT
              </p>
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #A78BFA, #7C3AED)", borderRadius: "2px" }} />
            </div>
            <h2 className="font-bold" style={{ fontSize: "30px", color: "#0F172A", letterSpacing: "-0.02em" }}>
              Why Choose OmniQure?
            </h2>
            <p style={{ fontSize: "15px", color: "#64748B", maxWidth: "520px", margin: "8px auto 0", lineHeight: 1.7 }}>
              Every peptide we supply meets the highest standards in research-grade manufacturing, analytical verification, and quality-assured dispatch.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl relative overflow-hidden"
                style={{
                  backgroundColor: "#fff",
                  border: "1.5px solid #E8EDF5",
                  padding: "0",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${p.color}18`;
                  (e.currentTarget as HTMLElement).style.borderColor = p.color + "44";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(15,23,42,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E8EDF5";
                }}
              >
                {/* Gradient top accent */}
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${p.color}, ${p.color}66)`, borderRadius: "12px 12px 0 0" }} />
                <div style={{ padding: "26px 22px 22px" }}>
                  {/* Number accent */}
                  <span
                    style={{
                      position: "absolute",
                      top: "18px",
                      right: "18px",
                      fontSize: "42px",
                      fontWeight: 900,
                      color: "#F1F5F9",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      userSelect: "none",
                    }}
                  >
                    {p.num}
                  </span>

                  <div
                    className="flex items-center justify-center rounded-xl mb-4"
                    style={{ width: "50px", height: "50px", backgroundColor: p.bg, color: p.color }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-bold mb-2" style={{ fontSize: "15px", color: "#0F172A" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.65 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEARCH AREAS ────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", borderTop: "3px solid #34D399" }}>
        {/* ── Header strip ── */}
        <div style={{ padding: "64px 0 48px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="max-w-[1280px] mx-auto" style={{ padding: "0 32px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            {/* Left */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, #60A5FA, #93C5FD)" }} />
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.28em", color: "#93C5FD", margin: 0, opacity: 0.7 }}>Research Applications</p>
              </div>
              <h2 style={{ fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.03em", color: "#FFFFFF", margin: 0 }}>
                What peptides<br />
                <span style={{ background: "linear-gradient(90deg, #60A5FA, #93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  are used for.
                </span>
              </h2>
            </div>
            {/* Right */}
            <div style={{ maxWidth: 380 }}>
              <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.60)", lineHeight: 1.78, marginBottom: 24 }}>
                Each category below represents an active area of peptide investigation — from cellular repair mechanisms to longevity pathways. Hover any card to see which specific compounds are under study.
              </p>
              <Link
                href="/all-peptides"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.16em", color: "#93C5FD", textDecoration: "none",
                }}
              >
                Browse All Compounds <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Uniform 4×2 grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 1, background: "rgba(255,255,255,0.06)" }}>
          {RESEARCH_AREAS.map(area => (
            <ResearchAreaCard key={area.n} {...area} />
          ))}
        </div>

        {/* ── Bottom CTA strip ── */}
        <div style={{ padding: "28px 32px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div className="max-w-[1280px] mx-auto w-full" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, letterSpacing: "0.02em" }}>
              All research applications listed for <strong style={{ color: "rgba(255,255,255,0.6)" }}>in-vitro laboratory use only</strong> — not for human consumption.
            </p>
            <Link
              href="/all-peptides"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
                color: "#93C5FD", padding: "10px 22px", borderRadius: 8,
                fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.14em", textDecoration: "none",
              }}
            >
              Shop All 81 Peptides <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── RESEARCH BANNER ───────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", padding: "68px 0", borderTop: "1px solid #E2E8F0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, #020B1E 0%, #071A4A 30%, #0D2565 60%, #1240A0 100%)",
              minHeight: "260px",
            }}
          >
            {/* Dot grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
                backgroundSize: "28px 28px",
                pointerEvents: "none",
              }}
            />
            {/* Glow */}
            <div
              style={{
                position: "absolute",
                top: "-60px",
                right: "20%",
                width: "320px",
                height: "320px",
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div className="flex flex-col lg:flex-row items-center relative" style={{ zIndex: 1 }}>
              {/* Left text */}
              <div className="flex-1 p-10 lg:p-14 text-white">
                <p className="font-bold uppercase tracking-widest mb-2" style={{ fontSize: "11px", color: "#93C5FD", letterSpacing: "0.1em" }}>
                  OMNIQURE PEPTIDE RESEARCH INSTITUTE
                </p>
                <h2 className="font-bold mb-3" style={{ fontSize: "clamp(22px,3vw,32px)", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                  Supporting the Scientific<br />Community
                </h2>
                <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "14.5px", lineHeight: 1.75, maxWidth: "440px" }}>
                  From cell culture experiments to advanced in-vitro models, OmniQure provides researchers with analytically verified peptides backed by full documentation. Every product includes HPLC, ESI-MS, and COA data.
                </p>
                <div className="flex flex-wrap gap-3 mt-7">
                  <Link
                    href="/all-peptides"
                    className="btn-primary inline-flex items-center gap-2"
                    style={{
                      backgroundColor: "#fff",
                      color: "#1240A0",
                      padding: "11px 22px",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "13.5px",
                      textDecoration: "none",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
                    }}
                  >
                    Shop All Peptides <ChevronRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Right data blocks */}
              <div className="lg:pr-12 pb-10 lg:pb-0 px-10 lg:px-0 flex flex-col gap-3">
                {[
                  { label: "HPLC Tested",    detail: "All 81 products",      icon: "🔬" },
                  { label: "ESI-TOF MS",      detail: "Identity confirmed",   icon: "⚗️" },
                  { label: "Lyophilized",     detail: "Stable & pure",        icon: "🧊" },
                  { label: "RUO Certified",   detail: "Research use only",    icon: "🏷️" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="glass-card flex items-center gap-4 rounded-xl"
                    style={{ padding: "14px 20px", minWidth: "220px" }}
                  >
                    <span style={{ fontSize: "20px" }}>{item.icon}</span>
                    <div>
                      <p className="font-bold text-white" style={{ fontSize: "13.5px" }}>{item.label}</p>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11.5px", marginTop: "1px" }}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", borderTop: "1px solid #E8EDF5", padding: "20px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-center" style={{ fontSize: "11.5px", color: "#94A3B8", lineHeight: 1.7 }}>
            <strong style={{ color: "#64748B" }}>Research Use Only.</strong>{" "}
            All products are intended strictly for in-vitro laboratory research. Not approved by the FDA. Not for human or animal use. Must be 18+ and a qualified researcher to purchase.
          </p>
        </div>
      </section>

    </div>
  );
}
