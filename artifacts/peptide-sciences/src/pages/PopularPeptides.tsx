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
      {/* Category strip */}
      <div className="bg-white" style={{ borderBottom: "1px solid #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-4">
          <h2 className="font-bold mb-3" style={{ fontSize: "13px", color: "#94A3B8", letterSpacing: "0.07em", textTransform: "uppercase" }}>
            Shop by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => {
              const active = tab.key === "Popular Peptides";
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.key)}
                  className="px-3.5 py-1.5 text-sm font-medium transition-all rounded-full"
                  style={{
                    backgroundColor: active ? "#1B5CB5" : "#F1F5F9",
                    color: active ? "#fff" : "#475569",
                    border: "1px solid " + (active ? "#1B5CB5" : "#E2E8F0"),
                    fontSize: "12.5px",
                    cursor: active ? "default" : "pointer",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
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
