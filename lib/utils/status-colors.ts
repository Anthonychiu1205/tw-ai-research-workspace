export type StatusTone =
  | "neutral"
  | "backend"
  | "evidence"
  | "trace"
  | "success"
  | "warning"
  | "danger"
  | "mock";

export function toneClassName(tone: StatusTone): string {
  if (tone === "backend") return "border-sky-400/35 bg-sky-500/12 text-sky-200";
  if (tone === "evidence") return "border-amber-400/35 bg-amber-500/12 text-amber-200";
  if (tone === "trace") return "border-violet-400/35 bg-violet-500/12 text-violet-200";
  if (tone === "success") return "border-emerald-400/35 bg-emerald-500/12 text-emerald-200";
  if (tone === "warning") return "border-orange-400/35 bg-orange-500/12 text-orange-200";
  if (tone === "danger") return "border-rose-400/35 bg-rose-500/12 text-rose-200";
  if (tone === "mock") return "border-indigo-400/35 bg-indigo-500/12 text-indigo-200";
  return "border-border bg-muted/40 text-foreground";
}
