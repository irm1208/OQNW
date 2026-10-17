import { useSEO } from "@/hooks/useSEO";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import CatalogueCard from "@/components/CatalogueCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import HeroCarousel from "@/components/home/HeroCarousel";
import FeaturedRangeSection from "@/components/home/FeaturedRangeSection";
import ProductCategoriesSection from "@/components/home/ProductCategoriesSection";
import TrustBadges from "@/components/TrustBadges";
import {
  WhySection, BestSellersSection, BundleBanner, ProcessSection, QualitySection,
  FaqSection, ResearchNotice, ReviewsSection,
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

function HeroSection() {
  return <HeroCarousel />;
}


/* Conversion band: the first purchase-intent actions, kept above the fold on every viewport. */
function AboveFoldCTA() {
  return (
    <section className="border-b bg-white" style={{ borderColor: "var(--hairline)" }}>
      <div className="mx-auto w-full max-w-[1280px] px-5 py-2 md:px-8 sm:py-5 xl:px-12">
        <div className="flex flex-col items-stretch justify-between gap-2 sm:flex-row sm:items-center sm:gap-6">
          <div className="hidden text-center sm:block sm:text-left">
            <p className="font-bold leading-tight" style={{ fontSize: "clamp(15px, 2.2vw, 20px)", letterSpacing: "-0.015em", color: "var(--ink)" }}>
              Research-grade peptides, ready to ship
            </p>
            <p className="mt-1" style={{ fontSize: "clamp(12px, 1.5vw, 14px)", color: "var(--graphite)" }}>
              135 compounds · Published lab reports · Free tracked UK delivery
            </p>
          </div>
          <div className="flex w-full flex-row items-stretch gap-2 sm:w-auto sm:items-center sm:gap-3">
            <Link
              href="/all-peptides"
              className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98] sm:flex-none sm:gap-2 sm:px-7 sm:py-3"
              style={{ fontSize: "clamp(13px, 3vw, 15px)", background: "var(--cobalt)", boxShadow: "0 2px 10px rgba(59,98,171,0.25)" }}
            >
              Shop peptides <ArrowRight size={15} />
            </Link>
            <Link
              href="/bundle-and-save"
              className="inline-flex flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border-2 px-3.5 py-2 font-semibold transition-colors hover:bg-[var(--ice)] sm:flex-none sm:gap-2 sm:px-7 sm:py-3"
              style={{ fontSize: "clamp(12.5px, 2.8vw, 14px)", color: "var(--ink)", borderColor: "var(--ink)" }}
            >
              Build a bundle
            </Link>
          </div>
        </div>
      </div>
    </section>
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

      {/* Campaigns use separate desktop and mobile compositions. */}
      <HeroSection />

      <AboveFoldCTA />

      <TrustBadges />

      {/* Products first: best sellers sit directly below the fold so buyers see
          priced, purchasable vials before any brand storytelling. */}
      <BestSellersSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-4">
            {featuredGroups.slice(0, 8).map(group => (
              <CatalogueCard key={group.baseName} group={group} />
            ))}
          </div>
      </BestSellersSection>

      <BundleBanner image="/hero/eight-vials-desktop.webp" />

      <ProductCategoriesSection />

      <WhySection />

      <ReviewsSection />

      <FaqSection items={HOME_FAQ} />

      <ResearchNotice />

      {/* ── RECENTLY VIEWED ───────────────────────────────────── */}
      <RecentlyViewed />



    </div>
  );
}
