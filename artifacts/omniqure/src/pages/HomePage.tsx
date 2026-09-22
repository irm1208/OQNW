import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  Shield, FlaskConical, Truck, Award,
  ChevronRight, ArrowRight,
  Gift, UserPlus, ShoppingCart,
} from "lucide-react";
import GroupedProductCard from "@/components/GroupedProductCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import { useCurrency } from "@/context/CurrencyContext";
import type { CurrencyCode } from "@/context/CurrencyContext";
import bundleAndSaveHeroImg from "@assets/new_hero_1783533143502.jpeg";
import bundleElectricHeroImg from "@assets/ChatGPT_Image_Sep_22,_2026,_01_15_23_PM_1790079338125.png";
import heroContentImg from "@assets/ChatGPT_Image_Sep_22,_2026,_12_54_44_PM_1790078104530.png";
import heroReferralImg from "@assets/ChatGPT_Image_Sep_22,_2026,_01_03_20_PM_1790078610365.png";
import heroAffiliateImg from "@assets/ChatGPT_Image_Sep_22,_2026,_01_38_02_PM_1790080697936.png";
import heroMobileReferralImg from "@assets/ChatGPT_Image_Sep_22,_2026,_02_14_34_PM_(1)_1790082918690.png";
import heroMobileBundleImg from "@assets/ChatGPT_Image_Sep_22,_2026,_02_14_35_PM_(2)_1790082918690.png";
import heroMobileAffiliateImg from "@assets/ChatGPT_Image_Sep_22,_2026,_02_14_35_PM_(3)_1790082918690.png";
import heroMobileContentImg from "@assets/ChatGPT_Image_Sep_22,_2026,_02_14_36_PM_(4)_1790082918690.png";

// Value of a single £25 referral credit reward, in each supported currency.
const REFERRAL_CREDIT_VALUE: Record<CurrencyCode, string> = {
  GBP: "£25", USD: "$33", EUR: "€30", AUD: "A$50", CAD: "C$45",
  CHF: "Fr28", NZD: "NZ$55", JPY: "¥5,000", SGD: "S$43", HKD: "HK$255",
  KRW: "₩44,000", TWD: "NT$1,025", MYR: "RM148", THB: "฿1,100",
  DKK: "kr225", NOK: "kr345", SEK: "kr340", PLN: "zł125",
  CZK: "Kč725", HUF: "Ft11,000", AED: "د.إ120",
};

// Maximum unredeemed referral credit balance (£50 cap), in each supported currency.
const REFERRAL_CREDIT_CAP: Record<CurrencyCode, string> = {
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
    peptides: "AOD-9604",
    desc: "GLP-1 receptor agonist research — investigated for appetite signalling, adipogenesis pathways, and lipid metabolism models.",
    img: "/research-weight-metabolic.jpg?v=1",
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


const featuredIds = ["4", "7", "18", "37", "40", "62", "64", "72", "82", "85"];


const pillars = [
  {
    num: "01",
    icon: <FlaskConical size={24} />,
    title: "Verified Purity",
    body: "Every published independent result confirms 99%+ purity.",
    color: "#1B5CB5",
    bg: "#EEF4FF",
  },
  {
    num: "02",
    icon: <Award size={24} />,
    title: "Independent Reports",
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
function ResponsiveHeroImage({
  desktopSrc,
  mobileSrc,
  alt,
  className = "",
}: {
  desktopSrc: string;
  mobileSrc: string;
  alt: string;
  className?: string;
}) {
  return (
    <picture className={`hero-slide-picture ${className}`.trim()}>
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      <img className="hero-slide-image" src={desktopSrc} alt={alt} />
    </picture>
  );
}

function HeroContentSlide() {
  return (
    <Link
      href="/all-peptides"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <section
        className="hero-section"
        style={{
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(to bottom, #ABC7F4, #9EAED8)",
          minHeight: "unset",
          display: "flex",
          alignItems: "flex-end",
          height: "100%",
        }}
      >
        <ResponsiveHeroImage
          desktopSrc={heroContentImg}
          mobileSrc={heroMobileContentImg}
          alt="OmniQure research peptide collection featuring labelled peptide vials and molecular structures"
          className="hero-content-picture"
        />

      </section>
    </Link>
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
      <ResponsiveHeroImage
        desktopSrc={heroReferralImg}
        mobileSrc={heroMobileReferralImg}
        alt="Refer a friend and earn £25 credit each, up to £50"
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
      <ResponsiveHeroImage
        desktopSrc={bundleAndSaveHeroImg}
        mobileSrc={heroMobileBundleImg}
        alt="Bundle and Save exclusive offers — free 10ml BAC water ampule on 3-4 peptides, 1 peptide free on 5-9 peptides, 2 peptides free on 10+ peptides"
      />
    </Link>
  );
}

function HeroBundleElectricSlide() {
  return (
    <Link
      href="/bundle-and-save"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "#e8f0f8",
      }}
    >
      <ResponsiveHeroImage
        desktopSrc={bundleElectricHeroImg}
        mobileSrc={heroMobileBundleImg}
        alt="Bundle and Save — buy 3-4 peptides and get a free 10ml BAC water ampule, 5-9 get 1 free peptide, 10+ get 2 free peptides"
      />
    </Link>
  );
}

function HeroAffiliateSlide() {
  return (
    <Link
      href="/affiliate"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        background: "#EAF4FF",
      }}
    >
      <ResponsiveHeroImage
        desktopSrc={heroAffiliateImg}
        mobileSrc={heroMobileAffiliateImg}
        alt="Grow with OmniQure affiliate programme — earn commission, offer audience discounts, and unlock product rewards"
      />
    </Link>
  );
}

const HERO_AUTOPLAY_MS = 6500;

function HeroCarousel() {
  const slides = [
    { key: "content", render: () => <HeroContentSlide /> },
    { key: "referral", render: () => <HeroReferralSlide /> },
    { key: "bundle-electric", render: () => <HeroBundleElectricSlide /> },
    { key: "affiliate", render: () => <HeroAffiliateSlide /> },
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

export default function HomePage() {
  const { products } = useProducts();
  const { currency } = useCurrency();
  const localValue = REFERRAL_CREDIT_VALUE[currency.code] ?? REFERRAL_CREDIT_VALUE.GBP;
  const localCap = REFERRAL_CREDIT_CAP[currency.code] ?? REFERRAL_CREDIT_CAP.GBP;
  useSEO({
    title: "Verified Research Peptides",
    description: "Buy high-purity research peptides with independent results confirming 99%+ purity. BPC-157, TB-500, Ipamorelin, Epithalon and 100+ peptides. Worldwide shipping from OmniQure.",
    canonicalPath: "/",
  });

  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);

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
              { icon: <FlaskConical size={20} />, title: "99%+ Verified Purity", sub: "Across every published result", color: "#1B5CB5", bg: "#EEF4FF" },
              { icon: <Award size={20} />,        title: "Independent Reports", sub: "Janoshik verification",            color: "#059669", bg: "#ECFDF5" },
              { icon: <Shield size={20} />,       title: "Research Grade",       sub: "For qualified researchers only",  color: "#7C3AED", bg: "#F5F3FF" },
              { icon: <Truck size={20} />,        title: "Free UK Shipping",       sub: "Mainland, Highlands & NI",       color: "#0E7490", bg: "#ECFEFF" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 py-5 px-5 trust-strip-cell"
              >
                <div
                  className="flex-shrink-0 rounded-xl flex items-center justify-center trust-strip-icon"
                  style={{ width: "44px", height: "44px", backgroundColor: item.bg, color: item.color }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold trust-strip-title" style={{ fontSize: "13px", color: "#0F172A" }}>{item.title}</p>
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
                { label: "3-4 vials", freebie: "Free 10ml BAC Water Ampule",   bg: "rgba(96,165,250,0.18)",  border: "rgba(96,165,250,0.40)",  color: "#93C5FD" },
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { emoji: "🩹", label: "Recovery & Healing",  sub: "BPC-157 · TB-500",           href: "/all-peptides?category=Healing+Peptides"  },
              { emoji: "🧠", label: "Cognitive & Brain",   sub: "Semax · Selank · P21",        href: "/all-peptides?category=Nootropics"         },
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
                Our most popular research compounds, all verified
              </p>
            </div>
            <Link
              href="/all-peptides"
              className="hidden sm:flex items-center gap-1.5 font-semibold"
              style={{ fontSize: "13px", color: "#1B5CB5", textDecoration: "none", transition: "opacity 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.7"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
            >
              View collection <ChevronRight size={15} />
            </Link>
          </div>

          <div className="featured-grid grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 sm:gap-x-12 sm:gap-y-24 md:gap-x-14 md:gap-y-28">
            {featuredGroups.map(group => (
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

      {/* ── REFER A FRIEND ────────────────────────────────────── */}
      <div className="home-spacer-32" style={{ height: 32, background: "#fff" }} />
      <section className="home-section-refer py-8 md:py-[68px]" style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
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

          {/* Section header */}
          <div className="home-section-refer-header text-center mb-5 md:mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #F59E0B, #FCD34D)", borderRadius: "2px" }} />
              <p className="font-bold uppercase tracking-widest" style={{ fontSize: "11px", color: "#F59E0B", letterSpacing: "0.1em" }}>
                REFERRAL PROGRAMME
              </p>
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #FCD34D, #F59E0B)", borderRadius: "2px" }} />
            </div>
            <h2 className="font-bold" style={{ fontSize: "clamp(22px,3vw,38px)", color: "#fff", letterSpacing: "-0.02em", marginBottom: "12px" }}>
              Refer a Friend, Earn £25 Credit Each
            </h2>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
              Share your unique referral link. They get <strong style={{ color: "#fff" }}>10% off their first order</strong>, and once it ships you <strong style={{ color: "#fff" }}>both claim {localValue} credit</strong> — up to {localCap} unredeemed balance each.
            </p>
          </div>

          {/* Steps */}
          <div className="refer-steps-grid grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-10">
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
                title: "Both Claim £25 Credit",
                body: `As soon as their order ships, you both get ${localValue} credit added to your accounts — redeemable on your next order (up to ${localCap} unredeemed balance).`,
                color: "#B45309",
                bg: "#FEF3C7",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="refer-step-card px-4 py-4 md:px-7 md:py-8"
                style={{
                  background: "#fff",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  borderRadius: "20px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px rgba(0,0,0,0.25)`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.15)";
                }}
              >
                <div style={{ height: "3px", background: `linear-gradient(90deg, ${s.color}, ${s.color}66)`, borderRadius: "12px 12px 0 0", position: "absolute", top: 0, left: 0, right: 0 }} />
                <span style={{ position: "absolute", top: "12px", right: "16px", fontSize: "32px", fontWeight: 900, color: "#CBD5E1", lineHeight: 1, userSelect: "none", letterSpacing: "-0.04em" }}>{s.step}</span>
                <div style={{ width: "44px", height: "44px", borderRadius: "12px", backgroundColor: s.bg, color: s.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                  {s.icon}
                </div>
                <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginBottom: "6px" }}>{s.title}</h3>
                <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.6, margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="px-4 py-5 md:px-10 md:py-9" style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "20px",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
            backdropFilter: "blur(8px)",
          }}>
            <div style={{ position: "absolute", top: "-60px", right: "10%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(245,158,11,0.20)", border: "1px solid rgba(245,158,11,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Gift size={18} style={{ color: "#F59E0B" }} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#F59E0B" }}>Start Earning Today</span>
              </div>
              <h3 style={{ fontSize: "clamp(18px,2.5vw,26px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 8px" }}>
                Every referral earns you and your friend {localValue} credit each (up to {localCap}).
              </h3>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.60)", margin: 0, lineHeight: 1.6 }}>
                No limit on referrals. Credit never expires. Stacks with bundle discounts.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link
                href="/refer-a-friend"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "#F59E0B", color: "#000", padding: "10px 20px", borderRadius: "12px", fontWeight: 800, fontSize: "14px", textDecoration: "none", boxShadow: "0 4px 16px rgba(245,158,11,0.35)", whiteSpace: "nowrap" }}
              >
                Get My Referral Link <ArrowRight size={15} />
              </Link>
              <Link
                href="/register"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(255,255,255,0.12)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "10px 20px", borderRadius: "12px", fontWeight: 700, fontSize: "14px", textDecoration: "none", whiteSpace: "nowrap", backdropFilter: "blur(6px)" }}
              >
                New? Create an Account
              </Link>
            </div>
          </div>

        </div>
      </section>


      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section style={{ background: "#F8FAFF", padding: "72px 0", borderTop: "1px solid #E8EDF5", borderBottom: "1px solid #E8EDF5" }}>
        <div className="max-w-[800px] mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-3">
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #1240A0, #1B5CB5)", borderRadius: "2px" }} />
              <p style={{ fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "#1240A0" }}>
                COMMON QUESTIONS
              </p>
              <div style={{ width: "16px", height: "3px", background: "linear-gradient(90deg, #1B5CB5, #1240A0)", borderRadius: "2px" }} />
            </div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em", marginBottom: "10px" }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: "15px", color: "#64748B", lineHeight: 1.7, maxWidth: "480px", margin: "0 auto" }}>
              Everything you need to know before placing your first order.
            </p>
          </div>

          {/* Accordion */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {([
              {
                q: "What purity standards do your peptides meet?",
                a: "All OmniQure peptides are HPLC-verified to ≥99% purity. Available independent testing results are published as Janoshik reports on the relevant product pages.",
              },
              {
                q: "Do products have independent verification reports?",
                a: "Available Janoshik reports include independent test results confirming product quality. They are published directly on the relevant product pages and are accessible before and after purchase — no physical paperwork is included with shipments.",
              },
              {
                q: "Are these products approved for human use?",
                a: "No. All OmniQure peptides are strictly for in-vitro research purposes only. They are not approved for human or veterinary use, are not medicines, and must not be administered to humans or animals. By purchasing, you confirm you are a qualified researcher using them solely for laboratory research.",
              },
              {
                q: "How are peptides packaged and shipped?",
                a: "Peptides are lyophilised (freeze-dried) and sealed in individually labelled vials to preserve stability. Orders are dispatched in discreet packaging. UK orders typically arrive within 2–3 business days; international shipping times vary by destination.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept pay by bank and cryptocurrency. Account credit, including referral credit, can also be applied to any order. Card payments are not currently supported.",
              },
              {
                q: "How does the referral credit programme work?",
                a: "When a friend signs up using your unique referral link and places their first order, you both receive £25 account credit once their order ships. There is no limit on the number of referrals you can make, and credit never expires. You can redeem it on any future order (up to your unredeemed balance cap).",
              },
              {
                q: "What is your returns and refund policy?",
                a: "Due to the nature of research chemicals, we cannot accept returns on opened or used products. If you receive a damaged or incorrect item, please contact our support team within 48 hours of delivery with photos and your order number — we will resolve it promptly.",
              },
              {
                q: "Do you ship internationally?",
                a: "Yes. We ship to most countries worldwide. International customers are responsible for ensuring compliance with local import regulations regarding research chemicals. Customs duties and taxes, if applicable, are the responsibility of the recipient.",
              },
            ] as { q: string; a: string }[]).map((item, i) => {
              const isOpen = faqOpenIdx === i;
              return (
                <div
                  key={i}
                  style={{
                    background: "#fff",
                    border: `1.5px solid ${isOpen ? "#BFDBFE" : "#E8EDF5"}`,
                    borderRadius: "14px",
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                    boxShadow: isOpen ? "0 4px 20px rgba(18,64,160,0.07)" : "none",
                  }}
                >
                  <button
                    onClick={() => setFaqOpenIdx(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      padding: "20px 24px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A", lineHeight: 1.4 }}>{item.q}</span>
                    <span style={{
                      flexShrink: 0,
                      width: "28px",
                      height: "28px",
                      borderRadius: "8px",
                      background: isOpen ? "linear-gradient(135deg, #0D2565, #1B5CB5)" : "#F1F5F9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s",
                    }}>
                      <ChevronRight
                        size={14}
                        style={{
                          color: isOpen ? "#fff" : "#64748B",
                          transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "transform 0.2s",
                        }}
                      />
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 24px 20px", borderTop: "1px solid #EEF4FF" }}>
                      <p style={{ fontSize: "14.5px", color: "#475569", lineHeight: 1.8, margin: "16px 0 0" }}>{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer note */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#94A3B8", marginTop: "32px", lineHeight: 1.6 }}>
            Still have a question?{" "}
            <Link href="/contact" style={{ color: "#1B5CB5", fontWeight: 700, textDecoration: "none" }}>
              Contact our team
            </Link>{" "}
            and we'll get back to you within one business day.
          </p>

        </div>
      </section>

      {/* ── RECENTLY VIEWED ───────────────────────────────────── */}
      <RecentlyViewed />



    </div>
  );
}
