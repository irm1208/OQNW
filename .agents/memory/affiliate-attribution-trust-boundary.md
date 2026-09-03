---
name: Affiliate attribution trust boundary
description: Security boundary for affiliate click and discount-code attribution at checkout.
---

Affiliate checkout attribution must come from server-verified state: a signed HttpOnly click-attribution cookie, or an active discount code linked to an approved partner. Never accept a partner ID or commission identity supplied by the browser.

**Why:** Browser-controlled affiliate identities allow forged commissions and self-attribution. Signed click state also preserves the agreed most-recent-eligible-click rule without exposing a mutable trust decision to the client.

**How to apply:** Any new checkout, quote, payment-link, or order-creation path must resolve the partner server-side, enforce the attribution window and approval status, and block self-referrals before writing immutable attribution and commission records.