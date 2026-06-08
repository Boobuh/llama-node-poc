import chalk from "chalk";

export function showNodeLlamaCppInfo(): void {
  console.log(chalk.yellow("Providers"));
  console.log(chalk.gray("Use --provider on any command:"));
  console.log(chalk.cyan("\n  ollama"));
  console.log(chalk.gray("    npm package `ollama` → Ollama server"));
  console.log(chalk.cyan("\n  llama-node"));
  console.log(chalk.gray("    npm package `llama-node` + local GGUF"));
  console.log(chalk.cyan("\n  node-llama-cpp"));
  console.log(chalk.gray("    npm package `node-llama-cpp` + local GGUF"));
  console.log(chalk.yellow("\nExample:"));
  console.log(chalk.gray("  npm run dev -- basic --provider ollama"));
}
