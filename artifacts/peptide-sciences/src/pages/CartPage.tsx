import { Link } from "wouter";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Trash2, Plus, Minus, ShoppingCart, ChevronRight, FlaskConical } from "lucide-react";

export default function CartPage() {
  const { items, totalItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { formatPrice, currency } = useCurrency();

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
                className="rounded-2xl overflow-hidden flex gap-4 items-center"
                style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 8px rgba(15,23,42,0.04)", padding: "14px 16px" }}
              >
                {/* Image */}
                <Link href={`/product/${product.id}`} style={{ textDecoration: "none", flexShrink: 0 }}>
                  <div
                    className="rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ width: "80px", height: "80px", backgroundColor: "#F8FAFC", border: "1px solid #E8EDF5" }}
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
                    <p className="font-bold leading-tight hover:underline" style={{ fontSize: "14px", color: "#0F172A" }}>
                      {product.name}
                    </p>
                  </Link>
                  <p style={{ fontSize: "12px", color: "#64748B", marginTop: "2px" }}>{product.category}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "#EEF4FF", color: "#1B5CB5", border: "1px solid #BFDBFE" }}
                    >
                      98%+ HPLC
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}
                    >
                      ✓ In Stock
                    </span>
                  </div>
                </div>

                {/* Quantity stepper */}
                <div className="flex items-center gap-3 flex-shrink-0">
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
                      Free shipping on orders over {currency.symbol}200. Cold-chain packaging included.
                    </p>
                  </div>
                </div>

                <button
                  className="w-full rounded-xl font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 mb-3"
                  style={{ height: "48px", background: "linear-gradient(135deg, #1B5CB5 0%, #1240A0 100%)", color: "#fff", border: "none", cursor: "pointer", fontSize: "14px" }}
                >
                  <ShoppingCart size={16} />
                  Proceed to Checkout
                </button>

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
                  {["Secure Checkout", "Lab Certified", "98%+ Purity"].map((b) => (
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
