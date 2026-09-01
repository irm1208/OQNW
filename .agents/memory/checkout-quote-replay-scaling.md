---
name: Checkout quote replay scaling
description: The durable one-time claim rule for bank-payment quotes across API replicas.
---

Signed checkout quotes and restricted test sessions must be claimed with durable, atomic database uniqueness before an external payment session is created. Store only a one-way token digest and expire old claim records.

**Why:** A memory-only guard cannot prevent concurrent requests handled by separate workers from creating duplicate payment sessions or orders.

**How to apply:** Any new quoted payment method or test link must use the same shared claim boundary, with an indexed retention policy that never permits a still-valid token to be reused.