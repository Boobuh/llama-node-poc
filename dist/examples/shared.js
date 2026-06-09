import chalk from "chalk";
import { EXAMPLE_PROVIDER_HELP_LINES } from "../constants";
import { config } from "../config";
import { getProvider, parseProvider } from "../providers";
import { LlamaError } from "../types/errors";
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
    console.error(chalk.red(`Error in ${context}:`));
    if (error instanceof LlamaError || error instanceof Error) {
        console.error(chalk.red("  Message:"), error.message);
        if (error instanceof LlamaError && error.code) {
            console.error(chalk.red("  Code:"), error.code);
        }
    }
    else {
        console.error(chalk.red("  Unexpected error:"), error);
    }
    console.log(chalk.yellow("\nProviders:"));
    for (const line of EXAMPLE_PROVIDER_HELP_LINES) {
        console.log(chalk.gray(`  ${line}`));
    }
}
//# sourceMappingURL=shared.js.map