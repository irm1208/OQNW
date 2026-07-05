---
name: Marketing copy is scattered widely
description: Promo mechanics (bundle tiers, referral terms, discount thresholds) get restated in many unrelated-looking files; a copy change must be swept across the whole app.
---

When a promo/pricing mechanic changes (e.g. tier thresholds, discount type, stacking rules), the copy describing it is not confined to the obvious "feature" page. In this codebase a single Bundle & Save tier change touched: the bundle page itself, the homepage hero slide, the homepage promo strip, two other listing-page promo strips (PopularPeptides, AllPeptides), the announcement bar ticker, the chatbot's canned answers, the referral page copy + FAQ, the account page's referral explainer, and the legal Terms page's referral/discount clause.

**Why:** These restatements exist because each page was written independently with hardcoded numbers/strings rather than referencing a single source of truth. Nothing enforces consistency, so stale copy silently survives a "successful" refactor that only touched the feature's primary page and core logic.

**How to apply:** After changing a promo mechanic, grep the entire frontend app (not just the feature's own page) for the old numeric values, thresholds, and descriptive phrases (e.g. "20%", "11+", "up to X%") before considering the task done. Don't rely on having edited "all the files you can think of" — do the exhaustive grep pass as a required last step, since new hits often turn up in FAQ/legal/chatbot/announcement-bar files that aren't part of the mental model of "the bundle feature."
