import { cookies, headers } from "next/headers";

import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  getPreferredLocale,
  normalizeLocale,
  type Locale,
} from "@/lib/i18n/config";
import { createI18n } from "@/lib/i18n/shared";

export async function getRequestLocale() {
  const cookieStore = await cookies();
  const cookieLocale = normalizeLocale(cookieStore.get(LOCALE_COOKIE_NAME)?.value);

  if (cookieLocale) {
    return cookieLocale;
  }

  const headerStore = await headers();
  return getPreferredLocale(headerStore.get("accept-language"));
}

export async function getServerI18n(locale?: string | null) {
  const resolvedLocale =
    normalizeLocale(locale ?? null) ?? (await getRequestLocale()) ?? DEFAULT_LOCALE;

  return createI18n(resolvedLocale as Locale);
}
