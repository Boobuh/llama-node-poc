export class LlamaError extends Error {
  public code: string | undefined;
  public details: unknown;

  constructor(message: string, code?: string, details?: unknown) {
    super(message);
    this.name = "LlamaError";
    this.code = code;
    this.details = details;
  }
}
