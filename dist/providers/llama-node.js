import fs from "node:fs";
import { LLAMA_NODE_LOAD_DEFAULTS } from "../constants";
import { config } from "../config";
import { resolvePromptOptions } from "./resolve-prompt-options";
import { getLlamaNodeSetupInstructions, getModelNotFoundMessage, } from "./setup-messages";
class LlamaNodeSession {
    constructor(llm) {
        this.llm = llm;
    }
    async prompt(text, options = {}) {
        const resolved = resolvePromptOptions(options, config.generation);
        const completionParams = {
            prompt: text,
            nThreads: config.model.threads,
            nTokPredict: resolved.maxTokens,
            temp: resolved.temperature,
            topP: resolved.topP,
            topK: resolved.topK,
            repeatPenalty: config.generation.repeatPenalty,
        };
        if (options.onTextChunk) {
            let full = "";
            await this.llm.createCompletion(completionParams, (data) => {
                if (data.token) {
                    full += data.token;
                    options.onTextChunk(data.token);
                }
            });
            return full;
        }
        const result = await this.llm.createCompletion(completionParams, () => { });
        return result.tokens.join("");
    }
}
export const llamaNodeProvider = {
    id: "llama-node",
    label: "llama-node",
    description: "llama-node npm package with @llama-node/llama-cpp backend",
    async isAvailable() {
        return fs.existsSync(config.model.path);
    },
    getSetupInstructions: getLlamaNodeSetupInstructions,
    async createSession() {
        if (!fs.existsSync(config.model.path)) {
            throw new Error(getModelNotFoundMessage(config.model.path));
        }
        const llamaNode = await import("llama-node");
        const llamaCpp = await import("llama-node/dist/llm/llama-cpp.js");
        const llm = new llamaNode.LLM(llamaCpp.LLamaCpp);
        await llm.load({
            modelPath: config.model.path,
            nCtx: config.model.contextLength,
            nGpuLayers: config.model.gpuLayers,
            ...LLAMA_NODE_LOAD_DEFAULTS,
        });
        return new LlamaNodeSession(llm);
    },
};
//# sourceMappingURL=llama-node.js.map