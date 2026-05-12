import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import GroupedProductCard from "@/components/GroupedProductCard";
import { products } from "@/data/products";
import { groupProducts } from "@/data/groupedProducts";

const categoryTabs = [
  { label: "Growth Peptides",     key: "Growth Peptides" },
  { label: "Healing Peptides",    key: "Healing Peptides" },
  { label: "Weight Management",   key: "Weight Management" },
  { label: "Longevity Peptides",  key: "Longevity Peptides" },
  { label: "Cellular Health",     key: "Cellular Health" },
  { label: "Nootropics",          key: "Nootropics" },
  { label: "Immune Support",      key: "Immune Support" },
  { label: "Research Peptides",   key: "Research Peptides" },
  { label: "Peptide Blends",      key: "Peptide Blends" },
  { label: "Skin & Repair",       key: "Skin & Repair" },
  { label: "Hormonal Peptides",   key: "Hormonal Peptides" },
  { label: "Growth Hormone",      key: "Growth Hormone" },
  { label: "Anti-Inflammatory",   key: "Anti-Inflammatory" },
  { label: "Cognitive Peptides",  key: "Cognitive Peptides" },
];

type SortOption = "name" | "price-low" | "price-high" | "bestsellers";

export default function AllPeptides() {
  const [location, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All Peptides");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    if (cat) {
      setSelectedCategory(decodeURIComponent(cat));
    } else {
      setSelectedCategory("All Peptides");
    }
  }, [location]);

  const groupedProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All Peptides") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    const groups = groupProducts(result);
    switch (sortBy) {
      case "price-low":
        groups.sort((a, b) => (a.variants[0]?.price ?? 0) - (b.variants[0]?.price ?? 0));
        break;
      case "price-high":
        groups.sort((a, b) => (b.variants[0]?.price ?? 0) - (a.variants[0]?.price ?? 0));
        break;
      case "name":
      default:
        groups.sort((a, b) => a.baseName.localeCompare(b.baseName, undefined, { numeric: true }));
        break;
    }
    return groups;
  }, [selectedCategory, sortBy]);

  const handleCategoryChange = (cat: string) => {
    if (cat === "Popular Peptides") {
      navigate("/popular-peptides");
      return;
    }
    setSelectedCategory(cat);
    const params = cat !== "All Peptides" ? `?category=${encodeURIComponent(cat)}` : "";
    window.history.pushState(null, "", window.location.pathname + params);
  };

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC" }}>

      {/* Premium page header */}
      <div style={{
        background: "linear-gradient(135deg, #020B1E 0%, #071A4A 35%, #0D2565 65%, #1240A0 100%)",
        padding: "36px 0 30px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Dot grid */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px", pointerEvents: "none",
        }} />
        {/* Glow */}
        <div style={{
          position: "absolute", top: "-60px", right: "10%",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="max-w-[1280px] mx-auto px-3 md:px-4" style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>
            OmniQure · Research Catalogue
          </p>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "9px" }}>
            {selectedCategory === "All Peptides" ? "All Research Peptides" : selectedCategory}
          </h1>
          <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.5)", maxWidth: "540px", lineHeight: 1.65, marginBottom: "16px" }}>
            {selectedCategory === "All Peptides"
              ? "81 HPLC-verified compounds — each backed by full COA and ESI-TOF mass spectrometry data."
              : `Precision peptides for ${selectedCategory.toLowerCase()} research, each HPLC-verified at 99%+ purity with full COA documentation.`}
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

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-3 md:px-4 py-4 md:py-6">

        {/* Mobile / tablet category strip (hidden on lg where sidebar shows) */}
        <div className="lg:hidden mb-4 overflow-x-auto scrollbar-none">
          <div className="mobile-cat-strip">
            <button
              onClick={() => handleCategoryChange("All Peptides")}
              style={{
                fontSize: "12px", fontWeight: 700, padding: "6px 14px", borderRadius: "20px",
                border: `1.5px solid ${selectedCategory === "All Peptides" ? "#1B5CB5" : "#E2E8F0"}`,
                backgroundColor: selectedCategory === "All Peptides" ? "#1B5CB5" : "#fff",
                color: selectedCategory === "All Peptides" ? "#fff" : "#475569",
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
              }}
            >
              All Peptides
            </button>
            {categoryTabs.map(cat => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key)}
                style={{
                  fontSize: "12px", fontWeight: 700, padding: "6px 14px", borderRadius: "20px",
                  border: `1.5px solid ${selectedCategory === cat.key ? "#1B5CB5" : "#E2E8F0"}`,
                  backgroundColor: selectedCategory === cat.key ? "#1B5CB5" : "#fff",
                  color: selectedCategory === cat.key ? "#fff" : "#475569",
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s",
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar — desktop only */}
          <div className="hidden lg:block flex-shrink-0">
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-t-xl mb-3"
              style={{ backgroundColor: "#1B5CB5", color: "#fff" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span className="font-semibold" style={{ fontSize: "13px" }}>Product List</span>
            </div>
            <Sidebar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <div className="mb-4">
              <h1 className="font-bold" style={{ fontSize: "20px", color: "#0F172A" }}>
                {selectedCategory === "All Peptides" ? "All Peptides" : selectedCategory}
              </h1>
              <p className="hidden sm:block" style={{ fontSize: "13px", color: "#64748B", marginTop: "3px" }}>
                Research peptides available direct from our online catalogue.
              </p>
            </div>

            {/* Count + Sort */}
            <div className="flex items-center justify-between mb-4">
              <span
                className="px-3 py-1 rounded-full font-medium"
                style={{ fontSize: "12px", color: "#475569", backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}
              >
                {groupedProducts.length} Products
              </span>
              <div className="flex items-center gap-1.5">
                <span className="hidden sm:inline" style={{ fontSize: "12px", color: "#94A3B8" }}>Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="outline-none"
                  style={{
                    fontSize: "12px",
                    color: "#374151",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <option value="name">Product Name</option>
                  <option value="price-low">Price (Low–High)</option>
                  <option value="price-high">Price (High–Low)</option>
                  <option value="bestsellers">Best Sellers</option>
                </select>
              </div>
            </div>

            {/* Responsive grid: 2 cols mobile, 3 tablet, 4 desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {groupedProducts.map((group) => (
                <GroupedProductCard key={group.baseName} group={group} />
              ))}
            </div>

            {groupedProducts.length === 0 && (
              <div className="text-center py-20" style={{ color: "#94A3B8" }}>
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
