---
name: Orval and Zod isolation
description: Why generated API validators use a separate Zod major version from the rest of the workspace
---

Keep the shared workspace Zod catalog on v3, but declare Zod v4 directly in the generated API-validator package. The current Orval generator emits v4-only APIs and v4 coercion types.

**Why:** Regenerating with current Orval against shared Zod v3 breaks request inference in unrelated API routes. Pinning the older generator that produced v3 output is blocked by the package firewall, while upgrading the whole workspace to Zod v4 is unnecessarily broad.

**How to apply:** After OpenAPI changes, use the current generator normally and verify library plus API typechecks. Do not move the validator package back to the shared Zod catalog unless the generator gains verified v3-compatible output. Where Zod-aware adapters expose both v3 and v4 overloads, keep application schemas on v3 and use a narrow typed adapter at that integration boundary rather than upgrading the entire form stack.