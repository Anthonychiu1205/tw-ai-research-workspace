"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { enUSDictionary } from "@/lib/i18n/dictionaries/en-us";
import { zhTWDictionary } from "@/lib/i18n/dictionaries/zh-tw";
import { DEFAULT_LOCALE, FALLBACK_LOCALE, getSavedLocale, saveLocale } from "@/lib/i18n/i18n-store";
import type { Dictionary, Locale } from "@/lib/i18n/types";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string) => string;
  dictionary: Dictionary;
};

function getByPath(target: unknown, path: string): unknown {
  if (!path.includes(".")) {
    return undefined;
  }
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, target);
}

function resolveDictionary(locale: Locale): Dictionary {
  return locale === "zh-TW" ? zhTWDictionary : enUSDictionary;
}

function fallbackTranslate(path: string) {
  const localized = getByPath(zhTWDictionary, path);
  if (typeof localized === "string") {
    return localized;
  }
  const fallback = getByPath(enUSDictionary, path);
  if (typeof fallback === "string") {
    return fallback;
  }
  return path;
}

export const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => undefined,
  t: (path: string) => fallbackTranslate(path),
  dictionary: zhTWDictionary,
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    setLocaleState(getSavedLocale());
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    saveLocale(next);
  }, []);

  const dictionary = useMemo(() => resolveDictionary(locale), [locale]);
  const fallbackDictionary = useMemo(() => resolveDictionary(FALLBACK_LOCALE), []);

  const t = useCallback(
    (path: string) => {
      const localized = getByPath(dictionary, path);
      if (typeof localized === "string") {
        return localized;
      }

      const fallback = getByPath(fallbackDictionary, path);
      if (typeof fallback === "string") {
        return fallback;
      }

      return path;
    },
    [dictionary, fallbackDictionary],
  );

  const value = useMemo(() => ({ locale, setLocale, t, dictionary }), [dictionary, locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
