import { Link } from "wouter";
import {
  Shield, FlaskConical, Truck, Award, Microscope, Brain, Heart,
  Dumbbell, Scale, Clock, Zap, Leaf, Flame, Sparkles, Activity,
  TrendingUp, ChevronRight, ArrowRight, CheckCircle
} from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/ProductCard";

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
const featuredProducts = featuredIds
  .map(id => products.find(p => p.id === id))
  .filter(Boolean)
  .slice(0, 8) as typeof products;

const pillars = [
  {
    num: "01",
    icon: <FlaskConical size={24} />,
    title: "HPLC Verified Purity",
    body: "Every product tested via High-Performance Liquid Chromatography to confirm ≥99% purity before release.",
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
    title: "Cold Chain Delivery",
    body: "Lyophilized peptides shipped with professional cold-chain packaging to preserve integrity every step.",
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
              {/* Pill badge */}
              <div
                className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  fontSize: "11.5px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#93C5FD",
                }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34D399", display: "inline-block", boxShadow: "0 0 6px #34D399" }} />
                OMNIQURE PEPTIDE RESEARCH INSTITUTE
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
                81 HPLC-verified peptides — each backed by full COA, ESI-TOF mass spectrometry data, and professional cold-chain delivery. The standard for serious researchers.
              </p>

              {/* Trust chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {["≥99% HPLC Purity", "Full COA Included", "ESI-TOF MS", "Cold-Chain Delivery"].map(t => (
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
                <Link
                  href="/research"
                  className="btn-ghost inline-flex items-center gap-2"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    padding: "13px 26px",
                    borderRadius: "12px",
                    fontWeight: 600,
                    fontSize: "14px",
                    textDecoration: "none",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.16)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.1)"}
                >
                  Research Library
                </Link>
              </div>
            </div>

            {/* Right — stats + molecule decoration */}
            <div className="flex-shrink-0 flex flex-col items-center gap-5" style={{ zIndex: 1 }}>
              {/* Molecule art */}
              <div
                className="animate-float-slow"
                style={{ width: "200px", height: "200px", opacity: 0.85 }}
              >
                <MoleculeSVG />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 w-full">
                {[
                  { value: "81+",   label: "Peptides" },
                  { value: "≥99%",  label: "HPLC Purity" },
                  { value: "COA",   label: "Every Product" },
                ].map(s => (
                  <div
                    key={s.label}
                    className="glass-card text-center rounded-2xl"
                    style={{ padding: "18px 10px" }}
                  >
                    <p className="font-bold text-white" style={{ fontSize: "clamp(20px, 4vw, 30px)", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "11px", marginTop: "5px", fontWeight: 500 }}>{s.label}</p>
                  </div>
                ))}
              </div>

              {/* RUO badge */}
              <div
                className="glass-card rounded-2xl w-full flex items-center gap-3"
                style={{ padding: "14px 18px" }}
              >
                <div
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FlaskConical size={18} style={{ color: "#93C5FD" }} />
                </div>
                <div>
                  <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#fff" }}>RUO Certified</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>Research Use Only · 18+ Required</p>
                </div>
              </div>
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
              { icon: <Truck size={20} />,        title: "Free Shipping £200+",  sub: "Cold-chain packaging included",   color: "#0E7490", bg: "#ECFEFF" },
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
              <p
                className="font-bold uppercase tracking-widest mb-1.5"
                style={{ fontSize: "11px", color: "#1B5CB5", letterSpacing: "0.1em" }}
              >
                EXPLORE
              </p>
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
              <p className="font-bold uppercase tracking-widest mb-1.5" style={{ fontSize: "11px", color: "#1B5CB5", letterSpacing: "0.1em" }}>
                MOST RESEARCHED
              </p>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OMNIQURE ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", padding: "68px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <p className="font-bold uppercase tracking-widest mb-1.5" style={{ fontSize: "11px", color: "#1B5CB5", letterSpacing: "0.1em" }}>
              OUR COMMITMENT
            </p>
            <h2 className="font-bold" style={{ fontSize: "30px", color: "#0F172A", letterSpacing: "-0.02em" }}>
              Why Choose OmniQure?
            </h2>
            <p style={{ fontSize: "15px", color: "#64748B", maxWidth: "520px", margin: "8px auto 0", lineHeight: 1.7 }}>
              Every peptide we supply meets the highest standards in research-grade manufacturing, analytical verification, and cold-chain logistics.
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
                  padding: "28px 24px 24px",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                }}
              >
                {/* Number accent */}
                <span
                  style={{
                    position: "absolute",
                    top: "18px",
                    right: "20px",
                    fontSize: "36px",
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
                  style={{ width: "52px", height: "52px", backgroundColor: p.bg, color: p.color }}
                >
                  {p.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ fontSize: "15px", color: "#0F172A" }}>
                  {p.title}
                </h3>
                <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.65 }}>{p.body}</p>
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
