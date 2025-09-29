"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionUtils = void 0;
exports.runNodeLlamaCppExample = runNodeLlamaCppExample;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../config");
let nodeLlamaCpp;
try {
    nodeLlamaCpp = require("node-llama-cpp");
}
catch (error) {
    console.log(chalk_1.default.yellow("⚠️ node-llama-cpp not available, showing examples only"));
}
/**
 * Advanced example using node-llama-cpp package - TypeScript version
 */
async function runNodeLlamaCppExample() {
    try {
        console.log(chalk_1.default.yellow("🚀 Node-Llama-CPP Advanced Example (TypeScript)\n"));
        console.log(chalk_1.default.cyan("This typed example uses the advanced node-llama-cpp package with full type safety"));
        const modelConfig = {
            path: config_1.config.model.path,
            name: config_1.config.model.name,
            contextLength: config_1.config.model.contextLength,
            batchSize: config_1.config.model.batchSize,
            threads: config_1.config.model.threads,
            gpuLayers: config_1.config.model.gpuLayers,
        };
        console.log(chalk_1.default.yellow("🔧 Advanced Configuration:"));
        console.log(chalk_1.default.gray(`  Model: ${modelConfig.name}`));
        console.log(chalk_1.default.gray(`  Path: ${modelConfig.path}`));
        console.log(chalk_1.default.gray(`  Context Length: ${modelConfig.contextLength}`));
        console.log(chalk_1.default.gray(`  Batch Size: ${modelConfig.batchSize}`));
        console.log(chalk_1.default.gray(`  Threads: ${modelConfig.threads}`));
        console.log(chalk_1.default.gray(`  GPU Layers: ${modelConfig.gpuLayers}`));
        console.log(chalk_1.default.yellow("\n💡 Code Configuration Example:"));
        showAdvancedConfigurationExample();
        console.log(chalk_1.default.yellow("\n⭐ Advanced Features:"));
        showAdvancedFeatures();
        console.log(chalk_1.default.yellow("\n🎯 Use Cases with TypeScript:"));
        showUseCases();
        console.log(chalk_1.default.yellow("\n🚀 Performance Optimization:"));
        showPerformanceOptimizations();
        if (nodeLlamaCpp) {
            await demonstrateActualUsage();
        }
        else {
            showSetupInstructions();
        }
    }
    catch (error) {
        handleError(error, "node-llama-cpp example");
    }
}
/**
 * Show advanced configuration examples
 */
function showAdvancedConfigurationExample() {
    console.log(chalk_1.default.gray(`
import type { ModelConfig, GenerationConfig } from './types';
import { getLlama, LlamaChatSession } from 'node-llama-cpp';

interface AdvancedModelConfig extends ModelConfig {
  enableMmap?: boolean;
  enableMemoryLock?: boolean;
  logitsAll?: boolean;
  embedding?: boolean;
  useSlock?: boolean;
}

const advancedConfig: AdvancedModelConfig = {
  path: './models/llama-model.gguf',
  name: 'llama-2-7B-chat',
  contextLength: 4096,
  batchSize: 512,
  threads: 4,
  gpuLayers: -1,
  
  enableMmap: true,
  enableMemoryLock: false,
  logitsAll: false,
  embedding: false,
  useSlock: false,
};

const generationConfig: GenerationConfig = {
  temperature: 0.7,
  maxTokens: 200,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1,
};
  `));
}
/**
 * Show advanced features
 */
function showAdvancedFeatures() {
    console.log(chalk_1.default.white("• 🎯 High Performance - Optimized C++ backend with TypeScript bindings"));
    console.log(chalk_1.default.white("• 🔥 GPU Acceleration - CUDA & Metal support with proper typing"));
    console.log(chalk_1.default.white("• 💾 Memory Efficient - Smart memory management with safe interfaces"));
    console.log(chalk_1.default.white("• 🔄 Streaming Support - Real-time token streaming with callbacks"));
    console.log(chalk_1.default.white("• 🛠️ Advanced Configuration - Fine-grained control with validation"));
    console.log(chalk_1.default.white("• 🧪 Multiple Model Support - GGUF format with metadata"));
    console.log(chalk_1.default.white("• 🔒 Type Safety - Full TypeScript support for all operations"));
    console.log(chalk_1.default.white("• 📊 Metrics Collection - Built-in performance monitoring"));
}
/**
 * Show use cases
 */
function showUseCases() {
    console.log(chalk_1.default.white("• 🏭 Production applications with enterprise features"));
    console.log(chalk_1.default.white("• 💬 Advanced chatbots and AI assistants"));
    console.log(chalk_1.default.white("• 📄 Document analysis and processing"));
    console.log(chalk_1.default.white("• 💻 Code generation and assistance"));
    console.log(chalk_1.default.white("• ✍️ Creative writing and content generation"));
    console.log(chalk_1.default.white("• 🔍 Research and analysis applications"));
    console.log(chalk_1.default.white("• 🎓 Educational and training platforms"));
}
/**
 * Show performance optimizations
 */
function showPerformanceOptimizations() {
    console.log(chalk_1.default.gray(`

async function optimizeModelLoading(): Promise<void> {
  const llama = await getLlama();
  
  const model = await llama.loadModel({
    modelPath: './models/llama-model.gguf',
    gpuLayers: -1, // Use all available GPU layers
    contextLength: 8192, // Larger context for better conversations
  });
  
  const context = await llama.createContext({ model });
  
  return { model, context };
}

async function optimizeBatchProcessing(prompts: string[]): Promise<void> {
  const results: string[] = [];
  
  for (const prompt of prompts) {
    const response = await context.completion({ 
      promptText: prompt,
      temperature: 0.7 
    });
    results.push(response.text);
  }
  
  return results;
}

function optimizeMemoryUsage(): void {
  const memUsage = process.memoryUsage();
  console.log('Memory usage:', memUsage);
  
}
  `));
}
/**
 * Demonstrate actual usage if package is available
 */
async function demonstrateActualUsage() {
    try {
        console.log(chalk_1.default.blue("\n🤖 Demonstrating actual API usage..."));
        const { getLlama } = nodeLlamaCpp;
        await getLlama();
        console.log(chalk_1.default.green("✅ Successfully initialized node-llama-cpp"));
        console.log(chalk_1.default.gray("Ready for advanced model operations"));
        console.log(chalk_1.default.yellow("\n⚠️ Model operations require GGUF files in ./models/ directory"));
    }
    catch (error) {
        console.log(chalk_1.default.yellow("⚠️ Demonstration unavailable - check model setup\n"));
        showSetupInstructions();
    }
}
/**
 * Show setup instructions
 */
function showSetupInstructions() {
    console.log(chalk_1.default.yellow("\n📋 Advanced Setup Instructions:"));
    console.log(chalk_1.default.white("1. Install node-llama-cpp: npm install node-llama-cpp"));
    console.log(chalk_1.default.white("2. Download optimized Llama model in GGUF format"));
    console.log(chalk_1.default.white("3. Configure GPU runtime if available"));
    console.log(chalk_1.default.white("4. Monitor system resources during model loading"));
    console.log(chalk_1.default.cyan("\n🔧 TypeScript Integration Benefits:"));
    console.log(chalk_1.default.gray("• Compile-time error checking"));
    console.log(chalk_1.default.gray("• IntelliSense support for all APIs"));
    console.log(chalk_1.default.gray("• Type-safe configuration"));
    console.log(chalk_1.default.gray("• Better refactoring support"));
    console.log(chalk_1.default.gray("• Enhanced debugging capabilities"));
    console.log(chalk_1.default.yellow("\n💻 Development Workflow:"));
    console.log(chalk_1.default.gray("# Compile TypeScript"));
    console.log(chalk_1.default.gray("npm run build"));
    console.log(chalk_1.default.gray(""));
    console.log(chalk_1.default.gray("# Run compiled JavaScript"));
    console.log(chalk_1.default.gray("npm start"));
    console.log(chalk_1.default.gray(""));
    console.log(chalk_1.default.gray("# Development with hot reload"));
    console.log(chalk_1.default.gray("npm run dev"));
}
/**
 * Error handling for advanced functionality
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
        if (context === "node-llama-cpp example") {
            console.log(chalk_1.default.yellow("\n💡 Advanced Troubleshooting:"));
            console.log(chalk_1.default.gray("• Check GPU drivers and CUDA installation"));
            console.log(chalk_1.default.gray("• Verify model compatibility"));
            console.log(chalk_1.default.gray("• Monitor system memory and CPU usage"));
            console.log(chalk_1.default.gray("• Test with smaller models first"));
            console.log(chalk_1.default.gray("• Check TypeScript compilation errors"));
        }
    }
    else {
        console.error(chalk_1.default.red("  Unexpected error:"), error);
    }
}
/**
 * Advanced utilities for production use
 */
class ProductionUtils {
    /**
     * Validate model compatibility
     */
    static async validateModel(modelPath) {
        const errors = [];
        try {
            const fs = require("fs");
            if (!fs.existsSync(modelPath)) {
                errors.push("Model file not found");
            }
            if (!modelPath.endsWith(".gguf")) {
                errors.push("Model must be in GGUF format");
            }
            const stats = fs.statSync(modelPath);
            const sizeGB = stats.size / (1024 * 1024 * 1024);
            if (sizeGB < 0.5) {
                errors.push("Model file seems too small");
            }
            else if (sizeGB > 100) {
                errors.push("Model file very large - ensure sufficient memory");
            }
        }
        catch (error) {
            errors.push(`Validation error: ${error.message}`);
        }
        return {
            isValid: errors.length === 0,
            errors,
        };
    }
    /**
     * Check system requirements
     */
    static checkSystemRequirements() {
        const totalMemory = require("os").totalmem();
        const memoryGB = totalMemory / (1024 * 1024 * 1024);
        const warnings = [];
        if (memoryGB < 4) {
            warnings.push("- Memory below 4GB - recommend smaller models");
        }
        if (memoryGB < 8) {
            warnings.push("- Memory below 8GB - larger models may fail");
        }
        return {
            memoryGB,
            recommended: memoryGB >= 8,
            warnings,
        };
    }
}
exports.ProductionUtils = ProductionUtils;
exports.default = runNodeLlamaCppExample;
//# sourceMappingURL=node-llama-cpp-example.js.map