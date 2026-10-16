import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useProducts } from "@/context/ProductsContext";
import { useCurrency } from "@/context/CurrencyContext";
import { groupProducts, parseName, type GroupedProduct } from "@/data/groupedProducts";
import { studioImage, studioFallback, STUDIO_BG } from "@/lib/studioImage";
import { Container } from "./HomeSections";

type Pick = { slug: string; note: string; badge?: string };
type Tab = { id: string; label: string; intro: string; cta: { label: string; href: string }; picks: Pick[] };

const TABS: Tab[] = [
  {
    id: "blends",
    label: "blends",
    intro: "Multi-peptide research blends, combined in a single lyophilised vial.",
    cta: { label: "shop research blends", href: "/all-peptides?category=Peptide%20Blends" },
    picks: [
      { slug: "klow-blend-80mg", note: "BPC-157, TB-500, KPV & GHK-Cu", badge: "best seller" },
      { slug: "glow-blend-70mg", note: "BPC-157, TB-500 & GHK-Cu" },
      { slug: "bpc-157-tb-500-blend-10mg", note: "BPC-157 & TB-500 in one vial" },
    ],
  },
  {
    id: "singles",
    label: "singles",
    intro: "The core repair-pathway compounds, supplied as single-peptide vials.",
    cta: { label: "shop healing peptides", href: "/all-peptides?category=Healing%20Peptides" },
    picks: [
      { slug: "bpc-157-5mg", note: "Pentadecapeptide, 15 amino acids", badge: "best seller" },
      { slug: "tb-500-5mg", note: "Thymosin Beta-4 fragment" },
      { slug: "bpc-157-tb-500-blend-10mg", note: "Both compounds, one vial" },
    ],
  },
];

function RangeCard({ group, slug, note, badge }: { group: GroupedProduct; slug: string; note: string; badge?: string }) {
  const { formatPrice } = useCurrency();
  const variant = group.variants.find(v => v.slug === slug) ?? group.variants[0];
  const prices = group.variants.map(v => v.price).filter((p): p is number => p != null);
  const fromPrice = prices.length ? Math.min(...prices) : null;
  const strength = parseName(variant.name).strength;
  const purity = group.variants.find(v => v.purity)?.purity;
  const href = `/product/${variant.slug || variant.id}`;

  return (
    <article className="snap-start shrink-0 w-[78%] sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)] flex flex-col">
      <Link href={href} className="group relative block aspect-square overflow-hidden rounded-[22px]" style={{ background: STUDIO_BG }}>
        <img
          src={studioImage(group.image)}
          onError={studioFallback(group.cardImage || group.image)}
          alt={`${group.baseName} research peptide vial`}
          loading="lazy"
          width={1254}
          height={1254}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
        {strength && (
          <span className="absolute left-4 top-4 rounded-full border border-dashed bg-white/70 px-3 py-1.5 font-semibold leading-none" style={{ fontSize: 12, color: "var(--ink)", borderColor: "var(--ink)" }}>
            {strength}
          </span>
        )}
        {badge && (
          <span className="absolute right-4 top-4 flex flex-col h-[72px] w-[72px] items-center justify-center rounded-full text-center font-semibold leading-tight" style={{ fontSize: 13, background: "var(--ice)", color: "var(--ink)" }}>
            {badge.split(" ").map(w => <span key={w} className="block">{w}</span>)}
          </span>
        )}
      </Link>
      <div className="mt-4 grid grid-cols-[1fr_auto] gap-x-3 gap-y-1">
        <Link href={href} className="font-bold leading-snug hover:text-[var(--cobalt)] transition-colors" style={{ fontSize: 17, color: "var(--ink)", letterSpacing: "-0.015em" }}>
          {group.baseName}
        </Link>
        <span className="self-center text-right font-semibold whitespace-nowrap" style={{ fontSize: 12, color: "var(--cobalt)" }}>
          {purity ? `${purity} HPLC` : "Lab tested"}
        </span>
        <span style={{ fontSize: 13.5, color: "var(--graphite)" }}>{group.category}</span>
        <span className="text-right font-bold tabular-nums whitespace-nowrap" style={{ fontSize: 13.5, color: "var(--ink)" }}>
          {fromPrice != null ? `From ${formatPrice(fromPrice)}` : "See options"}
        </span>
        <span className="leading-snug" style={{ fontSize: 13, color: "var(--graphite)" }}>{note}</span>
        <Link href={href} className="self-start text-right underline underline-offset-2 hover:text-[var(--cobalt)]" style={{ fontSize: 13, color: "var(--ink)" }} aria-label={`Learn more about ${group.baseName}`}>
          learn more
        </Link>
      </div>
    </article>
  );
}

/* Tabbed product rail: intro panel followed by a scrolling row of featured vials. */
export default function FeaturedRangeSection() {
  const { products } = useProducts();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const rail = useRef<HTMLDivElement>(null);
  const baseId = useId();

  const groups = groupProducts(products);
  const tab = TABS[active];
  const cards = tab.picks
    .map(pick => {
      const product = products.find(p => p.slug === pick.slug);
      const group = product && groups.find(g => g.baseName === parseName(product.name).baseName);
      return group ? { ...pick, group } : null;
    })
    .filter((c): c is NonNullable<typeof c> => c != null);

  const select = (i: number) => {
    setActive(i);
    rail.current?.scrollTo({ left: 0 });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (active + delta + TABS.length) % TABS.length;
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="border-b bg-white py-12 lg:py-20" style={{ borderColor: "var(--hairline)" }}>
      <Container>
        <h2 className="text-center font-medium" style={{ fontSize: "clamp(30px, 4.2vw, 56px)", lineHeight: 1.05, letterSpacing: "-0.035em", color: "var(--ink)" }}>
          Our lab-verified compounds
        </h2>

        <div role="tablist" aria-label="Product range" className="mx-auto mt-6 flex w-max border-b-2" style={{ borderColor: "var(--bone)" }}>
          {TABS.map((t, i) => (
            <button
              key={t.id}
              ref={el => { tabRefs.current[i] = el; }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`${baseId}-panel`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={onKeyDown}
              className="-mb-[2px] border-b-[3px] px-4 pb-3 font-semibold transition-colors"
              style={{
                fontSize: 18,
                color: i === active ? "var(--ink)" : "var(--graphite)",
                borderColor: i === active ? "var(--ink)" : "transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div id={`${baseId}-panel`} role="tabpanel" aria-labelledby={`${baseId}-tab-${tab.id}`} className="mt-8 lg:mt-10 flex flex-col lg:flex-row gap-4">
          <div className="flex flex-col justify-between gap-8 rounded-[22px] p-7 lg:p-10 lg:w-[30%] lg:shrink-0" style={{ background: "var(--ice)" }}>
            <p className="font-medium" style={{ fontSize: "clamp(22px, 2.2vw, 30px)", lineHeight: 1.25, letterSpacing: "-0.025em", color: "var(--ink)" }}>
              {tab.intro}
            </p>
            <Link
              href={tab.cta.href}
              className="inline-flex w-max items-center gap-3 rounded-full border-2 px-5 py-2.5 font-semibold transition-colors hover:bg-[var(--ink)] hover:text-white"
              style={{ fontSize: 14, color: "var(--ink)", borderColor: "var(--ink)" }}
            >
              {tab.cta.label} <ArrowRight size={16} />
            </Link>
          </div>

          <div ref={rail} className="flex min-w-0 flex-1 gap-4 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {cards.map(c => (
              <RangeCard key={`${tab.id}-${c.slug}`} group={c.group} slug={c.slug} note={c.note} badge={c.badge} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
