import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MessageList } from "@/components/chat/message-list";
import { RetryMessageButton } from "@/components/chat/retry-message-button";

describe("message rendering", () => {
  test("streaming message state", () => {
    render(
      <MessageList
        messages={[
          {
            id: "m1",
            role: "assistant",
            content: "streaming content",
            createdAt: "2026-05-08",
            status: "streaming",
          },
        ]}
      />,
    );

    expect(screen.getByText(/^streaming$/i)).toBeInTheDocument();
  });

  test("token usage pill", () => {
    render(
      <MessageList
        messages={[
          {
            id: "m1",
            role: "assistant",
            content: "done",
            createdAt: "2026-05-08",
            status: "complete",
            metadata: { tokenUsage: { totalTokens: 321 } },
          },
        ]}
      />,
    );

    expect(screen.getByText(/tokens: 321/i)).toBeInTheDocument();
  });

  test("fallback badge", () => {
    render(
      <MessageList
        messages={[
          {
            id: "m1",
            role: "assistant",
            content: "done",
            createdAt: "2026-05-08",
            status: "complete",
            metadata: { fallbackUsed: true },
          },
        ]}
      />,
    );

    expect(screen.getByText(/fallback|備援/i)).toBeInTheDocument();
  });

  test("tool timeline", () => {
    render(
      <MessageList
        messages={[
          {
            id: "m1",
            role: "assistant",
            content: "done",
            createdAt: "2026-05-08",
            status: "complete",
            toolCalls: [
              {
                id: "t1",
                toolName: "runResearch",
                status: "succeeded",
                evidenceIds: ["ev-1"],
                startedAt: "2026-05-08",
                resultSummary: "ok",
              },
            ],
          },
        ]}
      />,
    );

    expect(screen.getByTestId("tool-call-timeline")).toBeInTheDocument();
    expect(screen.getByText(/runResearch/i)).toBeInTheDocument();
  });

  test("retry button", () => {
    let called = false;
    render(<RetryMessageButton onRetry={() => { called = true; }} />);
    fireEvent.click(screen.getByRole("button", { name: /retry/i }));
    expect(called).toBe(true);
  });

  test("error state", () => {
    render(
      <MessageList
        messages={[
          {
            id: "m1",
            role: "assistant",
            content: "Error: timeout",
            createdAt: "2026-05-08",
            status: "error",
          },
        ]}
      />,
    );

    expect(screen.getByText(/^error$/i)).toBeInTheDocument();
  });
});
