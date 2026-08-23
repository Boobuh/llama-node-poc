# Publication vs project audit (June 2026)

## Google Doc

| Field        | Value                                                                                |
| ------------ | ------------------------------------------------------------------------------------ |
| URL          | https://docs.google.com/document/d/18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw/edit |
| File ID      | `18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw`                                       |
| Local source | `docs/dou/UKRAINIAN_PUBLICATION_DRAFT.md` (stub: `UKRAINIAN_PUBLICATION.md`) |
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
| DOU author intro + first person      | ✅ «Про автора», «Я перевірив», особистий висновок              |
| Reduced repo self-promotion           | ✅ один блок «Код і додаткові матеріали»; без inline GitHub URL   |
| Uniqueness note                       | ✅ stub on GitHub; draft in `docs/dou/`; Google Doc owner+editor only |
| AI tone mitigation                    | ⚠️ автор має вручну пройтися перед submit (DOU правило)          |

---

## DOU editorial compliance (Aug 2026)

| Criterion | Status | Notes |
| --------- | ------ | ----- |
| Author intro («Мене звати…») | ✅ | Section «Про автора і для кого ця стаття» |
| First-person voice | ✅ | ~54 first-person markers; handbook «ви» removed except audience list |
| Own experience | ✅ | Git/PR Modelfile experiment, benchmarks, regression suite framed as personal |
| Unique (first publication) | ⚠️ | Text marked «вперше для DOU»; **restrict Google Doc sharing** before submit |
| Not AI-generated prose | ⚠️ | Author must manual pass before submit (DOU policy) |
| No hidden promotion | ✅ | Single «Код і додаткові матеріали» block; no inline Boobuh URLs |

**Before DOU submit:** Google Doc restricted to owner + editor (domain sharing removed Aug 2026). After DOU publish, add DOU URL to `UKRAINIAN_PUBLICATION.md` stub.

---

1. Title: **Як використовувати Llama з Node.js: Ollama та llama-node**
2. Body: paste `UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt`
3. Optional: `OLLAMA_MODEL=tinyllama npm run generate:examples` → update examples section
