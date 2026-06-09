import type { ExampleOptions } from "../types/cli";
import type { LlamaConfig } from "../types";
import type { LlamaProviderId } from "../types/providers";
export type { ExampleOptions };
export declare function resolveProviderId(provider?: string): LlamaProviderId;
export declare function buildGenerationConfig(options: ExampleOptions): LlamaConfig;
export declare function printGenerationConfig(providerId: LlamaProviderId, generationConfig: LlamaConfig): void;
export declare function handleExampleError(error: unknown, context: string): void;
//# sourceMappingURL=shared.d.ts.map