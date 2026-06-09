export class LlamaError extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = "LlamaError";
        this.code = code;
        this.details = details;
    }
}
//# sourceMappingURL=errors.js.map