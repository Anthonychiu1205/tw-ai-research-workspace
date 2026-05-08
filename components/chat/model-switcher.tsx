"use client";

import { getModelOptions } from "@/lib/config/models";
import { Badge } from "@/components/ui/badge";

export function ModelSwitcher({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const models = getModelOptions();
  const selected = models.find((model) => model.id === value) ?? models[0];

  return (
    <div className="flex items-center gap-2">
      <select
        className="h-9 rounded-md border bg-background px-2 text-xs"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        data-testid="model-switcher"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.label}
          </option>
        ))}
      </select>
      {selected && !selected.available ? <Badge>unavailable</Badge> : <Badge>available</Badge>}
    </div>
  );
}
