# Llama Node.js POC — Setup Guide

## What's in this repo

TypeScript proof of concept for running **Llama from Node.js** via **Ollama** (recommended) or **llama-node** (legacy in-process GGUF).

```
llama-node-poc/
├── src/
│   ├── index.ts                  # CLI entry point
│   ├── config.ts                 # Model and generation settings
│   ├── providers/                # ollama + llama-node adapters
│   ├── types/                    # Shared TypeScript types
│   ├── examples/                 # basic, chat, streaming
│   └── tests/                    # quick + comprehensive regression suite
├── models/                       # Place your .gguf model here (llama-node)
├── dist/                         # Compiled output (npm run build)
├── Dockerfile
└── README.md
```

## Prerequisites

- Node.js 20+ (tested on v22)
- **Ollama path:** Ollama installed and a model pulled (`ollama pull tinyllama`)
- **llama-node path:** ~6 GB RAM for Llama-2-7B Q4_K_M on CPU + a GGUF file

## Quick start (Ollama)

```bash
npm install
ollama pull tinyllama
npm run test:quick
npm run dev -- basic --provider ollama
npm run dev -- chat --provider ollama
npm run dev -- stream --provider ollama
```

## Quick start (llama-node + GGUF)

```bash
npm install

mkdir -p models
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf \
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
| `npm run test:providers`    | Provider integration tests                  |
| `npm run test:quick`        | Fast connectivity test                      |
| `npm run test`              | Full regression suite (31 tests, ~5-10 min) |
| `npm run generate:examples` | Regenerate article example outputs          |
| `npm run build`             | Compile TypeScript to `dist/`               |

## Library choice

| Package      | Role in this repo                                      |
| ------------ | ------------------------------------------------------ |
| **ollama**   | Default — Node.js client to local Ollama server        |
| **llama-node** | Optional — in-process GGUF via `@llama-node/llama-cpp` |

`llama-node@0.1.6` (May 2023) is archived and may not load modern GGUF. Prefer Ollama for current models.

## Configuration

Edit `src/config.ts` for:

- default provider (`ollama` or `llama-node`)
- Ollama host and model name
- GGUF model path, context length, CPU threads, GPU layers
- default temperature, topP, topK, maxTokens

Environment: `OLLAMA_HOST`, `OLLAMA_MODEL`, `PROVIDER`

## Production next steps

1. Wrap inference in a REST API (Express/Fastify)
2. Add request validation, auth, and rate limiting
3. Run `npm run test` in CI on every model/config change
4. Prefer always-on containers (Fargate, VM) over cold-start serverless for multi-GB models
