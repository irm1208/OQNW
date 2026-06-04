import { useState, useMemo } from "react";
import { useLocation, Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import GroupedProductCard from "@/components/GroupedProductCard";
import { type Product } from "@/data/products";
import { popularProductIds } from "@/data/popularPeptides";
import { useProducts } from "@/context/ProductsContext";
import { groupProducts, type GroupedProduct } from "@/data/groupedProducts";
import {
  Heart, Zap, Scale, Brain, Microscope, Shield, Clock, Sparkles,
  FlaskConical, Dna, ChevronRight,
} from "lucide-react";

const CATEGORY_META: Record<string, { icon: React.ReactNode; description: string; accent: string }> = {
  "Healing Peptides": {
    icon: <Heart size={15} />,
    description: "The most widely researched peptides for tissue repair, wound healing, and musculoskeletal recovery.",
    accent: "#059669",
  },
  "Growth Peptides": {
    icon: <Zap size={15} />,
    description: "Growth hormone secretagogues and IGF-1 modulators at the forefront of GH-axis research.",
    accent: "#1B5CB5",
  },
  "Weight Management": {
    icon: <Scale size={15} />,
    description: "Next-generation GLP-1/GIP receptor agonists and lipolytic peptides leading metabolic research.",
    accent: "#DC2626",
  },
  "Nootropics": {
    icon: <Brain size={15} />,
    description: "CNS-active peptides studied for BDNF upregulation, neuroprotection, and cognitive modulation.",
    accent: "#7C3AED",
  },
  "Cellular Health": {
    icon: <Microscope size={15} />,
    description: "Mitochondria-derived peptides and NAD+ compounds at the cutting edge of cellular longevity research.",
    accent: "#0891B2",
  },
  "Immune Support": {
    icon: <Shield size={15} />,
    description: "Clinically studied immunomodulatory peptides covering both innate and adaptive immune pathways.",
    accent: "#B45309",
  },
  "Longevity Peptides": {
    icon: <Clock size={15} />,
    description: "Telomerase-activating and anti-senescence peptides at the frontier of ageing biology research.",
    accent: "#C2410C",
  },
  "Skin & Repair": {
    icon: <Sparkles size={15} />,
    description: "Copper tripeptides and dermal repair compounds studied for collagen synthesis and wound healing.",
    accent: "#BE185D",
  },
  "Peptide Blends": {
    icon: <FlaskConical size={15} />,
    description: "Pre-combined research formulations pairing synergistic compounds in a single vial.",
    accent: "#0D9488",
  },
  "Research Peptides": {
    icon: <Dna size={15} />,
    description: "Specialised compounds under active research investigation across multiple biological pathways.",
    accent: "#475569",
  },
};

const CATEGORY_ORDER = [
  "Healing Peptides",
  "Growth Peptides",
  "Weight Management",
  "Nootropics",
  "Cellular Health",
  "Immune Support",
  "Longevity Peptides",
  "Skin & Repair",
  "Peptide Blends",
  "Research Peptides",
];

export default function PopularPeptides() {
  useSEO({
    title: "Popular Peptides",
    description: "Shop the most popular research peptides at OmniQure — BPC-157, TB-500, Semaglutide, Tirzepatide and more. HPLC-verified to 99%+ purity. For research use only.",
    canonicalPath: "/popular-peptides",
  });
  const { products } = useProducts();
  const [, navigate] = useLocation();
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const popularProducts = useMemo<Product[]>(() => {
    const map = new Map(products.map((p) => [p.id, p]));
    return popularProductIds
      .map((e) => map.get(e.id))
      .filter((p): p is Product => p != null);
  }, [products]);

  const categorisedGroups = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    for (const p of popularProducts) {
      if (!grouped[p.category]) grouped[p.category] = [];
      grouped[p.category].push(p);
    }
    return CATEGORY_ORDER
      .filter((cat) => grouped[cat]?.length)
      .map((cat) => ({ category: cat, items: groupProducts(grouped[cat]) }));
  }, [popularProducts]);

  const availableCategories = useMemo(
    () => categorisedGroups.map((g) => g.category),
    [categorisedGroups]
  );

  const filtered = useMemo(() => {
    if (activeCategory === "All") return categorisedGroups;
    return categorisedGroups.filter((g) => g.category === activeCategory);
  }, [categorisedGroups, activeCategory]);

  const totalShown = filtered.reduce((n, g) => n + g.items.length, 0);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        padding: "36px 0 30px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px", pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "-60px", right: "10%",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="max-w-[1280px] mx-auto px-4" style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>
            OmniQure · Most Researched
          </p>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "9px" }}>
            Popular Peptides
          </h1>
          <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.5)", maxWidth: "540px", lineHeight: 1.65, marginBottom: "16px" }}>
            Our most researched compounds across {availableCategories.length} categories — hand-picked by the OmniQure team. Each 99%+ HPLC verified with full COA documentation.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["99%+ HPLC Purity", "Full COA", "ESI-TOF MS", "Lyophilized"].map(t => (
              <span key={t} style={{
                fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)",
                backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                padding: "4px 12px", borderRadius: "20px",
              }}>
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bundle & Save banner */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30px", right: "18%", width: "180px", height: "80px", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
        <div className="max-w-[1280px] mx-auto px-4 py-3" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <div style={{ backgroundColor: "#34D399", borderRadius: "5px", padding: "2px 8px" }}>
                <span style={{ fontSize: "9.5px", fontWeight: 900, letterSpacing: "0.1em", color: "#022c22", textTransform: "uppercase" }}>Bundle & Save</span>
              </div>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Buy more, save more — starts at just 3 vials</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
              {[
                { label: "3+ vials",  pct: "5%",  bg: "rgba(96,165,250,0.15)",  border: "rgba(96,165,250,0.4)",  pctColor: "#93C5FD" },
                { label: "7+ vials",  pct: "10%", bg: "rgba(52,211,153,0.15)",  border: "rgba(52,211,153,0.4)",  pctColor: "#6EE7B7" },
                { label: "11+ vials", pct: "15%", bg: "rgba(251,191,36,0.15)",  border: "rgba(251,191,36,0.4)",  pctColor: "#FDE68A" },
                { label: "15+ vials", pct: "20%", bg: "rgba(248,113,113,0.18)", border: "rgba(248,113,113,0.45)", pctColor: "#FCA5A5" },
              ].map(t => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "5px", backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: "7px", padding: "4px 10px" }}>
                  <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{t.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 900, color: t.pctColor, lineHeight: 1 }}>{t.pct}</span>
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)", fontWeight: 700 }}>OFF</span>
                </div>
              ))}
              <Link href="/bundles" style={{ fontSize: "11.5px", fontWeight: 800, color: "#022c22", backgroundColor: "#34D399", padding: "5px 15px", borderRadius: "7px", textDecoration: "none", whiteSpace: "nowrap", boxShadow: "0 0 12px rgba(52,211,153,0.3)" }}>
                Build Bundle →
              </Link>
            </div>
          </div>
        </div>
      </div>


      <div className="max-w-[1280px] mx-auto px-4 py-8">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setActiveCategory("All")}
            className="text-sm font-semibold px-4 py-1.5 rounded-full transition-all"
            style={{
              backgroundColor: activeCategory === "All" ? "#1240A0" : "#fff",
              color: activeCategory === "All" ? "#fff" : "#475569",
              border: activeCategory === "All" ? "1.5px solid #1240A0" : "1.5px solid #E2E8F0",
              cursor: "pointer",
            }}
          >
            All Categories
            <span className="ml-1.5 text-xs opacity-70">({popularProducts.length})</span>
          </button>
          {availableCategories.map((cat) => {
            const active = activeCategory === cat;
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(active ? "All" : cat)}
                className="flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full transition-all"
                style={{
                  backgroundColor: active ? (meta?.accent ?? "#1B5CB5") : "#fff",
                  color: active ? "#fff" : "#475569",
                  border: active ? `1.5px solid ${meta?.accent ?? "#1B5CB5"}` : "1.5px solid #E2E8F0",
                  cursor: "pointer",
                }}
              >
                <span style={{ display: "flex", opacity: active ? 1 : 0.6 }}>{meta?.icon}</span>
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p style={{ fontSize: "13px", color: "#94A3B8" }}>
            Showing <strong style={{ color: "#475569" }}>{totalShown}</strong> compound{totalShown !== 1 ? "s" : ""}
            {activeCategory !== "All" ? ` in ${activeCategory}` : " across all categories"}
          </p>
          {activeCategory !== "All" && (
            <button
              onClick={() => setActiveCategory("All")}
              className="flex items-center gap-1 text-xs font-semibold hover:underline"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#1B5CB5" }}
            >
              View all categories <ChevronRight size={12} />
            </button>
          )}
        </div>

        {/* Category sections */}
        <div className="space-y-12">
          {filtered.map((group) => {
            const meta = CATEGORY_META[group.category];
            return (
              <section key={group.category}>
                {/* Section header */}
                <div
                  className="flex items-center justify-between mb-5 pb-3"
                  style={{ borderBottom: `2px solid ${meta?.accent ?? "#1B5CB5"}22` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: `${meta?.accent ?? "#1B5CB5"}15`,
                        color: meta?.accent ?? "#1B5CB5",
                        flexShrink: 0,
                      }}
                    >
                      {meta?.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h2 className="font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
                          {group.category}
                        </h2>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{
                            backgroundColor: `${meta?.accent ?? "#1B5CB5"}15`,
                            color: meta?.accent ?? "#1B5CB5",
                            border: `1px solid ${meta?.accent ?? "#1B5CB5"}30`,
                          }}
                        >
                          {group.items.length} compound{group.items.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      {meta?.description && (
                        <p className="text-xs mt-0.5" style={{ color: "#94A3B8", maxWidth: "520px" }}>
                          {meta.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/all-peptides?category=${encodeURIComponent(group.category)}`)}
                    className="hidden sm:flex items-center gap-1 text-xs font-semibold hover:underline flex-shrink-0"
                    style={{ background: "none", border: "none", cursor: "pointer", color: meta?.accent ?? "#1B5CB5" }}
                  >
                    Browse all {group.category} <ChevronRight size={12} />
                  </button>
                </div>

                {/* Product grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-6 sm:gap-y-14 md:gap-x-7 md:gap-y-16">
                  {group.items.map((g: GroupedProduct) => (
                    <GroupedProductCard key={g.baseName} group={g} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
