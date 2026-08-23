import { useState, useEffect, useRef } from "react";
import { Shield, X, Cookie } from "lucide-react";
import { initPixels } from "@/lib/pixels";
import { useOverlayCoordinator } from "@/context/OverlayCoordinatorContext";

const STORAGE_KEY = "omniqure_consent";

export type ConsentState = "accepted" | "declined" | null;

export function getStoredConsent(): ConsentState {
  try { return localStorage.getItem(STORAGE_KEY) as ConsentState; }
  catch { return null; }
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const { registerBottomInset } = useOverlayCoordinator();

  useEffect(() => {
    const stored = getStoredConsent();
    if (!stored) setVisible(true);
  }, []);

  // Report our rendered height to the overlay coordinator so other fixed,
  // bottom-anchored elements (e.g. the chat bubble) can shift above us
  // instead of overlapping.
  useEffect(() => {
    if (!visible) {
      registerBottomInset("cookie-consent", 0);
      return;
    }
    const el = barRef.current;
    if (!el) return;
    const update = () => registerBottomInset("cookie-consent", el.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      observer.disconnect();
      registerBottomInset("cookie-consent", 0);
    };
  }, [visible, registerBottomInset]);

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, "accepted"); } catch {}
    setVisible(false);
    initPixels();
  }

  function decline() {
    try { localStorage.setItem(STORAGE_KEY, "declined"); } catch {}
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div ref={barRef} style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: "linear-gradient(135deg, #0D1F4E, #1240A0)",
      borderTop: "1px solid rgba(255,255,255,0.12)",
      boxShadow: "0 -8px 40px rgba(15,23,42,0.3)",
      padding: "16px 20px",
    }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", gap: "20px", alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flex: 1, minWidth: "240px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            background: "rgba(255,255,255,0.12)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Cookie size={18} color="rgba(255,255,255,0.85)" />
          </div>
          <div>
            <p style={{ margin: "0 0 2px", fontSize: "13.5px", fontWeight: 700, color: "#fff", fontFamily: "'Arimo', Arial, sans-serif" }}>
              We use cookies to improve your experience
            </p>
            <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.65)", lineHeight: 1.5, fontFamily: "'Arimo', Arial, sans-serif" }}>
              We use analytics and marketing cookies to personalise content and ads, and to analyse site traffic. These include Meta (Facebook &amp; Instagram) and TikTok pixels. You can accept all or decline non-essential cookies. See our{" "}
              <a href="/privacy" style={{ color: "rgba(255,255,255,0.85)", textDecoration: "underline" }}>Privacy Policy</a>.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexShrink: 0 }}>
          <button
            onClick={decline}
            style={{
              height: "38px", padding: "0 18px", borderRadius: "9px",
              border: "1.5px solid rgba(255,255,255,0.25)", background: "transparent",
              color: "rgba(255,255,255,0.8)", fontSize: "12.5px", fontWeight: 600,
              cursor: "pointer", fontFamily: "'Arimo', Arial, sans-serif",
              transition: "border-color 0.15s",
            }}
          >
            Decline Non-Essential
          </button>
          <button
            onClick={accept}
            style={{
              height: "38px", padding: "0 20px", borderRadius: "9px",
              border: "none", background: "#fff",
              color: "#1240A0", fontSize: "12.5px", fontWeight: 800,
              cursor: "pointer", fontFamily: "'Arimo', Arial, sans-serif",
              display: "flex", alignItems: "center", gap: "6px",
              boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
            }}
          >
            <Shield size={13} />
            Accept All Cookies
          </button>
          <button
            onClick={decline}
            aria-label="Close"
            style={{
              width: "34px", height: "34px", borderRadius: "8px",
              border: "1.5px solid rgba(255,255,255,0.2)", background: "transparent",
              color: "rgba(255,255,255,0.5)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
