"use client";

import { usePathname } from "next/navigation";

import {
  SUPPORTED_LOCALES,
  localizePath,
  stripLocaleFromPath,
  type Locale,
} from "@/lib/i18n/config";
import { useOptionalI18n } from "@/components/i18n/i18n-provider";

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  es: "ES",
  ca: "CA",
  ru: "RU",
};

export function LanguageSwitcher() {
  const pathname = usePathname();
  const i18n = useOptionalI18n();

  if (!i18n) {
    return null;
  }

  const { locale, t } = i18n;
  const basePath = stripLocaleFromPath(pathname);

  return (
    <label className="inline-flex items-center">
      <span className="sr-only">{t("Language")}</span>
      <select
        aria-label={t("Language")}
        className="rounded-full border border-slate-200/80 bg-white/85 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur outline-none transition hover:bg-white focus:border-slate-400"
        value={locale}
        onChange={(event) => {
          window.location.assign(localizePath(event.target.value as Locale, basePath));
        }}
      >
        {SUPPORTED_LOCALES.map((nextLocale) => (
          <option key={nextLocale} value={nextLocale}>
            {LOCALE_LABELS[nextLocale]}
          </option>
        ))}
      </select>
    </label>
  );
}
