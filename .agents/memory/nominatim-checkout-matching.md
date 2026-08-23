---
name: Nominatim checkout matching
description: The checkout uses public Nominatim mapping rather than a paid deliverability provider.
---

Use public Nominatim only as a server-side mapped-address confirmation, not as proof of carrier deliverability.

**Why:** The user chose Nominatim to avoid an API-key cost. Its OpenStreetMap results can normalize and locate addresses, but do not guarantee that a carrier can deliver to them.

**How to apply:** Keep OpenStreetMap attribution visible and state the carrier-delivery caveat in checkout. Prefer the country → postcode/ZIP → first address line order, show suggestions automatically after the required fields are complete (never per keystroke), and provide a manual-entry fallback when no match is found. Coordinate requests across API replicas to one per second and enforce an upstream deadline. Countries whose postal codes are optional must still allow street-only lookup. Require a server-only signing secret for address proofs, and reject proofs when their canonical address no longer matches the order.