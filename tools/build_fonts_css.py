#!/usr/bin/env python3
"""Turn a Google Fonts css2 response into self-hosted @font-face rules."""
import json, re, subprocess, sys, os

UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
      "AppleWebKit/537.36 Chrome/120 Safari/537.36")
KEEP = {"latin", "latin-ext"}          # the site is English-only

css = open(sys.argv[1]).read()
os.makedirs("public/fonts", exist_ok=True)
rules = []

for subset, blk in re.findall(r'/\*\s*([a-z0-9-]+)\s*\*/\s*(@font-face\s*\{.*?\})', css, re.S):
    if subset not in KEEP:
        continue
    fam   = re.search(r"font-family: '([^']+)'", blk).group(1)
    style = re.search(r"font-style: (\w+)", blk).group(1)
    wght  = re.search(r"font-weight: ([\d ]+);", blk).group(1).strip()
    url   = re.search(r"url\((https://[^)]+)\)", blk).group(1)
    rng   = re.search(r"unicode-range: ([^;]+);", blk).group(1)
    name  = f"{fam.lower().replace(' ', '-')}-{style}-{subset}.woff2"
    subprocess.run(["curl", "-sSf", "-A", UA, url, "-o", f"public/fonts/{name}"], check=True)
    rules.append(f"""@font-face {{
  font-family: '{fam}';
  font-style: {style};
  font-weight: {wght};
  font-display: swap;
  src: url('/fonts/{name}') format('woff2');
  unicode-range: {rng};
}}""")

open("src/fonts.css", "w").write(
    "/* Self-hosted webfonts: no visitor data ever reaches a third-party font CDN,\n"
    "   which keeps the site GDPR-clean and lets the CSP forbid outside origins.\n"
    "   Regenerate with tools/fetch-fonts.sh */\n\n" + "\n\n".join(rules) + "\n")
print(f"{len(rules)} faces written")
