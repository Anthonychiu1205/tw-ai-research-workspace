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
      <Input value={text} onChange={(event) => setText(event.target.value)} placeholder="Ask synthetic research question" />
      <Button type="submit" disabled={disabled}>
        Send
      </Button>
    </form>
  );
}
