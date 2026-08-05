# Llama Node.js POC — Setup Guide

Full from-zero article (Ukrainian): [`UKRAINIAN_PUBLICATION.md`](UKRAINIAN_PUBLICATION.md)

## What's in this repo

TypeScript proof of concept for running **Llama from Node.js** via **Ollama** (recommended) or **llama-node** (legacy in-process GGUF).

```
llama-node-poc/
├── UKRAINIAN_PUBLICATION.md      # Publication source (Ukrainian)
├── src/
│   ├── index.ts                  # CLI entry point
│   ├── config.ts                 # Model and generation settings
│   ├── providers/                # ollama + llama-node adapters
│   ├── types/                    # Shared TypeScript types
│   ├── examples/                 # basic, chat, streaming
│   └── tests/                    # quick + comprehensive regression suite
├── models/                       # Place your .gguf model here (llama-node)
├── dist/                         # Compiled output (npm run build)
├── Dockerfile                    # Node app only — Ollama runs separately
└── README.md
```

## Ollama server vs npm `ollama`

|             | Ollama server                                      | npm `ollama`                         |
| ----------- | -------------------------------------------------- | ------------------------------------ |
| **What**    | System app / service                               | JavaScript package in `package.json` |
| **Install** | [ollama.com/download](https://ollama.com/download) | `npm install` in this repo           |
| **Role**    | Loads GGUF, serves API on port 11434               | HTTP client from Node.js             |

## Prerequisites

**Node.js 20+** (tested on v22). Check with `node -v` and `npm -v`.

If not installed: Linux — NodeSource 22.x script + `apt-get install nodejs`; macOS — `brew install node@22`; Windows — [nodejs.org](https://nodejs.org/) LTS; or [nvm](https://github.com/nvm-sh/nvm) — `nvm install 22`.

**Ollama path:** Ollama server installed + models pulled (see below).

**llama-node path:** ~6 GB RAM for Llama-2-7B Q4_K_M on CPU + a GGUF file.

**Ollama model sizing (approximate):**

| Model       | Min RAM | Disk (pull) |
| ----------- | ------- | ----------- |
| `tinyllama` | ~2 GB   | ~0.6 GB     |
| `llama3.2`  | ~8 GB   | ~2 GB       |

## From zero — Ollama

### Install Ollama server

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**macOS:** `brew install ollama` or [ollama.com/download](https://ollama.com/download).

**Windows:** installer from [ollama.com/download](https://ollama.com/download).

The server usually starts with the OS. Use `ollama serve` only if `curl http://127.0.0.1:11434/api/tags` fails.

### Pull models

```bash
ollama pull tinyllama    # all npm run test:* (auto-selected for Ollama)
ollama pull llama3.2     # npm run dev default (config.ts)
```

### Verify

```bash
ollama list
curl -s http://127.0.0.1:11434/api/tags | head
```

**Troubleshooting:**

| Symptom                                | Fix                                                                                  |
| -------------------------------------- | ------------------------------------------------------------------------------------ |
| `curl: Connection refused` on `:11434` | `ollama serve`                                                                       |
| `model not found`                      | `ollama pull <model>` — must match name in code / config                             |
| `ollama: command not found`            | Restart terminal; `ollama --version`                                                 |
| Port 11434 in use                      | `OLLAMA_HOST=http://127.0.0.1:11435 ollama serve` + update client host               |

Windows: native installer or WSL2; `curl` works in PowerShell / Windows 10+.

### First request — one command

No npm or TypeScript needed yet:

```bash
ollama run tinyllama "Say hello in one sentence."
ollama run llama3.2 "Explain Node.js in one sentence."
```

Example: `tinyllama` may echo the instruction literally; `llama3.2` usually gives a full sentence about Node.js.

Interactive: `ollama run llama3.2` then `/bye` to exit.

HTTP API (`jq` optional):

```bash
curl -s http://127.0.0.1:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "Say hello in one sentence."}],
  "stream": false
}'
# optional: | jq -r '.message.content'
```

### Clone and install

```bash
git clone https://github.com/Boobuh/llama-node-poc.git
cd llama-node-poc
npm install
```

### Test workflow (ordered)

```bash
npm run test:unit       # no LLM — all unit tests pass, exit 0
npm run test:quick      # ~2s — expect "PASS" and a response snippet
npm run test:providers  # Ollama required — expect PASS for ollama
npm test                # 31 tests, ~5–10 min — some FAIL on tinyllama is normal
```

Ollama tests use `tinyllama` automatically (`prepareTestProvider`). Demos use `llama3.2` unless `OLLAMA_MODEL` is set.

### Run demos

```bash
npm run dev -- basic --provider ollama
npm run dev -- chat --provider ollama
npm run dev -- stream --provider ollama
```

## Quick start (llama-node + GGUF)

```bash
npm install

mkdir -p models
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf \
  -O models/llama-model.gguf

PROVIDER=llama-node npm run test:quick
npm run dev -- basic --provider llama-node
```

## Scripts

| Command                     | Description                                 |
| --------------------------- | ------------------------------------------- |
| `npm run dev -- basic`      | Basic text generation                       |
| `npm run dev -- chat`       | Interactive chat                            |
| `npm run dev -- stream`     | Streaming response demo                     |
| `npm run dev -- providers`  | List available backends                     |
| `npm run dev -- info`       | Show config and system info                 |
| `npm run test:unit`         | Unit tests (no LLM)                         |
| `npm run test:providers`    | Provider integration tests                  |
| `npm run test:quick`        | Fast connectivity test                      |
| `npm run test`              | Full regression suite (31 tests, ~5-10 min) |
| `npm run generate:examples` | Regenerate article example outputs          |
| `npm run benchmark:models`  | Latency: tinyllama vs llama3.2 + JSON test  |
| `npm run sync:doc`          | Sync `UKRAINIAN_PUBLICATION.md` → Google Doc |
| `npm run sync:googledocs-txt` | Regenerate `UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt` |
| `npm run rag:demo`          | Minimal RAG demo (needs nomic-embed-text)   |
| `npm run teaching:screenshots` | Regenerate teaching experiment PNGs        |
| `npm run build`             | Compile TypeScript to `dist/`               |

## Library choice

| Package        | Role in this repo                                      |
| -------------- | ------------------------------------------------------ |
| **ollama**     | Default — Node.js client to local Ollama server        |
| **llama-node** | Optional — in-process GGUF via `@llama-node/llama-cpp` |

`llama-node@0.1.6` (May 2023) is archived and may not load modern GGUF. Prefer Ollama for current models.

## Configuration

Edit `src/config.ts` for:

- default provider (`ollama` or `llama-node`)
- Ollama host and model name
- GGUF model path, context length, CPU threads, GPU layers
- default temperature, topP, topK, maxTokens

Environment: `OLLAMA_HOST`, `OLLAMA_MODEL`, `OLLAMA_SYSTEM_PROMPT`, `PROVIDER`

## Docker

`Dockerfile` builds the Node.js app only. Install and run Ollama separately; point the app with `OLLAMA_HOST` (e.g. `http://host.docker.internal:11434`).

**Docker Compose** (recommended for local sidecar):

```bash
docker compose up -d ollama
docker compose exec ollama ollama pull llama3.2
docker compose up --build app
```

App service uses `OLLAMA_HOST=http://ollama:11434`. Model data persists in Docker volume `ollama_data`.

## Optional extensions

1. Wrap inference in a REST API (Express/Fastify)
2. Add request validation and rate limiting
3. Run `npm test` in CI on model/config changes
4. Prefer always-on containers over cold-start serverless for multi-GB models
