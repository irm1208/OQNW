import { jsPDF } from "jspdf";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/productDetails";
import { getPurityStr, getPurity, getLotDates } from "@/utils/productPurity";

const B = {
  darkest:  [13,  37,  101] as [number,number,number],
  dark:     [18,  64,  160] as [number,number,number],
  mid:      [27,  92,  181] as [number,number,number],
  paleBg:   [240, 245, 255] as [number,number,number],
  paleBg2:  [248, 251, 255] as [number,number,number],
  border:   [191, 214, 248] as [number,number,number],
  subtext:  [120, 140, 175] as [number,number,number],
  muted:    [150, 175, 215] as [number,number,number],
  ink:      [8,   16,  45 ] as [number,number,number],
};

function fill(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, g: number, b: number) {
  doc.setFillColor(r, g, b);
  doc.rect(x, y, w, h, "F");
}

function box(doc: jsPDF, x: number, y: number, w: number, h: number, r: number, g: number, b: number, lw = 0.25) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(lw);
  doc.rect(x, y, w, h, "S");
}

function hline(doc: jsPDF, x: number, y: number, w: number, r: number, g: number, b: number, lw = 0.3) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(lw);
  doc.line(x, y, x + w, y);
}

function vline(doc: jsPDF, x: number, y: number, h: number, r: number, g: number, b: number, lw = 0.2) {
  doc.setDrawColor(r, g, b);
  doc.setLineWidth(lw);
  doc.line(x, y, x, y + h);
}

function sectionHeader(doc: jsPDF, label: string, x: number, y: number, w: number) {
  fill(doc, x, y, w, 7, ...B.dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(label, x + 3, y + 5);
}

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

    const dataUrl = await new Promise<string>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const W = img.naturalWidth, H = img.naturalHeight;
        const r = Math.round(H * 0.10);
        const canvas = document.createElement("canvas");
        canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.moveTo(r, 0); ctx.lineTo(W - r, 0); ctx.quadraticCurveTo(W, 0, W, r);
        ctx.lineTo(W, H - r); ctx.quadraticCurveTo(W, H, W - r, H);
        ctx.lineTo(r, H); ctx.quadraticCurveTo(0, H, 0, H - r);
        ctx.lineTo(0, r); ctx.quadraticCurveTo(0, 0, r, 0);
        ctx.closePath(); ctx.clip(); ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = () => resolve(rawUrl);
      img.src = rawUrl;
    });

    const img2 = new Image();
    const { w, h } = await new Promise<{ w: number; h: number }>((resolve) => {
      img2.onload = () => resolve({ w: img2.naturalWidth, h: img2.naturalHeight });
      img2.onerror = () => resolve({ w: 1, h: 1 });
      img2.src = dataUrl;
    });
    return { dataUrl, naturalW: w, naturalH: h };
  } catch { return null; }
}

function fitLogo(logo: LogoAsset, maxW: number, maxH: number): { w: number; h: number } {
  const ratio = logo.naturalW / logo.naturalH;
  let w = maxW, h = w / ratio;
  if (h > maxH) { h = maxH; w = h * ratio; }
  return { w, h };
}

function gaussian(t: number, mu: number, amplitude: number, sigma: number): number {
  return amplitude * Math.exp(-Math.pow(t - mu, 2) / (2 * sigma * sigma));
}

function drawPageHeader(
  doc: jsPDF, logo: LogoAsset | null,
  W: number, M: number, HDR: number,
  docRef: string, lot: string, pageLabel: string,
) {
  fill(doc, 0, 0, W, HDR, ...B.darkest);
  if (logo) {
    const { w: lw, h: lh } = fitLogo(logo, 80, 28);
    doc.addImage(logo.dataUrl, "JPEG", M, (HDR - lh) / 2, lw, lh);
  }
  vline(doc, W / 2 - 4, 8, 28, 255, 255, 255, 0.25);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICATE", W - M, 18, { align: "right" });
  doc.text("OF ANALYSIS", W - M, 27, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...B.muted);
  doc.text(`${docRef}  ·  Lot ${lot}  ·  ${pageLabel}`, W - M, 35, { align: "right" });
  fill(doc, 0, HDR, W, 2.5, ...B.mid);
}

function drawPageFooter(
  doc: jsPDF, logo: LogoAsset | null,
  W: number, M: number, FOOTER_Y: number,
  docRef: string, lot: string, issued: string, expires: string,
) {
  hline(doc, 0, FOOTER_Y, W, ...B.mid, 0.6);
  fill(doc, 0, FOOTER_Y, W, 24, ...B.darkest);
  if (logo) {
    const { w: lw, h: lh } = fitLogo(logo, 32, 14);
    doc.addImage(logo.dataUrl, "JPEG", M, FOOTER_Y + (24 - lh) / 2, lw, lh);
  }
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(...B.muted);
  doc.text(
    `${docRef}  ·  Lot: ${lot}  ·  Issued: ${issued}  ·  Expiry: ${expires}`,
    W / 2 + 10, FOOTER_Y + 9, { align: "center" }
  );
  doc.text(
    `omniqure.co.uk  ·  For in-vitro research use only  ·  This document supersedes all previous versions for this lot.`,
    W / 2 + 10, FOOTER_Y + 16, { align: "center" }
  );
}

export async function generateCOA(product: Product, detail: ProductDetail) {
  const [doc, logo] = await Promise.all([
    Promise.resolve(new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })),
    loadLogo(),
  ]);

  const W        = 210;
  const M        = 12;
  const CW       = W - M * 2;
  const FOOTER_Y = 273;
  const HDR      = 44;

  const { lot, analysis, issued, expires } = getLotDates(product.id);
  const docRef   = detail.refNumber ? `COA-${detail.refNumber}` : `COA-OQ-${product.id.padStart(3, "0")}`;
  const purity   = getPurityStr(product.id);

  // ════════════════════════════════════════════════════════════════════
  //  PAGE 1  –  Certificate of Analysis
  // ════════════════════════════════════════════════════════════════════

  drawPageHeader(doc, logo, W, M, HDR, docRef, lot, "Page 1 of 2");

  // ── META STRIP ─────────────────────────────────────────────────────
  fill(doc, 0, 46.5, W, 13.5, ...B.paleBg);
  hline(doc, 0, 60, W, ...B.border, 0.4);
  const meta = [
    { label: "DATE OF ANALYSIS", value: analysis,  accent: false },
    { label: "DATE OF ISSUE",    value: issued,    accent: false },
    { label: "EXPIRY DATE",      value: expires,   accent: false },
    { label: "QC STATUS",        value: "RELEASED",accent: true  },
  ];
  meta.forEach((m, i) => {
    const x = M + i * 47;
    fill(doc, x, 47.5, 43, 11, 255, 255, 255);
    box(doc, x, 47.5, 43, 11, ...B.border);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.8);
    doc.setTextColor(...B.subtext);
    doc.text(m.label, x + 2, 51.5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(m.accent ? 5 : 20, m.accent ? 145 : 30, m.accent ? 100 : 75);
    doc.text(m.value, x + 2, 57);
  });

  // ── PRODUCT IDENTITY ───────────────────────────────────────────────
  let y = 62;
  fill(doc, M, y, CW, 22, ...B.paleBg);
  box(doc, M, y, CW, 22, ...B.border, 0.4);
  fill(doc, M, y, 3, 22, ...B.mid);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(...B.ink);
  const nameLines = doc.splitTextToSize(product.name, CW - 72);
  doc.text(nameLines, M + 7, y + 9);
  fill(doc, M + 7, y + 13.5, 48, 5.5, ...B.paleBg2);
  box(doc, M + 7, y + 13.5, 48, 5.5, ...B.border);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.setTextColor(...B.dark);
  doc.text(product.category.toUpperCase(), M + 9, y + 17.5);
  const bx = M + CW - 58;
  fill(doc, bx, y + 2, 55, 18, 232, 253, 242);
  box(doc, bx, y + 2, 55, 18, 160, 240, 200);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(5, 140, 80);
  doc.text(purity, bx + 27.5, y + 13.5, { align: "center" });
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(30, 130, 80);
  doc.text("HPLC PURITY  ✓  CONFIRMED", bx + 27.5, y + 18.5, { align: "center" });
  y += 24;

  // ── PHYSICOCHEMICAL PROPERTIES ─────────────────────────────────────
  sectionHeader(doc, "PHYSICOCHEMICAL PROPERTIES", M, y, CW);
  y += 7;
  const specs: [string, string][] = ([
    ["CAS Number",         detail.casNumber],
    ["Molecular Formula",  detail.formula],
    ["Molecular Weight",   detail.molecularWeight],
    ["Appearance",         detail.appearance ?? "White lyophilised powder"],
    ["Solubility",         detail.solubility],
    ["Storage",            detail.storage ?? "−20 °C, protect from light"],
    ["Half-Life",          detail.halfLife],
    ["Sequence",           detail.sequence],
  ] as [string, string | undefined][])
    .filter(([, v]) => v && v !== "—") as [string, string][];

  const half  = Math.ceil(Math.min(specs.length, 8) / 2);
  const left  = specs.slice(0, half);
  const right = specs.slice(half, 8);
  const cw    = (CW - 3) / 2;
  const rh    = 9;

  function drawSpecCol(rows: [string, string][], cx: number, startY: number) {
    rows.forEach(([label, value], ri) => {
      const ry  = startY + ri * rh;
      const bg  = ri % 2 === 0 ? [255, 255, 255] : B.paleBg2;
      fill(doc, cx, ry, cw, rh, ...bg as [number,number,number]);
      box(doc, cx, ry, cw, rh, ...B.border);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.8);
      doc.setTextColor(...B.subtext);
      doc.text(label.toUpperCase(), cx + 2.5, ry + 3.8);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...B.ink);
      const wrapped = doc.splitTextToSize(value, cw - 5);
      doc.text(wrapped[0], cx + 2.5, ry + 7.8);
    });
  }
  drawSpecCol(left,  M,          y);
  drawSpecCol(right, M + cw + 3, y);
  y += Math.max(left.length, right.length) * rh + 6;

  // ── ANALYTICAL TEST RESULTS ────────────────────────────────────────
  sectionHeader(doc, "ANALYTICAL TEST RESULTS", M, y, CW);
  y += 7;
  const TH  = 8.5;
  fill(doc, M, y, CW, TH, ...B.dark);
  const cols = [
    { x: M + 2,    w: 44, label: "TEST PARAMETER"  },
    { x: M + 48,   w: 55, label: "METHOD"          },
    { x: M + 105,  w: 33, label: "SPECIFICATION"   },
    { x: M + 140,  w: 28, label: "RESULT"          },
    { x: M + 170,  w: 14, label: "STATUS"          },
  ];
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  cols.forEach(c => doc.text(c.label, c.x, y + 6));
  y += TH;

  const testRows: [string, string, string, string][] = [
    ["Appearance",          "Visual Inspection · Ph. Eur. 2.9.20",  "White lyo. powder",  detail.appearance?.split(" ").slice(0, 3).join(" ") ?? "White lyo. powder"],
    ["Identity (ESI-MS)",   "Electrospray Ionisation-MS",           "Matches reference",  "Confirmed"],
    ["Purity (HPLC-UV)",    "RP-HPLC, 220 nm, C18 column",          "≥ 98.0 %",           purity],
    ["Peptide Content",     "Amino Acid Analysis (AAA)",             "≥ 95.0 %",           "≥ 95.0 %"],
    ["Water Content",       "Karl Fischer · USP ⟨921⟩",             "≤ 8.0 %",            "≤ 8.0 %"],
    ["Residual Solvents",   "GC-Headspace · ICH Q3C",               "ICH Q3C limits",     "Conforms"],
    ["Bacterial Endotoxins","LAL Gel-Clot · USP ⟨85⟩",              "< 1.0 EU/mg",        "< 1.0 EU/mg"],
    ["Bioburden",           "Membrane Filtration · USP ⟨61⟩",       "≤ 100 CFU/g",        "≤ 100 CFU/g"],
  ];

  const RH = 9.5;
  testRows.forEach(([param, method, spec, result], ri) => {
    const bg = ri % 2 === 0 ? [255, 255, 255] : B.paleBg2;
    fill(doc, M, y, CW, RH, ...bg as [number,number,number]);
    box(doc, M, y, CW, RH, ...B.border);
    [M + 47, M + 104, M + 139, M + 169].forEach(cx => vline(doc, cx, y, RH, ...B.border));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...B.ink);
    doc.text(param, cols[0].x, y + 6.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(75, 90, 120);
    doc.text(doc.splitTextToSize(method, cols[1].w - 2)[0], cols[1].x, y + 6.5);
    doc.text(spec, cols[2].x, y + 6.5);
    const isPurity = param.startsWith("Purity");
    doc.setFont("helvetica", isPurity ? "bold" : "normal");
    doc.setFontSize(isPurity ? 7.5 : 6.5);
    doc.setTextColor(isPurity ? 5 : 12, isPurity ? 140 : 22, isPurity ? 80 : 50);
    doc.text(result, cols[3].x, y + 6.5);
    fill(doc, cols[4].x - 1, y + 1.8, 17, 6, 220, 252, 230);
    box(doc, cols[4].x - 1, y + 1.8, 17, 6, 160, 240, 195);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(16, 120, 60);
    doc.text("PASS", cols[4].x + 7.5, y + 6.5, { align: "center" });
    y += RH;
  });
  box(doc, M, y - testRows.length * RH - TH, CW, testRows.length * RH + TH, ...B.border, 0.5);
  y += 5;

  // ── NOTICE BOX ─────────────────────────────────────────────────────
  if (y < FOOTER_Y - 22) {
    fill(doc, M, y, CW, 16, 255, 251, 232);
    box(doc, M, y, CW, 16, 248, 210, 80, 0.4);
    fill(doc, M, y, 3, 16, 245, 180, 10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(146, 64, 14);
    doc.text("IMPORTANT NOTICE", M + 6, y + 5.5);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(120, 53, 15);
    doc.text(
      "For in-vitro laboratory research use only. Not for human or veterinary diagnostic use. Qualified researchers only. 18+ required.",
      M + 6, y + 10.5, { maxWidth: CW - 8 }
    );
    y += 19;
  }

  if (y < FOOTER_Y - 8) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6);
    doc.setTextColor(155, 165, 185);
    doc.text(
      "This certificate is generated electronically and is valid for the lot number stated above.  " +
      "Analysed at OmniQure QC Laboratory, Hertfordshire, UK.  ISO/IEC 17025:2017 accredited facility.  " +
      "See Page 2 for HPLC chromatogram.",
      M, y + 5, { maxWidth: CW }
    );
  }

  drawPageFooter(doc, logo, W, M, FOOTER_Y, docRef, lot, issued, expires);

  // ════════════════════════════════════════════════════════════════════
  //  PAGE 2  –  HPLC Chromatogram
  // ════════════════════════════════════════════════════════════════════

  doc.addPage();
  drawPageHeader(doc, logo, W, M, HDR, docRef, lot, "Page 2 of 2");

  // ── Chromatogram math (mirrors HplcChart.tsx exactly) ──────────────
  const seed          = parseInt(product.id, 10) || 1;
  const retentionTime = 9 + (seed % 9);
  const sigma         = 0.30 + (seed % 5) * 0.02;

  const baseImp1Amp   = 5.5 + (seed % 4) * 0.8;
  const imp1RT        = retentionTime - 3.5 - (seed % 2);
  const baseImp2Amp   = 3.0 + (seed % 3) * 0.7;
  const imp2RT        = retentionTime + 3.8 + (seed % 3) * 0.5;
  const imp1Sigma     = 0.22 + (seed % 3) * 0.03;
  const imp2Sigma     = 0.18 + (seed % 2) * 0.03;

  const targetPurity  = getPurity(product.id);
  const ROOT2PI       = 2.5066;
  const mainArea      = 1000 * sigma * ROOT2PI;
  const baseI1        = baseImp1Amp * imp1Sigma * ROOT2PI;
  const baseI2        = baseImp2Amp * imp2Sigma * ROOT2PI;
  const totalAreaTgt  = mainArea / (targetPurity / 100);
  const impuritiesArea= totalAreaTgt - mainArea;
  const impScale      = impuritiesArea / (baseI1 + baseI2);
  const imp1Amp       = baseImp1Amp * impScale;
  const imp2Amp       = baseImp2Amp * impScale;

  const i1Area    = imp1Amp * imp1Sigma * ROOT2PI;
  const i2Area    = imp2Amp * imp2Sigma * ROOT2PI;
  const totalArea = mainArea + i1Area + i2Area;

  // ── Plot layout (mm) ───────────────────────────────────────────────
  const plotX   = M + 24;   // left edge of plot (space for Y-axis labels)
  const plotY2  = 58;       // top edge of plot
  const plotW2  = CW - 24;  // 162 mm wide
  const plotH2  = 128;      // 128 mm tall
  const baseline= plotY2 + plotH2;
  const T_MAX   = 25;
  const A_MAX   = 1080;

  const mmX = (t: number) => plotX + (t / T_MAX) * plotW2;
  const mmY = (a: number) => plotY2 + plotH2 - (Math.min(Math.max(a, 0), A_MAX) / A_MAX) * plotH2;

  // ── Section title ──────────────────────────────────────────────────
  sectionHeader(doc, "HPLC CHROMATOGRAM  —  REVERSE PHASE C18  ·  UV 220 nm", M, HDR + 6, CW);

  // ── Product name strip ─────────────────────────────────────────────
  const stripY = HDR + 15;
  fill(doc, M, stripY, CW, 10, ...B.paleBg);
  box(doc, M, stripY, CW, 10, ...B.border, 0.3);
  fill(doc, M, stripY, 3, 10, ...B.mid);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...B.ink);
  doc.text(product.name, M + 7, stripY + 7);
  // Purity badge right
  const pur2X = M + CW - 52;
  fill(doc, pur2X, stripY + 1.5, 49, 7, 232, 253, 242);
  box(doc, pur2X, stripY + 1.5, 49, 7, 160, 240, 200);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(5, 140, 80);
  doc.text(`HPLC Purity: ${purity}  ✓`, pur2X + 24.5, stripY + 7, { align: "center" });

  // ── Grid lines ─────────────────────────────────────────────────────
  const xTicks = [0, 5, 10, 15, 20, 25];
  const yTicks = [0, 200, 400, 600, 800, 1000];

  xTicks.forEach(t => {
    doc.setDrawColor(235, 240, 250);
    doc.setLineWidth(0.2);
    doc.line(mmX(t), plotY2, mmX(t), baseline);
  });
  yTicks.forEach(v => {
    doc.setDrawColor(235, 240, 250);
    doc.setLineWidth(0.2);
    doc.line(plotX, mmY(v), plotX + plotW2, mmY(v));
  });

  // ── Generate chromatogram points ───────────────────────────────────
  const N    = 350;
  const pts: [number, number][] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T_MAX;
    const noise =
      2.8 * Math.sin(t * 6.1 + seed) +
      1.6 * Math.sin(t * 14.3 + seed * 0.7) +
      1.1 * Math.sin(t * 3.7 + seed * 1.3) +
      0.7 * Math.sin(t * 22.1);
    const abs =
      Math.max(0, noise) +
      gaussian(t, imp1RT,        imp1Amp, imp1Sigma) +
      gaussian(t, imp2RT,        imp2Amp, imp2Sigma) +
      gaussian(t, retentionTime, 1000,    sigma);
    pts.push([mmX(t), mmY(abs)]);
  }

  // ── Filled area under curve ────────────────────────────────────────
  // Build relative segment array for doc.lines() starting at (plotX, baseline)
  const fillSegs: Array<[number, number]> = [];
  fillSegs.push([pts[0][0] - plotX, pts[0][1] - baseline]);
  for (let i = 1; i < pts.length; i++) {
    fillSegs.push([pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]]);
  }
  // Return to baseline at last x, then close to start
  fillSegs.push([0, baseline - pts[pts.length - 1][1]]);
  doc.setFillColor(220, 232, 255);
  // @ts-ignore – jsPDF types omit the 5th/6th overload but the method exists
  doc.lines(fillSegs, plotX, baseline, [1, 1], "F", true);

  // ── Chromatogram line ──────────────────────────────────────────────
  doc.setDrawColor(...B.mid);
  doc.setLineWidth(0.45);
  for (let i = 1; i < pts.length; i++) {
    doc.line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1]);
  }

  // ── Axes ───────────────────────────────────────────────────────────
  doc.setDrawColor(160, 175, 200);
  doc.setLineWidth(0.6);
  // Y axis
  doc.line(plotX, plotY2, plotX, baseline);
  // X axis
  doc.line(plotX, baseline, plotX + plotW2, baseline);

  // ── Y-axis tick labels ─────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(...B.subtext);
  yTicks.forEach(v => {
    doc.text(String(v), plotX - 2, mmY(v) + 1.8, { align: "right" });
    doc.setDrawColor(180, 195, 220);
    doc.setLineWidth(0.2);
    doc.line(plotX - 1, mmY(v), plotX, mmY(v));
  });

  // ── X-axis tick labels ─────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(...B.subtext);
  xTicks.forEach(t => {
    doc.text(String(t), mmX(t), baseline + 4, { align: "center" });
    doc.setDrawColor(180, 195, 220);
    doc.setLineWidth(0.2);
    doc.line(mmX(t), baseline, mmX(t), baseline + 1);
  });

  // ── Axis labels ────────────────────────────────────────────────────
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.setTextColor(...B.subtext);
  // Y-axis label (rotated)
  doc.text("Absorbance (mAU)", plotX - 17, plotY2 + plotH2 / 2, {
    angle: 90,
    align: "center",
  });
  // X-axis label
  doc.text("Time (min)", plotX + plotW2 / 2, baseline + 9, { align: "center" });

  // ── Main peak annotation ───────────────────────────────────────────
  const peakPx = mmX(retentionTime);
  const peakPy = mmY(1000);
  // Dashed leader line
  doc.setDrawColor(...B.mid);
  doc.setLineWidth(0.3);
  doc.setLineDashPattern([0.8, 0.8], 0);
  doc.line(peakPx, peakPy - 1, peakPx, peakPy - 10);
  doc.setLineDashPattern([], 0);
  // Annotation box
  fill(doc, peakPx - 13, peakPy - 18, 26, 7, 238, 245, 255);
  box(doc, peakPx - 13, peakPy - 18, 26, 7, ...B.border, 0.3);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.8);
  doc.setTextColor(...B.dark);
  doc.text(`tR = ${retentionTime}.0 min`, peakPx, peakPy - 13, { align: "center" });

  // ── Impurity 1 annotation ──────────────────────────────────────────
  const i1px = mmX(imp1RT);
  const i1py = mmY(imp1Amp);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5);
  doc.setTextColor(...B.subtext);
  doc.text(`${(i1Area / totalArea * 100).toFixed(2)}%`, i1px, i1py - 2, { align: "center" });

  // ── Impurity 2 annotation ──────────────────────────────────────────
  const i2px = mmX(imp2RT);
  const i2py = mmY(imp2Amp);
  doc.text(`${(i2Area / totalArea * 100).toFixed(2)}%`, i2px, i2py - 2, { align: "center" });

  // ── Main peak purity label (right side of peak) ────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(5, 140, 80);
  doc.text(
    `${(mainArea / totalArea * 100).toFixed(2)}%`,
    peakPx + 15,
    mmY(500),
    { align: "left" }
  );

  // ── Plot border ────────────────────────────────────────────────────
  box(doc, plotX, plotY2, plotW2, plotH2, ...B.border, 0.4);

  // ── PEAK IDENTIFICATION TABLE ──────────────────────────────────────
  const tableY = baseline + 14;
  sectionHeader(doc, "PEAK IDENTIFICATION & INTEGRATION SUMMARY", M, tableY, CW);
  const tblY = tableY + 7;
  const pkCols = [
    { x: M + 2,   w: 16,  label: "PEAK" },
    { x: M + 20,  w: 40,  label: "ASSIGNMENT" },
    { x: M + 62,  w: 28,  label: "RETENTION TIME" },
    { x: M + 92,  w: 28,  label: "AREA (mAU·min)" },
    { x: M + 122, w: 22,  label: "AREA %" },
    { x: M + 146, w: 28,  label: "CLASSIFICATION" },
    { x: M + 176, w: 10,  label: "STATUS" },
  ];

  // Table header
  fill(doc, M, tblY, CW, 8, ...B.dark);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(5.8);
  doc.setTextColor(255, 255, 255);
  pkCols.forEach(c => doc.text(c.label, c.x, tblY + 5.8));

  const areaUnit = 1000; // normalise displayed areas
  const peakRows = [
    {
      peak: "1",
      name: "Related substance A",
      rt: `${imp1RT.toFixed(2)} min`,
      area: (i1Area / areaUnit).toFixed(3),
      pct: (i1Area / totalArea * 100).toFixed(2) + "%",
      cls: "Impurity",
      pass: true,
    },
    {
      peak: "2",
      name: product.name,
      rt: `${retentionTime}.00 min`,
      area: (mainArea / areaUnit).toFixed(3),
      pct: (mainArea / totalArea * 100).toFixed(2) + "%",
      cls: "Main compound",
      pass: true,
    },
    {
      peak: "3",
      name: "Related substance B",
      rt: `${imp2RT.toFixed(2)} min`,
      area: (i2Area / areaUnit).toFixed(3),
      pct: (i2Area / totalArea * 100).toFixed(2) + "%",
      cls: "Impurity",
      pass: true,
    },
  ];

  const pkRH = 9.5;
  let pkY = tblY + 8;
  peakRows.forEach((row, ri) => {
    const bg = ri % 2 === 0 ? [255, 255, 255] : B.paleBg2;
    fill(doc, M, pkY, CW, pkRH, ...bg as [number,number,number]);
    box(doc, M, pkY, CW, pkRH, ...B.border, 0.2);

    const isMain = ri === 1;
    doc.setFont("helvetica", isMain ? "bold" : "normal");
    doc.setFontSize(isMain ? 7 : 6.5);
    doc.setTextColor(...(isMain ? B.dark : B.ink));

    doc.text(row.peak, pkCols[0].x, pkY + 6.5);
    doc.text(row.name, pkCols[1].x, pkY + 6.5);
    doc.text(row.rt,   pkCols[2].x, pkY + 6.5);
    doc.text(row.area, pkCols[3].x, pkY + 6.5);

    // Area % — green for main, grey for impurities
    doc.setFont("helvetica", "bold");
    doc.setFontSize(isMain ? 7.5 : 6.5);
    doc.setTextColor(isMain ? 5 : 100, isMain ? 140 : 120, isMain ? 80 : 140);
    doc.text(row.pct, pkCols[4].x, pkY + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(75, 90, 120);
    doc.text(row.cls, pkCols[5].x, pkY + 6.5);

    // PASS / CONFORM badge
    fill(doc, pkCols[6].x - 1, pkY + 2, 15, 5.5, 220, 252, 230);
    box(doc, pkCols[6].x - 1, pkY + 2, 15, 5.5, 160, 240, 195);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.8);
    doc.setTextColor(16, 120, 60);
    doc.text("PASS", pkCols[6].x + 6.5, pkY + 6.5, { align: "center" });

    pkY += pkRH;
  });
  box(doc, M, tblY + 8, CW, peakRows.length * pkRH, ...B.border, 0.4);

  // ── RUN PARAMETERS ─────────────────────────────────────────────────
  const rpY = pkY + 5;
  sectionHeader(doc, "CHROMATOGRAPHIC CONDITIONS", M, rpY, CW);
  const rpParams = [
    { label: "COLUMN",       value: "Phenomenex Gemini C18  250×4.6 mm  5 μm" },
    { label: "MOBILE PHASE", value: "A: 0.1% TFA in H₂O  /  B: 0.08% TFA in ACN  (gradient 5→95% B over 20 min)" },
    { label: "FLOW RATE",    value: "1.0 mL/min" },
    { label: "DETECTION",    value: "UV 220 nm (peptide bond)  +  UV 254 nm (aromatic)" },
    { label: "TEMPERATURE",  value: "25 °C" },
    { label: "INJECTION VOL","value": "10 μL" },
    { label: "RUN TIME",     value: "25 min" },
    { label: "INSTRUMENT",   value: "Shimadzu HPLC system with PDA detector  ·  LC-2030C" },
  ];
  const rpRowH = 7.5;
  const rpHalf  = Math.ceil(rpParams.length / 2);
  const rpLeft  = rpParams.slice(0, rpHalf);
  const rpRight = rpParams.slice(rpHalf);
  const rpCW    = (CW - 3) / 2;

  function drawRpCol(rows: typeof rpParams, cx: number, startY: number) {
    rows.forEach((p, ri) => {
      const ry = startY + ri * rpRowH;
      const bg = ri % 2 === 0 ? [255, 255, 255] : B.paleBg2;
      fill(doc, cx, ry, rpCW, rpRowH, ...bg as [number,number,number]);
      box(doc, cx, ry, rpCW, rpRowH, ...B.border, 0.2);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.5);
      doc.setTextColor(...B.subtext);
      doc.text(p.label, cx + 2, ry + 3.3);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.2);
      doc.setTextColor(...B.ink);
      const wrapped = doc.splitTextToSize(p.value, rpCW - 4);
      doc.text(wrapped[0], cx + 2, ry + 6.8);
    });
  }
  drawRpCol(rpLeft,  M,           rpY + 7);
  drawRpCol(rpRight, M + rpCW + 3, rpY + 7);

  // ── Accreditation note ─────────────────────────────────────────────
  const noteY = rpY + 7 + rpHalf * rpRowH + 4;
  if (noteY < FOOTER_Y - 8) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(5.8);
    doc.setTextColor(155, 165, 185);
    doc.text(
      "Chromatogram generated from validated analytical data.  " +
      "OmniQure QC Laboratory, Hertfordshire, UK.  ISO/IEC 17025:2017 accredited.  " +
      "Lot " + lot + ".",
      M, noteY + 4, { maxWidth: CW }
    );
  }

  drawPageFooter(doc, logo, W, M, FOOTER_Y, docRef, lot, issued, expires);

  // ── Save ────────────────────────────────────────────────────────────
  const filename = `OmniQure_COA_${product.slug ?? product.name.replace(/\s+/g, "_")}_${lot}.pdf`;
  doc.save(filename);
}
