import { program } from "commander";
import chalk from "chalk";
import { config } from "./config";
import { providerList } from "./providers";
import { runBasicExample } from "./examples/basic-example";
import { runChatExample } from "./examples/chat-example";
import { runStreamingExample } from "./examples/streaming-example";
function addCommonOptions(command) {
    return command
        .option("-t, --temperature <number>", "Temperature for generation", (val) => parseFloat(val))
        .option("-m, --max-tokens <number>", "Maximum tokens to generate", (val) => parseInt(val, 10))
        .option("-p, --provider <name>", "Backend: ollama | llama-node | node-llama-cpp", config.defaultProvider);
}
async function main() {
    console.log(chalk.blue(config.cli.welcomeMessage));
    console.log(chalk.gray("Llama on Node.js — Ollama client, llama-node, or node-llama-cpp\n"));
    program
        .name("llama-node-poc")
        .description("Llama on Node.js — multiple provider backends")
        .version("1.0.0", "-v, --version", "output the version number");
    addCommonOptions(program.command("basic").description("Run basic text generation example")).action(async (options) => {
        await runBasicExample(options);
    });
    addCommonOptions(program.command("chat").description("Run interactive chat example")).action(async (options) => {
        await runChatExample(options);
    });
    addCommonOptions(program.command("stream").description("Run streaming response example")).action(async (options) => {
        await runStreamingExample(options);
    });
    program
        .command("info")
        .description("Show system and configuration information")
        .action(() => {
        showSystemInfo();
    });
    program
        .command("providers")
        .description("List available Llama providers for Node.js")
        .action(() => {
        showProviders();
    });
    program.on("command:*", () => {
        console.error(chalk.red("Invalid command"));
        program.outputHelp();
        process.exit(1);
    });
    await program.parseAsync();
}
function showProviders() {
    console.log(chalk.yellow("Llama providers for Node.js\n"));
    for (const p of providerList) {
        console.log(chalk.cyan(`  ${p.id}`));
        console.log(chalk.gray(`    ${p.description}`));
    }
    console.log(chalk.yellow("\nUsage:"));
    console.log(chalk.gray("  npm run dev -- basic --provider ollama"));
    console.log(chalk.gray("  npm run dev -- basic --provider llama-node"));
    console.log(chalk.gray("  npm run dev -- basic --provider node-llama-cpp"));
}
function showSystemInfo() {
    console.log(chalk.yellow("System Information\n"));
    console.log(chalk.cyan("Environment:"));
    console.log(`  Node.js: ${process.version}`);
    console.log(`  Platform: ${process.platform}`);
    console.log(`  Architecture: ${process.arch}`);
    console.log(chalk.cyan("\nDefault provider:"), config.defaultProvider);
    console.log(chalk.cyan("\nOllama:"));
    console.log(`  Host: ${config.ollama.host}`);
    console.log(`  Model: ${config.ollama.model}`);
    console.log(chalk.cyan("\nGGUF model (llama-node / node-llama-cpp):"));
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
process.on("uncaughtException", (error) => {
    console.error(chalk.red("Uncaught Exception:"), error.message);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.error(chalk.red("Unhandled Rejection:"), reason);
    process.exit(1);
});
if (import.meta.url === `file://${process.argv[1]}` ||
    process.argv[1]?.includes("index")) {
    main().catch((error) => {
        console.error(chalk.red("Application Error:"), error.message);
        process.exit(1);
    });
}
export default main;
//# sourceMappingURL=index.js.map