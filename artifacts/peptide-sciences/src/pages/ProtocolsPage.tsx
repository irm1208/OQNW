import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { productDetails } from "@/data/productDetails";
import { groupProducts, parseName } from "@/data/groupedProducts";
import { researchStacks } from "@/data/stacks";
import { useSEO } from "@/hooks/useSEO";
import {
  FlaskConical, Clock, Search, ChevronRight, Beaker, BookOpen,
  Thermometer, Droplets, Activity, AlertTriangle, X, ChevronDown, ChevronUp
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
      const existing = map.get(sp.productId) ?? [];
      existing.push(entry);
      map.set(sp.productId, existing);
    }
  }
  return map;
}

const protocolMap = buildProtocolMap();

function ProtocolCard({ group }: { group: GroupedProduct }) {
  const [expanded, setExpanded] = useState(false);
  const representative = group.variants[0];
  const detail = productDetails[representative.id];
  const protocols = protocolMap.get(representative.id) ?? [];

  const catColor = CATEGORY_COLORS[group.category] ?? "#475569";

  const mechanismSnippet = useMemo(() => {
    if (!detail?.longDescription) return detail?.description ?? "";
    const lines = detail.longDescription.split("\n").map(l => l.trim()).filter(Boolean);
    const mechLine = lines.find(l =>
      l.toLowerCase().includes("mechanism") ||
      l.toLowerCase().includes("activates") ||
      l.toLowerCase().includes("stimulates") ||
      l.toLowerCase().includes("binds") ||
      l.toLowerCase().includes("inhibits") ||
      l.toLowerCase().includes("upregulates")
    );
    return mechLine || lines.slice(-1)[0] || detail.description;
  }, [detail]);

  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E2E8F0",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "box-shadow 0.2s",
      boxShadow: expanded ? "0 4px 24px rgba(27,92,181,0.10)" : "0 1px 4px rgba(0,0,0,0.04)",
    }}>
      <div style={{ padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "6px" }}>
              <span style={{
                background: catColor + "18",
                color: catColor,
                fontSize: "10px",
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: "20px",
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}>{group.category}</span>
              {detail?.halfLife && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  background: "#F1F5F9", color: "#475569",
                  fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px",
                }}>
                  <Clock size={9} />
                  t½ {detail.halfLife}
                </span>
              )}
              {protocols.length > 0 && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "4px",
                  background: "#EFF6FF", color: "#1B5CB5",
                  fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px",
                }}>
                  <Activity size={9} />
                  {protocols.length} Protocol{protocols.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <Link href={`/product/${representative.id}`}>
              <h3 style={{
                fontSize: "16px", fontWeight: 800, color: "#0D2565",
                margin: "0 0 6px", cursor: "pointer", textDecoration: "none",
                letterSpacing: "-0.01em",
              }}
                onMouseOver={e => (e.currentTarget.style.color = "#1B5CB5")}
                onMouseOut={e => (e.currentTarget.style.color = "#0D2565")}
              >{group.baseName}</h3>
            </Link>
            {detail?.researchAreas && detail.researchAreas.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                {detail.researchAreas.slice(0, 4).map(area => (
                  <span key={area} style={{
                    background: "#F8FAFC", border: "1px solid #E2E8F0",
                    color: "#64748B", fontSize: "10px", fontWeight: 500,
                    padding: "1px 7px", borderRadius: "4px",
                  }}>{area}</span>
                ))}
              </div>
            )}
            {mechanismSnippet && (
              <p style={{
                fontSize: "12px", color: "#64748B", margin: "0",
                lineHeight: "1.55",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}>{mechanismSnippet}</p>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px", flexShrink: 0 }}>
            <Link href={`/product/${representative.id}`}>
              <button style={{
                background: "#1B5CB5", color: "#fff", border: "none",
                padding: "6px 14px", borderRadius: "6px", fontSize: "11px",
                fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}>View Product →</button>
            </Link>
          </div>
        </div>

        {protocols.length > 0 && (
          <div style={{ marginTop: "14px" }}>
            <div style={{
              background: "linear-gradient(135deg, #EFF6FF 0%, #F0FDF4 100%)",
              border: "1px solid #DBEAFE",
              borderRadius: "8px", padding: "12px 14px",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
                <div>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "2px" }}>SUGGESTED DOSE</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "#0D2565" }}>{protocols[0].suggestedDose}</div>
                </div>
                <div>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "2px" }}>FREQUENCY</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#1E293B" }}>{protocols[0].frequency}</div>
                </div>
                <div>
                  <div style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "2px" }}>CYCLE LENGTH</div>
                  <div style={{ fontSize: "12px", fontWeight: 600, color: "#1E293B" }}>{protocols[0].cycleLength}</div>
                </div>
              </div>
              <div style={{ marginTop: "8px", fontSize: "10px", color: "#64748B" }}>
                From:{" "}
                <Link href={`/stacks`}>
                  <span style={{ color: "#1B5CB5", fontWeight: 600, cursor: "pointer" }}>{protocols[0].stackName}</span>
                </Link>
                {" "}· Role: <span style={{ fontWeight: 600, color: "#374151" }}>{protocols[0].role}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {(detail || protocols.length > 1) && (
        <>
          <div
            onClick={() => setExpanded(!expanded)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
              padding: "8px", borderTop: "1px solid #F1F5F9",
              cursor: "pointer", color: "#64748B", fontSize: "11px", fontWeight: 600,
              background: "#FAFBFC",
              transition: "background 0.15s",
            }}
            onMouseOver={e => (e.currentTarget.style.background = "#F1F5F9")}
            onMouseOut={e => (e.currentTarget.style.background = "#FAFBFC")}
          >
            {expanded ? <><ChevronUp size={13} /> Hide Details</> : <><ChevronDown size={13} /> Full Protocol Details</>}
          </div>

          {expanded && (
            <div style={{ padding: "16px 20px 20px", borderTop: "1px solid #F1F5F9", background: "#FAFBFC" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                {detail?.storage && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <Thermometer size={12} color="#1B5CB5" />
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", letterSpacing: "0.06em" }}>STORAGE</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: "1.5" }}>{detail.storage}</p>
                  </div>
                )}
                {detail?.solubility && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <Droplets size={12} color="#059669" />
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748B", letterSpacing: "0.06em" }}>RECONSTITUTION</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "#374151", margin: 0, lineHeight: "1.5" }}>{detail.solubility}</p>
                  </div>
                )}
              </div>

              {protocols.length > 1 && (
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>ALL RESEARCH PROTOCOLS</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {protocols.map((p, i) => (
                      <div key={i} style={{
                        background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px",
                        padding: "10px 12px",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                          <span style={{ fontSize: "12px", fontWeight: 700, color: "#0D2565" }}>{p.stackName}</span>
                          <span style={{
                            background: "#F1F5F9", color: "#64748B",
                            fontSize: "10px", fontWeight: 600, padding: "1px 7px", borderRadius: "4px",
                          }}>{p.cycleLength}</span>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <div>
                            <span style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8" }}>DOSE: </span>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#1E293B" }}>{p.suggestedDose}</span>
                          </div>
                          <div>
                            <span style={{ fontSize: "9px", fontWeight: 700, color: "#94A3B8" }}>FREQUENCY: </span>
                            <span style={{ fontSize: "12px", fontWeight: 600, color: "#1E293B" }}>{p.frequency}</span>
                          </div>
                        </div>
                        <div style={{ marginTop: "4px", fontSize: "11px", color: "#64748B" }}>
                          Role: <span style={{ fontWeight: 600 }}>{p.role}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {detail?.alsoKnownAs && (
                <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "4px" }}>
                  Also known as: <span style={{ color: "#64748B" }}>{detail.alsoKnownAs}</span>
                </div>
              )}

              <div style={{
                marginTop: "12px", padding: "8px 12px",
                background: "#FEF9C3", border: "1px solid #FDE047", borderRadius: "6px",
                display: "flex", alignItems: "flex-start", gap: "8px",
              }}>
                <AlertTriangle size={12} color="#CA8A04" style={{ flexShrink: 0, marginTop: "1px" }} />
                <span style={{ fontSize: "11px", color: "#78350F", lineHeight: "1.4" }}>
                  For in-vitro and preclinical research use only. Not for human or veterinary administration.
                </span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ProtocolsPage() {
  useSEO({
    title: "Peptide Research Protocols",
    description: "Comprehensive dosing protocols and research guidelines for all peptides. Suggested doses, frequency, cycle lengths, storage, and reconstitution for BPC-157, Semaglutide, CJC-1295, Ipamorelin and more.",
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
        (productDetails[g.variants[0]?.id]?.researchAreas ?? []).some(r => r.toLowerCase().includes(q))
      );
    }

    return filtered.sort((a, b) => a.baseName.localeCompare(b.baseName));
  }, [products, category, search]);

  const withProtocols = groups.filter(g => protocolMap.has(g.variants[0]?.id));
  const withoutProtocols = groups.filter(g => !protocolMap.has(g.variants[0]?.id));

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
          <p style={{ fontSize: "clamp(14px, 2.2vw, 17px)", color: "rgba(255,255,255,0.75)", margin: "0 0 28px", maxWidth: "620px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.55 }}>
            Suggested dosing, frequency, cycle lengths, and storage guidelines for all research peptides. For preclinical research reference only.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", maxWidth: "480px", margin: "0 auto" }}>
            <div style={{ flex: 1, position: "relative" }}>
              <Search size={15} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
              <input
                type="text"
                placeholder="Search peptide or research area…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px 10px 38px",
                  borderRadius: "8px", border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.95)", fontSize: "13px",
                  outline: "none", boxSizing: "border-box", color: "#1E293B",
                }}
              />
              {search && (
                <button onClick={() => setSearch("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#94A3B8" }}>
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
          <div style={{ marginTop: "16px", display: "flex", gap: "6px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { label: `All (${groups.length + (search || category !== "All" ? 0 : 0)})`, value: "All" },
              { label: `With Protocols (${withProtocols.length})`, value: "__protocols__" },
            ].map(btn => (
              <button
                key={btn.value}
                onClick={() => {
                  if (btn.value === "__protocols__") {
                    setCategory("All");
                    setSearch("");
                  } else {
                    setCategory("All");
                    setSearch("");
                  }
                }}
                style={{
                  padding: "5px 12px", borderRadius: "6px", fontSize: "11px", fontWeight: 600,
                  border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
                  background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)",
                }}
              >{btn.label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Category filter + content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "28px 16px 60px", display: "flex", gap: "24px", alignItems: "flex-start" }}>

        {/* Sidebar */}
        <div style={{ width: "190px", flexShrink: 0, position: "sticky", top: "16px" }}>
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ padding: "12px 14px", borderBottom: "1px solid #F1F5F9", fontSize: "11px", fontWeight: 700, color: "#64748B", letterSpacing: "0.06em" }}>CATEGORIES</div>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "9px 14px", border: "none", cursor: "pointer",
                  fontSize: "12px", fontWeight: category === cat ? 700 : 500,
                  background: category === cat ? "#EFF6FF" : "transparent",
                  color: category === cat ? "#1B5CB5" : "#374151",
                  borderLeft: category === cat ? "3px solid #1B5CB5" : "3px solid transparent",
                  transition: "all 0.12s",
                }}
              >{cat}</button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Stats bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "13px", color: "#64748B" }}>
              Showing <strong style={{ color: "#0D2565" }}>{groups.length}</strong> peptides
              {withProtocols.length > 0 && <> · <span style={{ color: "#1B5CB5", fontWeight: 600 }}>{withProtocols.length} with protocol data</span></>}
            </div>
            {(search || category !== "All") && (
              <button
                onClick={() => { setSearch(""); setCategory("All"); }}
                style={{ display: "flex", alignItems: "center", gap: "4px", background: "#F1F5F9", border: "none", borderRadius: "6px", padding: "5px 10px", fontSize: "11px", color: "#64748B", cursor: "pointer", fontWeight: 600 }}
              >
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          {groups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#94A3B8" }}>
              <Beaker size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <div style={{ fontSize: "16px", fontWeight: 600 }}>No peptides found</div>
              <div style={{ fontSize: "13px", marginTop: "6px" }}>Try adjusting your search or category filter</div>
            </div>
          ) : (
            <>
              {withProtocols.length > 0 && (
                <div style={{ marginBottom: "28px" }}>
                  {(category !== "All" || search) ? null : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                      <Activity size={14} color="#1B5CB5" />
                      <span style={{ fontSize: "13px", fontWeight: 700, color: "#0D2565" }}>Peptides with Research Protocols</span>
                      <span style={{ background: "#EFF6FF", color: "#1B5CB5", fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "20px" }}>{withProtocols.length}</span>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "14px" }}>
                    {((category !== "All" || search) ? groups : withProtocols).map(group => (
                      <ProtocolCard key={group.baseName} group={group} />
                    ))}
                  </div>
                </div>
              )}

              {withoutProtocols.length > 0 && category === "All" && !search && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <FlaskConical size={14} color="#64748B" />
                    <span style={{ fontSize: "13px", fontWeight: 700, color: "#374151" }}>All Peptides — Storage & Research Reference</span>
                    <span style={{ background: "#F1F5F9", color: "#64748B", fontSize: "10px", fontWeight: 700, padding: "1px 7px", borderRadius: "20px" }}>{withoutProtocols.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "14px" }}>
                    {withoutProtocols.map(group => (
                      <ProtocolCard key={group.baseName} group={group} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Disclaimer */}
          <div style={{
            marginTop: "40px", padding: "18px 20px",
            background: "#FEF3C7", border: "1px solid #FDE68A", borderRadius: "10px",
            display: "flex", gap: "14px", alignItems: "flex-start",
          }}>
            <AlertTriangle size={18} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#92400E", marginBottom: "4px" }}>Research Use Only</div>
              <p style={{ fontSize: "12px", color: "#78350F", margin: 0, lineHeight: "1.55" }}>
                All protocols listed on this page are sourced from published preclinical research and are intended solely for in-vitro and animal model research purposes. These dosing guidelines are <strong>not</strong> intended for human or veterinary use. OmniQure Peptide Research Institute supplies these compounds exclusively for laboratory research.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
