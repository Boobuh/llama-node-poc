"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StreamingUtils = void 0;
exports.runStreamingExample = runStreamingExample;
const chalk_1 = __importDefault(require("chalk"));
const config_js_1 = require("../config.js");
const llamaNode = require("llama-node");
/**
 * Streaming response example using llama-node package - TypeScript version
 */
async function runStreamingExample(options = {}) {
    try {
        console.log(chalk_1.default.yellow("🌊 Streaming Response Example (TypeScript)\n"));
        console.log(chalk_1.default.cyan("This typed example demonstrates real-time streaming of LLM responses"));
        const streamConfig = {
            temperature: options.temperature ?? config_js_1.config.generation.temperature,
            maxTokens: options.maxTokens ?? config_js_1.config.generation.maxTokens,
            topP: config_js_1.config.generation.topP,
            topK: config_js_1.config.generation.topK,
            repeatPenalty: config_js_1.config.generation.repeatPenalty,
            stream: true,
        };
        console.log(chalk_1.default.yellow("🔧 Streaming Configuration:"));
        console.log(chalk_1.default.gray(`  Temperature: ${streamConfig.temperature}`));
        console.log(chalk_1.default.gray(`  Max Tokens: ${streamConfig.maxTokens}`));
        console.log(chalk_1.default.gray(`  Stream: ${streamConfig.stream}`));
        const fs = require("fs");
        const modelExists = fs.existsSync(config_js_1.config.model.path);
        if (!modelExists) {
            showModelSetupInstructions();
            return;
        }
        console.log(chalk_1.default.blue("\n🤖 Initializing streaming mode..."));
        const Llama = llamaNode.LlamaApi;
        const api = new Llama(config_js_1.config.model.path);
        const prompt = config_js_1.config.prompts.stream;
        const streamCallback = (token) => {
            process.stdout.write(chalk_1.default.green(token));
        };
        console.log(chalk_1.default.blue("\n💭 Prompt:"), prompt);
        console.log(chalk_1.default.blue("📡 Starting stream...\n"));
        if (await testStreamingSupport(api)) {
            await performRealStreaming(api, prompt, streamConfig, streamCallback);
        }
        else {
            await simulateStreaming(prompt);
        }
        console.log(chalk_1.default.yellow("\n✨ Streaming example complete!"));
        showStreamingFeatures();
    }
    catch (error) {
        handleError(error, "streaming example");
    }
}
/**
 * Test if streaming is supported by the API
 */
async function testStreamingSupport(api) {
    try {
        if (typeof api.generate === "function") {
            return true;
        }
        return false;
    }
    catch {
        return false;
    }
}
/**
 * Perform real streaming with the llama API
 */
async function performRealStreaming(api, prompt, config, callback) {
    try {
        console.log(chalk_1.default.cyan("📡 Real streaming (when streaming is supported):"));
        const streamConfigWithCallback = {
            ...config,
            callback,
        };
        const startTime = Date.now();
        await api.generate(prompt, streamConfigWithCallback);
        const endTime = Date.now();
        console.log(chalk_1.default.gray(`\n⏱️ Total streaming time: ${endTime - startTime}ms`));
    }
    catch (error) {
        console.log(chalk_1.default.yellow("⚠️ Real streaming not available, falling back to simulation"));
        await simulateStreaming(prompt);
    }
}
/**
 * Simulate streaming behavior for demonstration
 */
async function simulateStreaming(text) {
    console.log(chalk_1.default.cyan("📡 Simulated streaming output:"));
    console.log(chalk_1.default.gray("(Real streaming available when model supports it)"));
    const words = text.split(" ");
    let currentText = "";
    for (let i = 0; i < words.length; i++) {
        currentText += words[i];
        process.stdout.write(chalk_1.default.green(words[i]));
        if (i < words.length - 1) {
            process.stdout.write(" ");
        }
        await new Promise((resolve) => setTimeout(resolve, Math.random() * 100 + 50));
    }
    console.log(chalk_1.default.yellow("\n\n💡 Real streaming features:"));
    console.log(chalk_1.default.gray("• Tokens appear as they are generated"));
    console.log(chalk_1.default.gray("• Lower perceived latency"));
    console.log(chalk_1.default.gray("• More engaging user experience"));
    console.log(chalk_1.default.gray("• Ability to stop generation early"));
}
/**
 * Show streaming features and benefits
 */
function showStreamingFeatures() {
    console.log(chalk_1.default.yellow("\n🌟 Streaming Benefits:"));
    console.log(chalk_1.default.white("• ⚡ Real-time user feedback"));
    console.log(chalk_1.default.white("• 🚀 Better perceived performance"));
    console.log(chalk_1.default.white("• 💬 More engaging conversations"));
    console.log(chalk_1.default.white("• ⏹️ Ability to stop generation early"));
    console.log(chalk_1.default.white("• 🔄 Progressive content delivery"));
    console.log(chalk_1.default.yellow("\n🛠️ Streaming Configuration Options:"));
    console.log(chalk_1.default.gray("• Temperature: Controls randomness (0.0 - 2.0)"));
    console.log(chalk_1.default.gray("• Max Tokens: Maximum response length"));
    console.log(chalk_1.default.gray("• Top P: Nucleus sampling parameter"));
    console.log(chalk_1.default.gray("• Top K: Token selection limit"));
    console.log(chalk_1.default.gray("• Repeat Penalty: Reduces repetition"));
    console.log(chalk_1.default.yellow("\n💻 TypeScript Streaming Example:"));
    console.log(chalk_1.default.gray(`
import type { LlamaStreamConfig, StreamCallback } from '../types';

const streamCallback: StreamCallback = (token: string): void => {
  process.stdout.write(token);
};

const config: LlamaStreamConfig = {
  temperature: 0.7,
  maxTokens: 500,
  stream: true,
  callback: streamCallback
};

await api.generate("Your prompt here", config);
  `));
}
/**
 * Display setup instructions for models
 */
function showModelSetupInstructions() {
    console.log(chalk_1.default.yellow("📋 Model Setup Required:"));
    console.log(chalk_1.default.white("1. Download a Llama model in GGUF format"));
    console.log(chalk_1.default.white("2. Place it in the ./models/ directory"));
    console.log(chalk_1.default.white("3. Run the streaming example again"));
    console.log(chalk_1.default.cyan("\n🔗 Download models from: "), chalk_1.default.blue("https://huggingface.co/TheBloke"));
    console.log(chalk_1.default.yellow("\n💡 Quick Setup:"));
    console.log(chalk_1.default.gray(`mkdir -p models`));
    console.log(chalk_1.default.gray(`wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${config_js_1.config.model.path}`));
    console.log(chalk_1.default.gray("\n🚀 Run with TypeScript:"));
    console.log(chalk_1.default.gray("npm run stream"));
}
/**
 * Error handling for streaming functionality
 */
function handleError(error, context) {
    console.error(chalk_1.default.red(`❌ Error in ${context}:`));
    if (error instanceof Error) {
        console.error(chalk_1.default.red("  Message:"), error.message);
        if (error.code) {
            console.error(chalk_1.default.red("  Code:"), error.code);
        }
        if (context === "streaming example") {
            console.log(chalk_1.default.yellow("\n💡 Streaming Troubleshooting:"));
            console.log(chalk_1.default.gray("• Check if model supports streaming"));
            console.log(chalk_1.default.gray("• Verify API implementation"));
            console.log(chalk_1.default.gray("• Test with smaller prompts first"));
            console.log(chalk_1.default.gray("• Ensure proper memory allocation"));
        }
    }
    else {
        console.error(chalk_1.default.red("  Unexpected error:"), error);
    }
}
/**
 * Streaming utilities and helpers
 */
class StreamingUtils {
    /**
     * Create a formatted streaming callback with colors
     */
    static createColoredCallback(color = "green") {
        return (token) => {
            const colorFn = chalk_1.default[color];
            process.stdout.write(colorFn(token));
        };
    }
    /**
     * Monitor streaming performance
     */
    static createMonitoredCallback() {
        const stats = { tokensReceived: 0, startTime: Date.now() };
        const callback = (token) => {
            stats.tokensReceived++;
            process.stdout.write(chalk_1.default.green(token));
        };
        return { callback, stats };
    }
    /**
     * Display streaming statistics
     */
    static displayStats(stats) {
        const duration = Date.now() - stats.startTime;
        const tokensPerSecond = stats.tokensReceived / (duration / 1000);
        console.log(chalk_1.default.gray(`\n📊 Streaming Stats:`));
        console.log(chalk_1.default.gray(`  Tokens: ${stats.tokensReceived}`));
        console.log(chalk_1.default.gray(`  Duration: ${duration}ms`));
        console.log(chalk_1.default.gray(`  Rate: ${tokensPerSecond.toFixed(2)} tokens/sec`));
    }
}
exports.StreamingUtils = StreamingUtils;
exports.default = runStreamingExample;
//# sourceMappingURL=streaming-example.js.map