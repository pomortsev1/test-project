import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getBootstrapPath,
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
    : params.authError;
  const nextValue = Array.isArray(params.next) ? params.next[0] : params.next;
  const nextPath = getSafeNextPath(nextValue, "/dashboard");

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
    redirect("/dashboard");
  }
  const isSupabaseConfigured = getSupabaseEnv().isConfigured;

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,247,237,0.96),rgba(255,255,255,0.94),rgba(226,232,240,0.86))] px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-6">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_380px]">
          <Card className="border border-white/70 bg-white/80 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
            <CardHeader className="gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="gap-1.5 border-emerald-200 bg-emerald-50 text-emerald-900"
                >
                  <ShieldCheck className="size-3.5" />
                  Google or anonymous
                </Badge>
                <Badge variant="outline" className="border-slate-200 bg-white">
                  Same packing product
                </Badge>
              </div>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                  Plan trips with a Google account or stay in a browser-only
                  anonymous workspace.
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
                  Templates, saved trips, and active-leg checklists work in both
                  modes. Anonymous data stays tied to this browser cookie, while
                  Google-backed data follows your authenticated Supabase profile.
                </p>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-slate-200/80 bg-slate-50/90 p-5">
                <p className="text-sm font-medium text-slate-950">Anonymous mode</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Fastest way in. Your workspace stays on this device with the
                  `packing_app_user_id` cookie.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-amber-200/80 bg-amber-50/80 p-5">
                <p className="text-sm font-medium text-slate-950">Google mode</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Use the same product with a Google sign-in and a Supabase auth
                  session instead of the anonymous cookie fallback.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card/92 shadow-sm">
            <CardHeader className="gap-3">
              <CardTitle>Choose how to continue</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {authErrorValue ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {decodeURIComponent(authErrorValue)}
                </div>
              ) : null}

              <Button
                nativeButton={false}
                className="h-11 w-full rounded-xl"
                render={<Link href={getBootstrapPath(nextPath)} />}
              >
                Continue anonymously
                <ArrowRight className="size-4" />
              </Button>

              <GoogleSignInButton
                nextPath={nextPath}
                className="h-11 w-full rounded-xl"
                disabled={!isSupabaseConfigured}
              />

              <div className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm leading-6 text-muted-foreground">
                If you begin anonymously and later sign in with Google, the app
                merges that anonymous workspace into your authenticated profile.
                Afterward, signing out starts a fresh anonymous workspace.
              </div>

              {!isSupabaseConfigured ? (
                <div className="rounded-2xl border border-amber-300/60 bg-amber-50/85 px-4 py-3 text-sm leading-6 text-amber-950">
                  Google sign-in is unavailable until Supabase environment
                  variables are configured for the app.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
