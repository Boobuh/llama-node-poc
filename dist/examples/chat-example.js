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
exports.runChatExample = runChatExample;
const readline = __importStar(require("readline"));
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../config");
const llamaNode = require("llama-node");
async function runChatExample(options = {}) {
    try {
        console.log(chalk_1.default.yellow("💬 Interactive Llama Chat Example (TypeScript)\n"));
        const Llama = llamaNode.LlamaApi;
        const modelPath = config_1.config.model.path;
        const generationConfig = {
            temperature: options.temperature ?? config_1.config.generation.temperature,
            maxTokens: options.maxTokens ?? config_1.config.generation.maxTokens,
            topP: config_1.config.generation.topP,
            topK: config_1.config.generation.topK,
        };
        console.log(chalk_1.default.cyan("Configuration:"));
        console.log(chalk_1.default.gray(`  Model: ${config_1.config.model.name}`));
        console.log(chalk_1.default.gray(`  Temperature: ${generationConfig.temperature}`));
        console.log(chalk_1.default.gray(`  Max Tokens: ${generationConfig.maxTokens}`));
        const fs = require("fs");
        const modelExists = fs.existsSync(modelPath);
        if (!modelExists) {
            showModelSetupInstructions(modelPath);
            return;
        }
        console.log(chalk_1.default.blue("\n🤖 Loading model..."));
        const api = new Llama(modelPath);
        const chatHistory = [
            {
                role: "system",
                content: config_1.config.prompts.chat,
            },
        ];
        console.log(chalk_1.default.green("\n✅ Chat initialized!"));
        console.log(chalk_1.default.gray("Type 'exit', 'quit', or 'q' to end."));
        console.log(chalk_1.default.gray("Ask me anything!\n"));
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        await startChatLoop(rl, api, chatHistory, generationConfig);
        rl.close();
    }
    catch (error) {
        handleError(error, "chat example");
    }
}
async function startChatLoop(rl, api, chatHistory, config) {
    const askQuestion = () => {
        rl.question(chalk_1.default.blue("You: "), async (userInput) => {
            if (isExitCommand(userInput)) {
                console.log(chalk_1.default.yellow("\n👋 Goodbye! Chat session ended."));
                return;
            }
            if (userInput.trim() === "") {
                askQuestion();
                return;
            }
            chatHistory.push({
                role: "user",
                content: userInput,
            });
            console.log(chalk_1.default.green("Assistant: "), chalk_1.default.white("thinking..."));
            const startTime = Date.now();
            try {
                const response = await generateResponse(api, chatHistory, config);
                const endTime = Date.now();
                chatHistory.push({
                    role: "assistant",
                    content: response.text || response.toString(),
                });
                console.log(chalk_1.default.white(response.text || response), chalk_1.default.gray(`\n  (${endTime - startTime}ms)`));
            }
            catch (error) {
                console.error(chalk_1.default.red("❌ Error generating response"), error);
            }
            askQuestion();
        });
    };
    askQuestion();
}
async function generateResponse(api, chatHistory, config) {
    const prompt = buildPromptFromHistory(chatHistory);
    return await api.generate(prompt, config);
}
function buildPromptFromHistory(history) {
    return (history
        .map((msg) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`)
        .join("\n\n") + "\nAssistant: ");
}
function isExitCommand(input) {
    const normalizedInput = input.toLowerCase().trim();
    return config_1.config.cli.exitCommands.includes(normalizedInput);
}
function showModelSetupInstructions(modelPath) {
    console.log(chalk_1.default.yellow("\n📋 Model Setup Instructions:"));
    console.log(chalk_1.default.white("1. Download a Llama model in GGUF format"));
    console.log(chalk_1.default.white("2. Place it in the ./models/ directory"));
    console.log(chalk_1.default.white("3. Run the chat example again"));
    console.log(chalk_1.default.yellow("\n💡 Example Setup:"));
    console.log(chalk_1.default.gray(`mkdir -p models`));
    console.log(chalk_1.default.gray(`wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ${modelPath}`));
    console.log(chalk_1.default.yellow("\n🚀 Run Chat:"));
    console.log(chalk_1.default.gray("npm run chat"));
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
    console.log(chalk_1.default.gray("• Check model file exists"));
    console.log(chalk_1.default.gray("• Verify Node.js compatibility"));
    console.log(chalk_1.default.gray("• Check system memory"));
}
//# sourceMappingURL=chat-example.js.map