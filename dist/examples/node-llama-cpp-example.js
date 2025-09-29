"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showNodeLlamaCppInfo = showNodeLlamaCppInfo;
const chalk_1 = __importDefault(require("chalk"));
// Currently disabled to avoid dependency conflicts
function showNodeLlamaCppInfo() {
    console.log(chalk_1.default.yellow("📦 Node-llama-cpp Example"));
    console.log(chalk_1.default.gray("This example requires the node-llama-cpp package"));
    console.log(chalk_1.default.gray("Install with: npm install node-llama-cpp"));
    console.log(chalk_1.default.cyan("\nFeatures:"));
    console.log(chalk_1.default.gray("• Advanced model management"));
    console.log(chalk_1.default.gray("• GPU acceleration support"));
    console.log(chalk_1.default.gray("• Custom tokenization"));
    console.log(chalk_1.default.gray("• Performance optimizations"));
}
//# sourceMappingURL=node-llama-cpp-example.js.map