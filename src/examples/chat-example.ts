import * as readline from "readline";
import chalk from "chalk";
import { config } from "../config";
import type { ChatMessage, LlamaConfig, LlamaError } from "../types";

const llamaNode = require("llama-node");

interface ReadLineInterface {
  question(query: string, callback: (answer: string) => void): void;
  close(): void;
}

export async function runChatExample(
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<void> {
  try {
    console.log(
      chalk.yellow("💬 Interactive Llama Chat Example (TypeScript)\n")
    );

    const Llama = llamaNode.LlamaApi;
    const modelPath: string = config.model.path;

    const generationConfig: LlamaConfig = {
      temperature: options.temperature ?? config.generation.temperature,
      maxTokens: options.maxTokens ?? config.generation.maxTokens,
      topP: config.generation.topP,
      topK: config.generation.topK,
    };

    console.log(chalk.cyan("Configuration:"));
    console.log(chalk.gray(`  Model: ${config.model.name}`));
    console.log(chalk.gray(`  Temperature: ${generationConfig.temperature}`));
    console.log(chalk.gray(`  Max Tokens: ${generationConfig.maxTokens}`));

    const fs = require("fs");
    const modelExists = fs.existsSync(modelPath);

    if (!modelExists) {
      showModelSetupInstructions(modelPath);
      return;
    }

    console.log(chalk.blue("\n🤖 Loading model..."));
    const api = new Llama(modelPath);

    const chatHistory: ChatMessage[] = [
      {
        role: "system",
        content: config.prompts.chat,
      },
    ];

    console.log(chalk.green("\n✅ Chat initialized!"));
    console.log(chalk.gray("Type 'exit', 'quit', or 'q' to end."));
    console.log(chalk.gray("Ask me anything!\n"));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    }) as ReadLineInterface;

    await startChatLoop(rl, api, chatHistory, generationConfig);

    rl.close();
  } catch (error: unknown) {
    handleError(error as LlamaError, "chat example");
  }
}

async function startChatLoop(
  rl: ReadLineInterface,
  api: any,
  chatHistory: ChatMessage[],
  config: LlamaConfig
): Promise<void> {
  const askQuestion = (): void => {
    rl.question(chalk.blue("You: "), async (userInput: string) => {
      if (isExitCommand(userInput)) {
        console.log(chalk.yellow("\n👋 Goodbye! Chat session ended."));
        return;
      }

      if (userInput.trim() === "") {
        askQuestion();
        return;
      }

      chatHistory.push({
        role: "user",
        content: userInput,
      });

      console.log(chalk.green("Assistant: "), chalk.white("thinking..."));
      const startTime = Date.now();

      try {
        const response = await generateResponse(api, chatHistory, config);
        const endTime = Date.now();

        chatHistory.push({
          role: "assistant",
          content: response.text || response.toString(),
        });

        console.log(
          chalk.white(response.text || response),
          chalk.gray(`\n  (${endTime - startTime}ms)`)
        );
      } catch (error) {
        console.error(chalk.red("❌ Error generating response"), error);
      }

      askQuestion();
    });
  };

  askQuestion();
}

async function generateResponse(
  api: any,
  chatHistory: ChatMessage[],
  config: LlamaConfig
): Promise<any> {
  const prompt = buildPromptFromHistory(chatHistory);
  return await api.generate(prompt, config);
}

function buildPromptFromHistory(history: ChatMessage[]): string {
  return (
    history
      .map(
        (msg) =>
          `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
      )
      .join("\n\n") + "\nAssistant: "
  );
}

function isExitCommand(input: string): boolean {
  const normalizedInput = input.toLowerCase().trim();
  return config.cli.exitCommands.includes(normalizedInput);
}

function showModelSetupInstructions(modelPath: string): void {
  console.log(chalk.yellow("\n📋 Model Setup Instructions:"));
  console.log(chalk.white("1. Download a Llama model in GGUF format"));
  console.log(chalk.white("2. Place it in the ./models/ directory"));
  console.log(chalk.white("3. Run the chat example again"));

  console.log(chalk.yellow("\n💡 Example Setup:"));
  console.log(chalk.gray(`mkdir -p models`));
  console.log(
    chalk.gray(
      `wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${modelPath}`
    )
  );

  console.log(chalk.yellow("\n🚀 Run Chat:"));
  console.log(chalk.gray("npm run chat"));
}

function handleError(error: LlamaError, context: string): void {
  console.error(chalk.red(`❌ Error in ${context}:`));

  if (error instanceof Error) {
    console.error(chalk.red("  Message:"), error.message);

    if (error.code) {
      console.error(chalk.red("  Code:"), error.code);
    }

    if (error.details) {
      console.error(
        chalk.red("  Details:"),
        JSON.stringify(error.details, null, 2)
      );
    }
  } else {
    console.error(chalk.red("  Unexpected error:"), error);
  }

  console.log(chalk.yellow("\n💡 Troubleshooting:"));
  console.log(chalk.gray("• Check model file exists"));
  console.log(chalk.gray("• Verify Node.js compatibility"));
  console.log(chalk.gray("• Check system memory"));
}
