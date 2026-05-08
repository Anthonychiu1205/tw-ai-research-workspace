"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MessageComposer({
  value,
  onChange,
  onSubmit,
  onStop,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onStop?: () => void;
  disabled?: boolean;
}) {
  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim() || disabled) {
          return;
        }
        onSubmit();
      }}
    >
      <label className="sr-only" htmlFor="chat-composer-input">
        Research prompt
      </label>
      <Input
        id="chat-composer-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ask synthetic research question"
        disabled={disabled}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            if (value.trim() && !disabled) {
              onSubmit();
            }
          }
        }}
      />
      <Button type="button" variant="ghost" disabled={disabled || value.length === 0} onClick={() => onChange("")}>Clear</Button>
      {disabled ? (
        <Button type="button" variant="outline" onClick={onStop}>
          Stop
        </Button>
      ) : null}
      <Button type="submit" disabled={disabled}>{disabled ? "Streaming..." : "Send"}</Button>
    </form>
  );
}
