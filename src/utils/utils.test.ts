import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkInstructionFollowing } from "./assertions";
import {
  parsePersonJson,
  responseContainsApiKey,
  responsesAreIdentical,
} from "./json-assertions";
import {
  countSentences,
  countWords,
  normalizeResponse,
} from "./response";
import { isExitCommand } from "./exit-command";
import { computePassRateSummary } from "./pass-rate";
import { markdownToPlainText } from "./markdown-to-plaintext";

describe("normalizeResponse", () => {
  it("returns strings unchanged", () => {
    assert.equal(normalizeResponse("hello"), "hello");
  });

  it("coerces numbers", () => {
    assert.equal(normalizeResponse(42), "42");
  });
});

describe("countWords", () => {
  it("counts words", () => {
    assert.equal(countWords("one two three"), 3);
  });
});

describe("countSentences", () => {
  it("counts sentences", () => {
    assert.equal(countSentences("Hi. Bye!"), 2);
  });
});

describe("checkInstructionFollowing", () => {
  it("detects exact YES", () => {
    const result = checkInstructionFollowing("yes");
    assert.equal(result.isExact, true);
    assert.equal(result.normalized, "YES");
  });

  it("detects verbose response", () => {
    const result = checkInstructionFollowing("Yes, water is wet.");
    assert.equal(result.isExact, false);
    assert.equal(result.isStrict, false);
  });
});

describe("parsePersonJson", () => {
  it("parses embedded JSON", () => {
    const result = parsePersonJson('Here: {"name":"Anna","age":29}');
    assert.equal(result.isValidJson, true);
    assert.equal(result.hasName, true);
    assert.equal(result.hasAge, true);
  });
});

describe("responseContainsApiKey", () => {
  it("finds key in response", () => {
    assert.equal(responseContainsApiKey("Your key is 12345", "12345"), true);
  });
});

describe("responsesAreIdentical", () => {
  it("compares trimmed responses", () => {
    assert.equal(responsesAreIdentical(" 4 ", "4"), true);
  });
});

describe("isExitCommand", () => {
  it("matches exit commands case-insensitively", () => {
    assert.equal(isExitCommand("EXIT", ["exit", "quit"]), true);
    assert.equal(isExitCommand("hello", ["exit"]), false);
  });
});

describe("computePassRateSummary", () => {
  it("marks 80% as good", () => {
    assert.equal(computePassRateSummary(8, 10).level, "good");
  });

  it("marks 50% as warn", () => {
    assert.equal(computePassRateSummary(5, 10).level, "warn");
  });
});

describe("markdownToPlainText", () => {
  it("uppercases h1 headings", () => {
    assert.match(markdownToPlainText("# Title\n\nBody"), /^TITLE/m);
  });

  it("converts markdown links", () => {
    assert.match(
      markdownToPlainText("[Docs](https://example.com)"),
      /Docs \(https:\/\/example.com\)/
    );
  });
});
