import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { productDetails } from "@/data/productDetails";
import { groupProducts } from "@/data/groupedProducts";
import { researchStacks } from "@/data/stacks";
import { peptideExtras } from "@/data/peptideExtras";
import { useSEO } from "@/hooks/useSEO";
import {
  FlaskConical, Clock, Search, Beaker, BookOpen,
  Thermometer, Droplets, Activity, AlertTriangle, X,
  ChevronDown, ChevronUp, CheckCircle2, Zap, ShieldAlert, ListChecks
} from "lucide-react";
import type { GroupedProduct } from "@/data/groupedProducts";

const CATEGORIES = [
  "All",
  "Growth Peptides",
  "Healing Peptides",
  "Weight Management",
  "Longevity Peptides",
  "Nootropics",
  "Cellular Health",
  "Hormonal Peptides",
  "Skin & Repair",
  "Immune Support",
  "Research Peptides",
  "Peptide Blends",
  "Anti-Inflammatory",
  "Cognitive Peptides",
  "Growth Hormone",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Growth Peptides": "#1B5CB5",
  "Healing Peptides": "#059669",
  "Weight Management": "#7C3AED",
  "Longevity Peptides": "#B45309",
  "Nootropics": "#0891B2",
  "Cellular Health": "#DC2626",
  "Hormonal Peptides": "#DB2777",
  "Skin & Repair": "#EA580C",
  "Immune Support": "#65A30D",
  "Research Peptides": "#475569",
  "Peptide Blends": "#1D4ED8",
  "Anti-Inflammatory": "#0D9488",
  "Cognitive Peptides": "#6D28D9",
  "Growth Hormone": "#0369A1",
};

type ProtocolEntry = {
  role: string;
  suggestedDose: string;
  frequency: string;
  cycleLength: string;
  stackName: string;
  stackId: string;
};

function buildProtocolMap(): Map<string, ProtocolEntry[]> {
  const map = new Map<string, ProtocolEntry[]>();
  for (const stack of researchStacks) {
    for (const sp of stack.products) {
      const entry: ProtocolEntry = {
        role: sp.role,
        suggestedDose: sp.suggestedDose,
        frequency: sp.frequency,
        cycleLength: stack.cycleLength,
        stackName: stack.name,
        stackId: stack.id,
      };
      const existing = map.get(sp.slug) ?? [];
      existing.push(entry);
      map.set(sp.slug, existing);
    }
  }
  return map;
}

const protocolMap = buildProtocolMap();

type TabKey = "overview" | "benefits" | "sideEffects" | "protocol";

function ProtocolCard({ group }: { group: GroupedProduct }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("overview");

  const representative = group.variants[0];
  const detail = productDetails[representative.slug];
  const protocols = protocolMap.get(representative.slug) ?? [];
  const extras = peptideExtras[group.baseName];

  const catColor = CATEGORY_COLORS[group.category] ?? "#475569";

  const hasTabs = !!(extras || detail?.storage || protocols.length > 0);

  const allTabs: { key: TabKey; label: string; icon: React.ReactNode; show: boolean }[] = [
    { key: "overview", label: "Overview", icon: <BookOpen size={11} />, show: true },
    { key: "benefits", label: "Benefits", icon: <Zap size={11} />, show: !!extras?.benefits?.length },
    { key: "sideEffects", label: "Precautions", icon: <ShieldAlert size={11} />, show: !!extras?.sideEffects?.length },
    { key: "protocol", label: "Protocol", icon: <Activity size={11} />, show: protocols.length > 0 || !!detail?.storage },
  ];
  const tabs = allTabs.filter(t => t.show);

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: expanded ? "0 4px 24px rgba(27,92,181,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.2s",
    }}>
      {/* Card header */}
      <div style={{ padding: "18px 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Badges row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "6px" }}>
              <span style={{
                background: catColor + "18", color: catColor,
                fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px",
                letterSpacing: "0.04em", whiteSpace: "nowrap",
              }}>{group.category}</span>
              {detail?.halfLife && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "3px",
                  background: "#F1F5F9", color: "#475569",
                  fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px",
                }}>
                  <Clock size={9} /> t½ {detail.halfLife}
                </span>
              )}
              {protocols.length > 0 && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "3px",
                  background: "#EFF6FF", color: "#1B5CB5",
                  fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px",
                }}>
                  <Activity size={9} /> {protocols.length} Protocol{protocols.length > 1 ? "s" : ""}
                </span>
              )}
              {extras && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "3px",
                  background: "#F0FDF4", color: "#059669",
                  fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px",
                }}>
                  <CheckCircle2 size={9} /> Full Data
                </span>
              )}
            </div>

            {/* Name */}
            <Link href={`/product/${representative.id}`}>
              <h3 style={{
                fontSize: "15px", fontWeight: 800, color: "#0D2565",
                margin: "0 0 6px", cursor: "pointer", letterSpacing: "-0.01em",
              }}
                onMouseOver={e => (e.currentTarget.style.color = "#1B5CB5")}
                onMouseOut={e => (e.currentTarget.style.color = "#0D2565")}
              >{group.baseName}</h3>
            </Link>

            {/* Research areas */}
            {detail?.researchAreas && detail.researchAreas.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                {detail.researchAreas.slice(0, 4).map(area => (
                  <span key={area} style={{
                    background: "#F8FAFC", border: "1px solid #E2E8F0",
                    color: "#64748B", fontSize: "10px", fontWeight: 500,
                    padding: "1px 6px", borderRadius: "4px",
                  }}>{area}</span>
                ))}
              </div>
            )}

            {/* Description snippet */}
            <p style={{
              fontSize: "12px", color: "#64748B", margin: 0, lineHeight: "1.55",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>{detail?.description ?? ""}</p>
          </div>

          {/* View product button */}
          <div style={{ flexShrink: 0 }}>
            <Link href={`/product/${representative.id}`}>
              <button style={{
                background: "#1B5CB5", color: "#fff", border: "none",
                padding: "6px 12px", borderRadius: "6px", fontSize: "11px",
                fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
              }}>View →</button>
            </Link>
          </div>
        </div>

        {/* Protocol summary strip (when has protocols, collapsed view) */}
        {protocols.length > 0 && !expanded && (
          <div style={{
            marginTop: "12px",
            background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
            border: "1px solid #DBEAFE", borderRadius: "8px", padding: "10px 12px",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              <div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "1px" }}>DOSE</div>
                <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D2565" }}>{protocols[0].suggestedDose}</div>
              </div>
              <div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "1px" }}>FREQUENCY</div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#1E293B" }}>{protocols[0].frequency}</div>
              </div>
              <div>
                <div style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "1px" }}>CYCLE</div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#1E293B" }}>{protocols[0].cycleLength}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expand/collapse toggle */}
      {hasTabs && (
        <button
          onClick={() => { setExpanded(!expanded); if (!expanded) setActiveTab("overview"); }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
            width: "100%", padding: "8px", border: "none",
            borderTop: "1px solid #F1F5F9",
            cursor: "pointer", color: "#64748B", fontSize: "11px", fontWeight: 600,
            background: "#FAFBFC", transition: "background 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#F1F5F9")}
          onMouseOut={e => (e.currentTarget.style.background = "#FAFBFC")}
        >
          {expanded ? <><ChevronUp size={12} /> Hide details</> : <><ChevronDown size={12} /> Uses, benefits &amp; more</>}
        </button>
      )}

      {/* Expanded details panel */}
      {expanded && (
        <div style={{ borderTop: "1px solid #F1F5F9" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", background: "#FAFBFC" }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, padding: "9px 4px", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                  fontSize: "11px", fontWeight: activeTab === tab.key ? 700 : 500,
                  color: activeTab === tab.key ? "#1B5CB5" : "#64748B",
                  background: activeTab === tab.key ? "#fff" : "transparent",
                  borderBottom: activeTab === tab.key ? "2px solid #1B5CB5" : "2px solid transparent",
                  transition: "all 0.12s",
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div style={{ padding: "16px 18px 18px" }}>

            {/* OVERVIEW tab */}
            {activeTab === "overview" && (
              <div>
                {extras?.uses && extras.uses.length > 0 && (
                  <div style={{ marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                      <ListChecks size={13} color="#059669" />
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#065F46" }}>Research Uses</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {extras.uses.map((use, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                          <div style={{
                            width: "16px", height: "16px", borderRadius: "50%",
                            background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, marginTop: "1px",
                          }}>
                            <CheckCircle2 size={10} color="#059669" />
                          </div>
                          <span style={{ fontSize: "12px", color: "#374151", lineHeight: "1.5" }}>{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Storage + reconstitution */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                  {detail?.storage && (
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                        <Thermometer size={11} color="#1B5CB5" />
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", letterSpacing: "0.05em" }}>STORAGE</span>
                      </div>
                      <p style={{ fontSize: "11px", color: "#374151", margin: 0, lineHeight: "1.5" }}>{detail.storage}</p>
                    </div>
                  )}
                  {detail?.solubility && (
                    <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                        <Droplets size={11} color="#059669" />
                        <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", letterSpacing: "0.05em" }}>RECONSTITUTION</span>
                      </div>
                      <p style={{ fontSize: "11px", color: "#374151", margin: 0, lineHeight: "1.5" }}>{detail.solubility}</p>
                    </div>
                  )}
                </div>

                {detail?.alsoKnownAs && (
                  <div style={{ marginTop: "10px", fontSize: "11px", color: "#94A3B8" }}>
                    Also known as: <span style={{ color: "#64748B" }}>{detail.alsoKnownAs}</span>
                  </div>
                )}
              </div>
            )}

            {/* BENEFITS tab */}
            {activeTab === "benefits" && extras?.benefits && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <Zap size={13} color="#1B5CB5" />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#1E3A5F" }}>Key Researched Benefits</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {extras.benefits.map((benefit, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: "10px",
                      background: "#EFF6FF", border: "1px solid #DBEAFE",
                      borderRadius: "8px", padding: "10px 12px",
                    }}>
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: "#1B5CB5", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px", fontWeight: 800, flexShrink: 0,
                      }}>{i + 1}</div>
                      <span style={{ fontSize: "12px", color: "#1E3A5F", lineHeight: "1.55" }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PRECAUTIONS tab */}
            {activeTab === "sideEffects" && extras?.sideEffects && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <ShieldAlert size={13} color="#D97706" />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#78350F" }}>Preclinical Observations &amp; Precautions</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "12px" }}>
                  {extras.sideEffects.map((effect, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: "8px",
                      background: "#FFFBEB", border: "1px solid #FDE68A",
                      borderRadius: "7px", padding: "9px 11px",
                    }}>
                      <AlertTriangle size={12} color="#D97706" style={{ flexShrink: 0, marginTop: "1px" }} />
                      <span style={{ fontSize: "12px", color: "#78350F", lineHeight: "1.5" }}>{effect}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  padding: "9px 12px", background: "#FEF3C7",
                  border: "1px solid #FDE68A", borderRadius: "7px",
                  fontSize: "11px", color: "#92400E", lineHeight: "1.4",
                }}>
                  All observations are from preclinical (animal/in-vitro) research only and are not indicative of human pharmacology.
                </div>
              </div>
            )}

            {/* PROTOCOL tab */}
            {activeTab === "protocol" && (
              <div>
                {protocols.length > 0 ? (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                      <Activity size={13} color="#1B5CB5" />
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#0D2565" }}>Research Protocol{protocols.length > 1 ? "s" : ""}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {protocols.map((p, i) => (
                        <div key={i} style={{
                          background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
                          border: "1px solid #DBEAFE", borderRadius: "10px", padding: "12px 14px",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                            <div>
                              <div style={{ fontSize: "12px", fontWeight: 700, color: "#0D2565" }}>{p.stackName}</div>
                              <div style={{ fontSize: "10px", color: "#64748B", marginTop: "1px" }}>
                                Role: <span style={{ fontWeight: 600, color: "#374151" }}>{p.role}</span>
                              </div>
                            </div>
                            <span style={{
                              background: "#E0F2FE", color: "#0369A1",
                              fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px",
                            }}>{p.cycleLength}</span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "6px", padding: "7px 10px" }}>
                              <div style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8", marginBottom: "2px" }}>SUGGESTED DOSE</div>
                              <div style={{ fontSize: "13px", fontWeight: 700, color: "#0D2565" }}>{p.suggestedDose}</div>
                            </div>
                            <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "6px", padding: "7px 10px" }}>
                              <div style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8", marginBottom: "2px" }}>FREQUENCY</div>
                              <div style={{ fontSize: "12px", fontWeight: 600, color: "#1E293B" }}>{p.frequency}</div>
                            </div>
                          </div>
                          <div style={{ marginTop: "8px", fontSize: "11px", color: "#64748B" }}>
                            Part of:{" "}
                            <Link href="/stacks">
                              <span style={{ color: "#1B5CB5", fontWeight: 600, cursor: "pointer" }}>{p.stackName} →</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "24px 0", color: "#94A3B8" }}>
                    <FlaskConical size={28} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
                    <div style={{ fontSize: "13px" }}>No stack protocol data available for this compound</div>
                  </div>
                )}

                {/* Storage / reconstitution always shown in protocol tab */}
                {(detail?.storage || detail?.solubility) && (
                  <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    {detail?.storage && (
                      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                          <Thermometer size={11} color="#1B5CB5" />
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", letterSpacing: "0.05em" }}>STORAGE</span>
                        </div>
                        <p style={{ fontSize: "11px", color: "#374151", margin: 0, lineHeight: "1.5" }}>{detail.storage}</p>
                      </div>
                    )}
                    {detail?.solubility && (
                      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                          <Droplets size={11} color="#059669" />
                          <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", letterSpacing: "0.05em" }}>RECONSTITUTION</span>
                        </div>
                        <p style={{ fontSize: "11px", color: "#374151", margin: 0, lineHeight: "1.5" }}>{detail.solubility}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default function ProtocolsPage() {
  useSEO({
    title: "Peptide Research Protocols",
    description: "Research compound reference data covering study parameters, preclinical uses, observed effects, storage, and reconstitution guidance for BPC-157, TB-500, CJC-1295, Ipamorelin and more. For in-vitro and preclinical research use only.",
    canonicalPath: "/protocols",
  });

  const { products } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const groups = useMemo(() => {
    const allGroups = groupProducts(products);
    let filtered = allGroups;

    if (category !== "All") {
      filtered = filtered.filter(g => g.category === category);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(g =>
        g.baseName.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q) ||
        (productDetails[g.variants[0]?.slug ?? ""]?.researchAreas ?? []).some(r => r.toLowerCase().includes(q)) ||
        (peptideExtras[g.baseName]?.uses ?? []).some(u => u.toLowerCase().includes(q))
      );
    }

    return filtered.sort((a, b) => a.baseName.localeCompare(b.baseName));
  }, [products, category, search]);

  const withProtocols = groups.filter(g => protocolMap.has(g.variants[0]?.slug));
  const withoutProtocols = groups.filter(g => !protocolMap.has(g.variants[0]?.slug));

  const fullDataCount = groups.filter(g => !!peptideExtras[g.baseName]).length;

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", backgroundColor: "#F5F8FC", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        padding: "52px 20px 44px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(255,255,255,0.12)", borderRadius: "20px",
            padding: "6px 16px", marginBottom: "18px",
          }}>
            <BookOpen size={13} color="rgba(255,255,255,0.85)" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.06em" }}>RESEARCH PROTOCOLS</span>
          </div>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 40px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Peptide Protocol Reference
          </h1>
          <p style={{ fontSize: "clamp(13px, 2.2vw, 16px)", color: "rgba(255,255,255,0.75)", marginTop: 0, marginBottom: "24px", maxWidth: "600px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
            Uses, benefits, precautions, dosing, cycle lengths, and storage guidelines for all research peptides.
          </p>

          {/* Stats row */}
          <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "24px", flexWrap: "wrap" }}>
            {[
              { val: groups.length || "—", label: "Peptides" },
              { val: withProtocols.length || "—", label: "With Protocols" },
              { val: fullDataCount || "—", label: "Full Data Profiles" },
            ].map(({ val, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "22px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>{val}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.65)", marginTop: "2px" }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Search bar */}
          <div style={{ maxWidth: "480px", margin: "0 auto", position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
            <input
              type="text"
              placeholder="Search peptide, area, or benefit…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: "100%", padding: "11px 38px 11px 40px",
                borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.95)", fontSize: "13px",
                outline: "none", boxSizing: "border-box", color: "#1E293B",
              }}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                <X size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Layout */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 16px 60px", display: "flex", gap: "22px", alignItems: "flex-start" }}>

        {/* Sidebar */}
        <div style={{ width: "185px", flexShrink: 0, position: "sticky", top: "16px" }}>
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "11px 14px", borderBottom: "1px solid #F1F5F9", fontSize: "10px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.07em" }}>CATEGORIES</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "8px 14px", border: "none", cursor: "pointer",
                  fontSize: "12px", fontWeight: category === cat ? 700 : 500,
                  background: category === cat ? "#EFF6FF" : "transparent",
                  color: category === cat ? "#1B5CB5" : "#374151",
                  borderLeft: category === cat ? "3px solid #1B5CB5" : "3px solid transparent",
                  transition: "all 0.1s",
                }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "13px", color: "#64748B" }}>
              Showing <strong style={{ color: "#0D2565" }}>{groups.length}</strong> peptides
              {fullDataCount > 0 && <> · <span style={{ color: "#059669", fontWeight: 600 }}>{fullDataCount} with full data</span></>}
            </div>
            {(search || category !== "All") && (
              <button onClick={() => { setSearch(""); setCategory("All"); }}
                style={{ display: "flex", alignItems: "center", gap: "4px", background: "#F1F5F9", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", color: "#64748B", cursor: "pointer", fontWeight: 600 }}>
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          {groups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8" }}>
              <Beaker size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <div style={{ fontSize: "15px", fontWeight: 600 }}>No peptides found</div>
              <div style={{ fontSize: "13px", marginTop: "6px" }}>Try adjusting your search or category filter</div>
            </div>
          ) : (
            <>
              {/* With protocols section */}
              {withProtocols.length > 0 && category === "All" && !search && (
                <div style={{ marginBottom: "28px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <Activity size={14} color="#1B5CB5" />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#0D2565" }}>Peptides with Research Protocols</span>
                    <span style={{ background: "#EFF6FF", color: "#1B5CB5", fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "20px" }}>{withProtocols.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
                    {withProtocols.map(group => <ProtocolCard key={group.baseName} group={group} />)}
                  </div>
                </div>
              )}

              {/* Filtered results */}
              {(category !== "All" || search) && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
                  {groups.map(group => <ProtocolCard key={group.baseName} group={group} />)}
                </div>
              )}

              {/* All peptides section */}
              {withoutProtocols.length > 0 && category === "All" && !search && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <FlaskConical size={14} color="#64748B" />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>All Peptides — Reference Data</span>
                    <span style={{ background: "#F1F5F9", color: "#64748B", fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "20px" }}>{withoutProtocols.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "12px" }}>
                    {withoutProtocols.map(group => <ProtocolCard key={group.baseName} group={group} />)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Research disclaimer */}
          <div style={{
            marginTop: "40px", padding: "16px 20px",
            background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "10px",
            display: "flex", gap: "12px", alignItems: "flex-start",
          }}>
            <AlertTriangle size={16} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#92400E", marginBottom: "3px" }}>Research Use Only</div>
              <p style={{ fontSize: "11px", color: "#78350F", margin: 0, lineHeight: "1.55" }}>
                All protocols, uses, benefits, and precautions listed are sourced from published preclinical research and are intended solely for in-vitro and animal model research. These are <strong>not</strong> for human or veterinary administration. OmniQure supplies these compounds exclusively for laboratory research purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
