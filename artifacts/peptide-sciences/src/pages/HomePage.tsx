import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  Shield, FlaskConical, Truck, Award,
  ChevronRight, ArrowRight, CheckCircle
} from "lucide-react";
import GroupedProductCard from "@/components/GroupedProductCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";


const featuredIds = ["3", "7", "11", "43", "15", "31", "64", "71"];

const pillars = [
  {
    num: "01",
    icon: <FlaskConical size={24} />,
    title: "HPLC Verified Purity",
    body: "Every product tested via High-Performance Liquid Chromatography to confirm 98%+ purity before release.",
    color: "#2A5F5F",
    bg: "#EEF7F7",
  },
  {
    num: "02",
    icon: <Award size={24} />,
    title: "Full COA & MS Data",
    body: "Certificates of Analysis, HPLC chromatograms, and ESI-TOF mass spectra available for every product.",
    color: "#2A5F5F",
    bg: "#EEF7F7",
  },
  {
    num: "03",
    icon: <Shield size={24} />,
    title: "Research Grade Only",
    body: "All peptides manufactured under strict research-grade conditions for in-vitro research applications only.",
    color: "#2A5F5F",
    bg: "#EEF7F7",
  },
  {
    num: "04",
    icon: <Truck size={24} />,
    title: "Fast UK Dispatch",
    body: "Orders placed before noon are dispatched same day in discreet, secure packaging to preserve integrity every step.",
    color: "#2A5F5F",
    bg: "#EEF7F7",
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
    description: "Buy high-purity research peptides verified by HPLC to 98%+. BPC-157, TB-500, Semaglutide, Tirzepatide, Epithalon and 100+ peptides. Worldwide shipping from OmniQure.",
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
    <div style={{ fontFamily: "'Roboto', Arial, sans-serif" }}>

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
        {/* Top-left is transparent so logo shines; text zone darkened for readability */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(10,30,30,0.05) 0%, rgba(10,30,30,0.05) 28%, rgba(10,30,30,0.72) 48%, rgba(10,30,30,0.85) 65%, rgba(10,30,30,0.72) 100%)",
          pointerEvents: "none",
        }} />
        {/* Left-to-right overlay — full dark on mobile, fades right on desktop */}
        <div className="hero-overlay-lr" style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }} />
        {/* Teal glow amplifier behind the logo (top-left) */}
        <div style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "800px",
          height: "560px",
          background: "radial-gradient(ellipse at 35% 38%, rgba(42,95,95,0.55) 0%, rgba(42,63,63,0.30) 35%, rgba(10,30,30,0.12) 60%, rgba(0,0,0,0.0) 75%)",
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
              Peptides.{" "}
              <span className="gradient-text">Verified.</span>
              <br />
              <span className="gradient-text">Delivered.</span>
            </h1>

            <p
              className="mb-7 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.78)", fontSize: "16px" }}
            >
              Every vial independently verified to 98%+ HPLC purity — backed by full COA documentation and ESI-TOF mass spectrometry data. Trusted by researchers who demand certainty.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["98%+ HPLC Purity", "Full COA Included", "ESI-TOF MS", "Lyophilized"].map(t => (
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
                  color: "#2A5F5F",
                  padding: "13px 26px",
                  borderRadius: 0,
                  fontWeight: 700,
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
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
        background: "linear-gradient(100deg, #0C1F1F 0%, #1A3535 35%, #2A4545 75%, #2A5F5F 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Glow accent */}
        <div style={{ position: "absolute", top: "-40px", right: "20%", width: "220px", height: "100px", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "24px 24px", pointerEvents: "none" }} />
        <div className="max-w-[1280px] mx-auto px-4 py-4" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px", justifyContent: "space-between" }}>
            {/* Left label */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <div style={{ backgroundColor: "#34D399", borderRadius: "6px", padding: "3px 9px" }}>
                <span style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.1em", color: "#022c22", textTransform: "uppercase" }}>Bundle & Save</span>
              </div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>The more you order, the more you save</span>
            </div>
            {/* Tiers + CTA */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", alignItems: "center" }}>
              {[
                { label: "3+ vials",  pct: "5%",  bg: "rgba(96,165,250,0.15)",  border: "rgba(96,165,250,0.4)",  pctColor: "#93C5FD" },
                { label: "7+ vials",  pct: "10%", bg: "rgba(52,211,153,0.15)",  border: "rgba(52,211,153,0.4)",  pctColor: "#6EE7B7" },
                { label: "11+ vials", pct: "15%", bg: "rgba(251,191,36,0.15)",  border: "rgba(251,191,36,0.4)",  pctColor: "#FDE68A" },
                { label: "15+ vials", pct: "20%", bg: "rgba(248,113,113,0.18)", border: "rgba(248,113,113,0.45)", pctColor: "#FCA5A5" },
              ].map(t => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: "8px", padding: "6px 13px" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{t.label}</span>
                  <span style={{ fontSize: "15px", fontWeight: 900, color: t.pctColor, lineHeight: 1 }}>{t.pct}</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: 700 }}>OFF</span>
                </div>
              ))}
              <Link
                href="/bundles"
                style={{ fontSize: "12.5px", fontWeight: 800, color: "#022c22", backgroundColor: "#34D399", padding: "7px 18px", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 0 16px rgba(52,211,153,0.35)" }}
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
              { icon: <FlaskConical size={20} />, title: "98%+ HPLC Purity",    sub: "Guaranteed on every product",     color: "#2A5F5F", bg: "#EEF7F7" },
              { icon: <Award size={20} />,        title: "Full COA & MS Data",   sub: "Chromatogram + mass spectrum",    color: "#2A5F5F", bg: "#EEF7F7" },
              { icon: <Shield size={20} />,       title: "Research Grade",       sub: "For qualified researchers only",  color: "#2A5F5F", bg: "#EEF7F7" },
              { icon: <Truck size={20} />,        title: "Free Shipping £100+",  sub: "Discreet packaging included",     color: "#2A5F5F", bg: "#EEF7F7" },
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
              <p style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3em", color: "#2A5F5F", marginBottom: 8 }}>
                MOST RESEARCHED
              </p>
              <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "30px", fontWeight: 500, color: "#2C3E3E", margin: "0 0 4px" }}>
                Featured Peptides
              </h2>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Our most popular research compounds, all HPLC verified
              </p>
            </div>
            <Link
              href="/popular-peptides"
              className="hidden sm:flex items-center gap-1.5 font-semibold"
              style={{ fontSize: "13px", color: "#2A5F5F", textDecoration: "none", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
            >
              View popular collection <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {featuredGroups.map(group => (
              <GroupedProductCard key={group.baseName} group={group} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OMNIQURE ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5F5F5", padding: "68px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <p style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3em", color: "#2A5F5F", marginBottom: 10 }}>
              OUR COMMITMENT
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "30px", fontWeight: 500, color: "#2C3E3E", margin: "0 0 10px" }}>
              Why Choose OmniQure?
            </h2>
            <p style={{ fontSize: "15px", color: "#64748B", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              Every peptide we supply meets the highest standards in research-grade manufacturing, analytical verification, and quality-assured dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* ── RESEARCH BANNER ───────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", padding: "68px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, #0C1F1F 0%, #1A3535 30%, #2A4545 60%, #2A5F5F 100%)",
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
                background: "radial-gradient(circle, rgba(42,95,95,0.25) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />

            <div className="flex flex-col lg:flex-row items-center relative" style={{ zIndex: 1 }}>
              {/* Left text */}
              <div className="flex-1 p-10 lg:p-14 text-white">
                <p style={{ fontSize: "9px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.3em", color: "#A8D4D4", marginBottom: 10 }}>
                  OMNIQURE PEPTIDE RESEARCH INSTITUTE
                </p>
                <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 500, lineHeight: 1.2, color: "#FFFFFF", margin: "0 0 12px" }}>
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
                      color: "#2A5F5F",
                      padding: "11px 22px",
                      borderRadius: 0,
                      fontWeight: 700,
                      fontSize: "13px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
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
      <section style={{ backgroundColor: "#F5F5F5", borderTop: "1px solid #D4E8E8", padding: "20px 0" }}>
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
