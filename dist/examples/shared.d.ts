import { type LlamaProviderId } from "../providers";
import type { LlamaConfig } from "../types";
export interface ExampleOptions {
    temperature?: number;
    maxTokens?: number;
    provider?: string;
}
export declare function resolveProviderId(provider?: string): LlamaProviderId;
export declare function buildGenerationConfig(options: ExampleOptions): LlamaConfig;
export declare function printGenerationConfig(providerId: LlamaProviderId, generationConfig: LlamaConfig): void;
export declare function handleExampleError(error: unknown, context: string): void;
//# sourceMappingURL=shared.d.ts.map