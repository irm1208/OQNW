import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

const BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  NEW: { bg: "#E7461E", text: "#fff" },
  "SOLD OUT": { bg: "#999", text: "#fff" },
  "SAVE 15%": { bg: "#006BB4", text: "#fff" },
  CAPSULES: { bg: "#E7461E", text: "#fff" },
  TOPICAL: { bg: "#E7461E", text: "#fff" },
};

const PS_LOGO_SVG = (
  <svg width="70" height="12" viewBox="0 0 70 12" fill="none">
    <text x="0" y="10" fontSize="8" fontWeight="600" fill="#E7461E" fontFamily="Arimo, Arial, sans-serif">
      PEPTIDE SCIENCES
    </text>
  </svg>
);

export default function ProductCard({ product }: ProductCardProps) {
  const badgeColor = product.badge ? BADGE_COLORS[product.badge] : null;

  return (
    <div
      className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow"
      style={{ minHeight: "380px" }}
    >
      {/* Product image area */}
      <div className="relative bg-white" style={{ padding: "8px 8px 0" }}>
        {/* Badge ribbon top-left */}
        {product.soldOut && (
          <div
            className="absolute top-2 left-2 z-10 px-2 py-0.5 text-xs font-semibold rounded-sm"
            style={{ backgroundColor: "#999", color: "#fff", fontSize: "10px" }}
          >
            Sold Out
          </div>
        )}
        {product.badge && !product.soldOut && (
          <div
            className="absolute top-2 right-2 z-10 px-2 py-0.5 text-xs font-semibold rounded-sm uppercase"
            style={{ backgroundColor: badgeColor?.bg, color: badgeColor?.text, fontSize: "10px" }}
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
            PEPTIDE SCIENCES
          </div>
          <div style={{ fontSize: "7px", color: "#666", textAlign: "right" }}>
            {product.badge === "CAPSULES" ? (
              <span className="uppercase" style={{ color: "#E7461E", fontWeight: 700 }}>CAPSULES</span>
            ) : product.badge === "TOPICAL" ? (
              <span className="uppercase" style={{ color: "#E7461E", fontWeight: 700 }}>TOPICAL</span>
            ) : null}
          </div>
        </div>

        <a href={`https://www.peptidesciences.com${product.slug}`} target="_blank" rel="noopener noreferrer">
          <img
            src={product.image}
            alt={product.name}
            className="w-full object-contain"
            style={{ height: "160px" }}
            onError={(e) => {
              const target = e.currentTarget;
              target.style.display = "none";
              const parent = target.parentElement;
              if (parent) {
                const placeholder = document.createElement("div");
                placeholder.style.cssText = "height:160px;display:flex;align-items:center;justify-content:center;background:#f9f9f9;";
                placeholder.innerHTML = `<span style="color:#ccc;font-size:12px">No Image</span>`;
                parent.appendChild(placeholder);
              }
            }}
          />
        </a>
      </div>

      {/* Product info */}
      <div className="flex flex-col flex-1 p-3 pt-2">
        <a
          href={`https://www.peptidesciences.com${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium leading-tight mb-3"
          style={{ fontSize: "13px", color: "#1979C3" }}
        >
          {product.name}
        </a>

        <div className="mt-auto space-y-2">
          {/* Learn More button */}
          <a
            href={`https://www.peptidesciences.com${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2 border font-medium transition-colors hover:bg-orange-50"
            style={{
              borderColor: "#E7461E",
              color: "#E7461E",
              fontSize: "13px",
              borderRadius: "4px",
            }}
          >
            Learn More
          </a>

          {/* Add to Cart / Sold Out */}
          {product.soldOut ? (
            <button
              className="w-full py-2 text-white text-center font-medium"
              style={{
                backgroundColor: "#999",
                fontSize: "13px",
                borderRadius: "4px",
                border: "none",
                cursor: "default",
              }}
            >
              SOLD OUT: Notify Me
            </button>
          ) : (
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
              Add to Cart{product.price != null ? ` - $${product.price.toFixed(2)}` : ""}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
