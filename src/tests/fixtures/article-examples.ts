import type { ArticleExampleDefinition } from "../../types/examples";

export const ARTICLE_EXAMPLE_DEFINITIONS: ArticleExampleDefinition[] = [
  {
    category: "Instruction Following",
    prompt: 'Reply with ONLY "YES" or "NO". Is water wet?',
    temperature: 0.1,
    maxTokens: 10,
  },
  {
    category: "Structured Output (JSON)",
    prompt:
      'Extract the name and age from this text and return only valid JSON: "My name is Anna, I turned 29 last month."',
    temperature: 0.1,
    maxTokens: 50,
  },
  {
    category: "Math Reasoning",
    prompt: "2+2=",
    temperature: 0,
    maxTokens: 10,
  },
  {
    category: "Context Retention",
    prompt: "What is my API key?",
    temperature: 0.3,
    maxTokens: 20,
    contextSetup: "My API key is 12345. Remember this.",
  },
  {
    category: "Code Generation",
    prompt:
      "Write a JavaScript function that reverses a string. Code only, no explanations.",
    temperature: 0.3,
    maxTokens: 100,
  },
  {
    category: "Creative Text",
    prompt:
      "Tell a short story about a robot discovering emotions (3 sentences).",
    temperature: 0.8,
    maxTokens: 150,
  },
  {
    category: "Summarization",
    prompt:
      "Summarize this text in one sentence:\nArtificial intelligence (AI) is intelligence demonstrated by machines, as opposed to the natural intelligence displayed by humans and animals.",
    temperature: 0.4,
    maxTokens: 80,
  },
  {
    category: "Language Understanding",
    prompt: "Explain why the sky is blue in one sentence.",
    temperature: 0.3,
    maxTokens: 60,
  },
];
