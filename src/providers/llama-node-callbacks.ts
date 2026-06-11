import type { PromptOptions } from "../types/providers";

export interface LlamaNodeStreamState {
  full: string;
}

export function noopLlamaNodeCallback(): void {}

export function createLlamaNodeStreamCallback(
  options: PromptOptions,
  state: LlamaNodeStreamState
): (data: { token: string; completed: boolean }) => void {
  function handleLlamaNodeStreamToken(data: {
    token: string;
    completed: boolean;
  }): void {
    if (data.token) {
      state.full += data.token;
      if (options.onTextChunk) {
        options.onTextChunk(data.token);
      }
    }
  }

  return handleLlamaNodeStreamToken;
}
