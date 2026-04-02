import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppShellLayout } from "@/components/app-shell/app-shell-layout";
import { normalizeLocale } from "@/lib/i18n/config";
import { getServerI18n } from "@/lib/i18n/server";
import { getCurrentSessionIdentity, getLocalizedPathname } from "@/lib/session";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function LocalizedAppLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = normalizeLocale(localeParam);

  if (!locale) {
    redirect("/");
  }

  const { t } = await getServerI18n(locale);
  const sessionIdentity = await getCurrentSessionIdentity();
  const isSupabaseConfigured = getSupabaseEnv().isConfigured;

  return (
    <AppShellLayout
      addGoogleLabel={t("Add Google sign-in")}
      appNameLabel={t("Packmap")}
      sessionIdentity={sessionIdentity}
      isSupabaseConfigured={isSupabaseConfigured}
      dashboardHref={getLocalizedPathname("/dashboard", locale)}
      googleNotConfiguredLabel={t("Google sign-in is not configured here yet")}
      logOutLabel={t("Log out")}
      profileHref={getLocalizedPathname("/profile", locale)}
      switchToGuestLabel={t("Switch to guest")}
      travelerFallbackLabel={t("Traveler")}
    >
      {children}
    </AppShellLayout>
  );
}
