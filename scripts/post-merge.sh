#!/bin/bash
set -e

pnpm install --frozen-lockfile
pnpm --filter db push

# Install the post-commit git hook so every commit also syncs to GitHub.
HOOK_FILE="$(git rev-parse --show-toplevel)/.git/hooks/post-commit"
HOOK_BODY='#!/bin/sh
# Auto-installed by scripts/post-merge.sh — syncs to GitHub after every commit.
REPO_ROOT="$(git rev-parse --show-toplevel)"
if [ -f "$REPO_ROOT/scripts/github-sync.sh" ]; then
  bash "$REPO_ROOT/scripts/github-sync.sh" || true
fi'

if [ ! -f "$HOOK_FILE" ] || ! grep -q "github-sync" "$HOOK_FILE" 2>/dev/null; then
  printf '%s\n' "$HOOK_BODY" > "$HOOK_FILE"
  chmod +x "$HOOK_FILE"
  echo "[post-merge] Installed post-commit hook at $HOOK_FILE"
fi

# Sync to GitHub now (covers the merge itself).
bash "$(git rev-parse --show-toplevel)/scripts/github-sync.sh"
