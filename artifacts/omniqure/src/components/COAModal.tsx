import { useState, useCallback, useEffect } from "react";
import { Download, X, ChevronUp, TestTube2, Microscope, ChevronLeft, ChevronRight } from "lucide-react";
import { getPurity, getPurityStr, getLotDates } from "@/utils/productPurity";
import { generateCOA } from "@/utils/generateCOA";
import { productDetails } from "@/data/productDetails";
import { parseBaseName, parseDeclaredMg, getActualMass } from "@/components/COADocument";
import COADocument from "@/components/COADocument";
import HplcChart from "@/components/HplcChart";
import MsChart from "@/components/MsChart";
import type { Product } from "@/data/products";

interface COAModalProps {
  product: Product;
  filteredProducts: Product[];
  onClose: () => void;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return isMobile;
}

export default function COAModal({ product, filteredProducts, onClose }: COAModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);
  const isMobile = useIsMobile();

  const purity     = getPurity(currentProduct.id);
  const purityStr  = getPurityStr(currentProduct.id);
  const { lot, received, analysis } = getLotDates(currentProduct.id);
  const declaredMg = parseDeclaredMg(currentProduct.name);
  const actualMass = getActualMass(currentProduct.id, declaredMg);
  const baseName   = parseBaseName(currentProduct.name);

  const currentIndex = filteredProducts.findIndex(p => p.id === currentProduct.id);
  const total        = filteredProducts.length;

  const goPrev = useCallback(() => {
    if (currentIndex > 0) setCurrentProduct(filteredProducts[currentIndex - 1]);
  }, [currentIndex, filteredProducts]);

  const goNext = useCallback(() => {
    if (currentIndex < total - 1) setCurrentProduct(filteredProducts[currentIndex + 1]);
  }, [currentIndex, total, filteredProducts]);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    try {
      const detail = productDetails[currentProduct.slug] ?? { id: currentProduct.id, description: "" };
      await generateCOA(currentProduct, detail);
    } finally {
      setIsDownloading(false);
    }
  }, [currentProduct]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  if (isMobile) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#0B1630",
        zIndex: 1000, display: "flex", flexDirection: "column",
        fontFamily: "'Arimo', Arial, sans-serif",
      }}>
        {/* Mobile top bar */}
        <div style={{
          flexShrink: 0, background: "#0B1630",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px",
        }}>
          {/* Row 1: name + close */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#fff", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {baseName}
            </p>
            <button onClick={onClose} style={{
              background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "6px",
              width: "32px", height: "32px", display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.7)", flexShrink: 0, marginLeft: "12px",
            }}>
              <X size={16} />
            </button>
          </div>

          {/* Row 2: purity + mass + download */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "7px", padding: "5px 10px" }}>
              <ChevronUp size={12} color="#4ADE80" />
              <span style={{ fontSize: "13px", fontWeight: 900, color: "#4ADE80" }}>{purityStr}</span>
            </div>
            {actualMass !== null && (
              <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
                <span style={{ fontSize: "16px", fontWeight: 900, color: "#fff" }}>{actualMass.toFixed(2)}</span>
                <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>mg</span>
              </div>
            )}
            {currentProduct.coaUrl && (
              <a
                href={currentProduct.coaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft: "auto", height: "36px", paddingInline: "14px", borderRadius: "8px",
                  background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.35)",
                  color: "#34D399", fontSize: "12px", fontWeight: 700,
                  display: "flex", alignItems: "center", gap: "6px",
                  textDecoration: "none", fontFamily: "'Arimo', Arial, sans-serif",
                }}
              >
                <Download size={13} />
                Lab PDF
              </a>
            )}
            <button
              onClick={() => void handleDownload()}
              disabled={isDownloading}
              style={{
                marginLeft: currentProduct.coaUrl ? "0" : "auto",
                height: "36px", paddingInline: "14px", borderRadius: "8px",
                background: isDownloading ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: isDownloading ? "rgba(255,255,255,0.3)" : "#fff",
                fontSize: "12px", fontWeight: 700, cursor: isDownloading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", gap: "6px",
                fontFamily: "'Arimo', Arial, sans-serif",
              }}
            >
              <Download size={13} />
              {isDownloading ? "Generating…" : "PDF"}
            </button>
          </div>

          {/* Row 3: navigation */}
          {total > 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button onClick={goPrev} disabled={currentIndex === 0} style={{
                flex: 1, height: "32px", borderRadius: "7px",
                border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                color: currentIndex === 0 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ChevronLeft size={16} />
              </button>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", minWidth: "40px", textAlign: "center" }}>
                {currentIndex + 1}/{total}
              </span>
              <button onClick={goNext} disabled={currentIndex === total - 1} style={{
                flex: 1, height: "32px", borderRadius: "7px",
                border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                color: currentIndex === total - 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)",
                cursor: currentIndex === total - 1 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile scrollable content */}
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", background: "#EEF1F6", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>

          <div style={{ background: "#fff", borderRadius: "12px", padding: "20px 18px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <COADocument product={currentProduct} />
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TestTube2 size={14} color="#1240A0" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>HPLC Chromatogram</p>
                <p style={{ margin: 0, fontSize: "10.5px", color: "#64748B" }}>Reverse-phase HPLC · UV at 214 nm</p>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <HplcChart productId={currentProduct.id} productName={currentProduct.name} />
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
              <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Microscope size={14} color="#059669" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>Mass Spectrometry</p>
                <p style={{ margin: 0, fontSize: "10.5px", color: "#64748B" }}>ESI-MS · confirms identity</p>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <MsChart
                productId={currentProduct.id}
                productName={currentProduct.name}
                molecularWeight={productDetails[currentProduct.slug]?.molecularWeight}
              />
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: "12px", padding: "18px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 14px", fontSize: "13px", fontWeight: 800, color: "#0F172A" }}>Purity Analysis Summary</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {[
                { label: "Target", value: purityStr, color: "#059669", bg: "#F0FDF4", border: "#BBF7D0" },
                { label: "Solvent", value: "0.3%", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
                { label: "Water", value: "≤1.0%", color: "#1240A0", bg: "#EEF4FF", border: "#BFDBFE" },
              ].map(row => (
                <div key={row.label} style={{ padding: "10px", borderRadius: "9px", background: row.bg, border: `1.5px solid ${row.border}` }}>
                  <p style={{ margin: "0 0 3px", fontSize: "9px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.05em" }}>{row.label}</p>
                  <p style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: row.color }}>{row.value}</p>
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: "10.5px", color: "rgba(0,0,0,0.3)", margin: "4px 0 8px" }}>
            Tap "PDF" to download a portable copy
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.78)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        fontFamily: "'Arimo', Arial, sans-serif",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "100%",
        maxWidth: "1060px",
        height: "92vh",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        boxShadow: "0 32px 96px rgba(0,0,0,0.7)",
      }}>

        {/* ── Left sidebar ── */}
        <div style={{
          width: "248px",
          flexShrink: 0,
          minHeight: 0,
          background: "#0B1630",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}>
          {/* Header row */}
          <div style={{
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            flexShrink: 0,
          }}>
            <p style={{
              margin: 0, fontSize: "13px", fontWeight: 800, color: "#fff",
              maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {baseName}
            </p>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "6px",
                width: "28px", height: "28px", display: "flex", alignItems: "center",
                justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.7)", flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Tags */}
          <div style={{ padding: "12px 16px 0", display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "9.5px", fontWeight: 600, padding: "2px 9px", borderRadius: "4px",
              background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)",
              display: "flex", alignItems: "center", gap: "4px",
            }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(255,255,255,0.3)", display: "inline-block" }} />
              VENDOR
            </span>
            <span style={{
              fontSize: "9.5px", fontWeight: 800, padding: "2px 10px",
              borderRadius: "4px", background: "#1240A0", color: "#fff",
            }}>
              OmniQure
            </span>
            <span style={{
              fontSize: "9.5px", fontWeight: 700, padding: "2px 10px", borderRadius: "4px",
              background: "rgba(99,102,241,0.18)", color: "rgba(165,170,255,0.9)",
            }}>
              MASS &amp; PURITY
            </span>
          </div>

          {/* Count */}
          <p style={{ margin: "8px 16px 0", fontSize: "11px", color: "rgba(255,255,255,0.28)" }}>
            {currentIndex + 1}/{total}
          </p>

          {/* Purity callout */}
          <div style={{ margin: "10px 16px 0", padding: "10px 12px", background: "rgba(74,222,128,0.1)", borderRadius: "8px", border: "1px solid rgba(74,222,128,0.2)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ChevronUp size={14} color="#4ADE80" />
              <span style={{ fontSize: "15px", fontWeight: 900, color: "#4ADE80" }}>{purityStr}</span>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#4ADE80" }}>— Good</span>
            </div>
          </div>

          {/* Lot + date */}
          <div style={{ margin: "10px 16px 0" }}>
            <p style={{ margin: 0, fontSize: "10.5px", color: "rgba(255,255,255,0.55)", fontFamily: "monospace" }}>
              {lot} · {analysis}
            </p>
            <p style={{ margin: "4px 0 0", fontSize: "10.5px", color: "rgba(255,255,255,0.32)" }}>
              Lab: OmniQure Labs · Vendor: OmniQure
            </p>
          </div>

          <div style={{ margin: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }} />

          {/* Purity row */}
          <div style={{ padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>Purity</span>
            <span style={{ fontSize: "14px", fontWeight: 900, color: "#4ADE80" }}>{purityStr}</span>
          </div>

          {/* Actual mass */}
          {actualMass !== null && (
            <div style={{
              margin: "0 16px", padding: "10px 12px",
              background: "rgba(255,255,255,0.05)", borderRadius: "8px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Actual Mass
              </span>
              <span style={{ fontSize: "16px", fontWeight: 900, color: "#fff" }}>
                {actualMass.toFixed(2)}<span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>mg</span>
              </span>
            </div>
          )}

          <div style={{ flex: 1 }} />

          {/* Download button */}
          <div style={{ padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            {currentProduct.coaUrl && (
              <a
                href={currentProduct.coaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "100%", height: "42px", borderRadius: "8px",
                  background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)",
                  color: "#34D399", fontSize: "12.5px", fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  textDecoration: "none", fontFamily: "'Arimo', Arial, sans-serif",
                }}
              >
                <Download size={14} />
                Download Lab PDF
              </a>
            )}
            <button
              onClick={() => void handleDownload()}
              disabled={isDownloading}
              style={{
                width: "100%", height: "42px", borderRadius: "8px",
                background: isDownloading ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: isDownloading ? "rgba(255,255,255,0.3)" : "#fff",
                fontSize: "12.5px", fontWeight: 700,
                cursor: isDownloading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                fontFamily: "'Arimo', Arial, sans-serif", transition: "background 0.15s",
              }}
              onMouseOver={e => { if (!isDownloading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.17)"; }}
              onMouseOut={e => { if (!isDownloading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
            >
              <Download size={14} />
              {isDownloading ? "Generating PDF…" : "Generate COA PDF"}
            </button>
          </div>

          {/* Pagination */}
          <div style={{ padding: "0 16px 16px", display: "flex", gap: "8px" }}>
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              style={{
                flex: 1, height: "34px", borderRadius: "7px",
                border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                color: currentIndex === 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.6)",
                fontSize: "18px", cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ‹
            </button>
            <button
              onClick={goNext}
              disabled={currentIndex === total - 1}
              style={{
                flex: 1, height: "34px", borderRadius: "7px",
                border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
                color: currentIndex === total - 1 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.6)",
                fontSize: "18px", cursor: currentIndex === total - 1 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ›
            </button>
          </div>

          {total > 1 && (
            <p style={{ margin: "0 0 12px", textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.18)" }}>
              ← → arrow keys to navigate
            </p>
          )}
        </div>

        {/* ── Right panel ── */}
        <div style={{
          flex: 1, minHeight: 0, background: "#EEF1F6", overflowY: "auto",
          padding: "24px", display: "flex", flexDirection: "column", gap: "16px",
        }}>

          {/* COA Certificate */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "32px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)" }}>
            <COADocument product={currentProduct} />
          </div>

          {/* HPLC Chart */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TestTube2 size={16} color="#1240A0" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>HPLC Chromatogram</p>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#64748B" }}>Reverse-phase HPLC · UV detection at 214 nm</p>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <HplcChart productId={currentProduct.id} productName={currentProduct.name} />
            </div>
          </div>

          {/* MS Chart */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Microscope size={16} color="#059669" />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>Mass Spectrometry</p>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#64748B" }}>ESI-MS · confirms molecular weight and identity</p>
              </div>
            </div>
            <div style={{ overflowX: "auto" }}>
              <MsChart
                productId={currentProduct.id}
                productName={currentProduct.name}
                molecularWeight={productDetails[currentProduct.slug]?.molecularWeight}
              />
            </div>
          </div>

          {/* Purity breakdown */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>Purity Analysis Summary</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
              {[
                { label: "Target Compound", value: purityStr, color: "#059669", bg: "#F0FDF4", border: "#BBF7D0" },
                { label: "Solvent / Other", value: "0.3%", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
                { label: "Water Content", value: "≤1.0%", color: "#1240A0", bg: "#EEF4FF", border: "#BFDBFE" },
              ].map(row => (
                <div key={row.label} style={{ padding: "14px", borderRadius: "10px", background: row.bg, border: `1.5px solid ${row.border}` }}>
                  <p style={{ margin: "0 0 4px", fontSize: "10.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</p>
                  <p style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: row.color }}>{row.value}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "14px", padding: "12px 16px", borderRadius: "10px", background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
              <p style={{ margin: 0, fontSize: "12px", color: "#475569", lineHeight: 1.6 }}>
                <strong style={{ color: "#0F172A" }}>Testing Methodology:</strong> All peptides are tested using reverse-phase HPLC with UV detection at 214 nm and electrospray ionisation mass spectrometry (ESI-MS). Results are lot-specific. For laboratory research use only — not for human or veterinary use.
              </p>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(0,0,0,0.28)", margin: 0 }}>
            Use "Download COA PDF" in the sidebar to save as a portable file
          </p>
        </div>
      </div>
    </div>
  );
}
