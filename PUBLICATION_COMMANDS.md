# Команди для української публікації

Джерело правди: `docs/dou/UKRAINIAN_PUBLICATION_DRAFT.md` (**local**, `.gitignore`)  
Google Doc: https://docs.google.com/document/d/18iTtik-PL9VR0ydbOgMbz1xzOq5HCVBDYzlNZf6iKKw/edit

## 1. Ollama (перед тестами / прикладами)

```bash
# Встановити Ollama server (Linux)
curl -fsSL https://ollama.com/install.sh | sh

# Моделі
ollama pull tinyllama    # для npm run test:*
ollama pull llama3.2     # для npm run dev (default)

# Перевірка
ollama list
curl -s http://127.0.0.1:11434/api/tags | head
```

## 2. Оновити локальні файли публікації

```bash
cd /home/oleh/dev/llama-node-poc

# Plain-text копія (fallback для ручного paste)
npx tsx src/tests/md-to-googledocs.ts

# Приклади для статті (потрібен Ollama + tinyllama)
OLLAMA_MODEL=tinyllama npm run generate:examples
```

## 3. Синхронізувати Google Doc (форматування + посилання)

Потрібно: `~/.config/google-workspace-mcp/credentials.json` + `tokens.json`  
(див. `GOOGLE_DOC_SYNC.md`)

```bash
node scripts/sync-google-doc-rich.mjs
```

**Не використовуйте** `sync-google-doc.mjs` — знімає форматування.

## 4. Перевірити проєкт (опційно, перед commit)

```bash
npm run test:unit
npm run test:quick
npm run test:providers
npm run build
```

## 5. Закомітити в GitHub (щоб файл не був 404)

```bash
# Publication files are gitignored — do not git add them for GitHub
# git add PUBLICATION_AUDIT.md GOOGLE_DOC_SYNC.md  # tooling docs only
        README.md SETUP.md \
        GOOGLE_DOC_SYNC.md PUBLICATION_AUDIT.md PUBLICATION_COMMANDS.md \
        scripts/ src/providers/setup-messages.ts Dockerfile

git commit -m "$(cat <<'EOF'
Add Ukrainian publication and from-zero Ollama setup docs.

Includes Google Doc rich sync scripts and aligned README/SETUP.
EOF
)"

git push
```

## 6. Повний цикл одним блоком

```bash
cd /home/oleh/dev/llama-node-poc

npx tsx src/tests/md-to-googledocs.ts
node scripts/sync-google-doc-rich.mjs

# опційно:
# OLLAMA_MODEL=tinyllama npm run generate:examples
# npm run test:quick
```

## Файли публікації

| Файл                                      | Призначення                              |
| ----------------------------------------- | ---------------------------------------- |
| `docs/dou/UKRAINIAN_PUBLICATION_DRAFT.md` | Повний драфт (local only, gitignored)   |
| `UKRAINIAN_PUBLICATION_GOOGLEDOCS.txt`    | Plain-text paste (local, gitignored)      |
| `EXAMPLES_OUTPUT.txt`                     | Згенеровані приклади промптів/відповідей |
| `EXAMPLES_FOR_ARTICLE.md`                 | Чернетка прикладів                       |
| `scripts/sync-google-doc-rich.mjs`        | Sync MD → Google Doc                     |
| `scripts/lib/markdown-to-google-docs.mjs` | Конвертер MD → Docs API                  |
| `GOOGLE_DOC_SYNC.md`                      | OAuth + MCP інструкції                   |
| `PUBLICATION_AUDIT.md`                    | Аудит статті vs проєкт                   |

## npm scripts (з package.json)

| Команда                                 | Для чого                    |
| --------------------------------------- | --------------------------- |
| `npx tsx src/tests/md-to-googledocs.ts` | MD → GOOGLEDOCS.txt         |
| `npm run generate:examples`             | Оновити EXAMPLES_OUTPUT.txt |
| `npm run test:unit`                     | Unit-тести без LLM          |
| `npm run test:quick`                    | Швидка перевірка Ollama     |
| `npm run test:providers`                | Інтеграція провайдерів      |
| `npm test`                              | Повний regression suite     |
