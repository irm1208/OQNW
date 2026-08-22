---
name: Shared-wallet crypto payments
description: Safety rules for the direct crypto flow when the store does not use unique deposit addresses.
---

For crypto routes that share a receiving wallet, lock a complete route snapshot with the order and only auto-confirm transactions whose on-chain time is at or after that order's lock. A rate expiry stops new submissions and re-locking, but never stops reconciliation of a transaction already submitted.

**Why:** A public shared wallet otherwise permits reuse of historical qualifying transactions against new orders. Route edits after checkout also must not change what an existing customer was asked to pay, while early reconciliation cutoffs could strand legitimate transactions awaiting confirmations.

**How to apply:** Treat a confirmed payment as terminal; use the order snapshot rather than current settings for payment verification and audit evidence. Preserve transaction-hash uniqueness and route all missing timing evidence to manual review rather than auto-approving.