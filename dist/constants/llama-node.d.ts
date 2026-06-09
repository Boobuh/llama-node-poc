export declare const LLAMA_NODE_LOAD_DEFAULTS: {
    readonly enableLogging: false;
    readonly seed: 0;
    readonly f16Kv: false;
    readonly logitsAll: false;
    readonly vocabOnly: false;
    readonly useMlock: false;
    readonly embedding: false;
    readonly useMmap: true;
};
export declare const LLAMA_NODE_SETUP_LINES: readonly ["llama-node setup (GGUF in ./models/):", "  npm install llama-node @llama-node/llama-cpp", "  Place model at {modelPath}", "  npm run dev -- basic --provider llama-node", "", "Note: llama-node@0.1.6 may not load modern GGUF files.", "Use --provider ollama for current Llama models via Ollama server."];
//# sourceMappingURL=llama-node.d.ts.map