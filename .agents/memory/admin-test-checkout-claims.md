---
name: Admin test checkout claims
description: Durable replay protection required for one-time payment-test links.
---

One-time admin payment-test links must be claimed atomically in shared durable storage before order-side mutations; process-local replay maps are not sufficient.

**Why:** API restarts or multiple replicas can accept the same still-valid signed token when replay state lives only in memory, creating duplicate orders and inventory/customer mutations.

**How to apply:** Use a database uniqueness constraint for the signed session identifier and fail closed when an atomic claim conflicts. A post-claim failure intentionally consumes the link; the admin generates a fresh short-lived link.