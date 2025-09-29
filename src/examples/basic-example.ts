import chalk from "chalk";
import { config } from "../config";
import type { LlamaConfig, GenerationResult, LlamaError } from "../types";

const llamaNode = require("llama-node");

/**
 * Basic Llama example using llama-node package - TypeScript version
 */
export async function runBasicExample(
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<void> {
  try {
    console.log(
      chalk.yellow("📝 Basic Llama Text Generation Example (TypeScript)\n")
    );

    const Llama = llamaNode.LlamaApi;

    console.log(chalk.green("⚙️ Initializing Llama model..."));

    const modelPath: string = config.model.path;
    const generationConfig: LlamaConfig = {
      temperature: options.temperature ?? config.generation.temperature,
      maxTokens: options.maxTokens ?? config.generation.maxTokens,
      topP: config.generation.topP,
      topK: config.generation.topK,
    };

    console.log(chalk.cyan("Configuration:"));
    console.log(chalk.gray(`  Model Path: ${modelPath}`));
    console.log(chalk.gray(`  Temperature: ${generationConfig.temperature}`));
    console.log(chalk.gray(`  Max Tokens: ${generationConfig.maxTokens}`));
    console.log(chalk.gray(`  Top P: ${generationConfig.topP}`));
    console.log(chalk.gray(`  Top K: ${generationConfig.topK}`));

    const fs = require("fs");
    const modelExists = fs.existsSync(modelPath);

    if (!modelExists) {
      showModelSetupInstructions(modelPath);
      return;
    }

    console.log(chalk.blue("\n🤖 Loading model..."));
    const api = new Llama(modelPath);

    const prompt: string = config.prompts.basic;

    console.log(chalk.blue("\n💭 Prompt:"), chalk.white(prompt));
    console.log(chalk.blue("🔄 Generating response...\n"));

    const startTime = Date.now();
    const response: GenerationResult = await api.generate(
      prompt,
      generationConfig
    );
    const endTime = Date.now();

    console.log(chalk.green("✅ Response:"));
    console.log(chalk.white(response.text || response));
    console.log(chalk.gray(`\n⏱️ Generation time: ${endTime - startTime}ms`));

    if (
      typeof response === "object" &&
      "tokens" in response &&
      response.tokens
    ) {
      console.log(chalk.gray(`🎯 Tokens generated: ${response.tokens}`));
    }
  } catch (error: unknown) {
    handleError(error as LlamaError, "basic example");
  }
}

/**
 * Display setup instructions for downloading models
 */
function showModelSetupInstructions(modelPath: string): void {
  console.log(chalk.yellow("\n📋 Model Setup Instructions:"));
  console.log(chalk.white("1. Download a Llama model in GGUF format"));
  console.log(chalk.white("2. Place it in the ./models/ directory"));
  console.log(chalk.white("3. Run the example again"));
  console.log(chalk.white("4. Supported models:"));

  const recommendedModels = [
    "Llama-2-7B-Chat (~4GB) - Development & Testing",
    "Llama-2-13B-Chat (~7GB) - Production Use",
    "Llama-2-70B-Chat (~40GB) - High-Quality Applications",
  ];

  recommendedModels.forEach((model) => {
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

  console.log(chalk.yellow("\n🚀 Run with TypeScript:"));
  console.log(chalk.gray("npm run basic"));
}

/**
 * Error handling with TypeScript types
 */
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

  console.log(chalk.yellow("\n💡 Troubleshooting Tips:"));
  console.log(chalk.gray("• Check model file exists and is accessible"));
  console.log(chalk.gray("• Verify Node.js version compatibility"));
  console.log(chalk.gray("• Check system memory requirements"));
  console.log(chalk.gray("• Ensure proper model format (GGUF)"));
}

/**
 * Display API usage example
 */
export function showApiExample(): void {
  console.log(chalk.yellow("\n💻 TypeScript API Example:"));
  console.log(
    chalk.gray(`
import type { LlamaConfig, GenerationResult } from '../types';

const api = new Llama('./models/llama-model.gguf');

const config: LlamaConfig = {
  temperature: 0.7,
  maxTokens: 200,
  topP: 0.9,
  topK: 40
};

const result: Promise<GenerationResult> = api.generate("Tell me about AI", config);
console.log(result);
  `)
  );
}
