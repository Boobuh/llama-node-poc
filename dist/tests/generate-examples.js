import { getLlama, LlamaChatSession } from "node-llama-cpp";
import fs from "node:fs";
import { config } from "../config";
async function generateExamples() {
    console.log("Loading model for example generation...\n");
    const llama = await getLlama();
    const model = await llama.loadModel({
        modelPath: config.model.path,
    });
    const context = await model.createContext();
    const session = new LlamaChatSession({
        contextSequence: context.getSequence(),
    });
    const examples = [];
    console.log("=== Generating examples ===\n");
    try {
        console.log("1. Instruction Following (Compliance)...");
        const r1 = await session.prompt('Відповідай ТІЛЬКИ "ТАК" або "НІ". Чи вода мокра?', { temperature: 0.1, maxTokens: 10 });
        examples.push({
            category: "Instruction Following",
            prompt: 'Відповідай ТІЛЬКИ "ТАК" або "НІ". Чи вода мокра?',
            response: r1,
            temperature: 0.1,
            maxTokens: 10,
        });
        console.log("   Done\n");
        console.log("2. JSON Structured Output...");
        const r2 = await session.prompt('Витягни ім\'я та вік із тексту та поверни тільки валідний JSON: "Мене звати Анна, мені виповнилося 29 минулого місяця."', { temperature: 0.1, maxTokens: 50 });
        examples.push({
            category: "Structured Output (JSON)",
            prompt: 'Витягни ім\'я та вік із тексту та поверни тільки валідний JSON: "Мене звати Анна, мені виповнилося 29 минулого місяця."',
            response: r2,
            temperature: 0.1,
            maxTokens: 50,
        });
        console.log("   Done\n");
        console.log("3. Simple Math...");
        const r3 = await session.prompt("2+2=", {
            temperature: 0,
            maxTokens: 10,
        });
        examples.push({
            category: "Math Reasoning",
            prompt: "2+2=",
            response: r3,
            temperature: 0,
            maxTokens: 10,
        });
        console.log("   Done\n");
        console.log("4. Context Retention...");
        await session.prompt("Мій API ключ — 12345. Запам'ятай це.", {
            temperature: 0.3,
            maxTokens: 20,
        });
        const r4 = await session.prompt("Який мій API ключ?", {
            temperature: 0.3,
            maxTokens: 20,
        });
        examples.push({
            category: "Context Retention",
            prompt: "Який мій API ключ? (після попереднього повідомлення про ключ 12345)",
            response: r4,
            temperature: 0.3,
            maxTokens: 20,
        });
        console.log("   Done\n");
        console.log("5. Code Generation...");
        const r5 = await session.prompt("Напиши JavaScript функцію, яка перевертає рядок. Тільки код, без пояснень.", { temperature: 0.3, maxTokens: 100 });
        examples.push({
            category: "Code Generation",
            prompt: "Напиши JavaScript функцію, яка перевертає рядок. Тільки код, без пояснень.",
            response: r5,
            temperature: 0.3,
            maxTokens: 100,
        });
        console.log("   Done\n");
        console.log("6. Creative Text...");
        const r6 = await session.prompt("Розкажи коротку історію про робота, який відкриває емоції (3 речення).", { temperature: 0.8, maxTokens: 150 });
        examples.push({
            category: "Creative Text",
            prompt: "Розкажи коротку історію про робота, який відкриває емоції (3 речення).",
            response: r6,
            temperature: 0.8,
            maxTokens: 150,
        });
        console.log("   Done\n");
        console.log("7. Summarization...");
        const longText = "Штучний інтелект (AI) — це інтелект, який демонструють машини, на відміну від природного інтелекту, який демонструють люди та тварини. Провідні підручники з AI визначають поле як вивчення 'інтелектуальних агентів': будь-якого пристрою, який сприймає своє середовище і вживає дій, які максимізують його шанси досягти своїх цілей.";
        const r7 = await session.prompt(`Підсумуй цей текст одним реченням: ${longText}`, { temperature: 0.4, maxTokens: 80 });
        examples.push({
            category: "Summarization",
            prompt: `Підсумуй цей текст одним реченням: ${longText}`,
            response: r7,
            temperature: 0.4,
            maxTokens: 80,
        });
        console.log("   Done\n");
        console.log("8. Language Understanding...");
        const r8 = await session.prompt("Поясни, чому небо синє, одним реченням.", { temperature: 0.3, maxTokens: 60 });
        examples.push({
            category: "Language Understanding",
            prompt: "Поясни, чому небо синє, одним реченням.",
            response: r8,
            temperature: 0.3,
            maxTokens: 60,
        });
        console.log("   Done\n");
        console.log("\n=== Generating output file ===\n");
        const output = examples
            .map((ex, idx) => {
            return `ПРИКЛАД ${idx + 1}: ${ex.category}

Запит:
${ex.prompt}

Параметри:
- Temperature: ${ex.temperature ?? 0.7}
- Max Tokens: ${ex.maxTokens ?? 200}

Відповідь:
${ex.response}

${"=".repeat(60)}`;
        })
            .join("\n\n");
        const fullOutput = `ПРИКЛАДИ ЗАПИТІВ ТА ВІДПОВІДЕЙ LLAMA-2-7B-CHAT

Ці приклади згенеровані на реальній моделі Llama-2-7B-Chat через node-llama-cpp.

${"=".repeat(60)}

${output}

---

Примітки:
- Всі приклади згенеровані на моделі Llama-2-7B-Chat (3.9GB, Q4_K_M)
- Час генерації: ~5-15 секунд на приклад
- Модель працює локально без API-ключів
- Temperature впливає на креативність відповідей
- MaxTokens обмежує довжину відповіді
`;
        fs.writeFileSync("EXAMPLES_OUTPUT.txt", fullOutput, "utf-8");
        console.log("✅ Examples saved to EXAMPLES_OUTPUT.txt\n");
        console.log("Summary:");
        examples.forEach((ex, idx) => {
            console.log(`${idx + 1}. ${ex.category}: ${ex.response.substring(0, 60)}...`);
        });
    }
    catch (error) {
        console.error("Error generating examples:", error);
        process.exit(1);
    }
}
generateExamples().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
});
//# sourceMappingURL=generate-examples.js.map