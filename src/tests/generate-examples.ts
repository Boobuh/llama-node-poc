import fs from "node:fs";
import { EXAMPLES_OUTPUT_PATH } from "../constants";
import { config } from "../config";
import { getProvider, parseProvider } from "../providers";
import type { ArticleExample } from "../types/examples";
import { ARTICLE_EXAMPLE_DEFINITIONS } from "./fixtures/article-examples";
import { formatArticleExamplesOutput } from "./helpers/format-examples-output";
import { prepareTestProvider } from "./helpers/setup-test-provider";

function printExamplesSummary(examples: ArticleExample[]): void {
  for (let index = 0; index < examples.length; index++) {
    const ex = examples[index];
    console.log(
      `${index + 1}. ${ex.category}: ${ex.response.substring(0, 60)}...`
    );
  }
}

async function generateExamples(): Promise<void> {
  const providerId = parseProvider(process.env.PROVIDER ?? config.defaultProvider);
  const provider = getProvider(providerId);

  prepareTestProvider(providerId);

  if (!(await provider.isAvailable())) {
    console.error(`Provider "${providerId}" not available.`);
    console.error(provider.getSetupInstructions());
    process.exit(1);
  }

  console.log(`Loading ${provider.label} for example generation...\n`);
  const session = await provider.createSession();
  const examples: ArticleExample[] = [];

  console.log("=== Generating examples ===\n");

  try {
    for (let i = 0; i < ARTICLE_EXAMPLE_DEFINITIONS.length; i++) {
      const def = ARTICLE_EXAMPLE_DEFINITIONS[i];
      if (!def) {
        continue;
      }
      console.log(`${i + 1}. ${def.category}...`);

      if (def.contextSetup) {
        await session.prompt(def.contextSetup, {
          temperature: def.temperature,
          maxTokens: def.maxTokens,
        });
      }

      const response = await session.prompt(def.prompt, {
        temperature: def.temperature,
        maxTokens: def.maxTokens,
      });

      examples.push({
        category: def.category,
        prompt: def.contextSetup
          ? `${def.prompt} (after: ${def.contextSetup})`
          : def.prompt,
        response,
        temperature: def.temperature,
        maxTokens: def.maxTokens,
      });

      console.log("   Done\n");
    }

    console.log("\n=== Generating output file ===\n");

    const header = `ПРИКЛАДИ ЗАПИТІВ ТА ВІДПОВІДЕЙ LLAMA

Ці приклади згенеровані через ${provider.label} (${providerId}), модель: ${process.env.OLLAMA_MODEL ?? config.ollama.model}, Node.js.`;

    const fullOutput = formatArticleExamplesOutput(examples, header);
    fs.writeFileSync(EXAMPLES_OUTPUT_PATH, fullOutput, "utf-8");
    console.log(`✅ Examples saved to ${EXAMPLES_OUTPUT_PATH}\n`);

    console.log("Summary:");
    printExamplesSummary(examples);
  } catch (error) {
    console.error("Error generating examples:", error);
    process.exit(1);
  }
}

async function runGenerateExamples(): Promise<void> {
  try {
    await generateExamples();
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

void runGenerateExamples();
