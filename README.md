# Llama Node.js POC - TypeScript Edition

A comprehensive proof of concept demonstrating how to integrate Llama large language models with Node.js applications, now fully refactored with **TypeScript** for better type safety and developer experience.

## 🌟 Features

- ✅ **Basic Text Generation** - Simple prompt to response generation
- 💬 **Interactive Chat** - Multi-turn conversation with context
- 🌊 **Streaming Responses** - Real-time token streaming
- 🖥️ **CLI Interface** - Easy command-line interface for testing
- 📦 **Multiple Packages** - Support for different Llama implementations
- 🔒 **Full TypeScript Support** - Complete type safety and IntelliSense
- ⚡ **Enhanced Developer Experience** - Compile-time error checking
- 🏗️ **Modern Architecture** - Clean, maintainable code structure

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- TypeScript knowledge (beneficial but not required)
- A Llama model in GGUF format

### Installation

```bash
# Clone or download this project
cd llama-node-poc

# Install dependencies (includes TypeScript tools)
npm install

# Compile TypeScript to JavaScript
npm run build

# (Optional) Download a Llama model
mkdir -p models
wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O models/llama-model.gguf
```

## 📖 Usage

### Command Line Interface

#### TypeScript Development (Recommended)

```bash
# Run with TypeScript directly (development)
npm run dev -- basic     # Basic example
npm run dev -- chat      # Interactive chat
npm run dev -- stream    # Streaming demo
npm run dev -- info      # System information
npm run dev -- --help    # Show all options
```

#### Compiled JavaScript (Production)

```bash
# Compile TypeScript first
npm run build

# Run compiled JavaScript
npm start -- basic        # Basic example
npm start -- chat         # Interactive chat
npm start -- stream       # Streaming demo
npm start -- info         # System information
npm start -- --help       # Show all options
```

### Available Commands

#### Development Commands (TypeScript)

- `npm run dev -- basic` - Basic text generation example
- `npm run dev -- chat` - Interactive chat with conversation history
- `npm run dev -- stream` - Streaming response demonstration
- `npm run dev -- info` - Show system and configuration info
- `npm run dev -- --help` - Show all available commands

#### Build Commands

- `npm run build` - Compile TypeScript to JavaScript
- `npm run clean` - Remove compiled files
- `npm run rebuild` - Clean and build fresh

#### Production Commands (Compiled)

- `npm start -- basic` - Basic text generation (compiled)
- `npm start -- chat` - Interactive chat (compiled)
- `npm start -- stream` - Streaming demo (compiled)

## 📁 Project Structure

```
llama-node-poc/
├── src/                    # TypeScript source code
│   ├── index.ts           # Main CLI entry point
│   ├── config.ts          # Configuration with types
│   ├── types/             # TypeScript type definitions
│   │   └── index.ts       # All type declarations
│   └── examples/          # Code examples (TypeScript)
│       ├── basic-example.ts       # Basic text generation
│       ├── chat-example.ts        # Interactive chat
│       ├── streaming-example.ts   # Streaming responses
│       └── node-llama-cpp-example.ts # Advanced usage
├── dist/                  # Compiled JavaScript output (generated)
├── package.json           # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── README.md            # This file
├── Dockerfile           # Docker container support
└── models/             # Directory for Llama model files
    └── README.md       # Model download instructions
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

### Basic Text Generation (TypeScript)

```typescript
import type { LlamaConfig, GenerationResult } from "./types";
import { config } from "./config";

const llamaNode = require("llama-node");
const Llama = llamaNode.LlamaApi;

// Type-safe configuration
const generationConfig: LlamaConfig = {
  temperature: 0.7,
  maxTokens: 200,
  topP: 0.9,
  topK: 40,
};

const api = new Llama(config.model.path);
const response: Promise<GenerationResult> = api.generate(
  "Tell me about AI",
  generationConfig
);

console.log(response);
```

### Interactive Chat (TypeScript)

```typescript
import type { ChatMessage, LlamaConfig } from "./types";

const chatHistory: ChatMessage[] = [];
const generationConfig: LlamaConfig = {
  temperature: 0.8,
  maxTokens: 300,
  context: chatHistory.slice(-10), // Keep last 10 messages
};

const userMessage: ChatMessage = { role: "user", content: userInput };
const response: string = await api.generate(userInput, generationConfig);
const assistantMessage: ChatMessage = { role: "assistant", content: response };

chatHistory.push(userMessage, assistantMessage);
```

### Streaming Responses (TypeScript)

```typescript
import type { LlamaStreamConfig, StreamCallback } from "./types";

const streamCallback: StreamCallback = (token: string): void => {
  process.stdout.write(token);
};

const streamConfig: LlamaStreamConfig = {
  temperature: 0.7,
  stream: true,
  callback: streamCallback,
};

await api.generate("Explain quantum computing", streamConfig);
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

### Runtime Dependencies

- `llama-node` - Llama Node.js integration
- `node-llama-cpp` - Alternative Llama C++ bindings
- `commander` - CLI argument parsing
- `chalk` - Terminal styling
- `readline` - Interactive input handling

### Development Dependencies (TypeScript)

- `typescript` - TypeScript compiler
- `ts-node` - TypeScript execution for development
- `@types/node` - Node.js type definitions
- `nodemon` - Development automation (optional)

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
