---
name: Managed database SSL modes
description: Connection-string SSL behavior needed for both external PostgreSQL and Replit's managed database proxy.
---

Respect an explicit `sslmode` already present in the database connection string. Only default non-local PostgreSQL connections to certificate verification when the connection string does not declare its own mode.

**Why:** Replit's managed development database can route through a local proxy that explicitly does not support SSL. Overriding its declared mode prevents the API from starting after switching away from an external database.

**How to apply:** When changing database connection handling, preserve provider-supplied SSL parameters while retaining a secure verification default for remote URLs that omit them.