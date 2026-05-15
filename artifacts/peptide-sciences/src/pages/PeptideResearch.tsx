import { useState, useMemo } from "react";
import { Link } from "wouter";
import { peptideResearchData, type PeptideResearchEntry } from "@/data/peptideResearch";
import { Search, ExternalLink, FlaskConical, BookOpen, ChevronRight, X, ChevronDown, ChevronUp } from "lucide-react";

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

function buildPubMedSearchUrl(study: PeptideResearchEntry["studies"][0]): string {
  const titleWords = study.title
    .replace(/[^\w\s]/g, " ")
    .trim()
    .split(/\s+/)
    .slice(0, 5)
    .join("+");
  const firstAuthor = study.authors.split(/[,\s]/)[0].trim();
  return `https://pubmed.ncbi.nlm.nih.gov/?term=${titleWords}+${firstAuthor}+${study.year}`;
}

function StudyCard({ study, index }: { study: PeptideResearchEntry["studies"][0]; index: number }) {
  const pubmedSearchUrl = buildPubMedSearchUrl(study);

  return (
    <div
      style={{
        padding: "16px 18px",
        borderRadius: "12px",
        backgroundColor: "#F8FAFC",
        border: "1px solid #E8EDF5",
      }}
    >
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div
          style={{
            flexShrink: 0,
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            backgroundColor: "#1B5CB5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "10px",
            fontWeight: 700,
            marginTop: "2px",
          }}
        >
          {index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: "14px", fontWeight: 600, color: "#0F172A", lineHeight: 1.5, marginBottom: "4px" }}>
            {study.title}
          </p>
          <p style={{ fontSize: "12px", color: "#64748B", marginBottom: "10px" }}>
            {study.authors} — <em>{study.journal}</em>, {study.year}
          </p>
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              padding: "10px 14px",
            }}
          >
            <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", marginBottom: "5px" }}>
              Key Finding
            </p>
            <p style={{ fontSize: "13.5px", color: "#334155", lineHeight: 1.7 }}>
              {study.finding}
            </p>
          </div>
          <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <ExternalLink size={11} style={{ color: "#94A3B8", flexShrink: 0 }} />
            {study.doi && (
              <a
                href={`https://doi.org/${study.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "11.5px", color: "#1B5CB5", textDecoration: "none" }}
                onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                doi:{study.doi}
              </a>
            )}
            {study.pmid && (
              <a
                href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: "11.5px", color: "#1B5CB5", textDecoration: "none" }}
                onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                PubMed {study.pmid}
              </a>
            )}
            <a
              href={pubmedSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: "11px",
                color: "#64748B",
                textDecoration: "none",
                backgroundColor: "#F1F5F9",
                padding: "2px 8px",
                borderRadius: "6px",
                border: "1px solid #E2E8F0",
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#E2E8F0")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#F1F5F9")}
            >
              Search PubMed ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function PeptideCard({ entry }: { entry: PeptideResearchEntry }) {
  const [expanded, setExpanded] = useState(false);
  const color = CATEGORY_COLORS[entry.category] ?? CATEGORY_COLORS["Research Peptides"];

  // One-sentence preview: up to first period or 120 chars
  const preview = (() => {
    const dot = entry.description.indexOf(".");
    const cut = dot > 0 && dot < 140 ? dot + 1 : 120;
    return entry.description.slice(0, cut) + (entry.description.length > cut ? "…" : "");
  })();

  return (
    <div
      id={entry.compound.toLowerCase().replace(/\s+/g, "-")}
      style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: `1px solid ${expanded ? "#BFDBFE" : "#E8EDF5"}`,
        boxShadow: expanded ? "0 4px 24px rgba(27,92,181,0.10)" : "0 2px 8px rgba(15,23,42,0.04)",
        overflow: "hidden",
        transition: "box-shadow 0.2s, border-color 0.2s",
      }}
    >
      {/* Always-visible header row */}
      <button
        onClick={() => setExpanded((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "16px 20px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          fontFamily: "'Arimo', Arial, sans-serif",
          borderBottom: expanded ? "1px solid #F1F5F9" : "none",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "5px" }}>
            <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0F172A", margin: 0, lineHeight: 1.2 }}>
              {entry.compound}
            </h2>
            <span
              style={{
                display: "inline-block",
                padding: "2px 9px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 600,
                backgroundColor: color.bg,
                color: color.text,
                border: `1px solid ${color.border}`,
                flexShrink: 0,
              }}
            >
              {entry.category}
            </span>
          </div>
          {!expanded && (
            <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.5, margin: 0 }}>
              {preview}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <span style={{ fontSize: "11.5px", color: "#94A3B8", fontWeight: 500 }}>
            {entry.studies.length} {entry.studies.length === 1 ? "study" : "studies"}
          </span>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              backgroundColor: expanded ? "#EEF4FF" : "#F1F5F9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {expanded
              ? <ChevronUp size={15} style={{ color: "#1B5CB5" }} />
              : <ChevronDown size={15} style={{ color: "#64748B" }} />
            }
          </div>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: "20px 20px 22px" }}>

          {/* Product links */}
          {entry.productIds.length > 0 && (
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "18px" }}>
              {entry.productIds.map((pid) => (
                <Link
                  key={pid}
                  href={`/product/${pid}`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "7px 14px",
                    borderRadius: "9px",
                    backgroundColor: "#1B5CB5",
                    color: "#fff",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  View Product <ChevronRight size={13} />
                </Link>
              ))}
            </div>
          )}

          {/* Description */}
          <p style={{ fontSize: "14.5px", color: "#475569", lineHeight: 1.8, marginBottom: "18px" }}>
            {entry.description}
          </p>

          {/* Mechanism */}
          <div
            style={{
              backgroundColor: "#EEF4FF",
              border: "1px solid #BFDBFE",
              borderRadius: "12px",
              padding: "14px 18px",
              marginBottom: "20px",
            }}
          >
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1B5CB5", marginBottom: "7px" }}>
              Mechanism of Action
            </p>
            <p style={{ fontSize: "14px", color: "#1E3A6A", lineHeight: 1.8, margin: 0 }}>
              {entry.mechanism}
            </p>
          </div>

          {/* Studies */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <BookOpen size={13} style={{ color: "#64748B" }} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Research Literature — {entry.studies.length} {entry.studies.length === 1 ? "study" : "studies"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {entry.studies.map((study, i) => (
              <StudyCard key={i} study={study} index={i} />
            ))}
          </div>
        </div>
      )}
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
      <div style={{ background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 60%, #2563EB 100%)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.05, backgroundImage: "radial-gradient(circle at 70% 50%, #fff 0%, transparent 60%)" }} />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px 44px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <FlaskConical size={15} style={{ color: "#93C5FD" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", color: "#93C5FD", textTransform: "uppercase" }}>
              OmniQure Research Library
            </span>
          </div>
          <h1 style={{ fontSize: "clamp(26px,4vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: "12px" }}>
            Peptide Research &amp; Literature
          </h1>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.78)", maxWidth: "600px", lineHeight: 1.75, marginBottom: "24px" }}>
            Peer-reviewed studies and mechanisms of action for all {peptideResearchData.length} peptide compounds available through OmniQure. For laboratory research purposes only.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
            {[
              { n: peptideResearchData.length, label: "Peptide Compounds" },
              { n: totalStudies, label: "Research Citations" },
              { n: CATEGORIES.length - 1, label: "Research Categories" },
            ].map(({ n, label }) => (
              <div key={label} style={{ borderRadius: "12px", padding: "10px 20px", textAlign: "center", backgroundColor: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)" }}>
                <p style={{ fontSize: "24px", fontWeight: 700, color: "#fff", lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", marginTop: "3px" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ backgroundColor: "#FFFBEB", borderBottom: "1px solid #FDE68A", padding: "10px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "12.5px", color: "#92400E", lineHeight: 1.6 }}>
          <strong>Research Use Only:</strong> All studies cited are for in-vitro and preclinical/clinical research contexts. These peptides are not approved for human therapeutic use. For qualified researchers only.
        </p>
      </div>

      {/* Sticky search + filter bar */}
      <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #E8EDF5", boxShadow: "0 2px 8px rgba(15,23,42,0.04)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "12px 20px" }}>
          <div style={{ position: "relative", marginBottom: "10px" }}>
            <Search size={15} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search peptides, journals, authors, or findings..."
              style={{
                width: "100%",
                paddingLeft: "38px",
                paddingRight: query ? "38px" : "14px",
                paddingTop: "10px",
                paddingBottom: "10px",
                fontSize: "14px",
                border: "1.5px solid #E2E8F0",
                borderRadius: "10px",
                backgroundColor: "#F8FAFC",
                color: "#0F172A",
                outline: "none",
                fontFamily: "'Arimo', Arial, sans-serif",
                boxSizing: "border-box",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "2px", scrollbarWidth: "none" }}>
            {CATEGORIES.map((cat) => {
              const active = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    flexShrink: 0,
                    padding: "5px 13px",
                    borderRadius: "999px",
                    fontSize: "12.5px",
                    fontWeight: active ? 700 : 500,
                    backgroundColor: active ? "#1B5CB5" : "#F1F5F9",
                    color: active ? "#fff" : "#475569",
                    border: "1px solid " + (active ? "#1B5CB5" : "#E2E8F0"),
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    fontFamily: "'Arimo', Arial, sans-serif",
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "28px 20px 60px" }}>

        {/* Result count + clear */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <p style={{ fontSize: "13.5px", color: "#64748B" }}>
            {filtered.length === peptideResearchData.length
              ? `Showing all ${filtered.length} peptide compounds`
              : `${filtered.length} compound${filtered.length !== 1 ? "s" : ""} found`}
          </p>
          {(query || activeCategory !== "All") && (
            <button
              onClick={() => { setQuery(""); setActiveCategory("All"); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 12px",
                borderRadius: "999px",
                fontSize: "12.5px",
                color: "#64748B",
                border: "1px solid #E2E8F0",
                backgroundColor: "#fff",
                cursor: "pointer",
                fontFamily: "'Arimo', Arial, sans-serif",
              }}
            >
              <X size={11} /> Clear filters
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#94A3B8" }}>
            <FlaskConical size={40} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
            <p style={{ fontSize: "16px", fontWeight: 600, color: "#64748B", marginBottom: "6px" }}>No results found</p>
            <p style={{ fontSize: "13.5px" }}>Try a different search term or category filter.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {filtered.map((entry) => (
              <PeptideCard key={entry.compound} entry={entry} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div style={{ backgroundColor: "#0F172A", padding: "48px 24px", textAlign: "center" }}>
        <p style={{ fontSize: "22px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
          Ready to start your research?
        </p>
        <p style={{ fontSize: "14px", color: "#64748B", maxWidth: "500px", margin: "0 auto 24px", lineHeight: 1.7 }}>
          All 81 peptides are HPLC verified at 99%+ purity with full COA, HPLC chromatograms, and ESI-MS data.
        </p>
        <Link
          href="/all-peptides"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "12px 24px",
            borderRadius: "12px",
            backgroundColor: "#1B5CB5",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Browse All Peptides <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
