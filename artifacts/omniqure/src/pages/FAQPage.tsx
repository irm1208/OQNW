import { useState, useMemo, useEffect } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import PageHero from "@/components/PageHero";
import { FAQS, type FAQItem } from "@/data/faqs";
import {
  HelpCircle, Search, X, Plus, ArrowRight,
  FlaskConical, Package, Truck, Banknote, Shield,
  Thermometer, Droplets, BookOpen, MessageCircle
} from "lucide-react";

type FAQCategory = {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
};


const CATEGORIES: FAQCategory[] = [
  { id: "all",      label: "All Questions",   icon: <HelpCircle size={14} />,  color: "#475569" },
  { id: "products", label: "Products & Purity", icon: <FlaskConical size={14} />, color: "#4E68C2" },
  { id: "research", label: "Research & Usage", icon: <BookOpen size={14} />,   color: "#059669" },
  { id: "storage",  label: "Storage & Handling", icon: <Thermometer size={14} />, color: "#7C3AED" },
  { id: "ordering", label: "Ordering & Payment", icon: <Banknote size={14} />, color: "#D97706" },
  { id: "shipping", label: "Shipping & Delivery", icon: <Truck size={14} />,   color: "#0891B2" },
  { id: "returns",  label: "Returns & Support",  icon: <Shield size={14} />,   color: "#DC2626" },
];

const CAT_COLOR: Record<string, string> = {
  products: "#4E68C2",
  research: "#059669",
  storage:  "#7C3AED",
  ordering: "#D97706",
  shipping: "#0891B2",
  returns:  "#DC2626",
};


function AccordionItem({ item, isOpen, onToggle, id }: {
  item: FAQItem;
  isOpen: boolean;
  onToggle: () => void;
  id: number;
}) {
  return (
    <div className="border-b" style={{ borderColor: "var(--hairline)" }}>
      <h3 className="m-0">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={`faq-a-${id}`}
          className="flex w-full items-start justify-between gap-6 py-5 text-left transition-colors hover:text-[var(--cobalt)]"
          style={{ color: "var(--ink)" }}
        >
          <span className="text-[15px] font-semibold leading-snug tracking-tight">{item.q}</span>
          <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border transition-transform" style={{ borderColor: "var(--hairline)", transform: isOpen ? "rotate(45deg)" : "none", color: isOpen ? "var(--cobalt)" : "var(--graphite)" }}>
            <Plus size={13} aria-hidden="true" />
          </span>
        </button>
      </h3>
      {isOpen && (
        <div id={`faq-a-${id}`} className="pb-5 pr-12 text-[14px] leading-[1.75]" style={{ color: "var(--graphite)" }}>
          {item.a}
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  useSEO({
    title: "Frequently Asked Questions",
    description: "Common questions about OmniQure research peptides — purity, independent testing, storage, reconstitution, ordering, shipping, and returns. Research use only.",
    canonicalPath: "/faq",
  });

  useEffect(() => {
    let el = document.querySelector<HTMLScriptElement>('script[data-seo="faqpage"]');
    if (!el) {
      el = document.createElement("script");
      el.setAttribute("type", "application/ld+json");
      el.setAttribute("data-seo", "faqpage");
      document.head.appendChild(el);
    }
    el.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map(item => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    });
    return () => { document.querySelector('script[data-seo="faqpage"]')?.remove(); };
  }, []);

  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return FAQS.filter((item, i) => {
      const catMatch = activeCategory === "all" || item.category === activeCategory;
      if (!q) return catMatch;
      const textMatch =
        item.q.toLowerCase().includes(q) ||
        (typeof item.a === "string" && item.a.toLowerCase().includes(q)) ||
        (item.tags ?? []).some(t => t.includes(q));
      return catMatch && textMatch;
    });
  }, [activeCategory, search]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: FAQS.length };
    for (const item of FAQS) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const toggle = (i: number) => setOpenId(openId === i ? null : i);
  const reset = () => { setSearch(""); setActiveCategory("all"); setOpenId(null); };
  const groups = activeCategory === "all" && !search
    ? CATEGORIES.filter((c) => c.id !== "all").map((c) => ({ cat: c, items: FAQS.filter((f) => f.category === c.id) })).filter((g) => g.items.length)
    : [{ cat: null, items: filtered }];

  return (
    <div style={{ fontFamily: "'Poppins', ui-sans-serif, system-ui, -apple-system, sans-serif", background: "#fff" }}>
      <PageHero image={{ key: "hdr-contact", alt: "OmniQure vial beside a thank-you card" }}
        crumbs={[{ label: "FAQ" }]}
        eyebrow="Help centre"
        title="Questions, answered."
        aside={
          <div className="relative w-full lg:w-[380px]">
            <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "var(--graphite)" }} aria-hidden="true" />
            <input
              type="search"
              aria-label="Search questions"
              placeholder="Search questions…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOpenId(null); }}
              className="w-full rounded-full border bg-white py-3 pl-11 pr-10 text-[14px] outline-none transition-colors focus:border-[var(--cobalt)]"
              style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
            />
            {search && (
              <button type="button" aria-label="Clear search" onClick={() => { setSearch(""); setOpenId(null); }} className="absolute right-3 top-1/2 -translate-y-1/2 p-1" style={{ color: "var(--graphite)" }}>
                <X size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        }
      >
        Everything you need to know about our research peptides, independent testing, storage, ordering and shipping.
      </PageHero>

      <section className="w-full max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12 py-10 lg:py-14">
        <div className="grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="FAQ categories" className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="mb-3 hidden uppercase lg:block" style={{ fontSize: 10, letterSpacing: "0.18em", color: "var(--graphite)" }}>Categories</p>
            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:gap-0.5 lg:overflow-visible">
              {CATEGORIES.map((cat) => {
                const active = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => { setActiveCategory(cat.id); setOpenId(null); }}
                    className="flex shrink-0 items-center justify-between gap-3 whitespace-nowrap rounded-full border px-4 py-2 text-[13px] transition-colors lg:rounded-lg lg:border-0 lg:px-3"
                    style={active
                      ? { background: "var(--ink)", borderColor: "var(--ink)", color: "#fff", fontWeight: 600 }
                      : { borderColor: "var(--hairline)", color: "var(--graphite)" }}
                  >
                    {cat.label}
                    <span className="text-[11px] tabular-nums" style={{ opacity: 0.6 }}>{categoryCounts[cat.id] ?? 0}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div>
            <p className="mb-2 text-[12px]" style={{ color: "var(--graphite)" }} aria-live="polite">
              {search ? <>{filtered.length} result{filtered.length !== 1 ? "s" : ""} for “{search}”</> : <>{filtered.length} question{filtered.length !== 1 ? "s" : ""}</>}
              {(search || activeCategory !== "all") && (
                <button type="button" onClick={reset} className="ml-3 underline underline-offset-2 hover:text-[var(--ink)]">Clear</button>
              )}
            </p>

            {filtered.length === 0 ? (
              <div className="rounded-2xl border px-6 py-14 text-center" style={{ borderColor: "var(--hairline)" }}>
                <HelpCircle size={36} className="mx-auto mb-3" style={{ color: "rgba(74,85,104,0.35)" }} aria-hidden="true" />
                <p className="text-[16px] font-semibold" style={{ color: "var(--ink)" }}>No questions found</p>
                <p className="mt-1 text-[13px]" style={{ color: "var(--graphite)" }}>Try a different search term or category.</p>
                <button type="button" onClick={reset} className="mt-5 rounded-full px-5 py-2.5 text-[13px] font-semibold text-white" style={{ background: "var(--ink)" }}>
                  Show all questions
                </button>
              </div>
            ) : (
              groups.map(({ cat, items }) => (
                <div key={cat?.id ?? "results"} className="mb-10 last:mb-0">
                  {cat && (
                    <h2 className="mb-1 mt-6 flex items-center gap-2 border-b pb-3 uppercase first:mt-0" style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", color: "var(--cobalt)", borderColor: "var(--hairline)" }}>
                      {cat.label}
                    </h2>
                  )}
                  {items.map((item) => {
                    const i = FAQS.indexOf(item);
                    return <AccordionItem key={i} id={i} item={item} isOpen={openId === i} onToggle={() => toggle(i)} />;
                  })}
                </div>
              ))
            )}

            <div className="mt-14 flex flex-col gap-6 rounded-2xl border p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8" style={{ borderColor: "rgba(59, 98, 171,0.15)", background: "#E3EEFC" }}>
              <div className="flex items-start gap-4">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white" style={{ color: "var(--cobalt)" }}>
                  <MessageCircle size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[17px] font-bold tracking-tight" style={{ color: "var(--ink)" }}>Still have a question?</p>
                  <p className="mt-1 text-[13.5px] leading-relaxed" style={{ color: "var(--graphite)" }}>
                    Our research desk is available via live chat or the contact form. We respond within one business day.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2.5">
                <Link href="/contact" className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13.5px] font-semibold text-white transition-opacity hover:opacity-90" style={{ background: "var(--ink)" }}>
                  Contact us <ArrowRight size={14} aria-hidden="true" />
                </Link>
                <Link href="/protocols" className="inline-flex items-center rounded-full border bg-white px-5 py-2.5 text-[13.5px] font-semibold transition-colors hover:bg-[#F4F6FA]" style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}>
                  Protocols
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
