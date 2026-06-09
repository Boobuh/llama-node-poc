import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createDefaultConfig } from "../config/defaults";
import { validateConfig } from "../config/validation";
import { getModelRecommendation } from "../config/recommendations";

describe("validateConfig", () => {
  it("accepts default config", () => {
    assert.equal(validateConfig(createDefaultConfig()), true);
  });

  it("rejects empty model path", () => {
    const config = createDefaultConfig();
    config.model.path = "";
    assert.throws(() => validateConfig(config), /Invalid configuration/);
  });

  it("rejects temperature above 2", () => {
    const config = createDefaultConfig();
    config.generation.temperature = 2.1;
    assert.throws(() => validateConfig(config), /Invalid configuration/);
  });
});

describe("getModelRecommendation", () => {
  it("returns development recommendation", () => {
    assert.match(getModelRecommendation("development"), /7B/);
  });

  it("returns production recommendation", () => {
    assert.match(getModelRecommendation("production"), /13B/);
  });
});
