import { db, productsCatalogTable, productsInventoryTable } from "@workspace/db";
import { inArray } from "drizzle-orm";

/**
 * Product slugs that are permanently removed from sale. Keep historical order
 * lines intact, but never expose these items in the active catalogue.
 */
export const RETIRED_PRODUCT_SLUGS = ["bacteriostatic-water-3ml"] as const;

export function isRetiredProductSlug(slug: string): boolean {
  return RETIRED_PRODUCT_SLUGS.includes(slug as typeof RETIRED_PRODUCT_SLUGS[number]);
}

/**
 * Retire legacy catalogue rows without deleting historical orders that refer
 * to them. This is safe to run at every API startup.
 */
export async function retireRemovedProducts(): Promise<number> {
  const retired = await db
    .update(productsCatalogTable)
    .set({ isPublished: false, isFeatured: false })
    .where(inArray(productsCatalogTable.slug, [...RETIRED_PRODUCT_SLUGS]))
    .returning({ id: productsCatalogTable.id });

  if (retired.length > 0) {
    await db
      .update(productsInventoryTable)
      .set({ isPublished: false })
      .where(inArray(productsInventoryTable.productId, retired.map((product) => product.id)));
  }

  return retired.length;
}