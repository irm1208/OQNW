import { useState, useMemo } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useSEO } from "@/hooks/useSEO";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { Check, Plus, Minus, ShoppingCart, Package, Percent, Zap, Tag, ChevronDown } from "lucide-react";
import type { Product } from "@/data/products";

const CATEGORIES = [
  "All", "Growth Peptides", "Healing Peptides", "Weight Management",
  "Longevity Peptides", "Nootropics", "Cellular Health", "Hormonal Peptides",
  "Skin & Repair", "Immune Support", "Research Peptides", "Peptide Blends",
];

const TIERS = [
  { count: 5,  pct: 10 },
  { count: 10, pct: 15 },
  { count: 15, pct: 20 },
];

function getDiscount(n: number) {
  if (n >= 15) return 20;
  if (n >= 10) return 15;
  if (n >= 5) return 10;
  return 0;
}

type BundleItem = { product: Product; qty: number };

export default function BundlesPage() {
  useSEO({
    title: "Bundle & Save — Research Peptide Bundles",
    description: "Build your own research peptide bundle and save up to 20%. Mix and match from 81 HPLC-verified peptides. Free UK shipping available.",
    canonicalPath: "/bundles",
  });

  const { products } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [bundle, setBundle] = useState<BundleItem[]>([]);
  const [catFilter, setCatFilter] = useState("All");
  const [added, setAdded] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const bundleIds = useMemo(() => new Set(bundle.map(b => b.product.id)), [bundle]);
  const discountPct = getDiscount(bundle.length);
  const subtotal = bundle.reduce((sum, b) => sum + (b.product.price ?? 0) * b.qty, 0);
  const savings = subtotal * (discountPct / 100);
  const total = subtotal - savings;

  const groups = useMemo(() => {
    const filtered = products.filter(p => catFilter === "All" || p.category === catFilter);
    return groupProducts(filtered);
  }, [products, catFilter]);

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

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0D1F4E 0%, #1240A0 100%)", padding: "52px 20px 44px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.12)", borderRadius: "20px", padding: "6px 14px", marginBottom: "18px" }}>
            <Package size={13} color="rgba(255,255,255,0.85)" />
            <span style={{ fontSize: "11.5px", fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.08em" }}>BUNDLE & SAVE</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Build Your Research Bundle
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.72)", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 28px" }}>
            Mix and match any peptides. The more you bundle, the more you save — up to 20% off your entire order.
          </p>

          {/* Discount tiers */}
          <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
            {TIERS.map(tier => (
              <div key={tier.count} style={{
                display: "flex", alignItems: "center", gap: "7px",
                background: discountPct >= tier.pct ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)",
                border: discountPct >= tier.pct ? "1.5px solid rgba(255,255,255,0.4)" : "1.5px solid rgba(255,255,255,0.15)",
                borderRadius: "12px", padding: "10px 18px",
                transition: "all 0.2s",
              }}>
                <Percent size={14} color={discountPct >= tier.pct ? "#fff" : "rgba(255,255,255,0.5)"} />
                <div>
                  <p style={{ margin: 0, fontSize: "16px", fontWeight: 900, color: discountPct >= tier.pct ? "#fff" : "rgba(255,255,255,0.5)" }}>
                    {tier.pct}% OFF
                  </p>
                  <p style={{ margin: 0, fontSize: "11px", color: discountPct >= tier.pct ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.4)", fontWeight: 600 }}>
                    {`${tier.count}+ items`}
                  </p>
                </div>
                {discountPct >= tier.pct && <Check size={14} color="#fff" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 16px 120px" }}>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "20px" }}>
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

        {/* Products grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
        }}>
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
                {/* Check badge */}
                {anyInBundle && !isExpanded && (
                  <div style={{
                    position: "absolute", top: "10px", right: "10px",
                    width: "22px", height: "22px", borderRadius: "50%",
                    background: "#1240A0", display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={12} color="#fff" strokeWidth={3} />
                  </div>
                )}

                {/* Expand chevron for multi-variant */}
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

                {/* Single variant: show price */}
                {!multiVariant && (
                  <p style={{ margin: 0, fontSize: "14px", fontWeight: 900, color: anyInBundle ? "#1240A0" : "#0F172A" }}>
                    {group.variants[0].price != null ? formatPrice(group.variants[0].price) : "—"}
                  </p>
                )}

                {/* Multi variant: show count hint or expanded pills */}
                {multiVariant && !isExpanded && (
                  <p style={{ margin: 0, fontSize: "11.5px", color: "#64748B", fontWeight: 600 }}>
                    {selectedVariants.length > 0
                      ? `${selectedVariants.length} strength${selectedVariants.length > 1 ? "s" : ""} selected`
                      : `${group.variants.length} strengths available`
                    }
                  </p>
                )}

                {/* Expanded strength picker */}
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
          padding: "12px 20px",
        }}>
          <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>

            {/* Selected items */}
            <div style={{ flex: 1, minWidth: "240px" }}>
              <p style={{ margin: "0 0 6px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Your Bundle ({bundle.length} item{bundle.length !== 1 ? "s" : ""})
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

            {bundle.length < 2 && (
              <div style={{
                display: "flex", alignItems: "center", gap: "7px",
                background: "#FFFBEB", borderRadius: "10px", padding: "8px 14px",
                border: "1px solid #FDE68A", flexShrink: 0,
              }}>
                <Zap size={13} color="#D97706" />
                <p style={{ margin: 0, fontSize: "12px", color: "#92400E", fontWeight: 600 }}>
                  Add {5 - bundle.length} more item{5 - bundle.length !== 1 ? "s" : ""} to unlock 10% off
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
