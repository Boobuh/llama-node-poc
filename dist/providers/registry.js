import { DEFAULT_LLAMA_PROVIDER_ID, UNKNOWN_PROVIDER_ID_MESSAGE, UNKNOWN_PROVIDER_MESSAGE, } from "../constants";
import { ollamaProvider } from "./ollama";
import { llamaNodeProvider } from "./llama-node";
export const providerRegistry = {
    ollama: ollamaProvider,
    "llama-node": llamaNodeProvider,
};
export const providerList = Object.values(providerRegistry);
export function getProvider(id) {
    const provider = providerRegistry[id];
    if (!provider) {
        throw new Error(UNKNOWN_PROVIDER_ID_MESSAGE(id));
    }
    return provider;
}
export function parseProvider(value) {
    if (!value) {
        return DEFAULT_LLAMA_PROVIDER_ID;
    }
    if (value in providerRegistry) {
        return value;
    }
    throw new Error(UNKNOWN_PROVIDER_MESSAGE(value));
}
//# sourceMappingURL=registry.js.map