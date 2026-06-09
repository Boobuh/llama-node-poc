import { normalizeResponse } from "./response";
export function parsePersonJson(response) {
    const responseText = normalizeResponse(response);
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    let isValidJson = false;
    let parsed = null;
    if (jsonMatch) {
        try {
            parsed = JSON.parse(jsonMatch[0]);
            isValidJson = true;
        }
        catch {
            isValidJson = false;
        }
    }
    const hasName = parsed?.name?.toLowerCase().includes("anna") ?? false;
    const hasAge = parsed?.age === 29 || String(parsed?.age) === "29";
    return { isValidJson, parsed, hasName, hasAge };
}
export function responseContainsApiKey(response, key) {
    return normalizeResponse(response).toLowerCase().includes(key);
}
export function responsesAreIdentical(a, b) {
    return normalizeResponse(a).trim() === normalizeResponse(b).trim();
}
//# sourceMappingURL=json-assertions.js.map