import type { Metadata } from "next";

import { DashboardShell } from "@/components/app-shell/dashboard-shell";
import { getDashboardData } from "@/lib/data/dashboard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const data = await getDashboardData();

  return <DashboardShell data={data} />;
}
