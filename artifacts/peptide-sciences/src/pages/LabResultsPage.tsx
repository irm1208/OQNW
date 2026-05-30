import { useState, useMemo } from "react";
import { useProducts } from "@/context/ProductsContext";
import { getPurityStr, getPurity } from "@/utils/productPurity";
import HplcChart from "@/components/HplcChart";
import MsChart from "@/components/MsChart";
import { generateCOA } from "@/utils/generateCOA";
import { productDetails } from "@/data/productDetails";
import { useSEO } from "@/hooks/useSEO";
import { FlaskConical, Download, Shield, Search, ChevronRight, Award, Microscope, TestTube2, CheckCircle2 } from "lucide-react";
import type { Product } from "@/data/products";

const CATEGORIES = [
  "All", "Growth Peptides", "Healing Peptides", "Weight Management",
  "Longevity Peptides", "Nootropics", "Cellular Health", "Hormonal Peptides",
  "Skin & Repair", "Immune Support", "Research Peptides", "Peptide Blends",
  "Anti-Inflammatory", "Cognitive Peptides", "Growth Hormone",
];

export default function LabResultsPage() {
  useSEO({
    title: "Lab Results & Certificates of Analysis",
    description: "HPLC chromatograms, mass spectrometry data, and certificates of analysis for all OmniQure research peptides. 99%+ purity verified by independent third-party testing.",
    canonicalPath: "/lab-results",
  });

  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter(p => {
      const matchCat = category === "All" || p.category === category;
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, search, category]);

  const purity = selected ? getPurity(selected.id) : null;
  const purityStr = selected ? getPurityStr(selected.id) : null;

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", padding: "56px 20px 48px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.12)", borderRadius: "20px",
            padding: "6px 16px", marginBottom: "20px",
          }}>
            <FlaskConical size={14} color="rgba(255,255,255,0.8)" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "rgba(255,255,255,0.8)", letterSpacing: "0.06em" }}>
              THIRD-PARTY VERIFIED
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 14px" }}>
            Lab Results & Certificates of Analysis
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, margin: "0 auto", maxWidth: "600px" }}>
            Every OmniQure peptide is independently tested using HPLC and mass spectrometry. Select any product below to view its chromatogram, spectral data, and purity certificate.
          </p>

          {/* Quality badges */}
          <div style={{ display: "flex", justifyContent: "center", gap: "12px", flexWrap: "wrap", marginTop: "28px" }}>
            {[
              { icon: <Award size={14} />, label: "99%+ HPLC Purity" },
              { icon: <Microscope size={14} />, label: "Mass Spec Verified" },
              { icon: <Shield size={14} />, label: "Third-Party Tested" },
              { icon: <CheckCircle2 size={14} />, label: "Lot-by-Lot Testing" },
            ].map(b => (
              <div key={b.label} style={{
                display: "flex", alignItems: "center", gap: "6px",
                background: "rgba(255,255,255,0.12)", borderRadius: "20px",
                padding: "6px 14px", color: "rgba(255,255,255,0.85)",
                fontSize: "12.5px", fontWeight: 600,
              }}>
                {b.icon}
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 16px" }}>

        {/* Search + filter */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search peptides..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", height: "42px", paddingLeft: "38px", paddingRight: "12px",
                borderRadius: "10px", border: "1.5px solid #E2E8F0", outline: "none",
                fontSize: "14px", fontFamily: "'Arimo', Arial, sans-serif", boxSizing: "border-box",
                background: "#fff", color: "#0F172A",
              }}
            />
          </div>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            style={{
              height: "42px", padding: "0 12px", borderRadius: "10px",
              border: "1.5px solid #E2E8F0", outline: "none",
              fontSize: "13.5px", fontFamily: "'Arimo', Arial, sans-serif",
              background: "#fff", color: "#0F172A", cursor: "pointer",
            }}
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: selected ? "320px 1fr" : "1fr", gap: "20px", alignItems: "start" }}>

          {/* Product list */}
          <div style={{
            background: "#fff", borderRadius: "16px",
            border: "1.5px solid #E8EDF5", overflow: "hidden",
            boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
          }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFF" }}>
              <p style={{ margin: 0, fontSize: "12px", fontWeight: 700, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {filtered.length} product{filtered.length !== 1 ? "s" : ""}
              </p>
            </div>
            <div style={{ maxHeight: "600px", overflowY: "auto" }}>
              {filtered.length === 0 ? (
                <div style={{ padding: "32px 16px", textAlign: "center", color: "#94A3B8", fontSize: "14px" }}>
                  No products match your search.
                </div>
              ) : filtered.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  style={{
                    width: "100%", textAlign: "left", padding: "12px 16px",
                    border: "none", borderBottom: "1px solid #F1F5F9",
                    background: selected?.id === p.id ? "#EEF4FF" : "transparent",
                    cursor: "pointer", display: "flex", alignItems: "center", gap: "12px",
                    transition: "background 0.12s",
                  }}
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "40px", height: "40px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: "0 0 2px", fontSize: "13px", fontWeight: 700, color: selected?.id === p.id ? "#1240A0" : "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {p.name}
                    </p>
                    <p style={{ margin: 0, fontSize: "11.5px", color: "#64748B" }}>
                      {p.category} · {getPurityStr(p.id)} purity
                    </p>
                  </div>
                  <ChevronRight size={14} color={selected?.id === p.id ? "#1240A0" : "#CBD5E1"} style={{ flexShrink: 0 }} />
                </button>
              ))}
            </div>
          </div>

          {/* COA panel */}
          {selected && purity !== null ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

              {/* Product header */}
              <div style={{
                background: "#fff", borderRadius: "16px",
                border: "1.5px solid #E8EDF5", padding: "24px",
                boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                  <img
                    src={selected.image}
                    alt={selected.name}
                    style={{ width: "72px", height: "72px", borderRadius: "12px", objectFit: "cover", flexShrink: 0 }}
                    onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 700, color: "#1B5CB5", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                      {selected.category}
                    </p>
                    <h2 style={{ margin: "0 0 6px", fontSize: "22px", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em" }}>
                      {selected.name}
                    </h2>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {[
                        { label: "HPLC Purity", value: purityStr ?? "" , color: "#059669" },
                        { label: "Method", value: "RP-HPLC / UV 214nm" },
                        { label: "Condition", value: "New · Research Grade" },
                      ].map(tag => (
                        <span key={tag.label} style={{
                          fontSize: "12px", padding: "3px 10px", borderRadius: "20px",
                          background: "#F1F5F9", color: tag.color ?? "#475569", fontWeight: 600,
                        }}>
                          {tag.label}: <strong>{tag.value}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => void generateCOA(selected, productDetails[String(selected.id)] ?? { id: String(selected.id), description: "" })}
                    style={{
                      height: "40px", padding: "0 18px", borderRadius: "10px",
                      background: "linear-gradient(90deg, #0D2565, #1B5CB5)",
                      border: "none", color: "#fff", fontSize: "13px", fontWeight: 700,
                      cursor: "pointer", display: "flex", alignItems: "center", gap: "7px",
                      boxShadow: "0 4px 16px rgba(18,64,160,0.3)", flexShrink: 0,
                    }}
                  >
                    <Download size={14} />
                    Download COA
                  </button>
                </div>
              </div>

              {/* HPLC Chart */}
              <div style={{
                background: "#fff", borderRadius: "16px",
                border: "1.5px solid #E8EDF5", padding: "24px",
                boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <TestTube2 size={16} color="#1240A0" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>HPLC Chromatogram</p>
                    <p style={{ margin: 0, fontSize: "11.5px", color: "#64748B" }}>Reverse-phase high-performance liquid chromatography · UV detection at 214 nm</p>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <HplcChart productId={selected.id} productName={selected.name} />
                </div>
              </div>

              {/* MS Chart */}
              <div style={{
                background: "#fff", borderRadius: "16px",
                border: "1.5px solid #E8EDF5", padding: "24px",
                boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Microscope size={16} color="#059669" />
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>Mass Spectrometry</p>
                    <p style={{ margin: 0, fontSize: "11.5px", color: "#64748B" }}>ESI-MS · confirms molecular weight and identity of the target compound</p>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <MsChart productId={selected.id} productName={selected.name} />
                </div>
              </div>

              {/* Purity breakdown */}
              <div style={{
                background: "#fff", borderRadius: "16px",
                border: "1.5px solid #E8EDF5", padding: "24px",
                boxShadow: "0 4px 20px rgba(15,23,42,0.06)",
              }}>
                <h3 style={{ margin: "0 0 16px", fontSize: "14px", fontWeight: 800, color: "#0F172A" }}>Purity Analysis Summary</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
                  {[
                    { label: "Target Compound", value: purityStr ?? `${purity.toFixed(3)}%`, color: "#059669", bg: "#F0FDF4", border: "#BBF7D0" },
                    { label: "Solvent / Other", value: "0.3%", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
                    { label: "Water Content", value: "≤1.0%", color: "#1240A0", bg: "#EEF4FF", border: "#BFDBFE" },
                  ].map(row => (
                    <div key={row.label} style={{ padding: "14px", borderRadius: "10px", background: row.bg, border: `1.5px solid ${row.border}` }}>
                      <p style={{ margin: "0 0 4px", fontSize: "11px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>{row.label}</p>
                      <p style={{ margin: 0, fontSize: "22px", fontWeight: 900, color: row.color }}>{row.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "16px", padding: "14px 16px", borderRadius: "10px", background: "#F8FAFC", border: "1px solid #E2E8F0" }}>
                  <p style={{ margin: 0, fontSize: "12.5px", color: "#475569", lineHeight: 1.6 }}>
                    <strong style={{ color: "#0F172A" }}>Testing Methodology:</strong> All peptides are tested by independent accredited laboratories using reverse-phase HPLC with UV detection at 214 nm and electrospray ionisation mass spectrometry (ESI-MS). Results are lot-specific. For laboratory research use only — not for human or veterinary use.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div style={{
              background: "#fff", borderRadius: "16px",
              border: "2px dashed #E2E8F0", padding: "64px 32px",
              textAlign: "center",
              boxShadow: "0 4px 20px rgba(15,23,42,0.04)",
            }}>
              <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "#EEF4FF", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <FlaskConical size={28} color="#1240A0" />
              </div>
              <h3 style={{ margin: "0 0 8px", fontSize: "18px", fontWeight: 800, color: "#0F172A" }}>Select a Product</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#64748B", lineHeight: 1.6 }}>
                Choose any peptide from the list to view its HPLC chromatogram, mass spectrometry data, and purity certificate.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
