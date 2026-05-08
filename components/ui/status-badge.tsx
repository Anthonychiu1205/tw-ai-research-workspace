import { cn } from "@/lib/utils/cn";
import { toneClassName, type StatusTone } from "@/lib/utils/status-colors";

export function StatusBadge({
  tone = "neutral",
  size = "sm",
  icon,
  children,
  className,
}: {
  tone?: StatusTone;
  size?: "sm" | "md";
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border font-medium leading-5",
        size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]",
        toneClassName(tone),
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}
