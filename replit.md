# OmniQure

Research-grade peptide e-commerce site for OmniQure, featuring independently verified peptides and published Janoshik reports where available.

## Run & Operate

- Use **Run → Project** to start the existing artifact workflows: API Server (8080), storefront (8081, main preview), and admin panel (8082, `/imtheonlyadmin/`). Do not add a second storefront or API workflow.
- `pnpm install --frozen-lockfile` — install all workspace dependencies with pnpm 10.26.1.
- On a fresh development database, run `pnpm --filter @workspace/db run push` once before starting the API. The existing API startup scripts populate catalogue and blog content; imported source code does not include historical customer/order data.
- Restart `artifacts/api-server: API Server` after server-side changes. Frontend artifact workflows use Vite hot reload.
- Individual commands require the same environment as their artifact manifests: API `PORT=8080 pnpm --filter @workspace/api-server run dev`; storefront `PORT=8081 BASE_PATH=/ pnpm --filter @workspace/omniqure run dev`; admin `PORT=8082 BASE_PATH=/imtheonlyadmin/ pnpm --filter @workspace/admin-panel run dev`.
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm run check:api-drift` — verify admin order/customer/refund/fraud response fields match `lib/api-spec/openapi.yaml` (also runs as part of `pnpm run build`)
- Required env: `DATABASE_URL` — Postgres connection string
- Required secret: `SESSION_SECRET` — random server-only key used to sign checkout address-confirmation proofs. Address confirmation and ordering fail closed if it is missing.
- Admin access: set `ADMIN_PASSWORD` in Secrets, restart the API, then leave email blank on the admin sign-in screen for initial owner setup. An empty imported database has no owner account, so automatic development login correctly refuses access until an active owner exists. Do not rely on the source-code development password for a shared workspace.
- Optional external services: `RESEND_API_KEY` enables email delivery; the existing Wallid payment provider requires `WALLID_API_KEY_ID`, `WALLID_API_KEY_SECRET`, and its webhook configuration. Without these, the local storefront can be browsed, but live emails and bank payments are not configured.
- Address lookup: checkout uses the public Nominatim/OpenStreetMap API server-side with a PostgreSQL-coordinated 1 request/second limit across API replicas and an 8-second upstream timeout. Checkout asks for country, then postcode/ZIP, then the first address line; after those fields are complete (or just country and street where postal codes are optional), it automatically offers a small list of matching international addresses. Customers can select a match to fill the rest of the address or enter it manually if no match is found. This is not keystroke-by-keystroke autocomplete. No API key is required; `NOMINATIM_USER_AGENT` is an optional non-secret environment variable for a contact-identifying request header.

## Stack

- pnpm workspaces, Node.js 20 (configured Replit module), TypeScript 5.9
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
