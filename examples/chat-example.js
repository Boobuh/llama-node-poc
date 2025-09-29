const readline = require('readline');
const chalk = require('chalk');
const llamaNode = require('llama-node');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

/**
 * Interactive chat example using llama-node package
 */
async function runChatExample() {
  try {
    console.log(chalk.yellow('💬 Interactive Chat Example\n'));
    console.log(chalk.cyan('This example demonstrates interactive conversation with a Llama model'));
    console.log(chalk.cyan('Press Ctrl+C or type "exit" to quit\n'));
    
    // Example using llama-node
    const Llama = llamaNode.LlamaApi;
    
    // Chat context to maintain conversation history
    let chatHistory = [];
    
    console.log(chalk.yellow('📋 Setup Instructions:'));
    console.log(chalk.white('1. Download a Llama model in GGUF format'));
    console.log(chalk.white('2. Place it in the ./models/ directory'));
    console.log(chalk.white('3. Uncomment the model initialization code'));
    console.log(chalk.white('4. Run: node index.js chat'));
    
    console.log(chalk.yellow('\n🔧 Configuration Example:'));
    console.log(chalk.gray(`
const modelPath = './models/llama-model.gguf';
const api = new Llama(modelPath);

const chatConfig = {
  temperature: 0.8,
  maxTokens: 300,
  topP: 0.9,
  systemPrompt: "You are a helpful AI assistant."
};
    `));
    
    // For demonstration, we'll simulate the chat interface
    console.log(chalk.blue('\n🤖 Simulated Chat Interface:'));
    console.log(chalk.gray('(To run with actual model, follow setup instructions above)'));
    
    const askQuestion = () => {
      rl.question(chalk.green('\n👤 You: '), async (input) => {
        if (input.toLowerCase() === 'exit' || input.toLowerCase() === 'quit') {
          console.log(chalk.yellow('\n👋 Goodbye!'));
          rl.close();
          return;
        }
        
        // Add user message to history
        chatHistory.push({ role: 'user', content: input });
        
        // Simulate response (you would replace this with actual API call)
        console.log(chalk.blue('🤖 Assistant: '), chalk.white('(Simulated response - add model to get real responses)'));
        
        // In real implementation:
        /*
        const response = await api.generate(input, {
          temperature: 0.8,
          maxTokens: 300,
          context: chatHistory // Pass conversation history
        });
        chatHistory.push({ role: 'assistant', content: response });
        console.log(chalk.blue('🤖 Assistant:'), chalk.white(response));
        */
        
        askQuestion();
      });
    };
    
    askQuestion();
    
  } catch (error) {
    console.error(chalk.red('❌ Error in chat example:'), error.message);
    rl.close();
  }
}

module.exports = { runChatExample };
