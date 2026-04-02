import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <main className="packing-stage min-h-screen px-4 py-8 text-slate-950 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.28),transparent_55%)]" />
      <div className="pointer-events-none absolute right-[8%] top-28 -z-10 size-56 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.18),transparent_68%)] blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col justify-center gap-5">
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_360px] lg:items-center">
          <Card className="packing-panel border-0 bg-[linear-gradient(155deg,rgba(255,255,255,0.88),rgba(255,248,238,0.78),rgba(240,249,255,0.74))]">
            <CardHeader className="gap-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className="gap-1.5 border-emerald-200 bg-emerald-50/90 text-emerald-950"
                >
                  <Sparkles className="size-3.5" />
                  Packmap
                </Badge>
                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  Default template included
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl font-heading text-5xl leading-none text-balance sm:text-6xl">
                  Pack for the trip ahead.
                </h1>
                <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Open the starter list, make a few changes, and turn it into a
                  live checklist when the trip starts.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm leading-6 text-slate-600">
                Start with the included default template instead of a blank
                screen.
              </p>
            </CardContent>
          </Card>

          <Card className="packing-panel border-0">
            <CardHeader className="gap-3">
              <CardTitle className="text-2xl">Start packing</CardTitle>
              <CardDescription className="leading-6">
                Choose a workspace. The default template is already waiting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {authErrorValue ? (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm leading-6 text-destructive">
                  {decodeURIComponent(authErrorValue)}
                </div>
              ) : null}

              <Button
                nativeButton={false}
                className="h-12 w-full rounded-2xl bg-slate-950 text-white shadow-[0_16px_30px_rgba(15,23,42,0.18)] hover:bg-slate-800"
                render={<a href={getBootstrapPath(nextPath)} />}
              >
                Continue anonymously
                <ArrowRight className="size-4" />
              </Button>

              <GoogleSignInButton
                nextPath={nextPath}
                variant="outline"
                className="h-12 w-full rounded-2xl border-slate-300 bg-white/88"
                disabled={!isSupabaseConfigured}
                label="Continue with Google"
              />

              <p className="text-sm leading-6 text-slate-600">
                {isSupabaseConfigured
                  ? "Start on this browser now and add Google later without losing the same workspace."
                  : "Google sign-in is not configured here yet, so start on this browser."}
              </p>

              {!isSupabaseConfigured ? (
                <div className="rounded-2xl border border-amber-300/60 bg-amber-50/[0.85] px-4 py-3 text-sm leading-6 text-amber-950">
                  Google sign-in is not ready in this environment yet.
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
