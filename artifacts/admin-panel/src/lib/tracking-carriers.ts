export const TRACKING_CARRIERS = [
  "Royal Mail",
  "DPD",
  "Evri",
  "DHL",
  "UPS",
  "FedEx",
  "Parcelforce",
] as const;

export type TrackingCarrier = (typeof TRACKING_CARRIERS)[number];
export const CUSTOM_CARRIER = "Other";

const trackingUrlBuilders: Record<TrackingCarrier, (number: string) => string> = {
  "Royal Mail": number => `https://www.royalmail.com/track-your-item#/tracking-results/${encodeURIComponent(number)}`,
  DPD: number => `https://www.dpd.co.uk/apps/tracking/?reference=${encodeURIComponent(number)}`,
  Evri: number => `https://www.evri.com/track/parcel/${encodeURIComponent(number)}`,
  DHL: number => `https://www.dhl.com/gb-en/home/tracking/tracking-express.html?tracking-id=${encodeURIComponent(number)}`,
  UPS: number => `https://www.ups.com/track?tracknum=${encodeURIComponent(number)}`,
  FedEx: number => `https://www.fedex.com/fedextrack/?trknbr=${encodeURIComponent(number)}`,
  Parcelforce: number => `https://www.parcelforce.com/track-trace?trackNumber=${encodeURIComponent(number)}`,
};

export function getTrackingUrl(carrier: string, trackingNumber: string) {
  if (!trackingNumber.trim() || !(carrier in trackingUrlBuilders)) return "";
  return trackingUrlBuilders[carrier as TrackingCarrier](trackingNumber.trim());
}

export function isSafeTrackingUrl(url: string | null | undefined) {
  try {
    if (!url) return false;
    const parsed = new URL(url);
    return parsed.protocol === "https:" && !!parsed.hostname && !parsed.username && !parsed.password;
  } catch {
    return false;
  }
}