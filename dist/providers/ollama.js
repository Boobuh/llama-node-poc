import { Ollama } from "ollama";
import { config } from "../config";
import { resolvePromptOptions } from "./resolve-prompt-options";
import { getOllamaSetupInstructions, getOllamaUnreachableMessage, } from "./setup-messages";
class OllamaSession {
    constructor(client, model) {
        this.client = client;
        this.model = model;
    }
    async prompt(text, options = {}) {
        const resolved = resolvePromptOptions(options, config.generation);
        if (options.onTextChunk) {
            let full = "";
            const stream = await this.client.chat({
                model: this.model,
                messages: [{ role: "user", content: text }],
                stream: true,
                options: {
                    temperature: resolved.temperature,
                    num_predict: resolved.maxTokens,
                    top_p: resolved.topP,
                    top_k: resolved.topK,
                },
            });
            for await (const chunk of stream) {
                const part = chunk.message.content;
                if (part) {
                    full += part;
                    options.onTextChunk(part);
                }
            }
            return full;
        }
        const response = await this.client.chat({
            model: this.model,
            messages: [{ role: "user", content: text }],
            options: {
                temperature: resolved.temperature,
                num_predict: resolved.maxTokens,
                top_p: resolved.topP,
                top_k: resolved.topK,
            },
        });
        return response.message.content;
    }
}
export const ollamaProvider = {
    id: "ollama",
    label: "Ollama",
    description: "Official Node.js client → Ollama server (localhost:11434)",
    async isAvailable() {
        try {
            const client = new Ollama({ host: config.ollama.host });
            await client.list();
            return true;
        }
        catch {
            return false;
        }
    },
    getSetupInstructions: getOllamaSetupInstructions,
    async createSession() {
        const client = new Ollama({ host: config.ollama.host });
        try {
            await client.list();
        }
        catch {
            throw new Error(getOllamaUnreachableMessage());
        }
        return new OllamaSession(client, config.ollama.model);
    },
};
//# sourceMappingURL=ollama.js.map