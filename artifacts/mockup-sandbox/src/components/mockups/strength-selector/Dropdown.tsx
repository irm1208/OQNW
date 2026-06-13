import { useState } from "react";
import { ShoppingCart, CheckCircle2, Heart, ChevronDown } from "lucide-react";

const variants = [
  { id: 1, strength: "5mg", price: 34.99 },
  { id: 2, strength: "10mg", price: 49.99 },
  { id: 3, strength: "20mg", price: 69.99 },
  { id: 4, strength: "40mg", price: 94.99 },
];

const BLUE = "#1240A0";
const BLUE_BG = "#EEF4FF";
const GRADIENT = "linear-gradient(90deg, #1240A0, #2563EB)";

export function Dropdown() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const selected = variants[selectedIdx];

  const handleAddToCart = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#F1F5F9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      <div style={{
        width: "300px",
        borderRadius: "18px",
        padding: "3px",
        background: "linear-gradient(135deg, rgba(99,149,255,0.45) 0%, rgba(147,187,255,0.25) 50%, rgba(99,149,255,0.45) 100%)",
        boxShadow: "0 0 18px rgba(99,149,255,0.25), 0 2px 12px rgba(15,23,42,0.06)",
      }}>
        <div style={{
          borderRadius: "15px",
          background: "#fff",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          {/* Accent bar */}
          <div style={{ height: "3px", background: GRADIENT, flexShrink: 0 }} />

          {/* Image area */}
          <div style={{
            background: `linear-gradient(160deg, #F8FAFE 0%, ${BLUE_BG} 100%)`,
            position: "relative",
            height: "180px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <button
              onClick={() => setWishlisted(w => !w)}
              style={{
                position: "absolute", top: "8px", right: "8px", zIndex: 10,
                width: "30px", height: "30px", borderRadius: "50%",
                backgroundColor: wishlisted ? "#FEF2F2" : "rgba(255,255,255,0.85)",
                border: wishlisted ? "1.5px solid #FECACA" : "1.5px solid #E2E8F0",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <Heart size={14} style={{ color: wishlisted ? "#DC2626" : "#94A3B8", fill: wishlisted ? "#DC2626" : "none" }} />
            </button>
            <img
              src="/__mockup/images/product.jpg"
              alt="BPC-157"
              style={{ width: "130px", height: "150px", objectFit: "contain", padding: "8px" }}
            />
          </div>

          {/* Info */}
          <div style={{ padding: "16px", borderTop: `1px solid ${BLUE}15` }}>
            {/* Category */}
            <span style={{
              display: "inline-block",
              fontSize: "10px", fontWeight: 700,
              color: BLUE, backgroundColor: BLUE_BG,
              padding: "3px 10px", borderRadius: "6px",
              letterSpacing: "0.05em", marginBottom: "8px", textTransform: "uppercase",
            }}>
              Healing Peptides
            </span>

            {/* Name */}
            <p style={{
              fontSize: "18px", fontWeight: 800, lineHeight: 1.25, marginBottom: "12px",
              background: "linear-gradient(120deg, #0D2565 0%, #1B5CB5 60%, #2563EB 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              BPC-157
            </p>

            {/* Strength label + dropdown */}
            <div style={{ marginBottom: "12px" }}>
              <label style={{
                fontSize: "10.5px", fontWeight: 700, color: "#64748B",
                textTransform: "uppercase", letterSpacing: "0.06em",
                display: "block", marginBottom: "5px",
              }}>
                Strength
              </label>
              <div style={{ position: "relative" }}>
                <select
                  value={selectedIdx}
                  onChange={e => { setSelectedIdx(Number(e.target.value)); setAdded(false); setQty(1); }}
                  style={{
                    width: "100%",
                    padding: "9px 36px 9px 12px",
                    borderRadius: "8px",
                    border: `1.5px solid ${BLUE}`,
                    backgroundColor: BLUE_BG,
                    color: BLUE,
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "inherit",
                    appearance: "none",
                    WebkitAppearance: "none",
                    cursor: "pointer",
                    outline: "none",
                  }}
                >
                  {variants.map((v, i) => (
                    <option key={v.id} value={i}>
                      {v.strength} — £{v.price.toFixed(2)}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  style={{
                    position: "absolute", right: "10px", top: "50%",
                    transform: "translateY(-50%)",
                    color: BLUE, pointerEvents: "none",
                  }}
                />
              </div>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "14px" }}>
              <span style={{ fontSize: "24px", fontWeight: 800, color: "#059669" }}>
                £{selected.price.toFixed(2)}
              </span>
            </div>

            {/* Qty + Add */}
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <div style={{
                display: "flex", alignItems: "center",
                border: "1.5px solid #E2E8F0", borderRadius: "8px",
                overflow: "hidden",
              }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ padding: "7px 10px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#64748B", fontFamily: "inherit" }}
                >−</button>
                <span style={{ padding: "7px 6px", fontSize: "13px", fontWeight: 700, minWidth: "24px", textAlign: "center" }}>{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  style={{ padding: "7px 10px", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#64748B", fontFamily: "inherit" }}
                >+</button>
              </div>
              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1, padding: "9px 12px", borderRadius: "8px",
                  backgroundColor: added ? "#059669" : BLUE,
                  color: "#fff", fontWeight: 700, fontSize: "13px",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                  fontFamily: "inherit",
                }}
              >
                {added
                  ? <><CheckCircle2 size={14} /> Added!</>
                  : <><ShoppingCart size={14} /> Add to Cart</>
                }
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
