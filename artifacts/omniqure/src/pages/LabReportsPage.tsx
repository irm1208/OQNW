import { useState, useEffect } from "react";
import { useSEO } from "@/hooks/useSEO";
import { BarChart2, Atom, ExternalLink, Search, CheckCircle2, ShieldCheck, FlaskConical } from "lucide-react";

// ─── Report data (Janoshik verified) ─────────────────────────────────────────

interface Report {
  id: string;
  name: string;
  amount: string;
  testNumber: string;
  methods: string[];
  url: string;
  isBlend?: boolean;
  /** Slugs of the matching product(s) in the catalogue. Report is hidden if
   *  none of these slugs are currently published. Empty array = always show. */
  productSlugs: string[];
}

const REPORTS: Report[] = [
  {
    id: "bpc157-10mg",
    name: "BPC-157",
    amount: "10mg",
    testNumber: "208600",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208600-BPC157_10mg_OmniQure_DSDYDF1TRWRC",
    productSlugs: ["bpc-157-10mg"],
  },
  {
    id: "tb500-10mg",
    name: "TB-500 (TB4)",
    amount: "10mg",
    testNumber: "208613",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208613-TB500_TB4_10mg_OmniQure_A9RR18DUH522",
    productSlugs: ["tb-500-10mg"],
  },
  {
    id: "tesamorelin-20mg",
    name: "Tesamorelin",
    amount: "20mg",
    testNumber: "208612",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208612-Tesamorelin_20mh_OmniQure_NJDR19MRS3WC",
    productSlugs: ["tesamorelin-20mg"],
  },
  {
    id: "semax-10mg",
    name: "Semax",
    amount: "10mg",
    testNumber: "208609",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208609-Semax_10mg_OmniQure_I42F8EHHKVHG",
    productSlugs: ["semax-10mg"],
  },
  {
    id: "selank-10mg",
    name: "Selank",
    amount: "10mg",
    testNumber: "208610",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208610-Selank_10mg_OmniQure_FSSTD9WMADJH",
    productSlugs: ["selank-10mg"],
  },
  {
    id: "ghkcu-100mg",
    name: "GHK-Cu",
    amount: "100mg",
    testNumber: "208608",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208608-GHKCU_100mg_OmniQure_PYKSNGJUCS1Y",
    productSlugs: ["ghk-cu-100mg"],
  },
  {
    id: "melanotan2-10mg",
    name: "Melanotan 2",
    amount: "10mg",
    testNumber: "208605",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208605-Melanotan_2_10mg_OmniQure_CUHNDPBS5IUD",
    productSlugs: ["melanotan-2-10mg"],
  },
  {
    id: "kpv-10mg",
    name: "KPV",
    amount: "10mg",
    testNumber: "208604",
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
    productSlugs: ["bpc-157-tb-500-blend-10mg", "bpc-157-tb-500-blend-20mg"],
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function ReportCard({ report }: { report: Report }) {
  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #E8EDF5",
      borderRadius: "14px",
      overflow: "hidden",
      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      display: "flex",
      flexDirection: "column",
      transition: "box-shadow 0.2s, border-color 0.2s",
    }}
      onMouseOver={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 6px 24px rgba(18,64,160,0.10)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#BFDBFE";
      }}
      onMouseOut={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 1px 6px rgba(0,0,0,0.05)";
        (e.currentTarget as HTMLDivElement).style.borderColor = "#E8EDF5";
      }}
    >
      {/* Top section */}
      <div style={{ padding: "20px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              width: "38px", height: "38px", borderRadius: "10px",
              background: report.isBlend
                ? "linear-gradient(135deg, #F5F3FF, #EDE9FE)"
                : "linear-gradient(135deg, #EFF6FF, #DBEAFE)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <FlaskConical size={17} color={report.isBlend ? "#7C3AED" : "#1B5CB5"} />
            </span>
            <div>
              <p style={{ margin: 0, fontSize: "15px", fontWeight: 800, color: "#0D2565", lineHeight: 1.2 }}>
                {report.name}
              </p>
              {report.amount !== "—" && (
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#94A3B8", fontWeight: 600 }}>
                  {report.amount}
                </p>
              )}
            </div>
          </div>
          {/* Verified badge */}
          <span style={{
            flexShrink: 0,
            display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "10px", fontWeight: 700,
            padding: "3px 8px", borderRadius: "20px",
            background: "#ECFDF5", color: "#059669",
            border: "1px solid #6EE7B7",
          }}>
            <CheckCircle2 size={10} />
            Verified
          </span>
        </div>

        {/* Method pills */}
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "10.5px", fontWeight: 700,
            padding: "3px 10px", borderRadius: "6px",
            background: "#EFF6FF", color: "#1B5CB5",
          }}>
            <BarChart2 size={10} />
            HPLC
          </span>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "10.5px", fontWeight: 700,
            padding: "3px 10px", borderRadius: "6px",
            background: "#F5F3FF", color: "#7C3AED",
          }}>
            <Atom size={10} />
            ESI-MS
          </span>
          <span style={{
            fontSize: "10.5px", fontWeight: 600,
            padding: "3px 10px", borderRadius: "6px",
            background: "#F8FAFC", color: "#64748B",
          }}>
            #{report.testNumber}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #F1F5F9", margin: "0 20px" }} />

      {/* Janoshik attribution + link */}
      <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldCheck size={13} color="#059669" />
          <span style={{ fontSize: "11px", color: "#64748B", fontWeight: 500 }}>
            Janoshik Analytical
          </span>
        </div>
        <a
          href={report.url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex", alignItems: "center", gap: "5px",
            fontSize: "12px", fontWeight: 700,
            padding: "6px 14px", borderRadius: "8px",
            background: "linear-gradient(135deg, #0D2565, #1B5CB5)",
            color: "#fff",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(18,64,160,0.25)",
            transition: "opacity 0.15s",
          }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.88")}
          onMouseOut={e => (e.currentTarget.style.opacity = "1")}
        >
          View Report
          <ExternalLink size={11} />
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
        // On error, show all reports (fail open)
        setPublishedSlugs(new Set());
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
          <div style={{ display: "inline-flex", alignItems: "center", gap: "7px", background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)", padding: "4px 13px", borderRadius: "20px", marginBottom: "16px" }}>
            <ShieldCheck size={12} color="#6EE7B7" />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#6EE7B7", letterSpacing: "0.06em" }}>
              INDEPENDENTLY TESTED · JANOSHIK ANALYTICAL
            </span>
          </div>
          <h1 style={{ margin: "0 0 10px", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 900, color: "#fff", letterSpacing: "-0.02em" }}>
            Independent Results
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: "14px", color: "#BFDBFE", lineHeight: 1.7, maxWidth: "580px" }}>
            Every report below is hosted on Janoshik's own verification platform — an independent third-party analytical laboratory. Click "View Report" to see the raw purity, mass spec data, and chromatogram directly on their site.
          </p>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            {[
              { value: `${visibleReports.length}`, label: "verified reports" },
              { value: "HPLC + ESI-MS", label: "testing methods" },
              { value: "Janoshik", label: "independent lab" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ margin: 0, fontSize: "18px", fontWeight: 900, color: "#fff" }}>{s.value}</p>
                <p style={{ margin: 0, fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8EDF5" }}>
        <div style={{ maxWidth: "960px", margin: "0 auto", padding: "18px 24px", display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "center" }}>
          {[
            { icon: <FlaskConical size={15} color="#1B5CB5" />, title: "HPLC Analysis", desc: "Reverse-phase chromatography confirms purity by peak area at 214 nm UV." },
            { icon: <Atom size={15} color="#7C3AED" />, title: "ESI-MS", desc: "Electrospray ionisation mass spectrometry verifies the molecular identity." },
            { icon: <ShieldCheck size={15} color="#059669" />, title: "Independent lab", desc: "Reports are hosted and signed by Janoshik Analytical — not by OmniQure." },
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
