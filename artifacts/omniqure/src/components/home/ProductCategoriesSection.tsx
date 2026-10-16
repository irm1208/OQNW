import { Link } from "wouter";
import { ArrowRight, BadgeCheck, FlaskConical, Truck } from "lucide-react";
import { Container } from "./HomeSections";

type Category = { title: string; subtitle: string; category: string; image: string };

const catalogueHref = (category: string) => `/all-peptides?category=${encodeURIComponent(category)}`;

/* Transparent vial cutouts generated from the studio renders. */
const cutout = (name: string) => `/reference/categories/${name}.webp`;

const FEATURED: (Category & { bg: string })[] = [
  { title: "Healing Peptides", subtitle: "BPC-157, TB-500 & fragments", category: "Healing Peptides", image: cutout("healing"), bg: "radial-gradient(120% 120% at 75% 40%, #4FA37E 0%, #2E7A5B 45%, #1C5A42 100%)" },
  { title: "Growth Peptides", subtitle: "Ipamorelin, CJC-1295 & more", category: "Growth Peptides", image: cutout("growth"), bg: "radial-gradient(120% 120% at 75% 40%, #D29C74 0%, #A86F4C 45%, #7E4F34 100%)" },
  { title: "Cellular Health", subtitle: "NAD+, MOTS-C & SS-31", category: "Cellular Health", image: cutout("cellular"), bg: "radial-gradient(120% 120% at 75% 40%, #8DBBEA 0%, #4F88C9 45%, #2D5E9E 100%)" },
];

const MORE: Category[] = [
  { title: "Nootropics", subtitle: "Semax & Selank", category: "Nootropics", image: cutout("nootropics") },
  { title: "Immune Support", subtitle: "Thymosin Alpha-1 & LL-37", category: "Immune Support", image: cutout("immune") },
  { title: "Skin & Repair", subtitle: "GHK-Cu copper peptide", category: "Skin & Repair", image: cutout("skin") },
  { title: "Peptide Blends", subtitle: "Multi-compound vials", category: "Peptide Blends", image: cutout("blends") },
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
            <h2 className="font-bold" style={{ fontSize: "clamp(32px, 4.4vw, 60px)", lineHeight: 1.02, letterSpacing: "-0.03em", color: "var(--ink)" }}>
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

        <div className="grid gap-4 md:grid-cols-3">
          {FEATURED.map(card => (
            <Link
              key={card.title}
              href={catalogueHref(card.category)}
              className="group relative flex min-h-[240px] lg:min-h-[290px] flex-col justify-between overflow-hidden rounded-[22px] p-6 lg:p-8 text-white shadow-sm transition-shadow hover:shadow-lg"
              style={{ background: card.bg }}
            >
              <div className="relative z-10 max-w-[58%]">
                <h3 className="font-semibold" style={{ fontSize: "clamp(22px, 2vw, 28px)", lineHeight: 1.15, letterSpacing: "-0.02em" }}>{card.title}</h3>
                <p className="mt-1.5" style={{ fontSize: 14, color: "rgba(255,255,255,0.85)" }}>{card.subtitle}</p>
              </div>
              <span className="relative z-10 inline-flex items-center gap-3 font-semibold uppercase" style={{ fontSize: 12.5, letterSpacing: "0.16em" }}>
                Learn more <ArrowCircle light />
              </span>
              <img
                src={card.image}
                alt=""
                loading="lazy"
                width={376}
                height={817}
                className="pointer-events-none absolute right-[7%] top-[24%] h-[96%] w-auto drop-shadow-[0_18px_30px_rgba(0,0,0,0.28)] transition-transform duration-700 group-hover:-translate-y-1.5"
              />
            </Link>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MORE.map(card => (
            <Link
              key={card.title}
              href={catalogueHref(card.category)}
              className="group flex items-center gap-3 rounded-[18px] border bg-white p-4 pl-5 shadow-[0_2px_10px_rgba(4,11,34,0.05)] transition-shadow hover:shadow-md"
              style={{ borderColor: "var(--hairline)" }}
            >
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold leading-snug" style={{ fontSize: 16.5, color: "var(--ink)", letterSpacing: "-0.01em" }}>{card.title}</h3>
                <p className="mt-1 leading-snug" style={{ fontSize: 13, color: "var(--graphite)" }}>{card.subtitle}</p>
              </div>
              <img
                src={card.image}
                alt=""
                loading="lazy"
                width={376}
                height={817}
                className="h-[92px] w-auto shrink-0 drop-shadow-[0_6px_10px_rgba(4,11,34,0.12)] transition-transform group-hover:-translate-y-0.5"
              />
              <span style={{ color: "var(--ink)" }}><ArrowCircle /></span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
