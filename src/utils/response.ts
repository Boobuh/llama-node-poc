export function normalizeResponse(response: unknown): string {
  return typeof response === "string" ? response : String(response);
}

export function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function countSentences(text: string): number {
  return text.split(/[.!?]/).filter((part) => part.trim().length > 0).length;
}
