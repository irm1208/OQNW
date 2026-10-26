import {
  useCart,
  BUNDLE_FREE_BAC_THRESHOLD,
  BUNDLE_FREE_ONE_THRESHOLD,
  BUNDLE_FREE_TWO_THRESHOLD,
} from "@/context/CartContext";
import { Link } from "wouter";
import { useCurrency } from "@/context/CurrencyContext";
import { ShoppingCart, Tag, ArrowRight, X, Droplets } from "lucide-react";
import { getCatalogueVialImage } from "@/lib/catalogueImages";
import { STUDIO_BG } from "@/lib/studioImage";
import { useState, useEffect, useRef } from "react";

const TIERS = [
  { min: BUNDLE_FREE_BAC_THRESHOLD, label: "a free BAC" },
  { min: BUNDLE_FREE_ONE_THRESHOLD, label: "1 peptide free" },
  { min: BUNDLE_FREE_TWO_THRESHOLD, label: "2 peptides free" },
];

const AUTO_HIDE_MS = 4000; // hide 4 s after last add
const PANEL_WIDTH = 320;

export default function CartPreviewPanel() {
  const {
    items,
    totalItems,
    peptideQty,
    bundleFreeBacWater,
    bundleFreeItemsCount,
    subtotal,
    bundleDiscountAmount,
    freeUnitsByProductId,
  } = useCart();
  const { formatPrice } = useCurrency();

  const [visible, setVisible] = useState(false);
  const [animOut, setAnimOut] = useState(false);
  const prevTotal = useRef(totalItems);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Show panel whenever totalItems increases (i.e. something was added)
  useEffect(() => {
    if (totalItems > prevTotal.current) {
      setAnimOut(false);
      setVisible(true);
      scheduleHide();
    }
    prevTotal.current = totalItems;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems]);

  // If cart emptied entirely, hide immediately
  useEffect(() => {
    if (totalItems === 0) hide(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems]);

  function scheduleHide() {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => hide(false), AUTO_HIDE_MS);
  }

  function hide(immediate: boolean) {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (immediate) {
      setVisible(false);
      setAnimOut(false);
    } else {
      setAnimOut(true);
      setTimeout(() => {
        setVisible(false);
        setAnimOut(false);
      }, 220); // match animation duration
    }
  }

  if (!visible || totalItems === 0) return null;

  const discountedTotal = subtotal - bundleDiscountAmount;
  const hasFreebie = bundleFreeBacWater || bundleFreeItemsCount > 0;
  const next = TIERS.find((t) => peptideQty < t.min) ?? null;
  const freebieLabel =
    bundleFreeItemsCount === 2
      ? "2 peptides free"
      : bundleFreeItemsCount === 1
      ? "1 peptide free"
      : "Free 10ml BAC water";

  return (
    <>
      <style>{`
        @keyframes cartSlideIn {
          from { opacity: 0; transform: translateX(${PANEL_WIDTH}px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes cartSlideOut {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(${PANEL_WIDTH}px); }
        }
        .cart-flyout-in  { animation: cartSlideIn  0.22s cubic-bezier(0.22,1,0.36,1) forwards; }
        .cart-flyout-out { animation: cartSlideOut 0.22s cubic-bezier(0.22,1,0.36,1) forwards; }
      `}</style>

      <div
        className={`cart-flyout ${animOut ? "cart-flyout-out" : "cart-flyout-in"}`}
        style={{ width: PANEL_WIDTH }}
        role="dialog"
        aria-label="Your order"
        // Reset auto-hide whenever the user hovers — they're reading it
        onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current); }}
        onMouseLeave={() => scheduleHide()}
      >
        {/* Header: Matte Navy band and stripe, as on the purchase card */}
        <div className="cart-flyout__head">
          <div className="cart-flyout__heading">
            <ShoppingCart size={15} aria-hidden="true" />
            <span className="cart-flyout__title">Your order</span>
            <span className="cart-flyout__count">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
          </div>
          <button type="button" onClick={() => hide(false)} className="cart-flyout__close" aria-label="Close cart preview">
            <X size={14} />
          </button>
        </div>
        <div className="cart-flyout__stripe" />

        {/* Item list */}
        <ul className="cart-flyout__items">
          {items.map(({ product, quantity }) => {
            const freeUnits = Math.min(
              freeUnitsByProductId[product.id] ?? 0,
              quantity
            );
            const linePrice = (product.price ?? 0) * (quantity - freeUnits);
            return (
              <li key={product.id} className="cart-flyout__item">
                <span className="cart-flyout__thumb" style={{ background: STUDIO_BG }}>
                  <img
                    src={getCatalogueVialImage(product.id, product.slug, product.image, product.sourceImage)}
                    alt=""
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {quantity > 1 && <span className="cart-flyout__qty">×{quantity}</span>}
                </span>
                <span className="cart-flyout__info">
                  <span className="cart-flyout__name">{product.name}</span>
                  <span className="cart-flyout__meta">
                    {quantity} × {formatPrice(product.price ?? 0)}
                    {freeUnits > 0 && (
                      <span className="cart-flyout__free">
                        {freeUnits === quantity ? "Free" : `${freeUnits} free`}
                      </span>
                    )}
                  </span>
                </span>
                <span className="cart-flyout__price" data-free={freeUnits > 0}>
                  {formatPrice(linePrice)}
                </span>
              </li>
            );
          })}

          {/* Free BAC water row */}
          {bundleFreeBacWater && (
            <li className="cart-flyout__item cart-flyout__item--gift">
              <span className="cart-flyout__thumb cart-flyout__thumb--gift">
                <Droplets size={18} aria-hidden="true" />
              </span>
              <span className="cart-flyout__info">
                <span className="cart-flyout__name">BAC water 10ml</span>
                <span className="cart-flyout__meta">Free with your bundle</span>
              </span>
              <span className="cart-flyout__price" data-free="true">Free</span>
            </li>
          )}
        </ul>

        {/* Bundle nudge */}
        {next && (
          <div className="cart-flyout__nudge">
            <div className="cart-flyout__nudge-row">
              <span>
                Add <strong>{next.min - peptideQty} more</strong> for <strong>{next.label}</strong>
              </span>
              <span className="cart-flyout__nudge-count">{peptideQty}/{next.min}</span>
            </div>
            <div className="cart-flyout__bar">
              <span style={{ width: `${Math.min(100, (peptideQty / next.min) * 100)}%` }} />
            </div>
          </div>
        )}

        {/* Totals + CTA */}
        <div className="cart-flyout__foot">
          <div className="cart-flyout__line">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          {hasFreebie && (
            <div className="cart-flyout__line cart-flyout__line--saving">
              <span><Tag size={12} aria-hidden="true" /> {freebieLabel}</span>
              <span>−{formatPrice(bundleDiscountAmount)}</span>
            </div>
          )}
          <div className="cart-flyout__line cart-flyout__line--total">
            <span>Total</span>
            <span>{formatPrice(discountedTotal)}</span>
          </div>

          <Link href="/cart" className="cart-flyout__cta" onClick={() => hide(true)}>
            View cart &amp; checkout <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </>
  );
}
