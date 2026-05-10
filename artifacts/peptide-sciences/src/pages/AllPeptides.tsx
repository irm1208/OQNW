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
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC" }}>
      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-3 md:px-4 py-4 md:py-6">
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
                {filteredProducts.length} Products
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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
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
