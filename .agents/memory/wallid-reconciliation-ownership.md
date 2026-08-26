---
name: Wallid reconciliation ownership
description: Why Wallid payment settlement must be independent of frontend read paths.
---

Wallid payment reconciliation must run as a server-side scheduled process, with page-level checks treated only as extra fallbacks.

**Why:** Production webhooks may be absent or delayed, and different customer/admin screens use different read endpoints. Tying reconciliation to one screen leaves successful debits stuck until that exact path is opened.

**How to apply:** Any payment-status repair must update the database independently of UI navigation, require exact provider ID/order/amount/currency matching, and claim the awaiting-to-paid transition atomically before sending confirmation.