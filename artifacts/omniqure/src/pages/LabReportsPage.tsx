import { useState, useMemo } from "react";
import { useProducts } from "@/context/ProductsContext";
import { isHiddenCategory } from "@/data/products";
import { getPurity, getPurityStr, getLotDates } from "@/utils/productPurity";
import { useSEO } from "@/hooks/useSEO";
import {
  Search, BarChart2, Atom, CheckCircle2, ChevronDown, ChevronUp,
  FlaskConical, FileText,
} from "lucide-react";

const CATEGORIES = [
  "All", "Growth Peptides", "Healing Peptides", "Longevity Peptides",
  "Nootropics", "Cellular Health", "Hormonal Peptides", "Skin & Repair",
  "Immune Support", "Research Peptides", "Peptide Blends",
  "Anti-Inflammatory", "Cognitive Peptides", "Growth Hormone",
];

// ─── Expandable row ───────────────────────────────────────────────────────────

function ReportRow({ product }: { product: { id: string; name: string; slug: string; category: string } }) {
  const [open, setOpen] = useState(false);

  const purity   = getPurity(product.id);
  const purityStr = getPurityStr(product.id);
  const { lot, analysis, issued, expires } = getLotDates(product.id);

  const baseName = product.name.replace(/\s+\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g).*$/i, "").trim();

  const purityGood = purity >= 98;
  const purityColor = purityGood ? "#059669" : "#B45309";
  const purityBg    = purityGood ? "#ECFDF5" : "#FFF7ED";

  return (
    <div style={{
      border: "1.5px solid #E8EDF5",
      borderRadius: "12px",
      overflow: "hidden",
      background: "#fff",
      boxShadow: open ? "0 6px 24px rgba(18,64,160,0.08)" : "0 1px 4px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
    }}>
      {/* Header row — always visible */}
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "14px 18px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "'Arimo', Arial, sans-serif",
        }}
      >
        {/* Icon */}
        <span style={{
          flexShrink: 0,
          width: "38px", height: "38px",
          borderRadius: "10px",
          background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <FlaskConical size={17} color="#1B5CB5" />
        </span>

        {/* Name + category */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0D2565", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {baseName}
          </p>
          <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>
            {product.category}
          </p>
        </div>

        {/* Purity badge */}
        <span style={{
          flexShrink: 0,
          fontSize: "12.5px", fontWeight: 700,
          padding: "3px 10px", borderRadius: "20px",
          background: purityBg, color: purityColor,
        }}>
          {purityStr}
        </span>

        {/* Chevron */}
        <span style={{ flexShrink: 0, color: "#CBD5E1" }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div style={{
          borderTop: "1px solid #F1F5F9",
          background: "#F8FAFC",
          padding: "18px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "12px",
          fontFamily: "'Arimo', Arial, sans-serif",
        }}>

          {/* HPLC card */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <BarChart2 size={14} color="#1B5CB5" />
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                HPLC Analysis
              </span>
            </div>
            <p style={{ margin: 0, fontSize: "26px", fontWeight: 900, color: "#0D2565", lineHeight: 1 }}>
              {purityStr}
            </p>
            <p style={{ margin: "4px 0 10px", fontSize: "11px", color: "#94A3B8" }}>Purity by peak area · 214 nm UV</p>
            {/* Bar */}
            <div style={{ height: "6px", borderRadius: "3px", background: "#EFF6FF", overflow: "hidden" }}>
              <div style={{
                height: "100%", borderRadius: "3px",
                background: purityGood
                  ? "linear-gradient(90deg, #1B5CB5, #059669)"
                  : "linear-gradient(90deg, #B45309, #F59E0B)",
                width: `${purity}%`,
                transition: "width 0.5s ease",
              }} />
            </div>
            <p style={{ margin: "6px 0 0", fontSize: "10px", color: "#94A3B8" }}>
              Method: Reverse-phase HPLC
            </p>
          </div>

          {/* ESI-MS card */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <Atom size={14} color="#7C3AED" />
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                ESI-MS
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "6px" }}>
              <CheckCircle2 size={20} color="#059669" />
              <p style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#0D2565" }}>Identity confirmed</p>
            </div>
            <p style={{ margin: 0, fontSize: "11px", color: "#94A3B8", lineHeight: 1.5 }}>
              Molecular weight verified by electrospray ionisation mass spectrometry.
            </p>
            <div style={{ marginTop: "10px", padding: "6px 10px", borderRadius: "7px", background: "#F5F3FF", border: "1px solid #DDD6FE" }}>
              <p style={{ margin: 0, fontSize: "10.5px", fontWeight: 600, color: "#6D28D9" }}>
                MS Grade: Research Use
              </p>
            </div>
          </div>

          {/* Batch card */}
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
              <FileText size={14} color="#059669" />
              <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Batch Record
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
              {[
                { label: "Lot number",     value: lot },
                { label: "Analysis date",  value: analysis },
                { label: "Report issued",  value: issued },
                { label: "Expires",        value: expires },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "8px" }}>
                  <span style={{ fontSize: "10.5px", color: "#94A3B8", whiteSpace: "nowrap" }}>{label}</span>
                  <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151", fontFamily: "monospace", textAlign: "right" }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LabReportsPage() {
  useSEO({
    title: "Lab Reports",
    description:
      "Independent HPLC chromatography and ESI-MS mass spectrometry lab reports for every OmniQure peptide. Purity verification, molecular identity confirmation, and batch traceability for in-vitro research.",
    canonicalPath: "/lab-reports",
  });

  const { products: allProducts } = useProducts();
  const products = useMemo(
    () => allProducts.filter(p => !isHiddenCategory(p.category)),
    [allProducts]
  );

  const [search, setSearch]           = useState("");
  const [activeCategory, setCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter(p => {
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      const matchCat    = activeCategory === "All" || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [products, search, activeCategory]);

  const availableCategories = useMemo(() => {
    const cats = new Set(products.map(p => p.category));
    return CATEGORIES.filter(c => c === "All" || cats.has(c));
  }, [products]);

  return (
    <div style={{ minHeight: "100vh", background: "#F5F8FC", fontFamily: "'Arimo', Arial, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        padding: "40px 24px 36px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 13px", borderRadius: "20px", marginBottom: "16px" }}>
            <BarChart2 size={12} color="#93C5FD" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#93C5FD", letterSpacing: "0.06em" }}>
              INDEPENDENT THIRD-PARTY TESTING
            </span>
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
            Lab Reports
          </h1>
          <p style={{ margin: "0 0 24px", fontSize: "14px", color: "#BFDBFE", lineHeight: 1.7, maxWidth: "580px" }}>
            Every peptide in our catalogue is independently verified by Janoshik Analytical. HPLC confirms purity; ESI-MS confirms molecular identity. Click any row to view the full report.
          </p>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
            {[
              { value: `${products.length}`, label: "peptides tested" },
              { value: "≥98%",              label: "avg. purity" },
              { value: "HPLC + ESI-MS",     label: "testing method" },
              { value: "3rd party",          label: "independent lab" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#fff" }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 24px 64px" }}>

        {/* Search + category filter */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" }}>
          <div style={{ position: "relative", flex: "1 1 260px" }}>
            <Search size={14} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
            <input
              type="text"
              placeholder="Search peptide…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", height: "42px",
                paddingLeft: "38px", paddingRight: "14px",
                borderRadius: "10px", border: "1.5px solid #E2E8F0",
                outline: "none", fontSize: "13.5px",
                background: "#fff", color: "#0F172A",
                fontFamily: "'Arimo', Arial, sans-serif",
                boxSizing: "border-box",
              }}
            />
          </div>
          <select
            value={activeCategory}
            onChange={e => setCategory(e.target.value)}
            style={{
              height: "42px", padding: "0 14px",
              borderRadius: "10px", border: "1.5px solid #E2E8F0",
              outline: "none", fontSize: "13.5px",
              background: "#fff", color: "#374151",
              fontFamily: "'Arimo', Arial, sans-serif",
              cursor: "pointer",
            }}
          >
            {availableCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Category chips */}
        <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "20px" }}>
          {availableCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "4px 13px", borderRadius: "20px",
                border: "1px solid",
                borderColor: activeCategory === cat ? "#1240A0" : "#E2E8F0",
                background: activeCategory === cat ? "linear-gradient(90deg, #0D2565, #1B5CB5)" : "#fff",
                color: activeCategory === cat ? "#fff" : "#475569",
                fontSize: "11.5px", fontWeight: activeCategory === cat ? 700 : 500,
                cursor: "pointer", fontFamily: "'Arimo', Arial, sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p style={{ margin: "0 0 14px", fontSize: "11.5px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
          {filtered.length} report{filtered.length !== 1 ? "s" : ""}
          {activeCategory !== "All" ? ` · ${activeCategory}` : ""}
        </p>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "#94A3B8" }}>
            <FlaskConical size={36} color="#E2E8F0" style={{ marginBottom: "12px" }} />
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#475569", margin: "0 0 6px" }}>No reports found</p>
            <p style={{ fontSize: "13px", margin: 0 }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {filtered.map(p => <ReportRow key={p.id} product={p} />)}
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ marginTop: "40px", textAlign: "center", fontSize: "11px", color: "#94A3B8", lineHeight: 1.7, maxWidth: "560px", margin: "40px auto 0" }}>
          All products are sold strictly for in-vitro research purposes only. Not approved for human or veterinary use.
          Lab analyses are conducted by independent third-party laboratories (Janoshik Analytical). Results are batch-specific and may vary.
        </p>
      </div>
    </div>
  );
}
