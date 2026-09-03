---
name: Referral admin ledger boundary
description: Safety boundary between evidence-based referral reporting and reward lifecycle mutations.
---

Referral administration may mutate specific rewards only when individual reward events and redemption allocations are durably recorded. Lock affected customer rows in ascending ID order before reward rows, and decide first-order eligibility while holding the customer lock.

**Why:** The compatibility balance alone cannot prove which reward remains available. Inconsistent lock ordering lets checkout, dispatch, and administrator actions deadlock or overwrite each other; an unlocked first-order check can issue duplicate rewards.

**How to apply:** Keep order creation, balance changes, ledger transitions, and redemption allocations atomic. At dispatch, lock every beneficiary for the qualifying order before its reward rows, then re-read status and use conditional transitions.