export const LLAMA_PROVIDER_IDS = ["ollama", "llama-node"];
export const DEFAULT_LLAMA_PROVIDER_ID = "ollama";
export const REQUIRED_TEST_PROVIDERS = ["ollama"];
export const OPTIONAL_TEST_PROVIDERS = ["llama-node"];
export function unknownProviderMessage(value) {
    return `Unknown provider "${value}". Use: ollama, llama-node`;
}
export function unknownProviderIdMessage(id) {
    return `Unknown provider: ${id}`;
}
//# sourceMappingURL=providers.js.map