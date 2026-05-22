import React from "react";
import { ShoppingCart, FlaskConical, Shield, Truck, Award, ChevronRight, ArrowRight, CheckCircle, Search, User } from "lucide-react";

const NAV = ["All Peptides", "Popular Peptides", "Research Stacks", "Bundle & Save", "Test Results", "Calculator"];

const PRODUCTS = [
  { id: 1, name: "BPC-157", strength: "5mg", category: "Healing Peptides", price: "£65.00", badge: "Bestseller", hue: "#1B5CB5" },
  { id: 2, name: "BPC-157 + TB-500 Blend", strength: "5mg", category: "Peptide Blends", price: "£115.00", badge: "Popular", hue: "#1B5CB5" },
  { id: 3, name: "CJC-1295 No-DAC", strength: "5mg", category: "Growth Peptides", price: "£65.00", badge: null, hue: "#1B5CB5" },
  { id: 4, name: "AOD Peptide", strength: "5mg", category: "Weight Management", price: "£120.00", badge: null, hue: "#1B5CB5" },
  { id: 5, name: "Epithalon", strength: "10mg", category: "Longevity Peptides", price: "£75.00", badge: "Top Rated", hue: "#1B5CB5" },
  { id: 6, name: "Semaglutide", strength: "5mg", category: "Weight Management", price: "£65.00", badge: null, hue: "#1B5CB5" },
  { id: 7, name: "TB-500 Fragment 2-7", strength: "2mg", category: "Healing Peptides", price: "£105.00", badge: null, hue: "#1B5CB5" },
  { id: 8, name: "Tirzepatide", strength: "10mg", category: "Weight Management", price: "£185.00", badge: "New In", hue: "#1B5CB5" },
];

const PILLARS = [
  { num: "01", icon: <FlaskConical size={18} />, title: "HPLC Verified Purity", body: "Every batch tested to confirm 98%+ purity before dispatch." },
  { num: "02", icon: <Award size={18} />, title: "Full COA & MS Data", body: "Certificates of Analysis and ESI-TOF mass spectra with every order." },
  { num: "03", icon: <Shield size={18} />, title: "Research Grade Only", body: "All peptides manufactured for in-vitro research applications only." },
  { num: "04", icon: <Truck size={18} />, title: "Fast UK Dispatch", body: "Orders before noon dispatched same day in discreet, secure packaging." },
];

export function StorefrontRefinedA() {
  return (
    <div style={{ fontFamily: "'Arimo', system-ui, sans-serif", background: "#F8FAFC", color: "#0f172a", minHeight: "100vh", overflowX: "hidden" }}>

      {/* Announcement bar */}
      <div style={{ background: "#1240A0", color: "white", textAlign: "center", fontSize: 11, padding: "7px 16px", letterSpacing: "0.08em", fontWeight: 600 }}>
        FREE SHIPPING ON ORDERS OVER £150 · SAME-DAY DISPATCH BEFORE NOON · HPLC VERIFIED 98%+
      </div>

      {/* Header */}
      <header style={{ background: "#070F22", borderBottom: "1px solid rgba(255,255,255,0.06)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", height: 58, gap: 32 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, marginRight: 8 }}>
            <div style={{ width: 30, height: 30, background: "linear-gradient(135deg, #2563EB 0%, #1240A0 100%)", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FlaskConical size={14} color="white" />
            </div>
            <div>
              <div style={{ color: "white", fontSize: 13, fontWeight: 800, letterSpacing: "0.1em", lineHeight: 1 }}>OMNIQURE</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 9, letterSpacing: "0.12em", lineHeight: 1, marginTop: 2 }}>PEPTIDE RESEARCH INSTITUTE</div>
            </div>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", gap: 20, flex: 1, overflow: "hidden" }}>
            {NAV.map(item => (
              <a key={item} href="#" style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, textDecoration: "none", whiteSpace: "nowrap", letterSpacing: "0.04em", padding: "4px 0", borderBottom: "1.5px solid transparent", transition: "all 0.15s" }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "white"; (e.currentTarget as HTMLElement).style.borderBottomColor = "#2563EB"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)"; (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
              >{item}</a>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Search size={15} color="rgba(255,255,255,0.5)" style={{ cursor: "pointer" }} />
            <User size={15} color="rgba(255,255,255,0.5)" style={{ cursor: "pointer" }} />
            <div style={{ position: "relative" }}>
              <ShoppingCart size={15} color="rgba(255,255,255,0.5)" style={{ cursor: "pointer" }} />
              <div style={{ position: "absolute", top: -5, right: -5, width: 14, height: 14, background: "#2563EB", borderRadius: "50%", fontSize: 8, fontWeight: 700, color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>0</div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: "linear-gradient(130deg, #030b1e 0%, #071230 40%, #0c1f52 70%, #1240A0 100%)",
        minHeight: 480,
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Dot grid */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        {/* Blue glow */}
        <div style={{ position: "absolute", left: "-80px", top: "-80px", width: 700, height: 600, background: "radial-gradient(ellipse at 35% 38%, rgba(40,120,255,0.55) 0%, rgba(20,80,230,0.28) 32%, transparent 65%)", pointerEvents: "none", mixBlendMode: "screen" }} />
        {/* Right fade */}
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: "35%", background: "linear-gradient(to left, rgba(18,64,160,0.15), transparent)" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "72px 32px", position: "relative", zIndex: 1, display: "grid", gridTemplateColumns: "1fr 420px", gap: 64, alignItems: "center" }}>
          {/* Text */}
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(37,99,235,0.18)", border: "1px solid rgba(37,99,235,0.4)", borderRadius: 100, padding: "5px 14px", marginBottom: 24 }}>
              <div style={{ width: 6, height: 6, background: "#34D399", borderRadius: "50%", boxShadow: "0 0 6px #34D399" }} />
              <span style={{ color: "#93C5FD", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em" }}>RESEARCH-GRADE · HPLC VERIFIED · UK DISPATCHED</span>
            </div>
            <h1 style={{ color: "white", fontSize: 56, fontWeight: 800, lineHeight: 1.05, margin: "0 0 18px", letterSpacing: "-0.025em" }}>
              Research-Grade<br />
              Peptides.{" "}
              <span style={{ background: "linear-gradient(90deg, #60A5FA, #3B82F6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Verified.</span>
              <br />
              <span style={{ background: "linear-gradient(90deg, #60A5FA, #93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Delivered.</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 16, lineHeight: 1.7, margin: "0 0 28px", maxWidth: 480 }}>
              Every vial independently verified to 98%+ HPLC purity — backed by full COA documentation and ESI-TOF mass spectrometry data. Trusted by researchers who demand certainty.
            </p>
            {/* Trust chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 32 }}>
              {["98%+ HPLC Purity", "Full COA Included", "ESI-TOF MS", "Lyophilised"].map(t => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 5, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", color: "#E2E8F0", fontSize: 11, fontWeight: 600, padding: "5px 11px", borderRadius: 20, backdropFilter: "blur(6px)", letterSpacing: "0.04em" }}>
                  <CheckCircle size={10} color="#34D399" />
                  {t}
                </span>
              ))}
            </div>
            {/* CTAs */}
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <a href="#" style={{ background: "white", color: "#1240A0", padding: "13px 28px", borderRadius: 10, fontWeight: 800, fontSize: 14, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
                Browse All 81 Peptides <ArrowRight size={15} />
              </a>
              <a href="#" style={{ color: "#93C5FD", fontSize: 13, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 5 }}>
                View Lab Results <ChevronRight size={13} />
              </a>
            </div>
          </div>

          {/* Stats panel */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { val: "98%+", label: "Min. Purity", sub: "HPLC verified" },
              { val: "100+", label: "Products", sub: "In stock" },
              { val: "COA", label: "Included", sub: "Every order" },
              { val: "A+", label: "Quality", sub: "Research grade" },
            ].map(s => (
              <div key={s.val} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "22px 18px", backdropFilter: "blur(8px)" }}>
                <div style={{ color: "#60A5FA", fontSize: 32, fontWeight: 800, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.val}</div>
                <div style={{ color: "white", fontSize: 12, fontWeight: 700, marginTop: 6, letterSpacing: "0.04em" }}>{s.label}</div>
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, marginTop: 2, letterSpacing: "0.05em" }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <div style={{ background: "white", borderTop: "1px solid #E8EDF5", borderBottom: "1px solid #E8EDF5" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 32px", display: "flex", gap: 0, alignItems: "stretch", justifyContent: "center" }}>
          {[
            { icon: <FlaskConical size={14} />, text: "HPLC Purity 98%+" },
            { icon: <Award size={14} />, text: "Full COA & MS Data" },
            { icon: <Shield size={14} />, text: "Research Grade Only" },
            { icon: <Truck size={14} />, text: "Same-Day Dispatch" },
            { icon: <CheckCircle size={14} />, text: "Free Shipping £150+" },
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, padding: "0 28px", borderRight: i < 4 ? "1px solid #E8EDF5" : "none" }}>
              <span style={{ color: "#1B5CB5" }}>{item.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#374151", letterSpacing: "0.06em", whiteSpace: "nowrap" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bundle strip */}
      <div style={{ background: "linear-gradient(100deg, #030d1f 0%, #0a1e4a 35%, #1240A0 75%, #1B5CB5 100%)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ background: "rgba(255,255,255,0.15)", color: "white", fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 100, letterSpacing: "0.1em" }}>SAVE UP TO 20%</span>
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>Bundle & save — combine any 2+ peptides and save instantly</span>
          </div>
          <a href="#" style={{ color: "white", fontSize: 12, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.05em" }}>
            SHOP BUNDLES <ChevronRight size={14} />
          </a>
        </div>
      </div>

      {/* Featured Products */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 32px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 28, borderBottom: "1.5px solid #E8EDF5", paddingBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#1B5CB5", letterSpacing: "0.1em", margin: "0 0 6px", textTransform: "uppercase" }}>Our Most Researched Compounds</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Featured Peptides</h2>
          </div>
          <a href="#" style={{ color: "#1B5CB5", fontSize: 12, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4, letterSpacing: "0.05em" }}>
            VIEW ALL COLLECTION <ChevronRight size={14} />
          </a>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {PRODUCTS.map(p => (
            <div key={p.id}
              style={{ background: "white", borderRadius: 14, overflow: "hidden", border: "1.5px solid #E8EDF5", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#2563EB55";
                el.style.boxShadow = "0 16px 40px rgba(37,99,235,0.13), 0 2px 10px rgba(15,23,42,0.06)";
                el.style.transform = "translateY(-3px)";
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.borderColor = "#E8EDF5";
                el.style.boxShadow = "none";
                el.style.transform = "translateY(0)";
              }}
            >
              {/* Image */}
              <div style={{ background: "linear-gradient(140deg, #EEF4FF 0%, #DBEAFE 100%)", height: 148, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <div style={{ width: 60, height: 60, background: "linear-gradient(135deg, #1240A0 0%, #2563EB 100%)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(18,64,160,0.3)" }}>
                  <FlaskConical size={26} color="white" strokeWidth={1.5} />
                </div>
                {p.badge && (
                  <div style={{ position: "absolute", top: 10, left: 10, background: "#1240A0", color: "white", fontSize: 9, fontWeight: 800, padding: "3px 9px", borderRadius: 100, letterSpacing: "0.07em" }}>
                    {p.badge}
                  </div>
                )}
                <div style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.9)", color: "#6B7280", fontSize: 8, fontWeight: 700, padding: "2px 7px", borderRadius: 100, letterSpacing: "0.08em" }}>HPLC ✓</div>
              </div>

              {/* Content */}
              <div style={{ padding: "14px 16px 18px" }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: "#94A3B8", letterSpacing: "0.1em", marginBottom: 5, textTransform: "uppercase" }}>{p.category}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", lineHeight: 1.25, marginBottom: 3 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 14, letterSpacing: "0.04em" }}>{p.strength} · Lyophilised</div>
                <div style={{ height: 1, background: "#F1F5F9", marginBottom: 14 }} />
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 20, fontWeight: 800, color: "#1240A0", letterSpacing: "-0.02em" }}>{p.price}</span>
                  <button style={{ background: "linear-gradient(135deg, #1240A0, #2563EB)", color: "white", border: "none", borderRadius: 8, padding: "8px 14px", fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, letterSpacing: "0.04em" }}>
                    <ShoppingCart size={11} /> ADD
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why choose */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "56px 32px" }}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#1B5CB5", letterSpacing: "0.1em", margin: "0 0 6px", textTransform: "uppercase" }}>Quality Without Compromise</p>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Why Choose OmniQure?</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 18 }}>
          {PILLARS.map(p => (
            <div key={p.num} style={{ background: "white", borderRadius: 14, border: "1.5px solid #E8EDF5", padding: "26px 22px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 18, right: 18, fontSize: 32, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.03em", lineHeight: 1 }}>{p.num}</div>
              <div style={{ width: 40, height: 40, background: "#EEF4FF", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#1B5CB5", marginBottom: 16 }}>
                {p.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginBottom: 8, lineHeight: 1.3 }}>{p.title}</div>
              <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.6 }}>{p.body}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Supporting section */}
      <section style={{ background: "linear-gradient(130deg, #070F22 0%, #0c1f52 100%)", padding: "56px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#60A5FA", letterSpacing: "0.1em", margin: "0 0 10px" }}>SUPPORTING RESEARCHERS WORLDWIDE</p>
            <h2 style={{ color: "white", fontSize: 32, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.02em", lineHeight: 1.15 }}>Supporting the Scientific Community</h2>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: 15, lineHeight: 1.7, margin: "0 0 28px" }}>
              OmniQure supplies research institutions, laboratories, and independent scientists with pharmaceutical-grade peptides to advance knowledge.
            </p>
            <a href="#" style={{ background: "#2563EB", color: "white", padding: "12px 24px", borderRadius: 10, fontWeight: 700, fontSize: 13, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
              Find Your Peptide <ArrowRight size={14} />
            </a>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { val: "98%+", label: "HPLC Purity" },
              { val: "Full", label: "COA Included" },
              { val: "LYOPH.", label: "All Peptides" },
              { val: "CERT.", label: "MS Verified" },
            ].map(s => (
              <div key={s.val} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                <div style={{ color: "#60A5FA", fontSize: 20, fontWeight: 800, letterSpacing: "-0.01em" }}>{s.val}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, fontWeight: 600, marginTop: 4, letterSpacing: "0.08em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: "#030b1e", borderTop: "1px solid rgba(255,255,255,0.06)", padding: "40px 32px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "200px 1fr 1fr 1fr 1fr", gap: 32, marginBottom: 40 }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                <div style={{ width: 28, height: 28, background: "linear-gradient(135deg, #2563EB, #1240A0)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <FlaskConical size={13} color="white" />
                </div>
                <span style={{ color: "white", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em" }}>OMNIQURE</span>
              </div>
              <p style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, lineHeight: 1.6, margin: 0 }}>Research-grade peptides for in-vitro scientific research only.</p>
            </div>
            {/* Links */}
            {[
              { title: "Purchase Peptides", links: ["BPC-157 5mg", "Ipamorelin 5mg", "GHK-Cu 50mg", "Sermorelin 5mg", "TB-500 5mg"] },
              { title: "Peptide Blends", links: ["BPC + TB-500 10mg", "CJC1295 + GHRP-2", "CJC + Ipamorelin", "Sermorelin + GHRP-2"] },
              { title: "Categories", links: ["Growth Peptides", "Healing Peptides", "Weight Management", "Longevity Peptides", "Nootropics"] },
              { title: "Company", links: ["Contact Us", "Track Your Order", "Research Stacks", "Lab Results & COA", "All Peptides"] },
            ].map(col => (
              <div key={col.title}>
                <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 12 }}>{col.title}</div>
                {col.links.map(link => (
                  <div key={link} style={{ marginBottom: 8 }}>
                    <a href="#" style={{ color: "rgba(255,255,255,0.35)", fontSize: 11, textDecoration: "none" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
                    >{link}</a>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.06em" }}>© 2025 OMNIQURE · FOR RESEARCH USE ONLY · NOT FOR HUMAN CONSUMPTION</span>
            <div style={{ display: "flex", gap: 20 }}>
              {["Terms", "Privacy", "Legal Disclaimer"].map(l => (
                <a key={l} href="#" style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, textDecoration: "none", letterSpacing: "0.06em" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
