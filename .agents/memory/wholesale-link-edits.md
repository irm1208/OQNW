---
name: Wholesale payment-link lifecycle
description: Safety boundaries for editing and recovering an issued Wallid wholesale payment link.
---

Once a Wallid wholesale payment URL exists, allow edits only to customer and invoice metadata. Keep its reference number, currency, amount, and line items immutable, and do not edit paid invoices.

**Why:** The provider URL was created against the original order number, currency, and total. Changing financial fields in the local invoice would leave an older payable URL and later webhook events disagreeing with the saved order.

**How to apply:** Resend the same URL after metadata edits. Treat changed references, currency, products, quantities, or prices as a new payment rather than updating the issued link in place.

Provider link persistence and local order readiness must be one transaction. If that local transaction fails after Wallid succeeds, retain the provider ID and URL in an explicit failed state and repair that same link on retry rather than creating another provider payment.

**Why:** A ready invoice paired with a non-ready order can accept payment while webhook and reconciliation ignore it; recreating the provider session can also leave multiple payable URLs.

**How to apply:** Make successful local writes atomic, return an explicit failure if they cannot commit, and make retries resume from the durable provider identifiers.

When a create attempt has no stored provider ID or URL after an interruption or ambiguous provider response, never issue another provider create automatically. Mark the outcome unknown and require the operator to verify Wallid, then attach the original payment ID and URL.

**Why:** Wallid documents unique merchant order IDs but does not document idempotent create replay or lookup by merchant order. Reissuing an ambiguous attempt can create a second payable link.

**How to apply:** Automatic repair is allowed only when both provider identifiers are already durable. Provider-unknown attempts need explicit manual reconciliation against the Wallid dashboard.