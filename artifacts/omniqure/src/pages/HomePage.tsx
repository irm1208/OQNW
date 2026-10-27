import { useSEO } from "@/hooks/useSEO";
import { ArrowRight, FlaskConical, Truck, ShieldCheck, Clock } from "lucide-react";
import { Link } from "wouter";
import CatalogueCard from "@/components/CatalogueCard";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { useProducts } from "@/context/ProductsContext";
import RecentlyViewed from "@/components/RecentlyViewed";
import HeroCarousel from "@/components/home/HeroCarousel";
import FeaturedRangeSection from "@/components/home/FeaturedRangeSection";
import ProductCategoriesSection from "@/components/home/ProductCategoriesSection";
import {
  WhySection, BestSellersSection, BundleBanner, ProcessSection, QualitySection,
  FaqSection, ReviewsSection, SpotlightSection, PackagingSection,
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
  { icon: FlaskConical, label: "99%+ HPLC purity" },
  { icon: ShieldCheck, label: "Janoshik lab reports" },
  { icon: Clock, label: "Same-day dispatch" },
  { icon: Truck, label: "Free UK tracked delivery" },
];

function BrandBand() {
  return (
    <section className="home-band" aria-label="Why order from OmniQure">
      <div className="pinstripe" aria-hidden="true" />
      <div className="home-band__inner">
        <div className="home-band__lead">
          <p className="home-band__title">Research-grade peptides, ready to ship</p>
          <p className="home-band__sub">135 compounds, each with a published lab report.</p>
        </div>
        <div className="home-band__actions">
          <Link href="/all-peptides" className="home-btn home-btn--light">
            Shop peptides <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/bundle-and-save" className="home-btn home-btn--ghost">Build a bundle</Link>
        </div>
        <ul className="home-band__proof">
          {PROOF.map(({ icon: Icon, label }) => (
            <li key={label}><Icon size={16} aria-hidden="true" />{label}</li>
          ))}
        </ul>
      </div>
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

      {/* 2. Promise, first actions and proof */}
      <BrandBand />

      {/* 3. Products first: priced, purchasable vials before any storytelling */}
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

      {/* 4. The product itself: Sunburst vial-and-card shots */}
      <SpotlightSection />

      {/* 5. Browse by range */}
      <ProductCategoriesSection />

      {/* 5. The bundle offer, once the range is known */}
      <BundleBanner image="/hero/sb-bundle-stack-wide.webp" />

      {/* Packaging */}
      <PackagingSection />

      {/* 6. Proof: why us, then what customers say */}
      <WhySection />
      <ReviewsSection />

      {/* 7. Remaining questions */}
      <FaqSection items={HOME_FAQ} />

      <RecentlyViewed />
    </div>
  );
}
