import { notFound } from "next/navigation";

import { I18nProvider } from "@/components/i18n/i18n-provider";
import { normalizeLocale } from "@/lib/i18n/config";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);

  if (!locale) {
    notFound();
  }

  return <I18nProvider locale={locale}>{children}</I18nProvider>;
}
