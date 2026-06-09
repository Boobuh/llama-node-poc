import type { LlamaProviderId, ProviderAdapter } from "../types/providers";
export declare const providerRegistry: Record<LlamaProviderId, ProviderAdapter>;
export declare const providerList: ProviderAdapter[];
export declare function getProvider(id: LlamaProviderId): ProviderAdapter;
export declare function parseProvider(value?: string): LlamaProviderId;
//# sourceMappingURL=registry.d.ts.map