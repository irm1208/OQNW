import { Link, useLocation } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Trash2, Plus, Minus, ShoppingCart, ChevronRight, FlaskConical, Sparkles, CheckCircle2, RefreshCw, CheckCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { type Product } from "@/data/products";
import { getPurityStr } from "@/utils/productPurity";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

interface RelatedApiItem {
  productId: number;
  productName: string;
  productCategory: string;
  coOccurrences: number;
}

function CartUpsellCard({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);
  const { addToCart, items } = useCart();
  const { formatPrice } = useCurrency();
  const alreadyInCart = items.some((i) => i.product.id === product.id);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
      <div
        className="rounded-xl bg-white flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-all duration-200"
        style={{ border: "1.5px solid #E8EDF5", boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#93B8F0";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 14px rgba(27,92,181,0.09)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#E8EDF5";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 4px rgba(15,23,42,0.04)";
        }}
      >
        <div
          className="rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ width: "48px", height: "48px", background: "linear-gradient(145deg, #F4F8FF 0%, #EBF2FF 100%)", border: "1px solid #E2E8F0" }}
        >
          <img
            src={product.image}
            alt={product.name}
            style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0"; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate" style={{ fontSize: "12px", color: "#0F172A", lineHeight: 1.3 }}>{product.name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span style={{ fontSize: "10px", color: "#059669", fontWeight: 600 }}>{getPurityStr(product.id)}</span>
            {product.price != null && (
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#1240A0" }}>{formatPrice(product.price)}</span>
            )}
          </div>
        </div>
        {alreadyInCart ? (
          <span className="flex items-center gap-1 text-xs font-semibold flex-shrink-0" style={{ color: "#059669" }}>
            <CheckCircle2 size={13} /> In cart
          </span>
        ) : (
          <button
            onClick={handleAdd}
            className="flex items-center gap-1 font-semibold rounded-lg flex-shrink-0 transition-all"
            style={{
              backgroundColor: added ? "#059669" : "#1240A0",
              color: "#fff", border: "none", cursor: "pointer",
              fontSize: "11px", padding: "5px 10px", height: "28px",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1B5CB5"; }}
            onMouseLeave={(e) => { if (!added) (e.currentTarget as HTMLElement).style.backgroundColor = "#1240A0"; }}
          >
            {added ? <><CheckCircle2 size={11} /> Added</> : <><ShoppingCart size={11} /> Add</>}
          </button>
        )}
      </div>
    </Link>
  );
}

function CartUpsells() {
  const { items } = useCart();
  const { products } = useProducts();
  const [suggestions, setSuggestions] = useState<Product[]>([]);

  useEffect(() => {
    if (items.length === 0) { setSuggestions([]); return; }

    const cartProductIds = new Set(items.map((i) => i.product.id));

    const fetchRelated = async () => {
      const allRelated: RelatedApiItem[] = [];
      const seen = new Set<number>();
      for (const { product } of items.slice(0, 3)) {
        const productIdInt = parseInt(product.id, 10);
        if (!productIdInt) continue;
        try {
          const res = await fetch(apiUrl(`products/${productIdInt}/related`), { credentials: "include" });
          if (res.ok) {
            const data = await res.json() as RelatedApiItem[];
            for (const item of data) {
              if (!seen.has(item.productId)) {
                seen.add(item.productId);
                allRelated.push(item);
              }
            }
          }
        } catch { /* skip */ }
      }

      const resolved = allRelated
        .sort((a, b) => b.coOccurrences - a.coOccurrences)
        .map((r) => products.find((p) => parseInt(p.id, 10) === r.productId))
        .filter((p): p is Product => !!p && !cartProductIds.has(p.id))
        .slice(0, 4);

      setSuggestions(resolved);
    };

    void fetchRelated();
  }, [items.map((i) => i.product.id).join(",")]);

  if (suggestions.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={14} style={{ color: "#1B5CB5" }} />
        <p className="font-bold" style={{ fontSize: "13px", color: "#0F172A" }}>Frequently bought with your cart</p>
      </div>
      <div className="space-y-2">
        {suggestions.map((p) => (
          <CartUpsellCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default function CartPage() {
  useSEO({ title: "My Cart", description: "Review your research peptide cart and proceed to checkout. OmniQure Peptide Research Institute.", canonicalPath: "/cart" });
  const [, navigate] = useLocation();
  const { items, totalItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();
  const { customer } = useCustomerAuth();
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  const [subscribeInterval, setSubscribeInterval] = useState(30);

  async function handleSubscribe() {
    if (!customer) { navigate("/sign-in"); return; }
    setSubscribing(true);
    try {
      const subItems = items
        .filter((i) => i.product.price != null)
        .map((i) => ({
          productId: parseInt(i.product.id, 10),
          productName: i.product.name,
          quantity: i.quantity,
          priceGbp: i.product.price ?? 0,
        }));
      const res = await fetch(apiUrl("subscriptions"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: subItems, intervalDays: subscribeInterval }),
      });
      if (res.ok) {
        setSubscribeSuccess(true);
        setTimeout(() => setSubscribeSuccess(false), 4000);
      }
    } catch {}
    setSubscribing(false);
  }

  if (items.length === 0) {
    return (
      <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "60vh" }}>
        <div className="max-w-[700px] mx-auto px-4 py-20 text-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "#EEF4FF" }}
          >
            <ShoppingCart size={36} style={{ color: "#1B5CB5" }} />
          </div>
          <h1 className="font-bold mb-3" style={{ fontSize: "24px", color: "#0F172A" }}>
            Your cart is empty
          </h1>
          <p className="mb-8" style={{ fontSize: "14px", color: "#64748B" }}>
            Browse our catalogue of 81 research-grade peptides.
          </p>
          <Link
            href="/all-peptides"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#1B5CB5", color: "#fff", fontSize: "14px", textDecoration: "none" }}
          >
            Browse All Peptides <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "70vh" }}>
      {/* Research warning */}
      <div style={{ backgroundColor: "#FFFBEB", borderBottom: "1px solid #FDE68A" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-2.5 flex items-start gap-2">
          <span style={{ fontSize: "14px", flexShrink: 0 }}>⚠️</span>
          <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
            <strong>Research Use Only:</strong> All products are for in-vitro laboratory research. Not for human or veterinary use. Must be 18+ to purchase.
          </p>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-3 md:px-4 py-6 md:py-10">
        <h1 className="font-bold mb-6" style={{ fontSize: "24px", color: "#0F172A" }}>
          My Cart
          <span className="ml-2 text-base font-normal" style={{ color: "#94A3B8" }}>
            ({totalItems} {totalItems === 1 ? "item" : "items"})
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Items list */}
          <div className="flex-1 min-w-0 space-y-3">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 8px rgba(15,23,42,0.04)", padding: "14px 16px" }}
              >
                {/* Top row: image + info */}
                <div className="flex gap-3 items-start">
                  {/* Image */}
                  <Link href={`/product/${product.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                    <div
                      className="rounded-xl overflow-hidden flex items-center justify-center"
                      style={{ width: "72px", height: "72px", backgroundColor: "#F8FAFC", border: "1px solid #E8EDF5" }}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: "6px" }}
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                      <p className="font-bold leading-tight hover:underline" style={{ fontSize: "13px", color: "#0F172A" }}>
                        {product.name}
                      </p>
                    </Link>
                    <p style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>{product.category}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "#EEF4FF", color: "#1B5CB5", border: "1px solid #BFDBFE" }}>
                        99%+ HPLC
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}>
                        ✓ In Stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom row: qty stepper + delete */}
                <div className="flex items-center gap-3 mt-3 flex-shrink-0">
                  <div
                    className="flex items-center rounded-xl overflow-hidden"
                    style={{ border: "1.5px solid #E2E8F0" }}
                  >
                    <button
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="flex items-center justify-center hover:bg-slate-50 transition-colors"
                      style={{ width: "34px", height: "36px", color: "#475569", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <Minus size={13} />
                    </button>
                    <div
                      className="flex items-center justify-center font-bold"
                      style={{ width: "40px", height: "36px", borderLeft: "1.5px solid #E2E8F0", borderRight: "1.5px solid #E2E8F0", color: "#0F172A", fontSize: "14px" }}
                    >
                      {quantity}
                    </div>
                    <button
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="flex items-center justify-center hover:bg-slate-50 transition-colors"
                      style={{ width: "34px", height: "36px", color: "#475569", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors"
                    style={{ width: "36px", height: "36px", color: "#EF4444", border: "1.5px solid #FEE2E2", background: "none", cursor: "pointer" }}
                    title="Remove"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}

            {/* Clear cart */}
            <div className="text-right pt-1">
              <button
                onClick={clearCart}
                className="text-sm hover:underline"
                style={{ color: "#94A3B8", background: "none", border: "none", cursor: "pointer" }}
              >
                Clear entire cart
              </button>
            </div>

            <CartUpsells />
          </div>

          {/* Order summary */}
          <div className="lg:w-[340px] flex-shrink-0">
            <div
              className="rounded-2xl overflow-hidden sticky top-36"
              style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 4px 24px rgba(15,23,42,0.06)" }}
            >
              <div
                className="px-5 py-4"
                style={{ background: "linear-gradient(90deg, #1240A0 0%, #1B5CB5 100%)", color: "#fff" }}
              >
                <p className="font-bold tracking-wide" style={{ fontSize: "14px" }}>Order Summary</p>
              </div>

              <div className="px-5 py-4 space-y-3">
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3">
                    <p className="leading-snug" style={{ fontSize: "12.5px", color: "#475569", flex: 1 }}>
                      {product.name} <span style={{ color: "#94A3B8" }}>× {quantity}</span>
                    </p>
                    <p className="font-medium" style={{ fontSize: "12.5px", color: "#0F172A", flexShrink: 0 }}>
                      {product.price != null ? formatPrice(product.price * quantity) : "—"}
                    </p>
                  </div>
                ))}
              </div>

              <div className="px-5 pb-2" style={{ borderTop: "1px solid #F1F5F9" }}>
                <div className="flex items-center justify-between py-3">
                  <p className="font-bold" style={{ fontSize: "14px", color: "#0F172A" }}>Total Items</p>
                  <p className="font-bold" style={{ fontSize: "14px", color: "#0F172A" }}>{totalItems}</p>
                </div>
                <div
                  className="rounded-xl p-3 mb-4"
                  style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}
                >
                  <div className="flex items-center gap-2">
                    <FlaskConical size={13} style={{ color: "#16A34A", flexShrink: 0 }} />
                    <p style={{ fontSize: "11.5px", color: "#166534", lineHeight: 1.5 }}>
                      Free shipping on orders over {currency.symbol}200. Discreet, secure packaging included.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full rounded-xl font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 mb-3"
                  style={{ height: "48px", background: "linear-gradient(135deg, #1B5CB5 0%, #1240A0 100%)", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px" }}
                >
                  <ShoppingCart size={16} />
                  Proceed to Checkout
                </button>

                {/* Subscribe & Save */}
                <div style={{ borderRadius: "12px", border: "1.5px solid #C7D7F7", backgroundColor: "#F0F5FF", padding: "12px 14px", marginBottom: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                    <RefreshCw size={13} style={{ color: "#1240A0" }} />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>Subscribe & Save 5%</span>
                  </div>
                  <p style={{ fontSize: "11.5px", color: "#475569", marginBottom: "10px", lineHeight: 1.5 }}>
                    Get this order delivered automatically at a 5% discount every:
                  </p>
                  <select
                    value={subscribeInterval}
                    onChange={(e) => setSubscribeInterval(parseInt(e.target.value, 10))}
                    style={{ width: "100%", height: "34px", borderRadius: "8px", border: "1.5px solid #C7D7F7", fontSize: "13px", color: "#0F172A", backgroundColor: "#fff", padding: "0 10px", marginBottom: "8px", cursor: "pointer" }}
                  >
                    <option value={7}>Weekly (every 7 days)</option>
                    <option value={14}>Fortnightly (every 14 days)</option>
                    <option value={30}>Monthly (every 30 days)</option>
                    <option value={60}>Every 2 months</option>
                    <option value={90}>Every 3 months</option>
                  </select>
                  <button
                    onClick={() => void handleSubscribe()}
                    disabled={subscribing || subscribeSuccess}
                    style={{
                      width: "100%", height: "34px", borderRadius: "8px", border: "none",
                      background: subscribeSuccess ? "linear-gradient(90deg, #16A34A, #15803D)" : "linear-gradient(90deg, #1240A0, #1B5CB5)",
                      color: "#fff", fontSize: "12.5px", fontWeight: 700, cursor: subscribing || subscribeSuccess ? "not-allowed" : "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    }}
                  >
                    {subscribeSuccess
                      ? <><CheckCheck size={13} /> Subscription created!</>
                      : subscribing
                        ? "Creating…"
                        : <><RefreshCw size={13} /> Subscribe & Save</>
                    }
                  </button>
                  {!customer && (
                    <p style={{ fontSize: "11px", color: "#64748B", marginTop: "6px", textAlign: "center" }}>Sign in to subscribe</p>
                  )}
                </div>

                <Link
                  href="/all-peptides"
                  className="w-full rounded-xl font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-80"
                  style={{ height: "40px", backgroundColor: "#F1F5F9", color: "#475569", textDecoration: "none", fontSize: "13px" }}
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="px-5 pb-5 mt-2">
                <div className="flex flex-wrap gap-2">
                  {["Secure Checkout", "Lab Certified", "99%+ Purity"].map((b) => (
                    <span
                      key={b}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "#F8FAFC", color: "#64748B", border: "1px solid #E2E8F0" }}
                    >
                      ✓ {b}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
