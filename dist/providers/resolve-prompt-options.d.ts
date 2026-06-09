import type { GenerationConfig } from "../types";
import type { PromptOptions } from "../types/providers";
export interface ResolvedPromptOptions {
    temperature: number;
    maxTokens: number;
    topP: number;
    topK: number;
}
export declare function resolvePromptOptions(options: PromptOptions, generation: GenerationConfig): ResolvedPromptOptions;
//# sourceMappingURL=resolve-prompt-options.d.ts.map