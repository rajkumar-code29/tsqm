#!/usr/bin/env bash
# Re-download the self-hosted webfonts (latin + latin-ext subsets only) and
# rewrite src/fonts.css. Run from the project root after changing families.
set -euo pipefail
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36"
SPEC="family=Inter:wght@300..600&family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap"
mkdir -p public/fonts
curl -sSf -A "$UA" "https://fonts.googleapis.com/css2?$SPEC" -o /tmp/tsqm-gf.css
python3 tools/build_fonts_css.py /tmp/tsqm-gf.css
