import {
  useCart,
  BUNDLE_FREE_BAC_THRESHOLD,
  BUNDLE_FREE_ONE_THRESHOLD,
  BUNDLE_FREE_TWO_THRESHOLD,
} from "@/context/CartContext";
import { Link } from "wouter";
import { ShoppingCart, Tag, ArrowRight, X } from "lucide-react";
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
      : "Free 10ml BAC Water Ampule";

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
        className={animOut ? "cart-flyout-out" : "cart-flyout-in"}
        style={{
          position: "fixed",
          right: 0,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 9000,
          width: PANEL_WIDTH,
          background: "#fff",
          borderRadius: "16px 0 0 16px",
          boxShadow: "-8px 0 48px rgba(13,37,101,0.18)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "88vh",
          overflow: "hidden",
          pointerEvents: "all",
        }}
        // Reset auto-hide whenever the user hovers — they're reading it
        onMouseEnter={() => { if (hideTimer.current) clearTimeout(hideTimer.current); }}
        onMouseLeave={() => scheduleHide()}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(90deg, #0a1d4f 0%, #22252C 100%)",
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShoppingCart size={15} style={{ color: "#B4D89C" }} />
            <span
              style={{
                fontSize: "13px",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Your Order
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 900,
                color: "#22252C",
                backgroundColor: "#34D399",
                borderRadius: "10px",
                padding: "1px 7px",
                lineHeight: 1.6,
              }}
            >
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </span>
          </div>
          <button
            onClick={() => hide(false)}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "8px",
              padding: "4px 6px",
              cursor: "pointer",
              color: "rgba(255,255,255,0.6)",
              display: "flex",
              alignItems: "center",
            }}
            title="Close"
          >
            <X size={13} />
          </button>
        </div>

        {/* Item list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          {items.map(({ product, quantity }) => {
            const freeUnits = Math.min(
              freeUnitsByProductId[product.id] ?? 0,
              quantity
            );
            const linePrice = (product.price ?? 0) * (quantity - freeUnits);
            return (
              <div
                key={product.id}
                style={{ display: "flex", gap: 10, alignItems: "flex-start" }}
              >
                {/* Thumbnail */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 6,
                    border: "1px solid #D3D8E2",
                    overflow: "hidden",
                    background: "#F8FAFC",
                    flexShrink: 0,
                    position: "relative",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {quantity > 1 && (
                    <span
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        background: "#22252C",
                        color: "#fff",
                        fontSize: "9px",
                        fontWeight: 800,
                        borderRadius: "8px",
                        padding: "1px 5px",
                        lineHeight: 1.5,
                      }}
                    >
                      ×{quantity}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: "12.5px",
                      fontWeight: 600,
                      color: "#22252C",
                      margin: 0,
                      lineHeight: 1.35,
                    }}
                  >
                    {product.name}
                  </p>
                  {freeUnits > 0 && (
                    <span
                      style={{
                        fontSize: "10.5px",
                        color: "#059669",
                        fontWeight: 700,
                      }}
                    >
                      {freeUnits === quantity ? "Free" : `${freeUnits} free`}
                    </span>
                  )}
                </div>

                {/* Price */}
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    flexShrink: 0,
                    color: freeUnits > 0 ? "#059669" : "#22252C",
                  }}
                >
                  £{linePrice.toFixed(2)}
                </span>
              </div>
            );
          })}

          {/* Free BAC water row */}
          {bundleFreeBacWater && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 6,
                  border: "1px dashed #34D399",
                  background: "#F0FDF4",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tag size={16} style={{ color: "#059669" }} />
              </div>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#059669",
                    margin: 0,
                  }}
                >
                  BAC Water 10ml
                </p>
                <p style={{ fontSize: "10.5px", color: "#059669", margin: 0 }}>
                  Free with bundle
                </p>
              </div>
              <span
                style={{ fontSize: "13px", fontWeight: 700, color: "#059669" }}
              >
                £0.00
              </span>
            </div>
          )}
        </div>

        {/* Bundle nudge */}
        {next && (
          <div
            style={{
              padding: "10px 16px",
              borderTop: "1px solid #F1F5F9",
              background: "#F8FAFC",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: "11.5px", color: "#64748B" }}>
                Add{" "}
                <strong style={{ color: "#22252C" }}>
                  {next.min - peptideQty}
                </strong>{" "}
                more for{" "}
                <strong style={{ color: "#059669" }}>{next.label}</strong>
              </span>
              <span style={{ fontSize: "11px", color: "#94A3B8" }}>
                {peptideQty}/{next.min}
              </span>
            </div>
            <div
              style={{ height: 4, background: "#E2E8F0", borderRadius: 4 }}
            >
              <div
                style={{
                  height: 4,
                  borderRadius: 4,
                  background: "linear-gradient(90deg, #34D399, #059669)",
                  width: `${Math.min(100, (peptideQty / next.min) * 100)}%`,
                  transition: "width 0.3s",
                }}
              />
            </div>
          </div>
        )}

        {/* Freebie banner */}
        {hasFreebie && (
          <div
            style={{
              padding: "8px 16px",
              background: "#F0FDF4",
              borderTop: "1px solid #D1FAE5",
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexShrink: 0,
            }}
          >
            <Tag size={12} style={{ color: "#059669", flexShrink: 0 }} />
            <span
              style={{ fontSize: "12px", fontWeight: 700, color: "#059669" }}
            >
              {freebieLabel} — saving £{bundleDiscountAmount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Totals + CTA */}
        <div
          style={{
            padding: "14px 16px",
            borderTop: "1px solid #E2E8F0",
            flexShrink: 0,
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: hasFreebie ? 4 : 12,
            }}
          >
            <span style={{ fontSize: "12.5px", color: "#64748B" }}>
              Subtotal
            </span>
            <span
              style={{
                fontSize: "12.5px",
                fontWeight: 600,
                color: hasFreebie ? "#94A3B8" : "#22252C",
                textDecoration: hasFreebie ? "line-through" : "none",
              }}
            >
              £{subtotal.toFixed(2)}
            </span>
          </div>
          {hasFreebie && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <span
                style={{ fontSize: "13px", fontWeight: 800, color: "#22252C" }}
              >
                Total
              </span>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "#059669",
                }}
              >
                £{discountedTotal.toFixed(2)}
              </span>
            </div>
          )}

          <Link
            href="/cart"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              background: "linear-gradient(90deg, #34D399, #059669)",
              color: "#022c22",
              textDecoration: "none",
              borderRadius: "10px",
              padding: "11px 18px",
              fontSize: "13.5px",
              fontWeight: 900,
              width: "100%",
              boxSizing: "border-box",
              boxShadow: "0 0 16px rgba(52,211,153,0.25)",
            }}
            onClick={() => hide(true)}
          >
            View Cart &amp; Checkout <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </>
  );
}
