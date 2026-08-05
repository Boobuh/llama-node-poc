#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="${HOME}/.config/environment.d/google-drive-mcp.conf"
MCP_JSON="${HOME}/.cursor/mcp.json"

echo "=== Google Drive MCP setup for Cursor ==="
echo

if [[ ! -f "${MCP_JSON}" ]]; then
  echo "ERROR: ${MCP_JSON} not found."
  echo "Create it with the google-drive entry (see GOOGLE_DOC_SYNC.md)."
  exit 1
fi

if [[ -z "${GOOGLE_DRIVE_MCP_CLIENT_ID:-}" || -z "${GOOGLE_DRIVE_MCP_CLIENT_SECRET:-}" ]]; then
  echo "OAuth env vars are NOT set in this shell."
  echo
  echo "1. Google Cloud Console: https://console.cloud.google.com/"
  echo "   - Enable: drive.googleapis.com + drivemcp.googleapis.com"
  echo "   - OAuth consent screen (External + add yourself as test user)"
  echo "   - Scopes: drive.readonly, drive.file"
  echo "   - Credentials → Create OAuth client → Web application"
  echo "   - Redirect URI: https://www.cursor.com/agents/mcp/oauth/callback"
  echo
  echo "2. Save credentials to ${ENV_FILE}:"
  echo "   mkdir -p ~/.config/environment.d"
  echo "   cp scripts/google-drive-mcp-env.example ${ENV_FILE}"
  echo "   # edit with your CLIENT_ID and CLIENT_SECRET"
  echo
  echo "3. Reload environment and restart Cursor:"
  echo "   systemctl --user import-environment 2>/dev/null || true"
  echo "   # fully quit Cursor, then reopen from app launcher"
  echo
  exit 1
fi

echo "GOOGLE_DRIVE_MCP_CLIENT_ID: set (${#GOOGLE_DRIVE_MCP_CLIENT_ID} chars)"
echo "GOOGLE_DRIVE_MCP_CLIENT_SECRET: set (${#GOOGLE_DRIVE_MCP_CLIENT_SECRET} chars)"
echo

mkdir -p "${HOME}/.config/environment.d"
if [[ ! -f "${ENV_FILE}" ]]; then
  cat > "${ENV_FILE}" <<EOF
GOOGLE_DRIVE_MCP_CLIENT_ID=${GOOGLE_DRIVE_MCP_CLIENT_ID}
GOOGLE_DRIVE_MCP_CLIENT_SECRET=${GOOGLE_DRIVE_MCP_CLIENT_SECRET}
EOF
  chmod 600 "${ENV_FILE}"
  echo "Wrote ${ENV_FILE}"
else
  echo "Already exists: ${ENV_FILE} (not overwritten)"
fi

echo
echo "Next steps:"
echo "  1. Log out/in OR: systemctl --user import-environment"
echo "  2. Fully quit Cursor (all windows) and reopen"
echo "  3. Cursor → Settings → MCP → google-drive → Connect / Authenticate"
echo "  4. Run: ./scripts/verify-google-drive-mcp.sh"
echo
