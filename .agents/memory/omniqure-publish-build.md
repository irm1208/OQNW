---
name: OmniQure publish build
description: Safe production build boundaries for the legacy root publish command.
---

The root publish build must compile the API, storefront, and admin panel, but must not run schema mutation commands.

**Why:** Replit promotes managed PostgreSQL schema differences separately during Publish. Running a database push inside image construction is unsupported, slows packaging, and can fail independently of application compilation. Omitting the admin build can also leave `/admin` serving stale assets.

**How to apply:** Keep database schema changes in the Drizzle source of truth, verify them against development, and let Publish promote them. Ensure every production web artifact is explicitly compiled by the root build while this legacy deployment configuration remains active.