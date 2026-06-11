import chalk from "chalk";
export function createStreamingDotHandler(state) {
    function handleStreamingDot(text) {
        if (text) {
            state.streamedTokens++;
            process.stdout.write(chalk.gray("."));
        }
    }
    return handleStreamingDot;
}
export function createLatencyStreamHandler(state) {
    function handleLatencyStream(text) {
        if (state.totalTokens === 0) {
            state.firstTokenTime = Date.now() - state.startTime;
        }
        if (text) {
            state.totalTokens += text.split(/\s+/).length;
        }
    }
    return handleLatencyStream;
}
//# sourceMappingURL=stream-callbacks.js.map