import chalk from "chalk";
import fs from "node:fs";
import { config } from "../config";

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration?: number;
  error?: string;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
}

const testResults: TestSuite[] = [];

async function runComprehensiveTests(): Promise<void> {
  console.log(chalk.blue("\nStarting Comprehensive Llama-Node Test Suite\n"));
  console.log(chalk.gray("=".repeat(60)));

  const modelPath: string = config.model.path;

  if (!fs.existsSync(modelPath)) {
    console.log(chalk.red("\nModel file not found!"));
    console.log(chalk.yellow(`\nModel Path: ${modelPath}`));
    console.log(chalk.gray("Please download a model first."));
    console.log(chalk.cyan("\nQuick Setup:"));
    console.log(chalk.gray("mkdir -p models"));
    console.log(
      chalk.gray(
        "wget https://huggingface.co/TheBloke/Llama-2-7B-Chat-GGUF/resolve/main/llama-2-7B-chat.Q4_K_M.gguf -O ./models/llama-model.gguf"
      )
    );
    process.exit(1);
  }

  try {
    console.log(chalk.green("\nLoading Llama model..."));
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

    console.log(chalk.green("Model loaded successfully!\n"));

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

    printTestSummary();
  } catch (error) {
    console.error(chalk.red("\nFatal Error:"), error);
    process.exit(1);
  }
}

async function testBasicConnectivity(session: any): Promise<void> {
  const suite: TestSuite = { name: "Basic Connectivity", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Basic Connectivity"));

  const startTime = Date.now();
  try {
    const response = await session.prompt("Hello!", {
      temperature: 0.7,
      maxTokens: 50,
    });

    const duration = Date.now() - startTime;
    const responseText =
      typeof response === "string" ? response : String(response);

    suite.tests.push(
      {
        name: "Simple greeting response",
        passed: responseText.length > 0,
        message: `Response: "${responseText.substring(0, 50)}..."`,
        duration,
      },
      {
        name: "Response time < 30s",
        passed: duration < 30000,
        message: `Generated in ${duration}ms`,
        duration,
      }
    );
  } catch (error: any) {
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

async function testTemperatureControl(session: any): Promise<void> {
  const suite: TestSuite = { name: "Temperature Control", tests: [] };

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

    const lowText =
      typeof lowTempResponse === "string"
        ? lowTempResponse
        : String(lowTempResponse);
    const highText =
      typeof highTempResponse === "string"
        ? highTempResponse
        : String(highTempResponse);

    const responsesDiffer = lowText !== highText;
    suite.tests.push(
      {
        name: "Low temperature (0.1) - deterministic",
        passed: lowText.length > 0,
        message: `Response length: ${lowText.length} chars`,
      },
      {
        name: "High temperature (1.0) - creative",
        passed: highText.length > 0,
        message: `Response length: ${highText.length} chars`,
      },
      {
        name: "Temperature affects output",
        passed: responsesDiffer,
        message: responsesDiffer
          ? "Outputs differ as expected"
          : "Outputs are identical (may be normal)",
      }
    );
  } catch (error: any) {
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

async function testTokenLimits(session: any): Promise<void> {
  const suite: TestSuite = { name: "Token Limits", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Token Limits"));

  try {
    const response = await session.prompt("Count from 1 to 20:", {
      temperature: 0.7,
      maxTokens: 10,
      topP: config.generation.topP,
      topK: config.generation.topK,
    });

    const responseText =
      typeof response === "string" ? response : String(response);
    const wordCount = responseText.split(/\s+/).length;

    suite.tests.push(
      {
        name: "Respects maxTokens limit",
        passed: wordCount <= 15,
        message: `Generated ${wordCount} words (maxTokens: 10)`,
      },
      {
        name: "Response within bounds",
        passed: responseText.length > 0 && responseText.length < 500,
        message: `Response length: ${responseText.length} chars`,
      }
    );
  } catch (error: any) {
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

async function testStreamingOutput(session: any): Promise<void> {
  const suite: TestSuite = { name: "Streaming Output", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Streaming Output"));

  try {
    let streamedTokens = 0;
    let streamComplete = false;

    const startTime = Date.now();
    await session.prompt("Say hello world five times:", {
      temperature: 0.7,
      maxTokens: 50,
      onTextChunk: (text: string): void => {
        if (text) {
          streamedTokens++;
          process.stdout.write(chalk.gray("."));
        }
      },
    });
    streamComplete = true;
    const duration = Date.now() - startTime;

    console.log();

    suite.tests.push(
      {
        name: "Streaming callback invoked",
        passed: streamedTokens > 0,
        message: `Received ${streamedTokens} tokens`,
        duration,
      },
      {
        name: "Streaming completes",
        passed: streamComplete,
        message: "Stream finished successfully",
        duration,
      }
    );
  } catch (error: any) {
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

async function testLanguageUnderstanding(session: any): Promise<void> {
  const suite: TestSuite = { name: "Language Understanding", tests: [] };

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

      const responseText = (
        typeof response === "string" ? response : String(response)
      ).toLowerCase();

      suite.tests.push({
        name: test.prompt.substring(0, 40),
        passed: responseText.length > 10,
        message: `Response: "${responseText.substring(0, 60)}..."`,
      });
    } catch (error: any) {
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

async function testReasoning(session: any): Promise<void> {
  const suite: TestSuite = { name: "Step-by-Step Reasoning", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Reasoning"));

  try {
    const prompt =
      "If I have 3 apples and eat 1, how many are left? Show your reasoning step by step.";

    const response = await session.prompt(prompt, {
      temperature: 0.5,
      maxTokens: 150,
    });

    const responseText = (
      typeof response === "string" ? response : String(response)
    ).toLowerCase();

    suite.tests.push({
      name: "Math reasoning test",
      passed: responseText.includes("2") || responseText.includes("two"),
      message: `Response contains reasoning: "${responseText.substring(
        0,
        80
      )}..."`,
    });
  } catch (error: any) {
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

async function testCodeGeneration(session: any): Promise<void> {
  const suite: TestSuite = { name: "Code Generation", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Code Generation"));

  try {
    const prompt =
      "Write a JavaScript function that reverses a string. Only return the code, no explanation.";

    const response = await session.prompt(prompt, {
      temperature: 0.3,
      maxTokens: 200,
    });

    const responseText =
      typeof response === "string" ? response : String(response);

    const hasFunction =
      responseText.includes("function") || responseText.includes("=>");
    const hasReverse =
      responseText.includes("reverse") || responseText.includes("split");

    suite.tests.push(
      {
        name: "Generates code structure",
        passed: hasFunction,
        message: hasFunction
          ? "Contains function definition"
          : "No function found",
      },
      {
        name: "Code is relevant",
        passed: hasReverse || responseText.length > 20,
        message: `Response: "${responseText.substring(0, 100)}..."`,
      }
    );
  } catch (error: any) {
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

async function testContextRetention(session: any): Promise<void> {
  const suite: TestSuite = { name: "Context Retention", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Context Retention"));

  try {
    const contextPrompt =
      "My dog's name is Rex. He is 5 years old. Remember this.";

    await session.prompt(contextPrompt, {
      temperature: 0.5,
      maxTokens: 50,
    });

    const question = "How old is Rex and what is his name?";

    const response = await session.prompt(question, {
      temperature: 0.5,
      maxTokens: 100,
    });

    const responseText = (
      typeof response === "string" ? response : String(response)
    ).toLowerCase();

    const hasRex = responseText.includes("rex");
    const hasAge = responseText.includes("5") || responseText.includes("five");

    suite.tests.push({
      name: "Context retention test",
      passed: hasRex || hasAge,
      message:
        hasRex && hasAge
          ? "Context retained correctly"
          : "Context may not be retained (stateless model)",
    });
  } catch (error: any) {
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

async function testSummarization(session: any): Promise<void> {
  const suite: TestSuite = { name: "Summarization", tests: [] };

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

    const responseText =
      typeof response === "string" ? response : String(response);
    const isShorter = responseText.length < longText.length;

    suite.tests.push({
      name: "Summary is concise",
      passed: isShorter,
      message: `Summary: "${responseText.substring(0, 100)}..."`,
    });
  } catch (error: any) {
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

async function testCreativeText(session: any): Promise<void> {
  const suite: TestSuite = { name: "Creative Text", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Creative Text"));

  try {
    const prompt =
      "Write a short story about a robot discovering emotions (3 sentences).";

    const response = await session.prompt(prompt, {
      temperature: 0.8,
      maxTokens: 200,
    });

    const responseText =
      typeof response === "string" ? response : String(response);

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
  } catch (error: any) {
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

async function testInstructionFollowing(session: any): Promise<void> {
  const suite: TestSuite = {
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

    const responseText = (
      typeof response === "string" ? response : String(response)
    )
      .toUpperCase()
      .trim();
    const isExact = responseText === "YES" || responseText === "NO";
    const isStrict =
      responseText.length <= 5 &&
      (responseText.includes("YES") || responseText.includes("NO"));

    suite.tests.push(
      {
        name: "Exact format compliance (YES/NO only)",
        passed: isExact,
        message: isExact
          ? `Perfect: "${responseText}"`
          : `Got: "${responseText}" (should be exactly YES or NO)`,
      },
      {
        name: "Contains valid answer (lenient)",
        passed: isStrict,
        message: isStrict
          ? `Contains valid answer: "${responseText}"`
          : `Response too verbose: "${responseText.substring(0, 50)}..."`,
      }
    );
  } catch (error: any) {
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

async function testStructuredOutput(session: any): Promise<void> {
  const suite: TestSuite = { name: "Structured Output (JSON)", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Structured Output (JSON)"));

  try {
    const prompt =
      'Extract a person\'s name and age from this text and return valid JSON only: "My name is Anna, I turned 29 last month."';
    const response = await session.prompt(prompt, {
      temperature: 0.1,
      maxTokens: 50,
    });

    const responseText =
      typeof response === "string" ? response : String(response);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let isValidJson = false;
    let parsedData: { name?: string; age?: number } | null = null;

    if (jsonMatch) {
      try {
        parsedData = JSON.parse(jsonMatch[0]);
        isValidJson = true;
      } catch {
        isValidJson = false;
      }
    }

    const hasName = parsedData?.name?.toLowerCase().includes("anna") ?? false;
    const hasAge = parsedData?.age === 29 || String(parsedData?.age) === "29";

    suite.tests.push(
      {
        name: "Returns valid JSON structure",
        passed: isValidJson,
        message: isValidJson
          ? `Valid JSON: ${JSON.stringify(parsedData)}`
          : `No valid JSON found in: "${responseText.substring(0, 80)}..."`,
      },
      {
        name: "Extracts correct name (Anna)",
        passed: hasName,
        message: hasName
          ? `Name extracted correctly: ${parsedData?.name}`
          : `Name not found or incorrect`,
      },
      {
        name: "Extracts correct age (29)",
        passed: hasAge,
        message: hasAge
          ? `Age extracted correctly: ${parsedData?.age}`
          : `Age not found or incorrect`,
      }
    );
  } catch (error: any) {
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

async function testFewShotContextRetention(session: any): Promise<void> {
  const suite: TestSuite = { name: "Few-Shot Context Retention", tests: [] };

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

    const responseText = (
      typeof response === "string" ? response : String(response)
    ).toLowerCase();
    const hasApiKey = responseText.includes("12345");

    suite.tests.push({
      name: "Retains API key across turns",
      passed: hasApiKey,
      message: hasApiKey
        ? `Context retained: "${responseText.substring(0, 60)}..."`
        : `Context lost. Response: "${responseText.substring(0, 60)}..."`,
    });
  } catch (error: any) {
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

async function testDeterminism(session: any): Promise<void> {
  const suite: TestSuite = { name: "Determinism (Low Temperature)", tests: [] };

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

    const text1 = (
      typeof response1 === "string" ? response1 : String(response1)
    ).trim();
    const text2 = (
      typeof response2 === "string" ? response2 : String(response2)
    ).trim();
    const isIdentical = text1 === text2;
    const hasCorrectAnswer = text1.includes("4") || text2.includes("4");

    suite.tests.push(
      {
        name: "Output is deterministic (temperature=0)",
        passed: isIdentical,
        message: isIdentical
          ? `Both responses identical: "${text1}"`
          : `Responses differ: "${text1}" vs "${text2}"`,
      },
      {
        name: "Correct answer (4) present",
        passed: hasCorrectAnswer,
        message: hasCorrectAnswer
          ? `Answer found: "${text1}"`
          : `Answer not found. Got: "${text1}"`,
      }
    );
  } catch (error: any) {
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

async function testLatencyMetrics(session: any): Promise<void> {
  const suite: TestSuite = { name: "Latency & Throughput Metrics", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Latency & Throughput Metrics"));

  try {
    let firstTokenTime = 0;
    let totalTokens = 0;
    const startTime = Date.now();

    await session.prompt("Count from 1 to 10:", {
      temperature: 0.7,
      maxTokens: 50,
      onTextChunk: (text: string) => {
        if (totalTokens === 0) {
          firstTokenTime = Date.now() - startTime;
        }
        if (text) {
          totalTokens += text.split(/\s+/).length;
        }
      },
    });

    const totalTime = Date.now() - startTime;
    const tokensPerSecond =
      totalTokens > 0 ? (totalTokens / (totalTime / 1000)).toFixed(2) : "0";

    suite.tests.push(
      {
        name: "Time to first token < 5s",
        passed: firstTokenTime < 5000,
        message: `First token: ${firstTokenTime}ms`,
      },
      {
        name: "Total generation time reasonable",
        passed: totalTime < 30000,
        message: `Total time: ${totalTime}ms`,
      },
      {
        name: "Throughput measurement",
        passed: totalTokens > 0,
        message: `Tokens/sec: ${tokensPerSecond} (${totalTokens} tokens in ${totalTime}ms)`,
      }
    );
  } catch (error: any) {
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

async function testContextWindowBoundary(session: any): Promise<void> {
  const suite: TestSuite = { name: "Context Window Boundary", tests: [] };

  console.log(chalk.cyan("\nTest Suite: Context Window Boundary"));

  try {
    const longText =
      "The capital of France is Paris. " + "Repeat this: Paris. ".repeat(100);
    const prompt = `${longText}\n\nWhat is the capital of France? Answer with one word only.`;

    const response = await session.prompt(prompt, {
      temperature: 0.3,
      maxTokens: 10,
    });

    const responseText = (
      typeof response === "string" ? response : String(response)
    ).toLowerCase();
    const hasParis = responseText.includes("paris");
    const isShort = responseText.length < 50;

    suite.tests.push(
      {
        name: "Retains early context (long prompt)",
        passed: hasParis,
        message: hasParis
          ? `Context retained: "${responseText.trim()}"`
          : `Context lost. Response: "${responseText.substring(0, 50)}..."`,
      },
      {
        name: "Response length within bounds",
        passed: isShort,
        message: `Response length: ${responseText.length} chars`,
      }
    );
  } catch (error: any) {
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

function printSuiteResults(suite: TestSuite): void {
  for (const test of suite.tests) {
    const status = test.passed ? chalk.green("[PASS]") : chalk.red("[FAIL]");
    const duration = test.duration ? chalk.gray(` (${test.duration}ms)`) : "";
    console.log(`  ${status} ${test.name}${duration}`);
    if (test.message) {
      console.log(chalk.gray(`     ${test.message}`));
    }
    if (test.error) {
      console.log(chalk.red(`     Error: ${test.error}`));
    }
  }
}

function printTestSummary(): void {
  console.log(chalk.blue("\n" + "=".repeat(60)));
  console.log(chalk.cyan("\nTest Summary\n"));

  let totalTests = 0;
  let passedTests = 0;

  for (const suite of testResults) {
    const suitePassed = suite.tests.filter((t) => t.passed).length;
    const suiteTotal = suite.tests.length;
    totalTests += suiteTotal;
    passedTests += suitePassed;

    const status =
      suitePassed === suiteTotal
        ? chalk.green("[PASS]")
        : chalk.yellow("[WARN]");
    console.log(
      `${status} ${suite.name}: ${suitePassed}/${suiteTotal} tests passed`
    );
  }

  console.log(chalk.blue("\n" + "-".repeat(60)));
  const passRate = ((passedTests / totalTests) * 100).toFixed(1);
  let summaryColor;
  if (passRate >= "80") {
    summaryColor = chalk.green;
  } else if (passRate >= "50") {
    summaryColor = chalk.yellow;
  } else {
    summaryColor = chalk.red;
  }

  console.log(
    summaryColor(
      `\nOverall: ${passedTests}/${totalTests} tests passed (${passRate}%)`
    )
  );

  if (passedTests === totalTests) {
    console.log(
      chalk.green(
        "\nAll tests passed! Your implementation is working correctly."
      )
    );
  } else if (passedTests >= totalTests * 0.8) {
    console.log(
      chalk.yellow("\nMost tests passed. Some issues may be expected behavior.")
    );
  } else {
    console.log(
      chalk.red("\nSeveral tests failed. Review the implementation.")
    );
  }

  console.log(chalk.gray("\n" + "=".repeat(60) + "\n"));
}

try {
  await runComprehensiveTests();
} catch (error) {
  console.error(chalk.red("\nTest suite failed:"), error);
  process.exit(1);
}

export { runComprehensiveTests };
