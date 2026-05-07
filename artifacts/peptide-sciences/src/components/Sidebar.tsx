import { capsuleProducts, purchaseProducts } from "@/data/products";

interface SidebarProps {
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const allCategories = [
  { label: "All Peptides", href: "#", key: "All Peptides" },
];

export default function Sidebar({ selectedCategory, onCategoryChange }: SidebarProps) {
  return (
    <aside className="w-[220px] flex-shrink-0 text-sm">
      {/* Peptide Capsules section */}
      <div className="mb-4">
        <button
          onClick={() => onCategoryChange("Peptide Capsules")}
          className="block font-bold mb-2 hover:underline text-left w-full"
          style={{ color: "#E7461E", fontSize: "13px" }}
        >
          Peptide Capsules
        </button>
        <ul className="space-y-1">
          {capsuleProducts.map((p) => (
            <li key={p.slug}>
              <a
                href={`https://www.peptidesciences.com${p.slug}`}
                className="text-gray-700 hover:underline hover:text-gray-900 leading-tight block py-0.5"
                style={{ fontSize: "12.5px" }}
              >
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Purchase Peptides section */}
      <div>
        <button
          onClick={() => onCategoryChange("Purchase Peptides")}
          className="block font-bold mb-2 hover:underline text-left w-full"
          style={{ color: "#E7461E", fontSize: "13px" }}
        >
          Purchase Peptides
        </button>
        <ul className="space-y-1">
          {purchaseProducts.map((p) => (
            <li key={`${p.slug}-${p.name}`}>
              <a
                href={`https://www.peptidesciences.com${p.slug}`}
                className="text-gray-700 hover:underline hover:text-gray-900 leading-tight block py-0.5"
                style={{ fontSize: "12.5px" }}
              >
                {p.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
