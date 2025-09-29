import type { AppConfig } from "./types";
/**
 * Configuration file for Llama Node.js POC - TypeScript version
 */
export declare const appConfig: AppConfig;
export declare const modelConfig: import("./types").ModelConfig, generationConfig: import("./types").GenerationConfig;
export declare function validateConfig(checkConfig: AppConfig): boolean;
export declare function getModelRecommendation(useCase: "development" | "production" | "high-quality"): string;
export default appConfig;
export { appConfig as config };
//# sourceMappingURL=config.d.ts.map