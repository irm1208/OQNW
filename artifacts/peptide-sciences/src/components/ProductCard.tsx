import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Eye, CheckCircle2 } from "lucide-react";
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

const CATEGORY_COLORS: Record<string, { color: string; bg: string; gradient: string }> = {
  "Growth Peptides":    { color: "#1B5CB5", bg: "#EEF4FF", gradient: "linear-gradient(90deg, #1B5CB5, #2563EB)" },
  "Healing Peptides":   { color: "#DC2626", bg: "#FEF2F2", gradient: "linear-gradient(90deg, #DC2626, #F87171)" },
  "Weight Management":  { color: "#7C3AED", bg: "#F5F3FF", gradient: "linear-gradient(90deg, #7C3AED, #A78BFA)" },
  "Longevity Peptides": { color: "#0E7490", bg: "#ECFEFF", gradient: "linear-gradient(90deg, #0E7490, #22D3EE)" },
  "Cellular Health":    { color: "#065F46", bg: "#ECFDF5", gradient: "linear-gradient(90deg, #065F46, #34D399)" },
  "Nootropics":         { color: "#9333EA", bg: "#FAF5FF", gradient: "linear-gradient(90deg, #9333EA, #C084FC)" },
  "Immune Support":     { color: "#1B5CB5", bg: "#EEF4FF", gradient: "linear-gradient(90deg, #1B5CB5, #60A5FA)" },
  "Research Peptides":  { color: "#B45309", bg: "#FFFBEB", gradient: "linear-gradient(90deg, #B45309, #FBBF24)" },
  "Peptide Blends":     { color: "#DC2626", bg: "#FEF2F2", gradient: "linear-gradient(90deg, #DC2626, #F97316)" },
  "Skin & Repair":      { color: "#BE185D", bg: "#FDF2F8", gradient: "linear-gradient(90deg, #BE185D, #F472B6)" },
  "Hormonal Peptides":  { color: "#0E7490", bg: "#ECFEFF", gradient: "linear-gradient(90deg, #0E7490, #67E8F9)" },
  "Growth Hormone":     { color: "#065F46", bg: "#ECFDF5", gradient: "linear-gradient(90deg, #065F46, #10B981)" },
  "Anti-Inflammatory":  { color: "#7C3AED", bg: "#F5F3FF", gradient: "linear-gradient(90deg, #7C3AED, #818CF8)" },
  "Cognitive Peptides": { color: "#B45309", bg: "#FFFBEB", gradient: "linear-gradient(90deg, #B45309, #F59E0B)" },
};

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

  const stop = (e: React.MouseEvent) => e.preventDefault();
  const dec = (e: React.MouseEvent) => { stop(e); setQty(q => Math.max(1, q - 1)); };
  const inc = (e: React.MouseEvent) => { stop(e); setQty(q => q + 1); };

  const handleAddToCart = (e: React.MouseEvent) => {
    stop(e);
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={productUrl} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        className="product-card flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer h-full"
        style={{ border: "1.5px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.06)" }}
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
        <div style={{ height: "3px", background: cat.gradient, flexShrink: 0 }} />

        {/* Image area */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "240px", background: `linear-gradient(160deg, #F8FAFE 0%, ${cat.bg} 100%)` }}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}
        >
          {/* HPLC badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "3px",
              backgroundColor: "#EEF4FF", color: "#1B5CB5",
              fontSize: "10px", fontWeight: 700, padding: "3px 8px",
              borderRadius: "20px", border: "1px solid #BFDBFE", letterSpacing: "0.03em",
            }}>
              98%+ HPLC
            </span>
          </div>
          {/* COA badge */}
          <div className="absolute top-2.5 right-2.5 z-10">
            <span style={{
              display: "inline-flex", alignItems: "center",
              backgroundColor: "#F0FDF4", color: "#059669",
              fontSize: "10px", fontWeight: 700, padding: "3px 8px",
              borderRadius: "20px", border: "1px solid #6EE7B7", letterSpacing: "0.03em",
            }}>
              COA ✓
            </span>
          </div>

          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%", height: "100%", objectFit: "contain", padding: "16px",
              transition: "transform 0.4s cubic-bezier(.22,.68,0,1.2)",
              transform: imgHovered ? "scale(1.07)" : "scale(1)",
            }}
          />

          {/* Quick View hover overlay */}
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
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-4" style={{ borderTop: `1px solid ${cat.color}15` }}>
          {/* Category tag */}
          <span style={{
            display: "inline-block", alignSelf: "flex-start",
            fontSize: "9.5px", fontWeight: 700,
            color: cat.color, backgroundColor: cat.bg,
            padding: "2px 8px", borderRadius: "6px",
            letterSpacing: "0.05em", marginBottom: "7px", textTransform: "uppercase",
          }}>
            {product.category}
          </span>

          <p style={{ fontSize: "16px", fontWeight: 700, color: "#0F172A", lineHeight: 1.3, marginBottom: "2px" }}>
            {baseName}
          </p>
          {strength && (
            <p style={{ fontSize: "13.5px", fontWeight: 700, color: cat.color, marginBottom: "8px" }}>
              {strength}
            </p>
          )}

          {product.price != null && (
            <div className="flex items-baseline gap-1.5" style={{ marginBottom: "4px" }}>
              <p style={{ fontSize: "21px", fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>
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
            <div className="flex items-center gap-2">
              <div
                className="flex items-center rounded-xl overflow-hidden flex-shrink-0"
                style={{ border: "1.5px solid #E2E8F0", height: "40px", backgroundColor: "#F8FAFC" }}
              >
                <button
                  onClick={dec}
                  className="flex items-center justify-center font-bold"
                  style={{ width: "28px", height: "100%", background: "none", border: "none", color: "#64748B", fontSize: "16px", cursor: "pointer", transition: "color 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = cat.color}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
                >−</button>
                <span
                  className="font-bold text-center"
                  style={{ minWidth: "24px", fontSize: "13px", color: "#0F172A", borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {qty}
                </span>
                <button
                  onClick={inc}
                  className="flex items-center justify-center font-bold"
                  style={{ width: "28px", height: "100%", background: "none", border: "none", color: "#64748B", fontSize: "16px", cursor: "pointer", transition: "color 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = cat.color}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
                >+</button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-1.5 font-semibold rounded-xl"
                style={{
                  backgroundColor: added ? "#059669" : "#1240A0",
                  color: "#fff", border: "none", cursor: "pointer",
                  fontSize: "13px", height: "40px",
                  transition: "background-color 0.25s, transform 0.15s",
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
    </Link>
  );
}
