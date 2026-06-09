import * as readline from "readline";
import chalk from "chalk";
import { config } from "../config";
import { getProvider } from "../providers";
import type { LlamaSession } from "../types/providers";
import type { LlamaConfig } from "../types";
import type { ReadLineInterface } from "../types/cli";
import { isExitCommand } from "../utils/exit-command";
import {
  buildGenerationConfig,
  handleExampleError,
  printGenerationConfig,
  resolveProviderId,
  type ExampleOptions,
} from "./shared";

export async function runChatExample(
  options: ExampleOptions = {}
): Promise<void> {
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
    }) as ReadLineInterface;

    await startChatLoop(rl, session, generationConfig);
    rl.close();
  } catch (error: unknown) {
    handleExampleError(error, "chat example");
  }
}

async function startChatLoop(
  rl: ReadLineInterface,
  session: LlamaSession,
  generationConfig: LlamaConfig
): Promise<void> {
  const askQuestion = (): void => {
    rl.question(chalk.blue("You: "), async (userInput: string) => {
      if (isExitCommand(userInput, config.cli.exitCommands)) {
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

        console.log(
          chalk.white(response),
          chalk.gray(`\n  (${endTime - startTime}ms)`)
        );
      } catch (error) {
        console.error(chalk.red("Error generating response"), error);
      }

      askQuestion();
    });
  };

  askQuestion();
}
