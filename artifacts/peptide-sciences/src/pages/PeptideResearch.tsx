import { useState, useMemo } from "react";
import { Link } from "wouter";
import { peptideResearchData, type PeptideResearchEntry } from "@/data/peptideResearch";
import { Search, ExternalLink, FlaskConical, BookOpen, ChevronRight, X } from "lucide-react";

const CATEGORIES = [
  "All",
  "Growth Peptides",
  "Healing Peptides",
  "Weight Management",
  "Longevity Peptides",
  "Cellular Health",
  "Nootropics",
  "Immune Support",
  "Research Peptides",
  "Peptide Blends",
  "Skin & Repair",
  "Hormonal Peptides",
  "Growth Hormone",
  "Anti-Inflammatory",
  "Cognitive Peptides",
];

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Growth Peptides":    { bg: "#EEF4FF", text: "#1B5CB5", border: "#BFDBFE" },
  "Healing Peptides":  { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0" },
  "Weight Management": { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  "Longevity Peptides":{ bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" },
  "Cellular Health":   { bg: "#ECFEFF", text: "#0E7490", border: "#A5F3FC" },
  "Nootropics":        { bg: "#FFF1F2", text: "#BE185D", border: "#FBCFE8" },
  "Immune Support":    { bg: "#F0FDF4", text: "#166534", border: "#86EFAC" },
  "Research Peptides": { bg: "#F8FAFC", text: "#475569", border: "#CBD5E1" },
  "Peptide Blends":    { bg: "#FFFBEB", text: "#92400E", border: "#FDE68A" },
  "Skin & Repair":     { bg: "#FFF1F2", text: "#9F1239", border: "#FECDD3" },
  "Hormonal Peptides": { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  "Growth Hormone":    { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" },
  "Anti-Inflammatory": { bg: "#FFF7ED", text: "#9A3412", border: "#FDBA74" },
  "Cognitive Peptides":{ bg: "#F5F3FF", text: "#6D28D9", border: "#C4B5FD" },
};

function StudyCard({ study, index }: { study: PeptideResearchEntry["studies"][0]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className="rounded-xl p-4"
      style={{ backgroundColor: "#F8FAFC", border: "1px solid #E8EDF5" }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold mt-0.5"
          style={{ backgroundColor: "#1B5CB5", fontSize: "11px" }}
        >
          {index + 1}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold leading-snug mb-1" style={{ fontSize: "13px", color: "#0F172A" }}>
            {study.title}
          </p>
          <p style={{ fontSize: "11.5px", color: "#64748B" }}>
            {study.authors} — <em>{study.journal}</em>, {study.year}
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-2 text-left"
            style={{ fontSize: "12px", color: "#1B5CB5", fontWeight: 500 }}
          >
            {expanded ? "▲ Hide finding" : "▼ Key finding"}
          </button>
          {expanded && (
            <p className="mt-2 leading-relaxed" style={{ fontSize: "12.5px", color: "#334155" }}>
              {study.finding}
            </p>
          )}
          {(study.doi || study.pmid) && (
            <div className="mt-2 flex items-center gap-1.5">
              <ExternalLink size={11} style={{ color: "#94A3B8" }} />
              {study.doi && (
                <a
                  href={`https://doi.org/${study.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ fontSize: "11px", color: "#64748B" }}
                >
                  doi:{study.doi}
                </a>
              )}
              {study.pmid && !study.doi && (
                <a
                  href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                  style={{ fontSize: "11px", color: "#64748B" }}
                >
                  PMID: {study.pmid}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PeptideCard({ entry }: { entry: PeptideResearchEntry }) {
  const color = CATEGORY_COLORS[entry.category] ?? CATEGORY_COLORS["Research Peptides"];
  return (
    <div
      id={entry.compound.toLowerCase().replace(/\s+/g, "-")}
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#fff", border: "1px solid #E8EDF5", boxShadow: "0 2px 12px rgba(15,23,42,0.05)" }}
    >
      {/* Header */}
      <div className="px-5 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="font-bold" style={{ fontSize: "18px", color: "#0F172A" }}>
              {entry.compound}
            </h2>
            <span
              className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}
            >
              {entry.category}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {entry.productIds.map((pid) => (
              <Link
                key={pid}
                href={`/product/${pid}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors hover:opacity-90"
                style={{ backgroundColor: "#1B5CB5", color: "#fff", fontSize: "12px", textDecoration: "none" }}
              >
                View Product <ChevronRight size={12} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="leading-relaxed mb-4" style={{ fontSize: "13.5px", color: "#475569" }}>
          {entry.description}
        </p>

        {/* Mechanism */}
        <div
          className="rounded-xl px-4 py-3 mb-5"
          style={{ backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}
        >
          <p className="font-semibold mb-1" style={{ fontSize: "11px", color: "#1B5CB5", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Mechanism of Action
          </p>
          <p style={{ fontSize: "12.5px", color: "#1E3A6A", lineHeight: 1.6 }}>
            {entry.mechanism}
          </p>
        </div>

        {/* Studies */}
        <div>
          <p className="font-semibold mb-3 flex items-center gap-2" style={{ fontSize: "12px", color: "#94A3B8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            <BookOpen size={13} /> Research Literature ({entry.studies.length} {entry.studies.length === 1 ? "study" : "studies"})
          </p>
          <div className="space-y-3">
            {entry.studies.map((study, i) => (
              <StudyCard key={i} study={study} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PeptideResearch() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return peptideResearchData.filter((entry) => {
      const catMatch = activeCategory === "All" || entry.category === activeCategory;
      if (!catMatch) return false;
      if (!q) return true;
      return (
        entry.compound.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.studies.some(
          (s) =>
            s.title.toLowerCase().includes(q) ||
            s.authors.toLowerCase().includes(q) ||
            s.journal.toLowerCase().includes(q) ||
            s.finding.toLowerCase().includes(q)
        )
      );
    });
  }, [query, activeCategory]);

  const totalStudies = peptideResearchData.reduce((sum, e) => sum + e.studies.length, 0);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>
      {/* Hero */}
      <div
        style={{
          background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 60%, #2563EB 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle at 70% 50%, #fff 0%, transparent 60%)" }} />
        <div className="max-w-[1280px] mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center gap-2 mb-3">
            <FlaskConical size={16} style={{ color: "#93C5FD" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", color: "#93C5FD", textTransform: "uppercase" }}>
              OmniQure Research Library
            </span>
          </div>
          <h1 className="font-bold text-white mb-3" style={{ fontSize: "clamp(26px,4vw,42px)", lineHeight: 1.15 }}>
            Peptide Research &amp; Literature
          </h1>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", maxWidth: "600px", lineHeight: 1.7 }}>
            Peer-reviewed studies and mechanisms of action for all {peptideResearchData.length} peptide compounds available through OmniQure. For laboratory research purposes only.
          </p>
          <div className="flex flex-wrap gap-4 mt-5">
            <div className="rounded-xl px-4 py-2.5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <p className="font-bold text-white" style={{ fontSize: "22px" }}>{peptideResearchData.length}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>Peptide Compounds</p>
            </div>
            <div className="rounded-xl px-4 py-2.5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <p className="font-bold text-white" style={{ fontSize: "22px" }}>{totalStudies}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>Research Citations</p>
            </div>
            <div className="rounded-xl px-4 py-2.5 text-center" style={{ backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
              <p className="font-bold text-white" style={{ fontSize: "22px" }}>{CATEGORIES.length - 1}</p>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>Research Categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="px-4 py-3 text-center"
        style={{ backgroundColor: "#FFFBEB", borderBottom: "1px solid #FDE68A" }}
      >
        <p style={{ fontSize: "12px", color: "#92400E" }}>
          <strong>Research Use Only:</strong> All studies cited are for in-vitro and preclinical/clinical research contexts. These peptides are not approved for human therapeutic use. For qualified researchers only.
        </p>
      </div>

      {/* Search + Filter bar */}
      <div className="bg-white sticky top-0 z-10" style={{ borderBottom: "1px solid #E8EDF5", boxShadow: "0 2px 8px rgba(15,23,42,0.04)" }}>
        <div className="max-w-[1280px] mx-auto px-4 py-3">
          {/* Search */}
          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94A3B8" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search peptides, journals, authors, or findings..."
              className="w-full outline-none"
              style={{
                paddingLeft: "36px",
                paddingRight: query ? "36px" : "12px",
                paddingTop: "9px",
                paddingBottom: "9px",
                fontSize: "13.5px",
                border: "1.5px solid #E2E8F0",
                borderRadius: "10px",
                backgroundColor: "#F8FAFC",
                color: "#0F172A",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#94A3B8" }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="flex-shrink-0 px-3 py-1 rounded-full font-medium transition-all"
                  style={{
                    fontSize: "12px",
                    backgroundColor: active ? "#1B5CB5" : "#F1F5F9",
                    color: active ? "#fff" : "#475569",
                    border: "1px solid " + (active ? "#1B5CB5" : "#E2E8F0"),
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-[1280px] mx-auto px-3 md:px-4 py-6">
        {/* Result count */}
        <div className="flex items-center justify-between mb-5">
          <p style={{ fontSize: "13px", color: "#64748B" }}>
            {filtered.length === peptideResearchData.length
              ? `Showing all ${filtered.length} peptide compounds`
              : `${filtered.length} compound${filtered.length !== 1 ? "s" : ""} found`}
          </p>
          {(query || activeCategory !== "All") && (
            <button
              onClick={() => { setQuery(""); setActiveCategory("All"); }}
              className="flex items-center gap-1 px-3 py-1 rounded-full"
              style={{ fontSize: "12px", color: "#64748B", border: "1px solid #E2E8F0", backgroundColor: "#fff" }}
            >
              <X size={11} /> Clear filters
            </button>
          )}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: "#94A3B8" }}>
            <FlaskConical size={40} className="mx-auto mb-4 opacity-30" />
            <p className="font-medium mb-1" style={{ fontSize: "16px", color: "#64748B" }}>No results found</p>
            <p style={{ fontSize: "13px" }}>Try a different search term or category filter.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((entry) => (
              <PeptideCard key={entry.compound} entry={entry} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div
        className="px-4 py-10 text-center"
        style={{ backgroundColor: "#0F172A" }}
      >
        <p className="font-bold text-white mb-2" style={{ fontSize: "20px" }}>
          Ready to start your research?
        </p>
        <p className="mb-6" style={{ fontSize: "13.5px", color: "#64748B", maxWidth: "500px", margin: "0 auto 24px" }}>
          All 81 peptides are HPLC verified at ≥99% purity with full COA, HPLC chromatograms, and ESI-MS data.
        </p>
        <Link
          href="/all-peptides"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-opacity hover:opacity-90"
          style={{ backgroundColor: "#1B5CB5", color: "#fff", fontSize: "14px", textDecoration: "none" }}
        >
          Browse All Peptides <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
