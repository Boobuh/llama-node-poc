export interface CommandOptions {
    temperature?: number;
    maxTokens?: number;
    provider?: string;
}
export type ExampleOptions = CommandOptions;
export interface ReadLineInterface {
    question(query: string, callback: (answer: string) => void): void;
    close(): void;
}
//# sourceMappingURL=cli.d.ts.map