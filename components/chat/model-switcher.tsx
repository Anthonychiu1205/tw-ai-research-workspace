"use client";

import { getModelOptions } from "@/lib/config/models";

export function ModelSwitcher({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const models = getModelOptions();

  return (
    <select
      className="h-9 rounded-md border bg-background px-2 text-xs"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {models.map((model) => (
        <option key={model.id} value={model.id} disabled={!model.available}>
          {model.label} {model.available ? "" : `(unavailable: ${model.reasonUnavailable})`}
        </option>
      ))}
    </select>
  );
}
