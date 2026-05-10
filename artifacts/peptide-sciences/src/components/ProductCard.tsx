import { Link } from "wouter";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

function parseName(name: string): { baseName: string; strength: string } {
  const match = name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g))(\s+.*)?$/i);
  if (match) {
    const suffix = match[3] ? match[3].trim() : "";
    return {
      baseName: match[1].trim(),
      strength: suffix ? `${match[2]} ${suffix}` : match[2],
    };
  }
  return { baseName: name, strength: "" };
}

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = `/product/${product.id}`;
  const { baseName, strength } = parseName(product.name);

  return (
    <div
      className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow"
      style={{ minHeight: "340px" }}
    >
      {/* Product image area */}
      <div className="relative bg-white" style={{ padding: "8px 8px 0" }}>
        {/* Header card strip */}
        <div
          className="flex items-center justify-center gap-2 px-2 py-1 mb-1 rounded-t-sm"
          style={{ backgroundColor: "#1B5CB5" }}
        >
          <div
            style={{
              fontSize: "11px",
              color: "#fff",
              fontFamily: "Arimo, Arial",
              fontWeight: 600,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {baseName}
          </div>
          {strength && (
            <div
              style={{
                fontSize: "10px",
                color: "#fff",
                fontFamily: "Arimo, Arial",
                fontWeight: 500,
                flexShrink: 0,
              }}
            >
              {strength}
            </div>
          )}
        </div>

        {/* Product image */}
        <Link href={productUrl}>
          <div
            className="w-full flex items-center justify-center cursor-pointer overflow-hidden"
            style={{ height: "240px", backgroundColor: "#fff" }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "contain", transform: "scale(1.08)", transition: "transform 0.2s ease" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1.08)")}
            />
          </div>
        </Link>
      </div>

      {/* Buttons */}
      <div className="flex flex-col p-3 mt-auto space-y-2">
        <Link
          href={productUrl}
          className="block w-full text-center py-2 border font-medium transition-colors hover:bg-blue-50"
          style={{
            borderColor: "#1B5CB5",
            color: "#1B5CB5",
            fontSize: "13px",
            borderRadius: "4px",
          }}
        >
          Learn More
        </Link>

        <button
          className="w-full py-2 text-white text-center font-medium hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "#1B5CB5",
            fontSize: "13px",
            borderRadius: "4px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
