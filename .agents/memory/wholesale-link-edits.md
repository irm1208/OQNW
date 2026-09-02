---
name: Wholesale payment-link edits
description: Safety boundary for editing an issued Wallid wholesale payment link.
---

Once a Wallid wholesale payment URL exists, allow edits only to customer and invoice metadata. Keep its reference number, amount, and line items immutable, and do not edit paid invoices.

**Why:** The provider URL was created against the original order number and total. Changing financial fields in the local invoice would leave an older payable URL and later webhook events disagreeing with the saved order.

**How to apply:** Resend the same URL after metadata edits. Treat changed references, products, quantities, or prices as a new payment rather than updating the issued link in place.