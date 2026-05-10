import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import { products, Product } from "@/data/products";
import { popularProductIds } from "@/data/popularPeptides";

const categoryTabs = [
  { label: "Popular Peptides", key: "Popular Peptides" },
  { label: "Peptide Blends",   key: "Peptide Blends" },
  { label: "IGF-1 Proteins",   key: "IGF-1 Proteins" },
  { label: "Melanotan Peptides", key: "Melanotan Peptides" },
  { label: "Bioregulators",    key: "Bioregulators" },
];

type SortOption = "position" | "name" | "price-low" | "price-high";

export default function PopularPeptides() {
  const [, navigate] = useLocation();
  const [sortBy, setSortBy] = useState<SortOption>("position");

  const productMap = useMemo(() => new Map(products.map((p) => [p.id, p])), []);

  const positionList = useMemo<Product[]>(() => {
    return popularProductIds
      .map((entry) => productMap.get(entry.id))
      .filter((p): p is Product => p !== null && p !== undefined);
  }, [productMap]);

  const displayProducts = useMemo(() => {
    const list = [...positionList];
    switch (sortBy) {
      case "name":
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case "price-low":
        return list.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return a.price - b.price;
        });
      case "price-high":
        return list.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return b.price - a.price;
        });
      default:
        return list;
    }
  }, [positionList, sortBy]);

  const handleCategoryChange = (cat: string) => navigate(`/?category=${encodeURIComponent(cat)}`);
  const handleTabClick = (key: string) => {
    if (key === "Popular Peptides") return;
    navigate(`/?category=${encodeURIComponent(key)}`);
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
            Our most researched compounds — hand-picked by the OmniQure team. Each 98%+ HPLC verified with full COA documentation.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["98%+ HPLC Purity", "Full COA", "ESI-TOF MS", "Cold Chain"].map(t => (
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
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex gap-7">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-t-xl mb-3"
              style={{ backgroundColor: "#1B5CB5", color: "#fff" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span className="font-semibold" style={{ fontSize: "13px" }}>Product List</span>
            </div>
            <Sidebar selectedCategory="Popular Peptides" onCategoryChange={handleCategoryChange} />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <h1 className="font-bold" style={{ fontSize: "22px", color: "#0F172A" }}>
                Popular Peptides
              </h1>
              <p style={{ fontSize: "13.5px", color: "#64748B", marginTop: "4px" }}>
                Research peptides available direct from our online catalogue.
              </p>
            </div>

            <div className="flex items-center justify-between mb-5">
              <span
                className="px-3 py-1 rounded-full font-medium"
                style={{ fontSize: "12.5px", color: "#475569", backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}
              >
                {displayProducts.length} Products
              </span>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: "12.5px", color: "#94A3B8" }}>Sort by</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="outline-none text-sm"
                  style={{
                    fontSize: "12.5px",
                    color: "#374151",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  <option value="position">Position</option>
                  <option value="name">Product Name</option>
                  <option value="price-low">Price (Low–High)</option>
                  <option value="price-high">Price (High–Low)</option>
                </select>
              </div>
            </div>

            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}
            >
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
