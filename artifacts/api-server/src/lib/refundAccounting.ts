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

export type RefundOrderLine = { id: number; productId: number; productName: string; quantity: number };
export type RefundLineItem = { orderItemId: number; productId: number; productName: string; quantity: number };
export type RefundReservation = { status: string; restoreInventory: boolean; lineItemsJson: string | null };

/** Strictly accepts the small browser selection contract; all other values are server owned. */
export function normalizeRefundSelection(value: unknown): { orderItemId: number; quantity: number }[] | null {
  if (!Array.isArray(value)) return null;
  const seen = new Set<number>();
  const result: { orderItemId: number; quantity: number }[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") return null;
    const { orderItemId, quantity } = entry as Record<string, unknown>;
    if (!Number.isInteger(orderItemId) || !Number.isInteger(quantity) || Number(quantity) <= 0 || seen.has(Number(orderItemId))) return null;
    seen.add(Number(orderItemId));
    result.push({ orderItemId: Number(orderItemId), quantity: Number(quantity) });
  }
  return result;
}

function parseStoredItems(value: string | null): unknown[] | null {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}

export function resolveStoredRefundItems(
  lines: RefundOrderLine[],
  lineItemsJson: string | null,
): { items: RefundLineItem[]; conflict: boolean } {
  const entries = parseStoredItems(lineItemsJson);
  if (!entries) return { items: [], conflict: true };
  const eligible = lines.filter((line) => line.productId > 0);
  const quantities = new Map<number, number>();
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") return { items: [], conflict: true };
    const item = entry as Record<string, unknown>;
    if (!Number.isInteger(item.quantity) || Number(item.quantity) <= 0 ||
      !Number.isInteger(item.productId) || Number(item.productId) <= 0) {
      return { items: [], conflict: true };
    }
    let line: RefundOrderLine | undefined;
    if (Number.isInteger(item.orderItemId)) {
      line = eligible.find((candidate) => candidate.id === Number(item.orderItemId));
      if (!line || line.productId !== Number(item.productId)) return { items: [], conflict: true };
    } else {
      const candidates = eligible.filter((candidate) => candidate.productId === Number(item.productId));
      if (candidates.length !== 1) return { items: [], conflict: true };
      line = candidates[0];
    }
    quantities.set(line.id, (quantities.get(line.id) ?? 0) + Number(item.quantity));
  }
  return {
    items: [...quantities.entries()].map(([orderItemId, quantity]) => {
      const line = eligible.find((candidate) => candidate.id === orderItemId)!;
      return {
        orderItemId,
        productId: line.productId,
        productName: line.productName,
        quantity,
      };
    }),
    conflict: false,
  };
}

/**
 * Counts active stock reservations. Legacy product-only entries are accepted only
 * where product identity unambiguously identifies exactly one purchasable line.
 */
export function reservedRefundQuantities(
  lines: RefundOrderLine[],
  refunds: RefundReservation[],
): { quantities: Map<number, number>; conflict: boolean } {
  const quantities = new Map<number, number>();
  const eligible = lines.filter((line) => line.productId > 0);
  let conflict = false;
  for (const refund of refunds) {
    if (refund.status !== "pending" && refund.status !== "confirmed") continue;
    if (!refund.restoreInventory) continue;
    const resolved = resolveStoredRefundItems(lines, refund.lineItemsJson);
    if (resolved.conflict) { conflict = true; continue; }
    for (const item of resolved.items) {
      quantities.set(item.orderItemId, (quantities.get(item.orderItemId) ?? 0) + item.quantity);
    }
  }
  return { quantities, conflict };
}