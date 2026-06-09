import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createDefaultConfig } from "../config/defaults";
import {
  buildGenerationConfig,
  resolveProviderId,
} from "../examples/shared";

describe("resolveProviderId", () => {
  it("uses config default", () => {
    assert.equal(resolveProviderId(), createDefaultConfig().defaultProvider);
  });

  it("parses explicit provider", () => {
    assert.equal(resolveProviderId("llama-node"), "llama-node");
  });
});

describe("buildGenerationConfig", () => {
  it("merges options with defaults", () => {
    const config = buildGenerationConfig({ temperature: 0.5, maxTokens: 100 });
    assert.equal(config.temperature, 0.5);
    assert.equal(config.maxTokens, 100);
    assert.equal(typeof config.topP, "number");
  });
});
