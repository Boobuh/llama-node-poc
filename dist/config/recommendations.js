const RECOMMENDATIONS = {
    development: "Llama-2-7B-Chat (~4GB) - Great for development & testing",
    production: "Llama-2-13B-Chat (~7GB) - Balanced for production use",
    "high-quality": "Llama-2-70B-Chat (~40GB) - Maximum quality (high resource needs)",
};
const DEFAULT_RECOMMENDATION = "Llama-2-7B-Chat (~4GB) - Default recommendation";
export function getModelRecommendation(useCase) {
    return RECOMMENDATIONS[useCase] ?? DEFAULT_RECOMMENDATION;
}
//# sourceMappingURL=recommendations.js.map