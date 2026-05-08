export type WorkspaceToolCallState = {
  id: string;
  toolName: string;
  status: "pending" | "running" | "succeeded" | "failed";
  args?: Record<string, unknown>;
  resultSummary?: string;
  evidenceIds: string[];
  startedAt: string;
  completedAt?: string;
  latencyMs?: number;
  error?: string;
  fallbackUsed?: boolean;
  artifactId?: string;
};

export type WorkspaceChatMessage = {
  id: string;
  role: "user" | "assistant" | "system" | "tool";
  content: string;
  createdAt: string;
  status: "streaming" | "complete" | "error";
  toolCalls?: WorkspaceToolCallState[];
  metadata?: {
    model?: string;
    provider?: string;
    tokenUsage?: Record<string, unknown>;
    fallbackUsed?: boolean;
    artifactsCreated?: string[];
  };
};

export type WorkspaceChatState = {
  messages: WorkspaceChatMessage[];
  input: string;
  isStreaming: boolean;
  activeToolCalls: WorkspaceToolCallState[];
  tokenUsage: Record<string, unknown> | null;
  lastError: string | null;
  lastUserMessage: string | null;
  activeAssistantId: string | null;
};
