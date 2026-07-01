---
name: admin-panel API call routing
description: Why admin-panel fetch() calls must use absolute /api/... and never prepend BASE_URL
---

# Admin panel API calls must be absolute `/api/...`, never `${BASE}/api/...`

The admin-panel artifact is served under a base path (`BASE_PATH=/admin/`, set in
`artifacts/admin-panel/.replit-artifact/artifact.toml` under `[services.env]`). So
`import.meta.env.BASE_URL` is `/admin/`.

**Rule:** all `fetch()` calls to the backend must target absolute `/api/...`. Do NOT
prefix with `BASE` / `BASE_URL` (e.g. `${BASE}/api/...` → `/admin/api/...`).

**Why:** the platform router (`router = "path"`) dispatches by top-level path prefix:
`/api/*` → api-server (port 8080), `/admin/*` → admin-panel's own vite dev server
(port 8082). A request to `/admin/api/...` therefore hits the admin panel's vite
server (which only proxies bare `/api` and otherwise SPA-404s), never reaching the
API. In the browser this surfaces as a thrown fetch / `res.json()` failure — e.g.
the login page showed "Connection error — please try again" (its catch-block
message), which looks like a network/server outage but is actually a wrong-URL 404.

**How to apply:** when adding admin API calls or an `api()` helper, use
`` `/api/${path}` `` (or plain `/api/...`). If you see `const BASE = import.meta.env.BASE_URL...`
used only to build API URLs, that's the bug. Verify routing through the real proxy,
not just localhost: `curl https://$REPLIT_DEV_DOMAIN/api/admin/auth/login` (reaches
API, 401/200) vs `.../admin/api/admin/auth/login` (404 from vite).
