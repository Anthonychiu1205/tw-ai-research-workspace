export function formatPct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function formatLatency(ms: number) {
  return `${ms.toFixed(0)} ms`;
}
