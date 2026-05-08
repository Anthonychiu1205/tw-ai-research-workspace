import { cn } from "@/lib/utils/cn";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-md border border-border bg-slate-50 px-2 py-0.5 text-xs leading-5 text-slate-700", className)}>
      {children}
    </span>
  );
}
