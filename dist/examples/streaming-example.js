"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runStreamingExample = runStreamingExample;
exports.showStreamingExample = showStreamingExample;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../config");
const llamaNode = require("llama-node");
async function runStreamingExample(options = {}) {
    try {
        console.log(chalk_1.default.yellow("🌊 Streaming Llama Response Example (TypeScript)\n"));
        const Llama = llamaNode.LlamaApi;
        const modelPath = config_1.config.model.path;
        const streamConfig = {
            temperature: options.temperature ?? config_1.config.generation.temperature,
            maxTokens: options.maxTokens ?? config_1.config.generation.maxTokens,
            topP: config_1.config.generation.topP,
            topK: config_1.config.generation.topK,
        };
        console.log(chalk_1.default.cyan("Configuration:"));
        console.log(chalk_1.default.gray(`  Model: ${config_1.config.model.name}`));
        console.log(chalk_1.default.gray(`  Temperature: ${streamConfig.temperature}`));
        console.log(chalk_1.default.gray(`  Max Tokens: ${streamConfig.maxTokens}`));
        const fs = require("fs");
        const modelExists = fs.existsSync(modelPath);
        if (!modelExists) {
            showModelSetupInstructions(modelPath);
            return;
        }
        console.log(chalk_1.default.blue("\n🤖 Loading model..."));
        const api = new Llama(modelPath);
        const prompt = config_1.config.prompts.stream;
        console.log(chalk_1.default.blue("\n💭 Prompt:"), chalk_1.default.white(prompt));
        console.log(chalk_1.default.blue("🌊 Streaming response (watch as it generates)...\n"));
        await streamResponse(api, prompt, streamConfig);
    }
    catch (error) {
        handleError(error, "streaming example");
    }
}
async function streamResponse(api, prompt, config) {
    const startTime = Date.now();
    const callback = (token) => {
        if (token) {
            process.stdout.write(chalk_1.default.white(token));
        }
    };
    console.log(chalk_1.default.green("🤖 Response: "));
    try {
        const result = await api.generate(prompt, {
            ...config,
            stream: true,
            callback: callback,
        });
        console.log(chalk_1.default.white(result.text || result));
        const endTime = Date.now();
        console.log(chalk_1.default.gray(`\n\n⏱️ Total generation time: ${endTime - startTime}ms`));
    }
    catch (error) {
        console.error(chalk_1.default.red("❌ Streaming error:"), error);
        throw error;
    }
}
function showModelSetupInstructions(modelPath) {
    console.log(chalk_1.default.yellow("\n📋 Model Setup Instructions:"));
    console.log(chalk_1.default.white("1. Download a Llama model in GGUF format"));
    console.log(chalk_1.default.white("2. Place it in the ./models/ directory"));
    console.log(chalk_1.default.white("3. Run the streaming example again"));
    console.log(chalk_1.default.white("4. Recommended models for streaming:"));
    const streamingModels = [
        "Llama-2-7B-Chat (~4GB) - Fast streaming",
        "Llama-2-13B-Chat (~7GB) - Balanced streaming",
        "Llama-2-70B-Chat (~40GB) - High-quality streaming",
    ];
    streamingModels.forEach((model) => {
        console.log(chalk_1.default.gray(`   • ${model}`));
    });
    console.log(chalk_1.default.cyan("\n🔗 Download from: "), chalk_1.default.blue("https://huggingface.co/TheBloke"));
    console.log(chalk_1.default.yellow("\n💡 Example Setup:"));
    console.log(chalk_1.default.gray(`mkdir -p models`));
    console.log(chalk_1.default.gray(`wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${modelPath}`));
    console.log(chalk_1.default.yellow("\n🚀 Run Streaming:"));
    console.log(chalk_1.default.gray("npm run stream"));
}
function handleError(error, context) {
    console.error(chalk_1.default.red(`❌ Error in ${context}:`));
    if (error instanceof Error) {
        console.error(chalk_1.default.red("  Message:"), error.message);
        if (error.code) {
            console.error(chalk_1.default.red("  Code:"), error.code);
        }
        if (error.details) {
            console.error(chalk_1.default.red("  Details:"), JSON.stringify(error.details, null, 2));
        }
    }
    else {
        console.error(chalk_1.default.red("  Unexpected error:"), error);
    }
    console.log(chalk_1.default.yellow("\n💡 Troubleshooting:"));
    console.log(chalk_1.default.gray("• Check streaming implementation"));
    console.log(chalk_1.default.gray("• Verify model compatibility"));
    console.log(chalk_1.default.gray("• Check callback function"));
    console.log(chalk_1.default.gray("• Ensure sufficient RAM"));
}
function showStreamingExample() {
    console.log(chalk_1.default.yellow("\n💻 Streaming API Example:"));
    console.log(chalk_1.default.gray(`
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
  `));
}
//# sourceMappingURL=streaming-example.js.map