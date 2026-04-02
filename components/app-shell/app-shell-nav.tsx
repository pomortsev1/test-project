"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/templates", label: "Templates" },
  { href: "/trips", label: "Trips" },
];

export function AppShellNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-2 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-sm backdrop-blur">
      {NAV_ITEMS.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex items-center rounded-full px-3.5 py-1.5 text-sm font-medium transition",
              isActive
                ? "bg-slate-950 text-white shadow-sm"
                : "text-slate-700 hover:bg-white/[0.85] hover:text-slate-950"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
