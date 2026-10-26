import { useCart } from "@/context/CartContext";
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

  // Checkout totals are in GBP, so the add-on prices are too.
  return (
    <div className="bac-upsell" style={{ gap: compact ? 6 : 8 }}>
      <p className="bac-upsell__title">
        <Droplets size={14} aria-hidden="true" /> Add bacteriostatic water
        <span>For reconstituting your peptides</span>
      </p>
      {bacWaterOptions.map((bw) => {
        const added = items.some((item) => item.product.slug === bw.slug);
        return (
          <button
            key={bw.id}
            type="button"
            onClick={() => toggle(bw, added)}
            aria-pressed={added}
            className="bac-upsell__row"
          >
            <span className="bac-upsell__check" aria-hidden="true">
              {added && <Check size={12} color="#fff" strokeWidth={3} />}
            </span>
            <span className="bac-upsell__name">{bw.label}</span>
            <span className="bac-upsell__price">{added ? "Added" : `+£${bw.price.toFixed(2)}`}</span>
          </button>
        );
      })}
    </div>
  );
}
