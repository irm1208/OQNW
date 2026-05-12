import { Link } from "wouter";
import { ShoppingCart, CheckCircle2, Users } from "lucide-react";
import { useState } from "react";
import { type Product } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getPurityStr } from "@/utils/productPurity";

const COMPLEMENTARY: Record<string, string[]> = {
  "Healing Peptides":   ["Immune Support", "Anti-Inflammatory", "Peptide Blends"],
  "Growth Peptides":    ["Growth Hormone", "Hormonal Peptides", "Cellular Health"],
  "Weight Management":  ["Cellular Health", "Hormonal Peptides", "Research Peptides"],
  "Nootropics":         ["Cognitive Peptides", "Research Peptides", "Cellular Health"],
  "Longevity Peptides": ["Cellular Health", "Anti-Inflammatory", "Immune Support"],
  "Cellular Health":    ["Longevity Peptides", "Anti-Inflammatory", "Growth Peptides"],
  "Immune Support":     ["Healing Peptides", "Anti-Inflammatory", "Research Peptides"],
  "Skin & Repair":      ["Healing Peptides", "Cellular Health", "Anti-Inflammatory"],
  "Anti-Inflammatory":  ["Healing Peptides", "Immune Support", "Cellular Health"],
  "Hormonal Peptides":  ["Growth Peptides", "Research Peptides", "Cellular Health"],
  "Growth Hormone":     ["Growth Peptides", "Hormonal Peptides", "Cellular Health"],
  "Cognitive Peptides": ["Nootropics", "Research Peptides", "Cellular Health"],
  "Peptide Blends":     ["Healing Peptides", "Growth Peptides", "Immune Support"],
  "Research Peptides":  ["Nootropics", "Cognitive Peptides", "Cellular Health"],
};

function parseBase(name: string): string {
  const match = name.match(/^(.*?)\s+\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g)/i);
  return match ? match[1].trim() : name;
}

function getAlsoBought(product: Product, products: Product[]): Product[] {
  const currentBase = parseBase(product.name);
  const complementaryCategories = COMPLEMENTARY[product.category] ?? [];

  const sameCat = products.filter(
    (p) =>
      p.id !== product.id &&
      p.category === product.category &&
      parseBase(p.name) !== currentBase
  );

  const crossCat = products.filter(
    (p) =>
      p.id !== product.id &&
      complementaryCategories.includes(p.category) &&
      parseBase(p.name) !== currentBase
  );

  const seenBases = new Set<string>();
  const picked: Product[] = [];

  const addUnique = (p: Product) => {
    const base = parseBase(p.name);
    if (!seenBases.has(base) && picked.length < 5) {
      seenBases.add(base);
      picked.push(p);
    }
  };

  const seed = parseInt(product.id, 10) || 1;
  const shuffle = <T,>(arr: T[]): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = (seed * (i + 7) * 31337) % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  shuffle(sameCat).slice(0, 2).forEach(addUnique);
  shuffle(crossCat).slice(0, 3).forEach(addUnique);
  if (picked.length < 5) shuffle(sameCat).forEach(addUnique);

  return picked;
}

function AlsoBoughtCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
      <div
        className="rounded-2xl overflow-hidden bg-white flex flex-col h-full cursor-pointer transition-all duration-200"
        style={{ border: "1.5px solid #E8EDF5", boxShadow: "0 2px 10px rgba(15,23,42,0.05)" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "#93B8F0";
          el.style.boxShadow = "0 8px 24px rgba(27,92,181,0.10)";
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "#E8EDF5";
          el.style.boxShadow = "0 2px 10px rgba(15,23,42,0.05)";
          el.style.transform = "translateY(0)";
        }}
      >
        <div
          className="flex items-center justify-center relative"
          style={{
            height: "130px",
            background: "linear-gradient(145deg, #F4F8FF 0%, #EBF2FF 100%)",
          }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12px" }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <span
            className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", fontSize: "9.5px" }}
          >
            {getPurityStr(product.id)}
          </span>
        </div>

        <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3">
          <span
            className="text-xs font-bold mb-1 uppercase tracking-wide"
            style={{ color: "#1B5CB5", fontSize: "9px", letterSpacing: "0.06em" }}
          >
            {product.category}
          </span>
          <p
            className="font-semibold leading-snug flex-1 mb-2"
            style={{ fontSize: "12.5px", color: "#0F172A", lineHeight: 1.35 }}
          >
            {product.name}
          </p>

          <div className="flex items-center justify-between gap-2">
            {product.price != null && (
              <p className="font-bold" style={{ fontSize: "15px", color: "#1240A0" }}>
                {formatPrice(product.price)}
              </p>
            )}
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 font-semibold rounded-xl transition-all"
              style={{
                backgroundColor: added ? "#059669" : "#1240A0",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                padding: "6px 10px",
                height: "30px",
                flexShrink: 0,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1B5CB5";
              }}
              onMouseLeave={(e) => {
                if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1240A0";
              }}
            >
              {added ? (
                <><CheckCircle2 size={11} /> Added!</>
              ) : (
                <><ShoppingCart size={11} /> Add</>
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface CustomersAlsoBoughtProps {
  product: Product;
}

export default function CustomersAlsoBought({ product }: CustomersAlsoBoughtProps) {
  const { products } = useProducts();
  const alsoBought = getAlsoBought(product, products);

  if (alsoBought.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: "30px", height: "30px", backgroundColor: "#EEF4FF" }}
        >
          <Users size={15} style={{ color: "#1B5CB5" }} />
        </div>
        <h2 className="font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
          Customers Also Bought
        </h2>
        <span
          className="text-xs px-2.5 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: "#FFF7ED", color: "#C2410C", border: "1px solid #FED7AA" }}
        >
          Frequently paired
        </span>
      </div>

      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))" }}
      >
        {alsoBought.map((p) => (
          <AlsoBoughtCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
