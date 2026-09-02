---
name: Artifact manifest ID stability
description: Why route edits must preserve the registered artifact identity.
---

When changing an existing artifact's path, preserve its currently registered artifact ID exactly. Do not copy a legacy or template ID from a sibling edit file into the live manifest.

**Why:** A Vite app can build and run locally with a mismatched ID, while publishing fails before the build with an invalid discovered artifact-ID error.

**How to apply:** Start from the live manifest, change only the requested route fields, and confirm the ID still matches the registered artifact before suggesting publication.