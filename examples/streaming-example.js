const chalk = require('chalk');
const llamaNode = require('llama-node');

/**
 * Streaming response example using llama-node package
 */
async function runStreamingExample() {
  try {
    console.log(chalk.yellow('🌊 Streaming Response Example\n'));
    console.log(chalk.cyan('This example demonstrates real-time streaming of LLM responses'));
    
    const Llama = llamaNode.LlamaApi;
    
    console.log(chalk.yellow('📋 Setup Instructions:'));
    console.log(chalk.white('1. Download a Llama model in GGUF format'));
    console.log(chalk.white('2. Place it in the ./models/ directory'));
    console.log(chalk.white('3. Uncomment the streaming code'));
    console.log(chalk.white('4. Run: node index.js stream'));
    
    console.log(chalk.yellow('\n🔧 Streaming Configuration Example:'));
    console.log(chalk.gray(`
const modelPath = './models/llama-model.gguf';
const api = new Llama(modelPath);

const streamConfig = {
  temperature: 0.7,
  maxTokens: 500,
  stream: true,
  callback: (token) => {
    process.stdout.write(token); // Stream tokens as they arrive
  }
};

console.log(chalk.blue('Streaming response:'));
await api.generate("Write a detailed explanation of quantum computing", streamConfig);
    `));
    
    console.log(chalk.blue('\n📡 Simulated Streaming Output:'));
    console.log(chalk.gray('(To see real streaming, follow setup instructions above)'));
    
    const simulateStreaming = async (text) => {
      const words = text.split(' ');
      let currentText = '';
      
      for (let i = 0; i < words.length; i++) {
        currentText += words[i] + ' ';
        process.stdout.write(chalk.green(words[i] + ' '));
        
        await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 50));
      }
      
      console.log(chalk.yellow('\n\n✨ Streaming complete!'));
    };
    
    await simulateStreaming('This is how streaming would work with a real Llama model. Each token would be processed and displayed in real-time as the model generates the response, creating a conversational and dynamic user experience that feels more natural than waiting for the complete response.');
    
    console.log(chalk.yellow('\n💡 Streaming Benefits:'));
    console.log(chalk.white('• Real-time user feedback'));
    console.log(chalk.white('• Better perceived performance'));
    console.log(chalk.white('• More engaging conversations'));
    console.log(chalk.white('• Ability to stop generation early if needed'));
    
  } catch (error) {
    console.error(chalk.red('❌ Error in streaming example:'), error.message);
  }
}

module.exports = { runStreamingExample };
