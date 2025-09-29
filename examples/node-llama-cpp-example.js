const chalk = require('chalk');
const { getLlama, LlamaChatSession } = require('node-llama-cpp');

/**
 * Advanced example using node-llama-cpp package
 */
async function runNodeLlamaCppExample() {
  try {
    console.log(chalk.yellow('🚀 Node-Llama-CPP Advanced Example\n'));
    console.log(chalk.cyan('This example uses the more advanced node-llama-cpp package'));
    
    const modelPath = './models/llama-model.gguf';
    
    console.log(chalk.yellow('📋 Setup Instructions:'));
    console.log(chalk.white('1. Download a Llama model in GGUF format'));
    console.log(chalk.white('2. Place it in the ./models/ directory'));
    console.log(chalk.white('3. Run: node examples/node-llama-cpp-example.js'));
    
    console.log(chalk.yellow('\n💡 Code Example:'));
    console.log(chalk.gray(`
const { getLlama, LlamaChatSession } = require('node-llama-cpp');

async function runExample() {
  const llama = await getLlama();
  
  const model = await llama.loadModel({
    modelPath: './models/llama-model.gguf',
    gpuLayers: 0 // Set to -1 to use all GPU layers if available
  });
  
  const context = await llama.createContext({ model });
  const session = new LlamaChatSession({ context });
  
  const response = await session.prompt('Hello! How are you?');
  console.log(response);
}
    `));
    
    console.log(chalk.yellow('\n🔧 Configuration Options:'));
    console.log(chalk.gray(`
const modelOptions = {
  modelPath: './models/llama-model.gguf',
  gpuLayers: -1,        // -1 for all GPU layers, 0 for CPU only
  contextLength: 4096,   // Context window size
  seed: null             // Random seed, null for random
};

const contextOptions = {
  batchSize: 512,
  threads: 4,           // CPU threads
  contextLength: 4096,  // Context window
  logitsAll: false,
  embedding: false,
  useMemoryLock: false,
  useMmap: true
};

const generateOptions = {
  temperature: 0.7,
  topP: 0.9,
  topK: 40,
  repeatPenalty: 1.1,
  maxTokens: 200,
  stopAtStrings: ['###', 'Human:', 'Assistant:']
};
    `));
    
    console.log(chalk.yellow('\n⭐ Key Features:'));
    console.log(chalk.white('• 🎯 High Performance - Optimized C++ backend'));
    console.log(chalk.white('• 🔥 GPU Acceleration - CUDA & Metal support'));
    console.log(chalk.white('• 💾 Memory Efficient - Smart memory management'));
    console.log(chalk.white('• 🔄 Streaming Support - Real-time token streaming'));
    console.log(chalk.white('• 🛠️ Advanced Configuration - Fine-grained control'));
    console.log(chalk.white('• 🧪 Multiple Model Support - GGUF format'));
    
    console.log(chalk.yellow('\n🎯 Use Cases:'));
    console.log(chalk.white('• Production applications'));
    console.log(chalk.white('• Chatbots and assistants'));
    console.log(chalk.white('• Document analysis'));
    console.log(chalk.white('• Code generation'));
    console.log(chalk.white('• Creative writing'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error in node-llama-cpp example:'), error.message);
  }
}

module.exports = { runNodeLlamaCppExample };
