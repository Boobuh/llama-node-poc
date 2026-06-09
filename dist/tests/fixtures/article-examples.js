export const ARTICLE_EXAMPLE_DEFINITIONS = [
    {
        category: "Instruction Following",
        prompt: 'Відповідай ТІЛЬКИ "ТАК" або "НІ". Чи вода мокра?',
        temperature: 0.1,
        maxTokens: 10,
    },
    {
        category: "Structured Output (JSON)",
        prompt: 'Витягни ім\'я та вік із тексту та поверни тільки валідний JSON: "Мене звати Анна, мені виповнилося 29 минулого місяця."',
        temperature: 0.1,
        maxTokens: 50,
    },
    {
        category: "Math Reasoning",
        prompt: "2+2=",
        temperature: 0,
        maxTokens: 10,
    },
    {
        category: "Context Retention",
        prompt: "Який мій API ключ?",
        temperature: 0.3,
        maxTokens: 20,
        contextSetup: "Мій API ключ — 12345. Запам'ятай це.",
    },
    {
        category: "Code Generation",
        prompt: "Напиши JavaScript функцію, яка перевертає рядок. Тільки код, без пояснень.",
        temperature: 0.3,
        maxTokens: 100,
    },
    {
        category: "Creative Text",
        prompt: "Розкажи коротку історію про робота, який відкриває емоції (3 речення).",
        temperature: 0.8,
        maxTokens: 150,
    },
    {
        category: "Summarization",
        prompt: "Підсумуй цей текст одним реченням:\nШтучний інтелект (AI) — це інтелект, який демонструють машини, на відміну від природного інтелекту людей та тварин.",
        temperature: 0.4,
        maxTokens: 80,
    },
    {
        category: "Language Understanding",
        prompt: "Поясни, чому небо синє, одним реченням.",
        temperature: 0.3,
        maxTokens: 60,
    },
];
//# sourceMappingURL=article-examples.js.map