import { useState, useMemo } from "react";
import Sidebar from "@/components/Sidebar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/data/products";

const categoryTabs = [
  { label: "Popular Peptides", key: "Popular Peptides", href: "https://www.peptidesciences.com/best-sellers" },
  { label: "Peptide Capsules", key: "Peptide Capsules", href: "https://www.peptidesciences.com/capsules" },
  { label: "Peptide Blends", key: "Peptide Blends", href: "https://www.peptidesciences.com/peptide-blends" },
  { label: "IGF-1 Proteins", key: "IGF-1 Proteins", href: "https://www.peptidesciences.com/igf-1-proteins" },
  { label: "Melanotan Peptides", key: "Melanotan Peptides", href: "https://www.peptidesciences.com/melanotan-peptides" },
  { label: "Bioregulators", key: "Bioregulators", href: "https://www.peptidesciences.com/bioregulators" },
  { label: "Cosmetic Peptides", key: "Cosmetic Peptides", href: "https://www.peptidesciences.com/cosmetic-peptides" },
];

type SortOption = "name" | "price-low" | "price-high" | "bestsellers";

export default function AllPeptides() {
  const [selectedCategory, setSelectedCategory] = useState("All Peptides");
  const [sortBy, setSortBy] = useState<SortOption>("name");

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
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [selectedCategory, sortBy]);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#fff" }}>
      {/* Shop by Category section */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-[1280px] mx-auto px-4 py-4">
          <h2 className="font-bold mb-3" style={{ fontSize: "16px" }}>Shop by Category</h2>
          <div className="flex flex-wrap gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCategory(tab.key)}
                className="px-4 py-1.5 border rounded-sm text-sm transition-colors"
                style={{
                  borderColor: selectedCategory === tab.key ? "#E7461E" : "#ccc",
                  color: selectedCategory === tab.key ? "#E7461E" : "#333",
                  backgroundColor: selectedCategory === tab.key ? "#fff8f6" : "#fff",
                  fontSize: "13px",
                  borderRadius: "4px",
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
                className="flex items-center justify-between px-3 py-2 cursor-pointer"
                style={{ backgroundColor: "#E7461E", color: "#fff", fontSize: "13px" }}
              >
                <span className="font-semibold">Product List</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            </div>
            <Sidebar
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Right: Products */}
          <div className="flex-1 min-w-0">
            {/* Page title */}
            <h1 className="font-bold mb-1" style={{ fontSize: "24px" }}>All Peptides</h1>
            <p className="text-gray-600 mb-4" style={{ fontSize: "14px" }}>
              Purchase US Made Peptides Online Direct From Our Online Catalogue.
            </p>

            {/* Count + Sort */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-gray-600" style={{ fontSize: "13px" }}>
                {filteredProducts.length} Items
              </span>
              <div className="flex items-center gap-2">
                <span className="text-gray-600" style={{ fontSize: "13px" }}>Sort By</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="border border-gray-300 rounded-sm px-2 py-1 text-sm bg-white"
                  style={{ fontSize: "13px" }}
                >
                  <option value="name">Product Name</option>
                  <option value="price-low">Price (Low-High)</option>
                  <option value="price-high">Price (High-Low)</option>
                  <option value="bestsellers">Best sellers</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))" }}>
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 text-gray-500">
                No products found in this category.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
