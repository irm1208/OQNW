import { useState, useMemo } from "react";
import { Link } from "wouter";
import { ChevronRight, ChevronDown, ChevronUp, FlaskConical } from "lucide-react";
import { protocols, CATEGORY_ORDER, type ProtocolCategory, type ProtocolEntry, type ResearchLevel } from "@/data/protocols";
import { products } from "@/data/products";

// Manual overrides for names that won't match automatically
const ABBR_TO_PRODUCT_ID: Record<string, string> = {
  "GLOW":    "22",  // GLOW BLEND 70mg
  "KLOW":    "35",  // KLOW BLEND 80mg
  "WOLV":    "7",   // BPC-157 + TB-500 Blend 10mg
  "HGH":     "26",  // Somatropin HGH 10 IU
  "CJC-I":   "11",  // CJC-1295 No DAC 5mg (closest)
  "NASAM":   "48",  // N-Acetyl Semax Amidate 10mg
  "OXT":     "50",  // Oxytocin 5mg
  "KISS":    "33",  // Kisspeptin-10 5mg
  "MT1":     "39",  // Melanotan 1 10mg
  "MT2":     "40",  // Melanotan 2 10mg
  "Tα1":     "75",  // Thymosin Alpha-1 10mg
  "SEL":     "62",  // Selank 10mg
  "SMX":     "64",  // Semax 10mg
  "TES":     "74",  // Tesamorelin + Ipamorelin Blend 8mg
  "PEGMGF":  "54",  // PEG MGF 2mg
  "PE22":    "53",  // PE-22-28 10mg
};

// Strip trailing strength token from product name to get base name
function productBaseName(name: string): string {
  return name.replace(/\s+\d+(?:\.\d+)?\s*(?:mg|IU|mcg|g)(?:\s*\(.*?\))?$/i, "").trim();
}

function findProductId(entry: ProtocolEntry): string | null {
  if (ABBR_TO_PRODUCT_ID[entry.abbr]) return ABBR_TO_PRODUCT_ID[entry.abbr];
  const protocolName = entry.name.toLowerCase();
  const match = products.find((p) =>
    productBaseName(p.name).toLowerCase() === protocolName
  );
  return match?.id ?? null;
}

const TABS: ("All" | ProtocolCategory)[] = ["All", ...CATEGORY_ORDER];

const CATEGORY_LABELS: Record<ProtocolCategory, string> = {
  "GLP-1": "GLP-1",
  "Healing": "Healing",
  "GH Peptides": "GH Peptides",
  "Cognitive": "Cognitive",
  "Other": "Other",
};

const LEVEL_STYLE: Record<ResearchLevel, { bg: string; text: string; border: string; dot: string }> = {
  "Extensively Studied": { bg: "#EEF4FF", text: "#1B5CB5", border: "#BFDBFE", dot: "#1B5CB5" },
  "Well Researched":     { bg: "#F0FDF4", text: "#16A34A", border: "#BBF7D0", dot: "#16A34A" },
  "Limited Research":    { bg: "#FFFBEB", text: "#B45309", border: "#FDE68A", dot: "#D97706" },
  "Early Research":      { bg: "#FFF1F2", text: "#BE185D", border: "#FBCFE8", dot: "#BE185D" },
};

const ABBR_COLORS: Record<ProtocolCategory, { bg: string; text: string }> = {
  "GLP-1":      { bg: "#EEF4FF", text: "#1240A0" },
  "Healing":    { bg: "#F0FDF4", text: "#166534" },
  "GH Peptides":{ bg: "#F0F9FF", text: "#075985" },
  "Cognitive":  { bg: "#F5F3FF", text: "#5B21B6" },
  "Other":      { bg: "#FFF7ED", text: "#92400E" },
};

const TAG_COLORS = [
  { bg: "#EEF4FF", text: "#1B5CB5", border: "#BFDBFE" },
  { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" },
  { bg: "#FFF7ED", text: "#C2410C", border: "#FED7AA" },
  { bg: "#ECFEFF", text: "#0E7490", border: "#A5F3FC" },
];

function getTagColor(index: number) {
  return TAG_COLORS[index % TAG_COLORS.length];
}

function ProtocolCard({ entry }: { entry: ProtocolEntry }) {
  const [open, setOpen] = useState(false);
  const levelStyle = LEVEL_STYLE[entry.level];
  const abbrStyle = ABBR_COLORS[entry.category];
  const productId = findProductId(entry);
  const shopHref = productId ? `/product/${productId}` : `/all-peptides`;

  return (
    <div
      style={{
        backgroundColor: "#fff",
        borderRadius: "16px",
        border: `1.5px solid ${open ? "#BFDBFE" : "#E8EDF5"}`,
        boxShadow: open
          ? "0 6px 28px rgba(27,92,181,0.10)"
          : "0 1px 6px rgba(15,23,42,0.05)",
        overflow: "hidden",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}
    >
      {/* Card body */}
      <div style={{ display: "flex", gap: "0", alignItems: "stretch" }}>

        {/* Abbreviation column */}
        <div
          style={{
            flexShrink: 0,
            width: "80px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: abbrStyle.bg,
            borderRight: `1.5px solid ${open ? "#BFDBFE" : "#E8EDF5"}`,
            padding: "20px 8px",
            transition: "border-color 0.2s",
          }}
        >
          <span
            style={{
              fontFamily: "'Courier New', Courier, monospace",
              fontSize: "13px",
              fontWeight: 700,
              color: abbrStyle.text,
              textAlign: "center",
              wordBreak: "break-all",
              letterSpacing: "0.04em",
              lineHeight: 1.3,
            }}
          >
            {entry.abbr}
          </span>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0, padding: "18px 20px 0" }}>
          {/* Name + tagline */}
          <h2
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "#0F172A",
              margin: "0 0 4px",
              lineHeight: 1.25,
            }}
          >
            {entry.name}
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "#64748B",
              margin: "0 0 12px",
              lineHeight: 1.5,
            }}
          >
            {entry.tagline}
          </p>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
            {entry.tags.map((tag, i) => {
              const c = getTagColor(i);
              return (
                <span
                  key={tag}
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "3px 9px",
                    borderRadius: "999px",
                    backgroundColor: c.bg,
                    color: c.text,
                    border: `1px solid ${c.border}`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {tag}
                </span>
              );
            })}
          </div>

          {/* Research Uses toggle */}
          <button
            onClick={() => setOpen((o) => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "none",
              border: "none",
              padding: "0",
              cursor: "pointer",
              fontSize: "12.5px",
              fontWeight: 700,
              color: open ? "#1B5CB5" : "#475569",
              fontFamily: "'Arimo', Arial, sans-serif",
              marginBottom: "16px",
              transition: "color 0.15s",
            }}
          >
            Research Uses
            {open
              ? <ChevronUp size={14} style={{ color: "#1B5CB5" }} />
              : <ChevronDown size={14} style={{ color: "#94A3B8" }} />}
          </button>

          {/* Expanded bullet list */}
          {open && (
            <ul
              style={{
                listStyle: "none",
                padding: "0",
                margin: "0 0 18px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {entry.researchUses.map((use, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    fontSize: "13.5px",
                    color: "#334155",
                    lineHeight: 1.65,
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      marginTop: "5px",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: LEVEL_STYLE[entry.level].dot,
                    }}
                  />
                  {use}
                </li>
              ))}
            </ul>
          )}

          {/* Bottom row: level badge + shop link */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "18px",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11.5px",
                fontWeight: 700,
                padding: "4px 11px",
                borderRadius: "999px",
                backgroundColor: levelStyle.bg,
                color: levelStyle.text,
                border: `1px solid ${levelStyle.border}`,
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: levelStyle.dot,
                  flexShrink: 0,
                }}
              />
              {entry.level}
            </span>

            <Link
              href={shopHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "3px",
                fontSize: "12px",
                fontWeight: 600,
                color: "#1B5CB5",
                textDecoration: "none",
                opacity: 0.85,
              }}
              onMouseOver={(e) => ((e.currentTarget as HTMLElement).style.opacity = "1")}
              onMouseOut={(e) => ((e.currentTarget as HTMLElement).style.opacity = "0.85")}
            >
              {productId ? "View Details" : "Shop"} <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategorySection({
  category,
  entries,
}: {
  category: ProtocolCategory;
  entries: ProtocolEntry[];
}) {
  if (entries.length === 0) return null;
  return (
    <div style={{ marginBottom: "40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "18px",
          paddingBottom: "12px",
          borderBottom: "2px solid #E8EDF5",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 700,
            color: "#0F172A",
            margin: 0,
          }}
        >
          {CATEGORY_LABELS[category]} Peptides
        </h2>
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: "#94A3B8",
          }}
        >
          {entries.length}
        </span>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "14px",
        }}
      >
        {entries.map((e) => (
          <ProtocolCard key={e.abbr + e.name} entry={e} />
        ))}
      </div>
    </div>
  );
}

export default function PeptideResearch() {
  const [activeTab, setActiveTab] = useState<"All" | ProtocolCategory>("All");

  const grouped = useMemo(() => {
    const cats = activeTab === "All" ? CATEGORY_ORDER : [activeTab];
    return cats.map((cat) => ({
      category: cat,
      entries: protocols.filter((p) => p.category === cat),
    }));
  }, [activeTab]);

  const totalShown = grouped.reduce((sum, g) => sum + g.entries.length, 0);

  const levelCounts = useMemo(() => {
    const all = activeTab === "All" ? protocols : protocols.filter((p) => p.category === activeTab);
    return {
      "Extensively Studied": all.filter((p) => p.level === "Extensively Studied").length,
      "Well Researched": all.filter((p) => p.level === "Well Researched").length,
      "Limited Research": all.filter((p) => p.level === "Limited Research").length,
      "Early Research": all.filter((p) => p.level === "Early Research").length,
    };
  }, [activeTab]);

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #020B1E 0%, #1240A0 55%, #1B5CB5 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(ellipse at 80% 60%, rgba(255,255,255,0.06) 0%, transparent 60%)",
          }}
        />
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 24px 52px", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "14px" }}>
            <FlaskConical size={14} style={{ color: "#93C5FD" }} />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "#93C5FD",
                textTransform: "uppercase",
              }}
            >
              OmniQure Research Library
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1.12,
              marginBottom: "12px",
            }}
          >
            Peptide Research Protocols
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "rgba(255,255,255,0.72)",
              maxWidth: "560px",
              lineHeight: 1.8,
              marginBottom: "32px",
            }}
          >
            Research peptides — healing, GH, GLP-1 &amp; cognitive — {protocols.length} entries.
            For qualified researchers only.
          </p>

          {/* Stat strip */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {[
              { n: protocols.length, label: "Peptides" },
              { n: levelCounts["Extensively Studied"], label: "Extensively Studied", color: "#93C5FD" },
              { n: levelCounts["Well Researched"], label: "Well Researched", color: "#86EFAC" },
              { n: levelCounts["Limited Research"], label: "Limited Research", color: "#FDE68A" },
              { n: levelCounts["Early Research"], label: "Early Research", color: "#FBCFE8" },
            ].map(({ n, label, color }) => (
              <div
                key={label}
                style={{
                  padding: "10px 18px",
                  borderRadius: "12px",
                  backgroundColor: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  textAlign: "center",
                  minWidth: "80px",
                }}
              >
                <p
                  style={{
                    fontSize: "22px",
                    fontWeight: 700,
                    color: color ?? "#fff",
                    lineHeight: 1,
                    margin: "0 0 3px",
                  }}
                >
                  {n}
                </p>
                <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", margin: 0, whiteSpace: "nowrap" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sticky tab bar ────────────────────────────────────────────────────── */}
      <div
        style={{
          backgroundColor: "#fff",
          borderBottom: "1px solid #E8EDF5",
          boxShadow: "0 2px 10px rgba(15,23,42,0.06)",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            gap: "0",
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {TABS.map((tab) => {
            const active = tab === activeTab;
            const count =
              tab === "All"
                ? protocols.length
                : protocols.filter((p) => p.category === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flexShrink: 0,
                  padding: "14px 18px",
                  fontSize: "13.5px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "#1B5CB5" : "#475569",
                  background: "none",
                  border: "none",
                  borderBottom: `2.5px solid ${active ? "#1B5CB5" : "transparent"}`,
                  cursor: "pointer",
                  fontFamily: "'Arimo', Arial, sans-serif",
                  whiteSpace: "nowrap",
                  transition: "color 0.15s, border-color 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {tab}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "1px 6px",
                    borderRadius: "999px",
                    backgroundColor: active ? "#EEF4FF" : "#F1F5F9",
                    color: active ? "#1B5CB5" : "#94A3B8",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Research level legend ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #E8EDF5" }}>
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "10px 24px",
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            Research Level:
          </span>
          {(Object.entries(LEVEL_STYLE) as [ResearchLevel, typeof LEVEL_STYLE[ResearchLevel]][]).map(([label, style]) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "11px",
                fontWeight: 600,
                color: style.text,
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: style.dot,
                  flexShrink: 0,
                }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "32px 20px 72px" }}>

        <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "28px" }}>
          Showing {totalShown} protocol{totalShown !== 1 ? "s" : ""}
          {activeTab !== "All" ? ` in ${activeTab}` : ""}
        </p>

        {grouped.map(({ category, entries }) => (
          <CategorySection key={category} category={category} entries={entries} />
        ))}
      </div>

      {/* ── Bottom CTA ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #020B1E 0%, #1240A0 100%)",
          padding: "56px 24px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "12px", fontWeight: 700, letterSpacing: "0.1em", color: "#93C5FD", textTransform: "uppercase", marginBottom: "14px" }}>
          OmniQure Research Institute
        </p>
        <p style={{ fontSize: "24px", fontWeight: 700, color: "#fff", marginBottom: "10px", lineHeight: 1.3 }}>
          Ready to start your research?
        </p>
        <p
          style={{
            fontSize: "14px",
            color: "rgba(255,255,255,0.6)",
            maxWidth: "480px",
            margin: "0 auto 28px",
            lineHeight: 1.75,
          }}
        >
          All 81 peptides are HPLC verified at 98%+ purity with full COA, HPLC chromatograms, and ESI-MS data.
        </p>
        <Link
          href="/all-peptides"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "13px 28px",
            borderRadius: "12px",
            backgroundColor: "#1B5CB5",
            color: "#fff",
            fontSize: "14px",
            fontWeight: 700,
            textDecoration: "none",
            border: "1.5px solid rgba(255,255,255,0.18)",
          }}
        >
          Browse All Peptides <ChevronRight size={16} />
        </Link>
      </div>
    </div>
  );
}
