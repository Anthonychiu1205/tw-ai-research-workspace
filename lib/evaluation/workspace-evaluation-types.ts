export type WorkspaceEvaluationCheck = {
  name: string;
  category: "scenarios" | "chat_stream" | "tools" | "artifacts" | "safety" | "sessions" | "backend" | "docs";
  passed: boolean;
  severity: "info" | "warning" | "error";
  details: string;
};

export type WorkspaceEvaluationReport = {
  evaluationId: string;
  createdAt: string;
  passed: boolean;
  checks: WorkspaceEvaluationCheck[];
  summary: string;
  warnings: string[];
};
