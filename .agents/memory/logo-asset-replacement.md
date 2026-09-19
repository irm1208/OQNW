---
name: Logo asset replacement
description: Preventing legacy or cached OmniQure logos from remaining visible after a rebrand
---

When changing OmniQure branding, replace legacy public logo files as well as active assets, and increment the cache version on current logo URLs.

**Why:** Unreferenced legacy images remain directly servable, while browsers and social crawlers can continue showing cached artwork at unchanged URLs.

**How to apply:** Check all public logo filenames, overwrite obsolete variants with current artwork, version image URLs consistently across storefront, admin, email, PDF, and social metadata, then compare served bytes with workspace files.