import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { researchCases, OUTCOME_TYPES, type ResearchCase, type Metric } from "@/data/researchResults";
import { isHiddenCategory } from "@/data/products";

// Cases whose product category is temporarily hidden from the storefront (see
// HIDDEN_CATEGORIES in data/products.ts) are excluded here too. The underlying
// data in researchResults.ts is untouched so it can be shown again later.
const visibleResearchCases = researchCases.filter(c => !isHiddenCategory(c.category));
import { FlaskConical, Users, Clock, BookOpen, TrendingUp, TrendingDown, Minus, ArrowRight, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";

const OUTCOME_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "Healing & Recovery": { bg: "#ECFDF5", text: "#059669", border: "#6EE7B7" },
  "Body Composition":   { bg: "#F5F3FF", text: "#7C3AED", border: "#C4B5FD" },
  "Cognitive":          { bg: "#EFF6FF", text: "#1D4ED8", border: "#93C5FD" },
  "Longevity":          { bg: "#FFF7ED", text: "#B45309", border: "#FCD34D" },
  "Hormonal":           { bg: "#FDF2F8", text: "#DB2777", border: "#F9A8D4" },
  "Metabolic":          { bg: "#F0F9FF", text: "#0369A1", border: "#7DD3FC" },
};

function pct(m: Metric): number {
  const range = Math.abs(m.after - m.before);
  const base = Math.max(Math.abs(m.before), 0.001);
  return Math.round((range / base) * 100);
}

function direction(m: Metric): "good" | "neutral" {
  if (m.higherIsBetter) return m.after >= m.before ? "good" : "neutral";
  return m.after <= m.before ? "good" : "neutral";
}

function MetricBar({ m }: { m: Metric }) {
  const isGood = direction(m) === "good";
  const improved = Math.abs(pct(m));
  const barBefore = 100;
  const barAfter = m.higherIsBetter
    ? Math.min((m.after / Math.max(m.before, m.after)) * 100, 100)
    : Math.min((m.after / Math.max(m.before, m.after)) * 100, 100);

  const beforeW = m.higherIsBetter
    ? Math.min((m.before / Math.max(m.before, m.after, 0.001)) * 100, 100)
    : 100;
  const afterW = m.higherIsBetter
    ? Math.min((m.after / Math.max(m.before, m.after, 0.001)) * 100, 100)
    : Math.min((m.after / Math.max(m.before, 0.001)) * 100, 100);

  const goodColor = "#059669";
  const barColor = isGood ? goodColor : "#94A3B8";
  const Icon = m.after > m.before ? TrendingUp : m.after < m.before ? TrendingDown : Minus;
  const iconColor = isGood ? goodColor : "#94A3B8";

  return (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" }}>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{m.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Icon size={12} color={iconColor} />
          {improved > 0 && (
            <span style={{
              fontSize: "11px", fontWeight: 700,
              color: isGood ? goodColor : "#94A3B8",
              background: isGood ? "#ECFDF5" : "#F1F5F9",
              padding: "1px 6px", borderRadius: "10px",
            }}>
              {improved}% {m.higherIsBetter ? (m.after > m.before ? "↑" : "↓") : (m.after < m.before ? "↓" : "↑")}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
        <div>
          <div style={{ fontSize: "10px", color: "#94A3B8", marginBottom: "3px", fontWeight: 600, letterSpacing: "0.04em" }}>BEFORE</div>
          <div style={{ background: "#F1F5F9", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
            <div style={{ width: `${beforeW}%`, height: "100%", background: "#CBD5E1", borderRadius: "4px" }} />
          </div>
          <div style={{ fontSize: "11px", color: "#475569", fontWeight: 700, marginTop: "3px" }}>
            {m.before} <span style={{ fontWeight: 400, color: "#94A3B8" }}>{m.unit}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "10px", color: isGood ? goodColor : "#94A3B8", marginBottom: "3px", fontWeight: 600, letterSpacing: "0.04em" }}>AFTER</div>
          <div style={{ background: isGood ? "#ECFDF5" : "#F1F5F9", borderRadius: "4px", height: "8px", overflow: "hidden" }}>
            <div style={{ width: `${afterW}%`, height: "100%", background: barColor, borderRadius: "4px" }} />
          </div>
          <div style={{ fontSize: "11px", color: isGood ? "#064E3B" : "#475569", fontWeight: 700, marginTop: "3px" }}>
            {m.after} <span style={{ fontWeight: 400, color: "#94A3B8" }}>{m.unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseCard({ c }: { c: ResearchCase }) {
  const [expanded, setExpanded] = useState(false);
  const colors = OUTCOME_COLORS[c.outcomeType] ?? OUTCOME_COLORS["Healing & Recovery"];

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: expanded ? "0 6px 28px rgba(27,92,181,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
    }}>
      <div style={{ padding: "18px 20px 16px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "2px 9px", borderRadius: "20px",
            background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`,
            letterSpacing: "0.04em",
          }}>{c.outcomeType}</span>
          <span style={{
            fontSize: "10px", fontWeight: 600, padding: "2px 9px", borderRadius: "20px",
            background: "#F1F5F9", color: "#475569",
          }}>{c.category}</span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#1B5CB5", marginBottom: "3px", letterSpacing: "0.04em" }}>
              {c.peptide}
            </div>
            <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#0D2565", margin: "0 0 6px", lineHeight: 1.3 }}>
              {c.title}
            </h3>
            <p style={{ fontSize: "12px", color: "#64748B", margin: "0", lineHeight: 1.6, display: expanded ? "block" : "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: expanded ? "visible" : "hidden" }}>
              {c.summary}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", marginTop: "12px", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Clock size={11} color="#94A3B8" />
            <span style={{ fontSize: "11px", color: "#64748B" }}>{c.duration}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Users size={11} color="#94A3B8" />
            <span style={{ fontSize: "11px", color: "#64748B" }}>n={c.n.toLocaleString()}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <FlaskConical size={11} color="#94A3B8" />
            <span style={{ fontSize: "11px", color: "#64748B" }}>{c.protocol}</span>
          </div>
        </div>
      </div>

      {expanded && (
        <div style={{ borderTop: "1px solid #F1F5F9", padding: "16px 20px" }}>
          {c.metrics.map((m, i) => <MetricBar key={i} m={m} />)}

          <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "10px 12px", marginTop: "8px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
              <BookOpen size={12} color="#94A3B8" style={{ marginTop: "1px", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", color: "#64748B", fontStyle: "italic", lineHeight: 1.5 }}>
                {c.source}
              </span>
            </div>
          </div>

          <div style={{ marginTop: "14px" }}>
            <Link href={`/product/${c.productSlug}`} style={{ textDecoration: "none" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#1B5CB5", color: "#fff",
                fontSize: "12px", fontWeight: 700,
                padding: "7px 14px", borderRadius: "8px",
                cursor: "pointer",
              }}>
                View {c.peptide} <ArrowRight size={12} />
              </div>
            </Link>
          </div>
        </div>
      )}

      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
          width: "100%", padding: "10px",
          background: "#F8FAFC", border: "none", borderTop: "1px solid #F1F5F9",
          cursor: "pointer", color: "#64748B", fontSize: "12px", fontWeight: 600,
        }}
      >
        {expanded ? <><ChevronUp size={13} /> Hide Results</> : <><ChevronDown size={13} /> View Results & Metrics</>}
      </button>
    </div>
  );
}

export default function ResearchResultsPage() {
  const [activeOutcome, setActiveOutcome] = useState<string>("All");
  const [search, setSearch] = useState("");

  useSEO({
    title: "Research Results — Before & After Data",
    description: "Peer-reviewed before/after research data for OmniQure peptides. Metrics include IGF-1, telomere length, HbA1c, BDNF, body composition, and more.",
    canonicalPath: "/research-results",
  });

  const filtered = useMemo(() => {
    return visibleResearchCases.filter(c => {
      const matchOutcome = activeOutcome === "All" || c.outcomeType === activeOutcome;
      const matchSearch = !search || c.peptide.toLowerCase().includes(search.toLowerCase()) || c.title.toLowerCase().includes(search.toLowerCase());
      return matchOutcome && matchSearch;
    });
  }, [activeOutcome, search]);

  const counts: Record<string, number> = useMemo(() => {
    const map: Record<string, number> = { All: visibleResearchCases.length };
    for (const c of visibleResearchCases) {
      map[c.outcomeType] = (map[c.outcomeType] ?? 0) + 1;
    }
    return map;
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <div style={{ background: "linear-gradient(135deg, #0D2565 0%, #1B5CB5 100%)", padding: "56px 24px 48px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "7px",
            background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
            padding: "5px 14px", borderRadius: "20px", marginBottom: "18px",
          }}>
            <FlaskConical size={13} color="#93C5FD" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#93C5FD", letterSpacing: "0.06em" }}>
              PEER-REVIEWED RESEARCH DATA
            </span>
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 900, color: "#fff",
            margin: "0 0 14px", letterSpacing: "-0.02em", lineHeight: 1.15,
            fontFamily: "'Arimo', Arial, sans-serif",
          }}>
            Before & After Research Results
          </h1>
          <p style={{ fontSize: "15px", color: "#BFDBFE", maxWidth: "600px", margin: "0 auto 24px", lineHeight: 1.7 }}>
            Quantitative biomarker data from published studies featuring the peptides available in our catalogue. Each case reports baseline and post-protocol measurements with the source reference.
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", maxWidth: "420px", margin: "0 auto" }}>
            <input
              type="text"
              placeholder="Search peptide or study type…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1, padding: "10px 16px", borderRadius: "10px",
                border: "1.5px solid rgba(255,255,255,0.25)",
                background: "rgba(255,255,255,0.10)", color: "#fff",
                fontSize: "13px", outline: "none",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{
          background: "#fff7ed", border: "1px solid #FED7AA", borderRadius: "10px",
          padding: "12px 16px", margin: "24px 0",
          display: "flex", alignItems: "flex-start", gap: "10px",
        }}>
          <AlertTriangle size={15} color="#B45309" style={{ marginTop: "1px", flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: "12px", color: "#92400E", lineHeight: 1.6 }}>
            <strong>For Research Purposes Only.</strong> The data below is sourced from peer-reviewed literature and refers to laboratory or clinical research contexts. It does not constitute medical advice. OmniQure peptides are sold strictly for in-vitro and preclinical research use.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", margin: "20px 0 28px" }}>
          {OUTCOME_TYPES.map(type => {
            const colors = type !== "All" ? OUTCOME_COLORS[type] : null;
            const isActive = activeOutcome === type;
            return (
              <button
                key={type}
                onClick={() => setActiveOutcome(type)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "5px",
                  padding: "6px 14px", borderRadius: "20px", cursor: "pointer",
                  border: isActive
                    ? `1.5px solid ${colors?.text ?? "#1B5CB5"}`
                    : "1.5px solid #E2E8F0",
                  background: isActive ? (colors?.bg ?? "#EFF6FF") : "#fff",
                  color: isActive ? (colors?.text ?? "#1B5CB5") : "#64748B",
                  fontSize: "12px", fontWeight: isActive ? 700 : 500,
                  transition: "all 0.15s",
                }}
              >
                {type}
                <span style={{
                  fontSize: "10px", fontWeight: 700,
                  background: isActive ? (colors?.text ?? "#1B5CB5") : "#F1F5F9",
                  color: isActive ? "#fff" : "#94A3B8",
                  padding: "0px 6px", borderRadius: "10px",
                }}>{counts[type] ?? 0}</span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 24px", color: "#94A3B8" }}>
            <FlaskConical size={36} color="#E2E8F0" style={{ marginBottom: "14px" }} />
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#475569", margin: "0 0 6px" }}>No results found</p>
            <p style={{ fontSize: "13px", margin: 0 }}>Try a different category or search term.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "18px" }}>
            {filtered.map(c => <CaseCard key={c.id} c={c} />)}
          </div>
        )}

        <div style={{
          marginTop: "48px", padding: "28px 32px",
          background: "linear-gradient(135deg, #EFF6FF 0%, #F0F9FF 100%)",
          border: "1px solid #BFDBFE", borderRadius: "16px",
          display: "flex", flexWrap: "wrap", gap: "20px", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <h3 style={{ fontSize: "17px", fontWeight: 800, color: "#0D2565", margin: "0 0 6px" }}>
              Explore the underlying protocols
            </h3>
            <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: 1.6 }}>
              Every study above references a specific dosing structure. See the full protocol guides, storage requirements, and stack recommendations.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link href="/protocols" style={{ textDecoration: "none" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#1B5CB5", color: "#fff",
                fontSize: "13px", fontWeight: 700,
                padding: "9px 18px", borderRadius: "9px", cursor: "pointer",
              }}>
                Research Protocols <ArrowRight size={13} />
              </div>
            </Link>
            <Link href="/lab-tests" style={{ textDecoration: "none" }}>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "#fff", color: "#1B5CB5",
                border: "1.5px solid #BFDBFE",
                fontSize: "13px", fontWeight: 700,
                padding: "9px 18px", borderRadius: "9px", cursor: "pointer",
              }}>
                Lab Results & COAs <ArrowRight size={13} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
