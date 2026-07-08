---
name: Orphaned-looking features can still be wired into core flows
description: A feature with no reachable frontend UI can still have live logic embedded in core backend flows (e.g. checkout/order creation) — check for this before deleting.
---

When auditing a codebase for "unused" or "orphaned" features (no frontend route/page reaching a backend route), don't assume the backend code is inert. It may be silently accepted as an optional field/branch inside a shared, always-run endpoint.

**Why:** In OmniQure, the gift-card system had no purchase/apply UI anywhere in the storefront, making it look like dead, easily-removable code. But the order-creation endpoint (`POST /api/orders`) already accepted an optional `giftCardCode` field and used it to look up and deduct a gift card balance as part of every order's total calculation — fully live logic, just never triggered because nothing sent that field. Removing it safely required tracing every usage inside the shared endpoint, not just deleting the standalone route file.

**How to apply:** Before deleting an "orphaned" feature, grep for its identifiers (table names, field names, function names) across the *entire* backend, not just its own route file — especially inside high-traffic shared endpoints like order/checkout/payment creation. Trace each usage site and remove them individually rather than assuming the feature is isolated.
