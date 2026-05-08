"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function MessageComposer({ onSubmit, disabled }: { onSubmit: (text: string) => void; disabled?: boolean }) {
  const [text, setText] = useState("");

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!text.trim() || disabled) {
          return;
        }
        onSubmit(text.trim());
        setText("");
      }}
    >
      <Input
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Ask synthetic research question"
        disabled={disabled}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            if (text.trim() && !disabled) {
              onSubmit(text.trim());
              setText("");
            }
          }
        }}
      />
      <Button type="button" variant="ghost" disabled={disabled || text.length === 0} onClick={() => setText("")}>Clear</Button>
      <Button type="submit" disabled={disabled}>{disabled ? "Streaming..." : "Send"}</Button>
    </form>
  );
}
