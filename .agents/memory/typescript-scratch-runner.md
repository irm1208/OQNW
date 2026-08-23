---
name: Workspace TypeScript scratch runner
description: Where to run one-off TypeScript assertions in this workspace.
---

Use `scripts/node_modules/.bin/tsx` for temporary TypeScript checks from the workspace root.

**Why:** The root workspace and the API package do not expose a `tsx` binary, while the scripts package owns the configured TypeScript runner.

**How to apply:** For a small non-persistent assertion against TypeScript source, invoke the scripts-package binary directly rather than `pnpm exec tsx` from the root or API package.