import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { getPurity, getPurityStr, getLotDates } from "@/utils/productPurity";
import { generateCOA } from "@/utils/generateCOA";
import { productDetails } from "@/data/productDetails";
import { useSEO } from "@/hooks/useSEO";
import { Search, Download, CheckCircle2, FileText, X, ChevronUp, TestTube2, Microscope } from "lucide-react";
import type { Product } from "@/data/products";
import HplcChart from "@/components/HplcChart";
import MsChart from "@/components/MsChart";
import COADocument, { parseBaseName, parseDeclaredMg, getActualMass } from "@/components/COADocument";
import COAModal from "@/components/COAModal";

const CATEGORIES = [
  "All", "Growth Peptides", "Healing Peptides", "Weight Management",
  "Longevity Peptides", "Nootropics", "Cellular Health", "Hormonal Peptides",
  "Skin & Repair", "Immune Support", "Research Peptides", "Peptide Blends",
  "Anti-Inflammatory", "Cognitive Peptides", "Growth Hormone",
];



function ReportModal({
  product,
  filteredProducts,
  onClose,
}: {
  product: Product;
  filteredProducts: Product[];
  onClose: () => void;
}) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(product);

  const purity = getPurity(currentProduct.id);
  const { lot, analysis } = getLotDates(currentProduct.id);
  const declaredMg = parseDeclaredMg(currentProduct.name);
  const actualMass = declaredMg !== null ? getActualMass(currentProduct.id, declaredMg) : null;
  const baseName = parseBaseName(currentProduct.name);

  const currentIndex = filteredProducts.findIndex(p => p.id === currentProduct.id);
  const total = filteredProducts.length;

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
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose, goPrev, goNext]);

  const blue = "#1240A0";

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
        maxHeight: "92vh",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        boxShadow: "0 32px 96px rgba(0,0,0,0.7)",
      }}>

        {/* ── Left sidebar ── */}
        <div style={{
          width: "248px",
          flexShrink: 0,
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
              margin: 0,
              fontSize: "13px",
              fontWeight: 800,
              color: "#fff",
              maxWidth: "160px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}>
              {baseName}
            </p>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "rgba(255,255,255,0.7)",
                flexShrink: 0,
              }}
            >
              <X size={14} />
            </button>
          </div>

          {/* Tags */}
          <div style={{ padding: "12px 16px 0", display: "flex", gap: "6px", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "9.5px", fontWeight: 700, padding: "2px 10px",
              borderRadius: "4px",
              background: "rgba(99,102,241,0.18)",
              color: "rgba(165,170,255,0.9)",
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
              <span style={{ fontSize: "15px", fontWeight: 900, color: "#4ADE80" }}>{purity.toFixed(3)}%</span>
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

          {/* Divider */}
          <div style={{ margin: "14px 16px", borderTop: "1px solid rgba(255,255,255,0.07)" }} />

          {/* Purity row */}
          <div style={{ padding: "0 16px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>Purity</span>
            <span style={{ fontSize: "14px", fontWeight: 900, color: "#4ADE80" }}>{purity.toFixed(3)}%</span>
          </div>

          {/* Actual mass */}
          {actualMass !== null && (
            <div style={{
              margin: "0 16px",
              padding: "10px 12px",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Actual Mass
              </span>
              <span style={{ fontSize: "16px", fontWeight: 900, color: "#fff" }}>
                {actualMass.toFixed(2)}<span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>mg</span>
              </span>
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Download button */}
          <div style={{ padding: "16px" }}>
            <button
              onClick={() => void handleDownload()}
              disabled={isDownloading}
              style={{
                width: "100%",
                height: "42px",
                borderRadius: "8px",
                background: isDownloading ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: isDownloading ? "rgba(255,255,255,0.3)" : "#fff",
                fontSize: "12.5px",
                fontWeight: 700,
                cursor: isDownloading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                fontFamily: "'Arimo', Arial, sans-serif",
                transition: "background 0.15s",
              }}
              onMouseOver={e => { if (!isDownloading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.17)"; }}
              onMouseOut={e => { if (!isDownloading) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.1)"; }}
            >
              <Download size={14} />
              {isDownloading ? "Generating PDF…" : "Download COA PDF"}
            </button>
          </div>

          {/* Pagination */}
          <div style={{
            padding: "0 16px 16px",
            display: "flex",
            gap: "8px",
          }}>
            <button
              onClick={goPrev}
              disabled={currentIndex === 0}
              style={{
                flex: 1, height: "34px", borderRadius: "7px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: currentIndex === 0 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.6)",
                fontSize: "18px",
                cursor: currentIndex === 0 ? "not-allowed" : "pointer",
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
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: currentIndex === total - 1 ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.6)",
                fontSize: "18px",
                cursor: currentIndex === total - 1 ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              ›
            </button>
          </div>

          <p style={{ margin: "0 0 12px", textAlign: "center", fontSize: "10px", color: "rgba(255,255,255,0.18)" }}>
            ← → arrow keys to navigate
          </p>
        </div>

        {/* ── Right panel ── */}
        <div style={{
          flex: 1,
          background: "#EEF1F6",
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
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
                molecularWeight={productDetails[currentProduct.id]?.molecularWeight}
              />
            </div>
          </div>

          {/* Purity breakdown */}
          <div style={{ background: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>Purity Analysis Summary</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
              {[
                { label: "Target Compound", value: `${getPurity(currentProduct.id).toFixed(1)}%` },
                { label: "Solvent / Other", value: "0.3%" },
                { label: "Water Content", value: "≤1.0%" },
              ].map(row => (
                <div key={row.label} style={{ padding: "14px", borderRadius: "10px", background: "linear-gradient(135deg, #0D2565 0%, #1240A0 50%, #1B5CB5 100%)", border: "1.5px solid rgba(255,255,255,0.10)" }}>
                  <p style={{ margin: "0 0 4px", fontSize: "10.5px", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</p>
                  <p style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: "#fff" }}>{row.value}</p>
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

// ─── Main page ────────────────────────────────────────────────────────────────

export default function LabTestsPage() {
  useSEO({
    title: "Lab Results | OmniQure",
    description:
      "Independent COA tests for all OmniQure peptides. HPLC purity, mass spectrometry, and downloadable certificates of analysis.",
    canonicalPath: "/lab-tests",
  });

  const [, navigate] = useLocation();
  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, search, category]);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* Modal */}
      {selectedProduct && (
        <COAModal
          product={selectedProduct}
          filteredProducts={filtered}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      {/* Top bar */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "24px 24px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>

          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
            <div style={{
              width: "46px", height: "46px", borderRadius: "12px",
              background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, boxShadow: "0 4px 16px rgba(18,64,160,0.4)",
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
                Lab Results
              </h1>
              <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.38)" }}>
                Independent &amp; vendor CoA tests &nbsp;·&nbsp; {products.length} reports
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "28px 24px" }}>

        <>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "16px", maxWidth: "640px" }}>
              <Search size={15} style={{
                position: "absolute", left: "14px", top: "50%",
                transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none",
              }} />
              <input
                type="text"
                placeholder="Search compound or batch..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", height: "44px", paddingLeft: "42px", paddingRight: "16px",
                  borderRadius: "10px", border: "1.5px solid #E2E8F0",
                  outline: "none", fontSize: "14px", fontFamily: "'Arimo', Arial, sans-serif",
                  background: "#fff", color: "#0F172A", boxSizing: "border-box",
                }}
              />
            </div>

            {/* Category chips */}
            <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "28px" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "5px 14px", borderRadius: "20px",
                    border: "1px solid",
                    borderColor: category === cat ? "#1240A0" : "#E2E8F0",
                    background: category === cat ? "linear-gradient(90deg, #0D2565, #1B5CB5)" : "#fff",
                    color: category === cat ? "#fff" : "#475569",
                    fontSize: "11.5px", fontWeight: category === cat ? 700 : 500,
                    cursor: "pointer", fontFamily: "'Arimo', Arial, sans-serif",
                    transition: "all 0.15s", whiteSpace: "nowrap",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Count label */}
            <p style={{
              margin: "0 0 18px", fontSize: "11.5px",
              color: "#94A3B8", letterSpacing: "0.04em",
              textTransform: "uppercase", fontWeight: 700,
            }}>
              {filtered.length} report{filtered.length !== 1 ? "s" : ""}
              {category !== "All" ? ` · ${category}` : ""}
            </p>

            {/* Card grid */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "80px 20px", color: "#94A3B8" }}>
                <p style={{ fontSize: "16px", fontWeight: 700 }}>No results found</p>
                <p style={{ fontSize: "13px", marginTop: "8px" }}>Try adjusting your search or category filter.</p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "14px" }}>
                {filtered.map((product) => {
                  const purity = getPurity(product.id);
                  const purityStr = getPurityStr(product.id);
                  const { lot, analysis } = getLotDates(product.id);
                  const declaredMg = parseDeclaredMg(product.name);
                  const actualMass = getActualMass(product.id, declaredMg);
                  const baseName = parseBaseName(product.name);

                  return (
                    <div
                      key={product.id}
                      style={{
                        background: "#fff",
                        borderRadius: "14px",
                        border: "1.5px solid #E8EDF5",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        transition: "border-color 0.2s, box-shadow 0.2s",
                        boxShadow: "0 2px 12px rgba(15,23,42,0.06)",
                      }}
                      onMouseOver={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "#C7D7F5";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(18,64,160,0.12)";
                      }}
                      onMouseOut={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "#E8EDF5";
                        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(15,23,42,0.06)";
                      }}
                    >
                      {/* Card header */}
                      <div style={{
                        padding: "9px 14px",
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        borderBottom: "1px solid #F1F5F9",
                      }}>
                        <span style={{ fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.12em", color: "#94A3B8", textTransform: "uppercase" }}>
                          Certificate of Analysis
                        </span>
                        <CheckCircle2 size={13} color="#22C55E" />
                      </div>

                      {/* Compound name */}
                      <div style={{ padding: "10px 14px 0" }}>
                        <h3 style={{ margin: 0, fontSize: "21px", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
                          {baseName}
                        </h3>
                        {declaredMg && (
                          <span style={{ fontSize: "10.5px", color: "#94A3B8", marginTop: "3px", display: "block" }}>
                            {declaredMg} mg declared
                          </span>
                        )}
                      </div>

                      {/* Purity + Mass */}
                      <div style={{ padding: "14px 14px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                        <div>
                          <p style={{ margin: "0 0 3px", fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.1em", color: "#64748B", textTransform: "uppercase" }}>
                            Purity
                          </p>
                          <p style={{ margin: 0, lineHeight: 1 }}>
                            <span style={{ fontSize: "30px", fontWeight: 900, color: "#16A34A", letterSpacing: "-0.03em" }}>
                              {purityStr.replace("%", "")}
                            </span>
                            <span style={{ fontSize: "16px", fontWeight: 800, color: "#16A34A", marginLeft: "1px" }}>%</span>
                          </p>
                        </div>
                        {actualMass !== null && (
                          <div style={{ textAlign: "right" }}>
                            <p style={{ margin: "0 0 3px", fontSize: "8.5px", fontWeight: 700, letterSpacing: "0.1em", color: "#64748B", textTransform: "uppercase" }}>
                              Actual Mass
                            </p>
                            <p style={{ margin: 0, lineHeight: 1 }}>
                              <span style={{ fontSize: "30px", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.03em" }}>
                                {actualMass.toFixed(2)}
                              </span>
                              <span style={{ fontSize: "16px", fontWeight: 700, color: "#94A3B8", marginLeft: "2px" }}>mg</span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Batch + Analysis */}
                      <div style={{ padding: "14px 14px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                        <div>
                          <p style={{ margin: "0 0 3px", fontSize: "8.5px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Batch</p>
                          <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: "#334155", fontFamily: "monospace", letterSpacing: "0.02em" }}>{lot}</p>
                        </div>
                        <div>
                          <p style={{ margin: "0 0 3px", fontSize: "8.5px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em" }}>Analysis</p>
                          <p style={{ margin: 0, fontSize: "11px", fontWeight: 600, color: "#334155" }}>Mass &amp; Purity</p>
                        </div>
                      </div>

                      {/* Pass + date */}
                      <div style={{ padding: "12px 14px 4px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ padding: "2px 10px", borderRadius: "4px", background: "#DCFCE7", color: "#16A34A", fontSize: "9.5px", fontWeight: 800, letterSpacing: "0.08em" }}>
                          PASS
                        </span>
                        <span style={{ fontSize: "10.5px", color: "#64748B", display: "flex", alignItems: "center", gap: "4px" }}>
                          📅 {analysis}
                        </span>
                      </div>
                      <p style={{ margin: "0 14px 14px", fontSize: "10px", color: "#94A3B8" }}>
                        Tested by OmniQure Labs
                      </p>

                      {/* View Report + Buy buttons */}
                      <div style={{ padding: "0 12px 12px", marginTop: "auto", display: "flex", gap: "8px" }}>
                        <button
                          onClick={() => setSelectedProduct(product)}
                          style={{
                            flex: 1, height: "40px",
                            borderRadius: "8px",
                            border: "1.5px solid #E2E8F0",
                            background: "#F8FAFC",
                            color: "#334155",
                            fontSize: "12px", fontWeight: 700,
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            fontFamily: "'Arimo', Arial, sans-serif",
                            transition: "background 0.15s, color 0.15s, border-color 0.15s",
                          }}
                          onMouseOver={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#EEF4FF";
                            (e.currentTarget as HTMLButtonElement).style.color = "#1240A0";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#C7D7F5";
                          }}
                          onMouseOut={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#F8FAFC";
                            (e.currentTarget as HTMLButtonElement).style.color = "#334155";
                            (e.currentTarget as HTMLButtonElement).style.borderColor = "#E2E8F0";
                          }}
                        >
                          <FileText size={13} />
                          View Report
                        </button>
                        <button
                          onClick={() => navigate(`/product/${product.id}`)}
                          style={{
                            flex: 1, height: "40px",
                            borderRadius: "8px",
                            border: "none",
                            background: "#1240A0",
                            color: "#fff",
                            fontSize: "12px", fontWeight: 700,
                            cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                            fontFamily: "'Arimo', Arial, sans-serif",
                            transition: "background 0.15s",
                          }}
                          onMouseOver={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#1a52c4";
                          }}
                          onMouseOut={e => {
                            (e.currentTarget as HTMLButtonElement).style.background = "#1240A0";
                          }}
                        >
                          Buy Now →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </>
      </div>
    </div>
  );
}
