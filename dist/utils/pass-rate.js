import { TEST_THRESHOLDS } from "../constants";
export function computePassRateSummary(passed, total) {
    const passRate = total > 0 ? (passed / total) * 100 : 0;
    let level = "fail";
    if (passRate >= TEST_THRESHOLDS.passRateGood) {
        level = "good";
    }
    else if (passRate >= TEST_THRESHOLDS.passRateWarn) {
        level = "warn";
    }
    return { passed, total, passRate, level };
}
export function isMostlyPassing(passed, total) {
    return passed >= total * (TEST_THRESHOLDS.passRateGood / 100);
}
//# sourceMappingURL=pass-rate.js.map