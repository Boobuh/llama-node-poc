const chalk = require('chalk');
const llamaNode = require('llama-node');

/**
 * Basic Llama example using llama-node package
 */
async function runBasicExample() {
  try {
    console.log(chalk.yellow('📝 Basic Llama Text Generation Example\n'));
    
    // Example using llama-node (simpler API)
    const Llama = llamaNode.LlamaApi;
    const tokenizer = llamaNode.HuggingFaceTokenizer;
    
    console.log(chalk.green('Initializing Llama model...'));
    
    // Note: You'll need to download a model first
    // For this example, we'll show how to set it up
    const modelPath = './models/llama-model.gguf'; // You'll need to download this
    
    console.log(chalk.cyan('Setting up model path:'), modelPath);
    console.log(chalk.cyan('Note: You need to download a Llama model (.gguf file) to run this example'));
    console.log(chalk.cyan('Download from: https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF'));
    
    // Example model initialization (commented out as it requires actual model file)
    /*
    const api = new Llama(modelPath);
    
    const prompt = "Tell me a short story about a robot discovering emotions.";
    
    console.log(chalk.blue('Prompt:'), prompt);
    console.log(chalk.blue('Generating response...\n'));
    
    const response = await api.generate(prompt, {
      temperature: 0.7,
      maxTokens: 200,
      topP: 0.9,
    });
    
    console.log(chalk.green('Response:'));
    console.log(chalk.white(response));
    */
    
    // Instead, let's show the setup pattern and API usage
    console.log(chalk.yellow('\n📋 Setup Instructions:'));
    console.log(chalk.white('1. Download a Llama model in GGUF format'));
    console.log(chalk.white('2. Place it in the ./models/ directory'));
    console.log(chalk.white('3. Uncomment the code in this example'));
    console.log(chalk.white('4. Run: node index.js basic'));
    
    console.log(chalk.yellow('\n💡 API Example (when model is available):'));
    console.log(chalk.gray(`
const api = new Llama(modelPath);
const response = await api.generate("Tell me about AI", {
  temperature: 0.7,
  maxTokens: 200,
});
console.log(response);
    `));
    
  } catch (error) {
    console.error(chalk.red('❌ Error in basic example:'), error.message);
  }
}

module.exports = { runBasicExample };
