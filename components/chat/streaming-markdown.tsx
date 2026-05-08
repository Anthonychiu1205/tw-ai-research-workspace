import ReactMarkdown from "react-markdown";

export function StreamingMarkdown({ content }: { content: string }) {
  return (
    <div className="prose prose-invert prose-sm max-w-none" aria-live="polite">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
