import { Link } from "wouter";
import { Heart, ShoppingCart, X, Package } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useSEO } from "@/hooks/useSEO";
import { useCurrency } from "@/context/CurrencyContext";
import PageHero from "@/components/PageHero";

const INK = "#1D2948";
const GRAPHITE = "#4A5672";
const COBALT = "#4E68C2";
const HAIR = "1px solid rgba(11,18,32,0.09)";

export default function WishlistPage() {
  useSEO({ title: "My Wishlist", description: "Your saved research peptides from OmniQure.", canonicalPath: "/wishlist" });
  const { wishlistIds, toggle } = useWishlist();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();

  const saved = products.filter((p) => wishlistIds.has(parseInt(String(p.id), 10)));

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "60vh" }}>

      <PageHero image={{ key: "hdr-wishlist", alt: "Six OmniQure research vials" }}
        crumbs={[{ label: "My Account", href: "/account" }, { label: "Wishlist" }]}
        eyebrow="My Account"
        icon={Heart}
        title={
          <>
            My Wishlist
            {saved.length > 0 && (
              <span style={{ marginLeft: "12px", fontSize: "16px", fontWeight: 500, letterSpacing: 0, color: "var(--graphite)" }}>
                ({saved.length} item{saved.length !== 1 ? "s" : ""})
              </span>
            )}
          </>
        }
      >
        Your saved research peptides from OmniQure.
      </PageHero>

      <div className="w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-10 lg:py-14">

        {saved.length === 0 ? (
          /* Empty state */
          <div
            className="flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ backgroundColor: "#F2F0EB", border: HAIR, borderRadius: 16 }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ backgroundColor: "#F8F4EF" }}
            >
              <Heart size={18} style={{ color: COBALT }} aria-hidden="true" />
            </div>
            <h2 className="text-lg mb-2" style={{ color: INK, fontWeight: 600, letterSpacing: "-0.01em" }}>Your wishlist is empty</h2>
            <p className="text-sm mb-6 px-6 text-center" style={{ color: GRAPHITE }}>
              Save items you're interested in by clicking the heart on any product page.
            </p>
            <Link
              href="/all-peptides"
              className="inline-flex items-center gap-2 h-11 px-6 rounded-full text-[14px] font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: INK, textDecoration: "none" }}
            >
              <Package size={15} />
              Browse All Peptides
            </Link>
          </div>
        ) : (
          <div className="product-card-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 sm:gap-y-24">
            {saved.map((product) => {
              const productIdInt = parseInt(String(product.id), 10);
              const outOfStock = product.stockLevel === 0;

              return (
                <div
                  key={product.id}
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    backgroundColor: "#fff",
                    border: HAIR,
                    borderRadius: 16,
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
                      backgroundColor: "#fff", border: HAIR,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <X size={14} style={{ color: GRAPHITE }} />
                  </button>

                  {/* Product image */}
                  <Link href={`/product/${product.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div
                      className="flex items-center justify-center"
                      style={{ height: "180px", backgroundColor: "#F2F0EB", padding: "12px" }}
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
                    <p className="uppercase" style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: "0.1em", color: GRAPHITE }}>{product.category}</p>
                    <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                      <p
                        className="text-sm leading-snug"
                        style={{ color: INK, fontWeight: 600 }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = COBALT)}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = INK)}
                      >
                        {product.name}
                      </p>
                    </Link>

                    <p className="text-base" style={{ color: INK, fontWeight: 600 }}>
                      {product.price != null ? formatPrice(product.price) : "—"}
                    </p>

                    {/* Stock */}
                    <p
                      className="text-xs font-medium"
                      style={{
                        color: outOfStock
                          ? "#9C4A44"
                          : product.stockLevel !== undefined && product.stockLevel <= 10
                          ? "#85683A"
                          : "#4F6B52",
                      }}
                    >
                      {outOfStock
                        ? "Out of Stock"
                        : product.stockLevel !== undefined && product.stockLevel <= 10
                        ? "Low stock"
                        : "In Stock"}
                    </p>

                    <div className="flex gap-2 mt-auto pt-2">
                      <button
                        disabled={outOfStock}
                        onClick={() => addToCart(product, 1)}
                        className="wishlist-add-btn flex-1 flex items-center justify-center gap-1.5 rounded-full text-xs font-medium text-white transition-opacity hover:opacity-90"
                        style={{
                          height: "36px",
                          backgroundColor: outOfStock ? "#8D9BB8" : INK,
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
                        className="flex items-center justify-center rounded-full text-xs font-medium transition-colors hover:bg-[#F2F0EB]"
                        style={{
                          width: "36px", height: "36px", flexShrink: 0,
                          backgroundColor: "#fff", border: HAIR,
                          color: INK, textDecoration: "none",
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
