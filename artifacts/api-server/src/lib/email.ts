import { Resend } from "resend";
import { logger } from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_ADDRESS = process.env.EMAIL_FROM ?? "OmniQure <orders@omniqure.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? null;
const SITE_URL = process.env.SITE_URL ?? "https://omniqure.com";

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
  trackingNumber: string | null;
  address1: string | null;
  address2: string | null;
  city: string | null;
  postcode: string | null;
  country: string | null;
}

function formatGbp(amount: number): string {
  return `£${amount.toFixed(2)}`;
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
            <td style="background:#0f172a;padding:24px 32px;">
              <p style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:-0.5px;">OmniQure</p>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:12px;">Peptide Sciences</p>
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
                OmniQure Peptide Sciences &bull; For research purposes only<br/>
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

export async function sendOrderConfirmation(order: OrderEmailData): Promise<void> {
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
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: order.customerEmail,
      subject: `Order Confirmed — ${order.orderNumber}`,
      html: baseTemplate("Order Confirmation", body),
    });
    logger.info({ orderNumber: order.orderNumber, to: order.customerEmail }, "Order confirmation email sent");
  } catch (err) {
    logger.error({ err, orderNumber: order.orderNumber }, "Failed to send order confirmation email");
  }
}

export async function sendShippingNotification(order: OrderEmailData): Promise<void> {
  const trackingSection = order.trackingNumber ? `
    <div style="background:#f0fdf4;border-radius:6px;padding:16px 20px;margin:20px 0;border-left:4px solid #22c55e;">
      <p style="margin:0 0 4px;font-size:12px;color:#166534;font-weight:600;">TRACKING NUMBER</p>
      <p style="margin:0;font-size:18px;font-weight:700;color:#15803d;letter-spacing:1px;">${order.trackingNumber}</p>
      ${order.shippingMethod ? `<p style="margin:6px 0 0;font-size:13px;color:#166534;">via ${order.shippingMethod}</p>` : ""}
    </div>` : `
    <div style="background:#f0fdf4;border-radius:6px;padding:16px 20px;margin:20px 0;border-left:4px solid #22c55e;">
      <p style="margin:0;font-size:14px;color:#166534;">Your order is on its way! Tracking information will be available shortly.</p>
    </div>`;

  const body = `
    <h2 style="margin:0 0 4px;font-size:22px;color:#0f172a;">Your Order Is On Its Way</h2>
    <p style="margin:0 0 24px;font-size:14px;color:#64748b;">Good news, ${order.customerName} — your order <strong>${order.orderNumber}</strong> has been dispatched.</p>

    ${trackingSection}

    ${itemsTable(order.items)}
    ${totalsBlock(order)}

    <div style="margin-top:24px;padding:16px;background:#fefce8;border-radius:6px;border-left:4px solid #eab308;">
      <p style="margin:0;font-size:13px;color:#713f12;">All products are sold strictly for research purposes only. Not for human consumption.</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: order.customerEmail,
      subject: `Your Order Has Shipped — ${order.orderNumber}`,
      html: baseTemplate("Order Shipped", body),
    });
    logger.info({ orderNumber: order.orderNumber, to: order.customerEmail }, "Shipping notification email sent");
  } catch (err) {
    logger.error({ err, orderNumber: order.orderNumber }, "Failed to send shipping notification email");
  }
}

export async function sendPasswordReset(opts: {
  customerEmail: string;
  customerName: string;
  resetUrl: string;
}): Promise<void> {
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
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: opts.customerEmail,
      subject: "Reset your OmniQure password",
      html: baseTemplate("Password Reset", body),
    });
    logger.info({ to: opts.customerEmail }, "Password reset email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send password reset email");
  }
}

export async function sendLowStockAlert(products: Array<{ productName: string; stockLevel: number; lowStockThreshold: number }>): Promise<void> {
  if (!ADMIN_EMAIL) {
    logger.warn("ADMIN_EMAIL not set — skipping low stock alert");
    return;
  }

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
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: ADMIN_EMAIL,
      subject: `Low Stock Alert — ${products.length} product${products.length > 1 ? "s" : ""} need attention`,
      html: baseTemplate("Low Stock Alert", body),
    });
    logger.info({ count: products.length }, "Low stock alert email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send low stock alert email");
  }
}
