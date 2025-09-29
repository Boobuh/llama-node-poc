#!/usr/bin/env node

import { program } from "commander";
import chalk from "chalk";
import { config } from "./config";

import { runBasicExample } from "./examples/basic-example";
import { runChatExample } from "./examples/chat-example";
import { runStreamingExample } from "./examples/streaming-example";

/**
 * Main CLI application entry point for Llama Node.js POC (TypeScript)
 */
async function main(): Promise<void> {
  console.log(chalk.blue(config.cli.welcomeMessage));
  console.log(
    chalk.gray(
      "Built with TypeScript for better type safety and developer experience\n"
    )
  );

  program
    .name("llama-node-poc")
    .description("Llama Node.js Proof of Concept - TypeScript Edition")
    .version("1.0.0", "-v, --version", "output the version number");

  program
    .command("basic")
    .description("Run basic text generation example")
    .option(
      "-t, --temperature <number>",
      "Temperature for generation",
      (val: string) => parseFloat(val)
    )
    .option(
      "-m, --max-tokens <number>",
      "Maximum tokens to generate",
      (val: string) => parseInt(val)
    )
    .action(async (options: { temperature?: number; maxTokens?: number }) => {
      console.log(chalk.blue("🚀 Running basic Llama example..."));
      await runBasicExample(options);
    });

  program
    .command("chat")
    .description("Run interactive chat example")
    .option(
      "-t, --temperature <number>",
      "Temperature for generation",
      (val: string) => parseFloat(val)
    )
    .option(
      "-m, --max-tokens <number>",
      "Maximum tokens per response",
      (val: string) => parseInt(val)
    )
    .action(async (options: { temperature?: number; maxTokens?: number }) => {
      console.log(chalk.blue("💬 Starting interactive chat..."));
      await runChatExample(options);
    });

  program
    .command("stream")
    .description("Run streaming response example")
    .option(
      "-t, --temperature <number>",
      "Temperature for generation",
      (val: string) => parseFloat(val)
    )
    .option(
      "-m, --max-tokens <number>",
      "Maximum tokens to generate",
      (val: string) => parseInt(val)
    )
    .action(async (options: { temperature?: number; maxTokens?: number }) => {
      console.log(chalk.blue("🌊 Running streaming example..."));
      await runStreamingExample(options);
    });

  program
    .command("info")
    .description("Show system and configuration information")
    .action(() => {
      showSystemInfo();
    });

  program.on("command:*", () => {
    console.error(chalk.red("❌ Invalid command"));
    program.outputHelp();
    process.exit(1);
  });

  await program.parseAsync();
}

/**
 * Display system information and configuration
 */
function showSystemInfo(): void {
  console.log(chalk.yellow("📋 System Information\n"));

  console.log(chalk.cyan("Environment:"));
  console.log(`  Node.js: ${process.version}`);
  console.log(`  Platform: ${process.platform}`);
  console.log(`  Architecture: ${process.arch}`);

  console.log(chalk.cyan("\nConfiguration:"));
  console.log(`  Model: ${config.model.name}`);
  console.log(`  Path: ${config.model.path}`);
  console.log(`  Context Length: ${config.model.contextLength}`);
  console.log(`  Threads: ${config.model.threads}`);
  console.log(`  GPU Layers: ${config.model.gpuLayers}`);

  console.log(chalk.cyan("\nGeneration Settings:"));
  console.log(`  Temperature: ${config.generation.temperature}`);
  console.log(`  Max Tokens: ${config.generation.maxTokens}`);
  console.log(`  Top P: ${config.generation.topP}`);
  console.log(`  Top K: ${config.generation.topK}`);

  console.log(chalk.cyan("\nAvailable Commands:"));
  console.log("  basic  - Basic text generation example");
  console.log("  chat   - Interactive chat interface");
  console.log("  stream - Streaming response demo");
  console.log("  info   - Show this information");
  console.log("  help   - Show command help");
}

/**
 * Error handler for uncaught exceptions
 */
process.on("uncaughtException", (error: Error) => {
  console.error(chalk.red("❌ Uncaught Exception:"), error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason: unknown) => {
  console.error(chalk.red("❌ Unhandled Rejection:"), reason);
  process.exit(1);
});

if (require.main === module) {
  main().catch((error: Error) => {
    console.error(chalk.red("❌ Application Error:"), error.message);
    process.exit(1);
  });
}

export default main;
