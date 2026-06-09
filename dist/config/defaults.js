import { DEFAULT_BATCH_SIZE, DEFAULT_CLI, DEFAULT_CONTEXT_LENGTH, DEFAULT_GPU_LAYERS, DEFAULT_MAX_TOKENS, DEFAULT_MODEL_NAME, DEFAULT_MODEL_PATH, DEFAULT_OLLAMA_HOST, DEFAULT_OLLAMA_MODEL, DEFAULT_PROMPTS, DEFAULT_PROVIDER, DEFAULT_REPEAT_PENALTY, DEFAULT_TEMPERATURE, DEFAULT_THREADS, DEFAULT_TOP_K, DEFAULT_TOP_P, } from "../constants";
export function createDefaultConfig() {
    return {
        defaultProvider: DEFAULT_PROVIDER,
        ollama: {
            host: DEFAULT_OLLAMA_HOST,
            model: DEFAULT_OLLAMA_MODEL,
        },
        model: {
            path: DEFAULT_MODEL_PATH,
            name: DEFAULT_MODEL_NAME,
            contextLength: DEFAULT_CONTEXT_LENGTH,
            batchSize: DEFAULT_BATCH_SIZE,
            threads: DEFAULT_THREADS,
            gpuLayers: DEFAULT_GPU_LAYERS,
        },
        generation: {
            temperature: DEFAULT_TEMPERATURE,
            maxTokens: DEFAULT_MAX_TOKENS,
            topP: DEFAULT_TOP_P,
            topK: DEFAULT_TOP_K,
            repeatPenalty: DEFAULT_REPEAT_PENALTY,
        },
        prompts: { ...DEFAULT_PROMPTS },
        cli: {
            welcomeMessage: DEFAULT_CLI.welcomeMessage,
            exitCommands: [...DEFAULT_CLI.exitCommands],
        },
    };
}
export function applyEnvironmentOverrides(base) {
    return {
        ...base,
        ollama: {
            host: process.env.OLLAMA_HOST ?? base.ollama.host,
            model: process.env.OLLAMA_MODEL ?? base.ollama.model,
        },
    };
}
//# sourceMappingURL=defaults.js.map