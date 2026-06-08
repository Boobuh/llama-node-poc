import { ollamaProvider } from "./ollama";
import { llamaNodeProvider } from "./llama-node";
import { nodeLlamaCppProvider } from "./node-llama-cpp";
const providers = {
    ollama: ollamaProvider,
    "llama-node": llamaNodeProvider,
    "node-llama-cpp": nodeLlamaCppProvider,
};
export const providerList = Object.values(providers);
export function getProvider(id) {
    const provider = providers[id];
    if (!provider) {
        throw new Error(`Unknown provider: ${id}`);
    }
    return provider;
}
export function parseProvider(value) {
    if (!value) {
        return "ollama";
    }
    if (value in providers) {
        return value;
    }
    throw new Error(`Unknown provider "${value}". Use: ollama, llama-node, node-llama-cpp`);
}
//# sourceMappingURL=index.js.map