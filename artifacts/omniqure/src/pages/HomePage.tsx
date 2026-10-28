import { useSEO } from "@/hooks/useSEO";
import { FileBadge, TestTubes, Timer, Truck } from "lucide-react";
import CatalogueCard from "@/components/CatalogueCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import HeroCarousel from "@/components/home/HeroCarousel";
import FeaturedRangeSection from "@/components/home/FeaturedRangeSection";
import ProductCategoriesSection from "@/components/home/ProductCategoriesSection";
import {
  WhySection, BestSellersSection, BundleBanner, QualitySection,
  FaqSection, ReviewsSection, MissionSection, HowItWorksSection, ClosingCtaSection,
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


/* Brand band under the hero: the pin stripe, the promise, the two first
   actions and four proof points. One block instead of a CTA strip plus a
   separate badge row. */
const PROOF = [
  { icon: TestTubes, tone: "var(--oq-sage)", label: "99%+ purity", detail: "HPLC tested, every batch" },
  { icon: FileBadge, tone: "var(--oq-lavender)", label: "Lab reports", detail: "Published by Janoshik" },
  { icon: Timer, tone: "var(--oq-sand)", label: "Same-day dispatch", detail: "Order by 12:00, Mon–Fri" },
  { icon: Truck, tone: "var(--oq-teal-grey)", label: "Free UK delivery", detail: "Tracked and discreet" },
];

function BrandBand() {
  return (
    <section className="home-band" aria-label="Why order from OmniQure">
      <div className="pinstripe" aria-hidden="true" />
      <ul className="home-band__proof">
        {PROOF.map(({ icon: Icon, tone, label, detail }) => (
          <li key={label} style={{ "--tone": tone } as React.CSSProperties}>
            <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
            <span className="home-band__point">
              <span className="home-band__point-title">{label}</span>
              <span className="home-band__point-detail">{detail}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function HomePage() {
  const { products, loading } = useProducts();
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

      {/* 1. Hero campaigns: separate desktop and mobile compositions */}
      <HeroSection />

      {/* 2. Trust line under the hero */}
      <BrandBand />

      {/* 3. Products first */}
      <BestSellersSection>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
          {featuredGroups.slice(0, 8).map(group => (
            <CatalogueCard key={group.baseName} group={group} />
          ))}
          {/* Hold the grid's space while the catalogue loads, so the page below doesn't jump */}
          {loading && featuredGroups.length === 0 && Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="home-card-skeleton" aria-hidden="true">
              <div className="aspect-[4/5]" />
              <div className="h-[118px]" />
            </div>
          ))}
        </div>
      </BestSellersSection>

      {/* 4. Brand pillars: tested, documented, delivered */}
      <WhySection />

      {/* 5. How it works */}
      <HowItWorksSection />

      {/* 6. Shop by range */}
      <ProductCategoriesSection />

      {/* 7. The offer */}
      <BundleBanner image="/sunburst/sb-bundle-box-wide.webp" />

      {/* 8. The people behind it */}
      <MissionSection />

      {/* 9. Social proof */}
      <ReviewsSection />

      {/* 10. Questions */}
      <FaqSection items={HOME_FAQ} />

      {/* 11. Closing call to action */}
      <ClosingCtaSection />

      <RecentlyViewed />
    </div>
  );
}
