import {
  DEFAULT_LLAMA_PROVIDER_ID,
  UNKNOWN_PROVIDER_ID_MESSAGE,
  UNKNOWN_PROVIDER_MESSAGE,
} from "../constants";
import { ollamaProvider } from "./ollama";
import { llamaNodeProvider } from "./llama-node";
import type { LlamaProviderId, ProviderAdapter } from "../types/providers";

export const providerRegistry: Record<LlamaProviderId, ProviderAdapter> = {
  ollama: ollamaProvider,
  "llama-node": llamaNodeProvider,
};

export const providerList: ProviderAdapter[] = Object.values(providerRegistry);

export function getProvider(id: LlamaProviderId): ProviderAdapter {
  const provider = providerRegistry[id];
  if (!provider) {
    throw new Error(UNKNOWN_PROVIDER_ID_MESSAGE(id));
  }
  return provider;
}

export function parseProvider(value?: string): LlamaProviderId {
  if (!value) {
    return DEFAULT_LLAMA_PROVIDER_ID;
  }
  if (value in providerRegistry) {
    return value as LlamaProviderId;
  }
  throw new Error(UNKNOWN_PROVIDER_MESSAGE(value));
}
