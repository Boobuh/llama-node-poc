import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createDefaultConfig } from "../config/defaults";
import { validateConfig } from "../config/validation";
import { getModelRecommendation } from "../config/recommendations";

describe("validateConfig", function () {
  it("accepts default config", function () {
    assert.equal(validateConfig(createDefaultConfig()), true);
  });

  it("rejects empty model path", function () {
    const config = createDefaultConfig();
    config.model.path = "";
    assert.throws(function () {
      validateConfig(config);
    }, /Invalid configuration/);
  });

  it("rejects temperature above 2", function () {
    const config = createDefaultConfig();
    config.generation.temperature = 2.1;
    assert.throws(function () {
      validateConfig(config);
    }, /Invalid configuration/);
  });
});

describe("getModelRecommendation", function () {
  it("returns development recommendation", function () {
    assert.match(getModelRecommendation("development"), /7B/);
  });

  it("returns production recommendation", function () {
    assert.match(getModelRecommendation("production"), /13B/);
  });
});
