---
name: GitHub large repository imports
description: Importing a large private repository through the GitHub connector can require staged, rate-limit-aware file retrieval.
---

For large private GitHub repositories, stage files before replacing the workspace and resume only missing files after a rate limit; do not erase the current project before the staged copy is complete.

**Why:** The GitHub archive download route may be blocked by its redirect flow, while high-parallel per-file API retrieval can trigger secondary rate limits.

**How to apply:** Fetch the recursive tree through the connected API, stage blob contents outside the workspace, verify the staged file count, and use lower concurrency plus backoff for only the failed paths before performing the replacement.