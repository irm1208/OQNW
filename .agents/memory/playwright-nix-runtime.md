---
name: Playwright on the Replit Nix runtime
description: Environment constraints for reliable Playwright validation in this workspace.
---

Downloaded Playwright Chromium requires its Linux GUI/shared-library dependencies to be declared in the Replit Nix environment. For long route sweeps, use one browser worker and run viewport projects sequentially.

**Why:** Chromium otherwise fails at launch on missing shared libraries, while concurrent full-admin route sweeps can exhaust the preview process and close browser contexts even when the assertions themselves pass.

**How to apply:** Preserve the explicit browser runtime packages in the Replit environment and prefer one worker for broad admin navigation matrices. Parallelize only smaller isolated browser checks.