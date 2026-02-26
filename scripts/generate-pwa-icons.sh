#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_ICON="$ROOT_DIR/public/favicon.svg"

if [[ ! -f "$SOURCE_ICON" ]]; then
  echo "Missing source icon at $SOURCE_ICON"
  exit 1
fi

sips -s format png "$SOURCE_ICON" --resampleWidth 192 --out "$ROOT_DIR/public/web-app-manifest-192x192.png" >/dev/null
sips -s format png "$SOURCE_ICON" --resampleWidth 512 --out "$ROOT_DIR/public/web-app-manifest-512x512.png" >/dev/null

echo "Generated PWA icons in public/:"
echo "- web-app-manifest-192x192.png"
echo "- web-app-manifest-512x512.png"
