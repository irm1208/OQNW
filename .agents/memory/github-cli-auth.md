---
name: GitHub connector and terminal Git
description: GitHub OAuth connection supports API operations but does not automatically authenticate shell Git commands.
---

The Replit GitHub connection can read and write repositories through its secure API proxy, but it does not populate a terminal credential helper, GitHub CLI login, SSH key, or HTTPS token.

**Why:** A connected GitHub account can still leave `git fetch`, `git pull`, and `git push` unauthenticated in the Repl shell.

**How to apply:** For repository repairs, use the connected GitHub API when appropriate. For ongoing shell Git commands, the user must authenticate Git separately through their preferred secure Git/SSH setup; never ask them to paste a token into chat. Full-repository pushes with many or multi-megabyte blobs may exceed the connector API bridge; use the Git pane's native pack transfer instead of reconstructing those pushes through REST calls.