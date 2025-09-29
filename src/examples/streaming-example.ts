import chalk from "chalk";
import { config } from "../config";
import type { LlamaStreamConfig, StreamCallback, LlamaError } from "../types";

const llamaNode = require("llama-node");

export async function runStreamingExample(
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<void> {
  try {
    console.log(
      chalk.yellow("🌊 Streaming Llama Response Example (TypeScript)\n")
    );

    const Llama = llamaNode.LlamaApi;
    const modelPath: string = config.model.path;

    const streamConfig: LlamaStreamConfig = {
      temperature: options.temperature ?? config.generation.temperature,
      maxTokens: options.maxTokens ?? config.generation.maxTokens,
      topP: config.generation.topP,
      topK: config.generation.topK,
    };

    console.log(chalk.cyan("Configuration:"));
    console.log(chalk.gray(`  Model: ${config.model.name}`));
    console.log(chalk.gray(`  Temperature: ${streamConfig.temperature}`));
    console.log(chalk.gray(`  Max Tokens: ${streamConfig.maxTokens}`));

    const fs = require("fs");
    const modelExists = fs.existsSync(modelPath);

    if (!modelExists) {
      showModelSetupInstructions(modelPath);
      return;
    }

    console.log(chalk.blue("\n🤖 Loading model..."));
    const api = new Llama(modelPath);

    const prompt: string = config.prompts.stream;

    console.log(chalk.blue("\n💭 Prompt:"), chalk.white(prompt));
    console.log(
      chalk.blue("🌊 Streaming response (watch as it generates)...\n")
    );

    await streamResponse(api, prompt, streamConfig);
  } catch (error: unknown) {
    handleError(error as LlamaError, "streaming example");
  }
}

async function streamResponse(
  api: any,
  prompt: string,
  config: LlamaStreamConfig
): Promise<void> {
  const startTime = Date.now();

  const callback: StreamCallback = (token: string) => {
    if (token) {
      process.stdout.write(chalk.white(token));
    }
  };

  console.log(chalk.green("🤖 Response: "));

  try {
    const result = await api.generate(prompt, {
      ...config,
      stream: true,
      callback: callback,
    });

    console.log(chalk.white(result.text || result));

    const endTime = Date.now();
    console.log(
      chalk.gray(`\n\n⏱️ Total generation time: ${endTime - startTime}ms`)
    );
  } catch (error) {
    console.error(chalk.red("❌ Streaming error:"), error);
    throw error;
  }
}

function showModelSetupInstructions(modelPath: string): void {
  console.log(chalk.yellow("\n📋 Model Setup Instructions:"));
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

  console.log(
    chalk.cyan("\n🔗 Download from: "),
    chalk.blue("https://huggingface.co/TheBloke")
  );

  console.log(chalk.yellow("\n💡 Example Setup:"));
  console.log(chalk.gray(`mkdir -p models`));
  console.log(
    chalk.gray(
      `wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${modelPath}`
    )
  );

  console.log(chalk.yellow("\n🚀 Run Streaming:"));
  console.log(chalk.gray("npm run stream"));
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
  console.log(chalk.gray("• Check streaming implementation"));
  console.log(chalk.gray("• Verify model compatibility"));
  console.log(chalk.gray("• Check callback function"));
  console.log(chalk.gray("• Ensure sufficient RAM"));
}

export function showStreamingExample(): void {
  console.log(chalk.yellow("\n💻 Streaming API Example:"));
  console.log(
    chalk.gray(`
const api = new Llama('./models/model.gguf');

const response = await api.generate("Write a story", {
  temperature: 0.7,
  maxTokens: 200,
  stream: true,
  callback: (token, isComplete) => {
    if (token) process.stdout.write(token);
    if (isComplete) console.log("\\nDone!");
  }
});
  `)
  );
}
