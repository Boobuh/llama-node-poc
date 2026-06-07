# Llama Node.js POC — Setup Guide

## What's in this repo

TypeScript proof of concept for running GGUF models locally via **node-llama-cpp**.

```
llama-node-poc/
├── src/
│   ├── index.ts                  # CLI entry point
│   ├── config.ts                 # Model and generation settings
│   ├── types/                    # Shared TypeScript types
│   ├── examples/                 # basic, chat, streaming
│   └── tests/                    # quick + comprehensive regression suite
├── models/                       # Place your .gguf model here
├── dist/                         # Compiled output (npm run build)
├── Dockerfile
└── README.md
```

## Prerequisites

- Node.js 20+ (tested on v22)
- ~6 GB RAM for Llama-2-7B Q4_K_M on CPU
- A GGUF model file

## Quick start

```bash
npm install

mkdir -p models
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf \
  -O models/llama-model.gguf

npm run test:quick   # connectivity check (~10-20s)
npm run basic        # basic generation
npm run chat         # interactive chat
npm run stream       # streaming demo
```

## Scripts

| Command                     | Description                                 |
| --------------------------- | ------------------------------------------- |
| `npm run dev -- basic`      | Basic text generation                       |
| `npm run dev -- chat`       | Interactive chat                            |
| `npm run dev -- stream`     | Streaming response demo                     |
| `npm run dev -- info`       | Show config and system info                 |
| `npm run test:quick`        | Fast connectivity test                      |
| `npm run test`              | Full regression suite (31 tests, ~5-10 min) |
| `npm run generate:examples` | Regenerate article example outputs          |
| `npm run build`             | Compile TypeScript to `dist/`               |

## Library choice

This project uses **node-llama-cpp** (currently `^3.18.1`).

The older **llama-node** package (`0.1.6`, last release May 2023) is archived and no longer maintained. It is not used in this codebase.

## Configuration

Edit `src/config.ts` for:

- model path and context length
- CPU threads and GPU layers
- default temperature, topP, topK, maxTokens

## Production next steps

1. Wrap inference in a REST API (Express/Fastify)
2. Add request validation, auth, and rate limiting
3. Run `npm run test` in CI on every model/config change
4. Prefer always-on containers (Fargate, VM) over cold-start serverless for multi-GB models
