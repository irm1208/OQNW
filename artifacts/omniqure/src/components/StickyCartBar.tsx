import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";

export default function StickyCartBar() {
  const { items, totalItems, subtotal } = useCart();
  const { formatPrice } = useCurrency();
  const [isVisible, setIsVisible] = useState(false);
  // Product pages render their own sticky buy bar, so this cart bar would
  // otherwise stack on top of it.
  const [location] = useLocation();
  const onProductPage = location.startsWith("/product/");
  // The cart page has its own total and Place order bar.
  const onCartPage = location === "/cart" || location.startsWith("/checkout");

  useEffect(() => {
    setIsVisible(totalItems > 0);
  }, [totalItems]);

  if (!isVisible || onProductPage || onCartPage) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-40 md:hidden">
      <Link
        href="/cart"
        className="flex items-center justify-between gap-3 rounded-full px-5 py-3.5 shadow-2xl transition-transform active:scale-[0.98]"
        style={{ background: "var(--ink)", color: "white" }}
      >
        <div className="flex items-center gap-2.5">
          <ShoppingCart size={18} strokeWidth={2} />
          <span className="text-[13px] font-semibold">
            Cart ({totalItems})
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-bold tabular-nums">
            {formatPrice(subtotal)}
          </span>
          <ArrowRight size={16} strokeWidth={2.5} />
        </div>
      </Link>
    </div>
  );
}
