import type { ParsedPersonJson, StructuredJsonResult } from "../types";
import { normalizeResponse } from "./response";

export function parsePersonJson(response: unknown): StructuredJsonResult {
  const responseText = normalizeResponse(response);
  const jsonMatch = responseText.match(/\{[\s\S]*\}/);
  let isValidJson = false;
  let parsed: ParsedPersonJson | null = null;

  if (jsonMatch) {
    try {
      parsed = JSON.parse(jsonMatch[0]) as ParsedPersonJson;
      isValidJson = true;
    } catch {
      isValidJson = false;
    }
  }

  const hasName = parsed?.name?.toLowerCase().includes("anna") ?? false;
  const hasAge = parsed?.age === 29 || String(parsed?.age) === "29";

  return { isValidJson, parsed, hasName, hasAge };
}

export function responseContainsApiKey(response: unknown, key: string): boolean {
  return normalizeResponse(response).toLowerCase().includes(key);
}

export function responsesAreIdentical(a: unknown, b: unknown): boolean {
  return normalizeResponse(a).trim() === normalizeResponse(b).trim();
}
