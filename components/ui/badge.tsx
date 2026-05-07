import { cn } from "@/lib/utils/cn";

export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={cn("inline-flex rounded-full border border-border px-2 py-0.5 text-xs", className)}>
      {children}
    </span>
  );
}
