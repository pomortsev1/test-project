"use client";

import { Suspense, useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { PACKING_APP_AUTH_NEXT_COOKIE } from "@/lib/domain/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function readCookie(name: string) {
  const prefix = `${name}=`;
  const match = document.cookie
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(prefix));

  return match ? decodeURIComponent(match.slice(prefix.length)) : null;
}

function getCookieNames() {
  return document.cookie
    .split(";")
    .map((cookie) => cookie.trim().split("=")[0])
    .filter(Boolean);
}

function AuthCallbackContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    let cancelled = false;

    async function completeGoogleAuth() {
      const authCode = searchParams.get("code");
      const providerError =
        searchParams.get("error_description") ?? searchParams.get("error");
      const nextPath =
        readCookie(PACKING_APP_AUTH_NEXT_COOKIE) ??
        searchParams.get("next") ??
        "/dashboard";

      console.info("[google-auth] callback page loaded", {
        authCodePresent: Boolean(authCode),
        nextPath,
        providerError,
        url: window.location.href,
      });

      if (providerError) {
        window.location.replace(
          `/?next=${encodeURIComponent(nextPath)}&authError=${encodeURIComponent(
            providerError
          )}`
        );
        return;
      }

      if (!authCode) {
        window.location.replace(
          `/?next=${encodeURIComponent(
            nextPath
          )}&authError=${encodeURIComponent(
            "Google sign-in returned without an authorization code."
          )}`
        );
        return;
      }

      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        window.location.replace(
          `/?next=${encodeURIComponent(
            nextPath
          )}&authError=${encodeURIComponent(
            "Supabase is not configured yet, so Google sign-in cannot complete."
          )}`
        );
        return;
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        console.info("[google-auth] auth state changed", {
          event,
          hasSession: Boolean(session),
        });

        if (cancelled || !session) {
          return;
        }

        const finalizeUrl = new URL("/auth/finalize", window.location.origin);
        finalizeUrl.searchParams.set("next", nextPath);
        window.setTimeout(() => {
          if (cancelled) {
            return;
          }

          console.info("[google-auth] callback redirecting to finalize", {
            cookieNames: getCookieNames(),
            nextPath,
          });
          window.location.replace(finalizeUrl.toString());
        }, 200);
      });

      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error("[google-auth] browser exchange failed", {
          message: error.message,
        });
        subscription.unsubscribe();
        window.location.replace(
          `/?next=${encodeURIComponent(nextPath)}&authError=${encodeURIComponent(
            error.message
          )}`
        );
        return;
      }

      if (cancelled) {
        subscription.unsubscribe();
        return;
      }

      if (session) {
        console.info("[google-auth] browser session ready", {
          cookieNames: getCookieNames(),
          nextPath,
        });
        const finalizeUrl = new URL("/auth/finalize", window.location.origin);
        finalizeUrl.searchParams.set("next", nextPath);
        window.setTimeout(() => {
          if (cancelled) {
            subscription.unsubscribe();
            return;
          }

          console.info("[google-auth] callback redirecting to finalize", {
            cookieNames: getCookieNames(),
            nextPath,
          });
          subscription.unsubscribe();
          window.location.replace(finalizeUrl.toString());
        }, 200);
        return;
      }

      window.setTimeout(() => {
        if (cancelled) {
          subscription.unsubscribe();
          return;
        }

        console.error("[google-auth] callback finished without session", {
          nextPath,
        });
        subscription.unsubscribe();
        window.location.replace(
          `/?next=${encodeURIComponent(nextPath)}&authError=${encodeURIComponent(
            "Google sign-in completed, but no session was created."
          )}`
        );
      }, 1500);
    }

    void completeGoogleAuth();

    return () => {
      cancelled = true;
    };
  }, [searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,247,237,0.96),rgba(255,255,255,0.94),rgba(226,232,240,0.86))] px-4 text-slate-950">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-950 text-slate-50">
          <LoaderCircle className="size-5 animate-spin" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Wrapping up Google sign-in
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Finishing Google sign-in...
        </p>
        <div className="mt-6">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              window.location.assign("/");
            }}
          >
            Back to home
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,247,237,0.96),rgba(255,255,255,0.94),rgba(226,232,240,0.86))] px-4 text-slate-950">
          <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-950 text-slate-50">
              <LoaderCircle className="size-5 animate-spin" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">
              Wrapping up Google sign-in
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Loading callback details...
            </p>
          </div>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
