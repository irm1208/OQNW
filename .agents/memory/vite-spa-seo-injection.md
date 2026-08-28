---
name: Route SEO across dev and static production
description: How OmniQure must deliver route-specific initial HTML in both Vite previews and the static production web artifact.
---

# Deliver route HTML in both serving models

For route-specific product/blog metadata, Vite's `transformIndexHtml` hook does
not reliably receive the original browser-history route once its fallback serves
the SPA shell. Use early dev and preview middleware to fetch public metadata,
transform the shell, and inject the page head before the fallback response.

The published web artifact is served as static files, so Vite
`configureServer`/`configurePreviewServer` middleware does not run there. Any
production route that needs a non-generic crawler head must also have a
build-emitted HTML document that production routing selects before the SPA
fallback, or it must move behind a runnable server.

**Why:** dev and preview checks can pass while the published static artifact
still returns the generic root document to social crawlers.

**How to apply:** test both the Vite route response and the built static output
plus its production rewrite. Use the same `data-seo` IDs as the browser
`useSEO` hook so hydration updates or removes stale structured data. For
metadata backend outages, return a retryable failure rather than a successful
page with incorrect generic metadata.