import { useState, useEffect } from "react";
import { Link, useParams } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { ShoppingCart, Package, Thermometer, FlaskConical, Shield, Truck, Minus, Plus, ChevronRight, Download } from "lucide-react";
import { generateCOA } from "@/utils/generateCOA";
import HplcChart from "@/components/HplcChart";
import MsChart from "@/components/MsChart";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { getPurity, getPurityStr, getLotNumber } from "@/utils/productPurity";
import { useRecentlyViewed } from "@/context/RecentlyViewedContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import CustomersAlsoBought from "@/components/CustomersAlsoBought";

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
  const [activeTab, setActiveTab] = useState<"description" | "coa">("description");
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const { trackView } = useRecentlyViewed();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [params.id]);

  useEffect(() => {
    if (product) trackView(product.id);
  }, [product?.id]);
  const { formatPrice } = useCurrency();

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
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
        <div className="flex flex-col lg:flex-row gap-5 lg:gap-8 mb-8 md:mb-10">
          {/* Left: Product card panel */}
          <div className="lg:w-[460px] flex-shrink-0">
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

            <h1 className="font-bold leading-tight mb-3" style={{ fontSize: "28px", color: "#0F172A" }}>
              {product.name}
            </h1>

            {/* Badges row */}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span
                className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0" }}
              >
                ✓ In Stock
              </span>
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
                  Prices shown are indicative. Final invoice in GBP.
                </p>
              </div>
            )}

            {/* Quantity + CTA */}
            <div
              className="rounded-2xl p-5 mb-5"
              style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}
            >
              <p className="text-xs font-bold mb-3 uppercase tracking-wider" style={{ color: "#94A3B8" }}>Quantity</p>
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center rounded-xl overflow-hidden"
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
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl font-bold text-white transition-all hover:opacity-90"
                  style={{
                    background: added
                      ? "linear-gradient(135deg, #059669 0%, #047857 100%)"
                      : "linear-gradient(135deg, #1B5CB5 0%, #1240A0 100%)",
                    height: "44px",
                    fontSize: "14px",
                    border: "none",
                    cursor: "pointer",
                    transition: "background 0.25s",
                  }}
                >
                  <ShoppingCart size={16} />
                  {added ? "✓ Added to Cart!" : "Add to Cart"}
                </button>
              </div>
            </div>

            {/* COA Download */}
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
                onClick={() => void generateCOA(product, detail)}
                className="flex items-center gap-2 font-bold rounded-xl transition-opacity hover:opacity-90 flex-shrink-0"
                style={{ height: "36px", padding: "0 16px", backgroundColor: "#1B5CB5", color: "#fff", border: "none", cursor: "pointer", fontSize: "13px" }}
              >
                <Download size={13} />
                Download PDF
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
                    <td className="py-2.5 px-4 text-xs font-bold" style={{ color: "#059669" }}>In Stock</td>
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

        {/* Description / COA Tabs */}
        <div
          className="rounded-2xl overflow-hidden mb-8"
          style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}
        >
          {/* Tab bar */}
          <div className="flex" style={{ borderBottom: "1px solid #F1F5F9" }}>
            {[
              { key: "description", label: "Description" },
              { key: "coa", label: "COA / HPLC / MS" },
            ].map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as "description" | "coa")}
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
            {activeTab === "description" ? (
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
            ) : (
              <div style={{ maxWidth: "860px" }}>
                {/* COA */}
                <div className="mb-6">
                  <h3 className="font-bold mb-3" style={{ fontSize: "15px", color: "#0F172A" }}>Certificate of Analysis (COA)</h3>
                  <div className="p-6 rounded-xl text-center" style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                    <Shield size={32} className="mx-auto mb-2" style={{ color: "#1B5CB5" }} />
                    <p className="font-semibold text-sm mb-1" style={{ color: "#0F172A" }}>Certificate of Analysis</p>
                    <p className="text-xs mb-4" style={{ color: "#64748B" }}>{product.name} — Purity: {getPurityStr(product.id)} HPLC</p>
                    <div className="text-left mx-auto rounded-xl p-4 text-xs" style={{ backgroundColor: "#fff", border: "1px solid #E2E8F0", maxWidth: "480px" }}>
                      <table className="w-full">
                        <tbody>
                          {[
                            ["Product Name", product.name],
                            detail.casNumber ? ["CAS Number", detail.casNumber] : null,
                            detail.formula ? ["Molecular Formula", detail.formula] : null,
                            detail.molecularWeight ? ["Molecular Weight", detail.molecularWeight] : null,
                            ["Purity (HPLC)", getPurityStr(product.id)],
                            detail.appearance ? ["Appearance", detail.appearance] : null,
                            ["Manufacturer", "OmniQure"],
                          ].filter(Boolean).map((row) => (
                            <tr key={row![0]} style={{ borderBottom: "1px solid #F1F5F9" }}>
                              <td className="py-1.5 font-semibold pr-4" style={{ color: "#64748B" }}>{row![0]}</td>
                              <td className="py-1.5" style={{ color: row![0] === "Purity (HPLC)" ? "#059669" : "#0F172A", fontWeight: row![0] === "Purity (HPLC)" ? 700 : 400 }}>{row![1]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs mt-4" style={{ color: "#94A3B8" }}>Full COA available upon request for qualified researchers.</p>
                  </div>
                </div>

                {/* HPLC */}
                <div className="mb-6">
                  <h3 className="font-bold mb-3" style={{ fontSize: "15px", color: "#0F172A" }}>HPLC Chromatogram</h3>
                  <HplcChart
                    productId={product.id}
                    productName={product.name}
                  />
                </div>

                {/* MS */}
                <div>
                  <h3 className="font-bold mb-3" style={{ fontSize: "15px", color: "#0F172A" }}>Mass Spectrometry (MS)</h3>
                  <MsChart
                    productId={product.id}
                    productName={product.name}
                    molecularWeight={detail.molecularWeight}
                  />
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
