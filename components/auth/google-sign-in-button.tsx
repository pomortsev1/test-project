"use client";

import { LogIn } from "lucide-react";
import type { VariantProps } from "class-variance-authority";

import { Button, buttonVariants } from "@/components/ui/button";

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
  const authUrl = `/auth/google?next=${encodeURIComponent(nextPath)}`;

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={disabled}
      className={className}
      onClick={() => {
        window.location.assign(authUrl);
      }}
    >
      <LogIn className="size-4" />
      {label}
    </Button>
  );
}
