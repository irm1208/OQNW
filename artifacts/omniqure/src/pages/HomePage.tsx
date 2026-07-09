import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  Shield, FlaskConical, Truck, Award,
  ChevronRight, ArrowRight, CheckCircle, Star, Quote,
  Mail, Gift, UserPlus, ShoppingCart,
} from "lucide-react";
import GroupedProductCard from "@/components/GroupedProductCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import { useCurrency } from "@/context/CurrencyContext";
import type { CurrencyCode } from "@/context/CurrencyContext";
import referAFriendHeroImg from "@assets/download_(7)_1783533485035.jpeg";
import bundleAndSaveHeroImg from "@assets/new_hero_1783533143502.jpeg";

const FREE_PEPTIDE_VALUE: Record<CurrencyCode, string> = {
  GBP: "£50", USD: "$65", EUR: "€60", AUD: "A$100", CAD: "C$90",
  CHF: "Fr57", NZD: "NZ$110", JPY: "¥10,000", SGD: "S$85", HKD: "HK$510",
  KRW: "₩88,000", TWD: "NT$2,050", MYR: "RM295", THB: "฿2,200",
  DKK: "kr450", NOK: "kr690", SEK: "kr680", PLN: "zł250",
  CZK: "Kč1,450", HUF: "Ft22,000", AED: "د.إ240",
};

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
    name: "Tom Reynolds",
    avatar: "TR",
    color: "#1B5CB5",
    rating: 5,
    text: "Been running BPC for about 4 months now and noticed a real difference with an old shoulder injury that just wouldn't shift. Delivery was faster than expected and everything arrived in great condition. Will definitely be reordering.",
    peptide: "BPC-157",
  },
  {
    name: "Jamie Kirkwood",
    avatar: "JK",
    color: "#059669",
    rating: 5,
    text: "Tried a few different places before this and the experience here is on a different level. The epi arrived in perfect condition and I genuinely felt the effects within the first couple of weeks. Customer service were spot on too.",
    peptide: "Epithalon",
  },
  {
    name: "Chris Mitchell",
    avatar: "CM",
    color: "#7C3AED",
    rating: 5,
    text: "Fast delivery and the ipa has been solid across three separate orders. When I had a question the team replied quickly and were really helpful. Nice to find somewhere consistent you can rely on.",
    peptide: "Ipamorelin",
  },
  {
    name: "Dan Whitmore",
    avatar: "DW",
    color: "#0E7490",
    rating: 5,
    text: "Ordered TB and GHK together. Both arrived well packaged and I've been happy with the results from both. Had a slight delay once and support sorted it out immediately. Really solid experience overall.",
    peptide: "TB-500 + GHK-Cu",
  },
  {
    name: "Sarah Lawson",
    avatar: "SL",
    color: "#B45309",
    rating: 5,
    text: "Reta arrived quickly and everything was well packaged. Support replied within the hour when I had a query. The whole experience from ordering to delivery was seamless. 10/10.",
    peptide: "Retatrutide",
  },
  {
    name: "Mohammed Aziz",
    avatar: "MA",
    color: "#1B5CB5",
    rating: 5,
    text: "Ordered tesa twice now. Delivery has been fast both times and the vials arrived perfectly sealed. Really pleased with the results I've been getting and the ordering process is simple and straightforward.",
    peptide: "Tesamorelin",
  },
  {
    name: "Zara Bennett",
    avatar: "ZB",
    color: "#059669",
    rating: 5,
    text: "GHK has been brilliant for my skin and recovery. I was a bit hesitant at first but the whole process was easy and the product worked exactly as I hoped. Already recommended it to a few people.",
    peptide: "GHK-Cu",
  },
  {
    name: "Harpreet Singh",
    avatar: "HS",
    color: "#7C3AED",
    rating: 5,
    text: "Third order of BPC now and still very happy. Quick dispatch every time and everything always arrives in perfect condition. Results have been consistent and I genuinely wouldn't go anywhere else.",
    peptide: "BPC-157",
  },
  {
    name: "Tariq Nasser",
    avatar: "TN",
    color: "#0E7490",
    rating: 5,
    text: "Placed my first order a bit nervous but everything went smoothly. Selank arrived well packaged and I started noticing the effects within the first few weeks. The customer service team were great when I reached out with questions.",
    peptide: "Selank",
  },
  {
    name: "Gurpreet Dhaliwal",
    avatar: "GD",
    color: "#B45309",
    rating: 5,
    text: "Fast shipping and the reta has been performing really well for me. Had a query and the team replied the same day. Exactly the kind of service that keeps me coming back.",
    peptide: "Retatrutide",
  },
  {
    name: "Priya Mehta",
    avatar: "PM",
    color: "#1B5CB5",
    rating: 5,
    text: "Been ordering CJC regularly for about six months now. Every order arrives on time, well packaged, and I've been really happy with the results. Easy checkout and delivery is always fast.",
    peptide: "CJC-1295 No DAC",
  },
  {
    name: "Amir Hassan",
    avatar: "AH",
    color: "#059669",
    rating: 5,
    text: "DSIP has been a game changer for my sleep quality. Four orders in and never had a single issue. The service is reliable, delivery is quick, and any time I've had a question I've had a response within hours.",
    peptide: "DSIP",
  },
  {
    name: "Emma Taylor",
    avatar: "ET",
    color: "#7C3AED",
    rating: 5,
    text: "I was hesitant to try peptides but the whole experience made it easy. The epi arrived quickly and in great condition. I've noticed a real improvement in how I feel day to day. Will absolutely be ordering again.",
    peptide: "Epithalon",
  },
  {
    name: "Charlotte Barnes",
    avatar: "CB",
    color: "#0E7490",
    rating: 5,
    text: "Really impressed with the speed of delivery and how well everything was packed. TB has made a noticeable difference after a ligament issue I'd been struggling with. The support team were helpful when I had questions before ordering.",
    peptide: "TB-500",
  },
  {
    name: "James O'Brien",
    avatar: "JO",
    color: "#B45309",
    rating: 5,
    text: "Ordered tirz and the whole process was dead easy. Arrived in a couple of days, packaged well, and I've been seeing good results. Customer service answered my pre-order question within an hour. Top service.",
    peptide: "Tirzepatide",
  },
  {
    name: "Rebecca Hughes",
    avatar: "RH",
    color: "#1B5CB5",
    rating: 5,
    text: "GHK is something I now order every month without fail. The results speak for themselves and the service has been consistently great. Delivery is always fast and I've never had an issue with packaging.",
    peptide: "GHK-Cu",
  },
];

const pillars = [
  {
    num: "01",
    icon: <FlaskConical size={24} />,
    title: "Independently Verified Purity",
    body: "Every product independently tested to confirm 99%+ purity before release.",
    color: "#1B5CB5",
    bg: "#EEF4FF",
  },
  {
    num: "02",
    icon: <Award size={24} />,
    title: "Full COA Data",
    body: "Certificates of Analysis available for every product.",
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

/* ── Hero Carousel ─────────────────────────────────────── */
function HeroContentSlide() {
  return (
    <section
      className="hero-section"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(to bottom, #A7C6E7, #91AED1)",
        minHeight: "unset",
        display: "flex",
        alignItems: "flex-end",
        height: "100%",
      }}
    >
      {/* Background photo — object-fit: contain so the full ultra-wide (21:9)
          image is always visible and never gets cropped/zoomed on narrower,
          taller carousel boxes (e.g. mobile), matching the other slides. */}
      <img
        src="/hero-vials-2.jpeg"
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
        }}
      />

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

    </section>
  );
}

function HeroReferralSlide() {
  return (
    <Link
      href="/refer-a-friend"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, #E8EFF7, #F3F7FC)",
      }}
    >
      <img
        src={referAFriendHeroImg}
        alt="Refer a friend and earn a free peptide worth up to £50"
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
    </Link>
  );
}

function HeroBundleSlide() {
  return (
    <Link
      href="/bundle-and-save"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, #DBDFEB, #EAECF6)",
      }}
    >
      <img
        src={bundleAndSaveHeroImg}
        alt="Bundle and Save exclusive offers — free BAC water on 3+ peptides, 1 peptide free on 5+ peptides, 2 peptides free on 10+ peptides"
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
    </Link>
  );
}

const HERO_AUTOPLAY_MS = 6500;

function HeroCarousel() {
  const slides = [
    { key: "content", render: () => <HeroContentSlide /> },
    { key: "referral", render: () => <HeroReferralSlide /> },
    { key: "bundle", render: () => <HeroBundleSlide /> },
  ];
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % slides.length), HERO_AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [slides.length]);

  function goTo(i: number) {
    setIdx(((i % slides.length) + slides.length) % slides.length);
  }

  return (
    <div className="hero-carousel" style={{ position: "relative", overflow: "hidden", width: "100%", aspectRatio: "6336 / 2688" }}>

      {slides.map((s, i) => (
        <div
          key={s.key}
          style={{
            position: "absolute",
            inset: 0,
            opacity: idx === i ? 1 : 0,
            transition: "opacity 0.8s ease",
            pointerEvents: idx === i ? "auto" : "none",
            zIndex: idx === i ? 1 : 0,
          }}
        >
          {s.render()}
        </div>
      ))}

      {/* Dots — kept clear of the bottom-anchored CTA button with extra offset */}
      <div className="hero-carousel-dots" style={{ position: "absolute", bottom: "14px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "8px", zIndex: 5, pointerEvents: "none" }}>
        {slides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            style={{
              width: idx === i ? "22px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: idx === i ? "#fff" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.25s",
              padding: 0,
              pointerEvents: "auto",
              boxShadow: "0 1px 3px rgba(0,0,0,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

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

const CARD_GAP = 16;

function useCardWidth() {
  const [w, setW] = useState(() => {
    if (typeof window === "undefined") return 380;
    const vw = window.innerWidth;
    // Mobile: one full card; desktop: exactly 2 full cards with 3rd peeking
    if (vw < 640) return Math.min(300, vw - 48);
    return 580;
  });
  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setW(vw < 640 ? Math.min(300, vw - 48) : 580);
    };
    window.addEventListener("resize", update, { passive: true });
    return () => window.removeEventListener("resize", update);
  }, []);
  return w;
}

function TestimonialsCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const cardW = useCardWidth();

  function scrollTo(idx: number) {
    const el = scrollRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(idx, TESTIMONIALS.length - 1));
    setActiveIdx(clamped);
    el.scrollTo({ left: clamped * (cardW + CARD_GAP), behavior: "smooth" });
  }

  function onScroll() {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / (cardW + CARD_GAP));
    setActiveIdx(Math.max(0, Math.min(idx, TESTIMONIALS.length - 1)));
  }

  return (
    <div style={{ position: "relative" }}>
      <button
        className="testimonial-nav-btn"
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
        className="testimonial-nav-btn"
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
          paddingLeft: "4px", paddingRight: "4px",
        }}
      >
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            className="testimonial-card"
            style={{
              minWidth: `${cardW}px`, maxWidth: `${cardW}px`,
              scrollSnapAlign: "start",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: "16px", padding: "22px",
              backdropFilter: "blur(12px)",
              position: "relative", overflow: "hidden",
              display: "flex", flexDirection: "column",
              boxShadow: "0 6px 24px rgba(0,0,0,0.22)",
              flexShrink: 0,
            }}
          >
            <span style={{
              position: "absolute", top: "6px", right: "14px",
              fontSize: "60px", lineHeight: 1, fontFamily: "Georgia, serif",
              color: "#F59E0B", opacity: 0.12, fontWeight: 900, userSelect: "none",
            }}>"</span>

            <div style={{ display: "flex", gap: "2px", marginBottom: "12px" }}>
              {Array.from({ length: t.rating }).map((_, s) => (
                <Star key={s} size={12} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
              ))}
            </div>

            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, flex: 1, marginBottom: "14px" }}>
              "{t.text}"
            </p>

            <div style={{ marginBottom: "12px" }}>
              <span style={{
                fontSize: "9px", fontWeight: 800, letterSpacing: "0.08em",
                color: "#F59E0B", backgroundColor: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.3)",
                padding: "2px 8px", borderRadius: "20px", textTransform: "uppercase",
              }}>{t.peptide}</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px" }}>
              <div style={{
                width: "34px", height: "34px", borderRadius: "50%",
                background: `linear-gradient(135deg, ${t.color}, ${t.color}99)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 800, color: "#fff", flexShrink: 0,
                boxShadow: `0 3px 10px ${t.color}55`,
              }}>{t.avatar}</div>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>{t.name}</p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", marginTop: "1px" }}>Verified Customer</p>
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
  const { currency } = useCurrency();
  const localValue = FREE_PEPTIDE_VALUE[currency.code] ?? FREE_PEPTIDE_VALUE.GBP;
  useSEO({
    title: "Independently Verified Research Peptides",
    description: "Buy high-purity research peptides independently verified to 99%+. BPC-157, TB-500, Semaglutide, Tirzepatide, Epithalon and 100+ peptides. Worldwide shipping from OmniQure.",
    canonicalPath: "/",
  });

  const [emailInput, setEmailInput] = useState("");
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emailInput.includes("@")) setEmailSubscribed(true);
  }

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

      {/* ── HERO CAROUSEL ─────────────────────────────────────── */}
      <HeroCarousel />

      {/* ── TRUST STRIP ───────────────────────────────────────── */}
      <section style={{ backgroundColor: "#fff", borderBottom: "1px solid #EEF2F7" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[#EEF2F7]">
            {[
              { icon: <FlaskConical size={20} />, title: "99%+ Verified Purity", sub: "Guaranteed on every product",     color: "#1B5CB5", bg: "#EEF4FF" },
              { icon: <Award size={20} />,        title: "Full COA Data",        sub: "Independent purity report",       color: "#059669", bg: "#ECFDF5" },
              { icon: <Shield size={20} />,       title: "Research Grade",       sub: "For qualified researchers only",  color: "#7C3AED", bg: "#F5F3FF" },
              { icon: <Truck size={20} />,        title: "Free Shipping £100+",  sub: "Discreet packaging included",     color: "#0E7490", bg: "#ECFEFF" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 py-5 px-5 trust-strip-cell"
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
                { label: "3-4 vials", freebie: "Free BAC Water",   bg: "rgba(96,165,250,0.18)",  border: "rgba(96,165,250,0.40)",  color: "#93C5FD" },
                { label: "5-9 vials", freebie: "1 Peptide Free",   bg: "rgba(52,211,153,0.18)",  border: "rgba(52,211,153,0.40)",  color: "#6EE7B7" },
                { label: "10+ vials", freebie: "2 Peptides Free",  bg: "rgba(167,139,250,0.18)", border: "rgba(167,139,250,0.40)", color: "#C4B5FD" },
              ].map(t => (
                <div key={t.label} className="bundle-tier-badge" style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: t.bg, border: `1px solid ${t.border}`, borderRadius: "8px", padding: "6px 13px" }}>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>{t.label}</span>
                  <span style={{ fontSize: "13px", fontWeight: 900, color: t.color, lineHeight: 1 }}>{t.freebie}</span>
                </div>
              ))}
              <Link
                href="/all-peptides"
                style={{ fontSize: "12.5px", fontWeight: 800, color: "#022c22", backgroundColor: "#34D399", padding: "7px 18px", borderRadius: "8px", textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0, boxShadow: "0 2px 8px rgba(52,211,153,0.25)" }}
              >
                Build a Bundle →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHOP BY GOAL ──────────────────────────────────────── */}
      <section className="home-section-goal" style={{ backgroundColor: "#fff", borderBottom: "1px solid #EEF2F7", padding: "56px 0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="home-section-goal-header text-center mb-10">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 16, height: 3, background: "linear-gradient(90deg, #1B5CB5, #60A5FA)", borderRadius: 2 }} />
              <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: "#1B5CB5", margin: 0 }}>Find Your Compounds</p>
              <div style={{ width: 16, height: 3, background: "linear-gradient(90deg, #60A5FA, #1B5CB5)", borderRadius: 2 }} />
            </div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em", marginBottom: 6 }}>Shop by research goal.</h2>
            <p style={{ fontSize: 14, color: "#64748B", maxWidth: 440, margin: "0 auto" }}>Not sure where to start? Pick your area of interest and browse the relevant compounds directly.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { emoji: "🩹", label: "Recovery & Healing",  sub: "BPC-157 · TB-500",           href: "/all-peptides?category=Healing+Peptides"  },
              { emoji: "🧠", label: "Cognitive & Brain",   sub: "Semax · Selank · P21",        href: "/all-peptides?category=Nootropics"         },
              { emoji: "⚖️", label: "Weight Management",   sub: "Tirzepatide · Retatrutide",   href: "/all-peptides?category=Weight+Management"  },
              { emoji: "💪", label: "Growth Hormone",      sub: "CJC-1295 · Ipamorelin",       href: "/all-peptides?category=Growth+Peptides"    },
              { emoji: "🌿", label: "Longevity",           sub: "Epithalon · SS-31 · MOTS-C",  href: "/all-peptides?category=Longevity+Peptides" },
              { emoji: "✨", label: "Skin & Collagen",     sub: "GHK-Cu",                      href: "/all-peptides?category=Skin+%26+Hair"      },
            ].map((g, i) => (
              <Link key={i} href={g.href} style={{ textDecoration: "none" }}>
                <div
                  style={{ background: "linear-gradient(135deg, #0D2565 0%, #1240A0 50%, #1B5CB5 100%)", border: "1.5px solid rgba(255,255,255,0.10)", borderRadius: 16, padding: "20px 14px", textAlign: "center", cursor: "pointer", transition: "transform 0.18s, box-shadow 0.18s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(13,37,101,0.40)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div style={{ fontSize: 30, marginBottom: 10, lineHeight: 1 }}>{g.emoji}</div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: "#fff", marginBottom: 4, lineHeight: 1.2 }}>{g.label}</p>
                  <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{g.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PEPTIDES ─────────────────────────────────── */}
      <section className="home-section-featured" style={{ backgroundColor: "#fff", padding: "68px 0" }}>
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
                Our most popular research compounds, all independently verified
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

          <div className="featured-grid grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 sm:gap-x-12 sm:gap-y-24 md:gap-x-14 md:gap-y-28">
            {featuredGroups.slice(0, 4).map(group => (
              <GroupedProductCard key={group.baseName} group={group} />
            ))}
          </div>
        </div>
      </section>

      {/* ── RESEARCH AREAS ────────────────────────────────────── */}
      <section style={{ background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)", borderTop: "3px solid #34D399" }}>
        {/* ── Header strip ── */}
        <div className="research-header" style={{ padding: "64px 0 48px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div className="max-w-[1280px] mx-auto px-4 lg:px-8" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
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
        <div className="research-cta-strip" style={{ padding: "28px 32px", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
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

      {/* ── WHY OMNIQURE ──────────────────────────────────────── */}
      <section className="home-section-why home-section-pillars" style={{ backgroundColor: "#F7FAFF", padding: "68px 0", borderTop: "1px solid #E2E8F0" }}>
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="home-section-pillars-header text-center mb-12">
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

      {/* ── TESTIMONIALS ──────────────────────────────────────── */}
      <div className="home-spacer-32" style={{ height: 32, background: "#fff" }} />
      <section className="home-section-testimonials" style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        padding: "56px 0",
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
          <div className="testimonial-section-header text-center mb-14">
            {/* Stars row */}
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(s => <Star key={s} size={22} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
            </div>
            <h2 className="font-bold" style={{ fontSize: "clamp(22px,4vw,42px)", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: "10px" }}>
              What Our Customers Say
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7 }}>
              Real reviews from verified OmniQure customers.
            </p>
          </div>

          {/* ── Carousel ── */}
          <TestimonialsCarousel />

          {/* Rating bar */}
          <div className="testimonial-rating-bar" style={{
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
              { num: "99%+", label: "Avg. Verified Purity" },
            ].map((stat, i) => (
              <div key={i} className="rating-bar-stat" style={{ textAlign: "center" }}>
                <p style={{ fontSize: "26px", fontWeight: 900, color: "#F59E0B", lineHeight: 1 }}>{stat.num}</p>
                <p style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.45)", fontWeight: 600, marginTop: "4px" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REFER A FRIEND ────────────────────────────────────── */}
      <section className="home-section-refer" style={{ backgroundColor: "#fff", padding: "68px 0", borderTop: "1px solid #E8EDF5" }}>
        <div className="max-w-[1280px] mx-auto px-4">

          {/* Section header */}
          <div className="home-section-refer-header text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-2">
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #F59E0B, #FCD34D)", borderRadius: "2px" }} />
              <p className="font-bold uppercase tracking-widest" style={{ fontSize: "11px", color: "#B45309", letterSpacing: "0.1em" }}>
                REFERRAL PROGRAMME
              </p>
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #FCD34D, #F59E0B)", borderRadius: "2px" }} />
            </div>
            <h2 className="font-bold" style={{ fontSize: "clamp(22px,3vw,32px)", color: "#0F172A", letterSpacing: "-0.02em", marginBottom: "8px" }}>
              Refer a Friend, Earn a Free Peptide
            </h2>
            <p style={{ fontSize: "15px", color: "#64748B", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              Share your unique referral link. They get <strong style={{ color: "#0F172A" }}>10% off their first order</strong>. On your next peptide order, add <strong style={{ color: "#0F172A" }}>1 free peptide worth up to {localValue}</strong>.
            </p>
          </div>

          {/* Steps */}
          <div className="refer-steps-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              {
                icon: <UserPlus size={26} />,
                step: "01",
                title: "Share Your Link",
                body: "Log in to your account and copy your personal referral link. Share it with fellow researchers via email, message, or social.",
                color: "#1B5CB5",
                bg: "#EEF4FF",
              },
              {
                icon: <ShoppingCart size={26} />,
                step: "02",
                title: "Friend Places an Order",
                body: "Your friend signs up using your link and places their first order with OmniQure. That's all they need to do.",
                color: "#059669",
                bg: "#ECFDF5",
              },
              {
                icon: <Gift size={26} />,
                step: "03",
                title: "Claim on Your Next Order",
                body: `When you next place a peptide order, add 1 free peptide worth up to ${localValue} to that order. Your friend keeps their 10% discount — everyone wins.`,
                color: "#B45309",
                bg: "#FEF3C7",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="refer-step-card"
                style={{
                  background: "#fff",
                  border: "1.5px solid #E8EDF5",
                  borderRadius: "20px",
                  padding: "32px 28px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(15,23,42,0.04)",
                  transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${s.color}18`;
                  (e.currentTarget as HTMLElement).style.borderColor = s.color + "44";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 12px rgba(15,23,42,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "#E8EDF5";
                }}
              >
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${s.color}, ${s.color}66)`, borderRadius: "12px 12px 0 0", position: "absolute", top: 0, left: 0, right: 0 }} />
                <span style={{ position: "absolute", top: "16px", right: "20px", fontSize: "48px", fontWeight: 900, color: "#F1F5F9", lineHeight: 1, userSelect: "none", letterSpacing: "-0.04em" }}>{s.step}</span>
                <div style={{ width: "56px", height: "56px", borderRadius: "14px", backgroundColor: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A", marginBottom: "10px" }}>{s.title}</h3>
                <p style={{ fontSize: "13.5px", color: "#64748B", lineHeight: 1.7, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <div className="refer-cta-banner" style={{
            background: "linear-gradient(135deg, #0D2565 0%, #1240A0 50%, #1B5CB5 100%)",
            borderRadius: "20px",
            padding: "36px 40px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: "-60px", right: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Gift size={18} style={{ color: "#F59E0B" }} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F59E0B" }}>Start Earning Today</span>
              </div>
              <h3 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 8px" }}>
                Every referral adds 1 free peptide (up to {localValue}) to your next order.
              </h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)", margin: 0, lineHeight: 1.6 }}>
                Refer a friend, they get 10% off their first order. Place your next peptide order and claim your free peptide — no limit on referrals, rewards valid for 12 months.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", position: "relative", zIndex: 1 }}>
              <Link
                href="/refer-a-friend"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#F59E0B", color: "#000", padding: "13px 26px", borderRadius: "12px", fontWeight: 800, fontSize: "14px", textDecoration: "none", boxShadow: "0 4px 16px rgba(245,158,11,0.35)", whiteSpace: "nowrap" }}
              >
                Get My Referral Link <ArrowRight size={15} />
              </Link>
              <Link
                href="/register"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.10)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "13px 26px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", textDecoration: "none", whiteSpace: "nowrap", backdropFilter: "blur(6px)" }}
              >
                New? Create an Account
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* ── RECENTLY VIEWED ───────────────────────────────────── */}
      <RecentlyViewed />

      {/* ── EMAIL CAPTURE ─────────────────────────────────────── */}
      <section className="home-section-email" style={{ background: "linear-gradient(135deg, #0D2565 0%, #1240A0 50%, #1B5CB5 100%)", padding: "64px 0", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)", backgroundSize: "32px 32px", pointerEvents: "none" }} />
        <div className="max-w-[560px] mx-auto px-4 text-center" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.20)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Mail size={24} style={{ color: "#93C5FD" }} />
          </div>
          <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.025em", lineHeight: 1.1, marginBottom: 12 }}>
            Stay at the forefront of peptide research.
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.60)", lineHeight: 1.75, maxWidth: 400, margin: "0 auto 28px" }}>
            Join 8,000+ researchers — protocol guides, new compound alerts, and exclusive member pricing sent directly to you.
          </p>
          {emailSubscribed ? (
            <div style={{ background: "rgba(52,211,153,0.15)", border: "1px solid rgba(52,211,153,0.40)", borderRadius: 14, padding: "20px 28px", display: "inline-flex", alignItems: "center", gap: 12 }}>
              <CheckCircle size={22} style={{ color: "#34D399", flexShrink: 0 }} />
              <div style={{ textAlign: "left" }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#34D399", margin: 0 }}>You're in!</p>
                <p style={{ fontSize: 12, color: "rgba(255,255,255,0.60)", margin: "2px 0 0" }}>Welcome to the OmniQure research community.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEmailSubmit} className="flex gap-2" style={{ maxWidth: 420, margin: "0 auto" }}>
              <input
                type="email"
                required
                placeholder="your@institution.edu"
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                style={{ flex: 1, height: 48, borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.20)", background: "rgba(255,255,255,0.08)", color: "#fff", padding: "0 16px", fontSize: 14, outline: "none" }}
              />
              <button
                type="submit"
                style={{ height: 48, borderRadius: 10, background: "linear-gradient(90deg, #34D399, #059669)", color: "#022c22", fontWeight: 800, fontSize: 13, border: "none", cursor: "pointer", padding: "0 20px", flexShrink: 0, whiteSpace: "nowrap" }}
              >
                Subscribe
              </button>
            </form>
          )}
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.30)", marginTop: 12 }}>No spam. Unsubscribe anytime.</p>
        </div>
      </section>


    </div>
  );
}
