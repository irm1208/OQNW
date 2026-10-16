import { useState, useEffect } from "react";
import { trackViewContent } from "@/lib/pixels";
import { Link, useParams, useLocation } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { isHiddenCategory } from "@/data/products";
import { ShoppingCart, Package, Thermometer, FlaskConical, Shield, ShieldCheck, Truck, Minus, Plus, ChevronRight, Heart, Droplets, Gift, Sparkles, Check, ArrowUpRight, AlertTriangle } from "lucide-react";
import CatalogueCard from "@/components/CatalogueCard";
import { Container, Eyebrow, SectionTitle } from "@/components/home/HomeSections";
import { groupProducts } from "@/data/groupedProducts";
import { studioImageForProduct, studioFallback, STUDIO_BG } from "@/lib/studioImage";
import { janoshikDataBySlug } from "@/data/janoshikData";
import { resolveBacWaterProducts } from "@/data/bacWaterProducts";
import JanoshikReportModal from "@/components/JanoshikReportModal";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getLotNumber } from "@/utils/productPurity";
import { BUNDLE_FREE_BAC_THRESHOLD, BUNDLE_FREE_ONE_THRESHOLD, BUNDLE_FREE_TWO_THRESHOLD } from "@/context/CartContext";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSEO, SITE_URL } from "@/hooks/useSEO";
import { getProductSeoMetadata, getPublicProductPath } from "@workspace/api-client-react";
import { getVialImage, versionVialAsset } from "@/lib/catalogueImages";

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
  { min: 3,  range: "3–4", label: "Free 10ml BAC water ampule" },
  { min: 5,  range: "5–9", label: "1 peptide free" },
  { min: 10, range: "10+", label: "2 peptides free" },
];

function VolumePricingTable({
  totalCartItems,
}: {
  totalCartItems: number;
  formatPrice?: (n: number) => string;
}) {
  const nextTier = VOLUME_TIERS.find(t => totalCartItems < t.min);
  const toNext = nextTier ? nextTier.min - totalCartItems : 0;
  const activeTier = [...VOLUME_TIERS].reverse().find(t => totalCartItems >= t.min);

  return (
    <div>
      <p className="mb-3 uppercase" style={{ fontSize: 10.5, letterSpacing: "0.14em", color: "var(--graphite)" }}>
        Bundle &amp; save <span className="normal-case tracking-normal opacity-70">· applies to your whole cart</span>
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        {VOLUME_TIERS.map((tier) => {
          const isActive = activeTier?.min === tier.min;
          const isBest = tier.min === 10;
          return (
            <div
              key={tier.min}
              className="relative flex flex-col items-center rounded-[12px] border px-2 py-3 text-center transition-colors"
              style={{
                borderColor: isActive ? "var(--cobalt)" : "var(--hairline)",
                borderWidth: isActive ? 2 : 1,
                background: isActive ? "#F5F8FF" : "#fff",
              }}
            >
              {isBest && (
                <span className="absolute -top-2 rounded-full px-2 py-0.5 uppercase" style={{ fontSize: 8.5, letterSpacing: "0.08em", fontWeight: 600, background: "var(--cobalt)", color: "#fff" }}>
                  Best value
                </span>
              )}
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink)" }}>{tier.range} vials</span>
              <span className="mt-1" style={{ fontSize: 12, color: "#16A34A", lineHeight: 1.3 }}>{tier.label}</span>
            </div>
          );
        })}
      </div>
      {toNext > 0 && (
        <p className="mt-2.5 flex items-center gap-1.5" style={{ fontSize: 12, color: "var(--graphite)" }}>
          <Gift size={12} style={{ color: "var(--cobalt)" }} />
          Add <strong style={{ color: "var(--ink)" }}>{toNext} more item{toNext > 1 ? "s" : ""}</strong> to your cart for <strong style={{ color: "var(--ink)" }}>{nextTier!.label.toLowerCase()}</strong>
        </p>
      )}
      {toNext === 0 && activeTier?.min === 10 && (
        <p className="mt-2.5 flex items-center gap-1.5" style={{ fontSize: 12, color: "#16A34A" }}>
          <Sparkles size={12} /> Maximum tier unlocked: 2 peptides free with your order
        </p>
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
  const [showJanoshikModal, setShowJanoshikModal] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const { addToCart, totalItems, peptideQty } = useCart();
  const { trackView } = useRecentlyViewed();
  const { customer } = useCustomerAuth();
  const { formatPrice } = useCurrency();
  const { toggle: toggleWishlist, has: inWishlist } = useWishlist();
  // SEO — computed unconditionally (before any early return)
  const seoMetadata = getProductSeoMetadata({
    name: product?.name,
    category: product?.category,
    description: product?.description,
    purity: product?.purity,
    seoTitle: product?.seoTitle,
    seoDescription: product?.seoDescription,
  });
  const seoTitle = product ? seoMetadata.title : null;
  const seoDesc = product ? seoMetadata.description : null;
  const seoAvailability = product?.stockLevel === 0
    ? "OutOfStock"
    : product?.stockLevel !== undefined && product.stockLevel <= 10
    ? "LimitedAvailability"
    : "InStock";
  useSEO({
    title: seoTitle,
    description: seoDesc,
    ogType: "product",
    canonicalPath: product ? getPublicProductPath(product.slug) : null,
    ogImage: product ? `${SITE_URL}${product.image}` : null,
    product: product ? {
      name: product.name,
      description: seoDesc ?? product.name,
      image: product.image,
      price: product.price,
       currency: "GBP",
      productId: product.slug,
      category: product.category,
      purity: product.purity ?? "",
      availability: seoAvailability as "InStock" | "OutOfStock" | "LimitedAvailability",
    } : null,
    breadcrumbs: product ? [
      { name: "Home", path: "/" },
      { name: "All Peptides", path: "/all-peptides" },
      { name: product.category, path: `/all-peptides?category=${encodeURIComponent(product.category)}` },
      { name: product.name, path: getPublicProductPath(product.slug) },
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
    setImageIdx(0);
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


  // Bac Water add-on state
  const [bacWaterEnabled, setBacWaterEnabled] = useState(false);
  const [bacWaterSizeIdx, setBacWaterSizeIdx] = useState(0);
  const bacWaterOptions = resolveBacWaterProducts(products);
  const selectedBacWater = bacWaterOptions[bacWaterSizeIdx] ?? bacWaterOptions[0];

  const handleAddToCart = () => {
    if (!product || product.stockLevel === 0) return;
    addToCart(product, quantity);
    if (bacWaterEnabled && selectedBacWater) {
      addToCart(selectedBacWater, 1);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4" style={{ color: "#22252C" }}>Product Not Found</h1>
        <Link href="/all-peptides" className="hover:underline" style={{ color: "#4E68C2" }}>
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

  const jd = janoshikDataBySlug[product.slug];
  const hasReport = !!(jd?.taskNumber && jd.verifyUrl && jd.image);
  // Supplied vial renders take priority. Legacy numbered product images also
  // have a studio vial render, while the original URL remains the card image.
  const cardImage = product.image;
  const legacySourceImage = product.sourceImage ?? product.image;
  const legacyVialImage = versionVialAsset(studioImageForProduct(product.id, legacySourceImage)) ?? legacySourceImage;
  const vialImage = getVialImage(product.slug) ?? (
    legacyVialImage !== legacySourceImage ? legacyVialImage : undefined
  );
  const primaryImage = vialImage ?? cardImage;
  const gallery = [
    { src: primaryImage, fallback: cardImage, alt: `${product.name} research vial` },
    ...(primaryImage !== cardImage ? [{ src: cardImage, fallback: product.image, alt: `${product.name} label` }] : []),
    ...(hasReport ? [{ src: jd!.image!, fallback: jd!.image!, alt: `${product.name} lab report` }] : []),
  ];
  const activeImage = gallery[Math.min(imageIdx, gallery.length - 1)];
  const aliases = (detail.alsoKnownAs ?? "").split(",").map(s => s.trim()).filter(Boolean).slice(0, 3);
  const relatedGroups = groupProducts(
    products.filter(p => p.category === product.category && parseBaseName(p.name).base !== currentBase && !isHiddenCategory(p.category)),
  ).slice(0, 4);
  const specRows: [string, string | undefined, boolean?][] = [
    ["Compound", currentBase],
    ["Full name", aliases[0]],
    ["Sequence", detail.sequence],
    ["Molecular weight", detail.molecularWeight],
    ["Molecular formula", detail.formula],
    ["CAS number", detail.casNumber],
    ["Purity (HPLC)", product.purity ?? detail.purity],
    ...(hasReport && jd?.taskNumber ? [["Tested", `${jd.analysis} · #${jd.taskNumber}`, true] as [string, string, boolean]] : []),
    ["Form", detail.appearance],
    ["Solubility", detail.solubility],
    ["Storage", detail.storage],
  ];
  const specs = specRows.filter((r): r is [string, string, boolean?] => !!r[1]);
  const soldOut = product.stockLevel === 0;
  const lowStock = !soldOut && product.stockLevel !== undefined && product.stockLevel <= 10;
  const productIdInt = parseInt(String(product.id), 10);
  const saved = inWishlist(productIdInt);
  const hair = { borderColor: "var(--hairline)" } as const;

  return (
    <div className="bg-white">
      {showJanoshikModal && hasReport && (
        <JanoshikReportModal
          taskNumber={jd!.taskNumber ?? ""}
          verifyKey={jd!.verifyKey ?? ""}
          verifyUrl={jd!.verifyUrl!}
          image={jd!.image!}
          certificatePdf={jd!.certificatePdf}
          productName={product.name}
          onClose={() => setShowJanoshikModal(false)}
        />
      )}

      {/* Breadcrumb */}
      <div className="border-b" style={hair}>
        <Container className="flex items-center gap-1.5 py-3" >
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5" style={{ fontSize: 12.5, color: "var(--graphite)" }}>
            <Link href="/" className="hover:text-[var(--ink)]">Home</Link>
            <ChevronRight size={12} className="opacity-50" />
            <Link href="/all-peptides" className="hover:text-[var(--ink)]">Catalogue</Link>
            <ChevronRight size={12} className="opacity-50" />
            <span style={{ color: "var(--ink)" }}>{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* Main product section */}
      <section>
        <Container className="grid gap-10 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:py-16">
          {/* Gallery */}
          <div className="md:sticky md:top-24 md:self-start">
            <div className="relative aspect-square overflow-hidden rounded-[18px]" style={{ background: STUDIO_BG }}>
              <img
                key={activeImage.src}
                src={activeImage.src}
                onError={studioFallback(activeImage.fallback)}
                alt={activeImage.alt}
                className={`h-full w-full ${imageIdx === 0 ? "object-cover" : "object-contain p-6 bg-white"}`}
              />
              {(product.purity ?? detail.purity) && (
                <button
                  type="button"
                  onClick={() => hasReport && setShowJanoshikModal(true)}
                  className="absolute left-3 top-3 rounded-[8px] bg-white/90 px-2.5 py-1.5 text-left backdrop-blur"
                  style={{ cursor: hasReport ? "pointer" : "default" }}
                >
                  <span className="block uppercase" style={{ fontSize: 8.5, letterSpacing: "0.12em", color: "var(--graphite)" }}>
                    HPLC purity{hasReport ? " · view COA" : " (mfr spec)"}
                  </span>
                  <span className="block font-semibold" style={{ fontSize: 12.5, color: "var(--ink)" }}>{product.purity ?? detail.purity}</span>
                </button>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="mt-4 flex gap-3">
                {gallery.map((g, i) => (
                  <button
                    key={g.src}
                    type="button"
                    onClick={() => setImageIdx(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={i === imageIdx}
                    className="h-14 w-14 overflow-hidden rounded-[8px] border-2 transition-colors"
                    style={{ borderColor: i === imageIdx ? "var(--ink)" : "transparent", background: STUDIO_BG }}
                  >
                    <img src={g.src} onError={studioFallback(g.fallback)} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="min-w-0">
            <Eyebrow>{product.category}</Eyebrow>
            <h1 className="product-h1 font-bold" style={{ fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1, letterSpacing: "-0.03em", color: "var(--ink)" }}>
              {currentBase}
            </h1>
            {aliases.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {aliases.map(a => (
                  <span key={a} className="rounded-full border px-3 py-1" style={{ ...hair, fontSize: 12, color: "var(--graphite)" }}>{a}</span>
                ))}
              </div>
            )}
            <p className="mt-4 flex items-center gap-1.5 font-medium" style={{ fontSize: 13, color: soldOut ? "#DC2626" : lowStock ? "#D97706" : "#16A34A" }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
              {soldOut ? "Sold out" : lowStock ? "Low stock" : "In stock"}
            </p>
            <p className="mt-4" style={{ fontSize: 15, lineHeight: 1.6, color: "var(--graphite)" }}>
              Laboratory research material for analytical / in-vitro research use only.
            </p>

            <ul className="mt-6 space-y-3 border-t pt-5" style={hair}>
              {[
                { icon: <Truck size={16} />, text: "Same-day dispatch, Mon–Fri" },
                { icon: <FlaskConical size={16} />, text: hasReport && jd?.purity ? `${jd.purity.toFixed(2)}% HPLC purity, independently verified` : "Independently lab-tested, 99%+ HPLC purity" },
                { icon: <Shield size={16} />, text: "Discreet, tracked delivery" },
              ].map(r => (
                <li key={r.text} className="flex items-center gap-3" style={{ fontSize: 14, color: "var(--ink)" }}>
                  <span style={{ color: "var(--graphite)" }}>{r.icon}</span>{r.text}
                </li>
              ))}
            </ul>

            {currentStrength && (
              <div className="mt-6 border-t pt-5" style={hair}>
                <p className="font-semibold" style={{ fontSize: 18, color: "var(--ink)" }}>{currentStrength}</p>
                <p className="mt-0.5 uppercase" style={{ fontSize: 10.5, letterSpacing: "0.12em", color: "var(--graphite)" }}>Per vial</p>
              </div>
            )}

            {strengthVariants.length > 1 && (
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-5" style={hair}>
                <span className="font-medium" style={{ fontSize: 14, color: "var(--ink)" }}>Dosage</span>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Select strength">
                  {strengthVariants.map(v => {
                    const active = v.id === product.id;
                    return (
                      <button
                        key={v.id}
                        role="radio"
                        aria-checked={active}
                        onClick={() => { if (!active) navigate(`/product/${v.id}`); }}
                        className="rounded-[10px] border px-3.5 py-2 font-semibold transition-colors"
                        style={{
                          fontSize: 13,
                          borderColor: active ? "var(--ink)" : "var(--hairline)",
                          background: active ? "var(--ink)" : "#fff",
                          color: active ? "#fff" : "var(--ink)",
                        }}
                      >
                        {parseBaseName(v.name).strength}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + price */}
            <div className="mt-5 flex items-center justify-between gap-4 border-t pt-5" style={hair}>
              <span className="font-medium" style={{ fontSize: 14, color: "var(--graphite)" }}>Quantity</span>
              <div className="flex items-center gap-4">
                <div className="product-cta-qty flex items-center rounded-full border" style={hair}>
                  <button onClick={decreaseQty} aria-label="Decrease quantity" className="flex h-9 w-9 items-center justify-center" style={{ color: "var(--graphite)" }}><Minus size={13} /></button>
                  <span className="w-6 text-center font-medium" style={{ fontSize: 14, color: "var(--ink)" }} aria-live="polite">{quantity}</span>
                  <button onClick={increaseQty} aria-label="Increase quantity" className="flex h-9 w-9 items-center justify-center" style={{ color: "var(--graphite)" }}><Plus size={13} /></button>
                </div>
                {product.price != null && (
                  <span className="font-semibold" style={{ fontSize: 28, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                    {formatPrice(product.price * quantity)}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5">
              <VolumePricingTable totalCartItems={peptideQty} formatPrice={formatPrice} />
            </div>

            {/* Bac water add-on */}
            {!soldOut && selectedBacWater && (
              <div className="mt-4 rounded-[14px] border" style={{ borderColor: bacWaterEnabled ? "var(--cobalt)" : "var(--hairline)" }}>
                <button
                  type="button"
                  onClick={() => setBacWaterEnabled(v => !v)}
                  aria-pressed={bacWaterEnabled}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left"
                >
                  <span
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border-2"
                    style={{ borderColor: bacWaterEnabled ? "var(--cobalt)" : "#CBD5E1", background: bacWaterEnabled ? "var(--cobalt)" : "#fff" }}
                  >
                    {bacWaterEnabled && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4L4 7L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </span>
                  <Droplets size={17} style={{ color: "var(--cobalt)" }} />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium" style={{ fontSize: 14, color: "var(--ink)" }}>Add bacteriostatic water</span>
                    <span className="block" style={{ fontSize: 12, color: "var(--graphite)" }}>For reconstituting your peptide</span>
                  </span>
                  <span className="font-semibold" style={{ fontSize: 14, color: "var(--ink)" }}>+{formatPrice(selectedBacWater.price)}</span>
                </button>
                {bacWaterEnabled && bacWaterOptions.length > 1 && (
                  <div className="grid grid-cols-2 gap-2 border-t px-4 py-3" style={hair}>
                    {bacWaterOptions.map((opt, idx) => {
                      const sel = idx === bacWaterSizeIdx;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setBacWaterSizeIdx(idx)}
                          aria-pressed={sel}
                          className="rounded-[10px] border px-3 py-2 text-left"
                          style={{ borderColor: sel ? "var(--ink)" : "var(--hairline)" }}
                        >
                          <span className="block font-semibold" style={{ fontSize: 13, color: "var(--ink)" }}>{opt.label}</span>
                          <span className="block" style={{ fontSize: 11.5, color: "var(--graphite)" }}>{formatPrice(opt.price)}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 border-t pt-5" style={hair}>
              {[
                hasReport && jd?.purity ? `${jd.purity.toFixed(2)}% HPLC verified` : `${product.purity ?? detail.purity ?? "99%+"} HPLC verified`,
                hasReport ? "COA included" : "Lab tested",
                "Discreet, tracked delivery"
              ].map(t => (
                <li key={t} className="flex items-center gap-1.5" style={{ fontSize: 12.5, color: "var(--graphite)" }}>
                  <Check size={13} style={{ color: "#16A34A" }} />{t}
                </li>
              ))}
            </ul>

            {/* CTA row */}
            <div className="product-cta-row mt-4 flex gap-3">
              {hasReport && (
                <button
                  type="button"
                  onClick={() => setShowJanoshikModal(true)}
                  className="flex h-[54px] shrink-0 items-center gap-2 rounded-full border px-5 font-semibold hover:bg-[#F8F9FB]"
                  style={{ ...hair, fontSize: 14, color: "var(--ink)" }}
                >
                  <ShieldCheck size={16} style={{ color: "var(--cobalt)" }} /> View COA
                </button>
              )}
              <button
                onClick={handleAddToCart}
                disabled={soldOut}
                className="product-cta-btn flex h-[54px] flex-1 items-center justify-center gap-2 rounded-full font-semibold text-white transition-colors"
                style={{
                  fontSize: 15,
                  background: soldOut ? "#D1D5DB" : added ? "#16A34A" : "var(--ink)",
                  color: soldOut ? "#6B7280" : "#fff",
                  cursor: soldOut ? "not-allowed" : "pointer",
                }}
              >
                <ShoppingCart size={16} />
                {soldOut ? "Sold out" : added ? "Added to cart" : "Add to cart"}
              </button>
              <button
                onClick={() => void toggleWishlist(productIdInt)}
                aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
                aria-pressed={saved}
                className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border"
                style={{ borderColor: saved ? "#FECACA" : "var(--hairline)", color: saved ? "#DC2626" : "var(--graphite)" }}
              >
                <Heart size={18} style={{ fill: saved ? "#DC2626" : "none" }} />
              </button>
            </div>

            {/* Back-in-stock alert */}
            {soldOut && (
              <div className="mt-4 rounded-[14px] border p-4" style={hair}>
                {notifySuccess ? (
                  <p style={{ fontSize: 13.5, color: "var(--ink)" }}>We'll email you as soon as {product.name} is back in stock.</p>
                ) : (
                  <>
                    <p className="mb-2 uppercase" style={{ fontSize: 10.5, letterSpacing: "0.12em", color: "var(--graphite)" }}>Notify me when back in stock</p>
                    <form onSubmit={(e) => { void handleNotifyMe(e); }} className="flex gap-2">
                      <input
                        type="email"
                        required
                        aria-label="Email address"
                        placeholder={customer ? customer.email : "you@email.com"}
                        value={notifyEmail || (customer ? customer.email : "")}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="notify-input-touch h-10 flex-1 rounded-[10px] border px-3 outline-none focus:border-[var(--cobalt)]"
                        style={{ ...hair, fontSize: 14, color: "var(--ink)" }}
                      />
                      <button type="submit" disabled={notifySubmitting} className="notify-btn-touch h-10 rounded-[10px] px-4 font-semibold text-white" style={{ fontSize: 13.5, background: "var(--ink)" }}>
                        {notifySubmitting ? "…" : "Notify me"}
                      </button>
                    </form>
                    {notifyError && <p className="mt-1.5" style={{ fontSize: 12, color: "#DC2626" }}>{notifyError}</p>}
                  </>
                )}
              </div>
            )}

            {/* Guarantees */}
            <div className="mt-6 grid grid-cols-2 border-t" style={hair}>
              {[
                { icon: <ShieldCheck size={16} />, t: "99%+ purity", s: "independently verified" },
                { icon: <Truck size={16} />, t: "Same-day dispatch", s: "Mon–Fri" },
                { icon: <Package size={16} />, t: "Discreet packaging", s: "plain & unmarked" },
                { icon: <Thermometer size={16} />, t: "Lyophilised", s: "stable for storage" },
              ].map((g, i) => (
                <div key={g.t} className={`flex items-center gap-3 py-3 ${i % 2 ? "pl-4 border-l" : "pr-4"} ${i > 1 ? "border-t" : ""}`} style={hair}>
                  <span style={{ color: "var(--cobalt)" }}>{g.icon}</span>
                  <span>
                    <span className="block font-semibold" style={{ fontSize: 13, color: "var(--ink)" }}>{g.t}</span>
                    <span className="block" style={{ fontSize: 11.5, color: "var(--graphite)" }}>{g.s}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Specifications */}
      {specs.length > 0 && (
        <section className="border-t" style={{ ...hair, background: "rgba(78,104,194,0.08)", borderLeft: "4px solid #4E68C2" }}>
          <Container className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16 lg:py-20">
            <div>
              <Eyebrow>Analytical data</Eyebrow>
              <SectionTitle>Specifications,<br /><span style={{ color: "var(--cobalt)" }}>verified.</span></SectionTitle>
              <p className="mt-4 max-w-[320px]" style={{ fontSize: 14, lineHeight: 1.6, color: "var(--graphite)" }}>
                Specifications for this compound, independently verified before release.
              </p>
            </div>
            <div>
              <dl className="overflow-hidden rounded-[14px] border bg-white" style={hair}>
                {specs.map(([k, v, emphasis], i) => (
                  <div
                    key={k}
                    className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-4 px-5 py-3.5"
                    style={{
                      borderTop: i > 0 ? "1px solid var(--hairline)" : undefined,
                      background: emphasis ? "rgba(78,104,194,0.06)" : undefined,
                      boxShadow: emphasis ? "inset 3px 0 0 var(--cobalt)" : undefined,
                    }}
                  >
                    <dt className="uppercase" style={{ fontSize: 10.5, letterSpacing: "0.12em", color: emphasis ? "var(--cobalt)" : "var(--graphite)", fontWeight: emphasis ? 600 : undefined }}>{k}</dt>
                    <dd className="break-words" style={{ fontSize: 14, color: "var(--ink)", fontWeight: emphasis ? 600 : undefined }}>{v}</dd>
                  </div>
                ))}
              </dl>
              {hasReport && (
                <button
                  type="button"
                  onClick={() => setShowJanoshikModal(true)}
                  className="mt-4 inline-flex items-center gap-1.5 font-medium hover:text-[var(--cobalt)]"
                  style={{ fontSize: 12.5, color: "var(--graphite)", background: "none", border: 0, padding: 0, cursor: "pointer" }}
                >
                  <ShieldCheck size={13} style={{ color: "var(--cobalt)" }} />
                  View the full lab report
                </button>
              )}
            </div>
          </Container>
        </section>
      )}

      {/* About this peptide */}
      <section className="border-t" style={hair}>
        <Container className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16 lg:py-20">
          <div>
            <Eyebrow>About this peptide</Eyebrow>
            <SectionTitle>{currentBase}</SectionTitle>
            <p className="mt-2 font-medium" style={{ fontSize: 14, color: "var(--cobalt)" }}>Laboratory research material</p>
            <div className="mt-6 max-w-[640px]" style={{ fontSize: 15, lineHeight: 1.75, color: "var(--graphite)" }}>
              {detail.description && <p className="mb-5">{detail.description}</p>}
              {detail.longDescription?.split("\n\n").map((para, i) => {
                const isHeader = para.length < 100 && !para.endsWith(".");
                return isHeader ? (
                  <h3 key={i} className="mb-2 mt-7 font-semibold" style={{ fontSize: 16, color: "var(--ink)" }}>{para}</h3>
                ) : (
                  <p key={i} className="mb-4">{para}</p>
                );
              })}
            </div>
            <div className="mt-6 max-w-[640px] rounded-[14px] border bg-white p-5" style={{ ...hair, fontSize: 12.5, lineHeight: 1.65, color: "var(--graphite)" }}>
              Educational information only. Products are furnished for in-vitro studies only. They are not medicines or drugs and have not been approved by the FDA. Bodily introduction into humans or animals is strictly forbidden by law.
            </div>
          </div>
          <figure className="self-start overflow-hidden rounded-[18px] border bg-white lg:sticky lg:top-24" style={hair}>
            <div className="aspect-[4/5] overflow-hidden" style={{ background: STUDIO_BG }}>
              <img src={vialImage ?? cardImage} onError={studioFallback(cardImage)} alt={`${product.name} lyophilised vial`} loading="lazy" className="h-full w-full object-cover scale-[1.12]" />
            </div>
            <figcaption className="border-t px-4 py-3" style={hair}>
              <span className="block uppercase" style={{ fontSize: 9.5, letterSpacing: "0.12em", color: "var(--graphite)" }}>Research vial</span>
              <span className="block font-medium" style={{ fontSize: 13, color: "var(--ink)" }}>{product.name} lyophilised vial</span>
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* Related */}
      {relatedGroups.length > 0 && (
        <section className="border-t" style={hair}>
          <Container className="py-12 lg:py-20">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Related</Eyebrow>
                <SectionTitle>Related research materials.</SectionTitle>
              </div>
              <Link href={`/all-peptides?category=${encodeURIComponent(product.category)}`} className="inline-flex items-center gap-1.5 font-medium hover:text-[var(--cobalt)]" style={{ fontSize: 14, color: "var(--ink)" }}>
                Full catalogue <ArrowUpRight size={15} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {relatedGroups.map(g => <CatalogueCard key={g.baseName} group={g} />)}
            </div>
          </Container>
        </section>
      )}

      {/* Kit builder */}
      <section className="border-t" style={{ ...hair, background: "rgba(78,104,194,0.08)", borderLeft: "4px solid #4E68C2" }}>
        <Container className="flex flex-wrap items-center justify-between gap-6 py-10">
          <div className="flex items-start gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white" style={{ border: "1px solid var(--hairline)", color: "var(--cobalt)" }}>
              <Gift size={20} aria-hidden="true" />
            </span>
            <div>
              <Eyebrow>Bundle &amp; save</Eyebrow>
              <p className="font-bold tracking-tight" style={{ fontSize: 24, color: "var(--ink)", letterSpacing: "-0.015em" }}>
                Build your own kit.
              </p>
              <p className="mt-1.5 max-w-[560px]" style={{ fontSize: 14, lineHeight: 1.6, color: "var(--graphite)" }}>
                Add {BUNDLE_FREE_BAC_THRESHOLD} or more peptides and free items apply automatically at checkout. {BUNDLE_FREE_ONE_THRESHOLD} unlocks a free peptide, {BUNDLE_FREE_TWO_THRESHOLD} unlock two.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Link href="/all-peptides" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--ink)" }}>
              Start building <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
            <Link href="/bundle-and-save" className="inline-flex items-center rounded-full border bg-white px-5 py-3 text-[14px] font-medium transition-colors hover:bg-[#F4F6FA]" style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}>
              Browse catalogue
            </Link>
          </div>
        </Container>
      </section>

      {/* Research literature */}
      <section className="border-t" style={hair}>
        <Container className="grid gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16 lg:py-20">
          <div>
            <Eyebrow>External databases</Eyebrow>
            <SectionTitle>Research<br /><span style={{ color: "var(--cobalt)" }}>literature.</span></SectionTitle>
            <p className="mt-4 max-w-[320px]" style={{ fontSize: 14, lineHeight: 1.6, color: "var(--graphite)" }}>
              {currentBase} is indexed in public chemical and biomedical databases. Search those sources directly for primary literature and compound records.
            </p>
          </div>
          <div>
            <div className="rounded-[14px] border" style={hair}>
              {[
                { label: "PubChem", desc: "Chemical structure, identifiers and properties", href: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(currentBase)}` },
                { label: "PubMed", desc: "Peer-reviewed research mentioning this compound", href: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(currentBase)}` },
                ...(detail.casNumber ? [{ label: "CAS number", desc: `${detail.casNumber} — search this registry number`, href: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(detail.casNumber)}` }] : []),
              ].map((l, i, arr) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[#F2F0EB]"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : undefined }}>
                  <span>
                    <span className="block font-semibold" style={{ fontSize: 14.5, color: "var(--ink)" }}>{l.label}</span>
                    <span className="block" style={{ fontSize: 12.5, color: "var(--graphite)" }}>{l.desc}</span>
                  </span>
                  <ArrowUpRight size={16} className="shrink-0" style={{ color: "var(--cobalt)" }} aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="mt-4" style={{ fontSize: 11.5, lineHeight: 1.6, color: "var(--graphite)" }}>
              External database links are provided for research convenience only. OmniQure does not control and is not responsible for third-party content.
            </p>
          </div>
        </Container>
      </section>

      <Container className="pb-4">
        <RecentlyViewed excludeId={product.id} />
      </Container>

      {/* Research notice */}
      <section className="border-t" style={{ borderColor: "#F5D0C5", background: "#FDF6F4" }}>
        <Container className="flex gap-3 py-8">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" style={{ color: "#C2410C" }} />
          <div className="max-w-[760px]" style={{ fontSize: 12.5, lineHeight: 1.65, color: "#9A3412" }}>
            <p className="mb-1.5 font-semibold" style={{ fontSize: 13 }}>Research use only</p>
            <p>
              The product described on this page is intended for in-vitro laboratory research use only. It is not a drug and has not been approved by the FDA or any other regulatory body. It is not intended to diagnose, treat, cure, or prevent any disease or condition. Only qualified researchers should purchase this product. You must be at least 18 years of age to purchase.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
