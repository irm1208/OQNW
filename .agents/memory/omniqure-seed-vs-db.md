---
name: Seed scripts vs live DB content
description: Why editing seed-*.ts source files alone doesn't remove already-seeded content from the database
---

The `seed-blog.ts` and `seed-reviews.ts` seeders in `artifacts/api-server/src/lib/` are idempotent guards, not sync jobs: `seed-blog.ts` skips entirely if any `blog_posts` rows already exist, and `seed-reviews.ts` skips per-product if that product already has approved reviews.

**Why:** This means editing the seed source array (e.g. rewriting review body text, removing a blog section) has zero effect on rows already committed to the DB in a prior session — the seeder never re-runs against existing data. A grep-clean codebase can still serve stale content from the database.

**How to apply:** After any content-removal/rewrite request that touches seeded copy (blog posts, reviews, etc.), always check the live DB for the same pattern (`SELECT ... WHERE body ILIKE '%pattern%'`) in addition to fixing the seed source. If matches exist, directly `UPDATE` the affected rows (or delete + let the seeder repopulate, if full-table skip logic allows it) so dev data matches the cleaned source. Don't assume "grep found nothing in code" means the site is clean — the DB is a separate source of truth once seeded.
