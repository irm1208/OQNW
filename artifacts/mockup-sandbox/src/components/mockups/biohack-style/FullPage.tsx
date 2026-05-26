import { useState } from "react";

/* ─── EXACT COLORS extracted directly from biohacklondon.com HTML ─── */
const C = {
  /* backgrounds */
  white:      "#FFFFFF",
  lightGrey:  "#F5F5F5",  // reviews section bg
  heroBg:     "#2A3F3F",  // hero section bg
  researchBg: "#0C1F1F",  // research area cards
  announceBg: "#2A5F5F",  // announcement bar
  emailBg:    "#2A3F3F",  // email section bg
  /* text */
  body:       "#214647",  // main body text
  charcoal:   "#2C3E3E",  // headings
  black:      "#111111",  // price, product name
  grey:       "#666666",  // muted text
  muted:      "#999999",  // footer labels
  /* brand */
  teal:       "#2A5F5F",  // primary teal
  tealLight:  "#A8D4D4",  // muted teal on dark
  tealDark:   "#005A5A",  // dark teal stars
  tealBorder: "#D4E8E8",  // dividers
  tealInput:  "#3A5F5F",  // input border
  inputBg:    "#1E3030",  // dark input
  /* hero */
  heroStar:   "#F5C842",  // gold stars in hero
  /* accent */
  accent:     "#00BBA7",  // bright teal (age gate button only)
};

/* ─── REAL PRODUCT IMAGES ─── */
const I = "https://biohacklondon.com/_next/image?url=";
const PRODUCTS = [
  { name:"GHK-CU Vial",   price:"£55",         badge:"",           img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-ghk-cu-copper-peptide-100mg-research-vial.webp&w=640&q=75` },
  { name:"BPC-157 Vial",  price:"£37.50",       badge:"Bestseller", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-bpc-157-10mg-research-peptide-vial.webp&w=640&q=75` },
  { name:"MOTS-C Vial",   price:"From £34.99",  badge:"Popular",    img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-mots-c-10mg-research-peptide-vial.webp&w=640&q=75` },
  { name:"Reta Vial",     price:"From £69.99",  badge:"Bestseller", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=640&q=75` },
];

const UNS = "https://images.unsplash.com/";
const RESEARCH = [
  { n:"01", title:"Tissue Repair",             img:`${UNS}photo-1571019613454-1cb2f99b2d8b?w=400&q=60`, desc:"Studied for roles in tissue repair mechanisms and cellular recovery pathways in controlled laboratory models." },
  { n:"02", title:"Neurological Pathways",     img:`${UNS}photo-1559757148-5c350d0d3c56?w=400&q=60`,    desc:"Investigated for interactions with neurological signalling pathways in controlled in-vitro settings." },
  { n:"03", title:"Collagen & Skin Biology",   img:`${UNS}photo-1596178060671-7a80dc8059ea?w=400&q=60`, desc:"Studied for roles in collagen synthesis pathways and oxidative stress response mechanisms." },
  { n:"04", title:"Mitochondrial Biology",     img:`${UNS}photo-1549576490-b0b4831ef60a?w=400&q=60`,    desc:"Investigated for effects on mitochondrial function and cellular energy regulation pathways." },
  { n:"05", title:"Musculoskeletal Research",  img:`${UNS}photo-1534438327276-14e5300c3a48?w=400&q=60`, desc:"Investigated for roles in muscle repair mechanisms, endurance pathways, and body composition research." },
  { n:"06", title:"Neuroendocrine Signalling", img:`${UNS}photo-1511295742362-92c96b1cf484?w=400&q=60`, desc:"Studied for roles in sleep-related neuropeptide signalling and neuroendocrine pathway research." },
  { n:"07", title:"Vascular Biology",          img:`${UNS}photo-1576086213369-97a306d36557?w=400&q=60`, desc:"Investigated for roles in angiogenesis, blood flow regulation, and cardiovascular mechanism research." },
  { n:"08", title:"Immune Modulation",         img:`${UNS}photo-1579154204601-01588f351e67?w=400&q=60`, desc:"Compounds researched for immune modulation mechanisms and inflammatory pathway interactions." },
];

const STATS = [
  { val:"4.9★",  label:"Average Rating" },
  { val:"6000+", label:"Orders Dispatched" },
  { val:"99%+",  label:"Purity Every Batch" },
  { val:"24h",   label:"Dispatch Turnaround" },
  { val:"100%",  label:"Batch Traced" },
];

const REVIEWS = [
  { q:"The quality of the peptides appears excellent, and everything arrived exactly as described. Customer service was also responsive and helpful when I had a question.", by:"Catherine A.", prod:"Reta", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75`, rot:2.5 },
  { q:"Very happy with the product. Had some questions which were answered promptly — customer service was perfect. Would use the service again for sure.", by:"Kyerematen", prod:"Reta", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75`, rot:-2.5 },
  { q:"Very professional & responds in a very timely manner. Has some of the best quality products & prices.", by:"Paul J.", prod:"MOTS-C", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-mots-c-10mg-research-peptide-vial.webp&w=96&q=75`, rot:1.5 },
  { q:"Super impressed — this company is independently lab tested in Europe & UK! Excellent customer service.", by:"Yvonne G.", prod:"Reta", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75`, rot:-1.5 },
  { q:"Some initial confusion with my order that was dealt with in a professional and timely manner. Very good quality product. Highly recommended.", by:"Kristian C.", prod:"MOTS-C", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-mots-c-10mg-research-peptide-vial.webp&w=96&q=75`, rot:2 },
  { q:"Reliable — had a hiccup once in transit but was sorted within less than 24 hours. Quality stuff that I highly recommend.", by:"Wiktor D.", prod:"GHK-CU", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-ghk-cu-copper-peptide-100mg-research-vial.webp&w=96&q=75`, rot:-2 },
  { q:"Arrived fast. Amazing product. Great packaging. Definitely going to be my regular store.", by:"Luke B.", prod:"Reta", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75`, rot:1 },
  { q:"5 star service — won't order from anyone else.", by:"Ryan M.", prod:"BAC Water", img:`${I}%2Fimages%2Fproducts%2Faccessories%2Fbiohack-london-bacteriostatic-water-3ml-vial.webp&w=96&q=75`, rot:-1 },
  { q:"Fast delivery and great product at a competitive price too. Highly recommend!", by:"Kamila S.", prod:"Reta", img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-retatrutide-10mg-research-peptide-vial.webp&w=96&q=75`, rot:2.5 },
];

const INSIGHTS = [
  { cat:"Research Guides",      title:"BPC-157 vs TB-500: research summary and key differences",                                          desc:"A research-orientation comparison of BPC-157 and TB-500 — what's actually in the peer-reviewed literature, how the two compounds differ structurally and mechanistically.", time:"9 min read" },
  { cat:"Research Guides",      title:"How to read a peptide Certificate of Analysis (COA)",                                              desc:"A practical UK guide to reading a research-peptide Certificate of Analysis. What HPLC, mass spectrometry, and purity readings actually tell you.", time:"9 min read" },
  { cat:"Research Guides",      title:"How to read research literature on peptides",                                                      desc:"A practical guide to reading peer-reviewed peptide research for the UK research community. PubMed search strategy.", time:"10 min read" },
  { cat:"Research Methodology", title:"Independently verified UK research peptides: what 'lab tested' actually means",                    desc:"A methodology reference for the UK research community. What independent third-party verification actually requires.", time:"13 min read" },
];

/* ─── BHL LOGO (SVG recreation matching the hexagon mark) ─── */
const BHLLogo = ({ inverted = false }: { inverted?: boolean }) => {
  const color = inverted ? C.teal : "#FFFFFF";
  const bg = inverted ? "#FFFFFF" : "transparent";
  return (
    <svg width="130" height="55" viewBox="0 0 130 55" fill="none">
      <polygon points="22,4 36,4 43,16 43,39 36,51 22,51 15,39 15,16" fill={inverted ? "#EEF7F7" : "rgba(255,255,255,0.12)"} stroke={color} strokeWidth="1.5"/>
      <text x="29" y="27" textAnchor="middle" fill={color} fontSize="8.5" fontWeight="700" fontFamily="Roboto,sans-serif" letterSpacing="0.8">BHL</text>
      <text x="55" y="18" fill={color} fontSize="13" fontWeight="800" fontFamily="Roboto,sans-serif" letterSpacing="0.5">BIO</text>
      <text x="55" y="31" fill={color} fontSize="13" fontWeight="800" fontFamily="Roboto,sans-serif" letterSpacing="0.5">HACK</text>
      <text x="55" y="44" fill={color} fontSize="13" fontWeight="800" fontFamily="Roboto,sans-serif" letterSpacing="0.5">LONDON<tspan fontSize="7" dy="-4">™</tspan></text>
    </svg>
  );
};

/* ─── Gold stars (hero + section header) ─── */
const GoldStars = ({ size=16 }: { size?: number }) => (
  <span style={{ display:"flex", gap:1 }}>
    {[...Array(5)].map((_,i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={C.heroStar}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </span>
);

/* ─── Teal stars (review cards) ─── */
const TealStars = ({ size=12 }: { size?: number }) => (
  <span style={{ display:"flex", gap:1 }}>
    {[...Array(5)].map((_,i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 20 20" fill={C.tealDark}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ))}
  </span>
);

/* ─── Arrow icon ─── */
const Arrow = ({ size=14, color="currentColor" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function FullPage() {
  const [ageGate, setAgeGate] = useState(true);
  const [email, setEmail] = useState("");

  return (
    <div style={{ fontFamily:"Roboto,Arial,sans-serif", background: C.white, color: C.body, minHeight:"100vh", overflowX:"hidden" }}>
      {/* Google Fonts: Roboto + Playfair Display (serif headings) */}
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700;900&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&display=swap" rel="stylesheet" />

      {/* ── AGE GATE MODAL (matches screenshot exactly: white card) ── */}
      {ageGate && (
        <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", backdropFilter:"blur(5px)", background:"rgba(0,0,0,0.55)" }}>
          <div style={{ background:"#FFFFFF", borderRadius:4, padding:"44px 40px 36px", maxWidth:430, width:"92%", textAlign:"center", boxShadow:"0 24px 80px rgba(0,0,0,0.3)" }}>
            {/* BHL Logo in teal for white card */}
            <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
              <img src="https://biohacklondon.com/_next/image?url=%2Fimages%2Fbrand%2Fbiohack-london-logo-white.webp&w=375&q=75"
                alt="BioHack London"
                style={{ height:44 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
            </div>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:500, color:"#111111", margin:"0 0 12px", letterSpacing:"-0.01em" }}>Age Verification Required</h2>
            <p style={{ fontSize:14, color:"#555555", lineHeight:1.65, margin:"0 0 28px" }}>
              You must be 18 years or older to access this website. Our products are intended for research purposes only.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:20 }}>
              <button
                onClick={() => setAgeGate(false)}
                style={{ background: C.accent, color:"#FFFFFF", fontWeight:700, fontSize:14, padding:"13px 24px", borderRadius:8, border:"none", cursor:"pointer", boxShadow:`rgb(15,15,15) 0px 0px 0px 2px, ${C.accent} 0px 0px 0px 4px` }}>
                I am 18 or older
              </button>
              <button style={{ background:"transparent", color:"#444", fontWeight:500, fontSize:14, padding:"13px 22px", borderRadius:8, border:"1.5px solid #CCCCCC", cursor:"pointer" }}>
                I am under 18
              </button>
            </div>
            <p style={{ fontSize:12, color:"#999999", lineHeight:1.6, margin:0 }}>
              By entering this site you agree that you are of legal age in your jurisdiction and that all products are purchased for research purposes only.
            </p>
          </div>
        </div>
      )}

      {/* ── ANNOUNCEMENT BAR — bg-[#2A5F5F] text-white ── */}
      <div style={{ background: C.announceBg, color:"#FFFFFF", textAlign:"center", padding:"10px 20px", fontSize:12, fontWeight:500, letterSpacing:"0.02em" }}>
        15% OFF your first order on single peptides — Use code{" "}
        <strong>FIRST15</strong> at checkout{" "}
        <a href="#" style={{ color: C.tealBorder, textDecoration:"underline", textUnderlineOffset:2, marginLeft:8 }}>Shop Now</a>
      </div>

      {/* ── NAV — bg-white border-b, 100px tall ── */}
      <nav style={{ background:"#FFFFFF", borderBottom:`1px solid ${C.tealBorder}`, position:"sticky", top:0, zIndex:100, padding:"0 32px" }}>
        <div style={{ maxWidth:1600, margin:"0 auto", display:"flex", justifyContent:"space-between", alignItems:"center", height:100, gap:16 }}>
          {/* Logo */}
          <div style={{ flexShrink:0, marginRight:32 }}>
            <img src="https://biohacklondon.com/_next/image?url=%2Fimages%2Fbrand%2Fbiohack-london-logo.webp&w=640&q=75"
              alt="BioHack London"
              style={{ height:90, width:"auto", objectFit:"contain", maxWidth:180 }}
              onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
          </div>

          {/* Nav links — text-[11px] font-bold uppercase tracking-[0.1em] */}
          <div style={{ display:"flex", gap:20, flex:1, justifyContent:"center" }}>
            {["Home","Research Peptides","NAD+","BAC Water","Stacks","Lab Supplies","Lab Reports","Insights","Calculator","About Us","Contact"].map(n => (
              <a key={n} href="#" style={{ fontSize:11, fontWeight:700, color: C.charcoal, textDecoration:"none", textTransform:"uppercase", letterSpacing:"0.1em", whiteSpace:"nowrap", padding:"8px 0" }}>
                {n}
              </a>
            ))}
          </div>

          {/* Right icons */}
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            <button style={{ padding:"8px", background:"none", border:"none", cursor:"pointer", color: C.charcoal }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
            <button style={{ padding:"8px", background:"none", border:"none", cursor:"pointer", color: C.charcoal }}>
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── HERO — bg-[#2A3F3F], min-height 80vh, video bg + gradient ── */}
      <section style={{ position:"relative", background: C.heroBg, minHeight:"80vh", overflow:"hidden" }}>
        {/* Dark photo bg (stand-in for video) */}
        <div style={{ position:"absolute", inset:0, backgroundImage:`url(${UNS}photo-1534438327276-14e5300c3a48?w=1400&q=60)`, backgroundSize:"cover", backgroundPosition:"center" }} />
        {/* Gradient overlay — from-black/65 via-black/30 to-transparent */}
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.30) 45%, rgba(0,0,0,0) 100%)" }} />

        {/* Content */}
        <div style={{ position:"relative", zIndex:10, display:"flex", flexDirection:"column", justifyContent:"center", minHeight:"80vh", padding:"0 96px" }}>
          <div style={{ maxWidth:720 }}>
            <p style={{ fontSize:10, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.4em", color:"rgba(255,255,255,0.70)", marginBottom:20 }}>Est. 2025 · London, UK</p>

            {/* H1: font-serif, 72px, font-medium, leading-[1.08], tracking-tight */}
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:72, fontWeight:500, lineHeight:1.08, letterSpacing:"-0.02em", color:"#FFFFFF", margin:"0 0 24px" }}>
              Research Peptides.<br />
              Uncompromising Purity.
            </h1>

            <p style={{ fontSize:16, color:"rgba(255,255,255,0.80)", lineHeight:1.65, maxWidth:540, marginBottom:16 }}>
              Third-Party Verified. Minimum 99% Purity.<br />
              <strong>DISCLAIMER:</strong> For research purposes only, not for human consumption
            </p>
            <p style={{ fontSize:14, color:"rgba(255,255,255,0.70)", lineHeight:1.65, maxWidth:540, marginBottom:40 }}>
              <a href="#" style={{ color:"#FFFFFF", fontWeight:600, textDecoration:"underline" }}>Independently verified</a>{" "}
              by{" "}
              <a href="#" style={{ color:"#FFFFFF", fontWeight:600, textDecoration:"underline" }}>PeptideVerify (UK)</a>{" "}
              &{" "}
              <a href="#" style={{ color:"#FFFFFF", fontWeight:600, textDecoration:"underline" }}>Janoshik Analytical</a>.
              {" "}Live batch verification on every flagship peptide.
            </p>

            {/* CTA: bg-white text-teal, 0px radius, all-caps, wide tracking */}
            <div style={{ display:"flex", marginBottom:40 }}>
              <a href="#" style={{ display:"inline-flex", alignItems:"center", gap:12, background:"#FFFFFF", color: C.teal, padding:"16px 32px", fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none" }}>
                Shop All Products <Arrow size={16} color={C.teal} />
              </a>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <GoldStars size={16} />
              <span style={{ color:"rgba(255,255,255,0.80)", fontSize:12, fontWeight:500 }}>4.9 · 83 verified reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR — bg-[#2A5F5F] ── */}
      <div style={{ background: C.announceBg, padding:"16px 48px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", gap:12 }}>
          {["HPLC & Mass Spec Verified","99%+ Purity Guaranteed","Next-Day Delivery","With COA Every Batch"].map(t => (
            <span key={t} style={{ fontSize:10, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"rgba(255,255,255,0.90)" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ── BESTSELLERS — bg-white, border-t border-[#D4E8E8] ── */}
      <section style={{ background: C.white, padding:"64px 48px", borderTop:`1px solid ${C.tealBorder}` }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:40 }}>
            <div>
              {/* section label: text-[9px] font-semibold uppercase tracking-[0.3em] text-[#2A5F5F] */}
              <p style={{ fontSize:9, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.3em", color: C.teal, marginBottom:8 }}>Most Popular</p>
              {/* h2: font-serif text-4xl font-medium text-[#2C3E3E] */}
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:500, color: C.charcoal, margin:0, lineHeight:1.2 }}>Bestselling Peptides</h2>
            </div>
            <a href="#" style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, fontWeight:600, color: C.teal, textDecoration:"none", textTransform:"uppercase", letterSpacing:"0.2em", borderBottom:`1px solid rgba(42,95,95,0.4)`, paddingBottom:2 }}>
              View All <Arrow size={13} color={C.teal} />
            </a>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 }}>
            {PRODUCTS.map(p => (
              <div key={p.name} style={{ background:"#FFFFFF", cursor:"pointer" }}>
                {/* Square image area */}
                <div style={{ position:"relative", aspectRatio:"1/1", overflow:"hidden" }}>
                  {p.badge && (
                    <span style={{ position:"absolute", top:12, left:12, background: C.teal, color:"#FFFFFF", fontSize:9, fontWeight:700, letterSpacing:"0.15em", padding:"4px 10px", textTransform:"uppercase", zIndex:2 }}>
                      {p.badge}
                    </span>
                  )}
                  <div style={{ position:"absolute", inset:24 }}>
                    <img src={p.img} alt={p.name}
                      style={{ width:"100%", height:"100%", objectFit:"contain", borderRadius:16 }}
                      onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.background="#EEF7F7"; }} />
                  </div>
                </div>
                {/* Card info */}
                <div style={{ padding:"12px 20px 20px", background:"#FFFFFF" }}>
                  <h3 style={{ fontSize:16, fontWeight:600, color: C.black, marginBottom:10, lineHeight:1.2 }}>{p.name}</h3>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                    {/* purity badge: border, text-[#2A5F5F], tracking */}
                    <span style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color: C.teal, border:`1px solid rgba(42,95,95,0.25)`, padding:"4px 10px", lineHeight:1 }}>≥99% Purity</span>
                    <span style={{ fontSize:11, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.1em", color:"#666", border:`1px solid rgba(102,102,102,0.2)`, padding:"4px 10px", lineHeight:1 }}>HPLC Verified</span>
                  </div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <p style={{ fontSize:18, fontWeight:600, color: C.black, margin:0 }}>{p.price}</p>
                    <button style={{ background: C.teal, color:"#FFFFFF", fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"9px 16px", border:"none", cursor:"pointer" }}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:"center", marginTop:40 }}>
            <a href="#" style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color: C.teal, textDecoration:"none", border:`1px solid rgba(42,95,95,0.3)`, padding:"14px 36px" }}>
              View All Products <Arrow size={13} color={C.teal} />
            </a>
          </div>
        </div>
      </section>

      {/* ── RESEARCH AREAS ── */}
      <section style={{ padding:"80px 48px", background: C.white, borderTop:`1px solid ${C.tealBorder}` }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <p style={{ fontSize:9, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.3em", color: C.teal, marginBottom:8 }}>Research Areas</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:72, fontWeight:500, color:"#111111", lineHeight:0.92, letterSpacing:"-0.02em", margin:0 }}>
              What peptides<br />
              <em style={{ fontStyle:"normal", color: C.teal }}>are studied for.</em>
            </h2>
            <div style={{ maxWidth:280, paddingBottom:8 }}>
              <button style={{ background: C.teal, color:"#FFFFFF", fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", padding:"12px 24px", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:8 }}>
                Shop All Peptides <Arrow size={13} color="white" />
              </button>
            </div>
          </div>
          <p style={{ fontSize:14, color: C.grey, lineHeight:1.7, maxWidth:440, marginBottom:48 }}>
            From cellular repair to neuroendocrine signalling — peptide research spans a broad spectrum of biological pathways under active investigation.
          </p>

          {/* grid-cols-4 gap-px bg-[#D4E8E8] (gap creates teal lines between cards) */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background: C.tealBorder }}>
            {RESEARCH.map(r => (
              <ResearchCard key={r.n} {...r} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ background: C.announceBg, padding:"28px 48px", borderTop:`1px solid rgba(255,255,255,0.1)` }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"flex", justifyContent:"space-around", flexWrap:"wrap", gap:20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign:"center" }}>
              <div style={{ fontSize:26, fontWeight:900, color:"#FFFFFF", letterSpacing:"-0.02em", fontFamily:"'Playfair Display',serif" }}>{s.val}</div>
              <div style={{ fontSize:11, fontWeight:500, color:"rgba(255,255,255,0.7)", letterSpacing:"0.07em", marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PEPTIDE OF THE MONTH ── */}
      <section style={{ background: C.white, padding:"72px 48px", borderTop:`1px solid ${C.tealBorder}` }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <p style={{ fontSize:9, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.3em", color: C.teal, marginBottom:8 }}>Featured Product</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:32 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:500, color: C.charcoal, margin:0 }}>Peptide of the Month</h2>
            <a href="#" style={{ fontSize:10, fontWeight:600, color: C.teal, textDecoration:"none", textTransform:"uppercase", letterSpacing:"0.2em", borderBottom:`1px solid rgba(42,95,95,0.4)`, paddingBottom:2 }}>View All Products</a>
          </div>

          <div style={{ display:"flex", gap:56, alignItems:"center", borderTop:`1px solid ${C.tealBorder}`, paddingTop:32 }}>
            {/* Product image */}
            <div style={{ width:200, height:240, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:"#F5F9F9" }}>
              <img src={`https://biohacklondon.com/images/products/peptides/biohack-london-cagrilintide-10mg-research-peptide-vial.webp`}
                alt="Cagrilintide Vial"
                style={{ maxWidth:"100%", maxHeight:"100%", objectFit:"contain" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
            </div>
            <div style={{ flex:1 }}>
              {/* "New" badge */}
              <span style={{ display:"inline-block", fontSize:9, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color: C.teal, border:`1px solid rgba(42,95,95,0.3)`, padding:"4px 14px", marginBottom:16 }}>New</span>
              <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, fontWeight:500, color: C.charcoal, margin:"0 0 12px", letterSpacing:"-0.01em" }}>Cagrilintide Vial</h3>
              <p style={{ fontSize:14, color: C.grey, lineHeight:1.75, maxWidth:540, margin:"0 0 20px" }}>
                Cagrilintide is a long-acting amylin analogue research peptide supplied as lyophilised powder for laboratory investigation of receptor binding, metabolic pathway modelling, and molecular interaction studies in controlled experimental environments.
              </p>
              <ul style={{ listStyle:"none", padding:0, margin:"0 0 24px", display:"flex", flexDirection:"column", gap:8 }}>
                {[
                  "≥99% Purity — HPLC & mass spectrometry verified",
                  "Full Certificate of Analysis for every batch",
                  "Cold-chain dispatch from London",
                  "Same-day dispatch on orders before 1PM",
                ].map(item => (
                  <li key={item} style={{ fontSize:13.5, color: C.charcoal, display:"flex", alignItems:"flex-start", gap:10 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background: C.teal, marginTop:6, flexShrink:0 }} />
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ display:"flex", alignItems:"center", gap:24, paddingTop:16, borderTop:`1px solid ${C.tealBorder}` }}>
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:24, fontWeight:500, color: C.charcoal }}>£159.00</span>
                <span style={{ fontSize:10, color:"#888", textTransform:"uppercase", letterSpacing:"0.15em" }}>10mg vial</span>
                {/* Button: bg-[#2A5F5F] text-white, 0px radius, uppercase, wide tracking */}
                <a href="#" style={{ display:"inline-flex", alignItems:"center", gap:8, background: C.teal, color:"#FFFFFF", padding:"14px 24px", fontSize:11, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", textDecoration:"none" }}>
                  View Product <Arrow size={14} color="white" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS — bg-[#F5F5F5] border-t border-[#D4E8E8] ── */}
      <section style={{ background: C.lightGrey, borderTop:`1px solid ${C.tealBorder}`, padding:"72px 48px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          {/* Label: text-[9px] font-semibold uppercase tracking-[0.3em] text-[#2A5F5F] border border-[#2A5F5F]/30 px-4 py-1.5 */}
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", textAlign:"center", marginBottom:40, gap:12 }}>
            <span style={{ fontSize:9, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.3em", color: C.teal, border:`1px solid rgba(42,95,95,0.30)`, padding:"6px 16px" }}>
              Verified Customer Reviews
            </span>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:500, color: C.charcoal, margin:0 }}>What Our Researchers Say</h2>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <GoldStars size={16} />
              <span style={{ fontSize:14, fontWeight:600, color: C.charcoal }}>4.9</span>
              <span style={{ fontSize:14, color:"#999" }}>· 83 verified reviews</span>
            </div>
          </div>

          {/* Carousel area with rotated cards */}
          <div style={{ position:"relative", width:"100%", height:600, overflow:"hidden" }}>
            {REVIEWS.slice(0,5).map((r, idx) => {
              /* Cards stack centered like the real site, offset by index */
              const offsets = [-300, -140, 0, 140, 300];
              const zIndexes = [1, 2, 3, 2, 1];
              const scales = [0.82, 0.9, 1, 0.9, 0.82];
              return (
                <div key={r.by}
                  style={{
                    position:"absolute",
                    left:"50%", top:"50%",
                    width:365, height:365,
                    transform:`translate(calc(-50% + ${offsets[idx]}px), -50%) rotate(${r.rot}deg) scale(${scales[idx]})`,
                    zIndex: zIndexes[idx],
                    background:"#FFFFFF",
                    border:"2px solid #E5E7EB",
                    padding:32,
                    cursor:"pointer",
                    clipPath:"polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)",
                    boxSizing:"border-box" as const,
                  }}>
                  {/* cut-corner accent line */}
                  <span style={{ position:"absolute", display:"block", right:-2, top:48, width:70.7, height:2, background:"#E5E7EB", transform:"rotate(45deg)", transformOrigin:"top right" }} />
                  {/* Product thumb */}
                  <div style={{ marginBottom:16, height:56, width:48, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", background:"#F0F7F7", boxShadow:"3px 3px 0px #F3F4F6" }}>
                    <img src={r.img} alt={r.prod} style={{ width:"100%", height:"100%", objectFit:"contain", padding:4 }} onError={() => {}} />
                  </div>
                  <TealStars size={12} />
                  <h3 style={{ fontSize:14, fontWeight:500, color:"#111827", lineHeight:1.65, margin:"12px 0 0" }}>"{r.q}"</h3>
                  <p style={{ position:"absolute", bottom:32, left:32, right:32, fontSize:12, fontStyle:"italic", color:"#6B7280", margin:0 }}>
                    — {r.by} · <span style={{ fontStyle:"normal", textTransform:"uppercase", letterSpacing:"0.1em", fontSize:10 }}>{r.prod}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CATEGORY BROWSE ── */}
      <section style={{ background: C.white, padding:"56px 48px", borderTop:`1px solid ${C.tealBorder}` }}>
        <div style={{ maxWidth:1280, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background: C.tealBorder }}>
          {[
            { img:`${I}%2Fimages%2Fproducts%2Fpeptides%2Fbiohack-london-ghk-cu-copper-peptide-100mg-research-vial.webp&w=640&q=75`, sub:"Single Peptides",       title:"Peptides",       detail:"18 compounds" },
            { img:`${I}%2Fimages%2Fproducts%2Fstacks%2Fbiohack-london-wolverine-stack-bpc157-tb500-20mg-research-vial.webp&w=640&q=75`, sub:"Synergistic Blends",    title:"Research Stacks", detail:"4 formulas" },
            { img:`${I}%2Fimages%2Fproducts%2Faccessories%2Fbiohack-london-bacteriostatic-water-3ml-vial.webp&w=640&q=75`, sub:"Peptide Reconstitution", title:"BAC Water",       detail:"Sterile solution" },
          ].map(cat => (
            <div key={cat.title} style={{ background:"#FFFFFF", cursor:"pointer", overflow:"hidden" }}>
              <div style={{ height:200, overflow:"hidden", background:"#EEF7F7", position:"relative" }}>
                <img src={cat.img} alt={cat.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} crossOrigin="anonymous"
                  onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
              </div>
              <div style={{ padding:"24px 28px 28px" }}>
                <p style={{ fontSize:10, color: C.grey, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>{cat.sub}</p>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:500, color: C.charcoal, marginBottom:4 }}>{cat.title}</h3>
                <p style={{ fontSize:13, color: C.grey, marginBottom:16 }}>{cat.detail}</p>
                <a href="#" style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.15em", color: C.teal, textDecoration:"none" }}>Explore →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── RESEARCH LIBRARY ── */}
      <section style={{ background: C.lightGrey, borderTop:`1px solid ${C.tealBorder}`, padding:"64px 48px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <p style={{ fontSize:9, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.3em", color: C.teal, marginBottom:8 }}>Research Library</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:500, color: C.charcoal, margin:0 }}>Latest research insights</h2>
            <a href="#" style={{ fontSize:10, fontWeight:600, color: C.teal, textDecoration:"none", textTransform:"uppercase", letterSpacing:"0.2em" }}>View all →</a>
          </div>

          <div style={{ border:`1px solid ${C.tealBorder}`, background:"#FFFFFF" }}>
            {INSIGHTS.map((ins, i) => (
              <a key={ins.title} href="#" style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:"24px 28px", borderBottom: i < INSIGHTS.length-1 ? `1px solid ${C.tealBorder}` : "none", textDecoration:"none", background:"#FFFFFF" }}
                onMouseEnter={e => (e.currentTarget.style.background="#F0F7F7")}
                onMouseLeave={e => (e.currentTarget.style.background="#FFFFFF")}>
                <div style={{ flex:1, marginRight:24 }}>
                  <p style={{ fontSize:9, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.18em", color: C.teal, marginBottom:7 }}>{ins.cat}</p>
                  <h3 style={{ fontSize:15, fontWeight:600, color: C.charcoal, marginBottom:6, lineHeight:1.4 }}>{ins.title}</h3>
                  <p style={{ fontSize:13, color: C.grey, lineHeight:1.65, margin:0 }}>{ins.desc}</p>
                </div>
                <div style={{ fontSize:12.5, color: C.grey, whiteSpace:"nowrap", marginTop:4 }}>{ins.time} →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── EMAIL SIGNUP — bg-[#2A3F3F] ── */}
      <section style={{ background: C.emailBg, padding:"72px 48px", textAlign:"center", borderTop:`1px solid rgba(255,255,255,0.06)` }}>
        <p style={{ fontSize:9, fontWeight:600, textTransform:"uppercase", letterSpacing:"0.3em", color: C.tealLight, marginBottom:12 }}>Exclusive Access</p>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:36, fontWeight:500, color:"#FFFFFF", margin:"0 0 12px", lineHeight:1.2 }}>
          Research Insights.<br />Priority Launches.
        </h2>
        <p style={{ fontSize:15, color: C.tealLight, margin:"0 auto 40px", maxWidth:480, lineHeight:1.68 }}>
          Subscribe for early access to new compounds, lab reports, and an exclusive 15% off your first order.
        </p>
        {/* Input: bg-[#1E3030] border border-[#3A5F5F], 0px radius; Button: bg-white text-[#2A5F5F] */}
        <form style={{ display:"flex", justifyContent:"center", maxWidth:440, margin:"0 auto 16px" }} onSubmit={e => e.preventDefault()}>
          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            style={{ flex:1, background: C.inputBg, border:`1px solid ${C.tealInput}`, borderRight:"none", color:"#FFFFFF", padding:"16px 20px", fontSize:14, outline:"none", fontFamily:"Roboto,sans-serif", borderRadius:0 }}
          />
          <button type="submit" style={{ background:"#FFFFFF", color: C.teal, padding:"16px 28px", fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", border:"none", cursor:"pointer", whiteSpace:"nowrap", borderRadius:0 }}>
            Subscribe
          </button>
        </form>
        <p style={{ fontSize:10, color:"#6A9A9A", letterSpacing:"0.1em", textTransform:"uppercase" }}>No spam. Unsubscribe at any time.</p>

        {/* Legal disclaimer bar */}
        <div style={{ maxWidth:900, margin:"48px auto 0", paddingTop:24, borderTop:"1px solid rgba(255,255,255,0.08)", display:"flex", alignItems:"center", gap:16, textAlign:"left" }}>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#FFFFFF", whiteSpace:"nowrap" }}>Research Use Only</span>
          <div style={{ width:1, height:16, background:"rgba(42,95,95,0.6)" }} />
          <p style={{ fontSize:10.5, color:"#7A9F9F", lineHeight:1.6, margin:0 }}>
            All products are intended solely for in vitro laboratory research purposes. Not approved for human or veterinary use, not medicines, and not intended for diagnosis, treatment, or prevention of any disease. Not for human consumption. By purchasing, you confirm you are{" "}
            <strong style={{ color:"#A0C4C4", fontWeight:600 }}>18+</strong> and products will be handled only by qualified researchers in a suitable laboratory setting.
          </p>
        </div>
      </section>

      {/* ── FOOTER — bg-white border-t border-[#D4E8E8] ── */}
      <footer style={{ background:"#FFFFFF", borderTop:`1px solid ${C.tealBorder}`, padding:"64px 48px 32px" }}>
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr 1fr", gap:32, paddingBottom:48, borderBottom:`1px solid ${C.tealBorder}` }}>
            {/* Brand col */}
            <div>
              <div style={{ marginBottom:20 }}>
                <img src="https://biohacklondon.com/_next/image?url=%2Fimages%2Fbrand%2Fbiohack-london-logo.webp&w=640&q=75"
                  alt="BioHack London" style={{ height:60, width:"auto" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
              </div>
              <p style={{ fontSize:12, color:"#666", lineHeight:1.7, marginBottom:24 }}>Premium research peptides. Third-party verified. London-based precision.</p>
            </div>
            {/* Link cols */}
            {[
              { heading:"Shop", links:["All Peptides","Research Stacks","Lab Supplies"] },
              { heading:"Research", links:["Lab Reports","Insights","Peptide Guide","FAQ"] },
              { heading:"Company", links:["About Us","Contact Us","info@biohacklondon.com"] },
              { heading:"Support", links:["Shipping Policy","Returns & Refunds","Privacy Policy","Terms & Conditions"] },
            ].map(col => (
              <div key={col.heading}>
                <h4 style={{ fontSize:10, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:"#999", marginBottom:20 }}>{col.heading}</h4>
                <ul style={{ listStyle:"none", padding:0, margin:0, display:"flex", flexDirection:"column", gap:12 }}>
                  {col.links.map(l => (
                    <li key={l}><a href="#" style={{ fontSize:13, color:"#666", textDecoration:"none" }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <p style={{ fontSize:12, color:"#999", margin:0 }}>© 2025 BioHack London. All rights reserved. Research purposes only.</p>
            <div style={{ display:"flex", gap:20 }}>
              {["Privacy Policy","Terms & Conditions","Cookie Policy"].map(l => (
                <a key={l} href="#" style={{ fontSize:12, color:"#999", textDecoration:"none" }}>{l}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ─── Research Area Card component (dark bg + photo + gradient + hover) ─── */
function ResearchCard({ n, title, img, desc }: { n:string; title:string; img:string; desc:string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={{ position:"relative", overflow:"hidden", height:320, background:"#0C1F1F", cursor:"default" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {/* Photo */}
      <img src={img} alt={title}
        style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", filter:"saturate(0.4) brightness(0.6)", transition:"transform 0.5s" }}
        onError={(e) => { (e.target as HTMLImageElement).style.display="none"; }} />
      {/* Gradient: from-black/90 via-black/30 to-black/10 */}
      <div style={{ position:"absolute", inset:0, background: hovered ? "linear-gradient(0deg,rgba(0,0,0,0.95) 0%,rgba(0,0,0,0.30) 50%,rgba(0,0,0,0.10) 100%)" : "linear-gradient(0deg,rgba(0,0,0,0.90) 0%,rgba(0,0,0,0.30) 50%,rgba(0,0,0,0.10) 100%)", transition:"background 0.5s" }} />
      {/* Teal underline on hover */}
      <div style={{ position:"absolute", bottom:0, left:0, height:3, width: hovered ? "100%" : 0, background:"#2A5F5F", transition:"width 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
      {/* Content */}
      <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:"32px" }}>
        <span style={{ display:"block", fontSize:9, fontWeight:700, color:"#A8D4D4", letterSpacing:"0.35em", textTransform:"uppercase", marginBottom:12, opacity: hovered ? 1 : 0.7, transition:"opacity 0.3s" }}>{n}</span>
        <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, fontWeight:500, color:"#FFFFFF", lineHeight:1.2, margin:0, marginBottom: hovered ? 12 : 0, transition:"margin 0.4s" }}>{title}</h3>
        <div style={{ maxHeight: hovered ? 80 : 0, overflow:"hidden", transition:"max-height 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
          <p style={{ fontSize:12, color:"rgba(255,255,255,0.70)", lineHeight:1.6, margin:0 }}>{desc}</p>
        </div>
      </div>
    </div>
  );
}
