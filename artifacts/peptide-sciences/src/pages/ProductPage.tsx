import { useState, useEffect, useCallback } from "react";
import { trackViewContent } from "@/lib/pixels";
import { Link, useParams } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { ShoppingCart, Package, Thermometer, FlaskConical, Shield, Truck, Minus, Plus, ChevronRight, Download, Star, Loader2, User, Heart, Droplets } from "lucide-react";
import { generateCOA } from "@/utils/generateCOA";
import HplcChart from "@/components/HplcChart";
import MsChart from "@/components/MsChart";
import COADocument from "@/components/COADocument";
import COAModal from "@/components/COAModal";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getPurity, getPurityStr, getLotNumber } from "@/utils/productPurity";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import CustomersAlsoBought from "@/components/CustomersAlsoBought";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSEO, SITE_URL } from "@/hooks/useSEO";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

type ReviewItem = {
  id: number;
  customerId: number;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

type ReviewsData = {
  reviews: ReviewItem[];
  summary: { avgRating: number | null; totalCount: number; breakdown: Record<number, number> };
  myReview: { id: number; rating: number; title: string; body: string; isApproved: boolean } | null;
  hasPurchased: boolean;
};

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <span style={{ display: "inline-flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          style={{
            color: s <= rating ? "#F59E0B" : "#E2E8F0",
            fill: s <= rating ? "#F59E0B" : "#E2E8F0",
            flexShrink: 0,
          }}
        />
      ))}
    </span>
  );
}

function parseBaseName(name: string): { base: string; strength: string } {
  const match = name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g)(?:\s+\(.*?\))?)$/i);
  if (match) return { base: match[1].trim(), strength: match[2].trim() };
  return { base: name, strength: "" };
}

export default function ProductPage() {
  const { products, productDetails } = useProducts();
  const params = useParams<{ id: string }>();
  const product = products.find((p) => p.id === params.id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [added, setAdded] = useState(false);
  const [showCOAModal, setShowCOAModal] = useState(false);
  const { addToCart, totalItems, bundleDiscountPct } = useCart();
  const { trackView } = useRecentlyViewed();
  const { customer } = useCustomerAuth();
  const { formatPrice } = useCurrency();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();

  // SEO — computed unconditionally (before any early return)
  const seoDetail = productDetails[product?.id ?? ""];
  const seoDesc = seoDetail?.description
    ? `${seoDetail.description.slice(0, 140).split(". ")[0]}. ${product ? getPurityStr(product.id) : ""} HPLC purity. For research use only — OmniQure Peptide Research Institute.`
    : product
    ? `${product.name} — ${product.category} research peptide. ${getPurityStr(product.id)} HPLC purity. For research use only.`
    : undefined;
  const seoAvailability = product?.stockLevel === 0
    ? "OutOfStock"
    : product?.stockLevel !== undefined && product.stockLevel <= 10
    ? "LimitedAvailability"
    : "InStock";
  useSEO({
    title: product?.name ?? null,
    description: seoDesc ?? null,
    ogType: "product",
    canonicalPath: product ? `/product/${product.id}` : null,
    ogImage: product ? `${SITE_URL}${product.image}` : null,
    product: product ? {
      name: product.name,
      description: seoDesc ?? product.name,
      image: product.image,
      price: product.price,
      productId: product.id,
      category: product.category,
      purity: getPurityStr(product.id),
      availability: seoAvailability as "InStock" | "OutOfStock" | "LimitedAvailability",
    } : null,
    breadcrumbs: product ? [
      { name: "Home", path: "/" },
      { name: "All Peptides", path: "/all-peptides" },
      { name: product.category, path: `/all-peptides?category=${encodeURIComponent(product.category)}` },
      { name: product.name, path: `/product/${product.id}` },
    ] : null,
  });

  useEffect(() => {
    if (product) {
      trackViewContent({ id: product.id, name: product.name, price: product.price ?? null, category: product.category });
    }
  }, [product?.id]);

  // Reviews state
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [writeRating, setWriteRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [writeTitle, setWriteTitle] = useState("");
  const [writeBody, setWriteBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Back-in-stock alert state
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  const fetchReviews = useCallback(async (productId: string) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(apiUrl(`products/${productId}/reviews`), { credentials: "include" });
      if (res.ok) setReviewsData(await res.json() as ReviewsData);
    } finally {
      setReviewsLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setActiveTab("description");
    setReviewsData(null);
    setSubmitSuccess(false);
  }, [params.id]);

  useEffect(() => {
    if (product) trackView(product.id);
  }, [product?.id]);

  useEffect(() => {
    if (activeTab === "reviews" && product && !reviewsData) {
      void fetchReviews(product.id);
    }
  }, [activeTab, product?.id]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || writeRating === 0) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch(apiUrl(`products/${product.id}/reviews`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ rating: writeRating, title: writeTitle.trim(), body: writeBody.trim() }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) { setSubmitError(data.error ?? "Failed to submit review"); return; }
      setSubmitSuccess(true);
      setWriteRating(0);
      setWriteTitle("");
      setWriteBody("");
      if (product) void fetchReviews(product.id);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product || !notifyEmail.includes("@")) return;
    setNotifySubmitting(true);
    setNotifyError(null);
    try {
      const res = await fetch(apiUrl(`products/${product.id}/stock-alert`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: notifyEmail,
          name: customer ? `${customer.firstName} ${customer.lastName}` : undefined,
          productName: product.name,
        }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        setNotifyError(d.error ?? "Could not save your alert.");
      } else {
        setNotifySuccess(true);
      }
    } catch {
      setNotifyError("Something went wrong. Please try again.");
    } finally {
      setNotifySubmitting(false);
    }
  };

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  // Bac Water add-on state
  const [bacWaterEnabled, setBacWaterEnabled] = useState(false);
  const [bacWaterSizeIdx, setBacWaterSizeIdx] = useState(0);
  const BAC_WATER_OPTIONS = [
    { id: "bw-3ml",  name: "Bacteriostatic Water 3ml",  slug: "bacteriostatic-water-3ml",  price: 4.99,  label: "3ml",  image: "/bac-water-3ml.png",  category: "Accessories" },
    { id: "bw-10ml", name: "Bacteriostatic Water 10ml", slug: "bacteriostatic-water-10ml", price: 8.99,  label: "10ml", image: "/bac-water-10ml.png", category: "Accessories" },
  ] as const;

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    if (bacWaterEnabled) {
      const bw = BAC_WATER_OPTIONS[bacWaterSizeIdx];
      addToCart({ id: bw.id, name: bw.name, slug: bw.slug, price: bw.price, image: bw.image, category: bw.category }, 1);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#0F172A" }}>Product Not Found</h1>
        <Link href="/all-peptides" className="hover:underline" style={{ color: "#1B5CB5" }}>
          ← Back to All Peptides
        </Link>
      </div>
    );
  }

  const detail = productDetails[product.id] ?? { id: product.id, description: "" };

  const { base: currentBase, strength: currentStrength } = parseBaseName(product.name);
  const strengthVariants = currentStrength
    ? products
        .filter((p) => {
          const { base } = parseBaseName(p.name);
          return base === currentBase;
        })
        .sort((a, b) => {
          const aNum = parseFloat(parseBaseName(a.name).strength) || 0;
          const bNum = parseFloat(parseBaseName(b.name).strength) || 0;
          return aNum - bNum;
        })
    : [];

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id && parseBaseName(p.name).base !== currentBase)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .slice(0, 4);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC" }}>
      {/* COA Report Modal */}
      {showCOAModal && (
        <COAModal
          product={product}
          filteredProducts={[product]}
          onClose={() => setShowCOAModal(false)}
        />
      )}

      {/* Research warning */}
      <div style={{ backgroundColor: "#FFFBEB", borderBottom: "1px solid #FDE68A" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-2.5 flex items-start gap-2">
          <span style={{ fontSize: "14px", flexShrink: 0, marginTop: "1px" }}>⚠️</span>
          <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
            <strong>Research Chemical Only:</strong> Intended strictly for in-vitro laboratory testing. Not approved by the FDA. Bodily introduction into humans or animals is strictly forbidden. Must be 18+ and a qualified researcher to purchase.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white" style={{ borderBottom: "1px solid #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-2.5 flex items-center gap-1.5 text-xs" style={{ color: "#94A3B8" }}>
          <Link href="/" className="hover:text-blue-600 transition-colors" style={{ color: "#1B5CB5", textDecoration: "none" }}>Home</Link>
          <ChevronRight size={12} />
          <Link href="/all-peptides" className="hover:text-blue-600 transition-colors" style={{ color: "#1B5CB5", textDecoration: "none" }}>All Peptides</Link>
          <ChevronRight size={12} />
          <Link href={`/all-peptides?category=${encodeURIComponent(product.category)}`} className="hover:text-blue-600 transition-colors" style={{ color: "#1B5CB5", textDecoration: "none" }}>
            {product.category}
          </Link>
          <ChevronRight size={12} />
          <span style={{ color: "#475569" }}>{product.name}</span>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Main product section */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-6 lg:gap-8 mb-8 md:mb-10">
          {/* Left: Product card panel */}
          <div className="md:w-[400px] lg:w-[460px] flex-shrink-0">
            <div
              className="rounded-2xl overflow-hidden"
              style={{ backgroundColor: "#fff", boxShadow: "0 4px 24px rgba(15,23,42,0.08)", border: "1px solid #E8EDF5" }}
            >
              {/* Label header */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ background: "linear-gradient(90deg, #1240A0 0%, #1B5CB5 100%)", color: "#fff" }}
              >
                <span className="font-bold tracking-widest text-xs" style={{ letterSpacing: "0.14em" }}>OMNIQURE</span>
                {detail.refNumber && (
                  <span className="text-xs opacity-75">REF {detail.refNumber}</span>
                )}
              </div>

              {/* Product name on label */}
              <div className="px-4 pt-3 pb-2.5" style={{ borderBottom: "1px solid #F1F5F9" }}>
                <p className="font-bold leading-tight" style={{ fontSize: "17px", color: "#0F172A" }}>
                  {product.name}
                </p>
              </div>

              {/* Specs */}
              {(detail.casNumber || detail.formula || detail.molecularWeight) && (
                <div className="px-4 py-2.5 space-y-1" style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFBFF" }}>
                  {detail.casNumber && (
                    <p className="text-xs" style={{ color: "#64748B" }}>
                      <span className="font-semibold text-slate-500">CAS:</span> {detail.casNumber}
                    </p>
                  )}
                  {detail.formula && (
                    <p className="text-xs" style={{ color: "#64748B" }}>
                      <span className="font-semibold text-slate-500">Formula:</span> {detail.formula}
                    </p>
                  )}
                  {detail.molecularWeight && (
                    <p className="text-xs" style={{ color: "#64748B" }}>
                      <span className="font-semibold text-slate-500">M.W.:</span> {detail.molecularWeight}
                    </p>
                  )}
                </div>
              )}

              {/* Purity bar */}
              <div className="px-4 py-3 flex items-center gap-2.5" style={{ borderBottom: "1px solid #F1F5F9" }}>
                <span className="text-xs font-bold" style={{ color: "#1B5CB5" }}>PURITY</span>
                <span className="text-xs font-semibold" style={{ color: "#0F172A" }}>{getPurityStr(product.id)} HPLC</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
                  <div className="h-full rounded-full" style={{ width: `${getPurity(product.id)}%`, background: "linear-gradient(90deg, #1B5CB5, #2563EB)" }} />
                </div>
              </div>

              {/* RUO */}
              <div className="px-4 py-2" style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FFF8F8" }}>
                <p className="text-xs font-medium" style={{ color: "#DC2626" }}>
                  RUO — Research Use Only. Not for human or veterinary diagnostic use.
                </p>
              </div>

              {/* Product image — scales with screen */}
              <div
                className="flex items-center justify-center"
                style={{ height: "clamp(200px, 40vw, 380px)", padding: "8px", backgroundColor: "#fff", position: "relative" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="object-contain"
                  style={{ width: "100%", height: "100%" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.2"; }}
                />
              </div>

              {/* Quality badges */}
              <div className="grid grid-cols-2 gap-px" style={{ backgroundColor: "#E8EDF5" }}>
                {[
                  { icon: <Shield size={11} />, text: `${getPurityStr(product.id)} HPLC Purity` },
                  { icon: <Package size={11} />, text: "Lab Certified" },
                  { icon: <FlaskConical size={11} />, text: "Lab Tested" },
                  { icon: <Thermometer size={11} />, text: "Lyophilized" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs"
                    style={{ backgroundColor: "#fff", color: "#475569" }}
                  >
                    <span style={{ color: "#1B5CB5" }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Info panel */}
          <div className="flex-1">
            {/* Category chip */}
            <Link
              href={`/?category=${encodeURIComponent(product.category)}`}
              className="inline-block text-xs px-3 py-1 rounded-full mb-3 font-medium transition-opacity hover:opacity-80"
              style={{ backgroundColor: "#EEF4FF", color: "#1B5CB5", border: "1px solid #BFDBFE", textDecoration: "none" }}
            >
              {product.category}
            </Link>

            <h1 className="product-h1 font-bold leading-tight mb-3" style={{ fontSize: "28px", color: "#0F172A" }}>
              {product.name}
            </h1>

            {/* Badges row */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              {product.stockLevel === 0 ? (
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA" }}
                >
                  ✗ Out of Stock
                </span>
              ) : product.stockLevel !== undefined && product.stockLevel <= 10 ? (
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A" }}
                >
                  ⚡ Low Stock — {product.stockLevel} left
                </span>
              ) : (
                <span
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}
                >
                  ✓ In Stock
                </span>
              )}
            </div>

            {/* Strength switcher */}
            {strengthVariants.length > 1 && (
              <div
                className="rounded-2xl p-4 mb-5"
                style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}
              >
                <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                  Select Strength
                </p>
                <div className="flex flex-wrap gap-2">
                  {strengthVariants.map((v) => {
                    const { strength } = parseBaseName(v.name);
                    const isCurrent = v.id === product.id;
                    return (
                      <Link
                        key={v.id}
                        href={`/product/${v.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "2px",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            border: isCurrent ? "2px solid #1B5CB5" : "1.5px solid #E2E8F0",
                            backgroundColor: isCurrent ? "#EEF4FF" : "#F8FAFC",
                            cursor: isCurrent ? "default" : "pointer",
                            transition: "border-color 0.15s, background-color 0.15s",
                            minWidth: "62px",
                            textAlign: "center",
                          }}
                          onMouseEnter={e => {
                            if (!isCurrent) {
                              (e.currentTarget as HTMLElement).style.borderColor = "#1B5CB5";
                              (e.currentTarget as HTMLElement).style.backgroundColor = "#F0F5FF";
                            }
                          }}
                          onMouseLeave={e => {
                            if (!isCurrent) {
                              (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0";
                              (e.currentTarget as HTMLElement).style.backgroundColor = "#F8FAFC";
                            }
                          }}
                        >
                          <span style={{
                            fontSize: "13px",
                            fontWeight: 700,
                            color: isCurrent ? "#1240A0" : "#374151",
                            lineHeight: 1.2,
                          }}>
                            {strength}
                          </span>
                          {v.price != null && (
                            <span style={{
                              fontSize: "11px",
                              fontWeight: 500,
                              color: isCurrent ? "#1B5CB5" : "#94A3B8",
                              lineHeight: 1,
                            }}>
                              {formatPrice(v.price)}
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Price */}
            {product.price != null && (
              <div className="mb-4">
                <p style={{ fontSize: "28px", fontWeight: 800, color: "#1240A0", lineHeight: 1 }}>
                  {formatPrice(product.price)}
                </p>
                <p style={{ fontSize: "11.5px", color: "#94A3B8", marginTop: "4px" }}>
                  Prices shown are indicative. Checkout in your selected currency.
                </p>
              </div>
            )}

            {/* Quantity + CTA */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}
            >
              <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "#94A3B8" }}>Quantity</p>
              <div className="product-cta-row flex items-center gap-3">
                <div
                  className="product-cta-qty flex items-center rounded-xl overflow-hidden"
                  style={{ border: "1.5px solid #E2E8F0" }}
                >
                  <button
                    onClick={decreaseQty}
                    className="flex items-center justify-center hover:bg-slate-50 transition-colors"
                    style={{ width: "40px", height: "44px", color: "#475569" }}
                  >
                    <Minus size={14} />
                  </button>
                  <div
                    className="flex items-center justify-center font-bold"
                    style={{ width: "48px", height: "44px", borderLeft: "1.5px solid #E2E8F0", borderRight: "1.5px solid #E2E8F0", color: "#0F172A", fontSize: "15px" }}
                  >
                    {quantity}
                  </div>
                  <button
                    onClick={increaseQty}
                    className="flex items-center justify-center hover:bg-slate-50 transition-colors"
                    style={{ width: "40px", height: "44px", color: "#475569" }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stockLevel === 0}
                  className="product-cta-btn flex-1 flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all hover:opacity-90"
                  style={{
                    background: product.stockLevel === 0
                      ? "#CBD5E1"
                      : added
                      ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                      : "linear-gradient(135deg, #1B5CB5 0%, #1240A0 100%)",
                    height: "44px",
                    fontSize: "14px",
                    border: "none",
                    cursor: product.stockLevel === 0 ? "not-allowed" : "pointer",
                    transition: "background 0.25s",
                  }}
                >
                  <ShoppingCart size={16} />
                  {product.stockLevel === 0 ? "Out of Stock" : added ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* ── Bac Water Add-on ──────────────────────────────── */}
            {product.stockLevel !== 0 && (
              <div
                className="rounded-xl mb-3"
                style={{
                  border: bacWaterEnabled ? "1.5px solid #38BDF8" : "1.5px solid #E0F2FE",
                  backgroundColor: bacWaterEnabled ? "#F0F9FF" : "#fff",
                  overflow: "hidden",
                  transition: "border-color 0.2s, background-color 0.2s",
                }}
              >
                {/* Header row */}
                <button
                  onClick={() => setBacWaterEnabled((v) => !v)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    gap: 10, padding: "12px 14px",
                    background: "none", border: "none", cursor: "pointer", textAlign: "left",
                  }}
                >
                  {/* Checkbox */}
                  <span
                    style={{
                      width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                      border: bacWaterEnabled ? "2px solid #0EA5E9" : "2px solid #CBD5E1",
                      backgroundColor: bacWaterEnabled ? "#0EA5E9" : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.15s, background-color 0.15s",
                    }}
                  >
                    {bacWaterEnabled && (
                      <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4L4 7L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>

                  <Droplets size={16} style={{ color: "#0EA5E9", flexShrink: 0 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: 0, lineHeight: 1.2 }}>
                      Add Bacteriostatic Water
                    </p>
                    <p style={{ fontSize: 11, color: "#64748B", margin: 0, marginTop: 1 }}>
                      Required for peptide reconstitution
                    </p>
                  </div>

                  <span style={{ fontSize: 13, fontWeight: 700, color: "#0EA5E9", flexShrink: 0 }}>
                    + {formatPrice(BAC_WATER_OPTIONS[bacWaterSizeIdx].price)}
                  </span>
                </button>

                {/* Size picker — shown when enabled */}
                {bacWaterEnabled && (
                  <div
                    style={{
                      borderTop: "1px solid #E0F2FE",
                      padding: "10px 14px 12px",
                      display: "flex", gap: 8,
                    }}
                  >
                    {BAC_WATER_OPTIONS.map((opt, idx) => (
                      <button
                        key={opt.id}
                        onClick={() => setBacWaterSizeIdx(idx)}
                        style={{
                          flex: 1,
                          padding: "8px 0",
                          borderRadius: 9,
                          border: bacWaterSizeIdx === idx ? "2px solid #0EA5E9" : "1.5px solid #BAE6FD",
                          backgroundColor: bacWaterSizeIdx === idx ? "#E0F2FE" : "#F0F9FF",
                          cursor: "pointer",
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                          transition: "border-color 0.15s, background-color 0.15s",
                        }}
                      >
                        <span style={{ fontSize: 14, fontWeight: 800, color: bacWaterSizeIdx === idx ? "#0369A1" : "#475569" }}>
                          {opt.label}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: bacWaterSizeIdx === idx ? "#0EA5E9" : "#94A3B8" }}>
                          {formatPrice(opt.price)}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bundle & Save nudge */}
            {product.stockLevel !== 0 && (
              <div
                className="rounded-xl px-4 py-3 mb-3 flex items-center gap-3"
                style={{
                  backgroundColor: bundleDiscountPct > 0 ? "#F0FDF4" : "#EEF4FF",
                  border: `1px solid ${bundleDiscountPct > 0 ? "#BBF7D0" : "#BFDBFE"}`,
                }}
              >
                {bundleDiscountPct >= 20 ? (
                  <p style={{ fontSize: "12px", color: "#059669", fontWeight: 600, margin: 0 }}>
                    ✓ Bundle & Save 20% active — maximum discount!
                  </p>
                ) : bundleDiscountPct === 15 ? (
                  <p style={{ fontSize: "12px", color: "#059669", fontWeight: 600, margin: 0 }}>
                    ✓ Bundle & Save 15% active · add {15 - totalItems} more for 20% off
                  </p>
                ) : bundleDiscountPct === 10 ? (
                  <p style={{ fontSize: "12px", color: "#059669", fontWeight: 600, margin: 0 }}>
                    ✓ Bundle & Save 10% active · add {11 - totalItems} more for 15% off
                  </p>
                ) : bundleDiscountPct === 5 ? (
                  <p style={{ fontSize: "12px", color: "#059669", fontWeight: 600, margin: 0 }}>
                    ✓ Bundle & Save 5% active · add {7 - totalItems} more for 10% off
                  </p>
                ) : (
                  <p style={{ fontSize: "12px", color: "#1240A0", fontWeight: 600, margin: 0 }}>
                    Buy 3+ peptides and save 5% · 7+ = 10% · 11+ = 15% · 15+ = 20% off
                  </p>
                )}
              </div>
            )}

            {/* Back-in-stock notify form */}
            {product.stockLevel === 0 && (
              <div
                className="rounded-2xl p-4 mb-3"
                style={{ backgroundColor: "#FFF8F8", border: "1px solid #FECACA" }}
              >
                {notifySuccess ? (
                  <div className="flex items-center gap-2">
                    <span style={{ color: "#059669", fontSize: "18px" }}>✓</span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "#0F172A" }}>We'll let you know</p>
                      <p className="text-xs" style={{ color: "#64748B" }}>We'll email you as soon as {product.name} is back in stock.</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#94A3B8" }}>Notify Me When Back in Stock</p>
                    <form onSubmit={(e) => { void handleNotifyMe(e); }} className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder={customer ? customer.email : "your@email.com"}
                        value={notifyEmail || (customer ? customer.email : "")}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="notify-input-touch flex-1 rounded-lg px-3 text-sm"
                        style={{ height: "38px", border: "1.5px solid #E2E8F0", outline: "none", color: "#0F172A" }}
                      />
                      <button
                        type="submit"
                        disabled={notifySubmitting}
                        className="notify-btn-touch rounded-lg px-4 text-sm font-semibold text-white"
                        style={{ height: "38px", background: "#0F172A", border: "none", cursor: notifySubmitting ? "wait" : "pointer", flexShrink: 0 }}
                      >
                        {notifySubmitting ? "..." : "Notify Me"}
                      </button>
                    </form>
                    {notifyError && <p className="text-xs mt-1.5" style={{ color: "#DC2626" }}>{notifyError}</p>}
                  </>
                )}
              </div>
            )}

            {/* Wishlist */}
            {(() => {
              const productIdInt = parseInt(String(product.id), 10);
              const saved = inWishlist(productIdInt);
              return (
                <button
                  onClick={() => void toggleWishlist(productIdInt)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl font-semibold mb-3"
                  style={{
                    height: "44px", fontSize: "14px", cursor: "pointer", transition: "all 0.15s",
                    backgroundColor: saved ? "#FEF2F2" : "#F8FAFC",
                    border: saved ? "1.5px solid #FECACA" : "1.5px solid #E2E8F0",
                    color: saved ? "#DC2626" : "#64748B",
                  }}
                >
                  <Heart size={15} style={{ fill: saved ? "#DC2626" : "none", transition: "fill 0.15s" }} />
                  {saved ? "Saved to Wishlist" : "Save to Wishlist"}
                </button>
              );
            })()}

            {/* COA — View Report */}
            <div
              className="rounded-2xl flex items-center justify-between gap-3 mb-5 px-4 py-3"
              style={{ backgroundColor: "#F0F5FF", border: "1.5px solid #BFDBFE" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ width: "36px", height: "36px", backgroundColor: "#1B5CB5" }}
                >
                  <Download size={16} color="#fff" />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: "#1240A0" }}>Certificate of Analysis</p>
                  <p className="text-xs" style={{ color: "#3B82F6" }}>Full HPLC · ESI-MS · QC report — Lot {getLotNumber(product.id)}</p>
                </div>
              </div>
              <button
                onClick={() => setShowCOAModal(true)}
                className="coa-btn-touch flex items-center gap-2 font-bold rounded-xl transition-opacity hover:opacity-90 flex-shrink-0"
                style={{ height: "36px", padding: "0 16px", backgroundColor: "#1B5CB5", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px" }}
              >
                View Report →
              </button>
            </div>

            {/* Specs table */}
            <div
              className="rounded-2xl overflow-hidden mb-5"
              style={{ border: "1px solid #E8EDF5", boxShadow: "0 1px 4px rgba(15,23,42,0.04)" }}
            >
              <table className="w-full text-sm">
                <tbody>
                  {detail.casNumber && (
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="py-2.5 px-4 text-xs font-semibold" style={{ color: "#64748B", backgroundColor: "#FAFBFF", width: "140px" }}>CAS Number</td>
                      <td className="py-2.5 px-4 text-xs" style={{ color: "#0F172A" }}>{detail.casNumber}</td>
                    </tr>
                  )}
                  {detail.formula && (
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="py-2.5 px-4 text-xs font-semibold" style={{ color: "#64748B", backgroundColor: "#FAFBFF" }}>Formula</td>
                      <td className="py-2.5 px-4 text-xs" style={{ color: "#0F172A" }}>{detail.formula}</td>
                    </tr>
                  )}
                  {detail.molecularWeight && (
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="py-2.5 px-4 text-xs font-semibold" style={{ color: "#64748B", backgroundColor: "#FAFBFF" }}>Mol. Weight</td>
                      <td className="py-2.5 px-4 text-xs" style={{ color: "#0F172A" }}>{detail.molecularWeight}</td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td className="py-2.5 px-4 text-xs font-semibold" style={{ color: "#64748B", backgroundColor: "#FAFBFF" }}>Purity</td>
                    <td className="py-2.5 px-4 text-xs font-bold" style={{ color: "#059669" }}>{getPurityStr(product.id)} HPLC</td>
                  </tr>
                  {detail.appearance && (
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="py-2.5 px-4 text-xs font-semibold" style={{ color: "#64748B", backgroundColor: "#FAFBFF" }}>Appearance</td>
                      <td className="py-2.5 px-4 text-xs" style={{ color: "#0F172A" }}>{detail.appearance}</td>
                    </tr>
                  )}
                  {detail.storage && (
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="py-2.5 px-4 text-xs font-semibold" style={{ color: "#64748B", backgroundColor: "#FAFBFF" }}>Storage</td>
                      <td className="py-2.5 px-4 text-xs" style={{ color: "#0F172A" }}>{detail.storage}</td>
                    </tr>
                  )}
                  {detail.solubility && (
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="py-2.5 px-4 text-xs font-semibold" style={{ color: "#64748B", backgroundColor: "#FAFBFF" }}>Solubility</td>
                      <td className="py-2.5 px-4 text-xs" style={{ color: "#0F172A" }}>{detail.solubility}</td>
                    </tr>
                  )}
                  {detail.halfLife && (
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td className="py-2.5 px-4 text-xs font-semibold" style={{ color: "#64748B", backgroundColor: "#FAFBFF" }}>Half-Life</td>
                      <td className="py-2.5 px-4 text-xs" style={{ color: "#0F172A" }}>{detail.halfLife}</td>
                    </tr>
                  )}
                  <tr>
                    <td className="py-2.5 px-4 text-xs font-semibold" style={{ color: "#64748B", backgroundColor: "#FAFBFF" }}>Availability</td>
                    <td
                      className="py-2.5 px-4 text-xs font-bold"
                      style={{
                        color: product.stockLevel === 0
                          ? "#DC2626"
                          : product.stockLevel !== undefined && product.stockLevel <= 10
                          ? "#D97706"
                          : "#059669",
                      }}
                    >
                      {product.stockLevel === 0
                        ? "Out of Stock"
                        : product.stockLevel !== undefined && product.stockLevel <= 10
                        ? `Low Stock (${product.stockLevel} left)`
                        : "In Stock"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Also known as */}
            {detail.alsoKnownAs && (
              <p className="text-xs mb-3" style={{ color: "#64748B" }}>
                <strong style={{ color: "#475569" }}>Also known as:</strong> {detail.alsoKnownAs}
              </p>
            )}

            {/* Research areas */}
            {detail.researchAreas && detail.researchAreas.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold mb-2 uppercase tracking-wider" style={{ color: "#94A3B8" }}>Research Areas</p>
                <div className="flex flex-wrap gap-1.5">
                  {detail.researchAreas.map((area) => (
                    <span
                      key={area}
                      className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: "#EEF4FF", color: "#1B5CB5", border: "1px solid #BFDBFE" }}
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs" style={{ color: "#94A3B8" }}>
              For research purposes only. Not for human or veterinary use. Must be 18+ to purchase.
            </p>
          </div>
        </div>

        {/* Description / COA / Reviews Tabs */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}
        >
          {/* Tab bar */}
          <div className="flex" style={{ borderBottom: "1px solid #F1F5F9" }}>
            {[
              { key: "description", label: "Description" },
              { key: "reviews", label: "Reviews" },
            ].map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "description" | "reviews")}
                  className="px-6 py-3.5 text-sm font-semibold transition-colors"
                  style={{
                    color: active ? "#1B5CB5" : "#64748B",
                    borderBottom: active ? "2px solid #1B5CB5" : "2px solid transparent",
                    marginBottom: "-1px",
                    backgroundColor: "transparent",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="p-6">
            {activeTab === "reviews" ? (
              <div style={{ maxWidth: "860px" }}>
                {reviewsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#1B5CB5" }} />
                  </div>
                ) : reviewsData ? (
                  <>
                    {/* Summary bar */}
                    {reviewsData.summary.totalCount > 0 && (
                      <div className="flex flex-col sm:flex-row gap-6 mb-8 p-5 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                        <div className="text-center flex flex-col items-center justify-center min-w-[100px]">
                          <span className="text-4xl font-bold" style={{ color: "#0F172A" }}>
                            {reviewsData.summary.avgRating?.toFixed(1)}
                          </span>
                          <StarRow rating={Math.round(reviewsData.summary.avgRating ?? 0)} size={16} />
                          <span className="text-xs mt-1" style={{ color: "#64748B" }}>
                            {reviewsData.summary.totalCount} review{reviewsData.summary.totalCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex-1 space-y-1.5">
                          {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviewsData.summary.breakdown[star] ?? 0;
                            const pct = reviewsData.summary.totalCount > 0 ? (count / reviewsData.summary.totalCount) * 100 : 0;
                            return (
                              <div key={star} className="flex items-center gap-2 text-xs" style={{ color: "#64748B" }}>
                                <span className="w-4 text-right">{star}</span>
                                <Star size={11} style={{ color: "#F59E0B", fill: "#F59E0B", flexShrink: 0 }} />
                                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
                                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "#F59E0B" }} />
                                </div>
                                <span className="w-6">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Write review form */}
                    {customer ? (
                      reviewsData.myReview ? (
                        <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: "#F0FDF4", border: "1px solid #BBF7D0" }}>
                          <p className="text-sm font-semibold mb-1" style={{ color: "#15803D" }}>Your review is submitted</p>
                          <p className="text-xs" style={{ color: "#166534" }}>
                            {reviewsData.myReview.isApproved === false
                              ? "Thank you! Your review is pending approval."
                              : "Your review is published."}
                          </p>
                        </div>
                      ) : reviewsData.hasPurchased ? (
                        <div className="mb-8 p-5 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                          <h3 className="font-semibold mb-3" style={{ fontSize: "14px", color: "#0F172A" }}>Write a Review</h3>
                          {submitSuccess ? (
                            <div className="p-3 rounded-lg text-sm font-medium" style={{ backgroundColor: "#F0FDF4", color: "#15803D" }}>
                              Thank you! Your review has been submitted and is pending approval.
                            </div>
                          ) : (
                            <form onSubmit={(e) => void handleSubmitReview(e)} className="space-y-3">
                              {/* Star picker */}
                              <div>
                                <label className="text-xs font-semibold block mb-1" style={{ color: "#374151" }}>Your Rating *</label>
                                <div className="flex gap-1">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                      key={s}
                                      type="button"
                                      onMouseEnter={() => setHoverRating(s)}
                                      onMouseLeave={() => setHoverRating(0)}
                                      onClick={() => setWriteRating(s)}
                                      style={{ background: "none", border: "none", padding: "2px", cursor: "pointer" }}
                                    >
                                      <Star
                                        size={24}
                                        style={{
                                          color: s <= (hoverRating || writeRating) ? "#F59E0B" : "#CBD5E1",
                                          fill: s <= (hoverRating || writeRating) ? "#F59E0B" : "#CBD5E1",
                                          transition: "color 0.1s, fill 0.1s",
                                        }}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <label className="text-xs font-semibold block mb-1" style={{ color: "#374151" }}>Title *</label>
                                <input
                                  type="text"
                                  required
                                  maxLength={120}
                                  value={writeTitle}
                                  onChange={(e) => setWriteTitle(e.target.value)}
                                  placeholder="Summarise your experience"
                                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                                  style={{ border: "1px solid #CBD5E1", backgroundColor: "#fff", color: "#0F172A" }}
                                />
                              </div>
                              <div>
                                <label className="text-xs font-semibold block mb-1" style={{ color: "#374151" }}>Review *</label>
                                <textarea
                                  required
                                  rows={4}
                                  maxLength={2000}
                                  value={writeBody}
                                  onChange={(e) => setWriteBody(e.target.value)}
                                  placeholder="Share your experience with this product"
                                  className="w-full px-3 py-2 rounded-lg text-sm outline-none resize-none"
                                  style={{ border: "1px solid #CBD5E1", backgroundColor: "#fff", color: "#0F172A" }}
                                />
                              </div>
                              {submitError && (
                                <p className="text-xs" style={{ color: "#DC2626" }}>{submitError}</p>
                              )}
                              <button
                                type="submit"
                                disabled={submitting || writeRating === 0}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-opacity"
                                style={{
                                  backgroundColor: "#1B5CB5",
                                  color: "#fff",
                                  opacity: submitting || writeRating === 0 ? 0.6 : 1,
                                  cursor: submitting || writeRating === 0 ? "not-allowed" : "pointer",
                                  border: "none",
                                }}
                              >
                                {submitting && <Loader2 size={14} className="animate-spin" />}
                                {submitting ? "Submitting..." : "Submit Review"}
                              </button>
                            </form>
                          )}
                        </div>
                      ) : (
                        <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                          <p className="text-sm" style={{ color: "#64748B" }}>Only verified purchasers can leave a review.</p>
                        </div>
                      )
                    ) : (
                      <div className="mb-6 p-4 rounded-xl" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                        <p className="text-sm" style={{ color: "#64748B" }}>
                          <a href="/account" style={{ color: "#1B5CB5", fontWeight: 600 }}>Sign in</a> to write a review. Only verified purchasers may review products.
                        </p>
                      </div>
                    )}

                    {/* Reviews list */}
                    {reviewsData.reviews.length === 0 ? (
                      <div className="text-center py-10" style={{ color: "#94A3B8" }}>
                        <Star size={32} className="mx-auto mb-3" style={{ color: "#E2E8F0", fill: "#E2E8F0" }} />
                        <p className="text-sm">No reviews yet. Be the first to review this product.</p>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {reviewsData.reviews.map((r) => (
                          <div key={r.id} className="pb-5" style={{ borderBottom: "1px solid #F1F5F9" }}>
                            <div className="flex items-start justify-between gap-4 mb-1.5">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "#EEF4FF" }}>
                                  <User size={14} style={{ color: "#1B5CB5" }} />
                                </div>
                                <span className="text-sm font-semibold" style={{ color: "#0F172A" }}>{r.customerName}</span>
                              </div>
                              <span className="text-xs" style={{ color: "#94A3B8", flexShrink: 0 }}>
                                {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                              </span>
                            </div>
                            <StarRow rating={r.rating} />
                            <p className="text-sm font-semibold mt-1.5 mb-0.5" style={{ color: "#0F172A" }}>{r.title}</p>
                            <p className="text-sm leading-relaxed" style={{ color: "#374151" }}>{r.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10" style={{ color: "#94A3B8" }}>
                    <p className="text-sm">Unable to load reviews.</p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ maxWidth: "860px" }}>
                <p className="leading-relaxed mb-5" style={{ fontSize: "14px", color: "#374151", lineHeight: "1.8" }}>
                  {detail.description}
                </p>

                {detail.longDescription && (
                  <div className="mb-5 leading-relaxed" style={{ fontSize: "14px", color: "#374151", lineHeight: "1.8" }}>
                    {detail.longDescription.split("\n\n").map((para, i) => {
                      const isHeader = para.length < 100 && !para.endsWith(".");
                      return isHeader ? (
                        <p key={i} className="mb-2 mt-5 first:mt-0" style={{ fontWeight: 700, color: "#0F172A", fontSize: "15px" }}>
                          {para}
                        </p>
                      ) : (
                        <p key={i} className="mb-4">{para}</p>
                      );
                    })}
                  </div>
                )}

                {detail.sequence && (
                  <div className="mb-5">
                    <h3 className="font-bold mb-2" style={{ fontSize: "14px", color: "#0F172A" }}>Peptide Sequence</h3>
                    <div
                      className="p-4 rounded-xl font-mono text-xs break-all"
                      style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", color: "#374151", lineHeight: "1.7" }}
                    >
                      {detail.sequence}
                    </div>
                  </div>
                )}

                <div
                  className="p-4 rounded-xl mt-4"
                  style={{ backgroundColor: "#FFFBEB", border: "1px solid #FDE68A" }}
                >
                  <p className="text-xs font-bold mb-1 uppercase tracking-wide" style={{ color: "#B45309" }}>
                    Educational Information Only
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
                    All articles and product information are for informational and educational purposes only. Products are furnished for in-vitro studies only. These products are not medicines or drugs and have not been approved by the FDA. Bodily introduction into humans or animals is strictly forbidden by law.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div
          className="rounded-2xl p-5 mb-8"
          style={{ backgroundColor: "#FFF8F0", border: "1px solid #FED7AA" }}
        >
          <p className="text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: "#C2410C" }}>
            ⚠ Research Use Only Disclaimer
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#7C2D12" }}>
            The product described on this page is intended for in-vitro laboratory research use only. It is not a drug and has not been approved by the FDA or any other regulatory body. It is not intended to diagnose, treat, cure, or prevent any disease or condition. Only qualified researchers should purchase this product. You must be at least 18 years of age to purchase.
          </p>
        </div>

        {/* Customers Also Bought */}
        <CustomersAlsoBought product={product} />

        {/* Recently Viewed */}
        <RecentlyViewed excludeId={product.id} />
      </div>
    </div>
  );
}
