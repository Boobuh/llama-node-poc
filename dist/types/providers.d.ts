export type LlamaProviderId = "ollama" | "llama-node";
export interface PromptOptions {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
    onTextChunk?: (text: string) => void;
}
export interface LlamaSession {
    prompt(text: string, options?: PromptOptions): Promise<string>;
    dispose?(): Promise<void> | void;
}
export interface ProviderAdapter {
    id: LlamaProviderId;
    label: string;
    description: string;
    isAvailable(): Promise<boolean>;
    getSetupInstructions(): string;
    createSession(): Promise<LlamaSession>;
}
//# sourceMappingURL=providers.d.ts.map