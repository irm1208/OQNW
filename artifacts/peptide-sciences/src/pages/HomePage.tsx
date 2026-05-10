import { Link } from "wouter";
import { Shield, FlaskConical, Truck, Award, Microscope, Brain, Heart, Dumbbell, Scale, Clock, Zap, Leaf, Flame, Sparkles, Activity, TrendingUp, ChevronRight, Star } from "lucide-react";
import { products } from "@/data/products";
import { popularProductIds } from "@/data/popularPeptides";
import ProductCard from "@/components/ProductCard";

const categories = [
  { name: "Growth Peptides", icon: <Dumbbell size={22} />, color: "#1B5CB5" },
  { name: "Healing Peptides", icon: <Heart size={22} />, color: "#DC2626" },
  { name: "Weight Management", icon: <Scale size={22} />, color: "#7C3AED" },
  { name: "Longevity Peptides", icon: <Clock size={22} />, color: "#0E7490" },
  { name: "Cellular Health", icon: <Microscope size={22} />, color: "#065F46" },
  { name: "Nootropics", icon: <Brain size={22} />, color: "#9333EA" },
  { name: "Immune Support", icon: <Shield size={22} />, color: "#1B5CB5" },
  { name: "Research Peptides", icon: <FlaskConical size={22} />, color: "#B45309" },
  { name: "Peptide Blends", icon: <Zap size={22} />, color: "#DC2626" },
  { name: "Skin & Repair", icon: <Sparkles size={22} />, color: "#BE185D" },
  { name: "Hormonal Peptides", icon: <Activity size={22} />, color: "#0E7490" },
  { name: "Growth Hormone", icon: <TrendingUp size={22} />, color: "#065F46" },
  { name: "Anti-Inflammatory", icon: <Leaf size={22} />, color: "#7C3AED" },
  { name: "Cognitive Peptides", icon: <Flame size={22} />, color: "#B45309" },
];

const featuredIds = ["3", "7", "11", "43", "15", "31", "64", "71"];
const featuredProducts = featuredIds
  .map(id => products.find(p => p.id === id))
  .filter(Boolean)
  .slice(0, 8) as typeof products;

const stats = [
  { value: "81+", label: "Research Peptides" },
  { value: "99%+", label: "HPLC Purity" },
  { value: "COA", label: "Every Batch Tested" },
];

const pillars = [
  {
    icon: <FlaskConical size={28} />,
    title: "HPLC Verified Purity",
    body: "Every product is tested via High-Performance Liquid Chromatography to confirm ≥99% purity before release.",
  },
  {
    icon: <Award size={28} />,
    title: "COA on Every Batch",
    body: "Certificates of Analysis, HPLC chromatograms, and ESI-TOF mass spectra are available for every product.",
  },
  {
    icon: <Shield size={28} />,
    title: "Research Grade Only",
    body: "All peptides are manufactured under strict research-grade conditions and are intended solely for in-vitro research.",
  },
  {
    icon: <Truck size={28} />,
    title: "Cold Chain Shipping",
    body: "Lyophilized peptides shipped with cold-chain packaging to preserve integrity from our lab to yours.",
  },
];

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section
        style={{
          background: "linear-gradient(135deg, #0B2D6E 0%, #1240A0 40%, #1B5CB5 70%, #2D78D8 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative circles */}
        <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "420px", height: "420px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "300px", height: "300px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div className="max-w-[1280px] mx-auto px-4 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-12">

            {/* Left copy */}
            <div className="flex-1 text-white">
              <div
                className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", fontSize: "12px", fontWeight: 600, letterSpacing: "0.06em" }}
              >
                <Star size={11} fill="currentColor" /> PREMIUM RESEARCH PEPTIDES
              </div>

              <h1
                className="font-bold leading-tight mb-5"
                style={{ fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.12 }}
              >
                Advanced Peptides for<br />
                <span style={{ color: "#93C5FD" }}>Scientific Research</span>
              </h1>

              <p className="mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px", maxWidth: "480px" }}>
                OmniQure Peptide Research Institute provides 81 research-grade peptides — each HPLC verified at ≥99% purity, with full COA, mass spectrometry data, and cold-chain delivery.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/all-peptides"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    backgroundColor: "#fff", color: "#1240A0",
                    padding: "12px 24px", borderRadius: "12px",
                    fontWeight: 700, fontSize: "14px", textDecoration: "none",
                  }}
                >
                  Browse All Peptides <ChevronRight size={15} />
                </Link>
                <Link
                  href="/research"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    backgroundColor: "rgba(255,255,255,0.12)", color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    padding: "12px 24px", borderRadius: "12px",
                    fontWeight: 600, fontSize: "14px", textDecoration: "none",
                  }}
                >
                  Research & Literature
                </Link>
              </div>
            </div>

            {/* Stats — 3-col row */}
            <div className="grid grid-cols-3 gap-3 flex-shrink-0 w-full lg:w-auto">
              {stats.map(s => (
                <div
                  key={s.label}
                  className="text-center rounded-2xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    padding: "20px 16px",
                    minWidth: "100px",
                  }}
                >
                  <p className="font-bold text-white" style={{ fontSize: "clamp(24px,5vw,36px)", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "11px", marginTop: "6px", fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", borderBottom: "1px solid #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <FlaskConical size={18} style={{ color: "#1B5CB5" }} />, title: "99%+ HPLC Purity", sub: "Guaranteed on every product" },
              { icon: <Award size={18} style={{ color: "#1B5CB5" }} />, title: "Full COA & MS Data", sub: "Chromatogram + mass spectrum" },
              { icon: <Shield size={18} style={{ color: "#1B5CB5" }} />, title: "Research Grade", sub: "For qualified researchers only" },
              { icon: <Truck size={18} style={{ color: "#1B5CB5" }} />, title: "Free Shipping $200+", sub: "Cold-chain packaging included" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-4 px-5"
                style={{ borderRight: i < 3 ? "1px solid #E8EDF5" : "none" }}
              >
                <div
                  className="flex-shrink-0 rounded-xl flex items-center justify-center"
                  style={{ width: "40px", height: "40px", backgroundColor: "#EEF4FF" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: "13px", color: "#0F172A" }}>{item.title}</p>
                  <p style={{ fontSize: "11px", color: "#64748B" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5F8FC", padding: "56px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-bold uppercase tracking-widest mb-1" style={{ fontSize: "11px", color: "#1B5CB5" }}>EXPLORE</p>
              <h2 className="font-bold" style={{ fontSize: "26px", color: "#0F172A" }}>Shop by Category</h2>
            </div>
            <Link
              href="/all-peptides"
              className="hidden sm:flex items-center gap-1 font-semibold transition-opacity hover:opacity-70"
              style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none" }}
            >
              View all 81 peptides <ChevronRight size={14} />
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
                  className="rounded-2xl text-center transition-all duration-150 cursor-pointer"
                  style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", padding: "20px 10px 16px" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = "0 8px 24px rgba(27,92,181,0.12)";
                    el.style.transform = "translateY(-2px)";
                    el.style.borderColor = "#BFDBFE";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = "none";
                    el.style.transform = "translateY(0)";
                    el.style.borderColor = "#E8EDF5";
                  }}
                >
                  <div
                    className="mx-auto flex items-center justify-center rounded-xl mb-3"
                    style={{ width: "48px", height: "48px", backgroundColor: "#EEF4FF", color: cat.color }}
                  >
                    {cat.icon}
                  </div>
                  <p className="font-semibold leading-tight" style={{ fontSize: "11px", color: "#0F172A" }}>{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PEPTIDES ────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", padding: "56px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="font-bold uppercase tracking-widest mb-1" style={{ fontSize: "11px", color: "#1B5CB5" }}>MOST RESEARCHED</p>
              <h2 className="font-bold" style={{ fontSize: "26px", color: "#0F172A" }}>Featured Peptides</h2>
            </div>
            <Link
              href="/popular-peptides"
              className="hidden sm:flex items-center gap-1 font-semibold transition-opacity hover:opacity-70"
              style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none" }}
            >
              View popular collection <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OMNIQURE ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5F8FC", padding: "56px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-10">
            <p className="font-bold uppercase tracking-widest mb-1" style={{ fontSize: "11px", color: "#1B5CB5" }}>OUR COMMITMENT</p>
            <h2 className="font-bold" style={{ fontSize: "26px", color: "#0F172A" }}>Why Choose OmniQure?</h2>
            <p className="mt-2" style={{ fontSize: "14px", color: "#64748B", maxWidth: "520px", margin: "8px auto 0" }}>
              Every peptide we supply meets the highest standards in research-grade manufacturing, analytical verification, and cold-chain logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl"
                style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", padding: "28px 24px" }}
              >
                <div
                  className="flex items-center justify-center rounded-xl mb-4"
                  style={{ width: "56px", height: "56px", backgroundColor: "#EEF4FF", color: "#1B5CB5" }}
                >
                  {p.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ fontSize: "15px", color: "#0F172A" }}>{p.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEARCH BANNER ──────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", padding: "56px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div
            className="rounded-3xl overflow-hidden flex flex-col lg:flex-row items-center"
            style={{ background: "linear-gradient(135deg, #0B2D6E 0%, #1240A0 50%, #1B5CB5 100%)", minHeight: "240px" }}
          >
            <div className="flex-1 p-10 lg:p-14 text-white">
              <p className="font-bold uppercase tracking-widest mb-2" style={{ fontSize: "11px", color: "#93C5FD" }}>OMNIQURE PEPTIDE RESEARCH INSTITUTE</p>
              <h2 className="font-bold mb-3" style={{ fontSize: "28px", lineHeight: 1.2 }}>
                Supporting the Scientific Community
              </h2>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.7, maxWidth: "460px" }}>
                From cell culture experiments to advanced in-vitro models, OmniQure provides researchers with analytically verified peptides backed by full documentation. Every product includes HPLC, ESI-MS, and COA data.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href="/all-peptides"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    backgroundColor: "#fff", color: "#1240A0",
                    padding: "11px 22px", borderRadius: "10px",
                    fontWeight: 700, fontSize: "13px", textDecoration: "none",
                  }}
                >
                  Shop All Peptides <ChevronRight size={14} />
                </Link>
                <Link
                  href="/info"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "6px",
                    backgroundColor: "rgba(255,255,255,0.12)", color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.3)",
                    padding: "11px 22px", borderRadius: "10px",
                    fontWeight: 600, fontSize: "13px", textDecoration: "none",
                  }}
                >
                  Peptide Information
                </Link>
              </div>
            </div>

            {/* Right side data blocks */}
            <div className="lg:pr-12 pb-10 lg:pb-0 px-10 lg:px-0 flex gap-4 flex-wrap justify-center">
              {[
                { label: "HPLC Tested", detail: "All 81 products" },
                { label: "ESI-TOF MS", detail: "Identity confirmed" },
                { label: "Lyophilized", detail: "Stable & pure" },
                { label: "RUO Certified", detail: "Research use only" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center rounded-xl"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    padding: "16px 20px",
                    minWidth: "110px",
                  }}
                >
                  <p className="font-bold text-white" style={{ fontSize: "14px" }}>{item.label}</p>
                  <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "11px", marginTop: "3px" }}>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5F8FC", borderTop: "1px solid #E8EDF5", padding: "20px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-center" style={{ fontSize: "11px", color: "#94A3B8", lineHeight: 1.6 }}>
            <strong style={{ color: "#64748B" }}>Research Use Only.</strong> All products are intended strictly for in-vitro laboratory research. Not approved by the FDA. Not for human or animal use. Must be 18+ and a qualified researcher to purchase.
          </p>
        </div>
      </section>

    </div>
  );
}
