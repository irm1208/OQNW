import { Link } from "wouter";
import { ShoppingCart, CheckCircle2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { type Product } from "@/data/products";
import { isHiddenCategory } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

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

function getStaticAlsoBought(product: Product, products: Product[]): Product[] {
  const currentBase = parseBase(product.name);
  const complementaryCategories = COMPLEMENTARY[product.category] ?? [];
  const eligible = products.filter((p) => !isHiddenCategory(p.category));
  const sameCat = eligible.filter(
    (p) => p.id !== product.id && p.category === product.category && parseBase(p.name) !== currentBase
  );
  const crossCat = eligible.filter(
    (p) => p.id !== product.id && complementaryCategories.includes(p.category) && parseBase(p.name) !== currentBase
  );
  const seenBases = new Set<string>();
  const picked: Product[] = [];
  const addUnique = (p: Product) => {
    const base = parseBase(p.name);
    if (!seenBases.has(base) && picked.length < 5) { seenBases.add(base); picked.push(p); }
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
        style={{ border: "1.5px solid #D3D8E2", boxShadow: "none" }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "#8D9BB8";
          el.style.boxShadow = "none";
          el.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "#D3D8E2";
          el.style.boxShadow = "none";
          el.style.transform = "translateY(0)";
        }}
      >
        <div
          className="flex items-center justify-center relative"
          style={{ height: "130px", background: "#EDF0F9" }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "12px" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
          />
          <span
            className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#EFF2EF", color: "#4F6B52", border: "1px solid #94A895", fontSize: "9.5px" }}
          >
            {product.purity ?? "Purity not specified"}
          </span>
        </div>
        <div className="flex flex-col flex-1 px-3 pt-2.5 pb-3">
          <span
            className="text-xs font-bold mb-1 uppercase tracking-wide"
            style={{ color: "#4E68C2", fontSize: "9px", letterSpacing: "0.06em" }}
          >
            {product.category}
          </span>
          <p
            className="font-semibold leading-snug flex-1 mb-2"
            style={{ fontSize: "12.5px", color: "#22252C", lineHeight: 1.35 }}
          >
            {product.name}
          </p>
          <div className="flex items-center justify-between gap-2">
            {product.price != null && (
              <p className="font-bold" style={{ fontSize: "15px", color: "#4E68C2" }}>
                {formatPrice(product.price)}
              </p>
            )}
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 font-semibold rounded-xl transition-all"
              style={{
                backgroundColor: added ? "#4F6B52" : "#4E68C2",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                padding: "6px 10px",
                height: "30px",
                flexShrink: 0,
                transition: "background-color 0.2s",
              }}
              onMouseEnter={(e) => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#4E68C2"; }}
              onMouseLeave={(e) => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#4E68C2"; }}
            >
              {added ? <><CheckCircle2 size={11} /> Added!</> : <><ShoppingCart size={11} /> Add</>}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface RelatedApiItem {
  productId: number;
  productName: string;
  productCategory: string;
  coOccurrences: number;
}

interface CustomersAlsoBoughtProps {
  product: Product;
}

export default function CustomersAlsoBought({ product }: CustomersAlsoBoughtProps) {
  const { products } = useProducts();
  const [apiRelated, setApiRelated] = useState<Product[] | null>(null);

  useEffect(() => {
    const productIdInt = parseInt(product.id, 10);
    if (!productIdInt) return;

    fetch(apiUrl(`products/${productIdInt}/related`), { credentials: "include" })
      .then((r) => r.ok ? r.json() as Promise<RelatedApiItem[]> : Promise.resolve([]))
      .then((items) => {
        if (items.length >= 3) {
          const resolved = items
            .map((item) => products.find((p) => parseInt(p.id, 10) === item.productId))
            .filter((p): p is Product => !!p && !isHiddenCategory(p.category));
          if (resolved.length >= 3) {
            setApiRelated(resolved.slice(0, 5));
            return;
          }
        }
        setApiRelated(null);
      })
      .catch(() => { setApiRelated(null); });
  }, [product.id]);

  const alsoBought = apiRelated ?? getStaticAlsoBought(product, products);

  if (alsoBought.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: "30px", height: "30px", backgroundColor: "#EFF2EF" }}
        >
          <Users size={15} style={{ color: "#4E68C2" }} />
        </div>
        <h2 className="font-bold" style={{ fontSize: "18px", color: "#22252C" }}>
          Customers Also Bought
        </h2>
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
