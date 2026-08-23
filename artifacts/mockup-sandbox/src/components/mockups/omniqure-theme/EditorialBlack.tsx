import { ShoppingCart, Search, ArrowRight, Shield, FlaskConical, BarChart3, Microscope, Award, CheckCircle } from "lucide-react";

const GOLD = "#E8A93E";

const products = [
  { name: "BPC-157",    cas: "137525-51-0", purity: "99.8%", weight: "5mg",  seq: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val" },
  { name: "TB-500",     cas: "77591-33-4",  purity: "99.5%", weight: "10mg", seq: "Ac-Ser-Asp-Lys-Pro-Asp-Met-Ala-Glu-Ile-Glu-Lys-Phe-Asp-Lys-Ser" },
  { name: "Semaglutide",cas: "910463-68-2", purity: "99.9%", weight: "5mg",  seq: "His-Aib-Glu-Gly-Thr-Phe-Thr-Ser-Asp-Val-Ser-Ser-Tyr-Leu-Glu" },
  { name: "Selank",     cas: "129954-34-3", purity: "99.2%", weight: "30mg", seq: "Thr-Lys-Pro-Arg-Pro-Gly-Pro" },
  { name: "PT-141",     cas: "189691-06-3", purity: "99.7%", weight: "10mg", seq: "Ac-Nle-cyclo(Asp-His-D-Phe-Arg-Trp-Lys)-OH" },
  { name: "CJC-1295",   cas: "863288-34-0", purity: "99.6%", weight: "2mg",  seq: "Tyr-D-Ala-Asp-Ala-Ile-Phe-Thr-Gln-Ser-Tyr-Arg-Lys-Val-Leu-Ala" },
];

export function EditorialBlack() {
  return (
    <div style={{ backgroundColor: "#0a0a0a", color: "#ffffff", minHeight: "100vh", fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>

      {/* Announcement */}
      <div style={{ backgroundColor: GOLD, color: "#000", padding: "8px 24px", display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>
        <span>Research Purposes Only</span>
        <span>ISO-9001 Certified Facility</span>
        <span>Worldwide Cold-Chain Shipping</span>
      </div>

      {/* Header */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", position: "sticky", top: 0, backgroundColor: "rgba(10,10,10,0.92)", backdropFilter: "blur(12px)", zIndex: 50 }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 32px", height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "22px", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase" }}>
              OmniQure
            </div>
            <div style={{ fontSize: "9px", color: GOLD, letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "monospace", lineHeight: 1, marginTop: "2px" }}>
              Peptide Research Institute
            </div>
          </div>

          <nav style={{ display: "flex", gap: "36px" }}>
            {["Catalog", "Research", "COA Data", "About"].map(item => (
              <a key={item} style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer", textDecoration: "none", fontFamily: "monospace" }}>{item}</a>
            ))}
          </nav>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Search size={16} color="rgba(255,255,255,0.5)" style={{ cursor: "pointer" }} />
            <div style={{ position: "relative" }}>
              <ShoppingCart size={18} color="rgba(255,255,255,0.7)" style={{ cursor: "pointer" }} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ minHeight: "80vh", display: "flex", alignItems: "center", padding: "80px 32px", maxWidth: "1400px", margin: "0 auto" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "11px", color: GOLD, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace", marginBottom: "28px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "1px", backgroundColor: GOLD }} />
            HPLC + ESI-MS Verified — 99%+ Purity Minimum
          </div>
          <h1 style={{ fontSize: "clamp(56px, 8vw, 112px)", fontWeight: 900, lineHeight: 0.88, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "40px" }}>
            Absolute<br />
            <span style={{ color: GOLD }}>Synthesis.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7, maxWidth: "500px", marginBottom: "48px", borderLeft: `2px solid ${GOLD}`, paddingLeft: "20px" }}>
            Research-grade peptides synthesised for uncompromising institutional requirements. Every batch double-blind tested. Documentation shipped as standard.
          </p>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <button style={{ backgroundColor: "#fff", color: "#000", padding: "16px 36px", fontSize: "12px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px", fontFamily: "monospace" }}>
              Explore Catalog <ArrowRight size={14} />
            </button>
            <button style={{ backgroundColor: "transparent", color: "#fff", padding: "16px 24px", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", border: "none", borderBottom: "1px solid rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "monospace" }}>
              View Latest COAs
            </button>
          </div>
        </div>

        {/* Right: spec panel */}
        <div style={{ width: "340px", flexShrink: 0, border: "1px solid rgba(255,255,255,0.12)", padding: "32px", marginLeft: "80px" }}>
          <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", letterSpacing: "0.2em", fontFamily: "monospace", marginBottom: "24px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "16px" }}>
            BATCH QC OVERVIEW
          </div>
          {[
            { label: "Avg Purity",        value: "99.3%",  unit: "HPLC" },
            { label: "Total Compounds",   value: "81",     unit: "SKUs" },
            { label: "COA Compliance",    value: "100%",   unit: "All batches" },
            { label: "Dispatch Time",     value: "48h",    unit: "UK standard" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "20px" }}>
              <div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>{row.label}</div>
                <div style={{ fontSize: "28px", fontWeight: 900, color: GOLD, lineHeight: 1.1, marginTop: "4px" }}>{row.value}</div>
              </div>
              <div style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)", fontFamily: "monospace", letterSpacing: "0.1em" }}>{row.unit}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust strip */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "20px 32px", display: "flex", justifyContent: "center", gap: "48px", fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "monospace" }}>
        {[
          [<Shield size={14} key="s" color={GOLD}/>, "Third-Party Tested"],
          [<BarChart3 size={14} key="b" color={GOLD}/>, "GMP Compliant"],
          [<CheckCircle size={14} key="c" color={GOLD}/>, "99%+ Min Purity"],
          [<Microscope size={14} key="m" color={GOLD}/>, "Full ESI-MS Data"],
          [<Award size={14} key="a" color={GOLD}/>, "EU Compliant"],
        ].map(([icon, label], i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>{icon} {label}</span>
        ))}
      </div>

      {/* Product Grid */}
      <section style={{ backgroundColor: "#ffffff", color: "#000" }}>
        <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "80px 32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "56px" }}>
            <div>
              <h2 style={{ fontSize: "56px", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", lineHeight: 0.9 }}>
                Research<br />Compounds
              </h2>
              <p style={{ fontFamily: "monospace", fontSize: "11px", color: "rgba(0,0,0,0.4)", textTransform: "uppercase", letterSpacing: "0.12em", marginTop: "16px" }}>
                Select inventory for immediate dispatch
              </p>
            </div>
            <button style={{ fontFamily: "monospace", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.12em", background: "none", border: "none", borderBottom: "2px solid #000", padding: "0 0 4px", cursor: "pointer", fontWeight: 700 }}>
              View All 81
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", border: "1px solid rgba(0,0,0,0.08)" }}>
            {products.map((p, i) => (
              <div key={p.name} style={{ borderRight: i % 3 !== 2 ? "1px solid rgba(0,0,0,0.08)" : "none", borderBottom: i < 3 ? "1px solid rgba(0,0,0,0.08)" : "none", padding: "40px 32px", position: "relative" }}>
                <div style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(0,0,0,0.3)", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between" }}>
                  <span>REF: {p.cas}</span>
                  <FlaskConical size={14} color="rgba(0,0,0,0.2)" />
                </div>
                <h3 style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-0.04em", textTransform: "uppercase", marginBottom: "8px" }}>{p.name}</h3>
                <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                  <span style={{ fontFamily: "monospace", fontSize: "13px", fontWeight: 800, color: GOLD }}>{p.purity} PURITY</span>
                  <span style={{ fontFamily: "monospace", fontSize: "13px", color: "rgba(0,0,0,0.4)" }}>{p.weight}</span>
                </div>
                <div style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(0,0,0,0.3)", letterSpacing: "0.04em", marginBottom: "28px", lineHeight: 1.5 }}>
                  SEQ: {p.seq.substring(0, 40)}…
                </div>
                <button style={{ width: "100%", padding: "14px", fontFamily: "monospace", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", border: "1px solid #000", background: "none", cursor: "pointer" }}>
                  Add to Request
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "40px 32px", maxWidth: "1400px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          For research purposes only. Not for human consumption.
        </p>
        <p style={{ fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          © 2026 OmniQure Research. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
