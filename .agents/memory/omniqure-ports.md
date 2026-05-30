---
name: OmniQure port setup
description: Port assignments for all three services and why they must stay this way
---

Port layout for OmniQure monorepo (critical for external access):

| Service | localPort | externalPort | Path | Notes |
|---|---|---|---|---|
| Storefront (peptide-sciences) | 8081 | 80 | / | Must be 8081 — externalPort 80 is the root URL |
| Admin panel | 8082 | 3002 | /admin/ | |
| API server | 8080 | 8080 | /api | |

**Why:** Replit's proxy maps localPort 8081 → externalPort 80 (the main public URL). The storefront was originally on port 25553 (externalPort 3000) which made it unreachable at the root URL externally.

**How to apply:** If the storefront port ever changes back to 25553, external users will hit a blank page. Always keep storefront on 8081. artifact.toml and workflow env var must both use PORT=8081.

DB: All tables pushed via `pnpm --filter @workspace/db run push-force`. Catalog seeds automatically on first `/api/products` request.
Admin password: stored in ADMIN_PASSWORD env var (userenv.shared in .replit).
