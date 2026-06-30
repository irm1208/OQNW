---
name: OmniQure ports & external-80 routing
description: Why the storefront needs a co-located TCP proxy on 8081, and how external port 80 routing works in this repl
---

# External port 80 routes to local 8081 (not 5000)

`.replit` has a DUPLICATE externalPort-80 mapping: both `localPort=5000→80` and
an orphan `localPort=8081→80`. The router resolves external port 80 to **local
8081**, not 5000 (proven: a throwaway server on 8081 is served on the bare dev
domain, one on 5000 is not).

**Why it matters:** the canvas iframe / public dev domain only reach the app via
external 80 → local 8081. If nothing listens on 8081, the bare domain 502s and the
canvas iframe is blank — even though the Preview pane (internal proxy to 5000)
still works.

## Constraints (verified)
- `.replit` is tool-owned and cannot be hand-edited, so the orphan `8081→80`
  mapping cannot be removed.
- `configureWorkflow` rejects port 8081 outright and locks webview to port 5000;
  reconfiguring 5000 does not clear the orphan.

## Working solution
The storefront runs as a webview on 5000 (Preview pane + `isCanvasWorkflow`
binding) with a raw-TCP proxy (8081→5000) co-located in the SAME process so the
bare domain reaches it. `configureWorkflow` only validates `waitForPort` (5000),
so opening 8081 in-process passes. Use a single supervisor entrypoint (not a shell
`&` background launch) so a proxy bind failure or Vite exit takes the whole
workflow down instead of silently regressing the public URL.

**Symptom → remedy:** bare domain 502s or canvas iframe blank → confirm the
storefront workflow's supervisor is up and logged its `proxy forwarding ...8081`
line; the canvas iframe URL must be the bare dev domain (external 80).
