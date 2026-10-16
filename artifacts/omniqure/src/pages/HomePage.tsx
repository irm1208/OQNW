import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import {
  ArrowRight,
  Truck,
  Zap,
} from "lucide-react";
import CatalogueCard from "@/components/CatalogueCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import FeaturedRangeSection from "@/components/home/FeaturedRangeSection";
import ProductCategoriesSection from "@/components/home/ProductCategoriesSection";
import {
  WhySection, BestSellersSection, BundleBanner, ProcessSection, QualitySection,
  InstitutionalSection, FaqSection, FromTheLabSection, ResearchNotice,
  NasalSpraysSection, ReviewsSection,
} from "@/components/home/HomeSections";
const HOME_FAQ: { q: string; a: string }[] = [
              {
                q: "What purity standards do your peptides meet?",
                a: "All OmniQure peptides are HPLC-verified to ≥99% purity. Available independent testing results are published as Janoshik reports on the relevant product pages.",
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
                q: "What is your returns and refund policy?",
                a: "Due to the nature of research chemicals, we cannot accept returns on opened or used products. If you receive a damaged or incorrect item, please contact our support team within 48 hours of delivery with photos and your order number — we will resolve it promptly.",
              },
];

const featuredSlugs = [
  "retatrutide-10mg", "bpc-157-5mg", "bpc-157-tb-500-blend-10mg",
  "cjc-1295-no-dac-ipamorelin-5mg", "ghk-cu-50mg", "glow-blend-70mg",
  "klow-blend-80mg", "tb-500-5mg",
];

/* ── Split Hero (light panel, copy left, imagery right) ───────── */
const HERO_PANEL = "rgb(240, 240, 242)";
const HERO_MARQUEE = [
  { text: "Free shipping on all UK orders", icon: Truck },
  { text: "Same-day dispatch before 12:00", icon: Zap },
];

function HeroSplit() {
  return (
    <>
      <section className="relative overflow-hidden" style={{ background: HERO_PANEL, borderBottom: "1px solid var(--hairline)" }}>
        <div className="flex flex-col lg:flex-row lg:min-h-[600px]">
          <div className="relative z-10 flex items-center w-full lg:w-[52%] order-2 lg:order-1 py-10 sm:py-14 lg:py-0 px-5 sm:px-8 lg:pl-[max(2rem,calc((100vw_-_1280px)_/_2_+_3rem))] lg:pr-10">
            <div className="w-full max-w-[480px]">
              <div className="flex items-center gap-2 mb-6">
                <span className="h-px w-6" style={{ background: "var(--cobalt)" }} />
                <span className="uppercase font-medium" style={{ fontSize: 11, lineHeight: 1, letterSpacing: "0.14em", color: "var(--graphite)" }}>
                  Research use only — in-vitro laboratory research
                </span>
              </div>
              <h1 className="font-bold leading-[1.0] tracking-[-0.025em]" style={{ fontSize: "clamp(34px, 3.6vw, 58px)", color: "var(--ink)" }}>
                <span>OmniQure —</span><br />
                <span style={{ color: "var(--cobalt)" }}>research-grade purity.</span>
              </h1>
              <p className="mt-6 max-w-[420px]" style={{ fontSize: 14.5, lineHeight: 1.8, color: "var(--graphite)" }}>
                Independently lab-tested and dispatched the same day — supplied to laboratories across the UK, with free tracked delivery on every order.
              </p>
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link href="/all-peptides" className="inline-flex items-center justify-center gap-1.5 rounded-lg px-6 py-3.5 font-semibold text-white bg-[var(--ink)] hover:bg-[var(--cobalt)] transition-colors" style={{ fontSize: 14, textDecoration: "none" }}>
                  Shop peptides <ArrowRight size={15} />
                </Link>
                <Link href="/bundle-and-save" className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 font-medium bg-white/60 hover:bg-white transition-colors" style={{ fontSize: 14, color: "var(--ink)", border: "1px solid var(--hairline)", textDecoration: "none" }}>
                  Build a kit
                  <span className="rounded-full px-2 py-[3px] font-semibold text-white leading-none" style={{ fontSize: 10, background: "var(--cobalt)" }}>FREE ITEMS</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="relative w-full lg:w-[48%] order-1 lg:order-2 overflow-hidden aspect-[4/3] sm:aspect-[2/1] lg:aspect-auto">
            <picture>
              <source media="(max-width: 1023px)" srcSet="/reference/hero-mobile.webp" />
              <img src="/reference/hero-desktop.webp" alt="Research peptide vials and nasal spray bottles" width={1332} height={1181} className="absolute inset-0 h-full w-full object-cover object-center" fetchPriority="high" />
            </picture>
            <div className="absolute inset-y-0 left-0 w-48 hidden lg:block" style={{ background: `linear-gradient(to right, ${HERO_PANEL} 0%, ${HERO_PANEL} 20%, transparent 100%)` }} />
            <div className="absolute inset-x-0 top-0 h-56 hidden lg:block" style={{ background: `linear-gradient(to bottom, ${HERO_PANEL} 0%, ${HERO_PANEL} 18%, transparent 100%)` }} />
            <div className="absolute inset-x-0 bottom-0 h-24 lg:hidden" style={{ background: `linear-gradient(to top, ${HERO_PANEL} 0%, transparent 100%)` }} />
          </div>
        </div>
      </section>
      <div className="relative overflow-hidden select-none" style={{ background: "#FFF6F2", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)" }}>
        <div className="flex w-max animate-ticker h-[38px] items-center" aria-hidden="true">
          {[0, 1, 2, 3].map(k => (
            <div key={k} className="flex shrink-0 items-center">
              {HERO_MARQUEE.map(({ text, icon: Icon }) => (
                <span key={text} className="flex items-center gap-2.5 px-6">
                  <Icon size={14} style={{ color: "var(--cobalt)" }} />
                  <span className="font-semibold uppercase" style={{ fontSize: "clamp(0.66rem,1.4vw,0.78rem)", letterSpacing: "0.2em", color: "#4A5672" }}>{text}</span>
                  <span className="ml-4 h-[3px] w-[3px] rounded-full" style={{ background: "rgba(59, 98, 171,0.35)" }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function HomePage() {
  const { products } = useProducts();
  useSEO({
    title: "Verified Research Peptides",
    description: "Buy high-purity research peptides with independent results confirming 99%+ purity. BPC-157, TB-500, Ipamorelin, Epithalon and 100+ peptides. Worldwide shipping from OmniQure.",
    canonicalPath: "/",
  });


  const featuredGroups = (() => {
    const featuredProducts = featuredSlugs
      .map(slug => products.find(p => p.slug === slug))
      .filter(Boolean) as typeof products;
    const allGroups = groupProducts(products);
    return featuredProducts
      .map(p => allGroups.find(g => g.baseName === parseName(p.name).baseName))
      .filter((g): g is NonNullable<typeof g> => g != null)
      .filter((g, i, arr) => arr.findIndex(x => x.baseName === g.baseName) === i);
  })();

  return (
    <div className="reference-home" style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif" }}>

      {/* Reference photography uses separate desktop and mobile compositions. */}
      <HeroSplit />

      <ProductCategoriesSection />

      <WhySection />

      <FeaturedRangeSection />

      <BestSellersSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredGroups.slice(0, 8).map(group => (
              <CatalogueCard key={group.baseName} group={group} />
            ))}
          </div>
      </BestSellersSection>

      <BundleBanner image="/reference/kit.webp" />

      <NasalSpraysSection />

      <ProcessSection />

      <QualitySection />

      <InstitutionalSection />

      <FaqSection items={HOME_FAQ} />

      <FromTheLabSection />

      <ReviewsSection />

      <ResearchNotice />

      {/* ── RECENTLY VIEWED ───────────────────────────────────── */}
      <RecentlyViewed />



    </div>
  );
}
