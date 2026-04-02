import { redirect } from "next/navigation";

import { getRequestLocale } from "@/lib/i18n/server";
import { localizePath } from "@/lib/i18n/config";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    authError?: string | string[];
    code?: string | string[];
    error?: string | string[];
    error_description?: string | string[];
    next?: string | string[];
  }>;
}) {
  const locale = await getRequestLocale();
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, rawValue] of Object.entries(params)) {
    if (Array.isArray(rawValue)) {
      for (const value of rawValue) {
        query.append(key, value);
      }
      continue;
    }

    if (typeof rawValue === "string") {
      query.set(key, rawValue);
    }
  }

  const destination = localizePath(locale, "/");
  redirect(query.size > 0 ? `${destination}?${query.toString()}` : destination);
}
