---
name: Production Vite checks
description: Environment requirement for checks intended to exercise production-only Vite behavior.
---

Production-build checks must set `NODE_ENV=production` explicitly rather than relying on Vite's build command alone.

**Why:** The workspace shell can export `NODE_ENV=development`, which makes Vite compile development-only branches into an otherwise minified build and defeats checks for publish-only behavior.

Development-only preview instrumentation can also corrupt explicit generic JSX tags by inserting metadata between a component name and its type arguments. This caused a publishing build to fail even though the original TypeScript was valid.

**How to apply:** Any test harness that builds a Vite artifact to emulate publishing should override `NODE_ENV` on both its build and preview commands, then verify the resulting behavior at the artifact's real base path.

Keep production mode explicit at build entry points as well. If a build error shows injected metadata absent from the source, inspect whether preview instrumentation was enabled before treating it as a source syntax error. Prefer inferred component props when practical.