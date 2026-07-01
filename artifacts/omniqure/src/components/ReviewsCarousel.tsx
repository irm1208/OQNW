import { useState, useEffect, useRef } from "react";
import { Star } from "lucide-react";

export type ReviewItem = {
  id: number;
  customerId: number;
  customerName: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
};

const AVATAR_COLORS = ["#1B5CB5","#059669","#7C3AED","#0E7490","#B45309","#DC2626","#0891B2","#65A30D"];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length];
}
function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2 ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase() : name.slice(0, 2).toUpperCase();
}

const REV_CARD_GAP = 16;

export default function ReviewsCarousel({ reviews }: { reviews: ReviewItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [cardW, setCardW] = useState(() => {
    if (typeof window === "undefined") return 380;
    return window.innerWidth < 640 ? Math.min(300, window.innerWidth - 48) : 520;
  });

  useEffect(() => {
    const update = () => setCardW(window.innerWidth < 640 ? Math.min(300, window.innerWidth - 48) : 520);
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);

  function scrollTo(idx: number) {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, reviews.length - 1));
    setActiveIdx(clamped);
    el.scrollTo({ left: clamped * (cardW + REV_CARD_GAP), behavior: "smooth" });
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    setActiveIdx(Math.round(el.scrollLeft / (cardW + REV_CARD_GAP)));
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => scrollTo(activeIdx - 1)}
        disabled={activeIdx === 0}
        style={{
          position: "absolute", left: "-18px", top: "45%", transform: "translateY(-50%)", zIndex: 10,
          width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #E2E8F0",
          background: activeIdx === 0 ? "#F8FAFC" : "#fff", cursor: activeIdx === 0 ? "default" : "pointer",
          color: activeIdx === 0 ? "#CBD5E1" : "#374151", fontSize: "20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.2s",
        }}
      >‹</button>

      <button
        onClick={() => scrollTo(activeIdx + 1)}
        disabled={activeIdx === reviews.length - 1}
        style={{
          position: "absolute", right: "-18px", top: "45%", transform: "translateY(-50%)", zIndex: 10,
          width: "38px", height: "38px", borderRadius: "50%", border: "1px solid #E2E8F0",
          background: activeIdx === reviews.length - 1 ? "#F8FAFC" : "#fff",
          cursor: activeIdx === reviews.length - 1 ? "default" : "pointer",
          color: activeIdx === reviews.length - 1 ? "#CBD5E1" : "#374151", fontSize: "20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "all 0.2s",
        }}
      >›</button>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{
          display: "flex", gap: `${REV_CARD_GAP}px`,
          overflowX: "auto", scrollSnapType: "x mandatory",
          paddingBottom: "8px", scrollbarWidth: "none",
          paddingLeft: "4px", paddingRight: "4px",
        }}
      >
        {reviews.map((r) => {
          const color = avatarColor(r.customerName);
          return (
            <div
              key={r.id}
              style={{
                minWidth: `${cardW}px`, maxWidth: `${cardW}px`,
                scrollSnapAlign: "start", flexShrink: 0,
                background: "#fff", border: "1px solid #E2E8F0",
                borderRadius: "16px", padding: "22px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                position: "relative", overflow: "hidden",
                display: "flex", flexDirection: "column",
              }}
            >
              <span style={{
                position: "absolute", top: "4px", right: "14px",
                fontSize: "60px", lineHeight: 1, fontFamily: "Georgia, serif",
                color, opacity: 0.08, fontWeight: 900, userSelect: "none",
              }}>"</span>

              <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={12} style={{ color: s < r.rating ? "#F59E0B" : "#E2E8F0", fill: s < r.rating ? "#F59E0B" : "#E2E8F0" }} />
                ))}
              </div>

              <p style={{ fontSize: "13px", fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>{r.title}</p>
              <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.7, flex: 1, marginBottom: "16px" }}>"{r.body}"</p>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", borderTop: "1px solid #F1F5F9", paddingTop: "12px" }}>
                <div style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  background: `linear-gradient(135deg, ${color}, ${color}99)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 800, color: "#fff", flexShrink: 0,
                  boxShadow: `0 3px 10px ${color}44`,
                }}>{initials(r.customerName)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A" }}>{r.customerName}</p>
                  <p style={{ fontSize: "10px", color: "#94A3B8", marginTop: "1px" }}>Verified Customer</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "7px", marginTop: "20px" }}>
        {reviews.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            style={{
              width: activeIdx === i ? "20px" : "7px",
              height: "7px", borderRadius: "4px", border: "none",
              background: activeIdx === i ? "#1B5CB5" : "#CBD5E1",
              cursor: "pointer", transition: "all 0.25s", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
