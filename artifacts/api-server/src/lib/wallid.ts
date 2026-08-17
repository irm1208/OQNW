import { logger } from "./logger";

const WALLID_API_KEY_ID     = process.env.WALLID_API_KEY_ID;
const WALLID_API_KEY_SECRET = process.env.WALLID_API_KEY_SECRET;
export const WALLID_WEBHOOK_SECRET = process.env.WALLID_WEBHOOK_SECRET;

const WALLID_BASE_URL = "https://payment-api.wallid.co/api/payment-gw/v1";

export function isWallidConfigured(): boolean {
  return !!(WALLID_API_KEY_ID && WALLID_API_KEY_SECRET);
}

function basicAuthHeader(): string {
  const credentials = `${WALLID_API_KEY_ID}:${WALLID_API_KEY_SECRET}`;
  return "Basic " + Buffer.from(credentials).toString("base64");
}

export interface WallidPayment {
  paymentUrl: string;
  apiPaymentId: string;
}

export interface WallidItem {
  name: string;
  category: string;
  price_minor: number;
  image_url: string;
  product_url: string;
}

export async function createWallidPayment(opts: {
  orderNumber: string;
  totalGbp: number;
  customerEmail: string;
  successUrl: string;
  failUrl: string;
  items: WallidItem[];
  description?: string;
}): Promise<WallidPayment | null> {
  if (!isWallidConfigured()) {
    logger.warn(
      "Wallid not configured — WALLID_API_KEY_ID or WALLID_API_KEY_SECRET missing",
    );
    return null;
  }

  // Wallid amounts are in minor units (pence for GBP)
  const amountMinor = Math.round(opts.totalGbp * 100);

  try {
    const res = await fetch(`${WALLID_BASE_URL}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuthHeader(),
      },
      body: JSON.stringify({
        order_id:       opts.orderNumber,
        amount:         amountMinor,
        currency:       "GBP",
        success_url:    opts.successUrl,
        fail_url:       opts.failUrl,
        customer_email: opts.customerEmail,
        description:    opts.description ?? `OmniQure order ${opts.orderNumber}`,
        items:          opts.items,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error(
        { status: res.status, errText, orderNumber: opts.orderNumber },
        "Wallid payment creation failed",
      );
      return null;
    }

    const data = (await res.json()) as {
      api_payment_id: string;
      payment_link:   string;
      status:         string;
    };

    if (!data.payment_link || !data.api_payment_id) {
      logger.error(
        { data, orderNumber: opts.orderNumber },
        "Wallid returned unexpected response",
      );
      return null;
    }

    return { paymentUrl: data.payment_link, apiPaymentId: data.api_payment_id };
  } catch (err) {
    logger.error({ err, orderNumber: opts.orderNumber }, "Wallid payment creation threw");
    return null;
  }
}

export async function checkWallidPaymentStatus(
  apiPaymentId: string,
): Promise<{ paid: boolean; orderId?: string } | null> {
  if (!isWallidConfigured()) return null;
  try {
    const res = await fetch(
      `${WALLID_BASE_URL}/status?apiPaymentId=${encodeURIComponent(apiPaymentId)}`,
      { headers: { Authorization: basicAuthHeader() } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { status: string; order_id?: string };
    return {
      paid:    data.status === "SUCCESS",
      orderId: data.order_id,
    };
  } catch (err) {
    logger.error({ err, apiPaymentId }, "Wallid payment status check threw");
    return null;
  }
}
