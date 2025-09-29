import chalk from "chalk";
import { config } from "../config";
import type { ModelConfig, LlamaError } from "../types";

let nodeLlamaCpp: any;
try {
  nodeLlamaCpp = require("node-llama-cpp");
} catch (error) {
  console.log(
    chalk.yellow("⚠️ node-llama-cpp not available, showing examples only")
  );
}

/**
 * Advanced example using node-llama-cpp package - TypeScript version
 */
export async function runNodeLlamaCppExample(): Promise<void> {
  try {
    console.log(
      chalk.yellow("🚀 Node-Llama-CPP Advanced Example (TypeScript)\n")
    );
    console.log(
      chalk.cyan(
        "This typed example uses the advanced node-llama-cpp package with full type safety"
      )
    );

    const modelConfig: ModelConfig = {
      path: config.model.path,
      name: config.model.name,
      contextLength: config.model.contextLength,
      batchSize: config.model.batchSize,
      threads: config.model.threads,
      gpuLayers: config.model.gpuLayers,
    };

    console.log(chalk.yellow("🔧 Advanced Configuration:"));
    console.log(chalk.gray(`  Model: ${modelConfig.name}`));
    console.log(chalk.gray(`  Path: ${modelConfig.path}`));
    console.log(chalk.gray(`  Context Length: ${modelConfig.contextLength}`));
    console.log(chalk.gray(`  Batch Size: ${modelConfig.batchSize}`));
    console.log(chalk.gray(`  Threads: ${modelConfig.threads}`));
    console.log(chalk.gray(`  GPU Layers: ${modelConfig.gpuLayers}`));

    console.log(chalk.yellow("\n💡 Code Configuration Example:"));
    showAdvancedConfigurationExample();

    console.log(chalk.yellow("\n⭐ Advanced Features:"));
    showAdvancedFeatures();

    console.log(chalk.yellow("\n🎯 Use Cases with TypeScript:"));
    showUseCases();

    console.log(chalk.yellow("\n🚀 Performance Optimization:"));
    showPerformanceOptimizations();

    if (nodeLlamaCpp) {
      await demonstrateActualUsage();
    } else {
      showSetupInstructions();
    }
  } catch (error: unknown) {
    handleError(error as LlamaError, "node-llama-cpp example");
  }
}

/**
 * Show advanced configuration examples
 */
function showAdvancedConfigurationExample(): void {
  console.log(
    chalk.gray(`
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
  `)
  );
}

/**
 * Show advanced features
 */
function showAdvancedFeatures(): void {
  console.log(
    chalk.white(
      "• 🎯 High Performance - Optimized C++ backend with TypeScript bindings"
    )
  );
  console.log(
    chalk.white(
      "• 🔥 GPU Acceleration - CUDA & Metal support with proper typing"
    )
  );
  console.log(
    chalk.white(
      "• 💾 Memory Efficient - Smart memory management with safe interfaces"
    )
  );
  console.log(
    chalk.white(
      "• 🔄 Streaming Support - Real-time token streaming with callbacks"
    )
  );
  console.log(
    chalk.white(
      "• 🛠️ Advanced Configuration - Fine-grained control with validation"
    )
  );
  console.log(
    chalk.white("• 🧪 Multiple Model Support - GGUF format with metadata")
  );
  console.log(
    chalk.white("• 🔒 Type Safety - Full TypeScript support for all operations")
  );
  console.log(
    chalk.white("• 📊 Metrics Collection - Built-in performance monitoring")
  );
}

/**
 * Show use cases
 */
function showUseCases(): void {
  console.log(
    chalk.white("• 🏭 Production applications with enterprise features")
  );
  console.log(chalk.white("• 💬 Advanced chatbots and AI assistants"));
  console.log(chalk.white("• 📄 Document analysis and processing"));
  console.log(chalk.white("• 💻 Code generation and assistance"));
  console.log(chalk.white("• ✍️ Creative writing and content generation"));
  console.log(chalk.white("• 🔍 Research and analysis applications"));
  console.log(chalk.white("• 🎓 Educational and training platforms"));
}

/**
 * Show performance optimizations
 */
function showPerformanceOptimizations(): void {
  console.log(
    chalk.gray(`

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
  `)
  );
}

/**
 * Demonstrate actual usage if package is available
 */
async function demonstrateActualUsage(): Promise<void> {
  try {
    console.log(chalk.blue("\n🤖 Demonstrating actual API usage..."));

    const { getLlama } = nodeLlamaCpp;
    await getLlama();

    console.log(chalk.green("✅ Successfully initialized node-llama-cpp"));
    console.log(chalk.gray("Ready for advanced model operations"));

    console.log(
      chalk.yellow(
        "\n⚠️ Model operations require GGUF files in ./models/ directory"
      )
    );
  } catch (error: unknown) {
    console.log(
      chalk.yellow("⚠️ Demonstration unavailable - check model setup\n")
    );
    showSetupInstructions();
  }
}

/**
 * Show setup instructions
 */
function showSetupInstructions(): void {
  console.log(chalk.yellow("\n📋 Advanced Setup Instructions:"));
  console.log(
    chalk.white("1. Install node-llama-cpp: npm install node-llama-cpp")
  );
  console.log(chalk.white("2. Download optimized Llama model in GGUF format"));
  console.log(chalk.white("3. Configure GPU runtime if available"));
  console.log(chalk.white("4. Monitor system resources during model loading"));

  console.log(chalk.cyan("\n🔧 TypeScript Integration Benefits:"));
  console.log(chalk.gray("• Compile-time error checking"));
  console.log(chalk.gray("• IntelliSense support for all APIs"));
  console.log(chalk.gray("• Type-safe configuration"));
  console.log(chalk.gray("• Better refactoring support"));
  console.log(chalk.gray("• Enhanced debugging capabilities"));

  console.log(chalk.yellow("\n💻 Development Workflow:"));
  console.log(chalk.gray("# Compile TypeScript"));
  console.log(chalk.gray("npm run build"));
  console.log(chalk.gray(""));
  console.log(chalk.gray("# Run compiled JavaScript"));
  console.log(chalk.gray("npm start"));
  console.log(chalk.gray(""));
  console.log(chalk.gray("# Development with hot reload"));
  console.log(chalk.gray("npm run dev"));
}

/**
 * Error handling for advanced functionality
 */
function handleError(error: LlamaError, context: string): void {
  console.error(chalk.red(`❌ Error in ${context}:`));

  if (error instanceof Error) {
    console.error(chalk.red("  Message:"), error.message);

    if (error.code) {
      console.error(chalk.red("  Code:"), error.code);
    }

    if (error.details) {
      console.error(
        chalk.red("  Details:"),
        JSON.stringify(error.details, null, 2)
      );
    }

    if (context === "node-llama-cpp example") {
      console.log(chalk.yellow("\n💡 Advanced Troubleshooting:"));
      console.log(chalk.gray("• Check GPU drivers and CUDA installation"));
      console.log(chalk.gray("• Verify model compatibility"));
      console.log(chalk.gray("• Monitor system memory and CPU usage"));
      console.log(chalk.gray("• Test with smaller models first"));
      console.log(chalk.gray("• Check TypeScript compilation errors"));
    }
  } else {
    console.error(chalk.red("  Unexpected error:"), error);
  }
}

/**
 * Advanced utilities for production use
 */
export class ProductionUtils {
  /**
   * Validate model compatibility
   */
  static async validateModel(
    modelPath: string
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

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
      } else if (sizeGB > 100) {
        errors.push("Model file very large - ensure sufficient memory");
      }
    } catch (error: unknown) {
      errors.push(`Validation error: ${(error as Error).message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check system requirements
   */
  static checkSystemRequirements(): {
    memoryGB: number;
    recommended: boolean;
    warnings: string[];
  } {
    const totalMemory = require("os").totalmem();
    const memoryGB = totalMemory / (1024 * 1024 * 1024);

    const warnings: string[] = [];

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

export default runNodeLlamaCppExample;
