import type { ResearchOperationRequest, ResearchOperationResult } from "@/lib/operations/operation-types";

export type CommandCategory = "operations" | "navigation" | "runtime";

export type WorkspaceCommandContext = {
  canUseApiMode: boolean;
  enqueueOperation: (request: ResearchOperationRequest) => Promise<ResearchOperationResult>;
  navigate: (path: string) => void;
  setRuntimeMode: (mode: "mock" | "api") => void;
  checkBackendHealth: () => Promise<void>;
};

export type WorkspaceCommand = {
  id: string;
  label: string;
  description: string;
  category: CommandCategory;
  shortcut?: string;
  unavailableReason?: string;
  run: (context: WorkspaceCommandContext) => Promise<void> | void;
};
