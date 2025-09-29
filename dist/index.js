"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("./config");
const basic_example_1 = require("./examples/basic-example");
const chat_example_1 = require("./examples/chat-example");
const streaming_example_1 = require("./examples/streaming-example");
async function main() {
    console.log(chalk_1.default.blue(config_1.config.cli.welcomeMessage));
    console.log(chalk_1.default.gray("Built with TypeScript for better type safety and developer experience\n"));
    commander_1.program
        .name("llama-node-poc")
        .description("Llama Node.js Proof of Concept - TypeScript Edition")
        .version("1.0.0", "-v, --version", "output the version number");
    commander_1.program
        .command("basic")
        .description("Run basic text generation example")
        .option("-t, --temperature <number>", "Temperature for generation", (val) => parseFloat(val))
        .option("-m, --max-tokens <number>", "Maximum tokens to generate", (val) => parseInt(val))
        .action(async (options) => {
        console.log(chalk_1.default.blue("🚀 Running basic Llama example..."));
        await (0, basic_example_1.runBasicExample)(options);
    });
    commander_1.program
        .command("chat")
        .description("Run interactive chat example")
        .option("-t, --temperature <number>", "Temperature for generation", (val) => parseFloat(val))
        .option("-m, --max-tokens <number>", "Maximum tokens per response", (val) => parseInt(val))
        .action(async (options) => {
        console.log(chalk_1.default.blue("💬 Starting interactive chat..."));
        await (0, chat_example_1.runChatExample)(options);
    });
    commander_1.program
        .command("stream")
        .description("Run streaming response example")
        .option("-t, --temperature <number>", "Temperature for generation", (val) => parseFloat(val))
        .option("-m, --max-tokens <number>", "Maximum tokens to generate", (val) => parseInt(val))
        .action(async (options) => {
        console.log(chalk_1.default.blue("🌊 Running streaming example..."));
        await (0, streaming_example_1.runStreamingExample)(options);
    });
    commander_1.program
        .command("info")
        .description("Show system and configuration information")
        .action(() => {
        showSystemInfo();
    });
    commander_1.program.on("command:*", () => {
        console.error(chalk_1.default.red("❌ Invalid command"));
        commander_1.program.outputHelp();
        process.exit(1);
    });
    await commander_1.program.parseAsync();
}
function showSystemInfo() {
    console.log(chalk_1.default.yellow("📋 System Information\n"));
    console.log(chalk_1.default.cyan("Environment:"));
    console.log(`  Node.js: ${process.version}`);
    console.log(`  Platform: ${process.platform}`);
    console.log(`  Architecture: ${process.arch}`);
    console.log(chalk_1.default.cyan("\nConfiguration:"));
    console.log(`  Model: ${config_1.config.model.name}`);
    console.log(`  Path: ${config_1.config.model.path}`);
    console.log(`  Context Length: ${config_1.config.model.contextLength}`);
    console.log(`  Threads: ${config_1.config.model.threads}`);
    console.log(`  GPU Layers: ${config_1.config.model.gpuLayers}`);
    console.log(chalk_1.default.cyan("\nGeneration Settings:"));
    console.log(`  Temperature: ${config_1.config.generation.temperature}`);
    console.log(`  Max Tokens: ${config_1.config.generation.maxTokens}`);
    console.log(`  Top P: ${config_1.config.generation.topP}`);
    console.log(`  Top K: ${config_1.config.generation.topK}`);
    console.log(chalk_1.default.cyan("\nAvailable Commands:"));
    console.log("  basic  - Basic text generation example");
    console.log("  chat   - Interactive chat interface");
    console.log("  stream - Streaming response demo");
    console.log("  info   - Show this information");
    console.log("  help   - Show command help");
}
process.on("uncaughtException", (error) => {
    console.error(chalk_1.default.red("❌ Uncaught Exception:"), error.message);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.error(chalk_1.default.red("❌ Unhandled Rejection:"), reason);
    process.exit(1);
});
if (require.main === module) {
    main().catch((error) => {
        console.error(chalk_1.default.red("❌ Application Error:"), error.message);
        process.exit(1);
    });
}
exports.default = main;
//# sourceMappingURL=index.js.map