/**
 * TypeScript type definitions for Llama Node.js POC
 */
export class LlamaError extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = "LlamaError";
        this.code = code;
        this.details = details;
    }
}
export * from "./index";
//# sourceMappingURL=index.js.map