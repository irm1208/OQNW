import { useCart } from "@/context/CartContext";
import { Link } from "wouter";
import { ShoppingCart, X, ChevronRight, Tag } from "lucide-react";
import { useState } from "react";

const DISCOUNT_TIERS = [
  { min: 15, pct: 20 },
  { min: 11, pct: 15 },
  { min: 7,  pct: 10 },
  { min: 3,  pct: 5  },
];

function nextTier(total: number) {
  return DISCOUNT_TIERS.find(t => total < t.min) ?? null;
}

export default function CartPreviewPanel() {
  const { items, totalItems, subtotal, bundleDiscountPct, bundleDiscountAmount } = useCart();
  const [collapsed, setCollapsed] = useState(false);

  if (totalItems === 0) return null;

  const discountedTotal = subtotal - bundleDiscountAmount;
  const next = nextTier(totalItems);

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 9000,
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "row-reverse",
        pointerEvents: "none",
      }}
    >
      {/* Panel */}
      <div
        style={{
          pointerEvents: "all",
          background: "#fff",
          border: "1.5px solid #E2E8F0",
          borderRight: "none",
          borderRadius: "16px 0 0 16px",
          boxShadow: "-4px 0 32px rgba(15,23,42,0.12)",
          width: collapsed ? "0px" : "260px",
          overflow: "hidden",
          transition: "width 0.25s ease",
          flexShrink: 0,
        }}
      >
        <div style={{ width: "260px", padding: "16px" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShoppingCart size={15} style={{ color: "#1240A0" }} />
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>
                Your Cart
              </span>
              <span style={{
                fontSize: "10px", fontWeight: 800, color: "#fff",
                backgroundColor: "#1240A0", borderRadius: "10px",
                padding: "1px 7px",
              }}>{totalItems}</span>
            </div>
            <button
              onClick={() => setCollapsed(true)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: "2px" }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Items list */}
          <div style={{ maxHeight: "180px", overflowY: "auto", marginBottom: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {items.map(({ product, quantity }) => (
              <div key={product.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "11.5px", color: "#374151", flex: 1, lineHeight: 1.3 }}>
                  {product.name}
                  {quantity > 1 && <span style={{ color: "#94A3B8" }}> ×{quantity}</span>}
                </span>
                <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#0F172A", whiteSpace: "nowrap" }}>
                  £{((product.price ?? 0) * quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{ borderTop: "1px solid #F1F5F9", marginBottom: "10px" }} />

          {/* Discount badge */}
          {bundleDiscountPct > 0 && (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0",
              borderRadius: "8px", padding: "6px 10px", marginBottom: "8px",
            }}>
              <Tag size={12} style={{ color: "#059669", flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: "11px", fontWeight: 800, color: "#059669" }}>
                  Bundle & Save — {bundleDiscountPct}% off
                </p>
                <p style={{ fontSize: "10.5px", color: "#6EE7B7" }}>
                  −£{bundleDiscountAmount.toFixed(2)} saved
                </p>
              </div>
            </div>
          )}

          {/* Next tier nudge */}
          {next && (
            <div style={{
              backgroundColor: "#EFF6FF", borderRadius: "8px",
              padding: "6px 10px", marginBottom: "8px",
            }}>
              <p style={{ fontSize: "10.5px", color: "#1D4ED8", fontWeight: 600 }}>
                Add {next.min - totalItems} more for {next.pct}% off
              </p>
              {/* Progress bar */}
              <div style={{ marginTop: "4px", backgroundColor: "#BFDBFE", borderRadius: "4px", height: "4px" }}>
                <div style={{
                  height: "4px", borderRadius: "4px",
                  background: "linear-gradient(90deg, #1240A0, #3B82F6)",
                  width: `${Math.min(100, (totalItems / next.min) * 100)}%`,
                  transition: "width 0.3s",
                }} />
              </div>
            </div>
          )}

          {/* Totals */}
          <div style={{ marginBottom: "12px" }}>
            {bundleDiscountPct > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                <span style={{ fontSize: "11.5px", color: "#94A3B8" }}>Subtotal</span>
                <span style={{ fontSize: "11.5px", color: "#94A3B8", textDecoration: "line-through" }}>
                  £{subtotal.toFixed(2)}
                </span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>Total</span>
              <span style={{ fontSize: "13px", fontWeight: 800, color: bundleDiscountPct > 0 ? "#059669" : "#0F172A" }}>
                £{discountedTotal.toFixed(2)}
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/cart"
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              background: "linear-gradient(90deg, #0D2565 0%, #1240A0 100%)",
              color: "#fff", textDecoration: "none",
              borderRadius: "10px", padding: "10px",
              fontSize: "12.5px", fontWeight: 800,
              boxShadow: "0 4px 12px rgba(13,37,101,0.25)",
            }}
          >
            View Cart <ChevronRight size={13} />
          </Link>
        </div>
      </div>

      {/* Collapsed tab */}
      {collapsed && (
        <button
          onClick={() => setCollapsed(false)}
          style={{
            pointerEvents: "all",
            background: "linear-gradient(180deg, #0D2565 0%, #1240A0 100%)",
            border: "none",
            borderRadius: "10px 0 0 10px",
            padding: "14px 8px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            boxShadow: "-4px 0 16px rgba(13,37,101,0.2)",
          }}
        >
          <ShoppingCart size={16} style={{ color: "#fff" }} />
          <span style={{
            fontSize: "9px", fontWeight: 800, color: "#fff",
            writingMode: "vertical-rl", textOrientation: "mixed", letterSpacing: "0.05em",
          }}>
            {totalItems} item{totalItems !== 1 ? "s" : ""}
          </span>
          {bundleDiscountPct > 0 && (
            <span style={{
              fontSize: "9px", fontWeight: 900, color: "#34D399",
              writingMode: "vertical-rl", textOrientation: "mixed",
            }}>
              -{bundleDiscountPct}%
            </span>
          )}
        </button>
      )}
    </div>
  );
}
