# Llama Node.js POC

A comprehensive proof of concept demonstrating how to integrate Llama large language models with Node.js applications.

## 🌟 Features

- ✅ **Basic Text Generation** - Simple prompt to response generation
- 💬 **Interactive Chat** - Multi-turn conversation with context
- 🌊 **Streaming Responses** - Real-time token streaming
- 🖥️ **CLI Interface** - Easy command-line interface for testing
- 📦 **Multiple Packages** - Support for different Llama implementations

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- A Llama model in GGUF format

### Installation

```bash
# Clone or download this project
cd llama-node-poc

# Install dependencies
npm install

# (Optional) Download a Llama model
mkdir -p models
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O models/llama-model.gguf
```

## 📖 Usage

### Command Line Interface

```bash
# Run basic text generation
npm run basic

# Start interactive chat
npm run chat

# Test streaming responses
npm run stream

# Show help
npm run help
```

### Available Commands

- `node index.js basic` - Basic text generation example
- `node index.js chat` - Interactive chat with conversation history
- `node index.js stream` - Streaming response demonstration
- `node index.js --help` - Show all available commands

## 📁 Project Structure

```
llama-node-poc/
├── index.js                 # Main CLI entry point
├── package.json             # Project dependencies and scripts
├── README.md               # This file
├── models/                 # Directory for Llama model files
│   └── README.md          # Model download instructions
└── examples/              # Code examples
    ├── basic-example.js   # Basic text generation
    ├── chat-example.js    # Interactive chat
    └── streaming-example.js # Streaming responses
```

## 🔧 Configuration

### Model Setup

1. **Download a Model**: Visit [Hugging Face GGUF Models](https://huggingface.co/TheBloke) and download a Llama model
2. **Place in Models Directory**: Save the `.gguf` file in the `./models/` directory
3. **Update Model Path**: Edit the examples to point to your model file

### Recommended Models

| Model            | Size  | Quality | Speed  | Use Case                  |
| ---------------- | ----- | ------- | ------ | ------------------------- |
| Llama-2-7B-Chat  | ~4GB  | Good    | Fast   | Development & Testing     |
| Llama-2-13B-Chat | ~7GB  | Better  | Medium | Production Use            |
| Llama-2-70B-Chat | ~40GB | Best    | Slow   | High-Quality Applications |

## 💻 Code Examples

### Basic Text Generation

```javascript
const llamaNode = require("llama-node");
const Llama = llamaNode.LlamaApi;

const api = new Llama("./models/llama-model.gguf");
const response = await api.generate("Tell me about AI", {
  temperature: 0.7,
  maxTokens: 200,
});
console.log(response);
```

### Interactive Chat

```javascript
const chatHistory = [];
const response = await api.generate(userInput, {
  temperature: 0.8,
  maxTokens: 300,
  context: chatHistory,
});
chatHistory.push({ role: "user", content: userInput });
chatHistory.push({ role: "assistant", content: response });
```

### Streaming Responses

```javascript
await api.generate("Explain quantum computing", {
  temperature: 0.7,
  stream: true,
  callback: (token) => {
    process.stdout.write(token);
  },
});
```

## 🛠️ Development

### Adding New Features

1. Create new example files in `./examples/`
2. Export functions from example files
3. Add commands to `index.js`
4. Update this README

### Supported Packages

This POC demonstrates multiple Llama integration approaches:

- **`llama-node`** - Simple API for basic usage
- **`node-llama-cpp`** - More advanced with better performance
- **Custom implementations** - Extensible architecture

## 📦 Dependencies

- `llama-node` - Llama Node.js integration
- `node-llama-cpp` - Alternative Llama C++ bindings
- `commander` - CLI argument parsing
- `chalk` - Terminal styling
- `readline` - Interactive input handling

## 🐛 Troubleshooting

### Common Issues

1. **Model Not Found**: Ensure the model file is in `./models/` directory
2. **Memory Issues**: Try a smaller model (7B instead of 70B)
3. **Slow Performance**: Consider using GPU acceleration or smaller models
4. **Installation Errors**: Make sure you have Node.js 16+ and sufficient disk space

### Performance Tips

- Use `Q4_K_M` quantized models for best size/quality balance
- Consider GPU acceleration for faster inference
- Monitor system resources during model loading
- Use streaming for better perceived performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for hosting model repositories
- [TheBloke](https://huggingface.co/TheBloke) for providing excellent GGUF conversions
- The Llama and Llama.cpp communities for their amazing work

---

**Note**: This is a proof of concept. Production deployments may require additional considerations like security, scalability, and error handling.
