#!/usr/bin/env node
/** Ask llama-node-poc-git (Modelfile) about git push + PR from Node.js. */
import { Ollama } from "ollama";

const client = new Ollama({
  host: process.env.OLLAMA_HOST ?? "http://127.0.0.1:11434",
});
const model = process.env.OLLAMA_MODEL ?? "llama-node-poc-git";
const question =
  process.argv.slice(2).join(" ") ||
  "Як у Boobuh/llama-node-poc запушити коміт і створити Pull Request?";

const { message } = await client.chat({
  model,
  messages: [{ role: "user", content: question }],
  options: { temperature: 0.2, num_predict: 400 },
});

console.log(message.content);
