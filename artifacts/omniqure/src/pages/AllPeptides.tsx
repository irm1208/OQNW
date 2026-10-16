import { useState, useMemo, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Search } from "lucide-react";
import CatalogueCard from "@/components/CatalogueCard";
import { Container, Eyebrow, SectionTitle } from "@/components/home/HomeSections";
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

  const heading = searchQuery.trim()
    ? `Search: “${searchQuery.trim()}”`
    : selectedCategory === "All Peptides" ? "The full catalogue." : `${selectedCategory}.`;

  return (
    <div className="bg-white">
      {/* Page header */}
      <section className="border-b" style={{ borderColor: "var(--hairline)", background: "#F8F9FB" }}>
        <Container className="pt-8 pb-10 lg:pt-10 lg:pb-12">
          <nav aria-label="Breadcrumb" className="mb-6 uppercase" style={{ fontSize: 10.5, letterSpacing: "0.12em", color: "rgba(75,85,105,0.6)" }}>
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <span className="mx-1.5">/</span>
            <span style={{ color: "var(--ink)" }}>Catalogue</span>
          </nav>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow>Research peptides</Eyebrow>
              <SectionTitle size="clamp(32px, 4.4vw, 56px)">{heading}</SectionTitle>
              <p className="mt-4 max-w-[440px]" style={{ fontSize: 14.5, lineHeight: 1.55, color: "var(--graphite)" }}>
                {searchQuery.trim()
                  ? `Showing results for “${searchQuery.trim()}”. Independent results confirm 99%+ purity.`
                  : CATEGORY_DESCRIPTIONS[selectedCategory] ?? "Verified research compounds, 99%+ purity, each independently lab-tested."}
              </p>
            </div>
            <div className="relative w-full lg:w-[300px]">
              <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "rgba(75,85,105,0.55)" }} />
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
                className="w-full rounded-[10px] border bg-white py-2.5 pl-10 pr-3 outline-none focus:border-[var(--cobalt)]"
                style={{ borderColor: "var(--hairline)", fontSize: 13.5, color: "var(--ink)" }}
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Toolbar: category chips, result count, sort */}
      <section className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur" style={{ borderColor: "var(--hairline)" }}>
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
        <Container className="py-10 lg:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
