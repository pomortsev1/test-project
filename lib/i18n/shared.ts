import { DEFAULT_LOCALE, type Locale, localizePath } from "@/lib/i18n/config";
import { MESSAGES, type MessageKey } from "@/lib/i18n/messages";

type InterpolationValues = Record<string, string | number>;

function interpolate(template: string, values?: InterpolationValues) {
  if (!values) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in values ? String(values[key]) : `{${key}}`,
  );
}

export function translate(
  locale: Locale,
  key: MessageKey | string,
  values?: InterpolationValues,
) {
  const dictionary = MESSAGES[locale] ?? MESSAGES[DEFAULT_LOCALE];
  const fallbackDictionary = MESSAGES[DEFAULT_LOCALE];
  const template =
    dictionary[key as MessageKey] ??
    fallbackDictionary[key as MessageKey] ??
    key;

  return interpolate(template, values);
}

export function formatLocalizedDate(locale: Locale, value: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function createI18n(locale: Locale) {
  return {
    locale,
    t: (key: MessageKey | string, values?: InterpolationValues) =>
      translate(locale, key, values),
    localizePath: (pathname: string) => localizePath(locale, pathname),
    formatDate: (value: string) => formatLocalizedDate(locale, value),
  };
}
