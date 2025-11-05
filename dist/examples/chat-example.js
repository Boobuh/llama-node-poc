import * as readline from "readline";
import chalk from "chalk";
import fs from "fs";
import { config } from "../config";
export async function runChatExample(options = {}) {
    try {
        console.log(chalk.yellow("💬 Interactive Llama Chat Example (TypeScript)\n"));
        const modelPath = config.model.path;
        const generationConfig = {
            temperature: options.temperature ?? config.generation.temperature,
            maxTokens: options.maxTokens ?? config.generation.maxTokens,
            topP: config.generation.topP,
            topK: config.generation.topK,
        };
        console.log(chalk.cyan("Configuration:"));
        console.log(chalk.gray(`  Model: ${config.model.name}`));
        console.log(chalk.gray(`  Temperature: ${generationConfig.temperature}`));
        console.log(chalk.gray(`  Max Tokens: ${generationConfig.maxTokens}`));
        const modelExists = fs.existsSync(modelPath);
        if (!modelExists) {
            showModelSetupInstructions(modelPath);
            return;
        }
        console.log(chalk.blue("\n🤖 Loading model..."));
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
        console.log(chalk.green("\n✅ Chat initialized!"));
        console.log(chalk.gray("Type 'exit', 'quit', or 'q' to end."));
        console.log(chalk.gray("Ask me anything!\n"));
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        await startChatLoop(rl, session, generationConfig);
        rl.close();
    }
    catch (error) {
        handleError(error, "chat example");
    }
}
async function startChatLoop(rl, session, config) {
    const askQuestion = () => {
        rl.question(chalk.blue("You: "), async (userInput) => {
            if (isExitCommand(userInput)) {
                console.log(chalk.yellow("\n👋 Goodbye! Chat session ended."));
                return;
            }
            if (userInput.trim() === "") {
                askQuestion();
                return;
            }
            console.log(chalk.green("Assistant: "), chalk.white("thinking..."));
            try {
                const startTime = Date.now();
                const response = await session.prompt(userInput, {
                    temperature: config.temperature ?? 0.7,
                    topP: config.topP ?? 0.9,
                    topK: config.topK ?? 40,
                    maxTokens: config.maxTokens ?? 200,
                });
                const endTime = Date.now();
                console.log(chalk.white(response), chalk.gray(`\n  (${endTime - startTime}ms)`));
            }
            catch (error) {
                console.error(chalk.red("❌ Error generating response"), error);
            }
            askQuestion();
        });
    };
    askQuestion();
}
function isExitCommand(input) {
    const normalizedInput = input.toLowerCase().trim();
    return config.cli.exitCommands.includes(normalizedInput);
}
function showModelSetupInstructions(modelPath) {
    console.log(chalk.yellow("\n📋 Model Setup Instructions:"));
    console.log(chalk.white("1. Download a Llama model in GGUF format"));
    console.log(chalk.white("2. Place it in the ./models/ directory"));
    console.log(chalk.white("3. Run the chat example again"));
    console.log(chalk.yellow("\n💡 Example Setup:"));
    console.log(chalk.gray(`mkdir -p models`));
    console.log(chalk.gray(`wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${modelPath}`));
    console.log(chalk.yellow("\n🚀 Run Chat:"));
    console.log(chalk.gray("npm run chat"));
}
function handleError(error, context) {
    console.error(chalk.red(`❌ Error in ${context}:`));
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
    console.log(chalk.yellow("\n💡 Troubleshooting:"));
    console.log(chalk.gray("• Check model file exists"));
    console.log(chalk.gray("• Verify Node.js compatibility"));
    console.log(chalk.gray("• Check system memory"));
}
//# sourceMappingURL=chat-example.js.map