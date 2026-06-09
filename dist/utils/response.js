export function normalizeResponse(response) {
    return typeof response === "string" ? response : String(response);
}
export function countWords(text) {
    return text.split(/\s+/).filter(Boolean).length;
}
export function countSentences(text) {
    return text.split(/[.!?]/).filter((part) => part.trim().length > 0).length;
}
//# sourceMappingURL=response.js.map