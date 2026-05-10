import { useState } from "react";
import { Link } from "wouter";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

const BLUE_VIAL_IDS = new Set(["17", "18", "22", "35"]);

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
        className="flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer h-full"
        style={{ border: "1px solid #E8EDF5", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "0 12px 32px rgba(27,92,181,0.15)";
          el.style.transform = "translateY(-3px)";
          el.style.borderColor = "#93B8F0";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
          el.style.transform = "translateY(0)";
          el.style.borderColor = "#E8EDF5";
        }}
      >
        {/* Image */}
        <div
          className="relative w-full overflow-hidden"
          style={{ height: "260px", backgroundColor: "#fff", boxShadow: "inset 0 -2px 8px rgba(0,0,0,0.04)" }}
        >
          <span
            className="absolute top-2.5 right-2.5 z-10 rounded-full font-bold"
            style={{ backgroundColor: "#EEF4FF", color: "#1B5CB5", fontSize: "10px", padding: "2px 8px", border: "1px solid #BFDBFE", letterSpacing: "0.03em" }}
          >
            99% HPLC
          </span>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }}
          />
          {BLUE_VIAL_IDS.has(product.id) && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(ellipse 42% 32% at 50% 66%, rgba(14,90,195,0.82) 0%, rgba(20,100,200,0.55) 38%, rgba(30,110,210,0.18) 65%, transparent 80%)",
                mixBlendMode: "multiply",
                pointerEvents: "none",
              }}
            />
          )}
        </div>

        <div style={{ height: "1px", backgroundColor: "#EEF4FF" }} />

        {/* Info */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
          <p style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", lineHeight: "1.3" }}>
            {baseName}
          </p>
          {strength && (
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#1B5CB5", marginTop: "3px" }}>
              {strength}
            </p>
          )}

          <div className="mt-auto pt-3 flex flex-col gap-2">
            {/* Learn More */}
            <div
              className="w-full text-center py-2 font-semibold rounded-xl transition-all hover:opacity-80"
              style={{ border: "1.5px solid #1B5CB5", color: "#1B5CB5", backgroundColor: "#fff", fontSize: "13px" }}
            >
              Learn More
            </div>

            {/* Quantity + Add to Cart row */}
            <div className="flex items-center gap-2">
              {/* Stepper */}
              <div
                className="flex items-center rounded-xl overflow-hidden flex-shrink-0"
                style={{ border: "1.5px solid #E2E8F0", height: "36px" }}
              >
                <button
                  onClick={dec}
                  className="flex items-center justify-center font-bold transition-colors hover:bg-blue-50"
                  style={{ width: "30px", height: "100%", background: "none", border: "none", color: "#1B5CB5", fontSize: "16px", cursor: "pointer" }}
                >
                  −
                </button>
                <span
                  className="font-bold text-center"
                  style={{ minWidth: "28px", fontSize: "13px", color: "#0F172A", borderLeft: "1px solid #E2E8F0", borderRight: "1px solid #E2E8F0", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  {qty}
                </span>
                <button
                  onClick={inc}
                  className="flex items-center justify-center font-bold transition-colors hover:bg-blue-50"
                  style={{ width: "30px", height: "100%", background: "none", border: "none", color: "#1B5CB5", fontSize: "16px", cursor: "pointer" }}
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 font-semibold rounded-xl transition-all"
                style={{
                  backgroundColor: added ? "#059669" : "#1B5CB5",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  height: "36px",
                  transition: "background-color 0.25s",
                }}
              >
                {added ? "✓ Added!" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
