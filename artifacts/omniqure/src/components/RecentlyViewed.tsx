import { Link } from "wouter";
import { Clock } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useCurrency } from "@/context/CurrencyContext";

interface RecentlyViewedProps {
  excludeId?: string;
}

export default function RecentlyViewed({ excludeId }: RecentlyViewedProps) {
  const { products } = useProducts();
  const { recentIds } = useRecentlyViewed();
  const { formatPrice } = useCurrency();

  const recentProducts = recentIds
    .filter((id) => id !== excludeId)
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)
    .slice(0, 8) as typeof products;

  if (recentProducts.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="flex items-center justify-center rounded-lg"
          style={{ width: "30px", height: "30px", backgroundColor: "#E8F2DE" }}
        >
          <Clock size={15} style={{ color: "#4E68C2" }} />
        </div>
        <h2 className="font-bold" style={{ fontSize: "18px", color: "#22252C" }}>
          Recently Viewed
        </h2>
      </div>

      <div
        className="flex gap-3 overflow-x-auto pb-2"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#CBD5E1 transparent" }}
      >
        {recentProducts.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            style={{ textDecoration: "none", flexShrink: 0 }}
          >
            <div
              className="rounded-2xl overflow-hidden bg-white flex flex-col transition-all duration-200 cursor-pointer"
              style={{
                width: "148px",
                border: "1.5px solid #D3D8E2",
                boxShadow: "0 1px 6px rgba(15,23,42,0.05)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#93B8F0";
                el.style.boxShadow = "0 8px 24px rgba(59, 98, 171,0.10)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "#D3D8E2";
                el.style.boxShadow = "0 1px 6px rgba(15,23,42,0.05)";
                el.style.transform = "translateY(0)";
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  height: "100px",
                  background: "linear-gradient(145deg, #F4F8FF 0%, #EBF2FF 100%)",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "contain", padding: "10px" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div className="px-3 py-2.5">
                <p
                  className="font-semibold leading-snug mb-1"
                  style={{ fontSize: "11.5px", color: "#22252C", lineHeight: 1.3 }}
                >
                  {product.name}
                </p>
                {product.price != null && (
                  <p className="font-bold" style={{ fontSize: "13px", color: "#4E68C2" }}>
                    {formatPrice(product.price)}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
