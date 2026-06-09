import type { LlamaProviderId } from "../types/providers";

export const LLAMA_PROVIDER_IDS = ["ollama", "llama-node"] as const satisfies readonly LlamaProviderId[];

export const DEFAULT_LLAMA_PROVIDER_ID: LlamaProviderId = "ollama";

export const REQUIRED_TEST_PROVIDERS: LlamaProviderId[] = ["ollama"];
export const OPTIONAL_TEST_PROVIDERS: LlamaProviderId[] = ["llama-node"];

export const UNKNOWN_PROVIDER_MESSAGE = (value: string) =>
  `Unknown provider "${value}". Use: ollama, llama-node`;

export const UNKNOWN_PROVIDER_ID_MESSAGE = (id: string) =>
  `Unknown provider: ${id}`;
