#!/usr/bin/env bash
# Capture PNG screenshots from HTML previews (requires google-chrome).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
HTML_DIR="$ROOT/screenshots/_html"
OUT="$ROOT/screenshots"
node "$ROOT/write-html-previews.mjs"
for f in "$HTML_DIR"/*.html; do
  base=$(basename "$f" .html)
  google-chrome --headless=new --disable-gpu --window-size=1024,800 \
    --screenshot="$OUT/${base}.png" "file://$f" 2>/dev/null
  echo "Captured ${base}.png"
done
