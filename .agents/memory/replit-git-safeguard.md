---
name: Replit Git mutation safeguard
description: How to proceed when a narrowly scoped Git write is blocked by Replit's workspace safety guard.
---

When a Git write is blocked with a Replit safeguard message, inspect the exact operation and affected paths first. If the operation is necessary and scoped, rerun that same command with `DANGEROUSLY_ALLOW_GIT=1`; do not broaden it to a commit, reset, or other unrelated mutation.

**Why:** The safety guard blocks workspace `.git` mutations by default, including staging a resolved conflict, and explicitly documents the opt-in for proceeding.

**How to apply:** Use this for necessary, narrowly scoped Git writes such as staging only the files whose merge conflicts were resolved. Recheck the index afterward to confirm the intended effect.
