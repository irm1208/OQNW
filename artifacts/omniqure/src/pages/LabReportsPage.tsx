import { useState } from "react";
import { useSEO } from "@/hooks/useSEO";
import { useProducts } from "@/context/ProductsContext";
import { BarChart2, Atom, Download, ExternalLink, Search, CheckCircle2, ShieldCheck, FlaskConical } from "lucide-react";
import JanoshikReportModal from "@/components/JanoshikReportModal";

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
  purityCalculated?: boolean;
  /** When a report contains multiple tested vials, display all reported values. */
  purityLabel?: string;
  /** For blends: confirmed mass per component (mg) shown in place of purity */
  actualMass?: number;
  /** When a report contains multiple tested vials, display all reported values. */
  actualMassLabel?: string;
  massUnit?: string;
  massLabel?: string;
  verifyKey: string;
  image: string;
  certificatePdf?: string;
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
    verifyKey: "DSDYDF1TRWRC", image: "/janoshik/208600.png",
    productSlugs: ["bpc-157-10mg"],
  },
  {
    id: "tb500-10mg",
    name: "TB-500 (TB4)",
    amount: "10mg",
    testNumber: "208613", purity: 99.119, actualMass: 11.77,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208613-TB500_TB4_10mg_OmniQure_A9RR18DUH522",
    verifyKey: "A9RR18DUH522", image: "/janoshik/208613.png",
    productSlugs: ["tb-500-10mg"],
  },
  {
    id: "tesamorelin-20mg",
    name: "Tesamorelin",
    amount: "20mg",
    testNumber: "208612", purity: 99.358, actualMass: 23.57,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208612-Tesamorelin_20mh_OmniQure_NJDR19MRS3WC",
    verifyKey: "NJDR19MRS3WC", image: "/janoshik/208612.png",
    productSlugs: ["tesamorelin-20mg"],
  },
  {
    id: "semax-10mg",
    name: "Semax",
    amount: "10mg",
    testNumber: "208609", purity: 99.138, actualMass: 11.32,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208609-Semax_10mg_OmniQure_I42F8EHHKVHG",
    verifyKey: "I42F8EHHKVHG", image: "/janoshik/208609.png",
    productSlugs: ["semax-10mg"],
  },
  {
    id: "selank-10mg",
    name: "Selank",
    amount: "10mg",
    testNumber: "208610", purity: 99.161, actualMass: 10.55,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208610-Selank_10mg_OmniQure_FSSTD9WMADJH",
    verifyKey: "FSSTD9WMADJH", image: "/janoshik/208610.png",
    productSlugs: ["selank-10mg"],
  },
  {
    id: "ghkcu-100mg",
    name: "GHK-Cu",
    amount: "100mg",
    testNumber: "208608", purity: 99.912,
    actualMassLabel: "Total 108.95 · GHK 89.40 · Cu 19.55",
    massUnit: "mg", massLabel: "Confirmed mass breakdown",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208608-GHKCU_100mg_OmniQure_PYKSNGJUCS1Y",
    verifyKey: "PYKSNGJUCS1Y", image: "/janoshik/208608.png",
    productSlugs: ["ghk-cu-100mg"],
  },
  {
    id: "melanotan2-10mg",
    name: "Melanotan 2",
    amount: "10mg",
    testNumber: "208605", purity: 99.887, actualMass: 11.12,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208605-Melanotan_2_10mg_OmniQure_CUHNDPBS5IUD",
    verifyKey: "CUHNDPBS5IUD", image: "/janoshik/208605.png",
    productSlugs: ["melanotan-2-10mg"],
  },
  {
    id: "kpv-10mg",
    name: "KPV",
    amount: "10mg",
    testNumber: "208604", purity: 99.484, actualMass: 12.39,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208604-KPV_10mg_OmniQure_LYIZTLMNR54K",
    verifyKey: "LYIZTLMNR54K", image: "/janoshik/208604.png",
    productSlugs: ["kpv-10mg"],
  },
  {
    id: "cjc-ipamorelin-blend",
    name: "CJC-1295 No DAC + Ipamorelin Blend",
    amount: "10:10mg",
    testNumber: "208602",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208602-CJC1295_No_DAC_Ipamorelin_Blend_1010_OmniQure_UM1G6NTFHJCB",
    verifyKey: "UM1G6NTFHJCB", image: "/janoshik/208602.png",
    isBlend: true,
    // 23.21mg confirmed against a 20mg labelled blend; cap calculated purity at 100%.
    purity: 100, purityCalculated: true, actualMass: 23.21,
    productSlugs: ["cjc-1295-no-dac-ipamorelin-5mg"],
  },
  {
    id: "bpc157-tb500-blend",
    name: "BPC-157 + TB-500 (TB4) Blend",
    amount: "10:10mg",
    testNumber: "208601",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208601-BPC157_TB500_TB4_Blend_1010_OmniQure_3N3R5JF1157F",
    verifyKey: "3N3R5JF1157F", image: "/janoshik/208601.png",
    isBlend: true,
    // 23.44mg confirmed against a 20mg labelled blend; cap calculated purity at 100%.
    purity: 100, purityCalculated: true, actualMass: 23.44,
    productSlugs: ["bpc-157-tb-500-blend-10mg", "bpc-157-tb-500-blend-20mg"],
  },
  {
    id: "tirzepatide-30mg",
    name: "Tirzepatide",
    amount: "30mg",
    testNumber: "208603", purity: 99.924, actualMass: 37.99,
    purityLabel: "99.924 / 99.791 / 99.790",
    actualMassLabel: "37.99 / 33.76 / 33.70",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/208603-Tirzepatide_30mg_V3ZBG39CVZPW",
    verifyKey: "V3ZBG39CVZPW", image: "/janoshik/208603.png",
    productSlugs: ["tirzepatide-30mg"],
  },
  {
    id: "cagrilintide-10mg",
    name: "Cagrilintide",
    amount: "10mg",
    testNumber: "200664", purity: 99.952, actualMass: 10.05,
    purityLabel: "99.952 / 99.922",
    actualMassLabel: "10.05 / 10.32",
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/200664-Cag_10_XHPSD9IE65XR",
    verifyKey: "XHPSD9IE65XR", image: "/janoshik/200664.png",
    productSlugs: ["cagrilintide-10mg"],
  },
  {
    id: "retatrutide-40mg",
    name: "Retatrutide",
    amount: "40mg",
    testNumber: "203231", purity: 99.714, actualMass: 50.93,
    methods: ["HPLC", "ESI-MS"],
    url: "https://verify.janoshik.com/tests/203231-Retatrutide_40mg_XY2IAQ58G5EY",
    verifyKey: "XY2IAQ58G5EY", image: "/janoshik/203231.png",
    productSlugs: ["retatrutide-40mg"],
  },
  {
    id: "pt141-10mg-234988",
    name: "PT-141",
    amount: "10mg",
    testNumber: "234988", purity: 99.691, actualMass: 10.75,
    methods: ["Independent analysis"],
    url: "https://verify.janoshik.com/tests/234988-PT141_10mg_OmniQure_KZTYNULXZ15U",
    verifyKey: "KZTYNULXZ15U", image: "/janoshik/234988.png", certificatePdf: "/janoshik/234988.pdf",
    productSlugs: [],
  },
  {
    id: "kisspeptin-10mg-234989",
    name: "Kisspeptin-10",
    amount: "10mg",
    testNumber: "234989", purity: 99.851, actualMass: 10.94,
    methods: ["Independent analysis"],
    url: "https://verify.janoshik.com/tests/234989-Kisspeptin_10mg_OmniQure_IIBBDYNKAP1Z",
    verifyKey: "IIBBDYNKAP1Z", image: "/janoshik/234989.png", certificatePdf: "/janoshik/234989.pdf",
    productSlugs: ["kisspeptin-10-10mg"],
  },
  {
    id: "nad-plus-1000mg-234990",
    name: "NAD+",
    amount: "1000mg",
    testNumber: "234990", purity: 99.4, purityCalculated: true, actualMass: 993.81,
    methods: ["ID + amount"],
    url: "https://verify.janoshik.com/tests/234990-NAD_1000mg_OmniQure_52TERHWRSPJZ",
    verifyKey: "52TERHWRSPJZ", image: "/janoshik/234990.png", certificatePdf: "/janoshik/234990.pdf",
    productSlugs: ["nad-plus-1000mg"],
  },
  {
    id: "klow-blend-234991",
    name: "KLOW BLEND",
    amount: "80mg",
    testNumber: "234991",
    methods: ["3-component analysis"],
    isBlend: true,
    purity: 43.9, purityCalculated: true,
    actualMassLabel: "BPC 12.58 · TB4 11.59 · KPV 10.96",
    massUnit: "mg each",
    massLabel: "Component masses",
    url: "https://verify.janoshik.com/tests/234991-KLOW_OmniQure_PZ1MU4KS2U4J",
    verifyKey: "PZ1MU4KS2U4J", image: "/janoshik/234991.png", certificatePdf: "/janoshik/234991.pdf",
    productSlugs: ["klow-blend-80mg"],
  },
  {
    id: "thymosin-alpha-1-234992",
    name: "Thymosin Alpha-1",
    amount: "10mg",
    testNumber: "234992", purity: 99.700, actualMass: 12.00,
    methods: ["Independent analysis"],
    url: "https://verify.janoshik.com/tests/234992-Thymosin_Alpha1_10mg_OmniQure_B4Y47TDR6YCG",
    verifyKey: "B4Y47TDR6YCG", image: "/janoshik/234992.png", certificatePdf: "/janoshik/234992.pdf",
    productSlugs: ["thymosin-alpha-1-10mg"],
  },
  {
    id: "mots-c-10mg-234993",
    name: "MOTS-C",
    amount: "10mg",
    testNumber: "234993", purity: 99.221, actualMass: 11.08,
    methods: ["Independent analysis"],
    url: "https://verify.janoshik.com/tests/234993-MOTSC_10mg_OmniQure_2KFAVDKNHLKG",
    verifyKey: "2KFAVDKNHLKG", image: "/janoshik/234993.png", certificatePdf: "/janoshik/234993.pdf",
    productSlugs: ["mots-c-10mg"],
  },
  {
    id: "melanotan-1-10mg-235090",
    name: "Melanotan 1",
    amount: "10mg",
    testNumber: "235090", purity: 99.798, actualMass: 10.32,
    methods: ["Independent analysis"],
    url: "https://verify.janoshik.com/tests/235090-Melanotan_1_10mg_OmniQure_AUEJK7GU6QXH",
    verifyKey: "AUEJK7GU6QXH", image: "/janoshik/235090.png", certificatePdf: "/janoshik/235090.pdf",
    productSlugs: ["melanotan-1-10mg"],
  },
];

// ─── Card ─────────────────────────────────────────────────────────────────────

function ReportCard({ report, onQuickView }: { report: Report; onQuickView: () => void }) {
  const isBlend = !!report.isBlend;
  const hasPurity = report.purityLabel !== undefined || report.purity !== undefined;
  const purityDisplay = report.purityLabel ?? report.purity?.toFixed(1);
  const hasMass = report.actualMassLabel !== undefined || report.actualMass !== undefined;
  const massDisplay = report.actualMassLabel ?? report.actualMass?.toFixed(2);

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
           // Let long multi-result labels shrink inside each column.
           gridTemplateColumns: "minmax(0, 1fr) 1px minmax(0, 1fr)",
          alignItems: "center",
        }}>
          {/* Purity */}
           <div style={{ minWidth: 0, paddingRight: "12px" }}>
            {hasPurity ? (
              <>
                 <div style={{ display: "flex", alignItems: "baseline", gap: "2px", minWidth: 0 }}>
                   <span style={{ minWidth: 0, fontSize: report.purityLabel ? "15px" : "26px", fontWeight: 900, color: numColor, lineHeight: 1.15, letterSpacing: report.purityLabel ? "-0.02em" : "-0.03em", whiteSpace: report.purityLabel ? "normal" : "nowrap", overflowWrap: "break-word" }}>
                    {purityDisplay}
                  </span>
                   <span style={{ flexShrink: 0, fontSize: "12px", fontWeight: 700, color: unitColor }}>%</span>
                </div>
                 <p style={{ margin: "2px 0 0", fontSize: "9px", lineHeight: 1.2, color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "normal" }}>
                  {report.purityCalculated ? "Calculated from vial mass" : "Purity"}
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
           <div style={{ minWidth: 0, paddingLeft: "12px" }}>
            {hasMass ? (
              <>
                 <div style={{ display: "flex", alignItems: "baseline", gap: "2px", minWidth: 0 }}>
                   <span style={{ minWidth: 0, fontSize: report.actualMassLabel ? "15px" : "26px", fontWeight: 900, color: massColor, lineHeight: 1.15, letterSpacing: report.actualMassLabel ? "-0.02em" : "-0.03em", whiteSpace: report.actualMassLabel ? "normal" : "nowrap", overflowWrap: "break-word" }}>
                    {massDisplay}
                  </span>
                   <span style={{ flexShrink: 0, fontSize: "11px", fontWeight: 700, color: unitColor }}>{report.massUnit ?? "mg"}</span>
                </div>
                 <p style={{ margin: "2px 0 0", fontSize: "9px", lineHeight: 1.2, color: "#64748B", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "normal" }}>
                  {report.massLabel ?? "Mass confirmed"}
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
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {report.methods.map((method) => (
            <span key={method} style={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "6px",
            background: method === "ESI-MS" ? "#F5F3FF" : "#EFF6FF",
            color: method === "ESI-MS" ? "#5B21B6" : "#1240A0",
            border: method === "ESI-MS" ? "1px solid #DDD6FE" : "1px solid #BFDBFE",
            letterSpacing: "0.04em",
          }}>
            {method === "HPLC" ? <BarChart2 size={9} /> : method === "ESI-MS" ? <Atom size={9} /> : <FlaskConical size={9} />}
            {method}
          </span>
          ))}
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
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {/* Quick View */}
          <button
            onClick={onQuickView}
            style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              fontSize: "11px", fontWeight: 700,
              padding: "5px 10px", borderRadius: "6px",
              background: "#fff",
              color: isBlend ? "#5b21b6" : navy,
              border: `1.5px solid ${isBlend ? "#DDD6FE" : "#BFDBFE"}`,
              cursor: "pointer",
              transition: "background 0.15s, border-color 0.15s",
              letterSpacing: "0.01em",
            }}
            onMouseOver={e => {
              (e.currentTarget as HTMLButtonElement).style.background = isBlend ? "#F5F3FF" : "#EFF6FF";
              (e.currentTarget as HTMLButtonElement).style.borderColor = isBlend ? "#c4b5fd" : "#93c5fd";
            }}
            onMouseOut={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "#fff";
              (e.currentTarget as HTMLButtonElement).style.borderColor = isBlend ? "#DDD6FE" : "#BFDBFE";
            }}
          >
            Quick View
          </button>
          {report.certificatePdf && (
            <a
              href={report.certificatePdf}
              download
              style={{
                display: "inline-flex", alignItems: "center", gap: "4px",
                fontSize: "11px", fontWeight: 700,
                padding: "5px 10px", borderRadius: "6px",
                background: "#fff", color: isBlend ? "#5b21b6" : navy,
                border: `1.5px solid ${isBlend ? "#DDD6FE" : "#BFDBFE"}`,
                textDecoration: "none",
                letterSpacing: "0.01em",
              }}
            >
              PDF <Download size={11} />
            </a>
          )}
          {/* View on Janoshik */}
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "4px",
              fontSize: "11px", fontWeight: 700,
              padding: "5px 10px", borderRadius: "6px",
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
            Janoshik <ExternalLink size={11} />
          </a>
        </div>
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
  const { products, loading: productsLoading } = useProducts();
  const [modalReport, setModalReport] = useState<Report | null>(null);

  const publishedSlugs = new Set(products.map(product => product.slug));

  // Linked reports are visible only when their database-backed product is public.
  const visibleReports = REPORTS.filter(r => {
    if (r.productSlugs.length === 0) return true; // no slug mapping — always show
    if (productsLoading) return false;
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
            {filtered.map(r => <ReportCard key={r.id} report={r} onQuickView={() => setModalReport(r)} />)}
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ marginTop: "48px", textAlign: "center", fontSize: "11px", color: "#94A3B8", lineHeight: 1.7, maxWidth: "560px", margin: "48px auto 0" }}>
          All products are sold strictly for in-vitro research purposes only. Not approved for human or veterinary use.
          Lab reports are independently issued by Janoshik Analytical and can be verified at verify.janoshik.com.
        </p>
      </div>

      {/* Janoshik report modal */}
      {modalReport && (
        <JanoshikReportModal
          taskNumber={modalReport.testNumber}
          verifyKey={modalReport.verifyKey}
          verifyUrl={modalReport.url}
          image={modalReport.image}
          certificatePdf={modalReport.certificatePdf}
          productName={modalReport.name}
          onClose={() => setModalReport(null)}
        />
      )}
    </div>
  );
}
