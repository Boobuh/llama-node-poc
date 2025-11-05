/**
 * Configuration file for Llama Node.js POC - TypeScript version
 */
export const appConfig = {
    model: {
        path: "./models/llama-model.gguf",
        name: "llama-2-7B-chat",
        contextLength: 4096,
        batchSize: 512,
        threads: 4,
        gpuLayers: -1, // -1 for all GPU layers, 0 for CPU only
    },
    generation: {
        temperature: 0.7,
        maxTokens: 200,
        topP: 0.9,
        topK: 40,
        repeatPenalty: 1.1,
    },
    prompts: {
        basic: "Tell me a short story about a robot discovering emotions.",
        chat: "You are a helpful AI assistant. How can I help you today?",
        stream: "Write a detailed explanation of quantum computing.",
    },
    cli: {
        welcomeMessage: "Llama Node.js POC - Interactive Examples (TypeScript)",
        exitCommands: ["exit", "quit", "q"],
    },
};
export const { model: modelConfig, generation: generationConfig } = appConfig;
export function validateConfig(checkConfig) {
    const isValid = checkConfig.model.path.length > 0 &&
        checkConfig.model.contextLength > 0 &&
        checkConfig.model.batchSize > 0 &&
        checkConfig.model.threads > 0 &&
        checkConfig.generation.temperature >= 0 &&
        checkConfig.generation.temperature <= 2 &&
        checkConfig.generation.maxTokens > 0 &&
        checkConfig.generation.topP >= 0 &&
        checkConfig.generation.topP <= 1 &&
        checkConfig.generation.topK > 0 &&
        checkConfig.generation.repeatPenalty >= 0;
    if (!isValid) {
        throw new Error("Invalid configuration detected");
    }
    return isValid;
}
export function getModelRecommendation(useCase) {
    switch (useCase) {
        case "development":
            return "Llama-2-7B-Chat (~4GB) - Great for development & testing";
        case "production":
            return "Llama-2-13B-Chat (~7GB) - Balanced for production use";
        case "high-quality":
            return "Llama-2-70B-Chat (~40GB) - Maximum quality (high resource needs)";
        default:
            return "Llama-2-7B-Chat (~4GB) - Default recommendation";
    }
}
export default appConfig;
export { appConfig as config };
//# sourceMappingURL=config.js.map