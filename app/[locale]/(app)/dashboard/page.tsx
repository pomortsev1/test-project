import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { normalizeLocale } from "@/lib/i18n/config";
import { getDashboardData } from "@/lib/data/dashboard";
import { getServerI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function LocalizedDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!normalizeLocale(locale)) {
    redirect("/");
  }

  const { t, localizePath } = await getServerI18n(locale);
  const data = await getDashboardData();
  return <DashboardShell data={data} translate={t} localizePath={localizePath} />;
}
