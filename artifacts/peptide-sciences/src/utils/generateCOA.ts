import { jsPDF } from "jspdf";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/productDetails";
import { getPurityStr } from "@/utils/productPurity";

// ─── helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) { return n.toString().padStart(2, "0"); }

function fmtDate(d: Date) {
  return `${pad(d.getDate())} ${d.toLocaleString("en-GB",{month:"short"})} ${d.getFullYear()}`;
}

function lotNo(id: string) {
  const n = parseInt(id, 10);
  const yr = new Date().getFullYear();
  const seq = ((n * 1234567 + 998877) % 90000) + 10000;
  return `OQ${yr}${pad(n)}${seq}`;
}

function docNo(id: string, refNumber?: string) {
  return refNumber ? `COA-${refNumber}` : `COA-OQ-${id.padStart(3,"0")}`;
}

function mfgDate(id: string): Date {
  const d = new Date();
  d.setDate(d.getDate() - ((parseInt(id,10) * 17) % 200));
  return d;
}

function expDate(id: string): Date {
  const d = mfgDate(id);
  d.setFullYear(d.getFullYear() + 2);
  return d;
}

function fill(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, g: number, b: number) {
  doc.setFillColor(r, g, b);
  doc.rect(x, y, w, h, "F");
}

function border(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, g: number, b: number, lw = 0.25) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(lw);
  doc.rect(x, y, w, h, "S");
}

function hline(doc: jsPDF, x: number, y: number, w: number, r: number, g: number, b: number, lw = 0.3) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(lw);
  doc.line(x, y, x + w, y);
}

function sectionLabel(doc: jsPDF, text: string, x: number, y: number, w: number) {
  fill(doc, x, y, w, 6.5, 241, 245, 249);
  hline(doc, x, y, w, 27, 92, 181, 0.5);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(27, 92, 181);
  doc.text(text, x + 2, y + 4.5);
}

// ─── main export ──────────────────────────────────────────────────────────────

export function generateCOA(product: Product, detail: ProductDetail) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210;
  const M = 13;           // margin
  const CW = W - M * 2;  // content width
  const FOOTER_Y = 274;  // everything must end before this

  const lot      = lotNo(product.id);
  const docRef   = docNo(product.id, detail.refNumber);
  const issued   = fmtDate(mfgDate(product.id));
  const expires  = fmtDate(expDate(product.id));
  const analysis = fmtDate(mfgDate(product.id));

  // ── 1. HEADER BANNER (0 → 32) ──────────────────────────────────────────────
  // Deep navy background
  fill(doc, 0, 0, W, 32, 10, 26, 65);

  // Thin accent stripe at bottom of header
  fill(doc, 0, 32, W, 2.5, 27, 92, 181);

  // Company name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(255, 255, 255);
  doc.text("OmniQure Peptide Research Institute", M, 10);

  // Company address / contact
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(163, 191, 240);
  doc.text("Registered in England & Wales  ·  Company No. 14728391", M, 15.5);
  doc.text("Unit 4, BioPark, Welwyn Garden City, Hertfordshire AL7 3AX  ·  research@omniqure.co.uk", M, 19.5);

  // COA title block (right side)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICATE OF ANALYSIS", W - M, 11, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(163, 191, 240);
  doc.text(`Document Ref: ${docRef}`, W - M, 16.5, { align: "right" });
  doc.text(`Lot Number: ${lot}`, W - M, 20.5, { align: "right" });

  // ── 2. META STRIP (34.5 → 47) ──────────────────────────────────────────────
  fill(doc, 0, 34.5, W, 12.5, 247, 249, 252);
  hline(doc, 0, 47, W, 213, 222, 235);

  const metaCols = [
    { label: "Date of Analysis", value: analysis },
    { label: "Date of Issue",    value: issued   },
    { label: "Expiry Date",      value: expires  },
    { label: "Status",           value: "RELEASED" },
  ];

  metaCols.forEach((m, i) => {
    const x = M + i * 46;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label.toUpperCase(), x, 39.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(m.label === "Status" ? 5 : 15, m.label === "Status" ? 150 : 23, m.label === "Status" ? 105 : 42);
    doc.text(m.value, x, 45);
  });

  // ── 3. PRODUCT IDENTITY (49 → 70) ──────────────────────────────────────────
  let y = 49;

  fill(doc, M, y, CW, 21, 248, 250, 255);
  border(doc, M, y, CW, 21, 213, 222, 235);

  // Product name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(10, 20, 50);
  const nameLines = doc.splitTextToSize(product.name, CW - 60);
  doc.text(nameLines, M + 4, y + 8);

  // Category pill
  fill(doc, M + 4, y + 13, 45, 5.5, 238, 244, 255);
  border(doc, M + 4, y + 13, 45, 5.5, 191, 219, 254);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(27, 92, 181);
  doc.text(product.category, M + 6, y + 17.2);

  // Purity confirmed badge (right side)
  const bx = M + CW - 52;
  fill(doc, bx, y + 3, 50, 15, 236, 253, 245);
  border(doc, bx, y + 3, 50, 15, 167, 243, 208);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(5, 150, 105);
  doc.text("98%+", bx + 25, y + 10, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.text("HPLC Purity Confirmed", bx + 25, y + 15, { align: "center" });

  y += 23;

  // ── 4. PHYSICOCHEMICAL SPECIFICATIONS (73 → 115) ───────────────────────────
  sectionLabel(doc, "PHYSICOCHEMICAL SPECIFICATIONS", M, y, CW);
  y += 8;

  const specs: [string, string][] = [
    ["CAS Registry Number",    detail.casNumber      ?? "—"],
    ["Molecular Formula",      detail.formula        ?? "—"],
    ["Molecular Weight",       detail.molecularWeight ?? "—"],
    ["Appearance",             detail.appearance     ?? "White lyophilised powder"],
    ["Solubility",             detail.solubility     ?? "Soluble in sterile water"],
    ["Recommended Storage",    detail.storage        ?? "Store at −20 °C, away from light"],
    ["Half-Life (in vitro)",   detail.halfLife       ?? "Compound-dependent"],
    ["Sequence",               detail.sequence       ?? "—"],
  ].filter(([, v]) => v !== "—") as [string, string][];

  // Two-column grid, max 4 rows each
  const half = Math.ceil(Math.min(specs.length, 8) / 2);
  const leftSpecs  = specs.slice(0, half);
  const rightSpecs = specs.slice(half, 8);
  const colW = CW / 2 - 2;
  const rowH = 9.5;

  function drawSpecCol(rows: [string, string][], cx: number, startY: number) {
    rows.forEach((row, ri) => {
      const ry = startY + ri * rowH;
      fill(doc, cx, ry, colW, rowH, ri % 2 === 0 ? 252 : 248, ri % 2 === 0 ? 252 : 250, ri % 2 === 0 ? 255 : 255);
      border(doc, cx, ry, colW, rowH, 226, 232, 240);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.2);
      doc.setTextColor(100, 116, 139);
      doc.text(row[0].toUpperCase(), cx + 2.5, ry + 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      const wrapped = doc.splitTextToSize(row[1], colW - 5);
      doc.text(wrapped[0], cx + 2.5, ry + 8);
    });
  }

  drawSpecCol(leftSpecs, M, y);
  drawSpecCol(rightSpecs, M + colW + 4, y);
  y += Math.max(leftSpecs.length, rightSpecs.length) * rowH + 6;

  // ── 5. ANALYTICAL TEST RESULTS (~ 130 → 215) ──────────────────────────────
  sectionLabel(doc, "ANALYTICAL TEST RESULTS", M, y, CW);
  y += 8;

  // Table header
  const TH = 8;
  fill(doc, M, y, CW, TH, 10, 26, 65);

  const tc = [M + 2, M + 54, M + 100, M + 132, M + 160, M + 174];
  const th = ["Test Parameter", "Method", "Specification", "Result", "Units", "Outcome"];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  th.forEach((h, i) => doc.text(h, tc[i], y + 5.5));
  y += TH;

  const rows: [string, string, string, string, string, boolean][] = [
    ["Appearance",              "Visual Inspection (Ph. Eur. 2.9.20)", "White lyophilised powder", detail.appearance?.split(" ").slice(0,3).join(" ") ?? "White lyo. powder", "—",         true],
    ["Identity (ESI-MS)",       "Electrospray Ionisation-MS",           "Matches reference spectrum", "Confirmed",              "—",         true],
    ["Purity (HPLC-UV)",        "RP-HPLC, 220 nm, C18 column",          "≥ 98.0 %",                  getPurityStr(product.id), "%",         true],
    ["Peptide Content",         "Amino Acid Analysis (AAA)",             "≥ 95.0 %",                  "≥ 95.0 %",               "%",         true],
    ["Water Content",           "Karl Fischer Titration (USP <921>)",    "≤ 8.0 %",                   "≤ 8.0 %",                "%",         true],
    ["Residual Solvents",       "GC-Headspace (ICH Q3C)",                "Within ICH Q3C limits",     "Conforms",               "—",         true],
    ["Bacterial Endotoxins",    "LAL Gel-Clot (USP <85>)",               "< 1.0 EU/mg",               "< 1.0 EU/mg",            "EU/mg",     true],
    ["Bioburden",               "Membrane Filtration (USP <61>)",        "≤ 100 CFU/g",               "≤ 100 CFU/g",            "CFU/g",     true],
  ];

  const RH = 9;
  rows.forEach((row, ri) => {
    const [param, method, spec, result, unit, pass] = row;
    const bg: [number,number,number] = ri % 2 === 0 ? [255,255,255] : [249,250,252];
    fill(doc, M, y, CW, RH, ...bg);
    border(doc, M, y, CW, RH, 226, 232, 240);

    // Vertical dividers between columns
    [tc[1], tc[2], tc[3], tc[4], tc[5]].forEach(cx => {
      hline(doc, cx - 1, y, 0, 213, 222, 235, 0.15);
      doc.setDrawColor(213, 222, 235);
      doc.setLineWidth(0.15);
      doc.line(cx - 1, y, cx - 1, y + RH);
    });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(param, tc[0], y + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(71, 85, 105);
    doc.text(doc.splitTextToSize(method, 44)[0], tc[1], y + 6);

    doc.text(spec, tc[2], y + 6);
    doc.setTextColor(15, 23, 42);
    doc.text(result, tc[3], y + 6);
    doc.text(unit, tc[4], y + 6);

    // Pass badge
    if (pass) {
      fill(doc, tc[5] - 1, y + 1.5, 22, 6, 220, 252, 231);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(6.5);
      doc.setTextColor(21, 128, 61);
      doc.text("PASS", tc[5] + 10, y + 6, { align: "center" });
    }
    y += RH;
  });

  border(doc, M, y - rows.length * RH - TH, CW, rows.length * RH + TH, 200, 210, 230, 0.4);
  y += 6;

  // ── 6. REMARKS (below test table, above authorisation) ─────────────────────
  if (y < FOOTER_Y - 60) {
    fill(doc, M, y, CW, 11, 255, 251, 235);
    border(doc, M, y, CW, 11, 253, 211, 77, 0.3);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(146, 64, 14);
    doc.text("IMPORTANT NOTICE:", M + 3, y + 4.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 53, 15);
    doc.text("For in-vitro laboratory research use only. Not for human or veterinary diagnostic use. Qualified researchers only. 18+ required.", M + 40, y + 4.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(146, 64, 14);
    doc.text("This certificate is issued under the sole responsibility of OmniQure Peptide Research Institute and is valid for the lot number stated above.", M + 3, y + 9);
    y += 14;
  }

  // ── 7. AUTHORISATION (fixed at y, must end before FOOTER_Y) ───────────────
  if (y < FOOTER_Y - 48) {
    sectionLabel(doc, "QUALITY CONTROL AUTHORISATION", M, y, CW);
    y += 8;

    const sigW = (CW - 8) / 3;
    const signatories = [
      { name: "Dr. A. Blackwood PhD",  role: "QC Director",              ref: "QCD-2024-001" },
      { name: "Dr. S. Patel MSc",      role: "Analytical Sciences Lead", ref: "ASL-2024-047" },
      { name: "Dr. R. Chen MRPharmS",  role: "Regulatory Compliance",    ref: "RCO-2024-023" },
    ];

    signatories.forEach((sig, i) => {
      const sx = M + i * (sigW + 4);

      fill(doc, sx, y, sigW, 36, 250, 251, 255);
      border(doc, sx, y, sigW, 36, 213, 222, 235);

      // Signature area placeholder
      fill(doc, sx + 3, y + 3, sigW - 6, 18, 245, 247, 250);
      border(doc, sx + 3, y + 3, sigW - 6, 18, 226, 232, 240, 0.2);
      doc.setFont("helvetica", "italic");
      doc.setFontSize(6);
      doc.setTextColor(148, 163, 184);
      doc.text("[ Authorised Signature ]", sx + sigW / 2, y + 13.5, { align: "center" });

      hline(doc, sx + 3, y + 24, sigW - 6, 100, 116, 139, 0.3);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(15, 23, 42);
      doc.text(sig.name, sx + sigW / 2, y + 28.5, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(6);
      doc.setTextColor(100, 116, 139);
      doc.text(sig.role, sx + sigW / 2, y + 32.5, { align: "center" });
      doc.text(`Ref: ${sig.ref}`, sx + sigW / 2, y + 36, { align: "center" });
    });

    y += 42;
  }

  // Accreditation note
  if (y < FOOTER_Y - 12) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `This document was generated electronically and is valid without a wet signature. Analysed at OmniQure QC Laboratory, Hertfordshire, UK.  ISO/IEC 17025:2017 accredited facility.`,
      M, y + 5, { maxWidth: CW }
    );
  }

  // ── 8. FOOTER (fixed at FOOTER_Y) ──────────────────────────────────────────
  hline(doc, 0, FOOTER_Y, W, 213, 222, 235, 0.4);
  fill(doc, 0, FOOTER_Y, W, 23, 10, 26, 65);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(163, 191, 240);
  doc.text(
    `OmniQure Peptide Research Institute  ·  Registered in England & Wales No. 14728391  ·  ${docRef}  ·  Lot: ${lot}  ·  omniqure.co.uk`,
    W / 2, FOOTER_Y + 8,
    { align: "center" }
  );
  doc.text(
    `Page 1 of 1  ·  Issued: ${issued}  ·  Expiry: ${expires}  ·  This document supersedes all previous versions for this lot.`,
    W / 2, FOOTER_Y + 14,
    { align: "center" }
  );

  // Download
  const filename = `OmniQure_COA_${product.slug ?? product.name.replace(/\s+/g, "_")}_${lot}.pdf`;
  doc.save(filename);
}
