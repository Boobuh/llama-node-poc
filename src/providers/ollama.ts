import { Ollama } from "ollama";
import { config } from "../config";
import { resolvePromptOptions } from "./resolve-prompt-options";
import {
  getOllamaSetupInstructions,
  getOllamaUnreachableMessage,
} from "./setup-messages";
import type { ProviderAdapter, LlamaSession, PromptOptions } from "../types/providers";

class OllamaSession implements LlamaSession {
  constructor(
    private readonly client: Ollama,
    private readonly model: string
  ) {}

  async prompt(text: string, options: PromptOptions = {}): Promise<string> {
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

export const ollamaProvider: ProviderAdapter = {
  id: "ollama",
  label: "Ollama",
  description: "Official Node.js client → Ollama server (localhost:11434)",

  async isAvailable(): Promise<boolean> {
    try {
      const client = new Ollama({ host: config.ollama.host });
      await client.list();
      return true;
    } catch {
      return false;
    }
  },

  getSetupInstructions: getOllamaSetupInstructions,

  async createSession(): Promise<LlamaSession> {
    const client = new Ollama({ host: config.ollama.host });
    try {
      await client.list();
    } catch {
      throw new Error(getOllamaUnreachableMessage());
    }
    return new OllamaSession(client, config.ollama.model);
  },
};
