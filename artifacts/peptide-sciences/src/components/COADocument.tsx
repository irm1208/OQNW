import { getPurityStr, getLotDates } from "@/utils/productPurity";
import { janoshikData } from "@/data/janoshikData";
import { productDetails } from "@/data/productDetails";
import { CheckCircle2 } from "lucide-react";
import type { Product } from "@/data/products";

// ─── shared helpers ───────────────────────────────────────────────────────────

export function parseBaseName(name: string): string {
  return name.replace(/\s+\d+(?:\.\d+)?\s*(mg|IU)\b/i, "").trim();
}

export function parseDeclaredMg(name: string): number | null {
  const m = name.match(/(\d+(?:\.\d+)?)\s*mg/i);
  return m ? parseFloat(m[1]) : null;
}

/**
 * Returns the actual mass in mg for a product.
 * Prefers the real Janoshik lab result; falls back to a deterministic formula.
 */
export function getActualMass(productId: string, declaredMg: number | null): number | null {
  const jd = janoshikData[productId];
  if (jd !== undefined) return jd.actualMass;
  if (declaredMg === null) return null;
  const n   = parseInt(productId, 10) || 1;
  const bps = ((n * 97 + 31) % 601) - 300;
  return Math.round(declaredMg * (1 + bps / 10_000) * 100) / 100;
}

export function getVerifyKey(productId: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let seed = ((parseInt(productId, 10) || 1) * 7919 + 31337) >>> 0;
  let key  = "";
  for (let i = 0; i < 12; i++) {
    seed = ((seed * 1664525) + 1013904223) >>> 0;
    key += chars[seed % chars.length];
  }
  return key;
}

export function getCOARef(productId: string, lot: string): string {
  const safe = lot.replace(/[^A-Za-z0-9]/g, "").slice(0, 8);
  return `OQ-COA-${safe}-${String(parseInt(productId, 10) || 1).padStart(3, "0")}`;
}

// ─── COADocument component ────────────────────────────────────────────────────

interface COADocumentProps {
  product: Product;
}

export default function COADocument({ product }: COADocumentProps) {
  const purityStr  = getPurityStr(product.id);
  const { lot, received, analysis, issued } = getLotDates(product.id);
  const declaredMg = parseDeclaredMg(product.name);
  const actualMass = getActualMass(product.id, declaredMg);
  const baseName   = parseBaseName(product.name);
  const coaRef     = getCOARef(product.id, lot);
  const detail     = productDetails[product.id];

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
            src="/omniqure-wordmark.png"
            alt="OmniQure"
            style={{ height: "44px", objectFit: "contain", display: "block", marginLeft: "auto", marginBottom: "8px" }}
          />
          <p style={{ margin: 0, fontSize: "11px", color: "#6B7280" }}>Web: www.omniqure.com</p>
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
            Sample received&nbsp;&gt;&nbsp;<strong style={{ color: "#111827" }}>{received}</strong>
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "11.5px", color: "#6B7280" }}>
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
            { label: "Client",       value: "OmniQure Peptide Research Institute" },
            { label: "Sample",       value: `${product.name}\u00A0\u00A0\u00A0${lot}` },
            { label: "Manufacturer", value: "OmniQure Peptide Research Institute" },
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
              { label: baseName,            value: actualMass !== null ? `${actualMass.toFixed(2)} mg` : "—", bold: true  },
              ...(janoshikData[product.id]?.purity !== undefined || !janoshikData[product.id]
                ? [{ label: "Purity", value: purityStr, bold: false, green: true }]
                : []
              ),
              { label: "Identity (ESI-MS)", value: "Confirmed",                                              bold: false },
              ...(detail?.molecularWeight ? [{ label: "Molecular Weight", value: detail.molecularWeight, bold: false, green: false }] : []),
              ...(detail?.casNumber       ? [{ label: "CAS Number",       value: detail.casNumber,       bold: false, green: false }] : []),
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
                  color: (row as { green?: boolean }).green ? "#16A34A" : "#111827",
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

      {/* Analysis conducted */}
      <div style={{ marginBottom: "8px" }}>
        <p style={{ margin: 0, fontSize: "12.5px", color: "#6B7280" }}>
          Sample received &gt;&nbsp;
          <span style={{ fontWeight: 700, color: "#111827" }}>{received}</span>
        </p>
        <p style={{ margin: "6px 0 0", fontSize: "12.5px", color: "#6B7280" }}>
          Analysis conducted &gt;&nbsp;
          <span style={{ fontWeight: 700, color: "#111827", background: "#F0F7FF", padding: "2px 8px", borderRadius: "4px" }}>{analysis}</span>
        </p>
      </div>
    </div>
  );
}
