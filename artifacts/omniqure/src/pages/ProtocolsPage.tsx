import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useProducts } from "@/context/ProductsContext";
import { productDetails } from "@/data/productDetails";
import { groupProducts } from "@/data/groupedProducts";
import { researchStacks } from "@/data/stacks";
import { peptideExtras } from "@/data/peptideExtras";
import { useSEO } from "@/hooks/useSEO";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  FlaskConical, Clock, Search, Beaker, BookOpen,
  Thermometer, Droplets, Activity, AlertTriangle, X,
  ChevronDown, ChevronUp, CheckCircle2, Zap, ShieldAlert, ListChecks
} from "lucide-react";
import type { GroupedProduct } from "@/data/groupedProducts";
import PageHero from "@/components/PageHero";

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
  "Growth Peptides": "#4E68C2",
  "Healing Peptides": "#059669",
  "Weight Management": "#7C3AED",
  "Longevity Peptides": "#B45309",
  "Nootropics": "#0891B2",
  "Cellular Health": "#DC2626",
  "Hormonal Peptides": "#DB2777",
  "Skin & Repair": "#EA580C",
  "Immune Support": "#65A30D",
  "Research Peptides": "#475569",
  "Peptide Blends": "#3D55A8",
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

function ProtocolCard({ group, isMobile }: { group: GroupedProduct; isMobile?: boolean }) {
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
      border: "1px solid rgba(11,18,32,0.09)",
      borderRadius: 16,
      overflow: "hidden",
    }}>
      {/* Card header */}
      <div style={{ padding: "18px 18px 14px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Badges row */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "6px" }}>
              <span style={{
                background: catColor + "12", color: catColor,
                fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px",
                letterSpacing: "0.04em", whiteSpace: "nowrap",
              }}>{group.category}</span>
              {detail?.halfLife && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "3px",
                  background: "#F2F0EB", color: "var(--graphite)",
                  fontSize: "10px", fontWeight: 500, padding: "2px 8px", borderRadius: "20px",
                }}>
                  <Clock size={9} /> t½ {detail.halfLife}
                </span>
              )}
              {protocols.length > 0 && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "3px",
                  background: "#EEF3FC", color: "var(--cobalt)",
                  fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px",
                }}>
                  <Activity size={9} /> {protocols.length} Protocol{protocols.length > 1 ? "s" : ""}
                </span>
              )}
              {extras && (
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: "3px",
                  background: "#ECFDF5", color: "#047857",
                  fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "20px",
                }}>
                  <CheckCircle2 size={9} /> Full Data
                </span>
              )}
            </div>

            {/* Name */}
            <Link href={`/product/${representative.id}`}>
              <h3 style={{
                fontSize: "15px", fontWeight: 600, color: "var(--ink)",
                margin: "0 0 6px", cursor: "pointer", letterSpacing: "-0.01em",
              }}
                onMouseOver={e => (e.currentTarget.style.color = "var(--cobalt)")}
                onMouseOut={e => (e.currentTarget.style.color = "var(--ink)")}
              >{group.baseName}</h3>
            </Link>

            {/* Research areas */}
            {detail?.researchAreas && detail.researchAreas.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                {detail.researchAreas.slice(0, 4).map(area => (
                  <span key={area} style={{
                    background: "#F2F0EB", border: "1px solid var(--hairline)",
                    color: "var(--graphite)", fontSize: "10px", fontWeight: 500,
                    padding: "1px 7px", borderRadius: "999px",
                  }}>{area}</span>
                ))}
              </div>
            )}

            {/* Description snippet */}
            <p style={{
              fontSize: "12px", color: "var(--graphite)", margin: 0, lineHeight: "1.55",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
            }}>{detail?.description ?? ""}</p>
          </div>

          {/* View product button */}
          <div style={{ flexShrink: 0 }}>
            <Link href={`/product/${representative.id}`}>
              <button style={{
                background: "#fff", color: "var(--ink)", border: "1px solid var(--hairline)",
                padding: "6px 14px", borderRadius: "999px", fontSize: "11px",
                fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              }}>View →</button>
            </Link>
          </div>
        </div>

        {/* Protocol summary strip (when has protocols, collapsed view) */}
        {protocols.length > 0 && !expanded && (
          <div style={{
            marginTop: "12px",
            background: "#F2F0EB",
            border: "1px solid var(--hairline)", borderRadius: "10px", padding: "10px 12px",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "6px" }}>
              <div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.12em", marginBottom: "1px" }}>DOSE</div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--ink)", wordBreak: "break-word" }}>{protocols[0].suggestedDose}</div>
              </div>
              <div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.12em", marginBottom: "1px" }}>FREQUENCY</div>
                <div style={{ fontSize: "10px", fontWeight: 500, color: "var(--ink)", wordBreak: "break-word" }}>{protocols[0].frequency}</div>
              </div>
              <div>
                <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.12em", marginBottom: "1px" }}>CYCLE</div>
                <div style={{ fontSize: "10px", fontWeight: 500, color: "var(--ink)", wordBreak: "break-word" }}>{protocols[0].cycleLength}</div>
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
            borderTop: "1px solid var(--hairline)",
            cursor: "pointer", color: "var(--graphite)", fontSize: "11px", fontWeight: 500,
            background: "#fff", transition: "background 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#F2F0EB")}
          onMouseOut={e => (e.currentTarget.style.background = "#fff")}
        >
          {expanded ? <><ChevronUp size={12} /> Hide details</> : <><ChevronDown size={12} /> Uses, benefits &amp; more</>}
        </button>
      )}

      {/* Expanded details panel */}
      {expanded && (
        <div style={{ borderTop: "1px solid var(--hairline)" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--hairline)", background: "#F2F0EB" }}>
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                style={{
                  flex: 1, padding: "9px 4px", border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "4px",
                  fontSize: "11px", fontWeight: activeTab === tab.key ? 600 : 500,
                  color: activeTab === tab.key ? "var(--ink)" : "var(--graphite)",
                  background: activeTab === tab.key ? "#fff" : "transparent",
                  borderBottom: activeTab === tab.key ? "2px solid var(--ink)" : "2px solid transparent",
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
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)" }}>Research Uses</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                      {extras.uses.map((use, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "7px" }}>
                          <div style={{
                            width: "16px", height: "16px", borderRadius: "50%",
                            background: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center",
                            flexShrink: 0, marginTop: "1px",
                          }}>
                            <CheckCircle2 size={10} color="#059669" />
                          </div>
                          <span style={{ fontSize: "12px", color: "var(--graphite)", lineHeight: "1.5" }}>{use}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Storage + reconstitution */}
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "8px" }}>
                  {detail?.storage && (
                    <div style={{ background: "#F2F0EB", border: "1px solid var(--hairline)", borderRadius: "10px", padding: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                        <Thermometer size={11} color="var(--cobalt)" />
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.08em" }}>STORAGE</span>
                      </div>
                      <p style={{ fontSize: "11px", color: "var(--graphite)", margin: 0, lineHeight: "1.5" }}>{detail.storage}</p>
                    </div>
                  )}
                  {detail?.solubility && (
                    <div style={{ background: "#F2F0EB", border: "1px solid var(--hairline)", borderRadius: "10px", padding: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                        <Droplets size={11} color="#059669" />
                        <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.08em" }}>RECONSTITUTION</span>
                      </div>
                      <p style={{ fontSize: "11px", color: "var(--graphite)", margin: 0, lineHeight: "1.5" }}>{detail.solubility}</p>
                    </div>
                  )}
                </div>

                {detail?.alsoKnownAs && (
                  <div style={{ marginTop: "10px", fontSize: "11px", color: "var(--graphite)" }}>
                    Also known as: <span style={{ color: "var(--ink)" }}>{detail.alsoKnownAs}</span>
                  </div>
                )}
              </div>
            )}

            {/* BENEFITS tab */}
            {activeTab === "benefits" && extras?.benefits && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                  <Zap size={13} color="var(--cobalt)" />
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)" }}>Key Researched Benefits</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {extras.benefits.map((benefit, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: "10px",
                      background: "#F2F0EB", border: "1px solid var(--hairline)",
                      borderRadius: "10px", padding: "10px 12px",
                    }}>
                      <div style={{
                        width: "20px", height: "20px", borderRadius: "50%",
                        background: "var(--ink)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "10px", fontWeight: 600, flexShrink: 0,
                      }}>{i + 1}</div>
                      <span style={{ fontSize: "12px", color: "var(--graphite)", lineHeight: "1.55" }}>{benefit}</span>
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
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)" }}>Preclinical Observations &amp; Precautions</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginBottom: "12px" }}>
                  {extras.sideEffects.map((effect, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "flex-start", gap: "8px",
                      background: "#F2F0EB", border: "1px solid var(--hairline)",
                      borderRadius: "10px", padding: "9px 11px",
                    }}>
                      <AlertTriangle size={12} color="#D97706" style={{ flexShrink: 0, marginTop: "1px" }} />
                      <span style={{ fontSize: "12px", color: "var(--graphite)", lineHeight: "1.5" }}>{effect}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  padding: "9px 12px", background: "#F2F0EB",
                  border: "1px solid var(--hairline)", borderRadius: "10px",
                  fontSize: "11px", color: "var(--graphite)", lineHeight: "1.4",
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
                      <Activity size={13} color="var(--cobalt)" />
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)" }}>Research Protocol{protocols.length > 1 ? "s" : ""}</span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {protocols.map((p, i) => (
                        <div key={i} style={{
                          background: "#F2F0EB",
                          border: "1px solid var(--hairline)", borderRadius: "12px", padding: "12px 14px",
                        }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                            <div>
                              <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--ink)" }}>{p.stackName}</div>
                              <div style={{ fontSize: "10px", color: "var(--graphite)", marginTop: "1px" }}>
                                Role: <span style={{ fontWeight: 600, color: "var(--ink)" }}>{p.role}</span>
                              </div>
                            </div>
                            <span style={{
                              background: "#fff", color: "var(--graphite)", border: "1px solid var(--hairline)",
                              fontSize: "10px", fontWeight: 500, padding: "2px 8px", borderRadius: "999px",
                            }}>{p.cycleLength}</span>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "8px" }}>
                            <div style={{ background: "#fff", border: "1px solid var(--hairline)", borderRadius: "8px", padding: "7px 10px" }}>
                              <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.12em", marginBottom: "2px" }}>SUGGESTED DOSE</div>
                              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>{p.suggestedDose}</div>
                            </div>
                            <div style={{ background: "#fff", border: "1px solid var(--hairline)", borderRadius: "8px", padding: "7px 10px" }}>
                              <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.12em", marginBottom: "2px" }}>FREQUENCY</div>
                              <div style={{ fontSize: "12px", fontWeight: 500, color: "var(--ink)" }}>{p.frequency}</div>
                            </div>
                          </div>
                          <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--graphite)" }}>
                            Part of:{" "}
                            <Link href="/stacks">
                              <span style={{ color: "var(--cobalt)", fontWeight: 500, cursor: "pointer" }}>{p.stackName} →</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "24px 0", color: "var(--graphite)" }}>
                    <FlaskConical size={28} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
                    <div style={{ fontSize: "13px" }}>No stack protocol data available for this compound</div>
                  </div>
                )}

                {/* Storage / reconstitution always shown in protocol tab */}
                {(detail?.storage || detail?.solubility) && (
                  <div style={{ marginTop: "14px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "8px" }}>
                    {detail?.storage && (
                      <div style={{ background: "#F2F0EB", border: "1px solid var(--hairline)", borderRadius: "10px", padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                          <Thermometer size={11} color="var(--cobalt)" />
                          <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.08em" }}>STORAGE</span>
                        </div>
                        <p style={{ fontSize: "11px", color: "var(--graphite)", margin: 0, lineHeight: "1.5" }}>{detail.storage}</p>
                      </div>
                    )}
                    {detail?.solubility && (
                      <div style={{ background: "#F2F0EB", border: "1px solid var(--hairline)", borderRadius: "10px", padding: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "4px" }}>
                          <Droplets size={11} color="#059669" />
                          <span style={{ fontSize: "10px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.08em" }}>RECONSTITUTION</span>
                        </div>
                        <p style={{ fontSize: "11px", color: "var(--graphite)", margin: 0, lineHeight: "1.5" }}>{detail.solubility}</p>
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

  const isMobile = useIsMobile();
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

  const pillBtn = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px", borderRadius: "999px", cursor: "pointer",
    fontSize: "12px", fontWeight: active ? 600 : 500, whiteSpace: "nowrap",
    background: active ? "var(--ink)" : "#fff",
    color: active ? "#fff" : "var(--graphite)",
    border: `1px solid ${active ? "var(--ink)" : "var(--hairline)"}`,
    transition: "all 0.12s",
  });

  return (
    <div style={{ backgroundColor: "#fff", minHeight: "100vh" }}>

      <PageHero image={{ key: "hdr-research", alt: "OmniQure Epitalon research vial" }}
        crumbs={[{ label: "Protocols" }]}
        eyebrow="Research Protocols"
        icon={BookOpen}
        title="Peptide Protocol Reference"
        aside={
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {[
              { val: groups.length || "—", label: "Peptides" },
              { val: withProtocols.length || "—", label: "With Protocols" },
              { val: fullDataCount || "—", label: "Full Data Profiles" },
            ].map(({ val, label }) => (
              <div key={label}>
                <div style={{ fontSize: "28px", fontWeight: 600, color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.02em" }}>{val}</div>
                <div style={{ fontSize: "10px", color: "var(--graphite)", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.14em" }}>{label}</div>
              </div>
            ))}
          </div>
        }
      >
        <p style={{ margin: 0 }}>
          Uses, benefits, precautions, dosing, cycle lengths, and storage guidelines for all research peptides.
        </p>

        {/* Search bar */}
        <div style={{ maxWidth: "480px", marginTop: "20px", position: "relative" }}>
          <Search size={15} aria-hidden="true" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--graphite)" }} />
          <input
            type="text"
            aria-label="Search peptides"
            placeholder="Search peptide, area, or benefit…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", height: "44px", padding: "0 40px 0 42px",
              borderRadius: "999px", border: "1px solid var(--hairline)",
              background: "#fff", fontSize: "13px",
              outline: "none", boxSizing: "border-box", color: "var(--ink)",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} aria-label="Clear search" style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--graphite)", display: "flex" }}>
              <X size={13} />
            </button>
          )}
        </div>
      </PageHero>

      {/* Mobile category pill bar */}
      {isMobile && (
        <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", padding: "12px 20px", background: "#fff", borderBottom: "1px solid var(--hairline)" }}>
          <div style={{ display: "flex", gap: "6px", width: "max-content" }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} aria-pressed={category === cat} style={pillBtn(category === cat)}>{cat}</button>
            ))}
          </div>
        </div>
      )}

      {/* Layout */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12" style={{ paddingTop: isMobile ? "20px" : "32px", paddingBottom: "64px", display: "flex", gap: "28px", alignItems: "flex-start" }}>

        {/* Sidebar — desktop only */}
        {!isMobile && (
          <div style={{ width: "200px", flexShrink: 0, position: "sticky", top: "16px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--graphite)", letterSpacing: "0.14em", textTransform: "uppercase", padding: "0 12px 10px" }}>Categories</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  aria-pressed={category === cat}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "7px 12px", border: "none", cursor: "pointer", borderRadius: "999px",
                    fontSize: "12.5px", fontWeight: category === cat ? 600 : 400,
                    background: category === cat ? "#F2F0EB" : "transparent",
                    color: category === cat ? "var(--ink)" : "var(--graphite)",
                    transition: "all 0.1s",
                  }}
                >{cat}</button>
              ))}
            </div>
          </div>
        )}

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Toolbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "13px", color: "var(--graphite)" }}>
              Showing <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{groups.length}</strong> peptides
              {fullDataCount > 0 && <> · <span style={{ color: "#047857", fontWeight: 500 }}>{fullDataCount} with full data</span></>}
            </div>
            {(search || category !== "All") && (
              <button onClick={() => { setSearch(""); setCategory("All"); }}
                style={{ display: "flex", alignItems: "center", gap: "4px", background: "#fff", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "5px 12px", fontSize: "11px", color: "var(--ink)", cursor: "pointer", fontWeight: 500 }}>
                <X size={11} /> Clear filters
              </button>
            )}
          </div>

          {groups.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--graphite)" }}>
              <Beaker size={36} style={{ margin: "0 auto 12px", opacity: 0.4 }} />
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)" }}>No peptides found</div>
              <div style={{ fontSize: "13px", marginTop: "6px" }}>Try adjusting your search or category filter</div>
            </div>
          ) : (
            <>
              {/* With protocols section */}
              {withProtocols.length > 0 && category === "All" && !search && (
                <div style={{ marginBottom: "32px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <Activity size={14} color="var(--cobalt)" />
                    <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em", margin: 0 }}>Peptides with Research Protocols</h2>
                    <span style={{ background: "#F2F0EB", border: "1px solid var(--hairline)", color: "var(--graphite)", fontSize: "10px", fontWeight: 600, padding: "1px 8px", borderRadius: "999px" }}>{withProtocols.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "14px" }}>
                    {withProtocols.map(group => <ProtocolCard key={group.baseName} group={group} isMobile={isMobile} />)}
                  </div>
                </div>
              )}

              {/* Filtered results */}
              {(category !== "All" || search) && (
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "14px" }}>
                  {groups.map(group => <ProtocolCard key={group.baseName} group={group} isMobile={isMobile} />)}
                </div>
              )}

              {/* All peptides section */}
              {withoutProtocols.length > 0 && category === "All" && !search && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                    <FlaskConical size={14} color="var(--graphite)" />
                    <h2 style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em", margin: 0 }}>All Peptides — Reference Data</h2>
                    <span style={{ background: "#F2F0EB", border: "1px solid var(--hairline)", color: "var(--graphite)", fontSize: "10px", fontWeight: 600, padding: "1px 8px", borderRadius: "999px" }}>{withoutProtocols.length}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(340px, 1fr))", gap: "14px" }}>
                    {withoutProtocols.map(group => <ProtocolCard key={group.baseName} group={group} isMobile={isMobile} />)}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Research disclaimer */}
          <div style={{
            marginTop: "40px", padding: "16px 20px",
            background: "#F2F0EB", border: "1px solid var(--hairline)", borderRadius: "16px",
            display: "flex", gap: "12px", alignItems: "flex-start",
          }}>
            <AlertTriangle size={15} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
            <p style={{ fontSize: "12px", color: "var(--graphite)", margin: 0, lineHeight: "1.6" }}>
              <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Research Use Only.</strong>{" "}
              All protocols, uses, benefits, and precautions listed are sourced from published preclinical research and are intended solely for in-vitro and animal model research. These are <strong style={{ color: "var(--ink)" }}>not</strong> for human or veterinary administration. OmniQure supplies these compounds exclusively for laboratory research purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
