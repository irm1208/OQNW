---
name: Catalog product ID schemes
description: Frontend product IDs and DB catalog IDs are independent — never assume they match when removing/editing products.
---

# Catalog product ID schemes differ between frontend and DB

The storefront data files (`artifacts/omniqure/src/data/*.ts`) and the meta feed key products by a **string** `id` (e.g. `"26"`). The Postgres `products_catalog` table uses its own **serial** integer `id` that does NOT line up with the frontend id — the same product can be frontend id `26` but DB id `25`.

**Why:** DB rows are seeded via `seed-catalog.ts` but the serial column reassigns ids, so any gap/reorder in the seed shifts DB ids relative to the frontend ids.

**How to apply:** When removing or editing a product across both layers, match on the **slug** (stable and identical in both), never on numeric id. `product_reviews.product_id` and `products_inventory.product_id` reference the DB catalog id — resolve them via a slug subquery (`WHERE product_id IN (SELECT id FROM products_catalog WHERE slug LIKE ...)`), not the frontend id.

Related surfaces that must all be updated together for a full product removal: `products.ts`, `productDetails.ts`, `peptideExtras.ts` (keyed by product name), `janoshikData.ts` (keyed by frontend id), `public/meta-product-catalog.xml`, `seed-catalog.ts`, plus the live DB (catalog + reviews + inventory). `seed-reviews.ts` templates are keyed by **category**, not product — genericize any product-specific wording rather than deleting the category block if other products still use it.
