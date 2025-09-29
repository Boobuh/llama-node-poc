// Configuration file for Llama Node.js POC

module.exports = {
  // Model Configuration
  model: {
    path: './models/llama-model.gguf',
    name: 'llama-2-7B-chat',
    contextLength: 4096,
    batchSize: 512,
    threads: 4,
    gpuLayers: -1, // -1 for all GPU layers, 0 for CPU only
  },

  // Generation Parameters
  generation: {
    temperature: 0.7,
    maxTokens: 200,
    topP: 0.9,
    topK: 40,
    repeatPenalty: 1.1,
  },

  // Default prompts for examples
  prompts: {
    basic: 'Tell me a short story about a robot discovering emotions.',
    chat: 'You are a helpful AI assistant. How can I help you today?',
    stream: 'Write a detailed explanation of quantum computing.',
  },

  // CLI Configuration
  cli: {
    welcomeMessage: '🚀 Llama Node.js POC - Interactive Examples',
    exitCommands: ['exit', 'quit', 'q'],
  },
};
