---
name: Tailwind v4 custom class composition
description: Prevent stylesheet compilation failures when composing project-defined CSS classes.
---

Do not use a project-defined class name inside `@apply` with Tailwind v4. Compose the selectors together or repeat the underlying utility classes instead.

**Why:** Tailwind treats the custom class as an unknown utility and the Vite stylesheet transform fails, leaving every route blank even when TypeScript passes.

**How to apply:** After editing shared CSS, run a Vite production build or load the compiled app; type checking alone cannot detect this failure.