import { Link } from "wouter";
import { ArrowRight, BadgeCheck, FlaskConical, Truck } from "lucide-react";
import { Container, Eyebrow } from "./HomeSections";
import { rangeColourForCategory } from "@/lib/rangeColour";

type Category = { title: string; subtitle: string; category: string; image: string };

const catalogueHref = (category: string) => `/all-peptides?category=${encodeURIComponent(category)}`;

/* Sunburst studio category photographs (4:5, vials centred). Each has a
   960px and a 480px export; the browser picks by rendered width. */
const photo = (name: string) => `/sunburst/cat-${name}.webp`;
const photoSet = (name: string) => `/sunburst/cat-${name}-sm.webp 480w, /sunburst/cat-${name}.webp 960w`;

// Each card is Matte Navy, lit by its range colour (the vial cap colour).
const FEATURED: Category[] = [
  { title: "Healing Peptides", subtitle: "BPC-157, TB-500 & fragments", category: "Healing Peptides", image: "healing" },
  { title: "Growth Peptides", subtitle: "Ipamorelin, CJC-1295 & more", category: "Growth Peptides", image: "growth" },
  { title: "Cellular Health", subtitle: "NAD+, MOTS-C & SS-31", category: "Cellular Health", image: "cellular" },
];

const MORE: Category[] = [
  { title: "Nootropics", subtitle: "Semax & Selank", category: "Nootropics", image: "nootropics" },
  { title: "Immune Support", subtitle: "Thymosin Alpha-1 & LL-37", category: "Immune Support", image: "immune" },
  { title: "Skin & Repair", subtitle: "GHK-Cu copper peptide", category: "Skin & Repair", image: "skin" },
  { title: "Peptide Blends", subtitle: "Multi-compound vials", category: "Peptide Blends", image: "blends" },
];

const POINTS = [
  { icon: FlaskConical, text: "For in-vitro research use only" },
  { icon: Truck, text: "Free tracked UK delivery" },
  { icon: BadgeCheck, text: "99%+ HPLC purity, independently tested" },
];

function ArrowCircle({ light = false }: { light?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-transform group-hover:translate-x-0.5"
      style={{ borderColor: light ? "rgba(255,255,255,0.85)" : "var(--ink)" }}
    >
      <ArrowRight size={14} strokeWidth={2} />
    </span>
  );
}

export default function ProductCategoriesSection() {
  return (
    <section className="border-b bg-white py-12 lg:py-20" style={{ borderColor: "var(--hairline)" }}>
      <Container>
        <div className="mb-8 lg:mb-12 flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div>
            <Eyebrow>Shop by range</Eyebrow>
            <h2 className="font-bold" style={{ fontSize: "clamp(28px, 3.4vw, 44px)", lineHeight: 1.05, letterSpacing: "-0.025em", color: "var(--ink)" }}>
              Research peptides,<br />organised by pathway
            </h2>
            <p className="mt-4" style={{ fontSize: "clamp(15px, 1.5vw, 18px)", color: "var(--graphite)" }}>
              Browse the catalogue by research area.
            </p>
          </div>
          <ul className="flex flex-col gap-3 lg:pt-3">
            {POINTS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5" style={{ fontSize: 14, color: "var(--graphite)" }}>
                <Icon size={16} strokeWidth={1.8} style={{ color: "var(--ink)" }} aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {FEATURED.map(card => (
            <Link
              key={card.title}
              href={catalogueHref(card.category)}
              className="range-card group"
              style={{ "--range": rangeColourForCategory(card.category) } as React.CSSProperties}
            >
              <span className="range-card__media">
                <img
                  src={photo(card.image)}
                  srcSet={photoSet(card.image)}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  alt=""
                  loading="lazy"
                  width={960}
                  height={1200}
                />
              </span>
              <span className="range-card__body">
                <span className="range-card__title">{card.title}</span>
                <span className="range-card__sub">{card.subtitle}</span>
                <span className="range-card__cta">Shop the range <ArrowCircle light /></span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MORE.map(card => (
            <Link
              key={card.title}
              href={catalogueHref(card.category)}
              className="range-mini group"
              style={{ "--range": rangeColourForCategory(card.category) } as React.CSSProperties}
            >
              <span className="range-mini__media">
                <img src={`/sunburst/cat-${card.image}-sm.webp`} alt="" loading="lazy" width={480} height={600} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="range-mini__title">{card.title}</span>
                <span className="range-mini__sub">{card.subtitle}</span>
              </span>
              <span style={{ color: "var(--ink)" }}><ArrowCircle /></span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
