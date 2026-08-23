---
name: OmniQure API spec drift check
description: How the check:api-drift script works, what it covers, and when to run it after touching admin API response shapes.
---

`pnpm run check:api-drift` (implementation: `scripts/src/check-api-drift.ts`) statically extracts field names returned by admin response builders in `artifacts/api-server/src/routes/admin/*.ts` (mapper functions like `orderToResponse`/`customerToResponse`/`refundToResponse`, plus a few inline route response literals) and fails if any field isn't declared on the matching schema in `lib/api-spec/openapi.yaml`.

**Why:** the API server can add a new response field without the OpenAPI spec being updated, and TypeScript won't catch this — generated frontend types just silently omit the field instead of erroring. This bit the codebase twice already (fraudScore/refundedAmountGbp, then address1/postcode/phone/lastSeenCountry/lastSeenIp).

**How to apply:** run `pnpm run check:api-drift` (also runs as part of `pnpm run build`) after touching any `xToResponse`-style mapper or admin route response shape. It only checks one direction — code fields must be a subset of spec fields; it does not flag spec fields missing from code (routes are allowed to omit optional fields). The check is a curated list of extraction rules (see the `checks` array in the script) anchored to specific function names/text in specific files — if you rename or restructure one of those functions, the check will throw "could not locate" rather than silently skip, so update the anchor in the script.

`/admin/fraud` and `/admin/refunds` routes aren't wired into orval codegen (admin panel calls them with plain `fetch`), but their `Refund`/`FraudQueueOrder`/`FraudStats` schemas were still added to openapi.yaml purely so this check has something to validate against.
