# Llama on Node.js — multi-provider POC

Run **Llama models from Node.js/TypeScript** using either backend:

| Provider             | npm package  | Needs                               | Best for                        |
| -------------------- | ------------ | ----------------------------------- | ------------------------------- |
| **ollama** (default) | `ollama`     | [Ollama](https://ollama.com) server | Pure Node.js client, easy setup |
| **llama-node**       | `llama-node` | Local `.gguf` file                  | Classic Node.js in-process API  |

## Quick start — Ollama (recommended)

```bash
npm install
ollama pull llama3.2
npm run dev -- basic --provider ollama
```

## Quick start — llama-node (GGUF file)

```bash
npm install
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf \
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

## Tests

```bash
npm run test:unit       # pure unit tests (no LLM)
npm run test:providers   # Ollama (required) + llama-node (optional)
npm run test:quick       # quick connectivity via default provider
npm run test             # full 31-test regression suite
```

Ollama for tests: install from https://ollama.com, then `ollama pull tinyllama` and `OLLAMA_MODEL=tinyllama npm run test:providers`.

`gpuLayers: 0` in config uses CPU (recommended if Vulkan/GPU runs out of memory).

## License

ISC
