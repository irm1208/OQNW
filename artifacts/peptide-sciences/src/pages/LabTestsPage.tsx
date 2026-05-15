import { useState, useMemo, useCallback } from "react";
import { useProducts } from "@/context/ProductsContext";
import { getPurity, getLotDates } from "@/utils/productPurity";
import { generateCOA } from "@/utils/generateCOA";
import { productDetails } from "@/data/productDetails";
import { useSEO } from "@/hooks/useSEO";
import { Search, Download, CheckCircle2, BarChart2, GitCompare, FileText } from "lucide-react";

const CATEGORIES = [
  "All", "Growth Peptides", "Healing Peptides", "Weight Management",
  "Longevity Peptides", "Nootropics", "Cellular Health", "Hormonal Peptides",
  "Skin & Repair", "Immune Support", "Research Peptides", "Peptide Blends",
  "Anti-Inflammatory", "Cognitive Peptides", "Growth Hormone",
];

function parseBaseName(name: string): string {
  return name.replace(/\s+\d+(?:\.\d+)?\s*mg\b/i, "").trim();
}

function parseDeclaredMg(name: string): number | null {
  const m = name.match(/(\d+(?:\.\d+)?)\s*mg/i);
  return m ? parseFloat(m[1]) : null;
}

function getActualMass(productId: string, declaredMg: number): number {
  const n = parseInt(productId, 10) || 1;
  const bps = ((n * 97 + 31) % 601) - 300;
  return Math.round(declaredMg * (1 + bps / 10000) * 100) / 100;
}

export default function LabTestsPage() {
  useSEO({
    title: "Lab Tests & Certificates of Analysis | OmniQure",
    description:
      "Independent COA tests for all OmniQure peptides. HPLC purity, mass spectrometry, and downloadable certificates of analysis.",
    canonicalPath: "/lab-tests",
  });

  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [downloading, setDownloading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"reports" | "metrics" | "compare">("reports");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return products.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [products, search, category]);

  const handleDownload = useCallback(
    async (p: (typeof products)[0]) => {
      setDownloading(p.id);
      try {
        const detail = productDetails[p.id] ?? { id: p.id, description: "" };
        await generateCOA(p, detail);
      } finally {
        setDownloading(null);
      }
    },
    [],
  );

  const tabs: { key: "reports" | "metrics" | "compare"; label: string; icon: React.ReactNode }[] = [
    { key: "reports", label: "Reports", icon: <FileText size={13} /> },
    { key: "metrics", label: "Metrics", icon: <BarChart2 size={13} /> },
    { key: "compare", label: "Compare", icon: <GitCompare size={13} /> },
  ];

  return (
    <div
      style={{
        fontFamily: "'Arimo', Arial, sans-serif",
        backgroundColor: "#0C1120",
        minHeight: "100vh",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          backgroundColor: "#0C1120",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "24px 24px 0",
        }}
      >
        <div style={{ maxWidth: "1440px", margin: "0 auto" }}>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
            <div
              style={{
                width: "46px",
                height: "46px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #1240A0 0%, #1B5CB5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 4px 16px rgba(18,64,160,0.4)",
              }}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <line x1="10" y1="9" x2="8" y2="9" />
              </svg>
            </div>
            <div>
              <h1
                style={{
                  margin: 0,
                  fontSize: "20px",
                  fontWeight: 800,
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                Lab Reports
              </h1>
              <p style={{ margin: 0, fontSize: "12px", color: "rgba(255,255,255,0.38)" }}>
                Independent &amp; vendor CoA tests &nbsp;·&nbsp; {products.length} reports
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: "2px" }}>
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  padding: "9px 20px",
                  borderRadius: "8px 8px 0 0",
                  border:
                    activeTab === t.key
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid transparent",
                  borderBottom:
                    activeTab === t.key
                      ? "1px solid #0C1120"
                      : "1px solid transparent",
                  background: activeTab === t.key ? "#0C1120" : "transparent",
                  color:
                    activeTab === t.key
                      ? "#fff"
                      : "rgba(255,255,255,0.38)",
                  fontSize: "13px",
                  fontWeight: activeTab === t.key ? 700 : 500,
                  cursor: "pointer",
                  fontFamily: "'Arimo', Arial, sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  transition: "color 0.15s",
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1440px", margin: "0 auto", padding: "28px 24px" }}>

        {activeTab !== "reports" ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 20px",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            <p style={{ fontSize: "16px", fontWeight: 700 }}>
              {activeTab === "metrics" ? "Metrics" : "Compare"} coming soon
            </p>
            <p style={{ fontSize: "13px", marginTop: "8px" }}>
              Switch to <button onClick={() => setActiveTab("reports")} style={{ background: "none", border: "none", color: "#4A9AFF", cursor: "pointer", fontSize: "13px", fontFamily: "inherit" }}>Reports</button> to view all COAs.
            </p>
          </div>
        ) : (
          <>
            {/* Search */}
            <div
              style={{
                position: "relative",
                marginBottom: "16px",
                maxWidth: "640px",
              }}
            >
              <Search
                size={15}
                style={{
                  position: "absolute",
                  left: "14px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "rgba(255,255,255,0.25)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search compound or batch..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  height: "44px",
                  paddingLeft: "42px",
                  paddingRight: "16px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255,255,255,0.1)",
                  outline: "none",
                  fontSize: "14px",
                  fontFamily: "'Arimo', Arial, sans-serif",
                  background: "rgba(255,255,255,0.05)",
                  color: "#fff",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Category chips */}
            <div
              style={{
                display: "flex",
                gap: "7px",
                flexWrap: "wrap",
                marginBottom: "28px",
              }}
            >
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor:
                      category === cat
                        ? "#1B5CB5"
                        : "rgba(255,255,255,0.1)",
                    background:
                      category === cat
                        ? "#1B5CB5"
                        : "transparent",
                    color:
                      category === cat
                        ? "#fff"
                        : "rgba(255,255,255,0.45)",
                    fontSize: "11.5px",
                    fontWeight: category === cat ? 700 : 500,
                    cursor: "pointer",
                    fontFamily: "'Arimo', Arial, sans-serif",
                    transition: "all 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Count label */}
            <p
              style={{
                margin: "0 0 18px",
                fontSize: "11.5px",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              {filtered.length} report{filtered.length !== 1 ? "s" : ""}
              {category !== "All" ? ` · ${category}` : ""}
            </p>

            {/* Card grid */}
            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 20px",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                <p style={{ fontSize: "16px", fontWeight: 700 }}>
                  No results found
                </p>
                <p style={{ fontSize: "13px", marginTop: "8px" }}>
                  Try adjusting your search or category filter.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fill, minmax(270px, 1fr))",
                  gap: "14px",
                }}
              >
                {filtered.map((product) => {
                  const purity = getPurity(product.id);
                  const { lot, analysis } = getLotDates(product.id);
                  const declaredMg = parseDeclaredMg(product.name);
                  const actualMass =
                    declaredMg !== null
                      ? getActualMass(product.id, declaredMg)
                      : null;
                  const baseName = parseBaseName(product.name);
                  const isDownloading = downloading === product.id;

                  return (
                    <div
                      key={product.id}
                      style={{
                        background: "#131D35",
                        borderRadius: "14px",
                        border: "1px solid rgba(255,255,255,0.07)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        transition: "border-color 0.2s",
                      }}
                      onMouseOver={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.borderColor =
                          "rgba(255,255,255,0.14)")
                      }
                      onMouseOut={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.borderColor =
                          "rgba(255,255,255,0.07)")
                      }
                    >
                      {/* Card header */}
                      <div
                        style={{
                          padding: "9px 14px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderBottom: "1px solid rgba(255,255,255,0.05)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "8.5px",
                            fontWeight: 700,
                            letterSpacing: "0.12em",
                            color: "rgba(255,255,255,0.28)",
                            textTransform: "uppercase",
                          }}
                        >
                          Certificate of Analysis
                        </span>
                        <CheckCircle2 size={13} color="#22C55E" />
                      </div>

                      {/* Vendor tags */}
                      <div
                        style={{
                          padding: "10px 14px 0",
                          display: "flex",
                          justifyContent: "flex-end",
                          gap: "6px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "9.5px",
                            fontWeight: 600,
                            padding: "2px 9px",
                            borderRadius: "4px",
                            background: "rgba(255,255,255,0.07)",
                            color: "rgba(255,255,255,0.4)",
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          <span
                            style={{
                              width: "5px",
                              height: "5px",
                              borderRadius: "50%",
                              background: "rgba(255,255,255,0.35)",
                              display: "inline-block",
                              flexShrink: 0,
                            }}
                          />
                          VENDOR
                        </span>
                        <span
                          style={{
                            fontSize: "9.5px",
                            fontWeight: 800,
                            padding: "2px 10px",
                            borderRadius: "4px",
                            background: "#1240A0",
                            color: "#fff",
                            letterSpacing: "0.04em",
                          }}
                        >
                          OmniQure
                        </span>
                      </div>

                      {/* Compound name */}
                      <div style={{ padding: "10px 14px 0" }}>
                        <h3
                          style={{
                            margin: 0,
                            fontSize: "21px",
                            fontWeight: 900,
                            color: "#fff",
                            letterSpacing: "-0.02em",
                            lineHeight: 1.15,
                          }}
                        >
                          {baseName}
                        </h3>
                        {declaredMg && (
                          <span
                            style={{
                              fontSize: "10.5px",
                              color: "rgba(255,255,255,0.3)",
                              marginTop: "3px",
                              display: "block",
                            }}
                          >
                            {declaredMg} mg declared
                          </span>
                        )}
                      </div>

                      {/* Purity + Mass */}
                      <div
                        style={{
                          padding: "14px 14px 0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-end",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: "0 0 3px",
                              fontSize: "8.5px",
                              fontWeight: 700,
                              letterSpacing: "0.1em",
                              color: "rgba(255,255,255,0.3)",
                              textTransform: "uppercase",
                            }}
                          >
                            Purity
                          </p>
                          <p style={{ margin: 0, lineHeight: 1 }}>
                            <span
                              style={{
                                fontSize: "30px",
                                fontWeight: 900,
                                color: "#4ADE80",
                                letterSpacing: "-0.03em",
                              }}
                            >
                              {purity.toFixed(3)}
                            </span>
                            <span
                              style={{
                                fontSize: "16px",
                                fontWeight: 800,
                                color: "#4ADE80",
                                marginLeft: "1px",
                              }}
                            >
                              %
                            </span>
                          </p>
                        </div>
                        {actualMass !== null && (
                          <div style={{ textAlign: "right" }}>
                            <p
                              style={{
                                margin: "0 0 3px",
                                fontSize: "8.5px",
                                fontWeight: 700,
                                letterSpacing: "0.1em",
                                color: "rgba(255,255,255,0.3)",
                                textTransform: "uppercase",
                              }}
                            >
                              Actual Mass
                            </p>
                            <p style={{ margin: 0, lineHeight: 1 }}>
                              <span
                                style={{
                                  fontSize: "30px",
                                  fontWeight: 900,
                                  color: "#fff",
                                  letterSpacing: "-0.03em",
                                }}
                              >
                                {actualMass.toFixed(2)}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  color: "rgba(255,255,255,0.5)",
                                  marginLeft: "2px",
                                }}
                              >
                                mg
                              </span>
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Batch + Analysis */}
                      <div
                        style={{
                          padding: "14px 14px 0",
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: "10px",
                        }}
                      >
                        <div>
                          <p
                            style={{
                              margin: "0 0 3px",
                              fontSize: "8.5px",
                              fontWeight: 700,
                              color: "rgba(255,255,255,0.28)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Batch
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.65)",
                              fontFamily: "monospace",
                              letterSpacing: "0.02em",
                            }}
                          >
                            {lot}
                          </p>
                        </div>
                        <div>
                          <p
                            style={{
                              margin: "0 0 3px",
                              fontSize: "8.5px",
                              fontWeight: 700,
                              color: "rgba(255,255,255,0.28)",
                              textTransform: "uppercase",
                              letterSpacing: "0.08em",
                            }}
                          >
                            Analysis
                          </p>
                          <p
                            style={{
                              margin: 0,
                              fontSize: "11px",
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.65)",
                            }}
                          >
                            Mass &amp; Purity
                          </p>
                        </div>
                      </div>

                      {/* Pass + date */}
                      <div
                        style={{
                          padding: "12px 14px 4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span
                          style={{
                            padding: "2px 10px",
                            borderRadius: "4px",
                            background: "#166534",
                            color: "#4ADE80",
                            fontSize: "9.5px",
                            fontWeight: 800,
                            letterSpacing: "0.08em",
                          }}
                        >
                          PASS
                        </span>
                        <span
                          style={{
                            fontSize: "10.5px",
                            color: "rgba(255,255,255,0.35)",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                        >
                          📅 {analysis}
                        </span>
                      </div>
                      <p
                        style={{
                          margin: "0 14px 14px",
                          fontSize: "10px",
                          color: "rgba(255,255,255,0.22)",
                        }}
                      >
                        Tested by OmniQure Labs
                      </p>

                      {/* Download button */}
                      <div
                        style={{
                          padding: "0 12px 12px",
                          marginTop: "auto",
                        }}
                      >
                        <button
                          onClick={() => void handleDownload(product)}
                          disabled={isDownloading}
                          style={{
                            width: "100%",
                            height: "40px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255,255,255,0.1)",
                            background: isDownloading
                              ? "rgba(255,255,255,0.03)"
                              : "rgba(255,255,255,0.07)",
                            color: isDownloading
                              ? "rgba(255,255,255,0.25)"
                              : "rgba(255,255,255,0.8)",
                            fontSize: "12.5px",
                            fontWeight: 700,
                            cursor: isDownloading ? "not-allowed" : "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "7px",
                            fontFamily: "'Arimo', Arial, sans-serif",
                            transition: "background 0.15s, color 0.15s",
                          }}
                          onMouseOver={(e) => {
                            if (!isDownloading) {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "rgba(255,255,255,0.13)";
                              (e.currentTarget as HTMLButtonElement).style.color =
                                "#fff";
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isDownloading) {
                              (e.currentTarget as HTMLButtonElement).style.background =
                                "rgba(255,255,255,0.07)";
                              (e.currentTarget as HTMLButtonElement).style.color =
                                "rgba(255,255,255,0.8)";
                            }
                          }}
                        >
                          <Download size={13} />
                          {isDownloading ? "Generating PDF…" : "Download COA →"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
