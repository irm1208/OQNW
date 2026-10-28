import { ShoppingCart, Tag, ChevronRight, CheckCircle2, Package, Percent, Lightbulb } from "lucide-react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { useProducts } from "@/context/ProductsContext";
import { FREE_BAC_WATER_SLUG } from "@/data/bacWaterProducts";
import PageHero from "@/components/PageHero";

const INK = "#1D2948";
const GRAPHITE = "#4A5672";
const COBALT = "#4E68C2";
const HAIR = "1px solid rgba(11,18,32,0.09)";
const CONTAINER = "w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12";

const TIERS = [
  {
    qty: "3-4",
    freebie: "Free 10ml BAC Water Ampule",
    label: "Starter Bundle",
    badge: "",
    desc: "A great starting point — try three or four different peptides and we'll include a free 10ml bacteriostatic water.",
  },
  {
    qty: "5-9",
    freebie: "1 Peptide Free",
    label: "Research Bundle",
    badge: "Popular",
    desc: "Build out your protocol stack with five to nine compounds and the cheapest one in your cart is on us.",
  },
  {
    qty: "10+",
    freebie: "2 Peptides Free",
    label: "Institute Bundle",
    badge: "Best Value",
    desc: "Maximum tier — the 2 cheapest peptides in your cart are free. Reserved for our highest-volume researchers.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: ShoppingCart,
    title: "Add peptides to your cart",
    desc: "Browse our catalogue of 81 verified compounds and add any combination to your cart.",
  },
  {
    icon: Tag,
    title: "Discount applies automatically",
    desc: "Once you hit a tier threshold, the discount is calculated and shown in your cart — no code needed.",
  },
  {
    icon: Package,
    title: "Checkout & save",
    desc: "Complete your order at the discounted price. Bundle savings stack on top of any sale pricing.",
  },
];

const EXAMPLES: { label: string; freebie: string; saving: number | null }[] = [
  { label: "3 × BPC-157 5mg", freebie: "Free 10ml BAC water", saving: null },
  { label: "5 × Mixed growth stack", freebie: "Cheapest peptide free", saving: 60 },
  { label: "10 × Full research panel", freebie: "2 cheapest peptides free", saving: 120 },
];

const h2Style = { fontSize: "clamp(22px,2.6vw,30px)", fontWeight: 600, color: INK, letterSpacing: "-0.02em", lineHeight: 1.15, margin: "0 0 8px" } as const;
const subStyle = { fontSize: 14.5, color: GRAPHITE, lineHeight: 1.65, margin: 0 } as const;

const primaryBtn = "inline-flex items-center gap-2 h-11 px-6 rounded-full text-[14px] font-medium text-white transition-opacity hover:opacity-90";

export default function BundleAndSavePage() {
  const { products } = useProducts();
  const freeBacWaterValue = products.find((product) => product.slug === FREE_BAC_WATER_SLUG)?.price ?? null;
  const examples = EXAMPLES.map((example) =>
    example.saving === null ? { ...example, saving: freeBacWaterValue } : example
  );

  useSEO({
    title: "Bundle & Save",
    description: "Get free items when you order multiple peptides — a free 10ml Bac Water ampule at 3-4, a free peptide at 5-9, and 2 free peptides at 10+. Applied automatically — no codes required, and tiers don't stack.",
    canonicalPath: "/bundle-and-save",
  });

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>
      <PageHero image={{ key: "hdr-bundles", alt: "OmniQure build-your-own-bundle box with eight vials" }}
        crumbs={[{ label: "Bundle & Save" }]}
        eyebrow="Volume discounts"
        icon={Percent}
        title={<>The More You Research, <span style={{ color: COBALT }}>The More You Save</span></>}
      >
        <p style={{ margin: 0 }}>
          Add 3 or more peptides to your cart and free items apply automatically — 3-4 peptides unlock a <strong style={{ color: INK, fontWeight: 600 }}>free 10ml Bac Water ampule</strong>, with higher tiers offering free peptides.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/all-peptides" className={primaryBtn} style={{ background: INK, textDecoration: "none" }}>
            Shop All Peptides <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </PageHero>

      {/* Tier cards */}
      <section className={`${CONTAINER} py-14 lg:py-16`}>
        <div className="mb-8">
          <h2 style={h2Style}>Free-Item Tiers</h2>
          <p style={subStyle}>Free items apply automatically at checkout — no coupon codes required.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {TIERS.map(tier => {
            const highlighted = tier.badge === "Best Value";
            return (
              <div
                key={tier.qty}
                className="relative flex flex-col"
                style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: "26px 24px",
                  border: highlighted ? `1px solid ${COBALT}` : HAIR,
                }}
              >
                {tier.badge && (
                  <span
                    className="absolute uppercase"
                    style={{
                      top: 18, right: 18, fontSize: 10, fontWeight: 500, letterSpacing: "0.08em",
                      borderRadius: 9999, padding: "3px 9px",
                      ...(highlighted
                        ? { background: COBALT, color: "#fff" }
                        : { background: "#F8F4EF", color: COBALT }),
                    }}
                  >
                    {tier.badge}
                  </span>
                )}
                <p className="uppercase" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", color: GRAPHITE, margin: "0 0 14px" }}>
                  at {tier.qty} items
                </p>
                <p style={{ fontSize: 22, fontWeight: 600, color: INK, letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 6px", paddingRight: tier.badge ? 72 : 0 }}>
                  {tier.freebie}
                </p>
                <p style={{ fontSize: 13.5, fontWeight: 500, color: COBALT, margin: "0 0 12px" }}>
                  {tier.label}
                </p>
                <p style={{ fontSize: 13.5, color: GRAPHITE, lineHeight: 1.6, margin: 0 }}>
                  {tier.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Referred customer note */}
        <div className="mt-5 flex items-start gap-4" style={{ borderRadius: 16, padding: "20px 22px", background: "#F2F0EB", border: HAIR }}>
          <span className="flex shrink-0 items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "#F8F4EF", color: COBALT }}>
            <Lightbulb size={18} aria-hidden="true" />
          </span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: INK, margin: "0 0 4px" }}>
              Note for referred customers
            </p>
            <p style={{ fontSize: 13.5, color: GRAPHITE, lineHeight: 1.65, margin: 0 }}>
              If you arrived via a referral link, your first order still receives the <strong style={{ color: INK, fontWeight: 600 }}>10% referral discount</strong> — and Bundle & Save free items apply on top, at every order, with no exceptions. Hit 3-4 items for a free 10ml Bac Water ampule, 5-9 for a free peptide, or 10+ for 2 free peptides — one reward per order, based on that order's own tier.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: "#F2F0EB", borderTop: HAIR, borderBottom: HAIR }}>
        <div className={`${CONTAINER} py-14 lg:py-16`}>
          <div className="mb-8">
            <h2 style={h2Style}>How It Works</h2>
            <p style={subStyle}>No effort required — just shop and save.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} style={{ background: "#fff", borderRadius: 16, padding: "24px", border: HAIR }}>
                  <div className="mb-5 flex items-center justify-between">
                    <span className="flex items-center justify-center rounded-xl" style={{ width: 40, height: 40, background: "#F8F4EF", color: COBALT }}>
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span style={{ fontFamily: "var(--app-font-mono)", fontSize: 12, color: GRAPHITE, letterSpacing: "0.04em" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <p style={{ fontSize: 16, fontWeight: 600, color: INK, letterSpacing: "-0.01em", margin: "0 0 8px" }}>
                    {s.title}
                  </p>
                  <p style={{ fontSize: 13.5, color: GRAPHITE, lineHeight: 1.65, margin: 0 }}>
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Savings examples + why bundle */}
      <section className={`${CONTAINER} py-14 lg:py-16`}>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 style={{ ...h2Style, marginBottom: 24 }}>Example Savings</h2>
            <div className="flex flex-col gap-3">
              {examples.map((ex) => (
                <div
                  key={ex.label}
                  className="flex flex-wrap items-center justify-between gap-3"
                  style={{ background: "#fff", borderRadius: 16, padding: "18px 22px", border: HAIR }}
                >
                  <div>
                    <p style={{ fontSize: 14.5, fontWeight: 600, color: INK, margin: "0 0 2px" }}>{ex.label}</p>
                    <p style={{ fontSize: 12.5, color: GRAPHITE, margin: 0 }}>{ex.freebie}</p>
                  </div>
                  <span
                    className="whitespace-nowrap"
                    style={{ fontSize: 13, fontWeight: 500, color: COBALT, background: "#F8F4EF", borderRadius: 9999, padding: "5px 12px" }}
                  >
                    {ex.saving === null ? "Loading price…" : `Worth £${ex.saving.toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 style={{ ...h2Style, marginBottom: 24 }}>Why Bundle?</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "No coupon codes needed",
                "Stacks with sale pricing",
                "Any peptide combination",
                "Applies at checkout instantly",
                "Mix categories freely",
                "No minimum order value",
              ].map(f => (
                <div
                  key={f}
                  className="flex items-center gap-2.5"
                  style={{ padding: "14px 16px", borderRadius: 12, background: "#fff", border: HAIR }}
                >
                  <CheckCircle2 size={16} style={{ color: COBALT, flexShrink: 0 }} aria-hidden="true" />
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: INK }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: HAIR, background: "#F2F0EB" }}>
        <div className={`${CONTAINER} py-14 lg:py-16 flex flex-col gap-6 md:flex-row md:items-center md:justify-between`}>
          <div className="max-w-xl">
            <h2 style={h2Style}>Ready to start bundling?</h2>
            <p style={subStyle}>
              Browse all 81 verified peptides and build your research stack. Discounts kick in automatically.
            </p>
          </div>
          <Link href="/all-peptides" className={`${primaryBtn} self-start md:self-auto`} style={{ background: INK, textDecoration: "none" }}>
            Shop All Peptides <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
