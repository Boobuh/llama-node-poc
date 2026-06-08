import chalk from "chalk";
import { config } from "../config";
import { getProvider, parseProvider } from "../providers";
export function resolveProviderId(provider) {
    return parseProvider(provider ?? config.defaultProvider);
}
export function buildGenerationConfig(options) {
    return {
        temperature: options.temperature ?? config.generation.temperature,
        maxTokens: options.maxTokens ?? config.generation.maxTokens,
        topP: config.generation.topP,
        topK: config.generation.topK,
    };
}
export function printGenerationConfig(providerId, generationConfig) {
    const provider = getProvider(providerId);
    console.log(chalk.cyan("Configuration:"));
    console.log(chalk.gray(`  Provider: ${provider.label}`));
    if (providerId === "ollama") {
        console.log(chalk.gray(`  Ollama host: ${config.ollama.host}`));
        console.log(chalk.gray(`  Ollama model: ${config.ollama.model}`));
    }
    else {
        console.log(chalk.gray(`  Model path: ${config.model.path}`));
    }
    console.log(chalk.gray(`  Temperature: ${generationConfig.temperature}`));
    console.log(chalk.gray(`  Max Tokens: ${generationConfig.maxTokens}`));
}
export function handleExampleError(error, context) {
    const llamaError = error;
    console.error(chalk.red(`Error in ${context}:`));
    if (llamaError instanceof Error) {
        console.error(chalk.red("  Message:"), llamaError.message);
        if (llamaError.code) {
            console.error(chalk.red("  Code:"), llamaError.code);
        }
    }
    else {
        console.error(chalk.red("  Unexpected error:"), error);
    }
    console.log(chalk.yellow("\nProviders:"));
    console.log(chalk.gray("  --provider ollama          (Ollama server + npm ollama)"));
    console.log(chalk.gray("  --provider llama-node      (llama-node + GGUF file)"));
    console.log(chalk.gray("  --provider node-llama-cpp (node-llama-cpp + GGUF file)"));
}
//# sourceMappingURL=shared.js.map