import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Eye, CheckCircle2, Zap } from "lucide-react";
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

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = `/product/${product.id}`;
  const { baseName, strength } = parseName(product.name);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

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
        className="product-card flex flex-col rounded-2xl overflow-hidden cursor-pointer h-full"
        style={{ fontFamily: "'Arimo', Arial, sans-serif" }}
      >
        {/* Image area */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: "260px",
            background: "linear-gradient(160deg, #050D1C 0%, #080F1E 60%, #0A1A30 100%)",
          }}
        >
          {/* Corner accent lines */}
          <div style={{ position: "absolute", top: 0, left: 0, width: "28px", height: "28px", borderTop: "2px solid rgba(0,212,255,0.5)", borderLeft: "2px solid rgba(0,212,255,0.5)", zIndex: 3, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, right: 0, width: "28px", height: "28px", borderTop: "2px solid rgba(0,212,255,0.5)", borderRight: "2px solid rgba(0,212,255,0.5)", zIndex: 3, pointerEvents: "none" }} />

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                background: "rgba(0,212,255,0.1)",
                border: "1px solid rgba(0,212,255,0.35)",
                color: "#00D4FF",
                fontSize: "9.5px",
                fontWeight: 700,
                fontFamily: "'Share Tech Mono', monospace",
                padding: "3px 8px",
                borderRadius: "4px",
                letterSpacing: "0.06em",
              }}
            >
              ≥99% HPLC
            </span>
          </div>
          <div className="absolute top-3 right-3 z-10">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                background: "rgba(0,255,136,0.08)",
                border: "1px solid rgba(0,255,136,0.35)",
                color: "#00FF88",
                fontSize: "9.5px",
                fontWeight: 700,
                fontFamily: "'Share Tech Mono', monospace",
                padding: "3px 8px",
                borderRadius: "4px",
                letterSpacing: "0.06em",
              }}
            >
              COA
            </span>
          </div>

          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "20px", position: "relative", zIndex: 2, filter: "drop-shadow(0 4px 12px rgba(0,212,255,0.15))" }}
          />

          {/* Bottom gradient fade */}
          <div
            style={{
              position: "absolute", bottom: 0, left: 0, right: 0, height: "60px",
              background: "linear-gradient(to bottom, transparent, #080F1E)",
              pointerEvents: "none", zIndex: 2,
            }}
          />
        </div>

        {/* Info panel */}
        <div
          className="flex flex-col flex-1 p-5"
          style={{ borderTop: "1px solid rgba(0,212,255,0.1)" }}
        >
          <p style={{ fontSize: "17px", fontWeight: 700, color: "#D4E8F5", lineHeight: 1.25, marginBottom: "3px" }}>
            {baseName}
          </p>
          {strength && (
            <p style={{ fontSize: "13.5px", fontWeight: 700, color: "#00D4FF", marginBottom: "8px", fontFamily: "'Share Tech Mono', monospace" }}>
              {strength}
            </p>
          )}

          {product.price != null && (
            <p
              style={{
                fontSize: "24px",
                fontWeight: 800,
                color: "#00D4FF",
                lineHeight: 1,
                marginBottom: "4px",
                textShadow: "0 0 16px rgba(0,212,255,0.45)",
              }}
            >
              {formatPrice(product.price)}
            </p>
          )}

          <div className="mt-auto pt-4 flex flex-col gap-2.5">
            {/* View Details */}
            <div
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "7px",
                width: "100%", padding: "10px", borderRadius: "8px",
                border: "1px solid rgba(0,212,255,0.3)",
                color: "#00D4FF", backgroundColor: "rgba(0,212,255,0.05)",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                transition: "background-color 0.15s, box-shadow 0.15s",
                boxSizing: "border-box",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "rgba(0,212,255,0.12)";
                el.style.boxShadow = "0 0 12px rgba(0,212,255,0.2)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.backgroundColor = "rgba(0,212,255,0.05)";
                el.style.boxShadow = "none";
              }}
            >
              <Eye size={13} />
              View Details
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center rounded-lg overflow-hidden flex-shrink-0"
                style={{ border: "1px solid rgba(0,212,255,0.25)", height: "42px", backgroundColor: "rgba(0,212,255,0.05)" }}
              >
                <button
                  onClick={dec}
                  className="flex items-center justify-center font-bold"
                  style={{ width: "32px", height: "100%", background: "none", border: "none", color: "#4A7A8A", fontSize: "18px", cursor: "pointer", transition: "color 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#00D4FF"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#4A7A8A"}
                >
                  −
                </button>
                <span
                  style={{ minWidth: "28px", fontSize: "13px", fontWeight: 700, color: "#C8D8EE", fontFamily: "'Share Tech Mono', monospace", borderLeft: "1px solid rgba(0,212,255,0.2)", borderRight: "1px solid rgba(0,212,255,0.2)", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {qty}
                </span>
                <button
                  onClick={inc}
                  className="flex items-center justify-center font-bold"
                  style={{ width: "32px", height: "100%", background: "none", border: "none", color: "#4A7A8A", fontSize: "18px", cursor: "pointer", transition: "color 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#00D4FF"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#4A7A8A"}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-1.5 font-bold rounded-lg"
                style={{
                  background: added
                    ? "linear-gradient(135deg, #00FF88 0%, #00CC66 100%)"
                    : "linear-gradient(135deg, #00D4FF 0%, #0099CC 100%)",
                  color: "#04080F",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  height: "42px",
                  transition: "all 0.25s",
                  boxShadow: added
                    ? "0 0 16px rgba(0,255,136,0.4)"
                    : "0 0 12px rgba(0,212,255,0.3)",
                }}
                onMouseEnter={e => {
                  if (!added) {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(0,212,255,0.6)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={e => {
                  if (!added) {
                    (e.currentTarget as HTMLElement).style.boxShadow = "0 0 12px rgba(0,212,255,0.3)";
                    (e.currentTarget as HTMLElement).style.transform = "none";
                  }
                }}
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
