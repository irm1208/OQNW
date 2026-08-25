---
name: Catalogue seed price preservation
description: How catalogue startup seeding must coexist with prices managed through the admin panel.
---

# Catalogue seed price preservation

When a catalogue seed runs on application startup, it may insert missing SKUs and refresh safe reference metadata, but it must not update an existing product's price.

**Why:** Admin price edits are live database data. A conflict-upsert that writes the seed price silently reverses those edits at the next API restart, making storefront pricing appear unreliable even when the frontend correctly reads the API.

**How to apply:** Keep pricing out of the conflict-update set for existing catalogue rows. Confirm a representative admin-edited price through the API before and after restarting the API whenever catalogue seed behavior changes.