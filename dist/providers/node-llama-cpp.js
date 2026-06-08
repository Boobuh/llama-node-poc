import fs from "node:fs";
import { config } from "../config";
class NodeLlamaCppSession {
    constructor(session) {
        this.session = session;
    }
    async prompt(text, options = {}) {
        return this.session.prompt(text, {
            temperature: options.temperature ?? config.generation.temperature,
            maxTokens: options.maxTokens ?? config.generation.maxTokens,
            topP: options.topP ?? config.generation.topP,
            topK: options.topK ?? config.generation.topK,
            onTextChunk: options.onTextChunk,
        });
    }
}
export const nodeLlamaCppProvider = {
    id: "node-llama-cpp",
    label: "node-llama-cpp",
    description: "TypeScript bindings to llama.cpp (in-process GGUF)",
    async isAvailable() {
        return fs.existsSync(config.model.path);
    },
    getSetupInstructions() {
        return [
            "node-llama-cpp setup (GGUF in ./models/):",
            "  npm install node-llama-cpp",
            `  Place model at ${config.model.path}`,
            "  npm run dev -- basic --provider node-llama-cpp",
        ].join("\n");
    },
    async createSession() {
        if (!fs.existsSync(config.model.path)) {
            throw new Error(`Model not found: ${config.model.path}`);
        }
        const { getLlama, LlamaChatSession } = await import("node-llama-cpp");
        const llama = await getLlama();
        const model = await llama.loadModel({ modelPath: config.model.path });
        const context = await model.createContext();
        const session = new LlamaChatSession({
            contextSequence: context.getSequence(),
        });
        return new NodeLlamaCppSession(session);
    },
};
//# sourceMappingURL=node-llama-cpp.js.map