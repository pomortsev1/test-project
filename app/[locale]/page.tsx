import { redirect } from "next/navigation";

import { HomeLanding } from "@/components/home/home-landing";
import { normalizeLocale } from "@/lib/i18n/config";
import {
  getCurrentSessionIdentity,
  getSafeNextPath,
  getLocalizedPathname,
} from "@/lib/session";
import { getSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function LocalizedHomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    authError?: string | string[];
    code?: string | string[];
    error?: string | string[];
    error_description?: string | string[];
    next?: string | string[];
  }>;
}) {
  const [{ locale: localeParam }, identity, paramsValue] = await Promise.all([
    params,
    getCurrentSessionIdentity(),
    searchParams,
  ]);
  const locale = normalizeLocale(localeParam);

  if (!locale) {
    redirect("/");
  }

  const authCodeValue = Array.isArray(paramsValue.code) ? paramsValue.code[0] : paramsValue.code;
  const providerErrorValue = Array.isArray(paramsValue.error)
    ? paramsValue.error[0]
    : paramsValue.error;
  const providerErrorDescriptionValue = Array.isArray(paramsValue.error_description)
    ? paramsValue.error_description[0]
    : paramsValue.error_description;
  const authErrorValue = Array.isArray(paramsValue.authError)
    ? paramsValue.authError[0]
    : paramsValue.authError ?? null;
  const nextValue = Array.isArray(paramsValue.next) ? paramsValue.next[0] : paramsValue.next;
  const nextPath = getLocalizedPathname(getSafeNextPath(nextValue, "/trips"), locale);

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

  return (
    <HomeLanding
      authErrorValue={authErrorValue}
      isSupabaseConfigured={getSupabaseEnv().isConfigured}
      nextPath={nextPath}
    />
  );
}
