import { program } from "commander";
import chalk from "chalk";
import {
  CLI_DESCRIPTION,
  CLI_PROGRAM_NAME,
  CLI_PROVIDER_HELP,
  CLI_TAGLINE,
  CLI_VERSION,
  PROVIDER_USAGE_LINES,
} from "./constants";
import { config } from "./config";
import { providerList } from "./providers";
import type { CommandOptions } from "./types/cli";

import { runBasicExample } from "./examples/basic-example";
import { runChatExample } from "./examples/chat-example";
import { runStreamingExample } from "./examples/streaming-example";

function parseTemperature(val: string): number {
  return parseFloat(val);
}

function parseMaxTokens(val: string): number {
  return parseInt(val, 10);
}

function addCommonOptions(command: ReturnType<typeof program.command>) {
  return command
    .option(
      "-t, --temperature <number>",
      "Temperature for generation",
      parseTemperature
    )
    .option(
      "-m, --max-tokens <number>",
      "Maximum tokens to generate",
      parseMaxTokens
    )
    .option("-p, --provider <name>", CLI_PROVIDER_HELP, config.defaultProvider);
}

function showProviders(): void {
  console.log(chalk.yellow("Llama providers for Node.js\n"));
  for (const p of providerList) {
    console.log(chalk.cyan(`  ${p.id}`));
    console.log(chalk.gray(`    ${p.description}`));
  }
  console.log(chalk.yellow("\nUsage:"));
  for (const line of PROVIDER_USAGE_LINES) {
    console.log(chalk.gray(`  ${line}`));
  }
}

function showSystemInfo(): void {
  console.log(chalk.yellow("System Information\n"));

  console.log(chalk.cyan("Environment:"));
  console.log(`  Node.js: ${process.version}`);
  console.log(`  Platform: ${process.platform}`);
  console.log(`  Architecture: ${process.arch}`);

  console.log(chalk.cyan("\nDefault provider:"), config.defaultProvider);

  console.log(chalk.cyan("\nOllama:"));
  console.log(`  Host: ${config.ollama.host}`);
  console.log(`  Model: ${config.ollama.model}`);

  console.log(chalk.cyan("\nGGUF model (llama-node):"));
  console.log(`  Name: ${config.model.name}`);
  console.log(`  Path: ${config.model.path}`);
  console.log(`  Context Length: ${config.model.contextLength}`);
  console.log(`  Threads: ${config.model.threads}`);
  console.log(`  GPU Layers: ${config.model.gpuLayers}`);

  console.log(chalk.cyan("\nGeneration Settings:"));
  console.log(`  Temperature: ${config.generation.temperature}`);
  console.log(`  Max Tokens: ${config.generation.maxTokens}`);
  console.log(`  Top P: ${config.generation.topP}`);
  console.log(`  Top K: ${config.generation.topK}`);

  showProviders();
}

async function runBasicCommand(options: CommandOptions): Promise<void> {
  await runBasicExample(options);
}

async function runChatCommand(options: CommandOptions): Promise<void> {
  await runChatExample(options);
}

async function runStreamCommand(options: CommandOptions): Promise<void> {
  await runStreamingExample(options);
}

function handleInvalidCommand(): void {
  console.error(chalk.red("Invalid command"));
  program.outputHelp();
  process.exit(1);
}

function handleUncaughtException(error: Error): void {
  console.error(chalk.red("Uncaught Exception:"), error.message);
  process.exit(1);
}

function handleUnhandledRejection(reason: unknown): void {
  console.error(chalk.red("Unhandled Rejection:"), reason);
  process.exit(1);
}

function isMainModule(): boolean {
  return (
    import.meta.url === `file://${process.argv[1]}` ||
    Boolean(process.argv[1]?.includes("index"))
  );
}

async function main(): Promise<void> {
  console.log(chalk.blue(config.cli.welcomeMessage));
  console.log(chalk.gray(`${CLI_TAGLINE}\n`));

  program
    .name(CLI_PROGRAM_NAME)
    .description(CLI_DESCRIPTION)
    .version(CLI_VERSION, "-v, --version", "output the version number");

  addCommonOptions(
    program.command("basic").description("Run basic text generation example")
  ).action(runBasicCommand);

  addCommonOptions(
    program.command("chat").description("Run interactive chat example")
  ).action(runChatCommand);

  addCommonOptions(
    program.command("stream").description("Run streaming response example")
  ).action(runStreamCommand);

  program
    .command("info")
    .description("Show system and configuration information")
    .action(showSystemInfo);

  program
    .command("providers")
    .description("List available Llama providers for Node.js")
    .action(showProviders);

  program.on("command:*", handleInvalidCommand);

  await program.parseAsync();
}

process.on("uncaughtException", handleUncaughtException);
process.on("unhandledRejection", handleUnhandledRejection);

if (isMainModule()) {
  try {
    await main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red("Application Error:"), message);
    process.exit(1);
  }
}

export default main;
