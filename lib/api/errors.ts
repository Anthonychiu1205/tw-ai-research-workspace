export type ApiErrorCode =
  | "NETWORK"
  | "TIMEOUT"
  | "HTTP_ERROR"
  | "INVALID_RESPONSE"
  | "NOT_FOUND"
  | "UNKNOWN";

export class WorkspaceApiError extends Error {
  code: ApiErrorCode;
  status?: number;
  retriable: boolean;

  constructor(message: string, code: ApiErrorCode = "UNKNOWN", options?: { status?: number; retriable?: boolean }) {
    super(message);
    this.name = "WorkspaceApiError";
    this.code = code;
    this.status = options?.status;
    this.retriable = options?.retriable ?? (code === "NETWORK" || code === "TIMEOUT");
  }
}

export function toWorkspaceApiError(error: unknown): WorkspaceApiError {
  if (error instanceof WorkspaceApiError) {
    return error;
  }
  if (error instanceof DOMException && error.name === "AbortError") {
    return new WorkspaceApiError("Request timed out", "TIMEOUT", { retriable: true });
  }
  if (error instanceof Error) {
    return new WorkspaceApiError(error.message, "NETWORK", { retriable: true });
  }
  return new WorkspaceApiError("Unknown API error", "UNKNOWN");
}

export function serializeWorkspaceApiError(error: WorkspaceApiError) {
  return {
    message: error.message,
    code: error.code,
    status: error.status,
    retriable: error.retriable,
  };
}
