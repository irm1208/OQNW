import { Link } from "wouter";
import { Heart, ShoppingCart, X, Package } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useSEO } from "@/hooks/useSEO";
import { useCurrency } from "@/context/CurrencyContext";

export default function WishlistPage() {
  useSEO({ title: "My Wishlist", description: "Your saved research peptides from OmniQure Peptide Research Institute.", canonicalPath: "/wishlist" });
  const { wishlistIds, toggle } = useWishlist();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const saved = products.filter((p) => wishlistIds.has(parseInt(String(p.id), 10)));

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "60vh" }}>

      {/* Page header */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", padding: "36px 0 30px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "10%", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="max-w-[1280px] mx-auto px-3 md:px-4" style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>
            OmniQure · My Account
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "9px" }}>
            <Heart size={20} style={{ color: "#F87171", fill: "#F87171", flexShrink: 0 }} />
            <h1 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0 }}>
              My Wishlist
              {saved.length > 0 && (
                <span style={{ marginLeft: "10px", fontSize: "16px", fontWeight: 500, color: "rgba(255,255,255,0.45)" }}>
                  ({saved.length} item{saved.length !== 1 ? "s" : ""})
                </span>
              )}
            </h1>
          </div>
          <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65 }}>
            Your saved research peptides from OmniQure.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 py-8 md:py-10">

        {saved.length === 0 ? (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
              style={{ backgroundColor: "#FEF2F2" }}
            >
              <Heart size={28} style={{ color: "#FECACA" }} />
            </div>
            <h2 className="text-lg font-semibold mb-2" style={{ color: "#0F172A" }}>Your wishlist is empty</h2>
            <p className="text-sm mb-6" style={{ color: "#64748B" }}>
              Save items you're interested in by clicking the heart on any product page.
            </p>
            <Link
              href="/all-peptides"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#1B5CB5", textDecoration: "none" }}
            >
              <Package size={15} />
              Browse All Peptides
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 sm:gap-y-24">
            {saved.map((product) => {
              const productIdInt = parseInt(String(product.id), 10);
              const outOfStock = product.stockLevel === 0;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    backgroundColor: "#fff",
                    border: "1px solid #E8EDF5",
                    boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
                    position: "relative",
                  }}
                >
                  {/* Remove button */}
                  <button
                    onClick={() => void toggle(productIdInt)}
                    title="Remove from wishlist"
                    style={{
                      position: "absolute", top: "10px", right: "10px", zIndex: 10,
                      width: "30px", height: "30px", borderRadius: "50%",
                      backgroundColor: "rgba(255,255,255,0.92)", border: "1px solid #E2E8F0",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    }}
                  >
                    <X size={14} style={{ color: "#94A3B8" }} />
                  </button>

                  {/* Product image */}
                  <Link href={`/product/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div
                      className="flex items-center justify-center"
                      style={{ height: "180px", backgroundColor: "#F8FAFC", padding: "12px" }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.2"; }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-1 gap-2">
                    <p className="text-xs font-medium" style={{ color: "#94A3B8" }}>{product.category}</p>
                    <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                      <p
                        className="text-sm font-semibold leading-snug"
                        style={{ color: "#0F172A" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "#1B5CB5")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "#0F172A")}
                      >
                        {product.name}
                      </p>
                    </Link>

                    <p className="text-base font-bold" style={{ color: "#1240A0" }}>
                      {product.price != null ? formatPrice(product.price) : "—"}
                    </p>

                    {/* Stock */}
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: outOfStock
                          ? "#DC2626"
                          : product.stockLevel !== undefined && product.stockLevel <= 10
                          ? "#D97706"
                          : "#059669",
                      }}
                    >
                      {outOfStock
                        ? "Out of Stock"
                        : product.stockLevel !== undefined && product.stockLevel <= 10
                        ? `Low Stock (${product.stockLevel} left)`
                        : "In Stock"}
                    </p>

                    <div className="flex gap-2 mt-auto pt-2">
                      <button
                        disabled={outOfStock}
                        onClick={() => addToCart(product, 1)}
                        className="wishlist-add-btn flex-1 flex items-center justify-center gap-1.5 rounded-xl text-xs font-semibold text-white transition-opacity hover:opacity-90"
                        style={{
                          height: "36px",
                          backgroundColor: outOfStock ? "#94A3B8" : "#1B5CB5",
                          border: "none",
                          cursor: outOfStock ? "not-allowed" : "pointer",
                          whiteSpace: "nowrap",
                          minWidth: 0,
                        }}
                      >
                        <ShoppingCart size={13} />
                        {outOfStock ? "Out of Stock" : "Add to Cart"}
                      </button>
                      <Link
                        href={`/product/${product.id}`}
                        className="flex items-center justify-center rounded-xl text-xs font-semibold transition-colors"
                        style={{
                          width: "36px", height: "36px", flexShrink: 0,
                          backgroundColor: "#F1F5F9", border: "1px solid #E2E8F0",
                          color: "#475569", textDecoration: "none",
                        }}
                        title="View product"
                      >
                        →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
