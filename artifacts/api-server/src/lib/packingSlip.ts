import type { ordersTable, orderItemsTable } from "@workspace/db";

const SITE_URL = process.env.SITE_URL ?? "https://omniqure.com";

type Order = typeof ordersTable.$inferSelect;
type Item  = typeof orderItemsTable.$inferSelect;

function esc(s: unknown): string {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmt(gbp: unknown): string {
  const n = parseFloat(String(gbp));
  return isNaN(n) ? "—" : `£${n.toFixed(2)}`;
}

function fmtDate(d: Date | string): string {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric",
  });
}

function addressLines(o: Order): string {
  return [o.address1, o.address2, o.city, o.county, o.postcode, o.country]
    .filter(Boolean)
    .map(esc)
    .join("<br>");
}

function itemRows(items: Item[]): string {
  return items.map(i => `
    <tr>
      <td class="name">${esc(i.productName)}</td>
      <td class="cat">${esc(i.productCategory ?? "")}</td>
      <td class="qty">${i.quantity}</td>
      <td class="price">${fmt(i.priceGbp)}</td>
      <td class="line">${fmt(parseFloat(String(i.priceGbp)) * i.quantity)}</td>
    </tr>`).join("");
}

export function generatePackingSlipHtml(order: Order, items: Item[]): string {
  const subtotal = items.reduce((s, i) => s + parseFloat(String(i.priceGbp)) * i.quantity, 0);
  const shipping  = parseFloat(String(order.shippingCostGbp));
  const total     = parseFloat(String(order.totalGbp));

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Packing Slip — ${esc(order.orderNumber)}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  @page { size: A4; margin: 14mm; }
  body { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 12px; color: #111; background: #fff; }

  .slip { max-width: 720px; margin: 0 auto; padding: 24px 0; }

  /* ── Header ── */
  .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 2px solid #111; margin-bottom: 20px; }
  .brand-logo { display: block; width: 190px; height: auto; }
  .slip-title { text-align: right; }
  .slip-title h1 { font-size: 18px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
  .slip-title p  { font-size: 11px; color: #555; margin-top: 3px; }

  /* ── Meta row ── */
  .meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .meta-box h3  { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #777; margin-bottom: 6px; }
  .meta-box p   { font-size: 12px; line-height: 1.5; }
  .meta-box .big { font-size: 14px; font-weight: 700; }

  /* ── Ship-to ── */
  .ship-to { background: #f6f6f4; border-radius: 6px; padding: 14px 16px; margin-bottom: 20px; }
  .ship-to h3 { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #777; margin-bottom: 8px; }
  .ship-to p  { font-size: 13px; font-weight: 600; margin-bottom: 4px; }
  .ship-to address { font-style: normal; font-size: 12px; line-height: 1.6; }

  /* ── Items table ── */
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  thead th { background: #111; color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 8px 10px; text-align: left; }
  tbody tr:nth-child(even) { background: #f9f9f7; }
  tbody td { padding: 8px 10px; font-size: 12px; border-bottom: 1px solid #e8e8e4; vertical-align: middle; }
  td.qty, td.price, td.line { text-align: right; }
  td.qty { width: 48px; }
  td.price, td.line { width: 80px; }
  td.cat  { color: #666; font-size: 11px; width: 120px; }

  /* ── Totals ── */
  .totals { display: flex; justify-content: flex-end; margin-bottom: 20px; }
  .totals-box { width: 240px; }
  .totals-row { display: flex; justify-content: space-between; padding: 5px 0; font-size: 12px; border-bottom: 1px solid #e8e8e4; }
  .totals-row:last-child { border-bottom: none; font-weight: 700; font-size: 14px; padding-top: 8px; }

  /* ── Notes ── */
  .notes { border: 1px solid #e0e0da; border-radius: 6px; padding: 12px 14px; margin-bottom: 20px; }
  .notes h3 { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #777; margin-bottom: 6px; }
  .notes p  { font-size: 12px; line-height: 1.5; white-space: pre-wrap; }

  /* ── Footer ── */
  .footer { border-top: 1px solid #ddd; padding-top: 12px; display: flex; justify-content: space-between; font-size: 10px; color: #999; }

  @media print {
    .slip { padding: 0; }
    body  { font-size: 11px; }
  }
</style>
</head>
<body>
<div class="slip">

  <div class="header">
    <img class="brand-logo" src="${SITE_URL}/omniqure-wordmark-blue.png" alt="OmniQure">
    <div class="slip-title">
      <h1>Packing Slip</h1>
      <p>Printed ${fmtDate(new Date())}</p>
    </div>
  </div>

  <div class="meta">
    <div class="meta-box">
      <h3>Order</h3>
      <p class="big">${esc(order.orderNumber)}</p>
      <p style="color:#666; margin-top:3px;">${fmtDate(order.createdAt)}</p>
    </div>
    <div class="meta-box">
      <h3>Shipping Method</h3>
      <p>${esc(order.shippingMethod ?? "Standard")}</p>
    </div>
    <div class="meta-box">
      <h3>Items</h3>
      <p class="big">${items.reduce((s, i) => s + i.quantity, 0)}</p>
    </div>
  </div>

  <div class="ship-to">
    <h3>Ship To</h3>
    <p>${esc(order.customerName)}</p>
    <address>${addressLines(order)}</address>
    ${order.phone ? `<p style="margin-top:6px; font-size:11px; color:#555;">📞 ${esc(order.phone)}</p>` : ""}
  </div>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th>Category</th>
        <th style="text-align:right">Qty</th>
        <th style="text-align:right">Unit</th>
        <th style="text-align:right">Line Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemRows(items)}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-box">
      <div class="totals-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>
      <div class="totals-row"><span>Shipping</span><span>${fmt(shipping)}</span></div>
      <div class="totals-row"><span>Total</span><span>${fmt(total)}</span></div>
    </div>
  </div>

  ${order.notes ? `
  <div class="notes">
    <h3>Order Notes</h3>
    <p>${esc(order.notes)}</p>
  </div>` : ""}

  <div class="footer">
    <span>OmniQure — omniqure.com</span>
    <span>${esc(order.orderNumber)}</span>
  </div>

</div>
<script>window.onload = () => window.print();</script>
</body>
</html>`;
}

/** Concatenate multiple packing slips into one printable document (page-break between each). */
export function generateMultiPackingSlipHtml(
  orders: Array<{ order: Order; items: Item[] }>,
): string {
  if (orders.length === 0) return "<html><body><p>No orders selected.</p></body></html>";

  // Reuse single-slip generator, strip the outer HTML scaffolding and stitch
  const slipBodies = orders.map(({ order, items }, idx) => {
    const html = generatePackingSlipHtml(order, items);
    // Extract everything inside <body>…</body>
    const bodyMatch = html.match(/<body>([\s\S]*)<\/body>/i);
    const inner = bodyMatch ? bodyMatch[1].replace(/<script[\s\S]*?<\/script>/gi, "") : "";
    const pageBreak = idx < orders.length - 1 ? 'style="page-break-after:always"' : "";
    return `<div class="slip-wrap" ${pageBreak}>${inner}</div>`;
  });

  const firstSlip = generatePackingSlipHtml(orders[0].order, orders[0].items);
  const headMatch  = firstSlip.match(/<head>([\s\S]*)<\/head>/i);
  const headInner  = headMatch ? headMatch[1] : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>${headInner}</head>
<body>
${slipBodies.join("\n")}
<script>window.onload = () => window.print();</script>
</body>
</html>`;
}
