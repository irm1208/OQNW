---
name: Payment event monotonicity
description: Durable transition rules for duplicate and out-of-order payment provider events.
---

Payment settlement and expiry handlers may mutate only orders still awaiting payment. A settlement must never move an order backward from processing, shipped, or delivered, and an expiry must never cancel a paid or fulfilled order.

**Why:** Providers retry webhooks and can deliver events concurrently or out of order. Unconditional updates can regress confirmed payment or fulfillment and repeat side effects.

**How to apply:** Put the current-status predicate in the atomic database update and trigger confirmation side effects only when that update returns the claimed row.