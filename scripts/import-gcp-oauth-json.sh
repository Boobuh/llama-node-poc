#!/usr/bin/env bash
# Import OAuth credentials downloaded from Google Cloud Console.
# Usage: ./scripts/import-gcp-oauth-json.sh ~/Downloads/client_secret_*.json
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <path-to-downloaded-oauth-json>"
  echo
  echo "In Google Cloud Console:"
  echo "  APIs & Services → Credentials → Create credentials → OAuth client ID"
  echo "  Application type: Desktop app  (NOT Web application)"
  echo "  Download JSON, then run:"
  echo "  $0 ~/Downloads/client_secret_XXXXX.json"
  exit 1
fi

SRC="$(realpath "$1")"
DEST_DIR="${HOME}/.config/google-workspace-mcp"
DEST="${DEST_DIR}/credentials.json"

if [[ ! -f "${SRC}" ]]; then
  echo "ERROR: file not found: ${SRC}"
  exit 1
fi

mkdir -p "${DEST_DIR}"
cp "${SRC}" "${DEST}"
chmod 600 "${DEST}"

echo "Saved: ${DEST}"
echo
echo "Next:"
echo "  1. Restart Cursor fully"
echo "  2. Settings → MCP → google-workspace → enable"
echo "  3. Run auth once:"
echo "       npx -y @dguido/google-workspace-mcp auth"
echo "     (browser opens on localhost — no cursor.com redirect)"
echo "  4. Ask agent to read/update doc 18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw"
