import { Button } from "@/components/ui/button";

export function RetryMessageButton({ onRetry, disabled }: { onRetry: () => void; disabled?: boolean }) {
  return (
    <Button type="button" size="sm" variant="outline" onClick={onRetry} disabled={disabled} aria-label="Retry last message">
      Retry
    </Button>
  );
}
