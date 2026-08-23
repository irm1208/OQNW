---
name: Durable test data IDs
description: Safely creating isolated development test records from durable CodeExecution blocks.
---

When a durable CodeExecution block needs a temporary database identity, do not rely on `Date.now()`, `Math.random()`, or `crypto.randomUUID()` for its identifier.

**Why:** Durable execution may reject these runtime helpers before any database callback runs, which can stall a validation setup without creating records.

**How to apply:** Use a clearly labelled, fixed development-only ID after first querying to confirm it is unused; remove all related records when the test completes. Keep secrets and personal data out of both the ID and logs.