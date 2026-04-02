"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/templates", label: "Templates" },
  { href: "/trips", label: "Trips" },
];

export function AppShellNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition",
              isActive
                ? "border-amber-300 bg-amber-100 text-amber-950 shadow-sm"
                : "border-white/50 bg-white/70 text-slate-700 hover:border-slate-300 hover:bg-white"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
