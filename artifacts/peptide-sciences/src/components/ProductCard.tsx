import { Link } from "wouter";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  "SAVE 15%": { bg: "#006BB4", text: "#fff" },
};

export default function ProductCard({ product }: ProductCardProps) {
  const badgeColor = product.badge ? BADGE_COLORS[product.badge] : null;
  const productUrl = `/product/${product.id}`;

  return (
    <div
      className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow"
      style={{ minHeight: "320px" }}
    >
      {/* Product image area */}
      <div className="relative bg-white" style={{ padding: "8px 8px 0" }}>
        {/* Badge */}
        {product.badge && (
          <div
            className="absolute top-2 right-2 z-10 px-2 py-0.5 text-xs font-semibold rounded-sm uppercase"
            style={{
              backgroundColor: badgeColor?.bg,
              color: badgeColor?.text,
              fontSize: "10px",
            }}
          >
            {product.badge}
          </div>
        )}

        {/* Header card strip */}
        <div
          className="flex items-center justify-between px-2 py-1 mb-1 rounded-t-sm"
          style={{ backgroundColor: "#f5f5f5", border: "1px solid #e0e0e0" }}
        >
          <div style={{ fontSize: "8px", color: "#888", fontFamily: "Arimo, Arial" }}>
            OMNIQURE
          </div>
          <div style={{ fontSize: "7px" }}>
            {product.badge === "TOPICAL" && (
              <span style={{ color: "#E7461E", fontWeight: 700, textTransform: "uppercase" }}>
                TOPICAL
              </span>
            )}
          </div>
        </div>

        {/* Image placeholder */}
        <Link href={productUrl}>
          <div
            className="w-full flex items-center justify-center cursor-pointer"
            style={{ height: "160px", backgroundColor: "#f9f9f9", border: "1px dashed #ddd" }}
          />
        </Link>
      </div>

      {/* Buttons */}
      <div className="flex flex-col p-3 mt-auto space-y-2">
        <Link
          href={productUrl}
          className="block w-full text-center py-2 border font-medium transition-colors hover:bg-orange-50"
          style={{
            borderColor: "#E7461E",
            color: "#E7461E",
            fontSize: "13px",
            borderRadius: "4px",
          }}
        >
          Learn More
        </Link>

        <button
          className="w-full py-2 text-white text-center font-medium hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "#E7461E",
            fontSize: "13px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add to Cart
          {product.price != null ? ` — $${product.price.toFixed(2)}` : ""}
        </button>
      </div>
    </div>
  );
}
