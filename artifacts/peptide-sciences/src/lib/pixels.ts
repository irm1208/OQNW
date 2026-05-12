declare global {
  interface Window {
    fbq?: ((...args: unknown[]) => void) & { queue?: unknown[]; callMethod?: (...args: unknown[]) => void };
    _fbq?: unknown;
    ttq?: {
      load: (id: string) => void;
      page: () => void;
      track: (event: string, data?: Record<string, unknown>) => void;
      identify: (data: Record<string, unknown>) => void;
      _i?: unknown;
    };
  }
}

const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID as string | undefined) ?? "";
const TIKTOK_PIXEL_ID = (import.meta.env.VITE_TIKTOK_PIXEL_ID as string | undefined) ?? "";

let metaLoaded = false;
let tiktokLoaded = false;

function loadMetaPixel(id: string) {
  if (metaLoaded || !id) return;
  metaLoaded = true;
  const n: Window["fbq"] = function (...args: unknown[]) {
    if (n!.callMethod) n!.callMethod!(...args);
    else (n!.queue = n!.queue ?? []).push(args);
  };
  window.fbq = n;
  if (!window._fbq) window._fbq = n;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://connect.facebook.net/en_US/fbevents.js";
  document.head.appendChild(s);

  window.fbq!("init", id);
  window.fbq!("track", "PageView");
}

function loadTikTokPixel(id: string) {
  if (tiktokLoaded || !id) return;
  tiktokLoaded = true;

  const s = document.createElement("script");
  s.async = true;
  s.src = "https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=" + id + "&lib=ttq";
  document.head.appendChild(s);

  const ttq: Window["ttq"] = {
    load: (pixelId: string) => { ttq!._i = pixelId; },
    page: () => { if (window.ttq && window.ttq !== ttq) window.ttq.page(); },
    track: (event: string, data?: Record<string, unknown>) => {
      if (window.ttq && window.ttq !== ttq) window.ttq.track(event, data);
    },
    identify: (data: Record<string, unknown>) => {
      if (window.ttq && window.ttq !== ttq) window.ttq.identify(data);
    },
  };
  window.ttq = ttq;
  ttq.load(id);
}

export function initPixels() {
  if (META_PIXEL_ID) loadMetaPixel(META_PIXEL_ID);
  if (TIKTOK_PIXEL_ID) loadTikTokPixel(TIKTOK_PIXEL_ID);
}

export function trackPageView() {
  if (META_PIXEL_ID && window.fbq) window.fbq("track", "PageView");
  if (TIKTOK_PIXEL_ID && window.ttq) window.ttq.page();
}

export interface PixelProduct {
  id: string;
  name: string;
  price: number | null;
  category: string;
}

export function trackViewContent(product: PixelProduct) {
  if (META_PIXEL_ID && window.fbq) {
    window.fbq("track", "ViewContent", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      content_category: product.category,
      currency: "GBP",
      value: product.price ?? 0,
    });
  }
  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.track("ViewContent", {
      content_id: product.id,
      content_name: product.name,
      content_type: "product",
      currency: "GBP",
      value: product.price ?? 0,
    });
  }
}

export function trackAddToCart(product: PixelProduct, quantity: number) {
  if (META_PIXEL_ID && window.fbq) {
    window.fbq("track", "AddToCart", {
      content_ids: [product.id],
      content_name: product.name,
      content_type: "product",
      currency: "GBP",
      value: (product.price ?? 0) * quantity,
      num_items: quantity,
    });
  }
  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.track("AddToCart", {
      content_id: product.id,
      content_name: product.name,
      content_type: "product",
      quantity,
      currency: "GBP",
      value: (product.price ?? 0) * quantity,
    });
  }
}

export function trackInitiateCheckout(value: number, numItems: number) {
  if (META_PIXEL_ID && window.fbq) {
    window.fbq("track", "InitiateCheckout", {
      currency: "GBP",
      value,
      num_items: numItems,
    });
  }
  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.track("InitiateCheckout", {
      currency: "GBP",
      value,
    });
  }
}

export function trackPurchase(orderId: string, value: number, numItems: number) {
  if (META_PIXEL_ID && window.fbq) {
    window.fbq("track", "Purchase", {
      currency: "GBP",
      value,
      num_items: numItems,
      order_id: orderId,
      content_type: "product",
    });
  }
  if (TIKTOK_PIXEL_ID && window.ttq) {
    window.ttq.track("PlaceAnOrder", {
      currency: "GBP",
      value,
      order_id: orderId,
    });
  }
}
