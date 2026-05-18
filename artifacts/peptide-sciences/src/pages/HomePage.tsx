import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  Shield, FlaskConical, Truck, Award, Microscope, Brain, Heart,
  Dumbbell, Scale, Clock, Zap, Leaf, Flame, Sparkles, Activity,
  TrendingUp, ChevronRight, ArrowRight, CheckCircle
} from "lucide-react";
import GroupedProductCard from "@/components/GroupedProductCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";

const categories = [
  { name: "Growth Peptides",      icon: <Dumbbell size={20} />,    color: "#1B5CB5", bg: "#EEF4FF" },
  { name: "Healing Peptides",     icon: <Heart size={20} />,       color: "#DC2626", bg: "#FEF2F2" },
  { name: "Weight Management",    icon: <Scale size={20} />,       color: "#7C3AED", bg: "#F5F3FF" },
  { name: "Longevity Peptides",   icon: <Clock size={20} />,       color: "#0E7490", bg: "#ECFEFF" },
  { name: "Cellular Health",      icon: <Microscope size={20} />,  color: "#065F46", bg: "#ECFDF5" },
  { name: "Nootropics",           icon: <Brain size={20} />,       color: "#9333EA", bg: "#FAF5FF" },
  { name: "Immune Support",       icon: <Shield size={20} />,      color: "#1B5CB5", bg: "#EEF4FF" },
  { name: "Research Peptides",    icon: <FlaskConical size={20} />,color: "#B45309", bg: "#FFFBEB" },
  { name: "Peptide Blends",       icon: <Zap size={20} />,         color: "#DC2626", bg: "#FEF2F2" },
  { name: "Skin & Repair",        icon: <Sparkles size={20} />,    color: "#BE185D", bg: "#FDF2F8" },
  { name: "Hormonal Peptides",    icon: <Activity size={20} />,    color: "#0E7490", bg: "#ECFEFF" },
  { name: "Growth Hormone",       icon: <TrendingUp size={20} />,  color: "#065F46", bg: "#ECFDF5" },
  { name: "Anti-Inflammatory",    icon: <Leaf size={20} />,        color: "#7C3AED", bg: "#F5F3FF" },
  { name: "Cognitive Peptides",   icon: <Flame size={20} />,       color: "#B45309", bg: "#FFFBEB" },
];

const featuredIds = ["3", "7", "11", "43", "15", "31", "64", "71"];

const pillars = [
  {
    num: "01",
    icon: <FlaskConical size={24} />,
    title: "HPLC Verified Purity",
    body: "Every product tested via High-Performance Liquid Chromatography to confirm 98%+ purity before release.",
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
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #020B1E 0%, #071A4A 25%, #0D2565 50%, #1240A0 80%, #1B5CB5 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.07) 1px, transparent 0)",
            backgroundSize: "32px 32px",
            pointerEvents: "none",
          }}
        />

        {/* Animated glow orbs */}
        <div
          className="animate-pulse-glow"
          style={{
            position: "absolute",
            top: "-120px",
            right: "15%",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="animate-pulse-glow"
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "5%",
            width: "360px",
            height: "360px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
            animationDelay: "1.5s",
          }}
        />

        <div className="max-w-[1280px] mx-auto px-4 py-16 lg:py-24">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left — copy */}
            <div className="flex-1 text-white" style={{ zIndex: 1 }}>
              {/* Brand logo badge */}
              <div className="mb-6">
                <img
                  src="/omniqure-logo.jpeg"
                  alt="OmniQure Peptide Research Institute"
                  style={{
                    height: "56px",
                    width: "auto",
                    display: "block",
                    borderRadius: "10px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                />
              </div>

              <h1
                className="font-bold mb-6"
                style={{
                  fontSize: "clamp(36px, 5vw, 64px)",
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
                className="mb-8 leading-relaxed"
                style={{ color: "rgba(255,255,255,0.72)", fontSize: "16.5px", maxWidth: "500px" }}
              >
                81 HPLC-verified peptides — each backed by full COA and ESI-TOF mass spectrometry data. The standard for serious researchers.
              </p>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["98%+ HPLC Purity", "Full COA Included", "ESI-TOF MS", "Lyophilized"].map(t => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.16)",
                      color: "#E2E8F0",
                      fontSize: "12px",
                      fontWeight: 600,
                      padding: "5px 12px",
                      borderRadius: "20px",
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
                  className="btn-primary inline-flex items-center gap-2"
                  style={{
                    backgroundColor: "#fff",
                    color: "#1240A0",
                    padding: "13px 26px",
                    borderRadius: "12px",
                    fontWeight: 800,
                    fontSize: "14px",
                    textDecoration: "none",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
                  }}
                >
                  Browse All 81 Peptides <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Right — Premium Product Showcase */}
            <div className="hidden lg:flex flex-shrink-0 flex-col items-center gap-4" style={{ zIndex: 1, position: "relative", width: "280px" }}>

              {/* Floating badge — top right */}
              <div style={{ position: "absolute", top: "-14px", right: "-22px", zIndex: 20 }}>
                <div
                  className="animate-float-medium glass-card"
                  style={{ padding: "6px 13px", borderRadius: "30px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#A78BFA", flexShrink: 0 }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>ESI-TOF MS ✓</span>
                </div>
              </div>

              {/* Floating badge — bottom left */}
              <div style={{ position: "absolute", bottom: "72px", left: "-24px", zIndex: 20 }}>
                <div
                  className="animate-float-slow glass-card"
                  style={{ padding: "6px 13px", borderRadius: "30px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#60A5FA", flexShrink: 0 }} />
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>Store at −20°C</span>
                </div>
              </div>

              {/* Main product card */}
              <div
                className="glass-card animate-float-slow"
                style={{ borderRadius: "22px", padding: "18px", width: "100%", position: "relative", overflow: "hidden" }}
              >
                {/* Shimmer glow */}
                <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(147,197,253,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />

                {/* Header: label + popular pill */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "13px" }}>
                  <span style={{ fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" }}>
                    Featured Compound
                  </span>
                  <span style={{
                    fontSize: "9px", fontWeight: 700, color: "#FDE68A",
                    backgroundColor: "rgba(251,191,36,0.12)", padding: "3px 9px",
                    borderRadius: "8px", border: "1px solid rgba(251,191,36,0.22)", letterSpacing: "0.06em"
                  }}>
                    ★ MOST POPULAR
                  </span>
                </div>

                {/* Image box */}
                <div style={{
                  borderRadius: "14px",
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  padding: "10px",
                  marginBottom: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  height: "138px",
                }}>
                  <img src="/products/3.jpg" alt="BPC-157 5mg" style={{ maxHeight: "118px", objectFit: "contain" }} />
                </div>

                {/* Name + category */}
                <p style={{ fontSize: "15px", fontWeight: 800, color: "#fff", marginBottom: "2px", lineHeight: 1.2 }}>BPC-157</p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.48)", marginBottom: "13px" }}>5mg · Healing Peptide</p>

                {/* Price + badges */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "20px", fontWeight: 900, color: "#fff" }}>£65.00</span>
                  <div style={{ display: "flex", gap: "5px" }}>
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#93C5FD", backgroundColor: "rgba(147,197,253,0.12)", padding: "3px 8px", borderRadius: "7px", border: "1px solid rgba(147,197,253,0.2)" }}>98%+</span>
                    <span style={{ fontSize: "9px", fontWeight: 700, color: "#6EE7B7", backgroundColor: "rgba(110,231,183,0.12)", padding: "3px 8px", borderRadius: "7px", border: "1px solid rgba(110,231,183,0.2)" }}>COA ✓</span>
                  </div>
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2.5 w-full">
                {[
                  { value: "81+",  label: "Peptides" },
                  { value: "98%+", label: "HPLC" },
                  { value: "COA",  label: "Certified" },
                ].map(s => (
                  <div key={s.label} className="glass-card text-center rounded-2xl" style={{ padding: "14px 8px" }}>
                    <p className="font-bold text-white" style={{ fontSize: "clamp(16px,3vw,24px)", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "10px", marginTop: "4px", fontWeight: 500 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* RUO */}
              <div className="glass-card rounded-2xl w-full flex items-center gap-3" style={{ padding: "12px 16px" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FlaskConical size={16} style={{ color: "#93C5FD" }} />
                </div>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>RUO Certified</p>
                  <p style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.5)" }}>Research Use Only · 18+ Required</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── BUNDLE & SAVE STRIP ────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(100deg, #030d1f 0%, #0a1e4a 35%, #1240A0 75%, #1B5CB5 100%)",
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
              { icon: <FlaskConical size={20} />, title: "98%+ HPLC Purity",    sub: "Guaranteed on every product",     color: "#1B5CB5", bg: "#EEF4FF" },
              { icon: <Award size={20} />,        title: "Full COA & MS Data",   sub: "Chromatogram + mass spectrum",    color: "#059669", bg: "#ECFDF5" },
              { icon: <Shield size={20} />,       title: "Research Grade",       sub: "For qualified researchers only",  color: "#7C3AED", bg: "#F5F3FF" },
              { icon: <Truck size={20} />,        title: "Free Shipping £200+",  sub: "Discreet packaging included",     color: "#0E7490", bg: "#ECFEFF" },
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

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", padding: "68px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div style={{ width: "3px", height: "16px", background: "linear-gradient(180deg, #1B5CB5, #2563EB)", borderRadius: "2px" }} />
                <p className="font-bold uppercase tracking-widest" style={{ fontSize: "11px", color: "#1B5CB5", letterSpacing: "0.1em" }}>
                  EXPLORE
                </p>
              </div>
              <h2 className="font-bold" style={{ fontSize: "30px", color: "#0F172A", letterSpacing: "-0.02em" }}>
                Shop by Category
              </h2>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Precision peptides organised by research application
              </p>
            </div>
            <Link
              href="/all-peptides"
              className="hidden sm:flex items-center gap-1.5 font-semibold"
              style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
            >
              View all 81 peptides <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.name}
                href={`/all-peptides?category=${encodeURIComponent(cat.name)}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  className="category-card rounded-2xl text-center cursor-pointer"
                  style={{
                    backgroundColor: "#fff",
                    border: "1.5px solid #E8EDF5",
                    padding: "20px 10px 16px",
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = cat.color + "55";
                    el.style.boxShadow = `0 8px 28px ${cat.color}18`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "#E8EDF5";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="mx-auto flex items-center justify-center rounded-xl mb-3"
                    style={{ width: "46px", height: "46px", backgroundColor: cat.bg, color: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <p className="font-semibold leading-tight" style={{ fontSize: "10.5px", color: "#1E293B" }}>
                    {cat.name}
                  </p>
                </div>
              </Link>
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

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
            {featuredGroups.map(group => (
              <GroupedProductCard key={group.baseName} group={group} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OMNIQURE ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", padding: "68px 0" }}>
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
                  <Link
                    href="/info"
                    className="btn-ghost inline-flex items-center gap-2"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.1)",
                      color: "#fff",
                      border: "1.5px solid rgba(255,255,255,0.25)",
                      padding: "11px 22px",
                      borderRadius: "10px",
                      fontWeight: 600,
                      fontSize: "13.5px",
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.16)"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.1)"}
                  >
                    Peptide Information
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
