export function WarmItUp() {
  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", width: "100%", minHeight: "100vh" }}>

      {/* Nav — clean white */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E6", padding: "0 48px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontWeight: 800, fontSize: 18, color: "#0F172A", letterSpacing: "-0.03em" }}>omniqure</span>
        <div style={{ display: "flex", gap: 32 }}>
          {["Peptides", "Blends", "Research", "About"].map(l => (
            <span key={l} style={{ fontSize: 12, fontWeight: 600, color: "#64748B", letterSpacing: "0.06em", textTransform: "uppercase" }}>{l}</span>
          ))}
        </div>
        <div style={{ background: "#1240A0", color: "#fff", padding: "8px 20px", fontSize: 12, fontWeight: 700, letterSpacing: "0.1em" }}>SHOP NOW</div>
      </div>

      {/* Hero — deep near-black, not blue */}
      <div style={{ background: "linear-gradient(160deg, #0A0D12 0%, #111827 60%, #1C2536 100%)", padding: "72px 48px 80px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: "100%", background: "radial-gradient(ellipse at right, rgba(18,64,160,0.15), transparent 70%)" }} />
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", color: "#60A5FA", textTransform: "uppercase", marginBottom: 20 }}>PEPTIDE RESEARCH INSTITUTE</p>
        <h1 style={{ fontSize: 52, fontWeight: 900, color: "#FFFFFF", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 540 }}>
          Advanced peptide<br />research compounds
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.60)", lineHeight: 1.75, maxWidth: 400, marginBottom: 36 }}>
          High-purity research compounds for in-vitro laboratory use. HPLC-verified, batch-tested.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ background: "#1240A0", color: "#fff", padding: "14px 32px", fontSize: 12, fontWeight: 700, letterSpacing: "0.12em" }}>BROWSE PEPTIDES</div>
          <div style={{ border: "1px solid rgba(255,255,255,0.25)", color: "rgba(255,255,255,0.8)", padding: "14px 32px", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em" }}>RESEARCH AREAS</div>
        </div>
      </div>

      {/* Bundle strip — warm charcoal accent, NOT blue */}
      <div style={{ background: "#1C2330", padding: "18px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#FFFFFF", letterSpacing: "0.04em" }}>
          <span style={{ color: "#34D399" }}>★ </span>Bundle & Save — up to 20% off multi-compound orders
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#60A5FA", letterSpacing: "0.12em", textTransform: "uppercase" }}>SHOP BUNDLES →</span>
      </div>

      {/* Trust strip — warm white, not blue-tinted */}
      <div style={{ background: "#FFFFFF", borderBottom: "1px solid #EDECE9", padding: "18px 48px", display: "flex", gap: 48, alignItems: "center" }}>
        {["HPLC Verified ≥ 98%", "Next-Day Dispatch", "Discreet Packaging", "Research Grade Only"].map(t => (
          <span key={t} style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.1em", textTransform: "uppercase" }}>✓ {t}</span>
        ))}
      </div>

      {/* Products — warm white bg */}
      <div style={{ background: "#FAFAF8", padding: "56px 48px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.25em", color: "#94A3B8", textTransform: "uppercase", marginBottom: 12 }}>FEATURED COMPOUNDS</p>
        <h2 style={{ fontSize: 32, fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em", marginBottom: 40 }}>Most researched peptides</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {["BPC-157", "TB-500", "Semax", "Epithalon"].map((name, i) => (
            <div key={name} style={{ background: "#FFFFFF", border: "1px solid #E8E7E4", padding: 20 }}>
              <div style={{ height: 120, background: "#F4F3F0", marginBottom: 16 }} />
              <p style={{ fontSize: 11, color: "#94A3B8", fontWeight: 600, letterSpacing: "0.1em", marginBottom: 6 }}>HEALING PEPTIDES</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{name} 5mg</p>
              <p style={{ fontSize: 14, fontWeight: 800, color: "#1240A0" }}>£{[65, 75, 95, 75][i]}.00</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose — warm off-white, not blue-tinted */}
      <div style={{ background: "#F5F4F0", padding: "56px 48px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32 }}>
          {[
            { t: "HPLC Verified", d: "Every batch tested to ≥98% purity before dispatch." },
            { t: "Research Grade", d: "Manufactured to cGMP standards for laboratory use." },
            { t: "Fast Dispatch", d: "Next-day delivery on orders placed before 2pm." },
          ].map(({ t, d }) => (
            <div key={t} style={{ padding: "28px 24px", background: "#FFFFFF", border: "1px solid #E8E7E4" }}>
              <div style={{ width: 36, height: 3, background: "#1240A0", marginBottom: 18 }} />
              <p style={{ fontSize: 15, fontWeight: 800, color: "#0F172A", marginBottom: 10 }}>{t}</p>
              <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65 }}>{d}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Research Areas — deep charcoal, NOT blue gradient */}
      <div style={{ background: "#0D1117", padding: "56px 48px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", color: "#60A5FA", textTransform: "uppercase", opacity: 0.7, marginBottom: 14 }}>Research Applications</p>
            <h2 style={{ fontSize: 38, fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.05 }}>
              What peptides<br />
              <span style={{ color: "#60A5FA" }}>are used for.</span>
            </h2>
          </div>
          <p style={{ maxWidth: 320, fontSize: 13.5, color: "rgba(255,255,255,0.50)", lineHeight: 1.75 }}>
            Hover any card to see which compounds are investigated in each research area.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 1, background: "rgba(255,255,255,0.06)" }}>
          {["Tissue Repair", "Brain & Cognition", "Metabolic", "Skin & Collagen", "Growth Hormone", "Immune", "Longevity", "Cardiovascular"].map((title, i) => (
            <div key={title} style={{ height: 200, background: "#13181F", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 60%)` }} />
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
        <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: "0.18em", textTransform: "uppercase" }}>Option A — Warm it up: charcoal darks · warm whites · blue as accent only</span>
      </div>
    </div>
  );
}
