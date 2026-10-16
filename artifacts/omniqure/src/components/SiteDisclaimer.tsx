import { useState } from "react";
import { useLocation } from "wouter";

const STORAGE_KEY = "omniqure_disclaimer_collapsed";
const ALLOWED_PATHS = new Set(["/", "/cart", "/checkout"]);

export default function SiteDisclaimer() {
  const [location] = useLocation();
  // All hooks must be called unconditionally before any early return
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  });

  if (!ALLOWED_PATHS.has(location)) return null;

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    try { localStorage.setItem(STORAGE_KEY, next ? "1" : "0"); } catch {}
  }

  return (
    <div
      style={{
        background: "rgba(239,244,252,0.3)",
        borderBottom: "1px solid var(--hairline)",
        fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        className="w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 pb-10 lg:pb-14"
      >
      <div
        className="max-w-3xl rounded-xl bg-white"
        style={{ border: "1px solid var(--hairline)", overflow: "hidden" }}
      >
        {/* Header — always visible, click to toggle */}
        <button
          onClick={toggle}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: collapsed ? "14px 24px" : "20px 24px 0 24px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            gap: "12px",
          }}
          aria-expanded={!collapsed}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: "#4A5672",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Important — Please Read Before You Order
          </p>
          <span
            style={{
              color: "var(--graphite)",
              fontSize: "10px",
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
          <div style={{ padding: "14px 24px 20px" }}>
            {/* Intro */}
            <p style={{ fontSize: "12.5px", color: "rgba(74,85,104,0.8)", lineHeight: 1.9, marginBottom: "12px" }}>
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
              <p key={label} style={{ fontSize: "12.5px", color: "rgba(74,85,104,0.8)", lineHeight: 1.9, marginBottom: "10px" }}>
                <strong style={{ color: "#1D2948", fontWeight: 600 }}>{label}</strong>{" "}
                {body}
              </p>
            ))}

            {/* Closing */}
            <p
              style={{
                fontSize: "11.5px",
                color: "var(--graphite)",
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
    </div>
  );
}
