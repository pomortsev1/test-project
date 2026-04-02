"use client";

import { useState, useTransition } from "react";
import { LogIn } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { useOptionalI18n } from "@/components/i18n/i18n-provider";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  LEGACY_PACKING_APP_AUTH_NEXT_COOKIE,
  PACKMAP_AUTH_NEXT_COOKIE,
} from "@/lib/domain/constants";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type GoogleSignInButtonProps = {
  className?: string;
  disabled?: boolean;
  label?: string;
  nextPath: string;
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
};

export function GoogleSignInButton({
  className,
  disabled = false,
  label,
  nextPath,
  size = "default",
  variant = "default",
}: GoogleSignInButtonProps) {
  const i18n = useOptionalI18n();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isDisabled = disabled || isPending;
  const resolvedLabel = label ?? i18n?.t("Continue with Google") ?? "Continue with Google";

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant={variant}
        size={size}
        disabled={isDisabled}
        className={className}
        onClick={() => {
          setError(null);

          startTransition(async () => {
            const supabase = createSupabaseBrowserClient();

            if (!supabase) {
              setError(
                i18n?.t(
                  "Supabase is not configured yet, so Google sign-in is unavailable in this environment.",
                ) ??
                  "Supabase is not configured yet, so Google sign-in is unavailable in this environment."
              );
              return;
            }

            const redirectTo = new URL("/auth/callback", window.location.origin);
            document.cookie = `${PACKMAP_AUTH_NEXT_COOKIE}=${encodeURIComponent(
              nextPath
            )}; Path=/; SameSite=Lax; Max-Age=600`;
            document.cookie = `${LEGACY_PACKING_APP_AUTH_NEXT_COOKIE}=; Path=/; SameSite=Lax; Max-Age=0`;
            const cookieNames = document.cookie
              .split(";")
              .map((cookie) => cookie.trim().split("=")[0])
              .filter(Boolean);
            console.info("[google-auth] starting oauth", {
              cookieNames,
              nextPath,
              origin: window.location.origin,
              redirectTo: redirectTo.toString(),
            });

            const { data, error: signInError } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: redirectTo.toString(),
              },
            });

            if (signInError) {
              console.error("[google-auth] signInWithOAuth failed", {
                message: signInError.message,
              });
              setError(signInError.message);
              return;
            }

            if (data.url == null) {
              console.error("[google-auth] signInWithOAuth returned no url");
              setError(
                i18n?.t("Google sign-in could not start because no redirect URL was returned.") ??
                  "Google sign-in could not start because no redirect URL was returned.",
              );
              return;
            }

            console.info("[google-auth] oauth redirect prepared", {
              url: data.url,
            });
          });
        }}
      >
        <LogIn className="size-4" />
        {resolvedLabel}
      </Button>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
