---
name: One-time production data snapshots
description: How fixed operational data snapshots should reach production without overwriting later administrator edits.
---

Fixed data snapshots that must reach production on publish should use a schema-managed, database-claimed patch version. Claim the version and apply the data changes in one transaction after prerequisite seed rows exist.

**Why:** Replit publish applies schema differences but does not normally copy development row values. Unconditional startup seeding would overwrite later administrator-managed inventory on every restart and across autoscale replicas.

**How to apply:** Add the patch marker schema through the normal development/publish schema flow. At runtime, insert a unique patch ID with conflict protection inside the same transaction as the updates; skip the updates when the marker already exists.