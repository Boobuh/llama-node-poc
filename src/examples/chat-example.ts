import * as readline from "readline";
import chalk from "chalk";
import { config } from "../config";
import type { ChatMessage, LlamaConfig, LlamaError } from "../types";

const llamaNode = require("llama-node");

interface ReadLineInterface {
  question(query: string, callback: (answer: string) => void): void;
  close(): void;
}

/**
 * Interactive chat example using llama-node package - TypeScript version
 */
export async function runChatExample(
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<void> {
  const rl: ReadLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    console.log(chalk.yellow("💬 Interactive Chat Example (TypeScript)\n"));
    console.log(
      chalk.cyan(
        "This typed example demonstrates interactive conversation with a Llama model"
      )
    );
    console.log(chalk.cyan('Type "exit", "quit", or "q" to exit\n'));

    const generationConfig: LlamaConfig = {
      temperature: options.temperature ?? config.generation.temperature,
      maxTokens: options.maxTokens ?? config.generation.maxTokens,
      topP: config.generation.topP,
      topK: config.generation.topK,
      repeatPenalty: config.generation.repeatPenalty,
    };

    const chatHistory: ChatMessage[] = [];

    if (config.prompts.chat.includes("You are")) {
      chatHistory.push({
        role: "system",
        content: config.prompts.chat,
      });
    } else {
      chatHistory.push({
        role: "system",
        content: "You are a helpful AI assistant.",
      });
    }

    console.log(chalk.yellow("🔧 Chat Configuration:"));
    console.log(chalk.gray(`  Temperature: ${generationConfig.temperature}`));
    console.log(chalk.gray(`  Max Tokens: ${generationConfig.maxTokens}`));
    console.log(chalk.gray(`  Context Length: ${config.model.contextLength}`));

    const fs = require("fs");
    const modelExists = fs.existsSync(config.model.path);

    if (!modelExists) {
      showModelSetupInstructions();
      rl.close();
      return;
    }

    console.log(chalk.blue("\n🤖 Starting chat session..."));

    const Llama = llamaNode.LlamaApi;
    const api = new Llama(config.model.path);

    let messageCount = 0;

    const askQuestion = async (): Promise<void> => {
      rl.question(chalk.green("\n👤 You: "), async (input: string) => {
        const trimmedInput = input.trim();

        if (config.cli.exitCommands.includes(trimmedInput.toLowerCase())) {
          console.log(chalk.yellow("\n👋 Goodbye! Thanks for chatting!"));
          rl.close();
          return;
        }

        if (trimmedInput.length === 0) {
          console.log(chalk.red("❌ Please enter a message"));
          askQuestion();
          return;
        }

        try {
          const userMessage: ChatMessage = {
            role: "user",
            content: trimmedInput,
          };
          chatHistory.push(userMessage);
          messageCount++;

          console.log(chalk.blue("\n🤖 Assistant: "), chalk.gray("typing..."));

          const startTime = Date.now();

          const response: string = await api.generate(trimmedInput, {
            ...generationConfig,
            context: chatHistory.slice(-10), // Keep last 10 messages for context
          });

          const endTime = Date.now();

          const assistantMessage: ChatMessage = {
            role: "assistant",
            content: response,
          };
          chatHistory.push(assistantMessage);

          console.log(chalk.white(response));
          console.log(
            chalk.gray(
              `⏱️ ${endTime - startTime}ms | 💬 Message ${messageCount}`
            )
          );
        } catch (error: unknown) {
          console.error(chalk.red("\n❌ Chat Error:"));
          console.error(
            chalk.red((error as LlamaError).message || "Unknown error occurred")
          );

          console.log(chalk.yellow('\n💡 Try again or type "exit" to quit'));
        }

        askQuestion();
      });
    };

    await askQuestion();
  } catch (error: unknown) {
    handleError(error as LlamaError, "chat example");
    rl.close();
  }
}

/**
 * Display setup instructions for models
 */
function showModelSetupInstructions(): void {
  console.log(chalk.yellow("📋 Model Setup Required:"));
  console.log(chalk.white("1. Download a Llama model in GGUF format"));
  console.log(chalk.white("2. Place it in the ./models/ directory"));
  console.log(chalk.white("3. Run the chat example again"));

  console.log(
    chalk.cyan("\n🔗 Download models from: "),
    chalk.blue("https://huggingface.co/TheBloke")
  );

  console.log(chalk.yellow("\n💡 Quick Setup:"));
  console.log(chalk.gray(`mkdir -p models`));
  console.log(
    chalk.gray(
      `wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${config.model.path}`
    )
  );

  console.log(chalk.gray("\n🚀 Run with TypeScript:"));
  console.log(chalk.gray("npm run chat"));
}

/**
 * Error handling for chat functionality
 */
function handleError(error: LlamaError, context: string): void {
  console.error(chalk.red(`❌ Error in ${context}:`));

  if (error instanceof Error) {
    console.error(chalk.red("  Message:"), error.message);

    if (error.code) {
      console.error(chalk.red("  Code:"), error.code);
    }

    if (context === "chat example") {
      console.log(chalk.yellow("\n💡 Chat Troubleshooting:"));
      console.log(chalk.gray("• Check if model file is accessible"));
      console.log(chalk.gray("• Verify model format (should be GGUF)"));
      console.log(chalk.gray("• Check system memory requirements"));
      console.log(chalk.gray("• Restart chat session if context issues occur"));
    }
  } else {
    console.error(chalk.red("  Unexpected error:"), error);
  }
}

/**
 * Utilities for chat functionality
 */
export class ChatUtils {
  /**
   * Format chat message for display
   */
  static formatMessage(message: ChatMessage, index: number): string {
    const roleIcon = message.role === "user" ? "👤" : "🤖";
    const roleName = message.role === "user" ? "You" : "Assistant";

    return `${roleIcon} ${roleName} [${index}]: ${message.content}`;
  }

  /**
   * Get conversation summary
   */
  static getConversationSummary(history: ChatMessage[]): string {
    const userMessages = history.filter((msg) => msg.role === "user").length;
    const assistantMessages = history.filter(
      (msg) => msg.role === "assistant"
    ).length;

    return `Chat Summary: ${userMessages} user messages, ${assistantMessages} assistant responses`;
  }

  /**
   * Validate message input
   */
  static validateInput(input: string): { isValid: boolean; error?: string } {
    if (!input || input.trim().length === 0) {
      return { isValid: false, error: "Message cannot be empty" };
    }

    if (input.length > 1000) {
      return {
        isValid: false,
        error: "Message too long (max 1000 characters)",
      };
    }

    if (input.includes("[SYSTEM]") || input.includes("[ADMIN]")) {
      return { isValid: false, error: "Invalid characters detected" };
    }

    return { isValid: true };
  }
}

export default runChatExample;
