import type { SyntheticEvent } from "react";

/* Studio-shot variant generated from the label render, when one exists. */
export function studioImage(src: string): string {
  if (/\/products\/(?:catalogue|vials)\//i.test(src)) return src;
  const m = /\/products\/([^/?]+)\.(jpg|jpeg|png)(\?.*)?$/i.exec(src);
  return m ? `/api/catalogue-assets/products/studio/${m[1]}.webp` : src;
}

/* Legacy catalogue records use a mix of numbered cards and reference webps.
 * Their product id is the stable link to the matching studio vial render. */
export function studioImageForProduct(id: string | number, src: string): string {
  const fromSource = studioImage(src);
  if (fromSource !== src) return fromSource;
  if (!/\/products\/reference\/[^/?]+\.webp(?:\?.*)?$/i.test(src)) return src;
  return /^\d+$/.test(String(id))
    ? `/api/catalogue-assets/products/studio/${id}.webp`
    : src;
}

/* Falls back to the original render once if the studio file is missing. */
export function studioFallback(original: string) {
  return (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fallback) return;
    img.dataset.fallback = "1";
    img.src = original;
  };
}

export const STUDIO_BG = "#E9EAEE";
