import { config } from "../../config";
import { TEST_OLLAMA_MODEL } from "../../constants";
export function applyTestOllamaModel() {
    var _a;
    (_a = process.env).OLLAMA_MODEL ?? (_a.OLLAMA_MODEL = TEST_OLLAMA_MODEL);
    config.ollama.model = process.env.OLLAMA_MODEL;
}
export function prepareTestProvider(providerId) {
    if (providerId === "ollama") {
        applyTestOllamaModel();
    }
}
//# sourceMappingURL=setup-test-provider.js.map