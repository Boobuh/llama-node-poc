import chalk from "chalk";

// Currently disabled to avoid dependency conflicts

export function showNodeLlamaCppInfo(): void {
  console.log(chalk.yellow("📦 Node-llama-cpp Example"));
  console.log(chalk.gray("This example requires the node-llama-cpp package"));
  console.log(chalk.gray("Install with: npm install node-llama-cpp"));
  console.log(chalk.cyan("\nFeatures:"));
  console.log(chalk.gray("• Advanced model management"));
  console.log(chalk.gray("• GPU acceleration support"));
  console.log(chalk.gray("• Custom tokenization"));
  console.log(chalk.gray("• Performance optimizations"));
}
