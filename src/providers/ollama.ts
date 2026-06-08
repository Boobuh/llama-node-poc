import { Ollama } from "ollama";
import { config } from "../config";
import type { ProviderAdapter, LlamaSession, PromptOptions } from "./types";

class OllamaSession implements LlamaSession {
  constructor(
    private readonly client: Ollama,
    private readonly model: string
  ) {}

  async prompt(text: string, options: PromptOptions = {}): Promise<string> {
    const temperature = options.temperature ?? config.generation.temperature;
    const maxTokens = options.maxTokens ?? config.generation.maxTokens;

    if (options.onTextChunk) {
      let full = "";
      const stream = await this.client.chat({
        model: this.model,
        messages: [{ role: "user", content: text }],
        stream: true,
        options: {
          temperature,
          num_predict: maxTokens,
          top_p: options.topP ?? config.generation.topP,
          top_k: options.topK ?? config.generation.topK,
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
        temperature,
        num_predict: maxTokens,
        top_p: options.topP ?? config.generation.topP,
        top_k: options.topK ?? config.generation.topK,
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

  getSetupInstructions(): string {
    return [
      "Ollama setup:",
      "  1. Install Ollama: https://ollama.com",
      `  2. Pull a model: ollama pull ${config.ollama.model}`,
      "  3. Ensure server is running: ollama serve",
      `  4. Run: npm run dev -- basic --provider ollama`,
    ].join("\n");
  },

  async createSession(): Promise<LlamaSession> {
    const client = new Ollama({ host: config.ollama.host });
    try {
      await client.list();
    } catch {
      throw new Error(
        `Cannot reach Ollama at ${config.ollama.host}. Start with: ollama serve`
      );
    }
    return new OllamaSession(client, config.ollama.model);
  },
};
