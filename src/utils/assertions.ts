import type { InstructionFollowingResult } from "../types";

export function checkInstructionFollowing(
  response: unknown
): InstructionFollowingResult {
  const normalized = normalizeYesNo(response);

  return {
    normalized,
    isExact: normalized === "YES" || normalized === "NO",
    isStrict:
      normalized.length <= 5 &&
      (normalized.includes("YES") || normalized.includes("NO")),
  };
}

function normalizeYesNo(response: unknown): string {
  return (typeof response === "string" ? response : String(response))
    .toUpperCase()
    .trim();
}
