import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { getJanoshikVerifyUrl } from "@/components/COADocument";

interface JanoshikReportModalProps {
  taskNumber: string;
  verifyKey: string;
  image: string;
  productName: string;
  onClose: () => void;
}

export default function JanoshikReportModal({
  taskNumber,
  verifyKey,
  image,
  productName,
  onClose,
}: JanoshikReportModalProps) {
  const verifyUrl = getJanoshikVerifyUrl(taskNumber, verifyKey);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.72)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "#fff", borderRadius: "14px",
          maxWidth: "560px", width: "100%",
          maxHeight: "90vh", display: "flex", flexDirection: "column",
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 18px", borderBottom: "1px solid #E5E7EB", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* Janoshik logo mark */}
            <svg width="28" height="19" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 22 C2 22 2 11 8 11 C14 11 14 22 14 22" stroke="#1F2937" strokeWidth="2.3" strokeLinecap="round"/>
              <path d="M11 22 C11 22 11 3 18.5 3 C26 3 26 22 26 22"  stroke="#1F2937" strokeWidth="2.3" strokeLinecap="round"/>
              <path d="M23 22 C23 22 23 11 29 11 C35 11 35 22 35 22" stroke="#1F2937" strokeWidth="2.3" strokeLinecap="round"/>
            </svg>
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Janoshik Test Report</div>
              <div style={{ fontSize: "11px", color: "#6B7280" }}>{productName} · Task #{taskNumber}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", color: "#6B7280", lineHeight: 1 }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Report image */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          <img
            src={image}
            alt={`Janoshik test report #${taskNumber} for ${productName}`}
            style={{ width: "100%", display: "block" }}
          />
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 18px", borderTop: "1px solid #E5E7EB",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexShrink: 0, background: "#F9FAFB",
        }}>
          <span style={{ fontSize: "11px", color: "#6B7280" }}>
            Verify key: <span style={{ fontFamily: "monospace", color: "#374151" }}>{verifyKey}</span>
          </span>
          <a
            href={verifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontWeight: 600, color: "#1240A0",
              textDecoration: "none",
            }}
          >
            Verify on janoshik.com <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
