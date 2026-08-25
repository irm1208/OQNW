---
name: Checkout quote replay scaling
description: How single-use bank-payment quotes should evolve if the API scales beyond one process.
---

The current checkout quote replay guard and restricted Wallid test-session claim are intentionally process-local because the API runs as one Node process. If checkout is deployed across multiple API workers or instances, replace them with durable, atomic claims or an idempotency mechanism shared by all workers.

**Why:** A memory-only guard prevents duplicate Wallid sessions and re-use of one-time test sessions only for requests served by the same process; separate workers would not share consumed-token state.

**How to apply:** Before increasing API worker or instance count, introduce a database-backed unique claim keyed by a quote nonce/digest or test-session ID (or use a gateway idempotency key) before creating the payment session.