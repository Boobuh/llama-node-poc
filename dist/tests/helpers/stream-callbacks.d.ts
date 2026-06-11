export interface StreamingDotState {
    streamedTokens: number;
}
export interface LatencyStreamState {
    firstTokenTime: number;
    totalTokens: number;
    startTime: number;
}
export declare function createStreamingDotHandler(state: StreamingDotState): (text: string) => void;
export declare function createLatencyStreamHandler(state: LatencyStreamState): (text: string) => void;
//# sourceMappingURL=stream-callbacks.d.ts.map