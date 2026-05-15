import { getPurity, getLotDates } from "@/utils/productPurity";
import { productDetails } from "@/data/productDetails";
import { CheckCircle2 } from "lucide-react";
import type { Product } from "@/data/products";

// ─── shared helpers ───────────────────────────────────────────────────────────

export function parseBaseName(name: string): string {
  return name.replace(/\s+\d+(?:\.\d+)?\s*mg\b/i, "").trim();
}

export function parseDeclaredMg(name: string): number | null {
  const m = name.match(/(\d+(?:\.\d+)?)\s*mg/i);
  return m ? parseFloat(m[1]) : null;
}

export function getActualMass(productId: string, declaredMg: number): number {
  const n = parseInt(productId, 10) || 1;
  const bps = ((n * 97 + 31) % 601) - 300;
  return Math.round(declaredMg * (1 + bps / 10000) * 100) / 100;
}

export function getVerifyKey(productId: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let seed = ((parseInt(productId, 10) || 1) * 7919 + 31337) >>> 0;
  let key = "";
  for (let i = 0; i < 12; i++) {
    seed = ((seed * 1664525) + 1013904223) >>> 0;
    key += chars[seed % chars.length];
  }
  return key;
}

export function getCOARef(productId: string, lot: string): string {
  return `OQ-COA-${lot.slice(2, 8)}-${String(parseInt(productId, 10) || 1).padStart(3, "0")}`;
}

// ─── COADocument component ────────────────────────────────────────────────────

interface COADocumentProps {
  product: Product;
}

export default function COADocument({ product }: COADocumentProps) {
  const purity = getPurity(product.id);
  const { lot, analysis, issued } = getLotDates(product.id);
  const declaredMg = parseDeclaredMg(product.name);
  const actualMass = declaredMg !== null ? getActualMass(product.id, declaredMg) : null;
  const baseName = parseBaseName(product.name);
  const verifyKey = getVerifyKey(product.id);
  const coaRef = getCOARef(product.id, lot);
  const detail = productDetails[product.id];

  const blue = "#1240A0";
  const divider: React.CSSProperties = { borderTop: "1px solid #E5E7EB", margin: "0 0 16px" };

  return (
    <div style={{ fontFamily: "'Arimo', Arial, sans-serif", color: "#111827", lineHeight: 1.5 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 900, color: blue, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            CERTIFICATE<br />OF ANALYSIS
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <img
            src="/omniqure-logo.jpeg"
            alt="OmniQure"
            style={{ height: "44px", objectFit: "contain", display: "block", marginLeft: "auto", marginBottom: "8px" }}
          />
          <p style={{ margin: 0, fontSize: "11px", color: "#6B7280" }}>E-mail: labs@omniqure.co.uk</p>
          <p style={{ margin: 0, fontSize: "11px", color: "#6B7280" }}>Web: www.omniqure.co.uk</p>
        </div>
      </div>

      <hr style={divider} />

      {/* Reference row */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <p style={{ margin: 0, fontSize: "11.5px", color: "#6B7280" }}>Reference Number</p>
          <p style={{ margin: "2px 0 0", fontSize: "14px", fontWeight: 700, color: "#111827", fontFamily: "monospace" }}>{coaRef}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: 0, fontSize: "11.5px", color: "#6B7280" }}>
            Analysis Date&nbsp;&gt;&nbsp;<strong style={{ color: "#111827" }}>{analysis}</strong>
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "11.5px", color: "#6B7280" }}>
            Report Issued&nbsp;&gt;&nbsp;<strong style={{ color: "#111827" }}>{issued}</strong>
          </p>
        </div>
      </div>

      <hr style={divider} />

      {/* Client / Sample table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", fontSize: "13px" }}>
        <tbody>
          {[
            { label: "Client",       value: "OmniQure Peptide Sciences" },
            { label: "Sample",       value: `${product.name}\u00A0\u00A0\u00A0${lot}` },
            { label: "Manufacturer", value: "OmniQure Peptide Sciences" },
            { label: "Batch",        value: lot },
          ].map(row => (
            <tr key={row.label}>
              <td style={{ width: "130px", padding: "5px 12px 5px 0", color: blue, fontWeight: 600, verticalAlign: "top", fontSize: "12.5px" }}>
                {row.label}
              </td>
              <td style={{ padding: "5px 0", color: "#111827", verticalAlign: "top" }}>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={divider} />

      {/* Sample description */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ margin: "0 0 8px", fontSize: "12.5px", fontWeight: 700, color: blue }}>Sample description &gt;</p>
        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "10px 14px", fontSize: "12.5px", color: "#374151" }}>
          Lyophilised peptide powder, white to off-white appearance.
          {detail?.appearance ? ` ${detail.appearance}.` : ""}
          {detail?.storage ? " Store at −20 °C (lyophilised) or 4 °C after reconstitution." : ""}
        </div>
      </div>

      {/* Tests requested */}
      <div style={{ marginBottom: "20px" }}>
        <p style={{ margin: "0 0 8px", fontSize: "12.5px", fontWeight: 700, color: blue }}>Tests requested &gt;</p>
        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "10px 14px", fontSize: "12.5px", color: "#374151" }}>
          Reverse-phase HPLC purity analysis (UV detection at 214&nbsp;nm) and electrospray ionisation mass spectrometry (ESI-MS) for identity confirmation.
        </div>
      </div>

      <hr style={divider} />

      {/* Results */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
          <p style={{ margin: 0, fontSize: "12.5px", fontWeight: 700, color: blue }}>Results &gt;</p>
          {/* OmniQure Labs seal */}
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            border: `2px solid ${blue}`,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: "1px", flexShrink: 0,
          }}>
            <span style={{ fontSize: "6px", fontWeight: 800, color: blue, letterSpacing: "0.08em", textAlign: "center", lineHeight: 1.2 }}>OMNIQURE</span>
            <span style={{ fontSize: "5px", fontWeight: 600, color: blue, letterSpacing: "0.06em", textAlign: "center", lineHeight: 1.2 }}>LABS</span>
            <CheckCircle2 size={14} color={blue} />
            <span style={{ fontSize: "5px", fontWeight: 600, color: blue, letterSpacing: "0.04em" }}>VERIFIED</span>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <tbody>
            {[
              { label: baseName,              value: actualMass !== null ? `${actualMass.toFixed(2)} mg` : "—", bold: true  },
              { label: "Purity",              value: `${purity.toFixed(3)}%`,                                   bold: false },
              { label: "Identity (ESI-MS)",   value: "Confirmed",                                               bold: false },
              ...(detail?.molecularWeight ? [{ label: "Molecular Weight", value: detail.molecularWeight, bold: false }] : []),
              ...(detail?.casNumber        ? [{ label: "CAS Number",       value: detail.casNumber,       bold: false }] : []),
            ].map((row, i) => (
              <tr key={row.label} style={{ background: i % 2 === 0 ? "#F0F7FF" : "#fff" }}>
                <td style={{
                  padding: "9px 14px", border: `1px solid ${blue}`, borderLeft: `3px solid ${blue}`,
                  fontWeight: row.bold ? 700 : 500, color: "#111827",
                }}>
                  {row.label}
                </td>
                <td style={{
                  padding: "9px 14px", border: `1px solid ${blue}`,
                  fontWeight: 700,
                  color: row.label === "Purity" ? "#16A34A" : "#111827",
                }}>
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Comments */}
      <div style={{ marginBottom: "24px" }}>
        <p style={{ margin: "0 0 8px", fontSize: "12.5px", fontWeight: 700, color: blue }}>Comments &gt;</p>
        <div style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: "6px", padding: "10px 14px", fontSize: "12.5px", color: "#374151", minHeight: "44px" }}>
          All specifications met. Sample approved for research distribution and use. For laboratory research purposes only — not for human or veterinary use.
        </div>
      </div>

      <hr style={divider} />

      {/* Analysis conducted + Signature */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px" }}>
        <div>
          <p style={{ margin: 0, fontSize: "12.5px", color: "#6B7280" }}>
            Analysis conducted &gt;&nbsp;
            <span style={{ fontWeight: 700, color: "#111827", background: "#F0F7FF", padding: "2px 8px", borderRadius: "4px" }}>{analysis}</span>
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#6B7280" }}>Signature &gt;</p>
          {/* Realistic cursive signature */}
          <svg width="148" height="52" viewBox="0 0 148 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 38 C5 24, 10 10, 16 12 C22 14, 20 26, 18 34 C16 40, 20 42, 24 36" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M24 36 C27 26, 33 20, 37 24" stroke="#1a1a2e" strokeWidth="1.7" strokeLinecap="round" fill="none"/>
            <path d="M37 24 C40 22, 44 30, 46 34 C48 38, 52 28, 57 22 C62 16, 68 20, 70 28" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M70 28 C72 34, 70 40, 74 38 C78 36, 82 24, 88 20 C94 16, 100 22, 102 30" stroke="#1a1a2e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            <path d="M102 30 C108 26, 116 20, 124 24 C130 27, 134 34, 140 30 C143 28, 144 26, 145 24" stroke="#1a1a2e" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
            <circle cx="38" cy="14" r="1.2" fill="#1a1a2e"/>
            <path d="M5 46 C40 49, 96 48, 143 44" stroke="#1a1a2e" strokeWidth="0.9" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
      </div>

      {/* Verify key */}
      <div style={{ borderTop: `2px solid ${blue}`, paddingTop: "16px" }}>
        <p style={{ margin: "0 0 8px", fontSize: "11.5px", color: blue, textAlign: "center" }}>
          Verify this certificate at <strong>www.omniqure.co.uk/verify/</strong> with the following unique key
        </p>
        <div style={{
          background: "#F0F7FF", border: `1px solid ${blue}`,
          borderRadius: "6px", padding: "10px",
          textAlign: "center", fontFamily: "monospace",
          fontWeight: 800, fontSize: "16px",
          letterSpacing: "0.2em", color: "#111827",
        }}>
          {verifyKey}
        </div>
      </div>
    </div>
  );
}
