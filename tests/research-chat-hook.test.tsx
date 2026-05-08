import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useResearchChat } from "@/lib/ai/use-research-chat";
import { getDefaultRuntimeSettings } from "@/lib/config/runtime";

function streamResponse(lines: string[]) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const line of lines) {
        controller.enqueue(encoder.encode(`${line}\n`));
      }
      controller.close();
    },
  });
  return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8" } });
}

describe("research chat hook", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test("send message creates user and assistant messages", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamResponse([
          JSON.stringify({ type: "message_delta", id: "1", timestamp: "t", payload: { content: "hello" } }),
          JSON.stringify({ type: "final", id: "2", timestamp: "t", payload: { disclaimer: "not financial advice" } }),
        ]),
      ),
    );

    const { result } = renderHook(() =>
      useResearchChat({
        runtimeSettings: getDefaultRuntimeSettings(),
        modelId: "mock-research",
        provider: "mock",
      }),
    );

    act(() => result.current.setInput("Analyze 2330"));
    await act(async () => {
      await result.current.sendMessage();
    });

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThanOrEqual(2);
    });
  });

  test("stream events update assistant content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamResponse([
          JSON.stringify({ type: "message_delta", id: "1", timestamp: "t", payload: { content: "part1 " } }),
          JSON.stringify({ type: "message_delta", id: "2", timestamp: "t", payload: { content: "part2" } }),
          JSON.stringify({ type: "final", id: "3", timestamp: "t", payload: { disclaimer: "not financial advice" } }),
        ]),
      ),
    );

    const { result } = renderHook(() =>
      useResearchChat({ runtimeSettings: getDefaultRuntimeSettings(), modelId: "mock-research", provider: "mock" }),
    );

    act(() => result.current.setInput("hello"));
    await act(async () => {
      await result.current.sendMessage();
    });

    const assistant = result.current.messages.find((message) => message.role === "assistant");
    expect(assistant?.content).toContain("part1");
    expect(assistant?.content).toContain("part2");
  });

  test("tool events update tool state", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamResponse([
          JSON.stringify({ type: "tool_call_start", id: "tool-1-start", timestamp: "t", payload: { toolName: "runResearch" } }),
          JSON.stringify({ type: "tool_call_delta", id: "tool-1-delta", timestamp: "t", payload: { toolName: "runResearch" } }),
          JSON.stringify({ type: "tool_call_result", id: "tool-1-result", timestamp: "t", payload: { toolName: "runResearch", status: "succeeded", summary: "done", evidenceIds: ["ev-1"] } }),
          JSON.stringify({ type: "final", id: "3", timestamp: "t", payload: { disclaimer: "not financial advice" } }),
        ]),
      ),
    );

    const { result } = renderHook(() =>
      useResearchChat({ runtimeSettings: getDefaultRuntimeSettings(), modelId: "mock-research", provider: "mock" }),
    );

    act(() => result.current.setInput("analyze"));
    await act(async () => {
      await result.current.sendMessage();
    });

    expect(result.current.activeToolCalls.length).toBeGreaterThan(0);
    expect(result.current.activeToolCalls[0].toolName).toBe("runResearch");
  });

  test("final event completes message", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamResponse([
          JSON.stringify({ type: "message_delta", id: "1", timestamp: "t", payload: { content: "hello" } }),
          JSON.stringify({ type: "final", id: "2", timestamp: "t", payload: { disclaimer: "not financial advice" } }),
        ]),
      ),
    );

    const { result } = renderHook(() =>
      useResearchChat({ runtimeSettings: getDefaultRuntimeSettings(), modelId: "mock-research", provider: "mock" }),
    );

    act(() => result.current.setInput("hello"));
    await act(async () => {
      await result.current.sendMessage();
    });

    const assistant = result.current.messages.find((message) => message.role === "assistant");
    expect(assistant?.status).toBe("complete");
  });

  test("retryLast works", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(
        streamResponse([
          JSON.stringify({ type: "message_delta", id: "1", timestamp: "t", payload: { content: "hello" } }),
          JSON.stringify({ type: "final", id: "2", timestamp: "t", payload: { disclaimer: "not financial advice" } }),
        ]),
      );

    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() =>
      useResearchChat({ runtimeSettings: getDefaultRuntimeSettings(), modelId: "mock-research", provider: "mock" }),
    );

    act(() => result.current.setInput("hello"));
    await act(async () => {
      await result.current.sendMessage();
    });

    await act(async () => {
      await result.current.retryLast();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("clear works", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        streamResponse([
          JSON.stringify({ type: "message_delta", id: "1", timestamp: "t", payload: { content: "hello" } }),
          JSON.stringify({ type: "final", id: "2", timestamp: "t", payload: { disclaimer: "not financial advice" } }),
        ]),
      ),
    );

    const { result } = renderHook(() =>
      useResearchChat({ runtimeSettings: getDefaultRuntimeSettings(), modelId: "mock-research", provider: "mock" }),
    );

    act(() => result.current.setInput("hello"));
    await act(async () => {
      await result.current.sendMessage();
    });

    act(() => result.current.clear());
    expect(result.current.messages.length).toBe(0);
  });
});
