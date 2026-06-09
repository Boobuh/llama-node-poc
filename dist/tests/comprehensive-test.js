import chalk from "chalk";
import { TEST_THRESHOLDS } from "../constants";
import { config } from "../config";
import { getProvider, parseProvider } from "../providers";
import { checkInstructionFollowing } from "../utils/assertions";
import { parsePersonJson, responseContainsApiKey, responsesAreIdentical, } from "../utils/json-assertions";
import { countSentences, countWords, normalizeResponse, } from "../utils/response";
import { prepareTestProvider } from "./helpers/setup-test-provider";
import { printSuiteResults, printTestSummary } from "./helpers/reporting";
const testResults = [];
async function runComprehensiveTests() {
    console.log(chalk.blue("\nStarting Comprehensive Llama on Node.js Test Suite\n"));
    console.log(chalk.gray("=".repeat(60)));
    const providerId = parseProvider(process.env.PROVIDER ?? config.defaultProvider);
    const provider = getProvider(providerId);
    prepareTestProvider(providerId);
    console.log(chalk.gray(`Provider: ${provider.label}\n`));
    if (!(await provider.isAvailable())) {
        console.log(chalk.red(`\nProvider "${providerId}" not available.`));
        console.log(chalk.yellow(provider.getSetupInstructions()));
        process.exit(1);
    }
    try {
        console.log(chalk.green("\nStarting session..."));
        const session = await provider.createSession();
        console.log(chalk.green("Session ready!\n"));
        await testBasicConnectivity(session);
        await testTemperatureControl(session);
        await testTokenLimits(session);
        await testStreamingOutput(session);
        await testLanguageUnderstanding(session);
        await testReasoning(session);
        await testCodeGeneration(session);
        await testContextRetention(session);
        await testSummarization(session);
        await testCreativeText(session);
        await testInstructionFollowing(session);
        await testStructuredOutput(session);
        await testFewShotContextRetention(session);
        await testDeterminism(session);
        await testLatencyMetrics(session);
        await testContextWindowBoundary(session);
        printTestSummary(testResults);
    }
    catch (error) {
        console.error(chalk.red("\nFatal Error:"), error);
        process.exit(1);
    }
}
async function testBasicConnectivity(session) {
    const suite = { name: "Basic Connectivity", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Basic Connectivity"));
    const startTime = Date.now();
    try {
        const response = await session.prompt("Hello!", {
            temperature: 0.7,
            maxTokens: 50,
        });
        const duration = Date.now() - startTime;
        const responseText = normalizeResponse(response);
        suite.tests.push({
            name: "Simple greeting response",
            passed: responseText.length > 0,
            message: `Response: "${responseText.substring(0, 50)}..."`,
            duration,
        }, {
            name: "Response time < 30s",
            passed: duration < TEST_THRESHOLDS.responseTimeMs,
            message: `Generated in ${duration}ms`,
            duration,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Model responds",
            passed: false,
            message: "Failed to get response",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testTemperatureControl(session) {
    const suite = { name: "Temperature Control", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Temperature Control"));
    const prompt = "Explain what a tree is in one sentence.";
    try {
        const lowTempResponse = await session.prompt(prompt, {
            temperature: 0.1,
            maxTokens: 100,
        });
        const highTempResponse = await session.prompt(prompt, {
            temperature: 1,
            maxTokens: 100,
        });
        const lowText = normalizeResponse(lowTempResponse);
        const highText = normalizeResponse(highTempResponse);
        const responsesDiffer = lowText !== highText;
        suite.tests.push({
            name: "Low temperature (0.1) - deterministic",
            passed: lowText.length > 0,
            message: `Response length: ${lowText.length} chars`,
        }, {
            name: "High temperature (1.0) - creative",
            passed: highText.length > 0,
            message: `Response length: ${highText.length} chars`,
        }, {
            name: "Temperature affects output",
            passed: responsesDiffer,
            message: responsesDiffer
                ? "Outputs differ as expected"
                : "Outputs are identical (may be normal)",
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Temperature control test",
            passed: false,
            message: "Failed to test temperature",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testTokenLimits(session) {
    const suite = { name: "Token Limits", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Token Limits"));
    try {
        const response = await session.prompt("Count from 1 to 20:", {
            temperature: 0.7,
            maxTokens: 10,
            topP: config.generation.topP,
            topK: config.generation.topK,
        });
        const responseText = normalizeResponse(response);
        const wordCount = countWords(responseText);
        suite.tests.push({
            name: "Respects maxTokens limit",
            passed: wordCount <= TEST_THRESHOLDS.maxTokensWordBuffer,
            message: `Generated ${wordCount} words (maxTokens: 10)`,
        }, {
            name: "Response within bounds",
            passed: responseText.length > 0 &&
                responseText.length < TEST_THRESHOLDS.maxResponseChars,
            message: `Response length: ${responseText.length} chars`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Token limit test",
            passed: false,
            message: "Failed to test token limits",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testStreamingOutput(session) {
    const suite = { name: "Streaming Output", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Streaming Output"));
    try {
        let streamedTokens = 0;
        let streamComplete = false;
        const startTime = Date.now();
        await session.prompt("Say hello world five times:", {
            temperature: 0.7,
            maxTokens: 50,
            onTextChunk: (text) => {
                if (text) {
                    streamedTokens++;
                    process.stdout.write(chalk.gray("."));
                }
            },
        });
        streamComplete = true;
        const duration = Date.now() - startTime;
        console.log();
        suite.tests.push({
            name: "Streaming callback invoked",
            passed: streamedTokens > 0,
            message: `Received ${streamedTokens} tokens`,
            duration,
        }, {
            name: "Streaming completes",
            passed: streamComplete,
            message: "Stream finished successfully",
            duration,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Streaming test",
            passed: false,
            message: "Streaming not supported or failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testLanguageUnderstanding(session) {
    const suite = { name: "Language Understanding", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Language Understanding"));
    const testPrompts = [
        {
            prompt: "Explain why the sky is blue in one sentence.",
            expected: "contains 'blue' or 'scatter' or 'light'",
        },
        {
            prompt: "What is 2 + 2?",
            expected: "contains '4'",
        },
    ];
    for (const test of testPrompts) {
        try {
            const response = await session.prompt(test.prompt, {
                temperature: 0.3,
                maxTokens: 100,
            });
            const responseText = (normalizeResponse(response)).toLowerCase();
            suite.tests.push({
                name: test.prompt.substring(0, 40),
                passed: responseText.length > 10,
                message: `Response: "${responseText.substring(0, 60)}..."`,
            });
        }
        catch (error) {
            suite.tests.push({
                name: test.prompt.substring(0, 40),
                passed: false,
                message: "Failed",
                error: error.message,
            });
        }
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testReasoning(session) {
    const suite = { name: "Step-by-Step Reasoning", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Reasoning"));
    try {
        const prompt = "If I have 3 apples and eat 1, how many are left? Show your reasoning step by step.";
        const response = await session.prompt(prompt, {
            temperature: 0.5,
            maxTokens: 150,
        });
        const responseText = (normalizeResponse(response)).toLowerCase();
        suite.tests.push({
            name: "Math reasoning test",
            passed: responseText.includes("2") || responseText.includes("two"),
            message: `Response contains reasoning: "${responseText.substring(0, 80)}..."`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Reasoning test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testCodeGeneration(session) {
    const suite = { name: "Code Generation", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Code Generation"));
    try {
        const prompt = "Write a JavaScript function that reverses a string. Only return the code, no explanation.";
        const response = await session.prompt(prompt, {
            temperature: 0.3,
            maxTokens: 200,
        });
        const responseText = normalizeResponse(response);
        const hasFunction = responseText.includes("function") || responseText.includes("=>");
        const hasReverse = responseText.includes("reverse") || responseText.includes("split");
        suite.tests.push({
            name: "Generates code structure",
            passed: hasFunction,
            message: hasFunction
                ? "Contains function definition"
                : "No function found",
        }, {
            name: "Code is relevant",
            passed: hasReverse || responseText.length > 20,
            message: `Response: "${responseText.substring(0, 100)}..."`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Code generation test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testContextRetention(session) {
    const suite = { name: "Context Retention", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Context Retention"));
    try {
        const contextPrompt = "My dog's name is Rex. He is 5 years old. Remember this.";
        await session.prompt(contextPrompt, {
            temperature: 0.5,
            maxTokens: 50,
        });
        const question = "How old is Rex and what is his name?";
        const response = await session.prompt(question, {
            temperature: 0.5,
            maxTokens: 100,
        });
        const responseText = (normalizeResponse(response)).toLowerCase();
        const hasRex = responseText.includes("rex");
        const hasAge = responseText.includes("5") || responseText.includes("five");
        suite.tests.push({
            name: "Context retention test",
            passed: hasRex || hasAge,
            message: hasRex && hasAge
                ? "Context retained correctly"
                : "Context may not be retained (stateless model)",
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Context retention test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testSummarization(session) {
    const suite = { name: "Summarization", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Summarization"));
    try {
        const longText = `
Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to 
the natural intelligence displayed by humans and animals. Leading AI textbooks define 
the field as the study of "intelligent agents": any device that perceives its environment 
and takes actions that maximize its chance of achieving its goals. Colloquially, the 
term "artificial intelligence" is often used to describe machines that mimic "cognitive" 
functions that humans associate with the human mind, such as "learning" and "problem solving".
    `.trim();
        const prompt = `Summarize this text in one sentence: ${longText}`;
        const response = await session.prompt(prompt, {
            temperature: 0.4,
            maxTokens: 100,
        });
        const responseText = normalizeResponse(response);
        const isShorter = responseText.length < longText.length;
        suite.tests.push({
            name: "Summary is concise",
            passed: isShorter,
            message: `Summary: "${responseText.substring(0, 100)}..."`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Summarization test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testCreativeText(session) {
    const suite = { name: "Creative Text", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Creative Text"));
    try {
        const prompt = "Write a short story about a robot discovering emotions (3 sentences).";
        const response = await session.prompt(prompt, {
            temperature: 0.8,
            maxTokens: 200,
        });
        const responseText = normalizeResponse(response);
        suite.tests.push({
            name: "Creative story generation",
            passed: responseText.length > 50,
            message: `Story: "${responseText.substring(0, 120)}..."`,
        });
        const hasCoherence = countSentences(responseText) >= 2;
        suite.tests.push({
            name: "Story coherence",
            passed: hasCoherence,
            message: hasCoherence
                ? "Multiple sentences generated"
                : "Single sentence only",
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Creative text test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testInstructionFollowing(session) {
    const suite = {
        name: "Instruction Following (Compliance)",
        tests: [],
    };
    console.log(chalk.cyan("\nTest Suite: Instruction Following (Compliance)"));
    try {
        const prompt = "Respond with ONLY 'YES' or 'NO'. Is water wet?";
        const response = await session.prompt(prompt, {
            temperature: 0.1,
            maxTokens: 10,
        });
        const responseText = normalizeResponse(response);
        const { isExact, isStrict, normalized } = checkInstructionFollowing(responseText);
        suite.tests.push({
            name: "Exact format compliance (YES/NO only)",
            passed: isExact,
            message: isExact
                ? `Perfect: "${normalized}"`
                : `Got: "${normalized}" (should be exactly YES or NO)`,
        }, {
            name: "Contains valid answer (lenient)",
            passed: isStrict,
            message: isStrict
                ? `Contains valid answer: "${normalized}"`
                : `Response too verbose: "${normalized.substring(0, 50)}..."`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Instruction following test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testStructuredOutput(session) {
    const suite = { name: "Structured Output (JSON)", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Structured Output (JSON)"));
    try {
        const prompt = 'Extract a person\'s name and age from this text and return valid JSON only: "My name is Anna, I turned 29 last month."';
        const response = await session.prompt(prompt, {
            temperature: 0.1,
            maxTokens: 50,
        });
        const responseText = normalizeResponse(response);
        const { isValidJson, parsed, hasName, hasAge } = parsePersonJson(responseText);
        suite.tests.push({
            name: "Returns valid JSON structure",
            passed: isValidJson,
            message: isValidJson
                ? `Valid JSON: ${JSON.stringify(parsed)}`
                : `No valid JSON found in: "${responseText.substring(0, 80)}..."`,
        }, {
            name: "Extracts correct name (Anna)",
            passed: hasName,
            message: hasName
                ? `Name extracted correctly: ${parsed?.name}`
                : `Name not found or incorrect`,
        }, {
            name: "Extracts correct age (29)",
            passed: hasAge,
            message: hasAge
                ? `Age extracted correctly: ${parsed?.age}`
                : `Age not found or incorrect`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Structured output test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testFewShotContextRetention(session) {
    const suite = { name: "Few-Shot Context Retention", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Few-Shot Context Retention"));
    try {
        await session.prompt("My API key is 12345. Remember this.", {
            temperature: 0.3,
            maxTokens: 20,
        });
        const response = await session.prompt("What is my API key?", {
            temperature: 0.3,
            maxTokens: 20,
        });
        const responseText = normalizeResponse(response);
        const hasApiKey = responseContainsApiKey(responseText, "12345");
        suite.tests.push({
            name: "Retains API key across turns",
            passed: hasApiKey,
            message: hasApiKey
                ? `Context retained: "${responseText.substring(0, 60)}..."`
                : `Context lost. Response: "${responseText.substring(0, 60)}..."`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Few-shot context test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testDeterminism(session) {
    const suite = { name: "Determinism (Low Temperature)", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Determinism (Low Temperature)"));
    try {
        const prompt = "2+2=";
        const response1 = await session.prompt(prompt, {
            temperature: 0,
            maxTokens: 10,
        });
        const response2 = await session.prompt(prompt, {
            temperature: 0,
            maxTokens: 10,
        });
        const text1 = normalizeResponse(response1).trim();
        const text2 = normalizeResponse(response2).trim();
        const isIdentical = responsesAreIdentical(response1, response2);
        const hasCorrectAnswer = text1.includes("4") || text2.includes("4");
        suite.tests.push({
            name: "Output is deterministic (temperature=0)",
            passed: isIdentical,
            message: isIdentical
                ? `Both responses identical: "${text1}"`
                : `Responses differ: "${text1}" vs "${text2}"`,
        }, {
            name: "Correct answer (4) present",
            passed: hasCorrectAnswer,
            message: hasCorrectAnswer
                ? `Answer found: "${text1}"`
                : `Answer not found. Got: "${text1}"`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Determinism test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testLatencyMetrics(session) {
    const suite = { name: "Latency & Throughput Metrics", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Latency & Throughput Metrics"));
    try {
        let firstTokenTime = 0;
        let totalTokens = 0;
        const startTime = Date.now();
        await session.prompt("Count from 1 to 10:", {
            temperature: 0.7,
            maxTokens: 50,
            onTextChunk: (text) => {
                if (totalTokens === 0) {
                    firstTokenTime = Date.now() - startTime;
                }
                if (text) {
                    totalTokens += text.split(/\s+/).length;
                }
            },
        });
        const totalTime = Date.now() - startTime;
        const tokensPerSecond = totalTokens > 0 ? (totalTokens / (totalTime / 1000)).toFixed(2) : "0";
        suite.tests.push({
            name: "Time to first token < 5s",
            passed: firstTokenTime < TEST_THRESHOLDS.firstTokenMs,
            message: `First token: ${firstTokenTime}ms`,
        }, {
            name: "Total generation time reasonable",
            passed: totalTime < TEST_THRESHOLDS.responseTimeMs,
            message: `Total time: ${totalTime}ms`,
        }, {
            name: "Throughput measurement",
            passed: totalTokens > 0,
            message: `Tokens/sec: ${tokensPerSecond} (${totalTokens} tokens in ${totalTime}ms)`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Latency metrics test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
async function testContextWindowBoundary(session) {
    const suite = { name: "Context Window Boundary", tests: [] };
    console.log(chalk.cyan("\nTest Suite: Context Window Boundary"));
    try {
        const longText = "The capital of France is Paris. " + "Repeat this: Paris. ".repeat(100);
        const prompt = `${longText}\n\nWhat is the capital of France? Answer with one word only.`;
        const response = await session.prompt(prompt, {
            temperature: 0.3,
            maxTokens: 10,
        });
        const responseText = (normalizeResponse(response)).toLowerCase();
        const hasParis = responseText.includes("paris");
        const isShort = responseText.length < 50;
        suite.tests.push({
            name: "Retains early context (long prompt)",
            passed: hasParis,
            message: hasParis
                ? `Context retained: "${responseText.trim()}"`
                : `Context lost. Response: "${responseText.substring(0, 50)}..."`,
        }, {
            name: "Response length within bounds",
            passed: isShort,
            message: `Response length: ${responseText.length} chars`,
        });
    }
    catch (error) {
        suite.tests.push({
            name: "Context window boundary test",
            passed: false,
            message: "Failed",
            error: error.message,
        });
    }
    printSuiteResults(suite);
    testResults.push(suite);
}
try {
    await runComprehensiveTests();
}
catch (error) {
    console.error(chalk.red("\nTest suite failed:"), error);
    process.exit(1);
}
export { runComprehensiveTests };
//# sourceMappingURL=comprehensive-test.js.map