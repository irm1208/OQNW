import crypto from "crypto";
import { logger } from "./logger";

const BTCPAY_URL = process.env.BTCPAY_URL?.replace(/\/$/, "");
const BTCPAY_API_KEY = process.env.BTCPAY_API_KEY;
const BTCPAY_STORE_ID = process.env.BTCPAY_STORE_ID;
export const BTCPAY_WEBHOOK_SECRET = process.env.BTCPAY_WEBHOOK_SECRET;

export function isBtcPayConfigured(): boolean {
  return !!(BTCPAY_URL && BTCPAY_API_KEY && BTCPAY_STORE_ID);
}

export interface BtcPayInvoice {
  invoiceId: string;
  btcAddress: string;
  btcAmount: string;
  paymentUrl: string;
  expiresAt: string;
}

export async function createBtcPayInvoice(opts: {
  orderNumber: string;
  totalGbp: number;
  customerEmail: string;
  customerName: string;
}): Promise<BtcPayInvoice | null> {
  if (!isBtcPayConfigured()) {
    logger.warn("BTCPay Server not configured — falling back to static BTC address");
    return null;
  }

  let invoiceId = "";
  let checkoutLink = "";
  let expirationTime = 0;

  try {
    const invoiceRes = await fetch(
      `${BTCPAY_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `token ${BTCPAY_API_KEY}`,
        },
        body: JSON.stringify({
          amount: opts.totalGbp.toFixed(2),
          currency: "GBP",
          metadata: {
            orderId: opts.orderNumber,
            buyerEmail: opts.customerEmail,
            buyerName: opts.customerName,
          },
          checkout: {
            speedPolicy: "MediumSpeed",
            expirationMinutes: 60,
            monitoringMinutes: 90,
          },
        }),
      }
    );

    if (!invoiceRes.ok) {
      const errText = await invoiceRes.text();
      logger.error({ errText, orderNumber: opts.orderNumber }, "BTCPay invoice creation failed");
      return null;
    }

    const invoice = (await invoiceRes.json()) as {
      id: string;
      checkoutLink: string;
      expirationTime: number;
    };

    invoiceId = invoice.id;
    checkoutLink = invoice.checkoutLink;
    expirationTime = invoice.expirationTime;
  } catch (err) {
    logger.error({ err, orderNumber: opts.orderNumber }, "BTCPay invoice request threw");
    return null;
  }

  let btcAddress = "";
  let btcAmount = "";

  try {
    const pmRes = await fetch(
      `${BTCPAY_URL}/api/v1/stores/${BTCPAY_STORE_ID}/invoices/${invoiceId}/payment-methods`,
      { headers: { Authorization: `token ${BTCPAY_API_KEY}` } }
    );
    if (pmRes.ok) {
      const methods = (await pmRes.json()) as Array<{
        paymentMethod: string;
        destination: string;
        amount: string;
      }>;
      const btc = methods.find(
        (m) => m.paymentMethod === "BTC" || m.paymentMethod === "BTC-CHAIN"
      );
      if (btc) {
        btcAddress = btc.destination;
        btcAmount = btc.amount;
      }
    }
  } catch (err) {
    logger.warn({ err, invoiceId }, "BTCPay payment-methods fetch failed — address/amount unavailable");
  }

  return {
    invoiceId,
    btcAddress,
    btcAmount,
    paymentUrl: checkoutLink,
    expiresAt: new Date(expirationTime * 1000).toISOString(),
  };
}

export function verifyBtcPayWebhookSignature(
  rawBody: string,
  signatureHeader: string
): boolean {
  if (!BTCPAY_WEBHOOK_SECRET) return true;
  const expected = crypto
    .createHmac("sha256", BTCPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  const received = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice(7)
    : signatureHeader;
  return crypto.timingSafeEqual(
    Buffer.from(expected, "hex"),
    Buffer.from(received, "hex")
  );
}

export interface BtcPayWebhookEvent {
  type: string;
  invoiceId: string;
  storeId: string;
  metadata?: { orderId?: string };
}
