import { Link } from "wouter";
import type { Product } from "@/data/products";

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

  return (
    <Link href={productUrl} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div
        className="flex flex-col bg-white rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer h-full"
        style={{ border: "1px solid #E8EDF5", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "0 12px 32px rgba(27,92,181,0.13)";
          el.style.transform = "translateY(-3px)";
          el.style.borderColor = "#93B8F0";
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
          el.style.transform = "translateY(0)";
          el.style.borderColor = "#E8EDF5";
        }}
      >
        {/* Image */}
        <div
          className="relative w-full flex items-center justify-center overflow-hidden"
          style={{ height: "210px", background: "linear-gradient(145deg, #F4F8FF 0%, #EBF2FF 100%)" }}
        >
          <span
            className="absolute top-2.5 right-2.5 rounded-full font-bold"
            style={{
              backgroundColor: "#EEF4FF",
              color: "#1B5CB5",
              fontSize: "10px",
              padding: "2px 8px",
              border: "1px solid #BFDBFE",
              letterSpacing: "0.03em",
            }}
          >
            99% HPLC
          </span>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "16px" }}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 px-4 pt-3 pb-4">
          <p style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A", lineHeight: "1.35" }}>
            {baseName}
          </p>
          {strength && (
            <p style={{ fontSize: "12px", fontWeight: 600, color: "#1B5CB5", marginTop: "3px" }}>
              {strength}
            </p>
          )}
          <div className="mt-auto pt-3">
            <div
              className="w-full text-center py-2 text-sm font-semibold rounded-xl transition-opacity"
              style={{ backgroundColor: "#1B5CB5", color: "#fff" }}
            >
              View Details
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
