import chalk from "chalk";
import fs from "node:fs";
import { config } from "../config";
import type { LlamaConfig, LlamaError } from "../types";

export async function runBasicExample(
  options: { temperature?: number; maxTokens?: number } = {}
): Promise<void> {
  try {
    console.log(
      chalk.yellow("Basic Llama Text Generation Example (TypeScript)\n")
    );

    console.log(chalk.green("Initializing Llama model..."));

    const modelPath: string = config.model.path;
    const generationConfig: LlamaConfig = {
      temperature: options.temperature ?? config.generation.temperature,
      maxTokens: options.maxTokens ?? config.generation.maxTokens,
      topP: config.generation.topP,
      topK: config.generation.topK,
    };

    console.log(chalk.cyan("Configuration:"));
    console.log(chalk.gray(`  Model Path: ${modelPath}`));
    console.log(chalk.gray(` Temperature: ${generationConfig.temperature}`));
    console.log(chalk.gray(`  Max Tokens: ${generationConfig.maxTokens}`));
    console.log(chalk.gray(`  Top P: ${generationConfig.topP}`));
    console.log(chalk.gray(`  Top K: ${generationConfig.topK}`));

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

    const prompt: string = config.prompts.basic;

    console.log(chalk.blue("\nPrompt:"), chalk.white(prompt));
    console.log(chalk.blue("Generating response...\n"));

    const startTime = Date.now();
    const promptOptions = {
      temperature:
        generationConfig.temperature ?? config.generation.temperature,
      topP: generationConfig.topP ?? config.generation.topP,
      topK: generationConfig.topK ?? config.generation.topK,
      maxTokens: generationConfig.maxTokens ?? config.generation.maxTokens,
    };
    const response = await session.prompt(prompt, promptOptions);
    const endTime = Date.now();

    console.log(chalk.green("Response:"));
    console.log(chalk.white(response));
    console.log(chalk.gray(`\nGeneration time: ${endTime - startTime}ms`));
  } catch (error: unknown) {
    handleError(error as LlamaError, "basic example");
  }
}

function showModelSetupInstructions(modelPath: string): void {
  console.log(chalk.yellow("\nModel Setup Instructions:"));
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
    chalk.cyan("\nDownload from: "),
    chalk.blue("https://huggingface.co/TheBloke")
  );

  console.log(chalk.yellow("\nExample Setup:"));
  console.log(chalk.gray(`mkdir -p models`));
  console.log(
    chalk.gray(
      `wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguff -O ${modelPath}`
    )
  );

  console.log(chalk.yellow("\nRun with TypeScript:"));
  console.log(chalk.gray("npm run basic"));
}

function handleError(error: LlamaError, context: string): void {
  console.error(chalk.red(`Error in ${context}:`));

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

  console.log(chalk.yellow("\nTroubleshooting Tips:"));
  console.log(chalk.gray("• Check model file exists and is accessible"));
  console.log(chalk.gray("• Verify Node.js version compatibility"));
  console.log(chalk.gray("• Check system memory requirements"));
  console.log(chalk.gray("• Ensure proper model format (GGUF)"));
}

export function showApiExample(): void {
  console.log(chalk.yellow("\nTypeScript API Example:"));
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
