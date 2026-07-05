import { useCart, BUNDLE_FREE_BAC_THRESHOLD, BUNDLE_FREE_ONE_THRESHOLD, BUNDLE_FREE_TWO_THRESHOLD } from "@/context/CartContext";
import { Link } from "wouter";
import { ShoppingCart, ChevronUp, ChevronDown, Tag, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const TIERS = [
  { min: BUNDLE_FREE_TWO_THRESHOLD, label: "2 peps free" },
  { min: BUNDLE_FREE_ONE_THRESHOLD, label: "1 pep free" },
  { min: BUNDLE_FREE_BAC_THRESHOLD, label: "a free BAC" },
];

export default function CartPreviewPanel() {
  const { items, totalItems, peptideQty, bundleFreeBacWater, bundleFreeItemsCount, subtotal, bundleDiscountAmount } = useCart();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      document.body.classList.add("has-cart-preview-bar");
    } else {
      document.body.classList.remove("has-cart-preview-bar");
    }
    return () => document.body.classList.remove("has-cart-preview-bar");
  }, [totalItems]);

  if (totalItems === 0) return null;

  const discountedTotal = subtotal - bundleDiscountAmount;
  const hasFreebie = bundleFreeBacWater || bundleFreeItemsCount > 0;
  const next = TIERS.find(t => peptideQty < t.min) ?? null;
  const freebieLabel = bundleFreeItemsCount === 2 ? "2 peps free" : bundleFreeItemsCount === 1 ? "1 pep free" : "a free BAC";

  return (
    <div
      className="cart-preview-bar"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9000,
        pointerEvents: "none",
      }}
    >
      {/* Expanded item list */}
      {expanded && (
        <div
          style={{
            pointerEvents: "all",
            background: "#fff",
            borderTop: "1.5px solid #E2E8F0",
            boxShadow: "0 -8px 32px rgba(15,23,42,0.1)",
            maxHeight: "220px",
            overflowY: "auto",
            padding: "12px 20px",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          {items.map(({ product, quantity }) => (
            <div
              key={product.id}
              style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            >
              <span style={{ fontSize: "12.5px", color: "#374151", flex: 1 }}>
                {product.name}
                {quantity > 1 && <span style={{ color: "#94A3B8", marginLeft: 4 }}>×{quantity}</span>}
              </span>
              <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F172A" }}>
                £{((product.price ?? 0) * quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Main bar */}
      <div
        style={{
          pointerEvents: "all",
          background: "linear-gradient(90deg, #0a1d4f 0%, #0D2565 50%, #0a1d4f 100%)",
          borderTop: "2px solid rgba(255,255,255,0.08)",
          boxShadow: "0 -4px 24px rgba(13,37,101,0.35)",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          height: "60px",
          gap: "16px",
        }}
      >
        {/* Cart icon + count */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          <ShoppingCart size={18} style={{ color: "#93C5FD" }} />
          <span style={{
            fontSize: "10px", fontWeight: 900, color: "#0D2565",
            backgroundColor: "#34D399", borderRadius: "10px", padding: "2px 8px",
            lineHeight: 1.5,
          }}>
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

        {/* Discount or nudge */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {hasFreebie ? (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Tag size={13} style={{ color: "#34D399", flexShrink: 0 }} />
              <span style={{ fontSize: "12.5px", fontWeight: 800, color: "#34D399" }}>
                {freebieLabel} — saving £{bundleDiscountAmount.toFixed(2)}
              </span>
              {next && (
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginLeft: 4 }}>
                  · Add {next.min - peptideQty} more for {next.label}
                </span>
              )}
            </div>
          ) : next ? (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>
                Add {next.min - peptideQty} more peptide{next.min - peptideQty !== 1 ? "s" : ""} for{" "}
                <span style={{ color: "#34D399", fontWeight: 800 }}>{next.label}</span>
              </span>
              {/* mini progress */}
              <div style={{ width: "80px", height: "4px", background: "rgba(255,255,255,0.12)", borderRadius: "4px", flexShrink: 0 }}>
                <div style={{
                  height: "4px", borderRadius: "4px",
                  background: "linear-gradient(90deg, #34D399, #059669)",
                  width: `${Math.min(100, (peptideQty / next.min) * 100)}%`,
                  transition: "width 0.3s",
                }} />
              </div>
            </div>
          ) : null}
        </div>

        {/* Divider */}
        <div style={{ width: "1px", height: "32px", background: "rgba(255,255,255,0.12)", flexShrink: 0 }} />

        {/* Total */}
        <div style={{ flexShrink: 0, textAlign: "right" }}>
          {hasFreebie && (
            <div style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.35)", textDecoration: "line-through", lineHeight: 1.2 }}>
              £{subtotal.toFixed(2)}
            </div>
          )}
          <div style={{ fontSize: "16px", fontWeight: 900, color: hasFreebie ? "#34D399" : "#fff", lineHeight: 1.2 }}>
            £{discountedTotal.toFixed(2)}
          </div>
        </div>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded(e => !e)}
          style={{
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "8px", padding: "6px 8px", cursor: "pointer",
            color: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center",
            flexShrink: 0,
          }}
          title={expanded ? "Hide items" : "Show items"}
        >
          {expanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
        </button>

        {/* CTA */}
        <Link
          href="/cart"
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "linear-gradient(90deg, #34D399, #059669)",
            color: "#022c22", textDecoration: "none",
            borderRadius: "10px", padding: "10px 18px",
            fontSize: "13px", fontWeight: 900,
            flexShrink: 0,
            boxShadow: "0 0 16px rgba(52,211,153,0.3)",
            whiteSpace: "nowrap",
          }}
        >
          View Cart <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
