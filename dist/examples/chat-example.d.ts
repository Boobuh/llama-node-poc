import type { ChatMessage } from "../types";
/**
 * Interactive chat example using llama-node package - TypeScript version
 */
export declare function runChatExample(options?: {
    temperature?: number;
    maxTokens?: number;
}): Promise<void>;
/**
 * Utilities for chat functionality
 */
export declare class ChatUtils {
    /**
     * Format chat message for display
     */
    static formatMessage(message: ChatMessage, index: number): string;
    /**
     * Get conversation summary
     */
    static getConversationSummary(history: ChatMessage[]): string;
    /**
     * Validate message input
     */
    static validateInput(input: string): {
        isValid: boolean;
        error?: string;
    };
}
export default runChatExample;
//# sourceMappingURL=chat-example.d.ts.map