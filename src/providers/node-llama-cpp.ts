import fs from "node:fs";
import { config } from "../config";
import type { ProviderAdapter, LlamaSession, PromptOptions } from "./types";

class NodeLlamaCppSession implements LlamaSession {
  constructor(private readonly session: { prompt: Function }) {}

  async prompt(text: string, options: PromptOptions = {}): Promise<string> {
    return this.session.prompt(text, {
      temperature: options.temperature ?? config.generation.temperature,
      maxTokens: options.maxTokens ?? config.generation.maxTokens,
      topP: options.topP ?? config.generation.topP,
      topK: options.topK ?? config.generation.topK,
      onTextChunk: options.onTextChunk,
    }) as Promise<string>;
  }
}

export const nodeLlamaCppProvider: ProviderAdapter = {
  id: "node-llama-cpp",
  label: "node-llama-cpp",
  description: "TypeScript bindings to llama.cpp (in-process GGUF)",

  async isAvailable(): Promise<boolean> {
    return fs.existsSync(config.model.path);
  },

  getSetupInstructions(): string {
    return [
      "node-llama-cpp setup (GGUF in ./models/):",
      "  npm install node-llama-cpp",
      `  Place model at ${config.model.path}`,
      "  npm run dev -- basic --provider node-llama-cpp",
    ].join("\n");
  },

  async createSession(): Promise<LlamaSession> {
    if (!fs.existsSync(config.model.path)) {
      throw new Error(`Model not found: ${config.model.path}`);
    }

    const { getLlama, LlamaChatSession } = await import("node-llama-cpp");
    const llama = await getLlama();
    const model = await llama.loadModel({
      modelPath: config.model.path,
      gpuLayers: config.model.gpuLayers,
    });
    const context = await model.createContext();
    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    });

    return new NodeLlamaCppSession(session);
  },
};
