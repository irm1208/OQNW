import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      className="relative flex items-center justify-center px-10 py-2.5 text-center"
      style={{ background: "linear-gradient(90deg, #1240A0 0%, #1B5CB5 50%, #1240A0 100%)", color: "#fff" }}
    >
      <div className="flex items-center gap-5 flex-wrap justify-center" style={{ fontSize: "12px", fontWeight: 500, letterSpacing: "0.02em" }}>
        <span>🔬 <strong>99% HPLC Purity</strong> Guaranteed</span>
        <span style={{ opacity: 0.35 }}>|</span>
        <span>🚚 Free Shipping on Orders $200+</span>
        <span style={{ opacity: 0.35 }}>|</span>
        <span>🧪 Research Grade · Lab Certified</span>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 hover:opacity-100 transition-opacity"
        style={{ opacity: 0.6 }}
      >
        <X size={14} />
      </button>
    </div>
  );
}
