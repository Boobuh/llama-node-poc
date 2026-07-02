import chalk from "chalk";
import {
  OPTIONAL_PROVIDER_FAIL_HINT,
  OPTIONAL_TEST_PROVIDERS,
  PROVIDER_TEST_MAX_TOKENS,
  PROVIDER_TEST_PROMPT,
  PROVIDER_TEST_TEMPERATURE,
  REQUIRED_TEST_PROVIDERS,
} from "../constants";
import { getProvider, type LlamaProviderId } from "../providers";
import { prepareTestProvider } from "./helpers/setup-test-provider";

async function testProvider(id: LlamaProviderId): Promise<boolean> {
  const provider = getProvider(id);
  console.log(chalk.cyan(`\n--- ${provider.label} (${id}) ---`));

  prepareTestProvider(id);

  if (!(await provider.isAvailable())) {
    console.log(chalk.yellow(provider.getSetupInstructions()));
    return false;
  }

  try {
    const session = await provider.createSession();
    const start = Date.now();
    const response = await session.prompt(PROVIDER_TEST_PROMPT, {
      temperature: PROVIDER_TEST_TEMPERATURE,
      maxTokens: PROVIDER_TEST_MAX_TOKENS,
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
    if (OPTIONAL_TEST_PROVIDERS.includes(id)) {
      console.log(chalk.yellow(`  ${OPTIONAL_PROVIDER_FAIL_HINT}`));
    }
    return false;
  }
}

async function main(): Promise<void> {
  console.log(chalk.blue("Provider integration tests\n"));

  const results: { id: LlamaProviderId; ok: boolean; required: boolean }[] =
    [];

  for (const id of REQUIRED_TEST_PROVIDERS) {
    results.push({ id, ok: await testProvider(id), required: true });
  }

  for (const id of OPTIONAL_TEST_PROVIDERS) {
    results.push({ id, ok: await testProvider(id), required: false });
  }

  console.log(chalk.blue("\n=== Summary ==="));
  let requiredPassed = 0;
  let optionalFailed = 0;
  for (const { id, ok, required } of results) {
    if (required) {
      console.log(`${ok ? chalk.green("PASS") : chalk.red("FAIL")} ${id} (required)`);
      if (ok) requiredPassed++;
    } else if (ok) {
      console.log(`${chalk.green("PASS")} ${id} (optional)`);
    } else {
      optionalFailed++;
      console.log(`${chalk.yellow("SKIP")} ${id} (optional — does not fail the suite)`);
    }
  }

  if (requiredPassed < REQUIRED_TEST_PROVIDERS.length) {
    console.log(chalk.red("\nRequired provider(s) failed. Fix Ollama setup and retry."));
    process.exit(1);
  }

  if (optionalFailed > 0) {
    console.log(
      chalk.green(
        `\nSuccess: all ${REQUIRED_TEST_PROVIDERS.length} required provider(s) passed.`,
      ),
    );
    console.log(
      chalk.gray(
        `${optionalFailed} optional provider(s) skipped — expected unless you use legacy llama-node + old GGUF.`,
      ),
    );
    return;
  }

  console.log(chalk.green("\nAll providers passed."));
}

async function runProvidersTest(): Promise<void> {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

void runProvidersTest();
