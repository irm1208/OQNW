import { useState } from "react";
import { X } from "lucide-react";

const messages = [
  "99%+ independently verified purity",
  "Refer a friend — you both earn £25 credit",
  "Free standard UK shipping",
  "Bundle & save — free 10ml bac water with 3+ vials",
  "Same-day dispatch, Mon–Fri",
];

export default function AnnouncementBar({ suppressed = false }: { suppressed?: boolean }) {
  const [visible, setVisible] = useState(true);
  if (!visible || suppressed) return null;

  const doubled = [...messages, ...messages];

  return (
    <div className="relative overflow-hidden select-none" style={{ backgroundColor: "var(--cobalt)", color: "#fff" }}>
      <div className="flex h-9 items-center overflow-hidden">
        <div
          className="animate-ticker flex w-max shrink-0 items-center whitespace-nowrap"
          style={{ fontSize: "11.5px", fontWeight: 500, letterSpacing: "0.025em" }}
          aria-hidden="true"
        >
          {doubled.map((msg, i) => (
            <span key={i} className="flex items-center">
              <span>{msg}</span>
              <span className="mx-6 h-1 w-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.45)" }} />
            </span>
          ))}
        </div>
        <span className="sr-only">{messages.join(". ")}</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 z-10 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full transition-colors"
        style={{ color: "rgba(255,255,255,0.7)", backgroundColor: "var(--cobalt)", border: "none", cursor: "pointer" }}
        aria-label="Dismiss announcement"
      >
        <X size={13} />
      </button>
    </div>
  );
}
