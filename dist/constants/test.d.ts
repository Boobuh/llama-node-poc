export declare const TEST_OLLAMA_MODEL = "tinyllama";
export declare const QUICK_TEST_PROMPT = "Say 'Hello, World!' in one sentence.";
export declare const QUICK_TEST_TEMPERATURE = 0.7;
export declare const QUICK_TEST_MAX_TOKENS = 50;
export declare const PROVIDER_TEST_PROMPT = "Say hello in one short sentence.";
export declare const PROVIDER_TEST_TEMPERATURE = 0.3;
export declare const PROVIDER_TEST_MAX_TOKENS = 25;
export declare const TEST_THRESHOLDS: {
    readonly responseTimeMs: 30000;
    readonly firstTokenMs: 5000;
    readonly maxResponseChars: 500;
    readonly maxTokensWordBuffer: 15;
    readonly creativeMinLength: 50;
    readonly passRateGood: 80;
    readonly passRateWarn: 50;
};
export declare const OPTIONAL_PROVIDER_FAIL_HINT = "(optional \u2014 llama-node may not load modern GGUF; use --provider ollama)";
//# sourceMappingURL=test.d.ts.map