#!/usr/bin/env node
/**
 * One-off transform: DOU editorial voice for UKRAINIAN_PUBLICATION.md
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(ROOT, "docs/dou/UKRAINIAN_PUBLICATION_DRAFT.md");
let t = readFileSync(FILE, "utf8");

// Remove duplicate GitHub URLs (keep plain name); single link restored at end
t = t.replace(/\[llama-node-poc\]\(https:\/\/github\.com\/Boobuh\/llama-node-poc[^)]*\)/g, "pet-проєкт **llama-node-poc**");
t = t.replace(/\[Boobuh\/llama-node-poc\]\(https:\/\/github\.com\/Boobuh\/llama-node-poc[^)]*\)/g, "**llama-node-poc**");
t = t.replace(/https:\/\/github\.com\/Boobuh\/llama-node-poc\/pull\/1/g, "PR з експериментом (у репозиторії)");
t = t.replace(/https:\/\/github\.com\/Boobuh\/llama-node-poc\.git/g, "git@…/llama-node-poc.git");
t = t.replace(/git clone https:\/\/github\.com\/Boobuh\/llama-node-poc\.git/g, "git clone <url-репозиторію з профілю автора>");

const intro = `# Як використовувати Llama з Node.js: Ollama та llama-node

## Про автора і для кого ця стаття

Мене звати **Oleh Helei**, я Node.js/TypeScript-розробник. Цей текст я готую **вперше для публікації на DOU** — це мій особистий досвід, а не переклад офіційної документації.

Стаття буде корисна, якщо ви:

- хочете **локально** запустити Llama з Node.js без C++ у своєму застосунку;
- плутаєте **Ollama server** і npm-пакет \`ollama\`;
- шукаєте практичні кроки: install → перший запит → тести → «навчити» модель через Modelfile.

Я описую шлях, який сам пройшов у серпні 2026 на Node.js v22, \`ollama@0.6.3\` і pet-проєкті **llama-node-poc**. Код з репозиторію — лише **додаток** до статті; усе необхідне для старту є нижче в тексті.

## Вступ

Кілька тижнів тому я з нуля збирав стек **Llama + Node.js** і швидко зрозумів: найменше болі дає **Ollama** (окремий сервер) + npm \`ollama\` (HTTP-клієнт). In-process **llama-node** з GGUF лишив для порівняння — там інші обмеження.

У статті розповім:

1. Як я встановлював **Ollama** і викликав модель з Node.js.
2. Чому **llama-node** сьогодні радше legacy для досліджень.
3. Як я зібрав **regression suite** і навіщо він потрібен для LLM backend.

| Підхід         | npm-пакет    | Що потрібно                            |
| -------------- | ------------ | -------------------------------------- |
| **Ollama**     | \`ollama\`     | Ollama server + \`ollama pull llama3.2\` |
| **llama-node** | \`llama-node\` | Локальний \`.gguf\` файл (legacy)        |

> **Перевірив особисто:** серпень 2026 — \`ollama@0.6.3\`, \`llama-node@0.1.6\`, Node.js v22 на Linux.

`;

t = t.replace(/^# Як використовувати Llama[\s\S]*?^## Початок з нуля/m, intro + "## Початок з нуля");

// Voice: common handbook → first person (narrative bridges only)
const reps = [
  [/Ця стаття показує[^]*?репозиторію\.\n\n/g, ""],
  [/Ви дізнаєтесь:[\s\S]*?llama-node-poc\.\n\n/g, ""],
  [/\*\*Висновок:\*\* для нових проєктів у 2026 році обирайте/g, "**Мій висновок:** для нових проєктів у 2026 році я обираю"],
  [/Нижче — типові сценарії/g, "Нижче — сценарії, які я використовую"],
  [/У \[llama-node-poc\][^\n]+зібрано/g, "У моєму pet-проєкті я зібрав"],
  [/Ми перевірили/g, "Я перевірив"],
  [/У POC regression suite/g, "У моєму regression suite"],
  [/Для більшості backend POC достатньо/g, "Для мого backend POC вистачило"],
  [/Якщо хочете побачити готовий CLI/g, "Якщо цікаво подивитися, як у мене виглядає CLI"],
  [/Команди \*\*лише в цьому POC\*\*/g, "Команди **з мого POC**"],
  [/У власному проєкті достатньо/g, "У новому проєкті достатньо"],
  [/Якщо потрібен готовий POC/g, "Якщо цікава готова структура мого POC"],
  [/Очікування:/g, "У мене вийшло так:"],
  [/Перед Node.js можна одразу/g, "Спочатку я перевіряю в терміналі — без npm"],
  [/Для якіснішої відповіді використовуйте/g, "Для якіснішої відповіді я перемикаюся на"],
  [/Мінімум для \*\*тільки тестів\*\* POC:/g, "Мінімум для **тільки тестів** у моєму POC:"],
  [/Node\.js \*\*не\*\* завантажує модель сам/g, "Node.js **не** завантажує модель сам — я це перевірив"],
  [/назва моделі в коді .* має збігатися/g, "назва моделі в коді має збігатися"],
  [/Запустіть сервер:/g, "Я запускаю сервер:"],
  [/Перезапустіть термінал/g, "Я перезапускаю термінал"],
  [/Створення LLM backend/g, "Для мене створення LLM backend"],
  [/Репозиторій \[llama-node-poc\][^\n]+\n\n- ✅ TypeScript/g, "Окремо я виніс у pet-проєкт:\n\n- ✅ TypeScript"],
  [/## Репозиторій-приклад[\s\S]*?Google Doc ID:[^\n]+_/m, `## Код і додаткові матеріали

Якщо після статті захочете подивитися CLI, 31 тест і скріншоти експериментів — код лежить у pet-проєкті **llama-node-poc** (посилання в профілі автора на DOU/GitHub). Для першого запуску достатньо розділу «Початок з нуля» вище.

---

**Стаття — особистий досвід запуску Llama з Node.js через \`ollama@0.6.3\`; код у репозиторії не дублює цей текст.**

_Останнє оновлення: серпень 2026. Версія для DOU._`],
];

for (const [from, to] of reps) {
  t = t.replace(from, to);
}

// Git experiment section - first person
t = t.replace(
  /### Практичний приклад: git push \+ Pull Request \(Modelfile\)[\s\S]*?terminal-logs\/` \(baseline, taught, live `step-\*\.txt`\)\./,
  `### Практичний приклад: git push + Pull Request (Modelfile)

Я хотів перевірити, чи можна «навчити» модель **конкретному workflow**, якого вона не знає — push + PR для мого pet-проєкту.

| Етап | Що я побачив | Скріншот |
| ---- | ------------ | -------- |
| Baseline | \`llama3.2\` порадила \`git push origin main --force\` | \`docs/teaching-git-mr/screenshots/01-baseline-ollama.png\` |
| Modelfile | \`ollama create llama-node-poc-git\` | \`02-create-modelfile.png\` |
| Після навчання | feature branch + \`gh pr create\` | \`03-taught-ollama.png\` |
| Live demo | реальний push і PR | \`step-06-push-branch.png\` |

Логи кожного кроку я поклав у \`docs/teaching-git-mr/terminal-logs/\` — можна відтворити локально.`,
);

// Conclusion first person
t = t.replace(
  /## Висновок[\s\S]*?(?=## Код і додаткові матеріали|## Репозиторій|$)/,
  `## Висновок

Я б радив почати так: **Ollama server → npm \`ollama\` → один \`index.ts\`**. Node.js лишається тонким клієнтом, а inference — на стороні Ollama.

Що я для себе зафіксував:

- \`ollama run\` — найшвидша перевірка, перш ніж писати TypeScript.
- \`tinyllama\` — для connectivity-тестів; \`llama3.2\` — для якості та JSON.
- Modelfile + RAG закривають 90% «навчити модель», fine-tuning — лише якщо prompt не тягне.
- Regression suite на \`client.chat()\` реально ловить деградацію після зміни моделі.

Якщо підете цим шляхом — напишіть у коментарях, на якому кроці застрягли. Мені цікаво, чи у вас \`llama3.2\` на CPU дає схожі latency, як у моєму \`benchmarks-latest.txt\`.

`,
);

writeFileSync(FILE, t);
console.log("Transformed", FILE);
