#!/usr/bin/env bash
#
# Build both sites and publish each to its own GitHub Pages deployment.
#
#   ./tools/deploy.sh            build and push both
#   ./tools/deploy.sh public     just the charity site
#   ./tools/deploy.sh collection just the private collection
#   ./tools/deploy.sh build      build both, publish neither
#
# Each site is pushed to the gh-pages branch of its own repository. The
# branch is a publish target, not history: it is force-pushed every time and
# nothing but build output ever lives on it. The source of truth is main.
#
# Requires .env (VITE_PRIVATE_PATH_HASH, VITE_PRIVATE_ASSET). Without it the
# collection build produces a site where every path is a dead end.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OWNER="rajkumar-code29"
PUBLIC_REPO="tsqm"
COLLECTION_REPO="tsqm-collection"

PUBLIC_URL="https://${OWNER}.github.io/${PUBLIC_REPO}"
COLLECTION_URL="https://${OWNER}.github.io/${COLLECTION_REPO}"

WHICH="${1:-both}"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }

# --------------------------------------------------------------------------
# Build
# --------------------------------------------------------------------------

build_public() {
  say "Building the charity site -> dist/public"
  BUILD_TARGET=public PUBLIC_BASE="/${PUBLIC_REPO}/" npm run build

  local out="dist/public"

  # GitHub Pages has no rewrite rules, so a client-side router needs 404.html
  # to be the app itself. Pages serves it for any path it does not recognise,
  # keeping the URL intact, and the router then takes over.
  cp "$out/index.html" "$out/404.html"

  # Without this, Pages runs the output through Jekyll, which silently drops
  # files and folders whose names begin with an underscore.
  touch "$out/.nojekyll"

  # The sealed collection belongs to the other site and must never be served
  # from the public one. Named exactly, from .env, so this cannot quietly
  # start deleting something else.
  local asset
  asset="$(sed -n 's/^VITE_PRIVATE_ASSET[[:space:]]*=[[:space:]]*//p' .env | head -1 | tr -d "\"'" | tr -d '[:space:]')"
  if [ -n "$asset" ]; then rm -f "$out/${asset}.json"; fi

  # robots/sitemap ship pointing at the charity's real domain; on Pages they
  # have to describe where the site actually is.
  cat > "$out/robots.txt" <<EOF
User-agent: *
Allow: /

Sitemap: ${PUBLIC_URL}/sitemap.xml
EOF
  if [ -f "$out/sitemap.xml" ]; then
    sed -i '' "s|https://www.tsqueenmary.org.uk|${PUBLIC_URL}|g" "$out/sitemap.xml"
  fi
}

build_collection() {
  say "Building the private collection -> dist/collection"
  BUILD_TARGET=collection COLLECTION_BASE="/${COLLECTION_REPO}/" \
    VITE_PUBLIC_SITE_URL="${PUBLIC_URL}/" npm run build

  local out="dist/collection"

  # Vite names the output after its entry; Pages wants index.html.
  mv "$out/collection.html" "$out/index.html"
  cp "$out/index.html" "$out/404.html"
  touch "$out/.nojekyll"

  # This site is not the charity's site. It carries none of its photography
  # and nothing that describes what it is.
  find "$out/img" -type f ! -name 'tsqm-roundel.svg' -delete 2>/dev/null || true
  find "$out/img" -type d -empty -delete 2>/dev/null || true
  rm -f "$out/sitemap.xml" "$out/_headers"

  cat > "$out/robots.txt" <<'EOF'
User-agent: *
Disallow: /
EOF
}

# --------------------------------------------------------------------------
# Publish
# --------------------------------------------------------------------------

publish() {
  local dir="$1" repo="$2" label="$3"
  say "Publishing ${label} -> ${OWNER}/${repo} (gh-pages)"

  local name email
  name="$(git config user.name || echo 'deploy')"
  email="$(git config user.email || echo 'deploy@example.com')"

  (
    cd "$dir"
    rm -rf .git
    git init -q
    git checkout -q -b gh-pages
    git add -A
    git -c user.name="$name" -c user.email="$email" \
        commit -q -m "Deploy ${label} — $(date -u '+%Y-%m-%d %H:%M UTC')"
    git push -q --force "https://github.com/${OWNER}/${repo}.git" gh-pages
    rm -rf .git
  )
}

# --------------------------------------------------------------------------

case "$WHICH" in
  build)      build_public;     build_collection ;;
  public)     build_public;     publish dist/public     "$PUBLIC_REPO"     "charity site" ;;
  collection) build_collection; publish dist/collection "$COLLECTION_REPO" "collection" ;;
  both)
    build_public
    build_collection
    publish dist/public     "$PUBLIC_REPO"     "charity site"
    publish dist/collection "$COLLECTION_REPO" "collection"
    ;;
  *) echo "usage: $0 [public|collection|both]" >&2; exit 1 ;;
esac

say "Done"
if [ "$WHICH" = "build" ]; then
  echo "  dist/public      -> would publish to ${PUBLIC_URL}/"
  echo "  dist/collection  -> would publish to ${COLLECTION_URL}/"
  exit 0
fi
echo "  charity site: ${PUBLIC_URL}/"
if [ "$WHICH" != "public" ]; then
  echo "  collection:   ${COLLECTION_URL}/<private path from .env>"
fi
