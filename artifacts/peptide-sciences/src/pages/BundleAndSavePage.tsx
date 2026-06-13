import { ShoppingCart, Tag, Zap, ChevronRight, CheckCircle2, Package, Percent } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";

const TIERS = [
  {
    qty: "3+",
    pct: 5,
    label: "Starter Bundle",
    color: "#1B5CB5",
    bg: "linear-gradient(135deg, #EEF4FF, #DBEAFE)",
    border: "#BFDBFE",
    badge: "",
    desc: "A great starting point — try three different peptides and save on every item.",
  },
  {
    qty: "7+",
    pct: 10,
    label: "Research Bundle",
    color: "#7C3AED",
    bg: "linear-gradient(135deg, #F5F3FF, #EDE9FE)",
    border: "#DDD6FE",
    badge: "Popular",
    desc: "Build out your protocol stack with seven or more compounds and cut your spend by 10%.",
  },
  {
    qty: "11+",
    pct: 15,
    label: "Lab Bundle",
    color: "#0369A1",
    bg: "linear-gradient(135deg, #F0F9FF, #E0F2FE)",
    border: "#BAE6FD",
    badge: "",
    desc: "Ideal for labs running multiple concurrent protocols. 15% off every item automatically.",
  },
  {
    qty: "15+",
    pct: 20,
    label: "Institute Bundle",
    color: "#059669",
    bg: "linear-gradient(135deg, #ECFDF5, #D1FAE5)",
    border: "#6EE7B7",
    badge: "Best Value",
    desc: "Maximum discount — 20% off everything in your cart. Reserved for our highest-volume researchers.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: <ShoppingCart size={20} color="#fff" />,
    bg: "linear-gradient(135deg, #1240A0, #1B5CB5)",
    title: "Add peptides to your cart",
    desc: "Browse our catalogue of 81 HPLC-verified compounds and add any combination to your cart.",
  },
  {
    icon: <Tag size={20} color="#fff" />,
    bg: "linear-gradient(135deg, #7C3AED, #A855F7)",
    title: "Discount applies automatically",
    desc: "Once you hit a tier threshold, the discount is calculated and shown in your cart — no code needed.",
  },
  {
    icon: <Package size={20} color="#fff" />,
    bg: "linear-gradient(135deg, #059669, #10B981)",
    title: "Checkout & save",
    desc: "Complete your order at the discounted price. Bundle savings stack on top of any sale pricing.",
  },
];

const EXAMPLES = [
  { label: "3 × BPC-157 5mg", originalTotal: 96, pct: 5 },
  { label: "7 × Mixed growth stack", originalTotal: 320, pct: 10 },
  { label: "15 × Full research panel", originalTotal: 780, pct: 20 },
];

export default function BundleAndSavePage() {
  useSEO({
    title: "Bundle & Save",
    description: "Save up to 20% when you order multiple peptides. Discounts apply automatically — no codes required. The more you research, the more you save.",
    canonicalPath: "/bundle-and-save",
  });

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #0D2565 0%, #1240A0 45%, #1B5CB5 80%, #1E68CC 100%)",
        padding: "64px 20px 56px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
          backgroundSize: "28px 28px", pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.12)", borderRadius: 9999,
            padding: "6px 18px", marginBottom: 20,
          }}>
            <Percent size={14} color="rgba(255,255,255,0.85)" />
            <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em" }}>
              VOLUME DISCOUNTS
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(28px, 5vw, 52px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-0.03em", lineHeight: 1.08, margin: "0 0 16px",
          }}>
            The More You Research,<br />
            <span style={{ color: "#E8A93E" }}>The More You Save</span>
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: 540, margin: "0 auto 32px" }}>
            Add 3 or more peptides to your cart and watch discounts apply automatically — up to <strong style={{ color: "#fff" }}>20% off</strong> your entire order.
          </p>
          <Link
            href="/all-peptides"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#E8A93E", color: "#0D2565",
              padding: "14px 32px", borderRadius: 12, fontWeight: 800, fontSize: 15,
              textDecoration: "none", boxShadow: "0 4px 16px rgba(232,169,62,0.4)",
            }}
          >
            Shop All Peptides <ChevronRight size={16} />
          </Link>
        </div>
      </div>

      {/* Tier cards */}
      <div style={{ padding: "56px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 900, color: "#0D2565", textAlign: "center", marginBottom: 8 }}>
            Discount Tiers
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", textAlign: "center", marginBottom: 40 }}>
            Discounts apply automatically at checkout — no coupon codes required.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16 }}>
            {TIERS.map(tier => (
              <div key={tier.qty} style={{
                borderRadius: 18, padding: "28px 22px",
                background: tier.bg, border: `1.5px solid ${tier.border}`,
                position: "relative", overflow: "hidden",
              }}>
                {tier.badge && (
                  <span style={{
                    position: "absolute", top: 14, right: 14,
                    fontSize: 9.5, fontWeight: 800, letterSpacing: "0.05em",
                    textTransform: "uppercase", color: "#fff",
                    background: tier.color, borderRadius: 9999, padding: "3px 9px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
                  }}>
                    {tier.badge}
                  </span>
                )}

                <div style={{
                  fontSize: 42, fontWeight: 900, color: tier.color,
                  lineHeight: 1, marginBottom: 4,
                }}>
                  {tier.pct}%
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: tier.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                  off — {tier.qty} items
                </div>
                <p style={{ fontSize: 13.5, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>
                  {tier.label}
                </p>
                <p style={{ fontSize: 12.5, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                  {tier.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div style={{ background: "#fff", padding: "56px 20px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#0D2565", textAlign: "center", marginBottom: 8 }}>
            How It Works
          </h2>
          <p style={{ fontSize: 15, color: "#64748B", textAlign: "center", marginBottom: 40 }}>
            No effort required — just shop and save.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {HOW_IT_WORKS.map((s, i) => (
              <div key={i} style={{
                borderRadius: 16, padding: "28px 22px",
                background: "#F8FAFF", border: "1px solid #E8EDF5",
              }}>
                <span style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: s.bg, display: "inline-flex",
                  alignItems: "center", justifyContent: "center",
                  marginBottom: 16, boxShadow: "0 4px 14px rgba(18,64,160,0.2)",
                }}>
                  {s.icon}
                </span>
                <p style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>
                  {s.title}
                </p>
                <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.65, margin: 0 }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings examples */}
      <div style={{ background: "#F5F8FC", padding: "56px 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(20px,3vw,28px)", fontWeight: 900, color: "#0D2565", textAlign: "center", marginBottom: 36 }}>
            Example Savings
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {EXAMPLES.map((ex, i) => {
              const saving = Math.round(ex.originalTotal * ex.pct / 100);
              const finalPrice = ex.originalTotal - saving;
              return (
                <div key={i} style={{
                  background: "#fff", borderRadius: 14, padding: "18px 22px",
                  border: "1px solid #E8EDF5", boxShadow: "0 2px 8px rgba(15,23,42,0.05)",
                  display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
                }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "0 0 2px" }}>{ex.label}</p>
                    <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>
                      <span style={{ textDecoration: "line-through" }}>£{ex.originalTotal.toFixed(2)}</span>
                      {" "}→{" "}
                      <span style={{ color: "#059669", fontWeight: 700 }}>£{finalPrice.toFixed(2)}</span>
                    </p>
                  </div>
                  <span style={{
                    fontSize: 14, fontWeight: 900, color: "#fff",
                    background: "linear-gradient(135deg, #059669, #10B981)",
                    borderRadius: 9999, padding: "5px 14px",
                    boxShadow: "0 2px 8px rgba(5,150,105,0.28)",
                    whiteSpace: "nowrap",
                  }}>
                    Save £{saving} ({ex.pct}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Features list */}
      <div style={{ background: "#fff", padding: "48px 20px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(18px,2.5vw,24px)", fontWeight: 900, color: "#0D2565", textAlign: "center", marginBottom: 28 }}>
            Why Bundle?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {[
              "No coupon codes needed",
              "Stacks with sale pricing",
              "Any peptide combination",
              "Applies at checkout instantly",
              "Mix categories freely",
              "No minimum order value",
            ].map(f => (
              <div key={f} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "14px 16px", borderRadius: 10,
                background: "#F8FAFF", border: "1px solid #E8EDF5",
              }}>
                <CheckCircle2 size={16} style={{ color: "#059669", flexShrink: 0 }} />
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{
        background: "linear-gradient(135deg, #0D2565 0%, #1240A0 50%, #1B5CB5 100%)",
        padding: "56px 20px",
      }}>
        <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
          <Zap size={36} color="#E8A93E" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>
            Ready to start bundling?
          </h2>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.75)", marginBottom: 28, lineHeight: 1.6 }}>
            Browse all 81 HPLC-verified peptides and build your research stack. Discounts kick in automatically.
          </p>
          <Link
            href="/all-peptides"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#E8A93E", color: "#0D2565",
              padding: "14px 32px", borderRadius: 12, fontWeight: 800, fontSize: 15,
              textDecoration: "none", boxShadow: "0 4px 16px rgba(232,169,62,0.4)",
            }}
          >
            Shop All Peptides <ChevronRight size={16} />
          </Link>
        </div>
      </div>

    </div>
  );
}
