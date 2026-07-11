import { useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useOverlayCoordinator } from "@/context/OverlayCoordinatorContext";
import { ShoppingCart, Tag } from "lucide-react";

const HIDDEN_PATHS = ["/checkout", "/account", "/sign-in", "/register", "/forgot-password", "/reset-password", "/order-confirmation"];

export default function MobileBottomBar() {
  const [location, navigate] = useLocation();
  const { totalItems, subtotal, bundleDiscountAmount, bundleFreeBacWater, bundleFreeItemsCount } = useCart();
  const { formatPrice } = useCurrency();
  const barRef = useRef<HTMLDivElement>(null);
  const { registerBottomInset } = useOverlayCoordinator();

  const hasFreebie = bundleFreeBacWater || bundleFreeItemsCount > 0;
  const freebieLabel = bundleFreeItemsCount === 2
    ? "2 peps free"
    : bundleFreeItemsCount === 1
    ? "1 pep free"
    : "a free BAC water";

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

  // Report our rendered height (0 on desktop, since CSS hides us there) so the
  // chat bubble can shift above us on mobile instead of overlapping.
  useEffect(() => {
    if (!visible) {
      registerBottomInset("mobile-cart-bar", 0);
      return;
    }
    const el = barRef.current;
    if (!el) return;
    const update = () => registerBottomInset("mobile-cart-bar", el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    window.addEventListener("resize", update);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", update);
      registerBottomInset("mobile-cart-bar", 0);
    };
  }, [visible, registerBottomInset]);

  if (!visible) return null;

  const discountedTotal = subtotal - bundleDiscountAmount;

  return (
    <div
      ref={barRef}
      className="mobile-bottom-bar"
      role="complementary"
      aria-label="Cart summary"
    >
      {/* Bundle savings strip — shown above the bar when a freebie is active */}
      {hasFreebie && (
        <div
          style={{
            background: "linear-gradient(90deg, #065f46, #047857)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            padding: "5px 16px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Tag size={11} style={{ color: "#6EE7B7", flexShrink: 0 }} />
          <span style={{ fontSize: "11.5px", fontWeight: 800, color: "#6EE7B7", letterSpacing: "0.02em" }}>
            You&apos;ve unlocked {freebieLabel} — saving {formatPrice(bundleDiscountAmount)}
          </span>
        </div>
      )}

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
          <span
            className="mobile-bottom-bar__total"
            style={{ color: hasFreebie ? "#6EE7B7" : "#fff" }}
          >
            {formatPrice(discountedTotal)}
          </span>
          <span className="mobile-bottom-bar__cta">Checkout →</span>
        </div>
      </button>
    </div>
  );
}
