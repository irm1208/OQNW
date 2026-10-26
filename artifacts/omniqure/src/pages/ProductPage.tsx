import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { trackViewContent } from "@/lib/pixels";
import { Link, useParams, useLocation } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { isHiddenCategory, type Product } from "@/data/products";
import { ShoppingCart, ShieldCheck, Minus, Plus, ChevronRight, ChevronDown, Droplets, Check, ArrowUpRight } from "lucide-react";
import { FAQS } from "@/data/faqs";
import CatalogueCard from "@/components/CatalogueCard";
import { Container, SectionTitle } from "@/components/home/HomeSections";
import { groupProducts } from "@/data/groupedProducts";
import { studioImageForProduct, studioFallback, STUDIO_BG } from "@/lib/studioImage";
import { janoshikDataBySlug } from "@/data/janoshikData";
import { resolveBacWaterProducts } from "@/data/bacWaterProducts";
import JanoshikReportModal from "@/components/JanoshikReportModal";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getLotNumber } from "@/utils/productPurity";
import { BundleAndSave, KitBuilder, type PickActions } from "@/components/BundleBuilder";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import { useCustomerAuth } from "@/context/CustomerAuthContext";
import { useSEO, SITE_URL } from "@/hooks/useSEO";
import { getProductSeoMetadata, getPublicProductPath } from "@workspace/api-client-react";
import { getVialImage, versionVialAsset } from "@/lib/catalogueImages";
import { rangeColourForCategory, tint } from "@/lib/rangeColour";

const BASE_URL = import.meta.env.BASE_URL ?? "/";

// The objections a shopper weighs before ordering, answered from the site FAQ
// so the two never drift apart.
const PRODUCT_FAQ_QUESTIONS = [
  "Are your peptides tested for purity?",
  "What does '99%+ independently verified' mean?",
  "How should I store lyophilised peptides?",
  "How long can I store a reconstituted peptide solution?",
  "Is standard UK shipping free?",
  "How long does shipping take?",
];
const PRODUCT_FAQS = PRODUCT_FAQ_QUESTIONS
  .map((q) => FAQS.find((f) => f.q === q))
  .filter((f): f is NonNullable<typeof f> => !!f);
function apiUrl(path: string) {
  return `${BASE_URL}api/${path}`.replace(/\/+/g, "/").replace(/^\/\//, "/");
}

function parseBaseName(name: string): { base: string; strength: string } {
  const match = name.match(/^(.*?)\s+(\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g)(?:\s+\(.*?\))?)$/i);
  if (match) return { base: match[1].trim(), strength: match[2].trim() };
  return { base: name, strength: "" };
}

/** Molecular formula with element counts subscripted, as printed on the vial. */
function Formula({ value }: { value: string }) {
  // Some formulas are stored with Unicode subscripts; normalise them to digits.
  const parts = value.replace(/[₀-₉]/g, (c) => String(c.charCodeAt(0) - 0x2080)).split(/(\d+)/);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 && /[A-Za-z)\]]$/.test(parts[i - 1]) ? <sub key={i}>{part}</sub> : part,
      )}
    </>
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
  const [showStickyCta, setShowStickyCta] = useState(false);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const [showJanoshikModal, setShowJanoshikModal] = useState(false);
  const [imageIdx, setImageIdx] = useState(0);
  const { addToCart, items, peptideQty, freeUnitsByProductId, removeFromCart, updateQuantity } = useCart();
  const { trackView } = useRecentlyViewed();
  const { customer } = useCustomerAuth();
  const { formatPrice } = useCurrency();
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

  // On phones the main buy button can sit below the fold; show a compact
  // sticky bar once it scrolls out of view so the price and CTA stay reachable.
  useEffect(() => {
    const onScroll = () => {
      const node = ctaRef.current;
      if (!node) return;
      setShowStickyCta(node.getBoundingClientRect().bottom < 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [product?.slug]);

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
  ).slice(0, 5);
  // Every purchasable compound, for the bundle list and the kit builder.
  const pickable = products.filter(p =>
    p.price != null &&
    p.category !== "Accessories" &&
    !isHiddenCategory(p.category) &&
    p.stockLevel !== 0,
  );
  // Cheapest first in the buy box, so the quickest route to the next tier leads.
  const bundleProducts = pickable
    .filter(p => p.id !== product.id)
    .sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const cartQty = (productId: string) =>
    items.find(i => i.product.id === productId)?.quantity ?? 0;
  const pickActions: PickActions = {
    cartQty,
    freeUnits: freeUnitsByProductId,
    onAdd: (p) => addToCart(p, 1),
    onRemove: (id) => {
      const current = cartQty(id);
      if (current <= 1) removeFromCart(id);
      else updateQuantity(id, current - 1);
    },
    formatPrice,
  };
  // Long description -> intro paragraphs plus titled sections. Short lines
  // without a full stop are the section headings in the source copy.
  const aboutIntro: string[] = [];
  const aboutSections: { title: string; paras: string[] }[] = [];
  for (const para of (detail.longDescription ?? "").split("\n\n").map(t => t.trim()).filter(Boolean)) {
    if (para.length < 100 && !para.endsWith(".")) aboutSections.push({ title: para, paras: [] });
    else (aboutSections[aboutSections.length - 1]?.paras ?? aboutIntro).push(para);
  }
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
  const hair = { borderColor: "var(--hairline)" } as const;
  // Brand range colour for this product family (see lib/rangeColour.ts).
  const rangeColour = rangeColourForCategory(product.category);

  return (
    <div
      className="product-page bg-white"
      style={{ "--range": rangeColour, "--range-tint": tint(rangeColour, 0.14) } as React.CSSProperties}
    >
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
          <nav aria-label="Breadcrumb" className="mono flex flex-wrap items-center gap-1.5" style={{ fontSize: 10.5, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--graphite)" }}>
            <Link href="/" className="hover:text-[#0A2472]">Home</Link>
            <ChevronRight size={11} className="opacity-50" />
            <Link href="/all-peptides" className="hover:text-[#0A2472]">Catalogue</Link>
            <ChevronRight size={11} className="opacity-50" />
            <span style={{ color: "#1D2948" }}>{product.name}</span>
          </nav>
        </Container>
      </div>

      {/* Main product section */}
      <section>
        <Container className="grid gap-6 py-6 md:grid-cols-2 md:gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:py-10 lg:gap-14 lg:py-12">
          {/* Gallery */}
          <div className="product-gallery-col md:sticky md:top-20 md:self-start">
            <div className="product-gallery-media relative aspect-square overflow-hidden rounded-[14px]" style={{ background: STUDIO_BG }}>
              <img
                key={activeImage.src}
                src={activeImage.src}
                onError={studioFallback(activeImage.fallback)}
                alt={activeImage.alt}
                className={`product-gallery-img h-full w-full ${imageIdx === 0 ? "object-cover" : "object-contain p-5 bg-white"}`}
                width={1800}
                height={1800}
                decoding="async"
                fetchPriority={imageIdx === 0 ? "high" : "auto"}
              />
            </div>
            {gallery.length > 1 && (
              <div className="product-gallery-thumbs mt-2.5 flex gap-2">
                {gallery.map((g, i) => (
                  <button
                    key={g.src}
                    type="button"
                    onClick={() => setImageIdx(i)}
                    aria-label={`Show image ${i + 1}`}
                    aria-pressed={i === imageIdx}
                    className="h-11 w-11 overflow-hidden rounded-[7px] border-2 transition-colors sm:h-12 sm:w-12"
                    style={{ borderColor: i === imageIdx ? "#1D2948" : "transparent", background: STUDIO_BG }}
                  >
                    <img src={g.src} onError={studioFallback(g.fallback)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info panel */}
          <div className="product-info-panel buy-head min-w-0">
            {/* One purchase card laid out like the vial label: navy band with
                the name, the range-colour stripe, then choose, price and buy. */}
            <div className="buy-card">
              <div className="buy-card__head">
                <p className="buy-card__category">{product.category}</p>
                <h1 className="product-h1">{currentBase}</h1>
                <div className="buy-meta">
                  <span
                    className="stock-pill"
                    style={{ color: soldOut ? "#FCA5A5" : lowStock ? "#FCD34D" : "#86EFAC" }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "currentColor" }} />
                    {soldOut ? "Sold out" : lowStock ? "Low stock" : "In stock"}
                  </span>
                  {aliases.length > 0 && (
                    <p className="alias-line">
                      {aliases.join(" · ")}
                    </p>
                  )}
                </div>
                <p className="buy-lead">
                  Laboratory research material for analytical / in-vitro research use only.
                </p>
              </div>
              <div className="vial-label__stripe" />
              <div className="buy-card__body">
                <div className="buy-card__options">
                  {currentStrength && (
                    <div className="product-info-dosage min-w-0">
                      <span className="field-label block">{strengthVariants.length > 1 ? "Select strength" : "Vial size"}</span>
                      <div className="dosage-group mt-1.5" role="radiogroup" aria-label="Select strength">
                        {(strengthVariants.length > 1 ? strengthVariants : [product]).map(v => {
                          const active = v.id === product.id;
                          return (
                            <button
                              key={v.id}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              onClick={() => { if (!active) navigate(`/product/${v.id}`); }}
                              className="dosage-chip"
                            >
                              {parseBaseName(v.name).strength}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className="shrink-0">
                    <span className="field-label block">Quantity</span>
                    <div className="qty-stepper product-qty-stepper mt-1.5">
                      <button
                        onClick={decreaseQty}
                        disabled={quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="qty-value" aria-live="polite">
                        {quantity}
                      </span>
                      <button
                        onClick={increaseQty}
                        aria-label="Increase quantity"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {product.price != null && (
                  <div className="product-info-price buy-card__price">
                    <div>
                      <span className="price-figure block">
                        {formatPrice(product.price * quantity)}
                      </span>
                      <span className="price-note mt-1.5 block">
                        {quantity > 1 ? `${formatPrice(product.price)} each · inc. UK VAT` : "inc. UK VAT"}
                      </span>
                    </div>
                    {(product.purity ?? detail.purity) && (
                      <span className="purity-badge">
                        <span className="mono">{product.purity ?? detail.purity}</span> HPLC purity
                      </span>
                    )}
                  </div>
                )}

                <div ref={ctaRef} className="product-cta-row product-info-cta" style={{ marginTop: 16, display: "flex", gap: 8 }}>
                  <button
                    onClick={handleAddToCart}
                    disabled={soldOut}
                    className="product-cta-btn cta-primary flex h-12 flex-1 items-center justify-center gap-2 rounded-full transition-colors"
                    style={{ background: soldOut ? undefined : added ? "#15803D" : undefined }}
                  >
                    <ShoppingCart size={15} />
                    {soldOut ? "Sold out" : added ? "Added to cart" : "Add to cart"}
                  </button>
                  {hasReport && (
                    <button
                      type="button"
                      onClick={() => setShowJanoshikModal(true)}
                      className="cta-secondary flex h-12 shrink-0 items-center gap-1.5 rounded-full px-4"
                    >
                      <ShieldCheck size={15} className="accent-ink" /> View COA
                    </button>
                  )}
                </div>

                {/* Bac water add-on — an accessory to the vial above */}
                {!soldOut && selectedBacWater && (
                  <div className="product-info-bac buy-card__addon">
                    <button
                      type="button"
                      onClick={() => setBacWaterEnabled(v => !v)}
                      aria-pressed={bacWaterEnabled}
                      className="flex w-full items-center gap-3 rounded-[4px] border px-3.5 py-3 text-left transition-colors"
                      style={{ borderColor: bacWaterEnabled ? "var(--oq-label-blue)" : "var(--hairline)", background: bacWaterEnabled ? "rgba(24, 57, 158, 0.05)" : "#fff" }}
                    >
                      <span
                        className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border-2"
                        style={{ borderColor: bacWaterEnabled ? "var(--oq-label-blue)" : "#CBD5E1", background: bacWaterEnabled ? "var(--oq-label-blue)" : "#fff" }}
                      >
                        {bacWaterEnabled && <svg width="10" height="7" viewBox="0 0 11 8" fill="none"><path d="M1 4L4 7L10 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                      </span>
                      <Droplets size={15} className="accent-ink hidden shrink-0 lg:block" />
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium" style={{ fontSize: 13, color: "var(--oq-matte-navy)" }}>Add bacteriostatic water</span>
                        <span className="block" style={{ fontSize: 11.5, color: "var(--oq-slate)" }}>For reconstituting your peptide</span>
                      </span>
                      <span className="mono shrink-0" style={{ fontSize: 12.5, color: "var(--oq-matte-navy)" }}>+{formatPrice(selectedBacWater.price)}</span>
                    </button>
                    {bacWaterEnabled && bacWaterOptions.length > 1 && (
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {bacWaterOptions.map((opt, idx) => {
                          const sel = idx === bacWaterSizeIdx;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setBacWaterSizeIdx(idx)}
                              aria-pressed={sel}
                              className="rounded-[4px] border px-3 py-2 text-left"
                              style={{ borderColor: sel ? "var(--oq-matte-navy)" : "var(--hairline)", background: "#fff" }}
                            >
                              <span className="block font-semibold" style={{ fontSize: 12.5, color: "var(--oq-matte-navy)" }}>{opt.label}</span>
                              <span className="mono block" style={{ fontSize: 11, color: "var(--oq-slate)" }}>{formatPrice(opt.price)}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <ul className="buy-trust buy-card__trust product-info-checklist">
                {[
                  hasReport ? "COA included" : "Lab tested",
                  "Same-day dispatch, Mon–Fri",
                  "Free, discreet UK tracked delivery",
                ].map(t => (
                  <li key={t}>
                    <Check size={13} style={{ color: "#15803D" }} />{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cart-wide promotion, below the product-specific decisions */}
            <div className="product-info-bundle mt-4">
              <BundleAndSave peptideQty={peptideQty} products={bundleProducts} actions={pickActions} />
            </div>


            {/* Back-in-stock alert */}
            {soldOut && (
              <div className="mt-3 rounded-[11px] border p-3" style={hair}>
                {notifySuccess ? (
                  <p style={{ fontSize: 13, color: "var(--ink)" }}>We'll email you as soon as {product.name} is back in stock.</p>
                ) : (
                  <>
                    <p className="mb-1.5 uppercase" style={{ fontSize: 10, letterSpacing: "0.12em", color: "var(--graphite)" }}>Notify me when back in stock</p>
                    <form onSubmit={(e) => { void handleNotifyMe(e); }} className="flex gap-2">
                      <input
                        type="email"
                        required
                        aria-label="Email address"
                        placeholder={customer ? customer.email : "you@email.com"}
                        value={notifyEmail || (customer ? customer.email : "")}
                        onChange={(e) => setNotifyEmail(e.target.value)}
                        className="notify-input-touch h-9 flex-1 rounded-[8px] border px-2.5 outline-none focus:border-[var(--oq-label-blue)]"
                        style={{ ...hair, fontSize: 13.5, color: "var(--ink)" }}
                      />
                      <button type="submit" disabled={notifySubmitting} className="notify-btn-touch h-9 rounded-[8px] px-3.5 font-semibold text-white" style={{ fontSize: 13, background: "var(--ink)" }}>
                        {notifySubmitting ? "…" : "Notify me"}
                      </button>
                    </form>
                    {notifyError && <p className="mt-1" style={{ fontSize: 11.5, color: "#DC2626" }}>{notifyError}</p>}
                  </>
                )}
              </div>
            )}

          </div>
        </Container>
      </section>

      {/* Sticky buy bar — phones only, appears once the inline CTA scrolls away.
          Portalled to <body> because the page-fade wrapper keeps a transform,
          which would otherwise contain position: fixed. */}
      {showStickyCta && !soldOut && createPortal(
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/95 py-2.5 pl-4 backdrop-blur md:hidden"
          style={{ borderColor: "var(--hairline)", paddingRight: 16, paddingBottom: "calc(10px + env(safe-area-inset-bottom))" }}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1 leading-tight">
              <span className="block truncate" style={{ fontSize: 12.5, color: "var(--ink)" }}>{product.name}</span>
              <span className="block font-semibold tabular-nums" style={{ fontSize: 15, color: "var(--ink)" }}>
                {product.price != null ? formatPrice(product.price * quantity) : ""}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="flex h-11 shrink-0 items-center gap-2 rounded-full px-5 font-semibold text-white"
              style={{ fontSize: 14, background: added ? "#16A34A" : "var(--oq-matte-navy)" }}
            >
              <ShoppingCart size={15} />
              {added ? "Added" : "Add to cart"}
            </button>
          </div>
        </div>,
        document.body,
      )}

      {/* Specifications — navy section, sheet styled as the vial label */}
      {specs.length > 0 && (
        <section className="p-section spec-section">
          <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
            <div>
              <p className="product-eyebrow product-eyebrow--dark">Analytical data</p>
              <h2 className="dark-title">Specifications,<br /><span style={{ color: "var(--range)" }}>verified.</span></h2>
              <p className="p-intro dark-intro">
                Specifications for this compound, independently verified before release.
              </p>
              {hasReport && (
                <button
                  type="button"
                  onClick={() => setShowJanoshikModal(true)}
                  className="dark-btn mt-6"
                >
                  <ShieldCheck size={14} aria-hidden="true" />
                  View the full lab report
                </button>
              )}
            </div>
            <div className="vial-sheet">
              <div className="vial-sheet__band">
                <img src="/omniqure-wordmark-white.svg" alt="OmniQure" className="vial-sheet__mark" />
                <span className="vial-sheet__title">{product.name}</span>
              </div>
              <div className="vial-sheet__stripe" />
              <dl>
                {specs.map(([k, v, emphasis]) => (
                  <div key={k} className="spec-row" data-emphasis={emphasis ? "true" : "false"}>
                    <dt className="spec-key">{k}</dt>
                    <dd className="spec-val">{k === "Molecular formula" ? <Formula value={v} /> : v}</dd>
                  </div>
                ))}
              </dl>
              <div className="vial-sheet__ruo">
                <strong>Research use only</strong>
                <span>Not for human or veterinary use</span>
              </div>
            </div>
          </Container>
        </section>
      )}

      {/* About this peptide — lead, then numbered sections that open on demand */}
      <section className="p-section">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <p className="product-eyebrow">About this peptide</p>
            <SectionTitle size="clamp(24px, 3vw, 34px)">{currentBase}</SectionTitle>
            <div className="prose mt-6">
              {detail.description && <p className="prose-lead">{detail.description}</p>}
              {aboutIntro.map((para, i) => <p key={i}>{para}</p>)}
            </div>
            {aboutSections.length > 0 && (
              <div className="about-sections">
                {aboutSections.map((sec, i) => (
                  <details key={sec.title} className="about-section" open={i === 0}>
                    <summary>
                      <span className="about-section__num">{String(i + 1).padStart(2, "0")}</span>
                      <span className="about-section__title">{sec.title}</span>
                      <ChevronDown size={18} className="about-section__chev" aria-hidden="true" />
                    </summary>
                    <div className="prose about-section__body">
                      {sec.paras.map((para, j) => <p key={j}>{para}</p>)}
                    </div>
                  </details>
                ))}
              </div>
            )}
            <p className="prose-note">
              Educational information only. Products are furnished for in-vitro studies only. They are not medicines or drugs and have not been approved by the FDA. Bodily introduction into humans or animals is strictly forbidden by law.
            </p>
          </div>
          <figure className="about-figure self-start lg:sticky lg:top-24">
            <div className="aspect-square overflow-hidden" style={{ background: STUDIO_BG }}>
              <img src={cardImage} onError={studioFallback(vialImage ?? cardImage)} alt={`${product.name} vial and carton`} loading="lazy" className="h-full w-full object-cover" />
            </div>
            <div className="vial-label__stripe" />
            <figcaption>
              <span className="field-label block">Research vial</span>
              <span className="block font-medium" style={{ fontSize: 13, color: "var(--oq-matte-navy)" }}>{product.name} · lyophilised</span>
            </figcaption>
          </figure>
        </Container>
      </section>

      {/* Before you order — the questions shoppers ask most, answered from the site FAQ */}
      {PRODUCT_FAQS.length > 0 && (
        <section className="p-section" style={{ background: "var(--oq-chalk)" }}>
          <Container className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
            <div>
              <p className="product-eyebrow">Before you order</p>
              <SectionTitle size="clamp(24px, 3vw, 34px)">Common<br /><span className="accent-ink">questions.</span></SectionTitle>
              <p className="p-intro">
                Purity, storage and delivery, answered. The full list is on the FAQ page.
              </p>
              <Link href="/faq" className="cta-secondary mt-5 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5">
                All questions <ArrowUpRight size={14} className="accent-ink" />
              </Link>
            </div>
            <div className="about-sections product-faq">
              {PRODUCT_FAQS.map((f, i) => (
                <details key={f.q} className="about-section" open={i === 0}>
                  <summary>
                    <span className="about-section__num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="about-section__title">{f.q}</span>
                    <ChevronDown size={18} className="about-section__chev" aria-hidden="true" />
                  </summary>
                  <div className="prose about-section__body">
                    <p>{f.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Kit builder — pick and add products without leaving the page */}
      <section className="kit-section">
        <Container>
          <KitBuilder peptideQty={peptideQty} products={pickable} actions={pickActions} />
        </Container>
      </section>

      {/* Related */}
      {relatedGroups.length > 0 && (
        <section className="p-section p-section--flush">
          <Container>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="product-eyebrow">Related</p>
                <SectionTitle size="clamp(24px, 3vw, 34px)">Related research materials.</SectionTitle>
              </div>
              <Link href={`/all-peptides?category=${encodeURIComponent(product.category)}`} className="inline-flex items-center gap-1.5 font-medium" style={{ fontSize: 13.5, color: "#1D2948" }}>
                Full catalogue <ArrowUpRight size={14} />
              </Link>
            </div>
            <div className="related-grid">
              {relatedGroups.map(g => <CatalogueCard key={g.baseName} group={g} />)}
            </div>
          </Container>
        </section>
      )}

      {/* Research literature */}
      <section className="p-section">
        <Container className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16">
          <div>
            <p className="product-eyebrow">External databases</p>
            <SectionTitle size="clamp(24px, 3vw, 34px)">Research<br /><span className="accent-ink">literature.</span></SectionTitle>
            <p className="p-intro">
              {currentBase} is indexed in public chemical and biomedical databases. Search those sources directly for primary literature and compound records.
            </p>
          </div>
          <div>
            <div className="rounded-[12px] border" style={hair}>
              {[
                { label: "PubChem", desc: "Chemical structure, identifiers and properties", href: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(currentBase)}` },
                { label: "PubMed", desc: "Peer-reviewed research mentioning this compound", href: `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(currentBase)}` },
                ...(detail.casNumber ? [{ label: "CAS number", desc: `${detail.casNumber} — search this registry number`, href: `https://pubchem.ncbi.nlm.nih.gov/#query=${encodeURIComponent(detail.casNumber)}` }] : []),
              ].map((l, i, arr) => (
                <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-[#F2F0EB]"
                  style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--hairline)" : undefined }}>
                  <span>
                    <span className="block font-semibold" style={{ fontSize: 14, color: "var(--ink)" }}>{l.label}</span>
                    <span className="block" style={{ fontSize: 12, color: "var(--graphite)" }}>{l.desc}</span>
                  </span>
                  <ArrowUpRight size={15} className="accent-ink shrink-0" aria-hidden="true" />
                </a>
              ))}
            </div>
            <p className="mt-3" style={{ fontSize: 11, lineHeight: 1.6, color: "var(--graphite)" }}>
              External database links are provided for research convenience only. OmniQure does not control and is not responsible for third-party content.
            </p>
          </div>
        </Container>
      </section>

      {/* Research notice */}
      <section className="border-t" style={hair}>
        <Container className="py-8">
          <div className="vial-label__ruo vial-label__ruo--notice">
            <strong>Research use only</strong>
            <span>Not for human or veterinary use</span>
            <p>
              The product described on this page is intended for in-vitro laboratory research use only. It is not a drug and has not been approved by the FDA or any other regulatory body. It is not intended to diagnose, treat, cure, or prevent any disease or condition. Only qualified researchers should purchase this product. You must be at least 18 years of age to purchase.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
