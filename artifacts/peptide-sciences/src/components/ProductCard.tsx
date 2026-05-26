import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Eye, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";

function parseName(name: string): { baseName: string; strength: string } {
  const match = name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g))(\s+.*)?$/i);
  if (match) {
    const suffix = match[3] ? match[3].trim() : "";
    return { baseName: match[1].trim(), strength: suffix ? `${match[2]} ${suffix}` : match[2] };
  }
  return { baseName: name, strength: "" };
}

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

const LOW_STOCK_THRESHOLD = 5;

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = `/product/${product.id}`;
  const { baseName, strength } = parseName(product.name);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const cat = CATEGORY_COLORS[product.category] ?? { color: "#1B5CB5", bg: "#EEF4FF", gradient: "linear-gradient(90deg, #1B5CB5, #2563EB)" };

  const stockLevel = product.stockLevel;
  const isOutOfStock = stockLevel !== undefined && stockLevel === 0;
  const isLowStock = stockLevel !== undefined && stockLevel > 0 && stockLevel <= LOW_STOCK_THRESHOLD;

  const stop = (e: React.MouseEvent) => e.preventDefault();
  const dec = (e: React.MouseEvent) => { stop(e); setQty(q => Math.max(1, q - 1)); };
  const inc = (e: React.MouseEvent) => { stop(e); if (!isOutOfStock) setQty(q => q + 1); };

  const handleAddToCart = (e: React.MouseEvent) => {
    stop(e);
    if (isOutOfStock) return;
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={productUrl} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        className="product-card flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer h-full"
        style={{
          border: "1.5px solid #E8EDF5",
          boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
          opacity: isOutOfStock ? 0.75 : 1,
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = cat.color + "55";
          (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px ${cat.color}1A, 0 4px 16px rgba(15,23,42,0.06)`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = "#E8EDF5";
          (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(15,23,42,0.06)";
        }}
      >
        {/* Category accent bar */}
        <div style={{ height: "3px", background: isOutOfStock ? "#CBD5E1" : cat.gradient, flexShrink: 0 }} />

        {/* Image area */}
        <div
          className="card-product-img relative w-full overflow-hidden"
          style={{ background: `linear-gradient(160deg, #F8FAFE 0%, ${cat.bg} 100%)`, position: "relative" }}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%", height: "100%", objectFit: "contain", padding: "16px",
              transition: "transform 0.4s cubic-bezier(.22,.68,0,1.2)",
              transform: imgHovered && !isOutOfStock ? "scale(1.07)" : "scale(1)",
              filter: isOutOfStock ? "grayscale(0.4)" : "none",
            }}
          />

          {/* Stock badges */}
          {isOutOfStock && (
            <div style={{
              position: "absolute", top: "10px", right: "10px",
              backgroundColor: "#EF4444", color: "#fff",
              fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.06em",
              padding: "4px 10px", borderRadius: "8px",
              textTransform: "uppercase",
            }}>
              Out of Stock
            </div>
          )}
          {isLowStock && (
            <div style={{
              position: "absolute", top: "10px", right: "10px",
              backgroundColor: "#F97316", color: "#fff",
              fontSize: "10.5px", fontWeight: 800, letterSpacing: "0.06em",
              padding: "4px 10px", borderRadius: "8px",
              display: "flex", alignItems: "center", gap: "4px",
            }}>
              <AlertTriangle size={10} /> {stockLevel} left
            </div>
          )}

          {/* Quick View hover overlay */}
          {!isOutOfStock && (
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              height: imgHovered ? "58px" : "0px",
              background: `linear-gradient(to top, ${cat.color}F0, ${cat.color}99, transparent)`,
              display: "flex", alignItems: "flex-end", justifyContent: "center",
              paddingBottom: "12px",
              transition: "height 0.3s cubic-bezier(.22,.68,0,1.2)",
              overflow: "hidden", pointerEvents: "none",
            }}>
              <span style={{
                color: "#fff", fontSize: "12px", fontWeight: 700,
                display: "flex", alignItems: "center", gap: "5px",
                opacity: imgHovered ? 1 : 0,
                transition: "opacity 0.2s ease 0.1s",
                letterSpacing: "0.04em",
              }}>
                <Eye size={12} /> Quick View
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="card-info flex flex-col flex-1 p-4" style={{ borderTop: `1px solid ${cat.color}15` }}>
          {/* Category tag */}
          <span className="card-cat" style={{
            display: "inline-block", alignSelf: "flex-start",
            fontSize: "9.5px", fontWeight: 700,
            color: cat.color, backgroundColor: cat.bg,
            padding: "2px 8px", borderRadius: "6px",
            letterSpacing: "0.05em", marginBottom: "7px", textTransform: "uppercase",
          }}>
            {product.category}
          </span>

          <p className="card-name" style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", lineHeight: 1.3, marginBottom: "2px" }}>
            {baseName}
          </p>
          {strength && (
            <p className="card-strength" style={{ fontSize: "13.5px", fontWeight: 700, color: cat.color, marginBottom: "8px" }}>
              {strength}
            </p>
          )}

          {product.price != null && (
            <div className="flex items-baseline gap-1.5" style={{ marginBottom: "4px" }}>
              <p className="card-price" style={{ fontSize: "21px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
                {formatPrice(product.price)}
              </p>
            </div>
          )}

          <div className="mt-auto pt-3 flex flex-col gap-2">
            {/* View Details */}
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "6px", width: "100%", padding: "9px",
                borderRadius: "10px", border: `1.5px solid ${cat.color}30`,
                color: cat.color, backgroundColor: cat.bg,
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                transition: "background-color 0.15s, border-color 0.15s",
                boxSizing: "border-box",
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
              <Eye size={13} />
              View Details
            </div>

            {/* Quantity + Add to Cart */}
            <div className="card-add-row">
              <div
                className="card-qty"
                style={{
                  backgroundColor: isOutOfStock ? "#F1F5F9" : "#F8FAFC",
                  opacity: isOutOfStock ? 0.5 : 1,
                }}
              >
                <button
                  onClick={dec}
                  disabled={isOutOfStock}
                  style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                  onMouseEnter={e => { if (!isOutOfStock) (e.currentTarget as HTMLElement).style.color = cat.color; }}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
                >−</button>
                <span>{qty}</span>
                <button
                  onClick={inc}
                  disabled={isOutOfStock}
                  style={{ cursor: isOutOfStock ? "not-allowed" : "pointer" }}
                  onMouseEnter={e => { if (!isOutOfStock) (e.currentTarget as HTMLElement).style.color = cat.color; }}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
                >+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="card-cart-btn"
                style={{
                  backgroundColor: isOutOfStock ? "#94A3B8" : added ? "#059669" : "#1240A0",
                  color: "#fff",
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                }}
                onMouseEnter={e => { if (!added && !isOutOfStock) (e.currentTarget as HTMLElement).style.backgroundColor = "#1B5CB5"; }}
                onMouseLeave={e => { if (!added && !isOutOfStock) (e.currentTarget as HTMLElement).style.backgroundColor = "#1240A0"; }}
              >
                {isOutOfStock
                  ? "Out of Stock"
                  : added
                  ? <><CheckCircle2 size={14} /> Added!</>
                  : <><ShoppingCart size={14} /> Add to Cart</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
