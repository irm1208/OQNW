import { logger } from "./logger";

export type WallidPaymentCurrency = "GBP" | "EUR";

export type WallidPaymentQuote = {
  currency: WallidPaymentCurrency;
  rate: number;
  amountMinor: number;
};

const EUR_RATE_CACHE_TTL_MS = 60 * 60 * 1000;
let cachedEurRate: { value: number; expiresAt: number } | null = null;

function toMinorUnits(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Allocates a payment total across displayed order lines while preserving every
 * minor unit. Wallid displays `price_minor` as a complete line amount (it does
 * not use a quantity field), so any shipping and order-level reductions are
 * distributed proportionally across the paid product lines.
 */
export function allocatePaymentLineAmounts(
  totalMinor: number,
  lineWeights: number[],
): number[] {
  if (!Number.isInteger(totalMinor) || totalMinor < 0) {
    throw new Error("Payment total must be a non-negative integer in minor units");
  }
  if (lineWeights.some((weight) => !Number.isFinite(weight) || weight < 0)) {
    throw new Error("Payment line weights must be finite, non-negative numbers");
  }
  if (lineWeights.length === 0) return [];

  const weightTotal = lineWeights.reduce((sum, weight) => sum + weight, 0);
  if (weightTotal === 0) {
    return lineWeights.map((_, index) => (index === 0 ? totalMinor : 0));
  }

  const rawAmounts = lineWeights.map((weight) => (totalMinor * weight) / weightTotal);
  const allocations = rawAmounts.map((amount) => Math.floor(amount));
  let remainder = totalMinor - allocations.reduce((sum, amount) => sum + amount, 0);

  const byLargestFraction = rawAmounts
    .map((amount, index) => ({ index, fraction: amount - Math.floor(amount) }))
    .sort((a, b) => b.fraction - a.fraction || a.index - b.index);

  for (const { index } of byLargestFraction) {
    if (remainder === 0) break;
    allocations[index] += 1;
    remainder -= 1;
  }

  return allocations;
}

/**
 * Returns the EUR value of one GBP from a server-side source.
 *
 * We intentionally do not accept a rate from the checkout browser. The quote
 * used for the Wallid request becomes the amount persisted on the order and
 * later matched against the signed webhook event.
 */
async function getEurRate(): Promise<number | null> {
  if (cachedEurRate && cachedEurRate.expiresAt > Date.now()) {
    return cachedEurRate.value;
  }

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/GBP", {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      logger.warn({ status: response.status }, "Could not retrieve the GBP to EUR payment rate");
      return null;
    }

    const payload = await response.json() as { rates?: { EUR?: unknown } };
    const rate = Number(payload.rates?.EUR);
    if (!Number.isFinite(rate) || rate <= 0) {
      logger.warn({ rate: payload.rates?.EUR }, "Currency rate response did not contain a valid EUR rate");
      return null;
    }

    cachedEurRate = { value: rate, expiresAt: Date.now() + EUR_RATE_CACHE_TTL_MS };
    return rate;
  } catch (err) {
    logger.warn({ err }, "Could not retrieve the GBP to EUR payment rate");
    return null;
  }
}

export async function createWallidPaymentQuote(
  totalGbp: number,
  currency: WallidPaymentCurrency,
): Promise<WallidPaymentQuote | null> {
  if (currency === "GBP") {
    return { currency, rate: 1, amountMinor: toMinorUnits(totalGbp) };
  }

  const rate = await getEurRate();
  if (!rate) return null;

  return { currency, rate, amountMinor: toMinorUnits(totalGbp * rate) };
}