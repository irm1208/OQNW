import { Link } from "wouter";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const productUrl = `/product/${product.id}`;

  return (
    <div
      className="flex flex-col bg-white rounded-lg overflow-hidden transition-all duration-200"
      style={{
        minHeight: "360px",
        border: "1px solid #e2e8f0",
        boxShadow: "0 2px 8px rgba(27,92,181,0.07)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 28px rgba(27,92,181,0.18)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#1B5CB5";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(27,92,181,0.07)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
      }}
    >
      {/* Product image — full bleed, no header strip */}
      <Link href={productUrl} className="block cursor-pointer">
        <div
          className="w-full flex items-center justify-center overflow-hidden"
          style={{ height: "260px", backgroundColor: "#f8fafc" }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              padding: "12px",
            }}
          />
        </div>
      </Link>

      {/* Buttons */}
      <div className="flex flex-col px-3 pb-3 pt-2 mt-auto gap-2">
        <Link
          href={productUrl}
          className="block w-full text-center py-2 font-semibold transition-colors hover:bg-blue-50"
          style={{
            border: "1.5px solid #1B5CB5",
            color: "#1B5CB5",
            fontSize: "13px",
            borderRadius: "6px",
          }}
        >
          Learn More
        </Link>

        <button
          className="w-full py-2 text-white text-center font-semibold hover:opacity-90 transition-opacity"
          style={{
            backgroundColor: "#1B5CB5",
            fontSize: "13px",
            borderRadius: "6px",
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
