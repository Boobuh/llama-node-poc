import chalk from "chalk";
import { QUICK_TEST_MAX_TOKENS, QUICK_TEST_PROMPT, QUICK_TEST_TEMPERATURE, } from "../constants";
import { config } from "../config";
import { getProvider, parseProvider } from "../providers";
import { prepareTestProvider } from "./helpers/setup-test-provider";
async function quickTest() {
    console.log(chalk.blue("\nQuick Connectivity Test\n"));
    const providerId = parseProvider(process.env.PROVIDER ?? config.defaultProvider);
    const provider = getProvider(providerId);
    prepareTestProvider(providerId);
    console.log(chalk.gray(`Provider: ${provider.label}\n`));
    if (!(await provider.isAvailable())) {
        console.log(chalk.red("Provider not available."));
        console.log(chalk.yellow(provider.getSetupInstructions()));
        process.exit(1);
    }
    try {
        console.log(chalk.green("Connecting..."));
        const session = await provider.createSession();
        console.log(chalk.green("Ready!\n"));
        console.log(chalk.cyan("Testing basic response..."));
        const startTime = Date.now();
        const response = await session.prompt(QUICK_TEST_PROMPT, {
            temperature: QUICK_TEST_TEMPERATURE,
            maxTokens: QUICK_TEST_MAX_TOKENS,
        });
        const duration = Date.now() - startTime;
        console.log(chalk.green("\nResponse received:"));
        console.log(chalk.white(`"${response}"`));
        console.log(chalk.gray(`\nGenerated in ${duration}ms`));
        if (response && response.length > 0) {
            console.log(chalk.green("\nBasic connectivity test PASSED!"));
            console.log(chalk.cyan("\nRun 'npm test' for comprehensive test suite."));
        }
        else {
            console.log(chalk.red("\nEmpty response received"));
            process.exit(1);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(chalk.red("\nTest failed:"), message);
        if (error instanceof Error && error.stack) {
            console.error(chalk.gray(error.stack));
        }
        process.exit(1);
    }
}
try {
    await quickTest();
}
catch (error) {
    console.error(chalk.red("\nFatal error:"), error);
    process.exit(1);
}
export { quickTest };
//# sourceMappingURL=quick-test.js.map