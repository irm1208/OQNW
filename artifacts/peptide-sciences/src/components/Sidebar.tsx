import { Link } from "wouter";
import { products } from "@/data/products";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const allProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

export default function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="w-[220px] flex-shrink-0 text-sm">
      <ul className="space-y-0.5">
        {allProducts.map((p) => (
          <li key={p.id}>
            <Link
              href={`/product/${p.id}`}
              className="block py-1 px-1 leading-snug hover:underline"
              style={{
                fontSize: "12.5px",
                color: selectedCategory === p.category ? "#1B5CB5" : "#333",
                fontWeight: selectedCategory === p.category ? 600 : 400,
              }}
            >
              {p.name}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
