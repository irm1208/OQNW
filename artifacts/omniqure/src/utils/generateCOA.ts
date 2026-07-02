import { jsPDF } from "jspdf";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/productDetails";
import { getPurityStr, getLotDates } from "@/utils/productPurity";
import {
  parseBaseName, parseDeclaredMg, getActualMass,
  getCOARef,
} from "@/components/COADocument";

// ─── Brand colours (matching HTML COADocument) ───────────────────────────────
const BLUE    = [18,  64,  160] as [number,number,number]; // #1240A0
const INK     = [17,  24,   39] as [number,number,number]; // #111827
const MUTED   = [107, 114, 128] as [number,number,number]; // #6B7280
const ROWALT  = [240, 247, 255] as [number,number,number]; // #F0F7FF
const BGLIGHT = [249, 250, 251] as [number,number,number]; // #F9FAFB
const BORDER  = [229, 231, 235] as [number,number,number]; // #E5E7EB
const GREEN   = [ 22, 163,  74] as [number,number,number]; // #16A34A

// ─── Helpers ─────────────────────────────────────────────────────────────────

function hline(
  doc: jsPDF, x: number, y: number, w: number,
  r: number, g: number, b: number, lw = 0.3,
) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(lw);
  doc.line(x, y, x + w, y);
}

function fillRect(
  doc: jsPDF, x: number, y: number, w: number, h: number,
  r: number, g: number, b: number,
) {
  doc.setFillColor(r, g, b);
  doc.rect(x, y, w, h, "F");
}

function strokeRect(
  doc: jsPDF, x: number, y: number, w: number, h: number,
  r: number, g: number, b: number, lw = 0.25,
) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(lw);
  doc.rect(x, y, w, h, "S");
}

function labelText(
  doc: jsPDF, text: string, x: number, y: number,
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...BLUE);
  doc.text(text, x, y);
}

function bodyText(
  doc: jsPDF, text: string, x: number, y: number,
  maxWidth?: number,
) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...INK);
  if (maxWidth) {
    doc.text(doc.splitTextToSize(text, maxWidth), x, y);
  } else {
    doc.text(text, x, y);
  }
}

// ─── Logo loader ─────────────────────────────────────────────────────────────

interface LogoAsset { dataUrl: string; naturalW: number; naturalH: number; }

async function loadLogo(): Promise<LogoAsset | null> {
  try {
    const res  = await fetch("/omniqure-wordmark.png");
    const blob = await res.blob();
    const rawUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const img2 = new Image();
    const { w, h } = await new Promise<{ w: number; h: number }>((resolve) => {
      img2.onload  = () => resolve({ w: img2.naturalWidth, h: img2.naturalHeight });
      img2.onerror = () => resolve({ w: 1, h: 1 });
      img2.src = rawUrl;
    });
    return { dataUrl: rawUrl, naturalW: w, naturalH: h };
  } catch { return null; }
}

function fitLogo(logo: LogoAsset, maxW: number, maxH: number) {
  const ratio = logo.naturalW / logo.naturalH;
  let w = maxW, h = w / ratio;
  if (h > maxH) { h = maxH; w = h * ratio; }
  return { w, h };
}

// ─── Signature drawing (matches SVG in COADocument.tsx) ──────────────────────
// SVG viewBox: 148 × 52 px  →  rendered at 52 mm × 18 mm in PDF

function drawSignature(doc: jsPDF, bx: number, by: number) {
  const sW = 52, sH = 18;
  const sX = sW / 148, sY = sH / 52;
  const pt = (px: number, py: number): [number, number] =>
    [bx + px * sX, by + py * sY];

  doc.setDrawColor(26, 26, 46);

  // Path 1 — tall capital loop (strokeWidth≈0.7)
  doc.setLineWidth(0.7);
  doc.lines(
    [[-1,-14,4,-28,10,-26],[6,2,4,14,2,22],[-2,6,2,8,6,2]] as number[][],
    ...pt(6, 38), [sX, sY], "S",
  );

  // Path 2 — r flick (strokeWidth≈0.6)
  doc.setLineWidth(0.6);
  doc.lines(
    [[3,-10,9,-16,13,-12]] as number[][],
    ...pt(24, 36), [sX, sY], "S",
  );

  // Path 3 — flowing body (strokeWidth≈0.65)
  doc.setLineWidth(0.65);
  doc.lines(
    [[3,-2,7,6,9,10],[2,4,6,-6,11,-12],[5,-6,11,-2,13,6]] as number[][],
    ...pt(37, 24), [sX, sY], "S",
  );

  // Path 4 — loop + second cluster (strokeWidth≈0.58)
  doc.setLineWidth(0.58);
  doc.lines(
    [[2,6,0,12,4,10],[4,-2,8,-14,14,-18],[6,-4,12,2,14,10]] as number[][],
    ...pt(70, 28), [sX, sY], "S",
  );

  // Path 5 — long tail flourish (strokeWidth≈0.47)
  doc.setLineWidth(0.47);
  doc.lines(
    [[6,-4,14,-10,22,-6],[6,3,10,10,16,6],[3,-2,4,-4,5,-6]] as number[][],
    ...pt(102, 30), [sX, sY], "S",
  );

  // Dot above r (pen-lift detail)
  doc.setFillColor(26, 26, 46);
  doc.circle(...pt(38, 14), 0.4, "F");

  // Underline flourish
  doc.setLineWidth(0.32);
  doc.lines(
    [[35,3,91,2,138,-2]] as number[][],
    ...pt(5, 46), [sX, sY], "S",
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function generateCOA(product: Product, detail: ProductDetail) {
  const doc  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const logo = await loadLogo();

  const W  = 210;
  const M  = 14;
  const CW = W - M * 2;

  const { lot, received, analysis, issued } = getLotDates(product.id);
  const purityStr  = getPurityStr(product.id);
  const declaredMg = parseDeclaredMg(product.name);
  const actualMass = getActualMass(product.id, declaredMg);
  const baseName   = parseBaseName(product.name);
  const coaRef     = getCOARef(product.id, lot);

  // ══════════════════════════════════════════════════════════════════════
  //  PAGE 1 — Certificate of Analysis  (white, matching HTML COADocument)
  // ══════════════════════════════════════════════════════════════════════

  let y = M;

  // ── Header ────────────────────────────────────────────────────────────
  // Title (left)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...BLUE);
  doc.text("CERTIFICATE", M, y + 8);
  doc.text("OF ANALYSIS", M, y + 17);

  // Logo (right) — gradient rounded pill
  if (logo) {
    const padH = 3, padVT = 2.5, subH = 3.8;
    const { w: lw, h: lh } = fitLogo(logo, 44, 13);
    const bx = W - M - lw - padH * 2;
    const by = y - padVT;
    const bw = lw + padH * 2;
    const bh = lh + padVT + subH + 1;
    // Gradient: strip loop from #0D2565 → #1E68CC
    const gFrom = [13, 37, 101], gTo = [30, 104, 204];
    const steps = Math.ceil(bw);
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      const r = Math.round(gFrom[0] + t * (gTo[0] - gFrom[0]));
      const g = Math.round(gFrom[1] + t * (gTo[1] - gFrom[1]));
      const b = Math.round(gFrom[2] + t * (gTo[2] - gFrom[2]));
      doc.setFillColor(r, g, b);
      doc.rect(bx + s, by, 1, bh, "F");
    }
    // Rounded overlay mask: re-draw corners in page-white
    doc.setFillColor(255, 255, 255);
    const cr = 2.5;
    // punch out 4 corners with white squares, then re-curve
    doc.roundedRect(bx, by, bw, bh, cr, cr, "S"); // border only
    doc.addImage(logo.dataUrl, "PNG", bx + padH, y, lw, lh);
    // Subtitle inside box
    doc.setFont("helvetica", "bold");
    doc.setFontSize(4.2);
    doc.setTextColor(220, 225, 240);
    const subCX = bx + padH + lw * 0.33 + (lw * 0.61) / 2;
    doc.text("PEPTIDE RESEARCH INSTITUTE", subCX, y + lh + 2.5, { align: "center", charSpace: 0.35 });
  }
  // Contact lines under logo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text("Web: www.omniqure.com", W - M, y + 18, { align: "right" });

  y += 24;

  // ── Divider ───────────────────────────────────────────────────────────
  hline(doc, M, y, CW, ...BORDER, 0.4);
  y += 5;

  // ── Reference row ─────────────────────────────────────────────────────
  // Left: reference number
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text("Reference Number", M, y);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text(coaRef, M, y + 5.5);

  // Right: dates
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text("Sample received  >", W - M, y, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text(received, W - M - 38, y);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Analysis Date  >", W - M, y + 6, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text(analysis, W - M - 34, y + 6);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Report Issued  >",  W - M, y + 12, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...INK);
  doc.text(issued, W - M - 34, y + 12);

  y += 20;

  // ── Divider ───────────────────────────────────────────────────────────
  hline(doc, M, y, CW, ...BORDER, 0.4);
  y += 5;

  // ── Client / Sample table ─────────────────────────────────────────────
  const clientRows = [
    { label: "Client",       value: "OmniQure Peptide Research Institute" },
    { label: "Sample",       value: `${product.name}     ${lot}` },
    { label: "Manufacturer", value: "OmniQure Peptide Research Institute" },
    { label: "Batch",        value: lot },
  ];
  const COL1 = 34; // label column width
  clientRows.forEach(row => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...BLUE);
    doc.text(row.label, M, y + 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    doc.text(row.value, M + COL1, y + 4);
    y += 6.5;
  });

  y += 2;

  // ── Divider ───────────────────────────────────────────────────────────
  hline(doc, M, y, CW, ...BORDER, 0.4);
  y += 5;

  // ── Sample description ────────────────────────────────────────────────
  labelText(doc, "Sample description  >", M, y + 4);
  y += 7;
  const sampleDesc =
    `Lyophilised peptide powder, white to off-white appearance.` +
    (detail?.appearance ? ` ${detail.appearance}.` : "") +
    (detail?.storage   ? " Store at −20 °C (lyophilised) or 4 °C after reconstitution." : "");
  fillRect(doc, M, y, CW, 13, ...BGLIGHT);
  strokeRect(doc, M, y, CW, 13, ...BORDER, 0.3);
  bodyText(doc, sampleDesc, M + 3, y + 5, CW - 6);
  y += 16;

  // ── Tests requested ───────────────────────────────────────────────────
  labelText(doc, "Tests requested  >", M, y + 4);
  y += 7;
  const testsDesc =
    "Independent purity analysis (UV detection at 214 nm).";
  fillRect(doc, M, y, CW, 13, ...BGLIGHT);
  strokeRect(doc, M, y, CW, 13, ...BORDER, 0.3);
  bodyText(doc, testsDesc, M + 3, y + 5, CW - 6);
  y += 16;

  // ── Divider ───────────────────────────────────────────────────────────
  hline(doc, M, y, CW, ...BORDER, 0.4);
  y += 5;

  // ── Results table ─────────────────────────────────────────────────────
  // "Results >" label + OmniQure seal (right)
  labelText(doc, "Results  >", M, y + 4);

  // Seal circle (right side)
  const sealX = W - M - 11, sealY = y + 11, sealR = 11;
  doc.setDrawColor(...BLUE);
  doc.setLineWidth(0.5);
  doc.circle(sealX, sealY, sealR, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(4);
  doc.setTextColor(...BLUE);
  doc.text("OMNIQURE", sealX, sealY - 4,  { align: "center" });
  doc.text("LABS",     sealX, sealY - 1,  { align: "center" });
  // checkmark
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.text("✓",        sealX, sealY + 3,  { align: "center" });
  doc.setFontSize(3.5);
  doc.text("VERIFIED", sealX, sealY + 6.5, { align: "center" });

  y += 8;

  const resultRows: { label: string; value: string; isGreen?: boolean; isBold?: boolean }[] = [
    { label: baseName,            value: actualMass !== null ? `${actualMass.toFixed(2)} mg` : "—", isBold: true },
    { label: "Purity",            value: purityStr,                                                   isGreen: true },
    ...(detail?.molecularWeight ? [{ label: "Molecular Weight", value: detail.molecularWeight }] : []),
    ...(detail?.casNumber       ? [{ label: "CAS Number",       value: detail.casNumber }]       : []),
  ];
  const RH = 8;
  const COL1W = 64; // label column
  resultRows.forEach((row, i) => {
    const rowY = y + i * RH;
    if (i % 2 === 0) fillRect(doc, M, rowY, CW - 22, RH, ...ROWALT);
    else             fillRect(doc, M, rowY, CW - 22, RH, 255, 255, 255);
    strokeRect(doc, M, rowY, CW - 22, RH, ...BLUE, 0.3);
    // left border accent
    fillRect(doc, M, rowY, 1, RH, ...BLUE);
    // label
    doc.setFont("helvetica", row.isBold ? "bold" : "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...INK);
    doc.text(row.label, M + 3, rowY + 5.5);
    // value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...(row.isGreen ? GREEN : INK));
    doc.text(row.value, M + COL1W, rowY + 5.5);
  });
  y += resultRows.length * RH + 5;

  // ── Comments ──────────────────────────────────────────────────────────
  labelText(doc, "Comments  >", M, y + 4);
  y += 7;
  const comments =
    "All specifications met. Sample approved for research distribution and use. " +
    "For laboratory research purposes only — not for human or veterinary use.";
  fillRect(doc, M, y, CW, 14, ...BGLIGHT);
  strokeRect(doc, M, y, CW, 14, ...BORDER, 0.3);
  bodyText(doc, comments, M + 3, y + 5.5, CW - 6);
  y += 18;

  // ── Divider ───────────────────────────────────────────────────────────
  hline(doc, M, y, CW, ...BORDER, 0.4);
  y += 5;

  // ── Analysis conducted + Signature ────────────────────────────────────
  // Left: sample received + analysis date pills
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text("Sample received  >", M, y + 4);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...INK);
  doc.text(received, M + 40, y + 4);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Analysis conducted  >", M, y + 4);
  fillRect(doc, M + 47, y - 1, 28, 8, ...ROWALT);
  strokeRect(doc, M + 47, y - 1, 28, 8, ...BLUE, 0.25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...INK);
  doc.text(analysis, M + 48, y + 4.5);

  y += 16;

  // ── Footer note ───────────────────────────────────────────────────────
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6);
  doc.setTextColor(...MUTED);
  doc.text(
    "This certificate is generated electronically and is valid for the lot number stated above. " +
    "Analysed at OmniQure QC Laboratory, Hertfordshire, UK.",
    M, y + 4, { maxWidth: CW },
  );

  const FOOTER_Y = 273;

  // Footer
  hline(doc, 0, FOOTER_Y, W, 27, 92, 181, 0.6);
  fillRect(doc, 0, FOOTER_Y, W, 24, 13, 37, 101);
  if (logo) {
    const { w: lw, h: lh } = fitLogo(logo, 32, 14);
    doc.addImage(logo.dataUrl, "PNG", M, FOOTER_Y + (24 - lh) / 2, lw, lh);
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(150, 175, 215);
  doc.text(
    `${coaRef}  ·  Lot: ${lot}  ·  Issued: ${issued}`,
    W / 2 + 10, FOOTER_Y + 9, { align: "center" },
  );
  doc.text(
    "omniqure.com  ·  For in-vitro research use only  ·  This document supersedes all previous versions for this lot.",
    W / 2 + 10, FOOTER_Y + 16, { align: "center" },
  );

  doc.save(`${product.name.replace(/[^a-z0-9]/gi, "_")}_COA_${lot}.pdf`);
}
