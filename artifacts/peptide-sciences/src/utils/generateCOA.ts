import { jsPDF } from "jspdf";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/productDetails";
import { getPurity, getPurityStr, getLotDates } from "@/utils/productPurity";
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
    const res  = await fetch("/omniqure-logo.jpeg");
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

// ─── Gaussian helper (HPLC page) ─────────────────────────────────────────────

function gaussian(t: number, mu: number, amplitude: number, sigma: number): number {
  return amplitude * Math.exp(-Math.pow(t - mu, 2) / (2 * sigma * sigma));
}

// ─── Main export ─────────────────────────────────────────────────────────────

export async function generateCOA(product: Product, detail: ProductDetail) {
  const doc  = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const logo = await loadLogo();

  const W  = 210;
  const M  = 14;
  const CW = W - M * 2;

  const { lot, received, analysis, issued } = getLotDates(product.id);
  const purity     = getPurity(product.id);
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

  // Logo (right)
  if (logo) {
    const { w: lw, h: lh } = fitLogo(logo, 46, 16);
    doc.addImage(logo.dataUrl, "JPEG", W - M - lw, y, lw, lh);
  }
  // Contact lines under logo
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTED);
  doc.text("Web: www.omniqure.co.uk", W - M, y + 18, { align: "right" });

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
    "Reverse-phase HPLC purity analysis (UV detection at 214 nm) and " +
    "electrospray ionisation mass spectrometry (ESI-MS) for identity confirmation.";
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
    { label: "Identity (ESI-MS)", value: "Confirmed" },
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
    "Analysed at OmniQure QC Laboratory, Hertfordshire, UK. See Page 2 for HPLC chromatogram.",
    M, y + 4, { maxWidth: CW },
  );

  // ══════════════════════════════════════════════════════════════════════
  //  PAGE 2 — HPLC Chromatogram
  // ══════════════════════════════════════════════════════════════════════

  doc.addPage();

  const FOOTER_Y = 273;
  const HDR      = 44;

  // Dark header (matches existing design for chromatogram page)
  fillRect(doc, 0, 0, W, HDR, 13, 37, 101);
  if (logo) {
    const { w: lw, h: lh } = fitLogo(logo, 80, 28);
    doc.addImage(logo.dataUrl, "JPEG", M, (HDR - lh) / 2, lw, lh);
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICATE",  W - M, 18, { align: "right" });
  doc.text("OF ANALYSIS",  W - M, 27, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(150, 175, 215);
  doc.text(`${coaRef}  ·  Lot ${lot}  ·  Page 2 of 2`, W - M, 35, { align: "right" });
  fillRect(doc, 0, HDR, W, 2.5, 27, 92, 181);

  // Section header bar
  fillRect(doc, M, HDR + 6, CW, 7, 18, 64, 160);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("HPLC CHROMATOGRAM  —  REVERSE PHASE C18  ·  UV 220 nm", M + 3, HDR + 11.5);

  // Product strip
  const stripY = HDR + 15;
  fillRect(doc, M, stripY, CW, 10, 240, 245, 255);
  strokeRect(doc, M, stripY, CW, 10, 191, 214, 248, 0.3);
  fillRect(doc, M, stripY, 3, 10, 27, 92, 181);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(8, 16, 45);
  doc.text(product.name, M + 7, stripY + 7);
  // Purity badge
  const pur2X = M + CW - 52;
  fillRect(doc, pur2X, stripY + 1.5, 49, 7, 232, 253, 242);
  strokeRect(doc, pur2X, stripY + 1.5, 49, 7, 160, 240, 200);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(5, 140, 80);
  doc.text(`HPLC Purity: ${purityStr}  ✓`, pur2X + 24.5, stripY + 7, { align: "center" });

  // Chromatogram maths (identical to HplcChart.tsx)
  const seed          = parseInt(product.id, 10) || 1;
  const retentionTime = 9 + (seed % 9);
  const sigma         = 0.30 + (seed % 5) * 0.02;
  const baseImp1Amp   = 5.5 + (seed % 4) * 0.8;
  const imp1RT        = retentionTime - 3.5 - (seed % 2);
  const baseImp2Amp   = 3.0 + (seed % 3) * 0.7;
  const imp2RT        = retentionTime + 3.8 + (seed % 3) * 0.5;
  const imp1Sigma     = 0.22 + (seed % 3) * 0.03;
  const imp2Sigma     = 0.18 + (seed % 2) * 0.03;
  const ROOT2PI       = 2.5066;
  const mainArea      = 1000 * sigma * ROOT2PI;
  const baseI1        = baseImp1Amp * imp1Sigma * ROOT2PI;
  const baseI2        = baseImp2Amp * imp2Sigma * ROOT2PI;
  const totalAreaTgt  = mainArea / (purity / 100);
  const impuritiesArea= totalAreaTgt - mainArea;
  const impScale      = impuritiesArea / (baseI1 + baseI2);
  const imp1Amp       = baseImp1Amp * impScale;
  const imp2Amp       = baseImp2Amp * impScale;

  const plotX   = M + 24;
  const plotY2  = 58;
  const plotW2  = CW - 24;
  const plotH2  = 128;
  const baseline= plotY2 + plotH2;
  const T_MAX   = 25;
  const A_MAX   = 1080;
  const mmX = (t: number) => plotX + (t / T_MAX) * plotW2;
  const mmY = (a: number) => plotY2 + plotH2 - (Math.min(Math.max(a, 0), A_MAX) / A_MAX) * plotH2;

  // Grid
  [0, 5, 10, 15, 20, 25].forEach(t => {
    doc.setDrawColor(235, 240, 250);
    doc.setLineWidth(0.2);
    doc.line(mmX(t), plotY2, mmX(t), baseline);
  });
  [0, 200, 400, 600, 800, 1000].forEach(v => {
    doc.setDrawColor(235, 240, 250);
    doc.setLineWidth(0.2);
    doc.line(plotX, mmY(v), plotX + plotW2, mmY(v));
  });

  // Chromatogram points
  const N = 350;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_MAX;
    const noise =
      2.8 * Math.sin(t * 6.1 + seed) +
      1.6 * Math.sin(t * 14.3 + seed * 0.7) +
      1.1 * Math.sin(t * 3.7  + seed * 1.3) +
      0.7 * Math.sin(t * 22.1);
    const abs =
      Math.max(0, noise) +
      gaussian(t, imp1RT,        imp1Amp, imp1Sigma) +
      gaussian(t, imp2RT,        imp2Amp, imp2Sigma) +
      gaussian(t, retentionTime, 1000,    sigma);
    pts.push([mmX(t), mmY(abs)]);
  }

  // Filled area
  const fillSegs: number[][] = [];
  fillSegs.push([pts[0][0] - plotX, pts[0][1] - baseline]);
  for (let i = 1; i < pts.length; i++) {
    fillSegs.push([pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]]);
  }
  fillSegs.push([0, baseline - pts[pts.length - 1][1]]);
  doc.setFillColor(220, 232, 255);
  // @ts-ignore
  doc.lines(fillSegs, plotX, baseline, [1, 1], "F", true);

  // Chromatogram line
  doc.setDrawColor(27, 92, 181);
  doc.setLineWidth(0.45);
  for (let i = 1; i < pts.length; i++) {
    doc.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
  }

  // Axes
  doc.setDrawColor(160, 175, 200);
  doc.setLineWidth(0.6);
  doc.line(plotX, plotY2, plotX, baseline);
  doc.line(plotX, baseline, plotX + plotW2, baseline);

  // Y-axis labels
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(120, 140, 175);
  [0, 200, 400, 600, 800, 1000].forEach(v => {
    doc.text(String(v), plotX - 2, mmY(v) + 1.8, { align: "right" });
    doc.setDrawColor(180, 195, 220);
    doc.setLineWidth(0.2);
    doc.line(plotX - 1, mmY(v), plotX, mmY(v));
  });

  // X-axis labels
  [0, 5, 10, 15, 20, 25].forEach(t => {
    doc.text(String(t), mmX(t), baseline + 4, { align: "center" });
    doc.setDrawColor(180, 195, 220);
    doc.setLineWidth(0.2);
    doc.line(mmX(t), baseline, mmX(t), baseline + 1);
  });

  // Axis titles
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(120, 140, 175);
  doc.text("Absorbance (mAU)", plotX - 17, plotY2 + plotH2 / 2, { angle: 90, align: "center" });
  doc.text("Time (min)", plotX + plotW2 / 2, baseline + 9, { align: "center" });

  // Main peak annotation
  const peakPx = mmX(retentionTime);
  const peakPy = mmY(1000);
  doc.setDrawColor(27, 92, 181);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([0.8, 0.8], 0);
  doc.line(peakPx, peakPy - 1, peakPx, peakPy - 10);
  doc.setLineDashPattern([], 0);
  fillRect(doc, peakPx - 13, peakPy - 18, 26, 7, 238, 245, 255);
  strokeRect(doc, peakPx - 13, peakPy - 18, 26, 7, 191, 214, 248, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.8);
  doc.setTextColor(18, 64, 160);
  doc.text(product.name.split(" ").slice(0, 2).join(" "), peakPx, peakPy - 13.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(120, 140, 175);
  doc.text(`RT: ${retentionTime.toFixed(1)} min`, peakPx, peakPy - 10, { align: "center" });

  // Footer
  hline(doc, 0, FOOTER_Y, W, 27, 92, 181, 0.6);
  fillRect(doc, 0, FOOTER_Y, W, 24, 13, 37, 101);
  if (logo) {
    const { w: lw, h: lh } = fitLogo(logo, 32, 14);
    doc.addImage(logo.dataUrl, "JPEG", M, FOOTER_Y + (24 - lh) / 2, lw, lh);
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(150, 175, 215);
  doc.text(
    `${coaRef}  ·  Lot: ${lot}  ·  Issued: ${issued}`,
    W / 2 + 10, FOOTER_Y + 9, { align: "center" },
  );
  doc.text(
    "omniqure.co.uk  ·  For in-vitro research use only  ·  This document supersedes all previous versions for this lot.",
    W / 2 + 10, FOOTER_Y + 16, { align: "center" },
  );

  doc.save(`${product.name.replace(/[^a-z0-9]/gi, "_")}_COA_${lot}.pdf`);
}
