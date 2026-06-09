import { TEST_THRESHOLDS } from "../constants";
import type { PassRateLevel, PassRateSummary } from "../types";

export function computePassRateSummary(
  passed: number,
  total: number
): PassRateSummary {
  const passRate = total > 0 ? (passed / total) * 100 : 0;
  let level: PassRateLevel = "fail";

  if (passRate >= TEST_THRESHOLDS.passRateGood) {
    level = "good";
  } else if (passRate >= TEST_THRESHOLDS.passRateWarn) {
    level = "warn";
  }

  return { passed, total, passRate, level };
}

export function isMostlyPassing(passed: number, total: number): boolean {
  return passed >= total * (TEST_THRESHOLDS.passRateGood / 100);
}
