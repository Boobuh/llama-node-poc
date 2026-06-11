function formatSingleExample(ex, index) {
    return `ПРИКЛАД ${index + 1}: ${ex.category}

Запит:
${ex.prompt}

Параметри:
- Temperature: ${ex.temperature ?? 0.7}
- Max Tokens: ${ex.maxTokens ?? 200}

Відповідь:
${ex.response}

${"=".repeat(60)}`;
}
export function formatArticleExamplesOutput(examples, header) {
    const sections = [];
    for (let index = 0; index < examples.length; index++) {
        sections.push(formatSingleExample(examples[index], index));
    }
    const body = sections.join("\n\n");
    return `${header}

${"=".repeat(60)}

${body}

---

Примітки:
- Приклади згенеровані через provider abstraction на Node.js
- Temperature впливає на креативність відповідей
- MaxTokens обмежує довжину відповіді
`;
}
//# sourceMappingURL=format-examples-output.js.map