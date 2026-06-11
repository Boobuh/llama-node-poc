import type { PromptOptions } from "../types/providers";
export interface LlamaNodeStreamState {
    full: string;
}
export declare function noopLlamaNodeCallback(): void;
export declare function createLlamaNodeStreamCallback(options: PromptOptions, state: LlamaNodeStreamState): (data: {
    token: string;
    completed: boolean;
}) => void;
//# sourceMappingURL=llama-node-callbacks.d.ts.map