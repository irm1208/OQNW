import { useState, useEffect, useRef } from "react";
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

  const font = "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif";

  return (
    <div
      ref={barRef}
      role="region"
      aria-label="Cookie consent"
      style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, padding: "0 16px 16px", pointerEvents: "none" }}
    >
      <div
        style={{
          pointerEvents: "auto",
          maxWidth: "900px", margin: "0 auto",
          background: "#1D2948", color: "#fff",
          borderRadius: "16px",
          boxShadow: "0 20px 50px -12px rgba(11,18,32,0.45)",
          padding: "18px 24px",
          display: "flex", gap: "16px 24px", alignItems: "center", flexWrap: "wrap",
          fontFamily: font,
        }}
      >
        <p style={{ margin: 0, flex: "1 1 320px", fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.8)" }}>
          We use analytics and marketing cookies, including Meta (Facebook &amp; Instagram) and TikTok pixels, to analyse traffic and improve the site. See our{" "}
          <a href="/privacy" style={{ color: "#fff", textDecoration: "underline", textUnderlineOffset: "2px" }}>privacy policy</a>.
        </p>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexShrink: 0 }}>
          <button
            onClick={decline}
            style={{
              height: "40px", padding: "0 18px", borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.2)", background: "transparent",
              color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: font,
            }}
          >
            Reject non-essential
          </button>
          <button
            onClick={accept}
            style={{
              height: "40px", padding: "0 20px", borderRadius: "10px",
              border: "none", background: "#0A2472",
              color: "#fff", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: font,
            }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
