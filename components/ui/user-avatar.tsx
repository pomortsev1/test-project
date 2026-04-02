import Image from "next/image";

import { cn } from "@/lib/utils";

const SIZE_CLASS_NAMES = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-xl",
  xl: "size-24 text-3xl",
} as const;

const SIZE_PIXELS = {
  sm: 32,
  md: 40,
  lg: 64,
  xl: 96,
} as const;

type UserAvatarProps = {
  avatarUrl?: string | null;
  className?: string;
  name: string;
  size?: keyof typeof SIZE_CLASS_NAMES;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserAvatar({
  avatarUrl,
  className,
  name,
  size = "md",
}: UserAvatarProps) {
  const resolvedName = name.trim() || "User";

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/70 bg-slate-200 text-slate-700 shadow-sm",
        SIZE_CLASS_NAMES[size],
        className,
      )}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={`${resolvedName} avatar`}
          fill
          sizes={`${SIZE_PIXELS[size]}px`}
          className="object-cover"
          unoptimized
        />
      ) : (
        <span className="font-semibold uppercase tracking-[0.14em]">
          {getInitials(resolvedName)}
        </span>
      )}
    </span>
  );
}
