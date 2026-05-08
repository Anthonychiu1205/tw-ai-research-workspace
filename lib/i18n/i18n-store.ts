import type { Locale } from "@/lib/i18n/types";

export const DEFAULT_LOCALE: Locale = "zh-TW";
export const FALLBACK_LOCALE: Locale = "en-US";
const STORAGE_KEY = "tw-ai-research-workspace.locale";

function isLocale(input: string): input is Locale {
  return input === "zh-TW" || input === "en-US";
}

export function getSavedLocale(): Locale {
  if (typeof window === "undefined") {
    return DEFAULT_LOCALE;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && isLocale(saved)) {
      return saved;
    }
  } catch {
    // localStorage may be blocked
  }

  return DEFAULT_LOCALE;
}

export function saveLocale(locale: Locale) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // localStorage may be blocked
  }
}
