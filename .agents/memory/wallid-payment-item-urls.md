---
name: Wallid payment item URLs
description: Provider validation and retry requirements for durable Wallid payment-link creation.
---

Wallid payment item image and product URLs must be absolute valid HTTP(S) URLs. Never send empty or relative catalogue paths.

**Why:** Wallid rejects the entire create request when an item URL is invalid. If the local invoice is stored before that call, a naive retry then collides with the durable reference instead of creating the payment link.

**How to apply:** Resolve catalogue paths against the public HTTPS site with a valid fallback, and atomically resume an identical failed invoice while rejecting reuse of its reference for different customer, amount, or items.