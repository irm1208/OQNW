const TEAL = "#00BBA7";
const DARK_BG = "#0D1A18";
const CARD_BG = "rgba(255,255,255,0.04)";
const BORDER = "rgba(0,187,167,0.15)";
const MUTED = "#7A9490";
const WHITE = "#F0F6F5";

const products = [
  { name: "GHK-CU Vial", purity: "≥99%", price: "£55", tag: "" },
  { name: "BPC-157 Vial", purity: "≥99%", price: "£37.50", tag: "Bestseller" },
  { name: "MOTS-C Vial", purity: "≥99%", price: "From £34.99", tag: "Popular" },
  { name: "Reta Vial", purity: "≥99%", price: "From £69.99", tag: "Bestseller" },
];

const researchAreas = [
  { n: "01", title: "Tissue Repair", desc: "Studied for roles in tissue repair mechanisms and cellular recovery pathways in controlled laboratory models." },
  { n: "02", title: "Neurological Pathways", desc: "Investigated for interactions with neurological signalling pathways in controlled in-vitro settings." },
  { n: "03", title: "Collagen & Skin Biology", desc: "Studied for roles in collagen synthesis pathways and oxidative stress response mechanisms." },
  { n: "04", title: "Mitochondrial Biology", desc: "Investigated for effects on mitochondrial function and cellular energy regulation pathways." },
  { n: "05", title: "Musculoskeletal Research", desc: "Investigated for roles in muscle repair mechanisms, endurance pathways, and body composition research." },
  { n: "06", title: "Neuroendocrine Signalling", desc: "Studied for roles in sleep-related neuropeptide signalling and neuroendocrine pathway research." },
  { n: "07", title: "Vascular Biology", desc: "Investigated for roles in angiogenesis, blood flow regulation, and cardiovascular mechanism research." },
  { n: "08", title: "Immune Modulation", desc: "Compounds researched for immune modulation mechanisms and inflammatory pathway interactions." },
];

const reviews = [
  { quote: "The quality of the peptides appears excellent, and everything arrived exactly as described. Customer service was also responsive and helpful.", name: "Catherine A.", product: "Reta" },
  { quote: "Very happy with the product. Had some questions which were answered promptly — customer service was perfect. Would use the service again for sure.", name: "Kyerematen", product: "Reta" },
  { quote: "Very professional & responds in a very timely manner. Has some of the best quality products & prices.", name: "Paul J.", product: "MOTS-C" },
  { quote: "Super impressed — this company is independently lab tested in Europe & UK! Excellent customer service.", name: "Yvonne G.", product: "Reta" },
  { quote: "Fast delivery and great product at a competitive price too. Highly recommend!", name: "Kamila S.", product: "Reta" },
  { quote: "5 star service — won't order from anyone else.", name: "Ryan M.", product: "BAC Water" },
];

const insights = [
  { cat: "Research Guides", title: "BPC-157 vs TB-500: research summary and key differences", time: "9 min read" },
  { cat: "Research Guides", title: "How to read a peptide Certificate of Analysis (COA)", time: "9 min read" },
  { cat: "Research Guides", title: "How to read research literature on peptides", time: "10 min read" },
  { cat: "Research Methodology", title: "Independently verified UK research peptides: what 'lab tested' actually means", time: "13 min read" },
];

export default function HeroPage() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: DARK_BG, color: WHITE, minHeight: "100vh", lineHeight: 1.6 }}>

      {/* Announcement bar */}
      <div style={{ background: "#0A2E29", textAlign: "center", padding: "9px 16px", fontSize: "13px", color: TEAL, letterSpacing: "0.02em" }}>
        15% OFF your first order on single peptides — Use code <strong>FIRST15</strong> at checkout &nbsp;
        <span style={{ textDecoration: "underline", cursor: "pointer" }}>Shop Now →</span>
      </div>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 56px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "#0A2E29", border: `1.5px solid ${TEAL}`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: TEAL, letterSpacing: "-0.5px" }}>OQ</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: "0.05em", color: WHITE }}>omniQure</div>
            <div style={{ fontSize: 8, letterSpacing: "0.2em", color: MUTED }}>PEPTIDE RESEARCH INSTITUTE</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 28, fontSize: 13.5, color: MUTED }}>
          {["Peptides", "Stacks", "Lab Tests", "Research", "Insights", "About"].map(n => (
            <span key={n} style={{ cursor: "pointer" }}>{n}</span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: 13, color: MUTED, cursor: "pointer" }}>Account</span>
          <div style={{ background: TEAL, color: "#0D1A18", fontWeight: 700, fontSize: 12.5, padding: "9px 20px", borderRadius: 7, cursor: "pointer", letterSpacing: "0.03em" }}>Cart (0)</div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: "80px 56px 60px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.08em", marginBottom: 18 }}>Est. 2025 · London, UK</div>
        <h1 style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.06, margin: "0 0 20px", maxWidth: 680 }}>
          Research Peptides.<br />
          <span style={{ color: TEAL }}>Uncompromising</span> Purity.
        </h1>
        <p style={{ color: MUTED, fontSize: 15, marginBottom: 12 }}>Third-Party Verified. Minimum 99% Purity.</p>
        <p style={{ color: "#4A6660", fontSize: 12, marginBottom: 28, fontStyle: "italic" }}>DISCLAIMER: For research purposes only, not for human consumption</p>
        <p style={{ color: MUTED, fontSize: 13.5, marginBottom: 32, maxWidth: 520 }}>
          Independently verified by <span style={{ color: TEAL }}>PeptideVerify (UK)</span> & <span style={{ color: TEAL }}>Janoshik Analytical</span>. Live batch verification on every flagship peptide.
        </p>
        <div style={{ display: "flex", gap: 14, marginBottom: 40 }}>
          <button style={{ background: TEAL, color: "#0D1A18", fontWeight: 700, fontSize: 14, padding: "14px 28px", borderRadius: 8, border: "none", cursor: "pointer" }}>Shop All Products</button>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: MUTED }}>
            <span style={{ color: TEAL }}>★★★★★</span> 4.9 · 83 verified reviews
          </div>
        </div>
        <div style={{ display: "flex", gap: 32, borderTop: `1px solid ${BORDER}`, paddingTop: 24 }}>
          {[["HPLC & Mass Spec Verified", ""], ["99%+ Purity Guaranteed", ""], ["Next-Day Delivery", ""], ["COA Every Batch", ""]].map(([t]) => (
            <div key={t} style={{ fontSize: 11.5, color: MUTED, fontWeight: 600, letterSpacing: "0.04em" }}>✓ {t}</div>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section style={{ padding: "60px 56px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 11, color: TEAL, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 8 }}>MOST POPULAR</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Bestselling Peptides</h2>
          </div>
          <span style={{ color: TEAL, fontSize: 13.5, cursor: "pointer" }}>View All →</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
          {products.map(p => (
            <div key={p.name} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ background: "#0A2218", height: 180, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                {p.tag && <div style={{ position: "absolute", top: 12, left: 12, background: TEAL, color: "#0D1A18", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em" }}>{p.tag}</div>}
                <div style={{ width: 70, height: 70, background: "#1A3530", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🧪</div>
              </div>
              <div style={{ padding: "18px 18px 20px" }}>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span style={{ fontSize: 11, color: TEAL, fontWeight: 600 }}>{p.purity} Purity</span>
                  <span style={{ fontSize: 11, color: MUTED }}>HPLC Verified</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 17, fontWeight: 700 }}>{p.price}</span>
                  <button style={{ background: TEAL, color: "#0D1A18", fontWeight: 700, fontSize: 11.5, padding: "8px 16px", borderRadius: 6, border: "none", cursor: "pointer" }}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Research Areas */}
      <section style={{ padding: "60px 56px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: TEAL, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 8 }}>RESEARCH AREAS</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, margin: "0 0 12px" }}>What peptides <em style={{ color: TEAL }}>are studied for.</em></h2>
          <p style={{ color: MUTED, fontSize: 14, maxWidth: 560 }}>From cellular repair to neuroendocrine signalling — peptide research spans a broad spectrum of biological pathways under active investigation.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {researchAreas.map(a => (
            <div key={a.n} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "22px 20px" }}>
              <div style={{ fontSize: 11, color: TEAL, fontWeight: 700, letterSpacing: "0.12em", marginBottom: 10 }}>{a.n}</div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{a.title}</div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.6 }}>{a.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: "#091410", borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}`, padding: "28px 56px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", justifyContent: "space-around" }}>
          {[["4.9★", "Average Rating"], ["6000+", "Orders Dispatched"], ["99%+", "Purity Every Batch"], ["24h", "Dispatch Turnaround"], ["100%", "Batch Traced"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: TEAL }}>{v}</div>
              <div style={{ fontSize: 11, color: MUTED, letterSpacing: "0.06em", marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Peptide of the month */}
      <section style={{ padding: "60px 56px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ fontSize: 11, color: TEAL, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 8 }}>FEATURED PRODUCT</div>
        <div style={{ display: "flex", gap: 48, alignItems: "center", background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 18, padding: "40px 48px" }}>
          <div style={{ width: 200, height: 220, background: "#091410", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, flexShrink: 0 }}>🧬</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "inline-block", background: TEAL, color: "#0D1A18", fontSize: 10, fontWeight: 800, padding: "3px 12px", borderRadius: 20, marginBottom: 16, letterSpacing: "0.08em" }}>NEW</div>
            <h2 style={{ fontSize: 30, fontWeight: 800, margin: "0 0 14px" }}>Peptide of the Month</h2>
            <h3 style={{ fontSize: 22, fontWeight: 700, color: TEAL, margin: "0 0 14px" }}>Cagrilintide Vial</h3>
            <p style={{ color: MUTED, fontSize: 14, marginBottom: 20, maxWidth: 560 }}>
              A long-acting amylin analogue research peptide supplied as lyophilised powder for laboratory investigation of receptor binding, metabolic pathway modelling, and molecular interaction studies in controlled experimental environments.
            </p>
            <ul style={{ color: MUTED, fontSize: 13, padding: 0, margin: "0 0 24px", listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
              {["≥99% Purity — HPLC & mass spectrometry verified", "Full Certificate of Analysis for every batch", "Cold-chain dispatch from London", "Same-day dispatch on orders before 1PM"].map(i => (
                <li key={i}><span style={{ color: TEAL, marginRight: 8 }}>✓</span>{i}</li>
              ))}
            </ul>
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <span style={{ fontSize: 22, fontWeight: 800 }}>£159.00</span>
              <span style={{ fontSize: 12, color: MUTED }}>10mg vial</span>
              <button style={{ background: TEAL, color: "#0D1A18", fontWeight: 700, fontSize: 13.5, padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer", marginLeft: 12 }}>View Product</button>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section style={{ padding: "60px 56px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: TEAL, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 8 }}>VERIFIED CUSTOMER REVIEWS</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>What Our Researchers Say</h2>
          <div style={{ color: MUTED, fontSize: 14, marginTop: 8 }}><span style={{ color: TEAL }}>★★★★★</span> 4.9 · 83 verified reviews</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          {reviews.map(r => (
            <div key={r.name} style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "24px 22px" }}>
              <div style={{ color: TEAL, marginBottom: 12, fontSize: 14 }}>★★★★★</div>
              <p style={{ fontSize: 13.5, color: WHITE, lineHeight: 1.7, margin: "0 0 16px" }}>"{r.quote}"</p>
              <div style={{ fontSize: 12, color: MUTED }}>— {r.name} · <span style={{ color: TEAL }}>{r.product}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* Research Library */}
      <section style={{ padding: "60px 56px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 28 }}>
          <div>
            <div style={{ fontSize: 11, color: TEAL, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 8 }}>RESEARCH LIBRARY</div>
            <h2 style={{ fontSize: 36, fontWeight: 800, margin: 0 }}>Latest Research Insights</h2>
          </div>
          <span style={{ color: TEAL, fontSize: 13.5, cursor: "pointer" }}>View all →</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, border: `1px solid ${BORDER}`, borderRadius: 14, overflow: "hidden" }}>
          {insights.map((i, idx) => (
            <div key={i.title} style={{ padding: "22px 28px", borderBottom: idx < insights.length - 1 ? `1px solid ${BORDER}` : "none", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", background: CARD_BG }}>
              <div>
                <div style={{ fontSize: 10.5, color: TEAL, fontWeight: 600, letterSpacing: "0.08em", marginBottom: 6 }}>{i.cat.toUpperCase()}</div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{i.title}</div>
              </div>
              <div style={{ fontSize: 12, color: MUTED, whiteSpace: "nowrap", marginLeft: 24 }}>{i.time} →</div>
            </div>
          ))}
        </div>
      </section>

      {/* Email signup */}
      <section style={{ background: "#091410", borderTop: `1px solid ${BORDER}`, padding: "56px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: TEAL, letterSpacing: "0.12em", fontWeight: 600, marginBottom: 12 }}>EXCLUSIVE ACCESS</div>
        <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 10px" }}>Research Insights. <em style={{ color: TEAL }}>Priority Launches.</em></h2>
        <p style={{ color: MUTED, fontSize: 14, marginBottom: 28 }}>Subscribe for early access to new compounds, lab reports, and an exclusive 15% off your first order.</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
          <input placeholder="your@email.com" style={{ background: "#0F2320", border: `1px solid ${BORDER}`, color: WHITE, padding: "12px 20px", borderRadius: 8, fontSize: 14, width: 260, outline: "none" }} />
          <button style={{ background: TEAL, color: "#0D1A18", fontWeight: 700, fontSize: 13.5, padding: "12px 24px", borderRadius: 8, border: "none", cursor: "pointer" }}>Subscribe</button>
        </div>
        <div style={{ fontSize: 11.5, color: "#4A6660", marginTop: 12 }}>No spam. Unsubscribe at any time.</div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "28px 56px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 12, color: MUTED }}>© 2025 omniQure Peptide Research Institute</div>
        <div style={{ display: "flex", gap: 20, fontSize: 12, color: MUTED }}>
          {["Privacy Policy", "Terms", "COA Reports", "Contact"].map(l => <span key={l} style={{ cursor: "pointer" }}>{l}</span>)}
        </div>
      </footer>
    </div>
  );
}
