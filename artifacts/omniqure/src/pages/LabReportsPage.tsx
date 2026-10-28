import { useMemo, useState } from "react";
import { Link } from "wouter";
import { useSEO } from "@/hooks/useSEO";
import { useProducts } from "@/context/ProductsContext";
import { BarChart2, Atom, Download, ExternalLink, Search, CheckCircle2, ShieldCheck, FlaskConical, AlertTriangle } from "lucide-react";
import JanoshikReportModal from "@/components/JanoshikReportModal";
import PageHero from "@/components/PageHero";

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
    methods: ["4-component analysis"],
    isBlend: true,
    // Includes the GHK-Cu totals from the certificate Comments section:
    // average confirmed mass is 96.33mg against an 80mg labelled blend.
    purity: 100, purityCalculated: true,
    actualMassLabel: "BPC 12.59 · TB4 11.61 · KPV 10.97 · GHK-Cu 61.16",
    massUnit: "mg avg",
    massLabel: "Average mass incl. GHK-Cu comments",
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

const CARD_BORDER = "rgba(11,18,32,0.09)";

function ReportCard({
  report,
  productHref,
  onQuickView,
}: {
  report: Report;
  /** Catalogue page for the product this report certifies, when published. */
  productHref?: string;
  onQuickView: () => void;
}) {
  const isBlend = !!report.isBlend;
  const hasPurity = report.purityLabel !== undefined || report.purity !== undefined;
  const purityDisplay = report.purityLabel ?? report.purity?.toFixed(1);
  const hasMass = report.actualMassLabel !== undefined || report.actualMass !== undefined;
  const massDisplay = report.actualMassLabel ?? report.actualMass?.toFixed(2);

  const secondaryBtn: React.CSSProperties = {
    display: "inline-flex", alignItems: "center", gap: "4px",
    fontSize: "11px", fontWeight: 500,
    padding: "5px 12px", borderRadius: "999px",
    background: "#fff", color: "var(--ink)",
    border: "1px solid var(--hairline)",
    cursor: "pointer", textDecoration: "none",
    transition: "background 0.15s",
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        border: `1px solid ${CARD_BORDER}`,
        transition: "border-color 0.18s ease",
      }}
      onMouseOver={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(11,18,32,0.2)"; }}
      onMouseOut={e => { (e.currentTarget as HTMLDivElement).style.borderColor = CARD_BORDER; }}
    >
      {/* Body */}
      <div style={{ padding: "18px 18px 14px", flex: 1 }}>

        {/* Name row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px", marginBottom: "14px" }}>
          <div>
            <p style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "var(--ink)", lineHeight: 1.25, letterSpacing: "-0.01em" }}>
              {report.name}
            </p>
            {report.amount !== "—" && (
              <p style={{ margin: "3px 0 0", fontSize: "12px", color: "var(--graphite)", fontWeight: 500 }}>
                {report.amount}
              </p>
            )}
          </div>
          <span style={{
            flexShrink: 0, display: "inline-flex", alignItems: "center", gap: "4px",
            fontSize: "9.5px", fontWeight: 600, padding: "3px 9px", borderRadius: "999px",
            background: "#EFF2EF", color: "#4F6B52",
            letterSpacing: "0.08em",
            whiteSpace: "nowrap",
          }}>
            <CheckCircle2 size={9} /> VERIFIED
          </span>
        </div>

        {/* Results spotlight — purity + mass */}
        <div style={{
          background: "#F2F0EB",
          border: "1px solid var(--hairline)",
          borderRadius: "12px",
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
                  <span style={{ minWidth: 0, fontSize: report.purityLabel ? "15px" : "26px", fontWeight: 600, color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.02em", whiteSpace: report.purityLabel ? "normal" : "nowrap", overflowWrap: "break-word" }}>
                    {purityDisplay}
                  </span>
                  <span style={{ flexShrink: 0, fontSize: "12px", fontWeight: 500, color: "var(--graphite)" }}>%</span>
                </div>
                <p style={{ margin: "2px 0 0", fontSize: "9px", lineHeight: 1.2, color: "var(--graphite)", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "normal" }}>
                  {report.purityCalculated ? "Calculated from vial mass" : "Purity"}
                </p>
              </>
            ) : (
              <>
                <span style={{ fontSize: "20px", fontWeight: 600, color: "rgba(74,85,104,0.35)", lineHeight: 1 }}>—</span>
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: "var(--graphite)", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Purity
                </p>
              </>
            )}
          </div>

          {/* Divider */}
          <div style={{ background: "var(--hairline)", alignSelf: "stretch" }} />

          {/* Mass */}
          <div style={{ minWidth: 0, paddingLeft: "12px" }}>
            {hasMass ? (
              <>
                <div style={{ display: "flex", alignItems: "baseline", gap: "2px", minWidth: 0 }}>
                  <span style={{ minWidth: 0, fontSize: report.actualMassLabel ? "15px" : "26px", fontWeight: 600, color: "var(--ink)", lineHeight: 1.15, letterSpacing: "-0.02em", whiteSpace: report.actualMassLabel ? "normal" : "nowrap", overflowWrap: "break-word" }}>
                    {massDisplay}
                  </span>
                  <span style={{ flexShrink: 0, fontSize: "11px", fontWeight: 500, color: "var(--graphite)" }}>{report.massUnit ?? "mg"}</span>
                </div>
                <p style={{ margin: "2px 0 0", fontSize: "9px", lineHeight: 1.2, color: "var(--graphite)", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase", whiteSpace: "normal" }}>
                  {report.massLabel ?? "Mass confirmed"}
                </p>
              </>
            ) : (
              <>
                <span style={{ fontSize: "20px", fontWeight: 600, color: "rgba(74,85,104,0.35)", lineHeight: 1 }}>—</span>
                <p style={{ margin: "2px 0 0", fontSize: "9px", color: "var(--graphite)", fontWeight: 500, letterSpacing: "0.12em", textTransform: "uppercase" }}>
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
              fontSize: "10px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px",
              background: method === "ESI-MS" ? "#F1F0F7" : "#EDF0F9",
              color: method === "ESI-MS" ? "#5E5690" : "var(--cobalt)",
              letterSpacing: "0.04em",
            }}>
              {method === "HPLC" ? <BarChart2 size={9} /> : method === "ESI-MS" ? <Atom size={9} /> : <FlaskConical size={9} />}
              {method}
            </span>
          ))}
          {isBlend && (
            <span style={{
              fontSize: "10px", fontWeight: 600, padding: "3px 10px", borderRadius: "999px",
              background: "#F1F0F7", color: "#5E5690", letterSpacing: "0.04em",
            }}>
              Blend
            </span>
          )}
          <span style={{
            fontSize: "10px", fontWeight: 500, padding: "3px 10px", borderRadius: "999px",
            background: "#fff", color: "var(--graphite)",
            border: "1px solid var(--hairline)",
          }}>
            #{report.testNumber}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "10px 18px 14px",
        borderTop: "1px solid var(--hairline)",
        background: "#F2F0EB",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
      }}>
        <span style={{ background: "#fff", border: "1px solid var(--hairline)", borderRadius: "999px", padding: "4px 12px", display: "inline-flex", alignItems: "center" }}>
          <img src="/janoshik/janoshik-logo.jpg" alt="Janoshik" style={{ height: "15px", width: "auto", display: "block" }} />
        </span>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {/* Quick View */}
          <button
            onClick={onQuickView}
            style={secondaryBtn}
            onMouseOver={e => { (e.currentTarget as HTMLButtonElement).style.background = "#F2F0EB"; }}
            onMouseOut={e => { (e.currentTarget as HTMLButtonElement).style.background = "#fff"; }}
          >
            Quick View
          </button>
          {report.certificatePdf && (
            <a href={report.certificatePdf} download style={secondaryBtn}>
              PDF <Download size={11} />
            </a>
          )}
          {/* View Product */}
          {productHref && (
            <Link
              href={productHref}
              style={{
                ...secondaryBtn,
                background: "var(--cobalt)",
                color: "#fff",
                border: "1px solid var(--cobalt)",
                transition: "opacity 0.15s",
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
              onMouseOut={e => (e.currentTarget.style.opacity = "1")}
            >
              View Product
            </Link>
          )}
          {/* View on Janoshik */}
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              ...secondaryBtn,
              background: "var(--ink)",
              color: "#fff",
              border: "1px solid var(--ink)",
              transition: "opacity 0.15s",
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

  // Map catalogue slug -> product id so a report can link to what it certifies.
  const productIdBySlug = useMemo(() => {
    const map = new Map<string, string>();
    for (const product of products) map.set(product.slug, product.id);
    return map;
  }, [products]);

  const publishedSlugs = new Set(products.map(product => product.slug));

  // Linked reports are visible only when their database-backed product is public.
  const visibleReports = REPORTS.filter(r => {
    if (r.productSlugs.length === 0) return true; // no slug mapping — always show
    if (productsLoading) return false;
    return r.productSlugs.some(slug => publishedSlugs.has(slug));
  });

  const query = search.trim().toLowerCase();
  const filtered = query
    ? visibleReports.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.testNumber.toLowerCase().includes(query) ||
        r.methods.some(m => m.toLowerCase().includes(query)),
      )
    : visibleReports;

  /** Catalogue link for a report, preferring a slug that is currently published. */
  const hrefFor = (report: Report) => {
    const slug = report.productSlugs.find(s => publishedSlugs.has(s)) ?? report.productSlugs[0];
    const id = slug ? productIdBySlug.get(slug) : undefined;
    return id ? `/product/${id}` : undefined;
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      <PageHero image={{ key: "hdr-lab-reports", alt: "OmniQure BPC-157 and GHK-Cu vials" }}
        crumbs={[{ label: "Lab Reports" }]}
        eyebrow="Independent Results"
        icon={ShieldCheck}
        title="Independent Results"
        aside={
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "flex-end" }}>
            {[
              { value: `${visibleReports.length}`, label: "Verified reports" },
              { value: "HPLC + ESI-MS", label: "Testing methods" },
            ].map(s => (
              <div key={s.label}>
                <p style={{ margin: 0, fontSize: "28px", fontWeight: 600, color: "var(--ink)", lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</p>
                <p style={{ margin: "6px 0 0", fontSize: "10px", color: "var(--graphite)", textTransform: "uppercase", letterSpacing: "0.14em" }}>{s.label}</p>
              </div>
            ))}
            <div>
              <span style={{ display: "inline-flex", alignItems: "center", height: "28px" }}>
                <JanoshikLogo height={22} />
              </span>
              <p style={{ margin: "6px 0 0", fontSize: "10px", color: "var(--graphite)", textTransform: "uppercase", letterSpacing: "0.14em" }}>Independent lab</p>
            </div>
          </div>
        }
      >
        <div style={{ display: "inline-flex", alignItems: "center", gap: "10px", background: "#fff", border: "1px solid var(--hairline)", padding: "6px 8px 6px 14px", borderRadius: "999px", marginBottom: "14px" }}>
          <ShieldCheck size={13} color="#4F6B52" aria-hidden="true" />
          <span style={{ fontSize: "10.5px", fontWeight: 600, color: "var(--ink)", letterSpacing: "0.1em" }}>INDEPENDENTLY TESTED BY</span>
          <span style={{ background: "#F2F0EB", borderRadius: "999px", padding: "4px 12px", display: "inline-flex", alignItems: "center" }}>
            <JanoshikLogo height={20} />
          </span>
        </div>
        <p style={{ margin: 0 }}>
          Every report below is hosted on Janoshik's own verification platform — an independent third-party analytical laboratory. Click "View Report" to see the raw purity, mass spec data, and chromatogram directly on their site.
        </p>

        {/* Search */}
        <div style={{ position: "relative", maxWidth: "420px", marginTop: "20px" }}>
          <Search size={14} aria-hidden="true" style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "var(--graphite)", pointerEvents: "none" }} />
          <input
            type="text"
            aria-label="Search lab reports"
            placeholder="Search by peptide, test number, or method…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", height: "44px",
              paddingLeft: "40px", paddingRight: "16px",
              borderRadius: "999px", border: "1px solid var(--hairline)",
              outline: "none", fontSize: "13.5px",
              background: "#fff", color: "var(--ink)",
              boxSizing: "border-box",
            }}
          />
        </div>
      </PageHero>

      {/* How it works strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--hairline)" }}>
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12" style={{ paddingTop: "20px", paddingBottom: "20px", display: "flex", gap: "32px", flexWrap: "wrap", alignItems: "center" }}>
          {[
            { icon: <FlaskConical size={15} color="var(--cobalt)" />, title: "HPLC Analysis", desc: "Reverse-phase chromatography confirms purity by peak area at 214 nm UV." },
            { icon: <Atom size={15} color="var(--cobalt)" />, title: "ESI-MS", desc: "Electrospray ionisation mass spectrometry verifies the molecular identity." },
            { icon: <JanoshikLogo height={18} />, title: "Independent lab", desc: "Reports are hosted and signed by Janoshik Analytical — not by OmniQure." },
          ].map(item => (
            <div key={item.title} style={{ display: "flex", alignItems: "flex-start", gap: "10px", flex: "1 1 220px" }}>
              <span style={{ flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: "13px", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{item.title}</p>
                <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--graphite)", lineHeight: 1.5 }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-8 xl:px-12" style={{ paddingTop: "32px", paddingBottom: "64px" }}>

        {/* Count */}
        <p style={{ margin: "0 0 16px", fontSize: "10.5px", color: "var(--graphite)", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 500 }}>
          {filtered.length} report{filtered.length !== 1 ? "s" : ""}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 20px", color: "var(--graphite)" }}>
            <FlaskConical size={36} color="var(--graphite)" style={{ marginBottom: "12px", opacity: 0.35, display: "inline-block" }} />
            <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)", margin: "0 0 6px" }}>No reports match</p>
            <p style={{ fontSize: "13px", margin: 0 }}>Try a different search term.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
            {filtered.map(r => (
              <ReportCard
                key={r.id}
                report={r}
                productHref={hrefFor(r)}
                onQuickView={() => setModalReport(r)}
              />
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div style={{
          margin: "48px auto 0", maxWidth: "720px", padding: "14px 18px",
          background: "#F2F0EB", border: "1px solid var(--hairline)", borderRadius: "12px",
          display: "flex", gap: "10px", alignItems: "flex-start",
        }}>
          <AlertTriangle size={14} color="#85683A" style={{ flexShrink: 0, marginTop: "2px" }} aria-hidden="true" />
          <p style={{ margin: 0, fontSize: "12px", color: "var(--graphite)", lineHeight: 1.7 }}>
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>Research use only.</strong>{" "}
            All products are sold strictly for in-vitro research purposes only. Not approved for human or veterinary use.
            Lab reports are independently issued by Janoshik Analytical and can be verified at verify.janoshik.com.
          </p>
        </div>
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
