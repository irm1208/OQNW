import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Download, X, ExternalLink } from "lucide-react";

interface JanoshikReportModalProps {
  taskNumber: string;
  verifyKey: string;
  verifyUrl: string;
  image: string;
  certificatePdf?: string;
  productName: string;
  onClose: () => void;
}

export default function JanoshikReportModal({
  taskNumber,
  verifyKey,
  verifyUrl,
  image,
  certificatePdf,
  productName,
  onClose,
}: JanoshikReportModalProps) {

  // Portal target — evaluated lazily so it only runs in the browser
  const [portalTarget] = useState<Element | null>(() =>
    typeof document !== "undefined" ? document.body : null
  );

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

  if (!portalTarget) return null;

  return createPortal(
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
          height: "90vh", display: "flex", flexDirection: "column",
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
            <img src="/janoshik/janoshik-logo.jpg" alt="Janoshik" style={{ height: "22px", width: "auto", borderRadius: "3px", display: "block" }} />
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

        {/* Report image — explicit calc height so it never scrolls */}
        <div style={{ flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#F9FAFB", padding: "8px", overflow: "hidden" }}>
          <img
            src={image}
            alt={`Janoshik test report #${taskNumber} for ${productName}`}
            style={{
              maxWidth: "100%",
              height: "calc(90vh - 130px)",
              objectFit: "contain",
              display: "block",
              borderRadius: "6px",
            }}
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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "12px", flexWrap: "wrap" }}>
            {certificatePdf && (
              <a
                href={certificatePdf}
                download
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  fontSize: "12px", fontWeight: 600, color: "#1240A0",
                  textDecoration: "none",
                }}
              >
                Download PDF <Download size={13} />
              </a>
            )}
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
    </div>,
    portalTarget
  );
}
