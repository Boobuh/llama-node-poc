# Llama on Node.js — multi-provider POC

Run **Llama models from Node.js/TypeScript** using either backend:

| Provider             | npm package  | Needs                               | Best for                        |
| -------------------- | ------------ | ----------------------------------- | ------------------------------- |
| **ollama** (default) | `ollama`     | [Ollama](https://ollama.com) server | Pure Node.js client, easy setup |
| **llama-node**       | `llama-node` | Local `.gguf` file                  | Classic Node.js in-process API  |

**Publication (Ukrainian, from-zero guide):** [`UKRAINIAN_PUBLICATION.md`](UKRAINIAN_PUBLICATION.md)

**Can you teach the model?** Yes — but it depends: system prompts and [Modelfile](https://github.com/ollama/ollama/blob/main/docs/modelfile.mdx) change behavior without retraining; RAG injects your documents at query time; fine-tuning/LoRA changes weights for high-volume domain tasks. See the mini-research section in the publication.

## Two different “Ollama” things

| What              | How you get it                                                    | Role                                  |
| ----------------- | ----------------------------------------------------------------- | ------------------------------------- |
| **Ollama server** | Installer from [ollama.com/download](https://ollama.com/download) | Runs models, API on `localhost:11434` |
| **npm `ollama`**  | `npm install` in this repo                                        | Node.js HTTP client to the server     |

## From zero — Ollama (recommended)

### Prerequisites

**Node.js 20+** (tested on v22). Check:

```bash
node -v   # expect v20.x or v22.x
npm -v
```

If Node.js is not installed yet:

**Linux (Debian/Ubuntu):**

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**macOS:** `brew install node@22`

**Windows:** LTS installer from [nodejs.org](https://nodejs.org/)

Cross-platform alternative: [nvm](https://github.com/nvm-sh/nvm) — `nvm install 22`.

**Ollama server** from [ollama.com/download](https://ollama.com/download).

**System requirements (approximate):**

| Model       | Min RAM | Disk (pull) | Notes                          |
| ----------- | ------- | ----------- | ------------------------------ |
| `tinyllama` | ~2 GB   | ~0.6 GB     | enough for quick tests         |
| `llama3.2`  | ~8 GB   | ~2 GB       | CPU-friendly; GPU optional     |

### 1. Install Ollama server

**Linux:**

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

**macOS:** `brew install ollama` or download from [ollama.com/download](https://ollama.com/download).

**Windows:** installer from [ollama.com/download](https://ollama.com/download).

On current Ollama builds the server usually starts automatically. Run `ollama serve` only if the API does not respond.

### 2. Pull models

```bash
ollama pull tinyllama    # used by all npm run test:* commands (auto-selected)
ollama pull llama3.2     # default for npm run dev demos (config.ts)
```

Minimum for tests only: `tinyllama`. For demos without env vars, also pull `llama3.2` or set `OLLAMA_MODEL=tinyllama`.

### 3. Verify Ollama

```bash
ollama list
curl -s http://127.0.0.1:11434/api/tags | head
```

**If something fails:**

| Symptom                                | Fix                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------- |
| `curl: Connection refused` on `:11434` | Start the server: `ollama serve` (separate terminal or system service)                      |
| `model not found` / `404` in Node.js   | `ollama pull <model name>` — name in code must match `ollama list`                          |
| `ollama: command not found`            | Restart the terminal; run `ollama --version`                                                |
| Port 11434 already in use              | `OLLAMA_HOST=http://127.0.0.1:11435 ollama serve` and update the host in your client        |

**Windows:** native installer or WSL2 with the Linux steps above. `curl` is available in PowerShell / Windows 10+.

### 4. First request — one command (terminal)

Before Node.js, send a prompt and get a response in the terminal:

```bash
ollama run tinyllama "Say hello in one sentence."
ollama run llama3.2 "Explain Node.js in one sentence."
```

Interactive chat: `ollama run llama3.2` (type `/bye` to exit).

HTTP API test (`jq` optional — omit the pipe to see raw JSON):

```bash
curl -s http://127.0.0.1:11434/api/chat -d '{
  "model": "llama3.2",
  "messages": [{"role": "user", "content": "Say hello in one sentence."}],
  "stream": false
}'
# optional: | jq -r '.message.content'
```

### 5. Clone and install

```bash
git clone https://github.com/Boobuh/llama-node-poc.git
cd llama-node-poc
npm install
```

### 6. Test (smallest → largest)

```bash
npm run test:unit       # no LLM — expect exit 0
npm run test:quick      # connectivity — expect green PASS + sample text
npm run test:providers  # Ollama integration (tinyllama)
npm test                # full 31-test suite (~5–10 min)
```

Tests auto-select `tinyllama` for Ollama even if `OLLAMA_MODEL` is unset. `npm run dev` uses `llama3.2` from config unless you set `OLLAMA_MODEL`.

### 7. Run demos

```bash
npm run dev -- basic --provider ollama
npm run dev -- chat --provider ollama
npm run dev -- stream --provider ollama
```

With only `tinyllama` pulled:

```bash
OLLAMA_MODEL=tinyllama npm run dev -- basic --provider ollama
```

See [SETUP.md](SETUP.md) for llama-node (GGUF) path and script reference.

## Quick start — llama-node (GGUF file)

```bash
npm install
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7b-chat.Q4_K_M.gguf \
  -O models/llama-model.gguf
npm run dev -- basic --provider llama-node
```

> **Note:** `llama-node@0.1.6` may not load modern GGUF files. Use Ollama for current Llama models.

## CLI

```bash
npm run dev -- providers                    # list backends
npm run dev -- basic --provider ollama      # text generation
npm run dev -- chat --provider llama-node   # interactive chat
npm run dev -- stream --provider ollama     # streaming
npm run dev -- info                         # config + env
```

Common flags: `--provider`, `--temperature`, `--max-tokens`

## Configuration (`src/config.ts`)

```typescript
defaultProvider: "ollama",
ollama: {
  host: "http://127.0.0.1:11434",
  model: "llama3.2",
},
model: {
  path: "./models/llama-model.gguf",  // for llama-node
  ...
},
```

Environment: `OLLAMA_HOST`, `OLLAMA_MODEL`, `PROVIDER`

## Code examples

**Ollama (Node.js client):**

```typescript
import { Ollama } from "ollama";
const client = new Ollama({ host: "http://127.0.0.1:11434" });
const { message } = await client.chat({
  model: "llama3.2",
  messages: [{ role: "user", content: "Hello!" }],
});
```

**llama-node (in-process GGUF):**

```typescript
import { LLM } from "llama-node";
const { LLamaCpp } = await import("llama-node/dist/llm/llama-cpp.js");
const llm = new LLM(LLamaCpp);
await llm.load({ modelPath: "./models/llama-model.gguf", enableLogging: false, ... });
const result = await llm.createCompletion({ prompt: "Hello!", nThreads: 4, nTokPredict: 100 }, () => {});
```

**Unified provider in this repo:**

```typescript
import { getProvider } from "./providers";
const session = await getProvider("ollama").createSession();
const text = await session.prompt("Hello!");
```

## Docker

The `Dockerfile` builds only the Node.js app. Run **Ollama on the host or as a sidecar** and set `OLLAMA_HOST` (e.g. `http://host.docker.internal:11434` on macOS/Windows).

**Docker Compose** (Node app + Ollama sidecar):

```bash
docker compose up -d ollama
docker compose exec ollama ollama pull llama3.2
docker compose up --build app
```

See [`docker-compose.yml`](docker-compose.yml). Publication covers structured JSON output, `num_ctx`, benchmarks, and fine-tuning pointers in **Додаткові дослідження (nice-to-have)**.

## Research extras

| Topic | Command / file |
| ----- | -------------- |
| Model latency benchmarks | `npm run benchmark:models` → `docs/research/benchmarks-latest.txt` |
| Sync publication to Google Doc | `npm run sync:doc` |
| Teach model (git/PR experiment) | [`docs/teaching-git-mr/README.md`](docs/teaching-git-mr/README.md) |

## License

ISC
