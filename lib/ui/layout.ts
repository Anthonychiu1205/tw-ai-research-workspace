import { workspaceVisualTokens } from "@/lib/ui/visual-tokens";

export function workspacePageLayoutClass() {
  return `mx-auto grid w-full max-w-[1580px] grid-cols-1 items-start gap-4 ${workspaceVisualTokens.contextWidth}`;
}

export function workspaceMainColumnClass() {
  return "min-w-0 space-y-4 pb-6";
}

export function workspaceContextColumnClass() {
  return "space-y-3 pb-6 xl:sticky xl:top-4 xl:self-start";
}
