export function checkInstructionFollowing(response) {
    const normalized = normalizeYesNo(response);
    return {
        normalized,
        isExact: normalized === "YES" || normalized === "NO",
        isStrict: normalized.length <= 5 &&
            (normalized.includes("YES") || normalized.includes("NO")),
    };
}
function normalizeYesNo(response) {
    return (typeof response === "string" ? response : String(response))
        .toUpperCase()
        .trim();
}
//# sourceMappingURL=assertions.js.map