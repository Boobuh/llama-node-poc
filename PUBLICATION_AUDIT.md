# Publication vs project audit (June 2026)

## Google Doc

| Field        | Value                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| URL          | https://docs.google.com/document/d/18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw/edit |
| File ID      | `18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw`                                       |
| Local source | `UKRAINIAN_PUBLICATION.md`                                                           |
| Paste copy   | `UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt`                                               |
| Regenerate   | `npx tsx src/tests/md-to-googledocs.ts`                                              |

### Google Drive MCP status

**Sync via script:** `npm run sync:doc` (uses local OAuth in `~/.config/google-workspace-mcp/`).  
Remote Drive MCP in Cursor may still fail with dynamic client registration — see `GOOGLE_DOC_SYNC.md`.

---

## Project (current) vs publication (local, updated)

| Item                              | Project                                                  | Local publication                                        |
| --------------------------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| Title                             | —                                                        | Як використовувати Llama з Node.js: Ollama та llama-node |
| Providers                         | ollama + llama-node                                      | ✅ aligned                                               |
| node-llama-cpp                    | Removed                                                  | ✅ removed from MD + GOOGLEDOCS                          |
| Default provider                  | ollama                                                   | ✅                                                       |
| CLI                               | `--provider ollama\|llama-node`                          | ✅                                                       |
| Tests                             | Ollama required, llama-node optional                     | ✅                                                       |
| Config                            | defaultProvider, ollama, gpuLayers: 0                    | ✅                                                       |
| From-zero Ollama (steps 1–10)     | ✅ install, verify, terminal test, Node project, streaming, env |
| Node.js install in prerequisites  | ✅ section 1 — Linux/macOS/Windows/nvm                         |
| System requirements (RAM/disk)    | ✅ section 1 — tinyllama vs llama3.2 table                      |
| Ollama troubleshooting            | ✅ after step 5 — connection, model, PATH, port, Windows/WSL    |
| `jq` optional in HTTP API example | ✅ step 6 — raw JSON without jq                                 |
| Mini research: teaching the model   | ✅ system prompt, Modelfile, RAG, fine-tuning decision table    |
| Git/PR Modelfile experiment         | ✅ docs/teaching-git-mr/ — logs, screenshots, PR #1             |
| Nice-to-have research               | ✅ JSON format, num_ctx, Docker Compose, benchmarks, fine-tune pointer |
| RAG runnable demo                   | ✅ scripts/rag-mini-demo.mjs + npm run rag:demo                     |
| Ollama systemPrompt in POC          | ✅ config + OLLAMA_SYSTEM_PROMPT env                                |
| CI (unit tests)                     | ✅ .github/workflows/ci.yml                                         |
| Publication tooling committed       | ✅ scripts/, GOOGLE_DOC_SYNC.md, PUBLICATION_COMMANDS.md           |
| npm scripts                         | ✅ benchmark, sync:doc, rag:demo, teaching:screenshots, googledocs-txt |
| Publication files in repo         | ✅ `UKRAINIAN_PUBLICATION.md` mirrored in README + SETUP        |

---

## Action for Google Doc

1. Title: **Як використовувати Llama з Node.js: Ollama та llama-node**
2. Body: paste `UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt`
3. Optional: `OLLAMA_MODEL=tinyllama npm run generate:examples` → update examples section
