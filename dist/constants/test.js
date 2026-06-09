export const TEST_OLLAMA_MODEL = "tinyllama";
export const QUICK_TEST_PROMPT = "Say 'Hello, World!' in one sentence.";
export const QUICK_TEST_TEMPERATURE = 0.7;
export const QUICK_TEST_MAX_TOKENS = 50;
export const PROVIDER_TEST_PROMPT = "Say hello in one short sentence.";
export const PROVIDER_TEST_TEMPERATURE = 0.3;
export const PROVIDER_TEST_MAX_TOKENS = 25;
export const TEST_THRESHOLDS = {
    responseTimeMs: 30000,
    firstTokenMs: 5000,
    maxResponseChars: 500,
    maxTokensWordBuffer: 15,
    creativeMinLength: 50,
    passRateGood: 80,
    passRateWarn: 50,
};
export const OPTIONAL_PROVIDER_FAIL_HINT = "(optional — llama-node may not load modern GGUF; use --provider ollama)";
//# sourceMappingURL=test.js.map