"use client";

import { Input } from "@/components/ui/input";

export function CommandMenu() {
  return (
    <div className="rounded-md border border-border p-2">
      <Input placeholder="Quick command (local mock workspace)" />
    </div>
  );
}
