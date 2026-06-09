export function resolvePromptOptions(options, generation) {
    return {
        temperature: options.temperature ?? generation.temperature,
        maxTokens: options.maxTokens ?? generation.maxTokens,
        topP: options.topP ?? generation.topP,
        topK: options.topK ?? generation.topK,
    };
}
//# sourceMappingURL=resolve-prompt-options.js.map