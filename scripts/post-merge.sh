#!/bin/bash
set -e
# Keep post-merge setup deterministic and non-interactive.
pnpm install --frozen-lockfile --prefer-offline
pnpm --filter db push
