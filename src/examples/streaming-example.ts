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

export async function runStreamingExample(
  options: ExampleOptions = {}
): Promise<void> {
  const providerId = resolveProviderId(options.provider);
  const provider = getProvider(providerId);
  const streamConfig = buildGenerationConfig(options);

  try {
    console.log(
      chalk.yellow(`Streaming Llama Response (${provider.label})\n`)
    );
    printGenerationConfig(providerId, streamConfig);

    if (!(await provider.isAvailable())) {
      console.log(chalk.yellow("\n" + provider.getSetupInstructions()));
      return;
    }

    console.log(chalk.blue("\nConnecting..."));
    const session = await provider.createSession();
    const prompt = config.prompts.stream;

    console.log(chalk.blue("\nPrompt:"), chalk.white(prompt));
    console.log(chalk.blue("Streaming response...\n"));
    console.log(chalk.green("Response: "));

    const startTime = Date.now();
    let fullResponse = "";

    await session.prompt(prompt, {
      ...streamConfig,
      onTextChunk: (text: string) => {
        if (text) {
          fullResponse += text;
          process.stdout.write(chalk.white(text));
        }
      },
    });

    const endTime = Date.now();
    console.log(
      chalk.gray(`\n\nTotal generation time: ${endTime - startTime}ms`)
    );
    console.log(chalk.gray(`Total characters: ${fullResponse.length}`));
  } catch (error: unknown) {
    handleExampleError(error, "streaming example");
  }
}

export function showStreamingExample(): void {
  console.log(chalk.yellow("\nStreaming with Ollama:"));
  console.log(
    chalk.gray(`
const stream = await ollama.chat({ model: "llama3.2", messages: [...], stream: true });
for await (const chunk of stream) process.stdout.write(chunk.message.content);
`)
  );
}
