#!/usr/bin/env bash
#
# Export a clean copy of the project for handover.
#
#   ./tools/prepare-handover.sh ../tsqueenmary-handover
#
# Your working copy is left untouched — this only writes to the target folder.
# What it strips is editor and agent configuration, local secrets and build
# output: none of it belongs in a client deliverable, and all of it either
# leaks local paths or goes stale the moment someone else opens the project.
#
# Secrets are deliberately NOT copied. Hand .env and content/collection.json
# to the client separately, through a password manager or an encrypted note —
# never in the repo, and never over email.

set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="${1:-}"

if [[ -z "$DEST" ]]; then
  echo "usage: $0 <destination-folder>" >&2
  exit 1
fi
if [[ -e "$DEST" ]]; then
  echo "refusing to overwrite existing path: $DEST" >&2
  exit 1
fi

mkdir -p "$DEST"

echo "Copying source…"
rsync -a \
  --exclude '.git/' \
  --exclude 'node_modules/' \
  --exclude 'dist/' \
  --exclude '.vite/' \
  --exclude '.claude/' \
  --exclude '.cursor/' \
  --exclude '.vscode/' \
  --exclude '.idea/' \
  --exclude 'AGENTS.md' \
  --exclude 'CLAUDE.md' \
  --exclude '.env' \
  --exclude '.env.local' \
  --exclude 'content/' \
  --exclude '.DS_Store' \
  --exclude '*.log' \
  --exclude '*.tsbuildinfo' \
  --exclude 'tools/prepare-handover.sh' \
  "$SRC"/ "$DEST"/

# The sealed payload is safe to ship (it is ciphertext), but the plaintext it
# was made from is not. Leave a stub so the next person knows what goes here.
mkdir -p "$DEST/content"
cat > "$DEST/content/README.md" <<'EOF'
# Private collection content

`collection.json` belongs in this folder. It holds the plaintext descriptions
of the Fabergé pieces and is deliberately kept out of version control — see
the "private collection page" section of the project README.

Ask the site owner for the current copy, along with the access code, then run:

    npm run seal

That regenerates the encrypted file in `public/` that the website actually
serves. The plaintext never leaves this folder.
EOF

echo "Writing handover notes…"
cat > "$DEST/HANDOVER.md" <<'EOF'
# Handover

This folder is the complete source for the Friends of TS Queen Mary website.

## What you need before you can build

- Node 22.12 or newer (`nvm use` will pick it up from `.nvmrc`)
- The `.env` file, supplied separately
- `content/collection.json`, supplied separately

## First run

    nvm use
    npm install
    npm run dev

## Everything else

`README.md` covers the build, the image pipeline, the private collection page
and deployment. `CLIENT-GUIDE.md` is the plain-English version written for the
charity's trustees.
EOF

echo "Starting a fresh history…"
git -C "$DEST" init -q
git -C "$DEST" add -A
git -C "$DEST" -c user.name="${GIT_AUTHOR_NAME:-$(git config user.name || echo 'Studio')}" \
               -c user.email="${GIT_AUTHOR_EMAIL:-$(git config user.email || echo 'hello@example.com')}" \
               commit -q -m "Friends of TS Queen Mary website"

echo
echo "Done: $DEST"
echo
echo "Remaining checks before you send it:"
grep -ril "localhost\|/Users/\|TODO\|FIXME" "$DEST" \
  --include='*.ts' --include='*.tsx' --include='*.json' --include='*.md' \
  --exclude-dir=node_modules 2>/dev/null \
  | sed 's|^|  check: |' || true
echo
echo "  Hand over .env and content/collection.json separately."
