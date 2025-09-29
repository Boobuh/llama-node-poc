"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBasicExample = runBasicExample;
exports.showApiExample = showApiExample;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../config");
const llamaNode = require("llama-node");
/**
 * Basic Llama example using llama-node package - TypeScript version
 */
async function runBasicExample(options = {}) {
    try {
        console.log(chalk_1.default.yellow("📝 Basic Llama Text Generation Example (TypeScript)\n"));
        const Llama = llamaNode.LlamaApi;
        console.log(chalk_1.default.green("⚙️ Initializing Llama model..."));
        const modelPath = config_1.config.model.path;
        const generationConfig = {
            temperature: options.temperature ?? config_1.config.generation.temperature,
            maxTokens: options.maxTokens ?? config_1.config.generation.maxTokens,
            topP: config_1.config.generation.topP,
            topK: config_1.config.generation.topK,
        };
        console.log(chalk_1.default.cyan("Configuration:"));
        console.log(chalk_1.default.gray(`  Model Path: ${modelPath}`));
        console.log(chalk_1.default.gray(`  Temperature: ${generationConfig.temperature}`));
        console.log(chalk_1.default.gray(`  Max Tokens: ${generationConfig.maxTokens}`));
        console.log(chalk_1.default.gray(`  Top P: ${generationConfig.topP}`));
        console.log(chalk_1.default.gray(`  Top K: ${generationConfig.topK}`));
        const fs = require("fs");
        const modelExists = fs.existsSync(modelPath);
        if (!modelExists) {
            showModelSetupInstructions(modelPath);
            return;
        }
        console.log(chalk_1.default.blue("\n🤖 Loading model..."));
        const api = new Llama(modelPath);
        const prompt = config_1.config.prompts.basic;
        console.log(chalk_1.default.blue("\n💭 Prompt:"), chalk_1.default.white(prompt));
        console.log(chalk_1.default.blue("🔄 Generating response...\n"));
        const startTime = Date.now();
        const response = await api.generate(prompt, generationConfig);
        const endTime = Date.now();
        console.log(chalk_1.default.green("✅ Response:"));
        console.log(chalk_1.default.white(response.text || response));
        console.log(chalk_1.default.gray(`\n⏱️ Generation time: ${endTime - startTime}ms`));
        if (typeof response === "object" &&
            "tokens" in response &&
            response.tokens) {
            console.log(chalk_1.default.gray(`🎯 Tokens generated: ${response.tokens}`));
        }
    }
    catch (error) {
        handleError(error, "basic example");
    }
}
/**
 * Display setup instructions for downloading models
 */
function showModelSetupInstructions(modelPath) {
    console.log(chalk_1.default.yellow("\n📋 Model Setup Instructions:"));
    console.log(chalk_1.default.white("1. Download a Llama model in GGUF format"));
    console.log(chalk_1.default.white("2. Place it in the ./models/ directory"));
    console.log(chalk_1.default.white("3. Run the example again"));
    console.log(chalk_1.default.white("4. Supported models:"));
    const recommendedModels = [
        "Llama-2-7B-Chat (~4GB) - Development & Testing",
        "Llama-2-13B-Chat (~7GB) - Production Use",
        "Llama-2-70B-Chat (~40GB) - High-Quality Applications",
    ];
    recommendedModels.forEach((model) => {
        console.log(chalk_1.default.gray(`   • ${model}`));
    });
    console.log(chalk_1.default.cyan("\n🔗 Download from: "), chalk_1.default.blue("https://huggingface.co/TheBloke"));
    console.log(chalk_1.default.yellow("\n💡 Example Setup:"));
    console.log(chalk_1.default.gray(`mkdir -p models`));
    console.log(chalk_1.default.gray(`wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${modelPath}`));
    console.log(chalk_1.default.yellow("\n🚀 Run with TypeScript:"));
    console.log(chalk_1.default.gray("npm run basic"));
}
/**
 * Error handling with TypeScript types
 */
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
    console.log(chalk_1.default.yellow("\n💡 Troubleshooting Tips:"));
    console.log(chalk_1.default.gray("• Check model file exists and is accessible"));
    console.log(chalk_1.default.gray("• Verify Node.js version compatibility"));
    console.log(chalk_1.default.gray("• Check system memory requirements"));
    console.log(chalk_1.default.gray("• Ensure proper model format (GGUF)"));
}
/**
 * Display API usage example
 */
function showApiExample() {
    console.log(chalk_1.default.yellow("\n💻 TypeScript API Example:"));
    console.log(chalk_1.default.gray(`
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
  `));
}
//# sourceMappingURL=basic-example.js.map