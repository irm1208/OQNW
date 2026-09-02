---
name: Referral admin ledger boundary
description: Safety boundary between evidence-based referral reporting and reward lifecycle mutations.
---

Referral administration may report referral relationships, first-order qualification, aggregate balances, and abuse flags from current customer and order records. Do not expose controls that claim to void, reverse, or redeem a specific reward until individual reward events are durably recorded.

**Why:** Current referral credit is an aggregate customer balance. It cannot prove which individual reward remains available or has already been redeemed, so reversing a guessed reward could remove legitimate credit.

**How to apply:** Keep current referral management read-only. Before adding reward hold, void, or reversal actions, introduce an atomic referral ledger linked to both customers and the qualifying order, with explicit lifecycle states and administrator audit data.