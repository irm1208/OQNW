import { useRef, useState, type ReactNode } from "react";
import { Link } from "wouter";
import {
  ArrowRight, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, Building2, Star,
} from "lucide-react";
import { useBlogPosts } from "@/hooks/useBlog";
import { STUDIO_BG } from "@/lib/studioImage";

/* Shared editorial primitives, modelled on a clean lab-catalogue aesthetic */
export function Eyebrow({ children, center = false }: { children: ReactNode; center?: boolean }) {
  return (
    <p className={`home-eyebrow ${center ? "home-eyebrow--center" : ""}`}>
      {children}
    </p>
  );
}

export function SectionTitle({ children, center = false, size = "clamp(24px, 3vw, 40px)" }: { children: ReactNode; center?: boolean; size?: string }) {
  return (
    <h2
      className={`font-bold ${center ? "text-center mx-auto" : ""}`}
      style={{ fontSize: size, lineHeight: 0.93, letterSpacing: "-0.025em", color: "var(--ink)", margin: 0 }}
    >
      {children}
    </h2>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 ${className}`}>{children}</div>;
}

const sectionBase = "border-b py-12 lg:py-20";
const hairline = { borderColor: "var(--hairline)" } as const;

/* ── 1. Why OmniQure: six numbered value cards ─────────────────── */
/* ── 2. Best sellers header (grid supplied by caller) ─────────── */
export function BestSellersSection({ children }: { children: ReactNode }) {
  return (
    <section className={`${sectionBase} bg-white`} style={hairline}>
      <Container>
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <Eyebrow>Best sellers</Eyebrow>
            <SectionTitle size="clamp(30px, 4vw, 52px)">Most ordered<br />peptides.</SectionTitle>
          </div>
          <Link href="/all-peptides" className="hidden sm:inline-flex items-center gap-1.5 font-medium hover:text-[var(--cobalt)] transition-colors" style={{ fontSize: 13, color: "var(--graphite)" }}>
            Full catalogue <ArrowUpRight size={15} />
          </Link>
        </div>
        {children}
      </Container>
    </section>
  );
}
/* ── 3. Bundle builder banner ─────────────────────────────────── */
const TIERS = [
  { qty: "3–4 vials", reward: "Free 10ml BAC water" },
  { qty: "5–9 vials", reward: "1 peptide free" },
  { qty: "10+ vials", reward: "2 peptides free" },
];

export function BundleBanner({ image }: { image?: string }) {
  return (
    <section className="home-bundle" aria-labelledby="home-bundle-title">
      <div className="pinstripe" aria-hidden="true" />
      <div className="home-bundle__inner">
        <div className="home-bundle__copy">
          <p className="home-eyebrow home-eyebrow--dark">Bundle &amp; save</p>
          <h2 id="home-bundle-title" className="home-bundle__title">Build your own bundle.</h2>
          <p className="home-bundle__lead">
            Mix any compounds across the catalogue. Free items are added to your cart automatically as you reach each tier.
          </p>
          <dl className="home-bundle__tiers">
            {TIERS.map((t) => (
              <div key={t.qty}>
                <dt>{t.qty}</dt>
                <dd>{t.reward}</dd>
              </div>
            ))}
          </dl>
          <div className="home-bundle__actions">
            <Link href="/bundle-and-save" className="home-btn home-btn--light">
              Start building <ArrowRight size={16} />
            </Link>
            <Link href="/all-peptides" className="home-btn home-btn--ghost">Browse catalogue</Link>
          </div>
        </div>
        {image && (
          <div className="home-bundle__media">
            <picture>
              <source media="(max-width: 767px)" srcSet={image.replace("-wide", "-mobile")} width={1080} height={1350} />
              <img src={image} alt="OmniQure build-your-own-bundle box holding eight research vials" width={1600} height={800} loading="lazy" />
            </picture>
          </div>
        )}
      </div>
    </section>
  );
}

/* ── 3b. Intranasal format row ─────────────────────────────────── */
const NASAL_FORMATS = [
  { id: "bpc-157-nasal-spray", name: "BPC-157 Nasal Spray", desc: "Pentadecapeptide — intranasal", image: "/reference/nasal/bpc-157.webp" },
  { id: "bpc-157-tb-500-nasal-spray", name: "BPC-157 + TB-500 Nasal Spray", desc: "Dual-peptide nasal blend", image: "/reference/nasal/bpc-157-tb-500.webp" },
  { id: "dsip-nasal-spray", name: "DSIP Nasal Spray", desc: "Synthetic nonapeptide", image: "/reference/nasal/dsip.webp" },
  { id: "glow-nasal-spray", name: "Glow Nasal Spray", desc: "Peptide nasal blend", image: "/reference/nasal/glow.webp" },
  { id: "kisspeptin-nasal-spray", name: "Kisspeptin Nasal Spray", desc: "Synthetic neuropeptide", image: "/reference/nasal/kisspeptin.webp" },
  { id: "nad-500-nasal-spray", name: "NAD+ 500 Nasal Spray", desc: "Nicotinamide adenine dinucleotide", image: "/reference/nasal/nad-500.webp" },
  { id: "oxytocin-nasal-spray", name: "Oxytocin Nasal Spray", desc: "Synthetic peptide spray", image: "/reference/nasal/oxytocin.webp" },
  { id: "pt-141-nasal-spray", name: "PT-141 Nasal Spray", desc: "Melanocortin research peptide", image: "/reference/nasal/pt-141.webp" },
  { id: "selank-nasal-spray", name: "Selank Nasal Spray", desc: "Tuftsin-analogue heptapeptide", image: "/reference/nasal/selank.webp" },
  { id: "semax-nasal-spray", name: "Semax Nasal Spray", desc: "Nootropic peptide formula", image: "/reference/nasal/semax.webp" },
  { id: "nasal-tanners", name: "Nasal Tanners", desc: "Nasal tanning mist", image: "/reference/nasal/nasal-tanners.webp" },
  { id: "melanotan-ii-nasal-spray", name: "Melanotan II Nasal Spray", desc: "Research nasal spray", image: "/reference/nasal/melanotan-ii.webp" },
];

export function NasalSpraysSection() {
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (direction: number) => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth";
    rail.current?.scrollBy({ left: direction * 450, behavior });
  };

  return (
    <section className="border-b bg-white overflow-hidden" style={hairline}>
      <Container className="py-12 lg:py-16">
        <div className="flex items-end justify-between gap-3 mb-6">
          <div>
            <Eyebrow>New · intranasal format</Eyebrow>
            <SectionTitle size="clamp(24px, 2.6vw, 34px)">Research nasal sprays</SectionTitle>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <Link href="/all-peptides" className="inline-flex items-center gap-1.5 font-medium text-[var(--cobalt)]" style={{ fontSize: 13 }}>
              View all <ArrowUpRight size={14} />
            </Link>
            <div className="hidden sm:flex gap-1.5">
              <button type="button" onClick={() => scroll(-1)} aria-label="Scroll nasal sprays left" className="h-9 w-9 inline-flex items-center justify-center rounded-full border hover:bg-[var(--bone)]"><ChevronLeft size={16} /></button>
              <button type="button" onClick={() => scroll(1)} aria-label="Scroll nasal sprays right" className="h-9 w-9 inline-flex items-center justify-center rounded-full border hover:bg-[var(--bone)]"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
        <div ref={rail} className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NASAL_FORMATS.map(({ id, name, desc, image }) => (
            <Link key={id} href="/all-peptides" className="group snap-start shrink-0 w-[160px] sm:w-[210px] overflow-hidden rounded-xl border bg-white transition-shadow hover:shadow-md" style={hairline}>
              <div className="aspect-[4/5] overflow-hidden" style={{ background: STUDIO_BG }}>
                <img
                  src={image}
                  alt={`${name} research-use-only nasal spray`}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="p-3.5">
                <p className="font-semibold truncate text-[13.5px] sm:text-[14.5px]" style={{ color: "var(--ink)" }}>{name}</p>
                <p className="mt-0.5 truncate" style={{ fontSize: 11, color: "var(--graphite)" }}>{desc}</p>
                <p className="mt-2.5 font-medium" style={{ fontSize: 11, color: "var(--graphite)" }}>Explore the catalogue →</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── 4b. Quality carousel: horizontally scrolling claim cards ──── */
const QUALITY = [
  { title: "Independent HPLC testing", body: "Batches are sent to Janoshik for HPLC and mass-spec analysis before they are released for sale." },
  { title: "Published lab reports", body: "Reports are published on product pages so you can confirm identity and purity for the material you receive." },
  { title: "Same-day dispatch", body: "Order before 12:00 and it ships the same working day." },
  { title: "Free tracked UK delivery", body: "Tracked shipping across mainland UK, the Highlands and Northern Ireland." },
  { title: "Sealed, labelled vials", body: "Each compound is lyophilised, sealed in an individually labelled vial and packed discreetly." },
];

export function QualitySection() {
  return (
    <section className="border-b bg-white overflow-hidden" style={hairline}>
      <Container className="py-14 lg:py-20">
        <div className="mb-8">
          <Eyebrow>Why researchers choose us</Eyebrow>
          <h2 className="font-bold" style={{ fontSize: "clamp(26px, 3vw, 44px)", lineHeight: 0.93, letterSpacing: "-0.025em", color: "var(--ink)", margin: 0 }}>
            Lab-tested quality,<br className="hidden sm:block" /> shipped the same day.
          </h2>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20" style={{ background: "linear-gradient(to left, #fff, transparent)" }} />
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="list">
            {QUALITY.map(q => (
              <div key={q.title} role="listitem" className="snap-start shrink-0 w-[75%] sm:w-[46%] lg:w-[30%] flex flex-col rounded-xl border bg-white p-5" style={hairline}>
                <p className="font-bold" style={{ fontSize: 15, color: "var(--ink)" }}>{q.title}</p>
                <p className="mt-2 flex-1 text-[13px] sm:text-[13.5px]" style={{ lineHeight: 1.75, color: "var(--graphite)" }}>{q.body}</p>
              </div>
            ))}
            <div className="shrink-0 w-1" aria-hidden="true" />
          </div>
        </div>
      </Container>
    </section>
  );
}

/* ── 4. Process: three connected steps ─────────────────────────── */
const STEPS = [
  { title: "Independently tested", body: "Batches are sent to Janoshik for HPLC and mass-spec analysis. Reports are published on product pages." },
  { title: "Sealed and labelled", body: "Each compound is lyophilised, sealed in an individually labelled vial and packed discreetly." },
  { title: "Same-day dispatch", body: "Order before 12:00 and it ships the same working day with free tracked UK delivery." },
];

export function ProcessSection() {
  return (
    <section className="border-b bg-white" style={hairline}>
      <Container className="py-14 lg:py-24">
        <div className="text-center mb-12 lg:mb-16">
          <Eyebrow center>Process</Eyebrow>
          <h2 className="font-semibold leading-none" style={{ fontSize: "clamp(26px, 3vw, 44px)", letterSpacing: "-0.025em", color: "var(--ink)" }}>From synthesis to your lab.</h2>
        </div>
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-0">
          <div className="hidden lg:block absolute top-[22px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px" style={{ background: "rgba(47, 79, 140,0.2)" }} />
          {STEPS.map((st, i) => (
            <div key={st.title} className="relative flex flex-col lg:items-center lg:text-center lg:px-8">
              <div className="flex items-center gap-4 lg:flex-col mb-4 lg:mb-5">
                <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white" style={{ border: "2px solid rgba(47, 79, 140,0.2)" }}>
                  <span className="font-semibold tabular-nums" style={{ fontSize: 11, color: "var(--cobalt)" }}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="font-semibold" style={{ fontSize: 16, letterSpacing: "-0.025em", color: "var(--ink)" }}>{st.title}</h3>
              </div>
              <p style={{ fontSize: 13.5, lineHeight: 1.8, color: "var(--graphite)" }}>{st.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── 5. Institutional / larger orders ──────────────────────────── */
export function InstitutionalSection() {
  return (
    <section className="border-b bg-white" style={hairline}>
      <Container className="py-14 lg:py-20">
        <div className="overflow-hidden rounded-2xl" style={{ background: "oklch(0.93 0.035 240)" }}>
          <div className="grid lg:grid-cols-2">
            <div className="p-8 sm:p-10 lg:p-12">
              <p className="uppercase mb-6" style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--graphite)" }}>Wholesale, contract research &amp; custom synthesis</p>
              <h2 className="font-bold" style={{ fontSize: "clamp(24px, 2.8vw, 44px)", lineHeight: 0.93, letterSpacing: "-0.025em", color: "var(--ink)" }}>
                Wholesale, contract research &amp; custom synthesis.
              </h2>
              <p className="mt-5" style={{ fontSize: 14, lineHeight: 1.85, color: "var(--graphite)" }}>
                Need a larger run, custom synthesis or a recurring supply agreement? Tell us what you need and our team will come back to you with availability, volume and delivery options.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 px-8 pt-8 pb-10 text-center sm:px-10 sm:pt-10 lg:items-start lg:border-l lg:px-12 lg:py-12 lg:text-left border-t lg:border-t-0" style={{ borderColor: "rgba(47, 79, 140,0.15)" }}>
              <p className="uppercase" style={{ fontSize: 12, letterSpacing: "0.14em", color: "var(--graphite)" }}>Get in touch</p>
              <Link href="/contact" className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 font-semibold text-white transition-colors sm:w-auto bg-[var(--cobalt)] hover:bg-[var(--cobalt-dark)]" style={{ fontSize: 14 }}>
                Contact our team <ArrowRight size={15} />
              </Link>
              <div className="flex items-center gap-2.5">
                <Building2 size={15} style={{ color: "var(--graphite)" }} />
                <Link href="/lab-reports" className="transition-colors hover:text-[var(--ink)]" style={{ fontSize: 13, color: "var(--graphite)" }}>Browse lab reports</Link>
              </div>
              <p style={{ fontSize: 12, color: "var(--graphite)" }}>We aim to reply within 24 hours on business days.</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
/* ── 6. FAQ: minimal hairline accordion ────────────────────────── */
export function FaqSection({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className={sectionBase} style={{ ...hairline, background: "rgba(239,244,252,0.25)" }}>
      <Container>
        <div className="mb-10 lg:mb-12 text-center">
          <Eyebrow center>FAQ</Eyebrow>
          <SectionTitle center>Frequently asked questions.</SectionTitle>
        </div>
        <div className="mx-auto max-w-[768px] border-t" style={hairline}>
          {items.map((item, i) => {
            const isOpen = open === i;
            const id = `home-faq-${i}`;
            return (
              <div key={item.q} className="border-b" style={hairline}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={id}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-6 py-5 text-left"
                >
                  <span className="font-semibold" style={{ fontSize: 15, color: "var(--ink)" }}>{item.q}</span>
                  <ChevronDown size={17} className="shrink-0 transition-transform" style={{ color: "var(--graphite)", transform: isOpen ? "rotate(180deg)" : "none" }} />
                </button>
                {isOpen && (
                  <p id={id} className="pb-6 pr-10" style={{ fontSize: 14.5, lineHeight: 1.75, color: "var(--graphite)" }}>{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-8 text-center" style={{ fontSize: 13.5, color: "var(--graphite)" }}>
          Still have a question?{" "}
          <Link href="/contact" className="font-semibold underline-offset-4 hover:underline" style={{ color: "var(--cobalt)" }}>Contact our team</Link>
        </p>
      </Container>
    </section>
  );
}

/* ── 7. From the lab: latest blog posts ────────────────────────── */
function readMinutes(text: string | null) {
  const words = (text ?? "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 40));
}

/* Studio photography used when a post has no featured image. */
const BLOG_FALLBACKS = ["/reference/articles/storage.webp", "/reference/articles/glp1.webp", "/reference/articles/peptide-bonds.webp"];

const STATIC_LAB_NOTES = [
  {
    id: -1,
    title: "Peptide storage and stability: keeping research material viable",
    slug: "peptide-storage-and-stability",
    excerpt: "A practical reference for lyophilised storage, temperature control and handling between experiments.",
    author: "OmniQure laboratory team",
    tags: ["Lab handling"],
    featuredImageUrl: null,
    publishedAt: null,
    createdAt: "",
  },
  {
    id: -2,
    title: "GLP-1 research peptides compared: retatrutide, tirzepatide and the receptor profile",
    slug: "glp-1-research-peptides-compared",
    excerpt: "How the principal GLP-1 research compounds differ in pathway selectivity and study design.",
    author: "OmniQure laboratory team",
    tags: ["Research notes"],
    featuredImageUrl: null,
    publishedAt: null,
    createdAt: "",
  },
  {
    id: -3,
    title: "Peptide bundles explained: when mixed stacks make sense",
    slug: "peptide-bundles-explained",
    excerpt: "A concise guide to planning a multi-compound research run and documenting each material in the stack.",
    author: "OmniQure laboratory team",
    tags: ["Research planning"],
    featuredImageUrl: null,
    publishedAt: null,
    createdAt: "",
  },
];

export function FromTheLabSection() {
  const { data } = useBlogPosts(3, 0);
  const posts = data?.posts?.length ? data.posts : STATIC_LAB_NOTES;
  return (
    <section className={sectionBase} style={{ ...hairline, background: "rgba(239,244,252,0.35)" }}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10 lg:mb-12">
          <div>
            <Eyebrow>From the lab</Eyebrow>
            <SectionTitle size="clamp(26px, 2.3vw, 32px)">Research notes &amp; guides</SectionTitle>
          </div>
          <Link href="/blog" className="inline-flex items-center gap-1.5 font-medium hover:text-[var(--cobalt)]" style={{ fontSize: 14, color: "var(--ink)" }}>
            All articles <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((p, i) => (
            <Link key={p.id} href={p.id < 0 ? "/blog" : `/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border bg-white transition-shadow hover:shadow-[0_8px_30px_rgba(4,11,34,0.07)]" style={hairline}>
              <div className="aspect-[16/9] overflow-hidden" style={{ background: "var(--ice)" }}>
                <img src={p.featuredImageUrl || BLOG_FALLBACKS[i % BLOG_FALLBACKS.length]} alt={p.title} width={1600} height={900} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="uppercase" style={{ fontSize: 10.5, letterSpacing: "0.14em", color: "var(--graphite)" }}>
                  {(p.tags?.[0] ?? "Research notes")} · {readMinutes(p.excerpt)} min read
                </p>
                <h3 className="mt-3 font-semibold group-hover:text-[var(--cobalt)] transition-colors" style={{ fontSize: 16.5, lineHeight: 1.35, color: "var(--ink)" }}>{p.title}</h3>
                {p.excerpt && (
                  <p className="mt-3 line-clamp-3" style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--graphite)" }}>{p.excerpt}</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── 8. Reviews: compact trust carousel-style grid ────────────── */
const REVIEWS = [
  { quote: "The purity reports are easy to find and the order arrived the next working day. Exactly what a research supplier should be.", author: "Verified researcher", date: "2 days ago" },
  { quote: "Clear labelling, discreet packaging and fast dispatch. I have already placed several repeat orders.", author: "Verified researcher", date: "1 week ago" },
  { quote: "Good catalogue and prompt support when I needed a certificate for a batch.", author: "Verified researcher", date: "2 weeks ago" },
  { quote: "Reliable delivery and the vials were packed securely. The quality documentation is a real advantage.", author: "Verified researcher", date: "3 weeks ago" },
];

export function ReviewsSection() {
  return (
    <section className={sectionBase} style={{ ...hairline, background: "#fff" }}>
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-5 mb-10 lg:mb-12">
          <div>
            <Eyebrow>Verified customer reviews</Eyebrow>
            <SectionTitle size="clamp(26px, 3vw, 44px)">What researchers say about us.</SectionTitle>
            <div className="mt-4 flex items-center gap-3">
              <span role="img" className="flex items-center gap-0.5" aria-label="Rated 4.9 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => <Star key={i} size={14} fill="#00B67A" color="#00B67A" strokeWidth={1.5} />)}
              </span>
              <span className="font-semibold" style={{ fontSize: 13, color: "#007A56" }}>Trustpilot</span>
              <span style={{ fontSize: 12, color: "var(--graphite)" }}>4.9 out of 5</span>
            </div>
          </div>
          <a href="https://www.trustpilot.com/review/omniqure.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold hover:text-[var(--cobalt)]" style={{ fontSize: 13.5, color: "var(--ink)" }}>
            Read all reviews <ArrowUpRight size={14} />
          </a>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {REVIEWS.map((review, i) => (
            <article key={review.quote} className={`rounded-[6px] border bg-white p-5 ${i >= 2 ? 'hidden md:block' : ''}`} style={hairline}>
              <div role="img" className="flex items-center gap-0.5" aria-label="Rated 5 out of 5 stars">
                {Array.from({ length: 5 }, (_, i) => <Star key={i} size={13} fill="#00B67A" color="#00B67A" strokeWidth={1.5} />)}
              </div>
              <p className="mt-4" style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--ink)" }}>{review.quote}</p>
              <div className="mt-5 flex items-center justify-between gap-3 border-t pt-3" style={{ borderColor: "var(--hairline)" }}>
                <span style={{ fontSize: 11.5, color: "var(--graphite)" }}>{review.author}</span>
                <span style={{ fontSize: 10.5, color: "var(--graphite)" }}>{review.date}</span>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

/* ── 8. Research-use notice ────────────────────────────────────── */
export function ResearchNotice() {
  const para = { fontSize: 12.5, lineHeight: 1.9, color: "var(--graphite)" } as const;
  return (
    <section className="border-b" style={{ ...hairline, background: "rgba(239,244,252,0.3)" }}>
      <Container className="py-10 lg:py-14">
        <div className="max-w-3xl">
          <p className="uppercase mb-4" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--graphite)" }}>Important research notice</p>
          <p style={para}>
            Not for human consumption. All OmniQure products are supplied strictly for in-vitro laboratory research. They are not medicines and are not approved for human or veterinary use.
          </p>
          <p className="mt-3" style={para}>
            Information on this site is provided for educational reference only and should not be interpreted as medical advice or product claims.
          </p>
          <p className="mt-3" style={para}>
            By purchasing you confirm you are a qualified researcher and will use these products in accordance with all applicable UK laws and regulations.
          </p>
        </div>
      </Container>
    </section>
  );
}

/* ── Mission: who we are and what we promise (copy from the About page) ── */
const PROMISES = [
  "Publish every Janoshik report, with no selective disclosure",
  "Retest any batch that falls below our purity threshold",
  "Never overstate claims beyond peer-reviewed data",
  "Answer support queries within 1–2 business days",
];

export function MissionSection() {
  return (
    <section className={sectionBase} style={{ ...hairline, background: "var(--oq-chalk)" }}>
      <Container className="mission">
        <div className="mission__media">
          <img
            src="/sunburst/why-delivery.webp"
            srcSet="/sunburst/why-delivery-sm.webp 480w, /sunburst/why-delivery.webp 960w"
            sizes="(min-width: 1024px) 40vw, 100vw"
            alt="An OmniQure BPC-157 vial beside a thank-you card"
            loading="lazy"
            width={960}
            height={1200}
          />
        </div>
        <div className="mission__copy">
          <Eyebrow>Why we exist</Eyebrow>
          <h2 className="mission__title">Built by researchers who couldn't find a supplier they trusted.</h2>
          <p className="mission__lead">
            We kept being sold a purity number and a price, with nothing to back it up. So we started OmniQure on one belief: a supplier should be as rigorous about its documentation as you are about your own work.
          </p>
          <p className="mission__label">Our promises</p>
          <ul className="mission__promises">
            {PROMISES.map((t) => <li key={t}>{t}</li>)}
          </ul>
          <Link href="/about" className="home-btn home-btn--navy mission__cta">
            Our story <ArrowRight size={16} />
          </Link>
        </div>
      </Container>
    </section>
  );
}

/* ── Why OmniQure: three photographs, then six checkable points ─────────── */
const WHY_PHOTO = [
  { image: "why-lab", title: "Every batch tested", body: "HPLC and mass-spec from an independent lab, published as a Janoshik report on the product page.", href: "/lab-reports", cta: "See lab reports" },
  { image: "pack-kit", title: "Labelled for the lab", body: "Lot, expiry, purity and storage on every vial and kit, with a QR code to its product page.", href: "/storage-guide", cta: "Storage guide" },
  { image: "why-storage", title: "Sealed and lyophilised", body: "Freeze-dried and sealed in individually labelled vials, so compounds stay stable in transit.", href: "/storage-guide", cta: "Handling" },
];

const SELLING_POINTS = [
  { stat: "99%+", label: "HPLC purity", body: "Independently tested before it ships." },
  { stat: "1 click", label: "to the COA", body: "Janoshik report and verify link on each product." },
  { stat: "12:00", label: "same-day cut-off", body: "Order before noon on a working day; ships tracked." },
  { stat: "£0", label: "UK delivery", body: "Mainland UK, the Highlands and Northern Ireland." },
  { stat: "2 free", label: "peptides at 10 vials", body: "Free BAC water from 3 vials, a peptide free at 5." },
  { stat: "135", label: "compounds", body: "Repair, growth, metabolic, cognitive and longevity." },
];

export function WhySection() {
  return (
    <section className={sectionBase} style={{ ...hairline, background: "#fff" }}>
      <Container>
        <div className="mb-8 max-w-[640px]">
          <Eyebrow>Why OmniQure</Eyebrow>
          <SectionTitle size="clamp(26px, 3vw, 40px)">Six things you can check before you buy.</SectionTitle>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:gap-5">
          {WHY_PHOTO.map((item) => (
            <Link key={item.title} href={item.href} className="why-card group">
              <span className="why-card__media">
                <img
                  src={`/sunburst/${item.image}.webp`}
                  srcSet={`/sunburst/${item.image}-sm.webp 480w, /sunburst/${item.image}.webp 960w`}
                  sizes="(min-width: 768px) 33vw, 100vw"
                  alt=""
                  loading="lazy"
                  width={960}
                  height={960}
                />
              </span>
              <span className="why-card__body">
                <span className="why-card__title">{item.title}</span>
                <span className="why-card__text">{item.body}</span>
                <span className="why-card__cta">{item.cta} <ArrowRight size={14} aria-hidden="true" /></span>
              </span>
            </Link>
          ))}
        </div>
        <ul className="sell__grid sell__grid--light">
          {SELLING_POINTS.map((p) => (
            <li key={p.label}>
              <span className="sell__item">
                <span className="sell__stat">{p.stat}</span>
                <span className="sell__label">{p.label}</span>
                <span className="sell__body">{p.body}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
