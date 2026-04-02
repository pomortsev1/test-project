"use client";

import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type GoogleAuthCompleteProps = {
  authCode: string | null;
  error: string | null;
  errorDescription: string | null;
  nextPath: string;
};

export function GoogleAuthComplete({
  authCode,
  error,
  errorDescription,
  nextPath,
}: GoogleAuthCompleteProps) {
  const [message, setMessage] = useState("Finishing Google sign-in...");

  useEffect(() => {
    let cancelled = false;

    async function completeAuth() {
      if (error || errorDescription) {
        if (!cancelled) {
          setMessage(errorDescription ?? error ?? "Google sign-in failed.");
        }
        return;
      }

      if (!authCode) {
        if (!cancelled) {
          setMessage("Google sign-in returned without an authorization code.");
        }
        return;
      }

      const supabase = createSupabaseBrowserClient();

      if (!supabase) {
        if (!cancelled) {
          setMessage("Supabase is not configured, so Google sign-in cannot complete.");
        }
        return;
      }

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);

      if (exchangeError) {
        if (!cancelled) {
          setMessage(exchangeError.message);
        }
        return;
      }

      const finalizeUrl = new URL("/auth/finalize", window.location.origin);
      finalizeUrl.searchParams.set("next", nextPath);
      window.location.replace(finalizeUrl.toString());
    }

    void completeAuth();

    return () => {
      cancelled = true;
    };
  }, [authCode, error, errorDescription, nextPath]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,247,237,0.96),rgba(255,255,255,0.94),rgba(226,232,240,0.86))] px-4 text-slate-950">
      <div className="w-full max-w-md rounded-[2rem] border border-white/70 bg-white/85 p-8 text-center shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-slate-950 text-slate-50">
          <LoaderCircle className="size-5 animate-spin" />
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Wrapping up Google sign-in
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p>
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
