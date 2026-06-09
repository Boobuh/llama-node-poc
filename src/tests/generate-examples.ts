import fs from "node:fs";
import { EXAMPLES_OUTPUT_PATH } from "../constants";
import { config } from "../config";
import { getProvider, parseProvider } from "../providers";
import type { ArticleExample } from "../types/examples";
import { ARTICLE_EXAMPLE_DEFINITIONS } from "./fixtures/article-examples";
import { formatArticleExamplesOutput } from "./helpers/format-examples-output";
import { prepareTestProvider } from "./helpers/setup-test-provider";

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
          ? `${def.prompt} (після: ${def.contextSetup})`
          : def.prompt,
        response,
        temperature: def.temperature,
        maxTokens: def.maxTokens,
      });

      console.log("   Done\n");
    }

    console.log("\n=== Generating output file ===\n");

    const header = `ПРИКЛАДИ ЗАПИТІВ ТА ВІДПОВІДЕЙ LLAMA

Ці приклади згенеровані через ${provider.label} (${providerId}) на Node.js.`;

    const fullOutput = formatArticleExamplesOutput(examples, header);
    fs.writeFileSync(EXAMPLES_OUTPUT_PATH, fullOutput, "utf-8");
    console.log(`✅ Examples saved to ${EXAMPLES_OUTPUT_PATH}\n`);

    console.log("Summary:");
    examples.forEach((ex, idx) => {
      console.log(
        `${idx + 1}. ${ex.category}: ${ex.response.substring(0, 60)}...`
      );
    });
  } catch (error) {
    console.error("Error generating examples:", error);
    process.exit(1);
  }
}

generateExamples().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
