---
name: Wallid reconciliation ownership
description: Why Wallid payment settlement must be independent of frontend read paths.
---

Wallid payment reconciliation must run as a server-side scheduled process, with page-level checks treated only as extra fallbacks. Payment IDs stored in notes must support every delimiter used by checkout paths and select the final server-appended marker.

**Why:** Production webhooks may be absent or delayed, and different customer/admin screens use different read endpoints. Wholesale notes use line breaks while standard checkout notes may use semicolons; parsing only one format silently skips successful payments.

**How to apply:** Any payment-status repair must update the order and linked wholesale invoice independently of UI navigation, require exact provider ID/order/amount/currency matching, and claim both paid transitions atomically before sending confirmation.