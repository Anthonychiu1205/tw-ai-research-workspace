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
  if (tone === "backend") return "border-sky-200 bg-sky-50 text-sky-700";
  if (tone === "evidence") return "border-amber-200 bg-amber-50 text-amber-700";
  if (tone === "trace") return "border-violet-200 bg-violet-50 text-violet-700";
  if (tone === "success") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  if (tone === "warning") return "border-orange-200 bg-orange-50 text-orange-700";
  if (tone === "danger") return "border-rose-200 bg-rose-50 text-rose-700";
  if (tone === "mock") return "border-indigo-200 bg-indigo-50 text-indigo-700";
  return "border-slate-200 bg-slate-50 text-slate-700";
}
