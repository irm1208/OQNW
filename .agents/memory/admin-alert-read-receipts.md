---
name: Admin alert read receipts
description: Durable identity rule for per-admin notification read state.
---

Store admin notification read receipts per administrator and per alert event, using both the alert ID and its event timestamp. Do not key receipts by alert ID alone. When SQL compares a source timestamp to a receipt event timestamp, normalize the source to millisecond precision because the browser round-trip uses JavaScript ISO dates while PostgreSQL retains microseconds.

**Why:** Operational entities can return to an alerting condition after being resolved. Reusing an old alert ID alone would make a genuinely new recurrence appear already read.

**How to apply:** Any new admin alert source must supply a timestamp that changes when a new actionable occurrence is created, while the underlying unresolved item remains visible independently of read state. Retention and reconciliation queries must compare at millisecond precision.