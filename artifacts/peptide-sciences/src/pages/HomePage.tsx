import { useState, useRef } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  Shield, FlaskConical, Truck, Award,
  ChevronRight, ArrowRight, CheckCircle, Star, Quote
} from "lucide-react";
import GroupedProductCard from "@/components/GroupedProductCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";

const RESEARCH_AREAS = [
  {
    n: "01", tag: "Recovery",
    title: "Tissue Repair & Recovery",
    peptides: "BPC-157 · TB-500",
    desc: "Studied for roles in accelerating tissue remodelling, tendon healing, and cellular repair cascades in controlled laboratory models.",
    img: "https://infomeddnews.com/wp-content/uploads/2022/05/Physiotherapy-696x464.jpg",
    accent: "#60A5FA",
  },
  {
    n: "02", tag: "Cognitive",
    title: "Brain & Cognitive Health",
    peptides: "Semax · Selank · P21",
    desc: "Investigated for neuroprotective mechanisms, BDNF upregulation, and synaptic plasticity in neurological research settings.",
    img: "https://media.istockphoto.com/id/97506007/photo/mri-scan-of-brain.jpg?s=612x612&w=0&k=20&c=C5ttWq3Fu7I93zx5jOkHlAZ1ILuHslWWRzNMTToOKHA=",
    accent: "#93C5FD",
  },
  {
    n: "03", tag: "Metabolic",
    title: "Weight & Metabolic Research",
    peptides: "Tirzepatide · Retatrutide · AOD-9604",
    desc: "GLP-1 receptor agonist research — investigated for appetite signalling, adipogenesis pathways, and lipid metabolism models.",
    img: "https://cehs.usu.edu/khs/images/labs/banners/body-composition-lab.jpg",
    accent: "#34D399",
  },
  {
    n: "04", tag: "Skin",
    title: "Skin & Collagen Biology",
    peptides: "GHK-Cu",
    desc: "Researched for collagen synthesis stimulation, oxidative stress modulation, and dermal fibroblast activity in skin biology studies.",
    img: "https://media.gettyimages.com/id/1024433198/photo/close-up-marco-shots-of-body-parts.jpg?s=612x612&w=0&k=20&c=zy5-5uHIAp7-9ZxrG998qhxv0CLC-cjAISGFb_BfrFQ=",
    accent: "#38BDF8",
  },
  {
    n: "05", tag: "Hormonal",
    title: "Growth Hormone Axis",
    peptides: "CJC-1295 · Ipamorelin · GHRP-6",
    desc: "Investigated for GHRH receptor binding, pulsatile GH secretion mimicry, and downstream IGF-1 pathway research.",
    img: "https://kin.uncg.edu/wp-content/uploads/2023/10/Exercise-and-Endocrinology-Lab-1024x576.jpg",
    accent: "#3B82F6",
  },
  {
    n: "06", tag: "Immune",
    title: "Immune Regulation",
    peptides: "Thymosin α-1 · KPV · LL-37",
    desc: "Studied for T-cell maturation pathways, cytokine modulation, and innate immune response interactions in controlled models.",
    img: "https://media.istockphoto.com/id/641212596/photo/white-blood-cells.jpg?s=612x612&w=0&k=20&c=H4jXuqjqaQdYKc1HjvNNbtVFRj9SdBYQWNe_pPmQtoY=",
    accent: "#93C5FD",
  },
  {
    n: "07", tag: "Longevity",
    title: "Longevity & Anti-Ageing",
    peptides: "Epithalon · SS-31 · MOTS-C",
    desc: "Investigated for telomerase activation, mitochondrial protection, and cellular senescence pathways in longevity research.",
    img: "https://images.presentationgo.com/2025/04/dna-strand-break-3d.jpg",
    accent: "#6EE7B7",
  },
  {
    n: "08", tag: "Cardiovascular",
    title: "Cardiovascular Research",
    peptides: "BPC-157 · TB-500 · VIP",
    desc: "Studied for angiogenesis pathway interactions, cardiac cell protection mechanisms, and vascular tone regulation in laboratory models.",
    img: "https://media.istockphoto.com/id/1266227507/photo/human-heart-with-blood-vessels.jpg?s=612x612&w=0&k=20&c=sj63aWFsM6Z6Qovl5jUcQoOR4qG6otKN5hFCi0n9JGY=",
    accent: "#1B5CB5",
  },
];

function ResearchAreaCard({ n, tag, title, peptides, desc, img, accent, featured = false }: {
  n: string; tag: string; title: string; peptides: string; desc: string;
  img: string; accent: string; featured?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const cardHeight = featured ? "100%" : 220;
  return (
    <div
      className={featured ? "" : "research-card"}
      style={{
        position: "relative", overflow: "hidden",
        height: featured ? "100%" : cardHeight,
        minHeight: featured ? 400 : undefined,
        background: "#071A4A", cursor: "default",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Photo */}
      <img
        src={img} alt={title}
        style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          objectFit: "cover",
          filter: `saturate(${hovered ? 0.55 : 0.35}) brightness(${hovered ? 0.7 : 0.55})`,
          transform: hovered ? "scale(1.05)" : "scale(1)",
          transition: "transform 0.7s ease, filter 0.5s ease",
        }}
      />
      {/* Gradient overlay — stronger at bottom */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(0deg, rgba(4,10,20,0.96) 0%, rgba(4,10,20,0.55) 45%, rgba(4,10,20,0.15) 100%)",
      }} />
      {/* Left accent bar — slides in on hover */}
      <div style={{
        position: "absolute", left: 0, top: 0,
        width: 3, height: hovered ? "100%" : 0,
        background: `linear-gradient(180deg, ${accent}, ${accent}66)`,
        transition: "height 0.45s cubic-bezier(0.16,1,0.3,1)",
      }} />

      {/* Top: tag chip */}
      <div style={{ position: "absolute", top: 18, left: 18, zIndex: 2 }}>
        <span style={{
          display: "inline-block", fontSize: 9, fontWeight: 700,
          letterSpacing: "0.2em", textTransform: "uppercase",
          color: "#FFFFFF",
          background: `${accent}33`,
          border: `1px solid ${accent}55`,
          padding: "3px 10px",
          backdropFilter: "blur(4px)",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(-6px)",
          transition: "opacity 0.3s, transform 0.35s",
        }}>{tag}</span>
      </div>

      {/* Bottom content */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: featured ? "28px 32px" : "22px 24px",
      }}>
        <span style={{
          display: "block", fontSize: 9, fontWeight: 700,
          color: accent, letterSpacing: "0.3em", textTransform: "uppercase",
          marginBottom: 8,
          opacity: hovered ? 0.9 : 0.55,
          transition: "opacity 0.3s",
        }}>{n}</span>

        <h3 style={{
          fontSize: featured ? 22 : 17, fontWeight: 800,
          color: "#FFFFFF", lineHeight: 1.2, margin: "0 0 0 0",
          letterSpacing: "-0.02em",
        }}>{title}</h3>

        {/* Peptides + desc — slide up on hover */}
        <div style={{
          maxHeight: hovered ? 120 : 0,
          overflow: "hidden",
          transition: "max-height 0.45s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <p style={{
            fontSize: 11.5, color: "rgba(255,255,255,0.60)", lineHeight: 1.65,
            margin: "10px 0 8px",
          }}>{desc}</p>
          <p style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
            color: accent, margin: 0,
          }}>{peptides}</p>
        </div>
      </div>
    </div>
  );
}


const featuredIds = ["3", "17", "56", "82", "71", "31", "15", "64"];

const TESTIMONIALS = [
  {
    name: "Tom R.",
    avatar: "TR",
    color: "#1B5CB5",
    rating: 5,
    text: "Been using BPC-157 for about 4 months now. Noticed a real difference with an old shoulder injury that just wouldn't go away. Packaging was discreet, COA included without asking. Will definitely reorder.",
    peptide: "BPC-157",
  },
  {
    name: "Jamie K.",
    avatar: "JK",
    color: "#059669",
    rating: 5,
    text: "Tried a few different suppliers before finding OmniQure. The difference in quality is night and day. Epithalon came with full lab docs and arrived in perfect condition. Already on my second order.",
    peptide: "Epithalon",
  },
  {
    name: "Chris M.",
    avatar: "CM",
    color: "#7C3AED",
    rating: 5,
    text: "Fast delivery, great communication, and the Ipamorelin quality has been consistently solid across three orders. Nice to finally find a supplier you can actually trust.",
    peptide: "Ipamorelin",
  },
  {
    name: "Dan W.",
    avatar: "DW",
    color: "#0E7490",
    rating: 5,
    text: "Ordered TB-500 and GHK-Cu together. Both packaged really well and COAs matched up perfectly. I've had issues with underdosed products elsewhere — not here. One of the most reliable suppliers I've come across.",
    peptide: "TB-500 + GHK-Cu",
  },
  {
    name: "Sarah L.",
    avatar: "SL",
    color: "#B45309",
    rating: 5,
    text: "Really impressed with how transparent everything is — lab results right there on the site. Retatrutide arrived quickly and packaging was completely discreet. Customer service replied within the hour. 10/10.",
    peptide: "Retatrutide",
  },
  {
    name: "Mohammed A.",
    avatar: "MA",
    color: "#1B5CB5",
    rating: 5,
    text: "Ordered Tesamorelin twice now and both times the purity has been spot on. Love that the HPLC data is published for every batch. Delivery was fast and the vials arrived perfectly sealed.",
    peptide: "Tesamorelin",
  },
  {
    name: "Zara B.",
    avatar: "ZB",
    color: "#059669",
    rating: 5,
    text: "Was skeptical at first but the lab reports really sold it for me. GHK-Cu quality is excellent and I've already recommended OmniQure to a couple of friends. Subscription option would be amazing!",
    peptide: "GHK-Cu",
  },
  {
    name: "Harpreet S.",
    avatar: "HS",
    color: "#7C3AED",
    rating: 5,
    text: "Third order in and still blown away by the consistency. BPC-157 purity is always exactly what the COA states. Quick dispatch and the discreet packaging is a nice touch. Wouldn't go anywhere else.",
    peptide: "BPC-157",
  },
  {
    name: "Tariq N.",
    avatar: "TN",
    color: "#0E7490",
    rating: 5,
    text: "Placed my first order a bit nervous about quality but the documentation put me at ease straight away. Selank arrived well packed, COA was clear, and I noticed results within the first few weeks. Brilliant service.",
    peptide: "Selank",
  },
  {
    name: "Gurpreet D.",
    avatar: "GD",
    color: "#B45309",
    rating: 5,
    text: "Retatrutide from OmniQure is next level. The purity data is publicly available which gives real confidence. Fast shipping, discreet packaging, and the team answered my questions quickly. Top supplier.",
    peptide: "Retatrutide",
  },
  {
    name: "Priya M.",
    avatar: "PM",
    color: "#1B5CB5",
    rating: 5,
    text: "Have been ordering for 6 months. The quality never drops and they always include the full COA. CJC-1295 has been great — consistent every single time. Easy checkout and fast delivery every order.",
    peptide: "CJC-1295",
  },
  {
    name: "Amir H.",
    avatar: "AH",
    color: "#059669",
    rating: 5,
    text: "Genuinely one of the best UK peptide suppliers I've found. Lab documents available for every single product, no chasing needed. DSIP quality has been consistent across four orders. Highly recommend.",
    peptide: "DSIP",
  },
];

const pillars = [
  {
    num: "01",
    icon: <FlaskConical size={24} />,
    title: "HPLC Verified Purity",
    body: "Every product tested via High-Performance Liquid Chromatography to confirm 99%+ purity before release.",
    color: "#1B5CB5",
    bg: "#EEF4FF",
  },
  {
    num: "02",
    icon: <Award size={24} />,
    title: "Full COA & MS Data",
    body: "Certificates of Analysis, HPLC chromatograms, and ESI-TOF mass spectra available for every product.",
    color: "#059669",
    bg: "#ECFDF5",
  },
  {
    num: "03",
    icon: <Shield size={24} />,
    title: "Research Grade Only",
    body: "All peptides manufactured under strict research-grade conditions for in-vitro research applications only.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    num: "04",
    icon: <Truck size={24} />,
    title: "Fast UK Dispatch",
    body: "Orders placed before noon are dispatched same day in discreet, secure packaging to preserve integrity every step.",
    color: "#0E7490",
    bg: "#ECFEFF",
  },
];

/* ── Molecule decoration SVG ─────────────────────────── */
function MoleculeSVG() {
  return (
    <svg viewBox="0 0 340 340" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      {/* Connecting lines */}
      <line x1="170" y1="170" x2="80"  y2="90"  stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="260" y2="90"  stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="80"  y2="260" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="260" y2="260" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
      <line x1="80"  y1="90"  x2="260" y2="90"  stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
      <line x1="80"  y1="260" x2="260" y2="260" stroke="rgba(255,255,255,0.1)"  strokeWidth="1" />
      <line x1="170" y1="170" x2="170" y2="50"  stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="170" y2="290" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="50"  y2="170" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
      <line x1="170" y1="170" x2="290" y2="170" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />

      {/* Outer nodes */}
      <circle cx="80"  cy="90"  r="14" fill="rgba(147,197,253,0.22)" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" />
      <circle cx="260" cy="90"  r="10" fill="rgba(165,243,252,0.18)" stroke="rgba(165,243,252,0.45)" strokeWidth="1.5" />
      <circle cx="80"  cy="260" r="10" fill="rgba(165,243,252,0.18)" stroke="rgba(165,243,252,0.45)" strokeWidth="1.5" />
      <circle cx="260" cy="260" r="14" fill="rgba(147,197,253,0.22)" stroke="rgba(147,197,253,0.5)" strokeWidth="1.5" />
      <circle cx="170" cy="50"  r="8"  fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)"  strokeWidth="1.5" />
      <circle cx="170" cy="290" r="8"  fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)"  strokeWidth="1.5" />
      <circle cx="50"  cy="170" r="8"  fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)"  strokeWidth="1.5" />
      <circle cx="290" cy="170" r="8"  fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)"  strokeWidth="1.5" />

      {/* Center node */}
      <circle cx="170" cy="170" r="28" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <circle cx="170" cy="170" r="16" fill="rgba(147,197,253,0.3)"  stroke="rgba(147,197,253,0.7)"  strokeWidth="2" />
      <circle cx="170" cy="170" r="6"  fill="rgba(255,255,255,0.9)" />
    </svg>
  );
}

const CARD_W = 360;
const CARD_GAP = 20;

function TestimonialsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  function scrollTo(idx: number) {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, TESTIMONIALS.length - 1));
    setActiveIdx(clamped);
    el.scrollTo({ left: clamped * (CARD_W + CARD_GAP), behavior: "smooth" });
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (CARD_W + CARD_GAP));
    setActiveIdx(Math.max(0, Math.min(idx, TESTIMONIALS.length - 1)));
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => scrollTo(activeIdx - 1)}
        disabled={activeIdx === 0}
        style={{
          position: "absolute", left: "-20px", top: "45%", transform: "translateY(-50%)",
          zIndex: 10, width: "44px", height: "44px", borderRadius: "50%",
          background: activeIdx === 0 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.18)", cursor: activeIdx === 0 ? "default" : "pointer",
          color: activeIdx === 0 ? "rgba(255,255,255,0.25)" : "#fff",
          fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)", transition: "all 0.2s",
        }}
      >‹</button>

      <button
        onClick={() => scrollTo(activeIdx + 1)}
        disabled={activeIdx === TESTIMONIALS.length - 1}
        style={{
          position: "absolute", right: "-20px", top: "45%", transform: "translateY(-50%)",
          zIndex: 10, width: "44px", height: "44px", borderRadius: "50%",
          background: activeIdx === TESTIMONIALS.length - 1 ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.18)", cursor: activeIdx === TESTIMONIALS.length - 1 ? "default" : "pointer",
          color: activeIdx === TESTIMONIALS.length - 1 ? "rgba(255,255,255,0.25)" : "#fff",
          fontSize: "22px", display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(8px)", transition: "all 0.2s",
        }}
      >›</button>

      <div
        ref={scrollRef}
        onScroll={onScroll}
        style={{
          display: "flex", gap: `${CARD_GAP}px`,
          overflowX: "auto", scrollSnapType: "x mandatory",
          paddingBottom: "8px", scrollbarWidth: "none",
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            style={{
              minWidth: `${CARD_W}px`, maxWidth: `${CARD_W}px`,
              scrollSnapAlign: "start",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "20px", padding: "32px",
              backdropFilter: "blur(12px)",
              position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
              flexShrink: 0,
            }}
          >
            <span style={{
              position: "absolute", top: "10px", right: "18px",
              fontSize: "88px", lineHeight: 1, fontFamily: "Georgia, serif",
              color: "#F59E0B", opacity: 0.12, fontWeight: 900, userSelect: "none",
            }}>"</span>

            <div style={{ display: "flex", gap: "2px", marginBottom: "18px" }}>
              {Array.from({ length: t.rating }).map((_, s) => (
                <Star key={s} size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
              ))}
            </div>

            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.82)", lineHeight: 1.8, flex: 1, marginBottom: "22px" }}>
              "{t.text}"
            </p>

            <div style={{ marginBottom: "16px" }}>
              <span style={{
                fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em",
                color: "#F59E0B", backgroundColor: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.3)",
                padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase",
              }}>{t.peptide}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
              <div style={{
                width: "40px", height: "40px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "12px", fontWeight: 800, color: "#fff", flexShrink: 0,
                boxShadow: `0 4px 12px ${t.color}55`,
              }}>{t.avatar}</div>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 700, color: "#fff" }}>{t.name}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>Verified Customer</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "7px", marginTop: "24px" }}>
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            style={{
              width: activeIdx === i ? "24px" : "8px",
              height: "8px", borderRadius: "4px",
              background: activeIdx === i ? "#F59E0B" : "rgba(255,255,255,0.25)",
              border: "none", cursor: "pointer", padding: 0,
              transition: "all 0.25s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { products } = useProducts();
  useSEO({
    title: "HPLC-Verified Research Peptides",
    description: "Buy high-purity research peptides verified by HPLC to 99%+. BPC-157, TB-500, Semaglutide, Tirzepatide, Epithalon and 100+ peptides. Worldwide shipping from OmniQure.",
    canonicalPath: "/",
  });

  const featuredGroups = (() => {
    const featuredProducts = featuredIds
      .map(id => products.find(p => p.id === id))
      .filter(Boolean) as typeof products;
    const allGroups = groupProducts(products);
    return featuredProducts
      .map(p => allGroups.find(g => g.baseName === parseName(p.name).baseName))
      .filter((g): g is NonNullable<typeof g> => g != null)
      .filter((g, i, arr) => arr.findIndex(x => x.baseName === g.baseName) === i);
  })();

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        className="hero-section"
        style={{
          position: "relative",
          overflow: "hidden",
          backgroundImage: "url('/hero-vials.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          minHeight: "unset",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {/* Bottom fade so text remains readable against the light product image */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(2,11,30,0.0) 0%, rgba(2,11,30,0.0) 35%, rgba(2,11,30,0.45) 60%, rgba(2,11,30,0.60) 100%)",
          pointerEvents: "none",
        }} />
        {/* Left-to-right overlay — full dark on mobile, fades right on desktop */}
        <div className="hero-overlay-lr" style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }} />
        {/* Subtle blue glow behind the logo (top-left) */}
        <div style={{
          position: "absolute",
          top: "-80px",
          left: "-80px",
          width: "800px",
          height: "560px",
          background: "radial-gradient(ellipse at 35% 38%, rgba(40,120,255,0.18) 0%, rgba(20,80,230,0.10) 30%, rgba(10,50,180,0.04) 55%, rgba(0,0,0,0.0) 75%)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }} />

        {/* Content — below the logo in the image */}
        <div className="hero-content max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 w-full" style={{ position: "relative", zIndex: 1 }}>

          <div className="hero-text text-white">

            <h1
              className="font-bold mb-5"
              style={{
                fontSize: "clamp(28px, 7vw, 62px)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              Research-Grade<br />
              Peptides.<br />
              <span className="gradient-text">Third Party Verified.</span>
            </h1>

            <p
              className="mb-7 leading-relaxed"
              style={{ color: "rgba(255,255,255,0.78)", fontSize: "16px" }}
            >
              Built for researchers who don't cut corners.<br />
              Every compound is independently tested to 99%+ purity,<br />
              fully documented, and ready for the lab.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["99%+ HPLC Purity", "Full COA Included", "Third Party Tested"].map(t => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#E2E8F0",
                    fontSize: "12px",
                    fontWeight: 600,
                    padding: "5px 12px",
                    borderRadius: "20px",
                    backdropFilter: "blur(6px)",
                  }}
                >
                  <CheckCircle size={12} style={{ color: "#34D399" }} />
                  {t}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/all-peptides"
                className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{
                  backgroundColor: "#fff",
                  color: "#1240A0",
                  padding: "13px 26px",
                  borderRadius: "12px",
                  fontWeight: 800,
                  fontSize: "14px",
                  textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                }}
              >
                Browse All 81 Peptides <ArrowRight size={15} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── BUNDLE & SAVE STRIP ────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}>
        <div className="max-w-[1280px] mx-auto px-4 py-4">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px", justifyContent: "space-between" }}>
            {/* Left label */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <div style={{ backgroundColor: "#34D399", borderRadius: "6px", padding: "3px 9px" }}>
                <span style={{ fontSize: "10px", fontWeight: 900, letterSpacing: "0.1em", color: "#022c22", textTransform: "uppercase" }}>Bundle & Save</span>
              </div>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.80)", fontWeight: 600 }}>The more you order, the more you save</span>
            </div>
            {/* Tiers + CTA */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", alignItems: "center" }}>
              {[
                { label: "3+ vials",  pct: "5%",  bg: "rgba(96,165,250,0.18)",  border: "rgba(96,165,250,0.40)",  pctColor: "#93C5FD" },
                { label: "7+ vials",  pct: "10%", bg: "rgba(52,211,153,0.18)",  border: "rgba(52,211,153,0.40)",  pctColor: "#6EE7B7" },
                { label: "11+ vials", pct: "15%", bg: "rgba(251,191,36,0.18)",  border: "rgba(251,191,36,0.40)",  pctColor: "#FDE68A" },
                { label: "15+ vials", pct: "20%", bg: "rgba(167,139,250,0.18)", border: "rgba(167,139,250,0.40)", pctColor: "#C4B5FD" },
              ].map(t => (
                <div key={t.label} style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: "8px", padding: "6px 13px" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{t.label}</span>
                  <span style={{ fontSize: "15px", fontWeight: 900, color: t.pctColor, lineHeight: 1 }}>{t.pct}</span>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.45)", fontWeight: 700 }}>OFF</span>
                </div>
              ))}
              <Link
                href="/bundles"
                style={{ fontSize: "12.5px", fontWeight: 800, color: "#022c22", backgroundColor: "#34D399", padding: "7px 18px", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 2px 8px rgba(52,211,153,0.25)" }}
              >
                Build a Bundle →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", borderBottom: "1px solid #EEF2F7" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#EEF2F7]">
            {[
              { icon: <FlaskConical size={20} />, title: "99%+ HPLC Purity",    sub: "Guaranteed on every product",     color: "#1B5CB5", bg: "#EEF4FF" },
              { icon: <Award size={20} />,        title: "Full COA & MS Data",   sub: "Chromatogram + mass spectrum",    color: "#059669", bg: "#ECFDF5" },
              { icon: <Shield size={20} />,       title: "Research Grade",       sub: "For qualified researchers only",  color: "#7C3AED", bg: "#F5F3FF" },
              { icon: <Truck size={20} />,        title: "Free Shipping £100+",  sub: "Discreet packaging included",     color: "#0E7490", bg: "#ECFEFF" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 py-5 px-5"
              >
                <div
                  className="flex-shrink-0 rounded-xl flex items-center justify-center"
                  style={{ width: "44px", height: "44px", backgroundColor: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold" style={{ fontSize: "13px", color: "#0F172A" }}>{item.title}</p>
                  <p style={{ fontSize: "11.5px", color: "#64748B", marginTop: "1px" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PEPTIDES ─────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", padding: "68px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div style={{ width: "3px", height: "16px", background: "linear-gradient(180deg, #059669, #34D399)", borderRadius: "2px" }} />
                <p className="font-bold uppercase tracking-widest" style={{ fontSize: "11px", color: "#059669", letterSpacing: "0.1em" }}>
                  MOST RESEARCHED
                </p>
              </div>
              <h2 className="font-bold" style={{ fontSize: "30px", color: "#0F172A", letterSpacing: "-0.02em" }}>
                Featured Peptides
              </h2>
              <p style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
                Our most popular research compounds, all HPLC verified
              </p>
            </div>
            <Link
              href="/popular-peptides"
              className="hidden sm:flex items-center gap-1.5 font-semibold"
              style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
            >
              View popular collection <ChevronRight size={15} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 sm:gap-x-12 sm:gap-y-24 md:gap-x-14 md:gap-y-28">
            {featuredGroups.slice(0, 4).map(group => (
              <GroupedProductCard key={group.baseName} group={group} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        padding: "80px 0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Dot grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "32px 32px", pointerEvents: "none",
        }} />
        {/* Glow blobs */}
        <div style={{ position: "absolute", top: "-100px", left: "10%", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", right: "8%", width: "360px", height: "360px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.10) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="max-w-[1280px] mx-auto px-4" style={{ position: "relative", zIndex: 1 }}>

          {/* Header */}
          <div className="text-center mb-14">
            {/* Stars row */}
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(s => <Star key={s} size={22} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
            </div>
            <h2 className="font-bold" style={{ fontSize: "clamp(28px,4vw,42px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "10px" }}>
              What Our Customers Say
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
              Real reviews from verified OmniQure customers.
            </p>
          </div>

          {/* ── Carousel ── */}
          <TestimonialsCarousel />

          {/* Rating bar */}
          <div style={{
            marginTop: "48px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.10)",
            borderRadius: "16px",
            padding: "28px 40px",
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "40px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <span style={{ fontSize: "56px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>4.9</span>
              <div>
                <div className="flex gap-0.5 mb-1">
                  {[1,2,3,4,5].map(s => <Star key={s} size={18} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
                </div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontWeight: 600 }}>Average customer rating</p>
              </div>
            </div>
            <div style={{ width: "1px", height: "52px", backgroundColor: "rgba(255,255,255,0.1)" }} className="hidden sm:block" />
            {[
              { num: "500+", label: "Orders Fulfilled" },
              { num: "47",   label: "Unique Compounds" },
              { num: "99%+", label: "Avg. HPLC Purity" },
            ].map((stat, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "26px", fontWeight: 900, color: "#F59E0B", lineHeight: 1 }}>{stat.num}</p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.45)", fontWeight: 600, marginTop: "4px" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OMNIQURE ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", padding: "68px 0", borderTop: "1px solid #E2E8F0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-2">
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #7C3AED, #A78BFA)", borderRadius: "2px" }} />
              <p className="font-bold uppercase tracking-widest" style={{ fontSize: "11px", color: "#7C3AED", letterSpacing: "0.1em" }}>
                OUR COMMITMENT
              </p>
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #A78BFA, #7C3AED)", borderRadius: "2px" }} />
            </div>
            <h2 className="font-bold" style={{ fontSize: "30px", color: "#0F172A", letterSpacing: "-0.02em" }}>
              Why Choose OmniQure?
            </h2>
            <p style={{ fontSize: "15px", color: "#64748B", maxWidth: "520px", margin: "8px auto 0", lineHeight: 1.7 }}>
              Every peptide we supply meets the highest standards in research-grade manufacturing, analytical verification, and quality-assured dispatch.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-7">
            {pillars.map((p, i) => (
              <div
                key={i}
                className="rounded-2xl relative overflow-hidden"
                style={{
                  backgroundColor: "#fff",
                  border: "1.5px solid #E8EDF5",
                  padding: "0",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${p.color}18`;
                  (e.currentTarget as HTMLElement).style.borderColor = p.color + "44";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(15,23,42,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E8EDF5";
                }}
              >
                {/* Gradient top accent */}
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${p.color}, ${p.color}66)`, borderRadius: "12px 12px 0 0" }} />
                <div style={{ padding: "26px 22px 22px" }}>
                  {/* Number accent */}
                  <span
                    style={{
                      position: "absolute",
                      top: "18px",
                      right: "18px",
                      fontSize: "42px",
                      fontWeight: 900,
                      color: "#F1F5F9",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      userSelect: "none",
                    }}
                  >
                    {p.num}
                  </span>

                  <div
                    className="flex items-center justify-center rounded-xl mb-4"
                    style={{ width: "50px", height: "50px", backgroundColor: p.bg, color: p.color }}
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-bold mb-2" style={{ fontSize: "15px", color: "#0F172A" }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.65 }}>{p.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEARCH AREAS ────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", borderTop: "3px solid #34D399" }}>
        {/* ── Header strip ── */}
        <div style={{ padding: "64px 0 48px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="max-w-[1280px] mx-auto" style={{ padding: "0 32px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
            {/* Left */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
                <div style={{ width: 32, height: 1, background: "linear-gradient(90deg, #60A5FA, #93C5FD)" }} />
                <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.28em", color: "#93C5FD", margin: 0, opacity: 0.7 }}>Research Applications</p>
              </div>
              <h2 style={{ fontSize: "clamp(32px, 4.5vw, 56px)", fontWeight: 900, lineHeight: 1.04, letterSpacing: "-0.03em", color: "#FFFFFF", margin: 0 }}>
                What peptides<br />
                <span style={{ background: "linear-gradient(90deg, #60A5FA, #93C5FD)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  are used for.
                </span>
              </h2>
            </div>
            {/* Right */}
            <div style={{ maxWidth: 380 }}>
              <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.60)", lineHeight: 1.78, marginBottom: 24 }}>
                Each category below represents an active area of peptide investigation — from cellular repair mechanisms to longevity pathways. Hover any card to see which specific compounds are under study.
              </p>
              <Link
                href="/all-peptides"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.16em", color: "#93C5FD", textDecoration: "none",
                }}
              >
                Browse All Compounds <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Uniform 4×2 grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 1, background: "rgba(255,255,255,0.06)" }}>
          {RESEARCH_AREAS.map(area => (
            <ResearchAreaCard key={area.n} {...area} />
          ))}
        </div>

        {/* ── Bottom CTA strip ── */}
        <div style={{ padding: "28px 32px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div className="max-w-[1280px] mx-auto w-full" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: 0, letterSpacing: "0.02em" }}>
              All research applications listed for <strong style={{ color: "rgba(255,255,255,0.6)" }}>in-vitro laboratory use only</strong> — not for human consumption.
            </p>
            <Link
              href="/all-peptides"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.3)",
                color: "#93C5FD", padding: "10px 22px", borderRadius: 8,
                fontSize: 12, fontWeight: 700, textTransform: "uppercase",
                letterSpacing: "0.14em", textDecoration: "none",
              }}
            >
              Shop All 81 Peptides <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>


      {/* ── DISCLAIMER ────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F7FAFF", borderTop: "1px solid #E8EDF5", padding: "20px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <p className="text-center" style={{ fontSize: "11.5px", color: "#94A3B8", lineHeight: 1.7 }}>
            <strong style={{ color: "#64748B" }}>Research Use Only.</strong>{" "}
            All products are intended strictly for in-vitro laboratory research. Not approved by the FDA. Not for human or animal use. Must be 18+ and a qualified researcher to purchase.
          </p>
        </div>
      </section>

    </div>
  );
}
