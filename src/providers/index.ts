import { ollamaProvider } from "./ollama";
import { llamaNodeProvider } from "./llama-node";
import { nodeLlamaCppProvider } from "./node-llama-cpp";
import type {
  LlamaProviderId,
  LlamaSession,
  PromptOptions,
  ProviderAdapter,
} from "./types";

export type { LlamaProviderId, LlamaSession, PromptOptions, ProviderAdapter };

const providers: Record<LlamaProviderId, ProviderAdapter> = {
  ollama: ollamaProvider,
  "llama-node": llamaNodeProvider,
  "node-llama-cpp": nodeLlamaCppProvider,
};

export const providerList: ProviderAdapter[] = Object.values(providers);

export function getProvider(id: LlamaProviderId): ProviderAdapter {
  const provider = providers[id];
  if (!provider) {
    throw new Error(`Unknown provider: ${id}`);
  }
  return provider;
}

export function parseProvider(value?: string): LlamaProviderId {
  if (!value) {
    return "ollama";
  }
  if (value in providers) {
    return value as LlamaProviderId;
  }
  throw new Error(
    `Unknown provider "${value}". Use: ollama, llama-node, node-llama-cpp`
  );
}
