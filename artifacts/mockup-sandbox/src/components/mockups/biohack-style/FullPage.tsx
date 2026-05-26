import { useState } from "react";

/* ─── EXACT BRAND TOKENS (extracted from biohacklondon.com branding JSON + screenshot) ─── */
const C = {
  bg:        "#0B1714",
  bg2:       "#0E1E1A",   // slightly lighter sections
  card:      "#0F2220",   // card fill
  cardHov:   "#132925",
  accent:    "#00BBA7",   // exact from branding JSON
  accentDim: "rgba(0,187,167,0.12)",
  accentBdr: "rgba(0,187,167,0.18)",
  accentGlw: "rgba(0,187,167,0.30)",
  text:      "#E8F0EF",
  muted:     "#6B8C88",
  dimmer:    "#3D5E5A",
  announce:  "#091410",
  inputBg:   "#1E3030",
  border:    "rgba(0,187,167,0.13)",
  divider:   "rgba(255,255,255,0.06)",
};

/* ─── DATA (real content from biohacklondon.com) ─── */
const PRODUCTS = [
  { id: 1, name: "GHK-CU Vial",        price: "£55",          badge: "",           img: "🧪" },
  { id: 2, name: "BPC-157 Vial",        price: "£37.50",       badge: "Bestseller", img: "⚗️" },
  { id: 3, name: "MOTS-C Vial",         price: "From £34.99",  badge: "Popular",    img: "🔬" },
  { id: 4, name: "Reta Vial",           price: "From £69.99",  badge: "Bestseller", img: "💊" },
];

const RESEARCH = [
  { n: "01", title: "Tissue Repair",           desc: "Studied for roles in tissue repair mechanisms and cellular recovery pathways in controlled laboratory models." },
  { n: "02", title: "Neurological Pathways",   desc: "Investigated for interactions with neurological signalling pathways in controlled in-vitro settings." },
  { n: "03", title: "Collagen & Skin Biology", desc: "Studied for roles in collagen synthesis pathways and oxidative stress response mechanisms." },
  { n: "04", title: "Mitochondrial Biology",   desc: "Investigated for effects on mitochondrial function and cellular energy regulation pathways." },
  { n: "05", title: "Musculoskeletal Research",desc: "Investigated for roles in muscle repair mechanisms, endurance pathways, and body composition research." },
  { n: "06", title: "Neuroendocrine Signalling",desc: "Studied for roles in sleep-related neuropeptide signalling and neuroendocrine pathway research." },
  { n: "07", title: "Vascular Biology",        desc: "Investigated for roles in angiogenesis, blood flow regulation, and cardiovascular mechanism research." },
  { n: "08", title: "Immune Modulation",       desc: "Researched for immune modulation mechanisms and inflammatory pathway interactions in laboratory settings." },
];

const STATS = [
  { val: "4.9★",  label: "Average Rating" },
  { val: "6000+", label: "Orders Dispatched" },
  { val: "99%+",  label: "Purity Every Batch" },
  { val: "24h",   label: "Dispatch Turnaround" },
  { val: "100%",  label: "Batch Traced" },
];

const REVIEWS = [
  { quote: "The quality of the peptides appears excellent, and everything arrived exactly as described. Customer service was responsive and helpful when I had a question.", name: "Catherine A.", product: "Reta" },
  { quote: "Very happy with the product. Had some questions which were answered promptly — customer service was perfect. Would use the service again for sure.", name: "Kyerematen", product: "Reta" },
  { quote: "Very professional & responds in a very timely manner. Has some of the best quality products & prices.", name: "Paul J.", product: "MOTS-C" },
  { quote: "Super impressed — this company is independently lab tested in Europe & UK! Excellent customer service.", name: "Yvonne G.", product: "Reta" },
  { quote: "Fast delivery and great product at a competitive price too. Highly recommend!", name: "Kamila S.", product: "Reta" },
  { quote: "5 star service — won't order from anyone else.", name: "Ryan M.", product: "BAC Water" },
];

const INSIGHTS = [
  { cat: "Research Guides",       title: "BPC-157 vs TB-500: research summary and key differences",                                            time: "9 min read" },
  { cat: "Research Guides",       title: "How to read a peptide Certificate of Analysis (COA)",                                                time: "9 min read" },
  { cat: "Research Guides",       title: "How to read research literature on peptides",                                                        time: "10 min read" },
  { cat: "Research Methodology",  title: "Independently verified UK research peptides: what 'lab tested' actually means",                      time: "13 min read" },
];

/* ─── SHARED PRIMITIVES ─── */
const Label = ({ children }: { children: string }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: C.accent, letterSpacing: "0.13em", marginBottom: 12 }}>
    {children}
  </div>
);

const Chip = ({ children }: { children: string }) => (
  <span style={{ display: "inline-block", background: C.accentDim, border: `1px solid ${C.accentBdr}`, color: C.accent, fontSize: 10, fontWeight: 700, padding: "3px 11px", borderRadius: 20, letterSpacing: "0.09em" }}>
    {children}
  </span>
);

/* ─── HEX LOGO MARK (matches BHL hexagon style) ─── */
const HexMark = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
    <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill={C.accentDim} stroke={C.accent} strokeWidth="1.5"/>
    <text x="18" y="22" textAnchor="middle" fill={C.accent} fontSize="10" fontWeight="800" fontFamily="Roboto,sans-serif">OQ</text>
  </svg>
);

/* ─── STAR RATING ─── */
const Stars = ({ n = 5, size = 13 }: { n?: number; size?: number }) => (
  <span style={{ color: C.accent, fontSize: size, letterSpacing: 1 }}>{"★".repeat(n)}</span>
);

/* ─── MAIN COMPONENT ─── */
export default function FullPage() {
  const [ageGate, setAgeGate] = useState(true);
  const [email, setEmail] = useState("");

  return (
    <div style={{ fontFamily: "'Roboto', sans-serif", background: C.bg, color: C.text, minHeight: "100vh", overflowX: "hidden", position: "relative" }}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&display=swap" rel="stylesheet" />

      {/* ── AGE GATE ──────────────────────────────────────────── */}
      {ageGate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)", background: "rgba(8,14,13,0.82)" }}>
          <div style={{ background: "#0F2220", border: `1px solid ${C.accentBdr}`, borderRadius: 16, padding: "48px 44px", maxWidth: 440, width: "90%", textAlign: "center", boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${C.accentDim}` }}>
            <HexMark />
            <div style={{ marginTop: 14, marginBottom: 4, fontSize: 13, fontWeight: 700, color: C.text, letterSpacing: "0.06em" }}>omniQure™</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, margin: "20px 0 12px", color: C.text }}>Age Verification Required</h2>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: "0 0 28px" }}>
              You must be 18 years or older to access this website. Our products are intended for research purposes only.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 20 }}>
              <button onClick={() => setAgeGate(false)}
                style={{ background: C.accent, color: "#0B1714", fontWeight: 700, fontSize: 14.5, padding: "13px 28px", borderRadius: 8, border: "none", cursor: "pointer", boxShadow: `0 0 0 2px #0B1714, 0 0 0 4px ${C.accent}` }}>
                I am 18 or older
              </button>
              <button style={{ background: "transparent", color: C.muted, fontWeight: 500, fontSize: 14, padding: "13px 28px", borderRadius: 8, border: `1px solid ${C.dimmer}`, cursor: "pointer" }}>
                I am under 18
              </button>
            </div>
            <p style={{ fontSize: 11.5, color: C.dimmer, lineHeight: 1.6, margin: 0 }}>
              By entering this site you agree that you are of legal age in your jurisdiction and that all products are purchased for research purposes only.
            </p>
          </div>
        </div>
      )}

      {/* ── ANNOUNCEMENT BAR ─────────────────────────────────── */}
      <div style={{ background: C.announce, borderBottom: `1px solid ${C.border}`, textAlign: "center", padding: "9px 20px", fontSize: 13, color: C.accent, fontWeight: 500 }}>
        15% OFF your first order on single peptides — Use code{" "}
        <strong style={{ color: C.text }}>FIRST15</strong> at checkout{" "}
        <span style={{ textDecoration: "underline", cursor: "pointer", marginLeft: 8 }}>Shop Now →</span>
      </div>

      {/* ── NAV ──────────────────────────────────────────────── */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "15px 56px", borderBottom: `1px solid ${C.border}`, background: C.bg, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <HexMark />
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, letterSpacing: "0.05em", color: C.text, lineHeight: 1.1 }}>omniQure™</div>
            <div style={{ fontSize: 8, fontWeight: 500, letterSpacing: "0.22em", color: C.muted, marginTop: 2 }}>PEPTIDE RESEARCH INSTITUTE</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 30, fontSize: 13.5, color: C.muted, fontWeight: 500 }}>
          {["Peptides", "Stacks", "Lab Tests", "Research", "Insights", "About"].map(n => (
            <span key={n} style={{ cursor: "pointer", transition: "color .15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.text)}
              onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{n}</span>
          ))}
        </div>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <span style={{ fontSize: 13.5, color: C.muted, cursor: "pointer" }}>Account</span>
          <button style={{ background: C.accent, color: "#0B1714", fontWeight: 700, fontSize: 12.5, padding: "9px 20px", borderRadius: 8, border: "none", cursor: "pointer", letterSpacing: "0.03em" }}>Cart (0)</button>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "88px 56px 72px" }}>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: C.muted, letterSpacing: "0.07em", marginBottom: 22 }}>Est. 2025 · London, UK</div>

        <h1 style={{ fontSize: 72, fontWeight: 900, lineHeight: 1.02, margin: "0 0 22px", maxWidth: 720, letterSpacing: "-0.02em" }}>
          Research Peptides.<br />
          <em style={{ fontStyle: "italic", color: C.accent }}>Uncompromising</em><br />
          Purity.
        </h1>

        <p style={{ fontSize: 16, fontWeight: 500, color: C.muted, margin: "0 0 8px" }}>Third-Party Verified. Minimum 99% Purity.</p>
        <p style={{ fontSize: 12.5, color: C.dimmer, fontStyle: "italic", margin: "0 0 22px" }}>DISCLAIMER: For research purposes only, not for human consumption</p>

        <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 520, margin: "0 0 36px" }}>
          Independently verified by{" "}
          <span style={{ color: C.accent, borderBottom: `1px solid ${C.accentDim}` }}>PeptideVerify (UK)</span> &{" "}
          <span style={{ color: C.accent, borderBottom: `1px solid ${C.accentDim}` }}>Janoshik Analytical</span>.
          {" "}Live batch verification on every flagship peptide.
        </p>

        <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", marginBottom: 44 }}>
          <button style={{ background: C.accent, color: "#0B1714", fontWeight: 700, fontSize: 15, padding: "15px 30px", borderRadius: 8, border: "none", cursor: "pointer" }}>
            Shop All Products
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.muted }}>
            <Stars /><span>4.9 · 83 verified reviews</span>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 28, paddingTop: 28, borderTop: `1px solid ${C.divider}` }}>
          {["HPLC & Mass Spec Verified", "99%+ Purity Guaranteed", "Next-Day Delivery", "COA Every Batch"].map(t => (
            <div key={t} style={{ fontSize: 12, fontWeight: 600, color: C.muted, display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ color: C.accent, fontSize: 10 }}>✓</span>{t}
            </div>
          ))}
        </div>
      </section>

      {/* ── BESTSELLERS ──────────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 56px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
          <div>
            <Label>MOST POPULAR</Label>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Bestselling Peptides</h2>
          </div>
          <span style={{ color: C.accent, fontSize: 14, cursor: "pointer" }}>View All →</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20 }}>
          {PRODUCTS.map(p => (
            <div key={p.id}
              style={{ background: C.card, border: `1px solid ${C.accentBdr}`, borderRadius: 14, overflow: "hidden", cursor: "pointer", transition: "border-color .2s, transform .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentGlw; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.accentBdr; e.currentTarget.style.transform = "none"; }}>
              <div style={{ background: C.bg2, height: 200, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {p.badge && (
                  <div style={{ position: "absolute", top: 12, left: 12, background: C.accent, color: "#0B1714", fontSize: 10, fontWeight: 800, padding: "4px 12px", borderRadius: 20, letterSpacing: "0.07em" }}>{p.badge}</div>
                )}
                <div style={{ width: 90, height: 90, background: "rgba(0,187,167,0.08)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36, border: `1px solid ${C.accentBdr}` }}>{p.img}</div>
              </div>
              <div style={{ padding: "20px 20px 22px" }}>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: C.text }}>{p.name}</div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
                  <Chip>≥99% Purity</Chip>
                  <span style={{ fontSize: 11, color: C.muted }}>HPLC Verified</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{p.price}</span>
                  <button style={{ background: C.accent, color: "#0B1714", fontWeight: 700, fontSize: 11.5, padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer" }}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button style={{ background: "transparent", color: C.accent, fontWeight: 700, fontSize: 14, padding: "13px 36px", borderRadius: 8, border: `1.5px solid ${C.accentBdr}`, cursor: "pointer" }}>
            View All Products →
          </button>
        </div>
      </section>

      {/* ── RESEARCH AREAS ───────────────────────────────────── */}
      <section style={{ background: C.bg2, borderTop: `1px solid ${C.divider}`, borderBottom: `1px solid ${C.divider}`, padding: "64px 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Label>RESEARCH AREAS</Label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
              What peptides <em style={{ color: C.accent }}>are studied for.</em>
            </h2>
            <button style={{ background: C.accent, color: "#0B1714", fontWeight: 700, fontSize: 13, padding: "11px 22px", borderRadius: 8, border: "none", cursor: "pointer" }}>Shop All Peptides</button>
          </div>
          <p style={{ color: C.muted, fontSize: 14.5, maxWidth: 580, lineHeight: 1.7, marginBottom: 40 }}>
            From cellular repair to neuroendocrine signalling — peptide research spans a broad spectrum of biological pathways under active investigation.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {RESEARCH.map(r => (
              <div key={r.n} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 22px", cursor: "pointer", transition: "border-color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = C.accentBdr)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = C.border)}>
                <div style={{ fontSize: 11, fontWeight: 800, color: C.accent, letterSpacing: "0.14em", marginBottom: 10 }}>{r.n}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 10, lineHeight: 1.3 }}>{r.title}</div>
                <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.65 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section style={{ background: C.announce, borderBottom: `1px solid ${C.border}`, padding: "30px 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: 24 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.accent, letterSpacing: "-0.02em" }}>{s.val}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: C.muted, letterSpacing: "0.07em", marginTop: 5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PEPTIDE OF THE MONTH ─────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 56px" }}>
        <Label>FEATURED PRODUCT</Label>
        <div style={{ display: "flex", gap: 52, alignItems: "center", background: C.card, border: `1px solid ${C.accentBdr}`, borderRadius: 20, padding: "44px 52px", boxShadow: `0 0 60px rgba(0,187,167,0.04)` }}>
          <div style={{ width: 220, height: 240, flexShrink: 0, background: C.bg2, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 64, border: `1px solid ${C.border}` }}>🧬</div>
          <div style={{ flex: 1 }}>
            <Chip>NEW</Chip>
            <h2 style={{ fontSize: 28, fontWeight: 800, margin: "14px 0 8px", letterSpacing: "-0.02em" }}>Peptide of the Month</h2>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: C.accent, margin: "0 0 16px" }}>Cagrilintide Vial</h3>
            <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.75, maxWidth: 540, margin: "0 0 22px" }}>
              A long-acting amylin analogue research peptide supplied as lyophilised powder for laboratory investigation of receptor binding, metabolic pathway modelling, and molecular interaction studies in controlled experimental environments.
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 8 }}>
              {["≥99% Purity — HPLC & mass spectrometry verified", "Full Certificate of Analysis for every batch", "Cold-chain dispatch from London", "Same-day dispatch on orders before 1PM"].map(i => (
                <li key={i} style={{ fontSize: 13.5, color: C.muted, display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <span style={{ color: C.accent, fontWeight: 700, marginTop: 1 }}>✓</span>{i}
                </li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <div>
                <span style={{ fontSize: 24, fontWeight: 900 }}>£159.00</span>
                <span style={{ fontSize: 12, color: C.muted, marginLeft: 8 }}>10mg vial</span>
              </div>
              <button style={{ background: C.accent, color: "#0B1714", fontWeight: 700, fontSize: 14, padding: "13px 26px", borderRadius: 8, border: "none", cursor: "pointer" }}>View Product</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ──────────────────────────────────────────── */}
      <section style={{ background: C.bg2, borderTop: `1px solid ${C.divider}`, padding: "64px 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Label>VERIFIED CUSTOMER REVIEWS</Label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 36 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>What Our Researchers Say</h2>
            <div style={{ fontSize: 14, color: C.muted }}><Stars size={14} /> 4.9 · 83 verified reviews</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18 }}>
            {REVIEWS.map(r => (
              <div key={r.name} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: "26px 24px" }}>
                <Stars />
                <p style={{ fontSize: 14, color: C.text, lineHeight: 1.72, margin: "14px 0 18px" }}>"{r.quote}"</p>
                <div style={{ fontSize: 12.5, color: C.muted }}>— {r.name} · <span style={{ color: C.accent }}>{r.product}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY BROWSE ──────────────────────────────────── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 56px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {[
            { emoji: "⚗️", sub: "Single Peptides", title: "Peptides", detail: "18 compounds" },
            { emoji: "🔬", sub: "Synergistic Blends", title: "Research Stacks", detail: "4 formulas" },
            { emoji: "💧", sub: "Peptide Reconstitution", title: "BAC Water", detail: "Sterile solution" },
          ].map(c => (
            <div key={c.title} style={{ background: C.card, border: `1px solid ${C.accentBdr}`, borderRadius: 16, padding: "32px 28px", cursor: "pointer", transition: "border-color .2s, transform .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.accent; e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.accentBdr; e.currentTarget.style.transform = "none"; }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{c.emoji}</div>
              <div style={{ fontSize: 11, color: C.muted, letterSpacing: "0.08em", marginBottom: 6 }}>{c.sub}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.text, marginBottom: 6 }}>{c.title}</div>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 18 }}>{c.detail}</div>
              <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>Explore →</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESEARCH LIBRARY ─────────────────────────────────── */}
      <section style={{ background: C.bg2, borderTop: `1px solid ${C.divider}`, padding: "64px 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <Label>RESEARCH LIBRARY</Label>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Latest Research Insights</h2>
            <span style={{ color: C.accent, fontSize: 14, cursor: "pointer" }}>View all →</span>
          </div>

          <div style={{ border: `1px solid ${C.border}`, borderRadius: 14, overflow: "hidden" }}>
            {INSIGHTS.map((ins, i) => (
              <div key={ins.title}
                style={{ padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", background: C.card, borderBottom: i < INSIGHTS.length - 1 ? `1px solid ${C.divider}` : "none", cursor: "pointer", transition: "background .15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = C.cardHov)}
                onMouseLeave={e => (e.currentTarget.style.background = C.card)}>
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: C.accent, letterSpacing: "0.1em", marginBottom: 7 }}>{ins.cat.toUpperCase()}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{ins.title}</div>
                </div>
                <div style={{ fontSize: 12.5, color: C.muted, whiteSpace: "nowrap", marginLeft: 28 }}>{ins.time} →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL SIGNUP ─────────────────────────────────────── */}
      <section style={{ background: C.announce, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "72px 56px", textAlign: "center" }}>
        <Label>EXCLUSIVE ACCESS</Label>
        <h2 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.02em" }}>
          Research Insights. <em style={{ color: C.accent }}>Priority Launches.</em>
        </h2>
        <p style={{ color: C.muted, fontSize: 15, margin: "0 auto 32px", maxWidth: 480, lineHeight: 1.65 }}>
          Subscribe for early access to new compounds, lab reports, and an exclusive 15% off your first order.
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: 0, maxWidth: 440, margin: "0 auto 14px" }}>
          <input
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{ flex: 1, background: C.inputBg, border: `1px solid ${C.border}`, borderRight: "none", color: C.text, padding: "13px 18px", fontSize: 14, outline: "none", borderRadius: "0px", fontFamily: "Roboto,sans-serif" }}
          />
          <button style={{ background: C.accent, color: "#0B1714", fontWeight: 700, fontSize: 14, padding: "13px 24px", border: "none", cursor: "pointer", borderRadius: "0px", whiteSpace: "nowrap" }}>
            Subscribe
          </button>
        </div>
        <div style={{ fontSize: 12, color: C.dimmer }}>No spam. Unsubscribe at any time.</div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop: `1px solid ${C.divider}`, padding: "28px 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <HexMark />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.muted }}>omniQure™ · Peptide Research Institute</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 12.5, color: C.muted }}>
            {["Privacy Policy", "Terms & Conditions", "COA Reports", "Contact Us"].map(l => (
              <span key={l} style={{ cursor: "pointer", transition: "color .15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                onMouseLeave={e => (e.currentTarget.style.color = C.muted)}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize: 12, color: C.dimmer }}>© 2025 omniQure. Research purposes only.</div>
        </div>
      </footer>
    </div>
  );
}
