import { useState, useMemo, useEffect } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

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

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== "All Peptides") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return a.price - b.price;
        });
        break;
      case "price-high":
        result.sort((a, b) => {
          if (a.price === null) return 1;
          if (b.price === null) return -1;
          return b.price - a.price;
        });
        break;
      case "bestsellers":
        break;
      case "name":
      default:
        result.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
        break;
    }
    return result;
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
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#04080F", minHeight: "100vh" }}>
      <div className="max-w-[1280px] mx-auto px-3 md:px-4 py-6 md:py-8">
        <div className="flex gap-6">

          {/* Sidebar — desktop only */}
          <div className="hidden lg:block flex-shrink-0">
            {/* Sidebar header */}
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-t-xl mb-3"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(0,212,255,0.05) 100%)",
                border: "1px solid rgba(0,212,255,0.25)",
                borderBottom: "1px solid rgba(0,212,255,0.15)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00D4FF" strokeWidth="2.5">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#00D4FF",
                  letterSpacing: "0.1em",
                  fontFamily: "'Share Tech Mono', monospace",
                }}
              >
                PRODUCT LIST
              </span>
            </div>
            <Sidebar selectedCategory={selectedCategory} onCategoryChange={handleCategoryChange} />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Page title */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-1">
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "#00D4FF",
                    fontFamily: "'Share Tech Mono', monospace",
                    letterSpacing: "0.12em",
                    opacity: 0.7,
                  }}
                >
                  // CATALOGUE
                </span>
              </div>
              <h1 className="font-bold" style={{ fontSize: "22px", color: "#D4E8F5", letterSpacing: "-0.01em" }}>
                {selectedCategory === "All Peptides" ? "All Peptides" : selectedCategory}
              </h1>
              <p className="hidden sm:block" style={{ fontSize: "13px", color: "#3A5470", marginTop: "3px" }}>
                Research peptides available direct from our online catalogue.
              </p>
            </div>

            {/* Count + Sort */}
            <div className="flex items-center justify-between mb-5">
              <span
                className="px-3 py-1 rounded-full font-medium"
                style={{
                  fontSize: "11.5px",
                  color: "#00D4FF",
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: "0.04em",
                }}
              >
                {filteredProducts.length} PRODUCTS
              </span>
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline" style={{ fontSize: "11px", color: "#2A4058", fontFamily: "'Share Tech Mono', monospace", letterSpacing: "0.06em" }}>
                  SORT:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="outline-none"
                  style={{
                    fontSize: "12px",
                    color: "#C8D8EE",
                    border: "1px solid rgba(0,212,255,0.2)",
                    borderRadius: "8px",
                    padding: "5px 10px",
                    backgroundColor: "#080F1E",
                    cursor: "pointer",
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  <option value="name">Product Name</option>
                  <option value="price-low">Price (Low–High)</option>
                  <option value="price-high">Price (High–Low)</option>
                  <option value="bestsellers">Best Sellers</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20" style={{ color: "#2A4058", fontFamily: "'Share Tech Mono', monospace" }}>
                // NO PRODUCTS FOUND IN THIS CATEGORY
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
