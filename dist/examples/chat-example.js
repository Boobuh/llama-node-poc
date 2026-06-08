import * as readline from "readline";
import chalk from "chalk";
import { config } from "../config";
import { getProvider } from "../providers";
import { buildGenerationConfig, handleExampleError, printGenerationConfig, resolveProviderId, } from "./shared";
export async function runChatExample(options = {}) {
    const providerId = resolveProviderId(options.provider);
    const provider = getProvider(providerId);
    const generationConfig = buildGenerationConfig(options);
    try {
        console.log(chalk.yellow(`Interactive Llama Chat (${provider.label})\n`));
        printGenerationConfig(providerId, generationConfig);
        if (!(await provider.isAvailable())) {
            console.log(chalk.yellow("\n" + provider.getSetupInstructions()));
            return;
        }
        console.log(chalk.blue("\nConnecting..."));
        const session = await provider.createSession();
        console.log(chalk.green("\nChat initialized!"));
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
        handleExampleError(error, "chat example");
    }
}
async function startChatLoop(rl, session, generationConfig) {
    const askQuestion = () => {
        rl.question(chalk.blue("You: "), async (userInput) => {
            if (isExitCommand(userInput)) {
                console.log(chalk.yellow("\nGoodbye! Chat session ended."));
                return;
            }
            if (userInput.trim() === "") {
                askQuestion();
                return;
            }
            console.log(chalk.green("Assistant: "), chalk.white("thinking..."));
            try {
                const startTime = Date.now();
                const response = await session.prompt(userInput, generationConfig);
                const endTime = Date.now();
                console.log(chalk.white(response), chalk.gray(`\n  (${endTime - startTime}ms)`));
            }
            catch (error) {
                console.error(chalk.red("Error generating response"), error);
            }
            askQuestion();
        });
    };
    askQuestion();
}
function isExitCommand(input) {
    return config.cli.exitCommands.includes(input.toLowerCase().trim());
}
//# sourceMappingURL=chat-example.js.map