import { Resend } from "resend";
import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import { logger } from "./logger";
import { db } from "@workspace/db";
import { emailLogsTable } from "@workspace/db";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      throw new Error("RESEND_API_KEY is not set — email sending is disabled");
    }
    _resend = new Resend(key);
  }
  return _resend;
}

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "OmniQure <orders@omniqure.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? null;
const SITE_URL = process.env.SITE_URL ?? "https://omniqure.com";
const LOGO_URL = `${SITE_URL}/omniqure-email-header.png`;

async function logEmail(opts: {
  toEmail: string;
  subject: string;
  type: string;
  status: "sent" | "failed";
  resendId?: string | null;
  orderNumber?: string | null;
}): Promise<void> {
  try {
    await db.insert(emailLogsTable).values({
      toEmail: opts.toEmail,
      subject: opts.subject,
      type: opts.type,
      status: opts.status,
      resendId: opts.resendId ?? null,
      orderNumber: opts.orderNumber ?? null,
    });
  } catch (err) {
    logger.warn({ err }, "Failed to write email log entry");
  }
}

export interface OrderItem {
  productName: string;
  productCategory: string;
  quantity: number;
  priceGbp: number;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotalGbp: number;
  shippingCostGbp: number;
  totalGbp: number;
  shippingMethod: string | null;
  carrierName?: string | null;
  trackingNumber: string | null;
  trackingUrl?: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
}

export interface WholesaleInvoiceEmailData extends OrderEmailData {
  referenceNumber: string;
  dueDate: string;
  paymentUrl: string;
  customerEmailCc?: string | null;
  description?: string | null;
  invoiceNotes?: string | null;
}

function formatGbp(amount: number): string {
  return `£${amount.toFixed(2)}`;
}

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    })[character] ?? character,
  );
}

function safeHttpsUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password
      ? escapeHtml(url.toString())
      : null;
  } catch {
    return null;
  }
}

function baseTemplate(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(90deg,#142767 0%,#183077 100%);padding:24px 32px;">
              <a href="${SITE_URL}" style="display:inline-block;text-decoration:none;">
                <img src="${LOGO_URL}" alt="OmniQure Peptide Research Institute" width="235" style="display:block;width:235px;max-width:100%;height:auto;border:0;" />
              </a>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${body}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;text-align:center;">
                OmniQure Peptide Research Institute &bull; For research purposes only<br/>
                <a href="${SITE_URL}" style="color:#94a3b8;">omniqure.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function createWholesaleInvoicePdf(invoice: WholesaleInvoiceEmailData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(22).fillColor("#142767").text("OmniQure Wholesale Invoice");
    doc.moveDown(0.5).fontSize(10).fillColor("#475569");
    doc.text(`Reference: ${invoice.referenceNumber}`);
    doc.text(`Order: ${invoice.orderNumber}`);
    doc.text(`Due date: ${invoice.dueDate}`);
    doc.moveDown();
    doc.fontSize(12).fillColor("#0f172a").text(`Bill to: ${invoice.customerName}`);
    doc.fontSize(10).fillColor("#475569").text(invoice.customerEmail);
    doc.moveDown();

    invoice.items.forEach((item) => {
      const lineTotal = item.priceGbp * item.quantity;
      doc.fillColor("#0f172a").fontSize(10).text(
        `${item.productName}  x ${item.quantity}`,
        { continued: true },
      ).text(formatGbp(lineTotal), { align: "right" });
    });
    doc.moveDown();
    doc.fontSize(12).fillColor("#142767").text(`Total: ${formatGbp(invoice.totalGbp)}`, { align: "right" });
    if (invoice.description) {
      doc.moveDown().fontSize(10).fillColor("#475569").text(invoice.description);
    }
    doc.moveDown().fontSize(9).fillColor("#64748b")
      .text("Pay securely using the Pay by Bank link or QR code in the accompanying email.");
    doc.moveDown().fontSize(8).fillColor("#713f12")
      .text("All products are sold strictly for research purposes only. Not for human consumption.");
    doc.end();
  });
}

export async function sendWholesaleInvoice(invoice: WholesaleInvoiceEmailData): Promise<void> {
  const paymentUrl = safeHttpsUrl(invoice.paymentUrl);
  if (!paymentUrl) throw new Error("Wholesale invoice payment URL must be HTTPS");

  const [pdf, qr] = await Promise.all([
    createWholesaleInvoicePdf(invoice),
    QRCode.toBuffer(invoice.paymentUrl, { type: "png", width: 360, margin: 2 }),
  ]);
  const subject = `Wholesale invoice ${invoice.referenceNumber} — ${formatGbp(invoice.totalGbp)}`;
  const description = invoice.description ? `<p style="margin:0 0 20px;color:#475569;">${escapeHtml(invoice.description)}</p>` : "";
  const notes = invoice.invoiceNotes ? `<div style="margin-top:20px;padding:14px;background:#f8fafc;border-radius:6px;color:#475569;font-size:13px;">${escapeHtml(invoice.invoiceNotes)}</div>` : "";
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Wholesale invoice</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">Hi ${escapeHtml(invoice.customerName)}, your OmniQure Pay by Bank invoice is ready.</p>
    ${description}
    <div style="background:#f8fafc;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:600;">REFERENCE</p>
      <p style="margin:4px 0 8px;font-size:20px;font-weight:700;color:#0f172a;">${escapeHtml(invoice.referenceNumber)}</p>
      <p style="margin:0;font-size:13px;color:#475569;">Due ${escapeHtml(invoice.dueDate)}</p>
    </div>
    ${itemsTable(invoice.items)}
    ${totalsBlock(invoice)}
    <div style="margin-top:26px;text-align:center;">
      <a href="${paymentUrl}" style="display:inline-block;background:#142767;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">Pay by Bank</a>
      <p style="margin:18px 0 8px;font-size:12px;color:#64748b;">Or scan this QR code</p>
      <img src="cid:wallid-payment-qr" width="180" height="180" alt="Pay by Bank QR code" style="display:block;margin:0 auto;border:0;" />
    </div>
    ${notes}
    <div style="margin-top:24px;padding:16px;background:#fefce8;border-radius:6px;border-left:4px solid #eab308;">
      <p style="margin:0;font-size:13px;color:#713f12;">All products are sold strictly for research purposes only. Not for human consumption.</p>
    </div>`;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: invoice.customerEmail,
      ...(invoice.customerEmailCc ? { cc: invoice.customerEmailCc } : {}),
      subject,
      html: baseTemplate("Wholesale invoice", body),
      attachments: [
        { filename: `invoice-${invoice.referenceNumber}.pdf`, content: pdf },
        { filename: `payment-qr-${invoice.referenceNumber}.png`, content: qr, contentId: "wallid-payment-qr" },
      ],
    });
    await logEmail({ toEmail: invoice.customerEmail, subject, type: "wholesale_invoice", status: "sent", resendId: result.data?.id, orderNumber: invoice.orderNumber });
  } catch (err) {
    await logEmail({ toEmail: invoice.customerEmail, subject, type: "wholesale_invoice", status: "failed", orderNumber: invoice.orderNumber });
    throw err;
  }
}

function itemsTable(items: OrderItem[]): string {
  const rows = items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;">
        ${item.productName}
        <span style="display:block;font-size:12px;color:#94a3b8;">${item.productCategory}</span>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center;">×${item.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;text-align:right;">${formatGbp(item.priceGbp * item.quantity)}</td>
    </tr>`).join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
      <tr>
        <th style="text-align:left;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">ITEM</th>
        <th style="text-align:center;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">QTY</th>
        <th style="text-align:right;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">PRICE</th>
      </tr>
      ${rows}
    </table>`;
}

function totalsBlock(order: OrderEmailData): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
      <tr>
        <td style="font-size:13px;color:#64748b;padding:4px 0;">Subtotal</td>
        <td style="font-size:13px;color:#64748b;text-align:right;">${formatGbp(order.subtotalGbp)}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:#64748b;padding:4px 0;">Shipping${order.shippingMethod ? ` (${order.shippingMethod})` : ""}</td>
        <td style="font-size:13px;color:#64748b;text-align:right;">${formatGbp(order.shippingCostGbp)}</td>
      </tr>
      <tr>
        <td style="font-size:15px;font-weight:700;color:#0f172a;padding:12px 0 4px;border-top:2px solid #e2e8f0;">Total</td>
        <td style="font-size:15px;font-weight:700;color:#0f172a;text-align:right;padding:12px 0 4px;border-top:2px solid #e2e8f0;">${formatGbp(order.totalGbp)}</td>
      </tr>
    </table>`;
}

// ── Bank Details (keep in sync with CheckoutPage.tsx) ────────────────────────
const BANK_DETAILS = {
  accountName: process.env.BANK_ACCOUNT_NAME ?? "OmniQure Research Ltd",
  sortCode:    process.env.BANK_SORT_CODE     ?? "20-00-00",
  accountNumber: process.env.BANK_ACCOUNT_NUMBER ?? "12345678",
  bank:        process.env.BANK_NAME          ?? "Barclays Bank",
};
// ─────────────────────────────────────────────────────────────────────────────

export async function sendBankTransferInstructions(opts: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalGbp: number;
  items: OrderItem[];
  subtotalGbp: number;
  shippingCostGbp: number;
  shippingMethod: string | null;
}): Promise<void> {
  const subject = `Bank Transfer Details — ${opts.orderNumber}`;
  const detailRows = [
    { label: "Account Name",   value: BANK_DETAILS.accountName },
    { label: "Sort Code",       value: BANK_DETAILS.sortCode },
    { label: "Account Number",  value: BANK_DETAILS.accountNumber },
    { label: "Bank",            value: BANK_DETAILS.bank },
    { label: "Reference",       value: `<strong style="color:#15803d;">${opts.orderNumber}</strong>` },
    { label: "Amount to Pay",   value: `<strong>${formatGbp(opts.totalGbp)}</strong>` },
  ];

  const rows = detailRows.map(r => `
    <tr>
      <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#f8fafc;border-bottom:1px solid #e2e8f0;white-space:nowrap;">${r.label}</td>
      <td style="padding:9px 14px;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${r.value}</td>
    </tr>`).join("");

  const body = `
    <h2 style="margin:0 0 6px;font-size:22px;color:#0f172a;">Bank Transfer Details</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
      Hi ${opts.customerName}, your order <strong style="color:#0f172a;">${opts.orderNumber}</strong> is reserved.
      Please send your payment using the details below to confirm it.
    </p>

    <div style="background:#eff6ff;border:1.5px solid #bfdbfe;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <div style="background:#1240a0;padding:12px 16px;">
        <p style="margin:0;font-size:13px;font-weight:700;color:#fff;letter-spacing:0.04em;">PAYMENT DETAILS</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${rows}
      </table>
    </div>

    <div style="background:#fefce8;border-radius:6px;padding:14px 16px;border-left:4px solid #eab308;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#713f12;">
        <strong>Important:</strong> Use your order number <strong>${opts.orderNumber}</strong> as the payment reference.
        Faster Payments clears the same day. Orders paid after 3pm are dispatched the following morning.
      </p>
    </div>

    ${itemsTable(opts.items)}
    ${totalsBlock({ ...opts, trackingNumber: null, address1: null, address2: null, city: null, postcode: null, country: null, customerEmail: opts.customerEmail })}

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">
      Once we confirm receipt of your payment we will email you a dispatch notification with tracking details.
      If you have any questions please reply to this email.
    </p>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: opts.customerEmail,
      subject,
      html: baseTemplate("Bank Transfer Instructions", body),
    });
    logger.info({ orderNumber: opts.orderNumber, to: opts.customerEmail }, "Bank transfer instructions email sent");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "bank_transfer_instructions", status: "sent", resendId: result.data?.id, orderNumber: opts.orderNumber });
  } catch (err) {
    logger.error({ err, orderNumber: opts.orderNumber }, "Failed to send bank transfer instructions email");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "bank_transfer_instructions", status: "failed", orderNumber: opts.orderNumber });
  }
}

// Wallet addresses — override per currency via env vars, else fall back to hardcoded defaults
const CRYPTO_WALLETS: Record<string, { address: string; network: string; color: string }> = {
  BTC:  { address: process.env.BTC_ADDRESS  ?? "bc1qs92tye4syd4zzeekv62j8yupek9mvzkgfkgz8u",          network: "Bitcoin",       color: "#F7931A" },
  ETH:  { address: process.env.ETH_ADDRESS  ?? "0x612E36A53F95Fb487081bC5316a260262E58878b",           network: "ERC-20 / ETH",  color: "#627EEA" },
  USDT: { address: process.env.USDT_ADDRESS ?? "0x612E36A53F95Fb487081bC5316a260262E58878b",           network: "ERC-20 / ETH",  color: "#26A17B" },
  USDC: { address: process.env.USDC_ADDRESS ?? "0x612E36A53F95Fb487081bC5316a260262E58878b",           network: "ERC-20 / ETH",  color: "#2775CA" },
  SOL:  { address: process.env.SOL_ADDRESS  ?? "E7EXxfoqVc9PMKzeU6xSJdcK2Ur83rKCZymcHQ9r8iNM",       network: "Solana",        color: "#9945FF" },
};

export function getCryptoWallet(currency: string) {
  return CRYPTO_WALLETS[currency.toUpperCase()] ?? CRYPTO_WALLETS["BTC"];
}

export async function sendCryptoInstructions(opts: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalGbp: number;
  currency: string;        // "BTC" | "ETH" | "USDT" | "USDC" | "SOL"
  walletAddress: string;
  network: string;         // e.g. "Bitcoin" | "ERC-20 / ETH" | "Solana"
  accentColor: string;     // hex, used in the email header strip
  cryptoAmount?: string;
  items: OrderItem[];
  subtotalGbp: number;
  shippingCostGbp: number;
  shippingMethod: string | null;
}): Promise<void> {
  const currency = opts.currency.toUpperCase();
  const subject = `${currency} Payment Details — ${opts.orderNumber}`;

  const amountRow = opts.cryptoAmount
    ? `<tr>
         <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#fefce8;border-bottom:1px solid #fde68a;white-space:nowrap;">${currency} Amount</td>
         <td style="padding:9px 14px;font-size:13px;color:#0f172a;font-weight:700;border-bottom:1px solid #fde68a;">${opts.cryptoAmount} ${currency}</td>
       </tr>`
    : `<tr>
         <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#fefce8;border-bottom:1px solid #fde68a;white-space:nowrap;">GBP Amount</td>
         <td style="padding:9px 14px;font-size:13px;color:#0f172a;font-weight:700;border-bottom:1px solid #fde68a;">${formatGbp(opts.totalGbp)} — convert to ${currency} at the current rate</td>
       </tr>`;

  const body = `
    <h2 style="margin:0 0 6px;font-size:22px;color:#0f172a;">${currency} Payment Details</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
      Hi ${opts.customerName}, your order <strong style="color:#0f172a;">${opts.orderNumber}</strong> is reserved.
      Please send your ${currency} payment to the address below to confirm it.
    </p>

    <div style="background:#fefce8;border:1.5px solid #fde68a;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <div style="background:${opts.accentColor};padding:12px 16px;">
        <p style="margin:0;font-size:13px;font-weight:700;color:#fff;letter-spacing:0.04em;">${currency} PAYMENT DETAILS</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#fefce8;border-bottom:1px solid #fde68a;white-space:nowrap;">${currency} Address</td>
          <td style="padding:9px 14px;font-size:12px;color:#0f172a;font-weight:700;font-family:monospace;word-break:break-all;border-bottom:1px solid #fde68a;">${opts.walletAddress}</td>
        </tr>
        <tr>
          <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#fefce8;border-bottom:1px solid #fde68a;white-space:nowrap;">Network</td>
          <td style="padding:9px 14px;font-size:13px;color:#0f172a;border-bottom:1px solid #fde68a;">${opts.network}</td>
        </tr>
        ${amountRow}
        <tr>
          <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#fefce8;white-space:nowrap;">Reference</td>
          <td style="padding:9px 14px;font-size:13px;color:#15803d;font-weight:700;">${opts.orderNumber}</td>
        </tr>
      </table>
    </div>

    <div style="background:#fefce8;border-radius:6px;padding:14px 16px;border-left:4px solid #eab308;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#713f12;">
        Include your order number <strong>${opts.orderNumber}</strong> in the memo/note field where your wallet allows.
        ${currency === "BTC" ? "Transactions typically confirm within 1 hour on the Bitcoin network." :
          currency === "SOL" ? "Solana transactions typically confirm within seconds." :
          "ERC-20 transactions typically confirm within a few minutes depending on network congestion."}
      </p>
    </div>

    ${itemsTable(opts.items)}
    ${totalsBlock({ ...opts, trackingNumber: null, address1: null, address2: null, city: null, postcode: null, country: null, customerEmail: opts.customerEmail })}
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: opts.customerEmail,
      subject,
      html: baseTemplate(`${currency} Payment Instructions`, body),
    });
    logger.info({ orderNumber: opts.orderNumber, to: opts.customerEmail, currency }, "Crypto instructions email sent");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "bitcoin_instructions", status: "sent", resendId: result.data?.id, orderNumber: opts.orderNumber });
  } catch (err) {
    logger.error({ err, orderNumber: opts.orderNumber }, "Failed to send crypto instructions email");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "bitcoin_instructions", status: "failed", orderNumber: opts.orderNumber });
  }
}

export async function sendBitcoinInstructions(opts: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  totalGbp: number;
  btcAddress: string;
  btcAmount?: string;
  items: OrderItem[];
  subtotalGbp: number;
  shippingCostGbp: number;
  shippingMethod: string | null;
}): Promise<void> {
  const subject = `Bitcoin Payment Details — ${opts.orderNumber}`;
  const amountLine = opts.btcAmount
    ? `<tr>
         <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#fefce8;border-bottom:1px solid #fde68a;white-space:nowrap;">BTC Amount</td>
         <td style="padding:9px 14px;font-size:13px;color:#0f172a;font-weight:700;border-bottom:1px solid #fde68a;">${opts.btcAmount} BTC</td>
       </tr>`
    : `<tr>
         <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#fefce8;border-bottom:1px solid #fde68a;white-space:nowrap;">GBP Amount</td>
         <td style="padding:9px 14px;font-size:13px;color:#0f172a;font-weight:700;border-bottom:1px solid #fde68a;">${formatGbp(opts.totalGbp)} — convert to BTC at the current rate</td>
       </tr>`;

  const body = `
    <h2 style="margin:0 0 6px;font-size:22px;color:#0f172a;">Bitcoin Payment Details</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
      Hi ${opts.customerName}, your order <strong style="color:#0f172a;">${opts.orderNumber}</strong> is reserved.
      Please send your Bitcoin payment to the address below to confirm it.
    </p>

    <div style="background:#fffbeb;border:1.5px solid #fde68a;border-radius:8px;overflow:hidden;margin-bottom:24px;">
      <div style="background:#92400e;padding:12px 16px;">
        <p style="margin:0;font-size:13px;font-weight:700;color:#fff;letter-spacing:0.04em;">BITCOIN PAYMENT DETAILS</p>
      </div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#fefce8;border-bottom:1px solid #fde68a;white-space:nowrap;">Bitcoin Address</td>
          <td style="padding:9px 14px;font-size:12px;color:#0f172a;font-weight:700;font-family:monospace;word-break:break-all;border-bottom:1px solid #fde68a;">${opts.btcAddress}</td>
        </tr>
        ${amountLine}
        <tr>
          <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#fefce8;white-space:nowrap;">Reference</td>
          <td style="padding:9px 14px;font-size:13px;color:#15803d;font-weight:700;">${opts.orderNumber}</td>
        </tr>
      </table>
    </div>

    <div style="background:#fefce8;border-radius:6px;padding:14px 16px;border-left:4px solid #eab308;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#713f12;">
        Include your order number <strong>${opts.orderNumber}</strong> in the memo/note field where your wallet allows.
        Transactions typically confirm within 1 hour on the Bitcoin network.
      </p>
    </div>

    ${itemsTable(opts.items)}
    ${totalsBlock({ ...opts, trackingNumber: null, address1: null, address2: null, city: null, postcode: null, country: null, customerEmail: opts.customerEmail })}
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: opts.customerEmail,
      subject,
      html: baseTemplate("Bitcoin Payment Instructions", body),
    });
    logger.info({ orderNumber: opts.orderNumber, to: opts.customerEmail }, "Bitcoin instructions email sent");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "bitcoin_instructions", status: "sent", resendId: result.data?.id, orderNumber: opts.orderNumber });
  } catch (err) {
    logger.error({ err, orderNumber: opts.orderNumber }, "Failed to send bitcoin instructions email");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "bitcoin_instructions", status: "failed", orderNumber: opts.orderNumber });
  }
}

export function generateReceiptHtml(order: OrderEmailData, dateStr?: string): string {
  const date = dateStr ?? new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const itemRows = order.items.map(i => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid #F1F5F9;font-size:13.5px;color:#1E293B;font-weight:500;">${i.productName}<br/><span style="font-size:11.5px;color:#94A3B8;font-weight:400;">${i.productCategory}</span></td>
      <td style="padding:11px 0;border-bottom:1px solid #F1F5F9;font-size:13.5px;color:#64748B;text-align:center;">×${i.quantity}</td>
      <td style="padding:11px 0;border-bottom:1px solid #F1F5F9;font-size:13.5px;color:#1E293B;text-align:right;font-weight:600;">${formatGbp(i.priceGbp)}</td>
      <td style="padding:11px 0;border-bottom:1px solid #F1F5F9;font-size:13.5px;color:#1E293B;text-align:right;font-weight:600;">${formatGbp(i.priceGbp * i.quantity)}</td>
    </tr>`).join("");

  const addressLines = [
    order.customerName,
    order.address1,
    order.address2,
    [order.city, order.postcode].filter(Boolean).join(", "),
    order.country,
  ].filter(Boolean).join("<br/>");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Receipt — ${order.orderNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #F5F8FC; color: #1E293B; }
    .page { max-width: 680px; margin: 40px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 32px rgba(15,23,42,0.10); }
    @media print {
      body { background: #fff; }
      .page { margin: 0; border-radius: 0; box-shadow: none; max-width: 100%; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <div style="background:linear-gradient(90deg,#0D2565 0%,#1240A0 40%,#1B5CB5 75%,#1E68CC 100%);padding:22px 36px;display:flex;align-items:center;justify-content:space-between;">
    <img src="${SITE_URL}/omniqure-logo-full.png" alt="OmniQure" style="height:56px;width:auto;display:block;" />
    <div style="text-align:right;flex-shrink:0;margin-left:24px;">
      <div style="font-size:10.5px;color:rgba(255,255,255,0.55);text-transform:uppercase;letter-spacing:0.1em;font-weight:700;">Receipt</div>
      <div style="font-size:18px;font-weight:800;color:#fff;margin-top:3px;letter-spacing:0.04em;">${order.orderNumber}</div>
      <div style="font-size:12px;color:rgba(255,255,255,0.6);margin-top:3px;">${date}</div>
    </div>
  </div>

  <!-- Paid banner -->
  <div style="background:#ECFDF5;border-bottom:1.5px solid #6EE7B7;padding:12px 36px;display:flex;align-items:center;gap:10px;">
    <div style="width:22px;height:22px;background:#059669;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
      <svg width="13" height="10" viewBox="0 0 13 10" fill="none"><path d="M1.5 5L5 8.5L11.5 1.5" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
    </div>
    <div style="font-size:13px;font-weight:700;color:#065F46;">Payment confirmed — ${formatGbp(order.totalGbp)} received</div>
  </div>

  <!-- Body -->
  <div style="padding:32px 36px;">

    <!-- Items table -->
    <div style="margin-bottom:28px;">
      <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Items Ordered</div>
      <table width="100%" cellpadding="0" cellspacing="0">
        <thead>
          <tr style="border-bottom:2px solid #E2E8F0;">
            <th style="text-align:left;font-size:11px;font-weight:600;color:#94A3B8;padding-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Product</th>
            <th style="text-align:center;font-size:11px;font-weight:600;color:#94A3B8;padding-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Qty</th>
            <th style="text-align:right;font-size:11px;font-weight:600;color:#94A3B8;padding-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Unit Price</th>
            <th style="text-align:right;font-size:11px;font-weight:600;color:#94A3B8;padding-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;">Total</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
      </table>
    </div>

    <!-- Totals + Address row -->
    <div style="display:flex;gap:32px;align-items:flex-start;flex-wrap:wrap;">

      <!-- Totals -->
      <div style="flex:1;min-width:220px;">
        <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Summary</div>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="font-size:13px;color:#64748B;padding:5px 0;">Subtotal</td>
            <td style="font-size:13px;color:#64748B;text-align:right;padding:5px 0;">${formatGbp(order.subtotalGbp)}</td>
          </tr>
          <tr>
            <td style="font-size:13px;color:#64748B;padding:5px 0;">Shipping${order.shippingMethod ? ` (${order.shippingMethod})` : ""}</td>
            <td style="font-size:13px;color:#64748B;text-align:right;padding:5px 0;">${formatGbp(order.shippingCostGbp)}</td>
          </tr>
          <tr>
            <td style="font-size:15px;font-weight:800;color:#0F172A;padding:14px 0 5px;border-top:2px solid #E2E8F0;">Total Paid</td>
            <td style="font-size:15px;font-weight:800;color:#059669;text-align:right;padding:14px 0 5px;border-top:2px solid #E2E8F0;">${formatGbp(order.totalGbp)}</td>
          </tr>
        </table>
        <div style="margin-top:16px;padding:10px 14px;background:#F8FAFF;border-radius:8px;border:1px solid #E2E8F0;">
          <div style="font-size:10.5px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Payment Method</div>
          <div style="font-size:13px;font-weight:600;color:#0F172A;">Open Banking</div>
        </div>
      </div>

      <!-- Ship address -->
      ${addressLines ? `
      <div style="flex:1;min-width:180px;">
        <div style="font-size:11px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:12px;">Shipped To</div>
        <div style="font-size:13px;color:#1E293B;line-height:1.7;">${addressLines}</div>
        ${order.shippingMethod ? `<div style="margin-top:10px;font-size:12px;color:#64748B;">via <strong>${order.shippingMethod}</strong></div>` : ""}
      </div>` : ""}

    </div>

    <!-- RUO disclaimer -->
    <div style="margin-top:28px;padding:14px 16px;background:#FFFBEB;border-radius:8px;border-left:4px solid #F59E0B;">
      <div style="font-size:11.5px;color:#713F12;line-height:1.6;">
        <strong>Research Use Only:</strong> These products are for in-vitro laboratory research exclusively. Not for human or veterinary use. Handle and store in accordance with your institution's safety protocols.
      </div>
    </div>

  </div>

  <!-- Footer -->
  <div style="background:#F8FAFC;border-top:1px solid #E2E8F0;padding:18px 36px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:12px;">
    <div style="font-size:11.5px;color:#94A3B8;">OmniQure Peptide Research Institute &bull; <a href="${SITE_URL}" style="color:#94A3B8;text-decoration:none;">omniqure.com</a></div>
    <button class="no-print" onclick="window.print()" style="font-size:12px;font-weight:700;padding:8px 18px;border-radius:8px;border:1.5px solid #CBD5E1;background:#fff;color:#475569;cursor:pointer;display:flex;align-items:center;gap:6px;">
      ↓ &nbsp;Download / Print
    </button>
  </div>

</div>
</body>
</html>`;
}

export async function sendAccountCreatedEmail(opts: {
  customerName: string;
  customerEmail: string;
  referralCode?: string | null;
  verifyUrl?: string | null;
}): Promise<void> {
  const firstName = opts.customerName.split(" ")[0];
  const subject = `Welcome to OmniQure, ${firstName}!`;
  const body = `
    <h2 style="margin:0 0 6px;font-size:22px;color:#0f172a;">Your account is ready</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
      Hi ${firstName}, welcome to OmniQure Peptide Research Institute.
      Your account has been created and you're ready to start exploring our catalogue.
    </p>

    <div style="background:#f0f9ff;border-radius:8px;padding:18px 22px;margin-bottom:24px;border-left:4px solid #1b5cb5;">
      <p style="margin:0 0 10px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">What's included with your account</p>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${[
          "Order history and tracking in one place",
          "Saved shipping addresses for faster checkout",
          "50 loyalty points added as a welcome bonus",
          "Refer a friend and earn credit on every order they place",
        ].map(s => `<p style="margin:0;font-size:13px;color:#475569;"><span style="color:#1b5cb5;font-weight:700;">✓</span> ${s}</p>`).join("")}
      </div>
    </div>

    ${opts.verifyUrl ? `
    <div style="text-align:center;margin:4px 0 24px;">
      <a href="${opts.verifyUrl}" style="display:inline-block;background:linear-gradient(90deg,#0d2565,#1b5cb5);color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">Verify my email address</a>
      <p style="margin:10px 0 0;font-size:12px;color:#94a3b8;">This link expires in 24 hours. If you didn't create an account, you can ignore this email.</p>
    </div>` : ""}

    ${opts.referralCode ? `
    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:24px;border:1.5px solid #e2e8f0;text-align:center;">
      <p style="margin:0 0 4px;font-size:11px;color:#94a3b8;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;">Your Referral Code</p>
      <p style="margin:0;font-size:22px;font-weight:900;color:#0d2565;letter-spacing:0.12em;">${opts.referralCode}</p>
      <p style="margin:6px 0 0;font-size:12px;color:#64748b;">Share this code — you'll earn credit when a friend places their first order.</p>
    </div>` : ""}

    <div style="margin-top:4px;display:flex;gap:12px;flex-wrap:wrap;">
      <a href="${SITE_URL}/all-peptides" style="display:inline-block;background:#f8fafc;color:#0f172a;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1.5px solid #e2e8f0;">Browse All Peptides</a>
      <a href="${SITE_URL}/account" style="display:inline-block;background:#f8fafc;color:#0f172a;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1.5px solid #e2e8f0;">My Account</a>
    </div>

    <div style="margin-top:24px;padding:16px;background:#fefce8;border-radius:6px;border-left:4px solid #eab308;">
      <p style="margin:0;font-size:13px;color:#713f12;">All products are sold strictly for research purposes only. Not for human consumption.</p>
    </div>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: opts.customerEmail,
      subject,
      html: baseTemplate("Welcome to OmniQure", body),
    });
    logger.info({ to: opts.customerEmail }, "Account created email sent");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "account_created", status: "sent", resendId: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send account created email");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "account_created", status: "failed" });
  }
}

export async function sendOrderConfirmation(order: OrderEmailData): Promise<void> {
  const subject = `Order Confirmed — ${order.orderNumber}`;
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Order Confirmed</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Thank you, ${order.customerName}. We've received your order and will process it shortly.</p>

    <div style="background:#f8fafc;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:600;">ORDER NUMBER</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0f172a;">${order.orderNumber}</p>
    </div>

    ${itemsTable(order.items)}
    ${totalsBlock(order)}

    ${order.address1 ? `
    <div style="margin-top:24px;padding-top:20px;border-top:1px solid #e2e8f0;">
      <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;font-weight:600;">SHIPPING TO</p>
      <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.6;">
        ${order.customerName}<br/>
        ${order.address1}${order.address2 ? `<br/>${order.address2}` : ""}<br/>
        ${[order.city, order.postcode].filter(Boolean).join(", ")}<br/>
        ${order.country ?? ""}
      </p>
    </div>` : ""}

    <div style="margin-top:24px;padding:16px;background:#fefce8;border-radius:6px;border-left:4px solid #eab308;">
      <p style="margin:0;font-size:13px;color:#713f12;">All products are sold strictly for research purposes only. Not for human consumption.</p>
    </div>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: order.customerEmail,
      subject,
      html: baseTemplate("Order Confirmation", body),
    });
    logger.info({ orderNumber: order.orderNumber, to: order.customerEmail }, "Order confirmation email sent");
    await logEmail({ toEmail: order.customerEmail, subject, type: "order_confirmation", status: "sent", resendId: result.data?.id, orderNumber: order.orderNumber });
  } catch (err) {
    logger.error({ err, orderNumber: order.orderNumber }, "Failed to send order confirmation email");
    await logEmail({ toEmail: order.customerEmail, subject, type: "order_confirmation", status: "failed", orderNumber: order.orderNumber });
  }
}

export async function sendShippingNotification(order: OrderEmailData): Promise<void> {
  const subject = `Your Order Has Shipped — ${order.orderNumber}`;
  const trackingUrl = safeHttpsUrl(order.trackingUrl);
  const carrierName = order.carrierName ? escapeHtml(order.carrierName) : null;
  const trackingNumber = order.trackingNumber ? escapeHtml(order.trackingNumber) : null;
  const trackingSection = order.trackingNumber ? `
    <div style="background:#f0fdf4;border-radius:6px;padding:16px 20px;margin:20px 0;border-left:4px solid #22c55e;">
      <p style="margin:0 0 4px;font-size:12px;color:#166534;font-weight:600;">TRACKING NUMBER</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:#15803d;letter-spacing:1px;">${trackingNumber}</p>
      ${carrierName ? `<p style="margin:6px 0 0;font-size:13px;color:#166534;">via ${carrierName}</p>` : ""}
      ${trackingUrl ? `<a href="${trackingUrl}" style="display:inline-block;margin-top:14px;background:#15803d;color:#ffffff;padding:11px 20px;border-radius:7px;text-decoration:none;font-size:14px;font-weight:700;">Track your package</a>` : ""}
    </div>` : `
    <div style="background:#f0fdf4;border-radius:6px;padding:16px 20px;margin:20px 0;border-left:4px solid #22c55e;">
      <p style="margin:0;font-size:14px;color:#166534;">Your order is on its way! Tracking information will be available shortly.</p>
    </div>`;

  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Your Order Is On Its Way</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Good news, ${escapeHtml(order.customerName)} — your order <strong>${escapeHtml(order.orderNumber)}</strong> has been dispatched.</p>

    ${trackingSection}

    ${itemsTable(order.items)}
    ${totalsBlock(order)}

    <div style="margin-top:24px;text-align:center;">
      <a href="${SITE_URL}/account?order=${encodeURIComponent(order.orderNumber)}"
         style="display:inline-block;background:#f8fafc;color:#0f172a;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1.5px solid #e2e8f0;">
        View order in my account
      </a>
    </div>

    <div style="margin-top:24px;padding:16px;background:#fefce8;border-radius:6px;border-left:4px solid #eab308;">
      <p style="margin:0;font-size:13px;color:#713f12;">All products are sold strictly for research purposes only. Not for human consumption.</p>
    </div>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: order.customerEmail,
      subject,
      html: baseTemplate("Order Shipped", body),
    });
    logger.info({ orderNumber: order.orderNumber, to: order.customerEmail }, "Shipping notification email sent");
    await logEmail({ toEmail: order.customerEmail, subject, type: "shipping", status: "sent", resendId: result.data?.id, orderNumber: order.orderNumber });
  } catch (err) {
    logger.error({ err, orderNumber: order.orderNumber }, "Failed to send shipping notification email");
    await logEmail({ toEmail: order.customerEmail, subject, type: "shipping", status: "failed", orderNumber: order.orderNumber });
    throw err;
  }
}

export async function sendDeliveryConfirmation(order: OrderEmailData): Promise<void> {
  const subject = `Order Delivered — ${order.orderNumber}`;

  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Your Order Has Been Delivered</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
      Hi ${order.customerName} — your order <strong style="color:#0f172a;">${order.orderNumber}</strong> has been marked as delivered.
      We hope everything arrived in perfect condition.
    </p>

    <div style="background:#f0fdf4;border-radius:8px;padding:20px 24px;margin-bottom:24px;border-left:4px solid #22c55e;">
      <p style="margin:0 0 4px;font-size:12px;color:#166534;font-weight:600;letter-spacing:0.05em;">DELIVERY STATUS</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:#15803d;">✓ Delivered</p>
      ${order.trackingNumber ? `<p style="margin:6px 0 0;font-size:13px;color:#166534;">Tracking: <strong>${order.trackingNumber}</strong>${order.shippingMethod ? ` via ${order.shippingMethod}` : ""}</p>` : ""}
    </div>

    ${itemsTable(order.items)}
    ${totalsBlock(order)}

    <div style="margin-top:28px;text-align:center;">
      <a href="${SITE_URL}/account"
         style="display:inline-block;background:linear-gradient(90deg,#0d2565,#1b5cb5);color:#ffffff;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;margin-right:12px;">
        View My Orders
      </a>
      <a href="${SITE_URL}/all-peptides"
         style="display:inline-block;background:#f8fafc;color:#0f172a;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1.5px solid #e2e8f0;">
        Shop Again
      </a>
    </div>

    <div style="margin-top:24px;padding:16px;background:#fefce8;border-radius:6px;border-left:4px solid #eab308;">
      <p style="margin:0;font-size:13px;color:#713f12;">
        All products are sold strictly for research purposes only. Not for human consumption.
        If you have any issues with your order please reply to this email.
      </p>
    </div>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: order.customerEmail,
      subject,
      html: baseTemplate("Order Delivered", body),
    });
    logger.info({ orderNumber: order.orderNumber, to: order.customerEmail }, "Delivery confirmation email sent");
    await logEmail({ toEmail: order.customerEmail, subject, type: "delivery_confirmation", status: "sent", resendId: result.data?.id, orderNumber: order.orderNumber });
  } catch (err) {
    logger.error({ err, orderNumber: order.orderNumber }, "Failed to send delivery confirmation email");
    await logEmail({ toEmail: order.customerEmail, subject, type: "delivery_confirmation", status: "failed", orderNumber: order.orderNumber });
  }
}

export async function sendPasswordReset(opts: {
  customerEmail: string;
  customerName: string;
  resetUrl: string;
}): Promise<void> {
  const subject = "Reset your OmniQure password";
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Reset your password</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Hi ${opts.customerName}, we received a request to reset the password for your OmniQure account.</p>

    <div style="text-align:center;margin:28px 0;">
      <a href="${opts.resetUrl}"
         style="display:inline-block;background:linear-gradient(90deg,#0d2565,#1b5cb5);color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:700;">
        Reset password
      </a>
    </div>

    <p style="font-size:13px;color:#64748b;margin:0 0 8px;">Or copy and paste this link into your browser:</p>
    <p style="font-size:12px;color:#1b5cb5;word-break:break-all;margin:0 0 24px;">${opts.resetUrl}</p>

    <div style="background:#fef2f2;border-radius:6px;padding:14px 16px;border-left:4px solid #fca5a5;">
      <p style="margin:0;font-size:13px;color:#991b1b;">
        This link expires in <strong>1 hour</strong>. If you didn't request a password reset, you can safely ignore this email — your password won't change.
      </p>
    </div>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: opts.customerEmail,
      subject,
      html: baseTemplate("Password Reset", body),
    });
    logger.info({ to: opts.customerEmail }, "Password reset email sent");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "password_reset", status: "sent", resendId: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send password reset email");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "password_reset", status: "failed" });
  }
}

export async function sendReturnStatusUpdate(opts: {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  status: "approved" | "rejected" | "refunded";
  refundAmountGbp?: number | null;
  adminNotes?: string | null;
}): Promise<void> {
  const statusConfig = {
    approved: {
      title: "Return Approved",
      heading: "Your Return Has Been Approved",
      colour: "#15803d",
      bg: "#f0fdf4",
      border: "#22c55e",
      message: `Good news, ${opts.customerName} — we've approved your return request for order <strong>${opts.orderNumber}</strong>. Please follow the returns instructions to send your items back, and a refund will be issued once we receive them.`,
    },
    rejected: {
      title: "Return Request Update",
      heading: "Return Request Not Approved",
      colour: "#b91c1c",
      bg: "#fef2f2",
      border: "#fca5a5",
      message: `Hi ${opts.customerName}, unfortunately we were unable to approve your return request for order <strong>${opts.orderNumber}</strong>. If you have any questions, please contact our support team.`,
    },
    refunded: {
      title: "Refund Processed",
      heading: "Your Refund Has Been Processed",
      colour: "#6d28d9",
      bg: "#f5f3ff",
      border: "#a78bfa",
      message: `Hi ${opts.customerName}, your refund for order <strong>${opts.orderNumber}</strong> has been processed and is on its way back to your original payment method. Please allow 3–5 business days for it to appear.`,
    },
  };

  const cfg = statusConfig[opts.status];
  const subject = `${cfg.title} — ${opts.orderNumber}`;

  const refundBlock = opts.status === "refunded" && opts.refundAmountGbp != null
    ? `<div style="background:${cfg.bg};border-radius:6px;padding:16px 20px;margin:20px 0;border-left:4px solid ${cfg.border};">
         <p style="margin:0 0 4px;font-size:12px;color:${cfg.colour};font-weight:600;">REFUND AMOUNT</p>
         <p style="margin:0;font-size:22px;font-weight:700;color:${cfg.colour};">${formatGbp(opts.refundAmountGbp)}</p>
       </div>`
    : "";

  const notesBlock = opts.adminNotes
    ? `<div style="margin-top:16px;padding:14px 16px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0;">
         <p style="margin:0 0 4px;font-size:12px;color:#94a3b8;font-weight:600;">NOTE FROM OUR TEAM</p>
         <p style="margin:0;font-size:14px;color:#374151;">${opts.adminNotes}</p>
       </div>`
    : "";

  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">${cfg.heading}</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">${cfg.message}</p>

    <div style="background:#f8fafc;border-radius:6px;padding:16px 20px;margin-bottom:20px;">
      <p style="margin:0;font-size:12px;color:#94a3b8;font-weight:600;">ORDER NUMBER</p>
      <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#0f172a;">${opts.orderNumber}</p>
    </div>

    ${refundBlock}
    ${notesBlock}

    <div style="margin-top:24px;">
      <a href="${SITE_URL}/account" style="display:inline-block;background:linear-gradient(90deg,#0d2565,#1b5cb5);color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">
        View My Account
      </a>
    </div>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: opts.customerEmail,
      subject,
      html: baseTemplate(cfg.title, body),
    });
    logger.info({ orderNumber: opts.orderNumber, status: opts.status, to: opts.customerEmail }, "Return status email sent");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "return_update", status: "sent", resendId: result.data?.id, orderNumber: opts.orderNumber });
  } catch (err) {
    logger.error({ err, orderNumber: opts.orderNumber }, "Failed to send return status email");
    await logEmail({ toEmail: opts.customerEmail, subject, type: "return_update", status: "failed", orderNumber: opts.orderNumber });
  }
}

export async function sendContactFormSubmission(opts: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const notifyAddress = ADMIN_EMAIL ?? "research@omniqure.com";
  const subject = `Contact Form: ${opts.subject}`;
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">New Contact Form Submission</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Someone submitted the contact form on omniqure.com.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <tr>
        <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#f8fafc;border-bottom:1px solid #e2e8f0;white-space:nowrap;width:100px;">Name</td>
        <td style="padding:9px 14px;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${opts.name}</td>
      </tr>
      <tr>
        <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#f8fafc;border-bottom:1px solid #e2e8f0;white-space:nowrap;">Email</td>
        <td style="padding:9px 14px;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${opts.email}</td>
      </tr>
      <tr>
        <td style="padding:9px 14px;font-size:13px;color:#64748b;font-weight:600;background:#f8fafc;border-bottom:1px solid #e2e8f0;white-space:nowrap;">Subject</td>
        <td style="padding:9px 14px;font-size:13px;color:#0f172a;border-bottom:1px solid #e2e8f0;">${opts.subject}</td>
      </tr>
    </table>

    <div style="background:#f8fafc;border-radius:6px;padding:16px 20px;">
      <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;font-weight:600;">MESSAGE</p>
      <p style="margin:0;font-size:14px;color:#1e293b;line-height:1.7;white-space:pre-wrap;">${opts.message}</p>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">Reply directly to this email to respond to ${opts.name}.</p>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: notifyAddress,
      replyTo: opts.email,
      subject,
      html: baseTemplate("Contact Form Submission", body),
    });
    logger.info({ from: opts.email }, "Contact form submission email sent");
    await logEmail({ toEmail: notifyAddress, subject, type: "contact_form", status: "sent", resendId: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send contact form submission email");
    await logEmail({ toEmail: notifyAddress, subject, type: "contact_form", status: "failed" });
  }
}

export async function sendLowStockAlert(products: Array<{ productName: string; stockLevel: number; lowStockThreshold: number }>): Promise<void> {
  if (!ADMIN_EMAIL) {
    logger.warn("ADMIN_EMAIL not set — skipping low stock alert");
    return;
  }

  const subject = `Low Stock Alert — ${products.length} product${products.length > 1 ? "s" : ""} need attention`;
  const rows = products.map(p => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;">${p.productName}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;text-align:center;color:${p.stockLevel === 0 ? "#ef4444" : "#f97316"};font-weight:700;">${p.stockLevel === 0 ? "OUT OF STOCK" : p.stockLevel}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;text-align:center;color:#94a3b8;">${p.lowStockThreshold}</td>
    </tr>`).join("");

  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Low Stock Alert</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">${products.length} product${products.length > 1 ? "s are" : " is"} running low and may need restocking.</p>

    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <th style="text-align:left;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">PRODUCT</th>
        <th style="text-align:center;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">STOCK</th>
        <th style="text-align:center;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">THRESHOLD</th>
      </tr>
      ${rows}
    </table>

    <div style="margin-top:24px;">
      <a href="${SITE_URL}/admin/products" style="display:inline-block;background:#0f172a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">View Inventory</a>
    </div>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: ADMIN_EMAIL,
      subject,
      html: baseTemplate("Low Stock Alert", body),
    });
    logger.info({ count: products.length }, "Low stock alert email sent");
    await logEmail({ toEmail: ADMIN_EMAIL, subject, type: "low_stock", status: "sent", resendId: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send low stock alert email");
    await logEmail({ toEmail: ADMIN_EMAIL, subject, type: "low_stock", status: "failed" });
  }
}

export interface AbandonedCartItem {
  productName: string;
  quantity: number;
  priceGbp: number;
  imageUrl?: string;
}

export interface AbandonedCartEmailData {
  customerName: string;
  customerEmail: string;
  items: AbandonedCartItem[];
  cartUrl: string;
}

export async function sendAbandonedCartEmail(data: AbandonedCartEmailData): Promise<void> {
  const subject = `${data.customerName.split(" ")[0]}, you left items in your cart`;
  const rows = data.items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;">
        ${item.productName}
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#64748b;text-align:center;">×${item.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;text-align:right;">${formatGbp(item.priceGbp * item.quantity)}</td>
    </tr>`).join("");

  const subtotal = data.items.reduce((sum, i) => sum + i.priceGbp * i.quantity, 0);

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;">You left something behind</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Hi ${data.customerName}, your cart is waiting. Complete your order before items sell out.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;">
      <tr>
        <th style="text-align:left;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">ITEM</th>
        <th style="text-align:center;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">QTY</th>
        <th style="text-align:right;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">PRICE</th>
      </tr>
      ${rows}
      <tr>
        <td colspan="2" style="padding:12px 0 4px;font-size:14px;font-weight:700;color:#0f172a;border-top:2px solid #e2e8f0;">Subtotal</td>
        <td style="padding:12px 0 4px;font-size:14px;font-weight:700;color:#0f172a;text-align:right;border-top:2px solid #e2e8f0;">${formatGbp(subtotal)}</td>
      </tr>
    </table>

    <div style="margin-top:24px;">
      <a href="${data.cartUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:15px;font-weight:600;">Complete My Order</a>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">If you no longer wish to receive these reminders, simply ignore this email — we won't send another one for this cart.</p>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: data.customerEmail,
      subject,
      html: baseTemplate("Your cart is waiting", body),
    });
    logger.info({ email: data.customerEmail }, "Abandoned cart email sent");
    await logEmail({ toEmail: data.customerEmail, subject, type: "abandoned_cart", status: "sent", resendId: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send abandoned cart email");
    await logEmail({ toEmail: data.customerEmail, subject, type: "abandoned_cart", status: "failed" });
  }
}

export interface BackInStockEmailData {
  customerEmail: string;
  customerName: string;
  productName: string;
}

export async function sendBackInStockEmail(data: BackInStockEmailData): Promise<void> {
  const subject = `Back in stock: ${data.productName}`;
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;">Back in Stock</h2>
    <p style="margin:0 0 20px;font-size:14px;color:#64748b;">Hi ${data.customerName}, you asked us to let you know — <strong style="color:#0f172a;">${data.productName}</strong> is back in stock.</p>

    <div style="background:#f0fdf4;border-radius:8px;padding:20px 24px;margin-bottom:24px;border-left:4px solid #22c55e;">
      <p style="margin:0;font-size:14px;color:#15803d;font-weight:600;">${data.productName}</p>
      <p style="margin:6px 0 0;font-size:13px;color:#16a34a;">Now available — limited stock, order soon.</p>
    </div>

    <div style="margin-top:4px;">
      <a href="${SITE_URL}/all-peptides" style="display:inline-block;background:#0f172a;color:#ffffff;padding:13px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Shop Now</a>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">You received this email because you requested a back-in-stock notification. We won't send you another one for this item.</p>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: data.customerEmail,
      subject,
      html: baseTemplate("Back in Stock", body),
    });
    logger.info({ email: data.customerEmail, product: data.productName }, "Back in stock email sent");
    await logEmail({ toEmail: data.customerEmail, subject, type: "back_in_stock", status: "sent", resendId: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send back-in-stock email");
    await logEmail({ toEmail: data.customerEmail, subject, type: "back_in_stock", status: "failed" });
  }
}

export interface ReviewRequestItem {
  productId: number;
  productName: string;
}

export interface ReviewRequestEmailData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  items: ReviewRequestItem[];
}

export async function sendReviewRequestEmail(data: ReviewRequestEmailData): Promise<void> {
  const siteUrl = SITE_URL;
  const subject = `${data.customerName.split(" ")[0]}, how was your order ${data.orderNumber}?`;
  const rows = data.items.map(item => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;font-size:14px;color:#1e293b;">${item.productName}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f1f5f9;text-align:right;">
        <a href="${siteUrl}/product/${item.productId}#reviews" style="display:inline-block;background:#f1f5f9;color:#1e293b;padding:5px 14px;border-radius:20px;text-decoration:none;font-size:12px;font-weight:600;border:1px solid #e2e8f0;">Leave a Review</a>
      </td>
    </tr>`).join("");

  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;color:#0f172a;">How did it go?</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Hi ${data.customerName.split(" ")[0]}, it's been a week since your order <strong>${data.orderNumber}</strong> was delivered. We'd love to hear how your research went.</p>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr>
        <th style="text-align:left;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;">PRODUCT</th>
        <th style="text-align:right;font-size:12px;color:#94a3b8;font-weight:600;padding-bottom:8px;border-bottom:2px solid #e2e8f0;"></th>
      </tr>
      ${rows}
    </table>

    <p style="margin:0;font-size:12px;color:#94a3b8;">Your reviews help other researchers make informed decisions. Thank you for your support.</p>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: data.customerEmail,
      subject,
      html: baseTemplate("Share Your Research Experience", body),
    });
    logger.info({ email: data.customerEmail, orderNumber: data.orderNumber }, "Review request email sent");
    await logEmail({ toEmail: data.customerEmail, subject, type: "review_request", status: "sent", resendId: result.data?.id, orderNumber: data.orderNumber });
  } catch (err) {
    logger.error({ err }, "Failed to send review request email");
    await logEmail({ toEmail: data.customerEmail, subject, type: "review_request", status: "failed", orderNumber: data.orderNumber });
  }
}

export async function sendReferralReward(data: {
  referrerName: string;
  referrerEmail: string;
  refereeName: string;
}): Promise<void> {
  const subject = `You've earned £25 credit — ${data.refereeName} just ordered!`;
  const body = `
    <h2 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a;">You've earned £25 credit!</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">
      Hi ${data.referrerName}, <strong>${data.refereeName}</strong> just placed their first order using your referral link. We've added £25 credit to your account as a thank you.
    </p>

    <div style="background:#f0fdf4;border-radius:8px;padding:20px 24px;margin-bottom:24px;border-left:4px solid #22c55e;">
      <p style="margin:0 0 4px;font-size:12px;color:#166534;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Your Reward</p>
      <p style="margin:0;font-size:28px;font-weight:800;color:#15803d;">+£25 Credit</p>
      <p style="margin:8px 0 0;font-size:13px;color:#166534;">Redeem it at checkout on your next order (credit balance capped at £50).</p>
    </div>

    <div style="margin-top:4px;">
      <a href="${SITE_URL}/all-peptides" style="display:inline-block;background:#0f172a;color:#ffffff;padding:13px 30px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600;">Shop Now & Redeem</a>
    </div>

    <p style="margin:24px 0 0;font-size:12px;color:#94a3b8;">Referral credit never expires. Keep sharing your referral link — you and your friend both earn £25 credit for every friend who orders (up to £50 balance)!</p>
  `;

  try {
    const result = await getResend().emails.send({
      from: FROM_ADDRESS,
      to: data.referrerEmail,
      subject,
      html: baseTemplate("Referral Reward", body),
    });
    logger.info({ to: data.referrerEmail }, "Referral reward email sent");
    await logEmail({ toEmail: data.referrerEmail, subject, type: "referral_reward", status: "sent", resendId: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send referral reward email");
    await logEmail({ toEmail: data.referrerEmail, subject, type: "referral_reward", status: "failed" });
  }
}

export interface WelcomeEmailData {
  customerName: string;
  customerEmail: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const subject = `Welcome to OmniQure, ${data.customerName.split(" ")[0]}!`;
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Welcome to OmniQure</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Thank you for your first order, ${data.customerName.split(" ")[0]}. Your research peptides are being prepared with the care and precision you expect from a premium supplier.</p>

    <div style="background:#f8fafc;border-radius:8px;padding:18px 22px;margin-bottom:24px;border-left:4px solid #1b5cb5;">
      <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Our Quality Promise</p>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${["99%+ purity on every batch — independently verified", "Stored and shipped in cold-chain insulated packaging", "Janoshik reports published where available"].map(s => `<p style="margin:0;font-size:13px;color:#475569;"><span style="color:#22c55e;font-weight:700;">✓</span> ${s}</p>`).join("")}
      </div>
    </div>

    <div style="margin-top:24px;display:flex;gap:12px;flex-wrap:wrap;">
      <a href="${SITE_URL}/all-peptides" style="display:inline-block;background:linear-gradient(90deg,#0d2565,#1b5cb5);color:#ffffff;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">Browse All Peptides</a>
      <a href="${SITE_URL}/lab-results" style="display:inline-block;background:#f8fafc;color:#0f172a;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;border:1.5px solid #e2e8f0;">View Lab Results</a>
    </div>

    <div style="margin-top:24px;padding:16px;background:#fefce8;border-radius:6px;border-left:4px solid #eab308;">
      <p style="margin:0;font-size:13px;color:#713f12;">All products are sold strictly for research purposes only. Not for human consumption.</p>
    </div>
  `;

  try {
    const result = await getResend().emails.send({ from: FROM_ADDRESS, to: data.customerEmail, subject, html: baseTemplate("Welcome to OmniQure", body) });
    logger.info({ to: data.customerEmail }, "Welcome email sent");
    await logEmail({ toEmail: data.customerEmail, subject, type: "welcome", status: "sent", resendId: result.data?.id });
  } catch (err) {
    logger.error({ err }, "Failed to send welcome email");
    await logEmail({ toEmail: data.customerEmail, subject, type: "welcome", status: "failed" });
  }
}

export interface NewsletterBroadcastData {
  subject: string;
  htmlBody: string;
  subscribers: Array<{ email: string; firstName?: string; unsubscribeUrl: string }>;
}

export async function sendNewsletterBroadcast(data: NewsletterBroadcastData): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;
  for (const sub of data.subscribers) {
    const personalised = data.htmlBody
      .replace(/\{\{firstName\}\}/g, sub.firstName ?? "Researcher")
      .replace(/\{\{unsubscribeUrl\}\}/g, sub.unsubscribeUrl);
    const withFooter = personalised + `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;text-align:center;"><p style="font-size:11px;color:#94a3b8;">You're receiving this because you subscribed to the OmniQure newsletter. <a href="${sub.unsubscribeUrl}" style="color:#94a3b8;">Unsubscribe</a></p></div>`;
    try {
      await getResend().emails.send({ from: FROM_ADDRESS, to: sub.email, subject: data.subject, html: baseTemplate(data.subject, withFooter) });
      await logEmail({ toEmail: sub.email, subject: data.subject, type: "newsletter", status: "sent" });
      sent++;
    } catch {
      await logEmail({ toEmail: sub.email, subject: data.subject, type: "newsletter", status: "failed" });
      failed++;
    }
  }
  return { sent, failed };
}

export interface ReorderReminderData {
  customerName: string;
  customerEmail: string;
  orderNumber: string;
  items: Array<{ productName: string; productId?: number }>;
}

export async function sendReorderReminder(data: ReorderReminderData): Promise<void> {
  const subject = `${data.customerName.split(" ")[0]}, is your research supply running low?`;
  const itemList = data.items.map(i => `<li style="padding:4px 0;font-size:14px;color:#1e293b;">${i.productName}</li>`).join("");
  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Running Low on Research Supplies?</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Hi ${data.customerName.split(" ")[0]}, it's been about a month since your last order. Here's what you ordered — ready to restock?</p>

    <div style="background:#f8fafc;border-radius:8px;padding:16px 20px;margin-bottom:24px;border:1px solid #e2e8f0;">
      <p style="margin:0 0 10px;font-size:12px;color:#94a3b8;font-weight:600;text-transform:uppercase;">From Order ${data.orderNumber}</p>
      <ul style="margin:0;padding:0 0 0 18px;">${itemList}</ul>
    </div>

    <div style="margin-top:4px;">
      <a href="${SITE_URL}/all-peptides" style="display:inline-block;background:linear-gradient(90deg,#0d2565,#1b5cb5);color:#ffffff;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:700;">Reorder Now</a>
    </div>

    <div style="margin-top:24px;padding:16px;background:#fefce8;border-radius:6px;border-left:4px solid #eab308;">
      <p style="margin:0;font-size:13px;color:#713f12;">All products are sold strictly for research purposes only. Not for human consumption.</p>
    </div>
  `;

  try {
    const result = await getResend().emails.send({ from: FROM_ADDRESS, to: data.customerEmail, subject, html: baseTemplate("Reorder Reminder", body) });
    logger.info({ to: data.customerEmail, order: data.orderNumber }, "Reorder reminder sent");
    await logEmail({ toEmail: data.customerEmail, subject, type: "reorder_reminder", status: "sent", resendId: result.data?.id, orderNumber: data.orderNumber });
  } catch (err) {
    logger.error({ err }, "Failed to send reorder reminder");
    await logEmail({ toEmail: data.customerEmail, subject, type: "reorder_reminder", status: "failed", orderNumber: data.orderNumber });
  }
}

