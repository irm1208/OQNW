export const DISPATCHABLE_ORDER_STATUSES = ["paid", "payment_received", "processing"] as const;
export const DISPATCHED_ORDER_STATUSES = ["shipped", "delivered"] as const;

export type DispatchDetails = {
  carrierName: string;
  trackingNumber: string;
  trackingUrl: string;
};

type DispatchValidationResult =
  | { ok: true; value: DispatchDetails }
  | { ok: false; error: string };

function cleanSingleLine(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().replace(/\s+/g, " ");
  if (!cleaned || cleaned.length > maxLength || /[\u0000-\u001f\u007f]/.test(cleaned)) return null;
  return cleaned;
}

export function normalizeHttpsTrackingUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const url = new URL(value.trim());
    if (
      url.protocol !== "https:" ||
      !url.hostname ||
      url.username ||
      url.password
    ) {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

export function validateDispatchDetails(input: unknown): DispatchValidationResult {
  if (!input || typeof input !== "object") {
    return { ok: false, error: "Dispatch details are required" };
  }
  const body = input as Record<string, unknown>;
  const carrierName = cleanSingleLine(body.carrierName, 100);
  const trackingNumber = cleanSingleLine(body.trackingNumber, 120);
  const trackingUrl = normalizeHttpsTrackingUrl(body.trackingUrl);

  if (!carrierName) {
    return { ok: false, error: "Logistics company is required" };
  }
  if (!trackingNumber) {
    return { ok: false, error: "Tracking number is required" };
  }
  if (!trackingUrl) {
    return { ok: false, error: "A valid HTTPS tracking link is required" };
  }

  return { ok: true, value: { carrierName, trackingNumber, trackingUrl } };
}

export function isAllowedAdminStatusTransition(current: string, next: string): boolean {
  if (current === next) return true;
  if (current === "shipped") return next === "delivered";
  if (current === "delivered") return false;
  return next !== "shipped" && next !== "delivered";
}