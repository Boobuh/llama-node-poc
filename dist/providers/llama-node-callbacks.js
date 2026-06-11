export function noopLlamaNodeCallback() { }
export function createLlamaNodeStreamCallback(options, state) {
    function handleLlamaNodeStreamToken(data) {
        if (data.token) {
            state.full += data.token;
            if (options.onTextChunk) {
                options.onTextChunk(data.token);
            }
        }
    }
    return handleLlamaNodeStreamToken;
}
//# sourceMappingURL=llama-node-callbacks.js.map