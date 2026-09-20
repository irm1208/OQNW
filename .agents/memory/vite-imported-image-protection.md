---
name: Vite imported-image protection
description: Preventing image traffic protection from breaking Vite asset module imports
---

Vite image imports are requested as module URLs containing `?import`. The image traffic protection middleware must pass those requests through instead of applying public-image rate limiting.

**Why:** A 403 response for an imported image is reported by React as “Failed to fetch dynamically imported module” for whichever lazy page imports that asset, leaving the page blank.

**How to apply:** Keep protection on ordinary image URLs, but bypass requests whose query string contains the Vite `import` flag.