import { applyEnvironmentOverrides, createDefaultConfig } from "./defaults";
import { getModelRecommendation } from "./recommendations";
import { validateConfig } from "./validation";
export const appConfig = applyEnvironmentOverrides(createDefaultConfig());
export const { model: modelConfig, generation: generationConfig } = appConfig;
export { validateConfig, getModelRecommendation };
export default appConfig;
export { appConfig as config };
//# sourceMappingURL=index.js.map