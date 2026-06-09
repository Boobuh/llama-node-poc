import { CONFIG_LIMITS } from "../constants";
import type { AppConfig } from "../types";

export function validateConfig(checkConfig: AppConfig): boolean {
  const { model, generation } = checkConfig;
  const { temperatureMin, temperatureMax, topPMin, topPMax } = CONFIG_LIMITS;

  const isValid =
    model.path.length > 0 &&
    model.contextLength > 0 &&
    model.batchSize > 0 &&
    model.threads > 0 &&
    generation.temperature >= temperatureMin &&
    generation.temperature <= temperatureMax &&
    generation.maxTokens > 0 &&
    generation.topP >= topPMin &&
    generation.topP <= topPMax &&
    generation.topK > 0 &&
    generation.repeatPenalty >= 0;

  if (!isValid) {
    throw new Error("Invalid configuration detected");
  }

  return true;
}
