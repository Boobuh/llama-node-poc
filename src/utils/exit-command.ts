export function isExitCommand(input: string, exitCommands: readonly string[]): boolean {
  return exitCommands.includes(input.toLowerCase().trim());
}
