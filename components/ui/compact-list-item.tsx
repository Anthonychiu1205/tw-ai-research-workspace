import { cn } from "@/lib/utils/cn";

export function CompactListItem({
  title,
  meta,
  active,
  onClick,
}: {
  title: string;
  meta?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const Wrapper = onClick ? "button" : "div";

  return (
    <Wrapper
      className={cn(
        "w-full rounded-md border-l-2 border-transparent px-2.5 py-2 text-left text-xs leading-5",
        active
          ? "border-l-primary bg-emerald-50/60 text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
      onClick={onClick}
      type={onClick ? "button" : undefined}
    >
      <div className="line-clamp-1 font-medium text-foreground">{title}</div>
      {meta ? <div className="line-clamp-1 text-[11px] text-muted-foreground">{meta}</div> : null}
    </Wrapper>
  );
}
