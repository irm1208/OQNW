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
    <aside className="w-[220px] flex-shrink-0 text-sm">
      {grouped.map(({ category, items }) => {
        const isActive = selectedCategory === category;
        return (
          <div key={category} className="mb-2">
            <button
              onClick={() => onCategoryChange(category)}
              className="flex items-center justify-between w-full px-2 py-1.5 text-left transition-colors"
              style={{
                backgroundColor: isActive ? "#eef3fb" : "#f5f7fa",
                borderLeft: isActive ? "3px solid #1B5CB5" : "3px solid transparent",
                fontSize: "12px",
                fontWeight: 700,
                color: isActive ? "#1B5CB5" : "#333",
                borderRadius: "2px",
              }}
            >
              <span>{category}</span>
            </button>
            <ul className="pl-3 mt-0.5">
              {items.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/product/${p.id}`}
                    className="block py-0.5 hover:underline leading-snug"
                    style={{ fontSize: "12px", color: "#444" }}
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
