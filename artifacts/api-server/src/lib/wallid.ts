import { logger } from "./logger";

const WALLID_API_KEY_ID     = process.env.WALLID_API_KEY_ID;
const WALLID_API_KEY_SECRET = process.env.WALLID_API_KEY_SECRET;
export const WALLID_WEBHOOK_SECRET = process.env.WALLID_WEBHOOK_SECRET;

const WALLID_BASE_URL = "https://payment-api.wallid.co/api/payment-gw/v1";

export function isWallidConfigured(): boolean {
  return !!(WALLID_API_KEY_ID && WALLID_API_KEY_SECRET);
}

/** Build the HTTP Basic Auth header value. */
function basicAuth(): string {
  return "Basic " + Buffer.from(`${WALLID_API_KEY_ID}:${WALLID_API_KEY_SECRET}`).toString("base64");
}

export interface WallidPayment {
  paymentUrl:   string;
  apiPaymentId: string;
}

export interface WallidItem {
  name:        string;
  category:    string;
  price_minor: number;
  image_url:   string;
  product_url: string;
}

/**
 * Create a Wallid hosted payment session.
 *
 * Callers provide the already-quoted amount in the selected currency's minor
 * units (pence for GBP and cents for EUR).
 * Returns the hosted checkout URL and the api_payment_id to store for
 * reconciliation, or null if creation fails.
 */
export async function createWallidPayment(opts: {
  orderNumber:    string;
  amountMinor:    number;
  currency:       "GBP" | "EUR";
  customerEmail:  string;
  customerId?:    string;
  successUrl:     string;
  failUrl:        string;
  items:          WallidItem[];
}): Promise<WallidPayment | null> {
  if (!isWallidConfigured()) {
    logger.warn("Wallid not configured — WALLID_API_KEY_ID or WALLID_API_KEY_SECRET missing");
    return null;
  }

  const body = {
    order_id:       opts.orderNumber,
    amount:         opts.amountMinor,
    currency:       opts.currency,
    success_url:    opts.successUrl,
    fail_url:       opts.failUrl,
    customer_email: opts.customerEmail,
    ...(opts.customerId && { customer_id: opts.customerId }),
    locale:         "en",
    country:        "GB",
    items:          opts.items,
  };

  try {
    const res = await fetch(`${WALLID_BASE_URL}/create`, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": basicAuth(),
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "(no body)");
      logger.error(
        { status: res.status, errText, orderNumber: opts.orderNumber },
        "Wallid payment creation failed",
      );
      return null;
    }

    const data = (await res.json()) as {
      api_payment_id?: string;
      payment_link?:   string;
    };

    if (!data.api_payment_id || !data.payment_link) {
      logger.error({ data, orderNumber: opts.orderNumber }, "Wallid returned unexpected response");
      return null;
    }

    return { paymentUrl: data.payment_link, apiPaymentId: data.api_payment_id };
  } catch (err) {
    logger.error({ err, orderNumber: opts.orderNumber }, "Wallid payment creation threw");
    return null;
  }
}
