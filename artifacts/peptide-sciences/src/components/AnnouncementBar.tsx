import { useState } from "react";
import { X } from "lucide-react";

const messages = [
  "⬡  OMNIQURE RESEARCH INSTITUTE  ·  ≥99% HPLC PURITY VERIFIED",
  "⬡  FREE SHIPPING ON ORDERS OVER £200  ·  UK & WORLDWIDE",
  "⬡  FULL COA + ESI-TOF MASS SPECTROMETRY DATA INCLUDED",
  "⬡  SSL ENCRYPTED CHECKOUT  ·  DISCREET COLD-CHAIN PACKAGING",
  "⬡  LYOPHILIZED PEPTIDES  ·  STABLE FROM DISPATCH TO DELIVERY",
  "⬡  RUO CERTIFIED  ·  IN-VITRO RESEARCH USE ONLY  ·  18+ REQUIRED",
];

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const doubled = [...messages, ...messages];

  return (
    <div
      className="relative overflow-hidden scan-overlay"
      style={{
        height: "34px",
        background: "linear-gradient(90deg, #020810 0%, #020D1E 40%, #03122A 60%, #020810 100%)",
        borderBottom: "1px solid rgba(0,212,255,0.2)",
      }}
    >
      {/* Neon accent line at very top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "linear-gradient(90deg, transparent 0%, #00D4FF 30%, #8B5CF6 70%, transparent 100%)",
          opacity: 0.7,
          zIndex: 2,
        }}
      />

      <div className="flex items-center h-full overflow-hidden" style={{ zIndex: 3, position: "relative" }}>
        <div className="animate-ticker flex-shrink-0 flex items-center" style={{ whiteSpace: "nowrap" }}>
          {doubled.map((msg, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                fontSize: "10.5px",
                fontWeight: 600,
                fontFamily: "'Share Tech Mono', monospace",
                color: "#7BBFD4",
                letterSpacing: "0.08em",
              }}
            >
              {msg}
              <span style={{ display: "inline-block", width: "1px", height: "10px", backgroundColor: "rgba(0,212,255,0.25)", margin: "0 36px", verticalAlign: "middle" }} />
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-full transition-all"
        style={{ width: "20px", height: "20px", opacity: 0.5, zIndex: 4, border: "none", background: "none", cursor: "pointer", color: "#00D4FF" }}
        aria-label="Close"
      >
        <X size={12} />
      </button>
    </div>
  );
}
