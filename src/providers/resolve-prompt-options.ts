import type { GenerationConfig } from "../types";
import type { PromptOptions } from "../types/providers";

export interface ResolvedPromptOptions {
  temperature: number;
  maxTokens: number;
  topP: number;
  topK: number;
}

export function resolvePromptOptions(
  options: PromptOptions,
  generation: GenerationConfig
): ResolvedPromptOptions {
  return {
    temperature: options.temperature ?? generation.temperature,
    maxTokens: options.maxTokens ?? generation.maxTokens,
    topP: options.topP ?? generation.topP,
    topK: options.topK ?? generation.topK,
  };
}
