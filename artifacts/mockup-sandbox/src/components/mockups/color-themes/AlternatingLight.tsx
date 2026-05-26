export function AlternatingLight() {
  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", width: "100%", minHeight: "100vh" }}>

      {/* Nav */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EEF2F7", padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 800, fontSize: 18, color: "#0F172A", letterSpacing: "-0.03em" }}>omniqure</span>
        <div style={{ display: "flex", gap: 32 }}>
          {["Peptides", "Blends", "Research", "About"].map(l => (
            <span key={l} style={{ fontSize: 12, fontWeight: 600, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</span>
          ))}
        </div>
        <div style={{ background: "#1240A0", color: "#fff", padding: "8px 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>SHOP NOW</div>
      </div>

      {/* Hero — keeps deep blue (intentional brand dark) */}
      <div style={{ background: "linear-gradient(135deg, #020B1E 0%, #071A4A 30%, #0D2565 60%, #1240A0 100%)", padding: "72px 48px 80px", position: "relative" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", color: "#93C5FD", textTransform: "uppercase", marginBottom: 20 }}>PEPTIDE RESEARCH INSTITUTE</p>
        <h1 style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 540 }}>
          Advanced peptide<br />research compounds
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.60)", lineHeight: 1.75, maxWidth: 400, marginBottom: 36 }}>
          High-purity research compounds for in-vitro laboratory use.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ background: "#FFFFFF", color: "#1240A0", padding: "14px 32px", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em" }}>BROWSE PEPTIDES</div>
          <div style={{ border: "1px solid rgba(255,255,255,0.30)", color: "rgba(255,255,255,0.85)", padding: "14px 32px", fontSize: 12, fontWeight: 600 }}>RESEARCH AREAS</div>
        </div>
      </div>

      {/* ✅ BREATHER: clean white trust strip — light after dark */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EEF2F7", padding: "20px 48px", display: "flex", gap: 48, alignItems: "center", justifyContent: "center" }}>
        {["HPLC Verified ≥ 98%", "Next-Day Dispatch", "Discreet Packaging", "Research Grade Only"].map(t => (
          <span key={t} style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.1em", textTransform: "uppercase" }}>✓ {t}</span>
        ))}
      </div>

      {/* Bundle strip — moved here as a white card section, not dark on dark */}
      <div style={{ background: "#F7FAFF", padding: "28px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #EEF2F7" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#1240A0", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 4 }}>Bundle & Save</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A" }}>Up to 20% off multi-compound orders</p>
        </div>
        <div style={{ background: "#1240A0", color: "#fff", padding: "12px 28px", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em" }}>SHOP BUNDLES</div>
      </div>

      {/* Products — white */}
      <div style={{ background: "#FFFFFF", padding: "56px 48px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#94A3B8", textTransform: "uppercase", marginBottom: 12 }}>FEATURED COMPOUNDS</p>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", marginBottom: 40 }}>Most researched peptides</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {["BPC-157", "TB-500", "Semax", "Epithalon"].map((name, i) => (
            <div key={name} style={{ background: "#FFFFFF", border: "1px solid #EEF2F7", padding: 20 }}>
              <div style={{ height: 120, background: "#F7FAFF", marginBottom: 16 }} />
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 6 }}>HEALING PEPTIDES</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{name} 5mg</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#1240A0" }}>£{[65, 75, 95, 75][i]}.00</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose — light grey, gentle alternation */}
      <div style={{ background: "#F7FAFF", padding: "56px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
          {[
            { t: "HPLC Verified", d: "Every batch tested to ≥98% purity." },
            { t: "Research Grade", d: "Manufactured to cGMP standards." },
            { t: "Fast Dispatch", d: "Next-day delivery before 2pm." },
          ].map(({ t, d }) => (
            <div key={t} style={{ padding: "28px 24px", background: "#FFFFFF", border: "1px solid #EEF2F7" }}>
              <div style={{ width: 36, height: 3, background: "#1240A0", marginBottom: 18 }} />
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>{t}</p>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Research Areas — ONE intentional dark section */}
      <div style={{ background: "linear-gradient(160deg, #020B1E 0%, #071A4A 40%, #0D2565 70%, #1240A0 100%)", padding: "56px 48px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", color: "#93C5FD", textTransform: "uppercase", opacity: 0.7, marginBottom: 14 }}>Research Applications</p>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              What peptides<br />
              <span style={{ background: "linear-gradient(90deg, #60A5FA, #93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                are used for.
              </span>
            </h2>
          </div>
          <p style={{ maxWidth: 320, fontSize: 13.5, color: "rgba(255,255,255,0.50)", lineHeight: 1.75 }}>
            Hover any card to explore the compounds under study.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
          {["Tissue Repair", "Brain & Cognition", "Metabolic", "Skin & Collagen", "Growth Hormone", "Immune", "Longevity", "Cardiovascular"].map((title, i) => (
            <div key={title} style={{ height: 200, background: "rgba(4,12,30,0.7)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, rgba(0,0,0,0.8) 0%, transparent 60%)` }} />
              <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                <p style={{ fontSize: 9, color: "#60A5FA", fontWeight: 700, letterSpacing: "0.3em", marginBottom: 6 }}>0{i + 1}</p>
                <p style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Label */}
      <div style={{ background: "#1240A0", padding: "10px 48px", textAlign: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.18em", textTransform: "uppercase" }}>Option B — Alternate light/dark: bundle strip moved to light · one intentional dark section</span>
      </div>
    </div>
  );
}
