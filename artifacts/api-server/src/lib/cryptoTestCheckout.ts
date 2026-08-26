import crypto from "crypto";

export const CRYPTO_TEST_AMOUNT_MINOR = 100;
const TEST_CHECKOUT_TTL_MS = 15 * 60 * 1000;

type SignedCryptoTestCheckout = {
  version: 1;
  id: string;
  expiresAt: number;
};

export type CryptoTestCheckout = {
  id: string;
  expiresAt: number;
};

export function calculateCryptoTestPaymentTotal(
  normalTotalGbp: number,
): { totalGbp: 1; adjustmentGbp: number } | null {
  if (!Number.isFinite(normalTotalGbp)) return null;
  const normalTotalMinor = Math.round(normalTotalGbp * 100);
  if (normalTotalMinor < CRYPTO_TEST_AMOUNT_MINOR) return null;
  return {
    totalGbp: 1,
    adjustmentGbp: (normalTotalMinor - CRYPTO_TEST_AMOUNT_MINOR) / 100,
  };
}

export function createCryptoTestCheckoutToken(
  secret: string,
  now = Date.now(),
): { token: string; expiresAt: string } {
  const payload: SignedCryptoTestCheckout = {
    version: 1,
    id: crypto.randomBytes(24).toString("base64url"),
    expiresAt: now + TEST_CHECKOUT_TTL_MS,
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

export function verifyCryptoTestCheckoutToken(
  token: string,
  secret: string,
  now = Date.now(),
): CryptoTestCheckout | null {
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
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as SignedCryptoTestCheckout;
    if (
      payload.version !== 1 ||
      typeof payload.id !== "string" ||
      !/^[A-Za-z0-9_-]{32}$/.test(payload.id) ||
      !Number.isFinite(payload.expiresAt) ||
      payload.expiresAt <= now
    ) {
      return null;
    }
    return { id: payload.id, expiresAt: payload.expiresAt };
  } catch {
    return null;
  }
}
