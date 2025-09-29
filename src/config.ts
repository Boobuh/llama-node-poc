import type { AppConfig } from "./types";

/**
 * Configuration file for Llama Node.js POC - TypeScript version
 */
export const config: AppConfig = {
  model: {
    path: "./models/llama-model.gguf",
    name: "llama-2-7B-chat",
    contextLength: 4096,
    batchSize: 512,
    threads: 4,
    gpuLayers: -1, // -1 for all GPU layers, 0 for CPU only
  },

  generation: {
    temperature: 0.7,
    maxTokens: 200,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
  },

  prompts: {
    basic: "Tell me a short story about a robot discovering emotions.",
    chat: "You are a helpful AI assistant. How can I help you today?",
    stream: "Write a detailed explanation of quantum computing.",
  },

  cli: {
    welcomeMessage: "🚀 Llama Node.js POC - Interactive Examples (TypeScript)",
    exitCommands: ["exit", "quit", "q"],
  },
};

export const { model: modelConfig, generation: generationConfig } = config;

export function validateConfig(config: AppConfig): boolean {
  const isValid =
    config.model.path.length > 0 &&
    config.model.contextLength > 0 &&
    config.model.batchSize > 0 &&
    config.model.threads > 0 &&
    config.generation.temperature >= 0 &&
    config.generation.temperature <= 2 &&
    config.generation.maxTokens > 0 &&
    config.generation.topP >= 0 &&
    config.generation.topP <= 1 &&
    config.generation.topK > 0 &&
    config.generation.repeatPenalty >= 0;

  if (!isValid) {
    throw new Error("Invalid configuration detected");
  }

  return isValid;
}

export function getModelRecommendation(
  useCase: "development" | "production" | "high-quality"
): string {
  switch (useCase) {
    case "development":
      return "Llama-2-7B-Chat (~4GB) - Great for development & testing";
    case "production":
      return "Llama-2-13B-Chat (~7GB) - Balanced for production use";
    case "high-quality":
      return "Llama-2-70B-Chat (~40GB) - Maximum quality (high resource needs)";
    default:
      return "Llama-2-7B-Chat (~4GB) - Default recommendation";
  }
}

export default config;
