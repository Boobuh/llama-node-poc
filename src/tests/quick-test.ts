import chalk from "chalk";
import { config } from "../config";

import fs from "node:fs";

async function quickTest(): Promise<void> {
  console.log(chalk.blue("\nQuick Connectivity Test\n"));

  const modelPath: string = config.model.path;

  if (!fs.existsSync(modelPath)) {
    console.log(chalk.red("Model file not found!"));
    console.log(chalk.yellow(`\nModel Path: ${modelPath}`));
    console.log(chalk.gray("\nPlease download a model first."));
    process.exit(1);
  }

  try {
    console.log(chalk.green("Loading model..."));
    const nodeLlamaCpp = await import("node-llama-cpp");
    const { getLlama, LlamaChatSession } = nodeLlamaCpp;

    const llama = await getLlama();
    const model = await llama.loadModel({
      modelPath: modelPath,
    });

    const context = await model.createContext();
    const session = new LlamaChatSession({
      contextSequence: context.getSequence(),
    });

    console.log(chalk.green("Model loaded!\n"));

    console.log(chalk.cyan("Testing basic response..."));
    const startTime = Date.now();
    const response = await session.prompt(
      "Say 'Hello, World!' in one sentence.",
      {
        temperature: 0.7,
        maxTokens: 50,
      }
    );
    const duration = Date.now() - startTime;

    console.log(chalk.green("\nResponse received:"));
    console.log(chalk.white(`"${response}"`));
    console.log(chalk.gray(`\nGenerated in ${duration}ms`));

    if (response && response.length > 0) {
      console.log(chalk.green("\nBasic connectivity test PASSED!"));
      console.log(chalk.cyan("\nRun 'npm test' for comprehensive test suite."));
    } else {
      console.log(chalk.red("\nEmpty response received"));
    }
  } catch (error: any) {
    console.error(chalk.red("\nTest failed:"), error.message);
    if (error.stack) {
      console.error(chalk.gray(error.stack));
    }
    process.exit(1);
  }
}

try {
  await quickTest();
} catch (error) {
  console.error(chalk.red("\nFatal error:"), error);
  process.exit(1);
}

export { quickTest };
