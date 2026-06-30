import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { BookOpen, ExternalLink, Search, Filter, X, ChevronRight, FlaskConical, FileText, Beaker, BarChart2, Microscope } from "lucide-react";
import { references, peptideNames, categories, studyTypes, type StudyType, type Reference } from "@/data/references";

const TYPE_COLORS: Record<StudyType, { bg: string; text: string; border: string }> = {
  "Clinical Trial":    { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Phase 2/3 Trial":  { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  "Review":           { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  "Preclinical":      { bg: "#F5F3FF", text: "#6D28D9", border: "#DDD6FE" },
  "Meta-Analysis":    { bg: "#FFF1F2", text: "#BE123C", border: "#FECDD3" },
  "Case Study":       { bg: "#F0FDFA", text: "#0F766E", border: "#99F6E4" },
};

const TYPE_ICON: Record<StudyType, React.ReactNode> = {
  "Clinical Trial":   <FlaskConical size={11} />,
  "Phase 2/3 Trial":  <BarChart2 size={11} />,
  "Review":           <BookOpen size={11} />,
  "Preclinical":      <Beaker size={11} />,
  "Meta-Analysis":    <FileText size={11} />,
  "Case Study":       <Microscope size={11} />,
};

function TypeBadge({ type }: { type: StudyType }) {
  const c = TYPE_COLORS[type];
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {TYPE_ICON[type]}
      {type}
    </span>
  );
}

function ReferenceCard({ ref: r }: { ref: Reference }) {
  const [expanded, setExpanded] = useState(false);
  const shortAbstract = r.abstract.length > 220 ? r.abstract.slice(0, 220).trimEnd() + "…" : r.abstract;
  const productSlug = r.peptide.toLowerCase().replace(/\s+/g, "-").replace(/[()]/g, "");

  return (
    <article
      className="rounded-2xl p-5 flex flex-col gap-3 transition-shadow"
      style={{
        background: "#fff",
        border: "1px solid #E8EDF5",
        boxShadow: "0 2px 12px rgba(15,23,42,0.05)",
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <TypeBadge type={r.type} />
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}>
          {r.category}
        </span>
        <span className="ml-auto text-xs font-semibold" style={{ color: "#94A3B8" }}>{r.year}</span>
      </div>

      <a
        href={r.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-bold leading-snug hover:underline"
        style={{ fontFamily: "'Arimo', Arial, sans-serif", fontSize: 15, color: "#0F172A", textDecoration: "none" }}
      >
        {r.title}
      </a>

      <p className="text-xs" style={{ color: "#64748B" }}>
        <span className="font-semibold">{r.authors}</span>
        {" · "}
        <em>{r.journal}</em>
        {r.pmid && <span style={{ color: "#94A3B8" }}>{" · "}PMID: {r.pmid}</span>}
      </p>

      <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>
        {expanded ? r.abstract : shortAbstract}
        {r.abstract.length > 220 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 font-semibold hover:underline"
            style={{ color: "#1B5CB5", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {expanded ? " Show less" : " Read more"}
          </button>
        )}
      </p>

      <div className="flex flex-wrap items-center gap-2 mt-1">
        {r.tags.slice(0, 4).map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "#EFF6FF", color: "#1D4ED8", border: "1px solid #DBEAFE" }}>
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid #F1F5F9" }}>
        <Link
          href={`/all-peptides?search=${encodeURIComponent(r.peptide)}`}
          className="text-xs font-semibold hover:underline flex items-center gap-1"
          style={{ color: "#1B5CB5" }}
        >
          <FlaskConical size={12} />
          {r.peptide}
        </Link>
        <a
          href={r.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors hover:opacity-90"
          style={{ backgroundColor: "#1B5CB5", color: "#fff" }}
        >
          View on PubMed
          <ExternalLink size={11} />
        </a>
      </div>
    </article>
  );
}

export default function ResearchLibraryPage() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const defaultPeptide = params.get("peptide") ?? "";

  const [query, setQuery] = useState("");
  const [selectedPeptide, setSelectedPeptide] = useState(defaultPeptide);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return references.filter(r => {
      if (selectedPeptide && r.peptide !== selectedPeptide) return false;
      if (selectedCategory && r.category !== selectedCategory) return false;
      if (selectedType && r.type !== selectedType) return false;
      if (q) {
        const haystack = [r.title, r.authors, r.journal, r.abstract, r.peptide, ...r.tags].join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [query, selectedPeptide, selectedCategory, selectedType]);

  const activeFilters = [
    selectedPeptide && { label: selectedPeptide, clear: () => setSelectedPeptide("") },
    selectedCategory && { label: selectedCategory, clear: () => setSelectedCategory("") },
    selectedType && { label: selectedType, clear: () => setSelectedType("") },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  const totalStudies = references.length;
  const totalPeptides = peptideNames.length;
  const journals = new Set(references.map(r => r.journal)).size;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F8FC" }}>
      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #0F2D6B 0%, #1B5CB5 100%)" }} className="py-14 px-4">
        <div className="max-w-[1180px] mx-auto">
          <nav className="flex items-center gap-1.5 text-xs mb-6 opacity-70" style={{ color: "#BAD3FF" }}>
            <Link href="/" style={{ color: "inherit" }}>Home</Link>
            <ChevronRight size={12} />
            <span style={{ color: "#fff" }}>Research Library</span>
          </nav>

          <div className="flex items-start gap-4 mb-6">
            <div className="rounded-xl p-3 flex-shrink-0" style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
              <BookOpen size={28} color="#fff" />
            </div>
            <div>
              <h1 className="font-bold text-white mb-1" style={{ fontFamily: "'Arimo', Arial, sans-serif", fontSize: 30 }}>
                Scientific Reference Library
              </h1>
              <p className="opacity-80 text-sm max-w-xl" style={{ color: "#BAD3FF" }}>
                Peer-reviewed research for every peptide compound we carry — curated from PubMed, NEJM, The Lancet, and other leading journals.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-4 mb-8">
            {[
              { value: totalStudies, label: "Studies indexed" },
              { value: totalPeptides, label: "Compounds covered" },
              { value: journals, label: "Journals" },
            ].map(s => (
              <div key={s.label} className="rounded-xl px-4 py-2.5" style={{ backgroundColor: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <span className="text-xl font-bold text-white block" style={{ fontFamily: "'Arimo', Arial, sans-serif" }}>{s.value}</span>
                <span className="text-xs opacity-70" style={{ color: "#BAD3FF" }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-2xl">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" color="#1B5CB5" />
            <input
              type="text"
              placeholder="Search by peptide, keyword, author or journal…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full rounded-xl pl-10 pr-4 py-3 text-sm outline-none"
              style={{
                backgroundColor: "#fff",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#0F172A",
                boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                fontFamily: "'Arimo', Arial, sans-serif",
              }}
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1180px] mx-auto px-4 py-8">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
            style={{
              backgroundColor: showFilters ? "#1B5CB5" : "#fff",
              color: showFilters ? "#fff" : "#1B5CB5",
              border: "1px solid #1B5CB5",
            }}
          >
            <Filter size={14} />
            Filters
            {activeFilters.length > 0 && (
              <span className="rounded-full px-1.5 py-0.5 text-xs font-bold" style={{ backgroundColor: showFilters ? "rgba(255,255,255,0.25)" : "#EFF6FF" }}>
                {activeFilters.length}
              </span>
            )}
          </button>

          {activeFilters.map(f => (
            <span
              key={f.label}
              className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
              style={{ backgroundColor: "#EFF6FF", color: "#1D4ED8", border: "1px solid #BFDBFE" }}
            >
              {f.label}
              <button onClick={f.clear} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, display: "flex" }}>
                <X size={11} />
              </button>
            </span>
          ))}

          <span className="ml-auto text-sm font-semibold" style={{ color: "#64748B" }}>
            {filtered.length} {filtered.length === 1 ? "study" : "studies"} found
          </span>
        </div>

        {showFilters && (
          <div
            className="rounded-2xl p-5 mb-6 grid gap-4"
            style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}
          >
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "#94A3B8" }}>Compound</label>
              <select
                value={selectedPeptide}
                onChange={e => setSelectedPeptide(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1px solid #E2E8F0", color: "#0F172A", backgroundColor: "#F8FAFC" }}
              >
                <option value="">All compounds</option>
                {peptideNames.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "#94A3B8" }}>Research Area</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1px solid #E2E8F0", color: "#0F172A", backgroundColor: "#F8FAFC" }}
              >
                <option value="">All areas</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "#94A3B8" }}>Study Type</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm"
                style={{ border: "1px solid #E2E8F0", color: "#0F172A", backgroundColor: "#F8FAFC" }}
              >
                <option value="">All types</option>
                {studyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Quick peptide pills */}
        {!selectedPeptide && (
          <div className="flex flex-wrap gap-2 mb-6">
            {peptideNames.map(name => {
              const count = references.filter(r => r.peptide === name).length;
              return (
                <button
                  key={name}
                  onClick={() => setSelectedPeptide(name)}
                  className="rounded-full px-3 py-1.5 text-xs font-semibold transition-colors hover:opacity-80"
                  style={{ backgroundColor: "#fff", color: "#1B5CB5", border: "1px solid #BFDBFE" }}
                >
                  {name}
                  <span className="ml-1.5 opacity-60">{count}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto mb-4 opacity-20" color="#1B5CB5" />
            <p className="font-semibold text-base" style={{ color: "#64748B" }}>No studies match your filters</p>
            <p className="text-sm mt-1" style={{ color: "#94A3B8" }}>Try clearing filters or adjusting your search</p>
            <button
              onClick={() => { setQuery(""); setSelectedPeptide(""); setSelectedCategory(""); setSelectedType(""); }}
              className="mt-4 text-sm font-semibold hover:underline"
              style={{ color: "#1B5CB5", background: "none", border: "none", cursor: "pointer" }}
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 520px), 1fr))" }}>
            {filtered.map(r => <ReferenceCard key={r.id} ref={r} />)}
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-10 rounded-2xl p-5 text-xs leading-relaxed" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA", color: "#92400E" }}>
          <strong>Research Use Disclaimer:</strong> All studies referenced in this library are provided solely for educational and informational purposes. References to published research do not constitute claims about the efficacy, safety, or suitability of any compound for human use. All products sold by OmniQure Peptide Research Institute are strictly for in-vitro research and laboratory use only. Consult a qualified medical professional before considering any peptide for any purpose.
        </div>
      </div>
    </div>
  );
}
