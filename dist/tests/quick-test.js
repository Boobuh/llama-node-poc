"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickTest = quickTest;
const chalk_1 = __importDefault(require("chalk"));
const config_1 = require("../config");
const llamaNode = require("llama-node");
const fs = require("fs");
async function quickTest() {
    console.log(chalk_1.default.blue("\n⚡ Quick Connectivity Test\n"));
    const modelPath = config_1.config.model.path;
    if (!fs.existsSync(modelPath)) {
        console.log(chalk_1.default.red("❌ Model file not found!"));
        console.log(chalk_1.default.yellow(`\nModel Path: ${modelPath}`));
        console.log(chalk_1.default.gray("\nPlease download a model first."));
        process.exit(1);
    }
    try {
        console.log(chalk_1.default.green("⚙️ Loading model..."));
        const Llama = llamaNode.LlamaApi;
        const api = new Llama(modelPath);
        console.log(chalk_1.default.green("✅ Model loaded!\n"));
        console.log(chalk_1.default.cyan("Testing basic response..."));
        const startTime = Date.now();
        const response = await api.generate("Say 'Hello, World!' in one sentence.", {
            temperature: 0.7,
            maxTokens: 50,
        });
        const duration = Date.now() - startTime;
        const responseText = response.text || response.toString();
        console.log(chalk_1.default.green("\n✅ Response received:"));
        console.log(chalk_1.default.white(`"${responseText}"`));
        console.log(chalk_1.default.gray(`\n⏱️ Generated in ${duration}ms`));
        if (responseText.length > 0) {
            console.log(chalk_1.default.green("\n🎉 Basic connectivity test PASSED!"));
            console.log(chalk_1.default.cyan("\nRun 'npm test' for comprehensive test suite."));
        }
        else {
            console.log(chalk_1.default.red("\n❌ Empty response received"));
        }
    }
    catch (error) {
        console.error(chalk_1.default.red("\n❌ Test failed:"), error.message);
        process.exit(1);
    }
}
if (require.main === module) {
    quickTest().catch((error) => {
        console.error(chalk_1.default.red("\n❌ Fatal error:"), error);
        process.exit(1);
    });
}
//# sourceMappingURL=quick-test.js.map