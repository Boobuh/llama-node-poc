#!/usr/bin/env bash
set -euo pipefail

DOC_ID="18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw"

echo "=== Google Drive MCP verification ==="
echo

if [[ -z "${GOOGLE_DRIVE_MCP_CLIENT_ID:-}" ]]; then
  echo "FAIL: GOOGLE_DRIVE_MCP_CLIENT_ID is not set."
  echo "Run: source ~/.config/environment.d/google-drive-mcp.conf"
  echo "Or restart session after creating that file."
  exit 1
fi

if [[ -z "${GOOGLE_DRIVE_MCP_CLIENT_SECRET:-}" ]]; then
  echo "FAIL: GOOGLE_DRIVE_MCP_CLIENT_SECRET is not set."
  exit 1
fi

echo "OK: OAuth env vars present in shell."
echo

if [[ -f "${HOME}/.cursor/mcp.json" ]]; then
  if grep -q "drivemcp.googleapis.com" "${HOME}/.cursor/mcp.json"; then
    echo "OK: ~/.cursor/mcp.json references drivemcp.googleapis.com"
  else
    echo "WARN: google-drive URL not found in ~/.cursor/mcp.json"
  fi
else
  echo "WARN: ~/.cursor/mcp.json missing"
fi

echo
echo "Cursor-side check (manual):"
echo "  - Settings → MCP → google-drive should show Connected (not errored)"
echo "  - Output panel → MCP Logs — no DCR / dynamic registration errors"
echo
echo "After Connect, ask the agent to read file ID: ${DOC_ID}"
echo "Tool: read_file_content on user-google-drive MCP server"
