#!/usr/bin/env bash
# Instructor-only: copy the purchased theme's photos, textures, and logo
# into this template's public/ folders (all gitignored). Run from this
# directory. Requires resources/jphotolio-html-bundle to exist locally.
set -euo pipefail

BUNDLE="../jphotolio-html-bundle/jphotoliohtml"
[ -d "$BUNDLE" ] || { echo "Purchased bundle not found at $BUNDLE"; exit 1; }

mkdir -p public/theme public/fixtures

cp "$BUNDLE/css/img/bodypattern.png" \
   "$BUNDLE/css/img/bg-header-pattern.png" \
   "$BUNDLE/css/img/bg-footer-pattern.png" public/theme/
cp "$BUNDLE/images/logo.png" public/theme/

i=1
grep -o 'images/[^"]*-220x[0-9]*\.jpg' "$BUNDLE/masonry.html" | head -12 | \
while read -r img; do
  cp "$BUNDLE/$img" "public/fixtures/fixture-$i.jpg"
  i=$((i + 1))
done

echo "Theme assets imported (local only — they stay gitignored)."
