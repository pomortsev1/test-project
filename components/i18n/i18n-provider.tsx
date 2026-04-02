"use client";

import { createContext, useContext } from "react";

import type { Locale } from "@/lib/i18n/config";
import { createI18n } from "@/lib/i18n/shared";

type I18nContextValue = ReturnType<typeof createI18n>;

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  return <I18nContext.Provider value={createI18n(locale)}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);

  if (!value) {
    throw new Error("useI18n must be used inside I18nProvider.");
  }

  return value;
}

export function useOptionalI18n() {
  return useContext(I18nContext);
}
