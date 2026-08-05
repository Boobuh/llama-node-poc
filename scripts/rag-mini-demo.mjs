#!/usr/bin/env node
/**
 * Minimal RAG demo: embed chunks with Ollama, retrieve, answer with llama3.2.
 * Prerequisites: ollama pull nomic-embed-text && ollama pull llama3.2
 */
import { Ollama } from "ollama";

const client = new Ollama({
  host: process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434",
});
const EMBED_MODEL = process.env.RAG_EMBED_MODEL ?? "nomic-embed-text";
const CHAT_MODEL = process.env.OLLAMA_MODEL ?? "llama3.2";

const DOCS = [
  "llama-node-poc default provider is ollama. Ollama server runs on localhost:11434.",
  "Tests use tinyllama automatically via prepareTestProvider. npm run test:quick checks connectivity.",
  "Pull models: ollama pull tinyllama for tests, ollama pull llama3.2 for dev demos.",
  "Git workflow: feature branch, conventional commit, git push -u origin HEAD, gh pr create.",
  "Modelfile teaches repo-specific knowledge without changing model weights.",
];

function cosine(a, b) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

async function embed(text) {
  const { embedding } = await client.embeddings({ model: EMBED_MODEL, prompt: text });
  return embedding;
}

async function main() {
  const query = process.argv.slice(2).join(" ") || "Which model do tests use?";
  console.log(`Query: ${query}\n`);

  const queryVec = await embed(query);
  const scored = [];
  for (const chunk of DOCS) {
    const vec = await embed(chunk);
    scored.push({ chunk, score: cosine(queryVec, vec) });
  }
  scored.sort((a, b) => b.score - a.score);
  const top = scored.slice(0, 2);

  console.log("Retrieved chunks:");
  for (const { chunk, score } of top) {
    console.log(`  [${score.toFixed(3)}] ${chunk}`);
  }
  console.log("");

  const context = top.map((t) => t.chunk).join("\n");
  const { message } = await client.chat({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: "Answer using ONLY the context below. If unknown, say you don't know.",
      },
      { role: "user", content: `Context:\n${context}\n\nQuestion: ${query}` },
    ],
    options: { temperature: 0.2, num_predict: 150 },
  });

  console.log("Answer:", message.content);
}

main().catch((err) => {
  console.error(err.message ?? err);
  console.error("\nTry: ollama pull nomic-embed-text && ollama pull llama3.2");
  process.exit(1);
});
