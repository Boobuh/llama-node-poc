# Експеримент: навчити модель push + Pull Request

Практична демонстрація з розділу «Міні-дослідження» — **Modelfile** для знань, яких базова `llama3.2` не має (точний workflow `Boobuh/llama-node-poc`).

## Мета

1. Показати, що модель **без навчання** дає небезпечні/хибні команди.
2. **Навчити** через `Modelfile` (system prompt + few-shot) — без зміни ваг.
3. **Відтворити** реальний push + GitHub Pull Request з логами та скріншотами.

> **GitHub PR = merge request.** На GitLab той самий flow, але `glab mr create` замість `gh pr create`.

## Швидке відтворення

```bash
# 1. Baseline — запит без Modelfile
ollama run llama3.2 "Як у Boobuh/llama-node-poc запушити коміт і створити PR?"

# 2. Створити навчену модель
ollama create llama-node-poc-git -f docs/teaching-git-mr/Modelfile

# 3. Той самий запит — після навчання
ollama run llama-node-poc-git "Як у Boobuh/llama-node-poc запушити коміт і створити PR?"

# 4. Live demo (git push + gh pr create) — потрібен gh auth login
chmod +x docs/teaching-git-mr/run-live-demo.sh
./docs/teaching-git-mr/run-live-demo.sh

# 5. Скріншоти з логів
node docs/teaching-git-mr/generate-screenshots.mjs
```

## Результати (збережені в репозиторії)

| Артефакт | Опис |
| -------- | ---- |
| `terminal-logs/01-baseline-question.txt` | Відповідь `llama3.2` — **push --force на main**, вигадані шляхи |
| `terminal-logs/02-create-model.txt` | `ollama create llama-node-poc-git` |
| `terminal-logs/03-taught-response.txt` | Після Modelfile — **feature branch + gh pr create** |
| `terminal-logs/live/step-*.txt` | Реальні команди git/gh з live demo |
| `screenshots/*.png` | Скріншоти кожного кроку для статті |
| `screenshots/10-github-pr-page.png` | Сторінка PR на GitHub |
| `Modelfile` | Рецепт навчання (system + MESSAGE) |

**Створений PR:** https://github.com/Boobuh/llama-node-poc/pull/1

## Що пішло не так у baseline

Без Modelfile модель запропонувала серед іншого:

```text
git push origin main --force
git request-pull ...
```

Це **не** workflow цього репозиторію і небезпечно для `main`.

## Що дає Modelfile

Після `ollama create llama-node-poc-git`:

```text
git checkout -b feat/my-change
git add .
git commit -m "docs: describe my change"
git push -u origin HEAD
gh pr create --title "..." --body "..."
```

## Передумови live demo

- `git` + доступ до `origin` (https://github.com/Boobuh/llama-node-poc.git)
- [GitHub CLI](https://cli.github.com/): `gh auth login`
- Ollama з `llama3.2` для кроків 1–3

## Node.js (опційно)

Той самий system prompt можна передати в API без Modelfile:

```typescript
import { Ollama } from "ollama";

const client = new Ollama();
const system = readFileSync("docs/teaching-git-mr/Modelfile-system.txt", "utf8"); // або inline

const { message } = await client.chat({
  model: "llama3.2",
  messages: [
    { role: "system", content: system },
    { role: "user", content: "Як запушити коміт і створити PR у Boobuh/llama-node-poc?" },
  ],
});
```

Modelfile зручніший, коли команда використовує `ollama run llama-node-poc-git` локально.
