import fs from "node:fs";
import { config } from "../config";
import { nodeLlamaCppProvider } from "./node-llama-cpp";
class LlamaNodeSession {
    constructor(llm) {
        this.llm = llm;
    }
    async prompt(text, options = {}) {
        const temperature = options.temperature ?? config.generation.temperature;
        const maxTokens = options.maxTokens ?? config.generation.maxTokens;
        if (options.onTextChunk) {
            let full = "";
            await this.llm.createCompletion({
                prompt: text,
                nThreads: config.model.threads,
                nTokPredict: maxTokens,
                temp: temperature,
                topP: options.topP ?? config.generation.topP,
                topK: options.topK ?? config.generation.topK,
                repeatPenalty: config.generation.repeatPenalty,
            }, (data) => {
                if (data.token) {
                    full += data.token;
                    options.onTextChunk(data.token);
                }
            });
            return full;
        }
        const result = await this.llm.createCompletion({
            prompt: text,
            nThreads: config.model.threads,
            nTokPredict: maxTokens,
            temp: temperature,
            topP: options.topP ?? config.generation.topP,
            topK: options.topK ?? config.generation.topK,
            repeatPenalty: config.generation.repeatPenalty,
        }, () => { });
        return result.tokens.join("");
    }
}
function isLegacyGgufError(error) {
    const message = error instanceof Error ? error.message : String(error);
    return (message.includes("magic") ||
        message.includes("GGML") ||
        message.includes("GGUF") ||
        message.includes("Failed to initialize LLama"));
}
async function createNativeSession() {
    const llamaNode = await import("llama-node");
    const llamaCpp = await import("llama-node/dist/llm/llama-cpp.js");
    const llm = new llamaNode.LLM(llamaCpp.LLamaCpp);
    await llm.load({
        modelPath: config.model.path,
        enableLogging: false,
        nCtx: config.model.contextLength,
        nGpuLayers: config.model.gpuLayers,
        seed: 0,
        f16Kv: false,
        logitsAll: false,
        vocabOnly: false,
        useMlock: false,
        embedding: false,
        useMmap: true,
    });
    return new LlamaNodeSession(llm);
}
export const llamaNodeProvider = {
    id: "llama-node",
    label: "llama-node",
    description: "llama-node npm API (native @llama-node/llama-cpp, GGUF v2+ via node-llama-cpp fallback)",
    async isAvailable() {
        return fs.existsSync(config.model.path);
    },
    getSetupInstructions() {
        return [
            "llama-node setup (GGUF in ./models/):",
            "  npm install llama-node @llama-node/llama-cpp",
            `  Place model at ${config.model.path}`,
            "  npm run dev -- basic --provider llama-node",
            "",
            "Note: llama-node@0.1.6 only loads legacy GGUF. Modern GGUF files",
            "auto-fallback to node-llama-cpp inference with the same --provider flag.",
        ].join("\n");
    },
    async createSession() {
        if (!fs.existsSync(config.model.path)) {
            throw new Error(`Model not found: ${config.model.path}`);
        }
        try {
            return await createNativeSession();
        }
        catch (error) {
            if (!isLegacyGgufError(error)) {
                throw error;
            }
            console.warn("[llama-node] Native backend cannot load this GGUF file (llama-node@0.1.6 is outdated).");
            console.warn("[llama-node] Falling back to node-llama-cpp for compatible inference.");
            return nodeLlamaCppProvider.createSession();
        }
    },
};
//# sourceMappingURL=llama-node.js.map