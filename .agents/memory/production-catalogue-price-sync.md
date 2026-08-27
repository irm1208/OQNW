---
name: Production catalogue price sync
description: How development and production catalogue prices relate, and how to safely keep live prices current.
---

Development and production catalogue data are independent. Re-publishing the application updates deployed code but does not copy admin-edited development prices into the production catalogue.

Bulk price-sync writes must require the signed admin session, and apply must accept only a short-lived HMAC-signed token bound to the exact canonical diff returned by preview. A plain digest is not confirmation because callers can generate it themselves.

**Why:** The externally published storefront can otherwise keep serving a different set of product prices even though the workspace preview reflects an admin change. A forgeable legacy cookie or unsigned diff token would also turn a controlled reconciliation into an arbitrary production price-write API.

**How to apply:** Manage live prices in the production admin panel when possible. For a bulk reconciliation, compare catalogue rows by stable slug, preview price-only differences, bind apply to that reviewed diff with expiring server authentication, update only price fields, leave production-only SKUs untouched, and verify the public production API afterward.