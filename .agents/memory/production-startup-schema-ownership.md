---
name: Production startup schema ownership
description: Why the API must listen without attempting to create database objects.
---

The production API must not execute table or index DDL before opening its HTTP port. Database objects declared in the Drizzle schema are applied through the managed development and publish schema flows.

**Why:** A production-side PostgreSQL DDL error can terminate the API before readiness even when the required tables and indexes already exist, causing an otherwise successful build to fail during autoscale promotion.

**How to apply:** Keep startup limited to opening the server and non-fatal application initialization. Add schema changes to the database source of truth and let publishing reconcile production.