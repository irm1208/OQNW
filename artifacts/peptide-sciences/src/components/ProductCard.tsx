import { Link } from "wouter";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = `/product/${product.id}`;

  return (
    <div
      className="flex flex-col bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow"
      style={{ minHeight: "320px" }}
    >
      {/* Product image area */}
      <div className="relative bg-white" style={{ padding: "8px 8px 0" }}>
        {/* Header card strip */}
        <div
          className="flex items-center px-2 py-1 mb-1 rounded-t-sm"
          style={{ backgroundColor: "#f5f5f5", border: "1px solid #e0e0e0" }}
        >
          <div style={{ fontSize: "8px", color: "#888", fontFamily: "Arimo, Arial" }}>
            OMNIQURE
          </div>
        </div>

        {/* Product image */}
        <Link href={productUrl}>
          <div
            className="w-full flex items-center justify-center cursor-pointer overflow-hidden"
            style={{ height: "160px", backgroundColor: "#f9f9f9" }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
