import { useEffect } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingCart } from "lucide-react";

const HIDDEN_PATHS = ["/checkout", "/account", "/sign-in", "/register", "/forgot-password", "/reset-password", "/order-confirmation"];

export default function MobileBottomBar() {
  const [location, navigate] = useLocation();
  const { totalItems, subtotal, bundleDiscountAmount } = useCart();
  const { formatPrice } = useCurrency();

  const hiddenByPath = HIDDEN_PATHS.some((p) => location === p || location.startsWith(p + "/"));
  const visible = !hiddenByPath && totalItems > 0;

  useEffect(() => {
    if (visible) {
      document.body.classList.add("has-mobile-bottom-bar");
    } else {
      document.body.classList.remove("has-mobile-bottom-bar");
    }
    return () => {
      document.body.classList.remove("has-mobile-bottom-bar");
    };
  }, [visible]);

  if (!visible) return null;

  const discountedTotal = subtotal - bundleDiscountAmount;

  return (
    <div
      className="mobile-bottom-bar"
      role="complementary"
      aria-label="Cart summary"
    >
      <button
        onClick={() => navigate("/cart")}
        className="mobile-bottom-bar__inner"
        aria-label={`View cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}, ${formatPrice(discountedTotal)}`}
      >
        <div className="mobile-bottom-bar__left">
          <span className="mobile-bottom-bar__icon-wrap">
            <ShoppingCart size={20} strokeWidth={2} />
            <span className="mobile-bottom-bar__badge">{totalItems > 99 ? "99+" : totalItems}</span>
          </span>
          <span className="mobile-bottom-bar__label">View Cart</span>
        </div>
        <div className="mobile-bottom-bar__right">
          {bundleDiscountAmount > 0 && (
            <span className="mobile-bottom-bar__original">{formatPrice(subtotal)}</span>
          )}
          <span className="mobile-bottom-bar__total">{formatPrice(discountedTotal)}</span>
          <span className="mobile-bottom-bar__cta">Checkout →</span>
        </div>
      </button>
    </div>
  );
}
