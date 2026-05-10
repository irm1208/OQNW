import { Link } from "wouter";
import {
  Shield, FlaskConical, Truck, Award, Microscope, Brain, Heart,
  Dumbbell, Scale, Clock, Zap, Leaf, Flame, Sparkles, Activity,
  TrendingUp, ChevronRight, ArrowRight, CheckCircle
} from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

const categories = [
  { name: "Growth Peptides",     icon: <Dumbbell size={20} />,    neon: "#00D4FF", bg: "rgba(0,212,255,0.08)"  },
  { name: "Healing Peptides",    icon: <Heart size={20} />,       neon: "#FF4D6D", bg: "rgba(255,77,109,0.08)" },
  { name: "Weight Management",   icon: <Scale size={20} />,       neon: "#8B5CF6", bg: "rgba(139,92,246,0.08)" },
  { name: "Longevity Peptides",  icon: <Clock size={20} />,       neon: "#00CFAA", bg: "rgba(0,207,170,0.08)"  },
  { name: "Cellular Health",     icon: <Microscope size={20} />,  neon: "#00FF88", bg: "rgba(0,255,136,0.08)"  },
  { name: "Nootropics",          icon: <Brain size={20} />,       neon: "#C084FC", bg: "rgba(192,132,252,0.08)"},
  { name: "Immune Support",      icon: <Shield size={20} />,      neon: "#00D4FF", bg: "rgba(0,212,255,0.08)"  },
  { name: "Research Peptides",   icon: <FlaskConical size={20} />,neon: "#FCD34D", bg: "rgba(252,211,77,0.08)"  },
  { name: "Peptide Blends",      icon: <Zap size={20} />,         neon: "#FF4D6D", bg: "rgba(255,77,109,0.08)" },
  { name: "Skin & Repair",       icon: <Sparkles size={20} />,    neon: "#F472B6", bg: "rgba(244,114,182,0.08)"},
  { name: "Hormonal Peptides",   icon: <Activity size={20} />,    neon: "#00CFAA", bg: "rgba(0,207,170,0.08)"  },
  { name: "Growth Hormone",      icon: <TrendingUp size={20} />,  neon: "#00FF88", bg: "rgba(0,255,136,0.08)"  },
  { name: "Anti-Inflammatory",   icon: <Leaf size={20} />,        neon: "#8B5CF6", bg: "rgba(139,92,246,0.08)" },
  { name: "Cognitive Peptides",  icon: <Flame size={20} />,       neon: "#FCD34D", bg: "rgba(252,211,77,0.08)" },
];

const featuredIds = ["3", "7", "11", "43", "15", "31", "64", "71"];
const featuredProducts = featuredIds
  .map(id => products.find(p => p.id === id))
  .filter(Boolean)
  .slice(0, 8) as typeof products;

const pillars = [
  { num: "01", icon: <FlaskConical size={22} />, title: "HPLC Verified Purity",  body: "Every product tested via High-Performance Liquid Chromatography to confirm ≥99% purity before release.", neon: "#00D4FF" },
  { num: "02", icon: <Award size={22} />,        title: "Full COA & MS Data",    body: "Certificates of Analysis, HPLC chromatograms, and ESI-TOF mass spectra available for every product.",     neon: "#00FF88" },
  { num: "03", icon: <Shield size={22} />,       title: "Research Grade Only",   body: "All peptides manufactured under strict research-grade conditions for in-vitro research applications only.",  neon: "#8B5CF6" },
  { num: "04", icon: <Truck size={22} />,        title: "Cold Chain Delivery",   body: "Lyophilized peptides shipped with professional cold-chain packaging to preserve integrity every step.",      neon: "#00CFAA" },
];

/* ── Molecule SVG ─────────────────────────────────────── */
function MoleculeSVG() {
  return (
    <svg viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#00D4FF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <line x1="170" y1="170" x2="80"  y2="90"  stroke="rgba(0,212,255,0.25)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="260" y2="90"  stroke="rgba(0,212,255,0.25)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="80"  y2="260" stroke="rgba(0,212,255,0.25)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="260" y2="260" stroke="rgba(0,212,255,0.25)" strokeWidth="1.5" />
      <line x1="80"  y1="90"  x2="260" y2="90"  stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
      <line x1="80"  y1="260" x2="260" y2="260" stroke="rgba(0,212,255,0.12)" strokeWidth="1" />
      <line x1="170" y1="170" x2="170" y2="50"  stroke="rgba(139,92,246,0.2)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="170" y2="290" stroke="rgba(139,92,246,0.2)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="50"  y2="170" stroke="rgba(0,212,255,0.18)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="290" y2="170" stroke="rgba(0,212,255,0.18)" strokeWidth="1.5" />

      <circle cx="80"  cy="90"  r="14" fill="rgba(0,212,255,0.1)"  stroke="#00D4FF" strokeWidth="1.5" />
      <circle cx="260" cy="90"  r="10" fill="rgba(139,92,246,0.1)" stroke="#8B5CF6" strokeWidth="1.5" />
      <circle cx="80"  cy="260" r="10" fill="rgba(0,255,136,0.1)"  stroke="#00FF88" strokeWidth="1.5" />
      <circle cx="260" cy="260" r="14" fill="rgba(0,212,255,0.1)"  stroke="#00D4FF" strokeWidth="1.5" />
      <circle cx="170" cy="50"  r="7"  fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.5)"  strokeWidth="1.5" />
      <circle cx="170" cy="290" r="7"  fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.5)"  strokeWidth="1.5" />
      <circle cx="50"  cy="170" r="7"  fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.5)"  strokeWidth="1.5" />
      <circle cx="290" cy="170" r="7"  fill="rgba(0,212,255,0.12)" stroke="rgba(0,212,255,0.5)"  strokeWidth="1.5" />

      <circle cx="170" cy="170" r="30" fill="url(#nodeGrad)" />
      <circle cx="170" cy="170" r="18" fill="rgba(0,212,255,0.15)" stroke="#00D4FF" strokeWidth="2" />
      <circle cx="170" cy="170" r="7"  fill="#00D4FF" />
      <circle cx="170" cy="170" r="3"  fill="#fff" />
    </svg>
  );
}

/* ── Section header ───────────────────────────────────── */
function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <div>
      <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#00D4FF", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.12em", marginBottom: "6px" }}>
        // {eyebrow}
      </p>
      <h2 className="font-bold" style={{ fontSize: "28px", color: "#D4E8F5", letterSpacing: "-0.02em" }}>
        {title}
      </h2>
      {sub && <p style={{ fontSize: "14px", color: "#3A5470", marginTop: "5px" }}>{sub}</p>}
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#04080F" }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#04080F" }}>
        {/* Tech grid overlay */}
        <div className="tech-grid absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />

        {/* Animated glow orbs */}
        <div
          className="animate-pulse-glow absolute pointer-events-none"
          style={{ top: "-100px", right: "10%", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="animate-pulse-glow absolute pointer-events-none"
          style={{ bottom: "-80px", left: "5%", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)", animationDelay: "1.8s" }}
        />

        {/* Top neon accent line */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, #00D4FF 30%, #8B5CF6 70%, transparent)", opacity: 0.6 }} />

        <div className="max-w-[1280px] mx-auto px-4 py-20 lg:py-28">
          <div className="flex flex-col lg:flex-row items-center gap-14">

            {/* Left */}
            <div className="flex-1 text-white" style={{ zIndex: 1 }}>
              {/* Status pill */}
              <div
                className="inline-flex items-center gap-2 mb-7 px-4 py-2 rounded-full"
                style={{ background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.25)", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#00D4FF", fontFamily: "'Share Tech Mono', monospace" }}
              >
                <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: "#00FF88", boxShadow: "0 0 8px #00FF88", flexShrink: 0 }} />
                SYSTEM ONLINE · OMNIQURE RESEARCH INSTITUTE
              </div>

              <h1
                className="font-bold mb-6"
                style={{ fontSize: "clamp(38px,5.5vw,68px)", lineHeight: 1.06, letterSpacing: "-0.03em" }}
              >
                <span style={{ color: "#D4E8F5" }}>Research-Grade</span><br />
                <span style={{ color: "#D4E8F5" }}>Peptides. </span>
                <span className="gradient-text-neon">Verified.</span>
                <br />
                <span className="gradient-text-neon">Delivered.</span>
              </h1>

              <p className="mb-8 leading-relaxed" style={{ color: "#3A5470", fontSize: "16px", maxWidth: "500px", lineHeight: 1.8 }}>
                81 HPLC-verified peptides — each backed by full COA, ESI-TOF mass spectrometry data, and professional cold-chain delivery. The standard for serious researchers.
              </p>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-2 mb-9">
                {[
                  { label: "≥99% HPLC", neon: "#00D4FF" },
                  { label: "Full COA",   neon: "#00FF88" },
                  { label: "ESI-TOF MS", neon: "#8B5CF6" },
                  { label: "Cold-Chain", neon: "#00CFAA" },
                ].map(t => (
                  <span
                    key={t.label}
                    className="inline-flex items-center gap-1.5"
                    style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${t.neon}44`, color: t.neon, fontSize: "11.5px", fontWeight: 600, padding: "5px 12px", borderRadius: "20px", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.04em" }}
                  >
                    <CheckCircle size={11} />
                    {t.label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/all-peptides"
                  className="btn-neon inline-flex items-center gap-2 rounded-xl"
                  style={{ padding: "13px 28px", fontSize: "14px", fontWeight: 800, textDecoration: "none" }}
                >
                  Browse All 81 Peptides <ArrowRight size={15} />
                </Link>
                <Link
                  href="/research"
                  className="btn-outline-neon inline-flex items-center gap-2 rounded-xl"
                  style={{ padding: "13px 28px", fontSize: "14px", fontWeight: 600, textDecoration: "none" }}
                >
                  Research Library
                </Link>
              </div>
            </div>

            {/* Right — molecule + stat cards */}
            <div className="flex-shrink-0 flex flex-col items-center gap-5" style={{ zIndex: 1 }}>
              <div className="animate-float-slow" style={{ width: "220px", height: "220px" }}>
                <MoleculeSVG />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { value: "81+",  label: "Peptides",    neon: "#00D4FF" },
                  { value: "≥99%", label: "HPLC Purity", neon: "#00FF88" },
                  { value: "COA",  label: "Every Item",  neon: "#8B5CF6" },
                ].map(s => (
                  <div
                    key={s.label}
                    className="text-center rounded-2xl"
                    style={{ background: "rgba(8,15,30,0.8)", border: `1px solid ${s.neon}30`, padding: "18px 8px", backdropFilter: "blur(12px)" }}
                  >
                    <p className="font-bold" style={{ fontSize: "clamp(20px,3.5vw,30px)", lineHeight: 1, color: s.neon, textShadow: `0 0 14px ${s.neon}66` }}>{s.value}</p>
                    <p style={{ color: "#2A4058", fontSize: "10.5px", marginTop: "5px", fontWeight: 600, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.04em" }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* RUO badge */}
              <div
                className="w-full flex items-center gap-3 rounded-2xl"
                style={{ padding: "14px 18px", background: "rgba(8,15,30,0.8)", border: "1px solid rgba(0,212,255,0.15)", backdropFilter: "blur(12px)" }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "9px", background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <FlaskConical size={17} style={{ color: "#00D4FF" }} />
                </div>
                <div>
                  <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#D4E8F5", fontFamily: "'Share Tech Mono', monospace" }}>RUO CERTIFIED</p>
                  <p style={{ fontSize: "11px", color: "#2A4058", marginTop: "1px" }}>Research Use Only · 18+ Required</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(0,212,255,0.12)", borderBottom: "1px solid rgba(0,212,255,0.12)", backgroundColor: "#050C18" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4" style={{ divideColor: "rgba(0,212,255,0.1)" }}>
            {[
              { icon: <FlaskConical size={19} />, title: "99%+ HPLC Purity",   sub: "Guaranteed on every product",    neon: "#00D4FF" },
              { icon: <Award size={19} />,        title: "Full COA & MS Data",  sub: "Chromatogram + mass spectrum",   neon: "#00FF88" },
              { icon: <Shield size={19} />,       title: "Research Grade",      sub: "For qualified researchers only", neon: "#8B5CF6" },
              { icon: <Truck size={19} />,        title: "Free Shipping £200+", sub: "Cold-chain packaging included",  neon: "#00CFAA" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 py-5 px-5"
                style={{ borderRight: i < 3 ? "1px solid rgba(0,212,255,0.1)" : "none" }}
              >
                <div
                  style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${item.neon}12`, border: `1px solid ${item.neon}30`, color: item.neon, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: "13px", color: "#C8D8EE" }}>{item.title}</p>
                  <p style={{ fontSize: "11.5px", color: "#2A4058", marginTop: "1px" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#04080F", padding: "72px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader eyebrow="EXPLORE" title="Browse by Category" sub="Precision peptides organised by research application" />
            <Link href="/all-peptides" className="hidden sm:flex items-center gap-1.5 font-semibold" style={{ fontSize: "12.5px", color: "#00D4FF", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.04em" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
            >
              VIEW ALL 81 <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {categories.map(cat => (
              <Link key={cat.name} href={`/all-peptides?category=${encodeURIComponent(cat.name)}`} style={{ textDecoration: "none" }}>
                <div
                  className="category-card rounded-xl text-center cursor-pointer"
                  style={{ padding: "18px 8px 14px" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = `${cat.neon}55`;
                    el.style.boxShadow = `0 0 20px ${cat.neon}14`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.borderColor = "rgba(0,212,255,0.12)";
                    el.style.boxShadow = "none";
                  }}
                >
                  <div
                    className="mx-auto flex items-center justify-center rounded-xl mb-3"
                    style={{ width: "44px", height: "44px", background: cat.bg, color: cat.neon, border: `1px solid ${cat.neon}30` }}
                  >
                    {cat.icon}
                  </div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#5A7A90", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.02em", lineHeight: 1.3 }}>
                    {cat.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PEPTIDES ─────────────────────────────────── */}
      <section style={{ backgroundColor: "#050C18", padding: "72px 0", borderTop: "1px solid rgba(0,212,255,0.08)" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <SectionHeader eyebrow="MOST RESEARCHED" title="Featured Peptides" sub="Our most popular compounds — all HPLC verified at ≥99%" />
            <Link href="/popular-peptides" className="hidden sm:flex items-center gap-1.5 font-semibold" style={{ fontSize: "12.5px", color: "#00D4FF", textDecoration: "none", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.04em" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
            >
              VIEW COLLECTION <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OMNIQURE ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#04080F", padding: "72px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <SectionHeader eyebrow="OUR COMMITMENT" title="Why Choose OmniQure?" />
            <p style={{ fontSize: "15px", color: "#3A5470", maxWidth: "520px", margin: "8px auto 0", lineHeight: 1.75 }}>
              Every peptide we supply meets the highest standards in research-grade manufacturing, analytical verification, and cold-chain logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl relative overflow-hidden"
                style={{ background: "#080F1E", border: `1px solid ${p.neon}20`, padding: "28px 24px 24px" }}
              >
                <span style={{ position: "absolute", top: "14px", right: "18px", fontSize: "48px", fontWeight: 900, color: `${p.neon}08`, lineHeight: 1, letterSpacing: "-0.04em", userSelect: "none", fontFamily: "'Share Tech Mono', monospace" }}>
                  {p.num}
                </span>
                <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: `${p.neon}12`, border: `1px solid ${p.neon}35`, color: p.neon, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
                  {p.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ fontSize: "15px", color: "#C8D8EE" }}>{p.title}</h3>
                <p style={{ fontSize: "13px", color: "#3A5470", lineHeight: 1.7 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEARCH BANNER ───────────────────────────────────── */}
      <section style={{ backgroundColor: "#050C18", padding: "72px 0", borderTop: "1px solid rgba(0,212,255,0.08)" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{ background: "linear-gradient(135deg, #04080F 0%, #070D1C 40%, #0A122A 100%)", border: "1px solid rgba(0,212,255,0.18)", minHeight: "240px" }}
          >
            {/* Grid overlay */}
            <div className="tech-grid absolute inset-0 pointer-events-none" style={{ opacity: 0.4 }} />
            {/* Neon corner accent */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #00D4FF, #8B5CF6, #00D4FF)", opacity: 0.6 }} />
            {/* Glow */}
            <div style={{ position: "absolute", top: "-60px", right: "25%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div className="flex flex-col lg:flex-row items-center relative" style={{ zIndex: 1 }}>
              <div className="flex-1 p-10 lg:p-14">
                <p style={{ fontSize: "10.5px", fontWeight: 700, color: "#00D4FF", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.12em", marginBottom: "10px" }}>
                  // OMNIQURE PEPTIDE RESEARCH INSTITUTE
                </p>
                <h2 className="font-bold mb-4" style={{ fontSize: "clamp(22px,3vw,32px)", color: "#D4E8F5", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
                  Supporting the Scientific<br />Community
                </h2>
                <p style={{ color: "#3A5470", fontSize: "14.5px", lineHeight: 1.8, maxWidth: "440px", marginBottom: "24px" }}>
                  From cell culture experiments to advanced in-vitro models, OmniQure provides researchers with analytically verified peptides backed by full documentation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/all-peptides" className="btn-neon inline-flex items-center gap-2 rounded-xl" style={{ padding: "11px 22px", fontSize: "13.5px", textDecoration: "none" }}>
                    Shop All Peptides <ChevronRight size={14} />
                  </Link>
                  <Link href="/info" className="btn-outline-neon inline-flex items-center gap-2 rounded-xl" style={{ padding: "11px 22px", fontSize: "13.5px", textDecoration: "none" }}>
                    Peptide Information
                  </Link>
                </div>
              </div>

              <div className="lg:pr-12 pb-10 lg:pb-0 px-10 lg:px-0 flex flex-col gap-3">
                {[
                  { label: "HPLC TESTED",   detail: "All 81 products",    neon: "#00D4FF" },
                  { label: "ESI-TOF MS",    detail: "Identity confirmed", neon: "#8B5CF6" },
                  { label: "LYOPHILIZED",   detail: "Stable & pure",      neon: "#00FF88" },
                  { label: "RUO CERTIFIED", detail: "Research use only",  neon: "#00CFAA" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-xl"
                    style={{ padding: "13px 20px", minWidth: "220px", background: "rgba(0,212,255,0.04)", border: `1px solid ${item.neon}25` }}
                  >
                    <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: item.neon, boxShadow: `0 0 8px ${item.neon}`, flexShrink: 0 }} />
                    <div>
                      <p className="font-bold" style={{ fontSize: "12px", color: item.neon, fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.06em" }}>{item.label}</p>
                      <p style={{ color: "#3A5470", fontSize: "11.5px", marginTop: "1px" }}>{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ────────────────────────────────────────── */}
      <section style={{ borderTop: "1px solid rgba(0,212,255,0.08)", padding: "20px 0", backgroundColor: "#04080F" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-center" style={{ fontSize: "11.5px", color: "#1E3048", lineHeight: 1.7 }}>
            <strong style={{ color: "#2A4058" }}>Research Use Only.</strong>{" "}
            All products are intended strictly for in-vitro laboratory research. Not approved by the FDA. Not for human or animal use. Must be 18+ and a qualified researcher to purchase.
          </p>
        </div>
      </section>

    </div>
  );
}
