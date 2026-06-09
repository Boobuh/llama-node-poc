export interface TestResult {
    name: string;
    passed: boolean;
    message: string;
    duration?: number;
    error?: string;
}
export interface TestSuite {
    name: string;
    tests: TestResult[];
}
export type PassRateLevel = "good" | "warn" | "fail";
export interface PassRateSummary {
    passed: number;
    total: number;
    passRate: number;
    level: PassRateLevel;
}
//# sourceMappingURL=test.d.ts.map