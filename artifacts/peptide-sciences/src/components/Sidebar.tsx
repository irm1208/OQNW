import { Link } from "wouter";
import { products } from "@/data/products";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const purchaseItems = products
  .filter((p) => p.category === "Purchase Peptides")
  .sort((a, b) => a.name.localeCompare(b.name));

export default function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="w-[220px] flex-shrink-0 text-sm">
      {/* Purchase Peptides section */}
      <div>
        <button
          onClick={() => onCategoryChange("Purchase Peptides")}
          className="block font-bold mb-2 hover:underline text-left w-full"
          style={{ color: "#1B5CB5", fontSize: "13px" }}
        >
          Purchase Peptides
        </button>
        <ul className="space-y-1">
          {purchaseItems.map((p) => (
            <li key={p.id}>
              <Link
                href={`/product/${p.id}`}
                className="text-gray-700 hover:underline hover:text-gray-900 leading-tight block py-0.5"
                style={{ fontSize: "12.5px" }}
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
