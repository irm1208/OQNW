---
name: Refund confirmation accounting
description: Safety boundary between a requested refund and money confirmed as returned through Wallid.
---

Treat refund requests as reservations, not completed money movement. Only confirmation with a unique Wallid refund reference may update the order's refunded total, classify the refund, restore inventory, or notify the customer that a refund was processed.

**Why:** Wallid's custom API does not provide a documented refund endpoint. Recording an admin's intention as completed would falsely claim money moved and could corrupt refundable balances or inventory.

**How to apply:** Include both confirmed and pending amounts when checking remaining refundable balance. Keep confirmation replay-safe and transactional. Restore inventory only from explicitly supplied product quantities, never from an order-wide checkbox or inferred items.