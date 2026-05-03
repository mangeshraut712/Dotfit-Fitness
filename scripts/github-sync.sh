#!/bin/bash
# Pushes the current HEAD to GitHub (mangeshraut712/Dotfit-Fitness).
#
# REQUIREMENTS:
#   - GITHUB_TOKEN secret must be set in Replit Secrets (Settings → Secrets).
#     The token needs at least "repo" scope.
#
# SECURITY:
#   - GITHUB_TOKEN is read from the environment and supplied via GIT_ASKPASS.
#   - The token is never written to .git/config, process arguments, or any file.
#
# SYNC STRATEGY:
#   - Replit is the single source of truth; GitHub is a read-only mirror.
#   - --force is intentional: GitHub may diverge from Replit (e.g. after a
#     rebase or history rewrite on the Replit side). Force-pushing keeps the
#     mirror accurate. Direct pushes to GitHub are discouraged.
set -euo pipefail

GITHUB_REPO="https://oauth2@github.com/mangeshraut712/Dotfit-Fitness.git"

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "[github-sync] WARNING: GITHUB_TOKEN is not set — skipping GitHub sync." >&2
  echo "[github-sync] Add GITHUB_TOKEN (repo scope) to Replit Secrets to enable sync." >&2
  exit 0
fi

# Create a minimal askpass helper that reads the token from the environment.
# The script itself contains no secret value; the token travels only via env var.
ASKPASS=$(mktemp /tmp/git-askpass-XXXXXX)
chmod 700 "$ASKPASS"
printf '#!/bin/sh\nprintf "%%s" "${GITHUB_TOKEN}"\n' > "$ASKPASS"

cleanup() { rm -f "$ASKPASS"; }
trap cleanup EXIT

GIT_ASKPASS="$ASKPASS" git push --force "$GITHUB_REPO" HEAD:main
echo "[github-sync] Pushed to GitHub successfully."
