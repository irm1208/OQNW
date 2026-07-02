---
name: Bulk text/token removal in TSX files can break JSX syntax
description: Regex/string bulk-replace of a term (e.g. removing a feature name across the codebase) can silently delete adjacent JSX punctuation, producing syntax errors that only surface at typecheck/build time.
---

When bulk-removing a term or feature reference across many `.tsx` files (e.g. stripping all mentions of a deprecated field/feature), a naive find-and-replace can accidentally consume adjacent JSX syntax if the term appears inside a `{...}` expression or near a closing tag — e.g. replacing `{getFooStr(x)}` with `{getFooStr(x)` drops the closing brace.

**Why:** This happened while removing all HPLC references from the OmniQure storefront — a bulk replace left `ProductPage.tsx` with a dangling `{getPurityStr(product.id)</span>` (missing `}`), which only failed at `tsc`/vite build time, not at edit time, and produced confusing downstream HMR/babel parse errors in unrelated files.

**How to apply:** After any bulk text/token removal across `.tsx`/`.jsx` files, always run a full typecheck (`pnpm run typecheck` or equivalent) before considering the task done — don't rely solely on grep confirming the term is gone. A clean grep result does not mean the JSX is still syntactically valid.
