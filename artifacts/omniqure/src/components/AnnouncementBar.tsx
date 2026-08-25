import { useState } from "react";
import { X } from "lucide-react";

const messages = [
  "🔬  98%+ Verified Purity — Guaranteed on Every Product",
  "🎁  Refer a Friend — You Both Earn £25 Credit Each",
  "🚚  Free Shipping on Orders Over £50 — UK Only",
  "💊  Bundle & Save — 3-4 Vials Unlock a Free 10ml Bac Water Ampule",
];

export default function AnnouncementBar({ suppressed = false }: { suppressed?: boolean }) {
  const [visible, setVisible] = useState(true);
  if (!visible || suppressed) return null;

  const doubled = [...messages, ...messages];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #1847C2 0%, #2058D8 30%, #2B6FF5 55%, #2058D8 80%, #1847C2 100%)",
        height: "36px",
      }}
    >
      {/* Shimmer overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s linear infinite",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Scrolling ticker */}
      <div className="flex items-center h-full overflow-hidden" style={{ zIndex: 2, position: "relative" }}>
        <div
          className="animate-ticker flex-shrink-0 flex items-center"
          style={{ whiteSpace: "nowrap" }}
        >
          {doubled.map((msg, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "11.5px",
                fontWeight: 600,
                color: "#E2E8F0",
                letterSpacing: "0.025em",
                paddingRight: "0",
              }}
            >
              {msg}
              <span
                style={{
                  display: "inline-block",
                  width: "1px",
                  height: "12px",
                  backgroundColor: "rgba(255,255,255,0.2)",
                  margin: "0 32px",
                  verticalAlign: "middle",
                }}
              />
            </span>
          ))}
        </div>
      </div>

      {/* Close */}
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all hover:bg-white/10"
        style={{ width: "22px", height: "22px", opacity: 0.6, zIndex: 3, border: "none", background: "none", cursor: "pointer", color: "#fff" }}
        aria-label="Close"
      >
        <X size={13} />
      </button>
    </div>
  );
}
