export type ApiErrorCode = "NETWORK" | "INVALID_RESPONSE" | "NOT_FOUND" | "UNKNOWN";

export class WorkspaceApiError extends Error {
  code: ApiErrorCode;
  constructor(message: string, code: ApiErrorCode = "UNKNOWN") {
    super(message);
    this.name = "WorkspaceApiError";
    this.code = code;
  }
}

export function toWorkspaceApiError(error: unknown): WorkspaceApiError {
  if (error instanceof WorkspaceApiError) {
    return error;
  }
  if (error instanceof Error) {
    return new WorkspaceApiError(error.message, "NETWORK");
  }
  return new WorkspaceApiError("Unknown API error", "UNKNOWN");
}
