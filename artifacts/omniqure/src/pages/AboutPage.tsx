import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { BUNDLE_FREE_BAC_THRESHOLD, BUNDLE_FREE_ONE_THRESHOLD, BUNDLE_FREE_TWO_THRESHOLD } from "@/context/CartContext";
import {
  FlaskConical, ShieldCheck, Truck, Microscope, Globe, ArrowRight, ArrowUpRight,
  CheckCircle, Beaker, Target, BadgeCheck, FileText, Zap, Snowflake, Lock, Gift, Droplets, Plus, ShoppingBag,
} from "lucide-react";

const STATS = [
  { value: "81+", label: "Unique peptide compounds" },
  { value: "99%+", label: "Independent result purity" },
  { value: "100%", label: "Reports published" },
  { value: "500+", label: "Orders fulfilled" },
];

const PILLARS = [
  { icon: Microscope, title: "Verified purity", body: "Every compound is tested by accredited laboratories using High-Performance Liquid Chromatography. We publish certificates of analysis for all products, with no hidden results." },
  { icon: Beaker, title: "Pharmaceutical-grade synthesis", body: "Synthesised in GMP-compliant facilities using pharmaceutical-grade reagents. Lyophilised vials maintain stability for up to 24 months under correct storage." },
  { icon: ShieldCheck, title: "Transparent testing", body: "We don't just claim quality. We prove it through independently published Janoshik reports." },
  { icon: Truck, title: "Reliable worldwide shipping", body: "Dispatched the same or next business day with full tracking, to research institutions across Europe, North America, Asia Pacific and the Middle East." },
  { icon: Target, title: "Research-first approach", body: "Every product description, protocol guide and research stack is written with scientific rigour, with literature references and no overstated claims." },
  { icon: Globe, title: "Global research community", body: "Serving independent researchers, academic institutions and pharmaceutical companies across 40+ countries, with multilingual support and multi-currency checkout." },
];

const TIMELINE = [
  { icon: FlaskConical, title: "Built from a research gap", body: "Founded by researchers who struggled to source high-purity peptides with transparent documentation, not just a purity number and a price." },
  { icon: Microscope, title: "Every batch tested", body: "Our testing programme came before our first order. Every compound is independently verified, mass-confirmed and documented." },
  { icon: Beaker, title: "81+ compounds", body: "From BPC-157 and TB-500 to GLP-1 receptor agonists, covering growth, healing, longevity, cognition and metabolic research." },
  { icon: Globe, title: "Trusted worldwide", body: "Supplying researchers in 40+ countries, with support that understands the science behind the compounds we sell." },
];

const VALUES = [
  "Publish independent Janoshik reports, with no selective disclosure",
  "Never overstate efficacy claims beyond peer-reviewed data",
  "Respond to support queries within 1–2 business days",
  "Retest batches that fall below our purity threshold",
];

const RUO = [
  { icon: Lock, text: "Not for human consumption or veterinary use" },
  { icon: BadgeCheck, text: "Purchasers must be 18+ qualified researchers" },
  { icon: FileText, text: "All products comply with RUO regulations" },
];

const eyebrow = { fontSize: 11, letterSpacing: "0.22em", color: "var(--cobalt)" } as const;
const ink = { color: "var(--ink)" } as const;
const graphite = { color: "var(--graphite)" } as const;
const container = "relative w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12";

export default function AboutPage() {
  useSEO({
    title: "About OmniQure — Verified Research Peptides",
    description: "Learn about OmniQure's mission to supply verified research peptides with full transparency. Founded by researchers. Trusted by institutions worldwide.",
    canonicalPath: "/about",
  });

  return (
    <div style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", background: "#fff" }}>
      {/* Hero */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: "var(--hairline)", background: "linear-gradient(135deg, rgba(244,246,250,0.5), #fff 50%, #FFF6F2)" }}>
        <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full blur-3xl" style={{ background: "rgba(59, 98, 171,0.10)" }} />
        <div className={`${container} pt-14 pb-14 lg:pt-24 lg:pb-20`}>
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <p className="mb-7 uppercase" style={eyebrow}>About OmniQure</p>
              <h1 className="font-bold tracking-tight" style={{ ...ink, fontSize: "clamp(44px, 5.8vw, 83px)", lineHeight: 0.92 }}>
                Research peptides, held to a higher standard.
              </h1>
              <p className="mt-8 max-w-xl text-[17px] lg:text-[18.5px] leading-relaxed" style={graphite}>
                OmniQure was founded on a single belief: researchers deserve peptide suppliers that are as rigorous about quality documentation as they are about their own work. Every vial we ship is independently verified, mass-confirmed and backed by a published Janoshik report.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Link href="/all-peptides" className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--ink)" }}>
                  Shop <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link href="/lab-reports" className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors hover:text-[var(--ink)]" style={graphite}>
                  <FlaskConical size={16} style={{ color: "var(--cobalt)" }} aria-hidden="true" /> View published lab results
                </Link>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="overflow-hidden rounded-[26px] border bg-white p-1.5" style={{ borderColor: "rgba(255,255,255,0.6)", boxShadow: "0 25px 50px -12px rgba(11,18,32,0.18)" }}>
                  <img src="/sunburst/hdr-about-mobile.webp" alt="OmniQure build-your-own-bundle box holding eight research vials" className="block h-auto w-full rounded-[20px]" width={900} height={1125} />
                </div>
                <div className="absolute -left-3 bottom-5 inline-flex items-center gap-2 rounded-2xl px-3.5 py-2.5 backdrop-blur" style={{ background: "rgba(255,255,255,0.9)", boxShadow: "0 8px 24px rgba(11,18,32,0.10)" }}>
                  <ShieldCheck size={16} style={{ color: "var(--cobalt)" }} aria-hidden="true" />
                  <span className="text-[12.5px] font-bold" style={ink}>99%+ HPLC purity</span>
                </div>
                <div className="absolute -right-3 top-5 inline-flex items-center gap-2 rounded-2xl px-3.5 py-2.5 backdrop-blur" style={{ background: "rgba(11,18,32,0.9)" }}>
                  <BadgeCheck size={16} className="text-white" aria-hidden="true" />
                  <span className="text-[12.5px] font-bold text-white">Janoshik verified</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 border-t pt-7 lg:mt-16" style={{ borderColor: "var(--hairline)" }}>
            {[
              { i: Microscope, t: "Independent third-party lab" },
              { i: Beaker, t: "GMP-compliant synthesis" },
              { i: FileText, t: "Published Janoshik reports" },
              { i: Zap, t: "Same-day dispatch" },
            ].map(({ i: Icon, t }) => (
              <span key={t} className="inline-flex items-center gap-2 text-[12.5px] font-medium" style={graphite}>
                <Icon size={16} style={{ color: "var(--cobalt)" }} aria-hidden="true" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b text-white" style={{ borderColor: "var(--hairline)", background: "var(--ink)" }}>
        <div className={`${container} py-12 lg:py-16`}>
          <div className="grid grid-cols-2 gap-y-9 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="lg:px-10 lg:first:pl-0">
                <p className="font-bold tracking-tight" style={{ fontSize: "clamp(38px, 3.8vw, 54px)", lineHeight: 1.5, background: "linear-gradient(to bottom, #fff, rgba(255,255,255,0.7))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {s.value}
                </p>
                <p className="mt-2 uppercase leading-relaxed" style={{ fontSize: 10.5, letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className={`${container} py-16 lg:py-28`}>
        <div className="mb-12 grid gap-8 lg:mb-16 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <p className="mb-5 uppercase" style={eyebrow}>How we operate</p>
            <h2 className="font-bold tracking-tight" style={{ ...ink, fontSize: "clamp(34px, 3.8vw, 54px)", lineHeight: 0.98 }}>
              Six pillars.<br />Every order.
            </h2>
          </div>
          <p className="self-end text-[16px] leading-relaxed lg:col-span-5 lg:col-start-8" style={graphite}>
            Every part of our operation is built around one outcome: delivering peptides that researchers can rely on, whether you order one vial or fifty.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {PILLARS.map((p, i) => (
            <div key={p.title} className="relative overflow-hidden rounded-[22px] border p-8" style={{ borderColor: "rgba(11,18,32,0.07)", background: "linear-gradient(to bottom, #fff, rgba(244,246,250,0.5))" }}>
              <span className="absolute right-6 top-6 text-[12px] tabular-nums" style={{ color: "rgba(74,85,104,0.25)" }}>{String(i + 1).padStart(2, "0")}</span>
              <span className="grid h-[52px] w-[52px] place-items-center rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(59, 98, 171,0.15), rgba(59, 98, 171,0.05))", color: "var(--cobalt)" }}>
                <p.icon size={23} aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-[18px] font-bold tracking-tight" style={ink}>{p.title}</h3>
              <p className="mt-2.5 text-[14px] leading-[1.75]" style={graphite}>{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / standards */}
      <section className="relative overflow-hidden border-y text-white" style={{ borderColor: "var(--hairline)", background: "var(--ink)" }}>
        <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full blur-3xl" style={{ background: "rgba(59, 98, 171,0.15)" }} />
        <div className={`${container} py-16 lg:py-28`}>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="mb-5 uppercase" style={eyebrow}>Our mission</p>
              <h2 className="font-bold tracking-tight" style={{ fontSize: "clamp(32px, 3.6vw, 51px)", lineHeight: 0.98 }}>
                Quality you can verify, not just trust.
              </h2>
              <p className="mt-7 text-[15.5px] leading-[1.8]" style={{ color: "rgba(255,255,255,0.65)" }}>
                The difference between 95% and 99%+ purity can materially affect experimental outcomes. OmniQure publishes independent data for every compound in our catalogue and invites you to scrutinise it.
              </p>
              <ul className="mt-6 space-y-2.5">
                {VALUES.map((v) => (
                  <li key={v} className="flex items-start gap-2.5 text-[13.5px]" style={{ color: "rgba(255,255,255,0.75)" }}>
                    <CheckCircle size={16} className="mt-0.5 shrink-0" style={{ color: "#6B94D0" }} aria-hidden="true" /> {v}
                  </li>
                ))}
              </ul>
              <Link href="/lab-reports" className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-semibold ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/15" style={{ background: "rgba(255,255,255,0.1)" }}>
                View lab reports <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6 lg:col-start-7 lg:gap-5">
              {TIMELINE.map((t, i) => (
                <div key={t.title} className="rounded-[22px] p-6 ring-1 ring-inset ring-white/10" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl ring-1 ring-inset ring-white/10" style={{ background: "rgba(255,255,255,0.06)", color: "#B4D89C" }}>
                      <t.icon size={22} aria-hidden="true" />
                    </span>
                    <span className="text-[12px] tabular-nums" style={{ color: "rgba(255,255,255,0.3)" }}>{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mb-1.5 text-[16.5px] font-bold tracking-tight">{t.title}</h3>
                  <p className="text-[13.5px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.55)" }}>{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Research use only feature */}
      <section className={`${container} py-16 lg:py-24`}>
        <div className="grid overflow-hidden rounded-2xl border bg-white lg:grid-cols-2" style={{ borderColor: "var(--hairline)" }}>
          <div className="relative aspect-[4/3] lg:aspect-auto" style={{ background: "rgba(11,18,32,0.05)" }}>
            <img src="/reference/articles/storage.webp" alt="Lyophilised research peptide vials" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </div>
          <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-10">
            <p className="mb-3 uppercase" style={{ fontSize: 11, fontWeight: 500, lineHeight: 1, letterSpacing: "0.12em", color: "var(--cobalt)" }}>Research use only</p>
            <h3 className="font-bold tracking-tight" style={{ ...ink, fontSize: "clamp(26px, 2.4vw, 32px)", lineHeight: 1.05 }}>
              In-vitro research. No exceptions.
            </h3>
            <p className="mt-4 text-[13.5px] leading-[1.8] sm:text-[14px]" style={graphite}>
              All OmniQure compounds are intended strictly for in-vitro laboratory research by qualified scientists. We do not condone, support or facilitate human or animal administration. This distinction is fundamental, not a legal footnote.
            </p>
            <ul className="mt-6 grid gap-3">
              {RUO.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-[13px] font-medium" style={ink}>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: "rgba(59, 98, 171,0.1)", color: "var(--cobalt)" }}>
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  {text}
                </li>
              ))}
              <li className="flex items-center gap-3 text-[13px] font-medium" style={ink}>
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: "rgba(59, 98, 171,0.1)", color: "var(--cobalt)" }}>
                  <Snowflake size={16} aria-hidden="true" />
                </span>
                Lyophilised and sealed for stability in transit
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Build a kit */}
      <section className={`${container} pb-16 lg:pb-24`}>
        <div className="relative overflow-hidden rounded-[32px] border px-7 py-12 sm:px-12 lg:px-14 lg:py-14" style={{ borderColor: "rgba(11,18,32,0.07)", background: "linear-gradient(135deg, rgba(244,246,250,0.7), #fff 55%, #FFF6F2)" }}>
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl" style={{ background: "rgba(59, 98, 171,0.10)" }} />
          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="mb-5 uppercase" style={eyebrow}>Bundle &amp; save</p>
              <h2 className="font-bold tracking-tight" style={{ ...ink, fontSize: "clamp(32px, 3.6vw, 51px)", lineHeight: 0.98 }}>
                Build your kit.<br />Get up to <span style={{ color: "var(--cobalt)" }}>2 free</span>.
              </h2>
              <p className="mt-6 max-w-md text-[16px] leading-relaxed" style={graphite}>
                Add {BUNDLE_FREE_BAC_THRESHOLD} or more peptides to a single order and free items apply automatically at checkout. The more you add, the more you get.
              </p>
              <Link href="/bundle-and-save" className="mt-8 inline-flex items-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--ink)" }}>
                <ShoppingBag size={18} aria-hidden="true" /> Shop
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 lg:gap-4">
              {[
                { icon: Droplets, big: "Free", sub: "bac water", n: BUNDLE_FREE_BAC_THRESHOLD },
                { icon: Gift, big: "1", sub: "free peptide", n: BUNDLE_FREE_ONE_THRESHOLD },
                { icon: Gift, big: "2", sub: "free peptides", n: BUNDLE_FREE_TWO_THRESHOLD },
              ].map((t) => (
                <div key={t.n} className="rounded-[22px] border bg-white p-4 text-center sm:p-6" style={{ borderColor: "rgba(11,18,32,0.07)", boxShadow: "0 1px 2px rgba(11,18,32,0.04)" }}>
                  <span className="inline-grid h-11 w-11 place-items-center rounded-xl" style={{ background: "linear-gradient(135deg, rgba(59, 98, 171,0.15), rgba(59, 98, 171,0.05))", color: "var(--cobalt)" }}>
                    <t.icon size={20} aria-hidden="true" />
                  </span>
                  <p className="mt-3 font-bold leading-none tracking-tight" style={{ ...ink, fontSize: "clamp(28px, 2.6vw, 40px)" }}>{t.big}</p>
                  <p className="mt-1.5 flex items-center justify-center gap-1 text-[13px] font-semibold" style={ink}>
                    <Plus size={12} aria-hidden="true" /> {t.n} peptides
                  </p>
                  <p className="mt-0.5 text-[11.5px]" style={graphite}>{t.sub}, applied automatically</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`${container} pb-16 lg:pb-24`}>
        <div className="relative overflow-hidden rounded-[32px] px-8 py-14 text-white sm:px-12 lg:px-16 lg:py-20" style={{ background: "linear-gradient(135deg, var(--cobalt), #0E2F8A)" }}>
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full blur-3xl" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div className="relative flex flex-col gap-9 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-bold tracking-tight" style={{ fontSize: "clamp(32px, 3.6vw, 51px)", lineHeight: 0.98 }}>Ready to order?</h2>
              <p className="mt-5 text-[16px] leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
                Browse our full catalogue of 81+ verified peptides, review published Janoshik reports and check out in your preferred currency.
              </p>
              <p className="mt-4 text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                Supplied strictly for in-vitro laboratory research use only. Not for human or veterinary use. Must be 18+ and a qualified researcher to purchase.
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link href="/all-peptides" className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold transition-opacity hover:opacity-90" style={ink}>
                Shop <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full px-6 py-4 text-[14.5px] font-semibold ring-1 ring-inset ring-white/35 transition-colors hover:bg-white/10">
                Contact us <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
