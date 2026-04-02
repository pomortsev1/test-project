import type { ReactNode } from "react";

import { AppShellLayout } from "@/components/app-shell/app-shell-layout";
import { getCurrentSessionIdentity } from "@/lib/session";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

type AppLayoutProps = {
  children: ReactNode;
};

export default async function AppLayout({ children }: AppLayoutProps) {
  const sessionIdentity = await getCurrentSessionIdentity();
  const isSupabaseConfigured = getSupabaseEnv().isConfigured;

  return (
    <AppShellLayout
      sessionIdentity={sessionIdentity}
      isSupabaseConfigured={isSupabaseConfigured}
    >
      {children}
    </AppShellLayout>
  );
}
