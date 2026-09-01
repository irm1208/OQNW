---
name: Pnpm audit override cleanup
description: Non-obvious pnpm audit --fix behavior in this workspace and how to validate dependency remediations.
---

Treat `pnpm audit --fix` as a starting point, not the final dependency fix.

**Why:** In this workspace it rewrote and reordered `pnpm-workspace.yaml`, generated overlapping advisory-range overrides, and still left a vulnerable Picomatch instance nested under Micromatch. An existing exact esbuild override also silently won over a newly raised manifest range.

**How to apply:** Preserve existing workspace comments and supply-chain settings, inspect `pnpm why` plus lockfile importer entries for every affected package, add a parent-specific override when a vulnerable nested peer remains, and run both full and production-only audits after a real install.