# OmniQure

Research-grade peptide e-commerce site for OmniQure Peptide Research Institute, featuring 81 HPLC-verified peptides with COA, HPLC chromatograms, and ESI-MS data per product.

## Run & Operate

- Three Replit workflows are configured and run automatically: **API Server** (port 8080), **Storefront** (port 5000, main preview), **Admin Panel** (port 8082). Restart them after server-side code changes.
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm run check:api-drift` — verify admin order/customer/refund/fraud response fields match `lib/api-spec/openapi.yaml` (also runs as part of `pnpm run build`)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/omniqure` — the storefront (`@workspace/omniqure`, port 8081). Formerly named `peptide-sciences`; renamed to drop the internal codename in favor of the public OmniQure brand.
- `artifacts/admin-panel` — the admin/ops console (port 8082)
- `artifacts/api-server` — the Express API (port 8080)
- `artifacts/mockup-sandbox` — component preview sandbox (port 8083)

## Architecture decisions

_Populate as you build — non-obvious choices a reader couldn't infer from the code (3-5 bullets)._

## Product

_Describe the high-level user-facing capabilities of this app once they exist._

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Admin routes in `artifacts/api-server/src/routes/admin/*.ts` build responses with `xToResponse`-style mapper functions (e.g. `orderToResponse`, `customerToResponse`, `refundToResponse`) or inline `res.json({...})` literals. Any field added to one of these MUST also be added to the matching schema in `lib/api-spec/openapi.yaml` (e.g. `Order`, `OrderDetail`, `Customer`, `CustomerDetail`, `Refund`, `FraudQueueOrder`) — otherwise the field silently vanishes from generated frontend types instead of causing a build error. Run `pnpm run check:api-drift` (or `pnpm run build`, which includes it) after touching any of these mappers; it fails loudly if a returned field isn't declared in the spec. If the schema feeds generated hooks, also re-run `pnpm --filter @workspace/api-spec run codegen`.
- `/admin/refunds` and `/admin/fraud` routes are not wired into orval codegen — the admin panel calls them with plain `fetch`. Their `Refund`/`FraudQueueOrder`/`FraudStats` OpenAPI schemas exist solely as the source of truth for `check:api-drift`, not for codegen.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
