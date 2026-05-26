import { useState } from "react";

/* ─── EXACT COLORS (from branding JSON + screenshot visual analysis) ─── */
const C = {
  /* page backgrounds */
  pageBg:     "#0B1512",   // very dark teal-black (screenshot bg behind age gate)
  sectionAlt: "#0E1C18",   // slightly lighter sections
  cardBg:     "#122420",   // cards
  announceBg: "#081110",   // announcement bar (darkest)
  modalBg:    "#FFFFFF",   // age-gate card is WHITE (from screenshot)
  /* brand colors — exact from branding JSON */
  primary:    "#2A5F5F",
  secondary:  "#2A3F3F",
  accent:     "#00BBA7",   // exact from JSON
  /* text */
  textPrimary:"#FFFFFF",
  textMuted:  "#7FA39E",
  textDimmer: "#3D6660",
  textDark:   "#214647",   // for use on white modal
  /* borders */
  border:     "rgba(0,187,167,0.14)",
  divider:    "rgba(255,255,255,0.06)",
  cardBorder: "rgba(0,187,167,0.13)",
  /* inputs */
  inputBg:    "#1E3030",
  inputBorder:"#3A5F5F",
};

/* ─── REAL PRODUCT IMAGES from biohacklondon.com ─── */
const BASE = "https://biohacklondon.com/_next/image?url=";
const PRODUCTS = [
  {
    name: "GHK-CU Vial", price: "£55", badge: "",
    img: `${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-ghk-cu-copper-peptide-100mg-research-vial.webp&w=640&q=75`,
  },
  {
    name: "BPC-157 Vial", price: "£37.50", badge: "Bestseller",
    img: `${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-bpc-157-10mg-research-peptide-vial.webp&w=640&q=75`,
  },
  {
    name: "MOTS-C Vial", price: "From £34.99", badge: "Popular",
    img: `${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-mots-c-10mg-research-peptide-vial.webp&w=640&q=75`,
  },
  {
    name: "Reta Vial", price: "From £69.99", badge: "Bestseller",
    img: `${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=640&q=75`,
  },
];

const UNS = "https://images.unsplash.com/";
const RESEARCH = [
  { n:"01", title:"Tissue Repair",            img:`${UNS}photo-1571019613454-1cb2f99b2d8b?w=400&q=60`,  desc:"Studied for roles in tissue repair mechanisms and cellular recovery pathways in controlled laboratory models." },
  { n:"02", title:"Neurological Pathways",    img:`${UNS}photo-1559757148-5c350d0d3c56?w=400&q=60`,     desc:"Investigated for interactions with neurological signalling pathways in controlled in-vitro settings." },
  { n:"03", title:"Collagen & Skin Biology",  img:`${UNS}photo-1596178060671-7a80dc8059ea?w=400&q=60`,  desc:"Studied for roles in collagen synthesis pathways and oxidative stress response mechanisms." },
  { n:"04", title:"Mitochondrial Biology",    img:`${UNS}photo-1549576490-b0b4831ef60a?w=400&q=60`,     desc:"Investigated for effects on mitochondrial function and cellular energy regulation pathways." },
  { n:"05", title:"Musculoskeletal Research", img:`${UNS}photo-1534438327276-14e5300c3a48?w=400&q=60`,  desc:"Investigated for roles in muscle repair mechanisms, endurance pathways, and body composition research." },
  { n:"06", title:"Neuroendocrine Signalling",img:`${UNS}photo-1511295742362-92c96b1cf484?w=400&q=60`,  desc:"Studied for roles in sleep-related neuropeptide signalling and neuroendocrine pathway research." },
  { n:"07", title:"Vascular Biology",         img:`${UNS}photo-1576086213369-97a306d36557?w=400&q=60`,  desc:"Investigated for roles in angiogenesis, blood flow regulation, and cardiovascular mechanism research." },
  { n:"08", title:"Immune Modulation",        img:`${UNS}photo-1579154204601-01588f351e67?w=400&q=60`,  desc:"Compounds researched for immune modulation mechanisms and inflammatory pathway interactions in laboratory settings." },
];

const STATS = [
  { val:"4.9★",  label:"Average Rating" },
  { val:"6000+", label:"Orders Dispatched" },
  { val:"99%+",  label:"Purity Every Batch" },
  { val:"24h",   label:"Dispatch Turnaround" },
  { val:"100%",  label:"Batch Traced" },
];

const REVIEWS = [
  { q:"The quality of the peptides appears excellent, and everything arrived exactly as described. Customer service was also responsive and helpful when I had a question.", name:"Catherine A.", product:"Reta", img:`${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75` },
  { q:"Very happy with the product. Had some questions which were answered promptly — customer service was perfect. Would use the service again for sure.", name:"Kyerematen", product:"Reta", img:`${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75` },
  { q:"Very professional & responds in a very timely manner. Has some of the best quality products & prices.", name:"Paul J.", product:"MOTS-C", img:`${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-mots-c-10mg-research-peptide-vial.webp&w=96&q=75` },
  { q:"Super impressed — this company is independently lab tested in Europe & UK! Excellent customer service.", name:"Yvonne G.", product:"Reta", img:`${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75` },
  { q:"Some initial confusion with my order that was dealt with in a professional and timely manner. Very good quality product. Highly recommended.", name:"Kristian C.", product:"MOTS-C", img:`${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-mots-c-10mg-research-peptide-vial.webp&w=96&q=75` },
  { q:"Reliable — had a hiccup once in transit but was sorted within less than 24 hours. Quality stuff that I highly recommend.", name:"Wiktor D.", product:"GHK-CU", img:`${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-ghk-cu-copper-peptide-100mg-research-vial.webp&w=96&q=75` },
  { q:"Arrived fast. Amazing product. Great packaging. Definitely going to be my regular store.", name:"Luke B.", product:"Reta", img:`${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75` },
  { q:"5 star service — won't order from anyone else.", name:"Ryan M.", product:"BAC Water", img:`${BASE}%2Fimages%2Fproducts%2Faccessories%2Fbiohack-london-bacteriostatic-water-3ml-vial.webp&w=96&q=75` },
  { q:"Fast delivery and great product at a competitive price too. Highly recommend!", name:"Kamila S.", product:"Reta", img:`${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75` },
];

const INSIGHTS = [
  { cat:"Research Guides",      title:"BPC-157 vs TB-500: research summary and key differences",                                                           time:"9 min read",  desc:"A research-orientation comparison of BPC-157 and TB-500 — what's actually in the peer-reviewed literature, how the two compounds differ structurally and mechanistically." },
  { cat:"Research Guides",      title:"How to read a peptide Certificate of Analysis (COA)",                                                               time:"9 min read",  desc:"A practical UK guide to reading a research-peptide Certificate of Analysis. What HPLC, mass spectrometry, and purity readings actually tell you." },
  { cat:"Research Guides",      title:"How to read research literature on peptides",                                                                       time:"10 min read", desc:"A practical guide to reading peer-reviewed peptide research for the UK research community. PubMed search strategy, distinguishing in vitro from in vivo." },
  { cat:"Research Methodology", title:"Independently verified UK research peptides: what 'lab tested' actually means",                                     time:"13 min read", desc:"A methodology reference for the UK research community. What independent third-party verification actually requires, why a named laboratory matters." },
];

/* ─── BHL LOGO SVG (exact hexagon + BHL mark + BIOHACK LONDON text) ─── */
const BHLLogo = ({ size = 40 }: { size?: number }) => (
  <svg width={size * 2.8} height={size} viewBox="0 0 112 40" fill="none">
    {/* hexagon */}
    <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="none" stroke="white" strokeWidth="2"/>
    <text x="18" y="22" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="Roboto,Arial,sans-serif" letterSpacing="0.5">BHL</text>
    {/* BIO HACK LONDON text */}
    <text x="40" y="13" fill="white" fontSize="9.5" fontWeight="800" fontFamily="Roboto,Arial,sans-serif" letterSpacing="0.08em">BIO</text>
    <text x="40" y="23" fill="white" fontSize="9.5" fontWeight="800" fontFamily="Roboto,Arial,sans-serif" letterSpacing="0.08em">HACK</text>
    <text x="40" y="33" fill="white" fontSize="9.5" fontWeight="800" fontFamily="Roboto,Arial,sans-serif" letterSpacing="0.08em">LONDON<tspan fontSize="6" baselineShift="super">™</tspan></text>
  </svg>
);

/* ─── BHL LOGO dark version (for white modal) ─── */
const BHLLogoDark = () => (
  <svg width="90" height="36" viewBox="0 0 112 40" fill="none">
    <path d="M18 2L32 10V26L18 34L4 26V10L18 2Z" fill="none" stroke={C.primary} strokeWidth="2"/>
    <text x="18" y="22" textAnchor="middle" fill={C.primary} fontSize="8" fontWeight="700" fontFamily="Roboto,Arial,sans-serif" letterSpacing="0.5">BHL</text>
    <text x="40" y="13" fill={C.primary} fontSize="9.5" fontWeight="800" fontFamily="Roboto,Arial,sans-serif" letterSpacing="0.08em">BIO</text>
    <text x="40" y="23" fill={C.primary} fontSize="9.5" fontWeight="800" fontFamily="Roboto,Arial,sans-serif" letterSpacing="0.08em">HACK</text>
    <text x="40" y="33" fill={C.primary} fontSize="9.5" fontWeight="800" fontFamily="Roboto,Arial,sans-serif" letterSpacing="0.08em">LONDON<tspan fontSize="6" baselineShift="super">™</tspan></text>
  </svg>
);

const Stars = ({ n=5, size=13 }: { n?:number; size?:number }) => (
  <span style={{ color: C.accent, fontSize: size }}>{"★".repeat(n)}</span>
);

const Chip = ({ children, dark=false }: { children: string; dark?: boolean }) => (
  <span style={{ display:"inline-block", background: dark ? "rgba(0,187,167,0.10)" : "rgba(0,187,167,0.12)", border:`1px solid rgba(0,187,167,0.22)`, color: C.accent, fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, letterSpacing:"0.08em" }}>
    {children}
  </span>
);

/* ─── MAIN ─── */
export default function FullPage() {
  const [ageGate, setAgeGate] = useState(true);
  const [email, setEmail] = useState("");

  return (
    <div style={{ fontFamily:"'Roboto',Arial,sans-serif", background: C.pageBg, color: C.textPrimary, minHeight:"100vh", overflowX:"hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400;1,700&display=swap" rel="stylesheet" />

      {/* ── AGE GATE (white modal, exact from screenshot) ─────────── */}
      {ageGate && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(5px)", background:"rgba(6,10,9,0.78)" }}>
          <div style={{ background:"#FFFFFF", borderRadius:12, padding:"44px 40px", maxWidth:430, width:"92%", textAlign:"center", boxShadow:"0 32px 80px rgba(0,0,0,0.55)" }}>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:22 }}>
              <BHLLogoDark />
            </div>
            <h2 style={{ fontSize:22, fontWeight:700, color:"#111111", margin:"0 0 12px", letterSpacing:"-0.01em" }}>Age Verification Required</h2>
            <p style={{ fontSize:14, color:"#555555", lineHeight:1.65, margin:"0 0 28px" }}>
              You must be 18 years or older to access this website. Our products are intended for research purposes only.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:20 }}>
              <button
                onClick={() => setAgeGate(false)}
                style={{ background: C.accent, color:"#FFFFFF", fontWeight:700, fontSize:14.5, padding:"12px 26px", borderRadius:8, border:"none", cursor:"pointer", boxShadow:`rgb(15,15,15) 0px 0px 0px 2px, ${C.accent} 0px 0px 0px 4px` }}>
                I am 18 or older
              </button>
              <button style={{ background:"transparent", color:"#444444", fontWeight:500, fontSize:14, padding:"12px 26px", borderRadius:8, border:"1.5px solid #CCCCCC", cursor:"pointer" }}>
                I am under 18
              </button>
            </div>
            <p style={{ fontSize:11.5, color:"#999999", lineHeight:1.6, margin:0 }}>
              By entering this site you agree that you are of legal age in your jurisdiction and that all products are purchased for research purposes only.
            </p>
          </div>
        </div>
      )}

      {/* ── ANNOUNCEMENT BAR ───────────────────────────────────────── */}
      <div style={{ background: C.announceBg, borderBottom:`1px solid ${C.border}`, textAlign:"center", padding:"9px 24px", fontSize:13.5, color: C.accent, fontWeight:400 }}>
        15% OFF your first order on single peptides — Use code{" "}
        <strong style={{ color: C.textPrimary }}>FIRST15</strong> at checkout{" "}
        <span style={{ textDecoration:"underline", cursor:"pointer", marginLeft:8, color: C.accent }}>Shop Now</span>
      </div>

      {/* ── NAV ────────────────────────────────────────────────────── */}
      <nav style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 56px", borderBottom:`1px solid ${C.border}`, background: C.pageBg, position:"sticky", top:0, zIndex:100 }}>
        <BHLLogo size={34} />

        <div style={{ display:"flex", gap:28, fontSize:14, color: C.textMuted, fontWeight:400 }}>
          {["Peptides","Stacks","Lab Tests","Research","Insights","About"].map(n => (
            <span key={n} style={{ cursor:"pointer", transition:"color .15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = C.textPrimary)}
              onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>{n}</span>
          ))}
        </div>

        <div style={{ display:"flex", gap:14, alignItems:"center" }}>
          <span style={{ fontSize:14, color: C.textMuted, cursor:"pointer" }}>🔍</span>
          <span style={{ fontSize:14, color: C.textMuted, cursor:"pointer" }}>Account</span>
          <button style={{ background: C.accent, color:"#FFFFFF", fontWeight:700, fontSize:13, padding:"9px 20px", borderRadius:8, border:"none", cursor:"pointer", boxShadow:`rgb(15,15,15) 0px 0px 0px 2px, ${C.accent} 0px 0px 0px 4px` }}>Cart</button>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section style={{ maxWidth:1280, margin:"0 auto", padding:"80px 56px 64px" }}>
        <div style={{ fontSize:12, fontWeight:500, color: C.textMuted, letterSpacing:"0.07em", marginBottom:20 }}>Est. 2025 · London, UK</div>

        <h1 style={{ fontSize:72, fontWeight:900, lineHeight:1.02, margin:"0 0 20px", maxWidth:680, letterSpacing:"-0.025em", color: C.textPrimary }}>
          Research Peptides.{" "}<br />
          <em style={{ fontStyle:"italic", color: C.textPrimary }}>Uncompromising</em><br />
          Purity.
        </h1>

        <p style={{ fontSize:16, fontWeight:500, color: C.textMuted, margin:"0 0 6px" }}>Third-Party Verified. Minimum 99% Purity.</p>
        <p style={{ fontSize:12, color: C.textDimmer, fontStyle:"italic", fontWeight:700, margin:"0 0 18px", letterSpacing:"0.02em" }}>
          DISCLAIMER: For research purposes only, not for human consumption
        </p>

        <p style={{ fontSize:14, color: C.textMuted, lineHeight:1.72, maxWidth:540, margin:"0 0 32px" }}>
          <span style={{ color: C.accent, borderBottom:`1px solid rgba(0,187,167,0.25)`, cursor:"pointer" }}>Independently verified</span>{" "}
          by{" "}
          <span style={{ color: C.accent, borderBottom:`1px solid rgba(0,187,167,0.25)`, cursor:"pointer" }}>PeptideVerify (UK)</span>{" "}
          &{" "}
          <span style={{ color: C.accent, borderBottom:`1px solid rgba(0,187,167,0.25)`, cursor:"pointer" }}>Janoshik Analytical</span>.
          {" "}Live batch verification on every flagship peptide.
        </p>

        <div style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap", marginBottom:40 }}>
          <button style={{ background: C.accent, color:"#FFFFFF", fontWeight:700, fontSize:15.5, padding:"14px 30px", borderRadius:8, border:"none", cursor:"pointer", boxShadow:`rgb(15,15,15) 0px 0px 0px 2px, ${C.accent} 0px 0px 0px 4px` }}>
            Shop All Products
          </button>
          <div style={{ display:"flex", alignItems:"center", gap:8, fontSize:14, color: C.textMuted }}>
            <Stars /><span>4.9 · 83 verified reviews</span>
          </div>
        </div>

        <div style={{ display:"flex", flexWrap:"wrap", gap:26, paddingTop:26, borderTop:`1px solid ${C.divider}` }}>
          {["HPLC & Mass Spec Verified","99%+ Purity Guaranteed","Next-Day Delivery","With COA Every Batch"].map(t => (
            <div key={t} style={{ fontSize:12.5, fontWeight:600, color: C.textMuted, display:"flex", alignItems:"center", gap:7 }}>
              <span style={{ color: C.accent, fontSize:10, fontWeight:900 }}>✓</span>{t}
            </div>
          ))}
        </div>
      </section>

      {/* ── BESTSELLERS ─────────────────────────────────────────────── */}
      <section style={{ maxWidth:1280, margin:"0 auto", padding:"56px 56px 64px" }}>
        <div style={{ fontSize:11.5, fontWeight:700, color: C.accent, letterSpacing:"0.14em", marginBottom:10 }}>MOST POPULAR</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32 }}>
          <h2 style={{ fontSize:36, fontWeight:800, margin:0, letterSpacing:"-0.022em" }}>Bestselling Peptides</h2>
          <span style={{ color: C.accent, fontSize:14, cursor:"pointer" }}>View All</span>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:18 }}>
          {PRODUCTS.map(p => (
            <div key={p.name}
              style={{ background: C.cardBg, border:`1px solid ${C.cardBorder}`, borderRadius:12, overflow:"hidden", cursor:"pointer", transition:"border-color .2s,transform .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,187,167,0.35)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.cardBorder; e.currentTarget.style.transform="none"; }}>
              <div style={{ background: C.sectionAlt, position:"relative", height:200, overflow:"hidden" }}>
                {p.badge && (
                  <div style={{ position:"absolute", top:12, left:12, background: C.accent, color:"#FFFFFF", fontSize:10, fontWeight:800, padding:"4px 12px", borderRadius:20, letterSpacing:"0.07em", zIndex:2 }}>{p.badge}</div>
                )}
                <img src={p.img} alt={p.name} style={{ width:"100%", height:"100%", objectFit:"cover" }} crossOrigin="anonymous"
                  onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
              </div>
              <div style={{ padding:"18px 18px 20px" }}>
                <div style={{ fontSize:15.5, fontWeight:700, marginBottom:8 }}>{p.name}</div>
                <div style={{ display:"flex", gap:7, alignItems:"center", marginBottom:14 }}>
                  <Chip>≥99% Purity</Chip>
                  <span style={{ fontSize:10.5, color: C.textMuted }}>HPLC Verified</span>
                </div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:17, fontWeight:700 }}>{p.price}</span>
                  <button style={{ background: C.accent, color:"#FFFFFF", fontWeight:700, fontSize:11, padding:"7px 14px", borderRadius:6, border:"none", cursor:"pointer" }}>Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", marginTop:32 }}>
          <button style={{ background:"transparent", color: C.accent, fontWeight:700, fontSize:14, padding:"12px 36px", borderRadius:8, border:`1.5px solid rgba(0,187,167,0.22)`, cursor:"pointer" }}>
            View All Products
          </button>
        </div>
      </section>

      {/* ── RESEARCH AREAS ──────────────────────────────────────────── */}
      <section style={{ background: C.sectionAlt, borderTop:`1px solid ${C.divider}`, borderBottom:`1px solid ${C.divider}`, padding:"64px 56px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ fontSize:11.5, fontWeight:700, color: C.accent, letterSpacing:"0.14em", marginBottom:10 }}>RESEARCH AREAS</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:14 }}>
            <h2 style={{ fontSize:36, fontWeight:800, margin:0, letterSpacing:"-0.022em" }}>
              What peptides <em style={{ color: C.accent }}>are studied for.</em>
            </h2>
            <button style={{ background: C.accent, color:"#FFFFFF", fontWeight:700, fontSize:13, padding:"11px 22px", borderRadius:8, border:"none", cursor:"pointer", whiteSpace:"nowrap", boxShadow:`rgb(15,15,15) 0px 0px 0px 2px, ${C.accent} 0px 0px 0px 4px` }}>Shop All Peptides</button>
          </div>
          <p style={{ color: C.textMuted, fontSize:14.5, maxWidth:580, lineHeight:1.72, marginBottom:36 }}>
            From cellular repair to neuroendocrine signalling — peptide research spans a broad spectrum of biological pathways under active investigation.
          </p>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {RESEARCH.map(r => (
              <div key={r.n} style={{ background: C.cardBg, border:`1px solid ${C.cardBorder}`, borderRadius:10, overflow:"hidden", cursor:"pointer", transition:"border-color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderColor="rgba(0,187,167,0.28)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor=C.cardBorder)}>
                <div style={{ position:"relative", height:130, overflow:"hidden" }}>
                  <img src={r.img} alt={r.title} style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.55) saturate(0.7)" }} crossOrigin="anonymous"
                    onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
                  <div style={{ position:"absolute", bottom:10, left:14, fontSize:11, fontWeight:800, color: C.accent, letterSpacing:"0.15em" }}>{r.n}</div>
                </div>
                <div style={{ padding:"16px 16px 18px" }}>
                  <div style={{ fontSize:14.5, fontWeight:700, marginBottom:8, lineHeight:1.3 }}>{r.title}</div>
                  <div style={{ fontSize:12.5, color: C.textMuted, lineHeight:1.65 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────────── */}
      <section style={{ background: C.announceBg, borderBottom:`1px solid ${C.border}`, padding:"28px 56px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:900, color: C.accent, letterSpacing:"-0.02em" }}>{s.val}</div>
              <div style={{ fontSize:11, fontWeight:500, color: C.textMuted, letterSpacing:"0.07em", marginTop:5 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PEPTIDE OF THE MONTH ────────────────────────────────────── */}
      <section style={{ maxWidth:1280, margin:"0 auto", padding:"64px 56px" }}>
        <div style={{ fontSize:11.5, fontWeight:700, color: C.accent, letterSpacing:"0.14em", marginBottom:10 }}>FEATURED PRODUCT</div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
          <h2 style={{ fontSize:36, fontWeight:800, margin:0, letterSpacing:"-0.022em" }}>Peptide of the Month</h2>
          <span style={{ color: C.accent, fontSize:14, cursor:"pointer" }}>View All Products</span>
        </div>

        <div style={{ display:"flex", gap:48, alignItems:"center", background: C.cardBg, border:`1px solid rgba(0,187,167,0.18)`, borderRadius:16, padding:"40px 44px", boxShadow:"0 0 80px rgba(0,187,167,0.03)" }}>
          <div style={{ width:200, height:220, flexShrink:0, borderRadius:12, overflow:"hidden", background: C.sectionAlt, border:`1px solid ${C.cardBorder}` }}>
            <img
              src={`${BASE.replace('/_next/image?url=','')}/images/products/peptides/biohack-london-cagrilintide-10mg-research-peptide-vial.webp`}
              alt="Cagrilintide"
              style={{ width:"100%", height:"100%", objectFit:"cover" }}
              onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
          </div>
          <div style={{ flex:1 }}>
            <Chip>New</Chip>
            <h3 style={{ fontSize:24, fontWeight:800, margin:"14px 0 6px", letterSpacing:"-0.02em" }}>Cagrilintide Vial</h3>
            <p style={{ fontSize:14, color: C.textMuted, lineHeight:1.75, maxWidth:540, margin:"0 0 20px" }}>
              Cagrilintide is a long-acting amylin analogue research peptide supplied as lyophilised powder for laboratory investigation of receptor binding, metabolic pathway modelling, and molecular interaction studies in controlled experimental environments.
            </p>
            <ul style={{ listStyle:"none", padding:0, margin:"0 0 26px", display:"flex", flexDirection:"column", gap:7 }}>
              {[
                "≥99% Purity — HPLC & mass spectrometry verified",
                "Full Certificate of Analysis for every batch",
                "Cold-chain dispatch from London",
                "Same-day dispatch on orders before 1PM",
              ].map(i => (
                <li key={i} style={{ fontSize:13.5, color: C.textMuted, display:"flex", alignItems:"flex-start", gap:9 }}>
                  <span style={{ color: C.accent, fontWeight:900, fontSize:11, marginTop:2 }}>✓</span>{i}
                </li>
              ))}
            </ul>
            <div style={{ display:"flex", gap:20, alignItems:"center" }}>
              <div>
                <span style={{ fontSize:24, fontWeight:900 }}>£159.00</span>
                <span style={{ fontSize:12, color: C.textMuted, marginLeft:8 }}>10mg vial</span>
              </div>
              <button style={{ background: C.accent, color:"#FFFFFF", fontWeight:700, fontSize:14, padding:"13px 26px", borderRadius:8, border:"none", cursor:"pointer", boxShadow:`rgb(15,15,15) 0px 0px 0px 2px, ${C.accent} 0px 0px 0px 4px` }}>View Product</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ─────────────────────────────────────────────────── */}
      <section style={{ background: C.sectionAlt, borderTop:`1px solid ${C.divider}`, padding:"64px 56px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ fontSize:11.5, fontWeight:700, color: C.accent, letterSpacing:"0.14em", marginBottom:10 }}>VERIFIED CUSTOMER REVIEWS</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32 }}>
            <h2 style={{ fontSize:36, fontWeight:800, margin:0, letterSpacing:"-0.022em" }}>What Our Researchers Say</h2>
            <div style={{ fontSize:14, color: C.textMuted, display:"flex", alignItems:"center", gap:6 }}>
              <Stars size={13} /><span>4.9 · 83 verified reviews</span>
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16 }}>
            {REVIEWS.map(r => (
              <div key={r.name} style={{ background: C.cardBg, border:`1px solid ${C.cardBorder}`, borderRadius:12, padding:"22px 20px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
                  <div style={{ width:36, height:36, borderRadius:"50%", overflow:"hidden", background: C.primary, flexShrink:0 }}>
                    <img src={r.img} alt={r.product} style={{ width:"100%", height:"100%", objectFit:"cover" }} crossOrigin="anonymous"
                      onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
                  </div>
                  <div>
                    <div style={{ fontSize:12.5, fontWeight:700 }}>{r.name}</div>
                    <div style={{ fontSize:11, color: C.accent }}>{r.product}</div>
                  </div>
                  <div style={{ marginLeft:"auto" }}><Stars size={11} /></div>
                </div>
                <p style={{ fontSize:13.5, color: C.textMuted, lineHeight:1.7, margin:0 }}>"{r.q}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY BROWSE ─────────────────────────────────────────── */}
      <section style={{ maxWidth:1280, margin:"0 auto", padding:"56px 56px 64px" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:18 }}>
          {[
            { img:`${BASE}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-ghk-cu-copper-peptide-100mg-research-vial.webp&w=640&q=75`, sub:"Single Peptides",     title:"Peptides",       detail:"18 compounds" },
            { img:`${BASE}%2Fimages%2Fproducts%2Fstacks%2Fbiohack-london-wolverine-stack-bpc157-tb500-20mg-research-vial.webp&w=640&q=75`, sub:"Synergistic Blends", title:"Research Stacks", detail:"4 formulas" },
            { img:`${BASE}%2Fimages%2Fproducts%2Faccessories%2Fbiohack-london-bacteriostatic-water-3ml-vial.webp&w=640&q=75`, sub:"Peptide Reconstitution", title:"BAC Water", detail:"Sterile solution" },
          ].map(cat => (
            <div key={cat.title} style={{ background: C.cardBg, border:`1px solid rgba(0,187,167,0.16)`, borderRadius:14, overflow:"hidden", cursor:"pointer", transition:"border-color .2s,transform .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(0,187,167,0.4)"; e.currentTarget.style.transform="translateY(-2px)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(0,187,167,0.16)"; e.currentTarget.style.transform="none"; }}>
              <div style={{ height:160, overflow:"hidden" }}>
                <img src={cat.img} alt={cat.title} style={{ width:"100%", height:"100%", objectFit:"cover", filter:"brightness(0.7) saturate(0.8)" }} crossOrigin="anonymous"
                  onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
              </div>
              <div style={{ padding:"20px 22px 22px" }}>
                <div style={{ fontSize:11, color: C.textMuted, letterSpacing:"0.08em", marginBottom:5 }}>{cat.sub}</div>
                <div style={{ fontSize:19, fontWeight:800, marginBottom:4 }}>{cat.title}</div>
                <div style={{ fontSize:13, color: C.textMuted, marginBottom:14 }}>{cat.detail}</div>
                <span style={{ color: C.accent, fontSize:13, fontWeight:700 }}>Explore →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESEARCH LIBRARY ────────────────────────────────────────── */}
      <section style={{ background: C.sectionAlt, borderTop:`1px solid ${C.divider}`, padding:"64px 56px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ fontSize:11.5, fontWeight:700, color: C.accent, letterSpacing:"0.14em", marginBottom:10 }}>RESEARCH LIBRARY</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
            <h2 style={{ fontSize:36, fontWeight:800, margin:0, letterSpacing:"-0.022em" }}>Latest research insights</h2>
            <span style={{ color: C.accent, fontSize:14, cursor:"pointer" }}>View all →</span>
          </div>

          <div style={{ border:`1px solid ${C.cardBorder}`, borderRadius:12, overflow:"hidden" }}>
            {INSIGHTS.map((ins, i) => (
              <div key={ins.title}
                style={{ padding:"22px 26px", display:"flex", justifyContent:"space-between", alignItems:"flex-start", background: C.cardBg, borderBottom: i < INSIGHTS.length-1 ? `1px solid ${C.divider}` : "none", cursor:"pointer", transition:"background .15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#172B27")}
                onMouseLeave={e => (e.currentTarget.style.background = C.cardBg)}>
                <div style={{ flex:1, marginRight:24 }}>
                  <div style={{ fontSize:10.5, fontWeight:700, color: C.accent, letterSpacing:"0.11em", marginBottom:7 }}>{ins.cat.toUpperCase()}</div>
                  <div style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>{ins.title}</div>
                  <div style={{ fontSize:13, color: C.textMuted, lineHeight:1.65 }}>{ins.desc}</div>
                </div>
                <div style={{ fontSize:12.5, color: C.textMuted, whiteSpace:"nowrap", marginTop:2 }}>{ins.time} →</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL SIGNUP ────────────────────────────────────────────── */}
      <section style={{ background: C.announceBg, borderTop:`1px solid ${C.border}`, borderBottom:`1px solid ${C.border}`, padding:"72px 56px", textAlign:"center" }}>
        <div style={{ fontSize:11.5, fontWeight:700, color: C.accent, letterSpacing:"0.14em", marginBottom:10 }}>EXCLUSIVE ACCESS</div>
        <h2 style={{ fontSize:36, fontWeight:800, margin:"0 0 12px", letterSpacing:"-0.022em" }}>
          Research Insights.{" "}<em style={{ color: C.accent }}>Priority Launches.</em>
        </h2>
        <p style={{ color: C.textMuted, fontSize:15, margin:"0 auto 32px", maxWidth:480, lineHeight:1.68 }}>
          Subscribe for early access to new compounds, lab reports, and an exclusive 15% off your first order.
        </p>
        <div style={{ display:"flex", justifyContent:"center", maxWidth:420, margin:"0 auto 12px" }}>
          <input
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{ flex:1, background: C.inputBg, border:`1px solid ${C.inputBorder}`, borderRight:"none", color: C.textPrimary, padding:"13px 18px", fontSize:14, outline:"none", borderRadius:"0px", fontFamily:"Roboto,Arial,sans-serif" }}
          />
          <button style={{ background: C.accent, color:"#FFFFFF", fontWeight:700, fontSize:14, padding:"13px 22px", border:"none", cursor:"pointer", borderRadius:"0px", whiteSpace:"nowrap" }}>
            Subscribe
          </button>
        </div>
        <div style={{ fontSize:12.5, color: C.textDimmer }}>No spam. Unsubscribe at any time.</div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────── */}
      <footer style={{ borderTop:`1px solid ${C.divider}`, padding:"26px 56px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:16 }}>
          <BHLLogo size={28} />
          <div style={{ display:"flex", gap:22, fontSize:12.5, color: C.textMuted }}>
            {["Privacy Policy","Terms & Conditions","COA Reports","Contact Us"].map(l => (
              <span key={l} style={{ cursor:"pointer", transition:"color .15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = C.textPrimary)}
                onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}>{l}</span>
            ))}
          </div>
          <div style={{ fontSize:12, color: C.textDimmer }}>© 2025 BioHack London. Research purposes only.</div>
        </div>
      </footer>
    </div>
  );
}
