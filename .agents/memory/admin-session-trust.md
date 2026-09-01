---
name: Admin session trust boundary
description: Security rule for authenticating OmniQure admin API requests.
---

Never treat a static or unsigned browser cookie as proof of administrator access. Every admin API route must pass the signed, expiring admin-session verifier, including routes mounted outside the main admin directory.

**Why:** A legacy marker cookie was accepted directly by many admin routes. Since visitors can create arbitrary cookies, that pattern turns a convenience marker into an authorization bypass.

**How to apply:** Keep a central signed-session gate over the complete admin URL namespace, use the same verifier for any exceptional admin-capable routes, and test that a forged marker cookie receives 401 while a genuine signed session succeeds.