/**
 * Advanced example using node-llama-cpp package - TypeScript version
 */
export declare function runNodeLlamaCppExample(): Promise<void>;
/**
 * Advanced utilities for production use
 */
export declare class ProductionUtils {
    /**
     * Validate model compatibility
     */
    static validateModel(modelPath: string): Promise<{
        isValid: boolean;
        errors: string[];
    }>;
    /**
     * Check system requirements
     */
    static checkSystemRequirements(): {
        memoryGB: number;
        recommended: boolean;
        warnings: string[];
    };
}
export default runNodeLlamaCppExample;
//# sourceMappingURL=node-llama-cpp-example.d.ts.map