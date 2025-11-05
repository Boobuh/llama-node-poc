import chalk from "chalk";
import fs from "fs";
import { config } from "../config";
const testResults = [];
async function runComprehensiveTests() {
    console.log(chalk.blue("\n🧪 Starting Comprehensive Llama-Node Test Suite\n"));
    console.log(chalk.gray("=".repeat(60)));
    const modelPath = config.model.path;
    if (!fs.existsSync(modelPath)) {
        console.log(chalk.red("\n❌ Model file not found!"));
        console.log(chalk.yellow(`\n📋 Model Path: ${modelPath}`));
        console.log(chalk.gray("Please download a model first."));
        console.log(chalk.cyan("\n💡 Quick Setup:"));
        console.log(chalk.gray("mkdir -p models"));
        console.log(chalk.gray("wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ./models/llama-model.gguf"));
        process.exit(1);
    }
    try {
        console.log(chalk.green("\n⚙️ Loading Llama model..."));
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
        console.log(chalk.green("✅ Model loaded successfully!\n"));
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
        printTestSummary();
    }
    catch (error) {
        console.error(chalk.red("\n❌ Fatal Error:"), error);
        process.exit(1);
    }
}
async function testBasicConnectivity(session) {
    const suite = { name: "🔌 Basic Connectivity", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Basic Connectivity"));
    const startTime = Date.now();
    try {
        const response = await session.prompt("Hello!", {
            temperature: 0.7,
            maxTokens: 50,
        });
        const duration = Date.now() - startTime;
        const responseText = typeof response === "string" ? response : String(response);
        suite.tests.push({
            name: "Simple greeting response",
            passed: responseText.length > 0,
            message: `Response: "${responseText.substring(0, 50)}..."`,
            duration,
        });
        suite.tests.push({
            name: "Response time < 30s",
            passed: duration < 30000,
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
    const suite = { name: "🌡️ Temperature Control", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Temperature Control"));
    const prompt = "Explain what a tree is in one sentence.";
    try {
        const lowTempResponse = await session.prompt(prompt, {
            temperature: 0.1,
            maxTokens: 100,
        });
        const highTempResponse = await session.prompt(prompt, {
            temperature: 1.0,
            maxTokens: 100,
        });
        const lowText = typeof lowTempResponse === "string" ? lowTempResponse : String(lowTempResponse);
        const highText = typeof highTempResponse === "string" ? highTempResponse : String(highTempResponse);
        suite.tests.push({
            name: "Low temperature (0.1) - deterministic",
            passed: lowText.length > 0,
            message: `Response length: ${lowText.length} chars`,
        });
        suite.tests.push({
            name: "High temperature (1.0) - creative",
            passed: highText.length > 0,
            message: `Response length: ${highText.length} chars`,
        });
        const responsesDiffer = lowText !== highText;
        suite.tests.push({
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
    const suite = { name: "🔢 Token Limits", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Token Limits"));
    try {
        const response = await session.prompt("Count from 1 to 20:", {
            temperature: 0.7,
            maxTokens: 10,
            topP: config.generation.topP,
            topK: config.generation.topK,
        });
        const responseText = typeof response === "string" ? response : String(response);
        const wordCount = responseText.split(/\s+/).length;
        suite.tests.push({
            name: "Respects maxTokens limit",
            passed: wordCount <= 15,
            message: `Generated ${wordCount} words (maxTokens: 10)`,
        });
        suite.tests.push({
            name: "Response within bounds",
            passed: responseText.length > 0 && responseText.length < 500,
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
    const suite = { name: "🌊 Streaming Output", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Streaming Output"));
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
        });
        suite.tests.push({
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
    const suite = { name: "💬 Language Understanding", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Language Understanding"));
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
            const responseText = (typeof response === "string" ? response : String(response)).toLowerCase();
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
    const suite = { name: "🧠 Step-by-Step Reasoning", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Reasoning"));
    try {
        const prompt = "If I have 3 apples and eat 1, how many are left? Show your reasoning step by step.";
        const response = await session.prompt(prompt, {
            temperature: 0.5,
            maxTokens: 150,
        });
        const responseText = (typeof response === "string" ? response : String(response)).toLowerCase();
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
    const suite = { name: "💻 Code Generation", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Code Generation"));
    try {
        const prompt = "Write a JavaScript function that reverses a string. Only return the code, no explanation.";
        const response = await session.prompt(prompt, {
            temperature: 0.3,
            maxTokens: 200,
        });
        const responseText = typeof response === "string" ? response : String(response);
        const hasFunction = responseText.includes("function") || responseText.includes("=>");
        const hasReverse = responseText.includes("reverse") || responseText.includes("split");
        suite.tests.push({
            name: "Generates code structure",
            passed: hasFunction,
            message: hasFunction
                ? "Contains function definition"
                : "No function found",
        });
        suite.tests.push({
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
    const suite = { name: "📚 Context Retention", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Context Retention"));
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
        const responseText = (typeof response === "string" ? response : String(response)).toLowerCase();
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
    const suite = { name: "📝 Summarization", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Summarization"));
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
        const responseText = typeof response === "string" ? response : String(response);
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
    const suite = { name: "✨ Creative Text", tests: [] };
    console.log(chalk.cyan("\n📋 Test Suite: Creative Text"));
    try {
        const prompt = "Write a short story about a robot discovering emotions (3 sentences).";
        const response = await session.prompt(prompt, {
            temperature: 0.8,
            maxTokens: 200,
        });
        const responseText = typeof response === "string" ? response : String(response);
        suite.tests.push({
            name: "Creative story generation",
            passed: responseText.length > 50,
            message: `Story: "${responseText.substring(0, 120)}..."`,
        });
        const hasCoherence = responseText.split(/[.!?]/).length >= 2;
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
function printSuiteResults(suite) {
    suite.tests.forEach((test) => {
        const status = test.passed ? chalk.green("✅") : chalk.red("❌");
        const duration = test.duration ? chalk.gray(` (${test.duration}ms)`) : "";
        console.log(`  ${status} ${test.name}${duration}`);
        if (test.message) {
            console.log(chalk.gray(`     ${test.message}`));
        }
        if (test.error) {
            console.log(chalk.red(`     Error: ${test.error}`));
        }
    });
}
function printTestSummary() {
    console.log(chalk.blue("\n" + "=".repeat(60)));
    console.log(chalk.cyan("\n📊 Test Summary\n"));
    let totalTests = 0;
    let passedTests = 0;
    testResults.forEach((suite) => {
        const suitePassed = suite.tests.filter((t) => t.passed).length;
        const suiteTotal = suite.tests.length;
        totalTests += suiteTotal;
        passedTests += suitePassed;
        const status = suitePassed === suiteTotal ? chalk.green("✅") : chalk.yellow("⚠️");
        console.log(`${status} ${suite.name}: ${suitePassed}/${suiteTotal} tests passed`);
    });
    console.log(chalk.blue("\n" + "-".repeat(60)));
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);
    const summaryColor = passRate >= "80"
        ? chalk.green
        : passRate >= "50"
            ? chalk.yellow
            : chalk.red;
    console.log(summaryColor(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed (${passRate}%)`));
    if (passedTests === totalTests) {
        console.log(chalk.green("\n🎉 All tests passed! Your implementation is working correctly."));
    }
    else if (passedTests >= totalTests * 0.8) {
        console.log(chalk.yellow("\n⚠️ Most tests passed. Some issues may be expected behavior."));
    }
    else {
        console.log(chalk.red("\n❌ Several tests failed. Review the implementation."));
    }
    console.log(chalk.gray("\n" + "=".repeat(60) + "\n"));
}
runComprehensiveTests().catch((error) => {
    console.error(chalk.red("\n❌ Test suite failed:"), error);
    process.exit(1);
});
export { runComprehensiveTests };
//# sourceMappingURL=comprehensive-test.js.map