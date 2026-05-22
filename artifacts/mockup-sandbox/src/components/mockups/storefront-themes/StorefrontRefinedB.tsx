import React from "react";
import { ShoppingCart, FlaskConical, Shield, Truck, Award, ChevronRight, ArrowRight, CheckCircle, Search, Star, Zap } from "lucide-react";

const NAV = ["All Peptides", "Popular Peptides", "Research Stacks", "Bundle & Save", "Test Results", "Calculator"];

const PRODUCTS = [
  { id: 1, name: "BPC-157", strength: "5mg", category: "Healing Peptides", price: "£65.00", badge: "Bestseller", purity: "99.1%" },
  { id: 2, name: "BPC-157 + TB-500 Blend", strength: "5mg", category: "Peptide Blends", price: "£115.00", badge: "Popular", purity: "98.7%" },
  { id: 3, name: "CJC-1295 No-DAC", strength: "5mg", category: "Growth Peptides", price: "£65.00", badge: null, purity: "98.4%" },
  { id: 4, name: "AOD Peptide", strength: "5mg", category: "Weight Management", price: "£120.00", badge: null, purity: "98.9%" },
  { id: 5, name: "Epithalon", strength: "10mg", category: "Longevity Peptides", price: "£75.00", badge: "Top Rated", purity: "99.3%" },
  { id: 6, name: "Semaglutide", strength: "5mg", category: "Weight Management", price: "£65.00", badge: null, purity: "98.6%" },
  { id: 7, name: "TB-500 Fragment 2-7", strength: "2mg", category: "Healing Peptides", price: "£105.00", badge: null, purity: "98.8%" },
  { id: 8, name: "Tirzepatide", strength: "10mg", category: "Weight Management", price: "£185.00", badge: "New In", purity: "99.0%" },
];

const PILLARS = [
  { num: "01", icon: <FlaskConical size={22} />, title: "HPLC Verified Purity", body: "Every batch independently tested to confirm 98%+ purity before dispatch.", stat: "98%+" },
  { num: "02", icon: <Award size={22} />, title: "Full COA & MS Data", body: "Certificates of Analysis and ESI-TOF mass spectra included with every order.", stat: "COA" },
  { num: "03", icon: <Shield size={22} />, title: "Research Grade Only", body: "All peptides manufactured under research-grade conditions for in-vitro use only.", stat: "A+" },
  { num: "04", icon: <Truck size={22} />, title: "Fast UK Dispatch", body: "Orders placed before noon dispatched same day in discreet, secure packaging.", stat: "24h" },
];

function MoleculeDecor() {
  return (
    <svg viewBox="0 0 360 360" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <line x1="180" y1="180" x2="80" y2="90" stroke="rgba(147,197,253,0.2)" strokeWidth="1.5" />
      <line x1="180" y1="180" x2="280" y2="90" stroke="rgba(147,197,253,0.2)" strokeWidth="1.5" />
      <line x1="180" y1="180" x2="80" y2="270" stroke="rgba(147,197,253,0.2)" strokeWidth="1.5" />
      <line x1="180" y1="180" x2="280" y2="270" stroke="rgba(147,197,253,0.2)" strokeWidth="1.5" />
      <line x1="80" y1="90" x2="280" y2="90" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="80" y1="270" x2="280" y2="270" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <line x1="180" y1="180" x2="180" y2="40" stroke="rgba(147,197,253,0.15)" strokeWidth="1.5" />
      <line x1="180" y1="180" x2="180" y2="320" stroke="rgba(147,197,253,0.15)" strokeWidth="1.5" />
      <line x1="180" y1="180" x2="40" y2="180" stroke="rgba(147,197,253,0.15)" strokeWidth="1.5" />
      <line x1="180" y1="180" x2="320" y2="180" stroke="rgba(147,197,253,0.15)" strokeWidth="1.5" />
      <circle cx="80" cy="90" r="16" fill="rgba(147,197,253,0.18)" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" />
      <circle cx="280" cy="90" r="12" fill="rgba(165,243,252,0.14)" stroke="rgba(165,243,252,0.4)" strokeWidth="1.5" />
      <circle cx="80" cy="270" r="12" fill="rgba(165,243,252,0.14)" stroke="rgba(165,243,252,0.4)" strokeWidth="1.5" />
      <circle cx="280" cy="270" r="16" fill="rgba(147,197,253,0.18)" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" />
      <circle cx="180" cy="40" r="9" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <circle cx="180" cy="320" r="9" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <circle cx="40" cy="180" r="9" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <circle cx="320" cy="180" r="9" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.28)" strokeWidth="1.5" />
      <circle cx="180" cy="180" r="34" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
      <circle cx="180" cy="180" r="20" fill="rgba(147,197,253,0.25)" stroke="rgba(147,197,253,0.65)" strokeWidth="2" />
      <circle cx="180" cy="180" r="7" fill="rgba(255,255,255,0.95)" />
    </svg>
  );
}

export function StorefrontRefinedB() {
  return (
    <div style={{ fontFamily: "'Arimo', system-ui, sans-serif", background: "#F0F4FA", color: "#0f172a", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Announcement bar */}
      <div style={{ background: "#070F22", color: "rgba(255,255,255,0.7)", textAlign: "center", fontSize: 11, padding: "7px 16px", letterSpacing: "0.07em", display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
        <span>🔬 <strong style={{ color: "white" }}>Free shipping</strong> on orders over £150</span>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
        <span>Same-day dispatch before noon</span>
        <span style={{ color: "rgba(255,255,255,0.25)" }}>·</span>
        <span>HPLC verified 98%+</span>
      </div>

      {/* Header */}
      <header style={{ background: "#0A1628", borderBottom: "1px solid rgba(255,255,255,0.07)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "center", height: 60, gap: 28 }}>
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, background: "linear-gradient(140deg, #2563EB 0%, #1240A0 100%)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 16px rgba(37,99,235,0.5)" }}>
              <FlaskConical size={15} color="white" />
            </div>
            <div>
              <div style={{ color: "white", fontSize: 14, fontWeight: 800, letterSpacing: "0.08em", lineHeight: 1 }}>OMNIQURE</div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 8, letterSpacing: "0.14em", lineHeight: 1, marginTop: 2.5 }}>PEPTIDE RESEARCH INSTITUTE</div>
            </div>
          </a>

          <div style={{ width: 1, height: 28, background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />

          {/* Nav */}
          <nav style={{ display: "flex", gap: 4, flex: 1 }}>
            {NAV.map((item, i) => (
              <a key={item} href="#" style={{
                color: i === 0 ? "white" : "rgba(255,255,255,0.55)",
                fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap",
                letterSpacing: "0.03em", padding: "6px 12px", borderRadius: 6,
                background: i === 0 ? "rgba(37,99,235,0.2)" : "transparent",
                transition: "all 0.15s"
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.07)"; el.style.color = "white"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = i === 0 ? "rgba(37,99,235,0.2)" : "transparent"; el.style.color = i === 0 ? "white" : "rgba(255,255,255,0.55)"; }}
              >{item}</a>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Search size={15} color="rgba(255,255,255,0.5)" style={{ cursor: "pointer" }} />
            <div style={{ position: "relative", cursor: "pointer" }}>
              <ShoppingCart size={15} color="rgba(255,255,255,0.5)" />
              <div style={{ position: "absolute", top: -6, right: -6, width: 15, height: 15, background: "#2563EB", borderRadius: "50%", fontSize: 8, fontWeight: 800, color: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px solid #0A1628" }}>0</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero — full bleed, centered */}
      <section style={{
        background: "linear-gradient(160deg, #020a1c 0%, #071533 40%, #0c1f52 70%, #0e2870 100%)",
        minHeight: 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        textAlign: "center",
      }}>
        {/* Blue radial glow */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 800, height: 500, background: "radial-gradient(ellipse, rgba(37,99,235,0.28) 0%, rgba(18,64,160,0.12) 45%, transparent 70%)", pointerEvents: "none" }} />
        {/* Left molecule */}
        <div style={{ position: "absolute", left: -40, top: "50%", transform: "translateY(-50%)", width: 340, height: 340, opacity: 0.6 }}>
          <MoleculeDecor />
        </div>
        {/* Right molecule */}
        <div style={{ position: "absolute", right: -40, top: "50%", transform: "translateY(-50%)", width: 280, height: 280, opacity: 0.4 }}>
          <MoleculeDecor />
        </div>

        <div style={{ position: "relative", zIndex: 1, maxWidth: 760, padding: "80px 32px" }}>
          {/* Eyebrow */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(37,99,235,0.16)", border: "1px solid rgba(37,99,235,0.38)", borderRadius: 100, padding: "6px 16px", marginBottom: 28 }}>
            <div style={{ width: 7, height: 7, background: "#34D399", borderRadius: "50%", boxShadow: "0 0 8px #34D399" }} />
            <span style={{ color: "#93C5FD", fontSize: 10, fontWeight: 700, letterSpacing: "0.14em" }}>PEPTIDE RESEARCH INSTITUTE · UK BASED</span>
          </div>

          <h1 style={{ color: "white", fontSize: 64, fontWeight: 800, lineHeight: 1.04, margin: "0 0 20px", letterSpacing: "-0.03em" }}>
            Research-Grade<br />
            Peptides.{" "}
            <span style={{ background: "linear-gradient(90deg, #60A5FA 0%, #3B82F6 50%, #93C5FD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Verified.</span>
            {" "}
            <span style={{ background: "linear-gradient(90deg, #93C5FD 0%, #60A5FA 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Delivered.</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, lineHeight: 1.7, margin: "0 auto 32px", maxWidth: 560 }}>
            Every vial independently verified to 98%+ HPLC purity — backed by full COA documentation and ESI-TOF mass spectrometry. Trusted by researchers who demand certainty.
          </p>

          {/* Trust chips */}
          <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 8, marginBottom: 36 }}>
            {["98%+ HPLC Purity", "Full COA Included", "ESI-TOF MS Verified", "Lyophilised Peptides"].map(t => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#CBD5E1", fontSize: 11, fontWeight: 600, padding: "6px 13px", borderRadius: 20, backdropFilter: "blur(8px)", letterSpacing: "0.04em" }}>
                <CheckCircle size={10} color="#34D399" />
                {t}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", justifyContent: "center", gap: 14, alignItems: "center" }}>
            <a href="#" style={{ background: "white", color: "#1240A0", padding: "14px 32px", borderRadius: 11, fontWeight: 800, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 8px 28px rgba(0,0,0,0.45)", letterSpacing: "0.01em" }}>
              Browse All 81 Peptides <ArrowRight size={15} />
            </a>
            <a href="#" style={{ color: "#93C5FD", fontSize: 13, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5, letterSpacing: "0.04em" }}>
              VIEW LAB RESULTS <ChevronRight size={13} />
            </a>
          </div>
        </div>
      </section>

      {/* Trust strip — dark */}
      <div style={{ background: "#070F22", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px", display: "flex", alignItems: "stretch" }}>
          {[
            { icon: <FlaskConical size={14} />, label: "HPLC Purity 98%+" },
            { icon: <Award size={14} />, label: "Full COA & MS Data" },
            { icon: <Shield size={14} />, label: "Research Grade Only" },
            { icon: <Truck size={14} />, label: "Same-Day Dispatch" },
            { icon: <Zap size={14} />, label: "Free Shipping £150+" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "13px 32px", borderRight: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none", flex: 1, justifyContent: "center" }}>
              <span style={{ color: "#3B82F6" }}>{item.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bundle strip */}
      <div style={{ background: "linear-gradient(100deg, #030d1f 0%, #0a1e4a 35%, #1240A0 75%, #1B5CB5 100%)" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "13px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ background: "rgba(255,255,255,0.2)", color: "white", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.12em" }}>SAVE UP TO 20%</span>
            <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600 }}>Bundle & save — combine any 2+ peptides for an instant discount</span>
          </div>
          <a href="#" style={{ color: "white", fontSize: 11, fontWeight: 800, textDecoration: "none", display: "flex", alignItems: "center", gap: 5, letterSpacing: "0.08em", background: "rgba(255,255,255,0.15)", padding: "6px 14px", borderRadius: 7 }}>
            SHOP BUNDLES <ChevronRight size={13} />
          </a>
        </div>
      </div>

      {/* Featured Products */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "52px 28px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#1B5CB5", letterSpacing: "0.12em", margin: "0 0 5px", textTransform: "uppercase" }}>HPLC Verified · Every Batch</p>
            <h2 style={{ fontSize: 26, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Featured Peptides</h2>
          </div>
          <a href="#" style={{ color: "#1B5CB5", fontSize: 11, fontWeight: 800, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.08em", border: "1.5px solid #1B5CB5", padding: "7px 14px", borderRadius: 8 }}>
            VIEW ALL COLLECTION <ChevronRight size={13} />
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {PRODUCTS.map(p => (
            <div key={p.id}
              style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1.5px solid #DDE5F0", cursor: "pointer", transition: "all 0.22s", boxShadow: "0 2px 8px rgba(15,23,42,0.05)" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#1B5CB5";
                el.style.boxShadow = "0 20px 48px rgba(27,92,181,0.16), 0 4px 16px rgba(15,23,42,0.08)";
                el.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#DDE5F0";
                el.style.boxShadow = "0 2px 8px rgba(15,23,42,0.05)";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Navy accent bar */}
              <div style={{ height: 4, background: "linear-gradient(90deg, #1240A0, #2563EB)" }} />

              {/* Image */}
              <div style={{ background: "linear-gradient(145deg, #F0F6FF 0%, #E0EDFF 100%)", height: 136, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ width: 56, height: 56, background: "linear-gradient(135deg, #1240A0 0%, #2563EB 100%)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(18,64,160,0.35)" }}>
                  <FlaskConical size={24} color="white" strokeWidth={1.5} />
                </div>
                {p.badge && (
                  <div style={{ position: "absolute", top: 9, left: 9, background: "#1240A0", color: "white", fontSize: 8, fontWeight: 800, padding: "3px 9px", borderRadius: 100, letterSpacing: "0.07em" }}>
                    {p.badge}
                  </div>
                )}
                <div style={{ position: "absolute", bottom: 9, right: 9, background: "rgba(255,255,255,0.92)", color: "#059669", fontSize: 8, fontWeight: 800, padding: "3px 7px", borderRadius: 6, letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 3 }}>
                  <CheckCircle size={8} /> {p.purity} HPLC
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: "13px 15px 16px" }}>
                <div style={{ fontSize: 8, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: 4, textTransform: "uppercase" }}>{p.category}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.25, marginBottom: 2 }}>{p.name}</div>
                <div style={{ fontSize: 10, color: "#94A3B8", marginBottom: 13, letterSpacing: "0.04em" }}>{p.strength} · Lyophilised powder</div>

                <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "10px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#1240A0", letterSpacing: "-0.02em", lineHeight: 1 }}>{p.price}</div>
                    <div style={{ fontSize: 9, color: "#94A3B8", marginTop: 1, letterSpacing: "0.05em" }}>incl. COA & MS</div>
                  </div>
                  <button style={{ background: "linear-gradient(135deg, #1240A0, #2563EB)", color: "white", border: "none", borderRadius: 8, padding: "8px 12px", fontSize: 10, fontWeight: 800, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.05em", boxShadow: "0 4px 12px rgba(18,64,160,0.35)" }}>
                    <ShoppingCart size={10} /> ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose — dark section */}
      <section style={{ background: "linear-gradient(140deg, #070F22 0%, #0c1f52 100%)", marginTop: 56, padding: "64px 28px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#60A5FA", letterSpacing: "0.14em", margin: "0 0 10px" }}>QUALITY WITHOUT COMPROMISE</p>
            <h2 style={{ color: "white", fontSize: 34, fontWeight: 800, margin: 0, letterSpacing: "-0.025em" }}>Why Choose OmniQure?</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {PILLARS.map(p => (
              <div key={p.num} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 16, padding: "28px 24px", position: "relative", overflow: "hidden", backdropFilter: "blur(8px)" }}>
                <div style={{ position: "absolute", top: -6, right: 12, fontSize: 56, fontWeight: 900, color: "rgba(255,255,255,0.04)", letterSpacing: "-0.04em", lineHeight: 1, pointerEvents: "none" }}>{p.num}</div>
                <div style={{ width: 44, height: 44, background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.35)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA", marginBottom: 14 }}>
                  {p.icon}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#60A5FA", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 6 }}>{p.stat}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "white", marginBottom: 8, lineHeight: 1.3 }}>{p.title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community section */}
      <section style={{ maxWidth: 1240, margin: "56px auto 0", padding: "0 28px 64px" }}>
        <div style={{ background: "white", borderRadius: 20, border: "1.5px solid #DDE5F0", padding: "48px 56px", display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", right: 200, top: "50%", transform: "translateY(-50%)", width: 300, height: 300, background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />
          <div>
            <p style={{ fontSize: 10, fontWeight: 800, color: "#1B5CB5", letterSpacing: "0.12em", margin: "0 0 10px" }}>SUPPORTING RESEARCHERS WORLDWIDE</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Supporting the Scientific Community</h2>
            <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, margin: "0 0 28px", maxWidth: 480 }}>
              OmniQure supplies research institutions, laboratories, and independent scientists with pharmaceutical-grade peptides to advance scientific knowledge.
            </p>
            <a href="#" style={{ background: "linear-gradient(135deg, #1240A0, #2563EB)", color: "white", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 6px 20px rgba(18,64,160,0.35)" }}>
              Find Your Peptide <ArrowRight size={14} />
            </a>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { val: "98%+", label: "HPLC Purity" },
              { val: "100+", label: "Peptides" },
              { val: "COA", label: "Included" },
              { val: "24h", label: "Dispatch" },
            ].map(s => (
              <div key={s.val} style={{ background: "#F0F6FF", borderRadius: 12, padding: "20px 18px", textAlign: "center", minWidth: 80, border: "1px solid #DBEAFE" }}>
                <div style={{ color: "#1240A0", fontSize: 20, fontWeight: 800, letterSpacing: "-0.01em" }}>{s.val}</div>
                <div style={{ color: "#64748B", fontSize: 9, fontWeight: 700, marginTop: 4, letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#030b1e", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "44px 28px 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 1fr 1fr 1fr", gap: 28, marginBottom: 36 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #2563EB, #1240A0)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 12px rgba(37,99,235,0.4)" }}>
                  <FlaskConical size={13} color="white" />
                </div>
                <span style={{ color: "white", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em" }}>OMNIQURE</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, lineHeight: 1.65, margin: "0 0 16px" }}>Research-grade peptides for in-vitro scientific research only.</p>
              <div style={{ display: "flex", gap: 6 }}>
                {["HPLC", "COA", "MS"].map(badge => (
                  <span key={badge} style={{ background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)", color: "#60A5FA", fontSize: 8, fontWeight: 800, padding: "3px 7px", borderRadius: 5, letterSpacing: "0.1em" }}>{badge}</span>
                ))}
              </div>
            </div>
            {[
              { title: "Purchase Peptides", links: ["BPC-157 5mg", "Ipamorelin 5mg", "GHK-Cu 50mg", "Sermorelin 5mg", "TB-500 5mg"] },
              { title: "Peptide Blends", links: ["BPC + TB-500 10mg", "CJC1295 + GHRP-2", "CJC + Ipamorelin", "Sermorelin + GHRP-2"] },
              { title: "Categories", links: ["Growth Peptides", "Healing Peptides", "Weight Management", "Longevity Peptides", "Nootropics"] },
              { title: "Company", links: ["Contact Us", "Track Your Order", "Research Stacks", "Lab Results & COA", "All Peptides"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", marginBottom: 14, textTransform: "uppercase" }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ marginBottom: 9 }}>
                    <a href="#" style={{ color: "rgba(255,255,255,0.32)", fontSize: 11, textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.72)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.32)")}
                    >{link}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, letterSpacing: "0.06em" }}>© 2025 OMNIQURE · FOR RESEARCH USE ONLY · NOT FOR HUMAN CONSUMPTION</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Terms of Service", "Privacy Policy", "Legal Disclaimer"].map(l => (
                <a key={l} href="#" style={{ color: "rgba(255,255,255,0.22)", fontSize: 10, textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}
                >{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
