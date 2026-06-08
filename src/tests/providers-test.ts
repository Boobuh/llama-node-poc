import chalk from "chalk";
import { config } from "../config";
import { getProvider, type LlamaProviderId } from "../providers";

const providersToTest: LlamaProviderId[] = [
  "ollama",
  "llama-node",
  "node-llama-cpp",
];

async function testProvider(id: LlamaProviderId): Promise<boolean> {
  const provider = getProvider(id);
  console.log(chalk.cyan(`\n--- ${provider.label} (${id}) ---`));

  if (id === "ollama") {
    process.env.OLLAMA_MODEL ??= "tinyllama";
    config.ollama.model = process.env.OLLAMA_MODEL;
  }

  if (!(await provider.isAvailable())) {
    console.log(chalk.yellow(provider.getSetupInstructions()));
    return false;
  }

  try {
    const session = await provider.createSession();
    const start = Date.now();
    const response = await session.prompt("Say hello in one short sentence.", {
      temperature: 0.3,
      maxTokens: 25,
    });
    const ms = Date.now() - start;

    const text = response.trim();
    if (!text) {
      console.log(chalk.red("FAIL: empty response"));
      return false;
    }

    console.log(chalk.green("PASS"));
    console.log(chalk.gray(`  Response (${ms}ms): ${text.slice(0, 120)}`));
    return true;
  } catch (error) {
    console.log(chalk.red("FAIL:"), error instanceof Error ? error.message : error);
    return false;
  }
}

async function main(): Promise<void> {
  console.log(chalk.blue("Provider integration tests\n"));

  const results: { id: LlamaProviderId; ok: boolean }[] = [];

  for (const id of providersToTest) {
    const ok = await testProvider(id);
    results.push({ id, ok });
  }

  console.log(chalk.blue("\n=== Summary ==="));
  let passed = 0;
  for (const { id, ok } of results) {
    console.log(`${ok ? chalk.green("PASS") : chalk.red("FAIL")} ${id}`);
    if (ok) passed++;
  }

  if (passed < results.length) {
    process.exit(1);
  }

  console.log(chalk.green(`\nAll ${passed} providers working.`));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
