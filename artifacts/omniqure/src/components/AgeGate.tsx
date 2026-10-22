import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "omniqure_age_verified";
const CURRENT_VERSION = "2";

// Dispatched on the window the moment a visitor clears the age gate, so other
// overlays (e.g. the chat bubble) can wait to appear until the page is
// actually usable instead of racing the gate on their own timer.
export const AGE_VERIFIED_EVENT = "omniqure:age-verified";

export function hasVerified(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === CURRENT_VERSION;
  } catch {
    return false;
  }
}

function setVerified() {
  try {
    localStorage.setItem(STORAGE_KEY, CURRENT_VERSION);
  } catch {}
  try {
    window.dispatchEvent(new Event(AGE_VERIFIED_EVENT));
  } catch {}
}

export default function AgeGate() {
  const [visible, setVisible] = useState(false);
  const [checked18, setChecked18] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!hasVerified()) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  function handleEnter() {
    if (!checked18) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    setVerified();
    document.body.style.overflow = "";
    setVisible(false);
  }

  function handleExit() {
    window.location.href = "https://www.google.com";
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #1E3A5F 100%)",
      }}
    >
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 1px, #fff 1px, #fff 2px),
                            repeating-linear-gradient(90deg, transparent, transparent 1px, #fff 1px, #fff 2px)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-[480px] rounded-2xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
        }}
      >
        {/* Header */}
        <div className="px-8 pt-10 pb-8 text-center border-b" style={{ borderColor: "#E8ECF1" }}>
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/omniqure-wordmark.png?v=4"
              alt="OmniQure"
              style={{ width: "280px", maxWidth: "75vw", height: "auto", display: "block", opacity: 0.92 }}
            />
          </div>

          {/* 18+ badge */}
          <div
            className="inline-flex items-center justify-center mb-4"
            style={{
              width: "88px",
              height: "88px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #2F4F8F 0%, #4E68C2 100%)",
              boxShadow: "0 8px 24px rgba(47, 79, 140, 0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            <span
              className="font-black"
              style={{
                fontSize: "42px",
                lineHeight: 1,
                color: "#fff",
                letterSpacing: "-2px",
              }}
            >
              18+
            </span>
          </div>

          <h1
            className="font-bold mb-2"
            style={{
              fontSize: "22px",
              color: "var(--ink)",
              letterSpacing: "-0.02em",
            }}
          >
            Age Verification Required
          </h1>
          <p
            className="leading-relaxed"
            style={{
              fontSize: "13.5px",
              color: "var(--graphite)",
              maxWidth: "380px",
              margin: "0 auto",
            }}
          >
            You must be 18 years or older to access this site
          </p>
        </div>

        {/* RUO notice */}
        <div
          className="mx-6 mt-6 rounded-xl px-4 py-3 flex items-start gap-3"
          style={{
            background: "#FEF8F2",
            border: "1px solid #FDE4CC",
          }}
        >
          <AlertTriangle size={16} style={{ color: "#D97706", flexShrink: 0, marginTop: "1px" }} />
          <p className="text-xs leading-relaxed" style={{ color: "#78350F" }}>
            <strong className="font-semibold">Research use only.</strong> Products are not approved for human or veterinary use. For in-vitro laboratory research purposes only.
          </p>
        </div>

        {/* Checkbox */}
        <div className="px-6 pt-5 pb-3">
          <label
            className="flex items-start gap-3.5 cursor-pointer rounded-xl p-4 border-2 transition-all"
            style={{
              background: checked18 ? "#F0F4FF" : "#FAFBFC",
              borderColor: checked18 ? "#4E68C2" : "#E2E8F0",
            }}
          >
            <div className="relative flex-shrink-0 mt-[2px]">
              <input
                type="checkbox"
                checked={checked18}
                onChange={e => setChecked18(e.target.checked)}
                className="sr-only"
              />
              <div
                className="w-[22px] h-[22px] rounded-md flex items-center justify-center transition-all"
                style={{
                  background: checked18 ? "#4E68C2" : "#fff",
                  border: `2px solid ${checked18 ? "#4E68C2" : "#CBD5E1"}`,
                  boxShadow: checked18 ? "0 2px 8px rgba(78, 104, 194, 0.3)" : "none",
                }}
              >
                {checked18 && (
                  <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                    <path
                      d="M1 4.5L4.5 8L11 1.5"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="leading-relaxed" style={{ fontSize: "14.5px", color: "var(--ink)" }}>
              I confirm I am <strong className="font-semibold">18 years of age or older</strong>
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-6 pt-2 space-y-2.5">
          <button
            onClick={handleEnter}
            disabled={!checked18}
            className={`w-full font-semibold py-4 rounded-xl flex items-center justify-center gap-2.5 transition-all ${
              shake ? "animate-bounce" : ""
            }`}
            style={{
              background: checked18 ? "var(--cobalt)" : "#E2E8F0",
              color: checked18 ? "#fff" : "#94A3B8",
              cursor: checked18 ? "pointer" : "not-allowed",
              fontSize: "15px",
              boxShadow: checked18 ? "0 4px 16px rgba(59, 98, 171, 0.3)" : "none",
            }}
          >
            {checked18 && <ShieldCheck size={19} strokeWidth={2.2} />}
            Enter Site
          </button>

          <button
            onClick={handleExit}
            className="w-full font-medium py-3.5 rounded-xl transition-colors hover:bg-slate-50"
            style={{
              background: "transparent",
              color: "#64748B",
              fontSize: "14px",
              border: "1.5px solid #E2E8F0",
            }}
          >
            I am under 18 — Leave
          </button>
        </div>

        {/* Footer */}
        <div
          className="px-6 pb-6 text-center leading-relaxed border-t pt-5"
          style={{ fontSize: "11.5px", color: "#94A3B8", borderColor: "#F1F3F5" }}
        >
          By entering you agree to our{" "}
          <a
            href="/terms"
            onClick={e => e.stopPropagation()}
            className="font-medium"
            style={{ color: "var(--cobalt)", textDecoration: "underline", textUnderlineOffset: "2px" }}
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            onClick={e => e.stopPropagation()}
            className="font-medium"
            style={{ color: "var(--cobalt)", textDecoration: "underline", textUnderlineOffset: "2px" }}
          >
            Privacy Policy
          </a>
          . Verification stored locally in your browser.
        </div>
      </div>
    </div>
  );
}
