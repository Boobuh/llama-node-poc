#!/usr/bin/env node
/**
 * Benchmark tinyllama vs llama3.2 latency + JSON format test.
 * Usage: node scripts/benchmark-models.mjs
 * Output: docs/research/benchmarks-latest.txt
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Ollama } from "ollama";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "docs/research/benchmarks-latest.txt");

const client = new Ollama({
  host: process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434",
});

const PROMPT = "Say hello in one sentence.";
const MODELS = (process.env.BENCHMARK_MODELS ?? "tinyllama,llama3.2").split(",");
const RUNS = Number(process.env.BENCHMARK_RUNS ?? 3);

function avg(nums) {
  return Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);
}

async function benchModel(model) {
  const times = [];
  for (let i = 0; i < RUNS; i++) {
    const start = performance.now();
    await client.chat({
      model,
      messages: [{ role: "user", content: PROMPT }],
      options: { num_predict: 30, temperature: 0.1 },
    });
    times.push(Math.round(performance.now() - start));
  }
  return {
    model,
    runs: times,
    coldMs: times[0],
    warmAvgMs: times.length > 1 ? avg(times.slice(1)) : times[0],
  };
}

async function testJsonFormat() {
  const start = performance.now();
  const { message } = await client.chat({
    model: process.env.BENCHMARK_JSON_MODEL ?? "llama3.2",
    messages: [
      {
        role: "user",
        content:
          'Extract name and age. Return JSON only: {"name":"Anna","age":29}',
      },
    ],
    format: "json",
    options: { temperature: 0.1, num_predict: 60 },
  });
  const ms = Math.round(performance.now() - start);
  let valid = false;
  try {
    JSON.parse(message.content);
    valid = true;
  } catch {
    valid = false;
  }
  return { valid, ms, sample: message.content.slice(0, 120) };
}

async function main() {
  mkdirSync(join(ROOT, "docs/research"), { recursive: true });

  const lines = [
    `# Model benchmarks — ${new Date().toISOString()}`,
    `Host: ${process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434"}`,
    `Prompt: ${PROMPT}`,
    "",
  ];

  for (const model of MODELS) {
    const r = await benchModel(model.trim());
    lines.push(`## ${r.model}`);
    lines.push(`runs_ms: ${r.runs.join(", ")}`);
    lines.push(`cold_ms: ${r.coldMs}`);
    lines.push(`warm_avg_ms: ${r.warmAvgMs}`);
    lines.push("");
  }

  const json = await testJsonFormat();
  lines.push("## format: json (llama3.2)");
  lines.push(`valid_json: ${json.valid}`);
  lines.push(`latency_ms: ${json.ms}`);
  lines.push(`sample: ${json.sample}`);
  lines.push("");

  const text = lines.join("\n");
  writeFileSync(OUT, text);
  console.log(text);
  console.log(`Written to ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
