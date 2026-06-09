export interface ArticleExample {
  category: string;
  prompt: string;
  response: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ArticleExampleDefinition {
  category: string;
  prompt: string;
  temperature: number;
  maxTokens: number;
  contextSetup?: string;
}
