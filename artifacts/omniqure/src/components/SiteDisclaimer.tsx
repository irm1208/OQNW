import { useState } from "react";

const STORAGE_KEY = "omniqure_disclaimer_collapsed";

export default function SiteDisclaimer() {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  });

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch {}
  }

  return (
    <div
      style={{
        background: "#ffffff",
        padding: "16px 16px",
        fontFamily: "'Arimo', Arial, sans-serif",
      }}
    >
      <div
        className="max-w-[860px] mx-auto rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #0D2565 0%, #0F2E6B 50%, #0D2565 100%)",
          border: "1.5px solid rgba(232,169,62,0.20)",
          overflow: "hidden",
        }}
      >
        {/* Header — always visible, click to toggle */}
        <button
          onClick={toggle}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: collapsed ? "14px 32px" : "28px 32px 0 32px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            gap: "12px",
          }}
          aria-expanded={!collapsed}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#E8A93E",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Important — Please Read Before You Order
          </p>
          <span
            style={{
              color: "rgba(232,169,62,0.65)",
              fontSize: "13px",
              flexShrink: 0,
              transition: "transform 0.2s",
              transform: collapsed ? "rotate(0deg)" : "rotate(180deg)",
              display: "inline-block",
            }}
            aria-hidden
          >
            ▲
          </span>
        </button>

        {/* Body — hidden when collapsed */}
        {!collapsed && (
          <div style={{ padding: "18px 32px 28px" }}>
            {/* Intro */}
            <p style={{ fontSize: "13.5px", color: "#E8A93E", lineHeight: 1.75, marginBottom: "18px" }}>
              OmniQure sells research-grade peptides for lab use only. Ordering means you've read and agree to the terms below.
            </p>

            {/* Sections */}
            {[
              {
                label: "Research use only.",
                body: "Products are sold strictly for in-vitro lab and analytical use — never for human or animal consumption, or any medicinal, therapeutic, diagnostic, cosmetic or household purpose.",
              },
              {
                label: "Not medicines or consumer goods.",
                body: "Nothing we sell is a medicine, supplement, food or cosmetic, and none of it is approved for use in or on people or animals.",
              },
              {
                label: "Eligibility.",
                body: "You must be at least 18 and ordering as a qualified researcher for a professional or research purpose.",
              },
              {
                label: "Your responsibility.",
                body: "You're responsible for complying with all laws that apply to your purchase and use. We offer no usage advice and no guarantee of fitness for any purpose beyond lab research, and accept no liability for misuse or resulting loss or harm.",
              },
              {
                label: "Handling & returns.",
                body: "Returns are limited given the nature of these materials — see our Terms & Conditions for details on damaged, faulty or quality issues.",
              },
            ].map(({ label, body }) => (
              <p key={label} style={{ fontSize: "13.5px", color: "#E8A93E", lineHeight: 1.75, marginBottom: "14px" }}>
                <strong style={{ color: "#E8A93E", fontWeight: 700 }}>{label}</strong>{" "}
                {body}
              </p>
            ))}

            {/* Closing */}
            <p
              style={{
                fontSize: "12.5px",
                color: "rgba(232,169,62,0.65)",
                fontStyle: "italic",
                marginTop: "6px",
                lineHeight: 1.6,
              }}
            >
              Completing your purchase confirms that you have read and accepted these terms in full.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
