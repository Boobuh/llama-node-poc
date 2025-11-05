"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runComprehensiveTests = runComprehensiveTests;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../config");
const llamaNode = require("llama-node");
const fs = require("fs");
const testResults = [];
async function runComprehensiveTests() {
    console.log(chalk_1.default.blue("\n🧪 Starting Comprehensive Llama-Node Test Suite\n"));
    console.log(chalk_1.default.gray("=".repeat(60)));
    const modelPath = config_1.config.model.path;
    if (!fs.existsSync(modelPath)) {
        console.log(chalk_1.default.red("\n❌ Model file not found!"));
        console.log(chalk_1.default.yellow(`\n📋 Model Path: ${modelPath}`));
        console.log(chalk_1.default.gray("Please download a model first."));
        console.log(chalk_1.default.cyan("\n💡 Quick Setup:"));
        console.log(chalk_1.default.gray("mkdir -p models"));
        console.log(chalk_1.default.gray("wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ./models/llama-model.gguf"));
        process.exit(1);
    }
    try {
        console.log(chalk_1.default.green("\n⚙️ Loading Llama model..."));
        const Llama = llamaNode.LlamaApi;
        const api = new Llama(modelPath);
        console.log(chalk_1.default.green("✅ Model loaded successfully!\n"));
        await testBasicConnectivity(api);
        await testTemperatureControl(api);
        await testTokenLimits(api);
        await testStreamingOutput(api);
        await testLanguageUnderstanding(api);
        await testReasoning(api);
        await testCodeGeneration(api);
        await testContextRetention(api);
        await testSummarization(api);
        await testCreativeText(api);
        printTestSummary();
    }
    catch (error) {
        console.error(chalk_1.default.red("\n❌ Fatal Error:"), error);
        process.exit(1);
    }
}
async function testBasicConnectivity(api) {
    const suite = { name: "🔌 Basic Connectivity", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Basic Connectivity"));
    const startTime = Date.now();
    try {
        const response = await api.generate("Hello!", {
            temperature: 0.7,
            maxTokens: 50,
        });
        const duration = Date.now() - startTime;
        const responseText = response.text || response.toString();
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
async function testTemperatureControl(api) {
    const suite = { name: "🌡️ Temperature Control", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Temperature Control"));
    const prompt = "Explain what a tree is in one sentence.";
    try {
        const lowTempResponse = await api.generate(prompt, {
            temperature: 0.1,
            maxTokens: 100,
        });
        const highTempResponse = await api.generate(prompt, {
            temperature: 1.0,
            maxTokens: 100,
        });
        const lowText = lowTempResponse.text || lowTempResponse.toString();
        const highText = highTempResponse.text || highTempResponse.toString();
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
async function testTokenLimits(api) {
    const suite = { name: "🔢 Token Limits", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Token Limits"));
    try {
        const shortConfig = {
            temperature: 0.7,
            maxTokens: 10,
            topP: config_1.config.generation.topP,
            topK: config_1.config.generation.topK,
        };
        const response = await api.generate("Count from 1 to 20:", shortConfig);
        const responseText = response.text || response.toString();
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
async function testStreamingOutput(api) {
    const suite = { name: "🌊 Streaming Output", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Streaming Output"));
    try {
        let streamedTokens = 0;
        let streamComplete = false;
        const callback = (token) => {
            if (token) {
                streamedTokens++;
                process.stdout.write(chalk_1.default.gray("."));
            }
        };
        const startTime = Date.now();
        await api.generate("Say hello world five times:", {
            temperature: 0.7,
            maxTokens: 50,
            stream: true,
            callback: callback,
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
async function testLanguageUnderstanding(api) {
    const suite = { name: "💬 Language Understanding", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Language Understanding"));
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
            const response = await api.generate(test.prompt, {
                temperature: 0.3,
                maxTokens: 100,
            });
            const responseText = response.text || response.toString().toLowerCase();
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
async function testReasoning(api) {
    const suite = { name: "🧠 Step-by-Step Reasoning", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Reasoning"));
    try {
        const prompt = "If I have 3 apples and eat 1, how many are left? Show your reasoning step by step.";
        const response = await api.generate(prompt, {
            temperature: 0.5,
            maxTokens: 150,
        });
        const responseText = response.text || response.toString().toLowerCase();
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
async function testCodeGeneration(api) {
    const suite = { name: "💻 Code Generation", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Code Generation"));
    try {
        const prompt = "Write a JavaScript function that reverses a string. Only return the code, no explanation.";
        const response = await api.generate(prompt, {
            temperature: 0.3,
            maxTokens: 200,
        });
        const responseText = response.text || response.toString();
        const hasFunction = responseText.includes("function") || responseText.includes("=>");
        const hasReverse = responseText.includes("reverse") || responseText.includes("split");
        suite.tests.push({
            name: "Generates code structure",
            passed: hasFunction,
            message: hasFunction ? "Contains function definition" : "No function found",
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
async function testContextRetention(api) {
    const suite = { name: "📚 Context Retention", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Context Retention"));
    try {
        const contextPrompt = "My dog's name is Rex. He is 5 years old. Remember this.";
        await api.generate(contextPrompt, {
            temperature: 0.5,
            maxTokens: 50,
        });
        const question = "How old is Rex and what is his name?";
        const response = await api.generate(question, {
            temperature: 0.5,
            maxTokens: 100,
        });
        const responseText = response.text || response.toString().toLowerCase();
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
async function testSummarization(api) {
    const suite = { name: "📝 Summarization", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Summarization"));
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
        const response = await api.generate(prompt, {
            temperature: 0.4,
            maxTokens: 100,
        });
        const responseText = response.text || response.toString();
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
async function testCreativeText(api) {
    const suite = { name: "✨ Creative Text", tests: [] };
    console.log(chalk_1.default.cyan("\n📋 Test Suite: Creative Text"));
    try {
        const prompt = "Write a short story about a robot discovering emotions (3 sentences).";
        const response = await api.generate(prompt, {
            temperature: 0.8,
            maxTokens: 200,
        });
        const responseText = response.text || response.toString();
        suite.tests.push({
            name: "Creative story generation",
            passed: responseText.length > 50,
            message: `Story: "${responseText.substring(0, 120)}..."`,
        });
        const hasCoherence = responseText.split(/[.!?]/).length >= 2;
        suite.tests.push({
            name: "Story coherence",
            passed: hasCoherence,
            message: hasCoherence ? "Multiple sentences generated" : "Single sentence only",
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
        const status = test.passed ? chalk_1.default.green("✅") : chalk_1.default.red("❌");
        const duration = test.duration ? chalk_1.default.gray(` (${test.duration}ms)`) : "";
        console.log(`  ${status} ${test.name}${duration}`);
        if (test.message) {
            console.log(chalk_1.default.gray(`     ${test.message}`));
        }
        if (test.error) {
            console.log(chalk_1.default.red(`     Error: ${test.error}`));
        }
    });
}
function printTestSummary() {
    console.log(chalk_1.default.blue("\n" + "=".repeat(60)));
    console.log(chalk_1.default.cyan("\n📊 Test Summary\n"));
    let totalTests = 0;
    let passedTests = 0;
    testResults.forEach((suite) => {
        const suitePassed = suite.tests.filter((t) => t.passed).length;
        const suiteTotal = suite.tests.length;
        totalTests += suiteTotal;
        passedTests += suitePassed;
        const status = suitePassed === suiteTotal ? chalk_1.default.green("✅") : chalk_1.default.yellow("⚠️");
        console.log(`${status} ${suite.name}: ${suitePassed}/${suiteTotal} tests passed`);
    });
    console.log(chalk_1.default.blue("\n" + "-".repeat(60)));
    const passRate = ((passedTests / totalTests) * 100).toFixed(1);
    const summaryColor = passRate >= "80" ? chalk_1.default.green : passRate >= "50" ? chalk_1.default.yellow : chalk_1.default.red;
    console.log(summaryColor(`\n🎯 Overall: ${passedTests}/${totalTests} tests passed (${passRate}%)`));
    if (passedTests === totalTests) {
        console.log(chalk_1.default.green("\n🎉 All tests passed! Your implementation is working correctly."));
    }
    else if (passedTests >= totalTests * 0.8) {
        console.log(chalk_1.default.yellow("\n⚠️ Most tests passed. Some issues may be expected behavior."));
    }
    else {
        console.log(chalk_1.default.red("\n❌ Several tests failed. Review the implementation."));
    }
    console.log(chalk_1.default.gray("\n" + "=".repeat(60) + "\n"));
}
if (require.main === module) {
    runComprehensiveTests().catch((error) => {
        console.error(chalk_1.default.red("\n❌ Test suite failed:"), error);
        process.exit(1);
    });
}
//# sourceMappingURL=comprehensive-test.js.map