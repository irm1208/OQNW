import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { BarChart2, Atom, ExternalLink, Search, CheckCircle2, ShieldCheck, FlaskConical } from "lucide-react";

// ─── Janoshik logo components ─────────────────────────────────────────────────

/** Renders the real Janoshik logo image.
 *  invert=true  → white version for dark backgrounds (CSS brightness+invert)
 *  height       → controls rendered height; width scales automatically
 */
function JanoshikLogo({ height = 22, invert = false }: { height?: number; invert?: boolean }) {
  return (
    <img
      src="/janoshik/janoshik-logo.jpg"
      alt="Janoshik"
      style={{
        height: height + "px",
        width: "auto",
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: "3px",
        filter: invert ? "brightness(0) invert(1)" : undefined,
      }}
    />
  );
}

// ─── Report data (Janoshik verified) ─────────────────────────────────────────

interface Report {
  id: string;
  name: string;
  amount: string;
  testNumber: string;
  methods: string[];
  url: string;
  isBlend?: boolean;
  purity?: number;
  /** For blends: confirmed mass per component (mg) shown in place of purity */
  actualMass?: number;
  /** Slugs of the matching product(s) in the catalogue. Report is hidden if
   *  none of these slugs are currently published. Empty array = always show. */
  productSlugs: string[];
}

const REPORTS: Report[] = [
  {
    id: "bpc157-10mg",
    name: "BPC-157",
    amount: "10mg",
    testNumber: "208600", purity: 99.892, actualMass: 11.95,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208600-BPC157_10mg_OmniQure_DSDYDF1TRWRC",
    productSlugs: ["bpc-157-10mg"],
  },
  {
    id: "tb500-10mg",
    name: "TB-500 (TB4)",
    amount: "10mg",
    testNumber: "208613", purity: 99.119, actualMass: 11.77,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208613-TB500_TB4_10mg_OmniQure_A9RR18DUH522",
    productSlugs: ["tb-500-10mg"],
  },
  {
    id: "tesamorelin-20mg",
    name: "Tesamorelin",
    amount: "20mg",
    testNumber: "208612", purity: 99.358, actualMass: 23.57,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208612-Tesamorelin_20mh_OmniQure_NJDR19MRS3WC",
    productSlugs: ["tesamorelin-20mg"],
  },
  {
    id: "semax-10mg",
    name: "Semax",
    amount: "10mg",
    testNumber: "208609", purity: 99.138, actualMass: 11.32,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208609-Semax_10mg_OmniQure_I42F8EHHKVHG",
    productSlugs: ["semax-10mg"],
  },
  {
    id: "selank-10mg",
    name: "Selank",
    amount: "10mg",
    testNumber: "208610", purity: 99.161, actualMass: 10.55,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208610-Selank_10mg_OmniQure_FSSTD9WMADJH",
    productSlugs: ["selank-10mg"],
  },
  {
    id: "ghkcu-100mg",
    name: "GHK-Cu",
    amount: "100mg",
    testNumber: "208608", purity: 99.912, actualMass: 108.95,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208608-GHKCU_100mg_OmniQure_PYKSNGJUCS1Y",
    productSlugs: ["ghk-cu-100mg"],
  },
  {
    id: "melanotan2-10mg",
    name: "Melanotan 2",
    amount: "10mg",
    testNumber: "208605", purity: 99.887, actualMass: 11.12,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208605-Melanotan_2_10mg_OmniQure_CUHNDPBS5IUD",
    productSlugs: ["melanotan-2-10mg"],
  },
  {
    id: "kpv-10mg",
    name: "KPV",
    amount: "10mg",
    testNumber: "208604", purity: 99.484, actualMass: 12.39,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208604-KPV_10mg_OmniQure_LYIZTLMNR54K",
    productSlugs: ["kpv-10mg"],
  },
  {
    id: "cjc-ipamorelin-blend",
    name: "CJC-1295 No DAC + Ipamorelin Blend",
    amount: "10:10mg",
    testNumber: "208602",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208602-CJC1295_No_DAC_Ipamorelin_Blend_1010_OmniQure_UM1G6NTFHJCB",
    isBlend: true,
    actualMass: 23.21,
    productSlugs: ["cjc-1295-no-dac-ipamorelin-5mg"],
  },
  {
    id: "bpc157-tb500-blend",
    name: "BPC-157 + TB-500 (TB4) Blend",
    amount: "10:10mg",
    testNumber: "208601",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208601-BPC157_TB500_TB4_Blend_1010_OmniQure_3N3R5JF1157F",
    isBlend: true,
    actualMass: 23.44,
    productSlugs: ["bpc-157-tb-500-blend-10mg", "bpc-157-tb-500-blend-20mg"],
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function ReportCard({ report }: { report: Report }) {
  const isBlend = !!report.isBlend;

  // Site palette
  const navy      = "#0D2565";
  const blue      = "#1B5CB5";
  const blueLight = "#EFF6FF";
  const border    = "#D1DDF5";
  const topBar    = isBlend
    ? "linear-gradient(90deg, #4f46e5, #7c3aed)"
    : "linear-gradient(90deg, #0D2565, #1B5CB5)";
  const spotBg    = isBlend ? "#F5F3FF" : blueLight;
  const spotBdr   = isBlend ? "#DDD6FE" : "#BFDBFE";
  const numColor  = isBlend ? "#5b21b6" : navy;
  const unitColor = isBlend ? "#7c3aed" : blue;
  const massColor = isBlend ? "#6d28d9" : "#1240A0";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: `1.5px solid ${border}`,
        boxShadow: "0 2px 10px rgba(13,37,101,0.07)",
        transition: "transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease",
      }}
      onMouseOver={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = isBlend
          ? "0 12px 32px rgba(91,33,182,0.14), 0 0 0 1.5px #c4b5fd"
          : "0 12px 32px rgba(13,37,101,0.14), 0 0 0 1.5px #93C5FD";
        (e.currentTarget as HTMLDivElement).style.borderColor = isBlend ? "#c4b5fd" : "#93C5FD";
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLDivElement).style.transform = "none";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 10px rgba(13,37,101,0.07)";
        (e.currentTarget as HTMLDivElement).style.borderColor = border;
      }}
    >
      {/* Accent bar */}
      <div style={{ height: "4px", background: topBar, flexShrink: 0 }} />

      {/* Body */}
      <div style={{ padding: "18px 18px 14px", flex: 1 }}>

        {/* Name row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "14px" }}>
          <div>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 900, color: navy, lineHeight: 1.25, letterSpacing: "-0.01em" }}>
              {report.name}
            </p>
            {report.amount !== "—" && (
              <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#64748B", fontWeight: 600 }}>
                {report.amount}
              </p>
            )}
          </div>
          <span style={{
            flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "9.5px", fontWeight: 800, padding: "3px 9px", borderRadius: "20px",
            background: "#ECFDF5", color: "#059669",
            border: "1px solid #6EE7B7", letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}>
            <CheckCircle2 size={9} /> VERIFIED
          </span>
        </div>

        {/* Results spotlight — purity + mass */}
        <div style={{
          background: spotBg,
          border: `1px solid ${spotBdr}`,
          borderRadius: "10px",
          padding: "11px 14px",
          marginBottom: "12px",
          display: "grid",
          gridTemplateColumns: "1fr 1px 1fr",
          alignItems: "center",
        }}>
          {/* Purity */}
          <div style={{ paddingRight: "12px" }}>
            {report.purity !== undefined ? (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                  <span style={{ fontSize: "26px", fontWeight: 900, color: numColor, lineHeight: 1, letterSpacing: "-0.03em" }}>
                    {report.purity.toFixed(1)}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: unitColor }}>%</span>
                </div>
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Purity
                </p>
              </>
            ) : (
              <>
                <span style={{ fontSize: "20px", fontWeight: 900, color: "#CBD5E1", lineHeight: 1 }}>—</span>
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: "#94A3B8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Purity
                </p>
              </>
            )}
          </div>

          {/* Divider */}
          <div style={{ background: spotBdr, alignSelf: "stretch" }} />

          {/* Mass */}
          <div style={{ paddingLeft: "12px" }}>
            {report.actualMass !== undefined ? (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                  <span style={{ fontSize: "26px", fontWeight: 900, color: massColor, lineHeight: 1, letterSpacing: "-0.03em" }}>
                    {report.actualMass.toFixed(2)}
                  </span>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: unitColor }}>mg</span>
                </div>
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Mass confirmed
                </p>
              </>
            ) : (
              <>
                <span style={{ fontSize: "20px", fontWeight: 900, color: "#CBD5E1", lineHeight: 1 }}>—</span>
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: "#94A3B8", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  Mass confirmed
                </p>
              </>
            )}
          </div>
        </div>

        {/* Method pills */}
        <div style={{ display: "flex", gap: "6px" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px",
            background: "#EFF6FF", color: "#1240A0",
            border: "1px solid #BFDBFE", letterSpacing: "0.04em",
          }}>
            <BarChart2 size={9} /> HPLC
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px",
            background: "#F5F3FF", color: "#5B21B6",
            border: "1px solid #DDD6FE", letterSpacing: "0.04em",
          }}>
            <Atom size={9} /> ESI-MS
          </span>
          <span style={{
            fontSize: "10px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px",
            background: "#F8FAFC", color: "#64748B",
            border: "1px solid #E2E8F0",
          }}>
            #{report.testNumber}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "10px 18px 14px",
        borderTop: `1px solid ${border}`,
        background: "#F8FAFD",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
      }}>
        <span style={{ background: "#E8F0F8", borderRadius: "30px", padding: "4px 12px", display: "inline-flex", alignItems: "center" }}>
          <img src="/janoshik/janoshik-logo.jpg" alt="Janoshik" style={{ height: "15px", width: "auto", display: "block" }} />
        </span>
        <a
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            fontSize: "12px", fontWeight: 700,
            padding: "7px 16px", borderRadius: "8px",
            background: topBar,
            color: "#fff",
            textDecoration: "none",
            boxShadow: isBlend
              ? "0 2px 10px rgba(91,33,182,0.25)"
              : "0 2px 10px rgba(13,37,101,0.22)",
            transition: "opacity 0.15s",
            letterSpacing: "0.01em",
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={e => (e.currentTarget.style.opacity = "1")}
        >
          View Report <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LabReportsPage() {
  useSEO({
    title: "Independent Results",
    description:
      "Independent HPLC and ESI-MS lab reports for OmniQure peptides, verified by Janoshik Analytical. View purity data and molecular identity confirmation for every tested batch.",
    canonicalPath: "/lab-reports",
  });

  const [search, setSearch] = useState("");
  const [publishedSlugs, setPublishedSlugs] = useState<Set<string> | null>(null);

  // Fetch published products to know which to show
  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then((products: { slug: string }[]) => {
        setPublishedSlugs(new Set(products.map(p => p.slug)));
      })
      .catch(() => {
        // On error, show all reports (fail open) — null means "still loading / show all"
        setPublishedSlugs(null);
      });
  }, []);

  // A report is visible if its product is published (or it has no linked slug, or data not yet loaded)
  const visibleReports = REPORTS.filter(r => {
    if (publishedSlugs === null) return true; // still loading — show all
    if (r.productSlugs.length === 0) return true; // no slug mapping — always show
    return r.productSlugs.some(slug => publishedSlugs.has(slug));
  });

  const filtered = search
    ? visibleReports.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : visibleReports;

  return (
    <div style={{ minHeight: "100vh", background: "#F5F8FC", fontFamily: "'Arimo', Arial, sans-serif" }}>

      {/* Hero */}
      <div style={{
        background: "linear-gradient(90deg, #0D2565 0%, #1240A0 40%, #1B5CB5 75%, #1E68CC 100%)",
        padding: "40px 24px 36px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }} />
        <div style={{ maxWidth: "960px", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "14px", background: "rgba(255,255,255,0.10)", border: "1px solid rgba(255,255,255,0.22)", padding: "8px 10px 8px 18px", borderRadius: "50px", marginBottom: "20px", backdropFilter: "blur(6px)" }}>
            <ShieldCheck size={14} color="#6EE7B7" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#6EE7B7", letterSpacing: "0.08em" }}>INDEPENDENTLY TESTED BY</span>
            <span style={{
              background: "#E8F0F8",
              borderRadius: "40px",
              padding: "7px 18px",
              display: "inline-flex",
              alignItems: "center",
              boxShadow: "0 2px 14px rgba(0,0,0,0.22)",
            }}>
              <JanoshikLogo height={26} />
            </span>
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
            Independent Results
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#BFDBFE", lineHeight: 1.7, maxWidth: "580px" }}>
            Every report below is hosted on Janoshik's own verification platform — an independent third-party analytical laboratory. Click "View Report" to see the raw purity, mass spec data, and chromatogram directly on their site.
          </p>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-end" }}>
            {[
              { value: `${visibleReports.length}`, label: "verified reports" },
              { value: "HPLC + ESI-MS", label: "testing methods" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#fff" }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
              </div>
            ))}
            <div>
              <span style={{ background: "rgba(255,255,255,0.95)", borderRadius: "6px", padding: "3px 8px", display: "inline-flex", alignItems: "center" }}>
                <JanoshikLogo height={18} />
              </span>
              <p style={{ margin: "3px 0 0", fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>independent lab</p>
            </div>
          </div>
        </div>
      </div>

      {/* How it works strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8EDF5" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "18px 24px", display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "center" }}>
          {[
            { icon: <FlaskConical size={15} color="#1B5CB5" />, title: "HPLC Analysis", desc: "Reverse-phase chromatography confirms purity by peak area at 214 nm UV." },
            { icon: <Atom size={15} color="#7C3AED" />, title: "ESI-MS", desc: "Electrospray ionisation mass spectrometry verifies the molecular identity." },
            { icon: <JanoshikLogo height={18} />, title: "Independent lab", desc: "Reports are hosted and signed by Janoshik Analytical — not by OmniQure." },
          ].map(item => (
            <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: "1 1 220px" }}>
              <span style={{ flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 700, color: "#0D2565" }}>{item.title}</p>
                <p style={{ margin: 0, fontSize: "11.5px", color: "#64748B", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: "28px 24px 64px" }}>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: "420px", marginBottom: "24px" }}>
          <Search size={14} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", pointerEvents: "none" }} />
          <input
            type="text"
            placeholder="Search peptide…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", height: "42px",
              paddingLeft: "38px", paddingRight: "14px",
              borderRadius: "10px", border: "1.5px solid #E2E8F0",
              outline: "none", fontSize: "13.5px",
              background: "#fff", color: "#0F172A",
              fontFamily: "'Arimo', Arial, sans-serif",
              boxSizing: "border-box",
            }}
          />
        </div>

        {/* Count */}
        <p style={{ margin: "0 0 16px", fontSize: "11.5px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 700 }}>
          {filtered.length} report{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "#94A3B8" }}>
            <FlaskConical size={36} color="#E2E8F0" style={{ marginBottom: "12px" }} />
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#475569", margin: "0 0 6px" }}>No reports match</p>
            <p style={{ fontSize: "13px", margin: 0 }}>Try a different search term.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
            {filtered.map(r => <ReportCard key={r.id} report={r} />)}
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ marginTop: "48px", textAlign: "center", fontSize: "11px", color: "#94A3B8", lineHeight: 1.7, maxWidth: "560px", margin: "48px auto 0" }}>
          All products are sold strictly for in-vitro research purposes only. Not approved for human or veterinary use.
          Lab reports are independently issued by Janoshik Analytical and can be verified at verify.janoshik.com.
        </p>
      </div>
    </div>
  );
}
