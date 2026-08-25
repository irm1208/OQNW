import type { Product } from "./products";

type BacWaterMetadata = {
  slug: string;
  label: string;
  unit: "ampule" | "vial";
  ref: string;
};

export type BacWaterProductOption = Omit<Product, "price"> & BacWaterMetadata & {
  price: number;
};

export const BAC_WATER_PRODUCT_OPTIONS: readonly BacWaterMetadata[] = [
  {
    slug: "bacteriostatic-water-10ml",
    label: "10ml Ampule",
    unit: "ampule",
    ref: "BW-10-ML",
  },
  {
    slug: "bacteriostatic-water-30ml",
    label: "30ml Vial",
    unit: "vial",
    ref: "BW-30-ML",
  },
];

export const FREE_BAC_WATER_SLUG = "bacteriostatic-water-10ml";

/**
 * Resolves Bac Water display metadata against the live catalogue.
 * Prices, IDs, stock, names, and images always come from the API-backed product list.
 */
export function resolveBacWaterProducts(products: Product[]): BacWaterProductOption[] {
  return BAC_WATER_PRODUCT_OPTIONS.flatMap((metadata) => {
    const product = products.find(
      (candidate) => candidate.slug === metadata.slug && candidate.price != null
    );
    return product && product.price != null
      ? [{ ...product, ...metadata, price: product.price }]
      : [];
  });
}