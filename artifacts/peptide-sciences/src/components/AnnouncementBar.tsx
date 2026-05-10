import { useState } from "react";
import { X } from "lucide-react";

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div
      className="relative flex items-center justify-center px-10 py-2 text-center text-white text-sm"
      style={{ backgroundColor: "#1B5CB5" }}
    >
      <span style={{ fontSize: "13px" }}>
        🔬 <strong>Research Peptides</strong> — 99% HPLC Purity Guaranteed | Free Shipping on Orders $200+
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
      >
        <X size={14} />
      </button>
    </div>
  );
}
