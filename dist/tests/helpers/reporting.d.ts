import type { TestResult, TestSuite } from "../../types";
export declare function printSuiteResults(suite: TestSuite): void;
export declare function printTestSummary(testResults: TestSuite[]): void;
export declare function createTestResult(partial: Pick<TestResult, "name" | "message"> & Partial<Pick<TestResult, "passed" | "duration" | "error">>): TestResult;
//# sourceMappingURL=reporting.d.ts.map