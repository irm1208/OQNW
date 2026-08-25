import { useState } from "react";
import { ShoppingCart, Minus, Plus, ShieldCheck, Droplets, FlaskConical, Package } from "lucide-react";
import { useSEO } from "@/hooks/useSEO";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import type { Product } from "@/data/products";

const SIZES = [
  {
    label: "10ml",
    ref: "BW-10-ML",
    price: 8.99,
    id: "bw-10ml",
    name: "Bacteriostatic Water 10ml Ampule",
    slug: "bacteriostatic-water-10ml",
    category: "Accessories",
    image: "/bac-water-10ml.png",
  },
  {
    label: "30ml",
    ref: "BW-30-ML",
    price: 11.99,
    id: "bw-30ml",
    name: "Bacteriostatic Water 30ml",
    slug: "bacteriostatic-water-30ml",
    category: "Accessories",
    image: "/bac-water-30ml.webp",
  },
] as const;

const FEATURES = [
  { icon: Droplets,    label: "Sterile Water",               detail: "0.9% benzyl alcohol preserved" },
  { icon: FlaskConical, label: "For Research Use Only",      detail: "Not for human or veterinary use" },
  { icon: ShieldCheck, label: "Pharmaceutical Grade",        detail: "Endotoxin tested & sterile-filtered" },
  { icon: Package,     label: "Sealed Vial",                 detail: "Tamper-evident crimp top" },
];

export default function BacWaterPage() {
  useSEO({
    title: "Bacteriostatic Water for Peptide Reconstitution",
    description: "High-quality bacteriostatic water (BAC water) for peptide reconstitution. Available in 30ml and 10ml vials. Sterile, 0.9% benzyl alcohol preserved. Ships with all OmniQure peptide orders.",
    canonicalPath: "/bac-water",
  });
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const selected = SIZES[selectedIdx];

  function handleAdd() {
    const product: Product = {
      id: selected.id,
      name: selected.name,
      slug: selected.slug,
      price: selected.price,
      image: selected.image,
      category: selected.category,
    };
    for (let i = 0; i < qty; i++) addToCart(product, 1);
    toast({
      title: "Added to cart",
      description: `${qty} × ${selected.name}`,
    });
  }

  return (
    <div style={{ backgroundColor: "#F7FAFF", minHeight: "100vh" }}>
      {/* Hero / product section */}
      <div className="max-w-[1100px] mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* ── Image ── */}
          <div
            className="flex items-center justify-center rounded-3xl"
            style={{
              background: "#fff",
              border: "1.5px solid #E2E8F0",
              boxShadow: "0 8px 40px rgba(15,23,42,0.08)",
              padding: "40px",
              minHeight: "420px",
            }}
          >
            <img
              key={selected.image}
              src={selected.image}
              alt={selected.name}
              style={{
                maxWidth: "100%",
                maxHeight: "360px",
                objectFit: "contain",
                borderRadius: "12px",
                transition: "opacity 0.2s",
              }}
            />
          </div>

          {/* ── Info ── */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 mb-4" style={{
              backgroundColor: "#EFF6FF", border: "1px solid #BFDBFE",
              borderRadius: "6px", padding: "4px 12px",
            }}>
              <span style={{ fontSize: "10px", fontWeight: 800, color: "#1D4ED8", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Research Accessory
              </span>
            </div>

            <h1 style={{ fontSize: "clamp(26px,4vw,38px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "6px" }}>
              Bacteriostatic Water
            </h1>

            {/* REF */}
            <p style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 600, marginBottom: "20px" }}>
              REF&nbsp;
              <span style={{
                border: "1.5px solid #CBD5E1", borderRadius: "4px",
                padding: "1px 6px", fontSize: "12px", color: "#475569", fontWeight: 700,
              }}>
                {selected.ref}
              </span>
            </p>

            {/* Size selector */}
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
                Select Size
              </p>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedIdx}
                  onChange={e => setSelectedIdx(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "11px 38px 11px 14px",
                    borderRadius: "10px",
                    border: "2px solid #1240A0",
                    backgroundColor: "#EFF6FF",
                    color: "#1240A0",
                    fontSize: "15px",
                    fontWeight: 800,
                    fontFamily: "inherit",
                    appearance: "none",
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    cursor: "pointer",
                    outline: "none",
                    boxShadow: "0 2px 8px rgba(18,64,160,0.12)",
                  }}
                >
                  {SIZES.map((s, i) => (
                    <option key={s.label} value={i}>
                      {s.label} — £{s.price.toFixed(2)}
                    </option>
                  ))}
                </select>
                <svg
                  width="14" height="14" viewBox="0 0 24 24"
                  fill="none" stroke="#1240A0" strokeWidth="2.5"
                  style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "24px" }}>
              <span style={{ fontSize: "36px", fontWeight: 900, color: "#0D2565", lineHeight: 1 }}>
                £{selected.price.toFixed(2)}
              </span>
              <span style={{ fontSize: "13px", color: "#94A3B8", marginLeft: "8px" }}>per vial</span>
            </div>

            {/* Qty + Add */}
            <div style={{ marginBottom: "28px", display: "flex", gap: "12px", alignItems: "center" }}>
              {/* Qty stepper */}
              <div style={{
                display: "flex", alignItems: "center", gap: "0",
                border: "1.5px solid #E2E8F0", borderRadius: "10px",
                overflow: "hidden", backgroundColor: "#fff",
              }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "#475569" }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ minWidth: "32px", textAlign: "center", fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ padding: "12px 16px", background: "none", border: "none", cursor: "pointer", color: "#475569" }}
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                style={{
                  flex: 1,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  background: "linear-gradient(90deg, #0D2565 0%, #1240A0 100%)",
                  color: "#fff", border: "none", borderRadius: "10px",
                  padding: "14px 24px", fontSize: "15px", fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(13,37,101,0.3)",
                }}
              >
                <ShoppingCart size={17} />
                Add to Cart
              </button>
            </div>

            {/* Feature pills */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {FEATURES.map(({ icon: Icon, label, detail }) => (
                <div
                  key={label}
                  style={{
                    display: "flex", alignItems: "flex-start", gap: "10px",
                    backgroundColor: "#fff", border: "1px solid #E8EDF5",
                    borderRadius: "10px", padding: "12px 14px",
                  }}
                >
                  <Icon size={16} style={{ color: "#1240A0", marginTop: "2px", flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A" }}>{label}</p>
                    <p style={{ fontSize: "11px", color: "#64748B", marginTop: "1px" }}>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Info strip ── */}
        <div
          className="mt-14 rounded-2xl"
          style={{
            background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
            padding: "36px 40px",
            display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div>
            <h3 style={{ fontSize: "20px", fontWeight: 800, color: "#fff", marginBottom: "6px" }}>
              What is Bacteriostatic Water?
            </h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.75, maxWidth: "520px" }}>
              Bacteriostatic water is sterile water preserved with 0.9% benzyl alcohol, inhibiting bacterial growth.
              It is the standard solvent used to reconstitute lyophilised peptide vials for research purposes.
            </p>
          </div>
          <div style={{ display: "flex", gap: "32px", flexShrink: 0 }}>
            {[
              { num: "0.9%",   label: "Benzyl Alcohol" },
              { num: "USP",    label: "Grade Water" },
              { num: "Sterile", label: "Filtered" },
            ].map(stat => (
              <div key={stat.num} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "22px", fontWeight: 900, color: "#FBBF24", lineHeight: 1 }}>{stat.num}</p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.55)", marginTop: "4px", fontWeight: 600 }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Disclaimer ── */}
        <p className="text-center mt-8" style={{ fontSize: "11.5px", color: "#94A3B8", lineHeight: 1.7 }}>
          <strong style={{ color: "#64748B" }}>Research Use Only.</strong>{" "}
          This product is intended solely for laboratory and research purposes. Not for human or veterinary use.
          OmniQure Peptide Research Institute accepts no liability for misuse of this product.
        </p>
      </div>
    </div>
  );
}
