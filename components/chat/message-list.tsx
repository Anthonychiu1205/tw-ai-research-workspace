import { ScrollArea } from "@/components/ui/scroll-area";
import { StreamingMarkdown } from "@/components/chat/streaming-markdown";
import { MessageStatusBadge } from "@/components/chat/message-status-badge";
import { TokenUsagePill } from "@/components/chat/token-usage-pill";
import { ToolCallTimeline } from "@/components/chat/tool-call-timeline";
import type { WorkspaceChatMessage } from "@/lib/ai/message-types";

export function MessageList({
  messages,
  onOpenArtifact,
}: {
  messages: WorkspaceChatMessage[];
  onOpenArtifact?: (artifactId: string) => void;
}) {
  return (
    <ScrollArea className="h-[460px] space-y-2 rounded-md border p-3" data-testid="message-list">
      <div className="space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.role === "user" ? "ml-8 rounded-md bg-muted p-2" : "mr-8 rounded-md border p-2"}
          >
            <div className="mb-1 flex items-center gap-2 text-[10px] uppercase text-muted-foreground">
              <span>{message.role}</span>
              <MessageStatusBadge status={message.status} />
              {message.metadata?.provider ? <span>{message.metadata.provider}</span> : null}
              {message.metadata?.model ? <span>{message.metadata.model}</span> : null}
              {message.metadata?.fallbackUsed ? <span>fallback</span> : null}
              <TokenUsagePill usage={message.metadata?.tokenUsage} />
            </div>
            <StreamingMarkdown content={message.content} />
            {message.toolCalls?.length ? (
              <div className="mt-2">
                <ToolCallTimeline calls={message.toolCalls} onOpenArtifact={onOpenArtifact} />
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
