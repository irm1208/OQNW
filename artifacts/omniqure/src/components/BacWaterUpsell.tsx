import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Droplets, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const BAC_WATER_OPTIONS = [
  { id: "bw-3ml", name: "Bacteriostatic Water 3ml", slug: "bacteriostatic-water-3ml", price: 4.99, label: "3ml", image: "/bac-water-3ml.png", category: "Accessories" },
  { id: "bw-10ml", name: "Bacteriostatic Water 10ml", slug: "bacteriostatic-water-10ml", price: 8.99, label: "10ml", image: "/bac-water-10ml.png", category: "Accessories" },
] as const;

/**
 * Upsell prompt for Bacteriostatic Water — shown when the cart has peptides
 * that need reconstituting but no BAC water line item yet, and the customer
 * hasn't already unlocked it for free via the Bundle & Save 3-4 peptide tier.
 */
export default function BacWaterUpsell({ compact = false }: { compact?: boolean }) {
  const { items, peptideQty, bundleFreeBacWater, addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [addedId, setAddedId] = useState<string | null>(null);

  const hasBacWater = items.some((i) => i.product.id === "bw-3ml" || i.product.id === "bw-10ml");

  if (peptideQty === 0 || hasBacWater || bundleFreeBacWater) return null;

  function handleAdd(bw: typeof BAC_WATER_OPTIONS[number]) {
    addToCart({ id: bw.id, name: bw.name, slug: bw.slug, price: bw.price, image: bw.image, category: bw.category }, 1);
    setAddedId(bw.id);
    setTimeout(() => setAddedId(null), 1800);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#F0F7FF", border: "1.5px solid #BFDBFE", boxShadow: "0 2px 8px rgba(15,23,42,0.04)", padding: compact ? "12px 14px" : "16px 18px" }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Droplets size={15} style={{ color: "#1240A0" }} />
        <p className="font-bold" style={{ fontSize: "13px", color: "#0F172A" }}>
          Don't forget your BAC water
        </p>
      </div>
      <p style={{ fontSize: "11.5px", color: "#64748B", marginBottom: "12px", lineHeight: 1.5 }}>
        You'll need bacteriostatic water to reconstitute your peptides. Add 3+ peptides to your order for a free 10ml bottle.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        {BAC_WATER_OPTIONS.map((bw) => {
          const added = addedId === bw.id;
          return (
            <button
              key={bw.id}
              onClick={() => handleAdd(bw)}
              className="flex items-center justify-between gap-2 rounded-xl transition-all"
              style={{
                flex: 1,
                backgroundColor: added ? "#059669" : "#fff",
                border: `1.5px solid ${added ? "#059669" : "#BFDBFE"}`,
                color: added ? "#fff" : "#0F172A",
                fontSize: "12px",
                fontWeight: 700,
                padding: "9px 12px",
                cursor: "pointer",
              }}
            >
              <span>{added ? "Added" : `${bw.label} — ${formatPrice(bw.price)}`}</span>
              {added ? <CheckCircle2 size={14} /> : <span style={{ fontSize: "11px", fontWeight: 700, color: "#1240A0" }}>+ Add</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
