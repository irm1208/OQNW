---
name: Shared-wallet crypto payments
description: Safety rules for the direct crypto flow when the store does not use unique deposit addresses.
---

For crypto routes that share a receiving wallet, lock a complete route snapshot with the order and only auto-confirm transactions tied to that lock window. Expiry hides stale payment instructions and requires unpaid customers to re-lock, but it must not strand a transaction already sent.

**Why:** A public shared wallet otherwise permits reuse of historical qualifying transactions against new orders. Route edits after checkout must not change what an existing customer was asked to pay, while confirmation delays can extend beyond the quote window.

**How to apply:** Use the saved route and amount, never a live reprice. Reconcile attempts submitted during the lock after expiry; late-submitted hashes auto-confirm only with on-chain time inside the lock. Route missing or unsafe timing evidence to manual review.

Secure payment-detail reads must not be served from a conditional cache after a transaction submission; a `304 Not Modified` has no response body and must never replace the current payment details in the confirmation UI.

**Why:** A verification request can succeed, then its immediate payment refresh may receive an empty `304` body. Treating that body as a payment object makes the payment card appear to collapse or fail silently.

**How to apply:** Send payment-detail responses with `Cache-Control: no-store`, request them with no-store/no-cache semantics, and reject incomplete payment payloads rather than putting them into UI state.

On-chain verification must use multiple RPC providers per network and fall through on transport, HTTP, or JSON-RPC errors; do not log endpoint URLs because a configured provider may encode credentials.

**Why:** Public RPC endpoints can intermittently reject otherwise valid verification calls. Treating one provider's outage as a pending payment masks a check that can be completed immediately elsewhere, while logging a configured URL can expose provider credentials.

**How to apply:** Prefer a configured provider, then use independent public fallbacks. Report the server's actual verification reason to the customer and recheck submitted pending hashes without changing their locked route or rate.

Known-bad historical token identifiers in saved route snapshots need an explicit, narrowly scoped compatibility alias when the canonical identifier is corrected.

**Why:** Route snapshots should normally be immutable, but preserving an invalid built-in token mint can strand a fully paid order by making a valid transfer look like the wrong token.

**How to apply:** Verify the canonical identifier against real on-chain transaction data, normalize only the exact known-bad legacy value during parsing, and retain strict checks for token mint, wallet owner, and received balance delta.