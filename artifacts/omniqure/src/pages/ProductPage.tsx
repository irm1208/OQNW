import { useState, useEffect, useRef } from "react";
import { trackViewContent } from "@/lib/pixels";
import { Link, useParams, useLocation } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { isHiddenCategory } from "@/data/products";
import { ShoppingCart, Package, Thermometer, FlaskConical, Shield, Truck, Minus, Plus, ChevronRight, Download, Loader2, Heart, Droplets, Gift, Sparkles } from "lucide-react";
import { generateCOA } from "@/utils/generateCOA";
import COADocument from "@/components/COADocument";
import COAModal from "@/components/COAModal";
import { janoshikData } from "@/data/janoshikData";
import JanoshikReportModal from "@/components/JanoshikReportModal";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getPurity, getPurityStr, getLotNumber } from "@/utils/productPurity";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import ProductInfoAccordion from "@/components/ProductInfoAccordion";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSEO, SITE_URL } from "@/hooks/useSEO";

const BASE_URL = import.meta.env.BASE_URL ?? "/";
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

function parseBaseName(name: string): { base: string; strength: string } {
  const match = name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g)(?:\s+\(.*?\))?)$/i);
  if (match) return { base: match[1].trim(), strength: match[2].trim() };
  return { base: name, strength: "" };
}

const VOLUME_TIERS = [
  { min: 3,  label: "Free BAC water" },
  { min: 5,  label: "1 peptide free" },
  { min: 10, label: "2 peptides free" },
];

function VolumePricingTable({
  totalCartItems,
  formatPrice,
}: {
  totalCartItems: number;
  formatPrice: (n: number) => string;
}) {
  const nextTier = VOLUME_TIERS.find(t => totalCartItems < t.min);
  const toNext = nextTier ? nextTier.min - totalCartItems : 0;
  const activeTier = [...VOLUME_TIERS].reverse().find(t => totalCartItems >= t.min);

  return (
    <div
      className="rounded-2xl mb-4 overflow-hidden"
      style={{ border: "1px solid #DBEAFE", backgroundColor: "#F0F7FF" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-2.5"
        style={{ backgroundColor: "#EBF4FF", borderBottom: "1px solid #DBEAFE" }}
      >
        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1240A0" }}>
          Bundle & Save
        </span>
        {activeTier ? (
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full"
            style={{ backgroundColor: "#1240A0", color: "#fff" }}
          >
            {activeTier.label} active
          </span>
        ) : (
          <span className="text-xs" style={{ color: "#64748B" }}>
            Applies to your whole cart
          </span>
        )}
      </div>

      {/* Tier grid */}
      <div className="grid grid-cols-3" style={{ borderTop: "1px solid #DBEAFE" }}>
        {VOLUME_TIERS.map((tier) => {
          const isActive = activeTier?.min === tier.min;
          const isPast   = !!activeTier && activeTier.min > tier.min;
          return (
            <div
              key={tier.min}
              className="flex flex-col items-center py-3 px-1 text-center"
              style={{
                backgroundColor: isActive ? "#1240A0" : isPast ? "#E0EDFF" : "transparent",
                borderRight: "1px solid #DBEAFE",
                transition: "background-color 0.2s",
              }}
            >
              <span
                className="text-xs font-bold mb-0.5"
                style={{ color: isActive ? "#fff" : isPast ? "#1B5CB5" : "#64748B" }}
              >
                {tier.min}+ items
              </span>
              <span
                className="font-extrabold"
                style={{ fontSize: "14px", color: isActive ? "#fff" : isPast ? "#1B5CB5" : "#1240A0" }}
              >
                {tier.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress nudge */}
      {toNext > 0 && (
        <div
          className="px-4 py-2 text-xs flex items-center gap-1.5"
          style={{ borderTop: "1px solid #DBEAFE", color: "#1B5CB5" }}
        >
          <Gift size={12} />
          <span>
            Add <strong>{toNext} more item{toNext > 1 ? "s" : ""}</strong> to your cart for{" "}
            <strong>{nextTier!.label}</strong>
          </span>
        </div>
      )}
      {toNext === 0 && activeTier?.min === 10 && (
        <div
          className="px-4 py-2 text-xs flex items-center gap-1.5"
          style={{ borderTop: "1px solid #DBEAFE", color: "#059669" }}
        >
          <Sparkles size={12} />
          <span><strong>Maximum tier unlocked</strong> — 2 peptides free with your order</span>
        </div>
      )}
    </div>
  );
}

export default function ProductPage() {
  const { products, productDetails } = useProducts();
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const rawProduct = products.find((p) => p.id === params.id || p.slug === params.id);
  // Hidden categories (e.g. temporarily paused product lines) are not sold on the site,
  // even via a direct link — treat them the same as "not found".
  const product = rawProduct && !isHiddenCategory(rawProduct.category) ? rawProduct : undefined;
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showCOAModal, setShowCOAModal] = useState(false);
  const [showJanoshikModal, setShowJanoshikModal] = useState(false);
  const { addToCart, totalItems, peptideQty } = useCart();
  const { trackView } = useRecentlyViewed();
  const { customer } = useCustomerAuth();
  const { formatPrice } = useCurrency();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();

  // SEO — computed unconditionally (before any early return)
  const seoDetail = productDetails[product?.slug ?? ""];
  const seoDesc = seoDetail?.description
    ? `${seoDetail.description.slice(0, 140).split(". ")[0]}. ${product ? getPurityStr(product.id) : ""} verified purity. For research use only — OmniQure Peptide Research Institute.`
    : product
    ? `${product.name} — ${product.category} research peptide. ${getPurityStr(product.id)} verified purity. For research use only.`
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
    canonicalPath: product ? `/product/${product.slug}` : null,
    ogImage: product ? `${SITE_URL}${product.image}` : null,
    product: product ? {
      name: product.name,
      description: seoDesc ?? product.name,
      image: product.image,
      price: product.price,
      productId: product.slug,
      category: product.category,
      purity: getPurityStr(product.id),
      availability: seoAvailability as "InStock" | "OutOfStock" | "LimitedAvailability",
    } : null,
    breadcrumbs: product ? [
      { name: "Home", path: "/" },
      { name: "All Peptides", path: "/all-peptides" },
      { name: product.category, path: `/all-peptides?category=${encodeURIComponent(product.category)}` },
      { name: product.name, path: `/product/${product.slug}` },
    ] : null,
  });

  useEffect(() => {
    if (product) {
      trackViewContent({ id: product.id, name: product.name, price: product.price ?? null, category: product.category });
    }
  }, [product?.id]);

  // Back-in-stock alert state
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [params.id]);

  useEffect(() => {
    if (product) trackView(product.id);
  }, [product?.id]);

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

  const ctaRef = useRef<HTMLDivElement>(null);
  const [stickyVisible, setStickyVisible] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [product?.id]);

  // Bac Water add-on state
  const [bacWaterEnabled, setBacWaterEnabled] = useState(false);
  const [bacWaterSizeIdx, setBacWaterSizeIdx] = useState(0);
  const BAC_WATER_OPTIONS = [
    { id: "bw-3ml",  name: "Bacteriostatic Water 3ml",  slug: "bacteriostatic-water-3ml",  price: 4.99,  label: "3ml",  image: "/bac-water-3ml.webp",  category: "Accessories" },
    { id: "bw-10ml", name: "Bacteriostatic Water 10ml", slug: "bacteriostatic-water-10ml", price: 8.99,  label: "10ml", image: "/bac-water-10ml.webp", category: "Accessories" },
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

  const detail = productDetails[product.slug] ?? { id: product.id, description: "" };

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

      {/* Janoshik Report Modal */}
      {showJanoshikModal && (() => {
        const jd = janoshikData[product.id];
        return jd?.image && jd?.verifyUrl ? (
          <JanoshikReportModal
            taskNumber={jd.taskNumber ?? ""}
            verifyKey={jd.verifyKey ?? ""}
            verifyUrl={jd.verifyUrl}
            image={jd.image}
            productName={product.name}
            onClose={() => setShowJanoshikModal(false)}
          />
        ) : null;
      })()}


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

      {/* Research Use Only Disclaimer */}
      <div className="max-w-[1280px] mx-auto px-3 md:px-4 pt-4 md:pt-6">
        <div
          className="rounded-xl p-4"
          style={{ backgroundColor: "#FFF8F0", border: "1px solid #FED7AA" }}
        >
          <p className="text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: "#C2410C" }}>
            ⚠ Research Use Only Disclaimer
          </p>
          <p className="text-xs leading-relaxed" style={{ color: "#7C2D12" }}>
            The product described on this page is intended for in-vitro laboratory research use only. It is not a drug and has not been approved by the FDA or any other regulatory body. It is not intended to diagnose, treat, cure, or prevent any disease or condition. Only qualified researchers should purchase this product. You must be at least 18 years of age to purchase.
          </p>
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
                <span className="text-xs font-semibold" style={{ color: "#0F172A" }}>{getPurityStr(product.id)}</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E2E8F0" }}>
                  <div className="h-full rounded-full" style={{ width: `${getPurity(product.id)}%`, background: "linear-gradient(90deg, #1B5CB5, #2563EB)" }} />
                </div>
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
                  { icon: <Shield size={11} />, text: `${getPurityStr(product.id)} verified purity` },
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

              {/* COA — View Report */}
              <div
                className="flex items-center justify-between gap-3 px-4 py-3"
                style={{ backgroundColor: "#F0F5FF", borderTop: "1px solid #BFDBFE" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ width: "40px", height: "40px", backgroundColor: "#1B5CB5" }}
                  >
                    <Download size={16} color="#fff" />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#1240A0" }}>Certificate of Analysis</p>
                    <p className="text-xs" style={{ color: "#3B82F6" }}>Full QC report — Lot {getLotNumber(product.id)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {(() => {
                    const jd = janoshikData[product.id];
                    return jd?.image ? (
                      <button
                        onClick={() => setShowJanoshikModal(true)}
                        className="flex items-center gap-2 font-bold rounded-xl transition-opacity hover:opacity-90"
                        style={{ height: "38px", padding: "0 14px", backgroundColor: "#fff", color: "#1240A0", border: "1.5px solid #1240A0", cursor: "pointer", fontSize: "12px" }}
                      >
                        <img src="/janoshik/janoshik-logo.jpg" alt="Janoshik" style={{ height: "16px", width: "auto", borderRadius: "2px", display: "block" }} />
                        Report
                      </button>
                    ) : null;
                  })()}
                  <button
                    onClick={() => setShowCOAModal(true)}
                    className="coa-btn-touch flex items-center gap-2 font-bold rounded-xl transition-opacity hover:opacity-90"
                    style={{ height: "38px", padding: "0 16px", backgroundColor: "#1B5CB5", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px" }}
                  >
                    View Report →
                  </button>
                </div>
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

            {/* Title + live badges row */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h1 className="product-h1 font-bold leading-tight mb-1.5" style={{ fontSize: "28px", color: "#0F172A" }}>
                  {product.name}
                </h1>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0 pt-1">
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
                    ⚡ Only {product.stockLevel} left
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
            </div>

            {/* Purity / Form / Composition / Storage */}
            <ProductInfoAccordion detail={detail} productId={String(product.id)} />

            {/* Strength switcher */}
            {strengthVariants.length > 1 && (
              <div
                className="rounded-2xl p-4 mb-5"
                style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}
              >
                <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                  Select Strength
                </p>
                <div style={{ position: "relative" }}>
                  <select
                    value={product.id}
                    onChange={(e) => {
                      if (e.target.value !== product.id) navigate(`/product/${e.target.value}`);
                    }}
                    aria-label="Select strength"
                    style={{
                      width: "100%",
                      appearance: "none",
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      padding: "13px 44px 13px 16px",
                      borderRadius: "12px",
                      border: "1.5px solid #D6E0F0",
                      backgroundColor: "#F8FAFC",
                      color: "#0F172A",
                      fontSize: "14px",
                      fontWeight: 700,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      outline: "none",
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#1B5CB5";
                      e.currentTarget.style.boxShadow = "0 0 0 3px rgba(27,92,181,0.12)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "#D6E0F0";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    {strengthVariants.map((v) => {
                      const { strength } = parseBaseName(v.name);
                      return (
                        <option key={v.id} value={v.id}>
                          {strength}{v.price != null ? ` — ${formatPrice(v.price)}` : ""}
                        </option>
                      );
                    })}
                  </select>
                  <ChevronRight
                    size={18}
                    style={{
                      position: "absolute",
                      right: "14px",
                      top: "50%",
                      transform: "translateY(-50%) rotate(90deg)",
                      color: "#64748B",
                      pointerEvents: "none",
                    }}
                  />
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

            {/* Bundle & Save — buy more, save more (free-item tiers) */}
            <VolumePricingTable totalCartItems={peptideQty} formatPrice={formatPrice} />

            {/* Quantity + CTA */}
            <div
              ref={ctaRef}
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

                {/* Wishlist icon button */}
                {(() => {
                  const productIdInt = parseInt(String(product.id), 10);
                  const saved = inWishlist(productIdInt);
                  return (
                    <button
                      onClick={() => void toggleWishlist(productIdInt)}
                      title={saved ? "Saved to Wishlist" : "Save to Wishlist"}
                      className="flex items-center justify-center rounded-xl flex-shrink-0 transition-all"
                      style={{
                        width: "44px",
                        height: "44px",
                        cursor: "pointer",
                        backgroundColor: saved ? "#FEF2F2" : "#F8FAFC",
                        border: saved ? "1.5px solid #FECACA" : "1.5px solid #E2E8F0",
                        color: saved ? "#DC2626" : "#94A3B8",
                        transition: "all 0.15s",
                      }}
                    >
                      <Heart size={18} style={{ fill: saved ? "#DC2626" : "none", transition: "fill 0.15s" }} />
                    </button>
                  );
                })()}
              </div>
            </div>


            {/* ── Bac Water Add-on ──────────────────────────────── */}
            {product.stockLevel !== 0 && (
              <div
                className="rounded-2xl mb-3"
                style={{
                  position: "relative",
                  overflow: "visible",
                  marginTop: "14px",
                  border: bacWaterEnabled ? "1.5px solid #38BDF8" : "1.5px solid #BAE6FD",
                  background: bacWaterEnabled
                    ? "linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 60%)"
                    : "linear-gradient(135deg, #F5FBFF 0%, #FFFFFF 70%)",
                  boxShadow: bacWaterEnabled
                    ? "0 8px 24px rgba(14,165,233,0.18)"
                    : "0 2px 10px rgba(14,165,233,0.07)",
                  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
                }}
              >
                {/* decorative droplet glow */}
                <span style={{
                  position: "absolute", top: "-36px", right: "-24px",
                  width: "120px", height: "120px", borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(56,189,248,0.22), transparent 70%)",
                  pointerEvents: "none",
                }} />

                {/* Recommended ribbon */}
                <span style={{
                  position: "absolute", top: -11, left: "50%", transform: "translateX(-50%)",
                  fontSize: 9.5, fontWeight: 800, letterSpacing: "0.06em",
                  textTransform: "uppercase", color: "#0369A1", whiteSpace: "nowrap",
                  background: "#fff", border: "1px solid #BAE6FD",
                  borderRadius: 9999, padding: "3px 9px",
                  boxShadow: "0 1px 4px rgba(14,165,233,0.15)",
                }}>
                  Recommended
                </span>

                {/* Header row */}
                <button
                  onClick={() => setBacWaterEnabled((v) => !v)}
                  style={{
                    width: "100%", display: "flex", alignItems: "center",
                    gap: 12, padding: "14px 16px",
                    background: "none", border: "none", cursor: "pointer", textAlign: "left",
                    position: "relative",
                  }}
                >
                  {/* Checkbox */}
                  <span
                    style={{
                      width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                      border: bacWaterEnabled ? "2px solid #0EA5E9" : "2px solid #CBD5E1",
                      backgroundColor: bacWaterEnabled ? "#0EA5E9" : "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "border-color 0.15s, background-color 0.15s",
                    }}
                  >
                    {bacWaterEnabled && (
                      <svg width="12" height="9" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4L4 7L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>

                  {/* Droplet icon badge */}
                  <span style={{
                    width: 38, height: 38, borderRadius: 11, flexShrink: 0,
                    background: "linear-gradient(135deg, #0EA5E9, #38BDF8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(14,165,233,0.35)",
                  }}>
                    <Droplets size={19} color="#fff" strokeWidth={2.2} />
                  </span>

                  <div style={{ flex: 1, minWidth: 0, paddingRight: 70 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: "#0F172A", margin: 0, lineHeight: 1.2 }}>
                      Add Bacteriostatic Water
                    </p>
                    <p style={{ fontSize: 11.5, color: "#0369A1", margin: 0, marginTop: 2, fontWeight: 500 }}>
                      Essential for reconstituting your peptide
                    </p>
                  </div>

                  <span style={{
                    fontSize: 14, fontWeight: 800, color: "#fff", flexShrink: 0,
                    background: "linear-gradient(135deg, #0EA5E9, #0284C7)",
                    borderRadius: 9999, padding: "5px 12px",
                    boxShadow: "0 2px 8px rgba(14,165,233,0.3)",
                  }}>
                    +{formatPrice(BAC_WATER_OPTIONS[bacWaterSizeIdx].price)}
                  </span>
                </button>

                {/* Size picker — shown when enabled */}
                {bacWaterEnabled && (
                  <div
                    style={{
                      borderTop: "1px solid #BAE6FD",
                      padding: "12px 16px 14px",
                      position: "relative",
                    }}
                  >
                    <label style={{
                      display: "block",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#0369A1",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      marginBottom: 5,
                    }}>
                      Select Size
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={bacWaterSizeIdx}
                        onChange={(e) => setBacWaterSizeIdx(Number(e.target.value))}
                        style={{
                          width: "100%",
                          padding: "9px 34px 9px 12px",
                          borderRadius: 10,
                          border: "2px solid #0EA5E9",
                          backgroundColor: "#fff",
                          color: "#0369A1",
                          fontSize: 14,
                          fontWeight: 800,
                          fontFamily: "inherit",
                          appearance: "none",
                          WebkitAppearance: "none",
                          MozAppearance: "none",
                          cursor: "pointer",
                          outline: "none",
                          boxShadow: "0 2px 8px rgba(14,165,233,0.12)",
                        }}
                      >
                        {BAC_WATER_OPTIONS.map((opt, idx) => {
                          const isBest = idx === BAC_WATER_OPTIONS.length - 1;
                          return (
                            <option key={opt.id} value={idx}>
                              {opt.label} — {formatPrice(opt.price)}{isBest ? " (Best value)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      <svg
                        width="13" height="13" viewBox="0 0 24 24"
                        fill="none" stroke="#0EA5E9" strokeWidth="2.5"
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>
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




          </div>
        </div>

        {/* Description */}
        <div
          className="rounded-2xl overflow-hidden mb-6"
          style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}
        >
          <div style={{ borderBottom: "1px solid #F1F5F9", padding: "14px 24px" }}>
            <span className="text-sm font-semibold" style={{ color: "#1B5CB5" }}>Description</span>
          </div>
          <div className="p-6">
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
          </div>
        </div>



        {/* Recently Viewed */}
        <RecentlyViewed excludeId={product.id} />
      </div>

      {/* ── Sticky Add to Cart Bar ── */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        transform: stickyVisible ? "translateY(0)" : "translateY(110%)",
        transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
        background: "linear-gradient(135deg, #0D2565 0%, #1240A0 100%)",
        boxShadow: "0 -4px 24px rgba(15,23,42,0.25)",
        borderTop: "1px solid rgba(255,255,255,0.10)",
        fontFamily: "'Arimo', Arial, sans-serif",
      }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "10px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Thumbnail */}
          {product.image && (
            <div style={{ width: 38, height: 38, borderRadius: 8, overflow: "hidden", flexShrink: 0, border: "1px solid rgba(255,255,255,0.18)" }}>
              <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}

          {/* Name + price */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {product.name}
            </p>
            {product.price != null && (
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", margin: 0, marginTop: "1px" }}>
                {formatPrice(product.price)}
              </p>
            )}
          </div>

          {/* Qty controls */}
          <div style={{ display: "flex", alignItems: "center", borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.22)", flexShrink: 0 }}>
            <button
              onClick={decreaseQty}
              style={{ width: 32, height: 38, background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >−</button>
            <div style={{ width: 32, height: 38, background: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "13px", fontWeight: 700 }}>
              {quantity}
            </div>
            <button
              onClick={increaseQty}
              style={{ width: 32, height: 38, background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >+</button>
          </div>

          {/* ATC button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stockLevel === 0}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "0 18px", height: "38px", borderRadius: 10, border: "none", flexShrink: 0,
              background: product.stockLevel === 0 ? "rgba(255,255,255,0.15)" : added ? "#059669" : "#fff",
              color: product.stockLevel === 0 ? "rgba(255,255,255,0.4)" : added ? "#fff" : "#1240A0",
              fontSize: "13px", fontWeight: 700,
              cursor: product.stockLevel === 0 ? "not-allowed" : "pointer",
              transition: "background 0.25s, color 0.25s",
              whiteSpace: "nowrap",
            }}
          >
            <ShoppingCart size={14} />
            {product.stockLevel === 0 ? "Out of Stock" : added ? "✓ Added!" : "Add to Cart"}
          </button>
        </div>
      </div>

    </div>
  );
}
