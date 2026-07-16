import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, Eye, CheckCircle2, Heart, Flame, Zap } from "lucide-react";
import type { GroupedProduct } from "@/data/groupedProducts";
import { parseName } from "@/data/groupedProducts";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useWishlist } from "@/context/WishlistContext";
import { sellingFastSlugs, hotBuySlugs } from "@/data/popularPeptides";
import QuickViewModal from "@/components/QuickViewModal";

const BLUE = { color: "#1B5CB5", bg: "#EEF4FF", gradient: "linear-gradient(90deg, #1240A0, #2563EB)" };

const CATEGORY_COLORS: Record<string, { color: string; bg: string; gradient: string }> = {
  "Growth Peptides":    BLUE,
  "Healing Peptides":   BLUE,
  "Weight Management":  BLUE,
  "Longevity Peptides": BLUE,
  "Cellular Health":    BLUE,
  "Nootropics":         BLUE,
  "Immune Support":     BLUE,
  "Research Peptides":  BLUE,
  "Peptide Blends":     BLUE,
  "Skin & Repair":      BLUE,
  "Hormonal Peptides":  BLUE,
  "Growth Hormone":     BLUE,
  "Anti-Inflammatory":  BLUE,
  "Cognitive Peptides": BLUE,
};

interface GroupedProductCardProps {
  group: GroupedProduct;
}

export default function GroupedProductCard({ group }: GroupedProductCardProps) {
  const [, navigate] = useLocation();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const [selectedIdx, setSelectedIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();

  const selectedVariant = group.variants[selectedIdx];
  const productIdInt = parseInt(String(selectedVariant?.id ?? group.variants[0]?.id), 10);
  const cat = CATEGORY_COLORS[group.category] ?? BLUE;
  const isSellingFast = group.variants.some(v => sellingFastSlugs.has(v.slug));
  const isHotBuy = !isSellingFast && group.variants.some(v => hotBuySlugs.has(v.slug));
  const productUrl = `/product/${selectedVariant.id}`;

  const goToProduct = () => navigate(productUrl);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(selectedVariant, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
    <div
      className="rounded-2xl h-full"
      style={{
        padding: "3px",
        background: "linear-gradient(135deg, rgba(99,149,255,0.45) 0%, rgba(147,187,255,0.25) 50%, rgba(99,149,255,0.45) 100%)",
        boxShadow: "0 0 18px rgba(99,149,255,0.25), 0 2px 12px rgba(15,23,42,0.06)",
        transition: "box-shadow 0.2s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px rgba(99,149,255,0.45), 0 8px 32px rgba(15,23,42,0.10)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 0 18px rgba(99,149,255,0.25), 0 2px 12px rgba(15,23,42,0.06)";
      }}
    >
    <div
      className="flex flex-col bg-white rounded-[14px] overflow-hidden h-full"
      style={{ border: "none", transition: "border-color 0.2s, box-shadow 0.2s" }}
    >
      {/* Accent bar */}
      <div style={{ height: "3px", background: cat.gradient, flexShrink: 0 }} />

      {/* Image — clickable to product page */}
      <div
        className="card-product-img relative w-full overflow-hidden"
        style={{ background: `linear-gradient(160deg, #F8FAFE 0%, ${cat.bg} 100%)`, cursor: "pointer", flexShrink: 0 }}
        onClick={goToProduct}
        onMouseEnter={() => setImgHovered(true)}
        onMouseLeave={() => setImgHovered(false)}
      >
        {/* Selling Fast / Hot Buy badge — top left */}
        {isSellingFast && (
          <div style={{
            position: "absolute", top: "10px", left: "10px", zIndex: 10,
            background: "linear-gradient(90deg, #DC2626, #F97316)",
            color: "#fff", fontSize: "10px", fontWeight: 800, letterSpacing: "0.05em",
            padding: "4px 9px", borderRadius: "8px",
            display: "flex", alignItems: "center", gap: "4px",
            boxShadow: "0 2px 8px rgba(220,38,38,0.35)",
            pointerEvents: "none",
          }}>
            <Flame size={10} /> BESTSELLER
          </div>
        )}
        {isHotBuy && (
          <div style={{
            position: "absolute", top: "10px", left: "10px", zIndex: 10,
            background: "linear-gradient(90deg, #B45309, #D97706)",
            color: "#fff", fontSize: "10px", fontWeight: 800, letterSpacing: "0.05em",
            padding: "4px 9px", borderRadius: "8px",
            display: "flex", alignItems: "center", gap: "4px",
            boxShadow: "0 2px 8px rgba(180,83,9,0.35)",
            pointerEvents: "none",
          }}>
            <Zap size={10} /> TRENDING
          </div>
        )}

        {/* Wishlist heart */}
        <button
          onClick={(e) => { e.stopPropagation(); void toggleWishlist(productIdInt); }}
          title={inWishlist(productIdInt) ? "Remove from wishlist" : "Save to wishlist"}
          style={{
            position: "absolute", top: "8px", right: "8px", zIndex: 10,
            width: "30px", height: "30px", borderRadius: "50%",
            backgroundColor: inWishlist(productIdInt) ? "#FEF2F2" : "rgba(255,255,255,0.85)",
            border: inWishlist(productIdInt) ? "1.5px solid #FECACA" : "1.5px solid #E2E8F0",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.15s", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          }}
        >
          <Heart
            size={14}
            style={{
              color: inWishlist(productIdInt) ? "#DC2626" : "#94A3B8",
              fill: inWishlist(productIdInt) ? "#DC2626" : "none",
              transition: "all 0.15s",
            }}
          />
        </button>
        <img
          src={group.image}
          alt={group.baseName}
          style={{
            width: "100%", height: "100%", objectFit: "contain", padding: "16px",
            transition: "transform 0.4s cubic-bezier(.22,.68,0,1.2)",
            transform: imgHovered ? "scale(1.07)" : "scale(1)",
            pointerEvents: "none",
          }}
        />
        {/* Hover overlay */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: imgHovered ? "56px" : "0px",
          background: `linear-gradient(to top, ${cat.color}F2, ${cat.color}99, transparent)`,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          paddingBottom: "10px",
          transition: "height 0.3s cubic-bezier(.22,.68,0,1.2)",
          overflow: "hidden",
        }}>
          <button
            onClick={e => { e.stopPropagation(); setQuickViewOpen(true); }}
            style={{
              color: "#fff", fontSize: "11.5px", fontWeight: 700,
              display: "flex", alignItems: "center", gap: "5px",
              opacity: imgHovered ? 1 : 0, transition: "opacity 0.2s ease 0.1s",
              letterSpacing: "0.04em", background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)", borderRadius: "8px",
              padding: "5px 12px", cursor: "pointer",
            }}
          >
            <Eye size={12} /> Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="card-info flex flex-col flex-1 p-2" style={{ borderTop: `1px solid ${cat.color}15` }}>
        {/* Category tag */}
        <span className="card-cat" style={{
          display: "inline-block", alignSelf: "flex-start",
          fontSize: "9px", fontWeight: 700,
          color: cat.color, backgroundColor: cat.bg,
          padding: "2px 6px", borderRadius: "4px",
          letterSpacing: "0.04em", marginBottom: "3px", textTransform: "uppercase",
        }}>
          {group.category}
        </span>

        {/* Product name — clickable */}
        <p
          className="card-name"
          onClick={goToProduct}
          style={{
            fontSize: "18px", fontWeight: 800, lineHeight: 1.2, marginBottom: "5px",
            cursor: "pointer", transition: "opacity 0.15s",
            background: "linear-gradient(120deg, #0D2565 0%, #1B5CB5 60%, #2563EB 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
        >
          {selectedVariant.name}
        </p>

        {/* Stock badge */}
        <div style={{ marginBottom: "4px" }}>
          {selectedVariant.stockLevel === 0 ? (
            <span style={{
              fontSize: "10px", fontWeight: 700, color: "#DC2626",
              backgroundColor: "#FEF2F2", border: "1px solid #FECACA",
              padding: "2px 7px", borderRadius: "5px",
              display: "inline-flex", alignItems: "center", gap: "3px",
            }}>
              ✗ Out of Stock
            </span>
          ) : selectedVariant.stockLevel !== undefined && selectedVariant.stockLevel <= 10 ? (
            <span style={{
              fontSize: "10px", fontWeight: 700, color: "#B45309",
              backgroundColor: "#FFFBEB", border: "1px solid #FDE68A",
              padding: "2px 7px", borderRadius: "5px",
              display: "inline-flex", alignItems: "center", gap: "3px",
            }}>
              ⚡ Only {selectedVariant.stockLevel} left
            </span>
          ) : (
            <span style={{
              fontSize: "10px", fontWeight: 700, color: "#059669",
              backgroundColor: "#ECFDF5", border: "1px solid #A7F3D0",
              padding: "2px 7px", borderRadius: "5px",
              display: "inline-flex", alignItems: "center", gap: "3px",
            }}>
              ✓ In Stock
            </span>
          )}
        </div>

        {/* Price */}
        {selectedVariant.price != null && (
          <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
            <span className="card-price" style={{ fontSize: "17px", fontWeight: 800, color: "#059669", lineHeight: 1 }}>
              {formatPrice(selectedVariant.price)}
            </span>
            {group.variants.length > 1 && selectedIdx !== 0 && group.variants[0].price != null && (
              <span style={{ fontSize: "10px", color: "#94A3B8" }}>
                from {formatPrice(group.variants[0].price)}
              </span>
            )}
          </div>
        )}

        {/* Strength dropdown — under price */}
        {group.variants.length > 1 && (
          <div style={{ marginBottom: "6px" }} onClick={stopProp}>
            <label style={{
              display: "block",
              fontSize: "10px",
              fontWeight: 700,
              color: "#64748B",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              marginBottom: "3px",
            }}>
              Select Strength
            </label>
            <div style={{ position: "relative" }}>
              <select
                value={selectedIdx}
                onChange={e => { setSelectedIdx(Number(e.target.value)); setAdded(false); setQty(1); }}
                onClick={stopProp}
                style={{
                  width: "100%",
                  padding: "7px 30px 7px 11px",
                  borderRadius: "9px",
                  border: `2px solid ${cat.color}`,
                  backgroundColor: cat.bg,
                  color: cat.color,
                  fontSize: "13px",
                  fontWeight: 800,
                  fontFamily: "inherit",
                  appearance: "none",
                  WebkitAppearance: "none",
                  cursor: "pointer",
                  outline: "none",
                }}
              >
                {group.variants.map((v, i) => {
                  const { strength } = parseName(v.name);
                  return (
                    <option key={v.id} value={i}>
                      {strength}{v.price != null ? ` — ${formatPrice(v.price)}` : ""}
                    </option>
                  );
                })}
              </select>
              <svg
                width="13" height="13" viewBox="0 0 24 24"
                fill="none" stroke={cat.color} strokeWidth="2.5"
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-1 flex flex-col gap-1" onClick={stopProp}>
          {/* Qty + Add to Cart */}
          <div className="card-add-row">
            <div className="card-qty">
              <button
                onClick={e => { stopProp(e); setQty(q => Math.max(1, q - 1)); }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = cat.color}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
              >−</button>
              <span>{qty}</span>
              <button
                onClick={e => { stopProp(e); setQty(q => q + 1); }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = cat.color}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
              >+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="card-cart-btn"
              style={{
                backgroundColor: added ? "#059669" : "#1240A0",
                color: "#fff",
                cursor: "pointer",
              }}
              onMouseEnter={e => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1B5CB5"; }}
              onMouseLeave={e => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1240A0"; }}
            >
              {added
                ? <><CheckCircle2 size={14} /> Added!</>
                : <><ShoppingCart size={14} /> Add to Cart</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>

    {quickViewOpen && (
      <QuickViewModal
        group={group}
        initialIdx={selectedIdx}
        onClose={() => setQuickViewOpen(false)}
      />
    )}
    </>
  );
}
