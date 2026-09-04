---
name: Publish schema diff starts from development
description: How a valid schema declaration can still produce no production migration during publishing.
---

Publishing compares the managed development database to production; it does not infer missing production tables directly from committed Drizzle schema files.

**Why:** A broken or mismatched post-merge package filter can silently leave the development database unchanged. Publish then correctly reports no diff while the deployed code fails on missing relations.

**How to apply:** After adding database objects, verify they exist in the managed development database and that the publish schema diff contains the intended non-destructive statements. Also ensure post-merge database commands target the package's exact workspace name.