import Link from "next/link";
import type { ReactNode } from "react";
import { LogOut, Sparkles } from "lucide-react";

import { SessionDebugLogger } from "@/components/auth/session-debug-logger";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/ui/user-avatar";
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
  const isGoogleSession = sessionIdentity?.authMode === "google";
  const profileName =
    sessionIdentity?.firstName ?? sessionIdentity?.fullName ?? sessionIdentity?.label ?? "Traveler";
  const profileFullName =
    sessionIdentity?.fullName ?? sessionIdentity?.label ?? profileName;

  return (
    <div className="packing-stage min-h-screen text-slate-950">
      <div className="pointer-events-none absolute left-[4%] top-12 -z-10 size-44 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.18),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-28 -z-10 size-52 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.16),transparent_70%)] blur-3xl" />
      {process.env.NODE_ENV !== "production" ? <SessionDebugLogger /> : null}
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="packing-panel-soft border-0 px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-3 lg:gap-4">
              <Link
                href="/dashboard"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-sm font-medium text-slate-800 shadow-sm backdrop-blur"
              >
                <Sparkles className="size-4 text-amber-600" />
                Packmap
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2">
              <AppShellNav />

              {sessionIdentity ? (
                <Link
                  href="/profile"
                  className="inline-flex max-w-full items-center gap-2 rounded-full border border-slate-200/80 bg-white/85 px-2.5 py-1.5 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:-translate-y-px hover:bg-white"
                >
                  <UserAvatar
                    avatarUrl={sessionIdentity.avatarUrl}
                    name={profileFullName}
                    size="sm"
                    className="border-slate-200/80"
                  />
                  <span className="max-w-32 truncate whitespace-nowrap">
                    {profileName}
                  </span>
                </Link>
              ) : null}

              <div className="flex flex-wrap items-center gap-2">
                {!isGoogleSession ? (
                  <GoogleSignInButton
                    nextPath="/dashboard"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-slate-200 bg-white/[0.85]"
                    disabled={!isSupabaseConfigured}
                    label="Add Google sign-in"
                  />
                ) : (
                  <>
                    <Button
                      nativeButton={false}
                      variant="outline"
                      size="sm"
                      className="rounded-full border-slate-200 bg-white/[0.85]"
                      render={<a href="/auth/signout?next=/dashboard" />}
                    >
                      <LogOut className="size-3.5" />
                      Log out
                    </Button>

                    <Button
                      nativeButton={false}
                      variant="outline"
                      size="sm"
                      className="rounded-full border-slate-200 bg-white/[0.85]"
                      render={<a href="/auth/signout?mode=anonymous&next=/dashboard" />}
                    >
                      Switch to guest
                    </Button>
                  </>
                )}

                {!isSupabaseConfigured && !isGoogleSession ? (
                  <div className="rounded-full border border-amber-300/70 bg-amber-50/90 px-3 py-1.5 text-xs font-medium text-amber-950">
                    Google sign-in is not configured here yet
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 py-6 sm:py-8">{children}</main>
      </div>
    </div>
  );
}
