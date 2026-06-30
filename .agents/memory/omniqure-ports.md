---
name: OmniQure artifact runtime & port wiring
description: How this monorepo is run by the platform artifact system, and the port wiring between storefront/admin/api in dev
---

# The platform artifact system owns the runtime — do NOT add manual workflows

The `artifacts/*` directories (peptide-sciences, admin-panel, api-server,
mockup-sandbox) are auto-registered as platform **artifacts**. The platform
generates and runs one workflow per artifact, each on its own port:

- `peptide-sciences: web` (storefront) → Vite on **8081**, mapped to external port 80 (main dev domain / canvas iframe)
- `admin-panel: web` → Vite on **8082**
- `api-server: API Server` → Express on **8080** (internal only, no external map)
- `mockup-sandbox: Component Preview Server` → **8083**

**Why this matters:** during migration a set of *manual* `.replit` workflows was
created that duplicated these (storefront on 5000 + a hand-rolled TCP proxy on
8081, admin on 3002, api on 8000). Once the artifact workflows existed, the
duplicates caused two failures: (1) the manual proxy squatted on 8081 so the
artifact storefront failed with "Port 8081 already in use", and (2) two API
servers ran the SAME cron jobs (abandoned-cart / renewal / review emails) in
parallel — duplicate side effects.

**How to apply:** never create manual workflows that mirror an artifact. Let the
artifact system run them. If the storefront artifact fails to bind 8081, check
nothing else is holding 8081. The external-80 → 8081 mapping is the platform's
intended design, not an orphan.

## Dev API proxy wiring
The storefront and admin Vite dev servers proxy `/api` to the api-server. Because
the artifact api-server listens on **8080**, the proxy target is
`http://localhost:${process.env.API_PORT || 8080}` in both
`artifacts/peptide-sciences/vite.config.ts` and
`artifacts/admin-panel/vite.config.ts`. (The proxy is dev-only; production uses
the `router = "application"` deployment that routes through the api-server.)
