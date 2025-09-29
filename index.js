#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');

// Import our examples
require('./examples/basic-example');
require('./examples/chat-example');
require('./examples/streaming-example');

program
  .name('llama-node-poc')
  .description('Llama Node.js Proof of Concept')
  .version('1.0.0');

program
  .command('basic')
  .description('Run basic text generation example')
  .action(async () => {
    console.log(chalk.blue('🚀 Running basic Llama example...'));
    const { runBasicExample } = require('./examples/basic-example');
    await runBasicExample();
  });

program
  .command('chat')
  .description('Run interactive chat example')
  .action(async () => {
    console.log(chalk.blue('💬 Starting interactive chat...'));
    const { runChatExample } = require('./examples/chat-example');
    await runChatExample();
  });

program
  .command('stream')
  .description('Run streaming response example')
  .action(async () => {
    console.log(chalk.blue('🌊 Running streaming example...'));
    const { runStreamingExample } = require('./examples/streaming-example');
    await runStreamingExample();
  });

program.parse();
