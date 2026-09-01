---
name: Publishing preflight failures
description: How to distinguish a stuck Replit publishing state from a deployment build or runtime failure.
---

If Republish immediately shows Failed but `listDeploymentBuilds` contains no new build, treat it as a publishing preflight or stale deployment-state problem rather than a code failure.

**Why:** Build logs, runtime logs, and application fixes cannot explain an attempt that never creates a build record. Old `SIGTERM` lines are normal instance replacement and may be misleading.

**How to apply:** Confirm the workspace release checks pass and the deployment configuration is valid, then cancel any hung publish and restart workspace compute before retrying. Do not change database connections merely because an informational external-database banner is visible.