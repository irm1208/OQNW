---
name: Refund inventory reservations
description: Durable rules for item-level inventory restoration across partial and repeated refunds.
---

Inventory restoration selections must reference the immutable order-item row, not only a product ID. Pending and confirmed refund requests both reserve selected quantities; cancelled requests release them.

**Why:** One order can contain multiple lines for the same product, including paid/free splits. Product-level matching or ignoring pending requests can restore more stock than the customer purchased.

**How to apply:** Lock the order, all refund rows, and order-item rows in a consistent order before calculating availability. Persist server-canonical item identity, revalidate cumulative confirmed quantities at confirmation, and change stock only after refund confirmation.