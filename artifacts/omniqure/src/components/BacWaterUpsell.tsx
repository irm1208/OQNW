import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useProducts } from "@/context/ProductsContext";
import { resolveBacWaterProducts, type BacWaterProductOption } from "@/data/bacWaterProducts";
import { Droplets, Check } from "lucide-react";

/**
 * Upsell prompt for Bacteriostatic Water — shown when the cart has peptides
 * that need reconstituting but no BAC water line item yet, and the customer
 * hasn't already unlocked it for free via the Bundle & Save 3-4 peptide tier.
 */
export default function BacWaterUpsell({ compact = false }: { compact?: boolean }) {
  const { items, peptideQty, bundleFreeBacWater, addToCart, removeFromCart } = useCart();
  const { formatPrice } = useCurrency();
  const { products } = useProducts();
  const bacWaterOptions = resolveBacWaterProducts(products);

  const hasBacWater = items.some((item) =>
    bacWaterOptions.some((option) => option.slug === item.product.slug)
  );

  if (peptideQty === 0 || hasBacWater || bundleFreeBacWater || bacWaterOptions.length === 0) return null;

  function toggle(bw: BacWaterProductOption, added: boolean) {
    if (added) {
      const cartItem = items.find((item) => item.product.slug === bw.slug);
      if (cartItem) removeFromCart(cartItem.product.id);
    } else {
      addToCart(bw, 1);
    }
  }

  return (
    <div className="flex flex-col" style={{ gap: compact ? "8px" : "10px" }}>
      {bacWaterOptions.map((bw, i) => {
        const added = items.some((item) => item.product.slug === bw.slug);
        return (
          <div
            key={bw.id}
            className="relative rounded-2xl"
            style={{
              background: "linear-gradient(180deg, #FBFDFF 0%, #F3F8FF 100%)",
              border: `1.5px solid ${added ? "#60A5FA" : "#DCE9FB"}`,
              boxShadow: "0 2px 10px rgba(15,23,42,0.05)",
              padding: compact ? "10px 16px" : "12px 18px",
            }}
          >
            {i === 0 && (
              <span
                className="absolute font-bold"
                style={{
                  top: "-11px", left: "50%", transform: "translateX(-50%)",
                  fontSize: "10px", letterSpacing: "0.08em",
                  color: "#1B5CB5", background: "#fff",
                  border: "1px solid #BFDBFE", borderRadius: "999px",
                  padding: "3px 12px", whiteSpace: "nowrap",
                }}
              >
                RECOMMENDED
              </span>
            )}

            <button
              type="button"
              onClick={() => toggle(bw, added)}
              className="w-full flex items-center gap-3 text-left"
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {/* Checkbox */}
              <span
                className="flex items-center justify-center flex-shrink-0 rounded-lg"
                style={{
                  width: "22px", height: "22px",
                  border: `2px solid ${added ? "#1B5CB5" : "#CBD5E1"}`,
                  background: added ? "#1B5CB5" : "#fff",
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                {added && <Check size={13} color="#fff" strokeWidth={3} />}
              </span>

              {/* Icon avatar */}
              <span
                className="flex items-center justify-center flex-shrink-0 rounded-xl"
                style={{
                  width: "40px", height: "40px",
                  background: "linear-gradient(145deg, #60A5FA 0%, #1B5CB5 100%)",
                  boxShadow: "0 3px 8px rgba(27,92,181,0.25)",
                }}
              >
                <Droplets size={18} color="#fff" strokeWidth={2.2} />
              </span>

              {/* Copy */}
              <span className="flex-1 min-w-0">
                <span className="block font-bold" style={{ fontSize: "13.5px", color: "#0F172A", lineHeight: 1.35 }}>
                  Add Bacteriostatic Water {bw.label}
                </span>
                <span className="block truncate" style={{ fontSize: "11.5px", color: "#3B6FC4", marginTop: "1px" }}>
                  Essential for reconstituting your peptide
                </span>
              </span>

              {/* Price pill */}
              <span
                className="flex-shrink-0 font-bold rounded-full"
                style={{
                  fontSize: "12.5px",
                  padding: "8px 16px",
                  color: "#fff",
                  background: added ? "#059669" : "#1B5CB5",
                  transition: "background 0.15s",
                }}
              >
                {added ? "Added" : `+${formatPrice(bw.price)}`}
              </span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
