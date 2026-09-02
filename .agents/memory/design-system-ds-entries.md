---
name: Design-system entries in the mockup sandbox
description: How DS packages + sandbox ds entries work; preview port is dynamic
---

- New design systems mirror the existing pattern: workspace package `artifacts/<slug>/` (`package.json` exporting ./styles.css, tokens + primitives in styles.css, docs/AGENTS.md), plus a ds-entry copied from the mockup-sandbox skill templates into `artifacts/mockup-sandbox/src/ds/<slug>/` with `__DS_SLUG__` replaced and a `workspace:*` devDep added to the sandbox package.json.
- **Why:** the design-system-creation skill referenced by canvas directives does not exist on disk; `artifacts/omniqure-ops` is the working reference implementation.
- The sandbox dev server binds a **dynamic port** (check `getWorkflowStatus` → `waitForPort`), not the 8083 noted elsewhere; curl/Screenshot must use that port.
- Don't put `@source` paths in the DS package stylesheet pointing at nonexistent dirs; declare `@source "./mockups"` in the sandbox ds-entry stylesheet instead.
- Existing DS: `omniqure-ops` (storefront ops), `omniqure-ember` (warm cream/orange admin-panel template, em-* tokens/primitives).
