"use client";

import { useState, useTransition } from "react";
import { LoaderCircle, LogIn } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";
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
  label = "Continue with Google",
  nextPath,
  size = "default",
  variant = "default",
}: GoogleSignInButtonProps) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isDisabled = disabled || isPending;

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
                "Supabase is not configured yet, so Google sign-in is unavailable in this environment."
              );
              return;
            }

            const redirectTo = new URL("/", window.location.origin);
            redirectTo.searchParams.set("next", nextPath);

            const { data, error: signInError } = await supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                skipBrowserRedirect: true,
                redirectTo: redirectTo.toString(),
              },
            });

            if (signInError) {
              setError(signInError.message);
              return;
            }

            if (typeof data.url === "string" && data.url.length > 0) {
              window.location.assign(data.url);
            } else {
              setError("Google sign-in could not start because no redirect URL was returned.");
            }
          });
        }}
      >
        {isPending ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <LogIn className="size-4" />
        )}
        {label}
      </Button>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
