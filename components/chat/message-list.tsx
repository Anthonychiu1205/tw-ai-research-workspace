import { ScrollArea } from "@/components/ui/scroll-area";
import { StreamingMarkdown } from "@/components/chat/streaming-markdown";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  return (
    <ScrollArea className="h-[460px] space-y-2 rounded-md border p-3" data-testid="message-list">
      <div className="space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === "user" ? "ml-8 rounded-md bg-muted p-2" : "mr-8 rounded-md border p-2"}
          >
            <div className="mb-1 text-[10px] uppercase text-muted-foreground">{message.role}</div>
            <StreamingMarkdown content={message.content} />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
