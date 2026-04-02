import Link from "next/link";
import type { ReactNode } from "react";
import { Dot, LogOut, Mail, UserRound } from "lucide-react";

import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SessionIdentity } from "@/lib/session";

import { AppShellNav } from "./app-shell-nav";

type AppShellLayoutProps = {
  children: ReactNode;
  isSupabaseConfigured: boolean;
  sessionIdentity: SessionIdentity | null;
};

export function AppShellLayout({
  children,
  isSupabaseConfigured,
  sessionIdentity,
}: AppShellLayoutProps) {
  const userId = sessionIdentity?.userId ?? null;
  const shortUserId = userId ? userId.slice(0, 8) : "pending";
  const isGoogleSession = sessionIdentity?.authMode === "google";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,247,237,0.96),rgba(254,242,232,0.82),rgba(248,250,252,1))] text-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="rounded-[2rem] border border-white/70 bg-white/75 p-4 shadow-[0_20px_60px_rgba(148,163,184,0.16)] backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <Badge
                variant="outline"
                className="w-fit gap-1.5 border-amber-200 bg-amber-50 text-amber-900"
              >
                {isGoogleSession ? "Google-backed packing planner" : "Anonymous packing planner"}
              </Badge>
              <div className="space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Pack for the next move, not just the departure.
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                  The shell is ready for active trips, reusable templates, and a
                  session model that supports both Google sign-in and the
                  cookie-backed anonymous workspace.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:items-start lg:items-end">
              <AppShellNav />
              <div className="flex flex-wrap items-center gap-2">
                {!isGoogleSession ? (
                  <GoogleSignInButton
                    nextPath="/dashboard"
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-white/80"
                    disabled={!isSupabaseConfigured}
                    label="Continue with Google"
                  />
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full bg-white/80"
                    render={<Link href="/auth/signout?mode=anonymous&next=/dashboard" />}
                  >
                    <LogOut className="size-3.5" />
                    Switch to anonymous
                  </Button>
                )}

                {isGoogleSession ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-950 px-3.5 py-2 text-slate-50 shadow-sm">
                    <div className="flex size-8 items-center justify-center rounded-full bg-white/10">
                      <UserRound className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {sessionIdentity?.label ?? "Google account"}
                      </p>
                      <p className="flex items-center gap-1 truncate text-xs text-slate-300">
                        <Mail className="size-3" />
                        {sessionIdentity?.email ?? "Signed in with Google"}
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-1 text-[11px] font-medium text-emerald-200">
                      <Dot className="size-4" />
                      Google
                    </div>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-950 px-3 py-1.5 text-xs font-medium text-slate-50 shadow-sm">
                    <UserRound className="size-3.5" />
                    Session {shortUserId}
                    <Dot className="size-4 text-emerald-300" />
                    cookie-backed
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
