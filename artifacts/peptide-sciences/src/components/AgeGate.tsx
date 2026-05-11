import { useState, useEffect } from "react";
import { FlaskConical, ShieldCheck, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "omniqure_age_verified";
const CURRENT_VERSION = "1";

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
  const [checkedResearcher, setCheckedResearcher] = useState(false);
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

  const canEnter = checked18 && checkedResearcher;

  function handleEnter() {
    if (!canEnter) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
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
      {/* Subtle radial glow behind card */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(18, 64, 160, 0.22) 0%, transparent 70%)",
        }}
      />

      {/* Modal card */}
      <div
        className="relative w-full max-w-[480px] rounded-3xl overflow-hidden"
        style={{
          background: "#fff",
          boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        {/* Blue header band */}
        <div
          className="px-8 pt-8 pb-7 text-center"
          style={{ background: "linear-gradient(160deg, #071A4A 0%, #1240A0 100%)" }}
        >
          {/* Logo mark */}
          <div className="flex justify-center mb-4">
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 56, height: 56, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)" }}
            >
              <FlaskConical size={28} style={{ color: "#93C5FD" }} />
            </div>
          </div>

          {/* Brand */}
          <p className="font-bold text-xs uppercase tracking-[0.2em] mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>
            OmniQure Peptide Research Institute
          </p>

          {/* Age badge */}
          <div className="flex justify-center mb-3">
            <span
              className="font-black text-5xl"
              style={{
                color: "#fff",
                letterSpacing: "-2px",
                textShadow: "0 2px 20px rgba(147,197,253,0.4)",
              }}
            >
              18+
            </span>
          </div>

          <h1 className="font-bold text-white mb-1" style={{ fontSize: "20px" }}>
            Age & Research Verification
          </h1>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6" }}>
            This website sells research-grade peptides strictly for professional
            in-vitro laboratory use. Access is restricted.
          </p>
        </div>

        {/* RUO pill */}
        <div
          className="mx-6 -mt-3 rounded-xl px-4 py-2.5 flex items-center gap-2.5"
          style={{
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <AlertTriangle size={15} style={{ color: "#DC2626", flexShrink: 0 }} />
          <p className="text-xs font-medium leading-relaxed" style={{ color: "#991B1B" }}>
            Products are <strong>not</strong> approved for human or veterinary use. For in-vitro research only.
          </p>
        </div>

        {/* Checkboxes */}
        <div className="px-6 pt-5 pb-2 space-y-3">
          <label
            className="flex items-start gap-3 cursor-pointer rounded-xl p-3.5 transition-colors"
            style={{
              background: checked18 ? "#EEF4FF" : "#F8FAFC",
              border: `1.5px solid ${checked18 ? "#BFDBFE" : "#E2E8F0"}`,
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
                className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
                style={{
                  background: checked18 ? "#1240A0" : "#fff",
                  border: `2px solid ${checked18 ? "#1240A0" : "#CBD5E1"}`,
                }}
              >
                {checked18 && (
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                    <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm leading-relaxed" style={{ color: "#0F172A" }}>
              <strong>I confirm I am 18 years of age or older.</strong>
            </span>
          </label>

          <label
            className="flex items-start gap-3 cursor-pointer rounded-xl p-3.5 transition-colors"
            style={{
              background: checkedResearcher ? "#EEF4FF" : "#F8FAFC",
              border: `1.5px solid ${checkedResearcher ? "#BFDBFE" : "#E2E8F0"}`,
            }}
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={checkedResearcher}
                onChange={e => setCheckedResearcher(e.target.checked)}
                className="sr-only"
              />
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center transition-all"
                style={{
                  background: checkedResearcher ? "#1240A0" : "#fff",
                  border: `2px solid ${checkedResearcher ? "#1240A0" : "#CBD5E1"}`,
                }}
              >
                {checkedResearcher && (
                  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                    <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm leading-relaxed" style={{ color: "#0F172A" }}>
              <strong>I am a qualified researcher or scientist</strong> purchasing solely for legitimate in-vitro laboratory research purposes.
            </span>
          </label>
        </div>

        {/* Validation hint */}
        <div
          className="mx-6 mb-4 text-center text-xs transition-opacity"
          style={{
            color: "#94A3B8",
            opacity: canEnter ? 0 : 1,
            minHeight: "18px",
          }}
        >
          {!checked18 && !checkedResearcher
            ? "Please confirm both statements above to continue."
            : !checked18
            ? "Please confirm you are 18 or older."
            : "Please confirm your researcher status."}
        </div>

        {/* CTA buttons */}
        <div className="px-6 pb-6 space-y-3">
          <button
            onClick={handleEnter}
            className={`w-full font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all ${shake ? "animate-bounce" : ""}`}
            style={{
              background: canEnter
                ? "linear-gradient(135deg, #0D2565, #1B5CB5)"
                : "#CBD5E1",
              color: canEnter ? "#fff" : "#94A3B8",
              cursor: canEnter ? "pointer" : "not-allowed",
              fontSize: "15px",
              boxShadow: canEnter ? "0 4px 20px rgba(18,64,160,0.35)" : "none",
              transition: "all 0.2s ease",
            }}
          >
            {canEnter && <ShieldCheck size={18} />}
            Enter Site
          </button>

          <button
            onClick={handleExit}
            className="w-full font-medium py-3 rounded-xl transition-all hover:bg-slate-100"
            style={{
              background: "transparent",
              color: "#64748B",
              fontSize: "14px",
              border: "1.5px solid #E2E8F0",
            }}
          >
            I do not meet these requirements — Leave
          </button>
        </div>

        {/* Footer note */}
        <div
          className="px-6 pb-6 text-center text-xs leading-relaxed"
          style={{ color: "#94A3B8" }}
        >
          By entering, you agree to our{" "}
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
          . Your confirmation is stored in your browser for this device only.
        </div>
      </div>
    </div>
  );
}
