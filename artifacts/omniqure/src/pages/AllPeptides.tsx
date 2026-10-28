import { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { FileText, Search, ShieldCheck, Truck } from "lucide-react";
import CatalogueCard from "@/components/CatalogueCard";
import { Container } from "@/components/home/HomeSections";
import { rangeColourForCategory } from "@/lib/rangeColour";
import { groupProducts } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";
import { isHiddenCategory } from "@/data/products";
import { isBacWaterProduct } from "@/data/bacWaterProducts";
import { useSEO } from "@/hooks/useSEO";


type SortOption = "name" | "price-low" | "price-high" | "bestsellers";

const CATEGORY_ORDER = [
  "Growth Peptides", "Healing Peptides", "Longevity Peptides", "Cellular Health",
  "Nootropics", "Immune Support", "Research Peptides", "Peptide Blends",
  "Skin & Repair", "Hormonal Peptides", "Growth Hormone", "Anti-Inflammatory",
  "Cognitive Peptides",
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Growth Peptides": "Research growth peptides including CJC-1295, GHRP-2, Ipamorelin and more. Independent results confirm 99%+ purity.",
  "Healing Peptides": "Research healing peptides including BPC-157, TB-500 and more. Independent results confirm 99%+ purity.",
  "Weight Management": "Research weight management peptides.",
  "Longevity Peptides": "Research longevity peptides including Epithalon, Selank, Semax and more. Independent results confirm 99%+ purity.",
  "Cellular Health": "Research cellular health peptides with independent results confirming 99%+ purity from OmniQure.",
  "Nootropics": "Research nootropic peptides for cognitive research with independent results confirming 99%+ purity from OmniQure.",
  "Immune Support": "Research immune support peptides with independent results confirming 99%+ purity from OmniQure.",
  "Research Peptides": "Specialist research peptides for laboratory use with independent results confirming 99%+ purity from OmniQure.",
  "Peptide Blends": "Research peptide blends and stacks with independent results confirming 99%+ purity from OmniQure.",
  "Skin & Repair": "Research skin and repair peptides including GHK-Cu and more, with independent results confirming 99%+ purity from OmniQure.",
  "Hormonal Peptides": "Research hormonal peptides including Gonadorelin and more. Independent results confirm 99%+ purity.",
  "Growth Hormone": "Research growth hormone peptides with independent results confirming 99%+ purity from OmniQure.",
  "Anti-Inflammatory": "Research anti-inflammatory peptides with independent results confirming 99%+ purity from OmniQure.",
  "Cognitive Peptides": "Research cognitive peptides for neuroscience research with independent results confirming 99%+ purity from OmniQure.",
};

export default function AllPeptides() {
  const { products } = useProducts();
  const [location, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("All Peptides");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");

  const seoTitle = searchQuery.trim()
    ? `Search: "${searchQuery.trim()}"`
    : selectedCategory !== "All Peptides"
    ? selectedCategory
    : "All Research Peptides";
  const seoDesc = searchQuery.trim()
    ? `Showing research peptides matching "${searchQuery.trim()}" — independent results confirm 99%+ purity from OmniQure.`
    : CATEGORY_DESCRIPTIONS[selectedCategory] ?? "Browse 100+ verified research peptides from OmniQure. BPC-157, TB-500, Ipamorelin and more.";
  useSEO({ title: seoTitle, description: seoDesc, canonicalPath: "/all-peptides" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get("category");
    const q = params.get("search");
    if (q) {
      setSearchQuery(decodeURIComponent(q));
      setSelectedCategory("All Peptides");
    } else {
      setSearchQuery("");
      if (cat) {
        setSelectedCategory(decodeURIComponent(cat));
      } else {
        setSelectedCategory("All Peptides");
      }
    }
  }, [location]);

  const groupedProducts = useMemo(() => {
    let result = products.filter((p) => !isHiddenCategory(p.category) && !isBacWaterProduct(p));
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.category ?? "").toLowerCase().includes(q)
      );
    } else if (selectedCategory !== "All Peptides") {
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
  }, [products, selectedCategory, sortBy, searchQuery]);

  const handleCategoryChange = (cat: string) => {
    if (cat === "Popular Peptides") {
      navigate("/popular-peptides");
      return;
    }
    setSelectedCategory(cat);
    const params = cat !== "All Peptides" ? `?category=${encodeURIComponent(cat)}` : "";
    window.history.pushState(null, "", window.location.pathname + params);
  };

  const categories = useMemo(() => {
    const seen = new Set<string>();
    for (const p of products) {
      if (p.category && !isHiddenCategory(p.category) && !isBacWaterProduct(p)) seen.add(p.category);
    }
    return ["All Peptides", ...CATEGORY_ORDER.filter(c => seen.has(c))];
  }, [products]);

  const clearSearch = () => {
    setSearchQuery("");
    window.history.pushState(null, "", window.location.pathname);
  };

  // Sunburst header: the range's own photograph, or the six families for the full catalogue.
  const headerKey = !searchQuery.trim() && selectedCategory !== "All Peptides"
    ? `cat-hdr-${selectedCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`
    : "hdr-catalogue";
  const heading = searchQuery.trim()
    ? `Search: “${searchQuery.trim()}”`
    : selectedCategory === "All Peptides" ? "Research peptides" : selectedCategory;
  const rangeColour = selectedCategory !== "All Peptides" && !searchQuery.trim() ? rangeColourForCategory(selectedCategory) : undefined;

  return (
    <div className="catalogue-page bg-white">
      {/* Page header */}
      <section className="cat-hero" style={rangeColour ? { "--range": rangeColour } as React.CSSProperties : undefined}>
        <Container className="cat-hero__inner">
          <div className="cat-hero__text">
            <nav aria-label="Breadcrumb" className="cat-hero__crumbs">
              <Link href="/">Home</Link>
              <span aria-hidden="true">/</span>
              {selectedCategory !== "All Peptides" && !searchQuery.trim() ? (
                <>
                  <Link href="/all-peptides" onClick={() => handleCategoryChange("All Peptides")}>Catalogue</Link>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page">{selectedCategory}</span>
                </>
              ) : (
                <span aria-current="page">Catalogue</span>
              )}
            </nav>
            <h1 className="cat-hero__title">{heading}</h1>
            <p className="cat-hero__lead">
              {searchQuery.trim()
                ? `${groupedProducts.length} compound${groupedProducts.length !== 1 ? "s" : ""} matching “${searchQuery.trim()}”.`
                : CATEGORY_DESCRIPTIONS[selectedCategory] ?? "Every compound independently tested by Janoshik, with the certificate of analysis on each product."}
            </p>
            <div className="cat-hero__search">
              <Search size={15} aria-hidden="true" />
              <input
                type="search"
                aria-label="Search peptides"
                value={searchQuery}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  const params = e.target.value.trim() ? `?search=${encodeURIComponent(e.target.value.trim())}` : "";
                  window.history.replaceState(null, "", window.location.pathname + params);
                }}
                placeholder="Search peptide or code…"
              />
            </div>
            <ul className="cat-hero__proof">
              <li><ShieldCheck size={14} aria-hidden="true" /> 99%+ HPLC purity</li>
              <li><FileText size={14} aria-hidden="true" /> COA for every batch</li>
              <li><Truck size={14} aria-hidden="true" /> Same-day dispatch</li>
            </ul>
          </div>
          <picture className="cat-hero__media" key={headerKey}>
            <source media="(max-width: 1279px)" srcSet={`/sunburst/${headerKey}-md.webp`} width={1200} height={400} />
            <img src={`/sunburst/${headerKey}.webp`} alt={`${selectedCategory === "All Peptides" ? "OmniQure" : selectedCategory} research vials`} width={1920} height={640} fetchPriority="high" />
          </picture>
        </Container>
      </section>

      {/* Toolbar: category chips, result count, sort */}
      <section className="cat-toolbar sticky z-10 border-b bg-white/95 backdrop-blur" style={{ borderColor: "var(--hairline)" }}>
        <Container className="flex items-center gap-4 py-3">
          <div className="flex min-w-0 flex-1 gap-1.5 overflow-x-auto scrollbar-none" role="tablist" aria-label="Filter by category">
            {categories.map(cat => {
              const active = !searchQuery.trim() && selectedCategory === cat;
              return (
                <button
                  key={cat}
                  role="tab"
                  aria-selected={active}
                  onClick={() => { if (searchQuery) setSearchQuery(""); handleCategoryChange(cat); }}
                  className="shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 transition-colors"
                  style={{
                    fontSize: 12, fontWeight: 500,
                    borderColor: active ? "var(--ink)" : "var(--hairline)",
                    background: active ? "var(--ink)" : "#fff",
                    color: active ? "#fff" : "var(--graphite)",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <span className="hidden shrink-0 sm:inline" style={{ fontSize: 12, color: "rgba(75,85,105,0.7)" }}>
            {groupedProducts.length} result{groupedProducts.length !== 1 ? "s" : ""}
          </span>
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="shrink-0 cursor-pointer rounded-[8px] border bg-white px-2.5 py-1.5 outline-none"
            style={{ borderColor: "var(--hairline)", fontSize: 12.5, color: "var(--ink)" }}
          >
            <option value="name">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </Container>
      </section>

      {/* Grid */}
      <section>
        <Container className="py-6 sm:py-8 lg:py-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {groupedProducts.map(group => (
              <CatalogueCard key={group.baseName} group={group} />
            ))}
          </div>

          {groupedProducts.length === 0 && (
            <div className="py-20 text-center" style={{ fontSize: 14, color: "var(--graphite)" }}>
              {searchQuery.trim() ? (
                <>
                  <p className="mb-2">No products found for “{searchQuery.trim()}”.</p>
                  <button onClick={clearSearch} className="font-semibold" style={{ color: "var(--cobalt)" }}>Clear search</button>
                </>
              ) : "No products found in this category."}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
