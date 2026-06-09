export declare const DEFAULT_PROVIDER: "ollama";
export declare const DEFAULT_OLLAMA_HOST = "http://127.0.0.1:11434";
export declare const DEFAULT_OLLAMA_MODEL = "llama3.2";
export declare const DEFAULT_MODEL_PATH = "./models/llama-model.gguf";
export declare const DEFAULT_MODEL_NAME = "llama-2-7B-chat";
export declare const DEFAULT_CONTEXT_LENGTH = 4096;
export declare const DEFAULT_BATCH_SIZE = 512;
export declare const DEFAULT_THREADS = 4;
export declare const DEFAULT_GPU_LAYERS = 0;
export declare const DEFAULT_TEMPERATURE = 0.7;
export declare const DEFAULT_MAX_TOKENS = 200;
export declare const DEFAULT_TOP_P = 0.9;
export declare const DEFAULT_TOP_K = 40;
export declare const DEFAULT_REPEAT_PENALTY = 1.1;
export declare const DEFAULT_PROMPTS: {
    readonly basic: "Tell me a short story about a robot discovering emotions.";
    readonly chat: "You are a helpful AI assistant. How can I help you today?";
    readonly stream: "Write a detailed explanation of quantum computing.";
};
export declare const DEFAULT_CLI: {
    readonly welcomeMessage: "Llama Node.js POC - Interactive Examples (TypeScript)";
    readonly exitCommands: readonly ["exit", "quit", "q"];
};
export declare const CONFIG_LIMITS: {
    readonly temperatureMin: 0;
    readonly temperatureMax: 2;
    readonly topPMin: 0;
    readonly topPMax: 1;
};
//# sourceMappingURL=config.d.ts.map