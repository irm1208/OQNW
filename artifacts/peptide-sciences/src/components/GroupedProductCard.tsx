import { useState } from "react";
import { useLocation } from "wouter";
import { ShoppingCart, Eye, CheckCircle2 } from "lucide-react";
import type { GroupedProduct } from "@/data/groupedProducts";
import { parseName } from "@/data/groupedProducts";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

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

  const selectedVariant = group.variants[selectedIdx];
  const cat = CATEGORY_COLORS[group.category] ?? BLUE;
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
    <div
      className="flex flex-col bg-white rounded-2xl overflow-hidden h-full"
      style={{ border: "1.5px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.06)", transition: "border-color 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = cat.color + "55";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px ${cat.color}1A, 0 4px 16px rgba(15,23,42,0.06)`;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "#E8EDF5";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(15,23,42,0.06)";
      }}
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
          height: imgHovered ? "52px" : "0px",
          background: `linear-gradient(to top, ${cat.color}F0, ${cat.color}99, transparent)`,
          display: "flex", alignItems: "flex-end", justifyContent: "center",
          paddingBottom: "12px",
          transition: "height 0.3s cubic-bezier(.22,.68,0,1.2)",
          overflow: "hidden", pointerEvents: "none",
        }}>
          <span style={{
            color: "#fff", fontSize: "12px", fontWeight: 700,
            display: "flex", alignItems: "center", gap: "5px",
            opacity: imgHovered ? 1 : 0, transition: "opacity 0.2s ease 0.1s",
            letterSpacing: "0.04em",
          }}>
            <Eye size={12} /> View Details
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5" style={{ borderTop: `1px solid ${cat.color}15` }}>
        {/* Category tag */}
        <span style={{
          display: "inline-block", alignSelf: "flex-start",
          fontSize: "10.5px", fontWeight: 700,
          color: cat.color, backgroundColor: cat.bg,
          padding: "3px 10px", borderRadius: "6px",
          letterSpacing: "0.05em", marginBottom: "8px", textTransform: "uppercase",
        }}>
          {group.category}
        </span>

        {/* Product name — clickable */}
        <p
          onClick={goToProduct}
          style={{
            fontSize: "18px", fontWeight: 800, lineHeight: 1.3, marginBottom: "10px",
            cursor: "pointer", transition: "opacity 0.15s",
            background: "linear-gradient(120deg, #0D2565 0%, #1B5CB5 60%, #2563EB 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
        >
          {group.baseName}
        </p>

        {/* Strength pills */}
        {group.variants.length > 1 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "10px" }} onClick={stopProp}>
            {group.variants.map((v, i) => {
              const { strength } = parseName(v.name);
              const active = i === selectedIdx;
              return (
                <button
                  key={v.id}
                  onClick={e => { stopProp(e); setSelectedIdx(i); setAdded(false); setQty(1); }}
                  style={{
                    fontSize: "12.5px", fontWeight: 700,
                    padding: "4px 10px", borderRadius: "7px",
                    border: `1.5px solid ${active ? cat.color : "#E2E8F0"}`,
                    backgroundColor: active ? cat.color : "#F8FAFC",
                    color: active ? "#fff" : "#64748B",
                    cursor: "pointer", transition: "all 0.15s",
                  }}
                >
                  {strength}
                </button>
              );
            })}
          </div>
        ) : (
          <p style={{ fontSize: "14.5px", fontWeight: 700, color: cat.color, marginBottom: "10px" }}>
            {parseName(group.variants[0].name).strength}
          </p>
        )}

        {/* Price */}
        {selectedVariant.price != null && (
          <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginBottom: "6px" }}>
            <span style={{ fontSize: "25px", fontWeight: 800, color: "#059669", lineHeight: 1 }}>
              {formatPrice(selectedVariant.price)}
            </span>
            {group.variants.length > 1 && selectedIdx !== 0 && group.variants[0].price != null && (
              <span style={{ fontSize: "12px", color: "#94A3B8" }}>
                from {formatPrice(group.variants[0].price)}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-2 flex flex-col gap-2" onClick={stopProp}>
          {/* View Details */}
          <button
            onClick={goToProduct}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: "6px", width: "100%", padding: "8px",
              borderRadius: "10px", border: `1.5px solid ${cat.color}30`,
              color: cat.color, backgroundColor: cat.bg,
              fontSize: "14px", fontWeight: 600, cursor: "pointer",
              transition: "background-color 0.15s, border-color 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = cat.color + "20";
              (e.currentTarget as HTMLElement).style.borderColor = cat.color + "60";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.backgroundColor = cat.bg;
              (e.currentTarget as HTMLElement).style.borderColor = cat.color + "30";
            }}
          >
            <Eye size={13} /> View Details
          </button>

          {/* Qty + Add to Cart */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center rounded-xl overflow-hidden flex-shrink-0"
              style={{ border: "1.5px solid #E2E8F0", height: "40px", backgroundColor: "#F8FAFC" }}
            >
              <button
                onClick={e => { stopProp(e); setQty(q => Math.max(1, q - 1)); }}
                style={{ width: "28px", height: "100%", background: "none", border: "none", color: "#64748B", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >−</button>
              <span style={{ minWidth: "24px", fontSize: "13px", fontWeight: 700, color: "#0F172A", borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {qty}
              </span>
              <button
                onClick={e => { stopProp(e); setQty(q => q + 1); }}
                style={{ width: "28px", height: "100%", background: "none", border: "none", color: "#64748B", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
              >+</button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-1.5 font-semibold rounded-xl"
              style={{
                backgroundColor: added ? "#059669" : "#1240A0",
                color: "#fff", border: "none", cursor: "pointer",
                fontSize: "13px", height: "40px",
                transition: "background-color 0.25s",
              }}
              onMouseEnter={e => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1B5CB5"; }}
              onMouseLeave={e => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1240A0"; }}
            >
              {added
                ? <><CheckCircle2 size={13} /> Added!</>
                : <><ShoppingCart size={13} /> Add to Cart</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
