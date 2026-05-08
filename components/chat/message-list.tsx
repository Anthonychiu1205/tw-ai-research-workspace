import { StreamingMarkdown } from "@/components/chat/streaming-markdown";
import { MessageStatusBadge } from "@/components/chat/message-status-badge";
import { TokenUsagePill } from "@/components/chat/token-usage-pill";
import { ToolCallTimeline } from "@/components/chat/tool-call-timeline";
import type { WorkspaceChatMessage } from "@/lib/ai/message-types";
import { StatusBadge } from "@/components/ui/status-badge";

export function MessageList({
  messages,
  onOpenArtifact,
}: {
  messages: WorkspaceChatMessage[];
  onOpenArtifact?: (artifactId: string) => void;
}) {
  return (
    <div className="space-y-2" data-testid="message-list">
      {messages.map((message) => (
        <article
          key={message.id}
          className={
            message.role === "user"
              ? "ml-8 rounded-lg bg-muted/65 px-3 py-2.5"
              : "mr-8 rounded-lg border border-border/65 bg-card/50 px-3 py-2.5"
          }
        >
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[10px] uppercase text-muted-foreground">
            <span>{message.role}</span>
            <MessageStatusBadge status={message.status} />
            {message.metadata?.provider ? <span>{message.metadata.provider}</span> : null}
            {message.metadata?.model ? <span>{message.metadata.model}</span> : null}
            {message.metadata?.fallbackUsed ? <StatusBadge tone="warning">fallback</StatusBadge> : null}
            <TokenUsagePill usage={message.metadata?.tokenUsage} />
          </div>
          <StreamingMarkdown content={message.content} />
          {message.toolCalls?.length ? (
            <div className="mt-2">
              <ToolCallTimeline calls={message.toolCalls} onOpenArtifact={onOpenArtifact} />
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
