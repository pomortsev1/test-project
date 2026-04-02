export const SUPPORTED_LOCALES = ["en", "es", "ca", "ru"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "packmap-locale";

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return SUPPORTED_LOCALES.includes(value as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) {
    return null;
  }

  const normalized = value.toLowerCase();

  if (isSupportedLocale(normalized)) {
    return normalized;
  }

  if (normalized.startsWith("es")) {
    return "es";
  }

  if (normalized.startsWith("ca")) {
    return "ca";
  }

  if (normalized.startsWith("ru")) {
    return "ru";
  }

  if (normalized.startsWith("en")) {
    return "en";
  }

  return null;
}

export function getPreferredLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) {
    return DEFAULT_LOCALE;
  }

  const values = acceptLanguage
    .split(",")
    .map((part) => part.trim().split(";")[0]?.trim())
    .filter(Boolean);

  for (const value of values) {
    const locale = normalizeLocale(value);

    if (locale) {
      return locale;
    }
  }

  return DEFAULT_LOCALE;
}

export function getPathLocale(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0] ?? null;
  return normalizeLocale(segment);
}

export function stripLocaleFromPath(pathname: string) {
  const locale = getPathLocale(pathname);

  if (!locale) {
    return pathname || "/";
  }

  const segments = pathname.split("/").filter(Boolean).slice(1);
  return segments.length > 0 ? `/${segments.join("/")}` : "/";
}

export function localizePath(locale: Locale, pathname: string) {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const strippedPath = stripLocaleFromPath(normalizedPath);

  if (strippedPath === "/") {
    return `/${locale}`;
  }

  return `/${locale}${strippedPath}`;
}
