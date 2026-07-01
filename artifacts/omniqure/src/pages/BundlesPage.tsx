import { useState, useMemo } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useSEO } from "@/hooks/useSEO";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { Check, Plus, Minus, ShoppingCart, Package, Percent, Zap, Tag, ChevronDown, Search, X } from "lucide-react";
import type { Product } from "@/data/products";

const CATEGORIES = [
  "All", "Growth Peptides", "Healing Peptides", "Weight Management",
  "Longevity Peptides", "Nootropics", "Cellular Health", "Hormonal Peptides",
  "Skin & Repair", "Immune Support", "Research Peptides", "Peptide Blends",
];

const TIERS = [
  { count: 3,  pct: 5  },
  { count: 7,  pct: 10 },
  { count: 11, pct: 15 },
  { count: 15, pct: 20 },
];

function getDiscount(totalVials: number) {
  if (totalVials >= 15) return 20;
  if (totalVials >= 11) return 15;
  if (totalVials >= 7)  return 10;
  if (totalVials >= 3)  return 5;
  return 0;
}

function nextTierInfo(totalVials: number): { need: number; nextPct: number } | null {
  if (totalVials < 3)  return { need: 3  - totalVials, nextPct: 5  };
  if (totalVials < 7)  return { need: 7  - totalVials, nextPct: 10 };
  if (totalVials < 11) return { need: 11 - totalVials, nextPct: 15 };
  if (totalVials < 15) return { need: 15 - totalVials, nextPct: 20 };
  return null;
}

function tierProgressPct(totalVials: number): number {
  if (totalVials >= 15) return 100;
  if (totalVials >= 11) return ((totalVials - 11) / 4) * 100;
  if (totalVials >= 7)  return ((totalVials - 7)  / 4) * 100;
  if (totalVials >= 3)  return ((totalVials - 3)  / 4) * 100;
  return (totalVials / 3) * 100;
}

type BundleItem = { product: Product; qty: number };

export default function BundlesPage() {
  useSEO({
    title: "Bundle & Save — Research Peptide Bundles",
    description: "Build your own research peptide bundle and save up to 20%. Mix and match from 81 HPLC-verified peptides — 3+ vials saves 5%, up to 20% off. Free UK shipping available.",
    canonicalPath: "/bundles",
  });

  const { products } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [bundle, setBundle] = useState<BundleItem[]>([]);
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [added, setAdded] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const bundleIds = useMemo(() => new Set(bundle.map(b => b.product.id)), [bundle]);

  // Use total quantity (vials) for discount — matches CartContext logic
  const totalVials = bundle.reduce((sum, b) => sum + b.qty, 0);
  const discountPct = getDiscount(totalVials);
  const subtotal = bundle.reduce((sum, b) => sum + (b.product.price ?? 0) * b.qty, 0);
  const savings = subtotal * (discountPct / 100);
  const total = subtotal - savings;
  const next = nextTierInfo(totalVials);
  const progressPct = tierProgressPct(totalVials);

  const groups = useMemo(() => {
    let filtered = products;
    if (catFilter !== "All") filtered = filtered.filter(p => p.category === catFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q));
    }
    return groupProducts(filtered);
  }, [products, catFilter, search]);

  function toggleVariant(product: Product) {
    setBundle(prev => {
      if (prev.find(b => b.product.id === product.id)) {
        return prev.filter(b => b.product.id !== product.id);
      }
      return [...prev, { product, qty: 1 }];
    });
  }

  function handleGroupClick(baseName: string, variants: Product[]) {
    if (variants.length === 1) {
      toggleVariant(variants[0]);
    } else {
      setExpandedGroup(prev => (prev === baseName ? null : baseName));
    }
  }

  function changeQty(productId: string, delta: number) {
    setBundle(prev => prev.map(b =>
      b.product.id === productId
        ? { ...b, qty: Math.max(1, b.qty + delta) }
        : b
    ));
  }

  function addBundleToCart() {
    bundle.forEach(b => addToCart(b.product, b.qty));
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  }

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* ── Page hero ── */}
      <div style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        padding: "36px 0 30px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: "-60px", right: "10%", width: "280px", height: "280px", borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div className="max-w-[1280px] mx-auto px-3 md:px-4" style={{ position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: "8px" }}>
            OmniQure · Bundle &amp; Save
          </p>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: "9px" }}>
            Build Your Own Bundle
          </h1>
          <p style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.5)", maxWidth: "540px", lineHeight: 1.65, marginBottom: "16px" }}>
            Mix and match from 81 HPLC-verified peptides and save up to 20%. The more vials you order, the more you save.
          </p>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {["99%+ HPLC Purity", "Full COA", "ESI-TOF MS", "Lyophilized"].map(t => (
              <span key={t} style={{
                fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)",
                backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                padding: "4px 12px", borderRadius: "20px",
              }}>
                ✓ {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bundle & Save strip ── */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-30px", right: "18%", width: "180px", height: "80px", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.16) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
        <div className="max-w-[1280px] mx-auto px-3 md:px-4 py-3" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <div style={{ backgroundColor: "#34D399", borderRadius: "5px", padding: "2px 8px" }}>
                <span style={{ fontSize: "9.5px", fontWeight: 900, letterSpacing: "0.1em", color: "#022c22", textTransform: "uppercase" }}>Bundle & Save</span>
              </div>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Buy more, save more — starts at just 3 vials</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
              {[
                { label: "3+ vials",  pct: "5%",  bg: "rgba(96,165,250,0.15)",  border: "rgba(96,165,250,0.4)",  pctColor: "#93C5FD" },
                { label: "7+ vials",  pct: "10%", bg: "rgba(52,211,153,0.15)",  border: "rgba(52,211,153,0.4)",  pctColor: "#6EE7B7" },
                { label: "11+ vials", pct: "15%", bg: "rgba(251,191,36,0.15)",  border: "rgba(251,191,36,0.4)",  pctColor: "#FDE68A" },
                { label: "15+ vials", pct: "20%", bg: "rgba(248,113,113,0.18)", border: "rgba(248,113,113,0.45)", pctColor: "#FCA5A5" },
              ].map(t => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "5px", backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: "7px", padding: "4px 10px" }}>
                  <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{t.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 900, color: t.pctColor, lineHeight: 1 }}>{t.pct}</span>
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.38)", fontWeight: 700 }}>OFF</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 16px 140px" }}>

        {/* Search + Category filters row */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>

          {/* Search bar */}
          <div style={{ position: "relative", maxWidth: "360px" }}>
            <Search size={15} color="#94A3B8" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Search peptides…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", paddingLeft: "36px", paddingRight: search ? "32px" : "12px",
                paddingTop: "9px", paddingBottom: "9px",
                borderRadius: "10px", border: "1.5px solid #E2E8F0",
                backgroundColor: "#fff", fontSize: "13px", color: "#0F172A",
                outline: "none", fontFamily: "'Arimo', Arial, sans-serif",
                boxSizing: "border-box",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}
              >
                <X size={13} color="#94A3B8" />
              </button>
            )}
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat)}
                style={{
                  padding: "7px 14px", borderRadius: "20px", fontSize: "12.5px", fontWeight: 600,
                  border: catFilter === cat ? "none" : "1.5px solid #E2E8F0",
                  background: catFilter === cat ? "linear-gradient(90deg, #0D2565, #1B5CB5)" : "#fff",
                  color: catFilter === cat ? "#fff" : "#475569",
                  cursor: "pointer", transition: "all 0.15s",
                  boxShadow: catFilter === cat ? "0 4px 12px rgba(18,64,160,0.25)" : "none",
                  fontFamily: "'Arimo', Arial, sans-serif",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* No results state */}
        {groups.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#94A3B8" }}>
            <Search size={32} color="#CBD5E1" style={{ marginBottom: "12px" }} />
            <p style={{ fontSize: "15px", fontWeight: 700, color: "#475569", margin: "0 0 6px" }}>No peptides found</p>
            <p style={{ fontSize: "13px", margin: 0 }}>Try a different search or category</p>
          </div>
        )}

        {/* Products grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ columnGap: "56px", rowGap: "96px" }}>
          {groups.map(group => {
            const anyInBundle = group.variants.some(v => bundleIds.has(v.id));
            const selectedVariants = group.variants.filter(v => bundleIds.has(v.id));
            const isExpanded = expandedGroup === group.baseName;
            const multiVariant = group.variants.length > 1;

            return (
              <div
                key={group.baseName}
                style={{
                  background: "#fff",
                  borderRadius: "14px",
                  border: anyInBundle ? "2px solid #1240A0" : "1.5px solid #E8EDF5",
                  padding: "14px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: anyInBundle ? "0 4px 20px rgba(18,64,160,0.18)" : "0 2px 8px rgba(15,23,42,0.05)",
                  position: "relative",
                  transform: anyInBundle ? "translateY(-2px)" : "none",
                }}
                onClick={() => handleGroupClick(group.baseName, group.variants)}
              >
                {anyInBundle && !isExpanded && (
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: "#1240A0", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={12} color="#fff" strokeWidth={3} />
                  </div>
                )}

                {multiVariant && !anyInBundle && (
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    color: isExpanded ? "#1240A0" : "#94A3B8",
                    transform: isExpanded ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s",
                  }}>
                    <ChevronDown size={16} />
                  </div>
                )}

                <img
                  src={group.image}
                  alt={group.baseName}
                  style={{ width: "100%", height: "100px", objectFit: "contain", borderRadius: "8px", marginBottom: "10px", padding: "4px" }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <p style={{ margin: "0 0 2px", fontSize: "10.5px", color: "#1B5CB5", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {group.category}
                </p>
                <p style={{ margin: "0 0 6px", fontSize: "13px", fontWeight: 800, color: anyInBundle ? "#1240A0" : "#0F172A", lineHeight: 1.3, paddingRight: "20px" }}>
                  {group.baseName}
                </p>

                {!multiVariant && (
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 900, color: anyInBundle ? "#1240A0" : "#0F172A" }}>
                    {group.variants[0].price != null ? formatPrice(group.variants[0].price) : "—"}
                  </p>
                )}

                {multiVariant && !isExpanded && (
                  <p style={{ margin: 0, fontSize: "11.5px", color: "#64748B", fontWeight: 600 }}>
                    {selectedVariants.length > 0
                      ? `${selectedVariants.length} strength${selectedVariants.length > 1 ? "s" : ""} selected`
                      : `${group.variants.length} strengths available`
                    }
                  </p>
                )}

                {multiVariant && isExpanded && (
                  <div
                    style={{ marginTop: "10px" }}
                    onClick={e => e.stopPropagation()}
                  >
                    <p style={{ margin: "0 0 8px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Select strength
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {group.variants.map(v => {
                        const { strength } = parseName(v.name);
                        const inBundle = bundleIds.has(v.id);
                        return (
                          <button
                            key={v.id}
                            onClick={() => toggleVariant(v)}
                            style={{
                              display: "flex", alignItems: "center", justifyContent: "space-between",
                              padding: "8px 10px", borderRadius: "8px",
                              border: `1.5px solid ${inBundle ? "#1240A0" : "#E2E8F0"}`,
                              background: inBundle ? "#EEF4FF" : "#F8FAFC",
                              cursor: "pointer", transition: "all 0.15s",
                              fontFamily: "'Arimo', Arial, sans-serif",
                            }}
                          >
                            <span style={{ fontSize: "12.5px", fontWeight: 700, color: inBundle ? "#1240A0" : "#334155" }}>
                              {strength}
                            </span>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <span style={{ fontSize: "12px", fontWeight: 800, color: inBundle ? "#1240A0" : "#0F172A" }}>
                                {v.price != null ? formatPrice(v.price) : "—"}
                              </span>
                              {inBundle && <Check size={13} color="#1240A0" strokeWidth={3} />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating bundle bar */}
      {bundle.length > 0 && (
        <div style={{
          position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 1000,
          background: "#fff", borderTop: "2px solid #E8EDF5",
          boxShadow: "0 -8px 40px rgba(15,23,42,0.15)",
        }}>

          {/* Next-tier progress strip */}
          {next && (
            <div style={{
              background: discountPct > 0
                ? "linear-gradient(90deg, #064E3B, #059669)"
                : "linear-gradient(90deg, #0a1e4a, #1240A0)",
              padding: "6px 20px",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <div style={{ flex: 1, maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <Zap size={12} color={discountPct > 0 ? "#6EE7B7" : "#93C5FD"} />
                  <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#fff" }}>
                    {discountPct > 0
                      ? `✓ ${discountPct}% off active — add ${next.need} more vial${next.need !== 1 ? "s" : ""} to unlock ${next.nextPct}%`
                      : `Add ${next.need} more vial${next.need !== 1 ? "s" : ""} to unlock ${next.nextPct}% off`
                    }
                  </span>
                </div>
                <div style={{ flex: 1, height: "4px", borderRadius: "4px", backgroundColor: "rgba(255,255,255,0.2)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "4px",
                    width: `${progressPct}%`,
                    background: discountPct > 0 ? "#34D399" : "rgba(255,255,255,0.7)",
                    transition: "width 0.3s ease",
                  }} />
                </div>
                <span style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.6)", fontWeight: 600, flexShrink: 0 }}>
                  {totalVials} / {next.need + totalVials} vials
                </span>
              </div>
            </div>
          )}
          {!next && (
            <div style={{ background: "linear-gradient(90deg, #064E3B, #059669)", padding: "6px 20px", display: "flex", justifyContent: "center" }}>
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#fff" }}>
                ✓ Maximum 20% bundle discount active!
              </span>
            </div>
          )}

          {/* Main bar */}
          <div style={{ padding: "12px 20px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>

              {/* Selected items */}
              <div style={{ flex: 1, minWidth: "240px" }}>
                <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Your Bundle ({totalVials} vial{totalVials !== 1 ? "s" : ""}, {bundle.length} product{bundle.length !== 1 ? "s" : ""})
                </p>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {bundle.slice(0, 4).map(b => (
                    <div key={b.product.id} style={{
                      display: "flex", alignItems: "center", gap: "5px",
                      background: "#EEF4FF", borderRadius: "20px", padding: "3px 10px",
                    }}>
                      <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#1240A0" }}>{b.product.name}</span>
                      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
                        <button
                          onClick={e => { e.stopPropagation(); changeQty(b.product.id, -1); }}
                          style={{ width: "16px", height: "16px", borderRadius: "50%", border: "none", background: "rgba(18,64,160,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                        >
                          <Minus size={8} color="#1240A0" />
                        </button>
                        <span style={{ fontSize: "11px", fontWeight: 700, color: "#1240A0", minWidth: "12px", textAlign: "center" }}>{b.qty}</span>
                        <button
                          onClick={e => { e.stopPropagation(); changeQty(b.product.id, 1); }}
                          style={{ width: "16px", height: "16px", borderRadius: "50%", border: "none", background: "rgba(18,64,160,0.15)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}
                        >
                          <Plus size={8} color="#1240A0" />
                        </button>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); toggleVariant(b.product); }}
                        style={{ width: "14px", height: "14px", borderRadius: "50%", border: "none", background: "#CBD5E1", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0, fontSize: "9px", color: "#fff", fontWeight: 900 }}
                      >×</button>
                    </div>
                  ))}
                  {bundle.length > 4 && (
                    <span style={{ fontSize: "11.5px", color: "#64748B", alignSelf: "center" }}>
                      +{bundle.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Pricing */}
              <div style={{ display: "flex", gap: "16px", alignItems: "center", flexShrink: 0 }}>
                {discountPct > 0 && (
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Tag size={13} color="#059669" />
                      <span style={{ fontSize: "13px", fontWeight: 800, color: "#059669" }}>
                        {discountPct}% off — Save {formatPrice(savings)}
                      </span>
                    </div>
                    <p style={{ margin: "1px 0 0", fontSize: "11px", color: "#94A3B8", textDecoration: "line-through" }}>
                      {formatPrice(subtotal)}
                    </p>
                  </div>
                )}
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "10px", color: "#64748B", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>Bundle Total</p>
                  <p style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em" }}>{formatPrice(total)}</p>
                </div>
                <button
                  onClick={addBundleToCart}
                  style={{
                    height: "50px", padding: "0 28px", borderRadius: "14px",
                    background: added ? "#059669" : "linear-gradient(90deg, #0D2565, #1B5CB5)",
                    border: "none", color: "#fff", fontSize: "14px", fontWeight: 800,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "8px",
                    boxShadow: added ? "0 4px 16px rgba(5,150,105,0.4)" : "0 4px 20px rgba(18,64,160,0.35)",
                    transition: "all 0.2s",
                    fontFamily: "'Arimo', Arial, sans-serif",
                  }}
                >
                  {added ? (
                    <><Check size={16} /> Added to Cart!</>
                  ) : (
                    <><ShoppingCart size={16} /> Add Bundle to Cart{discountPct > 0 ? ` (${discountPct}% off)` : ""}</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
