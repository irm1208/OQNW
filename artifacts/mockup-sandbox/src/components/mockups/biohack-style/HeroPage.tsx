export default function HeroPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0B1714", minHeight: "100vh", color: "#fff" }}>

      {/* Top announcement bar */}
      <div style={{ background: "#0E4F3F", textAlign: "center", padding: "8px 16px", fontSize: "12px", color: "#5EEAD4", letterSpacing: "0.06em" }}>
        FREE SHIPPING ON ORDERS OVER £100 &nbsp;·&nbsp; UK & WORLDWIDE DELIVERY
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 48px", borderBottom: "1px solid rgba(94,234,212,0.10)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, background: "#5EEAD4", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 900, fontSize: 14, color: "#0B1714", letterSpacing: "-0.5px" }}>OQ</span>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.04em", color: "#fff" }}>omniQure</div>
            <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "#5EEAD4", marginTop: 1 }}>PEPTIDE RESEARCH INSTITUTE</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 32, fontSize: 13, color: "#94A3B8", letterSpacing: "0.03em" }}>
          {["Peptides", "Stacks", "Lab Tests", "Research", "About"].map(n => (
            <span key={n} style={{ cursor: "pointer", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#5EEAD4")}
              onMouseLeave={e => (e.currentTarget.style.color = "#94A3B8")}>{n}</span>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 13, color: "#94A3B8", cursor: "pointer" }}>Account</span>
          <div style={{ background: "#5EEAD4", color: "#0B1714", fontWeight: 700, fontSize: 12, padding: "8px 18px", borderRadius: 6, cursor: "pointer", letterSpacing: "0.04em" }}>
            Cart (0)
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Background glow */}
        <div style={{ position: "absolute", top: -80, right: -60, width: 600, height: 600, background: "radial-gradient(circle, rgba(20,83,66,0.55) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: -100, width: 400, height: 400, background: "radial-gradient(circle, rgba(15,60,48,0.4) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ display: "flex", alignItems: "center", padding: "80px 48px 60px", gap: 60 }}>
          {/* Left — copy */}
          <div style={{ flex: 1, maxWidth: 560 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(94,234,212,0.10)", border: "1px solid rgba(94,234,212,0.25)", borderRadius: 20, padding: "5px 14px", marginBottom: 28 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#5EEAD4" }} />
              <span style={{ fontSize: 11, color: "#5EEAD4", letterSpacing: "0.1em", fontWeight: 600 }}>99%+ HPLC VERIFIED PURITY</span>
            </div>

            <h1 style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.08, margin: "0 0 24px", color: "#F1F5F9" }}>
              Research<br />
              Peptides.<br />
              <span style={{ color: "#5EEAD4" }}>Uncompromising</span><br />
              Purity.
            </h1>

            <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 36px", maxWidth: 440 }}>
              Pharmaceutical-grade peptides for serious researchers. Every batch third-party tested with full COA documentation, ESI-TOF mass spec data, and HPLC purity analysis.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <button style={{ background: "#5EEAD4", color: "#0B1714", fontWeight: 700, fontSize: 14, padding: "14px 28px", borderRadius: 8, border: "none", cursor: "pointer", letterSpacing: "0.03em" }}>
                Shop Peptides
              </button>
              <button style={{ background: "transparent", color: "#CBD5E1", fontWeight: 600, fontSize: 14, padding: "14px 28px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.15)", cursor: "pointer" }}>
                View COA Reports →
              </button>
            </div>

            {/* Trust stats */}
            <div style={{ display: "flex", gap: 32, marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              {[["99%+", "HPLC Purity"], ["48hr", "UK Dispatch"], ["COA", "Every Order"], ["5★", "Trustpilot"]].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: "#5EEAD4" }}>{val}</div>
                  <div style={{ fontSize: 10, color: "#64748B", letterSpacing: "0.1em", marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — product cards */}
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { name: "BPC-157", tag: "BESTSELLER", desc: "Gut & tissue repair", purity: "99.2%", price: "£49.99" },
              { name: "TB-500", tag: "POPULAR", desc: "Recovery & healing", purity: "99.5%", price: "£59.99" },
              { name: "Semaglutide", tag: "NEW", desc: "Metabolic support", purity: "99.1%", price: "£89.99" },
              { name: "CJC-1295", tag: "STACK", desc: "GH secretagogue", purity: "99.4%", price: "£54.99" },
            ].map(p => (
              <div key={p.name} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(94,234,212,0.12)", borderRadius: 12, padding: "20px 18px", cursor: "pointer", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(94,234,212,0.4)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(94,234,212,0.12)")}>
                <div style={{ fontSize: 9, fontWeight: 700, color: "#5EEAD4", letterSpacing: "0.12em", marginBottom: 8 }}>{p.tag}</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#F1F5F9", marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 12 }}>{p.desc}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: "#5EEAD4", fontWeight: 600 }}>Purity {p.purity}</div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#F1F5F9" }}>{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 48px", display: "flex", gap: 32, justifyContent: "center" }}>
        {["🔬 Third-Party Lab Tested", "📋 COA on Every Order", "🚚 Free UK Shipping £100+", "🌍 Worldwide Delivery", "🔒 Discreet Packaging"].map(t => (
          <span key={t} style={{ fontSize: 12, color: "#475569" }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
