export type WorkspaceView = "chat" | "report" | "trace" | "strategy" | "signals";

export type WorkspaceUrlState = {
  ticker?: string;
  artifact?: string;
  session?: string;
  view: WorkspaceView;
};

const allowedViews: WorkspaceView[] = ["chat", "report", "trace", "strategy", "signals"];

export function parseWorkspaceUrlState(search: string): WorkspaceUrlState {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const viewRaw = params.get("view") ?? "chat";
  const view = allowedViews.includes(viewRaw as WorkspaceView) ? (viewRaw as WorkspaceView) : "chat";

  return {
    ticker: params.get("ticker") ?? undefined,
    artifact: params.get("artifact") ?? undefined,
    session: params.get("session") ?? undefined,
    view,
  };
}

export function serializeWorkspaceUrlState(state: Partial<WorkspaceUrlState>) {
  const params = new URLSearchParams();
  if (state.ticker) params.set("ticker", state.ticker);
  if (state.artifact) params.set("artifact", state.artifact);
  if (state.session) params.set("session", state.session);
  if (state.view) params.set("view", state.view);
  const query = params.toString();
  return query ? `?${query}` : "";
}
