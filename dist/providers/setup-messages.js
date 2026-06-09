import { config } from "../config";
export function getOllamaSetupInstructions() {
    return [
        "Ollama setup:",
        "  1. Install Ollama: https://ollama.com",
        `  2. Pull a model: ollama pull ${config.ollama.model}`,
        "  3. Ensure server is running: ollama serve",
        "  4. Run: npm run dev -- basic --provider ollama",
    ].join("\n");
}
export function getLlamaNodeSetupInstructions() {
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
export function getOllamaUnreachableMessage() {
    return `Cannot reach Ollama at ${config.ollama.host}. Start with: ollama serve`;
}
export function getModelNotFoundMessage(path) {
    return `Model not found: ${path}`;
}
//# sourceMappingURL=setup-messages.js.map