import type { StreamCallback } from "../types/index.js";
/**
 * Streaming response example using llama-node package - TypeScript version
 */
export declare function runStreamingExample(options?: {
    temperature?: number;
    maxTokens?: number;
}): Promise<void>;
/**
 * Streaming utilities and helpers
 */
export declare class StreamingUtils {
    /**
     * Create a formatted streaming callback with colors
     */
    static createColoredCallback(color?: "green" | "blue" | "red" | "yellow" | "cyan"): StreamCallback;
    /**
     * Monitor streaming performance
     */
    static createMonitoredCallback(): {
        callback: StreamCallback;
        stats: {
            tokensReceived: number;
            startTime: number;
        };
    };
    /**
     * Display streaming statistics
     */
    static displayStats(stats: {
        tokensReceived: number;
        startTime: number;
    }): void;
}
export default runStreamingExample;
//# sourceMappingURL=streaming-example.d.ts.map