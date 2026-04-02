import { redirect } from "next/navigation";

import { HomeLanding } from "@/components/home/home-landing";
import {
  getCurrentSessionIdentity,
  getSafeNextPath,
} from "@/lib/session";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    authError?: string | string[];
    code?: string | string[];
    error?: string | string[];
    error_description?: string | string[];
    next?: string | string[];
  }>;
}) {
  const [identity, params] = await Promise.all([
    getCurrentSessionIdentity(),
    searchParams,
  ]);
  const authCodeValue = Array.isArray(params.code) ? params.code[0] : params.code;
  const providerErrorValue = Array.isArray(params.error) ? params.error[0] : params.error;
  const providerErrorDescriptionValue = Array.isArray(params.error_description)
    ? params.error_description[0]
    : params.error_description;
  const authErrorValue = Array.isArray(params.authError)
    ? params.authError[0]
    : params.authError ?? null;
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = getSafeNextPath(nextValue, "/trips");

  if (authCodeValue || providerErrorValue || providerErrorDescriptionValue) {
    const callbackUrl = new URL("/auth/callback", "http://localhost");
    callbackUrl.searchParams.set("next", nextPath);

    if (authCodeValue) {
      callbackUrl.searchParams.set("code", authCodeValue);
    }

    if (providerErrorValue) {
      callbackUrl.searchParams.set("error", providerErrorValue);
    }

    if (providerErrorDescriptionValue) {
      callbackUrl.searchParams.set("error_description", providerErrorDescriptionValue);
    }

    redirect(callbackUrl.pathname + callbackUrl.search);
  }

  if (identity && !authErrorValue) {
    redirect(nextPath);
  }

  const isSupabaseConfigured = getSupabaseEnv().isConfigured;

  return (
    <HomeLanding
      authErrorValue={authErrorValue}
      isSupabaseConfigured={isSupabaseConfigured}
      nextPath={nextPath}
    />
  );
}
