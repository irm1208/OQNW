import { Link } from "wouter";
import { products } from "@/data/products";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const CATEGORY_ORDER = [
  "Growth Peptides",
  "Healing Peptides",
  "Weight Management",
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

const grouped = CATEGORY_ORDER.map((cat) => ({
  category: cat,
  items: products
    .filter((p) => p.category === cat)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
})).filter((g) => g.items.length > 0);

export default function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="w-[210px] flex-shrink-0">
      {grouped.map(({ category, items }) => {
        const isActive = selectedCategory === category;
        return (
          <div key={category} className="mb-3">
            <button
              onClick={() => onCategoryChange(category)}
              className="w-full text-left px-3 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: isActive ? "rgba(0,212,255,0.1)" : "transparent",
                borderLeft: `2px solid ${isActive ? "#00D4FF" : "rgba(0,212,255,0.15)"}`,
                color: isActive ? "#00D4FF" : "#4A6C80",
                fontSize: "10.5px",
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                fontFamily: "'Share Tech Mono', monospace",
                boxShadow: isActive ? "inset 0 0 12px rgba(0,212,255,0.05)" : "none",
              }}
            >
              {category}
            </button>
            <ul className="ml-4 pl-3 mt-0.5" style={{ borderLeft: "1px solid rgba(0,212,255,0.1)" }}>
              {items.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.id}`}
                    className="block py-0.5 leading-snug transition-colors"
                    style={{ fontSize: "12px", color: "#364D5F" }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#00D4FF"}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#364D5F"}
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
