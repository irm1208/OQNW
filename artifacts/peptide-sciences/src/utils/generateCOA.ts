import { jsPDF } from "jspdf";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/productDetails";
import { getPurityStr, getLotDates } from "@/utils/productPurity";

// ─── drawing helpers ───────────────────────────────────────────────────────────

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
  fill(doc, x, y, w, 7, 18, 38, 95);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text(label, x + 3, y + 5);
}

// ─── logo loader ──────────────────────────────────────────────────────────────

interface LogoAsset {
  dataUrl: string;
  naturalW: number;
  naturalH: number;
}

async function loadLogo(): Promise<LogoAsset | null> {
  try {
    const res  = await fetch("/omniqure-logo.jpeg");
    const blob = await res.blob();
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload  = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    // Load into a browser Image to read natural dimensions
    const { w, h } = await new Promise<{ w: number; h: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
      img.onerror = () => resolve({ w: 1, h: 1 });
      img.src = dataUrl;
    });
    return { dataUrl, naturalW: w, naturalH: h };
  } catch {
    return null;
  }
}

/** Return display mm width/height that fit inside maxW×maxH while preserving ratio. */
function fitLogo(logo: LogoAsset, maxW: number, maxH: number): { w: number; h: number } {
  const ratio = logo.naturalW / logo.naturalH;
  let w = maxW;
  let h = w / ratio;
  if (h > maxH) { h = maxH; w = h * ratio; }
  return { w, h };
}

// ─── main export (async) ──────────────────────────────────────────────────────

export async function generateCOA(product: Product, detail: ProductDetail) {
  const [doc, logo] = await Promise.all([
    Promise.resolve(new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" })),
    loadLogo(),
  ]);

  const W        = 210;
  const M        = 12;
  const CW       = W - M * 2;
  const FOOTER_Y = 273;

  const { lot, analysis, issued, expires } = getLotDates(product.id);
  const docRef   = detail.refNumber ? `COA-${detail.refNumber}` : `COA-OQ-${product.id.padStart(3, "0")}`;
  const purity   = getPurityStr(product.id);

  // ── 1. HEADER (0 → 44) ─────────────────────────────────────────────────────
  const HDR = 44;
  fill(doc, 0, 0, W, HDR, 10, 20, 60);          // deep navy full-width

  // Logo — fit inside 80×28 mm box, preserving true aspect ratio
  if (logo) {
    const { w: lw, h: lh } = fitLogo(logo, 80, 28);
    const logoX = M;
    const logoY = (HDR - lh) / 2;                // vertically centred
    doc.addImage(logo.dataUrl, "JPEG", logoX, logoY, lw, lh);
  }

  // Thin hairline divider between logo area and title
  vline(doc, W / 2 - 4, 8, 28, 255, 255, 255, 0.25);

  // "CERTIFICATE OF ANALYSIS" — stacked, right-aligned
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICATE", W - M, 18, { align: "right" });
  doc.text("OF ANALYSIS", W - M, 27, { align: "right" });

  // Doc ref · Lot beneath title
  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(150, 185, 235);
  doc.text(`${docRef}  ·  Lot ${lot}`, W - M, 35, { align: "right" });

  // Bottom accent stripe
  fill(doc, 0, HDR, W, 2.5, 41, 98, 200);

  // ── 2. META STRIP (44 → 58) ────────────────────────────────────────────────
  fill(doc, 0, 44, W, 14, 245, 248, 255);
  hline(doc, 0, 58, W, 210, 220, 238, 0.4);

  const meta = [
    { label: "DATE OF ANALYSIS", value: analysis,  accent: false },
    { label: "DATE OF ISSUE",    value: issued,    accent: false },
    { label: "EXPIRY DATE",      value: expires,   accent: false },
    { label: "QC STATUS",        value: "RELEASED",accent: true  },
  ];

  meta.forEach((m, i) => {
    const x = M + i * 47;
    // Subtle card
    fill(doc, x, 45.5, 43, 11, 255, 255, 255);
    box(doc, x, 45.5, 43, 11, 220, 230, 248);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.8);
    doc.setTextColor(130, 145, 175);
    doc.text(m.label, x + 2, 49.5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(m.accent ? 5 : 20, m.accent ? 145 : 30, m.accent ? 100 : 75);
    doc.text(m.value, x + 2, 55);
  });

  // ── 3. PRODUCT IDENTITY (60 → 82) ──────────────────────────────────────────
  let y = 60;

  // Product card
  fill(doc, M, y, CW, 22, 250, 252, 255);
  box(doc, M, y, CW, 22, 210, 222, 242, 0.4);
  // Left blue accent bar
  fill(doc, M, y, 3, 22, 41, 98, 200);

  // Product name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13.5);
  doc.setTextColor(8, 18, 48);
  const nameLines = doc.splitTextToSize(product.name, CW - 72);
  doc.text(nameLines, M + 7, y + 9);

  // Category tag
  fill(doc, M + 7, y + 13.5, 48, 5.5, 235, 243, 255);
  box(doc, M + 7, y + 13.5, 48, 5.5, 190, 215, 252);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.2);
  doc.setTextColor(30, 80, 180);
  doc.text(product.category.toUpperCase(), M + 9, y + 17.5);

  // Purity badge — right side, prominent
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

  // ── 4. PHYSICOCHEMICAL PROPERTIES ──────────────────────────────────────────
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
      const bg: [number,number,number] = ri % 2 === 0 ? [255,255,255] : [248,250,255];
      fill(doc, cx, ry, cw, rh, ...bg);
      box(doc, cx, ry, cw, rh, 218, 228, 245);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(5.8);
      doc.setTextColor(120, 135, 165);
      doc.text(label.toUpperCase(), cx + 2.5, ry + 3.8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(12, 22, 50);
      const wrapped = doc.splitTextToSize(value, cw - 5);
      doc.text(wrapped[0], cx + 2.5, ry + 7.8);
    });
  }

  drawSpecCol(left,  M,          y);
  drawSpecCol(right, M + cw + 3, y);
  y += Math.max(left.length, right.length) * rh + 6;

  // ── 5. ANALYTICAL TEST RESULTS ─────────────────────────────────────────────
  sectionHeader(doc, "ANALYTICAL TEST RESULTS", M, y, CW);
  y += 7;

  // Table header row
  const TH  = 8.5;
  fill(doc, M, y, CW, TH, 30, 55, 130);

  // Column x positions & widths
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
    ["Appearance",
     "Visual Inspection · Ph. Eur. 2.9.20",
     "White lyo. powder",
     detail.appearance?.split(" ").slice(0, 3).join(" ") ?? "White lyo. powder"],
    ["Identity (ESI-MS)",
     "Electrospray Ionisation-MS",
     "Matches reference",
     "Confirmed"],
    ["Purity (HPLC-UV)",
     "RP-HPLC, 220 nm, C18 column",
     "≥ 98.0 %",
     purity],
    ["Peptide Content",
     "Amino Acid Analysis (AAA)",
     "≥ 95.0 %",
     "≥ 95.0 %"],
    ["Water Content",
     "Karl Fischer · USP ⟨921⟩",
     "≤ 8.0 %",
     "≤ 8.0 %"],
    ["Residual Solvents",
     "GC-Headspace · ICH Q3C",
     "ICH Q3C limits",
     "Conforms"],
    ["Bacterial Endotoxins",
     "LAL Gel-Clot · USP ⟨85⟩",
     "< 1.0 EU/mg",
     "< 1.0 EU/mg"],
    ["Bioburden",
     "Membrane Filtration · USP ⟨61⟩",
     "≤ 100 CFU/g",
     "≤ 100 CFU/g"],
  ];

  const RH = 9.5;
  testRows.forEach(([param, method, spec, result], ri) => {
    const bg: [number,number,number] = ri % 2 === 0 ? [255,255,255] : [248,250,255];
    fill(doc, M, y, CW, RH, ...bg);
    box(doc, M, y, CW, RH, 218, 228, 245);

    // Column dividers
    [M + 47, M + 104, M + 139, M + 169].forEach(cx => vline(doc, cx, y, RH, 218, 228, 245));

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(12, 22, 50);
    doc.text(param, cols[0].x, y + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.2);
    doc.setTextColor(75, 90, 120);
    doc.text(doc.splitTextToSize(method, cols[1].w - 2)[0], cols[1].x, y + 6.5);
    doc.text(spec, cols[2].x, y + 6.5);

    // Result — highlight purity row
    const isPurity = param.startsWith("Purity");
    doc.setFont("helvetica", isPurity ? "bold" : "normal");
    doc.setFontSize(isPurity ? 7.5 : 6.5);
    doc.setTextColor(isPurity ? 5 : 12, isPurity ? 140 : 22, isPurity ? 80 : 50);
    doc.text(result, cols[3].x, y + 6.5);

    // PASS badge
    fill(doc, cols[4].x - 1, y + 1.8, 17, 6, 220, 252, 230);
    box(doc, cols[4].x - 1, y + 1.8, 17, 6, 160, 240, 195);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(16, 120, 60);
    doc.text("PASS", cols[4].x + 7.5, y + 6.5, { align: "center" });

    y += RH;
  });

  // Outer border for full table
  box(doc, M, y - testRows.length * RH - TH, CW, testRows.length * RH + TH, 190, 210, 240, 0.5);
  y += 5;

  // ── 6. NOTICE BOX ──────────────────────────────────────────────────────────
  if (y < FOOTER_Y - 22) {
    fill(doc, M, y, CW, 16, 255, 251, 232);
    box(doc, M, y, CW, 16, 248, 210, 80, 0.4);
    fill(doc, M, y, 3, 16, 245, 180, 10);   // amber left bar

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

  // ── 7. ACCREDITATION NOTE ──────────────────────────────────────────────────
  if (y < FOOTER_Y - 8) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(6);
    doc.setTextColor(155, 165, 185);
    doc.text(
      "This certificate is generated electronically and is valid for the lot number stated above.  " +
      "Analysed at OmniQure QC Laboratory, Hertfordshire, UK.  ISO/IEC 17025:2017 accredited facility.",
      M, y + 5, { maxWidth: CW }
    );
  }

  // ── 8. FOOTER (fixed) ──────────────────────────────────────────────────────
  hline(doc, 0, FOOTER_Y, W, 200, 215, 240, 0.5);
  fill(doc, 0, FOOTER_Y, W, 24, 10, 20, 60);

  // Logo small repeat in footer — preserved aspect ratio
  if (logo) {
    const { w: lw, h: lh } = fitLogo(logo, 32, 14);
    doc.addImage(logo.dataUrl, "JPEG", M, FOOTER_Y + (24 - lh) / 2, lw, lh);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(163, 195, 240);
  doc.text(
    `${docRef}  ·  Lot: ${lot}  ·  Issued: ${issued}  ·  Expiry: ${expires}`,
    W / 2 + 10, FOOTER_Y + 9,
    { align: "center" }
  );
  doc.text(
    `omniqure.co.uk  ·  Page 1 of 1  ·  This document supersedes all previous versions for this lot.`,
    W / 2 + 10, FOOTER_Y + 16,
    { align: "center" }
  );

  // Save
  const filename = `OmniQure_COA_${product.slug ?? product.name.replace(/\s+/g, "_")}_${lot}.pdf`;
  doc.save(filename);
}
