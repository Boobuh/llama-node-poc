# Google Doc sync instructions

Publication source of truth: `UKRAINIAN_PUBLICATION.md`  
Plain-text for Google Docs: `UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt`

**Google Doc:** https://docs.google.com/document/d/18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw/edit

## Regenerate local copy

```bash
npx tsx src/tests/md-to-googledocs.ts
```

## Fix Google Drive / Google Docs MCP (Cursor)

### Problem A: remote official MCP

`https://drivemcp.googleapis.com/mcp/v1` + Web OAuth → Cursor callback at `cursor.com/agents/mcp/oauth/callback` often fails with:

- `Incompatible auth server: does not support dynamic client registration`
- `Missing required parameters (code and state)`

### Solution: local MCP + Desktop OAuth (recommended)

Uses credentials **downloaded from your GCP Console** (the page where Drive API + Drive MCP API are enabled).

#### 1. GCP (you are already here)

1. [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent) → External → add yourself as **Test user**
2. **Data Access → Scopes** → add at least:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/documents`
3. [Credentials](https://console.cloud.google.com/apis/credentials) → **Create credentials** → **OAuth client ID**
4. Application type: **Desktop app** ← important (not Web application)
5. **Download JSON**

#### 2. Import into Cursor MCP

```bash
chmod +x scripts/import-gcp-oauth-json.sh
./scripts/import-gcp-oauth-json.sh ~/Downloads/client_secret_*.json
```

This saves `~/.config/google-workspace-mcp/credentials.json`.

#### 3. Authenticate once (localhost — no cursor.com redirect)

```bash
npx -y @dguido/google-workspace-mcp auth
```

Browser opens → sign in → allow access. Tokens go to `~/.config/google-workspace-mcp/tokens.json`.

#### 4. Restart Cursor

`~/.cursor/mcp.json` should include:

```json
"google-workspace": {
  "command": "npx",
  "args": ["-y", "@dguido/google-workspace-mcp"],
  "env": {
    "GOOGLE_WORKSPACE_SERVICES": "drive,docs"
  }
}
```

**Settings → MCP → google-workspace** should show connected (green).

#### 5. Verify on your publication doc

Doc ID: `18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw`

Agent can use `getGoogleDocContent` / `replaceTextInDoc` / `updateGoogleDoc` (unlike official remote Drive MCP).

---

### Legacy: remote Drive MCP (optional, often broken in Cursor)

Only if you insist on `drivemcp.googleapis.com`:

- OAuth client type: **Web application**
- Redirect URIs (add **both**):
  - `https://www.cursor.com/agents/mcp/oauth/callback`
  - `https://cursor.com/agents/mcp/oauth/callback`
- Env vars in `~/.config/environment.d/google-drive-mcp.conf`:
  - `GOOGLE_DRIVE_MCP_CLIENT_ID`
  - `GOOGLE_DRIVE_MCP_CLIENT_SECRET`
- Fully restart Cursor → MCP → **google-drive** → Connect

See `scripts/google-drive-mcp-env.example` and `scripts/setup-google-drive-mcp.sh`.

## Sync to Google Doc (formatted — recommended)

Uses `UKRAINIAN_PUBLICATION.md` directly. Preserves headings, code blocks (monospace + gray background + syntax colors per language), tables, and lists.

Code fence languages map to Google Docs code block types: `typescript` → TypeScript, `bash` → Shell, `json` → JSON, `javascript` → JavaScript, `dockerfile` → Shell, etc. Unlabeled fences are inferred when possible.

**Note:** The Docs API cannot insert native Building block > Code block widgets (no language dropdown). Sync applies matching syntax highlighting and bordered code-block styling via the API.

```bash
node scripts/sync-google-doc-rich.mjs
```

**Do not use** `sync-google-doc.mjs` or paste `UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt` — that strips formatting.

`UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt` is only for manual paste fallback.

## Sync to Google Doc (manual fallback)

1. Open the [Google Doc](https://docs.google.com/document/d/18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw/edit)
2. Select all (Ctrl+A) → paste contents of `UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt`
3. Re-apply heading styles manually
4. Update title to: **Як використовувати Llama з Node.js: Ollama та llama-node**

## Project alignment (June 2026)

| Item      | Value                                                  |
| --------- | ------------------------------------------------------ |
| Providers | **ollama** (default), **llama-node** (optional legacy) |
| Removed   | **node-llama-cpp**                                     |
| npm       | `ollama@0.6.3`, `llama-node@0.1.6`                     |
| Tests     | `OLLAMA_MODEL=tinyllama npm run test:providers`        |

```bash
OLLAMA_MODEL=tinyllama npm run test:providers
OLLAMA_MODEL=tinyllama npm run test:quick
npx tsx src/tests/md-to-googledocs.ts
```
