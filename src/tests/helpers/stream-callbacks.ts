import chalk from "chalk";

export interface StreamingDotState {
  streamedTokens: number;
}

export interface LatencyStreamState {
  firstTokenTime: number;
  totalTokens: number;
  startTime: number;
}

export function createStreamingDotHandler(
  state: StreamingDotState
): (text: string) => void {
  function handleStreamingDot(text: string): void {
    if (text) {
      state.streamedTokens++;
      process.stdout.write(chalk.gray("."));
    }
  }

  return handleStreamingDot;
}

export function createLatencyStreamHandler(
  state: LatencyStreamState
): (text: string) => void {
  function handleLatencyStream(text: string): void {
    if (state.totalTokens === 0) {
      state.firstTokenTime = Date.now() - state.startTime;
    }
    if (text) {
      state.totalTokens += text.split(/\s+/).length;
    }
  }

  return handleLatencyStream;
}
