import chalk from "chalk";
import fs from "node:fs";
import { config } from "../config";
export async function runStreamingExample(options = {}) {
    try {
        console.log(chalk.yellow("Streaming Llama Response Example (TypeScript)\n"));
        const modelPath = config.model.path;
        const streamConfig = {
            temperature: options.temperature ?? config.generation.temperature,
            maxTokens: options.maxTokens ?? config.generation.maxTokens,
            topP: config.generation.topP,
            topK: config.generation.topK,
        };
        console.log(chalk.cyan("Configuration:"));
        console.log(chalk.gray(`  Model: ${config.model.name}`));
        console.log(chalk.gray(`  Temperature: ${streamConfig.temperature}`));
        console.log(chalk.gray(`  Max Tokens: ${streamConfig.maxTokens}`));
        const modelExists = fs.existsSync(modelPath);
        if (!modelExists) {
            showModelSetupInstructions(modelPath);
            return;
        }
        console.log(chalk.blue("\nLoading model..."));
        const nodeLlamaCpp = await import("node-llama-cpp");
        const { getLlama, LlamaChatSession } = nodeLlamaCpp;
        const llama = await getLlama();
        const model = await llama.loadModel({
            modelPath: modelPath,
        });
        const context = await model.createContext();
        const session = new LlamaChatSession({
            contextSequence: context.getSequence(),
        });
        const prompt = config.prompts.stream;
        console.log(chalk.blue("\nPrompt:"), chalk.white(prompt));
        console.log(chalk.blue("Streaming response (watch as it generates)...\n"));
        await streamResponse(session, prompt, streamConfig);
    }
    catch (error) {
        handleError(error, "streaming example");
    }
}
async function streamResponse(session, prompt, config) {
    const startTime = Date.now();
    let fullResponse = "";
    console.log(chalk.green("Response: "));
    try {
        await session.prompt(prompt, {
            temperature: config.temperature ?? 0.7,
            topP: config.topP ?? 0.9,
            topK: config.topK ?? 40,
            maxTokens: config.maxTokens ?? 200,
            onTextChunk: (text) => {
                if (text) {
                    fullResponse += text;
                    process.stdout.write(chalk.white(text));
                }
            },
        });
        const endTime = Date.now();
        console.log(chalk.gray(`\n\nTotal generation time: ${endTime - startTime}ms`));
        console.log(chalk.gray(`Total characters: ${fullResponse.length}`));
    }
    catch (error) {
        console.error(chalk.red("Streaming error:"), error);
        throw error;
    }
}
function showModelSetupInstructions(modelPath) {
    console.log(chalk.yellow("\nModel Setup Instructions:"));
    console.log(chalk.white("1. Download a Llama model in GGUF format"));
    console.log(chalk.white("2. Place it in the ./models/ directory"));
    console.log(chalk.white("3. Run the streaming example again"));
    console.log(chalk.white("4. Recommended models for streaming:"));
    const streamingModels = [
        "Llama-2-7B-Chat (~4GB) - Fast streaming",
        "Llama-2-13B-Chat (~7GB) - Balanced streaming",
        "Llama-2-70B-Chat (~40GB) - High-quality streaming",
    ];
    streamingModels.forEach((model) => {
        console.log(chalk.gray(`   • ${model}`));
    });
    console.log(chalk.cyan("\nDownload from: "), chalk.blue("https://huggingface.co/TheBloke"));
    console.log(chalk.yellow("\nExample Setup:"));
    console.log(chalk.gray(`mkdir -p models`));
    console.log(chalk.gray(`wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${modelPath}`));
    console.log(chalk.yellow("\nRun Streaming:"));
    console.log(chalk.gray("npm run stream"));
}
function handleError(error, context) {
    console.error(chalk.red(`Error in ${context}:`));
    if (error instanceof Error) {
        console.error(chalk.red("  Message:"), error.message);
        if (error.code) {
            console.error(chalk.red("  Code:"), error.code);
        }
        if (error.details) {
            console.error(chalk.red("  Details:"), JSON.stringify(error.details, null, 2));
        }
    }
    else {
        console.error(chalk.red("  Unexpected error:"), error);
    }
    console.log(chalk.yellow("\nTroubleshooting:"));
    console.log(chalk.gray("• Check streaming implementation"));
    console.log(chalk.gray("• Verify model compatibility"));
    console.log(chalk.gray("• Check callback function"));
    console.log(chalk.gray("• Ensure sufficient RAM"));
}
export function showStreamingExample() {
    console.log(chalk.yellow("\nStreaming API Example:"));
    console.log(chalk.gray(`
const session = new LlamaChatSession({ contextSequence });

await session.prompt("Write a story", {
  temperature: 0.7,
  maxTokens: 200,
  onTextChunk: (text) => {
    process.stdout.write(text);
  }
});
  `));
}
//# sourceMappingURL=streaming-example.js.map