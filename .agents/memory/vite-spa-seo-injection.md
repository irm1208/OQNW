---
name: Vite SPA fallback SEO injection
description: How OmniQure routes product and blog metadata into initial SPA HTML without leaving stale structured data after hydration.
---

# Intercept route HTML before Vite's history fallback

For route-specific product/blog metadata, Vite's `transformIndexHtml` hook does
not reliably receive the original browser-history route once its fallback serves
the SPA shell. Use early dev and preview middleware to fetch public metadata,
transform the shell, and inject the page head before the fallback response.

**Why:** the fallback otherwise returns the generic home-page head to crawlers,
even though React eventually changes metadata in the browser.

**How to apply:** when adding a prerendered route, use the same `data-seo` IDs
as the browser `useSEO` hook (`product`, `article`, `breadcrumb`) so hydration
updates the initial scripts and client navigation removes stale structured data.
For a metadata backend outage, return a retryable failure rather than a
successful page with incorrect generic metadata.