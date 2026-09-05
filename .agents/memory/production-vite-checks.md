---
name: Production Vite checks
description: Environment requirement for checks intended to exercise production-only Vite behavior.
---

Production-build checks must set `NODE_ENV=production` explicitly rather than relying on Vite's build command alone.

**Why:** The workspace shell can export `NODE_ENV=development`, which makes Vite compile development-only branches into an otherwise minified build and defeats checks for publish-only behavior.

**How to apply:** Any test harness that builds a Vite artifact to emulate publishing should override `NODE_ENV` on both its build and preview commands, then verify the resulting behavior at the artifact's real base path.