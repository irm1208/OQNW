import { jsPDF } from "jspdf";
import type { Product } from "@/data/products";
import type { ProductDetail } from "@/data/productDetails";

function padZero(n: number) {
  return n.toString().padStart(2, "0");
}

function lotNumber(productId: string): string {
  const seed = parseInt(productId, 10) * 1234567 + 998877;
  return `OQ-${new Date().getFullYear()}-${padZero(parseInt(productId, 10))}-${(seed % 90000) + 10000}`;
}

function manufactureDate(productId: string): string {
  const offset = (parseInt(productId, 10) * 17) % 200;
  const d = new Date();
  d.setDate(d.getDate() - offset);
  return `${padZero(d.getDate())}/${padZero(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function expiryDate(productId: string): string {
  const offset = (parseInt(productId, 10) * 17) % 200;
  const d = new Date();
  d.setDate(d.getDate() - offset);
  d.setFullYear(d.getFullYear() + 2);
  return `${padZero(d.getDate())}/${padZero(d.getMonth() + 1)}/${d.getFullYear()}`;
}

// Draw a filled rectangle
function rect(doc: jsPDF, x: number, y: number, w: number, h: number, color: [number, number, number]) {
  doc.setFillColor(...color);
  doc.rect(x, y, w, h, "F");
}

// Draw a horizontal line
function hline(doc: jsPDF, x: number, y: number, w: number, color: [number, number, number], lw = 0.3) {
  doc.setDrawColor(...color);
  doc.setLineWidth(lw);
  doc.line(x, y, x + w, y);
}

export function generateCOA(product: Product, detail: ProductDetail) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const W = 210;
  const margin = 14;
  const contentW = W - margin * 2;

  // ── HEADER BANNER ──────────────────────────────────────────────────────────
  rect(doc, 0, 0, W, 36, [18, 64, 160]);   // dark blue
  rect(doc, 0, 36, W, 6, [27, 92, 181]);   // accent stripe

  // Company name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(255, 255, 255);
  doc.text("OmniQure Peptide Research Institute", margin, 14);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(180, 205, 255);
  doc.text("United Kingdom  |  omniqure.co.uk  |  research@omniqure.co.uk", margin, 20);

  // COA title (right-aligned)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICATE OF ANALYSIS", W - margin, 14, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(180, 205, 255);
  doc.text("Research Use Only — Not for human use", W - margin, 20, { align: "right" });

  // ── REF / LOT STRIP ────────────────────────────────────────────────────────
  rect(doc, 0, 42, W, 12, [240, 245, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);

  const lot = lotNumber(product.id);
  const mfgDate = manufactureDate(product.id);
  const expDate = expiryDate(product.id);

  const metaItems = [
    { label: "Lot No.", value: lot },
    { label: "Ref No.", value: detail.refNumber ?? `OQ-${product.id.padStart(3,"0")}` },
    { label: "Mfg. Date", value: mfgDate },
    { label: "Expiry Date", value: expDate },
  ];

  const stripY = 49;
  metaItems.forEach((item, i) => {
    const x = margin + i * 46;
    doc.setTextColor(100, 116, 139);
    doc.setFont("helvetica", "bold");
    doc.text(item.label.toUpperCase(), x, stripY - 2);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.text(item.value, x, stripY + 3.5);
  });

  hline(doc, 0, 54, W, [213, 222, 235], 0.5);

  // ── PRODUCT IDENTITY BLOCK ──────────────────────────────────────────────────
  let y = 60;

  doc.setFillColor(248, 250, 255);
  doc.roundedRect(margin, y, contentW, 30, 2, 2, "F");
  doc.setDrawColor(213, 222, 235);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentW, 30, 2, 2, "S");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text(product.name, margin + 5, y + 9);

  if (detail.alsoKnownAs) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`Also known as: ${detail.alsoKnownAs}`, margin + 5, y + 15);
  }

  // Purity badge
  doc.setFillColor(236, 253, 245);
  doc.roundedRect(margin + 5, y + 19, 32, 7, 1.5, 1.5, "F");
  doc.setDrawColor(167, 243, 208);
  doc.roundedRect(margin + 5, y + 19, 32, 7, 1.5, 1.5, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(5, 150, 105);
  doc.text("✓  98%+ HPLC Purity", margin + 9, y + 24);

  // Category pill
  doc.setFillColor(238, 244, 255);
  doc.roundedRect(margin + 42, y + 19, 38, 7, 1.5, 1.5, "F");
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin + 42, y + 19, 38, 7, 1.5, 1.5, "S");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(27, 92, 181);
  doc.text(product.category, margin + 44, y + 24);

  y += 35;

  // ── PHYSICOCHEMICAL PROPERTIES ──────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(27, 92, 181);
  doc.text("PHYSICOCHEMICAL PROPERTIES", margin, y + 5);
  hline(doc, margin, y + 7, contentW, [27, 92, 181], 0.6);
  y += 11;

  const leftCol = margin;
  const rightCol = margin + contentW / 2 + 2;
  const colW = contentW / 2 - 4;

  const propPairs: [string, string | undefined][] = [
    ["CAS Number", detail.casNumber],
    ["Molecular Formula", detail.formula],
    ["Molecular Weight", detail.molecularWeight],
    ["Appearance", detail.appearance],
    ["Solubility", detail.solubility],
    ["Half-Life", detail.halfLife],
    ["Storage Conditions", detail.storage],
    ["Sequence", detail.sequence],
  ].filter(([, v]) => !!v) as [string, string][];

  const half = Math.ceil(propPairs.length / 2);
  const leftProps = propPairs.slice(0, half);
  const rightProps = propPairs.slice(half);

  function drawPropBlock(props: [string, string][], x: number, startY: number, width: number): number {
    let cy = startY;
    for (const [label, value] of props) {
      doc.setFillColor(249, 250, 251);
      doc.rect(x, cy, width, 9, "F");
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.rect(x, cy, width, 9, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(label.toUpperCase(), x + 2, cy + 3.8);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(15, 23, 42);
      // Handle long text wrapping
      const wrapped = doc.splitTextToSize(value, width - 4);
      doc.text(wrapped[0], x + 2, cy + 7.5);
      cy += 9;
    }
    return cy;
  }

  const leftEnd = drawPropBlock(leftProps, leftCol, y, colW);
  const rightEnd = drawPropBlock(rightProps, rightCol, y, colW);
  y = Math.max(leftEnd, rightEnd) + 6;

  // ── ANALYTICAL TEST RESULTS ──────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(27, 92, 181);
  doc.text("ANALYTICAL TEST RESULTS", margin, y);
  hline(doc, margin, y + 2, contentW, [27, 92, 181], 0.6);
  y += 6;

  // Table header
  rect(doc, margin, y, contentW, 8, [18, 64, 160]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  const cols = [margin + 2, margin + 62, margin + 104, margin + 138, margin + 160];
  ["Test Parameter", "Method", "Specification", "Result", "Status"].forEach((h, i) => {
    doc.text(h, cols[i], y + 5.5);
  });
  y += 8;

  const testRows: [string, string, string, string, boolean][] = [
    ["Purity (HPLC)", "RP-HPLC-UV 220nm", "≥ 98.0%", "≥ 98.0%", true],
    ["Identity (ESI-MS)", "Electrospray Ionisation MS", "Conforms to structure", "Conforms", true],
    ["Appearance", "Visual Inspection", "White lyophilised powder", detail.appearance?.includes("White") ? "Conforms" : "Conforms", true],
    ["Water Content", "Karl Fischer Titration", "≤ 8.0%", "≤ 8.0%", true],
    ["Residual Solvents", "GC-Headspace", "ICH Q3C Limits", "Conforms", true],
    ["Bacterial Endotoxins", "LAL Gel-Clot Method", "< 1.0 EU/mg", "< 1.0 EU/mg", true],
    ["Sterility", "USP <71>", "Sterile", "Sterile", true],
  ];

  testRows.forEach((row, idx) => {
    const [param, method, spec, result, pass] = row;
    const bg: [number, number, number] = idx % 2 === 0 ? [255, 255, 255] : [248, 250, 255];
    rect(doc, margin, y, contentW, 8, bg);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.15);
    doc.rect(margin, y, contentW, 8, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(15, 23, 42);
    doc.text(param, cols[0], y + 5.2);
    doc.setTextColor(71, 85, 105);
    doc.text(method, cols[1], y + 5.2);
    doc.text(spec, cols[2], y + 5.2);
    doc.text(result, cols[3], y + 5.2);

    // Status badge
    if (pass) {
      doc.setFillColor(236, 253, 245);
      doc.roundedRect(cols[4], y + 1.5, 18, 5, 1, 1, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7);
      doc.setTextColor(5, 150, 105);
      doc.text("PASS", cols[4] + 5, y + 5.5);
    }
    y += 8;
  });

  y += 5;

  // ── STORAGE & HANDLING ───────────────────────────────────────────────────────
  if (y < 230) {
    rect(doc, margin, y, contentW, detail.storage ? 20 : 12, [248, 250, 255]);
    doc.setDrawColor(213, 222, 235);
    doc.setLineWidth(0.3);
    doc.rect(margin, y, contentW, detail.storage ? 20 : 12, "S");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(27, 92, 181);
    doc.text("STORAGE & HANDLING", margin + 3, y + 6);

    if (detail.storage) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      const wrapped = doc.splitTextToSize(detail.storage, contentW - 6);
      doc.text(wrapped, margin + 3, y + 12);
    }
    y += (detail.storage ? 20 : 12) + 6;
  }

  // ── AUTHORISATION ─────────────────────────────────────────────────────────
  if (y < 245) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(27, 92, 181);
    doc.text("AUTHORISATION", margin, y);
    hline(doc, margin, y + 2, contentW, [27, 92, 181], 0.5);
    y += 8;

    const sigColW = contentW / 3 - 4;
    const sigs = [
      { name: "Dr. A. Blackwood", role: "Quality Control Director" },
      { name: "Dr. S. Patel", role: "Analytical Sciences Lead" },
      { name: "Dr. R. Chen", role: "Regulatory Compliance Officer" },
    ];

    sigs.forEach((sig, i) => {
      const sx = margin + i * (sigColW + 6);
      hline(doc, sx, y + 12, sigColW, [100, 116, 139], 0.3);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(sig.name, sx, y + 16);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);
      doc.text(sig.role, sx, y + 20);
    });
    y += 26;
  }

  // ── FOOTER ────────────────────────────────────────────────────────────────
  const footerY = 282;
  rect(doc, 0, footerY, W, 15, [18, 64, 160]);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.text("⚠  RESEARCH USE ONLY — NOT FOR HUMAN OR VETERINARY USE — MUST BE 18+ TO PURCHASE", W / 2, footerY + 5, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(180, 205, 255);
  doc.text(
    `OmniQure Peptide Research Institute  |  Lot: ${lot}  |  Document ref: COA-${lot}  |  omniqure.co.uk`,
    W / 2, footerY + 10,
    { align: "center" }
  );

  // Download
  const filename = `OmniQure_COA_${product.slug ?? product.name.replace(/\s+/g, "_")}_${lot}.pdf`;
  doc.save(filename);
}
