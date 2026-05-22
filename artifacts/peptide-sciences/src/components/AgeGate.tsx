import { useState, useEffect } from "react";
import { ShieldCheck, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "omniqure_age_verified";
const CURRENT_VERSION = "2";

function hasVerified(): boolean {
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
        background: "rgba(5, 15, 45, 0.97)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(18,64,160,0.22) 0%, transparent 70%)",
        }}
      />

      {/* Card */}
      <div
        className="relative w-full max-w-[440px] rounded-3xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Header */}
        <div
          className="px-8 pt-8 pb-7 text-center"
          style={{
            background: "linear-gradient(160deg, #071A4A 0%, #1240A0 100%)",
          }}
        >
          {/* OmniQure logo */}
          <div className="flex justify-center mb-5">
            <div style={{ overflow: "hidden", height: "48px" }}>
              <img
                src="/omniqure-logo-v2-transparent.png"
                alt="OmniQure"
                style={{
                  height: "80px",
                  width: "auto",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* 18+ badge */}
          <div className="flex justify-center mb-3">
            <span
              className="font-black"
              style={{
                fontSize: "56px",
                lineHeight: 1,
                color: "#fff",
                letterSpacing: "-3px",
                textShadow: "0 2px 24px rgba(147,197,253,0.45)",
              }}
            >
              18+
            </span>
          </div>

          <h1 className="font-bold text-white" style={{ fontSize: "19px" }}>
            Age Verification
          </h1>
        </div>

        {/* RUO pill — overlaps the header */}
        <div
          className="mx-6 -mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2.5"
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
          }}
        >
          <AlertTriangle size={15} style={{ color: "#DC2626", flexShrink: 0 }} />
          <p className="text-xs font-medium leading-relaxed" style={{ color: "#991B1B" }}>
            Products are <strong>not</strong> approved for human or veterinary
            use. For in-vitro research only.
          </p>
        </div>

        {/* Checkbox */}
        <div className="px-6 pt-5 pb-2">
          <label
            className="flex items-start gap-3 cursor-pointer rounded-xl p-3.5"
            style={{
              background: checked18 ? "#EEF4FF" : "#F8FAFC",
              border: `1.5px solid ${checked18 ? "#BFDBFE" : "#E2E8F0"}`,
              transition: "background 0.15s, border-color 0.15s",
            }}
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={checked18}
                onChange={e => setChecked18(e.target.checked)}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center"
                style={{
                  background: checked18 ? "#1240A0" : "#fff",
                  border: `2px solid ${checked18 ? "#1240A0" : "#CBD5E1"}`,
                  transition: "all 0.15s",
                }}
              >
                {checked18 && (
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                    <path
                      d="M1 4L4 7L10 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm leading-relaxed" style={{ color: "#0F172A" }}>
              <strong>I confirm I am 18 years of age or older.</strong>
            </span>
          </label>
        </div>

        {/* Validation hint */}
        <div
          className="mx-6 mb-4 mt-2 text-center text-xs"
          style={{
            color: "#94A3B8",
            minHeight: "16px",
            opacity: checked18 ? 0 : 1,
            transition: "opacity 0.2s",
          }}
        >
          Please confirm you are 18 or older to continue.
        </div>

        {/* Buttons */}
        <div className="px-6 pb-5 space-y-3">
          <button
            onClick={handleEnter}
            className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 ${shake ? "animate-bounce" : ""}`}
            style={{
              background: checked18
                ? "linear-gradient(135deg, #0D2565, #1B5CB5)"
                : "#CBD5E1",
              color: checked18 ? "#fff" : "#94A3B8",
              cursor: checked18 ? "pointer" : "not-allowed",
              fontSize: "15px",
              boxShadow: checked18
                ? "0 4px 20px rgba(18,64,160,0.35)"
                : "none",
              transition: "all 0.2s ease",
            }}
          >
            {checked18 && <ShieldCheck size={18} />}
            Enter Site
          </button>

          <button
            onClick={handleExit}
            className="w-full font-medium py-3 rounded-xl hover:bg-slate-50"
            style={{
              background: "transparent",
              color: "#64748B",
              fontSize: "14px",
              border: "1.5px solid #E2E8F0",
              transition: "background 0.15s",
            }}
          >
            I am under 18 — Leave
          </button>
        </div>

        {/* Footer */}
        <div
          className="px-6 pb-6 text-center text-xs leading-relaxed"
          style={{ color: "#94A3B8" }}
        >
          By entering you agree to our{" "}
          <a
            href="/terms"
            onClick={e => e.stopPropagation()}
            style={{ color: "#1B5CB5", textDecoration: "underline" }}
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="/privacy"
            onClick={e => e.stopPropagation()}
            style={{ color: "#1B5CB5", textDecoration: "underline" }}
          >
            Privacy Policy
          </a>
          . Stored in your browser for this device only.
        </div>
      </div>
    </div>
  );
}
