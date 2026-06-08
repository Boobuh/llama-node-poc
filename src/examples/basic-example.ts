import chalk from "chalk";
import { config } from "../config";
import { getProvider } from "../providers";
import {
  buildGenerationConfig,
  handleExampleError,
  printGenerationConfig,
  resolveProviderId,
  type ExampleOptions,
} from "./shared";

export async function runBasicExample(
  options: ExampleOptions = {}
): Promise<void> {
  const providerId = resolveProviderId(options.provider);
  const provider = getProvider(providerId);
  const generationConfig = buildGenerationConfig(options);

  try {
    console.log(
      chalk.yellow(`Basic Llama Text Generation (${provider.label})\n`)
    );

    printGenerationConfig(providerId, generationConfig);

    if (!(await provider.isAvailable())) {
      console.log(chalk.yellow("\n" + provider.getSetupInstructions()));
      return;
    }

    console.log(chalk.blue("\nConnecting..."));
    const session = await provider.createSession();
    const prompt = config.prompts.basic;

    console.log(chalk.blue("\nPrompt:"), chalk.white(prompt));
    console.log(chalk.blue("Generating response...\n"));

    const startTime = Date.now();
    const response = await session.prompt(prompt, generationConfig);
    const endTime = Date.now();

    console.log(chalk.green("Response:"));
    console.log(chalk.white(response));
    console.log(chalk.gray(`\nGeneration time: ${endTime - startTime}ms`));
  } catch (error: unknown) {
    handleExampleError(error, "basic example");
  }
}

export function showApiExample(): void {
  console.log(chalk.yellow("\nOllama (Node.js client):"));
  console.log(
    chalk.gray(`
import ollama from "ollama";
const client = new ollama.Ollama({ host: "http://127.0.0.1:11434" });
const { message } = await client.chat({
  model: "llama3.2",
  messages: [{ role: "user", content: "Hello!" }],
});
console.log(message.content);
`)
  );

  console.log(chalk.yellow("\nllama-node (GGUF in-process):"));
  console.log(
    chalk.gray(`
import { LLM } from "llama-node";
import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";
const llm = new LLM(LLamaCpp);
await llm.load({ modelPath: "./models/llama-model.gguf", enableLogging: false, ... });
const result = await llm.createCompletion({ prompt: "Hello!", nThreads: 4, nTokPredict: 200 }, () => {});
console.log(result.tokens.join(""));
`)
  );
}
