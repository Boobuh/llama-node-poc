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

describe("normalizeResponse", function () {
  it("returns strings unchanged", function () {
    assert.equal(normalizeResponse("hello"), "hello");
  });

  it("coerces numbers", function () {
    assert.equal(normalizeResponse(42), "42");
  });
});

describe("countWords", function () {
  it("counts words", function () {
    assert.equal(countWords("one two three"), 3);
  });
});

describe("countSentences", function () {
  it("counts sentences", function () {
    assert.equal(countSentences("Hi. Bye!"), 2);
  });
});

describe("checkInstructionFollowing", function () {
  it("detects exact YES", function () {
    const result = checkInstructionFollowing("yes");
    assert.equal(result.isExact, true);
    assert.equal(result.normalized, "YES");
  });

  it("detects verbose response", function () {
    const result = checkInstructionFollowing("Yes, water is wet.");
    assert.equal(result.isExact, false);
    assert.equal(result.isStrict, false);
  });
});

describe("parsePersonJson", function () {
  it("parses embedded JSON", function () {
    const result = parsePersonJson('Here: {"name":"Anna","age":29}');
    assert.equal(result.isValidJson, true);
    assert.equal(result.hasName, true);
    assert.equal(result.hasAge, true);
  });
});

describe("responseContainsApiKey", function () {
  it("finds key in response", function () {
    assert.equal(responseContainsApiKey("Your key is 12345", "12345"), true);
  });
});

describe("responsesAreIdentical", function () {
  it("compares trimmed responses", function () {
    assert.equal(responsesAreIdentical(" 4 ", "4"), true);
  });
});

describe("isExitCommand", function () {
  it("matches exit commands case-insensitively", function () {
    assert.equal(isExitCommand("EXIT", ["exit", "quit"]), true);
    assert.equal(isExitCommand("hello", ["exit"]), false);
  });
});

describe("computePassRateSummary", function () {
  it("marks 80% as good", function () {
    assert.equal(computePassRateSummary(8, 10).level, "good");
  });

  it("marks 50% as warn", function () {
    assert.equal(computePassRateSummary(5, 10).level, "warn");
  });
});

describe("markdownToPlainText", function () {
  it("uppercases h1 headings", function () {
    assert.match(markdownToPlainText("# Title\n\nBody"), /^TITLE/m);
  });

  it("converts markdown links", function () {
    assert.match(
      markdownToPlainText("[Docs](https://example.com)"),
      /Docs \(https:\/\/example.com\)/
    );
  });
});
