import type { WallidPaymentStatus } from "./wallid";

export interface ExpectedWallidPayment {
  apiPaymentId: string;
  orderNumber: string;
  amountMinor: number;
  currency: string;
}

export type WallidPaymentValidation =
  | { ok: true }
  | {
      ok: false;
      reason:
        | "provider_unavailable"
        | "not_successful"
        | "payment_id_mismatch"
        | "order_id_mismatch"
        | "amount_mismatch"
        | "currency_mismatch";
    };

export function wallidPaymentIdFromNotes(notes: string | null | undefined): string | null {
  if (!notes) return null;
  const matches = Array.from(
    notes.matchAll(/(?:^|[;\r\n]\s*)Wallid payment id:\s*([^;\s]+)/g),
  );
  return matches.at(-1)?.[1] ?? null;
}

export function validateSuccessfulWallidPayment(
  expected: ExpectedWallidPayment,
  actual: WallidPaymentStatus | null,
): WallidPaymentValidation {
  if (!actual) return { ok: false, reason: "provider_unavailable" };
  if (actual.status !== "SUCCESS") return { ok: false, reason: "not_successful" };
  if (actual.api_payment_id !== expected.apiPaymentId) {
    return { ok: false, reason: "payment_id_mismatch" };
  }
  if (actual.order_id !== expected.orderNumber) {
    return { ok: false, reason: "order_id_mismatch" };
  }
  if (actual.amount !== expected.amountMinor) {
    return { ok: false, reason: "amount_mismatch" };
  }
  if (actual.currency !== expected.currency) {
    return { ok: false, reason: "currency_mismatch" };
  }
  return { ok: true };
}