export function moneyToMinor(value: unknown): number | null {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount) || amount <= 0) return null;
  const minor = Math.round(amount * 100);
  return minor > 0 ? minor : null;
}

export function minorToMoney(minor: number): string {
  return (minor / 100).toFixed(2);
}

export function remainingRefundableMinor(
  orderTotalMinor: number,
  confirmedMinor: number,
  pendingMinor: number,
): number {
  return Math.max(0, orderTotalMinor - confirmedMinor - pendingMinor);
}

export function classifyConfirmedRefund(
  orderTotalMinor: number,
  confirmedBeforeMinor: number,
  refundMinor: number,
): "partial" | "full" {
  return confirmedBeforeMinor + refundMinor >= orderTotalMinor ? "full" : "partial";
}