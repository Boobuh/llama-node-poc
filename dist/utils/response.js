export function normalizeResponse(response) {
    return typeof response === "string" ? response : String(response);
}
export function countWords(text) {
    const parts = text.split(/\s+/);
    let count = 0;
    for (const part of parts) {
        if (part) {
            count++;
        }
    }
    return count;
}
export function countSentences(text) {
    const parts = text.split(/[.!?]/);
    let count = 0;
    for (const part of parts) {
        if (part.trim().length > 0) {
            count++;
        }
    }
    return count;
}
export function countPassedTests(tests) {
    let count = 0;
    for (const test of tests) {
        if (test.passed) {
            count++;
        }
    }
    return count;
}
//# sourceMappingURL=response.js.map