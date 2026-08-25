import crypto from "crypto";

export type CheckoutPaymentCurrency = "GBP" | "EUR";

export type CheckoutPaymentQuote = {
  currency: CheckoutPaymentCurrency;
  amountMinor: number;
  totalGbpMinor: number;
  checkoutFingerprint: string;
  customerId: number | null;
  expiresAt: number;
};

type SignedCheckoutPaymentQuote = CheckoutPaymentQuote & {
  version: 1;
};

const QUOTE_TTL_MS = 5 * 60 * 1000;

export function createCheckoutFingerprint(input: {
  items: Array<{
    productId: number;
    productSlug?: string;
    quantity: number;
    priceGbp: number;
  }>;
  shippingMethod: string;
  shippingCostGbp: number;
  paymentCurrency: CheckoutPaymentCurrency;
  discountCode: string | null;
  loyaltyPointsRedeemed: number;
  referralCreditRedeemed: boolean;
  country: string;
  testPaymentSessionId?: string | null;
}): string {
  const payload = {
    items: input.items
      .map((item) => ({
        productId: item.productId,
        productSlug: item.productSlug?.trim() ?? "",
        quantity: item.quantity,
        priceMinor: Math.round(item.priceGbp * 100),
      }))
      .sort((a, b) =>
        a.productSlug.localeCompare(b.productSlug) ||
        a.productId - b.productId ||
        a.quantity - b.quantity ||
        a.priceMinor - b.priceMinor,
      ),
    shippingMethod: input.shippingMethod,
    shippingMinor: Math.round(input.shippingCostGbp * 100),
    paymentCurrency: input.paymentCurrency,
    discountCode: input.discountCode ?? "",
    loyaltyPointsRedeemed: input.loyaltyPointsRedeemed,
    referralCreditRedeemed: input.referralCreditRedeemed,
    country: input.country.trim(),
    testPaymentSessionId: input.testPaymentSessionId ?? "",
  };

  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function createCheckoutPaymentQuoteToken(
  quote: Omit<CheckoutPaymentQuote, "expiresAt">,
  secret: string,
  now = Date.now(),
): { token: string; expiresAt: string } {
  const payload: SignedCheckoutPaymentQuote = {
    ...quote,
    version: 1,
    expiresAt: now + QUOTE_TTL_MS,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  return {
    token: `${encodedPayload}.${signature}`,
    expiresAt: new Date(payload.expiresAt).toISOString(),
  };
}

export function verifyCheckoutPaymentQuoteToken(
  token: string,
  secret: string,
  expected: Omit<CheckoutPaymentQuote, "expiresAt" | "amountMinor">,
  now = Date.now(),
): CheckoutPaymentQuote | null {
  const separator = token.lastIndexOf(".");
  if (separator === -1) return null;

  const encodedPayload = token.slice(0, separator);
  const receivedSignature = token.slice(separator + 1);
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");

  if (
    receivedSignature.length !== expectedSignature.length ||
    !crypto.timingSafeEqual(Buffer.from(receivedSignature), Buffer.from(expectedSignature))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as SignedCheckoutPaymentQuote;
    if (
      payload.version !== 1 ||
      !Number.isInteger(payload.amountMinor) ||
      payload.amountMinor < 0 ||
      !Number.isInteger(payload.totalGbpMinor) ||
      payload.totalGbpMinor < 0 ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= now ||
      (payload.currency !== "GBP" && payload.currency !== "EUR") ||
      payload.currency !== expected.currency ||
      payload.totalGbpMinor !== expected.totalGbpMinor ||
      payload.checkoutFingerprint !== expected.checkoutFingerprint ||
      payload.customerId !== expected.customerId
    ) {
      return null;
    }

    return {
      currency: payload.currency,
      amountMinor: payload.amountMinor,
      totalGbpMinor: payload.totalGbpMinor,
      checkoutFingerprint: payload.checkoutFingerprint,
      customerId: payload.customerId,
      expiresAt: payload.expiresAt,
    };
  } catch {
    return null;
  }
}

/**
 * Single-process replay guard for the short-lived signed checkout token. The
 * API workflow serves checkout requests from one Node process, so claiming a
 * token synchronously before creating the order prevents double-clicks and
 * concurrent retries from opening multiple Wallid payment sessions.
 */
export class CheckoutPaymentQuoteReplayGuard {
  private readonly consumed = new Map<string, number>();

  consume(token: string, expiresAt: number, now = Date.now()): boolean {
    for (const [tokenDigest, expiry] of this.consumed) {
      if (expiry <= now) this.consumed.delete(tokenDigest);
    }

    if (expiresAt <= now) return false;
    const tokenDigest = crypto.createHash("sha256").update(token).digest("hex");
    if (this.consumed.has(tokenDigest)) return false;

    this.consumed.set(tokenDigest, expiresAt);
    return true;
  }
}