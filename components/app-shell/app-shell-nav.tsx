"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useOptionalI18n } from "@/components/i18n/i18n-provider";
import { cn } from "@/lib/utils";

export function AppShellNav() {
  const pathname = usePathname();
  const i18n = useOptionalI18n();
  const localizeHref = (value: string) => i18n?.localizePath(value) ?? value;
  const translate = (value: string) => i18n?.t(value) ?? value;
  const navItems = [
    { href: localizeHref("/dashboard"), label: translate("Home") },
    { href: localizeHref("/templates"), label: translate("Templates") },
    { href: localizeHref("/trips"), label: translate("Trips") },
  ];
  const dashboardHref = localizeHref("/dashboard");

  return (
    <nav className="flex flex-wrap gap-2 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-sm backdrop-blur">
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== dashboardHref && pathname.startsWith(`${item.href}/`));

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
