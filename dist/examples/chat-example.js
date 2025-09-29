"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatUtils = void 0;
exports.runChatExample = runChatExample;
const readline = __importStar(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
const config_js_1 = require("../config.js");
const llamaNode = require("llama-node");
/**
 * Interactive chat example using llama-node package - TypeScript version
 */
async function runChatExample(options = {}) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    try {
        console.log(chalk_1.default.yellow("💬 Interactive Chat Example (TypeScript)\n"));
        console.log(chalk_1.default.cyan("This typed example demonstrates interactive conversation with a Llama model"));
        console.log(chalk_1.default.cyan('Type "exit", "quit", or "q" to exit\n'));
        const generationConfig = {
            temperature: options.temperature ?? config_js_1.config.generation.temperature,
            maxTokens: options.maxTokens ?? config_js_1.config.generation.maxTokens,
            topP: config_js_1.config.generation.topP,
            topK: config_js_1.config.generation.topK,
            repeatPenalty: config_js_1.config.generation.repeatPenalty,
        };
        const chatHistory = [];
        if (config_js_1.config.prompts.chat.includes("You are")) {
            chatHistory.push({
                role: "system",
                content: config_js_1.config.prompts.chat,
            });
        }
        else {
            chatHistory.push({
                role: "system",
                content: "You are a helpful AI assistant.",
            });
        }
        console.log(chalk_1.default.yellow("🔧 Chat Configuration:"));
        console.log(chalk_1.default.gray(`  Temperature: ${generationConfig.temperature}`));
        console.log(chalk_1.default.gray(`  Max Tokens: ${generationConfig.maxTokens}`));
        console.log(chalk_1.default.gray(`  Context Length: ${config_js_1.config.model.contextLength}`));
        const fs = require("fs");
        const modelExists = fs.existsSync(config_js_1.config.model.path);
        if (!modelExists) {
            showModelSetupInstructions();
            rl.close();
            return;
        }
        console.log(chalk_1.default.blue("\n🤖 Starting chat session..."));
        const Llama = llamaNode.LlamaApi;
        const api = new Llama(config_js_1.config.model.path);
        let messageCount = 0;
        const askQuestion = async () => {
            rl.question(chalk_1.default.green("\n👤 You: "), async (input) => {
                const trimmedInput = input.trim();
                if (config_js_1.config.cli.exitCommands.includes(trimmedInput.toLowerCase())) {
                    console.log(chalk_1.default.yellow("\n👋 Goodbye! Thanks for chatting!"));
                    rl.close();
                    return;
                }
                if (trimmedInput.length === 0) {
                    console.log(chalk_1.default.red("❌ Please enter a message"));
                    askQuestion();
                    return;
                }
                try {
                    const userMessage = {
                        role: "user",
                        content: trimmedInput,
                    };
                    chatHistory.push(userMessage);
                    messageCount++;
                    console.log(chalk_1.default.blue("\n🤖 Assistant: "), chalk_1.default.gray("typing..."));
                    const startTime = Date.now();
                    const response = await api.generate(trimmedInput, {
                        ...generationConfig,
                        context: chatHistory.slice(-10), // Keep last 10 messages for context
                    });
                    const endTime = Date.now();
                    const assistantMessage = {
                        role: "assistant",
                        content: response,
                    };
                    chatHistory.push(assistantMessage);
                    console.log(chalk_1.default.white(response));
                    console.log(chalk_1.default.gray(`⏱️ ${endTime - startTime}ms | 💬 Message ${messageCount}`));
                }
                catch (error) {
                    console.error(chalk_1.default.red("\n❌ Chat Error:"));
                    console.error(chalk_1.default.red(error.message || "Unknown error occurred"));
                    console.log(chalk_1.default.yellow('\n💡 Try again or type "exit" to quit'));
                }
                askQuestion();
            });
        };
        await askQuestion();
    }
    catch (error) {
        handleError(error, "chat example");
        rl.close();
    }
}
/**
 * Display setup instructions for models
 */
function showModelSetupInstructions() {
    console.log(chalk_1.default.yellow("📋 Model Setup Required:"));
    console.log(chalk_1.default.white("1. Download a Llama model in GGUF format"));
    console.log(chalk_1.default.white("2. Place it in the ./models/ directory"));
    console.log(chalk_1.default.white("3. Run the chat example again"));
    console.log(chalk_1.default.cyan("\n🔗 Download models from: "), chalk_1.default.blue("https://huggingface.co/TheBloke"));
    console.log(chalk_1.default.yellow("\n💡 Quick Setup:"));
    console.log(chalk_1.default.gray(`mkdir -p models`));
    console.log(chalk_1.default.gray(`wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${config_js_1.config.model.path}`));
    console.log(chalk_1.default.gray("\n🚀 Run with TypeScript:"));
    console.log(chalk_1.default.gray("npm run chat"));
}
/**
 * Error handling for chat functionality
 */
function handleError(error, context) {
    console.error(chalk_1.default.red(`❌ Error in ${context}:`));
    if (error instanceof Error) {
        console.error(chalk_1.default.red("  Message:"), error.message);
        if (error.code) {
            console.error(chalk_1.default.red("  Code:"), error.code);
        }
        if (context === "chat example") {
            console.log(chalk_1.default.yellow("\n💡 Chat Troubleshooting:"));
            console.log(chalk_1.default.gray("• Check if model file is accessible"));
            console.log(chalk_1.default.gray("• Verify model format (should be GGUF)"));
            console.log(chalk_1.default.gray("• Check system memory requirements"));
            console.log(chalk_1.default.gray("• Restart chat session if context issues occur"));
        }
    }
    else {
        console.error(chalk_1.default.red("  Unexpected error:"), error);
    }
}
/**
 * Utilities for chat functionality
 */
class ChatUtils {
    /**
     * Format chat message for display
     */
    static formatMessage(message, index) {
        const roleIcon = message.role === "user" ? "👤" : "🤖";
        const roleName = message.role === "user" ? "You" : "Assistant";
        return `${roleIcon} ${roleName} [${index}]: ${message.content}`;
    }
    /**
     * Get conversation summary
     */
    static getConversationSummary(history) {
        const userMessages = history.filter((msg) => msg.role === "user").length;
        const assistantMessages = history.filter((msg) => msg.role === "assistant").length;
        return `Chat Summary: ${userMessages} user messages, ${assistantMessages} assistant responses`;
    }
    /**
     * Validate message input
     */
    static validateInput(input) {
        if (!input || input.trim().length === 0) {
            return { isValid: false, error: "Message cannot be empty" };
        }
        if (input.length > 1000) {
            return {
                isValid: false,
                error: "Message too long (max 1000 characters)",
            };
        }
        if (input.includes("[SYSTEM]") || input.includes("[ADMIN]")) {
            return { isValid: false, error: "Invalid characters detected" };
        }
        return { isValid: true };
    }
}
exports.ChatUtils = ChatUtils;
exports.default = runChatExample;
//# sourceMappingURL=chat-example.js.map