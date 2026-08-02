#!/usr/bin/env node
/** Write terminal-styled HTML pages from logs (no Playwright required). */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../..");
const OUT = join(ROOT, "docs/teaching-git-mr/screenshots");
const LOGS = join(ROOT, "docs/teaching-git-mr/logs");

mkdirSync(join(OUT, "_html"), { recursive: true });

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function terminalPage(title, body, subtitle = "") {
  return `<!DOCTYPE html>
<html lang="uk"><head><meta charset="utf-8"/><title>${escapeHtml(title)}</title>
<style>
body{margin:0;padding:32px;background:#1e1e2e;color:#cdd6f4;font-family:Consolas,monospace}
.window{max-width:960px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #45475a;box-shadow:0 20px 60px rgba(0,0,0,.45)}
.titlebar{background:#313244;padding:12px 16px;color:#bac2de;font-size:13px}
h1{font:600 18px system-ui;color:#89b4fa;margin:20px 24px 8px}
.sub{color:#a6adc8;font:13px system-ui;margin:0 24px 16px}
pre{margin:0;padding:20px 24px;background:#11111b;color:#a6e3a1;font-size:13px;line-height:1.55;white-space:pre-wrap}
</style></head><body><div class="window">
<div class="titlebar">terminal — llama-node-poc</div>
<h1>${escapeHtml(title)}</h1>
${subtitle ? `<p class="sub">${escapeHtml(subtitle)}</p>` : ""}
<pre>${escapeHtml(body)}</pre></div></body></html>`;
}

const shots = [
  ["01-baseline-ollama", "Крок 1 — Baseline (без навчання)", "01-baseline-question.txt", "ollama run llama3.2"],
  ["02-create-modelfile", "Крок 2 — Modelfile + ollama create", "02-create-model.txt", "ollama create llama-node-poc-git"],
  ["03-taught-ollama", "Крок 3 — Після навчання", "03-taught-response.txt", "ollama run llama-node-poc-git"],
];

for (const [id, title, log, sub] of shots) {
  const body = readFileSync(join(LOGS, log), "utf8");
  writeFileSync(join(OUT, "_html", `${id}.html`), terminalPage(title, body, sub));
}

const liveDir = join(LOGS, "live");
if (existsSync(liveDir)) {
  for (const file of readdirSync(liveDir).filter((f) => f.endsWith(".txt")).sort()) {
    const id = file.replace(".txt", "");
    const body = readFileSync(join(liveDir, file), "utf8");
    writeFileSync(join(OUT, "_html", `${id}.html`), terminalPage(`Live: ${id}`, body, "git + gh pr create"));
  }
}

// PR summary page
writeFileSync(
  join(OUT, "_html", "09-github-pr.html"),
  terminalPage(
    "Крок 9 — Pull Request на GitHub",
    "gh pr create\n→ https://github.com/Boobuh/llama-node-poc/pull/1\n\nTitle: docs: teach model git push and PR workflow\nState: OPEN",
    "Merge request = Pull Request на GitHub",
  ),
);

console.log("HTML pages written to docs/teaching-git-mr/screenshots/_html/");
