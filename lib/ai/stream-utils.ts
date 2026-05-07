export function toSseChunks(parts: string[]) {
  return new ReadableStream({
    start(controller) {
      for (const part of parts) {
        controller.enqueue(`data: ${JSON.stringify({ type: "text", content: part })}\n\n`);
      }
      controller.enqueue(`data: ${JSON.stringify({ type: "done" })}\n\n`);
      controller.close();
    },
  });
}
