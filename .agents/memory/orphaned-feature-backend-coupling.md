---
name: Orphaned-looking features can still be wired into core flows
description: A feature with no reachable frontend UI can still have live logic embedded in core backend flows (e.g. checkout/order creation) — check for this before deleting.
---

When auditing a codebase for "unused" or "orphaned" features (no frontend route/page reaching a backend route), don't assume the backend code is inert. It may be silently accepted as an optional field/branch inside a shared, always-run endpoint, OR it may be a genuinely dead standalone route never called by anything (both patterns show up in the same codebase).

**Why:** In OmniQure, the gift-card system had no purchase/apply UI anywhere in the storefront, making it look like dead, easily-removable code. But the order-creation endpoint (`POST /api/orders`) already accepted an optional `giftCardCode` field and used it to look up and deduct a gift card balance as part of every order's total calculation — fully live logic, just never triggered because nothing sent that field. By contrast, a separate OpenAI-backed chat conversation API (`/api/openai/*` with `conversations`/`messages` tables) turned out to be *fully* dead — the storefront's chat widget used a local regex knowledge base instead, and the route wasn't even declared in the OpenAPI spec, confirming it was never part of the real contract.

**How to apply:** Before deleting an "orphaned" feature, (1) grep for its identifiers (table names, field names, function names) across the *entire* backend, not just its own route file — especially inside high-traffic shared endpoints like order/checkout/payment creation; (2) check whether the route is declared in the OpenAPI spec — undeclared routes are a strong signal of true dead code; (3) trace each usage site and remove them individually rather than assuming the feature is isolated.
