export const DEFAULT_PROVIDER = "ollama" as const;

export const DEFAULT_OLLAMA_HOST = "http://127.0.0.1:11434";
export const DEFAULT_OLLAMA_MODEL = "llama3.2";

export const DEFAULT_MODEL_PATH = "./models/llama-model.gguf";
export const DEFAULT_MODEL_NAME = "llama-2-7B-chat";
export const DEFAULT_CONTEXT_LENGTH = 4096;
export const DEFAULT_BATCH_SIZE = 512;
export const DEFAULT_THREADS = 4;
export const DEFAULT_GPU_LAYERS = 0;

export const DEFAULT_TEMPERATURE = 0.7;
export const DEFAULT_MAX_TOKENS = 200;
export const DEFAULT_TOP_P = 0.9;
export const DEFAULT_TOP_K = 40;
export const DEFAULT_REPEAT_PENALTY = 1.1;

export const DEFAULT_PROMPTS = {
  basic: "Tell me a short story about a robot discovering emotions.",
  chat: "You are a helpful AI assistant. How can I help you today?",
  stream: "Write a detailed explanation of quantum computing.",
} as const;

export const DEFAULT_CLI = {
  welcomeMessage: "Llama Node.js POC - Interactive Examples (TypeScript)",
  exitCommands: ["exit", "quit", "q"],
} as const;

export const CONFIG_LIMITS = {
  temperatureMin: 0,
  temperatureMax: 2,
  topPMin: 0,
  topPMax: 1,
} as const;
