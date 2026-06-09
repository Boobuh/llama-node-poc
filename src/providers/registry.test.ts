import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseProvider, getProvider } from "../providers/registry";

describe("parseProvider", () => {
  it("defaults to ollama", () => {
    assert.equal(parseProvider(), "ollama");
  });

  it("accepts llama-node", () => {
    assert.equal(parseProvider("llama-node"), "llama-node");
  });

  it("rejects unknown provider", () => {
    assert.throws(() => parseProvider("unknown"), /Unknown provider/);
  });
});

describe("getProvider", () => {
  it("returns ollama adapter", () => {
    assert.equal(getProvider("ollama").id, "ollama");
  });

  it("throws for invalid id", () => {
    assert.throws(
      () => getProvider("invalid" as "ollama"),
      /Unknown provider/
    );
  });
});
