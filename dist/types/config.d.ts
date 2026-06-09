export interface LlamaConfig {
    temperature?: number;
    maxTokens?: number;
    topP?: number;
    topK?: number;
    repeatPenalty?: number;
    stream?: boolean;
    context?: ChatMessage[];
}
export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
}
export interface GenerationResult {
    text: string;
    tokens?: number;
    finishReason?: "stop" | "length" | "error";
}
export interface ModelConfig {
    path: string;
    name: string;
    contextLength: number;
    batchSize: number;
    threads: number;
    gpuLayers: number;
}
export interface GenerationConfig {
    temperature: number;
    maxTokens: number;
    topP: number;
    topK: number;
    repeatPenalty: number;
}
export interface PromptsConfig {
    basic: string;
    chat: string;
    stream: string;
}
export interface CliConfig {
    welcomeMessage: string;
    exitCommands: string[];
}
export interface OllamaConfig {
    host: string;
    model: string;
}
export interface AppConfig {
    defaultProvider: import("./providers").LlamaProviderId;
    ollama: OllamaConfig;
    model: ModelConfig;
    generation: GenerationConfig;
    prompts: PromptsConfig;
    cli: CliConfig;
}
export interface StreamCallback {
    (token: string): void;
}
export interface LlamaStreamConfig extends LlamaConfig {
    callback?: StreamCallback;
}
export type ModelRecommendationUseCase = "development" | "production" | "high-quality";
export interface ParsedPersonJson {
    name?: string;
    age?: number;
}
export interface InstructionFollowingResult {
    isExact: boolean;
    isStrict: boolean;
    normalized: string;
}
export interface StructuredJsonResult {
    isValidJson: boolean;
    parsed: ParsedPersonJson | null;
    hasName: boolean;
    hasAge: boolean;
}
//# sourceMappingURL=config.d.ts.map