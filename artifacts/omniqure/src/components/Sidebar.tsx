import { useMemo } from "react";
import { Link } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { isHiddenCategory } from "@/data/products";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const CATEGORY_ORDER = [
  "Growth Peptides",
  "Healing Peptides",
  "Longevity Peptides",
  "Cellular Health",
  "Nootropics",
  "Immune Support",
  "Research Peptides",
  "Peptide Blends",
  "Skin & Repair",
  "Hormonal Peptides",
  "Growth Hormone",
  "Anti-Inflammatory",
  "Cognitive Peptides",
];

export default function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  const { products } = useProducts();

  const grouped = useMemo(
    () =>
      CATEGORY_ORDER.map((cat) => ({
        category: cat,
        items: products
          .filter((p) => p.category === cat && !isHiddenCategory(p.category))
          .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
      })).filter((g) => g.items.length > 0),
    [products],
  );

  return (
    <aside className="w-[185px] flex-shrink-0">
      {grouped.map(({ category, items }) => {
        const isActive = selectedCategory === category;
        return (
          <div key={category} className="mb-4">
            <button
              onClick={() => onCategoryChange(category)}
              className="w-full text-left px-2.5 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: isActive ? "#E8F2DE" : "transparent",
                borderLeft: `3px solid ${isActive ? "#4E68C2" : "transparent"}`,
                color: isActive ? "#4E68C2" : "#374151",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {category}
            </button>
            <ul className="ml-5 pl-3 mt-1" style={{ borderLeft: "1px solid #D3D8E2" }}>
              {items.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.id}`}
                    className="block py-0.5 leading-snug transition-colors"
                    style={{ fontSize: "12px", color: "#64748B" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#4E68C2"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </aside>
  );
}
