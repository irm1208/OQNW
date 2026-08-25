---
name: Production catalogue price sync
description: How development and production catalogue prices relate, and how to safely keep live prices current.
---

Development and production catalogue data are independent. Re-publishing the application updates deployed code but does not copy admin-edited development prices into the production catalogue.

**Why:** The externally published storefront can otherwise keep serving a different set of product prices even though the workspace preview reflects an admin change.

**How to apply:** Manage live prices in the production admin panel when possible. For a bulk reconciliation, compare catalogue rows by stable slug, preview the price-only differences, update only confirmed price fields through the production admin API, leave production-only SKUs untouched, and verify the public production API afterward.