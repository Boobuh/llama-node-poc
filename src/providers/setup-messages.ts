import { config } from "../config";

export function getOllamaSetupInstructions(): string {
  return [
    "Ollama setup (server + npm client are different things):",
    "  1. Install Ollama server: https://ollama.com/download",
    "     Linux: curl -fsSL https://ollama.com/install.sh | sh",
    `  2. Pull models: ollama pull tinyllama  (tests)`,
    `                 ollama pull ${config.ollama.model}  (dev demos)`,
    "  3. Verify: ollama list && curl -s http://127.0.0.1:11434/api/tags | head",
    "     (ollama serve only if API does not respond)",
    "  4. Run: npm run test:quick",
    "     or:  npm run dev -- basic --provider ollama",
  ].join("\n");
}

export function getLlamaNodeSetupInstructions(): string {
  return [
    "llama-node setup (GGUF in ./models/):",
    "  npm install llama-node @llama-node/llama-cpp",
    `  Place model at ${config.model.path}`,
    "  npm run dev -- basic --provider llama-node",
    "",
    "Note: llama-node@0.1.6 may not load modern GGUF files.",
    "Use --provider ollama for current Llama models via Ollama server.",
  ].join("\n");
}

export function getOllamaUnreachableMessage(): string {
  return `Cannot reach Ollama at ${config.ollama.host}. Install from https://ollama.com/download and verify: ollama list`;
}

export function getModelNotFoundMessage(path: string): string {
  return `Model not found: ${path}`;
}
