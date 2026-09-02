---
name: Admin session trust boundary
description: Security rule for authenticating OmniQure admin API requests.
---

Never treat a static or unsigned browser cookie as proof of administrator access. Every admin API route must pass the signed, expiring admin-session verifier, including routes mounted outside the main admin directory. Manual wholesale creation may skip the short recent-auth window, but never the signed-session check. Shared-owner recovery may bootstrap an empty/fully disabled admin set or claim the sole active owner until mandatory MFA is enrolled; it must stop once an MFA-protected active owner exists.

**Why:** A legacy marker cookie was accepted directly by many admin routes. Since visitors can create arbitrary cookies, that pattern turns a convenience marker into an authorization bypass. Manual payment creation is a normal authenticated admin workflow, so forcing a second login after the recent-auth window interrupts it without replacing the signed session boundary. A signed recovery cookie can create a similar lingering bypass if its eligibility is checked only at login rather than on every privileged request.

**How to apply:** Keep a central signed-session gate over the complete admin URL namespace, use the same verifier for exceptional admin-capable routes, and re-check recovery eligibility on every privileged request. If adding a recent-auth exception, scope it to the exact route and method rather than weakening admin authentication globally. Recovery must transition the sole owner into MFA enrollment, never grant a lasting bypass; forged or no-longer-eligible sessions receive 401.