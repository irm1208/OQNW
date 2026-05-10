import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import { products, Product } from "@/data/products";
import { popularProductIds } from "@/data/popularPeptides";

const categoryTabs = [
  { label: "Popular Peptides", key: "Popular Peptides" },
  { label: "Peptide Blends", key: "Peptide Blends" },
  { label: "IGF-1 Proteins", key: "IGF-1 Proteins" },
  { label: "Melanotan Peptides", key: "Melanotan Peptides" },
  { label: "Bioregulators", key: "Bioregulators" },
  { label: "Cosmetic Peptides", key: "Cosmetic Peptides" },
];

type SortOption = "position" | "name" | "price-low" | "price-high";

export default function PopularPeptides() {
  const [, navigate] = useLocation();
  const [sortBy, setSortBy] = useState<SortOption>("position");

  const productMap = useMemo(() => {
    return new Map(products.map((p) => [p.id, p]));
  }, []);

  const positionList = useMemo<Product[]>(() => {
    return popularProductIds.map((entry) => {
      const base = productMap.get(entry.id);
      if (!base) return null;
      return {
        ...base,
        badge: entry.badge ? entry.badge : base.badge,
      };
    }).filter((p): p is Product => p !== null);
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
      case "position":
      default:
        return list;
    }
  }, [positionList, sortBy]);

  const handleCategoryChange = (cat: string) => {
    navigate(`/?category=${encodeURIComponent(cat)}`);
  };

  const handleTabClick = (key: string) => {
    if (key === "Popular Peptides") return;
    navigate(`/?category=${encodeURIComponent(key)}`);
  };

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#fff" }}>
      {/* Shop by Category */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 py-4">
          <h2 className="font-bold mb-3" style={{ fontSize: "16px" }}>
            Shop by Category
          </h2>
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className="px-4 py-1.5 border text-sm transition-colors"
                style={{
                  borderColor: tab.key === "Popular Peptides" ? "#E7461E" : "#ccc",
                  color: tab.key === "Popular Peptides" ? "#E7461E" : "#333",
                  backgroundColor: tab.key === "Popular Peptides" ? "#fff8f6" : "#fff",
                  fontSize: "13px",
                  borderRadius: "4px",
                  cursor: tab.key === "Popular Peptides" ? "default" : "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden lg:block">
            <div className="mb-4">
              <div
                className="flex items-center justify-between px-3 py-2"
                style={{ backgroundColor: "#E7461E", color: "#fff", fontSize: "13px" }}
              >
                <span className="font-semibold">Product List</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
            <Sidebar
              selectedCategory="Popular Peptides"
              onCategoryChange={handleCategoryChange}
            />
          </div>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <h1 className="font-bold mb-1" style={{ fontSize: "24px" }}>
              Popular Peptides
            </h1>
            <p className="text-gray-600 mb-4" style={{ fontSize: "14px" }}>
              Purchase US Made Peptides Online Direct From Our Online Catalogue.
            </p>

            {/* Count + Sort */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-gray-600" style={{ fontSize: "13px" }}>
                {displayProducts.length} Items
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600" style={{ fontSize: "13px" }}>
                  Sort By
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-sm px-2 py-1 text-sm bg-white"
                  style={{ fontSize: "13px" }}
                >
                  <option value="position">Position</option>
                  <option value="name">Product Name</option>
                  <option value="price-low">Price (Low-High)</option>
                  <option value="price-high">Price (High-Low)</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}
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
