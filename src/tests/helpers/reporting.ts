import chalk from "chalk";
import { computePassRateSummary, isMostlyPassing } from "../../utils/pass-rate";
import type { TestResult, TestSuite } from "../../types";

export function printSuiteResults(suite: TestSuite): void {
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

export function printTestSummary(testResults: TestSuite[]): void {
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
  const summary = computePassRateSummary(passedTests, totalTests);
  const passRateText = summary.passRate.toFixed(1);
  const summaryColor =
    summary.level === "good"
      ? chalk.green
      : summary.level === "warn"
        ? chalk.yellow
        : chalk.red;

  console.log(
    summaryColor(
      `\nOverall: ${passedTests}/${totalTests} tests passed (${passRateText}%)`
    )
  );

  if (passedTests === totalTests) {
    console.log(
      chalk.green(
        "\nAll tests passed! Your implementation is working correctly."
      )
    );
  } else if (isMostlyPassing(passedTests, totalTests)) {
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

export function createTestResult(
  partial: Pick<TestResult, "name" | "message"> &
    Partial<Pick<TestResult, "passed" | "duration" | "error">>
): TestResult {
  const result: TestResult = {
    passed: partial.passed ?? false,
    name: partial.name,
    message: partial.message,
  };
  if (partial.duration !== undefined) {
    result.duration = partial.duration;
  }
  if (partial.error !== undefined) {
    result.error = partial.error;
  }
  return result;
}
