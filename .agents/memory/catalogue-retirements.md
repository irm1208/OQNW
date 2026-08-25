---
name: Catalogue retirements
description: How to remove a discontinued SKU without breaking completed-order history.
---

# Retire discontinued catalogue products instead of hard-deleting them

Remove a discontinued product from all active catalogue, public API, sitemap, cart, checkout, and admin-management paths by its stable slug. Keep its catalogue/order linkage retired rather than hard-deleting it when completed orders reference it.

**Why:** Historical order items depend on their original product records. Deleting the record risks referential-integrity failures or corrupts fulfilment, accounting, and audit history, while an active-retirement guard makes the product unavailable everywhere customers can browse or buy it.

**How to apply:** Add the slug to the retired-product registry, mark any existing catalogue/inventory rows unpublished during startup cleanup, and exclude retired slugs from active listing, detail, sitemap, and checkout lookups. Preserve old order lines as historical records.