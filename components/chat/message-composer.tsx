"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/use-i18n";

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
  const { t } = useI18n();

  return (
    <form
      className="flex flex-wrap items-center gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim() || disabled) {
          return;
        }
        onSubmit();
      }}
    >
      <label className="sr-only" htmlFor="chat-composer-input">
        {t("chat.promptLabel")}
      </label>
      <Input
        id="chat-composer-input"
        className="min-w-[240px] flex-1"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={t("chat.promptPlaceholder")}
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
      <Button type="button" variant="ghost" disabled={disabled || value.length === 0} onClick={() => onChange("")}>
        {t("chat.clear")}
      </Button>
      {disabled ? (
        <Button type="button" variant="outline" onClick={onStop}>
          {t("chat.stop")}
        </Button>
      ) : null}
      <Button type="submit" disabled={disabled}>{disabled ? t("chat.streaming") : t("chat.send")}</Button>
    </form>
  );
}
