import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseProvider, getProvider } from "../providers/registry";

describe("parseProvider", function () {
  it("defaults to ollama", function () {
    assert.equal(parseProvider(), "ollama");
  });

  it("accepts llama-node", function () {
    assert.equal(parseProvider("llama-node"), "llama-node");
  });

  it("rejects unknown provider", function () {
    assert.throws(function () {
      parseProvider("unknown");
    }, /Unknown provider/);
  });
});

describe("getProvider", function () {
  it("returns ollama adapter", function () {
    assert.equal(getProvider("ollama").id, "ollama");
  });

  it("throws for invalid id", function () {
    assert.throws(
      function () {
        getProvider("invalid" as "ollama");
      },
      /Unknown provider/
    );
  });
});
