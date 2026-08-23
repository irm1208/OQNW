---
name: Switching git origin to a different GitHub repo
description: How to resolve diverged history when the Replit git origin remote is changed to a GitHub repo with a completely different commit lineage.
---

When the origin remote is pointed at a new GitHub repo whose history is unrelated to the local repo's history, regular `git push` is rejected (non-fast-forward) and Replit's sync shows MERGE_CONFLICT or PUSH_REJECTED.

**Why:** The two repos have no common ancestor. Replit's sync uses a plain `git push`, which requires the remote HEAD to be an ancestor of what's being pushed.

**How to apply:**
1. Do NOT use `remote.origin.push` force-refspec — it causes "Unknown Git Error" in Replit's sync UI.
2. Instead, use `git commit-tree` to create a bridge commit locally whose parent is the remote HEAD (even though that commit object doesn't exist locally — git allows this):
   ```bash
   TREE=$(git cat-file -p HEAD | grep '^tree' | awk '{print $2}')
   NEW=$(echo "message" | git commit-tree $TREE -p <remote-HEAD-sha>)
   git reset --hard $NEW
   ```
3. This makes local exactly 1 commit ahead of origin — a clean fast-forward push.
4. Push the source files to the new remote first via the GitHub Git Data API (blobs→tree→commit→ref PATCH with force:true), so the remote HEAD SHA exists before creating the bridge commit.
