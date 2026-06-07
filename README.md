# Llama Node.js POC — TypeScript + node-llama-cpp

A proof of concept for running local LLM inference in Node.js with TypeScript, CLI examples, streaming, and a regression test suite suitable for CI/CD.

## Features

- Basic text generation, interactive chat, and streaming responses
- CLI via Commander.js
- 31-test backend capability suite (`npm run test`)
- TypeScript with ES modules
- Docker support

## Stack

| Package                                                        | Version        | Role                                                    |
| -------------------------------------------------------------- | -------------- | ------------------------------------------------------- |
| [node-llama-cpp](https://www.npmjs.com/package/node-llama-cpp) | `^3.18.1`      | Active bindings to llama.cpp — **used by this project** |
| [llama-node](https://www.npmjs.com/package/llama-node)         | `0.1.6` (2023) | Archived, unmaintained — **not used**                   |

## Prerequisites

- Node.js 20+ (tested on v22)
- A GGUF model (~4 GB for Llama-2-7B Q4_K_M)
- ~6 GB RAM for CPU inference

## Quick start

```bash
git clone https://github.com/Boobuh/llama-node-poc.git
cd llama-node-poc
npm install

mkdir -p models
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf \
  -O models/llama-model.gguf

npm run test:quick
npm run basic
```

## Usage

```bash
npm run dev -- basic     # basic generation
npm run dev -- chat      # interactive chat
npm run dev -- stream    # streaming demo
npm run dev -- info      # system/config info
npm run test:quick       # fast connectivity test
npm run test             # full regression suite
npm run generate:examples # regenerate article outputs
```

Production build:

```bash
npm run build
npm start -- basic
```

## Project structure

```
llama-node-poc/
├── src/
│   ├── index.ts
│   ├── config.ts
│   ├── types/
│   ├── examples/
│   │   ├── basic-example.ts
│   │   ├── chat-example.ts
│   │   └── streaming-example.ts
│   └── tests/
│       ├── quick-test.ts
│       ├── comprehensive-test.ts
│       └── generate-examples.ts
├── models/
├── dist/
└── Dockerfile
```

## Code example

```typescript
import { getLlama, LlamaChatSession } from "node-llama-cpp";

const llama = await getLlama();
const model = await llama.loadModel({
  modelPath: "./models/llama-model.gguf",
});
const context = await model.createContext();
const session = new LlamaChatSession({
  contextSequence: context.getSequence(),
});

const response = await session.prompt("Hello!", {
  temperature: 0.7,
  maxTokens: 200,
  topP: 0.9,
  topK: 40,
});

console.log(response);
```

Streaming:

```typescript
await session.prompt("Explain quantum computing", {
  temperature: 0.7,
  maxTokens: 300,
  onTextChunk: (text) => process.stdout.write(text),
});
```

## Configuration

Edit `src/config.ts`:

```typescript
export const appConfig = {
  model: {
    path: "./models/llama-model.gguf",
    name: "llama-2-7B-chat",
    contextLength: 4096,
    threads: 4,
    gpuLayers: -1, // -1 = all GPU layers, 0 = CPU only
  },
  generation: {
    temperature: 0.7,
    maxTokens: 200,
    topP: 0.9,
    topK: 40,
  },
};
```

## Recommended models

| Model                           | Size     | Notes                           |
| ------------------------------- | -------- | ------------------------------- |
| Llama-2-7B-Chat Q4_K_M          | ~4 GB    | Default for development         |
| Llama-3.x / Qwen / Mistral GGUF | varies   | Supported by node-llama-cpp 3.x |
| Q4_K_M                          | balanced | Good default quantization       |
| Q8_0                            | larger   | Higher quality                  |

GGUF sources: [Hugging Face GGUF models](https://huggingface.co/models?library=gguf), quantizers such as [bartowski](https://huggingface.co/bartowski).

## Testing

- `npm run test:quick` — loads model and checks a single response (~10-20s)
- `npm run test` — 31 regression tests across instruction following, JSON output, context retention, latency, and more (~5-10 min)

Determinism tests may fail on some models/hardware; that is expected for small local models.

## Troubleshooting

- **Model not found** — place a `.gguf` file in `./models/`
- **Out of memory** — use a smaller quantization (Q4_K_M or Q2_K)
- **Slow inference** — enable GPU layers or reduce context length
- **Tokenizer warning** — `special_eos_id` warnings from older Llama-2 GGUF files are usually harmless

## License

ISC
