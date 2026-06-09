export interface LlamaNodeLlm {
    createCompletion: (params: Record<string, unknown>, callback: (data: {
        token: string;
        completed: boolean;
    }) => void) => Promise<{
        tokens: string[];
    }>;
}
export interface LlamaNodeLoadParams {
    modelPath: string;
    enableLogging: boolean;
    nCtx: number;
    nGpuLayers: number;
    seed: number;
    f16Kv: boolean;
    logitsAll: boolean;
    vocabOnly: boolean;
    useMlock: boolean;
    embedding: boolean;
    useMmap: boolean;
}
//# sourceMappingURL=llama-node.d.ts.map