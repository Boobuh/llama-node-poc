export function normalizeResponse(response: unknown): string {
  return typeof response === "string" ? response : String(response);
}

export function countWords(text: string): number {
  const parts = text.split(/\s+/);
  let count = 0;
  for (const part of parts) {
    if (part) {
      count++;
    }
  }
  return count;
}

export function countSentences(text: string): number {
  const parts = text.split(/[.!?]/);
  let count = 0;
  for (const part of parts) {
    if (part.trim().length > 0) {
      count++;
    }
  }
  return count;
}

export function countPassedTests(
  tests: ReadonlyArray<{ passed: boolean }>
): number {
  let count = 0;
  for (const test of tests) {
    if (test.passed) {
      count++;
    }
  }
  return count;
}
