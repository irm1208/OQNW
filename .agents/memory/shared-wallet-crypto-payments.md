---
name: Shared-wallet crypto payments
description: Safety rules for the direct crypto flow when the store does not use unique deposit addresses.
---

For crypto routes that share a receiving wallet, lock a complete route snapshot with the order and only auto-confirm transactions whose on-chain time is at or after that order's lock. A rate expiry stops new submissions and re-locking, but never stops reconciliation of a transaction already submitted.

**Why:** A public shared wallet otherwise permits reuse of historical qualifying transactions against new orders. Route edits after checkout also must not change what an existing customer was asked to pay, while early reconciliation cutoffs could strand legitimate transactions awaiting confirmations.

**How to apply:** Treat a confirmed payment as terminal; use the order snapshot rather than current settings for payment verification and audit evidence. Preserve transaction-hash uniqueness and route all missing timing evidence to manual review rather than auto-approving.

Secure payment-detail reads must not be served from a conditional cache after a transaction submission; a `304 Not Modified` has no response body and must never replace the current payment details in the confirmation UI.

**Why:** A verification request can succeed, then its immediate payment refresh may receive an empty `304` body. Treating that body as a payment object makes the payment card appear to collapse or fail silently.

**How to apply:** Send payment-detail responses with `Cache-Control: no-store`, request them with no-store/no-cache semantics, and reject incomplete payment payloads rather than putting them into UI state.

On-chain verification must use multiple RPC providers per network and fall through on transport, HTTP, or JSON-RPC errors; do not log endpoint URLs because a configured provider may encode credentials.

**Why:** Public RPC endpoints can intermittently reject otherwise valid verification calls. Treating one provider's outage as a pending payment masks a check that can be completed immediately elsewhere, while logging a configured URL can expose provider credentials.

**How to apply:** Prefer a configured provider, then use independent public fallbacks. Report the server's actual verification reason to the customer and recheck submitted pending hashes without changing their locked route or rate.