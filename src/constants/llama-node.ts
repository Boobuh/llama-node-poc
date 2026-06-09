export const LLAMA_NODE_LOAD_DEFAULTS = {
  enableLogging: false,
  seed: 0,
  f16Kv: false,
  logitsAll: false,
  vocabOnly: false,
  useMlock: false,
  embedding: false,
  useMmap: true,
} as const;

export const LLAMA_NODE_SETUP_LINES = [
  "llama-node setup (GGUF in ./models/):",
  "  npm install llama-node @llama-node/llama-cpp",
  "  Place model at {modelPath}",
  "  npm run dev -- basic --provider llama-node",
  "",
  "Note: llama-node@0.1.6 may not load modern GGUF files.",
  "Use --provider ollama for current Llama models via Ollama server.",
] as const;
