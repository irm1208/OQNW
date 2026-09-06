---
name: Managed PostgreSQL CLI connections
description: Safe connection handling for pg_dump and pg_restore in Replit environments with overlapping database variables.
---

When invoking PostgreSQL CLI tools, derive an isolated set of `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, and `PGSSLMODE` values from `DATABASE_URL`. Remove ambient `PG*` connection variables first.

**Why:** Replit environments can expose both a managed proxy URL and individual PostgreSQL variables for a different route. Letting libpq combine them can treat the URL as a database name or connect to the wrong host. Passing the full URL as a command argument also exposes credentials in process listings.

**How to apply:** Parse the URL in the parent process, pass credentials only through the child environment, preserve an explicit `sslmode`, and default absent remote SSL configuration to certificate verification.