import { config } from "../../config";
import type { LlamaProviderId } from "../../types/providers";
import { TEST_OLLAMA_MODEL } from "../../constants";

export function applyTestOllamaModel(): void {
  process.env.OLLAMA_MODEL ??= TEST_OLLAMA_MODEL;
  config.ollama.model = process.env.OLLAMA_MODEL;
}

export function prepareTestProvider(providerId: LlamaProviderId): void {
  if (providerId === "ollama") {
    applyTestOllamaModel();
  }
}
