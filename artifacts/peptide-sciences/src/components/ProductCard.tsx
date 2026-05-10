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
        className="product-card flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer h-full"
        style={{ border: "1.5px solid #E8EDF5", boxShadow: "0 2px 10px rgba(15,23,42,0.05)" }}
      >
        {/* Image area */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "220px", background: "linear-gradient(160deg, #F8FAFE 0%, #EEF4FF 100%)" }}
        >
          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                backgroundColor: "#EEF4FF",
                color: "#1B5CB5",
                fontSize: "10px",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "20px",
                border: "1px solid #BFDBFE",
                letterSpacing: "0.03em",
              }}
            >
              ≥99% HPLC
            </span>
          </div>
          <div className="absolute top-2.5 right-2.5 z-10">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                backgroundColor: "#F0FDF4",
                color: "#059669",
                fontSize: "10px",
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: "20px",
                border: "1px solid #6EE7B7",
                letterSpacing: "0.03em",
              }}
            >
              COA
            </span>
          </div>

          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "16px" }}
          />

          {/* Gradient overlay at bottom of image */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "40px",
              background: "linear-gradient(to bottom, transparent, rgba(238,244,255,0.5))",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 p-4" style={{ borderTop: "1px solid #EEF4FF" }}>
          <p style={{ fontSize: "14.5px", fontWeight: 700, color: "#0F172A", lineHeight: "1.3", marginBottom: "2px" }}>
            {baseName}
          </p>
          {strength && (
            <p style={{ fontSize: "12.5px", fontWeight: 700, color: "#1B5CB5", marginBottom: "6px" }}>
              {strength}
            </p>
          )}

          {product.price != null && (
            <div className="flex items-baseline gap-1.5" style={{ marginBottom: "2px" }}>
              <p style={{ fontSize: "18px", fontWeight: 800, color: "#1240A0", lineHeight: 1 }}>
                {formatPrice(product.price)}
              </p>
            </div>
          )}

          <div className="mt-auto pt-3 flex flex-col gap-2">
            {/* View Details */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                width: "100%",
                padding: "8px",
                borderRadius: "10px",
                border: "1.5px solid #DBEAFE",
                color: "#1B5CB5",
                backgroundColor: "#F0F7FF",
                fontSize: "12.5px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.15s, border-color 0.15s",
                boxSizing: "border-box",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#DBEAFE";
                (e.currentTarget as HTMLElement).style.borderColor = "#93C5FD";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#F0F7FF";
                (e.currentTarget as HTMLElement).style.borderColor = "#DBEAFE";
              }}
            >
              <Eye size={13} />
              View Details
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-2">
              <div
                className="flex items-center rounded-xl overflow-hidden flex-shrink-0"
                style={{ border: "1.5px solid #E2E8F0", height: "36px", backgroundColor: "#F8FAFC" }}
              >
                <button
                  onClick={dec}
                  className="flex items-center justify-center font-bold"
                  style={{ width: "30px", height: "100%", background: "none", border: "none", color: "#64748B", fontSize: "16px", cursor: "pointer", transition: "color 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#1B5CB5"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
                >
                  −
                </button>
                <span
                  className="font-bold text-center"
                  style={{ minWidth: "26px", fontSize: "13px", color: "#0F172A", borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {qty}
                </span>
                <button
                  onClick={inc}
                  className="flex items-center justify-center font-bold"
                  style={{ width: "30px", height: "100%", background: "none", border: "none", color: "#64748B", fontSize: "16px", cursor: "pointer", transition: "color 0.1s" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#1B5CB5"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#64748B"}
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-1.5 font-semibold rounded-xl"
                style={{
                  backgroundColor: added ? "#059669" : "#1240A0",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12.5px",
                  height: "36px",
                  transition: "background-color 0.25s, transform 0.15s",
                }}
                onMouseEnter={e => {
                  if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1B5CB5";
                }}
                onMouseLeave={e => {
                  if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1240A0";
                }}
              >
                {added ? (
                  <><CheckCircle2 size={13} /> Added!</>
                ) : (
                  <><ShoppingCart size={13} /> Add to Cart</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
