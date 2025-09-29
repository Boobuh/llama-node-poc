/**
 * TypeScript type definitions for Llama Node.js POC
 */
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
export interface AppConfig {
    model: ModelConfig;
    generation: GenerationConfig;
    prompts: PromptsConfig;
    cli: CliConfig;
}
export interface CommandArgs {
    command?: string;
    prompt?: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
    help?: boolean;
    version?: boolean;
}
export interface LlamaApiInterface {
    generate(prompt: string, config?: LlamaConfig): Promise<GenerationResult>;
}
export interface StreamCallback {
    (token: string): void;
}
export interface LlamaStreamConfig extends LlamaConfig {
    callback?: StreamCallback;
}
export interface CommandHandler {
    (args?: CommandArgs): Promise<void>;
}
export interface ExampleFunction {
    (): Promise<void>;
}
export declare class LlamaError extends Error {
    code: string | undefined;
    details: unknown;
    constructor(message: string, code?: string, details?: unknown);
}
export type LogLevel = "debug" | "info" | "warn" | "error";
export type ModelSize = "7B" | "13B" | "70B";
export type Quality = "Good" | "Better" | "Best";
export type Speed = "Fast" | "Medium" | "Slow";
export type UseCase = "Development & Testing" | "Production Use" | "High-Quality Applications";
export interface ModelInfo {
    name: string;
    size: string;
    quality: Quality;
    speed: Speed;
    useCase: UseCase;
    sizeGB: number;
}
export * from "./index";
//# sourceMappingURL=index.d.ts.map