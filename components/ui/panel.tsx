import { cn } from "@/lib/utils/cn";
import { workspaceVisualTokens } from "@/lib/ui/visual-tokens";

type PanelProps = React.HTMLAttributes<HTMLElement> & {
  className?: string;
  children: React.ReactNode;
};

export function Panel({ className, children, ...props }: PanelProps) {
  return <section className={cn(workspaceVisualTokens.panel, "p-3", className)} {...props}>{children}</section>;
}
