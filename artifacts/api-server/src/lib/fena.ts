import { logger } from "./logger";

const FENA_INTEGRATION_ID = process.env.FENA_INTEGRATION_ID;
const FENA_INTEGRATION_SECRET = process.env.FENA_INTEGRATION_SECRET;
export const FENA_WEBHOOK_SECRET = process.env.FENA_WEBHOOK_SECRET;

const FENA_CREATE_ENDPOINT =
  "https://epos.api.prod-gcp.fena.co/open/payments/single/create-and-process";
const FENA_CHECK_ENDPOINT =
  "https://epos.api.prod-gcp.fena.co/public/payment-flow/payment/";

export function isFenaConfigured(): boolean {
  return !!(FENA_INTEGRATION_ID && FENA_INTEGRATION_SECRET);
}

export interface FenaPayment {
  paymentUrl: string;
  hashedId: string;
}

export async function createFenaPayment(opts: {
  orderNumber: string;
  totalGbp: number;
  customerEmail: string;
  customerName: string;
  redirectUrl: string;
}): Promise<FenaPayment | null> {
  if (!isFenaConfigured()) {
    logger.warn(
      "Fena not configured — FENA_INTEGRATION_ID or FENA_INTEGRATION_SECRET missing",
    );
    return null;
  }

  try {
    const res = await fetch(FENA_CREATE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "secret-key": FENA_INTEGRATION_SECRET!,
        "integration-id": FENA_INTEGRATION_ID!,
      },
      body: JSON.stringify({
        reference: opts.orderNumber,
        amount: opts.totalGbp.toFixed(2),
        customerEmail: opts.customerEmail,
        customerName: opts.customerName,
        customRedirectUrl: opts.redirectUrl,
        items: [],
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      logger.error(
        { status: res.status, errText, orderNumber: opts.orderNumber },
        "Fena payment creation failed",
      );
      return null;
    }

    const data = (await res.json()) as {
      created: boolean;
      result?: { link: string };
    };

    if (!data.created || !data.result?.link) {
      logger.error(
        { data, orderNumber: opts.orderNumber },
        "Fena returned unexpected response",
      );
      return null;
    }

    const link = data.result.link;
    let hashedId = link;
    try {
      const url = new URL(link);
      hashedId = url.searchParams.get("id") ?? link;
    } catch {
      // link is not a valid URL — use it as-is
    }

    return { paymentUrl: link, hashedId };
  } catch (err) {
    logger.error({ err, orderNumber: opts.orderNumber }, "Fena payment creation threw");
    return null;
  }
}

export async function checkFenaPaymentStatus(
  hashedId: string,
): Promise<{ paid: boolean; orderReference?: string } | null> {
  try {
    const res = await fetch(`${FENA_CHECK_ENDPOINT}${hashedId}`);
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    const paid =
      data["status"] === "COMPLETED" ||
      data["status"] === "PAID" ||
      data["paid"] === true;
    const orderReference =
      (data["orderID"] as string | undefined) ??
      (data["reference"] as string | undefined);
    return { paid, orderReference };
  } catch (err) {
    logger.error({ err, hashedId }, "Fena payment status check threw");
    return null;
  }
}
