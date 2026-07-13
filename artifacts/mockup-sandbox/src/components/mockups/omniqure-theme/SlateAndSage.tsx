import { ShoppingCart, ChevronRight, CheckCircle, FlaskConical, FileText, BarChart3, Search, Menu, Shield, Award, Microscope, Leaf } from "lucide-react";

const products = [
  { name: "BPC-157", category: "Tissue Repair", purity: "99.2%", price: "£42.00", weight: "5mg", badge: "COA" },
  { name: "TB-500", category: "Recovery", purity: "99.4%", price: "£58.00", weight: "5mg", badge: "HPLC" },
  { name: "Semaglutide", category: "Metabolic", purity: "99.1%", price: "£95.00", weight: "2mg", badge: "ESI-MS" },
  { name: "Selank", category: "Nootropic", purity: "99.3%", price: "£38.00", weight: "5mg", badge: "COA" },
  { name: "PT-141", category: "Research", purity: "99.0%", price: "£52.00", weight: "10mg", badge: "HPLC" },
  { name: "CJC-1295", category: "Growth", purity: "99.5%", price: "£68.00", weight: "2mg", badge: "ESI-MS" },
];

const CREAM = "#F8F5F0";
const SLATE = "#1C2333";
const SAGE = "#5C7A5C";
const AMBER = "#D9A05B";

function Badge({ label }: { label: string }) {
  const map: Record<string, { bg: string; text: string; border: string }> = {
    COA:    { bg: "#EEF3EE", text: SAGE,   border: "#BED0BE" },
    HPLC:   { bg: "#FDF6EC", text: AMBER,  border: "#EDD9A3" },
    "ESI-MS": { bg: "#F0F2F7", text: SLATE, border: "#C8CFDF" },
  };
  const s = map[label] || map.COA;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "4px",
      padding: "2px 8px", fontSize: "10px", fontWeight: 700,
      letterSpacing: "0.1em", textTransform: "uppercase",
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
      borderRadius: "4px",
    }}>
      <CheckCircle size={9} /> {label}
    </span>
  );
}

export function SlateAndSage() {
  return (
    <div style={{ background: CREAM, color: SLATE, minHeight: "100vh", fontFamily: "'Arimo', system-ui, sans-serif" }}>

      {/* Announcement */}
      <div style={{ background: SAGE, color: "#fff", textAlign: "center", padding: "8px 16px", fontSize: "12px", fontWeight: 500, letterSpacing: "0.06em" }}>
        Every peptide ships with full COA, HPLC chromatogram and ESI-MS verification
      </div>

      {/* Header */}
      <header style={{ background: "#fff", borderBottom: `1px solid ${SAGE}22`, position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: SAGE, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Leaf size={16} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "16px", fontWeight: 800, color: SLATE, fontFamily: "'Playfair Display', Georgia, serif", letterSpacing: "-0.02em" }}>
                OmniQure
              </div>
              <div style={{ fontSize: "9px", color: SAGE, letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1, marginTop: "1px" }}>Peptide Research Institute</div>
            </div>
          </div>

          <nav style={{ display: "flex", alignItems: "center", gap: "28px" }}>
            {["Catalog", "Research Areas", "Data & COA", "About"].map(item => (
              <a key={item} style={{ fontSize: "13px", color: `${SLATE}99`, cursor: "pointer", textDecoration: "none", fontWeight: 500 }}>{item}</a>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", background: `${SAGE}11`, border: `1px solid ${SAGE}33`, borderRadius: "6px", padding: "7px 12px" }}>
              <Search size={12} color={`${SLATE}66`} />
              <span style={{ fontSize: "12px", color: `${SLATE}55` }}>Search peptides…</span>
            </div>
            <button style={{ position: "relative", padding: "8px", background: "none", border: "none", cursor: "pointer" }}>
              <ShoppingCart size={18} color={SLATE} />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ borderBottom: `1px solid ${SAGE}22` }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 24px", display: "flex", alignItems: "center", gap: "64px" }}>
          <div style={{ flex: 1, maxWidth: "540px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: `${SAGE}18`, border: `1px solid ${SAGE}44`, borderRadius: "20px", padding: "5px 14px", marginBottom: "24px" }}>
              <Leaf size={11} color={SAGE} />
              <span style={{ fontSize: "11px", color: SAGE, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Research Grade — HPLC Verified</span>
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "52px", fontWeight: 800, lineHeight: 1.1, color: SLATE, marginBottom: "20px", letterSpacing: "-0.02em" }}>
              Precision peptides<br />
              <span style={{ color: SAGE }}>for serious research</span>
            </h1>
            <p style={{ fontSize: "15px", color: `${SLATE}88`, lineHeight: 1.75, marginBottom: "32px", maxWidth: "440px" }}>
              81 HPLC-verified compounds. Every batch ships with full certificate of analysis, chromatogram, and mass spectrometry data. Not for human use.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <button style={{ background: SLATE, color: "#fff", fontSize: "13px", fontWeight: 700, padding: "12px 24px", borderRadius: "6px", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                Browse Catalog <ChevronRight size={14} />
              </button>
              <button style={{ background: "none", border: `1px solid ${SAGE}66`, color: SLATE, fontSize: "13px", fontWeight: 600, padding: "12px 24px", borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={13} color={SAGE} /> Sample COA
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", flexShrink: 0 }}>
            {[
              { icon: <BarChart3 size={20} color={SAGE} />, label: "HPLC Verified", sub: "Every batch" },
              { icon: <FileText size={20} color={SAGE} />, label: "Full COA", sub: "Included" },
              { icon: <Shield size={20} color={SAGE} />, label: "99%+ Purity", sub: "Guaranteed" },
              { icon: <FlaskConical size={20} color={SAGE} />, label: "81 Peptides", sub: "In stock" },
              { icon: <Microscope size={20} color={SAGE} />, label: "ESI-MS Data", sub: "Available" },
              { icon: <CheckCircle size={20} color={SAGE} />, label: "EU Compliant", sub: "Certified" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#fff", border: `1px solid ${SAGE}22`, borderRadius: "10px", padding: "16px 12px", textAlign: "center", width: "96px" }}>
                <div style={{ marginBottom: "8px" }}>{item.icon}</div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: SLATE, lineHeight: 1.3 }}>{item.label}</p>
                <p style={{ fontSize: "10px", color: `${SLATE}55`, marginTop: "3px" }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "28px" }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "28px", fontWeight: 800, color: SLATE }}>Research Catalog</h2>
            <p style={{ fontSize: "12px", color: `${SLATE}66`, marginTop: "4px" }}>81 compounds — all with COA / HPLC / ESI-MS documentation</p>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {products.map((p) => (
            <div key={p.name} style={{ background: "#fff", border: `1px solid ${SAGE}22`, borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ height: "100px", background: `linear-gradient(135deg, ${CREAM}, ${SAGE}18)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FlaskConical size={32} color={`${SAGE}88`} />
              </div>
              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: 700, color: SLATE }}>{p.name}</h3>
                    <p style={{ fontSize: "11px", color: `${SLATE}66`, marginTop: "2px" }}>{p.category} · {p.weight}</p>
                  </div>
                  <Badge label={p.badge} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
                  <div>
                    <p style={{ fontSize: "10px", color: `${SLATE}66` }}>Purity</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: SAGE }}>{p.purity}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "10px", color: `${SLATE}66` }}>Price</p>
                    <p style={{ fontSize: "13px", fontWeight: 700, color: SLATE }}>{p.price}</p>
                  </div>
                </div>
                <button style={{ marginTop: "12px", width: "100%", padding: "9px", fontSize: "12px", fontWeight: 700, color: SAGE, background: `${SAGE}11`, border: `1px solid ${SAGE}44`, borderRadius: "6px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <ShoppingCart size={11} /> Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#fff", borderTop: `1px solid ${SAGE}22`, padding: "48px 24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "24px", textAlign: "center" }}>
          {[
            { n: "99%+", label: "Average purity across all batches" },
            { n: "81", label: "HPLC-verified research compounds" },
            { n: "100%", label: "Shipped with full documentation" },
            { n: "48h", label: "Typical UK dispatch time" },
          ].map((s) => (
            <div key={s.n}>
              <p style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "36px", fontWeight: 800, color: SAGE, lineHeight: 1 }}>{s.n}</p>
              <p style={{ fontSize: "11px", color: `${SLATE}77`, marginTop: "8px", lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: SLATE, color: "#fff", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>© 2026 OmniQure Peptide Research Institute. For in-vitro research use only.</p>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Terms", "Privacy", "COA Policy"].map(l => (
            <a key={l} style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
