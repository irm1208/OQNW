---
name: Protected assets in static web artifacts
description: How to enforce request-time controls when the published web artifact uses static serving.
---

Production web artifacts configured with static serving do not run Vite development or preview middleware. Request-time controls placed only in a Vite plugin therefore protect development traffic but are bypassed after publishing.

**Why:** Static artifact files are served directly by the platform. Any protected asset left in the public build remains downloadable without reaching application middleware, even if the normal UI points at a protected URL.

**How to apply:** Serve protected files from an API route that performs the control, update application and SEO URLs to that route, and remove the duplicate files from the static production build. A development-only Vite middleware may still cover original public paths during local work.