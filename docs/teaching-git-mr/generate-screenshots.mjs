#!/usr/bin/env node
/**
 * Render terminal logs as HTML and capture PNG screenshots for the teaching experiment.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "docs/teaching-git-mr/screenshots");
const LOGS = join(ROOT, "docs/teaching-git-mr/terminal-logs");

mkdirSync(OUT, { recursive: true });

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function terminalPage(title, body, subtitle = "") {
  return `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; padding: 32px;
      background: #1e1e2e; color: #cdd6f4;
      font-family: "JetBrains Mono", "Fira Code", "Consolas", monospace;
    }
    .window {
      max-width: 960px; margin: 0 auto;
      border-radius: 12px; overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,.45);
      border: 1px solid #45475a;
    }
    .titlebar {
      background: #313244; padding: 12px 16px;
      display: flex; gap: 8px; align-items: center;
    }
    .dot { width: 12px; height: 12px; border-radius: 50%; }
    .red { background: #f38ba8; }
    .yellow { background: #f9e2af; }
    .green { background: #a6e3a1; }
    .titlebar span { margin-left: 12px; color: #bac2de; font-size: 13px; }
    h1 {
      font-size: 18px; font-weight: 600; margin: 0 0 8px;
      color: #89b4fa; font-family: system-ui, sans-serif;
    }
    .subtitle { color: #a6adc8; font-size: 13px; margin-bottom: 16px; font-family: system-ui, sans-serif; }
    pre {
      margin: 0; padding: 20px 24px;
      background: #11111b; color: #a6e3a1;
      font-size: 13px; line-height: 1.55;
      white-space: pre-wrap; word-break: break-word;
      min-height: 200px;
    }
    .warn pre { color: #fab387; }
    .good pre { color: #a6e3a1; }
  </style>
</head>
<body>
  <div class="window">
    <div class="titlebar">
      <div class="dot red"></div><div class="dot yellow"></div><div class="dot green"></div>
      <span>terminal — llama-node-poc</span>
    </div>
    <div style="padding: 20px 24px 0">
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<div class="subtitle">${escapeHtml(subtitle)}</div>` : ""}
    </div>
    <pre>${escapeHtml(body)}</pre>
  </div>
</body>
</html>`;
}

const shots = [
  {
    id: "01-baseline-ollama",
    title: "Крок 1 — Baseline (без навчання)",
    subtitle: "ollama run llama3.2 — модель не знає точного workflow репозиторію",
    log: "01-baseline-question.txt",
    cssClass: "warn",
  },
  {
    id: "02-create-modelfile",
    title: "Крок 2 — Створити навчену модель",
    subtitle: "ollama create llama-node-poc-git -f docs/teaching-git-mr/Modelfile",
    log: "02-create-model.txt",
    cssClass: "good",
  },
  {
    id: "03-taught-ollama",
    title: "Крок 3 — Після Modelfile",
    subtitle: "ollama run llama-node-poc-git — правильні gh pr create + feature branch",
    log: "03-taught-response.txt",
    cssClass: "good",
  },
];

async function screenshotHtml(page, htmlPath, pngPath) {
  await page.goto(`file://${htmlPath}`);
  await page.waitForTimeout(300);
  await page.screenshot({ path: pngPath, fullPage: true });
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 720 } });
  const htmlDir = join(OUT, "_html");
  mkdirSync(htmlDir, { recursive: true });

  for (const shot of shots) {
    const logPath = join(LOGS, shot.log);
    const body = existsSync(logPath) ? readFileSync(logPath, "utf8") : "(log missing)";
    const html = terminalPage(shot.title, body, shot.subtitle);
    const htmlPath = join(htmlDir, `${shot.id}.html`);
    writeFileSync(htmlPath, html);
    const pngPath = join(OUT, `${shot.id}.png`);
    await screenshotHtml(page, htmlPath, pngPath);
    console.log(`Screenshot: ${pngPath}`);
  }

  const liveDir = join(LOGS, "live");
  if (existsSync(liveDir)) {
    const liveLogs = readdirSync(liveDir)
      .filter((f) => f.endsWith(".txt"))
      .sort();
    let step = 4;
    for (const file of liveLogs) {
      const body = readFileSync(join(liveDir, file), "utf8");
      const id = `0${step}-${file.replace(".txt", "")}`.slice(0, 40);
      const title = `Крок ${step} — Live demo: ${file.replace(".txt", "").replace(/^step-\d+-/, "")}`;
      const htmlPath = join(htmlDir, `${id}.html`);
      writeFileSync(htmlPath, terminalPage(title, body, "Реальні команди git + gh pr create"));
      const pngPath = join(OUT, `${id}.png`);
      await screenshotHtml(page, htmlPath, pngPath);
      console.log(`Screenshot: ${pngPath}`);
      step++;
    }
  }

  await browser.close();
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
